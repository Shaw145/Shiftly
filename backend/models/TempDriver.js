const mongoose = require("mongoose");

const TempDriverSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  phoneOTP: {
    code: String,
    expiresAt: Date
  },
  emailOTP: {
    code: String,
    expiresAt: Date
  },
  createdAt: { type: Date, default: Date.now, expires: 600 } // Auto delete after 10 minutes
});

module.exports = mongoose.model("TempDriver", TempDriverSchema);