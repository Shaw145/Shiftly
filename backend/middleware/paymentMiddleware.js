const Booking = require("../models/Booking");
const jwt = require("jsonwebtoken");

exports.validatePaymentAccess = async (req, res, next) => {
  try {
    const { bookingId, driverId } = req.body;
    const token = req.headers["x-payment-token"];

    console.log("Validating payment access:", {
      bookingId,
      driverId,
      userId: req.user._id,
      token,
    });

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Payment token is required",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded payment token:", decoded);

    // Check if booking exists and belongs to user
    const booking = await Booking.findOne({
      _id: bookingId,
      userId: req.user._id,
      status: "pending",
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: "Booking not found or unauthorized",
      });
    }

    // Skip driver validation since we're using a dummy driver
    req.booking = booking;
    next();
  } catch (error) {
    console.error("Payment validation error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: "Payment session expired",
      });
    }
    res.status(500).json({
      success: false,
      error: "Error validating payment access",
      details: error.message,
    });
  }
};
