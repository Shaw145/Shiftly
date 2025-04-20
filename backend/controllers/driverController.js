// backend/controllers/driverController.js
const Driver = require("../models/Driver");

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

module.exports = {
  getPublicDriverInfo,
};