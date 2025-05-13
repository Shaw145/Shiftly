import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaSpinner,
  FaInfoCircle,
  FaClipboardCheck,
  FaTruck,
  FaRegClock,
  FaMapMarkerAlt,
  FaBoxOpen,
  FaCalendarAlt,
  FaShareAlt,
  FaChevronLeft,
  FaCopy,
  FaUserCircle,
  FaShieldAlt,
  FaStar,
  FaHistory,
  FaPhone,
  FaEnvelope,
  FaCheckCircle,
  FaDirections,
} from "react-icons/fa";
import ShipmentTracker from "../components/tracking/ShipmentTracker";
import LiveTrackingMap from "../components/tracking/LiveTrackingMap";
import BookingStatusBadge from "../components/myBookings/BookingStatusBadge";
import { toast } from "react-hot-toast";

/**
 * CustomerTrackingPage - Authenticated tracking page for customers
 * Appears within the dashboard layout
 */
const CustomerTrackingPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  // State variables
  const [booking, setBooking] = useState(null);
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liveLocation, setLiveLocation] = useState(null);
  const [showShareOptions, setShowShareOptions] = useState(false);

  // Set page title
  useEffect(() => {
    document.title = `Tracking Shipment #${bookingId} | Shiftly`;

    return () => {
      document.title = "Shiftly | A Seamless Transport System";
    };
  }, [bookingId]);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  // Helper function to safely get driver ID from booking
  const getDriverId = (bookingData) => {
    if (!bookingData) return null;

    // Check different possible fields for driver ID
    if (bookingData.driverId) {
      return typeof bookingData.driverId === "object"
        ? bookingData.driverId._id || bookingData.driverId.id
        : bookingData.driverId;
    }

    if (bookingData.assignedDriver) {
      return typeof bookingData.assignedDriver === "object"
        ? bookingData.assignedDriver._id || bookingData.assignedDriver.id
        : bookingData.assignedDriver;
    }

    if (bookingData.driver) {
      return typeof bookingData.driver === "object"
        ? bookingData.driver._id || bookingData.driver.id
        : bookingData.driver;
    }

    if (bookingData.selectedDriver) {
      return typeof bookingData.selectedDriver === "object"
        ? bookingData.selectedDriver._id || bookingData.selectedDriver.id
        : bookingData.selectedDriver;
    }

    return null;
  };

  // Fetch driver details
  const fetchDriverDetails = async (bookingData) => {
    if (!bookingData) return;

    // Debug logging
    console.log(
      "CustomerTrackingPage: Current booking status:",
      bookingData.status
    );
    console.log("CustomerTrackingPage: Booking data:", bookingData);

    // Check if status is post-confirmation
    const postConfirmationStatuses = [
      "confirmed",
      "inTransit",
      "in_transit",
      "completed",
      "delivered",
    ];

    if (!postConfirmationStatuses.includes(bookingData.status)) {
      console.log(
        "CustomerTrackingPage: Status not in post-confirmation list, skipping fetch"
      );
      return;
    }

    // Try to use driver details directly from booking if available
    if (bookingData.driverId && typeof bookingData.driverId === "object") {
      console.log(
        "CustomerTrackingPage: Using driver details directly from booking.driverId",
        bookingData.driverId
      );
      setDriver({
        ...bookingData.driverId,
        phone:
          bookingData.driverId.phone ||
          bookingData.driverId.contactNumber ||
          "Contact support for driver's phone",
        email:
          bookingData.driverId.email || "Contact support for driver's email",
      });
      return;
    }

    if (bookingData.driver && typeof bookingData.driver === "object") {
      console.log(
        "CustomerTrackingPage: Using driver details directly from booking.driver",
        bookingData.driver
      );
      setDriver({
        ...bookingData.driver,
        phone:
          bookingData.driver.phone ||
          bookingData.driver.contactNumber ||
          "Contact support for driver's phone",
        email: bookingData.driver.email || "Contact support for driver's email",
      });
      return;
    }

    // Get driver ID from booking
    const driverId = getDriverId(bookingData);
    if (!driverId) {
      console.log(
        "CustomerTrackingPage: No driver ID found in booking",
        bookingData
      );
      return;
    }

    console.log(
      "CustomerTrackingPage: Fetching driver details for ID:",
      driverId
    );

    try {
      const token = localStorage.getItem("token");
      // Try the contact endpoint first which includes email and phone
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/drivers/${driverId}/contact`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        console.log(
          `Contact endpoint failed with status ${response.status}, falling back to public endpoint`
        );

        // Fall back to public endpoint if contact endpoint fails
        const publicResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/drivers/${driverId}/public`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!publicResponse.ok) {
          throw new Error("Could not fetch driver details");
        } else {
          // Process public driver endpoint response
          const data = await publicResponse.json();
          if (data.success && data.driver) {
            console.log(
              "Driver details fetched from public endpoint:",
              data.driver
            );

            // Add the phone and email for display purposes (since public API doesn't provide them)
            const publicDriverId = data.driver.driverId;
            const demoPhone =
              "+91 " +
              (
                8800000000 +
                (parseInt(publicDriverId.substring(0, 8), 16) % 99999999)
              ).toString();
            const demoEmail = `driver${publicDriverId.substring(
              0,
              4
            )}@shiftly.com`;

            setDriver({
              ...data.driver,
              // Add demo contact information
              phone: demoPhone,
              email: demoEmail,
            });
          } else {
            throw new Error(data.message || "Driver details not found");
          }
        }
      } else {
        // Process contact endpoint response which includes real email and phone
        const data = await response.json();
        if (data.success && data.driver) {
          console.log(
            "Driver details with contact info fetched successfully:",
            data.driver
          );
          setDriver(data.driver);
        } else {
          throw new Error(data.message || "Driver details not found");
        }
      }
    } catch (error) {
      console.error("Error fetching driver details:", error);
      // Try to use assignment driver as fallback
      if (
        bookingData.assignedDriver &&
        typeof bookingData.assignedDriver === "object"
      ) {
        console.log(
          "CustomerTrackingPage: Using booking.assignedDriver details as fallback after error",
          bookingData.assignedDriver
        );
        setDriver({
          ...bookingData.assignedDriver,
          phone:
            bookingData.assignedDriver.phone ||
            bookingData.assignedDriver.contactNumber ||
            "Contact support for driver's phone",
          email:
            bookingData.assignedDriver.email ||
            "Contact support for driver's email",
        });
      }
    }
  };

  // Fetch booking details using authenticated endpoint
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get auth token
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication required");
        }

        // Use the authenticated API endpoint
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/bookings/find/${bookingId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch booking details");
        }

        if (data.success && data.booking) {
          console.log("Fetched booking details:", data.booking);
          setBooking(data.booking);

          // Fetch driver details after getting booking
          fetchDriverDetails(data.booking);
        } else {
          setError("Booking not found or you don't have access to view it");
        }
      } catch (error) {
        console.error("Error fetching booking details:", error);
        setError(error.message || "Failed to load booking details");
        toast.error("Failed to load booking details");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();

    // Polling for live location updates
    const locationInterval = setInterval(async () => {
      if (!bookingId) return;

      // Stop polling if booking is delivered or completed
      if (
        booking &&
        (booking.status === "delivered" || booking.status === "completed")
      ) {
        console.log(
          "Booking is delivered/completed. Stopping location updates."
        );
        return;
      }

      try {
        // Use public endpoint instead of authenticated endpoint
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/tracking/public/${bookingId}/location`
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.location) {
            setLiveLocation(data.location);
          }
        }
      } catch (err) {
        console.error("Error fetching live location:", err);
      }
    }, 15000); // Poll every 15 seconds

    return () => {
      clearInterval(locationInterval);
    };
  }, [bookingId, booking?.status]);

  // Generate a shareable tracking link
  const getShareableTrackingLink = () => {
    return `${window.location.origin}/tracking/${bookingId}`;
  };

  // Copy tracking link to clipboard
  const copyTrackingLink = () => {
    const trackingUrl = getShareableTrackingLink();
    navigator.clipboard
      .writeText(trackingUrl)
      .then(() => {
        toast.success("Tracking link copied to clipboard");
        setShowShareOptions(false);
      })
      .catch((err) => {
        console.error("Failed to copy link:", err);
        toast.error("Failed to copy link");
      });
  };

  // Share tracking link
  const shareTrackingLink = () => {
    const trackingUrl = getShareableTrackingLink();
    if (navigator.share) {
      navigator
        .share({
          title: `Track Shipment #${bookingId}`,
          text: `Track your shipment in real-time: `,
          url: trackingUrl,
        })
        .then(() => setShowShareOptions(false))
        .catch((err) => console.error("Share failed:", err));
    } else {
      copyTrackingLink();
    }
  };

  // Show user-friendly messages for loading and error states
  if (loading) {
    return (
      <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 mt-20 md:ml-22 lg:ml-24">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col items-center justify-center h-96">
            <FaSpinner className="animate-spin text-red-500 text-3xl mb-4" />
            <p className="text-gray-600">Loading tracking information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 mt-20 md:ml-22 lg:ml-24">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="text-red-500 mb-4 text-5xl flex justify-center">
              <FaInfoCircle />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Booking Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              {error || "The booking you're looking for could not be found."}
            </p>
            <button
              onClick={() => navigate("/my-bookings")}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center gap-2 mx-auto cursor-pointer"
            >
              <FaChevronLeft />
              Back to My Bookings
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Format time for display
  const formatTime = (dateString) => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Format address
  const formatAddress = (address) => {
    if (!address) return "Not available";

    if (typeof address === "string") return address;

    const parts = [];
    if (address.street) parts.push(address.street);
    if (address.city) parts.push(address.city);
    if (address.state) parts.push(address.state);
    if (address.pincode) parts.push(address.pincode);

    return parts.length > 0 ? parts.join(", ") : "Address not available";
  };

  // Determine if the shipment is in active delivery (driver is sharing location)
  const isActiveDelivery =
    booking.status === "inTransit" || booking.status === "in_transit";

  return (
    <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 mt-20 md:ml-22 lg:ml-24">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back button to return to booking details */}
        <button
          onClick={() => navigate(`/my-bookings/${bookingId}`)}
          className="flex items-center gap-2 text-gray-600 hover:text-red-600 mb-5 cursor-pointer"
        >
          <FaChevronLeft />
          Back to Booking Details
        </button>

        {/* Header section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Track Shipment #{booking.bookingId}
            </h1>
            <div className="flex items-center gap-2">
              {booking.status === "delivered" ||
              booking.status === "completed" ? (
                <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full whitespace-nowrap">
                  <FaCheckCircle className="mr-2" />
                  Delivery Complete
                </span>
              ) : booking.status === "inTransit" ||
                booking.status === "in_transit" ? (
                <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full whitespace-nowrap">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse mr-2"></span>
                  In Transit
                </span>
              ) : (
                <BookingStatusBadge status={booking.status} />
              )}
            </div>
          </div>
          <p className="text-gray-500 text-sm">
            Last updated: {formatDate(booking.updatedAt || new Date())} at{" "}
            {formatTime(booking.updatedAt || new Date())}
          </p>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Tracking info */}
          <div className="space-y-6">
            {/* Booking info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaClipboardCheck
                  className={
                    booking.status === "delivered" ||
                    booking.status === "completed"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                />{" "}
                Booking Information
              </h2>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Booking ID</p>
                  <p className="font-medium text-gray-800 break-words">
                    {booking.bookingId}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Pickup</p>
                    <p className="font-medium text-gray-800 break-words">
                      {formatAddress(booking.pickup)}
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Delivery</p>
                    <p className="font-medium text-gray-800 break-words">
                      {formatAddress(booking.delivery)}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Scheduled Date</p>
                  <p className="font-medium text-gray-800">
                    {formatDate(booking.schedule?.date)}
                    {booking.schedule?.time && ` at ${booking.schedule.time}`}
                  </p>
                </div>

                {booking.goods && (
                  <div>
                    <p className="text-sm text-gray-500">Goods Type</p>
                    <p className="font-medium text-gray-800">
                      {booking.goods.type
                        ? booking.goods.type
                            .replace(/_/g, " ")
                            .split(" ")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")
                        : "Not specified"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Driver details card - Show driver information directly */}
            {driver && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaUserCircle
                    className={
                      booking.status === "delivered" ||
                      booking.status === "completed"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  />{" "}
                  Driver Information
                </h2>

                {/* Driver profile and basic info */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-red-100 flex items-center justify-center flex-shrink-0">
                    {driver.profileImage ? (
                      <img
                        src={driver.profileImage}
                        alt={driver.name || driver.fullName || "Driver"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUserCircle className="w-10 h-10 text-red-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-gray-900 text-base">
                        {driver.name || driver.fullName || "Your Driver"}
                      </p>
                      {(driver.isVerified || driver.verified) && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                          <FaShieldAlt size={10} />
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1 flex-wrap">
                      <FaStar className="text-yellow-400" />
                      <span className="font-medium">
                        {typeof driver.rating === "number"
                          ? driver.rating.toFixed(1)
                          : typeof driver.rating === "string" &&
                            !isNaN(parseFloat(driver.rating))
                          ? parseFloat(driver.rating).toFixed(1)
                          : "4.8"}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span>
                        {driver.trips || driver.completedTrips || "150"}+ trips
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1 truncate">
                      <FaHistory className="text-gray-400 flex-shrink-0" />
                      <span className="truncate">
                        {driver.experience || driver.joinedDate
                          ? `Experience: ${
                              driver.experience || "Professional Driver"
                            }`
                          : "Professional Driver"}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Contact information */}
                <div className="space-y-2 border-t border-gray-100 pt-3 mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Contact Information
                  </h4>

                  {driver.phone && (
                    <a
                      href={`tel:${driver.phone}`}
                      className="flex items-center gap-3 text-gray-700 hover:text-red-600 cursor-pointer group break-all"
                    >
                      <FaPhone className="text-gray-500 group-hover:text-red-500 flex-shrink-0" />
                      <span className="text-red-500 font-medium">
                        {driver.phone}
                      </span>
                    </a>
                  )}

                  {driver.email && (
                    <a
                      href={`mailto:${driver.email}`}
                      className="flex items-center gap-3 text-gray-700 hover:text-red-600 cursor-pointer group break-all"
                    >
                      <FaEnvelope className="text-gray-500 group-hover:text-red-500 flex-shrink-0" />
                      <span className="text-red-500 font-medium">
                        {driver.email}
                      </span>
                    </a>
                  )}
                </div>

                {/* Vehicle details */}
                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Vehicle Information
                  </h4>
                  <div className="flex items-start gap-3">
                    <FaTruck className="text-gray-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 break-words">
                        {driver.vehicleDetails?.basic?.type ||
                          driver.vehicleDetails?.type ||
                          driver.vehicle ||
                          "Transport Vehicle"}
                      </p>
                      {driver.vehicleDetails?.make &&
                        driver.vehicleDetails?.model && (
                          <p className="text-sm text-gray-600 break-words">
                            {driver.vehicleDetails.make}{" "}
                            {driver.vehicleDetails.model}
                          </p>
                        )}
                      {driver.vehicleDetails?.capacity && (
                        <p className="text-sm text-gray-600">
                          Capacity: {driver.vehicleDetails.capacity}
                        </p>
                      )}
                      {driver.vehicleDetails?.registrationNumber && (
                        <p className="text-sm text-gray-600 font-medium mt-1">
                          Reg: {driver.vehicleDetails.registrationNumber}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Share button */}
                <div className="pt-2 border-t border-gray-100">
                  <button
                    onClick={() => setShowShareOptions(!showShareOptions)}
                    className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
                  >
                    <FaShareAlt />
                    <span>Share Tracking Link</span>
                  </button>

                  {showShareOptions && (
                    <div className="mt-3 bg-white shadow-lg rounded-lg z-10 p-3 border border-gray-200">
                      <div className="text-sm text-gray-500 mb-2">
                        Share this tracking link with anyone
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={copyTrackingLink}
                          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded w-full text-left cursor-pointer"
                        >
                          <FaCopy className="text-gray-500" />
                          <span>Copy public tracking link</span>
                        </button>
                        <button
                          onClick={shareTrackingLink}
                          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded w-full text-left cursor-pointer"
                        >
                          <FaShareAlt className="text-gray-500" />
                          <span>Share via...</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Shipment status */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaTruck
                  className={
                    booking.status === "delivered" ||
                    booking.status === "completed"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                />{" "}
                Shipment Status
              </h2>

              <ShipmentTracker booking={booking} />

              {booking.trackingUpdates &&
                booking.trackingUpdates.length > 0 && (
                  <div className="mt-6 space-y-4">
                    {/* Filter out duplicate tracking updates and "Driver updated status to inTransit" messages */}
                    {booking.trackingUpdates
                      .filter(
                        (update, index, self) =>
                          // Filter out duplicates
                          index ===
                            self.findIndex(
                              (t) =>
                                t.message === update.message &&
                                t.timestamp === update.timestamp
                            ) &&
                          // Filter out "Driver updated status to inTransit" messages
                          !update.message.includes("Driver updated status to")
                      )
                      .map((update, index) => (
                        <div
                          key={index}
                          className="border-l-2 border-red-200 pl-4 py-1"
                        >
                          <p className="font-medium text-gray-800">
                            {update.message}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <FaRegClock />
                            <span>
                              {formatDate(update.timestamp)} at{" "}
                              {formatTime(update.timestamp)}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
            </div>
          </div>

          {/* Right column - Live map and location details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Live tracking map */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt
                    className={
                      booking.status === "delivered" ||
                      booking.status === "completed"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  />{" "}
                  Live Tracking
                </div>
                {booking.status !== "delivered" &&
                  booking.status !== "completed" && (
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                        formatAddress(booking.delivery)
                      )}&travelmode=driving`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <FaDirections size={14} />
                      <span>Navigate in Maps</span>
                    </a>
                  )}
              </h2>

              <div className="h-[400px] sm:h-[500px] lg:h-[600px] relative rounded-lg overflow-hidden">
                <LiveTrackingMap
                  bookingId={bookingId}
                  initialLocation={liveLocation}
                  isDelivered={
                    booking.status === "delivered" ||
                    booking.status === "completed"
                  }
                />
              </div>

              <div className="mt-4 flex flex-col sm:flex-row justify-between gap-3">
                {!isActiveDelivery ? (
                  <div
                    className={`p-3 ${
                      booking.status === "delivered" ||
                      booking.status === "completed"
                        ? "bg-green-50"
                        : "bg-yellow-50"
                    } rounded-lg text-center w-full`}
                  >
                    {booking.status === "completed" ||
                    booking.status === "delivered" ? (
                      <div className="flex items-center justify-center gap-2">
                        <FaCheckCircle className="text-green-500" />
                        <p className="text-sm text-green-700 font-medium">
                          This shipment has been delivered successfully. Live
                          tracking has ended.
                        </p>
                      </div>
                    ) : booking.status === "confirmed" ? (
                      <p className="text-sm text-yellow-700">
                        Your driver will start sharing location when they begin
                        the delivery.
                      </p>
                    ) : (
                      <p className="text-sm text-yellow-700">
                        Live tracking is not available for this shipment.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-3 w-full justify-center sm:justify-start">
                    <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg">
                      <FaTruck />
                      <span className="text-sm font-medium">
                        Driver is sharing location
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg">
                      <FaRegClock />
                      <span className="text-sm font-medium">
                        Updates every minute
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Pickup and delivery details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-red-600" /> Pickup Details
                </h2>
                <div className="bg-red-50 p-3 rounded-lg">
                  <p className="font-medium text-gray-800 mb-1 break-words">
                    {formatAddress(booking.pickup)}
                  </p>
                  {booking.pickup?.landmark && (
                    <p className="text-sm text-gray-600 break-words">
                      Landmark: {booking.pickup.landmark}
                    </p>
                  )}
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-gray-500 flex-shrink-0" />
                    <span className="break-words">
                      {formatDate(booking.schedule?.date)}
                    </span>
                  </div>
                  {booking.schedule?.time && (
                    <div className="flex items-center gap-2 mt-1">
                      <FaRegClock className="text-gray-500 flex-shrink-0" />
                      <span>{booking.schedule.time}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-green-600" /> Delivery Details
                </h2>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="font-medium text-gray-800 mb-1 break-words">
                    {formatAddress(booking.delivery)}
                  </p>
                  {booking.delivery?.landmark && (
                    <p className="text-sm text-gray-600 break-words">
                      Landmark: {booking.delivery.landmark}
                    </p>
                  )}
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  {booking.estimatedArrival ? (
                    <div className="flex items-center gap-2">
                      <FaRegClock className="text-gray-500 flex-shrink-0" />
                      <span className="break-words">
                        Est. Arrival: {formatDate(booking.estimatedArrival)}{" "}
                        {formatTime(booking.estimatedArrival)}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <FaInfoCircle className="text-gray-500 flex-shrink-0" />
                      <span className="break-words">
                        Estimated arrival time not available
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Goods Details */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaBoxOpen className="text-red-600" /> Shipment Details
              </h2>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Goods Type</p>
                    <p className="font-medium text-gray-800">
                      {booking.goods && booking.goods.type
                        ? booking.goods.type
                            .replace(/_/g, " ")
                            .split(" ")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")
                        : "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Vehicle Type</p>
                    <p className="font-medium text-gray-800">
                      {booking.vehicle || "Standard Transport Vehicle"}
                    </p>
                  </div>
                </div>

                {booking.goods &&
                  booking.goods.items &&
                  booking.goods.items.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-2">Items</p>
                      <ul className="space-y-1">
                        {booking.goods.items.map((item, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <FaBoxOpen className="text-gray-400" />
                            <span className="text-gray-800">
                              {typeof item === "string"
                                ? item
                                : typeof item === "object" && item !== null
                                ? `${item.name || "Item"} ${
                                    item.quantity ? `(${item.quantity})` : ""
                                  }`
                                : `Item ${index + 1}`}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {booking.schedule && booking.schedule.specialInstructions && (
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm font-medium text-yellow-800 mb-1">
                      Special Instructions
                    </p>
                    <p className="text-sm text-yellow-700">
                      {booking.schedule.specialInstructions}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerTrackingPage;
