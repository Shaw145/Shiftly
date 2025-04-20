const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Schema for Bid model that stores driver bids on bookings
 */
const BidSchema = new Schema(
  {
    // Reference to the booking this bid is for
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: [true, "Booking ID is required"],
    },

    // Reference to the driver who placed the bid
    driver: {
      type: Schema.Types.ObjectId,
      ref: "Driver",
      required: [true, "Driver ID is required"],
    },

    // Bid amount in INR
    amount: {
      type: Number,
      required: [true, "Bid amount is required"],
      min: [1, "Bid amount must be positive"],
    },

    // Optional notes from driver about the bid
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },

    // Bid status
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "cancelled", "expired"],
      default: "pending",
    },

    // Flag to indicate if the bid is still active or has been canceled/removed
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for quick lookups
BidSchema.index({ booking: 1, driver: 1 }, { unique: true });
BidSchema.index({ driver: 1, isActive: 1 });
BidSchema.index({ booking: 1, isActive: 1 });

// Virtual for time since bid was placed
BidSchema.virtual("timeSince").get(function () {
  return Date.now() - this.createdAt;
});

// Methods

/**
 * Check if this bid can be updated
 * @returns {Boolean} - True if bid can be updated, false otherwise
 */
BidSchema.methods.canUpdate = function () {
  return this.status === "pending" && this.isActive;
};

/**
 * Check if this bid can be accepted
 * @returns {Boolean} - True if bid can be accepted, false otherwise
 */
BidSchema.methods.canAccept = function () {
  return this.status === "pending" && this.isActive;
};

// Static methods

/**
 * Find active bid by driver and booking
 */
BidSchema.statics.findActiveBidByDriverAndBooking = async function (
  driverId,
  bookingId
) {
  return this.findOne({
    driver: driverId,
    booking: bookingId,
    isActive: true,
  });
};

/**
 * Find all active bids for a booking
 */
BidSchema.statics.findAllActiveBookingBids = async function (bookingId) {
  return this.find({
    booking: bookingId,
    isActive: true,
  }).populate("driver", "name profileImage phone rating");
};

module.exports = mongoose.model("Bid", BidSchema);
