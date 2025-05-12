const WebSocket = require("ws");
const jwt = require("jsonwebtoken");
const Driver = require("../models/Driver");
const User = require("../models/User");
const Booking = require("../models/Booking");
const Bid = require("../models/Bid");
const mongoose = require("mongoose");
const url = require("url");
const logger = require("../utils/logger");
const { v4: uuidv4 } = require("uuid");

// Store active connections
const clients = new Map();

// Map to store subscription channels
const channels = new Map();

// WebSocket server instance
let wss = null;

// Initialize WebSocket server
const initializeWebSocket = (server) => {
  if (wss !== null) {
    logger.info("WebSocket server already initialized");
    return wss;
  }

  logger.info("Initializing WebSocket server...");

  // Create WebSocket server
  wss = new WebSocket.Server({
    server,
    // Allow connections from any origin
    verifyClient: (info, cb) => {
      // Parse URL to get token
      const url = new URL(info.req.url, "http://localhost:5000");
      const token = url.searchParams.get("token");
      const role = url.searchParams.get("role");

      // If no token, allow as public user with limited access
      if (!token) {
        logger.info("Public WebSocket connection (no token)");
        info.req.userType = "public";
        info.req.authenticated = false;
        return cb(true);
      }

      // Verify the token if provided
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        info.req.userId = decoded.userId;
        info.req.driverId = decoded.driverId;
        info.req.adminId = decoded.adminId;
        info.req.userType =
          role ||
          (decoded.userId ? "user" : decoded.driverId ? "driver" : "admin");
        info.req.authenticated = true;
        return cb(true);
      } catch (err) {
        logger.warn("Invalid token in WebSocket connection:", err.message);
        info.req.authenticated = false;
        info.req.userType = "public";
        return cb(true); // Still allow connection but as public
      }
    },
  });

  // Keep track of connected clients and channel subscriptions
  const clients = new Map();
  const channels = new Map();

  // Connection handler
  wss.on("connection", (ws, req) => {
    // Generate client ID
    const id = uuidv4();

    // Extract user info from request
    const userType = req.userType || "public";
    const authenticated = req.authenticated || false;
    const userId = req.userId;
    const driverId = req.driverId;
    const adminId = req.adminId;

    // Store client info
    clients.set(ws, {
      id,
      userType,
      authenticated,
      userId,
      driverId,
      adminId,
      channels: new Set(),
    });

    logger.info(`WebSocket client connected: ${id} (${userType})`);

    // Message handler
    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message);
        logger.debug(`WebSocket message from ${id}:`, data);

        // Handle different message types
        switch (data.type) {
          case "subscribe":
            handleSubscribe(ws, data);
            break;
          case "unsubscribe":
            handleUnsubscribe(ws, data);
            break;
          case "message":
            handleClientMessage(ws, data);
            break;
          default:
            logger.warn(`Unknown message type: ${data.type}`);
            break;
        }
      } catch (error) {
        logger.error("Error processing WebSocket message:", error);
      }
    });

    // Close handler
    ws.on("close", () => {
      logger.info(`WebSocket client disconnected: ${id}`);

      // Get client info
      const client = clients.get(ws);
      if (client) {
        // Unsubscribe from all channels
        for (const channel of client.channels) {
          unsubscribeFromChannel(channel, ws);
        }
        // Remove client from map
        clients.delete(ws);
      }
    });

    // Send welcome message to client
      ws.send(
        JSON.stringify({
        type: "welcome",
        message: "Welcome to Shiftly WebSocket Server",
        authenticated,
        userType,
      })
    );
  });

  logger.info("WebSocket server initialized successfully");
  return wss;
};

// Handle subscribe messages
const handleSubscribe = (ws, data) => {
  const { channel } = data;
  const client = clients.get(ws);

  if (!channel || typeof channel !== "string") {
    return sendError(ws, "Invalid channel format");
  }

  // Public users can only subscribe to booking channels
  if (
    !client.authenticated &&
    !channel.startsWith("booking:") &&
    !channel.startsWith("public:")
  ) {
    return sendError(
      ws,
      "Unauthorized: public users can only subscribe to booking updates"
    );
  }

  // Check if client is already subscribed to this channel
  if (client.channels.has(channel)) {
    return sendSuccess(ws, "already_subscribed", { channel });
  }

  subscribeToChannel(channel, ws);
  sendSuccess(ws, "subscribed", { channel });
};

// Handle unsubscribe messages
const handleUnsubscribe = (ws, data) => {
  const { channel } = data;

  if (!channel || typeof channel !== "string") {
    return sendError(ws, "Invalid channel format");
  }

  unsubscribeFromChannel(channel, ws);
  sendSuccess(ws, "unsubscribed", { channel });
};

// Handle client message sending
const handleClientMessage = (ws, data) => {
  const { channel, message } = data;
  const client = clients.get(ws);

  if (!client.authenticated) {
    return sendError(ws, "Unauthorized: authentication required");
  }

  if (!channel || typeof channel !== "string") {
    return sendError(ws, "Invalid channel format");
  }

  if (!message) {
    return sendError(ws, "Message is required");
  }

  // Check if client is subscribed to the channel
  if (!client.channels.has(channel)) {
    return sendError(ws, "Not subscribed to channel");
  }

  // Add sender info to message
  const enrichedMessage = {
    ...message,
    type: message.type || "message",
    sender: {
      id: client.userId || client.driverId || client.adminId,
      type: client.userType,
    },
    timestamp: new Date(),
  };

  // Broadcast to channel
  broadcastToChannel(channel, enrichedMessage);
};

// Subscribe client to channel
const subscribeToChannel = (channel, ws) => {
  // Get client info
  const client = clients.get(ws);
  if (!client) return;

  // Add channel to client's subscriptions
  client.channels.add(channel);

  // Add client to channel subscribers
  if (!channels.has(channel)) {
    channels.set(channel, new Set());
  }
  channels.get(channel).add(ws);

  logger.info(`Client ${client.id} subscribed to channel ${channel}`);
};

// Unsubscribe client from channel
const unsubscribeFromChannel = (channel, ws) => {
  // Get client info
  const client = clients.get(ws);
  if (!client) return;

  // Remove channel from client's subscriptions
  client.channels.delete(channel);

  // Remove client from channel subscribers
  if (channels.has(channel)) {
    channels.get(channel).delete(ws);
    // Clean up empty channels
    if (channels.get(channel).size === 0) {
      channels.delete(channel);
    }
  }

  logger.info(`Client ${client.id} unsubscribed from channel ${channel}`);
};

// Send error message to client
const sendError = (ws, message) => {
  ws.send(
      JSON.stringify({
        type: "error",
      message,
    })
  );
};

// Send success message to client
const sendSuccess = (ws, type, data) => {
  ws.send(
        JSON.stringify({
      type,
      ...data,
    })
  );
};

// Broadcast message to all clients in a channel
const broadcastToChannel = (channel, message) => {
  if (!channels.has(channel)) return;

  for (const client of channels.get(channel)) {
    client.send(JSON.stringify(message));
  }

  logger.debug(`Broadcast to channel ${channel}: ${message.type}`);
};

// Broadcast to all authenticated clients
const broadcastToAuthenticated = (message) => {
  for (const [ws, client] of clients.entries()) {
    if (client.authenticated) {
      ws.send(JSON.stringify(message));
    }
  }

  logger.debug(`Broadcast to all authenticated clients: ${message.type}`);
};

// Broadcast to all clients
const broadcast = (message) => {
  for (const ws of clients.keys()) {
    ws.send(JSON.stringify(message));
  }

  logger.debug(`Broadcast to all clients: ${message.type}`);
};

// Broadcast booking updates
const broadcastBookingUpdate = (bookingId, type, data) => {
  // Format the message
  const message = {
    type,
    ...data,
    bookingId,
    timestamp: new Date(),
  };

  // Send to booking-specific channel
  broadcastToChannel(`booking:${bookingId}`, message);

  // If user ID is provided, also send to user's channel
  if (data.userId) {
    broadcastToChannel(`user:${data.userId}`, message);
  }

  // If driver ID is provided, also send to driver's channel
  if (data.driverId) {
    broadcastToChannel(`driver:${data.driverId}`, message);
  }

  // Always send to admins
  broadcastToChannel("admins", message);

  logger.info(`Booking update (${type}) broadcast for booking ${bookingId}`);
  return true;
};

// Get WebSocket server instance
const getWebSocketServer = () => {
  return wss;
};

module.exports = {
  initializeWebSocket,
  getWebSocketServer,
  broadcastToChannel,
  broadcastToAuthenticated,
  broadcast,
  broadcastBookingUpdate,
};
