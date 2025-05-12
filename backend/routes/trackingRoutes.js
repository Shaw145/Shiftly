const express = require("express");
const router = express.Router();
const { protect, driverProtect } = require("../middleware/authMiddleware");
const trackingController = require("../controllers/trackingController");

// Get tracking status
router.get("/status/:bookingId", protect, trackingController.getTrackingStatus);

// Get live location
router.get("/live/:bookingId", protect, trackingController.getLiveLocation);

// Update tracking status (for driver/admin)
router.put(
  "/update/:bookingId",
  protect,
  trackingController.updateTrackingStatus
);

// Update driver location (protected with driver middleware)
router.post(
  "/driver/location",
  driverProtect,
  trackingController.updateDriverLocation
);

module.exports = router;
