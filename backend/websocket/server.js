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
    const { type, payload } = data;
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
            })
          );
          return;
        }
        await handleBidPlacement(payload, user);
        break;

      case "accept_bid":
        if (role !== "user") {
          client.ws.send(
            JSON.stringify({
              type: "error",
              message: "Only customers can accept bids",
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
          })
        );
      }
    } catch (sendError) {
      // Silent error handling
      console.error("Error sending error response:", sendError);
    }
  }
}

// Handle bid placement with improved validation
async function handleBidPlacement(payload, driver) {
  console.log("Handling bid placement:", payload);

  try {
    const { bookingId, amount, note } = payload;

    if (!bookingId || !amount) {
      return {
        success: false,
        error: "Booking ID and amount are required",
      };
    }

    // Find booking (using either MongoDB ID or custom ID)
    let booking;
    if (mongoose.Types.ObjectId.isValid(bookingId)) {
      booking = await Booking.findById(bookingId);
    } else {
      booking = await Booking.findOne({ bookingId });
    }

    if (!booking) {
      return {
        success: false,
        error: "Booking not found",
      };
    }

    // Verify booking status allows bidding
    if (booking.status !== "pending") {
      return {
        success: false,
        error: "This booking is not available for bidding",
      };
    }

    // Check if bidding is locked (24h before pickup)
    const pickupDate = new Date(booking.schedule.date);
    const now = new Date();
    const hoursBeforePickup = (pickupDate - now) / (1000 * 60 * 60);

    if (hoursBeforePickup < 24) {
      return {
        success: false,
        error: "Bidding is locked 24 hours before pickup",
      };
    }

    // Parse and validate amount
    const bidAmount = Number(amount);
    if (isNaN(bidAmount) || bidAmount <= 0) {
      return {
        success: false,
        error: "Bid amount must be a positive number",
      };
    }

    // Validate against price range
    const minPrice = booking.estimatedPrice?.min || 0;
    const maxPrice = booking.estimatedPrice?.max;

    if (minPrice && bidAmount < minPrice) {
      return {
        success: false,
        error: `Bid amount (₹${bidAmount}) is below the minimum estimated price (₹${minPrice})`,
      };
    }

    if (maxPrice && bidAmount > maxPrice * 1.15) {
      return {
        success: false,
        error: `Bid amount (₹${bidAmount}) is too high compared to the maximum estimated price`,
      };
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
      const response = {
        success: true,
        message: isUpdate
          ? "Bid updated successfully"
          : "Bid placed successfully",
        bid: {
          id: bid._id,
          driverId: driverId.toString(),
          amount: bidAmount,
          note: note || "",
          status: "pending",
          bidTime: bid.createdAt,
          driverRating: driverInfo.rating,
          isCurrentDriver: true,
        },
      };

      // Notify user about the new bid
      broadcast(
        {
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
              // Include driver details
              name: driverInfo.name,
              driverName: driverInfo.name,
              profilePhoto: driverInfo.profilePhoto,
              rating: driverInfo.rating,
              driverRating: driverInfo.rating,
              trips: driverInfo.trips,
              vehicle: driverInfo.vehicle,
              isVerified: driverInfo.isVerified,
              experience: driverInfo.experience,
            },
          },
        },
        (client) =>
          client.role === "user" &&
          client.user.toString() === booking.userId.toString()
      );

      // Notify other drivers (anonymized)
      broadcast(
        {
          type: "new_bid",
          payload: {
            bookingId: booking._id.toString(),
            bid: {
              id: bid._id.toString(),
              amount: bidAmount,
              driverRating: driverInfo.rating,
              bidTime: bid.createdAt,
            },
          },
        },
        (client) =>
          client.role === "driver" &&
          client.user.toString() !== driverId.toString()
      );

      // When driver profile is updated, broadcast to all clients
      await broadcastDriverUpdate(driverId);

      return response;
    } catch (dbError) {
      // If any error occurs, abort the transaction
      await session.abortTransaction();
      throw dbError;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Error handling bid placement:", error);
    return {
      success: false,
      error: error.message || "Failed to place bid",
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

    // Broadcast to all users
    broadcast({
      type: "driver_updated",
      payload: {
        driverId: driver._id.toString(),
        driver: publicDriverInfo,
      },
    });

    console.log(`Broadcasted driver update for driver ${driver._id}`);
  } catch (error) {
    console.error("Error broadcasting driver update:", error);
  }
}

module.exports = {
  initializeWebSocket,
  broadcast,
  broadcastDriverUpdate,
};
