import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import worldMap from "../assets/worldmap.png";
import { FaSearch, FaShippingFast, FaExclamationCircle } from "react-icons/fa";

const TrackBooking = () => {
  const [bookingId, setBookingId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bookingStatus, setBookingStatus] = useState(null);

  // Function to handle tracking submission
  const handleTrackBooking = async (e) => {
    e.preventDefault();

    // Validate booking ID
    if (!bookingId.trim()) {
      setError("Please enter a valid booking ID");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Call API to check booking status
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/tracking/public/${bookingId.trim()}`
      );

      if (!response.ok) {
        throw new Error("Booking not found");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(
          data.message || "Failed to retrieve booking information"
        );
      }

      // Set booking status
      setBookingStatus({
        status: data.tracking.status,
        currentStep: data.tracking.currentStep,
        booking: data.tracking.booking,
      });
    } catch (error) {
      console.error("Error tracking booking:", error);
      setError(
        error.message ||
          "Booking not found. Please check your booking ID and try again."
      );
      setBookingStatus(null);
    } finally {
      setLoading(false);
    }
  };

  // Define status info based on booking status
  const statusInfo = useMemo(() => {
    if (!bookingStatus) return {};

    const { status } = bookingStatus;

    switch (status) {
      case "pending":
        return {
          color: "bg-yellow-100 border-yellow-500",
          icon: <FaExclamationCircle className="text-yellow-500 text-xl" />,
          title: "Pending Confirmation",
          message: "Your booking is being processed and awaiting confirmation.",
        };
      case "confirmed":
        return {
          color: "bg-blue-100 border-blue-500",
          icon: <FaExclamationCircle className="text-blue-500 text-xl" />,
          title: "Booking Confirmed",
          message:
            "Your booking has been confirmed and is scheduled for pickup.",
        };
      case "inTransit":
      case "in_transit":
        return {
          color: "bg-green-100 border-green-500",
          icon: <FaShippingFast className="text-green-500 text-xl" />,
          title: "In Transit",
          message:
            "Your shipment is currently in transit and on its way to the destination.",
        };
      case "completed":
      case "delivered":
        return {
          color: "bg-green-100 border-green-500",
          icon: <FaShippingFast className="text-green-500 text-xl" />,
          title: "Delivered",
          message:
            "Your shipment has been successfully delivered to the destination.",
        };
      default:
        return {
          color: "bg-gray-100 border-gray-500",
          icon: <FaExclamationCircle className="text-gray-500 text-xl" />,
          title: "Status Unknown",
          message: "We couldn't determine the current status of your booking.",
        };
    }
  }, [bookingStatus]);

  return (
    <motion.section
      className="py-16 px-6 md:px-20 relative overflow-hidden"
      id="TrackBooking"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      {/* Background Image */}
      <img
        src={worldMap}
        alt="World Map"
        className="absolute top-30 left-7 inset-0 w-full h-150 object-contain z-15"
      />

      {/* Dark Blue Overlay */}
      <div className="absolute inset-0 bg-body-dark bg-opacity-90 z-10"></div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto flex flex-col items-center">
        {/* Top: Heading and Description */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Track Your Shipment
          </h2>
          <p className="text-white text-base md:text-xl">
            Stay informed about your shipment&apos;s journey with our real-time
            tracking system. Simply enter your booking ID below to get instant
            updates on your delivery status.
          </p>
        </div>

        {/* Bottom: Form */}
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl mx-auto">
          <form onSubmit={handleTrackBooking}>
            {/* Booking ID Input */}
            <div className="mb-6">
              <label className="block text-black font-semibold mb-2">
                Booking ID
              </label>
              <input
                type="text"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
                className="w-full p-3 pl-4 border border-gray-400 rounded-lg focus:outline-none focus:border-red-500 bg-white text-black"
                placeholder="B123456789"
              />
              {error && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <FaExclamationCircle className="mr-1" /> {error}
                </p>
              )}
            </div>

            {/* Track Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-700 transition-colors duration-300 lg:text-lg cursor-pointer flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Tracking...
                </>
              ) : (
                <>
                  <FaSearch className="mr-2" /> Track Shipment
                </>
              )}
            </button>
          </form>

          {/* Tracking Result */}
          {bookingStatus && (
            <div className={`mt-6 p-4 rounded-lg border ${statusInfo.color}`}>
              <h3 className="font-bold text-lg flex items-center">
                {statusInfo.icon}
                <span className="ml-2">{statusInfo.title}</span>
              </h3>
              <p className="text-gray-700 mt-2">{statusInfo.message}</p>

              {/* Show tracking button only for in-transit or completed bookings */}
              {(bookingStatus.status === "inTransit" ||
                bookingStatus.status === "in_transit" ||
                bookingStatus.status === "completed" ||
                bookingStatus.status === "delivered") && (
                <button
                  onClick={() =>
                    window.open(
                      `/tracking/${bookingId}`,
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                  className="mt-4 w-full bg-red-500 text-white p-2 rounded-lg hover:bg-red-700 transition-colors duration-300 flex items-center justify-center cursor-pointer"
                >
                  <FaShippingFast className="mr-2" /> View Detailed Tracking
                </button>
              )}
            </div>
          )}

          {/* Note */}
          <p className="text-gray-600 text-sm lg:text-base mt-4">
            *For any assistance with tracking, please contact our customer
            support.
          </p>
        </div>
      </div>
    </motion.section>
  );
};

export default TrackBooking;
