const Booking = require("../models/Booking");
const Driver = require("../models/Driver");
const jwt = require("jsonwebtoken");

exports.validatePaymentAccess = async (req, res, next) => {
  try {
    const { bookingId, driverId } = req.body;
    const token = req.headers["x-payment-token"];

    console.log("Validating payment access:", {
      bookingId,
      driverId,
      userId: req.user._id,
      token: token ? "Token present" : "No token",
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

    // Check if booking exists using static method
    const booking = await Booking.findByAnyId(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      });
    }

    // Check if booking belongs to user
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to access this booking",
      });
    }

    // Check if booking is in valid state for payment
    if (booking.status !== "pending") {
      return res.status(400).json({
        success: false,
        error: "This booking cannot be processed for payment",
        status: booking.status,
      });
    }

    // Validate driver exists
    let driver = null;

    if (decoded.driverId) {
      // Try to find the driver from the token
      driver = await Driver.findById(decoded.driverId);
    } else if (driverId) {
      // Or use the driverId from the request body
      driver = await Driver.findById(driverId);
    } else {
      // If neither is provided, create a dummy driver ID
      console.log("No driver ID provided, using dummy ID");
    }

    if (driver) {
      console.log(`Driver found: ${driver.fullName} (${driver._id})`);
    }

    // Store booking and driver in request for controller
    req.booking = booking;
    req.driver = driver;
    req.paymentToken = decoded;

    next();
  } catch (error) {
    console.error("Payment validation error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: "Payment session expired",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        error: "Invalid payment token",
      });
    }

    res.status(500).json({
      success: false,
      error: "Error validating payment access",
      details: error.message,
    });
  }
};
