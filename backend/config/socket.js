// Socket.io server configuration
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

// Singleton instance of socketIO
class SocketIO {
  constructor() {
    this.io = null;
  }

  initialize(server) {
    if (this.io) {
      logger.info("Socket.io already initialized");
      return this.io;
    }

    logger.info("Initializing Socket.io server");
    this.io = require("socket.io")(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
      },
      path: "/ws",
    });

    // Set up authentication middleware
    this.io.use((socket, next) => {
      try {
        // Get token from query params, headers, or cookies
        const token =
          socket.handshake.auth.token ||
          socket.handshake.query.token ||
          socket.handshake.headers.authorization?.split(" ")[1];

        // If no token, allow connection but mark as unauthenticated
        if (!token) {
          logger.info("Socket connection without token - limited access");
          socket.auth = false;
          socket.userType = "guest";
          return next();
        }

        // Try to verify as user token
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          socket.auth = true;
          socket.userId = decoded.id;
          socket.userType = "user";
          socket.join(`user:${decoded.id}`);
          logger.info(`Socket authenticated as user: ${decoded.id}`);
          return next();
        } catch (err) {
          // Not a user token, try as driver token
          try {
            const driverDecoded = jwt.verify(
              token,
              process.env.DRIVER_JWT_SECRET
            );
            socket.auth = true;
            socket.driverId = driverDecoded.id;
            socket.userType = "driver";
            socket.join(`driver:${driverDecoded.id}`);
            logger.info(`Socket authenticated as driver: ${driverDecoded.id}`);
            return next();
          } catch (driverErr) {
            // Not a driver token either, try as admin token
            try {
              const adminDecoded = jwt.verify(
                token,
                process.env.ADMIN_JWT_SECRET
              );
              socket.auth = true;
              socket.adminId = adminDecoded.id;
              socket.userType = "admin";
              socket.join("admins");
              logger.info(`Socket authenticated as admin: ${adminDecoded.id}`);
              return next();
            } catch (adminErr) {
              // None of the tokens worked, allow connection but mark as unauthenticated
              logger.warn("Invalid socket token provided");
              socket.auth = false;
              socket.userType = "guest";
              return next();
            }
          }
        }
      } catch (error) {
        logger.error("Socket authentication error:", error);
        socket.auth = false;
        socket.userType = "guest";
        return next();
      }
    });

    // Connection handler
    this.io.on("connection", (socket) => {
      logger.info(`New ${socket.userType} socket connected: ${socket.id}`);

      // Track anonymous connections for public features
      if (socket.userType === "guest") {
        socket.join("guests");
      }

      // Handle subscribing to channels
      socket.on("subscribe", (data) => {
        try {
          const { channel } = data;

          // Validate channel format
          if (!channel || typeof channel !== "string") {
            return socket.emit("error", { message: "Invalid channel format" });
          }

          // Handle different channel types with authorization
          if (channel.startsWith("booking:")) {
            const bookingId = channel.split(":")[1];

            // Allow if authenticated, we'll do proper authorization check in the controller
            if (socket.auth) {
              socket.join(channel);
              logger.info(
                `${socket.userType} ${socket.id} subscribed to ${channel}`
              );
              socket.emit("subscribed", { channel });
            } else {
              // For public tracking, we'll allow but log it
              socket.join(channel);
              logger.warn(
                `Unauthenticated socket ${socket.id} subscribed to ${channel}`
              );
              socket.emit("subscribed", { channel, limited: true });
            }
          }
          // Admin channels require admin authentication
          else if (
            channel.startsWith("admin:") &&
            socket.userType === "admin"
          ) {
            socket.join(channel);
            logger.info(`Admin ${socket.id} subscribed to ${channel}`);
            socket.emit("subscribed", { channel });
          }
          // Driver channels require driver authentication
          else if (
            channel.startsWith("driver:") &&
            socket.userType === "driver"
          ) {
            const channelDriverId = channel.split(":")[1];
            if (socket.driverId === channelDriverId) {
              socket.join(channel);
              logger.info(`Driver ${socket.id} subscribed to ${channel}`);
              socket.emit("subscribed", { channel });
            } else {
              socket.emit("error", {
                message: "Unauthorized subscription attempt",
              });
            }
          }
          // User channels require user authentication
          else if (channel.startsWith("user:") && socket.userType === "user") {
            const channelUserId = channel.split(":")[1];
            if (socket.userId === channelUserId) {
              socket.join(channel);
              logger.info(`User ${socket.id} subscribed to ${channel}`);
              socket.emit("subscribed", { channel });
            } else {
              socket.emit("error", {
                message: "Unauthorized subscription attempt",
              });
            }
          }
          // Public channels are allowed for all
          else if (channel === "public") {
            socket.join(channel);
            logger.info(`Socket ${socket.id} subscribed to public channel`);
            socket.emit("subscribed", { channel });
          } else {
            socket.emit("error", {
              message: "Invalid or unauthorized channel",
            });
          }
        } catch (error) {
          logger.error("Error in subscribe handler:", error);
          socket.emit("error", { message: "Failed to subscribe to channel" });
        }
      });

      // Handle unsubscribing from channels
      socket.on("unsubscribe", (data) => {
        try {
          const { channel } = data;
          socket.leave(channel);
          logger.info(`Socket ${socket.id} unsubscribed from ${channel}`);
          socket.emit("unsubscribed", { channel });
        } catch (error) {
          logger.error("Error in unsubscribe handler:", error);
          socket.emit("error", {
            message: "Failed to unsubscribe from channel",
          });
        }
      });

      // Handle sending messages to channels
      // This is primarily for admin and authenticated users
      socket.on("message", (data) => {
        try {
          const { channel, message } = data;

          // Only allow authenticated users to send messages
          if (!socket.auth) {
            return socket.emit("error", {
              message: "Unauthorized: authentication required",
            });
          }

          // Add sender info to message
          const enrichedMessage = {
            ...message,
            sender: {
              id: socket.userId || socket.driverId || socket.adminId,
              type: socket.userType,
            },
            timestamp: new Date(),
          };

          // Broadcast to channel
          this.io.to(channel).emit("message", enrichedMessage);
          logger.info(`Message sent to ${channel} by ${socket.userType}`);
        } catch (error) {
          logger.error("Error in message handler:", error);
          socket.emit("error", { message: "Failed to send message" });
        }
      });

      // Disconnect handler
      socket.on("disconnect", () => {
        logger.info(`Socket disconnected: ${socket.id}`);
      });
    });

    logger.info("Socket.io server initialized successfully");
    return this.io;
  }

  getIO() {
    if (!this.io) {
      logger.warn("Socket.io not initialized yet");
      return null;
    }
    return this.io;
  }

  // Broadcast to all connected clients
  broadcast(event, data) {
    if (!this.io) {
      logger.warn("Socket.io not initialized yet, cannot broadcast");
      return false;
    }
    this.io.emit(event, data);
    return true;
  }

  // Broadcast to a specific room/channel
  broadcastToChannel(channel, event, data) {
    if (!this.io) {
      logger.warn("Socket.io not initialized yet, cannot broadcast to channel");
      return false;
    }
    this.io.to(channel).emit(event, data);
    return true;
  }

  // Broadcast booking updates
  broadcastBookingUpdate(bookingId, type, data) {
    if (!this.io) {
      logger.warn(
        "Socket.io not initialized yet, cannot broadcast booking update"
      );
      return false;
    }

    // Format the message
    const message = {
      type,
      ...data,
      bookingId,
      timestamp: new Date(),
    };

    // Send to booking-specific channel
    this.io.to(`booking:${bookingId}`).emit("message", message);

    // If user ID is provided, also send to user's channel
    if (data.userId) {
      this.io.to(`user:${data.userId}`).emit("message", message);
    }

    // If driver ID is provided, also send to driver's channel
    if (data.driverId) {
      this.io.to(`driver:${data.driverId}`).emit("message", message);
    }

    // Always send to admins
    this.io.to("admins").emit("message", message);

    logger.info(`Booking update (${type}) broadcast for booking ${bookingId}`);
    return true;
  }
}

// Create and export a singleton instance
const socketIO = new SocketIO();
module.exports = { socketIO };
