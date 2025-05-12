const Booking = require("../models/Booking");
const Driver = require("../models/Driver");
const { socketIO } = require("../config/socket");
const mongoose = require("mongoose");
const logger = require("../utils/logger");

exports.getTrackingStatus = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      $or: [
        { bookingId: req.params.bookingId },
        ...(mongoose.isValidObjectId(req.params.bookingId)
          ? [{ _id: req.params.bookingId }]
          : []),
      ],
    }).populate("driverId");

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      });
    }

    // Define tracking steps
    const steps = {
      pending: 0,
      confirmed: 1,
      pickup_reached: 2,
      in_transit: 3,
      inTransit: 3,
      delivered: 4,
      completed: 4,
    };

    const currentStep = steps[booking.status] || 0;

    // Determine if this is a authenticated request or public request
    const isPublicRequest = req.originalUrl.includes("/public/");

    // For public requests, filter out sensitive information
    const driverInfo = booking.driverId
      ? {
          name: booking.driverId.name || booking.driverId.fullName,
          phone: isPublicRequest ? undefined : booking.driverId.phone,
          vehicle:
            booking.driverId.vehicle || booking.driverId.vehicleDetails?.type,
          profileImage: booking.driverId.profileImage,
          rating: booking.driverId.rating,
        }
      : null;

    res.status(200).json({
      success: true,
      tracking: {
        currentStep,
        status: booking.status,
        driver: driverInfo,
        lastUpdated: booking.updatedAt,
        booking: {
          _id: booking._id,
          bookingId: booking.bookingId,
          status: booking.status,
          pickup: booking.pickup,
          delivery: booking.delivery,
          schedule: booking.schedule,
          trackingUpdates: booking.trackingUpdates,
          goods: booking.goods,
          vehicle: booking.vehicle,
          estimatedArrival: booking.estimatedArrival,
          driverId: driverInfo,
          lastDriverLocation: booking.lastDriverLocation,
        },
      },
    });
  } catch (error) {
    console.error("Tracking status error:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching tracking status",
      message: error.message,
    });
  }
};

exports.getLiveLocation = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      $or: [{ _id: req.params.bookingId }, { bookingId: req.params.bookingId }],
    }).populate("driverId");

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      });
    }

    // If no driver is assigned yet
    if (!booking.driverId) {
      return res.status(404).json({
        success: false,
        error: "No driver assigned to this booking",
      });
    }

    // Get the driver's current location
    const driver = await Driver.findById(booking.driverId);

    if (
      !driver ||
      !driver.currentLocation ||
      !driver.currentLocation.coordinates
    ) {
      // Return dummy location if no real location is available
      return res.status(200).json({
        success: true,
        location: {
          lat: 28.6139,
          lng: 77.209,
          lastUpdated: new Date(),
          isLive: false,
        },
      });
    }

    // Return the driver's actual location
    const [longitude, latitude] = driver.currentLocation.coordinates;

    res.status(200).json({
      success: true,
      location: {
        lat: latitude,
        lng: longitude,
        lastUpdated: driver.currentLocation.lastUpdated || new Date(),
        isLive: true,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error fetching live location",
    });
  }
};

exports.updateTrackingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status, message, timestamp } = req.body;

    console.log(`Received tracking update for booking ${bookingId}:`, {
      status,
      message,
      timestamp: timestamp || new Date().toISOString(),
    });

    // Find booking by either MongoDB ID or formatted ID
    let booking;
    if (/^[0-9a-fA-F]{24}$/.test(bookingId)) {
      // Valid MongoDB ObjectId format
      booking = await Booking.findById(bookingId);
    } else {
      // Try to find by formatted booking ID (e.g., "B123456789")
      booking = await Booking.findOne({ bookingId: bookingId });
    }

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Initialize trackingUpdates array if it doesn't exist
    if (!booking.trackingUpdates) {
      booking.trackingUpdates = [];
    }

    // Add new tracking update
    booking.trackingUpdates.push({
      status,
      message: message || `Status updated to ${status}`,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      // Add location if provided
      ...(req.body.location && { location: req.body.location }),
    });

    // Save the booking
    await booking.save();

    // Publish tracking update to WebSocket clients if available
    try {
      const { broadcastBookingUpdate } = require("../websocket/server");
      if (typeof broadcastBookingUpdate === "function" && booking.userId) {
        const userId = booking.userId.toString();
        const formattedBookingId = booking._id.toString();

        broadcastBookingUpdate(userId, formattedBookingId, {
          type: "tracking_update",
          payload: {
            bookingId: formattedBookingId,
            bookingRefId: booking.bookingId,
            status,
            message: message || `Status updated to ${status}`,
            timestamp: timestamp || new Date().toISOString(),
          },
        });

        console.log(`Tracking update broadcast sent to user ${userId}`);
      }
    } catch (error) {
      console.error("Error broadcasting tracking update:", error);
      // Continue processing even if WebSocket notification fails
    }

    res.status(200).json({
      success: true,
      message: "Tracking status updated successfully",
    });
  } catch (error) {
    console.error("Error updating tracking status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update tracking status",
      error: error.message,
    });
  }
};

exports.updateDriverLocation = async (req, res) => {
  try {
    const { bookingId, location } = req.body;
    const driverId = req.driver._id;

    // Validate input
    if (!bookingId || !location || !location.lat || !location.lng) {
      return res.status(400).json({
        success: false,
        message: "Invalid input: bookingId and location (lat/lng) are required",
      });
    }

    // Find the booking
    const booking = await Booking.findOne({
      $or: [
        { _id: mongoose.isValidObjectId(bookingId) ? bookingId : null },
        { bookingId },
      ],
      driverId,
      status: { $in: ["inTransit", "in_transit", "pickup_reached"] },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message:
          "Booking not found or you are not authorized to update this booking",
      });
    }

    // Update the last known location in the booking
    booking.lastDriverLocation = {
      coordinates: [location.lng, location.lat],
      updatedAt: new Date(),
    };

    await booking.save();

    // Broadcast location update via WebSocket
    const io = socketIO.getIO();
    if (io) {
      // Send to booking-specific channel
      io.to(`booking:${booking._id}`).emit("message", {
        type: "driverLocation",
        location: {
          lat: location.lat,
          lng: location.lng,
        },
        driverId: driverId.toString(),
        bookingId: booking._id.toString(),
        timestamp: new Date(),
      });

      // Also send to booking's customer
      if (booking.userId) {
        io.to(`user:${booking.userId}`).emit("message", {
          type: "driverLocation",
          location: {
            lat: location.lat,
            lng: location.lng,
          },
          bookingId: booking._id.toString(),
          timestamp: new Date(),
        });
      }
    }

    logger.info(`Driver ${driverId} location updated for booking ${bookingId}`);

    return res.status(200).json({
      success: true,
      message: "Location updated successfully",
    });
  } catch (error) {
    logger.error("Error updating driver location:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update location",
      error: error.message,
    });
  }
};

exports.getLastLocation = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Find the booking with improved query
    const booking = await Booking.findOne({
      $or: [
        { bookingId },
        ...(mongoose.isValidObjectId(bookingId) ? [{ _id: bookingId }] : []),
      ],
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check authorization only if this is not a public request
    if (!req.originalUrl.includes("/public/")) {
      // If user is making the request, check if they own the booking
      if (
        req.user &&
        booking.userId &&
        booking.userId.toString() !== req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to access this booking",
        });
      }

      // If driver is making the request, check if they are assigned to the booking
      if (
        req.driver &&
        booking.driverId &&
        booking.driverId.toString() !== req.driver._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to access this booking",
        });
      }
    }

    // Return the last known location
    if (
      !booking.lastDriverLocation ||
      !booking.lastDriverLocation.coordinates
    ) {
      return res.status(200).json({
        success: true,
        location: null,
        message: "No location data available for this booking",
      });
    }

    const [lng, lat] = booking.lastDriverLocation.coordinates;

    return res.status(200).json({
      success: true,
      location: {
        lat,
        lng,
      },
      updatedAt: booking.lastDriverLocation.updatedAt,
    });
  } catch (error) {
    logger.error("Error fetching last location:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch location data",
      error: error.message,
    });
  }
};

exports.getTrackingHistory = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Find the booking
    const booking = await Booking.findOne({
      $or: [
        { _id: mongoose.isValidObjectId(bookingId) ? bookingId : null },
        { bookingId },
      ],
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check authorization
    // If user is making the request, check if they own the booking
    if (req.user && booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this booking",
      });
    }

    // If driver is making the request, check if they are assigned to the booking
    if (
      req.driver &&
      booking.driverId.toString() !== req.driver._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this booking",
      });
    }

    // Return the tracking history
    return res.status(200).json({
      success: true,
      trackingHistory: booking.trackingUpdates || [],
    });
  } catch (error) {
    logger.error("Error fetching tracking history:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tracking history",
      error: error.message,
    });
  }
};

exports.subscribeToUpdates = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Find the booking
    const booking = await Booking.findOne({
      $or: [
        { _id: mongoose.isValidObjectId(bookingId) ? bookingId : null },
        { bookingId },
      ],
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check authorization
    let userId = null;
    let driverId = null;

    // If user is making the request, check if they own the booking
    if (req.user) {
      userId = req.user._id;
      if (booking.userId.toString() !== userId.toString()) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to access this booking",
        });
      }
    }

    // If driver is making the request, check if they are assigned to the booking
    if (req.driver) {
      driverId = req.driver._id;
      if (booking.driverId.toString() !== driverId.toString()) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to access this booking",
        });
      }
    }

    // Generate a unique token for WebSocket authentication (in a real app)
    // For this implementation, we'll just provide instructions

    const wsUrl =
      process.env.WS_URL || process.env.BACKEND_URL.replace("http", "ws");

    return res.status(200).json({
      success: true,
      message: "Subscribe to WebSocket for real-time updates",
      instructions: {
        wsUrl: `${wsUrl}/ws`,
        channel: `booking:${booking._id}`,
        subscribeMessage: JSON.stringify({
          type: "subscribe",
          channel: `booking:${booking._id}`,
        }),
        messageTypes: ["driverLocation", "bookingUpdate", "statusChange"],
      },
    });
  } catch (error) {
    logger.error("Error processing subscribe request:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process subscription request",
      error: error.message,
    });
  }
};

// Public tracking status - accessible without authentication
exports.getPublicTrackingStatus = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;

    // Handle both string IDs and ObjectId
    const booking = await Booking.findOne({
      $or: [
        { bookingId: bookingId },
        ...(mongoose.isValidObjectId(bookingId) ? [{ _id: bookingId }] : []),
      ],
    }).populate("driverId");

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      });
    }

    // Define tracking steps
    const steps = {
      pending: 0,
      confirmed: 1,
      pickup_reached: 2,
      in_transit: 3,
      inTransit: 3,
      delivered: 4,
      completed: 4,
    };

    const currentStep = steps[booking.status] || 0;

    // Filter out sensitive information for public access
    const driverInfo = booking.driverId
      ? {
          name: booking.driverId.name || booking.driverId.fullName,
          vehicle:
            booking.driverId.vehicle || booking.driverId.vehicleDetails?.type,
          profileImage: booking.driverId.profileImage,
          rating: booking.driverId.rating,
        }
      : null;

    res.status(200).json({
      success: true,
      tracking: {
        currentStep,
        status: booking.status,
        driver: driverInfo,
        lastUpdated: booking.updatedAt,
        booking: {
          _id: booking._id,
          bookingId: booking.bookingId,
          status: booking.status,
          pickup: booking.pickup,
          delivery: booking.delivery,
          schedule: booking.schedule,
          trackingUpdates: booking.trackingUpdates,
          goods: booking.goods,
          vehicle: booking.vehicle,
          estimatedArrival: booking.estimatedArrival,
          driverId: driverInfo,
          lastDriverLocation: booking.lastDriverLocation,
        },
      },
    });
  } catch (error) {
    logger.error("Public tracking status error:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching tracking status",
      message: error.message,
    });
  }
};

// Public location access - no authentication required
exports.getPublicLocation = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;

    // Handle both string IDs and ObjectId
    const booking = await Booking.findOne({
      $or: [
        { bookingId: bookingId },
        ...(mongoose.isValidObjectId(bookingId) ? [{ _id: bookingId }] : []),
      ],
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Return the last known location
    if (
      !booking.lastDriverLocation ||
      !booking.lastDriverLocation.coordinates
    ) {
      return res.status(200).json({
        success: true,
        location: null,
        message: "No location data available for this booking",
      });
    }

    const [lng, lat] = booking.lastDriverLocation.coordinates;

    return res.status(200).json({
      success: true,
      location: {
        lat,
        lng,
      },
      updatedAt: booking.lastDriverLocation.updatedAt,
    });
  } catch (error) {
    logger.error("Error fetching public location:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch location data",
      error: error.message,
    });
  }
};
