const express = require("express");
const router = express.Router();
const { protectDriver } = require("../middleware/driverAuthMiddleware");
const Driver = require("../models/Driver");

router.get("/me", protectDriver, async (req, res) => {
  try {
    // Since we already have the driver from the middleware
    const driver = req.driver;

    // Don't send sensitive information
    const driverData = {
      id: driver._id,
      fullName: driver.fullName,
      username: driver.username,
      email: driver.email,
      phone: driver.phone,
      isPhoneVerified: driver.isPhoneVerified,
      isEmailVerified: driver.isEmailVerified,
      isAvailable: driver.isAvailable,
    };

    res.json(driverData);
  } catch (error) {
    res.status(500).json({ error: "Error fetching driver data" });
  }
});

router.post("/logout", protectDriver, async (req, res) => {
  try {
    const driver = req.driver;
    const sessionToken = req.decoded.sessionToken;

    // Find and deactivate the current session
    const session = driver.sessions.find((s) => s.token === sessionToken);
    if (session) {
      session.isActive = false;
    }
    await driver.save();

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error logging out" });
  }
});

router.get("/profile/:username", protectDriver, async (req, res) => {
  try {
    const { username } = req.params;
    const driver = await Driver.findOne({ username });

    if (!driver) {
      return res.status(404).json({ error: "Driver not found" });
    }

    // Return driver data excluding sensitive information
    const driverData = {
      fullName: driver.fullName,
      username: driver.username,
      email: driver.email,
      phone: driver.phone,
      dateOfBirth: driver.dateOfBirth,
      gender: driver.gender,
      address: driver.address,
      bankDetails: driver.bankDetails,
      vehicle: driver.vehicle,
      drivingLicense: driver.drivingLicense,
      isEmailVerified: driver.isEmailVerified,
      isPhoneVerified: driver.isPhoneVerified,
    };

    res.json(driverData);
  } catch (error) {
    res.status(500).json({ error: "Error fetching driver profile" });
  }
});

router.get("/me/profile", protectDriver, async (req, res) => {
  try {
    const driver = req.driver;

    // Return driver data excluding sensitive information
    const driverData = {
      fullName: driver.fullName,
      username: driver.username,
      email: driver.email,
      phone: driver.phone,
      dateOfBirth: driver.dateOfBirth,
      gender: driver.gender,
      address: driver.address,
      bankDetails: driver.bankDetails,
      vehicle: driver.vehicle,
      drivingLicense: driver.drivingLicense,
      isEmailVerified: driver.isEmailVerified,
      isPhoneVerified: driver.isPhoneVerified,
    };

    res.json(driverData);
  } catch (error) {
    res.status(500).json({ error: "Error fetching driver profile" });
  }
});

module.exports = router;
