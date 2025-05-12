const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verify JWT token for protected routes
exports.verifyToken = async (req, res, next) => {
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

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by ID
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid token, authentication failed",
    });
  }
};

// Middleware for admin-only routes
exports.verifyAdmin = async (req, res, next) => {
  try {
    // First verify the token
    await exports.verifyToken(req, res, () => {
      // Check if user is an admin
      if (req.user && req.user.role === "admin") {
        next();
      } else {
        return res.status(403).json({
          success: false,
          message: "Access denied: Admin privileges required",
        });
      }
    });
  } catch (error) {
    console.error("Admin verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during authorization",
    });
  }
};
