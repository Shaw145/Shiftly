import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaTruck,
  FaBoxOpen,
  FaMoneyBillWave,
  FaStar,
  FaArrowLeft,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaShippingFast,
  FaCheck,
  FaTimes,
  FaSpinner,
  FaCheckCircle,
  FaMapMarkedAlt,
  FaInfoCircle,
  FaExclamationTriangle,
  FaClipboardList,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import LiveLocationSharing from "../components/bookings/LiveLocationSharing";

const ConfirmedBookingDetails = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [shipmentStatus, setShipmentStatus] = useState("");
  const [activeTab, setActiveTab] = useState("details");

  // Set dynamic page title when component mounts
  useEffect(() => {
    document.title = "Confirmed Job | Transport Assignment | Shiftly";
    return () => {
      document.title = "Shiftly | A Seamless Transport System";
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  // Add this effect to fetch payment details when booking is loaded
  useEffect(() => {
    if (booking && booking.status !== "pending") {
      // Payment endpoint doesn't exist, so we'll rely on booking data
      // console.log("Checking booking data for price information");

      // Log bid information if available
      if (booking.driverBids && Array.isArray(booking.driverBids)) {
        // console.log("Driver bids found:", booking.driverBids);
        const acceptedBid = booking.driverBids.find(
          (bid) => bid.status === "accepted"
        );
        if (acceptedBid) {
          console.log("Found accepted bid:", acceptedBid);
        }
      }
    }
  }, [booking]);

  const fetchBookingDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("driverToken");
      if (!token) {
        console.error("No driver token found");
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/driver/bookings/${bookingId}`,
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
        // Log detailed debugging information
        // console.log("Booking data received:", data.booking);

        // Log detailed price information
        // console.log("Price details:", {
        //   price: data.booking.price,
        //   finalPrice: data.booking.finalPrice,
        //   acceptedBid: data.booking.acceptedBid,
        //   payment: data.booking.payment,
        //   paymentId: data.booking.paymentId,
        //   estimatedPrice: data.booking.estimatedPrice,
        //   driverBids: data.booking.driverBids,
        // });

        // Log payment information if available
        if (data.booking.payment) {
          // console.log("Payment information:", {
          //   id: data.booking.payment._id,
          //   amount: data.booking.payment.amount,
          //   status: data.booking.payment.status,
          //   method: data.booking.payment.method,
          //   transactionId: data.booking.payment.transactionId,
          // });
        } else if (data.booking.paymentId) {
          console.log(
            "Payment ID found but no payment object:",
            data.booking.paymentId
          );
        }

        // Log price type information
        // console.log("Price type information:", {
        //   priceType: typeof data.booking.price,
        //   finalPriceType: typeof data.booking.finalPrice,
        //   finalPriceValue: data.booking.finalPrice,
        //   acceptedBidType: typeof data.booking.acceptedBid,
        //   hasAcceptedBidAmount: data.booking.acceptedBid
        //     ? typeof data.booking.acceptedBid.amount
        //     : "no acceptedBid",
        // });

        // Calculate the actual price that will be displayed
        const calculatedPrice =
          data.booking.finalPrice ||
          (data.booking.payment && data.booking.payment.amount) ||
          data.booking.price ||
          (data.booking.acceptedBid && data.booking.acceptedBid.amount) ||
          "No price found";

        console.log("Calculated price for display:", calculatedPrice);

        // Add more detailed logging for items
        if (data.booking.goods && data.booking.goods.items) {
          // console.log("Items structure:", data.booking.goods.items);
          // data.booking.goods.items.forEach((item, index) => {
          //   console.log(`Item ${index}:`, item, "Type:", typeof item);
          // });
        }

        // Sanitize the booking data to avoid MongoDB document issues
        const sanitizedBooking = JSON.parse(JSON.stringify(data.booking));

        setBooking(sanitizedBooking);
        setShipmentStatus(sanitizedBooking.status);

        if (sanitizedBooking.userId) {
          // Sanitize the customer data as well
          const sanitizedCustomer = JSON.parse(
            JSON.stringify(sanitizedBooking.userId)
          );
          setCustomer(sanitizedCustomer);
        }
      } else {
        toast.error("Booking not found");
        navigate("/my-bookings");
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
      toast.error("Failed to load booking details: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (newStatus) => {
    setUpdateLoading(true);
    try {
      const token = localStorage.getItem("driverToken");
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/driver/bookings/${bookingId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update booking status");
      }

      const data = await response.json();

      if (data.success) {
        setShipmentStatus(newStatus);
        setBooking(data.booking);
        toast.success(`Booking marked as ${newStatus}`);

        // Notify WebSocket server about status change
        try {
          const wsResponse = await fetch(
            `${
              import.meta.env.VITE_BACKEND_URL
            }/api/tracking/update/${bookingId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                status: newStatus,
                message: `Driver updated status to ${newStatus}`,
                timestamp: new Date().toISOString(),
              }),
            }
          );

          if (!wsResponse.ok) {
            console.error(
              "Failed to notify WebSocket server about status change"
            );
          }
        } catch (wsError) {
          console.error("WebSocket notification error:", wsError);
        }
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast.error(error.message || "Failed to update booking status");
    } finally {
      setUpdateLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) return "Invalid date";

      return date.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date error";
    }
  };

  const formatLocation = (location) => {
    if (!location) return "Not specified";

    // Handle string locations
    if (typeof location === "string") return location;

    // Handle object locations
    if (typeof location === "object" && location !== null) {
      const parts = [];

      if (location.addressLine1) parts.push(location.addressLine1);
      if (location.addressLine2) parts.push(location.addressLine2);
      if (location.city) parts.push(location.city);
      if (location.state) parts.push(location.state);
      if (location.pincode) parts.push(location.pincode);

      return parts.length > 0
        ? parts.join(", ")
        : "Address details not available";
    }

    return "Location format not recognized";
  };

  const getNextStatus = () => {
    const statusFlow = {
      confirmed: "inTransit",
      inTransit: "completed",
    };

    return statusFlow[shipmentStatus] || null;
  };

  const getStatusButtonLabel = () => {
    const labels = {
      inTransit: "Start Transit",
      completed: "Mark as Delivered",
    };

    return labels[getNextStatus()] || "";
  };

  const getStatusButtonIcon = () => {
    const icons = {
      inTransit: <FaShippingFast />,
      completed: <FaCheckCircle />,
    };

    return icons[getNextStatus()] || null;
  };

  const renderStatusButton = () => {
    if (updateLoading) {
      return (
        <button
          disabled
          className="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg flex items-center gap-2"
        >
          <FaSpinner className="animate-spin" />
          Updating...
        </button>
      );
    }

    const nextStatus = getNextStatus();
    if (!nextStatus) {
      return (
        <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg flex items-center gap-2">
          <FaCheck />
          Delivery Completed
        </div>
      );
    }

    return (
      <button
        onClick={() => updateBookingStatus(nextStatus)}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2"
      >
        {getStatusButtonIcon()}
        {getStatusButtonLabel()}
      </button>
    );
  };

  const renderStatusTimeline = () => {
    const statuses = [
      {
        id: "confirmed",
        label: "Confirmed",
        icon: <FaCheck />,
        date: booking?.confirmedAt,
      },
      {
        id: "inTransit",
        label: "In Transit",
        icon: <FaShippingFast />,
        date: booking?.inTransitAt,
      },
      {
        id: "completed",
        label: "Delivered",
        icon: <FaCheckCircle />,
        date: booking?.completedAt,
      },
    ];

    return (
      <div className="space-y-2">
        {statuses.map((status, index) => {
          const isActive =
            shipmentStatus === status.id ||
            statuses.findIndex((s) => s.id === shipmentStatus) > index;
          const isCompleted =
            statuses.findIndex((s) => s.id === shipmentStatus) > index;

          return (
            <React.Fragment key={status.id}>
              <div
                className={`flex items-center ${
                  isActive ? "text-red-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    isActive ? "bg-red-100" : "bg-gray-100"
                  }`}
                >
                  {status.icon}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex justify-between">
                    <p className="font-medium">{status.label}</p>
                    {status.date && (
                      <p className="text-sm text-gray-500">
                        {formatDate(status.date)}
                      </p>
                    )}
                  </div>
                  {status.id === shipmentStatus && !isCompleted && (
                    <p className="text-sm text-red-500">Current Status</p>
                  )}
                </div>
              </div>
              {index < statuses.length - 1 && (
                <div
                  className={`h-8 w-0.5 ml-5 ${
                    isCompleted ? "bg-red-400" : "bg-gray-200"
                  }`}
                ></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  // Function to get the actual price from various possible sources
  const getActualPrice = () => {
    // If booking is not loaded yet, return 0
    if (!booking) return 0;

    // Check for finalPrice first (most reliable source)
    if (booking.finalPrice && parseFloat(booking.finalPrice) > 0) {
      return parseFloat(booking.finalPrice);
    }

    // Check for payment amount if available
    if (
      booking.payment &&
      booking.payment.amount &&
      parseFloat(booking.payment.amount) > 0
    ) {
      return parseFloat(booking.payment.amount);
    }

    // Check for regular price
    if (booking.price && parseFloat(booking.price) > 0) {
      return parseFloat(booking.price);
    }

    // Check for the acceptedBid object
    if (booking.acceptedBid && booking.acceptedBid.amount) {
      return parseFloat(booking.acceptedBid.amount);
    }

    // Check for driver's accepted bid in driverBids array
    if (booking.driverBids && Array.isArray(booking.driverBids)) {
      // First look for the accepted bid
      const acceptedBid = booking.driverBids.find(
        (bid) =>
          bid.status === "accepted" ||
          (bid.driverId &&
            bid.driverId.toString() === booking.driverId?.toString())
      );

      if (acceptedBid && (acceptedBid.price || acceptedBid.amount)) {
        return parseFloat(acceptedBid.price || acceptedBid.amount);
      }

      // If no accepted bid found but driver is assigned, use the first bid's price
      if (booking.driverBids.length > 0) {
        const firstBid = booking.driverBids[0];
        if (firstBid.price || firstBid.amount) {
          return parseFloat(firstBid.price || firstBid.amount);
        }
      }
    }

    // If we have estimated price, return the average
    if (
      booking.estimatedPrice &&
      typeof booking.estimatedPrice === "object" &&
      booking.estimatedPrice.min !== undefined &&
      booking.estimatedPrice.max !== undefined
    ) {
      return (
        (parseFloat(booking.estimatedPrice.min) +
          parseFloat(booking.estimatedPrice.max)) /
        2
      );
    }

    // If all else fails, return 0
    return 0;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <FaSpinner className="animate-spin text-red-500 text-3xl mb-4" />
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!booking) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Booking Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The booking you're looking for could not be found or you don't
              have permission to view it.
            </p>
            <button
              onClick={() => navigate("/my-bookings")}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center gap-2 mx-auto"
            >
              <FaArrowLeft />
              Back to My Bookings
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        {/* Back button and header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/my-bookings")}
            className="mb-4 flex items-center gap-2 text-gray-600 hover:text-red-500 cursor-pointer"
          >
            <FaArrowLeft size={14} />
            <span>Back to My Bookings</span>
          </button>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-800">
                    Booking #{booking.bookingId}
                  </h1>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium 
                    ${
                      shipmentStatus === "confirmed"
                        ? "bg-blue-100 text-blue-800"
                        : shipmentStatus === "inTransit"
                        ? "bg-yellow-100 text-yellow-800"
                        : shipmentStatus === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {typeof shipmentStatus === "string"
                      ? shipmentStatus.charAt(0).toUpperCase() +
                        shipmentStatus.slice(1).replace(/([A-Z])/g, " $1")
                      : "Unknown Status"}
                  </span>
                </div>
                <p className="text-gray-500 mt-1">
                  {booking.confirmedAt
                    ? `Confirmed: ${formatDate(booking.confirmedAt)}`
                    : ""}
                </p>
              </div>
              <div>{renderStatusButton()}</div>
            </div>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
          <div className="flex flex-col sm:flex-row border-b border-gray-200">
            <button
              onClick={() => setActiveTab("details")}
              className={`flex-1 py-3 sm:py-4 px-3 sm:px-4 text-center font-medium cursor-pointer transition-colors ${
                activeTab === "details"
                  ? "text-red-600 border-b-2 border-red-600 bg-red-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FaClipboardList className="text-lg" />
                <span className="whitespace-nowrap">Booking Details</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("tracking")}
              className={`flex-1 py-3 sm:py-4 px-3 sm:px-4 text-center font-medium cursor-pointer transition-colors ${
                activeTab === "tracking"
                  ? "text-red-600 border-b-2 border-red-600 bg-red-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FaShippingFast className="text-lg" />
                <span className="whitespace-nowrap">Delivery Tracking</span>
              </div>
            </button>
          </div>
        </div>

        {activeTab === "details" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Details Section */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaUser className="text-red-600" /> Customer Information
                </h2>

                <div className="flex flex-col md:flex-row gap-6">
                  {/* Customer Photo */}
                  <div className="flex-shrink-0">
                    {customer?.profileImage ? (
                      <img
                        src={customer.profileImage}
                        alt={customer.fullName || "Customer"}
                        className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center">
                        <FaUser className="text-red-400 text-3xl" />
                      </div>
                    )}
                  </div>

                  {/* Customer Details */}
                  <div className="flex-grow space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="text-gray-800 font-medium">
                        {customer?.fullName || "Not available"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <FaPhone className="text-gray-500" />
                      <a
                        href={`tel:${customer?.phone}`}
                        className="text-red-600 hover:underline cursor-pointer"
                      >
                        {customer?.phone || "Not available"}
                      </a>
                    </div>

                    <div className="flex items-center gap-2">
                      <FaEnvelope className="text-gray-500" />
                      <a
                        href={`mailto:${customer?.email}`}
                        className="text-red-600 hover:underline cursor-pointer"
                      >
                        {customer?.email || "Not available"}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipment Details Section */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaShippingFast className="text-red-600" /> Shipment Details
                </h2>

                <div className="space-y-6">
                  {/* Pickup and Delivery */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-5 bg-red-50 rounded-lg border border-red-100">
                      <div className="flex items-start gap-3">
                        <div className="bg-red-100 p-2 rounded-full">
                          <FaMapMarkerAlt className="text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">
                            Pickup Address
                          </p>
                          <p className="text-gray-800 font-medium">
                            {formatLocation(booking.pickup)}
                          </p>
                          {booking.pickup?.landmark && (
                            <p className="text-sm text-gray-600 mt-1">
                              Landmark: {booking.pickup.landmark}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-5 bg-green-50 rounded-lg border border-green-100">
                      <div className="flex items-start gap-3">
                        <div className="bg-green-100 p-2 rounded-full">
                          <FaMapMarkerAlt className="text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">
                            Delivery Address
                          </p>
                          <p className="text-gray-800 font-medium">
                            {formatLocation(booking.delivery)}
                          </p>
                          {booking.delivery?.landmark && (
                            <p className="text-sm text-gray-600 mt-1">
                              Landmark: {booking.delivery.landmark}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Other details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Schedule */}
                    <div className="p-5 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex items-start gap-3">
                        <div className="bg-red-100 p-2 rounded-full">
                          <FaCalendarAlt className="text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Schedule</p>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <FaCalendarAlt className="text-gray-400" />
                              <span className="text-gray-800 font-medium">
                                {formatDate(booking.schedule?.date)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FaClock className="text-gray-400" />
                              <span className="text-gray-800 font-medium">
                                {booking.schedule?.time || "Not specified"}
                              </span>
                            </div>
                          </div>
                          {booking.schedule?.specialInstructions &&
                            typeof booking.schedule.specialInstructions ===
                              "string" && (
                              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                                <h4 className="text-sm font-medium text-yellow-800 mb-2 flex items-center gap-1">
                                  <FaInfoCircle /> Special Instructions
                                </h4>
                                <p className="text-sm text-yellow-700">
                                  {booking.schedule.specialInstructions}
                                </p>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>

                    {/* Goods & Vehicle */}
                    <div className="p-5 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-yellow-100 p-2 rounded-full">
                            <FaBoxOpen className="text-yellow-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">
                              Vehicle Type
                            </p>
                            <div className="flex flex-col md:flex-row md:items-center justify-between py-3">
                              <span className="text-gray-600 font-medium">
                                Vehicle Type:
                              </span>
                              <span className="text-gray-800">
                                {(() => {
                                  const vehicleType =
                                    booking.vehicle ||
                                    booking.vehicleType ||
                                    booking.vehicleDetails?.basic?.type;

                                  if (typeof vehicleType === "string") {
                                    return vehicleType
                                      .replace(/_/g, " ")
                                      .split(" ")
                                      .map(
                                        (word) =>
                                          word.charAt(0).toUpperCase() +
                                          word.slice(1)
                                      )
                                      .join(" ");
                                  }
                                  return "Not specified";
                                })()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Goods Details */}
              <div className="mt-6 bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaBoxOpen className="text-red-600" /> Goods Details
                </h2>

                <div className="space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">
                      Goods Type:
                    </span>
                    <span className="text-gray-800">
                      {booking.goods && booking.goods.type
                        ? booking.goods.type
                            .replace(/_/g, " ")
                            .split(" ")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")
                        : booking.goodsType || "N/A"}
                    </span>
                  </div>

                  {booking.goods &&
                    booking.goods.items &&
                    booking.goods.items.length > 0 && (
                      <div className="flex flex-col md:flex-row md:items-start justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-600 font-medium md:mt-1">
                          Items:
                        </span>
                        <div className="text-gray-800 md:text-right">
                          <ul className="list-disc pl-5 md:pl-0 md:list-none">
                            {booking.goods.items.map((item, index) => (
                              <li key={index} className="mb-1">
                                {typeof item === "string"
                                  ? item
                                  : typeof item === "object" && item !== null
                                  ? (item.name || item.itemName || "Item") +
                                    (item.quantity ? ` (${item.quantity})` : "")
                                  : `Item ${index + 1}`}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                  {booking.goods && booking.goods.additionalItems && (
                    <div className="flex flex-col md:flex-row md:items-center justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">
                        Additional Items:
                      </span>
                      <span className="text-gray-800">
                        {booking.goods.additionalItems}
                      </span>
                    </div>
                  )}

                  {/* Add any other goods details that might be available */}
                  {booking.weight && (
                    <div className="flex flex-col md:flex-row md:items-center justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Weight:</span>
                      <span className="text-gray-800">{booking.weight} kg</span>
                    </div>
                  )}

                  {booking.dimensions && (
                    <div className="flex flex-col md:flex-row md:items-center justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">
                        Dimensions:
                      </span>
                      <span className="text-gray-800">
                        {booking.dimensions}
                      </span>
                    </div>
                  )}

                  {booking.description && (
                    <div className="flex flex-col md:flex-row md:items-center justify-between py-3">
                      <span className="text-gray-600 font-medium">
                        Description:
                      </span>
                      <span className="text-gray-800">
                        {booking.description}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Price Card */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaMoneyBillWave className="text-red-600" /> Price Details
                </h2>

                <div className="space-y-3">
                  {/* Final Price - Show this for confirmed bookings */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">
                      {booking.status !== "pending" ? "Final Price:" : "Price:"}
                    </span>
                    <span className="text-green-600 font-semibold text-lg">
                      ₹{parseFloat(getActualPrice()).toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* Estimated Price - Show for reference */}
                  {booking.estimatedPrice &&
                    typeof booking.estimatedPrice === "object" &&
                    booking.estimatedPrice.min !== undefined &&
                    booking.estimatedPrice.max !== undefined && (
                      <div className="flex flex-col md:flex-row md:items-center justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">
                          Estimated Price Range:
                        </span>
                        <span className="text-gray-500 font-medium">
                          <span>
                            ₹
                            {Number(booking.estimatedPrice.min).toLocaleString(
                              "en-IN"
                            )}
                          </span>
                          <span className="mx-1">-</span>
                          <span>
                            ₹
                            {Number(booking.estimatedPrice.max).toLocaleString(
                              "en-IN"
                            )}
                          </span>
                        </span>
                      </div>
                    )}

                  {/* Payment Details */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">
                      Payment Status:
                    </span>
                    <span
                      className={`font-medium ${
                        booking.payment?.status === "success" ||
                        booking.paymentStatus === "success" ||
                        booking.payment?.status === "paid" ||
                        booking.paymentStatus === "paid"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {booking.payment?.status === "success" ||
                      booking.paymentStatus === "success" ||
                      booking.payment?.status === "paid" ||
                      booking.paymentStatus === "paid"
                        ? "Paid"
                        : booking.status !== "pending"
                        ? "Paid"
                        : "Pending"}
                    </span>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between py-3">
                    <span className="text-gray-600 font-medium">
                      Payment Method:
                    </span>
                    <span className="text-gray-800">
                      {booking.payment?.method
                        ? booking.payment.method.charAt(0).toUpperCase() +
                          booking.payment.method.slice(1)
                        : booking.paymentMethod
                        ? booking.paymentMethod.charAt(0).toUpperCase() +
                          booking.paymentMethod.slice(1)
                        : "Online Payment"}
                    </span>
                  </div>

                  {/* Payment ID if available */}
                  {(booking.payment?._id || booking.paymentId) && (
                    <div className="flex flex-col md:flex-row md:items-center justify-between py-3 border-t border-gray-100">
                      <span className="text-gray-600 font-medium">
                        Payment ID:
                      </span>
                      <span className="text-gray-800 font-mono text-sm">
                        {booking.payment?._id || booking.paymentId}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Route Map Preview */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaMapMarkedAlt className="text-red-600" /> Route Map
                </h2>

                <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center border border-gray-100">
                  <div className="text-center w-full mb-4">
                    <FaMapMarkedAlt className="text-gray-400 mx-auto mb-2 text-3xl" />
                    <p className="text-gray-500 text-sm mb-1">Route from:</p>
                    <div className="space-y-1 max-w-full">
                      <p className="font-medium text-gray-700 text-sm line-clamp-2 px-2">
                        {formatLocation(booking.pickup)}
                      </p>
                      <p className="text-xs text-gray-500">to</p>
                      <p className="font-medium text-gray-700 text-sm line-clamp-2 px-2">
                        {formatLocation(booking.delivery)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const origin = encodeURIComponent(
                        formatLocation(booking.pickup)
                      );
                      const destination = encodeURIComponent(
                        formatLocation(booking.delivery)
                      );
                      window.open(
                        `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`,
                        "_blank"
                      );
                    }}
                    className="w-full max-w-[180px] bg-red-500 hover:bg-red-600 text-white text-sm py-2 rounded-lg transition-colors cursor-pointer hover:scale-105 hover:shadow-lg"
                  >
                    Open in Maps
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "tracking" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Tracking Timeline */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <FaShippingFast className="text-red-600" /> Delivery Status
                  Timeline
                </h2>

                <div className="p-4 bg-red-50 rounded-lg mb-6 border border-red-100">
                  <div className="flex items-center gap-2">
                    <FaInfoCircle className="text-red-500" />
                    <p className="text-red-700 text-sm">
                      Update the delivery status as you progress through your
                      journey. The customer will be notified of each status
                      change.
                    </p>
                  </div>
                </div>

                {renderStatusTimeline()}

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-800">
                        Current Status
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {shipmentStatus === "confirmed" && "Ready for pickup"}
                        {shipmentStatus === "inTransit" &&
                          "On the way to delivery location"}
                        {shipmentStatus === "completed" && "Delivery completed"}
                      </p>
                    </div>

                    {getNextStatus() && (
                      <button
                        onClick={() => updateBookingStatus(getNextStatus())}
                        disabled={updateLoading}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 disabled:bg-gray-300 disabled:text-gray-500"
                      >
                        {updateLoading ? (
                          <>
                            <FaSpinner className="animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            {getStatusButtonIcon()}
                            {getStatusButtonLabel()}
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Location Sharing */}
            <div className="space-y-6">
              {/* Live Location Sharing - Only show when in transit */}
              {shipmentStatus === "inTransit" ? (
                <LiveLocationSharing bookingId={bookingId} />
              ) : (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaMapMarkedAlt className="text-red-600" /> Location Sharing
                  </h2>

                  <div className="p-5 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="text-center space-y-4">
                      {shipmentStatus === "completed" ? (
                        <div className="flex flex-col items-center">
                          <FaCheckCircle className="text-green-500 text-3xl mb-2" />
                          <p className="text-gray-700">Delivery completed</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Location sharing is no longer needed
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-col items-center">
                            <FaExclamationTriangle className="text-yellow-500 text-3xl mb-2" />
                            <p className="text-gray-700 font-medium">
                              Location sharing will be available
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              Once you start the transit, you can share your
                              live location with the customer
                            </p>
                          </div>
                          <div className="flex justify-center w-full">
                            <button
                              onClick={() => updateBookingStatus("inTransit")}
                              disabled={updateLoading}
                              className="w-full max-w-[200px] bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:text-gray-500 cursor-pointer"
                            >
                              {updateLoading ? (
                                <>
                                  <FaSpinner className="animate-spin" />
                                  Updating...
                                </>
                              ) : (
                                <>
                                  <FaShippingFast />
                                  Start Transit Now
                                </>
                              )}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Delivery Instructions */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaClipboardList className="text-red-600" /> Delivery
                  Instructions
                </h2>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="space-y-3">
                    <p className="text-gray-700 font-medium">
                      Instructions for Delivery:
                    </p>

                    <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
                      <li>Confirm the delivery address before proceeding</li>
                      <li>Contact the customer before arrival</li>
                      <li>Verify the recipient's identity before handover</li>
                      <li>Take a photo of the delivered goods if possible</li>
                      <li>Update the status to "Delivered" once completed</li>
                    </ul>

                    {booking.schedule?.specialInstructions &&
                      typeof booking.schedule.specialInstructions ===
                        "string" && (
                        <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                          <h4 className="text-sm font-medium text-yellow-800 mb-2 flex items-center gap-1">
                            <FaInfoCircle /> Special Instructions
                          </h4>
                          <p className="text-sm text-yellow-700">
                            {booking.schedule.specialInstructions}
                          </p>
                        </div>
                      )}
                  </div>
                </div>
              </div>

              {/* Customer Support */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaInfoCircle className="text-red-600" /> Need Help?
                </h2>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-gray-700 mb-3">
                    If you encounter any issues during delivery, contact our
                    support team:
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <FaPhone className="text-red-500" />
                      <a
                        href="tel:+918800880088"
                        className="text-red-600 hover:underline cursor-pointer"
                      >
                        +91 8800 880088
                      </a>
                    </div>

                    <div className="flex items-center gap-2">
                      <FaEnvelope className="text-red-500" />
                      <a
                        href="mailto:support@shiftly.com"
                        className="text-red-600 hover:underline cursor-pointer"
                      >
                        support@shiftly.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ConfirmedBookingDetails;
