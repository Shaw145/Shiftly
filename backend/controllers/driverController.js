// backend/controllers/driverController.js
const Driver = require("../models/Driver");
const Booking = require("../models/Booking");
const emailService = require("../utils/emailService");

const getPublicDriverInfo = async (req, res) => {
  try {
    const { driverId } = req.params;

    // First try to find real driver data
    const driver = await Driver.findById(driverId);

    if (driver) {
      // Return real driver data
      const publicDriverInfo = {
        driverId: driver._id.toString(),
        fullName: driver.fullName,
        profileImage: driver.profileImage,
        rating: parseFloat(driver.rating) || 4.5,
        stats: {
          totalTrips: driver.stats?.totalTrips || driver.totalTrips || 0,
        },
        experience: driver.joinedDate
          ? `Since ${new Date(driver.joinedDate).getFullYear()}`
          : "Experienced Driver",
        vehicleDetails: driver.vehicleDetails
          ? {
              type: driver.vehicleDetails.basic?.type || "Transport Vehicle",
              make: driver.vehicleDetails.basic?.make || null,
              model: driver.vehicleDetails.basic?.model || null,
              year: driver.vehicleDetails.basic?.year || null,
              color: driver.vehicleDetails.basic?.color || null,
              loadCapacity:
                driver.vehicleDetails.specifications?.loadCapacity || null,
            }
          : null,
        isVerified: driver.isVerified,
      };

      return res.status(200).json({
        success: true,
        driver: publicDriverInfo,
      });
    }

    // Fallback to mock data if driver not found
    const mockDriverData = {
      driverId: driverId,
      fullName: "Driver " + driverId.substring(0, 4),
      profileImage:
        "https://randomuser.me/api/portraits/men/" +
        (parseInt(driverId.substring(0, 1), 16) % 99) +
        ".jpg",
      rating: (3 + Math.random() * 2).toFixed(1),
      stats: {
        totalTrips: Math.floor(Math.random() * 500) + 50,
      },
      experience: "Experienced Driver",
      vehicleDetails: {
        type: "Transport Vehicle",
        make: "Tata",
        model: "Ace",
        loadCapacity: "1000 kg",
      },
      isVerified: Math.random() > 0.5,
    };

    res.status(200).json({
      success: true,
      driver: mockDriverData,
    });
  } catch (error) {
    console.error("Error in getPublicDriverInfo:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching driver information",
      error: error.message,
    });
  }
};

// Get driver's confirmed bookings
const getDriverBookings = async (req, res) => {
  try {
    const driver = req.driver;
    const driverId = driver._id;

    // Find all bookings assigned to this driver (with status confirmed or later)
    // Using $or to check both driverId and assignedDriver fields
    const bookings = await Booking.find({
      $or: [{ driverId: driverId }, { assignedDriver: driverId }],
      status: {
        $in: ["confirmed", "pickup_reached", "in_transit", "delivered"],
      },
    }).sort({ confirmedAt: -1 }); // Sort by most recently confirmed first

    console.log(`Found ${bookings.length} bookings for driver ${driver._id}`);

    // Return actual bookings - no demo data
    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Error fetching driver bookings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch driver bookings",
      error: error.message,
    });
  }
};

// Get booking details for a driver's specific booking
const getDriverBookingDetails = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const driverId = req.driver._id;

    // Flexible search by either MongoDB id or booking reference ID
    let booking;

    // Check if it's a valid MongoDB ID
    if (/^[0-9a-fA-F]{24}$/.test(bookingId)) {
      booking = await Booking.findOne({
        _id: bookingId,
        $or: [{ driverId: driverId }, { assignedDriver: driverId }],
      })
        .populate("userId", "fullName email phone profileImage _id")
        .populate("payment")
        .populate({
          path: "vehicle",
          select: "type name capacity dimensions",
        });
    }

    // If not found, try to find by formatted ID
    if (!booking) {
      booking = await Booking.findOne({
        bookingId: bookingId,
        $or: [{ driverId: driverId }, { assignedDriver: driverId }],
      })
        .populate("userId", "fullName email phone profileImage _id")
        .populate("payment")
        .populate({
          path: "vehicle",
          select: "type name capacity dimensions",
        });
    }

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found or not assigned to you",
      });
    }

    // Log the customer details to ensure they're properly populated
    if (booking.userId) {
      console.log("Customer details:", {
        id: booking.userId._id,
        name: booking.userId.fullName,
        email: booking.userId.email,
        phone: booking.userId.phone,
      });
    } else {
      console.warn("No customer information available for booking:", bookingId);
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("Error fetching booking details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking details",
      error: error.message,
    });
  }
};

// Update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const driver = req.driver;
    const { bookingId } = req.params;
    const { status } = req.body;
    const driverId = driver._id;

    console.log(
      `Driver ${driverId} updating booking ${bookingId} status to: ${status}`
    );

    // Validate status
    const validStatuses = [
      "pickup_reached",
      "inTransit",
      "in_transit",
      "completed",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Valid statuses are: pickup_reached, inTransit, completed",
      });
    }

    // Find the booking, checking both driverId and assignedDriver fields
    let booking;

    // Check if it's a valid MongoDB ID
    if (/^[0-9a-fA-F]{24}$/.test(bookingId)) {
      booking = await Booking.findOne({
        _id: bookingId,
        $or: [{ driverId: driverId }, { assignedDriver: driverId }],
      }).populate("userId", "fullName email phone profileImage _id");
    }

    // If not found, try to find by formatted ID
    if (!booking) {
      booking = await Booking.findOne({
        bookingId: bookingId,
        $or: [{ driverId: driverId }, { assignedDriver: driverId }],
      }).populate("userId", "fullName email phone profileImage _id");
    }

    // For demo bookings, just return success
    if (
      !booking &&
      (bookingId.startsWith("booking") || bookingId.startsWith("B"))
    ) {
      console.log("Updating demo booking status:", bookingId, status);

      return res.status(200).json({
        success: true,
        message: `Demo booking status updated to ${status}`,
        booking: {
          _id: bookingId,
          bookingId: bookingId.startsWith("B")
            ? bookingId
            : `B${Math.floor(Math.random() * 1000000000)
                .toString()
                .padStart(9, "0")}`,
          status: status,
        },
        isDemo: true,
      });
    }

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found or not assigned to you",
      });
    }

    // Check if the status update is valid
    if (
      (status === "pickup_reached" && booking.status !== "confirmed") ||
      ((status === "inTransit" || status === "in_transit") &&
        booking.status !== "confirmed") ||
      (status === "completed" &&
        booking.status !== "inTransit" &&
        booking.status !== "in_transit")
    ) {
      return res.status(400).json({
        success: false,
        message: `Cannot update status to ${status} from ${booking.status}`,
      });
    }

    // Map the frontend status to database status if needed
    // Use consistent database status
    let dbStatus;
    if (status === "completed") {
      dbStatus = "delivered";
    } else if (status === "inTransit" || status === "in_transit") {
      dbStatus = "inTransit"; // Standardize to one format in database
    } else {
      dbStatus = status;
    }

    // Update booking status and add timestamp
    booking.status = dbStatus;

    // Add status-specific timestamps
    if (status === "pickup_reached") {
      booking.pickupReachedAt = new Date();
    } else if (status === "inTransit" || status === "in_transit") {
      booking.inTransitAt = new Date();
    } else if (status === "completed") {
      booking.deliveredAt = new Date();
      booking.completedAt = new Date();
    }

    // Notify the tracking system via WebSocket if available
    try {
      const trackingMessage = {
        status: dbStatus,
        message: `Driver updated status to ${status}`,
        timestamp: new Date().toISOString(),
      };

      // Send WebSocket notification if user is available
      const { broadcastBookingUpdate } = require("../websocket/server");
      if (booking.userId && typeof broadcastBookingUpdate === "function") {
        broadcastBookingUpdate(
          booking.userId._id.toString(),
          booking._id.toString(),
          {
            type: "booking_status_updated",
            payload: {
              bookingId: booking._id.toString(),
              status: dbStatus,
              message: trackingMessage.message,
              timestamp: trackingMessage.timestamp,
            },
          }
        );
        console.log(
          `Sent WebSocket notification to user ${booking.userId._id.toString()}`
        );
      }

      // Also update the tracking status directly through the model
      // This is more reliable than making an HTTP request
      if (!booking.trackingUpdates) {
        booking.trackingUpdates = [];
      }

      booking.trackingUpdates.push({
        status: dbStatus,
        timestamp: new Date(),
        message: `Driver updated status to ${status}`,
      });

      // Make sure to save the booking again with the tracking updates
      await booking.save();

      console.log(
        `Updated tracking status to ${dbStatus} for booking ${booking._id.toString()}`
      );
    } catch (wsError) {
      console.error("Tracking notification error:", wsError);
      // Continue processing as this should not fail the status update
    }

    res.status(200).json({
      success: true,
      message: `Booking status updated to ${status}`,
      booking: {
        _id: booking._id,
        bookingId: booking.bookingId,
        status: booking.status,
      },
    });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update booking status",
      error: error.message,
    });
  }
};

const acceptBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const driverId = req.driver._id;

    // Find booking with populated user information
    const booking = await Booking.findById(bookingId).populate(
      "userId",
      "name fullName email phone"
    );
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if the booking is already confirmed
    if (booking.status === "confirmed") {
      return res.status(400).json({
        success: false,
        message: "This booking is already confirmed",
      });
    }

    // Check if this driver has placed a bid on this booking
    const driverBid = booking.driverBids.find(
      (bid) => bid.driver.toString() === driverId.toString()
    );

    if (!driverBid) {
      return res.status(400).json({
        success: false,
        message: "You have not placed a bid on this booking",
      });
    }

    // Update the booking status to confirmed and assign the driver
    booking.status = "confirmed";
    booking.assignedDriver = driverId;
    booking.finalPrice = driverBid.price;
    booking.confirmedAt = new Date();
    await booking.save();

    // Get customer info from the populated user field
    const customerName =
      booking.userId?.fullName || booking.userId?.name || "Customer";
    const customerPhone = booking.userId?.phone || "Not provided";
    const customerEmail = booking.userId?.email || "Not provided";

    console.log(
      `Booking accepted - Customer info: ${customerName}, ${customerPhone}, ${customerEmail}`
    );

    // Send email to the driver
    try {
      await emailService.sendDriverBookingConfirmationEmail(req.driver.email, {
        bookingId: booking.bookingId || booking._id.toString(),
        schedule: booking.schedule,
        pickup: booking.pickup,
        delivery: booking.delivery,
        goods: booking.goods,
        finalPrice: booking.finalPrice,
        customer: {
          name: customerName,
          phone: customerPhone,
          email: customerEmail,
        },
        userName: customerName,
        userPhone: customerPhone,
        userEmail: customerEmail,
      });
      console.log(
        `Booking confirmation email sent to driver: ${req.driver.email}`
      );
    } catch (emailError) {
      console.error(
        "Error sending booking confirmation email to driver:",
        emailError
      );
      // Continue processing since email is not critical
    }

    return res.status(200).json({
      success: true,
      message: "Booking accepted successfully",
      booking: {
        _id: booking._id,
        bookingId: booking.bookingId,
        status: booking.status,
        finalPrice: booking.finalPrice,
      },
    });
  } catch (error) {
    console.error("Error accepting booking:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while accepting booking",
    });
  }
};

// Add this new function after getPublicDriverInfo
const getDriverContactInfo = async (req, res) => {
  try {
    const { driverId } = req.params;
    const token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required to access driver contact information",
      });
    }

    // First try to find real driver data
    const driver = await Driver.findById(driverId);

    if (driver) {
      // Return driver data with contact information
      const driverContactInfo = {
        driverId: driver._id.toString(),
        fullName: driver.fullName,
        profileImage: driver.profileImage,
        phone: driver.phone || "+91 9876543210", // Real phone with fallback
        email: driver.email || "driver@shiftly.com", // Real email with fallback
        rating: parseFloat(driver.rating) || 4.5,
        stats: {
          totalTrips: driver.stats?.totalTrips || driver.totalTrips || 0,
        },
        experience: driver.joinedDate
          ? `Since ${new Date(driver.joinedDate).getFullYear()}`
          : "Experienced Driver",
        vehicleDetails: driver.vehicleDetails
          ? {
              type: driver.vehicleDetails.basic?.type || "Transport Vehicle",
              make: driver.vehicleDetails.basic?.make || null,
              model: driver.vehicleDetails.basic?.model || null,
              year: driver.vehicleDetails.basic?.year || null,
              color: driver.vehicleDetails.basic?.color || null,
              loadCapacity:
                driver.vehicleDetails.specifications?.loadCapacity || null,
              registrationNumber:
                driver.vehicleDetails.registration?.number || null,
            }
          : null,
        isVerified: driver.isVerified,
      };

      return res.status(200).json({
        success: true,
        driver: driverContactInfo,
      });
    }

    // Fallback to mock data if driver not found
    const mockDriverData = {
      driverId: driverId,
      fullName: "Driver " + driverId.substring(0, 4),
      profileImage:
        "https://randomuser.me/api/portraits/men/" +
        (parseInt(driverId.substring(0, 1), 16) % 99) +
        ".jpg",
      phone:
        "+91 " +
        (
          8800000000 +
          (parseInt(driverId.substring(0, 8), 16) % 99999999)
        ).toString(),
      email: `driver${driverId.substring(0, 4)}@shiftly.com`,
      rating: (3 + Math.random() * 2).toFixed(1),
      stats: {
        totalTrips: Math.floor(Math.random() * 500) + 50,
      },
      experience: "Experienced Driver",
      vehicleDetails: {
        type: "Transport Vehicle",
        make: "Tata",
        model: "Ace",
        loadCapacity: "1000 kg",
        registrationNumber:
          "MH " +
          (10 + Math.floor(Math.random() * 89)) +
          " " +
          String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
          " " +
          (1000 + Math.floor(Math.random() * 9000)),
      },
      isVerified: Math.random() > 0.5,
    };

    res.status(200).json({
      success: true,
      driver: mockDriverData,
    });
  } catch (error) {
    console.error("Error in getDriverContactInfo:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching driver contact information",
      error: error.message,
    });
  }
};

module.exports = {
  getPublicDriverInfo,
  getDriverContactInfo,
  getDriverBookings,
  getDriverBookingDetails,
  updateBookingStatus,
  acceptBooking,
};
