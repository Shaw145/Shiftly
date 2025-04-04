const Driver = require("../models/Driver");
const TempDriver = require("../models/TempDriver");
const { sendOTPviaSMS } = require("../utils/smsService");
const {
  sendOTPEmail,
  sendDriverOTPEmail,
  sendWelcomeEmail,
} = require("../utils/emailService");
const generateOTP = require("../utils/generateOTP");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Generate unique session token
const generateSessionToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Signup controller
exports.signup = async (req, res) => {
  try {
    const { fullName, username, email, phone, password } = req.body;

    // First, check if driver already exists with any of the unique fields
    const existingDriverEmail = await Driver.findOne({ email });
    const existingDriverPhone = await Driver.findOne({ phone });
    const existingDriverUsername = await Driver.findOne({ username });

    // Handle existing credentials with specific messages
    if (existingDriverEmail || existingDriverPhone || existingDriverUsername) {
      let errorMessage = [];
      if (existingDriverEmail) {
        errorMessage.push("Email is already registered");
      }
      if (existingDriverPhone) {
        errorMessage.push("Phone number is already registered");
      }
      if (existingDriverUsername) {
        errorMessage.push("Username is already taken");
      }
      return res.status(400).json({
        error: errorMessage.join(", "),
      });
    }

    // Generate OTPs
    const phoneOTP = generateOTP();
    const emailOTP = generateOTP();

    // Create temporary driver object but don't save yet
    const tempDriver = new TempDriver({
      fullName,
      username,
      email,
      phone,
      password,
      phoneOTP: {
        code: phoneOTP,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      },
      emailOTP: {
        code: emailOTP,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    try {
      // Try to send both OTPs first before saving anything
      await Promise.all([
        sendOTPviaSMS(phone, phoneOTP),
        sendDriverOTPEmail(email, emailOTP, fullName),
      ]);

      // If both OTPs are sent successfully, then save the temporary driver
      await tempDriver.save();

      res.status(201).json({
        message: "Verification codes sent to your phone and email",
        email,
        phone,
      });
    } catch (error) {
      // If any error occurs during OTP sending, don't save the temporary driver
      if (error.code === 21211) {
        // Twilio invalid phone number error
        return res.status(400).json({
          error:
            "Invalid phone number format. Please enter a valid 10-digit phone number",
        });
      }

      // For any other error during OTP sending
      console.error("OTP Sending Error:", error);
      return res.status(500).json({
        error: "Failed to send verification codes. Please try again.",
      });
    }
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({
      error: error.message || "Registration failed. Please try again.",
    });
  }
};

// Verify OTP controller
exports.verifyOTP = async (req, res) => {
  try {
    const { email, phone, phoneOTP, emailOTP } = req.body;

    const tempDriver = await TempDriver.findOne({
      email,
      phone,
      "phoneOTP.expiresAt": { $gt: new Date() },
      "emailOTP.expiresAt": { $gt: new Date() },
    });

    if (!tempDriver) {
      return res.status(404).json({ error: "Registration session expired" });
    }

    // Convert OTPs to strings for comparison
    if (
      tempDriver.phoneOTP.code.toString() !== phoneOTP.toString() ||
      tempDriver.emailOTP.code.toString() !== emailOTP.toString()
    ) {
      return res.status(400).json({ error: "Invalid OTP codes" });
    }

    // Create new driver
    const driver = new Driver({
      fullName: tempDriver.fullName,
      username: tempDriver.username,
      email: tempDriver.email,
      phone: tempDriver.phone,
      password: tempDriver.password,
      isPhoneVerified: true,
      isEmailVerified: true,
    });

    await driver.save();
    await TempDriver.deleteOne({ _id: tempDriver._id });

    // Generate session token and create JWT
    const sessionToken = generateSessionToken();
    const token = jwt.sign(
      { driverId: driver._id, sessionToken },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Save session
    driver.sessions.push({
      token: sessionToken,
      deviceInfo: req.headers["user-agent"],
      lastLogin: new Date(),
      isActive: true,
    });
    await driver.save();

    // Send welcome email
    await sendWelcomeEmail(driver.email, driver.fullName);

    res.status(200).json({
      token,
      driver: {
        id: driver._id,
        fullName: driver.fullName,
        username: driver.username,
        email: driver.email,
        phone: driver.phone,
      },
    });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    res.status(500).json({ error: "Verification failed" });
  }
};

// Login controller
exports.login = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    // Find driver
    const driver = await Driver.findOne({
      $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
    });

    if (!driver) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Verify password
    const isMatch = await driver.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate new session token
    const sessionToken = generateSessionToken();

    // Create JWT token
    const token = jwt.sign(
      {
        driverId: driver._id,
        sessionToken,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Save new session
    driver.sessions.push({
      token: sessionToken,
      deviceInfo: req.headers["user-agent"],
      lastLogin: new Date(),
      isActive: true,
    });
    await driver.save();

    res.status(200).json({
      token,
      driver: {
        id: driver._id,
        fullName: driver.fullName,
        username: driver.username,
        email: driver.email,
        phone: driver.phone,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

// exports.resendOTP = async (req, res) => {
//   try {
//     const { email, phone } = req.body;

//     const tempDriver = await TempDriver.findOne({ email, phone });
//     if (!tempDriver) {
//       return res.status(404).json({ error: "Registration session expired" });
//     }

//     // Generate new OTPs
//     const phoneOTP = generateOTP();
//     const emailOTP = generateOTP();

//     // Update OTPs
//     tempDriver.phoneOTP = {
//       code: phoneOTP,
//       expiresAt: new Date(Date.now() + 10 * 60 * 1000),
//     };
//     tempDriver.emailOTP = {
//       code: emailOTP,
//       expiresAt: new Date(Date.now() + 10 * 60 * 1000),
//     };

//     await tempDriver.save();

//     // Send new OTPs
//     await Promise.all([
//       sendOTPviaSMS(phone, phoneOTP),
//       sendDriverOTPEmail(email, emailOTP, tempDriver.fullName),
//     ]);

//     res.status(200).json({ message: "New OTPs sent successfully" });
//   } catch (error) {
//     console.error("Resend OTP Error:", error);
//     res.status(500).json({ error: "Failed to resend OTPs" });
//   }
// };

// Add this new controller function
exports.checkUsername = async (req, res) => {
  try {
    const { username } = req.query;
    const existingDriver = await Driver.findOne({ username });
    res.json({ isAvailable: !existingDriver });
  } catch (error) {
    console.error("Username check error:", error);
    res.status(500).json({ error: "Failed to check username availability" });
  }
};

exports.checkSession = async (req, res) => {
  try {
    const { email, phone } = req.body;
    const tempDriver = await TempDriver.findOne({
      email,
      phone,
      "phoneOTP.expiresAt": { $gt: new Date() },
      "emailOTP.expiresAt": { $gt: new Date() },
    });

    if (!tempDriver) {
      return res.status(404).json({ error: "Session expired" });
    }

    res.status(200).json({ valid: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to check session" });
  }
};

exports.cancelRegistration = async (req, res) => {
  try {
    const { email, phone } = req.body;
    await TempDriver.deleteOne({ email, phone });
    res.status(200).json({ message: "Registration cancelled" });
  } catch (error) {
    res.status(500).json({ error: "Failed to cancel registration" });
  }
};
