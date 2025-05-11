const WebSocket = require("ws");
const jwt = require("jsonwebtoken");
const Driver = require("../models/Driver");
const User = require("../models/User");
const Booking = require("../models/Booking");
const Bid = require("../models/Bid");
const mongoose = require("mongoose");

// Store active connections
const clients = new Map();

// Initialize WebSocket server
function initializeWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", async (ws, req) => {
    try {
      // Extract token from URL query parameters
      let token;
      let clientRole;
      try {
        // First try to construct a valid URL
        const url = new URL(
          req.url,
          `http://${req.headers.host || "localhost"}`
        );
        token = url.searchParams.get("token");
        // Get the role from query parameters (client will send it)
        clientRole = url.searchParams.get("role");
      } catch (urlError) {
        // Fallback to manual parsing if URL construction fails
        const queryString = req.url.split("?")[1] || "";
        const params = new URLSearchParams(queryString);
        token = params.get("token");
        const clientRole = params.get("role");
      }

      if (!token) {
        ws.close(1008, "Authentication required");
        return;
      }

      // Verify token and get user/driver details
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);

        // For driver tokens, they have driverId instead of id
        if (decoded.driverId && !decoded.id) {
          decoded.id = decoded.driverId;
          decoded.role = "driver";
        }
      } catch (jwtError) {
        ws.close(1008, "Invalid token");
        return;
      }

      let user;

      if (decoded.role === "driver") {
        user = await Driver.findById(decoded.id).select(
          "_id username isAvailable currentLocation"
        );
      } else {
        // For regular customers - check userId or id
        const userId = decoded.userId || decoded.id;
        if (!userId) {
          ws.close(1008, "Invalid token format");
          return;
        }

        user = await User.findById(userId).select("_id username");
      }

      if (!user) {
        ws.close(1008, "User not found");
        return;
      }

      // Store connection with user info
      clients.set(user._id.toString(), {
        ws,
        role: decoded.role,
        user: user._id,
      });

      // Send connection success message
      ws.send(
        JSON.stringify({
          type: "connection_established",
          message: "Successfully connected to WebSocket server",
        })
      );

      // Handle incoming messages
      ws.on("message", async (message) => {
        try {
          const data = JSON.parse(message);
          handleWebSocketMessage(data, user, decoded.role);
        } catch (error) {
          ws.send(
            JSON.stringify({
              type: "error",
              message: "Invalid message format",
            })
          );
        }
      });

      // Handle connection close
      ws.on("close", () => {
        clients.delete(user._id.toString());
      });
    } catch (error) {
      ws.close(1011, "Internal server error");
    }
  });

  return wss;
}

// Handle different types of WebSocket messages
async function handleWebSocketMessage(data, user, role) {
  try {
    const { type, payload, messageId } = data;
    const client = clients.get(user._id.toString());

    if (!client) {
      return;
    }

    if (!type) {
      client.ws.send(
        JSON.stringify({
          type: "error",
          message: "Missing message type",
        })
      );
      return;
    }

    // Handle ping message for keeping connection alive
    if (type === "ping") {
      client.ws.send(
        JSON.stringify({
          type: "pong",
          timestamp: Date.now(),
        })
      );
      return;
    }

    switch (type) {
      case "place_bid":
        if (role !== "driver") {
          client.ws.send(
            JSON.stringify({
              type: "error",
              message: "Only drivers can place bids",
              messageId,
            })
          );
          return;
        }

        // Process the bid and get the response
        const bidResponse = await handleBidPlacement(payload, user);

        // Always send a direct response back to the driver who placed the bid
        client.ws.send(
          JSON.stringify({
            type: "bid_response",
            status: bidResponse.success ? "success" : "error",
            message: bidResponse.message,
            bid: bidResponse.success ? bidResponse.bid : null,
            messageId, // Echo back the messageId if provided
          })
        );
        break;

      case "accept_bid":
        if (role !== "user") {
          client.ws.send(
            JSON.stringify({
              type: "error",
              message: "Only customers can accept bids",
              messageId,
            })
          );
          return;
        }
        await handleBidAcceptance(payload, user);
        break;

      case "update_booking_status":
        await handleBookingStatusUpdate(payload, user);
        break;

      default:
        client.ws.send(
          JSON.stringify({
            type: "error",
            message: "Unknown message type: " + type,
            messageId,
          })
        );
    }
  } catch (error) {
    console.error("Error handling WebSocket message:", error);
    try {
      const client = clients.get(user._id.toString());
      if (client) {
        client.ws.send(
          JSON.stringify({
            type: "error",
            message: "Server error processing message",
            details: error.message,
            messageId: data?.messageId,
          })
        );
      }
    } catch (sendError) {
      // Silent error handling
      console.error("Error sending error response:", sendError);
    }
  }
}

// Store recent bids to prevent duplicate processing
const recentBids = new Map();

// Handle bid placement with improved validation
async function handleBidPlacement(payload, driver) {
  try {
    const { bookingId, amount, note } = payload;

    if (!bookingId || !amount) {
      return {
        success: false,
        error: "Booking ID and amount are required",
        message: "Booking ID and amount are required",
      };
    }

    // Generate a unique key for this bid
    const bidKey = `${driver._id.toString()}_${bookingId}_${amount}`;

    // Check if we've recently processed this exact bid (debounce)
    const recentBid = recentBids.get(bidKey);
    if (recentBid && Date.now() - recentBid.timestamp < 5000) {
      // Return the cached response if the bid was placed within the last 5 seconds
      return recentBid.response;
    }

    // Find booking (using either MongoDB ID or custom ID)
    let booking;
    if (mongoose.Types.ObjectId.isValid(bookingId)) {
      booking = await Booking.findById(bookingId);
    } else {
      booking = await Booking.findOne({ bookingId });
    }

    if (!booking) {
      const response = {
        success: false,
        message: "Booking not found",
      };

      // Cache the response
      recentBids.set(bidKey, {
        timestamp: Date.now(),
        response,
      });

      return response;
    }

    // Verify booking status allows bidding
    if (booking.status !== "pending") {
      const response = {
        success: false,
        message: "This booking is not available for bidding",
      };

      // Cache the response
      recentBids.set(bidKey, {
        timestamp: Date.now(),
        response,
      });

      return response;
    }

    // Check if bidding is locked (24h before pickup)
    const pickupDate = new Date(booking.schedule.date);
    const now = new Date();
    const hoursBeforePickup = (pickupDate - now) / (1000 * 60 * 60);

    if (hoursBeforePickup < 24) {
      const response = {
        success: false,
        message: "Bidding is locked 24 hours before pickup",
      };

      // Cache the response
      recentBids.set(bidKey, {
        timestamp: Date.now(),
        response,
      });

      return response;
    }

    // Parse and validate amount
    const bidAmount = Number(amount);
    if (isNaN(bidAmount) || bidAmount <= 0) {
      const response = {
        success: false,
        message: "Bid amount must be a positive number",
      };

      // Cache the response
      recentBids.set(bidKey, {
        timestamp: Date.now(),
        response,
      });

      return response;
    }

    // Validate against price range
    const minPrice = booking.estimatedPrice?.min || 0;
    const maxPrice = booking.estimatedPrice?.max;

    if (minPrice && bidAmount < minPrice) {
      const response = {
        success: false,
        message: `Bid amount (₹${bidAmount}) is below the minimum estimated price (₹${minPrice})`,
      };

      // Cache the response
      recentBids.set(bidKey, {
        timestamp: Date.now(),
        response,
      });

      return response;
    }

    if (maxPrice && bidAmount > maxPrice * 1.15) {
      const response = {
        success: false,
        message: `Bid amount (₹${bidAmount}) is too high compared to the maximum estimated price`,
      };

      // Cache the response
      recentBids.set(bidKey, {
        timestamp: Date.now(),
        response,
      });

      return response;
    }

    // Start database transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Check if driver has already bid on this booking
      const driverId = driver._id;
      let isUpdate = false;

      // Find existing bid in the new Bid model
      let existingBid = await Bid.findOne({
        booking: booking._id,
        driver: driverId,
      }).session(session);

      // Place or update bid
      let bid;
      if (existingBid) {
        // Update existing bid
        isUpdate = true;
        existingBid.amount = bidAmount;
        existingBid.notes = note || existingBid.notes;
        existingBid.status = "pending"; // Reset to pending if it was rejected
        existingBid.isActive = true;
        bid = await existingBid.save({ session });
      } else {
        // Create new bid
        bid = await Bid.create(
          [
            {
              booking: booking._id,
              driver: driverId,
              amount: bidAmount,
              notes: note || "",
            },
          ],
          { session }
        );

        bid = bid[0]; // Unwrap from array returned by create
      }

      // Add to booking.driverBids for backward compatibility
      if (!booking.driverBids.includes(driverId)) {
        booking.driverBids.push(driverId);
        await booking.save({ session });
      }

      await session.commitTransaction();

      // Fetch driver details to include with the notification
      const driverDetails = await Driver.findById(driverId).select(
        "fullName profileImage rating stats totalTrips vehicleDetails isVerified joinedDate experience"
      );

      // Create standardized driver information
      const driverInfo = {
        id: driverId.toString(),
        driverId: driverId.toString(),
        name: driverDetails?.fullName || driver.username || "Driver",
        profilePhoto: driverDetails?.profileImage || null,
        rating: parseFloat(driverDetails?.rating) || 4.5,
        trips:
          driverDetails?.stats?.totalTrips || driverDetails?.totalTrips || 0,
        vehicle: driverDetails?.vehicleDetails?.basic?.make
          ? `${driverDetails.vehicleDetails.basic.make} ${
              driverDetails.vehicleDetails.basic.model || ""
            }`
          : "Transport Vehicle",
        isVerified: driverDetails?.isVerified || false,
        experience: driverDetails?.joinedDate
          ? `Since ${new Date(driverDetails.joinedDate).getFullYear()}`
          : "Experienced Driver",
      };

      // Create response for client
      const bidDetails = {
        id: bid._id,
        driverId: driverId.toString(),
        amount: bidAmount,
        note: note || "",
        status: "pending",
        bidTime: bid.createdAt,
        driverRating: driverInfo.rating,
        isCurrentDriver: true,
      };

      const response = {
        success: true,
        message: isUpdate
          ? "Bid updated successfully"
          : "Bid placed successfully",
        bid: bidDetails,
      };

      // Cache the response to prevent duplicate processing
      recentBids.set(bidKey, {
        timestamp: Date.now(),
        response,
        notified: false,
      });

      // Only notify user with bid if they're connected (avoid unnecessary broadcasts)
      const userClient = Array.from(clients.values()).find(
        (client) => client.role === "user" && client.user.equals(booking.userId)
      );

      if (userClient) {
        userClient.ws.send(
          JSON.stringify({
            type: "new_bid",
            payload: {
              bookingId: booking._id.toString(),
              bookingRefId: booking.bookingId,
              bid: {
                id: bid._id.toString(),
                driverId: driverId.toString(),
                amount: bidAmount,
                note: note || "",
                bidTime: new Date().toISOString(),
                name: driverInfo.name,
                driverName: driverInfo.name,
                profilePhoto: driverInfo.profilePhoto,
                rating: driverInfo.rating,
                driverRating: driverInfo.rating,
                trips: driverInfo.trips,
                vehicle: driverInfo.vehicle,
                isVerified: driverInfo.isVerified,
              },
            },
          })
        );

        // Mark as notified
        const cachedBid = recentBids.get(bidKey);
        if (cachedBid) {
          cachedBid.notified = true;
        }
      }

      return response;
    } catch (error) {
      // Abort transaction on error
      await session.abortTransaction();
      throw error;
    } finally {
      // End session
      await session.endSession();

      // Clean up old entries from the recentBids map
      const now = Date.now();
      for (const [key, value] of recentBids.entries()) {
        if (now - value.timestamp > 60000) {
          // Remove entries older than 1 minute
          recentBids.delete(key);
        }
      }
    }
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to place bid",
    };
  }
}

// Helper function for sending errors to drivers
function sendErrorToDriver(driverId, message, messageId = null) {
  const driverClient = clients.get(driverId.toString());
  if (driverClient) {
    driverClient.ws.send(
      JSON.stringify({
        type: "error",
        message: message,
        messageId: messageId,
      })
    );
  }
}

// Handle bid acceptance
async function handleBidAcceptance(payload, user) {
  const { bookingId, driverId, bidAmount } = payload;

  try {
    // Use findByAnyId to support both MongoDB ObjectIds and custom booking IDs
    const booking = await Booking.findByAnyId(bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }

    // Update booking status and selected driver
    booking.status = "accepted";
    booking.selectedDriver = driverId;
    booking.finalPrice = bidAmount;
    booking.acceptedAt = new Date();

    await booking.save();

    // Notify selected driver
    const driverClient = clients.get(driverId.toString());
    if (driverClient) {
      driverClient.ws.send(
        JSON.stringify({
          type: "bid_accepted",
          payload: {
            bookingId,
            bidAmount,
          },
        })
      );
    }

    // Notify other drivers who bid
    booking.driverBids.forEach((bid) => {
      if (bid.driverId.toString() !== driverId.toString()) {
        const otherDriverClient = clients.get(bid.driverId.toString());
        if (otherDriverClient) {
          otherDriverClient.ws.send(
            JSON.stringify({
              type: "bid_rejected",
              payload: {
                bookingId,
              },
            })
          );
        }
      }
    });

    // Send confirmation to customer
    const customerClient = clients.get(user._id.toString());
    customerClient.ws.send(
      JSON.stringify({
        type: "booking_confirmed",
        payload: {
          bookingId,
          driverId,
          bidAmount,
        },
      })
    );
  } catch (error) {
    const customerClient = clients.get(user._id.toString());
    customerClient.ws.send(
      JSON.stringify({
        type: "error",
        message: error.message,
      })
    );
  }
}

// Handle booking status updates
async function handleBookingStatusUpdate(payload, user) {
  const { bookingId, status, message } = payload;

  try {
    // Use findByAnyId to support both MongoDB ObjectIds and custom booking IDs
    const booking = await Booking.findByAnyId(bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }

    booking.status = status;
    if (message) {
      booking.statusMessage = message;
    }
    await booking.save();

    // Notify both customer and driver
    const customerClient = clients.get(booking.userId.toString());
    if (customerClient) {
      customerClient.ws.send(
        JSON.stringify({
          type: "booking_status_updated",
          payload: {
            bookingId,
            status,
            message,
          },
        })
      );
    }

    if (booking.selectedDriver) {
      const driverClient = clients.get(booking.selectedDriver.toString());
      if (driverClient) {
        driverClient.ws.send(
          JSON.stringify({
            type: "booking_status_updated",
            payload: {
              bookingId,
              status,
              message,
            },
          })
        );
      }
    }
  } catch (error) {
    const senderClient = clients.get(user._id.toString());
    senderClient.ws.send(
      JSON.stringify({
        type: "error",
        message: error.message,
      })
    );
  }
}

// Broadcast message to all connected clients
function broadcast(message, filter = null) {
  clients.forEach((client) => {
    if (!filter || filter(client)) {
      client.ws.send(JSON.stringify(message));
    }
  });
}

// Function to broadcast driver updates to all users
async function broadcastDriverUpdate(driverId) {
  try {
    // Return early if the driver ID is not valid
    if (!driverId || !mongoose.Types.ObjectId.isValid(driverId)) {
      return;
    }

    // Check if we have active user clients before proceeding
    let hasUserClients = false;
    for (const client of clients.values()) {
      if (client.role === "user") {
        hasUserClients = true;
        break;
      }
    }

    // If no users are connected, skip the broadcast completely
    if (!hasUserClients) {
      return;
    }

    // Fetch the driver data
    const driver = await Driver.findById(driverId);
    if (!driver) return;

    // Create public driver info
    const publicDriverInfo = {
      driverId: driver._id.toString(),
      fullName: driver.fullName,
      profileImage: driver.profileImage,
      rating: parseFloat(driver.rating) || 4.5,
      stats: {
        totalTrips: driver.stats?.totalTrips || driver.totalTrips || 0,
      },
      experience: driver.joinedDate
        ? `Since ${new Date(driver.joinedDate).getFullYear()}`
        : "Experienced Driver",
      vehicleDetails: driver.vehicleDetails
        ? {
            type: driver.vehicleDetails.basic?.type || "Transport Vehicle",
            make: driver.vehicleDetails.basic?.make || null,
            model: driver.vehicleDetails.basic?.model || null,
            year: driver.vehicleDetails.basic?.year || null,
            color: driver.vehicleDetails.basic?.color || null,
            loadCapacity:
              driver.vehicleDetails.specifications?.loadCapacity || null,
          }
        : null,
      isVerified: driver.isVerified,
    };

    // Only broadcast to user clients
    for (const client of clients.values()) {
      if (client.role === "user") {
        try {
          client.ws.send(
            JSON.stringify({
              type: "driver_updated",
              payload: {
                driverId: driver._id.toString(),
                driver: publicDriverInfo,
              },
            })
          );
        } catch (error) {
          // Silently handle any send errors
        }
      }
    }
  } catch (error) {
    // Don't log the broadcast error to prevent console spam
  }
}

module.exports = {
  initializeWebSocket,
  broadcast,
  broadcastDriverUpdate,
};
