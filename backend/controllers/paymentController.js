const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
const {
  generatePaymentToken,
  generateToken,
  getMongoIdFromBookingId,
} = require("../middleware/paymentTokenMiddleware");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Driver = require("../models/Driver");
const emailService = require("../utils/emailService");

// Helper function to generate a unique transaction ID
const generateTransactionId = () => {
  return `TXN${Date.now()}${Math.random().toString(36).substring(2, 9)}`;
};

exports.initiatePayment = async (req, res) => {
  try {
    const { bookingId, amount, paymentMethod } = req.body;

    // Use the booking and driver from middleware
    const booking = req.booking;
    let driverId = req.body.driverId;

    // If we have a driver from the middleware, use that
    if (req.driver) {
      driverId = req.driver._id;
    } else if (!driverId) {
      // If no driverId provided, create a dummy one
      driverId = new mongoose.Types.ObjectId();
    }

    console.log("Payment initiation request:", {
      bookingId: booking._id,
      driverId,
      amount,
      paymentMethod,
      userId: req.user._id,
    });

    // Create payment record
    const payment = await Payment.create({
      bookingId: booking._id,
      userId: req.user._id,
      driverId: driverId,
      amount,
      transactionId:
        "TXN" + Date.now() + Math.random().toString(36).substr(2, 9),
      paymentMethod,
      status: "pending",
    });

    console.log("Payment initiated successfully:", {
      id: payment._id,
      bookingId: payment.bookingId,
      status: payment.status,
    });

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
    const { token, paymentDetails, transactionId } = req.body;

    // Backward compatibility - handle both token-based and transactionId approaches
    let bookingId, driverId, userId;

    if (token) {
      // Verify the token and extract values - reduced logging
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        bookingId = decoded.bookingId;
        driverId = decoded.driverId;
        userId = decoded.userId;
      } catch (error) {
        return res.status(401).json({
          success: false,
          message:
            error.message === "jwt expired"
              ? "Payment verification expired. Please try again."
              : "Invalid payment token. Please try again.",
        });
      }
    } else if (transactionId) {
      // Legacy approach - reduced logging
      return res.status(400).json({
        success: false,
        message:
          "This payment verification method is deprecated. Please use the token-based approach.",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification details",
      });
    }

    // Fetch booking details - FIXED: removed .populate("user") that was causing StrictPopulateError
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    // Ensure this booking wasn't already confirmed
    if (booking.status === "confirmed") {
      return res
        .status(400)
        .json({ success: false, message: "Booking is already confirmed" });
    }

    // Find the matched driver's bid with improved matching
    let matchedBid = null;

    if (booking.driverBids && booking.driverBids.length > 0) {
      // First try to find an exact match
      matchedBid = booking.driverBids.find((bid) => {
        if (typeof bid.driver === "string") {
          return bid.driver === driverId;
        }

        if (bid.driver?._id) {
          return bid.driver._id.toString() === driverId;
        }

        if (bid.driver?.driverId) {
          return bid.driver.driverId.toString() === driverId;
        }

        if (bid.driverId) {
          return bid.driverId.toString() === driverId;
        }

        return false;
      });

      // If no match found, try a more flexible approach
      if (!matchedBid) {
        // Try each bid with string comparison of all possible ID fields
        matchedBid = booking.driverBids.find((bid) => {
          // Get all possible ID representations
          const bidIds = [
            bid.driver?.toString(),
            bid.driver?._id?.toString(),
            bid.driver?.driverId?.toString(),
            bid.driverId?.toString(),
          ].filter(Boolean); // Remove undefined/null

          // Check if any match the driver ID
          return bidIds.some((id) => id === driverId);
        });
      }
    }

    // If still no match found, use a fallback for backward compatibility
    if (!matchedBid && booking.driverBids && booking.driverBids.length > 0) {
      // Use the first bid as a fallback if we can't find a match
      matchedBid = booking.driverBids[0];
    }

    if (!matchedBid) {
      return res.status(400).json({
        success: false,
        message: "No driver bid found for this booking",
      });
    }

    // Create a new transaction ID if not provided
    const newTransactionId = transactionId || generateTransactionId();

    try {
      // Create payment record with all required fields properly set
      const payment = new Payment({
        bookingId: bookingId,
        userId: userId,
        driverId: driverId,
        amount: paymentDetails?.amount || matchedBid.price,
        transactionId: newTransactionId,
        paymentMethod: paymentDetails?.paymentMethod || "card", // Ensure this matches enum values in schema
        status: "success", // Use 'success' instead of 'completed' to match enum
      });

      await payment.save();

      // Update booking status with all required fields for driver visibility
      const finalPrice = paymentDetails?.amount || matchedBid.price;

      // Use updateOne to ensure we set all required fields
      const updateResult = await Booking.updateOne(
        { _id: bookingId },
        {
          $set: {
            status: "confirmed",
            assignedDriver: driverId, // Ensure this is set with the correct field name
            driverId: driverId, // Set this for backward compatibility
            finalPrice: finalPrice, // Required for pricing display
            payment: payment._id, // Required for payment reference
            paymentId: payment._id, // Alternative field for payment reference
            confirmedAt: new Date(), // Add confirmation timestamp
          },
        }
      );

      console.log("Booking update result:", updateResult);

      // Fetch the updated booking for confirmation
      const updatedBooking = await Booking.findById(bookingId);

      if (!updatedBooking || updatedBooking.status !== "confirmed") {
        throw new Error("Failed to update booking status");
      }

      // Get driver details for the confirmation email
      const driver = await Driver.findById(driverId);
      if (driver && driver.email) {
        // Get user details directly instead of from populated booking
        const user = await mongoose
          .model("User")
          .findById(userId)
          .select("name fullName email phone");

        // Send booking confirmation email to the driver
        await emailService.sendDriverBookingConfirmationEmail(driver.email, {
          bookingId: updatedBooking.bookingId || updatedBooking._id.toString(),
          schedule: updatedBooking.schedule,
          pickup: updatedBooking.pickup,
          delivery: updatedBooking.delivery,
          goods: updatedBooking.goods,
          customerName: user?.fullName || user?.name || "Customer",
          customerPhone: user?.phone || "Not provided",
          customerEmail: user?.email || "Not provided",
          finalPrice: updatedBooking.finalPrice,
        });
      }

      // Send notification to the driver via WebSocket if available
      if (global.wsServer) {
        try {
          const bookingSummary = {
            _id: updatedBooking._id,
            bookingId: updatedBooking.bookingId,
            pickup: updatedBooking.pickup,
            delivery: updatedBooking.delivery,
            schedule: updatedBooking.schedule,
            status: updatedBooking.status,
            finalPrice: updatedBooking.finalPrice,
          };

          global.wsServer.sendDriverNotification(
            driverId.toString(),
            "booking_confirmed",
            {
              message: "A new booking has been confirmed for you!",
              booking: bookingSummary,
            }
          );
        } catch (error) {
          // Continue processing since this is not critical
        }
      }

      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        booking: {
          _id: updatedBooking._id,
          bookingId: updatedBooking.bookingId,
          status: updatedBooking.status,
          assignedDriver: updatedBooking.assignedDriver,
        },
      });
    } catch (validationError) {
      console.error("Payment validation error:", validationError);
      return res.status(500).json({
        success: false,
        message: "Error validating payment data. Please try again.",
        details: validationError.message,
      });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Error verifying payment. Please try again.",
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
