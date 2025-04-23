const express = require("express");
const router = express.Router();
const { protectDriver } = require("../middleware/driverAuthMiddleware");
const Driver = require("../models/Driver");
const driverProfileController = require("../controllers/driverProfileController");
const upload = require("../middleware/uploadMiddleware");
const driverController = require("../controllers/driverController");

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

router.get("/me/profile", protectDriver, driverProfileController.getProfile);
router.put(
  "/profile/personal",
  protectDriver,
  driverProfileController.updatePersonalDetails
);
router.put(
  "/profile/bank",
  protectDriver,
  driverProfileController.updateBankDetails
);
router.put(
  "/profile/vehicle",
  protectDriver,
  driverProfileController.updateVehicleDetails
);

// Quick address update endpoint
router.put("/profile/address", protectDriver, async (req, res) => {
  try {
    console.log("Quick address update requested");

    // Validate the request
    if (!req.body.address || !req.body.address.current) {
      return res.status(400).json({
        success: false,
        error: "Address data is required",
      });
    }

    // Get the required fields
    const { city, state, pincode, addressLine1 } = req.body.address.current;

    // Make sure required fields are present
    if (!city || !state || !pincode) {
      return res.status(400).json({
        success: false,
        error: "City, state, and pincode are required",
      });
    }

    // Get the driver
    const driver = req.driver;

    // Initialize the personalDetails and address objects if they don't exist
    if (!driver.personalDetails) {
      driver.personalDetails = {};
    }

    if (!driver.personalDetails.address) {
      driver.personalDetails.address = {};
    }

    if (!driver.personalDetails.address.current) {
      driver.personalDetails.address.current = {};
    }

    // Update the address fields
    driver.personalDetails.address.current.city = city;
    driver.personalDetails.address.current.state = state;
    driver.personalDetails.address.current.pincode = pincode;

    // Add address line if provided
    if (addressLine1) {
      driver.personalDetails.address.current.addressLine1 = addressLine1;
    }

    // Save the driver
    await driver.save();

    console.log("Address updated successfully:", {
      city,
      state,
      pincode,
      addressLine1,
    });

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      address: driver.personalDetails.address.current,
    });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update address",
      details: error.message,
    });
  }
});

router.post(
  "/upload-photo",
  protectDriver,
  upload.single("profileImage"),
  driverProfileController.uploadProfilePhoto
);
router.delete(
  "/remove-photo",
  protectDriver,
  driverProfileController.removeProfilePhoto
);

router.get("/:driverId/public", driverController.getPublicDriverInfo);

module.exports = router;