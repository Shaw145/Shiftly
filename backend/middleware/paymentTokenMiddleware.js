const jwt = require("jsonwebtoken");
const Booking = require("../models/Booking");
const mongoose = require("mongoose");

exports.generateToken = (bookingId, driverId, userId) => {
  // Log what we're using for token generation
  console.log("Generating payment token with:", {
    bookingId: bookingId,
    driverId: driverId,
    userId: userId,
  });

  // Use the actual driver ID passed in, not a dummy one
  return jwt.sign(
    {
      bookingId,
      driverId: driverId, // Use the actual driver ID
      userId,
      exp: Math.floor(Date.now() / 1000) + 10 * 60, // 10 minutes
    },
    process.env.JWT_SECRET
  );
};

exports.verifyPaymentToken = (req, res, next) => {
  try {
    const token = req.headers["x-payment-token"];
    if (!token) {
      return res.status(401).json({ error: "Payment token is required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.paymentSession = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Payment session expired" });
    }
    return res.status(401).json({ error: "Invalid payment token" });
  }
};

// Helper function to get MongoDB ID from formatted booking ID
exports.getMongoIdFromBookingId = async (formattedBookingId) => {
  try {
    const booking = await Booking.findOne({ bookingId: formattedBookingId });
    if (!booking) {
      throw new Error("Booking not found");
    }
    return booking._id;
  } catch (error) {
    throw error;
  }
};
