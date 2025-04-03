const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createBooking,
  getBookings,
  getBooking,
  cancelBooking,
  findBooking,
  getMyBookings,
} = require("../controllers/bookingController");

// Log all requests to booking routes
router.use((req, res, next) => {
  console.log("Booking Route:", {
    method: req.method,
    url: req.url,
    params: req.params,
    query: req.query,
    body: req.body,
  });
  next();
});

// Define routes - Order matters!
router.get("/my-bookings", protect, getMyBookings);
router.get("/find/:bookingId", protect, findBooking);
router.post("/create", protect, createBooking);
router.get("/", protect, getBookings);
router.put("/:id/cancel", protect, cancelBooking);
router.get("/:id", protect, getBooking);

module.exports = router;
