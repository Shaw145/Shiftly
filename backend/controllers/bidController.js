const mongoose = require("mongoose");
const Bid = require("../models/Bid");
const Booking = require("../models/Booking");
const Driver = require("../models/Driver");
const { validateBidAmount } = require("../utils/validation");
const { broadcast } = require("../websocket/server");

/**
 * Get all bids for a specific booking
 * @route GET /api/bids/booking/:bookingId
 */
exports.getBookingBids = async (req, res) => {
  try {
    const { bookingId } = req.params;
    console.log(`Getting bids for booking ID: ${bookingId}`);

    // First check if it's a MongoDB ID format
    let booking;
    let bids = [];

    if (mongoose.Types.ObjectId.isValid(bookingId)) {
      // If it's a valid MongoDB ID, search directly
      bids = await Bid.find({
        booking: bookingId,
        isActive: true,
      })
        .populate("driver", "fullName rating personalDetails.vehicle")
        .sort({ amount: 1 });
    } else {
      // If it's a formatted ID (like B123456789), first find the booking
      booking = await Booking.findOne({ bookingId: bookingId });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found with the provided ID",
        });
      }

      // Then find bids using the MongoDB _id
      bids = await Bid.find({
        booking: booking._id,
        isActive: true,
      })
        .populate("driver", "fullName rating personalDetails.vehicle")
        .sort({ amount: 1 });
    }

    // If no bids found
    if (bids.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No bids found for this booking",
        data: [],
      });
    }

    // Process bids for frontend - mark current driver's bid and lowest bid
    const isDriver = req.role === "driver";
    const currentUserId = isDriver ? req.driver._id.toString() : "";

    const enhancedBids = bids.map((bid, index) => {
      // Check if this is the current driver's bid
      const isCurrentDriver =
        isDriver && bid.driver._id.toString() === currentUserId;

      // Create frontend-friendly bid object
      return {
        id: bid._id,
        amount: bid.amount,
        notes: bid.notes,
        status: bid.status,
        bidTime: bid.createdAt,
        driverId: bid.driver._id,
        driverRating: bid.driver.rating || 4.5,
        driverName: isCurrentDriver ? "You" : "Anonymous Driver",
        isCurrentDriver,
        isLowestBid: index === 0, // First bid is the lowest since we sorted by amount
      };
    });

    return res.status(200).json({
      success: true,
      count: bids.length,
      data: enhancedBids,
    });
  } catch (error) {
    console.error("Error fetching bids:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch bids",
      error: error.message,
    });
  }
};

/**
 * Get all bids placed by the current driver
 * @route GET /api/bids/driver
 */
exports.getDriverBids = async (req, res) => {
  try {
    const driverId = req.driver._id;

    // Get all active bids for this driver
    const bids = await Bid.find({
      driver: driverId,
      isActive: true,
    })
      .populate({
        path: "booking",
        select: "pickup delivery schedule goods.type status estimatedPrice",
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bids.length,
      data: bids,
    });
  } catch (error) {
    console.error("Error fetching driver bids:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch your bids",
      error: error.message,
    });
  }
};

/**
 * Get a specific bid by ID
 * @route GET /api/bids/:bidId
 */
exports.getBidById = async (req, res) => {
  try {
    const { bidId } = req.params;

    // Validate bid ID
    if (!mongoose.Types.ObjectId.isValid(bidId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid bid ID format",
      });
    }

    // Find the bid
    const bid = await Bid.findOne({
      _id: bidId,
      isActive: true,
    })
      .populate("driver", "fullName rating")
      .populate("booking", "pickup delivery schedule status");

    if (!bid) {
      return res.status(404).json({
        success: false,
        message: "Bid not found",
      });
    }

    // Check if the requester is authorized to view this bid
    if (
      req.role === "driver" &&
      bid.driver._id.toString() !== req.driver._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this bid",
      });
    }

    return res.status(200).json({
      success: true,
      data: bid,
    });
  } catch (error) {
    console.error("Error fetching bid:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch bid details",
      error: error.message,
    });
  }
};

/**
 * Place a new bid or update existing bid
 * @route POST /api/bids/place
 */
exports.placeBid = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { bookingId, amount, notes } = req.body;
    const driverId = req.driver._id;

    // Validate required fields
    if (!bookingId || !amount) {
      return res.status(400).json({
        success: false,
        message: "Booking ID and bid amount are required",
      });
    }

    // Validate bookingId format
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID format",
      });
    }

    // Find the booking
    const booking = await Booking.findById(bookingId).session(session);
    if (!booking) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if booking status allows bidding
    if (booking.status !== "pending") {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "This booking is not available for bidding",
      });
    }

    // Check if bidding is locked (24 hours before pickup)
    const pickupDate = new Date(booking.schedule.date);
    const now = new Date();
    const hoursBeforePickup = (pickupDate - now) / (1000 * 60 * 60);

    if (hoursBeforePickup < 24) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Bidding is locked 24 hours before pickup",
      });
    }

    // Validate amount
    const bidAmount = Number(amount);
    if (isNaN(bidAmount) || bidAmount <= 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Bid amount must be a positive number",
      });
    }

    // Validate against price range
    const minPrice = booking.estimatedPrice?.min || 0;
    const maxPrice = booking.estimatedPrice?.max;

    if (minPrice && bidAmount < minPrice) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: `Bid amount (₹${bidAmount}) is below the minimum estimated price (₹${minPrice})`,
      });
    }

    if (maxPrice && bidAmount > maxPrice * 1.15) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: `Bid amount (₹${bidAmount}) is too high compared to the maximum estimated price`,
      });
    }

    // Check if driver has already placed a bid
    let isUpdate = false;
    let existingBid = await Bid.findOne({
      booking: bookingId,
      driver: driverId,
    }).session(session);

    let bid;
    if (existingBid) {
      // Update existing bid
      isUpdate = true;
      existingBid.amount = bidAmount;
      existingBid.notes = notes || existingBid.notes;
      existingBid.status = "pending"; // Reset to pending if it was rejected
      existingBid.isActive = true;
      bid = await existingBid.save({ session });
    } else {
      // Create new bid
      bid = await Bid.create(
        [
          {
            booking: bookingId,
            driver: driverId,
            amount: bidAmount,
            notes: notes || "",
          },
        ],
        { session }
      );
    }

    // Add to booking.driverBids for backward compatibility
    if (!booking.driverBids.includes(driverId)) {
      booking.driverBids.push(driverId);
      await booking.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    // Get driver details
    const driver = await Driver.findById(driverId).select(
      "fullName rating personalDetails.vehicle"
    );

    // Prepare response data
    const bidData = {
      id: bid._id || bid[0]._id,
      amount: bidAmount,
      notes: notes || "",
      status: "pending",
      bidTime: new Date(),
      driverId: driverId,
      driverName: "You",
      driverRating: driver?.rating || 4.5,
      isCurrentDriver: true,
      isLowestBid: false, // Will be determined client-side when merged with other bids
    };

    // Send WebSocket notification if available
    try {
      // Notify user about new bid
      broadcast(
        {
          type: "new_bid",
          payload: {
            bookingId: booking._id.toString(),
            bid: {
              id: bidData.id,
              driverId: driverId.toString(),
              amount: bidAmount,
              driverRating: driver?.rating || 4.5,
              bidTime: new Date(),
              note: notes || "",
            },
          },
        },
        (client) =>
          client.role === "user" &&
          client.user.toString() === booking.userId.toString()
      );

      // Notify other drivers about new bid (without showing who placed it)
      broadcast(
        {
          type: "new_bid",
          payload: {
            bookingId: booking._id.toString(),
            bid: {
              id: bidData.id,
              driverRating: driver?.rating || 4.5,
              amount: bidAmount,
              bidTime: new Date(),
            },
          },
        },
        (client) =>
          client.role === "driver" &&
          client.user.toString() !== driverId.toString()
      );
    } catch (wsError) {
      console.error("WebSocket notification error:", wsError);
      // Continue even if WebSocket notification fails
    }

    return res.status(200).json({
      success: true,
      message: isUpdate
        ? "Bid updated successfully"
        : "Bid placed successfully",
      data: bidData,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Error placing bid:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to place bid",
      error: error.message,
    });
  }
};

/**
 * Cancel a bid
 * @route DELETE /api/bids/:bidId
 */
exports.cancelBid = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { bidId } = req.params;
    const driverId = req.driver._id;

    // Validate bid ID
    if (!mongoose.Types.ObjectId.isValid(bidId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid bid ID format",
      });
    }

    // Find the bid
    const bid = await Bid.findOne({
      _id: bidId,
      driver: driverId,
      isActive: true,
    }).session(session);

    if (!bid) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "Bid not found or already cancelled",
      });
    }

    // Check if bid can be cancelled
    const booking = await Booking.findById(bid.booking).session(session);
    if (booking && booking.status !== "pending") {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Cannot cancel bid on a booking that is not pending",
      });
    }

    // Check if bidding is locked (24 hours before pickup)
    if (booking) {
      const pickupDate = new Date(booking.schedule.date);
      const now = new Date();
      const hoursBeforePickup = (pickupDate - now) / (1000 * 60 * 60);

      if (hoursBeforePickup < 24) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message: "Bid cancellation is locked 24 hours before pickup",
        });
      }
    }

    // Update bid status
    bid.isActive = false;
    bid.status = "cancelled";
    await bid.save({ session });

    // Remove driver from booking.driverBids for backward compatibility
    if (booking) {
      const driverIndex = booking.driverBids.indexOf(driverId);
      if (driverIndex > -1) {
        booking.driverBids.splice(driverIndex, 1);
        await booking.save({ session });
      }
    }

    await session.commitTransaction();
    session.endSession();

    // Send WebSocket notification if available
    try {
      if (booking) {
        // Notify user about cancelled bid
        broadcast(
          {
            type: "bid_cancelled",
            payload: {
              bookingId: booking._id.toString(),
              bidId: bid._id.toString(),
              driverId: driverId.toString(),
            },
          },
          (client) =>
            client.role === "user" &&
            client.user.toString() === booking.userId.toString()
        );

        // Notify other drivers
        broadcast(
          {
            type: "bid_cancelled",
            payload: {
              bookingId: booking._id.toString(),
              bidId: bid._id.toString(),
            },
          },
          (client) =>
            client.role === "driver" &&
            client.user.toString() !== driverId.toString()
        );
      }
    } catch (wsError) {
      console.error("WebSocket notification error:", wsError);
      // Continue even if WebSocket notification fails
    }

    return res.status(200).json({
      success: true,
      message: "Bid cancelled successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Error cancelling bid:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to cancel bid",
      error: error.message,
    });
  }
};

/**
 * Get current driver's bid for a specific booking
 * @route GET /api/bids/driver/booking/:bookingId/current
 */
exports.getCurrentDriverBid = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const driverId = req.driver._id;

    // First check if it's a MongoDB ID format
    let query = {};

    if (mongoose.Types.ObjectId.isValid(bookingId)) {
      // If it's a valid MongoDB ID, search directly
      query = { booking: bookingId, driver: driverId, isActive: true };
    } else {
      // If it's a formatted ID (like B123456789), first find the booking
      const booking = await Booking.findOne({ bookingId: bookingId });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found with the provided ID",
        });
      }

      // Then construct query using the MongoDB _id
      query = { booking: booking._id, driver: driverId, isActive: true };
    }

    // Find the driver's current bid
    const bid = await Bid.findOne(query);

    if (!bid) {
      return res.status(200).json({
        success: true,
        message: "No current bid found for this booking",
        data: null,
      });
    }

    // Return the bid data
    return res.status(200).json({
      success: true,
      data: {
        id: bid._id,
        amount: bid.amount,
        notes: bid.notes,
        status: bid.status,
        bidTime: bid.createdAt,
        driverId: driverId.toString(),
      },
    });
  } catch (error) {
    console.error("Error fetching current bid:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch current bid",
      error: error.message,
    });
  }
};
