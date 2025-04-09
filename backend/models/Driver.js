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
  profileImage: { type: String },
  isVerified: { type: Boolean, default: false },
  totalTrips: { type: Number, default: 0 },
  rating: { type: String, default: "0.0" },
  joinedDate: { type: Date, default: Date.now },

  // Personal Details
  personalDetails: {
    firstName: { type: String },
    middleName: { type: String },
    lastName: { type: String },
    dateOfBirth: { type: String },
    gender: { type: String, enum: ["male", "female", "other"] },
    contact: {
      mobile: { type: String },
      alternateMobile: { type: String },
      email: { type: String },
      isMobileVerified: { type: Boolean, default: false },
      isEmailVerified: { type: Boolean, default: false },
    },
    address: {
      current: {
        addressLine1: String,
        addressLine2: String,
        city: String,
        state: String,
        pincode: String,
      },
    },
    documents: {
      drivingLicense: {
        number: String,
        file: String,
        status: {
          type: String,
          enum: ["pending", "verifying", "verified"],
          default: "pending",
        },
      },
      aadhaar: {
        number: String,
        file: String,
        status: {
          type: String,
          enum: ["pending", "verifying", "verified"],
          default: "pending",
        },
      },
      panCard: {
        number: String,
        file: String,
        status: {
          type: String,
          enum: ["pending", "verifying", "verified"],
          default: "pending",
        },
      },
    },
  },

  // Bank Details
  bankDetails: {
    accountHolder: String,
    accountNumber: String,
    bankName: String,
    ifscCode: String,
    branchDetails: String,
    payoutFrequency: { type: String, enum: ["monthly", "per_delivery"] },
    isVerified: { type: Boolean, default: false },
    documents: {
      passbook: {
        file: String,
        status: {
          type: String,
          enum: ["pending", "verifying", "verified"],
          default: "pending",
        },
      },
    },
  },

  // Vehicle Details
  vehicleDetails: {
    basic: {
      type: {
        type: String,
        enum: ["mini_truck", "tempo", "large_truck", "container_truck"],
      },
      make: String,
      model: String,
      year: String,
      color: String,
    },
    registration: {
      number: String,
      date: String,
      rcFront: String,
      rcBack: String,
      rcFrontStatus: {
        type: String,
        enum: ["pending", "verifying", "verified"],
        default: "pending",
      },
      rcBackStatus: {
        type: String,
        enum: ["pending", "verifying", "verified"],
        default: "pending",
      },
      fitnessExpiryDate: String,
      permitType: { type: String, enum: ["national", "state"] },
      isVerified: { type: Boolean, default: false },
    },
    specifications: {
      loadCapacity: String,
      dimensions: {
        length: String,
        width: String,
        height: String,
      },
      features: [String],
      fuelType: { type: String, enum: ["diesel", "petrol", "cng", "electric"] },
    },
    insurance: {
      provider: String,
      policyNumber: String,
      expiryDate: String,
      document: String,
      documentStatus: {
        type: String,
        enum: ["pending", "verifying", "verified"],
        default: "pending",
      },
      isVerified: { type: Boolean, default: false },
    },
    maintenance: {
      lastServiceDate: String,
      nextServiceDue: String,
      odometer: String,
      healthScore: { type: Number, default: 0 },
    },
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
