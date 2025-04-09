const Driver = require("../models/Driver");
const cloudinary = require("../config/cloudinary");
const sharp = require("sharp");

// Get driver profile
exports.getProfile = async (req, res) => {
  try {
    const driver = await Driver.findById(req.driver._id);
    if (!driver) {
      return res.status(404).json({ error: "Driver not found" });
    }

    // Split the full name correctly
    const nameParts = driver.fullName.split(" ");
    const firstName = nameParts[0] || "";
    const middleName = nameParts.length > 2 ? nameParts[1] : "";
    const lastName =
      nameParts.length > 2
        ? nameParts.slice(2).join(" ")
        : nameParts.length === 2
        ? nameParts[1]
        : "";

    // Format the response data
    const profileData = {
      fullName: driver.fullName,
      username: driver.username,
      email: driver.email,
      phone: driver.phone,
      profileImage: driver.profileImage,
      isVerified: driver.isVerified,
      totalTrips: driver.totalTrips,
      rating: driver.rating,
      joinedDate: driver.joinedDate,
      personalDetails: {
        ...driver.personalDetails,
        firstName: driver.personalDetails?.firstName || firstName,
        middleName: driver.personalDetails?.middleName || middleName,
        lastName: driver.personalDetails?.lastName || lastName,
        contact: {
          mobile: driver.phone,
          alternateMobile:
            driver.personalDetails?.contact?.alternateMobile || "",
          email: driver.email,
          isMobileVerified: driver.isPhoneVerified,
          isEmailVerified: driver.isEmailVerified,
        },
      },
      bankDetails: driver.bankDetails,
      vehicleDetails: driver.vehicleDetails,
    };

    res.json(profileData);
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ error: "Error fetching profile" });
  }
};

// Update personal details
exports.updatePersonalDetails = async (req, res) => {
  try {
    const driver = await Driver.findById(req.driver._id);
    if (!driver) {
      return res.status(404).json({ error: "Driver not found" });
    }

    // Extract name components
    const { firstName, middleName, lastName, ...otherDetails } = req.body;
    const fullName = [firstName, middleName, lastName]
      .filter(Boolean)
      .join(" ");

    // Update personal details
    driver.personalDetails = {
      ...driver.personalDetails,
      ...otherDetails,
      firstName,
      middleName,
      lastName,
      contact: {
        ...driver.personalDetails?.contact,
        mobile: driver.phone, // Keep original phone
        email: driver.email, // Keep original email
        isMobileVerified: driver.isPhoneVerified,
        isEmailVerified: driver.isEmailVerified,
      },
    };

    // Update full name
    driver.fullName = fullName;

    await driver.save();
    res.json({
      message: "Personal details updated successfully",
      data: {
        ...driver.personalDetails,
        fullName: driver.fullName,
      },
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Error updating personal details" });
  }
};

// Update bank details
exports.updateBankDetails = async (req, res) => {
  try {
    const driver = await Driver.findById(req.driver._id);
    if (!driver) {
      return res.status(404).json({ error: "Driver not found" });
    }

    driver.bankDetails = {
      ...driver.bankDetails,
      ...req.body,
    };

    await driver.save();
    res.json({
      message: "Bank details updated successfully",
      data: driver.bankDetails,
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating bank details" });
  }
};

// Update vehicle details
exports.updateVehicleDetails = async (req, res) => {
  try {
    const driver = await Driver.findById(req.driver._id);
    if (!driver) {
      return res.status(404).json({ error: "Driver not found" });
    }

    // Extract the data from request body
    const {
      basic,
      registration,
      specifications,
      insurance,
      maintenance,
      isEditing,
      ...otherDetails
    } = req.body;

    // Clean registration data
    const cleanRegistration = { ...registration };
    if (cleanRegistration.permitType === "") {
      delete cleanRegistration.permitType; // Remove empty permitType
    }

    // Update vehicle details with proper validation and structure
    driver.vehicleDetails = {
      ...driver.vehicleDetails,
      basic: {
        ...driver.vehicleDetails?.basic,
        type: basic?.type || driver.vehicleDetails?.basic?.type,
        make: basic?.make || driver.vehicleDetails?.basic?.make,
        model: basic?.model || driver.vehicleDetails?.basic?.model,
        year: basic?.year || driver.vehicleDetails?.basic?.year,
        color: basic?.color || driver.vehicleDetails?.basic?.color,
      },
      registration: {
        ...driver.vehicleDetails?.registration,
        ...cleanRegistration, // Use cleaned registration data
      },
      specifications: {
        ...driver.vehicleDetails?.specifications,
        loadCapacity:
          specifications?.loadCapacity ||
          driver.vehicleDetails?.specifications?.loadCapacity,
        dimensions: {
          ...driver.vehicleDetails?.specifications?.dimensions,
          ...specifications?.dimensions,
        },
        features:
          specifications?.features ||
          driver.vehicleDetails?.specifications?.features ||
          [],
        fuelType:
          specifications?.fuelType ||
          driver.vehicleDetails?.specifications?.fuelType,
      },
      insurance: {
        ...driver.vehicleDetails?.insurance,
        ...insurance,
      },
      maintenance: {
        ...driver.vehicleDetails?.maintenance,
        ...maintenance,
      },
    };

    await driver.save();

    res.json({
      message: "Vehicle details updated successfully",
      data: driver.vehicleDetails,
    });
  } catch (error) {
    console.error("Error updating vehicle details:", error);
    res.status(500).json({
      error: "Error updating vehicle details",
      details: error.message,
    });
  }
};

// Upload profile photo
exports.uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded",
      });
    }

    // Compress and center on face using sharp
    const compressedImageBuffer = await sharp(req.file.buffer)
      .resize(800, 800, {
        fit: "cover",
        position: "centre",
      })
      .jpeg({
        quality: 85,
        chromaSubsampling: "4:4:4",
      })
      .toBuffer();

    const b64 = compressedImageBuffer.toString("base64");
    let dataURI = "data:image/jpeg;base64," + b64;

    // Delete old image if exists
    const currentDriver = await Driver.findById(req.driver._id);
    if (currentDriver.profileImage) {
      const oldPublicId = currentDriver.profileImage
        .split("/")
        .slice(-1)[0]
        .split(".")[0];
      try {
        await cloudinary.uploader.destroy(`driver_photos/${oldPublicId}`);
      } catch (cloudinaryError) {
        console.error("Error deleting old image:", cloudinaryError);
      }
    }

    // Upload to cloudinary with face detection
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "driver_photos",
      transformation: [
        { width: 800, height: 800, crop: "thumb", gravity: "face" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
    });

    // Update driver's profile photo URL
    const driver = await Driver.findByIdAndUpdate(
      req.driver._id,
      { profileImage: result.secure_url },
      {
        new: true,
        select: "-password -sessions -phoneOTP -emailOTP",
      }
    );

    // Broadcast the update to connected clients (if using socket.io)
    if (req.app.emit) {
      req.app.emit("driverProfileUpdate", {
        driverId: driver._id,
        profileImage: result.secure_url,
      });
    }

    res.json({
      success: true,
      driver: driver,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to upload image",
    });
  }
};

// Remove profile photo
exports.removeProfilePhoto = async (req, res) => {
  try {
    const driver = await Driver.findById(req.driver._id);
    if (!driver) {
      return res.status(404).json({
        success: false,
        error: "Driver not found",
      });
    }

    // If driver has a profile image, delete it from Cloudinary
    if (driver.profileImage) {
      // Extract public_id from the URL
      const publicId = driver.profileImage
        .split("/")
        .slice(-1)[0]
        .split(".")[0];
      try {
        await cloudinary.uploader.destroy(`driver_photos/${publicId}`);
      } catch (cloudinaryError) {
        console.error("Error deleting from Cloudinary:", cloudinaryError);
      }
    }

    // Update driver profile
    const updatedDriver = await Driver.findByIdAndUpdate(
      req.driver._id,
      { $set: { profileImage: "" } },
      {
        new: true,
        select: "-password -sessions -phoneOTP -emailOTP",
      }
    );

    res.json({
      success: true,
      driver: updatedDriver,
    });
  } catch (error) {
    console.error("Error removing profile photo:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to remove profile photo",
    });
  }
};
