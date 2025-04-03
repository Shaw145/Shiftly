const Booking = require("../models/Booking");
const Driver = require("../models/Driver");

// Create new booking
const createBooking = async (req, res) => {
  try {
    const {
      pickup,
      delivery,
      goods,
      vehicle,
      schedule,
      distance,
      estimatedPrice,
    } = req.body;

    // Validate goods data
    if (!goods?.type || !Array.isArray(goods?.items)) {
      return res.status(400).json({
        success: false,
        error: "Invalid goods data",
        receivedData: { goods },
      });
    }

    // Validate required fields
    if (
      !pickup ||
      !delivery ||
      !vehicle ||
      !schedule ||
      !distance ||
      !estimatedPrice
    ) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
        receivedData: req.body,
      });
    }

    // Create the booking document
    const bookingData = {
      bookingId:
        "B" +
        Date.now().toString().slice(-6) +
        Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0"),
      userId: req.user._id,
      status: "pending",
      pickup,
      delivery,
      goods: {
        type: goods.type,
        items: goods.items, // Already in array format
        additionalItems: goods.additionalItems,
      },
      vehicle,
      schedule: {
        date: new Date(schedule.date),
        time: schedule.time,
        urgency: schedule.urgency,
        insurance: schedule.insurance,
        specialInstructions: schedule.specialInstructions,
      },
      distance,
      estimatedPrice,
    };

    const booking = await Booking.create(bookingData);

    res.status(201).json({
      success: true,
      bookingId: booking.bookingId,
      booking,
    });
  } catch (error) {
    console.error("Error in createBooking:", error);
    res.status(400).json({
      success: false,
      error: error.message,
      stack: error.stack,
    });
  }
};

// Get user's bookings
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id }).sort({
      createdAt: -1,
    }); // Sort by newest first

    res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Add this helper function at the top
const getMongoIdFromBookingId = (formattedId) => {
  // If it's already a MongoDB ID, return it
  if (/^[0-9a-fA-F]{24}$/.test(formattedId)) {
    return formattedId;
  }
  // If it's a formatted ID (e.g., B860953968), query by bookingId field
  return null;
};

// Update the getBooking controller
const getBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    console.log("\n=== Get Booking Request ===");
    console.log("BookingID:", bookingId);
    console.log("User:", req.user._id);

    // First, let's check what's in the database
    const allBookings = await Booking.find({});
    console.log(
      "\nAll bookings in database:",
      allBookings.map((b) => ({
        _id: b._id,
        bookingId: b.bookingId,
        userId: b.userId,
      }))
    );

    // Try to find by formatted ID
    let booking = await Booking.findOne({ bookingId: bookingId });
    console.log("\nSearch by formatted ID result:", booking);

    // If not found and it's a MongoDB ID, try that
    if (!booking && /^[0-9a-fA-F]{24}$/.test(bookingId)) {
      booking = await Booking.findById(bookingId);
      console.log("Search by MongoDB ID result:", booking);
    }

    if (!booking) {
      console.log("No booking found");
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      });
    }

    // Populate user and driver details
    await booking.populate(["userId", "driverId"]);

    console.log("\nFinal booking object:", {
      _id: booking._id,
      bookingId: booking.bookingId,
      userId: booking.userId._id,
    });

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("\nError in getBooking:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
      details: error.message,
    });
  }
};

// Add this to your existing controllers
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      bookingId: req.params.bookingId,
      userId: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      });
    }

    // Only allow cancellation of pending bookings
    if (booking.status !== "pending") {
      return res.status(400).json({
        success: false,
        error: "Only pending bookings can be cancelled",
      });
    }

    booking.status = "cancelled";
    booking.cancelledAt = new Date();
    booking.cancellationReason = req.body.reason || "Cancelled by user";

    await booking.save();

    res.json({
      success: true,
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// First, change the findBooking function declaration
const findBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    console.log("\n=== Finding Booking ===");
    console.log("BookingID:", bookingId);
    console.log("UserID:", req.user._id);

    // First try to find by formatted ID and populate payment
    let booking = await Booking.findOne({
      bookingId: bookingId,
      userId: req.user._id,
    }).populate("paymentId");

    console.log("Search by formatted ID result:", booking);

    // If not found and it looks like a MongoDB ID, try that
    if (!booking && /^[0-9a-fA-F]{24}$/.test(bookingId)) {
      booking = await Booking.findOne({
        _id: bookingId,
        userId: req.user._id,
      }).populate("paymentId");
      console.log("Search by MongoDB ID result:", booking);
    }

    if (!booking) {
      console.log("No booking found");
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      });
    }

    // For confirmed bookings, try to populate driver details
    if (booking.status === "confirmed" && booking.driverId) {
      console.log("Attempting to populate driver details...");
      try {
        await booking.populate("driverId");
        console.log("Driver details populated:", booking.driverId);
      } catch (error) {
        console.error("Error handling driver details:", error);
      }
    }

    console.log("Final booking object:", {
      _id: booking._id,
      bookingId: booking.bookingId,
      status: booking.status,
      driverId: booking.driverId,
      payment: booking.paymentId,
    });

    res.status(200).json({
      success: true,
      booking: {
        ...booking.toObject(),
        bookingId: booking.bookingId,
      },
    });
  } catch (error) {
    console.error("Error in findBooking:", error);
    res.status(500).json({
      success: false,
      error: "Error finding booking",
      details: error.message,
      stack: error.stack,
    });
  }
};

// Add this new controller method
const getMyBookings = async (req, res) => {
  try {
    console.log("Fetching my bookings for user:", req.user._id);

    const bookings = await Booking.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    console.log(`Found ${bookings.length} bookings for user`);

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Error fetching my bookings:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch bookings",
    });
  }
};

// Update the exports at the bottom of the file
module.exports = {
  createBooking,
  getBookings,
  getBooking,
  cancelBooking,
  findBooking,
  getMyBookings,
};
