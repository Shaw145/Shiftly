const User = require("../models/User");
const TempUser = require("../models/TempUser");
const { sendOTPEmail, sendWelcomeEmail } = require("../utils/emailService");
const generateOTP = require("../utils/generateOTP");
const jwt = require("jsonwebtoken");

// Send OTP for email verification
const sendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const otp = generateOTP();
    user.otp = otp;
    await user.save();

    await sendOTPEmail(email, otp);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Find the temporary user
    const tempUser = await TempUser.findOne({ email });
    if (!tempUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare OTPs
    if (tempUser.otp !== otp.toString().trim()) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // Create a new user in the main collection
    const user = new User({
      fullName: tempUser.fullName,
      username: tempUser.username,
      email: tempUser.email,
      password: tempUser.password,
      isEmailVerified: true,
    });
    await user.save();

    // Delete the temporary user
    await TempUser.deleteOne({ email });

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2d", // Token expires in 2 days
    });

    // Send welcome email
    await sendWelcomeEmail(email, user.fullName);

    // Send complete user data to frontend
    res.status(200).json({
      token,
      fullName: user.fullName,
      username: user.username, // Make sure this is included
      success: true,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = { sendOTP, verifyOTP };
