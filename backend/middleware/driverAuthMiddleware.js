const jwt = require("jsonwebtoken");
const Driver = require("../models/Driver");

const protectDriver = async (req, res, next) => {
  try {
    console.log("Driver Auth Middleware Starting...");
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
      console.log("Bearer token found, length:", token?.length);
      // Log just the beginning of the token for debugging (don't expose the full token)
      if (token && token.length > 10) {
        console.log("Token starts with:", token.substring(0, 10) + "...");
      }
    }

    if (!token) {
      console.log("No token provided in request");
      return res
        .status(401)
        .json({ error: "Not authorized - no token provided" });
    }

    // Verify token
    try {
      console.log("Attempting to verify token...");
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(
        "Token verified successfully for driver ID:",
        decoded.driverId
      );

      if (!decoded.driverId) {
        console.log("Token is missing driverId field");
        return res
          .status(401)
          .json({ error: "Invalid token format - missing driver ID" });
      }

      // Get driver and verify session
      const driver = await Driver.findById(decoded.driverId);
      if (!driver) {
        console.log("Driver not found for ID:", decoded.driverId);
        return res.status(401).json({ error: "Driver not found" });
      }

      console.log("Driver found:", driver.username);
      console.log("Sessions available:", driver.sessions?.length || 0);

      // Verify session is still active
      if (!driver.sessions || driver.sessions.length === 0) {
        console.log("No sessions found for driver");
        return res.status(401).json({ error: "No active sessions" });
      }

      // Find matching session
      const session = driver.sessions.find(
        (s) => s.token === decoded.sessionToken && s.isActive
      );

      if (!session) {
        console.log("No matching active session found for token");
        return res.status(401).json({ error: "Session expired or invalid" });
      }

      console.log("Valid session found, authentication successful");

      // Add driver and decoded data to request
      req.driver = driver;
      req.decoded = decoded;
      next();
    } catch (jwtError) {
      console.error("JWT verification error:", jwtError.message);
      return res
        .status(401)
        .json({
          error: "Not authorized - invalid token",
          details: jwtError.message,
        });
    }
  } catch (error) {
    console.error("Auth Error:", error);
    res
      .status(401)
      .json({ error: "Authentication failed", details: error.message });
  }
};

module.exports = { protectDriver };
