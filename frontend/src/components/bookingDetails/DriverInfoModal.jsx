import { useState, useEffect } from "react";
import {
  FaUserCircle,
  FaStar,
  FaTruck,
  FaCalendarAlt,
  FaInfoCircle,
  FaMoneyBillWave,
  FaWeight,
  FaRuler,
  FaMedal,
  FaClock,
} from "react-icons/fa";
import { format } from "date-fns";

const DriverInfoModal = ({ driver, isOpen, onClose }) => {
  const [driverDetails, setDriverDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
      if (!driver?.driverId) return;

      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        // Use the full URL from env variable
        const apiUrl = `${
          import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"
        }/api/drivers/${driver.driverId}/public`;
        // console.log("Fetching driver details from:", apiUrl);

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
        setIsLoading(false);
      }
    };

    if (isOpen && driver) {
      fetchDriverDetails();
    }
  }, [driver, isOpen]);

  // Add effect to disable body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save the current overflow value
      const originalStyle = window.getComputedStyle(document.body).overflow;
      // Disable scrolling on the body
      document.body.style.overflow = "hidden";

      // Restore scrolling when component unmounts or modal closes
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  useEffect(() => {
    // Handler for real-time driver updates
    const handleDriverUpdate = (event) => {
      const { driverId, driver } = event.detail;

      // Only update if this is the driver we're currently displaying
      if (isOpen && driverDetails && driverDetails.driverId === driverId) {
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

  return (
    <div className="fixed h-full inset-0 bg-black/40 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Driver Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-red-700 hover:scale-120 cursor-pointer"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center mb-6">
                {displayDriver.profilePhoto || displayDriver.profileImage ? (
                  <div className="relative">
                    <img
                      src={
                        displayDriver.profilePhoto || displayDriver.profileImage
                      }
                      alt={displayDriver.name || displayDriver.fullName}
                      className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 mb-3"
                    />
                    {displayDriver.isVerified && (
                      <div className="absolute -right-1 -bottom-1 bg-blue-500 rounded-full p-1.5 border-2 border-white">
                        <FaMedal className="text-white" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center mb-3">
                      <FaUserCircle className="w-20 h-20 text-gray-400" />
                    </div>
                    {displayDriver.isVerified && (
                      <div className="absolute -right-1 -bottom-1 bg-blue-500 rounded-full p-1.5 border-2 border-white">
                        <FaMedal className="text-white" />
                      </div>
                    )}
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900">
                  {displayDriver.name || displayDriver.fullName}
                </h3>
                <div className="flex items-center mt-1">
                  <FaStar className="text-yellow-400 mr-1" />
                  <span className="font-medium">{displayDriver.rating}</span>
                  <span className="mx-2 text-gray-300">|</span>
                  <span>
                    {displayDriver.trips ||
                      displayDriver.stats?.totalTrips ||
                      0}{" "}
                    trips
                  </span>
                </div>

                {displayDriver.isVerified && (
                  <div className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    <FaMedal className="inline mr-1" /> Verified Driver
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {/* Vehicle Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="bg-red-100 p-2 rounded-full">
                      <FaTruck className="text-red-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Vehicle</h4>
                      <p className="text-gray-700">
                        {displayDriver.vehicle ||
                          (displayDriver.vehicleDetails?.make
                            ? `${displayDriver.vehicleDetails.make} ${
                                displayDriver.vehicleDetails.model || ""
                              }`
                            : "Transport Vehicle")}
                      </p>

                      {displayDriver.vehicleDetails?.type && (
                        <p className="text-sm text-gray-600 mt-1">
                          Type:{" "}
                          {displayDriver.vehicleDetails.type
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </p>
                      )}

                      {displayDriver.vehicleDetails?.loadCapacity && (
                        <p className="text-sm text-gray-600 mt-1 flex items-center">
                          <FaWeight className="mr-1 text-xs" />
                          Capacity: {displayDriver.vehicleDetails.loadCapacity}
                        </p>
                      )}

                      {displayDriver.vehicleDetails?.specifications
                        ?.dimensions && (
                        <p className="text-sm text-gray-600 mt-1 flex items-center">
                          <FaRuler className="mr-1 text-xs" />
                          Dimensions:{" "}
                          {`${
                            displayDriver.vehicleDetails.specifications
                              .dimensions.length || ""
                          } × 
                           ${
                             displayDriver.vehicleDetails.specifications
                               .dimensions.width || ""
                           } × 
                           ${
                             displayDriver.vehicleDetails.specifications
                               .dimensions.height || ""
                           }`.trim()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Experience */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <FaCalendarAlt className="text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Experience</h4>
                      <p className="text-gray-700">
                        {displayDriver.experience || "Experienced Driver"}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {displayDriver.trips ||
                          displayDriver.stats?.totalTrips ||
                          0}{" "}
                        trips completed
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bid Details */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <FaMoneyBillWave className="text-green-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Bid Details</h4>
                      <p className="text-2xl font-bold text-gray-800 mt-1">
                        ₹
                        {driver.price?.toLocaleString("en-IN") ||
                          driver.amount?.toLocaleString("en-IN")}
                      </p>

                      {/* Add bid timestamp display */}
                      <p className="text-sm text-gray-600 mt-1 flex items-center">
                        <FaClock className="mr-1" />
                        Bid placed on{" "}
                        {formatDateTime(driver.bidTime || new Date())}
                      </p>

                      {driver.note && (
                        <div className="mt-3 p-3 bg-white rounded-lg">
                          <p className="text-sm text-gray-700 font-medium">
                            Note from Driver:
                          </p>
                          <p className="text-sm text-gray-600 italic">
                            "{driver.note}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                {displayDriver.bio && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <FaInfoCircle className="text-purple-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          About Driver
                        </h4>
                        <p className="text-gray-700 mt-1">
                          {displayDriver.bio}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverInfoModal;
