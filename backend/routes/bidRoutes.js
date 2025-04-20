const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { protectDriver } = require("../middleware/driverAuthMiddleware");
const bidController = require("../controllers/bidController");

/**
 * @route   GET /api/bids/booking/:bookingId
 * @desc    Get all bids for a specific booking
 * @access  Private (authenticated users and drivers)
 */
router.get(
  "/booking/:bookingId",
  protect,
  (req, res, next) => {
    req.role = "user";
    next();
  },
  bidController.getBookingBids
);

/**
 * @route   GET /api/bids/driver/booking/:bookingId
 * @desc    Get all bids for a specific booking (driver view)
 * @access  Private (drivers only)
 */
router.get(
  "/driver/booking/:bookingId",
  protectDriver,
  (req, res, next) => {
    req.role = "driver";
    next();
  },
  bidController.getBookingBids
);

/**
 * @route   GET /api/bids/driver
 * @desc    Get all bids placed by the current driver
 * @access  Private (drivers only)
 */
router.get("/driver", protectDriver, bidController.getDriverBids);

/**
 * @route   GET /api/bids/:bidId
 * @desc    Get a specific bid by ID
 * @access  Private (authenticated users and drivers)
 */
router.get(
  "/:bidId",
  protectDriver,
  (req, res, next) => {
    req.role = "driver";
    next();
  },
  bidController.getBidById
);

/**
 * @route   POST /api/bids/place
 * @desc    Place a new bid or update existing bid
 * @access  Private (drivers only)
 */
router.post("/place", protectDriver, bidController.placeBid);

/**
 * @route   DELETE /api/bids/:bidId
 * @desc    Cancel a bid
 * @access  Private (drivers only)
 */
router.delete("/:bidId", protectDriver, bidController.cancelBid);

module.exports = router;
