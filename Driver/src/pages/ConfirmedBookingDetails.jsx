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
} from "react-icons/fa";
import { toast } from "react-hot-toast";

const ConfirmedBookingDetails = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [shipmentStatus, setShipmentStatus] = useState("");

  // Set dynamic page title when component mounts
  useEffect(() => {
    // Update the document title
    document.title = "Confirmed Job | Transport Assignment | Shiftly - A Seamless Transport System";
    
    // Optional: Restore the original title when component unmounts
    return () => {
      document.title = "Shiftly | A Seamless Transport System";
    };
  }, []);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    console.log(
      "🚨 ConfirmedBookingDetails - Fetching details for bookingId:",
      bookingId
    );
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("driverToken");
      if (!token) {
        console.error("No driver token found");
        navigate("/login");
        return;
      }

      console.log(
        `Sending request to fetch booking details: ${
          import.meta.env.VITE_BACKEND_URL
        }/api/driver/bookings/${bookingId}`
      );

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/driver/bookings/${bookingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log("Booking details API response:", data);

      if (!response.ok) {
        console.error("API responded with error:", data);
        throw new Error(data.message || "Failed to fetch booking details");
      }

      if (data.success && data.booking) {
        console.log("✅ Booking details fetched successfully:", data.booking);
        setBooking(data.booking);
        setShipmentStatus(data.booking.status);

        // Set customer data if available in the booking
        if (data.booking.userId) {
          console.log("Customer info:", data.booking.userId);
          setCustomer(data.booking.userId);
        }
      } else {
        console.error("No booking found in response");
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
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatLocation = (location) => {
    if (!location) return "Not specified";
    const parts = [];

    if (location.addressLine1) parts.push(location.addressLine1);
    if (location.addressLine2) parts.push(location.addressLine2);
    if (location.city) parts.push(location.city);
    if (location.state) parts.push(location.state);
    if (location.pincode) parts.push(location.pincode);

    return parts.join(", ");
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

    if (shipmentStatus === "confirmed") {
      return (
        <button
          onClick={() => updateBookingStatus("inTransit")}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
        >
          <FaShippingFast />
          Start Transit
        </button>
      );
    }

    if (shipmentStatus === "inTransit") {
      return (
        <button
          onClick={() => updateBookingStatus("completed")}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
        >
          <FaCheckCircle />
          Mark as Delivered
        </button>
      );
    }

    if (shipmentStatus === "completed") {
      return (
        <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg flex items-center gap-2">
          <FaCheck />
          Delivery Completed
        </div>
      );
    }

    return null;
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
            className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <FaArrowLeft size={14} />
            <span>Back to My Bookings</span>
          </button>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-1">
                  Booking #{booking.bookingId}
                </h1>
                <div className="flex items-center gap-2">
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
                    {shipmentStatus.charAt(0).toUpperCase() +
                      shipmentStatus.slice(1)}
                  </span>
                  <span className="text-gray-500">
                    {booking.confirmedAt
                      ? `Confirmed: ${formatDate(booking.confirmedAt)}`
                      : ""}
                  </span>
                </div>
              </div>
              <div>{renderStatusButton()}</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Details Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaUser className="text-red-500" /> Customer Information
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
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                      <FaUser className="text-gray-400 text-3xl" />
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
                      className="text-blue-600 hover:underline cursor-pointer"
                    >
                      {customer?.phone || "Not available"}
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaEnvelope className="text-gray-500" />
                    <a
                      href={`mailto:${customer?.email}`}
                      className="text-blue-600 hover:underline cursor-pointer"
                    >
                      {customer?.email || "Not available"}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipment Details Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaShippingFast className="text-red-500" /> Shipment Details
              </h2>

              <div className="space-y-4">
                {/* Pickup and Delivery */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="bg-red-100 p-2 rounded-full">
                        <FaMapMarkerAlt className="text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">
                          Pickup Address
                        </p>
                        <p className="text-gray-800">
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

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <FaMapMarkerAlt className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">
                          Delivery Address
                        </p>
                        <p className="text-gray-800">
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
                <div className="space-y-4">
                  {/* Schedule */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <FaCalendarAlt className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Schedule</p>
                        <div className="flex flex-col md:flex-row md:gap-4">
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-gray-400" />
                            <span className="text-gray-800">
                              {formatDate(booking.schedule?.date)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaClock className="text-gray-400" />
                            <span className="text-gray-800">
                              {booking.schedule?.time || "Not specified"}
                            </span>
                          </div>
                        </div>
                        {booking.schedule?.specialInstructions && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">
                              Special Instructions
                            </p>
                            <p className="text-gray-800">
                              {booking.schedule.specialInstructions}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Goods */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="bg-yellow-100 p-2 rounded-full">
                        <FaBoxOpen className="text-yellow-600" />
                      </div>
                      <div className="w-full">
                        <p className="text-sm text-gray-500 mb-1">Goods</p>
                        <p className="text-gray-800">
                          Type:{" "}
                          {booking.goods?.type
                            ?.replace(/_/g, " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase()) ||
                            "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <FaTruck className="text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Vehicle</p>
                        <p className="text-gray-800">
                          {booking.vehicle
                            ?.replace(/_/g, " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase()) ||
                            "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaMoneyBillWave className="text-red-500" /> Price Details
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Final Price</span>
                  <span className="text-gray-800 font-medium">
                    ₹{booking.finalPrice || booking.amount || 0}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between font-semibold">
                    <span className="text-gray-800">Your Earnings</span>
                    <span className="text-gray-800">
                      ₹{booking.finalPrice || booking.amount || 0}
                    </span>
                  </div>
                </div>

                <div className="bg-green-50 p-3 rounded-lg mt-4">
                  <div className="flex items-center gap-2">
                    <FaCheck className="text-green-500" />
                    <span className="text-green-700 font-medium">
                      Payment Completed
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaShippingFast className="text-red-500" /> Delivery Tracking
              </h2>

              <div className="space-y-4">
                <div
                  className={`relative flex items-center ${
                    shipmentStatus === "confirmed" ||
                    shipmentStatus === "inTransit" ||
                    shipmentStatus === "completed"
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      shipmentStatus === "confirmed" ||
                      shipmentStatus === "inTransit" ||
                      shipmentStatus === "completed"
                        ? "bg-green-100"
                        : "bg-gray-100"
                    }`}
                  >
                    <FaCheck
                      className={
                        shipmentStatus === "confirmed" ||
                        shipmentStatus === "inTransit" ||
                        shipmentStatus === "completed"
                          ? "text-green-600"
                          : "text-gray-400"
                      }
                    />
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">Confirmed</p>
                    <p className="text-sm text-gray-500">
                      {booking.confirmedAt
                        ? formatDate(booking.confirmedAt)
                        : "Pending"}
                    </p>
                  </div>
                </div>

                <div className="h-10 w-0.5 bg-gray-200 ml-4"></div>

                <div
                  className={`relative flex items-center ${
                    shipmentStatus === "inTransit" ||
                    shipmentStatus === "completed"
                      ? "text-blue-600"
                      : "text-gray-400"
                  }`}
                >
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      shipmentStatus === "inTransit" ||
                      shipmentStatus === "completed"
                        ? "bg-blue-100"
                        : "bg-gray-100"
                    }`}
                  >
                    <FaShippingFast
                      className={
                        shipmentStatus === "inTransit" ||
                        shipmentStatus === "completed"
                          ? "text-blue-600"
                          : "text-gray-400"
                      }
                    />
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">In Transit</p>
                    <p className="text-sm text-gray-500">
                      {booking.inTransitAt
                        ? formatDate(booking.inTransitAt)
                        : "Pending"}
                    </p>
                  </div>
                </div>

                <div className="h-10 w-0.5 bg-gray-200 ml-4"></div>

                <div
                  className={`relative flex items-center ${
                    shipmentStatus === "completed"
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      shipmentStatus === "completed"
                        ? "bg-green-100"
                        : "bg-gray-100"
                    }`}
                  >
                    <FaCheck
                      className={
                        shipmentStatus === "completed"
                          ? "text-green-600"
                          : "text-gray-400"
                      }
                    />
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">Delivered</p>
                    <p className="text-sm text-gray-500">
                      {booking.completedAt
                        ? formatDate(booking.completedAt)
                        : "Pending"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ConfirmedBookingDetails;
