// backend/middleware/authMiddleware.js

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Driver = require("../models/Driver");

// Middleware to protect routes for authenticated users
const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized - no token provided",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the token has a user ID (customer token)
    if (decoded.userId) {
      // Get user
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found or deleted",
        });
      }

      // Set user info in the request
      req.user = user;
      req.role = "user";
      next();
    } else if (decoded.driverId) {
      // This is a driver token - redirect to driver authentication
      req.driverToken = decoded;
      driverProtect(req, res, next);
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid token format",
      });
    }
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({
      success: false,
      message: "Not authorized - invalid token",
      details: error.message,
    });
  }
};

// Middleware to protect routes for authenticated drivers
const driverProtect = async (req, res, next) => {
  try {
    let token;
    let decoded;

    // If we already have driver token from protect middleware
    if (req.driverToken) {
      decoded = req.driverToken;
    } else {
      // Otherwise, get token from authorization header
      if (req.headers.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
      }

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Not authorized - no token provided",
        });
      }

      // Verify token
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    }

    // Validate driver token
    if (!decoded.driverId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token format - missing driver ID",
      });
    }

    // Get driver
    const driver = await Driver.findById(decoded.driverId);
    if (!driver) {
      return res.status(401).json({
        success: false,
        message: "Driver not found or deleted",
      });
    }

    // Verify session is still active
    if (decoded.sessionToken) {
      if (!driver.sessions || driver.sessions.length === 0) {
        return res.status(401).json({
          success: false,
          message: "No active sessions",
        });
      }

      const session = driver.sessions.find(
        (s) => s.token === decoded.sessionToken && s.isActive
      );

      if (!session) {
        return res.status(401).json({
          success: false,
          message: "Session expired or invalid",
        });
      }
    }

    // Set driver info in the request
    req.driver = driver;
    req.decoded = decoded;
    req.role = "driver";
    next();
  } catch (error) {
    console.error("Driver auth error:", error);
    return res.status(401).json({
      success: false,
      message: "Not authorized - invalid token",
      details: error.message,
    });
  }
};

module.exports = { protect, driverProtect };

// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// const authMiddleware = async (req, res, next) => {
//   const token = req.header("Authorization")?.replace("Bearer ", "");

//   if (!token) {
//     return res.status(401).json({ error: "Access denied. No token provided." });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.userId);

//     if (!user || !user.isEmailVerified) {
//       return res
//         .status(401)
//         .json({ error: "Please verify your email to access this resource." });
//     }

//     req.userId = decoded.userId;
//     next();
//   } catch (error) {
//     res.status(400).json({ error: "Invalid token" });
//   }
// };

//module.exports = authMiddleware;
