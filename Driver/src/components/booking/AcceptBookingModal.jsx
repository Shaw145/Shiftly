import React from "react";
import PropTypes from "prop-types";
import {
  FaCheck,
  FaTimes,
  FaSpinner,
  FaMapMarkerAlt,
  FaFlag,
  FaCalendarAlt,
  FaRupeeSign,
} from "react-icons/fa";

/**
 * Modal for confirming a booking acceptance by driver
 */
const AcceptBookingModal = ({
  isOpen,
  onClose,
  onAccept,
  booking,
  isLoading,
}) => {
  if (!isOpen || !booking) return null;

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    try {
      return new Date(dateString).toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  // Get pickup date from booking in various formats
  const pickupDate = formatDate(
    booking.schedule?.date || booking.date || booking.pickupDate
  );

  // Get formatted pickup and delivery locations
  const getLocationString = (location) => {
    if (!location) return "Not specified";
    if (typeof location === "string") return location;

    if (location.city && location.state) {
      return `${location.city}, ${location.state}`;
    }

    return location.address || "Address not available";
  };

  const pickupLocation = getLocationString(
    booking.pickup || booking.pickupLocation
  );
  const deliveryLocation = getLocationString(
    booking.delivery || booking.deliveryLocation || booking.destination
  );

  // Get bid amount
  const bidAmount =
    booking.driverBids?.find(
      (bid) =>
        bid.driver === localStorage.getItem("driverId") ||
        bid.driver?._id === localStorage.getItem("driverId") ||
        bid.driver?.driverId === localStorage.getItem("driverId")
    )?.price || "Not specified";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                <FaCheck className="h-6 w-6 text-green-600" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Accept Booking Confirmation
                </h3>
                <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <FaCalendarAlt className="mt-1 mr-2 text-red-500" />
                      <div>
                        <p className="text-xs text-gray-500">Pickup Date</p>
                        <p className="text-sm font-medium">{pickupDate}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <FaMapMarkerAlt className="mt-1 mr-2 text-red-500" />
                      <div>
                        <p className="text-xs text-gray-500">Pickup Location</p>
                        <p className="text-sm font-medium">{pickupLocation}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <FaFlag className="mt-1 mr-2 text-green-500" />
                      <div>
                        <p className="text-xs text-gray-500">
                          Delivery Location
                        </p>
                        <p className="text-sm font-medium">
                          {deliveryLocation}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <FaRupeeSign className="mt-1 mr-2 text-red-500" />
                      <div>
                        <p className="text-xs text-gray-500">Your Bid Amount</p>
                        <p className="text-sm font-medium">₹{bidAmount}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-500">
                    By accepting this booking, you agree to complete this
                    transport job according to the specified details. Once
                    accepted, this booking will be assigned to you.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onAccept}
              disabled={isLoading}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" /> Processing...
                </>
              ) : (
                "Accept Booking"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

AcceptBookingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAccept: PropTypes.func.isRequired,
  booking: PropTypes.object,
  isLoading: PropTypes.bool,
};

export default AcceptBookingModal;
