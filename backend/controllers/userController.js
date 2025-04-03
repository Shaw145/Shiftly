const User = require("../models/User");
const cloudinary = require("../config/cloudinary");
const sharp = require("sharp");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select("-password")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    // Create update object
    const updates = {};

    // Handle personal info fields explicitly
    if ("fullName" in req.body) updates.fullName = req.body.fullName;
    if ("phone" in req.body) updates.phone = req.body.phone;
    if ("alternatePhone" in req.body)
      updates.alternatePhone = req.body.alternatePhone;
    if ("gender" in req.body) updates.gender = req.body.gender;
    if ("bio" in req.body) updates.bio = req.body.bio;

    // Handle dateOfBirth separately
    if ("dateOfBirth" in req.body && req.body.dateOfBirth) {
      updates.dateOfBirth = new Date(req.body.dateOfBirth);
    }

    // Handle addresses if present
    if (req.body.addresses) {
      if (!Array.isArray(req.body.addresses)) {
        return res.status(400).json({
          success: false,
          error: "Addresses must be an array",
        });
      }

      updates.addresses = req.body.addresses.map((addr) => ({
        type: addr.type || "home",
        street: addr.street || "",
        addressLine2: addr.addressLine2 || "",
        city: addr.city || "",
        state: addr.state || "",
        pincode: addr.pincode || "",
        landmark: addr.landmark || "",
        isDefault: Boolean(addr.isDefault),
      }));
    }

    // Update lastUpdated timestamp
    updates.lastUpdated = new Date();

    // Find the user first
    const existingUser = await User.findById(req.user._id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Merge existing data with updates
    const mergedUpdates = {
      ...existingUser.toObject(),
      ...updates,
    };

    // Remove sensitive fields from merged updates
    delete mergedUpdates.password;
    delete mergedUpdates.otp;
    delete mergedUpdates.resetPasswordToken;
    delete mergedUpdates.resetPasswordExpires;
    delete mergedUpdates.__v;

    // Update the user with merged data
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: mergedUpdates },
      {
        new: true,
        runValidators: true,
        select: "-password -otp -resetPasswordToken -resetPasswordExpires",
      }
    );

    if (!user) {
      console.log("User not found after update");
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Convert to plain object for response
    const responseUser = user.toObject();

    // Format dates for response
    if (responseUser.dateOfBirth) {
      responseUser.dateOfBirth = responseUser.dateOfBirth.toISOString();
    }
    if (responseUser.createdAt) {
      responseUser.createdAt = responseUser.createdAt.toISOString();
    }
    if (responseUser.lastUpdated) {
      responseUser.lastUpdated = responseUser.lastUpdated.toISOString();
    }

    res.json({
      success: true,
      user: responseUser,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Error updating profile",
    });
  }
};

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
        // Increased size
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
    const currentUser = await User.findById(req.user._id);
    if (currentUser.profileImage) {
      const oldPublicId = currentUser.profileImage
        .split("/")
        .slice(-1)[0]
        .split(".")[0];
      try {
        await cloudinary.uploader.destroy(`profile_photos/${oldPublicId}`);
      } catch (cloudinaryError) {
        console.error("Error deleting old image:", cloudinaryError);
      }
    }

    // Upload to cloudinary with face detection
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "profile_photos",
      transformation: [
        { width: 800, height: 800, crop: "thumb", gravity: "face" }, // Use face detection
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
    });

    // Update user's profile photo URL
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profileImage: result.secure_url },
      {
        new: true,
        select: "-password -otp -resetPasswordToken -resetPasswordExpires",
      }
    );

    // Broadcast the update to connected clients
    req.app.emit("profileUpdate", {
      userId: user._id,
      profileImage: result.secure_url,
    });

    res.json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to upload image",
    });
  }
};

exports.removeProfilePhoto = async (req, res) => {
  try {
    // Get current user to find image public_id
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // If user has a profile image, delete it from Cloudinary
    if (user.profileImage) {
      // Extract public_id from the URL
      const publicId = user.profileImage.split("/").slice(-1)[0].split(".")[0];
      try {
        await cloudinary.uploader.destroy(`profile_photos/${publicId}`);
      } catch (cloudinaryError) {
        console.error("Error deleting from Cloudinary:", cloudinaryError);
      }
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { profileImage: "" } },
      {
        new: true,
        select: "-password -otp -resetPasswordToken -resetPasswordExpires",
      }
    );

    res.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error removing profile photo:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to remove profile photo",
    });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password").lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
