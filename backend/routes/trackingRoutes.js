const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const trackingController = require("../controllers/trackingController");

// Get tracking status
router.get("/status/:bookingId", protect, trackingController.getTrackingStatus);

// Get live location
router.get("/live/:bookingId", protect, trackingController.getLiveLocation);

// Update tracking status (for driver/admin)
router.put("/update/:bookingId", protect, trackingController.updateTrackingStatus);

module.exports = router;