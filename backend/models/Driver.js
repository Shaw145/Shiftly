const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const DriverSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isPhoneVerified: { type: Boolean, default: false },
  isEmailVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  isAvailable: { type: Boolean, default: false },

  // Personal Information
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ["male", "female", "other"] },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
  },

  // Vehicle Information
  vehicle: {
    type: { type: String, enum: ["truck", "van", "bike"] },
    model: String,
    registrationNumber: String,
    capacity: Number,
    documents: [
      {
        type: { type: String },
        url: String,
        verified: { type: Boolean, default: false },
      },
    ],
  },

  // License Information
  drivingLicense: {
    number: String,
    expiryDate: Date,
    verified: { type: Boolean, default: false },
  },

  // Business Information
  bankDetails: {
    accountHolder: String,
    accountNumber: String,
    ifscCode: String,
    bankName: String,
    verified: { type: Boolean, default: false },
  },

  // Stats and Ratings
  stats: {
    totalTrips: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
  },

  // Location tracking
  currentLocation: {
    type: {
      type: String,
      default: "Point",
    },
    coordinates: {
      type: [Number],
      default: [0, 0], // Default coordinates
    },
    lastUpdated: Date,
  },

  // Session Management
  sessions: [
    {
      token: String,
      deviceInfo: String,
      lastLogin: Date,
      isActive: { type: Boolean, default: true },
    },
  ],

  // Verification and Security
  phoneOTP: {
    code: String,
    expiresAt: Date,
  },
  emailOTP: {
    code: String,
    expiresAt: Date,
  },

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Index for location-based queries
DriverSchema.index({ currentLocation: "2dsphere" });

// Password hashing middleware
DriverSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
DriverSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Driver", DriverSchema);
