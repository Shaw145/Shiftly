const Booking = require("../models/Booking");

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
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      });
    }

    // For now, return dummy location
    res.status(200).json({
      success: true,
      location: {
        lat: 28.6139,
        lng: 77.209,
        lastUpdated: new Date(),
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
