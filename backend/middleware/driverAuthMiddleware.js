const jwt = require("jsonwebtoken");
const Driver = require("../models/Driver");

const protectDriver = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ error: "Not authorized" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get driver and verify session
    const driver = await Driver.findById(decoded.driverId);
    if (!driver) {
      return res.status(401).json({ error: "Driver not found" });
    }

    // Verify session is still active
    const session = driver.sessions.find(
      (s) => s.token === decoded.sessionToken && s.isActive
    );

    if (!session) {
      return res.status(401).json({ error: "Session expired" });
    }

    req.driver = driver;
    req.decoded = decoded;
    next();
  } catch (error) {
    console.error("Auth Error:", error);
    res.status(401).json({ error: "Not authorized" });
  }
};

module.exports = { protectDriver };
