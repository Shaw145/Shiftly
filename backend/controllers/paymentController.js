const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
const {
  generatePaymentToken,
  generateToken,
  getMongoIdFromBookingId,
} = require("../middleware/paymentTokenMiddleware");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

exports.initiatePayment = async (req, res) => {
  try {
    const { bookingId, driverId, amount, paymentMethod } = req.body;
    const token = req.headers["x-payment-token"];

    console.log("Payment initiation request:", {
      bookingId,
      driverId,
      amount,
      paymentMethod,
      userId: req.user._id,
    });

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Payment token is required",
      });
    }

    // Verify token and session
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    // Create a valid ObjectId for the dummy driver
    const dummyDriverId = new mongoose.Types.ObjectId();

    // Create payment record with the dummy driver ID
    const payment = await Payment.create({
      bookingId,
      userId: req.user._id,
      driverId: dummyDriverId, // Use the dummy ObjectId
      amount,
      transactionId:
        "TXN" + Date.now() + Math.random().toString(36).substr(2, 9),
      paymentMethod,
      status: "pending",
    });

    console.log("Payment initiated successfully:", payment);

    res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error("Payment initiation error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: "Payment session expired",
      });
    }
    res.status(500).json({
      success: false,
      error: "Error initiating payment",
      details: error.message,
    });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { transactionId } = req.body;

    // Find payment
    const payment = await Payment.findOne({ transactionId });
    if (!payment) {
      return res.status(404).json({
        success: false,
        error: "Payment not found",
      });
    }

    // Update payment status
    payment.status = "success";
    await payment.save();

    // Update booking status and driver
    await Booking.findByIdAndUpdate(payment.bookingId, {
      status: "confirmed",
      driverId: payment.driverId,
      paymentId: payment._id,
    });

    res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error verifying payment",
    });
  }
};

exports.getPaymentDetails = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const payment = await Payment.findOne({ bookingId });
    if (!payment) {
      return res.status(404).json({
        success: false,
        error: "Payment not found",
      });
    }

    res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error fetching payment details",
    });
  }
};

exports.createPaymentSession = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const token = req.headers["x-payment-token"];

    if (!token) {
      return res.status(401).json({ error: "Payment token is required" });
    }

    // Verify token and get session data
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch booking and driver details
    const booking = await Booking.findOne({
      _id: decoded.bookingId,
      userId: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Here you would fetch driver details from your driver model
    const driver = {
      _id: decoded.driverId,
      // Add other driver details as needed
    };

    res.status(200).json({
      success: true,
      booking,
      driver,
    });
  } catch (error) {
    console.error("Create payment session error:", error);
    res.status(500).json({
      error: "Failed to create payment session",
    });
  }
};

exports.generatePaymentToken = async (req, res) => {
  try {
    const formattedBookingId = req.params.bookingId;
    const { driverId } = req.body;

    console.log("Generating token for:", {
      formattedBookingId,
      driverId,
      userId: req.user._id,
    });

    // Use the new findByAnyId method
    const booking = await Booking.findByAnyId(formattedBookingId);

    if (!booking) {
      console.log("Booking not found:", formattedBookingId);
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      });
    }

    // Verify booking belongs to user and is pending
    if (
      booking.userId.toString() !== req.user._id.toString() ||
      booking.status !== "pending"
    ) {
      return res.status(403).json({
        success: false,
        error: "Not authorized or booking is not pending",
      });
    }

    // Generate payment token using the MongoDB _id
    const paymentToken = generateToken(
      booking._id.toString(),
      driverId,
      req.user._id
    );

    console.log("Token generated successfully");

    res.status(200).json({
      success: true,
      paymentToken,
    });
  } catch (error) {
    console.error("Generate payment token error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate payment token",
      details: error.message,
    });
  }
};

exports.cancelPayment = async (req, res) => {
  try {
    const { bookingId, reason } = req.body;
    const token = req.headers["x-payment-token"];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Payment token is required",
      });
    }

    // Invalidate the payment token
    // You might want to add a blacklist for tokens or mark them as expired in your database

    // Update any pending payment records
    await Payment.findOneAndUpdate(
      { bookingId, status: "pending" },
      {
        status: "cancelled",
        cancellationReason: reason,
        cancelledAt: new Date(),
      }
    );

    res.status(200).json({
      success: true,
      message: "Payment cancelled successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error cancelling payment",
    });
  }
};
