import {
  FaInfoCircle,
  FaUserCircle,
  FaStar,
  FaTruck,
  FaEye,
  FaMedal,
  FaClock,
} from "react-icons/fa";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import DriverInfoModal from "./DriverInfoModal";

/**
 * Formats a date for display
 * @param {string|Date} dateInput - The date to format
 * @returns {string} Formatted date string
 */
const formatDate = (dateInput) => {
  try {
    const date = new Date(dateInput);
    return format(date, "PPP");
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Date not available";
  }
};

/**
 * Formats a time string or Date object for display
 * @param {string|Date} timeInput - The time to format
 * @returns {string} Formatted time string or fallback
 */
const formatTime = (timeInput) => {
  if (!timeInput) return "Time not specified";

  // If it's already a string in time format like "14:00", return it
  if (typeof timeInput === "string" && /^\d{1,2}:\d{2}$/.test(timeInput)) {
    return timeInput;
  }

  try {
    // If it's a Date object or can be converted to one, format it
    const date = new Date(timeInput);
    if (isNaN(date.getTime())) {
      return String(timeInput);
    }
    return format(date, "h:mm aaa");
  } catch (error) {
    console.error("Error formatting time:", error, "Input:", timeInput);
    // Fallback: convert to string to avoid React error with Date objects
    return String(timeInput);
  }
};

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

/**
 * Displays pending booking section with driver bids
 * @param {Object} booking - The booking object
 * @param {Array} driverBids - Array of driver bids
 * @param {Function} onDriverSelect - Function to handle driver selection
 */
const PendingBookingSection = ({
  booking,
  driverBids = [],
  onDriverSelect,
}) => {
  const [displayBids, setDisplayBids] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDriverForInfo, setSelectedDriverForInfo] = useState(null);
  const [showDriverInfoModal, setShowDriverInfoModal] = useState(false);
  const [showAllBidsModal, setShowAllBidsModal] = useState(false);
  const [sortOrder, setSortOrder] = useState("price_asc");

  // Fetch additional driver details if needed
  useEffect(() => {
    const fetchDriverDetails = async () => {
      if (!driverBids || driverBids.length === 0) return;

      setIsLoading(true);

      try {
        // Process the bids to ensure they have driver details
        const processedBids = await Promise.all(
          driverBids.map(async (bid) => {
            // Create a base object with fallback values
            let driverDetails = {
              name: bid.name || "Driver",
              profilePhoto: bid.profilePhoto || null,
              rating: bid.rating || bid.driverRating || 4.5,
              trips: bid.trips || Math.floor(Math.random() * 200) + 50,
              vehicle: bid.vehicle || "Transport Vehicle",
            };

            // Only fetch if we have a driverId and it's not already fetched
            if (
              bid.driverId &&
              (!bid.name ||
                bid.name === "Driver" ||
                bid.name === "Anonymous Driver")
            ) {
              try {
                const token = localStorage.getItem("token");
                // Use the full URL from env variable
                const apiUrl = `${
                  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"
                }/api/drivers/${bid.driverId}/public`;
                // console.log("Fetching driver details from:", apiUrl);

                const response = await fetch(apiUrl, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                });

                if (response.ok) {
                  const data = await response.json();
                  if (data.success && data.driver) {
                    // Update driver details with real information
                    driverDetails = {
                      ...driverDetails,
                      name: data.driver.fullName || driverDetails.name,
                      profilePhoto:
                        data.driver.profileImage || driverDetails.profilePhoto,
                      rating: data.driver.rating || driverDetails.rating,
                      trips:
                        data.driver.stats?.totalTrips || driverDetails.trips,
                      vehicle: data.driver.vehicleDetails?.make
                        ? `${data.driver.vehicleDetails.make} ${
                            data.driver.vehicleDetails.model || ""
                          }`
                        : driverDetails.vehicle,
                      experience:
                        data.driver.experience || "Experienced Driver",
                      isVerified: data.driver.isVerified || false,
                      vehicleDetails: data.driver.vehicleDetails,
                    };
                  }
                } else {
                  console.warn(
                    `Failed to fetch driver details: ${response.status}`
                  );
                }
              } catch (error) {
                console.error(
                  `Error fetching details for driver ${bid.driverId}:`,
                  error
                );
                // Continue with fallback data
              }
            }

            // Create consistent bid objects from different data sources
            return {
              id: bid.id || bid._id || `bid-${Date.now()}`,
              driverId: bid.driverId || bid.id,
              name: driverDetails.name,
              profilePhoto: driverDetails.profilePhoto,
              rating: driverDetails.rating,
              trips: driverDetails.trips,
              vehicle: driverDetails.vehicle,
              experience: driverDetails.experience,
              isVerified: driverDetails.isVerified,
              vehicleDetails: driverDetails.vehicleDetails,
              price: bid.price || bid.amount || 0,
              bidTime: new Date(bid.bidTime || bid.createdAt || new Date()),
              status: bid.status || "pending",
              note: bid.note || "",
              isLowestBid: false,
            };
          })
        );

        // Sort bids by price (lowest first)
        const sortedBids = processedBids.sort((a, b) => a.price - b.price);

        // Mark the lowest bid
        if (sortedBids.length > 0) {
          sortedBids[0].isLowestBid = true;
        }

        setDisplayBids(sortedBids);
      } catch (error) {
        console.error("Error processing driver bids:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDriverDetails();
  }, [driverBids]);

  // Listen for WebSocket bid updates
  useEffect(() => {
    const handleBidUpdate = (event) => {
      const { bookingId, bid, type } = event.detail;

      // Make sure this update is for the current booking
      if (!booking || (!booking._id && !booking.bookingId)) {
        return;
      }

      const bookingReference = booking._id || booking.bookingId;
      const updateReference = bookingId;

      if (
        bookingReference === updateReference ||
        booking._id?.toString() === updateReference ||
        booking.bookingId?.toString() === updateReference
      ) {
        // Process the new bid data
        const newBid = {
          id: bid.id || bid._id || `bid-${Date.now()}`,
          driverId: bid.driverId || bid.driver,
          name: bid.name || "Driver",
          profilePhoto: bid.profilePhoto || null,
          rating: bid.driverRating || bid.rating || 4.5,
          trips: bid.trips || Math.floor(Math.random() * 200) + 50,
          vehicle: bid.vehicle || "Transport Vehicle",
          price: bid.amount || bid.price || 0,
          bidTime: new Date(bid.bidTime || bid.createdAt || new Date()),
          status: bid.status || "pending",
          note: bid.note || bid.notes || "",
          isLowestBid: false,
        };

        // Fetch driver details if possible
        if (bid.driverId) {
          fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/drivers/${
              bid.driverId
            }/public`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
            .then((response) => {
              if (response.ok) return response.json();
              throw new Error("Failed to fetch driver details");
            })
            .then((data) => {
              if (data.success && data.driver) {
                const updatedBid = {
                  ...newBid,
                  name:
                    data.driver.fullName || data.driver.username || newBid.name,
                  profilePhoto: data.driver.profileImage || newBid.profilePhoto,
                  rating: data.driver.rating || newBid.rating,
                  trips: data.driver.stats?.totalTrips || newBid.trips,
                  vehicle: data.driver.vehicleDetails?.make
                    ? `${data.driver.vehicleDetails.make} ${data.driver.vehicleDetails.model}`
                    : newBid.vehicle,
                  experience: data.driver.experience || "Experienced Driver",
                  languages: data.driver.languages || ["English", "Hindi"],
                  bio: data.driver.bio || null,
                };

                updateBidsWithDriver(updatedBid);
              }
            })
            .catch((error) => {
              console.error(
                "Error fetching driver details for new bid:",
                error
              );
              updateBidsWithDriver(newBid);
            });
        } else {
          updateBidsWithDriver(newBid);
        }
      }
    };

    const updateBidsWithDriver = (newBid) => {
      // Update the displayBids state
      setDisplayBids((prevBids) => {
        // Check if this bid already exists
        const existingBidIndex = prevBids.findIndex(
          (b) => b.driverId === newBid.driverId
        );

        let updatedBids;
        if (existingBidIndex >= 0) {
          // Update existing bid
          updatedBids = [...prevBids];
          updatedBids[existingBidIndex] = {
            ...updatedBids[existingBidIndex],
            ...newBid,
          };
        } else {
          // Add new bid
          updatedBids = [...prevBids, newBid];
        }

        // Sort by price and mark lowest bid
        const sortedBids = updatedBids.sort((a, b) => a.price - b.price);
        return sortedBids.map((bid, index) => ({
          ...bid,
          isLowestBid: index === 0,
        }));
      });
    };

    // Listen for the custom bid:update event
    document.addEventListener("bid:update", handleBidUpdate);

    // Cleanup
    return () => {
      document.removeEventListener("bid:update", handleBidUpdate);
    };
  }, [booking]);

  // Handle sorting bids
  const sortBids = (bids, order) => {
    let sortedBids = [...bids];

    switch (order) {
      case "price_asc":
        sortedBids.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        sortedBids.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sortedBids.sort((a, b) => b.rating - a.rating);
        break;
      case "trips":
        sortedBids.sort((a, b) => b.trips - a.trips);
        break;
      case "recent":
        sortedBids.sort((a, b) => new Date(b.bidTime) - new Date(a.bidTime));
        break;
      default:
        sortedBids.sort((a, b) => a.price - b.price);
    }

    // Always mark the lowest priced bid
    const lowestPriceBid = [...bids].sort((a, b) => a.price - b.price)[0];
    return sortedBids.map((bid) => ({
      ...bid,
      isLowestBid: bid.driverId === lowestPriceBid?.driverId,
    }));
  };

  // Show driver info modal
  const showDriverInfo = (driver) => {
    setSelectedDriverForInfo(driver);
    setShowDriverInfoModal(true);
  };

  // Get pickup date and time
  const pickupDate =
    booking?.schedule?.date || booking?.pickupDate || booking?.date;
  const pickupTime =
    booking?.schedule?.time || booking?.pickupTime || booking?.time;

  // Handle estimated price display
  const estimatedPriceMin = booking?.estimatedPrice?.min || 0;
  const estimatedPriceMax = booking?.estimatedPrice?.max || 0;

  // Determine how many bids to show in the main view
  const displayCount = 6;
  const visibleBids = displayBids.slice(0, displayCount);
  const hasMoreBids = displayBids.length > displayCount;

  // Add this to PendingBookingSection.jsx - in the component function
  useEffect(() => {
    // Handler for real-time driver updates
    const handleDriverUpdate = (event) => {
      const { driverId, driver } = event.detail;

      if (!driverId || !driver) return;

      // Update any matching bids with new driver information
      setDisplayBids((prevBids) => {
        return prevBids.map((bid) => {
          if (bid.driverId === driverId) {
            return {
              ...bid,
              name: driver.fullName || driver.name || bid.name,
              profilePhoto:
                driver.profileImage || driver.profilePhoto || bid.profilePhoto,
              rating: driver.rating || bid.rating,
              vehicle: driver.vehicleDetails?.make
                ? `${driver.vehicleDetails.make} ${
                    driver.vehicleDetails.model || ""
                  }`
                : bid.vehicle,
              trips: driver.stats?.totalTrips || driver.trips || bid.trips,
              experience: driver.experience || bid.experience,
              isVerified:
                driver.isVerified !== undefined
                  ? driver.isVerified
                  : bid.isVerified,
            };
          }
          return bid;
        });
      });
    };

    // Listen for driver update events
    document.addEventListener("driver:update", handleDriverUpdate);

    // Cleanup listener on unmount
    return () => {
      document.removeEventListener("driver:update", handleDriverUpdate);
    };
  }, []);

  useEffect(() => {
    // Poll for driver updates every 10 seconds as fallback for WebSocket
    const pollInterval = setInterval(async () => {
      if (!driverBids || driverBids.length === 0) return;

      // Only poll for drivers we already have bids for
      const driverIds = driverBids.map((bid) => bid.driverId).filter(Boolean);

      // Skip polling if no valid driver IDs
      if (driverIds.length === 0) return;

      try {
        const token = localStorage.getItem("token");
        // Poll for latest data for each driver
        driverIds.forEach(async (driverId) => {
          try {
            const response = await fetch(
              `${
                import.meta.env.VITE_BACKEND_URL
              }/api/drivers/${driverId}/public`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (response.ok) {
              const data = await response.json();
              if (data.success && data.driver) {
                // Create and dispatch the same event used by WebSockets
                const event = new CustomEvent("driver:update", {
                  detail: {
                    driverId,
                    driver: data.driver,
                  },
                });
                document.dispatchEvent(event);
              }
            }
          } catch (error) {
            console.error(`Error polling driver ${driverId}:`, error);
          }
        });
      } catch (error) {
        console.error("Error in driver polling:", error);
      }
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(pollInterval);
  }, [driverBids]);

  return (
    <>
      <div className="mb-6 bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold text-gray-900">
                Driver Bidding
              </h2>
              <p className="mt-2 text-gray-600">
                Select from available driver bids for your transport
              </p>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg">
              <p className="text-lg font-medium text-gray-900">
                Estimated Price
              </p>
              <p className="text-3xl font-bold text-red-600">
                ₹{estimatedPriceMin} - ₹{estimatedPriceMax}
              </p>
            </div>
          </div>

          <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
            <div className="flex items-start">
              <FaInfoCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
              <div className="ml-3">
                <p className="text-sm text-yellow-700 font-medium">
                  Important Notice
                </p>
                <p className="mt-1 text-sm text-yellow-600">
                  To ensure timely service, please select your preferred driver
                  at least 24 hours before your scheduled pickup time. If no
                  selection is made, our system will automatically assign the
                  most suitable driver based on rating and price to ensure your
                  booking proceeds smoothly.
                </p>
                <p className="mt-2 text-sm font-medium text-yellow-700">
                  Pickup scheduled for: {formatDate(pickupDate)} at{" "}
                  {formatTime(pickupTime)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            </div>
          ) : displayBids.length > 0 ? (
            <>
              {/* Sorting options */}
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="text-sm text-gray-600 pt-1">Sort by:</span>
                <button
                  onClick={() => setSortOrder("price_asc")}
                  className={`text-sm px-3 py-1 rounded-full cursor-pointer ${
                    sortOrder === "price_asc"
                      ? "bg-red-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Lowest Price
                </button>
                <button
                  onClick={() => setSortOrder("price_desc")}
                  className={`text-sm px-3 py-1 rounded-full cursor-pointer ${
                    sortOrder === "price_desc"
                      ? "bg-red-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Highest Price
                </button>
                <button
                  onClick={() => setSortOrder("rating")}
                  className={`text-sm px-3 py-1 rounded-full cursor-pointer ${
                    sortOrder === "rating"
                      ? "bg-red-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Top Rated
                </button>
                <button
                  onClick={() => setSortOrder("trips")}
                  className={`text-sm px-3 py-1 rounded-full cursor-pointer ${
                    sortOrder === "trips"
                      ? "bg-red-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Most Experienced
                </button>
                <button
                  onClick={() => setSortOrder("recent")}
                  className={`text-sm px-3 py-1 rounded-full cursor-pointer ${
                    sortOrder === "recent"
                      ? "bg-red-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Recent Bids
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xll:grid-cols-3 gap-4">
                {sortBids(visibleBids, sortOrder).map((driver) => (
                  <div
                    key={driver.id}
                    className="bg-white rounded-xl shadow p-4 flex flex-col sm:flex-row gap-4 transition-all border border-transparent hover:border-red-200 hover:shadow-lg"
                  >
                    {/* Driver Photo */}
                    <div className="flex-shrink-0 flex justify-center transition-all">
                      {driver.profilePhoto ? (
                        <img
                          src={driver.profilePhoto}
                          alt={driver.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 hover:shadow-lg cursor-pointer hover:scale-115 transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            showDriverInfo(driver);
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                          <FaUserCircle className="w-10 h-10 text-gray-400" />
                        </div>
                      )}
                      {driver.isVerified && (
                        <div className="absolute -mt-2 ml-12">
                          <div className="bg-blue-500 rounded-full p-1 border-2 border-white">
                            <FaMedal className="text-white text-xs" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Driver Info */}
                    <div className="flex-1 space-y-1 overflow-hidden">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <h4
                          className="font-medium text-gray-900 truncate hover:text-red-500 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            showDriverInfo(driver);
                          }}
                        >
                          {driver.name}
                        </h4>
                        <div className="flex items-center text-sm">
                          <FaStar className="text-yellow-400 mr-1" />
                          <span>{driver.rating}</span>
                          <span className="mx-1 text-gray-300">•</span>
                          <span>{driver.trips} trips</span>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600 flex flex-wrap gap-y-1">
                        <div className="flex items-center mr-4">
                          <FaTruck className="mr-1 text-gray-500" />
                          <span className="truncate max-w-[150px]">
                            {driver.vehicle}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <FaClock className="mr-1 text-gray-500" />
                          <span title={formatDateTime(driver.bidTime)}>
                            Bid placed: {formatDateTime(driver.bidTime)}
                          </span>
                        </div>
                      </div>

                      {/* Price and Select Button */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mt-2">
                        <div className="flex items-center">
                          <div>
                            <span className="text-lg sm:text-xl font-bold text-gray-900">
                              ₹{driver.price.toLocaleString("en-IN")}
                            </span>
                            {driver.isLowestBid && (
                              <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                                Lowest Bid
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              showDriverInfo(driver);
                            }}
                            className="py-1.5 px-3 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex-1 sm:flex-initial cursor-pointer"
                          >
                            View Details
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDriverSelect(driver);
                            }}
                            className="py-1.5 px-4 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 hover:scale-105 hover:shadow-lg flex-1 sm:flex-initial cursor-pointer"
                          >
                            Select
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* View more button */}
              {hasMoreBids && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setShowAllBidsModal(true)}
                    className="inline-flex items-center gap-2 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    <FaEye /> View All Bids ({displayBids.length})
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaInfoCircle className="text-3xl text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                No bids yet
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Drivers will start bidding on your booking soon. Check back
                later for updates.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Driver Info Modal */}
      {showDriverInfoModal && selectedDriverForInfo && (
        <DriverInfoModal
          driver={selectedDriverForInfo}
          isOpen={showDriverInfoModal}
          onClose={() => setShowDriverInfoModal(false)}
        />
      )}

      {/* All Bids Modal */}
      {showAllBidsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  All Driver Bids
                </h2>
                <button
                  onClick={() => setShowAllBidsModal(false)}
                  className="text-gray-500 hover:text-gray-700"
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

              {/* Sorting options */}
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <button
                  onClick={() => setSortOrder("price_asc")}
                  className={`text-sm px-3 py-1 rounded-full ${
                    sortOrder === "price_asc"
                      ? "bg-red-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Lowest Price
                </button>
                <button
                  onClick={() => setSortOrder("price_desc")}
                  className={`text-sm px-3 py-1 rounded-full ${
                    sortOrder === "price_desc"
                      ? "bg-red-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Highest Price
                </button>
                <button
                  onClick={() => setSortOrder("rating")}
                  className={`text-sm px-3 py-1 rounded-full ${
                    sortOrder === "rating"
                      ? "bg-red-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Top Rated
                </button>
                <button
                  onClick={() => setSortOrder("trips")}
                  className={`text-sm px-3 py-1 rounded-full ${
                    sortOrder === "trips"
                      ? "bg-red-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Most Experienced
                </button>
                <button
                  onClick={() => setSortOrder("recent")}
                  className={`text-sm px-3 py-1 rounded-full ${
                    sortOrder === "recent"
                      ? "bg-red-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Recent Bids
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sortBids(displayBids, sortOrder).map((driver) => (
                  <div
                    key={driver.id}
                    className="bg-white hover:bg-gray-50 rounded-xl shadow p-4 flex flex-col sm:flex-row gap-4 cursor-pointer transition-all border border-transparent hover:border-red-200"
                  >
                    {/* Driver Photo */}
                    <div className="flex-shrink-0 flex justify-center">
                      {driver.profilePhoto ? (
                        <img
                          src={driver.profilePhoto}
                          alt={driver.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                          <FaUserCircle className="w-10 h-10 text-gray-400" />
                        </div>
                      )}
                      {driver.isVerified && (
                        <div className="absolute -mt-2 ml-12">
                          <div className="bg-blue-500 rounded-full p-1 border-2 border-white">
                            <FaMedal className="text-white text-xs" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Driver Info */}
                    <div className="flex-1 space-y-1 overflow-hidden">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <h4 className="font-medium text-gray-900 truncate">
                          {driver.name}
                        </h4>
                        <div className="flex items-center text-sm">
                          <FaStar className="text-yellow-400 mr-1" />
                          <span>{driver.rating}</span>
                          <span className="mx-1 text-gray-300">•</span>
                          <span>{driver.trips} trips</span>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600 flex flex-wrap gap-y-1">
                        <div className="flex items-center mr-4">
                          <FaTruck className="mr-1 text-gray-500" />
                          <span className="truncate max-w-[150px]">
                            {driver.vehicle}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <FaClock className="mr-1 text-gray-500" />
                          <span title={formatDateTime(driver.bidTime)}>
                            Bid placed: {formatDateTime(driver.bidTime)}
                          </span>
                        </div>
                      </div>

                      {/* Price and Select Button */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mt-2">
                        <div className="flex items-center">
                          <div>
                            <span className="text-lg sm:text-xl font-bold text-gray-900">
                              ₹{driver.price.toLocaleString("en-IN")}
                            </span>
                            {driver.isLowestBid && (
                              <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                                Lowest Bid
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              showDriverInfo(driver);
                            }}
                            className="py-1.5 px-3 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex-1 sm:flex-initial"
                          >
                            View Details
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDriverSelect(driver);
                            }}
                            className="py-1.5 px-4 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 flex-1 sm:flex-initial"
                          >
                            Select
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PendingBookingSection;
