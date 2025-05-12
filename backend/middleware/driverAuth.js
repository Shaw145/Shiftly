const jwt = require("jsonwebtoken");
const Driver = require("../models/Driver");

// Verify JWT token for driver protected routes
exports.verifyDriver = async (req, res, next) => {
  try {
    // Get token from Authorization header
    let token = req.header("Authorization");

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No authentication token, access denied",
      });
    }

    // Remove Bearer from token string if it exists
    if (token.startsWith("Bearer ")) {
      token = token.slice(7);
    }

    // Verify token with driver secret
    const decoded = jwt.verify(token, process.env.DRIVER_JWT_SECRET);

    // Find driver by ID
    const driver = await Driver.findById(decoded.id).select("-password");

    if (!driver) {
      return res.status(401).json({
        success: false,
        message: "Driver not found",
      });
    }

    // Check if driver is verified and active
    if (!driver.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Driver account not verified. Please complete verification.",
      });
    }

    if (driver.status !== "active") {
      return res.status(403).json({
        success: false,
        message: `Driver account is ${driver.status}. Please contact support.`,
      });
    }

    // Attach driver to request object
    req.driver = driver;
    next();
  } catch (error) {
    console.error("Driver token verification error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid token, authentication failed",
    });
  }
};
