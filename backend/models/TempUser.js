const mongoose = require("mongoose");

const TempUserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 }, // Automatically delete after 10 minutes
});

module.exports = mongoose.model("TempUser", TempUserSchema);