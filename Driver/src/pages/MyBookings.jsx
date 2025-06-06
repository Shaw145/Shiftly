import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBox,
  FaBoxOpen,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTruck,
  FaArrowRight,
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner,
  FaHistory,
  FaInbox,
  FaClock,
  FaMoneyBillWave,
  FaFilter,
  FaListUl,
  FaThLarge,
} from "react-icons/fa";
import { format } from "date-fns";
import { toast, Toaster } from "react-hot-toast";
import DashboardLayout from "../components/DashboardLayout";
import { useWebSocket } from "../context/WebSocketContext";

/**
 * MyBookings component to display bookings assigned to the driver
 * Includes filtering options and different views
 */
const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const { isConnected } = useWebSocket();

  // Set dynamic page title when component mounts
  useEffect(() => {
    // Update the document title
    document.title =
      "Assigned Bookings | Your Transport Jobs | Shiftly - A Seamless Transport System";

    // Optional: Restore the original title when component unmounts
    return () => {
      document.title = "Shiftly | A Seamless Transport System";
    };
  }, []);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  // Fetch driver's bookings
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("driverToken");
        if (!token) {
          console.error("No driver token found in localStorage");
          setError("Authentication required. Please log in.");
          toast.error("Authentication required. Please log in.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/driver/bookings`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch bookings");
        }

        if (data.success && Array.isArray(data.bookings)) {
          // Normalize booking data and status fields
          const normalizedBookings = data.bookings.map((booking) => {
            // Normalize status to handle both formats
            if (booking.status === "in_transit") {
              booking.status = "inTransit";
            }
            return booking;
          });

          setBookings(normalizedBookings);
          console.log(`Loaded ${normalizedBookings.length} bookings`);
        } else {
          setBookings([]);
          console.log("No bookings found or unexpected response format");
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError("Failed to fetch bookings. Please try again.");
        toast.error("Failed to fetch bookings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  // Filter bookings based on selected filter
  const getFilteredBookings = () => {
    // If there are no bookings at all, return empty array
    if (!bookings || bookings.length === 0) {
      return [];
    }

    if (activeFilter === "all") return bookings;

    if (activeFilter === "upcoming") {
      return bookings.filter(
        (booking) =>
          booking.status === "confirmed" &&
          new Date(booking.schedule?.date) > new Date()
      );
    }

    if (activeFilter === "active") {
      return bookings.filter(
        (booking) =>
          booking.status === "confirmed" ||
          booking.status === "pickup_reached" ||
          booking.status === "in_transit" ||
          booking.status === "inTransit"
      );
    }

    if (activeFilter === "completed") {
      return bookings.filter(
        (booking) =>
          booking.status === "delivered" || booking.status === "completed"
      );
    }

    // For specific status filters, handle both formats
    if (activeFilter === "in_transit") {
      return bookings.filter(
        (booking) =>
          booking.status === "in_transit" || booking.status === "inTransit"
      );
    }

    // For other filters, match the exact status
    return bookings.filter((booking) => booking.status === activeFilter);
  };

  // Render status badge with appropriate colors
  const renderStatusBadge = (status) => {
    const statusConfig = {
      confirmed: {
        icon: FaCheckCircle,
        color: "bg-green-100 text-green-700",
        label: "Confirmed",
      },
      pickup_reached: {
        icon: FaMapMarkerAlt,
        color: "bg-blue-100 text-blue-700",
        label: "At Pickup",
      },
      in_transit: {
        icon: FaTruck,
        color: "bg-purple-100 text-purple-700",
        label: "In Transit",
      },
      inTransit: {
        icon: FaTruck,
        color: "bg-purple-100 text-purple-700",
        label: "In Transit",
      },
      delivered: {
        icon: FaBoxOpen,
        color: "bg-teal-100 text-teal-700",
        label: "Delivered",
      },
      completed: {
        icon: FaBoxOpen,
        color: "bg-teal-100 text-teal-700",
        label: "Delivered",
      },
      cancelled: {
        icon: FaExclamationCircle,
        color: "bg-red-100 text-red-700",
        label: "Cancelled",
      },
      pending: {
        icon: FaClock,
        color: "bg-yellow-100 text-yellow-700",
        label: "Pending",
      },
    };

    // Handle both status formats
    const normalizedStatus = status === "inTransit" ? "in_transit" : status;
    const config =
      statusConfig[status] ||
      statusConfig[normalizedStatus] ||
      statusConfig.pending;
    const Icon = config.icon;

    return (
      <div
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${config.color}`}
      >
        <Icon size={14} />
        <span className="text-sm font-medium">{config.label}</span>
      </div>
    );
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy");
    } catch (error) {
      console.error("Error formatting date:", error, "Input:", dateString);
      return "Date not available";
    }
  };

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return "Time not specified";

    // If it's already in a time format like "14:00", return it
    if (/^\d{1,2}:\d{2}$/.test(timeString)) {
      return timeString;
    }

    try {
      return format(new Date(timeString), "HH:mm");
    } catch (error) {
      console.error("Error formatting time:", error, "Input:", timeString);
      return timeString;
    }
  };

  // Format price for display
  const formatPrice = (booking) => {
    // First check for finalPrice (most reliable)
    if (booking.finalPrice && parseFloat(booking.finalPrice) > 0) {
      return `₹${parseFloat(booking.finalPrice).toLocaleString("en-IN")}`;
    }

    // Then check for payment amount
    if (booking.payment?.amount && parseFloat(booking.payment.amount) > 0) {
      return `₹${parseFloat(booking.payment.amount).toLocaleString("en-IN")}`;
    }

    // Then check for regular price field
    if (booking.price && parseFloat(booking.price) > 0) {
      return `₹${parseFloat(booking.price).toLocaleString("en-IN")}`;
    }

    // Then check for acceptedBid
    if (
      booking.acceptedBid?.amount &&
      parseFloat(booking.acceptedBid.amount) > 0
    ) {
      return `₹${parseFloat(booking.acceptedBid.amount).toLocaleString(
        "en-IN"
      )}`;
    }

    // If it's a range
    if (
      booking.estimatedPrice &&
      typeof booking.estimatedPrice === "object" &&
      booking.estimatedPrice.min !== undefined &&
      booking.estimatedPrice.max !== undefined
    ) {
      return `₹${Number(booking.estimatedPrice.min).toLocaleString(
        "en-IN"
      )} - ₹${Number(booking.estimatedPrice.max).toLocaleString("en-IN")}`;
    }

    // If no valid price found
    return "Price not available";
  };

  // Navigate to booking details
  const handleViewDetails = (bookingId) => {
    // Use the same confirmed-bookings route for all booking statuses (confirmed, inTransit, completed)
    // This ensures all bookings will show up regardless of their status
    navigate(`/confirmed-bookings/${bookingId}`);
  };

  // Render bookings in grid view
  const renderGridView = () => {
    const filteredBookings = getFilteredBookings();

    if (filteredBookings.length === 0) {
      return renderEmptyState();
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBookings.map((booking) => (
          <div
            key={booking._id || booking.bookingId}
            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            {/* Booking header */}
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
              <div className="text-sm font-medium text-gray-700">
                {booking.bookingId}
              </div>
              {renderStatusBadge(booking.status)}
            </div>

            {/* Booking content */}
            <div className="p-4">
              {/* Locations */}
              <div className="mb-4">
                <div className="flex items-start mb-3">
                  <div className="min-w-[28px] h-10 flex justify-center">
                    <div className="flex flex-col items-center h-full">
                      <div className="w-3 h-3 rounded-full bg-green-500 z-10"></div>
                      <div className="w-0.5 flex-grow bg-gray-300 -mt-0.5"></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-0.5">Pickup</div>
                    <div className="text-sm font-medium text-gray-900">
                      {booking.pickup?.city || "City"},{" "}
                      {booking.pickup?.state || "State"}
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="min-w-[28px] flex justify-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 z-10"></div>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-0.5">Delivery</div>
                    <div className="text-sm font-medium text-gray-900">
                      {booking.delivery?.city || "City"},{" "}
                      {booking.delivery?.state || "State"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <div className="text-xs text-gray-500 mb-0.5">Date</div>
                  <div className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                    <FaCalendarAlt className="text-gray-400" size={12} />
                    {formatDate(booking.schedule?.date)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-0.5">Time</div>
                  <div className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                    <FaClock className="text-gray-400" size={12} />
                    {formatTime(booking.schedule?.time)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-0.5">Distance</div>
                  <div className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                    <FaMapMarkerAlt className="text-gray-400" size={12} />
                    {booking.distance || "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-0.5">Load Type</div>
                  <div className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                    <FaBox className="text-gray-400" size={12} />
                    {booking.goods?.type?.replace(/_/g, " ") || "N/A"}
                  </div>
                </div>
              </div>

              {/* Price and action */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div>
                  <div className="text-xs text-gray-500 mb-0.5">Earnings</div>
                  <div className="text-base font-bold text-gray-900">
                    {formatPrice(booking)}
                  </div>
                </div>
                <button
                  onClick={() =>
                    handleViewDetails(booking.bookingId || booking._id)
                  }
                  className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium flex items-center gap-1.5 cursor-pointer"
                  aria-label="View booking details"
                >
                  Details
                  <FaArrowRight size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render bookings in list view
  const renderListView = () => {
    const filteredBookings = getFilteredBookings();

    if (filteredBookings.length === 0) {
      return renderEmptyState();
    }

    return (
      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <div
            key={booking._id || booking.bookingId}
            className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:items-center">
              {/* Left column with status and ID */}
              <div className="border-b sm:border-b-0 sm:border-r border-gray-100 p-4 sm:p-5 sm:w-48 flex flex-row sm:flex-col justify-between sm:justify-start">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  {booking.bookingId}
                </div>
                <div className="flex justify-start">
                  {renderStatusBadge(booking.status)}
                </div>
              </div>

              {/* Middle column with journey details */}
              <div className="flex-1 p-4 sm:py-5 sm:px-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Journey */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mb-1"></div>
                        <div className="w-0.5 h-5 bg-gray-300"></div>
                        <div className="w-3 h-3 rounded-full bg-red-500 mt-1"></div>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          {booking.pickup?.city || "Pickup City"},{" "}
                          {booking.pickup?.state || "State"}
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {booking.delivery?.city || "Delivery City"},{" "}
                          {booking.delivery?.state || "State"}
                        </div>
                      </div>
                    </div>

                    {/* Time and date */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5">
                        <FaCalendarAlt className="text-gray-400" size={14} />
                        <span>{formatDate(booking.schedule?.date)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FaClock className="text-gray-400" size={14} />
                        <span>{formatTime(booking.schedule?.time)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-6">
                    <div className="flex-1 min-w-24">
                      <div className="text-xs text-gray-500 mb-0.5">
                        Distance
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {booking.distance || "N/A"}
                      </div>
                    </div>
                    <div className="flex-1 min-w-24">
                      <div className="text-xs text-gray-500 mb-0.5">
                        Load Type
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {booking.goods?.type?.replace(/_/g, " ") || "N/A"}
                      </div>
                    </div>
                    <div className="flex-1 min-w-24">
                      <div className="text-xs text-gray-500 mb-0.5">
                        Earnings
                      </div>
                      <div className="font-bold text-gray-900">
                        {formatPrice(booking)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right column with action */}
              <div className="p-4 border-t sm:border-t-0 sm:border-l border-gray-100 sm:p-5 sm:w-32 flex justify-center">
                <button
                  onClick={() =>
                    handleViewDetails(booking.bookingId || booking._id)
                  }
                  className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium flex items-center gap-1.5 cursor-pointer w-full justify-center sm:w-auto"
                  aria-label="View booking details"
                >
                  Details
                  <FaArrowRight size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render empty state
  const renderEmptyState = () => {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaInbox className="text-xl text-gray-400" />
        </div>
        <h3 className="text-xl font-medium text-gray-600 mb-2">
          No {activeFilter !== "all" ? activeFilter : ""} bookings found
        </h3>
        <p className="text-gray-500 max-w-md mx-auto">
          {activeFilter === "all"
            ? "You don't have any bookings assigned yet. Please place a bid on a booking to see it here once it's confirmed."
            : `You don't have any ${activeFilter} bookings at the moment.`}
        </p>
        {!isConnected && (
          <div className="mt-4 text-yellow-600 text-sm flex justify-center items-center gap-2">
            <FaExclamationCircle />
            <span>
              You are currently offline. Some information may not be up to date.
            </span>
          </div>
        )}
      </div>
    );
  };

  // Main render
  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>

            {/* View mode toggle */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md text-sm ${
                  viewMode === "grid"
                    ? "bg-white text-gray-800 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                aria-label="Grid view"
              >
                <FaThLarge />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md text-sm ${
                  viewMode === "list"
                    ? "bg-white text-gray-800 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                aria-label="List view"
              >
                <FaListUl />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-2 text-gray-700">
              <FaFilter size={14} />
              <h2 className="font-medium">Filter Bookings</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "All Bookings" },
                { id: "upcoming", label: "Upcoming" },
                { id: "active", label: "Active" },
                { id: "confirmed", label: "Confirmed" },
                { id: "in_transit", label: "In Transit" },
                { id: "delivered", label: "Delivered" },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeFilter === filter.id
                      ? "bg-red-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Loading state */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center justify-center space-x-2">
                <FaSpinner className="animate-spin text-red-500 text-xl" />
                <span className="text-gray-600">Loading bookings...</span>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <div className="text-red-600 mb-2 flex items-center justify-center gap-2">
                <FaExclamationCircle />
                <span className="font-medium">Error loading bookings</span>
              </div>
              <p className="text-red-700">{error}</p>
            </div>
          ) : // Display bookings based on selected view mode
          viewMode === "grid" ? (
            renderGridView()
          ) : (
            renderListView()
          )}
        </div>
      </div>
      <Toaster />
    </DashboardLayout>
  );
};

export default MyBookings;
