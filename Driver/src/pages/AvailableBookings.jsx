import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FaCalendarAlt,
  FaWeightHanging,
  FaMoneyBillWave,
  FaTruck,
  FaFilter,
  FaSearch,
  FaArrowRight,
  FaMapMarkerAlt,
  FaClock,
  FaBoxOpen,
  FaChevronRight,
  FaExpandAlt,
  FaLocationArrow,
  FaExclamationTriangle,
  FaMapPin,
  FaWifi,
  FaMinus,
  FaPlus,
  FaRupeeSign,
} from "react-icons/fa";
import ProfileUpdateModal from "../components/ProfileUpdateModal";
import { FiFilter, FiTrash } from "react-icons/fi";
import DashboardLayout from "../components/DashboardLayout";
import { useWebSocket } from "../context/WebSocketContext";

const AvailableBookings = () => {
  const navigate = useNavigate();
  const { isConnected } = useWebSocket();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState(false);
  const [hasAddress, setHasAddress] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchRadius, setSearchRadius] = useState(10); // Default 10km radius
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    date: "",
    loadType: "",
    priceMin: "",
    priceMax: "",
  });

  // Set dynamic page title when component mounts
  useEffect(() => {
    // Update the document title
    document.title = "Available Jobs | Find Transport Work | Shiftly - A Seamless Transport System";
    
    // Optional: Restore the original title when component unmounts
    return () => {
      document.title = "Shiftly | A Seamless Transport System";
    };
  }, []);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  // Fetch driver profile data
  const fetchDriverProfile = async () => {
    try {
      setLoading(true);

      // Get the driver token and log it (partially masked)
      const driverToken = localStorage.getItem("driverToken");
      if (driverToken) {
        // Log just the beginning and length for debugging (don't expose full token)
        // console.log("Token starts with:", driverToken.substring(0, 10) + "...");
        // console.log("Token length:", driverToken.length);
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/driver/me/profile`,
        {
          headers: {
            Authorization: `Bearer ${driverToken}`,
          },
        }
      );

      if (!response.ok) {
        // console.error("Profile fetch error status:", response.status);
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      // console.log("Profile data received:", data ? "yes" : "no");
      // Log structure of data safely (without exposing sensitive info)
      // console.log(
      //   "Profile data structure:",
      //   Object.keys(data).join(", "),
      //   "personalDetails exists:",
      //   !!data.personalDetails,
      //   data.personalDetails
      //     ? `address exists: ${!!data.personalDetails.address}`
      //     : ""
      // );

      setDriver(data);

      // Check if driver has complete address
      const hasValidAddress =
        data?.personalDetails?.address?.current?.addressLine1 &&
        data?.personalDetails?.address?.current?.city &&
        data?.personalDetails?.address?.current?.state &&
        data?.personalDetails?.address?.current?.pincode;

      // console.log("Address validation:", {
      //   hasAddress: !!data?.personalDetails?.address?.current,
      //   hasCity: !!data?.personalDetails?.address?.current?.city,
      //   hasState: !!data?.personalDetails?.address?.current?.state,
      //   isValid: hasValidAddress,
      // });

      setHasAddress(hasValidAddress);

      // Show modal if address not found
      if (!hasValidAddress) {
        setIsProfileModalOpen(true);
      } else {
        // Only fetch bookings if driver has address
        fetchAvailableBookings();
      }

      setLoading(false);
    } catch (err) {
      // Console log the error for debugging
      console.error("Error fetching profile:", err);
      setError("Failed to load your profile. Please try again.");
      setLoading(false);
    }
  };

  // Call fetchDriverProfile on component mount
  useEffect(() => {
    fetchDriverProfile();
  }, []);

  // Update search radius and refetch data
  useEffect(() => {
    if (hasAddress) {
      fetchAvailableBookings();
    }
  }, [searchRadius]);

  // Fetch available bookings from API
  const fetchAvailableBookings = async () => {
    try {
      setLoading(true);

      // Get the driver token
      const driverToken = localStorage.getItem("driverToken");
      if (!driverToken) {
        navigate("/login");
        setLoading(false);
        return;
      }

      // Fetch real bookings from the backend
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/bookings/available?radius=${searchRadius}`,
        {
          headers: {
            Authorization: `Bearer ${driverToken}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Authentication error. Please login again.");
          localStorage.removeItem("driverToken");
          navigate("/login");
          setLoading(false);
          return;
        }

        throw new Error(`Failed to fetch bookings: ${response.status}`);
      }

      const data = await response.json();

      if (data.bookings && Array.isArray(data.bookings)) {
        // Log the first booking for debugging purposes
        if (data.bookings.length > 0) {
          // console.log("Sample booking data format:", data.bookings[0]);
        }

        setBookings(data.bookings);
      } else {
        // Set empty array if API response is not as expected
        setBookings([]);
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching available bookings:", err);
      toast.error("Failed to load available bookings");
      setBookings([]);
      setLoading(false);
    }
  };

  // Update filteredBookings whenever bookings changes
  useEffect(() => {
    setFilteredBookings(bookings);
  }, [bookings]);

  // Apply search and filter
  useEffect(() => {
    if (!hasAddress || bookings.length === 0) {
      return;
    }

    let filtered = [...bookings];

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.pickup?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.destination
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          booking.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.loadType?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    if (filters.date) {
      filtered = filtered.filter((booking) => {
        // Handle different date formats
        const bookingDate = new Date(booking.date || booking.schedule?.date);
        const filterDate = new Date(filters.date);
        return bookingDate.toDateString() === filterDate.toDateString();
      });
    }

    if (filters.loadType) {
      filtered = filtered.filter(
        (booking) =>
          booking.loadType === filters.loadType ||
          booking.goods?.type === filters.loadType
      );
    }

    // Apply price range filters
    if (filters.priceMin) {
      filtered = filtered.filter((booking) => {
        // Extract price values from different possible formats
        let bookingPrice = 0;

        // Handle price range format ("1000-2000")
        if (booking.priceRange && typeof booking.priceRange === "string") {
          const [_, max] = booking.priceRange
            .split("-")
            .map((p) => parseInt(p.trim()));
          // Compare with the max value of the range
          return max >= parseInt(filters.priceMin);
        }
        // Handle price range as object
        else if (booking.priceRange && typeof booking.priceRange === "object") {
          return booking.priceRange.max >= parseInt(filters.priceMin);
        }
        // Handle estimated price
        else if (booking.estimatedPrice) {
          return parseInt(booking.estimatedPrice) >= parseInt(filters.priceMin);
        }
        // Fallback to regular price or totalAmount
        else {
          bookingPrice = booking.price || booking.totalAmount || 0;
          return parseInt(bookingPrice) >= parseInt(filters.priceMin);
        }
      });
    }

    if (filters.priceMax) {
      filtered = filtered.filter((booking) => {
        // Extract price values from different possible formats
        let bookingPrice = 0;

        // Handle price range format ("1000-2000")
        if (booking.priceRange && typeof booking.priceRange === "string") {
          const [min, _] = booking.priceRange
            .split("-")
            .map((p) => parseInt(p.trim()));
          // Compare with the min value of the range
          return min <= parseInt(filters.priceMax);
        }
        // Handle price range as object
        else if (booking.priceRange && typeof booking.priceRange === "object") {
          return booking.priceRange.min <= parseInt(filters.priceMax);
        }
        // Handle estimated price
        else if (booking.estimatedPrice) {
          return parseInt(booking.estimatedPrice) <= parseInt(filters.priceMax);
        }
        // Fallback to regular price or totalAmount
        else {
          bookingPrice = booking.price || booking.totalAmount || 0;
          return parseInt(bookingPrice) <= parseInt(filters.priceMax);
        }
      });
    }

    setFilteredBookings(filtered);
  }, [searchTerm, filters, bookings, hasAddress]);

  const handleResetFilters = () => {
    // Reset all filter states
    setFilters({
      date: "",
      loadType: "",
      priceMin: "",
      priceMax: "",
    });
    setFilterActive(false);
    setSearchTerm("");

    // Reset search and refetch bookings
    fetchAvailableBookings();

    // Reset filtered bookings to match all bookings
    setFilteredBookings(bookings);
  };

  const handleCloseModal = () => {
    setIsProfileModalOpen(false);
    document.body.style.overflow = "auto"; // Re-enable scrolling
  };

  // Get unique load types for filter
  const getUniqueLoadTypes = () => {
    return [
      ...new Set(
        bookings
          .map((booking) => booking.loadType || booking.goods?.type)
          .filter(Boolean)
      ),
    ];
  };

  /**
   * Formats a date for display
   * @param {string|Date} dateString - The date to format
   * @returns {String} Formatted date string
   */
  const formatDate = (dateString) => {
    if (!dateString) return "";

    try {
      // Log for debugging date format issues
      console.debug("Formatting date:", dateString, typeof dateString);

      // Convert to date object
      const date = new Date(dateString);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn("Invalid date:", dateString);
        return "";
      }

      // Format as DD MMM YYYY
      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error, "Input:", dateString);
      return "";
    }
  };

  /**
   * Formats price range or estimated price for display
   * @param {Object} booking - The booking object
   * @returns {String} Formatted price in Indian Rupees
   */
  const formatPriceRange = (booking) => {
    try {
      // Check if booking has a price range as a string (e.g. "1000-2000")
      if (booking.priceRange && typeof booking.priceRange === "string") {
        // Split the price range and format each value
        const parts = booking.priceRange.split("-");
        if (parts.length === 2) {
          const min = parseInt(parts[0].trim());
          const max = parseInt(parts[1].trim());

          if (!isNaN(min) && !isNaN(max)) {
            // Format numbers with Indian number formatting (commas)
            const formattedMin = min.toLocaleString("en-IN");
            const formattedMax = max.toLocaleString("en-IN");
            return `₹${formattedMin} - ₹${formattedMax}`;
          }
        }
        // If we couldn't parse properly, just return the string as is with ₹ symbol
        return `₹${booking.priceRange}`;
      }
      // Check if booking has a price range as an object
      else if (booking.priceRange && typeof booking.priceRange === "object") {
        const min = parseInt(booking.priceRange.min);
        const max = parseInt(booking.priceRange.max);

        if (!isNaN(min) && !isNaN(max)) {
          const formattedMin = min.toLocaleString("en-IN");
          const formattedMax = max.toLocaleString("en-IN");
          return `₹${formattedMin} - ₹${formattedMax}`;
        }
      }
      // Check for estimatedPrice as object
      else if (
        booking.estimatedPrice &&
        typeof booking.estimatedPrice === "object"
      ) {
        const min = parseInt(booking.estimatedPrice.min);
        const max = parseInt(booking.estimatedPrice.max);

        if (!isNaN(min) && !isNaN(max)) {
          const formattedMin = min.toLocaleString("en-IN");
          const formattedMax = max.toLocaleString("en-IN");
          return `₹${formattedMin} - ₹${formattedMax}`;
        }
      }
      // Check for estimated price as number
      else if (booking.estimatedPrice) {
        // Try to parse as number
        const price = parseFloat(booking.estimatedPrice);
        if (!isNaN(price)) {
          return `₹${parseInt(price).toLocaleString("en-IN")}`;
        }
        // If it's a string and can't be parsed, just return it with ₹ symbol
        return `₹${booking.estimatedPrice}`;
      }
      // Fallback to regular price or totalAmount
      else {
        const price =
          booking.price || booking.totalAmount || booking.amount || 0;
        return `₹${parseInt(price).toLocaleString("en-IN")}`;
      }
    } catch (error) {
      console.error("Error formatting price range:", error, booking);
      return "₹0";
    }
  };

  // Check if driver has address and show profile modal if missing
  useEffect(() => {
    if (driver && !driver?.personalDetails?.address?.current?.city) {
      setIsProfileModalOpen(true);
    }
  }, [driver]);

  // Handle viewing booking details
  const handleViewDetails = (booking) => {
    navigate(`/booking/${booking._id || booking.id || booking.bookingId}`);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full overflow-hidden bg-gray-50">
        <div className="flex-1 overflow-y-auto">
          <main className="h-full p-4 md:p-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2 md:mb-0">
                Available Bookings
              </h1>
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <span
                  className={
                    isConnected
                      ? "text-green-600 flex items-center gap-1"
                      : "text-red-600 flex items-center gap-1"
                  }
                >
                  <FaWifi className="text-xs" />
                  {isConnected ? "Connected" : "Offline"}
                </span>
                •
                <span>
                  {filteredBookings.length}{" "}
                  {filteredBookings.length === 1 ? "booking" : "bookings"} found
                </span>
              </div>
            </div>

            {/* Error message with improved styling */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 p-4 rounded-xl text-red-700 flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-full">
                  <FaExclamationTriangle className="text-red-500" />
                </div>
                <div>
                  <h3 className="font-medium">Error</h3>
                  <p>{error}</p>
                </div>
              </div>
            )}

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="pl-11 pr-4 py-3 w-full rounded-xl border-2 border-gray-100 focus:border-red-500 focus:ring focus:ring-red-200 transition-all shadow-sm"
                    placeholder="Search by location, booking ID or load type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={!hasAddress || loading}
                  />
                </div>

                {/* Distance/Radius Filter with improved styling */}
                <div className="relative">
                  <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-gray-100 text-gray-700 shadow-sm">
                    <FaLocationArrow className="text-red-500" />
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        value={searchRadius}
                        onChange={(e) =>
                          setSearchRadius(Math.max(1, Number(e.target.value)))
                        }
                        className="w-16 appearance-none bg-transparent border-none focus:outline-none text-center font-medium"
                        disabled={!hasAddress || loading}
                      />
                      <span className="text-gray-600">km</span>
                    </div>
                    <div className="flex items-center gap-1 ml-2 border-l border-gray-200 pl-2">
                      <button
                        onClick={() =>
                          setSearchRadius((prev) => Math.max(1, prev - 5))
                        }
                        className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 disabled:opacity-50 cursor-pointer"
                        disabled={!hasAddress || loading || searchRadius <= 1}
                      >
                        <FaMinus className="text-xs" />
                      </button>
                      <button
                        onClick={() => setSearchRadius((prev) => prev + 5)}
                        className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 disabled:opacity-50 cursor-pointer"
                        disabled={!hasAddress || loading}
                      >
                        <FaPlus className="text-xs" />
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setFilterActive(!filterActive)}
                  className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-2 cursor-pointer hover:shadow-md transition-all ${
                    filterActive
                      ? "bg-red-50 border-red-500 text-red-600"
                      : "border-gray-100 text-gray-700 hover:border-gray-200"
                  }`}
                  disabled={!hasAddress || loading}
                >
                  <FaFilter
                    className={filterActive ? "text-red-500" : "text-gray-400"}
                  />
                  <span>Filters</span>
                  {Object.values(filters).some((val) => val) && (
                    <span className="ml-1 bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </button>
              </div>

              {/* Filter Options with improved styling */}
              {filterActive && (
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaCalendarAlt className="inline-block mr-2 text-red-500" />
                        Date
                      </label>
                      <input
                        type="date"
                        className="w-full p-2.5 rounded-lg border-2 border-gray-100 focus:border-red-500 focus:ring focus:ring-red-200"
                        value={filters.date}
                        onChange={(e) =>
                          setFilters({ ...filters, date: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaBoxOpen className="inline-block mr-2 text-red-500" />
                        Load Type
                      </label>
                      <select
                        className="w-full p-2.5 rounded-lg border-2 border-gray-100 focus:border-red-500 focus:ring focus:ring-red-200"
                        value={filters.loadType}
                        onChange={(e) =>
                          setFilters({ ...filters, loadType: e.target.value })
                        }
                      >
                        <option value="">All Types</option>
                        {getUniqueLoadTypes().map((type) => (
                          <option key={type} value={type}>
                            {type.replace(/_/g, " ")}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Price Range Filter with improved styling */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaMoneyBillWave className="inline-block mr-2 text-red-500" />
                        Price Range (₹)
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaRupeeSign className="text-gray-400 text-sm" />
                          </div>
                          <input
                            type="number"
                            min="0"
                            placeholder="Min"
                            className="pl-8 pr-2 py-2.5 w-full rounded-lg border-2 border-gray-100 focus:border-red-500 focus:ring focus:ring-red-200"
                            value={filters.priceMin}
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                priceMin: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaRupeeSign className="text-gray-400 text-sm" />
                          </div>
                          <input
                            type="number"
                            min="0"
                            placeholder="Max"
                            className="pl-8 pr-2 py-2.5 w-full rounded-lg border-2 border-gray-100 focus:border-red-500 focus:ring focus:ring-red-200"
                            value={filters.priceMax}
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                priceMax: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-end">
                      <button
                        onClick={handleResetFilters}
                        className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 hover:bg-gray-200 transition rounded-lg cursor-pointer hover:shadow-sm flex items-center justify-center gap-2"
                      >
                        <FiTrash className="text-gray-500" />
                        Reset Filters
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Loading state with improved styling */}
            {loading && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 mb-6 flex justify-center items-center">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-red-500 mb-3"></div>
                  <p className="text-gray-600">Loading available bookings...</p>
                </div>
              </div>
            )}

            {/* Display Bookings - More compact rectangle cards */}
            {bookings.length > 0 && !loading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-10">
                {filteredBookings.map((booking) => (
                  <div
                    key={booking.id || booking._id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
                  >
                    {/* Price highlight on top */}
                    <div className="bg-red-50 rounded-t-lg px-4 py-2 flex items-center justify-between">
                      <span className="text-red-600 font-semibold text-sm lg:text-lg flex items-center">
                        <FaMoneyBillWave className="mr-1" /> Price Range
                      </span>
                      <span className="text-lg font-bold text-gray-800">
                        {formatPriceRange(booking)}
                      </span>
                    </div>

                    {/* Booking Details */}
                    <div className="p-4">
                      {/* Booking ID and Date */}
                      <div className="flex justify-between items-start mb-3">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                          {booking.id || booking._id || booking.bookingId}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDate(
                            booking.pickupDate ||
                              booking.date ||
                              booking.schedule?.date ||
                              booking.pickupDateTime
                          )}
                          {booking.time || booking.schedule?.time
                            ? ` • ${booking.time || booking.schedule?.time}`
                            : ""}
                        </span>
                      </div>

                      {/* Locations */}
                      <div className="space-y-3 mb-4">
                        {/* Pickup */}
                        <div className="flex items-start gap-3">
                          <div className="min-w-[24px] h-6 flex justify-center items-center">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {(() => {
                                // Try to extract city, state and pincode from different data formats
                                let cityText = "";
                                let stateText = "";
                                let pincodeText = "";

                                // Extract pincode from various possible formats
                                if (booking.pickup?.pincode) {
                                  pincodeText = booking.pickup.pincode;
                                } else if (booking.pickupLocation?.pincode) {
                                  pincodeText = booking.pickupLocation.pincode;
                                } else if (typeof booking.pickup === "string") {
                                  const match = booking.pickup.match(/\d{6}/);
                                  if (match) {
                                    pincodeText = match[0];
                                  }
                                }

                                // Extract state from various possible formats
                                if (booking.pickup?.state) {
                                  stateText = booking.pickup.state;
                                } else if (booking.pickupLocation?.state) {
                                  stateText = booking.pickupLocation.state;
                                } else if (
                                  typeof booking.pickup === "string" &&
                                  booking.pickup.includes(",")
                                ) {
                                  // Try to extract state from string format "City, State"
                                  const parts = booking.pickup.split(",");
                                  if (parts.length >= 2) {
                                    stateText = parts[1].trim();
                                  }
                                }

                                // Extract city from various possible formats
                                if (booking.pickup?.city) {
                                  cityText = booking.pickup.city;
                                } else if (booking.pickupLocation?.city) {
                                  cityText = booking.pickupLocation.city;
                                } else if (typeof booking.pickup === "string") {
                                  if (booking.pickup.includes(",")) {
                                    cityText = booking.pickup
                                      .split(",")[0]
                                      .trim();
                                  } else {
                                    cityText = booking.pickup;
                                  }
                                } else {
                                  cityText = "Not specified";
                                }

                                // Build the full address text
                                let locationText = cityText;

                                if (stateText && stateText !== cityText) {
                                  locationText += `, ${stateText}`;
                                }

                                if (pincodeText) {
                                  locationText += ` - ${pincodeText}`;
                                }

                                return locationText;
                              })()}
                            </h4>
                            <p className="text-sm text-gray-500">
                              Pickup Location
                            </p>
                          </div>
                        </div>

                        {/* Delivery */}
                        <div className="flex items-start gap-3">
                          <div className="min-w-[24px] h-6 flex justify-center items-center">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {(() => {
                                // Try to extract city, state and pincode from different data formats
                                let cityText = "";
                                let stateText = "";
                                let pincodeText = "";

                                // Extract pincode from various possible formats
                                if (booking.delivery?.pincode) {
                                  pincodeText = booking.delivery.pincode;
                                } else if (booking.deliveryLocation?.pincode) {
                                  pincodeText =
                                    booking.deliveryLocation.pincode;
                                } else if (
                                  typeof booking.delivery === "string"
                                ) {
                                  const match = booking.delivery.match(/\d{6}/);
                                  if (match) {
                                    pincodeText = match[0];
                                  }
                                } else if (
                                  typeof booking.destination === "string"
                                ) {
                                  const match =
                                    booking.destination.match(/\d{6}/);
                                  if (match) {
                                    pincodeText = match[0];
                                  }
                                }

                                // Extract state from various possible formats
                                if (booking.delivery?.state) {
                                  stateText = booking.delivery.state;
                                } else if (booking.deliveryLocation?.state) {
                                  stateText = booking.deliveryLocation.state;
                                } else if (
                                  typeof booking.delivery === "string" &&
                                  booking.delivery.includes(",")
                                ) {
                                  // Try to extract state from string format "City, State"
                                  const parts = booking.delivery.split(",");
                                  if (parts.length >= 2) {
                                    stateText = parts[1].trim();
                                  }
                                } else if (
                                  typeof booking.destination === "string" &&
                                  booking.destination.includes(",")
                                ) {
                                  // Try to extract state from string format "City, State"
                                  const parts = booking.destination.split(",");
                                  if (parts.length >= 2) {
                                    stateText = parts[1].trim();
                                  }
                                }

                                // Extract city from various possible formats
                                if (booking.delivery?.city) {
                                  cityText = booking.delivery.city;
                                } else if (booking.deliveryLocation?.city) {
                                  cityText = booking.deliveryLocation.city;
                                } else if (
                                  typeof booking.delivery === "string"
                                ) {
                                  if (booking.delivery.includes(",")) {
                                    cityText = booking.delivery
                                      .split(",")[0]
                                      .trim();
                                  } else {
                                    cityText = booking.delivery;
                                  }
                                } else if (
                                  typeof booking.destination === "string"
                                ) {
                                  if (booking.destination.includes(",")) {
                                    cityText = booking.destination
                                      .split(",")[0]
                                      .trim();
                                  } else {
                                    cityText = booking.destination;
                                  }
                                } else {
                                  cityText = "Not specified";
                                }

                                // Build the full address text
                                let locationText = cityText;

                                if (stateText && stateText !== cityText) {
                                  locationText += `, ${stateText}`;
                                }

                                if (pincodeText) {
                                  locationText += ` - ${pincodeText}`;
                                }

                                return locationText;
                              })()}
                            </h4>
                            <p className="text-sm text-gray-500">
                              Delivery Location
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Additional Details */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-gray-400" />
                          <span className="text-sm text-gray-700">
                            {booking.distance ||
                              (booking.distance?.text
                                ? booking.distance.text
                                : "") ||
                              (booking.distance?.value
                                ? `${Math.round(
                                    booking.distance.value / 1000
                                  )} km`
                                : "Distance not specified")}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <FaClock className="text-gray-400" />
                          <span className="text-sm text-gray-700">
                            {(() => {
                              // Try to extract duration from different formats
                              if (booking.expectedDuration) {
                                return booking.expectedDuration;
                              } else if (booking.duration) {
                                return booking.duration;
                              } else if (
                                booking.distance &&
                                typeof booking.distance.value === "number"
                              ) {
                                // Rough calculation: 30 km/h average speed
                                const distance = Math.round(
                                  booking.distance.value / 1000
                                );
                                const hours = distance / 30;
                                return hours <= 1
                                  ? "~1 hour"
                                  : `~${Math.round(hours)} hours`;
                              } else if (typeof booking.distance === "string") {
                                // Try to extract distance number from string
                                const distanceMatch =
                                  booking.distance.match(/\d+/);
                                if (distanceMatch) {
                                  const distance = parseInt(distanceMatch[0]);
                                  const hours = distance / 30;
                                  return hours <= 1
                                    ? "~1 hour"
                                    : `~${Math.round(hours)} hours`;
                                }
                              }
                              return "Estimated at booking";
                            })()}
                          </span>
                        </div>

                        <div className="col-span-2 flex items-center gap-2">
                          <FaBoxOpen className="text-gray-400" />
                          <span className="text-sm text-gray-700">
                            {booking.loadType ||
                              (booking.goods && booking.goods.type
                                ? booking.goods.type.replace(/_/g, " ")
                                : "Standard Load")}
                            {booking.weight
                              ? ` (${booking.weight})`
                              : booking.goods?.items &&
                                booking.goods.items.length > 0
                              ? ` (${booking.goods.items.reduce(
                                  (sum, item) => sum + (item.weight || 0),
                                  0
                                )} kg)`
                              : ""}
                          </span>
                        </div>
                      </div>

                      {/* View Details Button */}
                      <button
                        onClick={() => handleViewDetails(booking)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all cursor-pointer"
                      >
                        View Details & Bid{" "}
                        <FaChevronRight className="text-xs" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No Bookings Found */}
            {!loading &&
              !error &&
              (bookings.length === 0 || filteredBookings.length === 0) && (
                <div className="flex justify-center items-center py-8 md:py-20">
                  <div className="bg-white rounded-xl shadow-sm p-8 max-w-md w-full text-center border border-gray-100">
                    <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                      {!hasAddress ? (
                        <FaMapPin className="text-3xl text-red-400" />
                      ) : (
                        <FaTruck className="text-3xl text-red-400" />
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {!hasAddress ? "Address Required" : "No bookings found"}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {!hasAddress
                        ? "Please update your address in your profile to see available bookings in your area."
                        : "There are no bookings available matching your criteria. Try changing your search radius or filters."}
                    </p>
                    {!hasAddress ? (
                      <button
                        onClick={() => navigate(`/profile/${driver?.username}`)}
                        className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:shadow-md transition-all duration-300 font-medium cursor-pointer"
                      >
                        Update Profile
                      </button>
                    ) : (
                      <button
                        onClick={handleResetFilters}
                        className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:shadow-md transition-all duration-300 font-medium cursor-pointer"
                      >
                        Reset Filters
                      </button>
                    )}
                  </div>
                </div>
              )}
          </main>
        </div>
      </div>

      {/* Profile Update Modal */}
      <ProfileUpdateModal
        isOpen={isProfileModalOpen}
        onClose={handleCloseModal}
        username={driver?.username}
      />
    </DashboardLayout>
  );
};

export default AvailableBookings;
