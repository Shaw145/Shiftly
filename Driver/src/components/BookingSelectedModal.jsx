import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaMoneyBillWave,
  FaBoxOpen,
  FaTruck,
} from "react-icons/fa";

const BookingSelectedModal = ({ booking, onClose }) => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🚨 BookingSelectedModal mounted with booking data:", booking);

    // Prevent background scrolling
    document.body.style.overflow = "hidden";

    // Log key fields for debugging
    if (booking) {
      console.log("BookingSelectedModal - Key fields:", {
        id: booking._id || "No MongoDB ID",
        bookingId: booking.bookingId || "No formatted bookingId",
        pickupLocation: getPickupLocation(),
        deliveryLocation: getDeliveryLocation(),
        amount: getBookingPrice(),
      });
    }

    // Dispatch an event to refresh the bookings list in the background
    const refreshEvent = new CustomEvent("refresh:bookings");
    document.dispatchEvent(refreshEvent);

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [booking]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      console.error("Error formatting date:", e);
      return "N/A";
    }
  };

  const handleViewBooking = () => {
    onClose();
    // Use the bookingId or formatted ID depending on what's available
    const bookingIdForNav =
      booking.bookingId || (booking._id ? booking._id.toString() : "");
    if (bookingIdForNav) {
      console.log("Navigating to booking details:", bookingIdForNav);
      navigate(`/confirmed-bookings/${bookingIdForNav}`);
    } else {
      console.error("No booking ID available for navigation");
      navigate("/my-bookings");
    }
  };

  // Safe property access with fallbacks
  const getBookingPrice = () => {
    return booking.finalPrice || booking.amount || 0;
  };

  const getVehicleType = () => {
    const vehicleType = booking.vehicle || "";
    if (typeof vehicleType === "string") {
      return vehicleType
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
    }
    return "Not specified";
  };

  const getGoodsType = () => {
    const goodsType = booking.goods?.type || "";
    if (typeof goodsType === "string") {
      return goodsType
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
    }
    return "Not specified";
  };

  const getPickupLocation = () => {
    if (booking.pickup?.city && booking.pickup?.state) {
      return `${booking.pickup.city}, ${booking.pickup.state}`;
    }
    return "Not specified";
  };

  const getDeliveryLocation = () => {
    if (booking.delivery?.city && booking.delivery?.state) {
      return `${booking.delivery.city}, ${booking.delivery.state}`;
    }
    return "Not specified";
  };

  const getScheduleTime = () => {
    return booking.schedule?.time || "N/A";
  };

  const getScheduleDate = () => {
    return formatDate(booking.schedule?.date);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
      <div className="relative w-full max-w-lg mx-4 bg-white rounded-xl shadow-2xl p-6 border-2 border-green-100">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <FaCheckCircle className="text-green-500 text-4xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Booking Confirmed!
          </h2>
          <p className="text-gray-600 mb-4">
            Congratulations! A customer has selected you for their shipment.
          </p>

          <div className="w-full bg-gray-50 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-gray-800 mb-3">
              Booking Details:
            </h3>
            <div className="space-y-2 text-left">
              {/* Price Information */}
              <div className="flex items-start">
                <FaMoneyBillWave className="text-green-500 mt-1 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Earnings</p>
                  <p className="text-gray-800 font-semibold">
                    ₹{getBookingPrice()}
                  </p>
                </div>
              </div>

              {/* Vehicle Type */}
              <div className="flex items-start">
                <FaTruck className="text-purple-500 mt-1 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Vehicle Type</p>
                  <p className="text-gray-800">{getVehicleType()}</p>
                </div>
              </div>

              {/* Goods Type */}
              <div className="flex items-start">
                <FaBoxOpen className="text-yellow-500 mt-1 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Goods Type</p>
                  <p className="text-gray-800">{getGoodsType()}</p>
                </div>
              </div>

              {/* Pickup Location */}
              <div className="flex items-start">
                <FaMapMarkerAlt className="text-red-500 mt-1 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Pickup Location</p>
                  <p className="text-gray-800">{getPickupLocation()}</p>
                </div>
              </div>

              {/* Delivery Location */}
              <div className="flex items-start">
                <FaMapMarkerAlt className="text-green-500 mt-1 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Delivery Location</p>
                  <p className="text-gray-800">{getDeliveryLocation()}</p>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-start">
                <FaCalendarAlt className="text-blue-500 mt-1 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="text-gray-800">{getScheduleDate()}</p>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-start">
                <FaClock className="text-purple-500 mt-1 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="text-gray-800">{getScheduleTime()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleViewBooking}
            className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer font-medium"
          >
            View Booking Details
          </button>
          <button
            onClick={onClose}
            className="w-full px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200 cursor-pointer font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSelectedModal;
