const express = require("express");
const router = express.Router();
const { protect, driverProtect } = require("../middleware/authMiddleware");
const trackingController = require("../controllers/trackingController");
const { verifyToken } = require("../middleware/auth");
const { verifyDriver } = require("../middleware/driverAuth");
const { verifyAdmin } = require("../middleware/adminAuth");

// Get tracking status
router.get("/status/:bookingId", protect, trackingController.getTrackingStatus);

// Get live location
router.get("/live/:bookingId", protect, trackingController.getLiveLocation);

// Public tracking route - no authentication required
router.get("/public/:bookingId", trackingController.getPublicTrackingStatus);

// Public location route - no authentication required
router.get("/public/:bookingId/location", trackingController.getPublicLocation);

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

// Routes accessible to users, drivers, and admins
router.get(
  "/:bookingId/location",
  verifyToken,
  trackingController.getLastLocation
);
router.get(
  "/:bookingId/location",
  verifyDriver,
  trackingController.getLastLocation
);
router.get(
  "/:bookingId/location",
  verifyAdmin,
  trackingController.getLastLocation
);

router.get(
  "/:bookingId/history",
  verifyToken,
  trackingController.getTrackingHistory
);
router.get(
  "/:bookingId/history",
  verifyDriver,
  trackingController.getTrackingHistory
);
router.get(
  "/:bookingId/history",
  verifyAdmin,
  trackingController.getTrackingHistory
);

router.get(
  "/:bookingId/subscribe",
  verifyToken,
  trackingController.subscribeToUpdates
);
router.get(
  "/:bookingId/subscribe",
  verifyDriver,
  trackingController.subscribeToUpdates
);
router.get(
  "/:bookingId/subscribe",
  verifyAdmin,
  trackingController.subscribeToUpdates
);

module.exports = router;
