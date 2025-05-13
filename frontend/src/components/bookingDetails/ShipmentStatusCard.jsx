import { useState, useEffect } from "react";
import {
  FaCheckCircle,
  FaShippingFast,
  FaCalendarAlt,
  FaClock,
  FaBox,
  FaMapMarkedAlt,
  FaUser,
  FaStar,
  FaTruck,
} from "react-icons/fa";
import PropTypes from "prop-types";

/**
 * ShipmentStatusCard component for displaying completed or delivered booking status
 * @param {Object} props Component props
 * @param {Object} props.booking The booking object
 */
const ShipmentStatusCard = ({ booking }) => {
  const [deliveryDate, setDeliveryDate] = useState(null);

  useEffect(() => {
    if (booking) {
      // Try to get the delivery date from various possible sources
      const date =
        booking.deliveredAt || booking.completedAt || booking.updatedAt;
      if (date) {
        setDeliveryDate(new Date(date));
      }
    }
  }, [booking]);

  // Helper function to format the date
  const formatDate = (date) => {
    if (!date) return "Not available";

    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Helper function to format the time
  const formatTime = (date) => {
    if (!date) return "";

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Helper function to get delivery distance if available
  const getDeliveryDistance = () => {
    if (booking.distance) return booking.distance;
    if (booking.estimatedDistance) return `~${booking.estimatedDistance}`;
    return "Distance information not available";
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FaCheckCircle className="text-green-600" />
          <span className="text-gray-800">Delivery Completed</span>
        </h2>
        <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full whitespace-nowrap">
          <FaCheckCircle className="mr-1" />
          Delivery Complete
        </div>
      </div>

      <div className="bg-green-50 rounded-lg p-5 border border-green-100 mb-4">
        <div className="flex flex-col items-center text-center mb-4">
          <FaCheckCircle className="text-green-500 text-3xl mb-3" />
          <p className="text-gray-800 font-medium">
            Your shipment has been delivered successfully
          </p>
          <p className="text-gray-600 text-sm mt-1">
            Thank you for choosing our service
          </p>
        </div>

        {deliveryDate && (
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm bg-green-100 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-gray-700">
              <FaCalendarAlt className="text-green-600 flex-shrink-0" />
              <span className="font-medium">{formatDate(deliveryDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <FaClock className="text-green-600 flex-shrink-0" />
              <span className="font-medium">{formatTime(deliveryDate)}</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-gray-100 rounded-lg p-4">
          <h3 className="text-md font-medium text-gray-700 mb-3 flex items-center gap-2">
            <FaShippingFast className="text-green-600" /> Shipment Details
          </h3>
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <FaBox className="text-gray-500 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Goods Type</p>
                <p className="font-medium text-gray-800 break-words">
                  {booking.goods?.type ||
                    booking.goodsType ||
                    "Standard Package"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FaTruck className="text-gray-500 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Vehicle Type</p>
                <p className="font-medium text-gray-800 break-words">
                  {booking.vehicle || booking.vehicleType || "Standard Vehicle"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FaMapMarkedAlt className="text-gray-500 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Total Distance</p>
                <p className="font-medium text-gray-800 break-words">
                  {getDeliveryDistance()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-gray-100 rounded-lg p-4">
          <h3 className="text-md font-medium text-gray-700 mb-3 flex items-center gap-2">
            <FaUser className="text-green-600" /> Delivery Confirmation
          </h3>
          <div className="space-y-2">
            {booking.receiverDetails ? (
              <>
                <div className="flex items-start gap-3">
                  <FaUser className="text-gray-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Received By</p>
                    <p className="font-medium text-gray-800 break-words">
                      {booking.receiverDetails.name || "Recipient"}
                    </p>
                  </div>
                </div>
                {booking.receiverDetails.signature && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-1">Signature</p>
                    <div className="bg-gray-50 p-2 rounded border border-gray-200">
                      <img
                        src={booking.receiverDetails.signature}
                        alt="Signature"
                        className="h-16 mx-auto"
                      />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-gray-600 text-sm">
                <p>
                  Your shipment was successfully delivered to the destination.
                </p>
                {booking.driverId && typeof booking.driverId === "object" && (
                  <div className="flex items-center gap-2 mt-2">
                    <FaUser className="text-gray-500 flex-shrink-0" />
                    <span className="break-words">
                      Delivered by: {booking.driverId.name || "Driver"}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rate Driver Button */}
      {!booking.isRated && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="text-center">
            <h3 className="font-medium text-gray-800 mb-2">
              How was your experience?
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Help us improve by rating your delivery experience
            </p>
            <button
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors cursor-pointer w-full sm:w-auto sm:min-w-[200px]"
              onClick={() =>
                window.open(`/rate-driver/${booking.bookingId}`, "_blank")
              }
            >
              <FaStar />
              <span>Rate & Review Driver</span>
            </button>
          </div>
        </div>
      )}

      {/* Show already rated message if rated */}
      {booking.isRated && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
              <FaCheckCircle />
              <span className="font-medium">Thank you for your feedback!</span>
            </div>
            <p className="text-sm text-gray-600">
              You&apos;ve already rated this delivery
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

ShipmentStatusCard.propTypes = {
  booking: PropTypes.object.isRequired,
};

export default ShipmentStatusCard;
