const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const TempUser = require("../models/TempUser");
const { protect } = require("../middleware/authMiddleware");
const { sendOTPEmail } = require("../utils/emailService");
const generateOTP = require("../utils/generateOTP");
const router = express.Router();

// Protected route example
router.get("/dashboard", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Signup
router.post("/signup", async (req, res) => {
  const { fullName, username, email, password, confirmPassword } = req.body;

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  let tempUser;
  try {
    // Check if email or username already exists in TempUser or User collection
    const existingTempUser = await TempUser.findOne({
      $or: [{ email }, { username }],
    });
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingTempUser || existingUser) {
      return res
        .status(400)
        .json({ error: "Email or username already in use" });
    }

    // Create new temporary user
    const otp = generateOTP();
    tempUser = new TempUser({ fullName, username, email, password, otp });
    await tempUser.save();

    // Send OTP email
    await sendOTPEmail(email, otp);

    // Send success response with email and username
    res.status(201).json({
      message: "User created successfully. Please verify your email.",
      email,
      username,
    });
  } catch (error) {
    console.error("Signup Error:", error); // Log the error

    // Rollback: Delete the temporary user if an error occurs
    if (tempUser) {
      await TempUser.deleteOne({ _id: tempUser._id });
    }

    res.status(500).json({ error: "Something went wrong" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { usernameOrEmail, password, rememberMe } = req.body;

  try {
    // Find user by email or username
    const user = await User.findOne({
      $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid email or username" });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res
        .status(400)
        .json({ error: "Please verify your email to log in." });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: rememberMe ? "7d" : "2d", // 7 days for "Remember Me", 2 days otherwise
    });

    res
      .status(200)
      .json({ token, fullName: user.fullName, username: user.username });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Add a route to check username availability
router.get("/check-username", async (req, res) => {
  const { username } = req.query;

  try {
    const existingUser = await User.findOne({ username });
    res.status(200).json({ isAvailable: !existingUser });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
