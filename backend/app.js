const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connectDB = require("./database/connection");

// Update model imports to use correct filenames
require("./models/User");
require("./models/Booking");
require("./models/Driver");

dotenv.config(); // Load environment variables

const app = express();

// Custom logging middleware instead of morgan
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`\n=== ${new Date().toISOString()} ===`);
  console.log(`${req.method} ${req.url}`);
  console.log("Headers:", req.headers);

  // Log response
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`Response Status: ${res.statusCode}`);
    console.log(`Duration: ${duration}ms\n`);
  });

  next();
});

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Test route
app.get("/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

// Routes
const authRoutes = require("./routes/authRoutes");
const emailRoutes = require("./routes/emailRoutes");
const passwordRoutes = require("./routes/passwordRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const trackingRoutes = require("./routes/trackingRoutes");
const userRoutes = require("./routes/userRoutes");
const driverAuthRoutes = require("./routes/driverAuthRoutes");
const driverRoutes = require("./routes/driverRoutes");
app.use("/api/auth", authRoutes); // Mount authRoutes under /api/auth
app.use("/api/auth", emailRoutes); // Mount emailRoutes under /api/auth
app.use("/api/auth", passwordRoutes); // Mount password routes under /api/auth
app.use("/api/bookings", bookingRoutes); // Mount booking routes under /api/bookings
app.use("/api/payments", paymentRoutes); // Mount payment routes under /api/payments
app.use("/api/tracking", trackingRoutes); // Mount tracking routes under /api/tracking
app.use("/api/users", userRoutes); // Mount user routes under /api/users
app.use("/api/driver/auth", driverAuthRoutes); // Mount driver auth routes under /api/driver/auth
app.use("/api/driver", driverRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    error: err.message || "Server Error",
  });
});

// Connect to MongoDB first, then start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
