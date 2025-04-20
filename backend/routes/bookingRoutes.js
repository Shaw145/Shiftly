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
const { protectDriver } = require("../middleware/driverAuthMiddleware");
const Booking = require("../models/Booking");
const Driver = require("../models/Driver");

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

// Get available bookings for drivers with optional radius filter
// Important: This route must come before the generic routes to avoid conflict
router.get("/available", protectDriver, async (req, res) => {
  try {
    const driver = req.driver;
    const radius = Number(req.query.radius) || 50; // Default to 50km if not specified

    // Log driver info (excluding sensitive data)
    console.log("Driver requesting available bookings:", {
      id: driver._id,
      username: driver.username,
      hasAddress: !!driver.personalDetails?.address?.current?.city,
      requestedRadius: radius,
    });

    // Check if driver has address information
    if (!driver.personalDetails?.address?.current?.city) {
      return res.status(400).json({
        success: false,
        message:
          "Please update your address information to view available bookings",
      });
    }

    // Get driver's location (city and state)
    const driverCity =
      driver.personalDetails.address.current.city.toLowerCase();
    const driverState =
      driver.personalDetails.address.current.state.toLowerCase();

    // Get bookings that are pending (not assigned) and within the specified radius
    // In a real implementation, you would use geospatial queries with driver's location
    // This is a simplified version that filters based on city/state proximity
    const bookings = await Booking.find({
      status: "pending",
      driverId: { $exists: false }, // Not assigned to any driver yet
    }).sort({ createdAt: -1 }); // Sort by newest first

    console.log(`Found ${bookings.length} pending bookings`);

    // Filter bookings based on simplified location proximity to driver
    // This is a basic implementation - in production you would use actual geospatial calculations
    const nearbyBookings = bookings.filter((booking) => {
      // Check if pickup city/state matches driver's location (basic proximity check)
      const pickupCity = (booking.pickup.city || "").toLowerCase();
      const pickupState = (booking.pickup.state || "").toLowerCase();

      // Normalize city names for more accurate matching
      const normalizedDriverCity = driverCity.trim();
      const normalizedPickupCity = pickupCity.trim();

      // Consider booking nearby if in same city or state as driver
      // Exact match or either city is contained within the other (handles partial/full city names)
      const isSameCity =
        normalizedDriverCity === normalizedPickupCity ||
        normalizedPickupCity.includes(normalizedDriverCity) ||
        normalizedDriverCity.includes(normalizedPickupCity);

      // For state matching, require exact match
      const isSameState = pickupState === driverState;

      // For radius-based filtering (placeholder for real distance calculation)
      // In production, use coordinates and calculate actual distance
      return isSameCity || (isSameState && radius >= 100); // Only consider state matches for larger radius searches
    });

    console.log(
      `Filtered to ${nearbyBookings.length} nearby bookings within radius ${radius}km`
    );

    // Map bookings to a simpler format for the frontend
    const formattedBookings = nearbyBookings.map((booking) => ({
      id: booking.bookingId,
      _id: booking._id,
      pickup: booking.pickup.city
        ? `${booking.pickup.city}, ${booking.pickup.state}`
        : "Location not available",
      destination: booking.delivery.city
        ? `${booking.delivery.city}, ${booking.delivery.state}`
        : "Location not available",
      pickupLocation: {
        address: `${booking.pickup.street || ""}, ${
          booking.pickup.city || ""
        }, ${booking.pickup.state || ""} ${
          booking.pickup.pincode || ""
        }`.trim(),
        city: booking.pickup.city,
        state: booking.pickup.state,
        pincode: booking.pickup.pincode,
      },
      deliveryLocation: {
        address: `${booking.delivery.street || ""}, ${
          booking.delivery.city || ""
        }, ${booking.delivery.state || ""} ${
          booking.delivery.pincode || ""
        }`.trim(),
        city: booking.delivery.city,
        state: booking.delivery.state,
        pincode: booking.delivery.pincode,
      },
      date: booking.schedule.date,
      time: booking.schedule.time,
      loadType: booking.goods.type,
      weight:
        booking.goods.items?.reduce(
          (total, item) =>
            total + (Number(item.weight) || 0) * (Number(item.quantity) || 1),
          0
        ) + " kg",
      dimensions: booking.goods.items?.length > 0 ? "Various" : "Not specified",
      distance: booking.distance
        ? `${booking.distance} km`
        : "Distance not available",
      expectedDuration: "Varies",
      priceRange: booking.estimatedPrice,
      status: booking.status,
      specialInstructions: booking.schedule.specialInstructions,
      description: `Transport from ${
        booking.pickup.city || "pickup location"
      } to ${booking.delivery.city || "destination"}`,
      requiresLoading: booking.goods.requiresLoading || false,
      vehiclePreference: booking.vehicle || "Not specified",
    }));

    res.status(200).json({
      success: true,
      count: formattedBookings.length,
      bookings: formattedBookings,
    });
  } catch (error) {
    console.error("Error fetching available bookings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch available bookings",
      error: error.message,
    });
  }
});

// Get specific available booking for drivers
router.get("/available/:id", protectDriver, async (req, res) => {
  try {
    const bookingId = req.params.id;
    const driver = req.driver;

    console.log(
      `Driver ${driver.username} requesting booking details for: ${bookingId}`
    );

    // Try to find booking by either MongoDB ID or formatted ID
    let booking;

    // Check if it's a valid MongoDB ID
    if (/^[0-9a-fA-F]{24}$/.test(bookingId)) {
      booking = await Booking.findById(bookingId);
    }

    // If not found, try to find by formatted ID
    if (!booking) {
      booking = await Booking.findOne({ bookingId: bookingId });
    }

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if booking is available (pending and not assigned)
    if (booking.status !== "pending" || booking.driverId) {
      return res.status(400).json({
        success: false,
        message: "This booking is no longer available",
        status: booking.status,
      });
    }

    // Format booking details for driver
    const formattedBooking = {
      _id: booking._id,
      id: booking.bookingId,
      pickup: booking.pickup.city
        ? `${booking.pickup.city}, ${booking.pickup.state}`
        : "Location not available",
      destination: booking.delivery.city
        ? `${booking.delivery.city}, ${booking.delivery.state}`
        : "Location not available",
      pickupLocation: {
        address: `${booking.pickup.street || ""}, ${
          booking.pickup.city || ""
        }, ${booking.pickup.state || ""} ${
          booking.pickup.pincode || ""
        }`.trim(),
        city: booking.pickup.city,
        state: booking.pickup.state,
        pincode: booking.pickup.pincode,
      },
      deliveryLocation: {
        address: `${booking.delivery.street || ""}, ${
          booking.delivery.city || ""
        }, ${booking.delivery.state || ""} ${
          booking.delivery.pincode || ""
        }`.trim(),
        city: booking.delivery.city,
        state: booking.delivery.state,
        pincode: booking.delivery.pincode,
      },
      date: booking.schedule.date,
      time: booking.schedule.time,
      pickupDate: booking.schedule.date,
      deliveryDate: booking.schedule.date, // This would be calculated in a real app
      loadType: booking.goods.type,
      goods: booking.goods,
      items: booking.goods.items,
      weight:
        booking.goods.items?.reduce(
          (total, item) =>
            total + (Number(item.weight) || 0) * (Number(item.quantity) || 1),
          0
        ) + " kg",
      distance: booking.distance
        ? `${booking.distance} km`
        : "Distance not available",
      priceRange: booking.estimatedPrice,
      status: booking.status,
      specialInstructions: booking.schedule.specialInstructions || "",
      vehiclePreference: booking.vehicle || "Not specified",
      driverBids: booking.driverBids || [],
    };

    res.status(200).json({
      success: true,
      booking: formattedBooking,
    });
  } catch (error) {
    console.error("Error fetching booking details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking details",
      error: error.message,
    });
  }
});

// Get driver bids for a specific booking (for customers)
router.get("/:bookingId/bids", protect, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user._id;

    console.log(`User ${userId} requesting bids for booking: ${bookingId}`);

    // Find the booking - support both MongoDB ID and formatted booking ID
    let booking;
    if (/^[0-9a-fA-F]{24}$/.test(bookingId)) {
      booking = await Booking.findById(bookingId);
    } else {
      booking = await Booking.findOne({ bookingId });
    }

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if the booking belongs to the requesting user
    if (booking.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to access this booking",
      });
    }

    // Check if booking has bids
    if (!booking.driverBids || booking.driverBids.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No bids placed on this booking yet",
        bids: [],
      });
    }

    // Format the bids with driver details
    const formattedBids = [];
    for (const bid of booking.driverBids) {
      try {
        // Get driver details but exclude sensitive information
        const driver = await Driver.findById(bid.driverId).select(
          "fullName username stats vehicleDetails profileImage"
        );

        // Skip bids from drivers we can't find
        if (!driver) continue;

        // Format the bid with driver details
        formattedBids.push({
          id: bid._id,
          _id: bid._id,
          driverId: bid.driverId,
          name: driver.fullName,
          username: driver.username,
          price: bid.price,
          amount: bid.price, // Add amount field for compatibility
          bidTime: bid.bidTime,
          note: bid.note || "",
          status: bid.status,
          rating: driver.stats?.rating || 4.5,
          trips: driver.stats?.totalTrips || 0,
          vehicle: driver.vehicleDetails?.basic?.make
            ? `${driver.vehicleDetails.basic.make} ${driver.vehicleDetails.basic.model}`
            : "Transport Vehicle",
          profileImage: driver.profileImage || null,
        });
      } catch (error) {
        console.error(`Error processing bid ${bid._id}:`, error);
        // Continue to next bid if there's an error with this one
      }
    }

    // Sort bids by price (lowest first)
    formattedBids.sort((a, b) => a.price - b.price);

    res.status(200).json({
      success: true,
      bids: formattedBids,
    });
  } catch (error) {
    console.error("Error fetching bids:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bids",
      error: error.message,
    });
  }
});

// POST endpoint for drivers to submit bids on bookings
router.post("/:id/bids", protectDriver, async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { price, note } = req.body;
    const driver = req.driver;

    // Validate bid price
    if (!price || isNaN(price) || price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid bid price is required",
      });
    }

    // Log the bid attempt
    console.log(
      `Driver ${driver._id} (${driver.name}) submitting bid: ${price} for booking: ${bookingId}`
    );

    // Find the booking - first check if it's a MongoDB ObjectId
    let booking;
    if (/^[0-9a-fA-F]{24}$/.test(bookingId)) {
      booking = await Booking.findById(bookingId);
    }

    // If not found, try to find by bookingId field
    if (!booking) {
      booking = await Booking.findOne({ bookingId: bookingId });
    }

    // Check if booking exists
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if booking is available for bidding (pending status and not assigned)
    if (booking.status !== "pending" || booking.driverId) {
      return res.status(400).json({
        success: false,
        message: "This booking is no longer available for bidding",
        status: booking.status,
      });
    }

    // Validate price against booking's estimated price range if available
    if (booking.estimatedPrice) {
      const minPrice = booking.estimatedPrice.min || 0;
      const maxPrice = booking.estimatedPrice.max;

      if (price < minPrice) {
        return res.status(400).json({
          success: false,
          message: `Bid price cannot be less than ₹${minPrice}`,
        });
      }

      if (maxPrice && price > maxPrice) {
        return res.status(400).json({
          success: false,
          message: `Bid price cannot exceed ₹${maxPrice}`,
        });
      }
    }

    // Check if driver has already placed a bid
    const existingBidIndex = booking.driverBids.findIndex(
      (bid) => bid.driverId.toString() === driver._id.toString()
    );

    // Handle bid update or new bid
    if (existingBidIndex !== -1) {
      // Update existing bid
      booking.driverBids[existingBidIndex].price = price;
      booking.driverBids[existingBidIndex].note = note;
      booking.driverBids[existingBidIndex].bidTime = new Date();
      booking.driverBids[existingBidIndex].status = "pending"; // Reset status if it was rejected
    } else {
      // Add new bid
      booking.driverBids.push({
        driverId: driver._id,
        price,
        note,
        status: "pending",
        bidTime: new Date(),
      });
    }

    // Save the updated booking
    await booking.save();

    // Attempt to notify the customer via WebSocket
    try {
      const { broadcast } = require("../websocket/server");

      console.log(
        `Attempting to broadcast bid update to user ${booking.userId}`,
        {
          bidId:
            existingBidIndex !== -1
              ? booking.driverBids[existingBidIndex]._id
              : booking.driverBids[booking.driverBids.length - 1]._id,
          bookingId: booking._id.toString(),
          bookingRefId: booking.bookingId,
        }
      );

      // Send both the MongoDB ID and the formatted booking ID for maximum compatibility
      broadcast(
        {
          type: "new_bid",
          payload: {
            bookingId: booking._id.toString(),
            bookingRefId: booking.bookingId, // Add formatted ID for better matching
            bid: {
              id:
                existingBidIndex !== -1
                  ? booking.driverBids[existingBidIndex]._id
                  : booking.driverBids[booking.driverBids.length - 1]._id,
              driverId: driver._id.toString(),
              price:
                existingBidIndex !== -1
                  ? booking.driverBids[existingBidIndex].price
                  : booking.driverBids[booking.driverBids.length - 1].price,
              amount:
                existingBidIndex !== -1
                  ? booking.driverBids[existingBidIndex].price
                  : booking.driverBids[booking.driverBids.length - 1].price, // Include both for compatibility
              name: driver.fullName || driver.username,
              rating: driver.stats?.rating || 4.5,
              trips: driver.stats?.totalTrips || 0,
              vehicle: driver.vehicleDetails?.basic?.make
                ? `${driver.vehicleDetails.basic.make} ${driver.vehicleDetails.basic.model}`
                : "Transport Vehicle",
              status:
                existingBidIndex !== -1
                  ? booking.driverBids[existingBidIndex].status
                  : booking.driverBids[booking.driverBids.length - 1].status,
              note:
                existingBidIndex !== -1
                  ? booking.driverBids[existingBidIndex].note
                  : booking.driverBids[booking.driverBids.length - 1].note,
              bidTime:
                existingBidIndex !== -1
                  ? booking.driverBids[existingBidIndex].bidTime
                  : booking.driverBids[booking.driverBids.length - 1].bidTime,
            },
          },
        },
        (client) => {
          const isMatch =
            client.role === "user" &&
            client.user.toString() === booking.userId.toString();

          console.log(
            `WebSocket client check: Role=${client.role}, UserMatch=${
              client.user.toString() === booking.userId.toString()
            }, IsMatch=${isMatch}`
          );

          return isMatch;
        }
      );

      console.log(`WebSocket notification sent to user ${booking.userId}`);
    } catch (wsError) {
      console.error("Error sending WebSocket notification:", wsError);
      // Continue even if WebSocket notification fails
    }

    // Return the updated bid information
    const updatedBid =
      existingBidIndex !== -1
        ? booking.driverBids[existingBidIndex]
        : booking.driverBids[booking.driverBids.length - 1];

    res.status(200).json({
      success: true,
      message:
        existingBidIndex !== -1
          ? "Bid updated successfully"
          : "Bid placed successfully",
      bid: {
        id: updatedBid._id,
        price: updatedBid.price,
        status: updatedBid.status,
        createdAt: updatedBid.bidTime,
      },
    });
  } catch (error) {
    console.error("Error processing bid:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process bid",
      error: error.message,
    });
  }
});

// Define other routes - Order matters!
router.get("/my-bookings", protect, getMyBookings);
router.get("/find/:bookingId", protect, findBooking);
router.post("/create", protect, createBooking);
router.get("/", protect, getBookings);
router.put("/:id/cancel", protect, cancelBooking);
router.get("/:id", protect, getBooking);

module.exports = router;
