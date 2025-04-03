const mongoose = require("mongoose");
const Booking = require("../models/Booking");

async function checkDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("\n=== Checking Database ===");

    // Check for specific booking
    const booking = await Booking.findOne({ bookingId: "B471436709" });
    console.log("\nLooking for booking B471436709:", booking);

    // Get all bookings
    const allBookings = await Booking.find({});
    console.log(
      "\nAll bookings:",
      allBookings.map((b) => ({
        _id: b._id,
        bookingId: b.bookingId,
        userId: b.userId,
      }))
    );

    mongoose.connection.close();
  } catch (error) {
    console.error("Database check error:", error);
    process.exit(1);
  }
}

checkDatabase();
