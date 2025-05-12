const Booking = require("../models/Booking");
const Driver = require("../models/Driver");

exports.getTrackingStatus = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      $or: [{ _id: req.params.bookingId }, { bookingId: req.params.bookingId }],
    }).populate("driverId");

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      });
    }

    // Define tracking steps
    const steps = {
      pending: 0,
      confirmed: 1,
      pickup_reached: 2,
      in_transit: 3,
      delivered: 4,
    };

    const currentStep = steps[booking.status] || 0;

    res.status(200).json({
      success: true,
      tracking: {
        currentStep,
        status: booking.status,
        driver: booking.driverId
          ? {
              name: booking.driverId.name,
              phone: booking.driverId.phone,
              vehicle: booking.driverId.vehicle,
            }
          : null,
        lastUpdated: booking.updatedAt,
        booking: booking, // Include the full booking object
      },
    });
  } catch (error) {
    console.error("Tracking status error:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching tracking status",
    });
  }
};

exports.getLiveLocation = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      $or: [{ _id: req.params.bookingId }, { bookingId: req.params.bookingId }],
    }).populate("driverId");

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      });
    }

    // If no driver is assigned yet
    if (!booking.driverId) {
      return res.status(404).json({
        success: false,
        error: "No driver assigned to this booking",
      });
    }

    // Get the driver's current location
    const driver = await Driver.findById(booking.driverId);

    if (
      !driver ||
      !driver.currentLocation ||
      !driver.currentLocation.coordinates
    ) {
      // Return dummy location if no real location is available
      return res.status(200).json({
        success: true,
        location: {
          lat: 28.6139,
          lng: 77.209,
          lastUpdated: new Date(),
          isLive: false,
        },
      });
    }

    // Return the driver's actual location
    const [longitude, latitude] = driver.currentLocation.coordinates;

    res.status(200).json({
      success: true,
      location: {
        lat: latitude,
        lng: longitude,
        lastUpdated: driver.currentLocation.lastUpdated || new Date(),
        isLive: true,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error fetching live location",
    });
  }
};

exports.updateTrackingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findOne({
      $or: [{ _id: req.params.bookingId }, { bookingId: req.params.bookingId }],
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error updating tracking status",
    });
  }
};

exports.updateDriverLocation = async (req, res) => {
  try {
    const { bookingId, location } = req.body;

    if (!bookingId || !location || !location.lat || !location.lng) {
      return res.status(400).json({
        success: false,
        error: "Booking ID and location coordinates are required",
      });
    }

    // Find the booking
    const booking = await Booking.findOne({
      $or: [{ _id: bookingId }, { bookingId: bookingId }],
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      });
    }

    // Verify the driver is assigned to this booking
    if (
      !booking.driverId ||
      booking.driverId.toString() !== req.driver._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        error: "You are not authorized to update this booking's location",
      });
    }

    // Update the driver's current location
    const driver = req.driver;
    driver.currentLocation = {
      type: "Point",
      coordinates: [location.lng, location.lat], // GeoJSON format is [longitude, latitude]
      lastUpdated: new Date(),
    };

    await driver.save();

    // Add location update to booking tracking history
    booking.trackingUpdates = booking.trackingUpdates || [];
    booking.trackingUpdates.push({
      status: booking.status,
      timestamp: new Date(),
      location: {
        lat: location.lat,
        lng: location.lng,
      },
      message: "Driver location updated",
    });

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Location updated successfully",
    });
  } catch (error) {
    console.error("Error updating driver location:", error);
    res.status(500).json({
      success: false,
      error: "Error updating driver location",
    });
  }
};
