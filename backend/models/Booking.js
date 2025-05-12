const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
      match: /^B\d{9}$/,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    status: {
      type: String,
      required: true,
      enum: [
        "pending",
        "confirmed",
        "pickup_reached",
        "in_transit",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    cancelledAt: {
      type: Date,
    },
    cancellationReason: {
      type: String,
    },
    pickup: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      landmark: String,
    },
    delivery: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      landmark: String,
    },
    goods: {
      type: {
        type: String,
        required: true,
        enum: [
          "household_small",
          "household_medium",
          "household_large",
          "light",
          "heavy",
        ],
      },
      items: [
        {
          name: String,
          weight: Number,
          quantity: Number,
        },
      ],
      additionalItems: String,
    },
    vehicle: String,
    schedule: {
      date: Date,
      time: String,
      urgency: String,
      insurance: String,
      specialInstructions: String,
    },
    distance: Number,
    estimatedPrice: {
      min: Number,
      max: Number,
    },
    finalPrice: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
    },
    assignedDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
    },
    confirmedAt: {
      type: Date,
    },
    pickupReachedAt: {
      type: Date,
    },
    inTransitAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    driverBids: [
      {
        driverId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Driver",
        },
        price: Number,
        status: {
          type: String,
          enum: ["pending", "accepted", "rejected"],
          default: "pending",
        },
        bidTime: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    trackingUpdates: [
      {
        status: String,
        location: {
          lat: Number,
          lng: Number,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        message: String,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Pre-save middleware to generate bookingId if not present
bookingSchema.pre("save", function (next) {
  if (!this.bookingId) {
    const randomNum = Math.floor(Math.random() * 1000000000)
      .toString()
      .padStart(9, "0");
    this.bookingId = `B${randomNum}`;
  }
  next();
});

// Add compound index
bookingSchema.index({ bookingId: 1, userId: 1 });

// Add this static method to help find bookings by either ID format
bookingSchema.statics.findByAnyId = async function (id) {
  let booking;

  // Try finding by formatted ID first
  if (id.startsWith("B") && id.length === 10) {
    booking = await this.findOne({ bookingId: id });
  }

  // If not found and it's a valid MongoDB ID, try that
  if (!booking && mongoose.Types.ObjectId.isValid(id)) {
    booking = await this.findById(id);
  }

  return booking;
};

// Add this to help with debugging
bookingSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id; // Add this if you need it in the frontend
  return obj;
};

const Booking = mongoose.model("Booking", bookingSchema);

// Ensure indexes are created
Booking.createIndexes()
  .then(() => {
    console.log("Booking indexes created");
  })
  .catch((err) => {
    console.error("Error creating booking indexes:", err);
  });

module.exports = Booking;
