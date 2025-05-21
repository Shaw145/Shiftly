import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaSpinner,
  FaInfoCircle,
  FaClipboardCheck,
  FaTruck,
  FaRegClock,
  FaMapMarkerAlt,
  FaStar,
  FaBoxOpen,
  FaCalendarAlt,
  FaShareAlt,
  FaChevronLeft,
  FaCopy,
  FaUserCircle,
  FaCheckCircle,
  FaDirections,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ShipmentTracker from "../components/tracking/ShipmentTracker";
import LiveTrackingMap from "../components/tracking/LiveTrackingMap";
import BookingStatusBadge from "../components/myBookings/BookingStatusBadge";
import { toast } from "react-hot-toast";

const TrackingPage = () => {
  const { bookingId } = useParams();

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

  // Fetch booking details
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/tracking/public/${bookingId}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch booking details");
        }

        if (data.success && data.tracking && data.tracking.booking) {
          setBooking(data.tracking.booking);

          // If booking has driver assigned
          if (
            data.tracking.booking.driverId &&
            typeof data.tracking.booking.driverId === "object"
          ) {
            setDriver(data.tracking.booking.driverId);
          }
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

    // Polling for live location updates - only if booking is active
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

  // Copy tracking link to clipboard
  const copyTrackingLink = () => {
    const trackingUrl = `${window.location.origin}/tracking/${bookingId}`;
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
    const trackingUrl = `${window.location.origin}/tracking/${bookingId}`;
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
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-12 min-h-[70vh] flex items-center justify-center">
          <div className="flex flex-col items-center">
            <FaSpinner className="animate-spin text-red-500 text-4xl mb-4" />
            <p className="text-gray-600">Loading booking details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !booking) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-12 min-h-[70vh]">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8 text-center">
            <div className="text-red-500 mb-4 text-5xl flex justify-center">
              <FaInfoCircle />
            </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Booking Not Found
          </h2>
            <p className="text-gray-600 mb-6">
              {error || "The booking you're looking for could not be found."}
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/"
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center gap-2"
              >
                <FaChevronLeft />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
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
    <div className="min-h-screen bg-gray-50 mt-20 ">
      {/* Header bar with back button */}
      {/* <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-700 hover:text-red-600 cursor-pointer"
            >
              <FaChevronLeft />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div> */}

      <div className="container mx-auto px-4 py-6">
        {/* Header section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
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
                <FaClipboardCheck className="text-red-600" /> Booking
                Information
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

            {/* Driver details card */}
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

                <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
                  {/* Driver Profile - Show initials instead of photo for privacy */}
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-red-100 flex items-center justify-center flex-shrink-0 text-center">
                    <span className="text-xl font-bold text-red-600">
                      {(driver.name || driver.fullName || "Driver")
                        .split(" ")
                        .map((name) => name[0])
                        .join("")
                        .toUpperCase()
                        .substring(0, 2)}
                    </span>
                  </div>

                  {/* Driver Details - Limited information for public view */}
                  <div className="flex-grow space-y-2 text-center sm:text-left">
                    <p className="font-medium text-gray-800">
                      {/* Only show first name for privacy */}
                      {
                        (driver.name || driver.fullName || "Your Driver").split(
                          " "
                        )[0]
                      }
                    </p>

                    <div className="flex items-center justify-center sm:justify-start gap-2 text-sm">
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
                      <span className="text-gray-600">
                        {driver.trips || "150"}+ trips
                      </span>
                    </div>

                    <p className="text-sm text-gray-600">
                      Vehicle: {driver.vehicle || "Transport Vehicle"}
                    </p>
                  </div>
                </div>

                {/* Share button - moved here */}
                <div className="mt-4 pt-3 border-t border-gray-100">
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
                        Share this tracking link
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={copyTrackingLink}
                          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded w-full text-left cursor-pointer"
                        >
                          <FaCopy className="text-gray-500" />
                          <span>Copy tracking link</span>
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
                    {/* Filter out duplicate tracking updates and "Driver updated status to" messages */}
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
                          // Filter out "Driver updated status to" messages
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

              <div className="lg:h-[550px] h-[400px] sm:h-[500px] relative rounded-lg overflow-hidden">
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

export default TrackingPage;
