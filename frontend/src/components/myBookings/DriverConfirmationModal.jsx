import {
  FaUserCircle,
  FaStar,
  FaTruck,
  FaMoneyBillWave,
  FaClipboardCheck,
  FaMedal,
  FaCalendarAlt,
  FaClock,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { format } from "date-fns";

const DriverConfirmationModal = ({
  isOpen,
  onClose,
  driver,
  booking,
  onConfirm,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [driverDetails, setDriverDetails] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  /**
   * Formats a date and time for display
   * @param {string|Date} dateTimeInput - The date and time to format
   * @returns {string} Formatted date and time string
   */
  const formatDateTime = (dateTimeInput) => {
    if (!dateTimeInput) return "Time not specified";

    try {
      const date = new Date(dateTimeInput);
      if (isNaN(date.getTime())) {
        return String(dateTimeInput);
      }
      return format(date, "MMM d, yyyy 'at' h:mm aaa");
    } catch (error) {
      console.error(
        "Error formatting date/time:",
        error,
        "Input:",
        dateTimeInput
      );
      return String(dateTimeInput);
    }
  };

  useEffect(() => {
    const fetchDriverDetails = async () => {
      if (!driver?.driverId && !driver?.id) return;

      setIsLoadingDetails(true);
      try {
        const driverId = driver.driverId || driver.id;
        const token = localStorage.getItem("token");
        if (!token) return;

        // Use the full URL from env variable
        const apiUrl = `${
          import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"
        }/api/drivers/${driverId}/public`;
        console.log("Fetching driver details from:", apiUrl);

        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.warn(`Failed to fetch driver details: ${response.status}`);
          // Use driver prop as fallback
          setDriverDetails({
            ...driver,
            fullName: driver.name,
            profileImage: driver.profilePhoto,
            isVerified: false,
            experience: "Experienced Driver",
          });
          return;
        }

        const data = await response.json();
        if (data.success && data.driver) {
          setDriverDetails(data.driver);
        }
      } catch (error) {
        console.error("Error fetching driver details:", error);
        // Use driver prop as fallback
        setDriverDetails({
          ...driver,
          fullName: driver.name,
          profileImage: driver.profilePhoto,
          isVerified: false,
          experience: "Experienced Driver",
        });
      } finally {
        setIsLoadingDetails(false);
      }
    };

    if (isOpen && driver) {
      fetchDriverDetails();
    }
  }, [driver, isOpen]);

  useEffect(() => {
    // Handler for real-time driver updates
    const handleDriverUpdate = (event) => {
      const { driverId, driver } = event.detail;

      // Only update if this is the driver we're currently displaying
      if (
        isOpen &&
        driverDetails &&
        (driverDetails.driverId === driverId || driverDetails.id === driverId)
      ) {
        setDriverDetails((prevDetails) => ({
          ...prevDetails,
          ...driver,
        }));
      }
    };

    // Listen for driver update events
    document.addEventListener("driver:update", handleDriverUpdate);

    // Cleanup listener on unmount
    return () => {
      document.removeEventListener("driver:update", handleDriverUpdate);
    };
  }, [isOpen, driverDetails]);

  if (!isOpen || !driver) return null;

  // Use fetched details or fallback to the driver prop
  const displayDriver = driverDetails || driver;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      // Extract the correct driver ID - prioritize actual driver ID over MongoDB object ID
      // The actual driver ID (67f0413d1b211c8c96a18554) is stored in driver.driverId
      // while driver._id/driver.id is often a MongoDB reference (6820ee70528efac97772a9b4)
      let actualDriverId;

      // Check for nested driver ID (highest priority)
      if (typeof driver.driverId === "string") {
        actualDriverId = driver.driverId;
      }
      // Handle case where driverId is an object
      else if (driver.driverId?._id) {
        actualDriverId = driver.driverId._id;
      }
      // Last fallback to _id or id
      else if (driver._id) {
        actualDriverId = driver._id;
      } else if (driver.id) {
        actualDriverId = driver.id;
      }

      if (!actualDriverId) {
        throw new Error("Could not determine driver ID");
      }

      console.log("Confirming driver with actual driver ID:", {
        bookingId: booking.bookingId,
        actualDriverId,
        driver,
      });

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/payments/generate-token/${
          booking.bookingId
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            driverId: actualDriverId, // Send the actual driver ID
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate payment token");
      }

      // Pass the actual driver ID to the payment page
      onConfirm({
        paymentToken: data.paymentToken,
        booking: {
          ...booking,
          bookingId: booking.bookingId,
          _id: booking._id,
        },
        driver: {
          ...driver,
          _id: actualDriverId, // Ensure payment page gets the correct driver ID
          driverId: actualDriverId, // Include both for compatibility
        },
      });
    } catch (error) {
      console.error("Error in handleConfirm:", error);
      const errorToast = document.createElement("div");
      errorToast.className =
        "fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2";
      errorToast.textContent = error.message;
      document.body.appendChild(errorToast);
      setTimeout(() => errorToast.remove(), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full my-4 max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="p-6">
          <div className="text-center mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Confirm Your Driver
            </h2>
            <p className="text-gray-600 mt-1 text-sm">
              You're about to select this driver for your booking
            </p>
          </div>

          {isLoadingDetails ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-500"></div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 sm:p-6 mb-4">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Driver Photo */}
                <div className="flex-shrink-0">
                  {displayDriver.profilePhoto || displayDriver.profileImage ? (
                    <img
                      src={
                        displayDriver.profilePhoto || displayDriver.profileImage
                      }
                      alt={displayDriver.name || displayDriver.fullName}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white shadow-md"
                    />
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
                      <FaUserCircle className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400" />
                    </div>
                  )}

                  {displayDriver.isVerified && (
                    <div className="mt-2 text-center">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        <FaMedal className="inline mr-1" /> Verified
                      </span>
                    </div>
                  )}
                </div>

                {/* Driver Info */}
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                    {displayDriver.name || displayDriver.fullName}
                  </h3>
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-600 mt-1">
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span>{displayDriver.rating}</span>
                    </div>
                    <span>•</span>
                    <span>
                      {displayDriver.trips ||
                        displayDriver.stats?.totalTrips ||
                        0}{" "}
                      trips
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 mt-2">
                    <div className="flex items-center justify-center sm:justify-start mb-1">
                      <FaTruck className="mr-2 text-gray-500" />
                      <span className="truncate max-w-[200px]">
                        {displayDriver.vehicle ||
                          (displayDriver.vehicleDetails?.make
                            ? `${displayDriver.vehicleDetails.make} ${
                                displayDriver.vehicleDetails.model || ""
                              }`
                            : "Transport Vehicle")}
                      </span>
                    </div>

                    <div className="flex items-center justify-center sm:justify-start">
                      <FaCalendarAlt className="mr-2 text-gray-500" />
                      <span>
                        {displayDriver.experience || "Experienced Driver"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bid Price */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 flex items-center">
                    <FaMoneyBillWave className="text-green-500 mr-2" /> Agreed
                    Price:
                  </span>
                  <span className="text-xl sm:text-2xl font-bold text-gray-900">
                    ₹
                    {driver.price.toLocaleString("en-IN") ||
                      driver.amount.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Add bid timestamp display */}
                <div className="text-sm text-gray-600 mt-2 flex items-center justify-end">
                  <FaClock className="mr-1" />
                  <span>
                    Bid placed on {formatDateTime(driver.bidTime || new Date())}
                  </span>
                </div>

                {/* Additional Driver Note */}
                {driver.note && (
                  <div className="mt-3 p-3 bg-white rounded-lg">
                    <p className="text-sm text-gray-600 italic">
                      {driver.note}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Booking Summary */}
          <div className="mb-4 sm:mb-6">
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
              <FaClipboardCheck className="text-red-500 mr-2" /> Booking Summary
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-500">Pickup Date:</div>
              <div className="text-gray-900 font-medium">
                {new Date(
                  booking?.schedule?.date ||
                    booking?.pickupDate ||
                    booking?.date
                ).toLocaleDateString()}
              </div>

              <div className="text-gray-500">Pickup Time:</div>
              <div className="text-gray-900 font-medium">
                {booking?.schedule?.time ||
                  booking?.pickupTime ||
                  booking?.time ||
                  "Not specified"}
              </div>

              <div className="text-gray-500">Pickup Location:</div>
              <div className="text-gray-900 font-medium">
                {booking?.pickup?.city
                  ? `${booking.pickup.city}, ${booking.pickup.state}`
                  : "Not specified"}
              </div>

              <div className="text-gray-500">Destination:</div>
              <div className="text-gray-900 font-medium">
                {booking?.delivery?.city
                  ? `${booking.delivery.city}, ${booking.delivery.state}`
                  : "Not specified"}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:scale-105"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Confirm Selection"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverConfirmationModal;
