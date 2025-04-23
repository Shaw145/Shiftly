import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaTruck,
  FaBoxOpen,
  FaMoneyBillWave,
  FaStar,
  FaArrowLeft,
  FaDirections,
  FaFileAlt,
  FaInfoCircle,
  FaCheck,
  FaUsers,
  FaLock,
  FaCrown,
  FaMedal,
  FaChevronLeft,
  FaTimes,
  FaPaperPlane,
  FaRuler,
  FaFlag,
  FaList,
  FaRupeeSign,
  FaBoxes,
} from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";
import DashboardLayout from "../components/DashboardLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import BidForm from "../components/bookings/BidForm";
import LocationMap from "../components/bookings/LocationMap";
import TopBidders from "../components/bookings/TopBidders";
import { useWebSocket } from "../context/WebSocketContext";
import AllBiddersModal from "../components/bookings/AllBiddersModal";
// Import useDriverAuth instead of useAuth
import { useDriverAuth } from "../context/DriverAuthContext";

const BookingDetails = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  // Use useDriverAuth hook for authentication
  const { getToken, driverId: authDriverId } = useDriverAuth();
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [topBidders, setTopBidders] = useState([]);
  const [currentBid, setCurrentBid] = useState(null);
  const [showAllBiddersModal, setShowAllBiddersModal] = useState(false);
  const [bookingObjectId, setBookingObjectId] = useState(null);

  const { isConnected, on, placeBid } = useWebSocket();

  // Store the driver ID in localStorage
  useEffect(() => {
    if (authDriverId) {
      localStorage.setItem("driverId", authDriverId);
    }
  }, [authDriverId]);

  // Get the driver ID from localStorage or from auth context
  const driverId = localStorage.getItem("driverId") || authDriverId;

  // Calculate if bidding is locked (24 hours before pickup)
  const isBidLocked = (date) => {
    if (!date) return false;

    try {
      const pickupDate = new Date(date);
      const now = new Date();
      const hoursBeforePickup = (pickupDate - now) / (1000 * 60 * 60);
      return hoursBeforePickup < 24;
    } catch (err) {
      console.error("Date parsing error:", err);
      return false;
    }
  };

  // Fetch booking details when component mounts or bookingId changes
  useEffect(() => {
    const fetchBookingDetails = async () => {
      setIsLoading(true);
      try {
        // Get token directly from localStorage to ensure it's always available
        const token = localStorage.getItem("driverToken");

        if (!token) {
          toast.error("Authentication required. Please login again.");
          navigate("/login");
          return;
        }

        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/bookings/available/${bookingId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          toast.error(data.error || "Failed to load booking details");
          throw new Error(data.error || "Failed to load booking details");
        }

        setBooking(data.booking);

        // Store the MongoDB ObjectId for bid submission
        setBookingObjectId(data.booking._id);

        // Fetch existing bids for this booking from server
        const bidsResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/bids/driver/booking/${
            data.booking._id
          }`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const bidsData = await bidsResponse.json();

        if (bidsResponse.ok && bidsData.data) {
          // Process the bids to ensure no duplicates
          const processedBids = bidsData.data.reduce((acc, bid) => {
            const existingBidIndex = acc.findIndex(
              (b) => b.driverId === bid.driverId
            );
            if (existingBidIndex >= 0) {
              // Compare timestamps and keep the most recent one
              const existingTime = new Date(
                acc[existingBidIndex].bidTime || 0
              ).getTime();
              const newTime = new Date(bid.bidTime || 0).getTime();
              if (newTime > existingTime) {
                acc[existingBidIndex] = bid;
              }
            } else {
              acc.push(bid);
            }
            return acc;
          }, []);

          setTopBidders(processedBids);

          // Fetch current driver's bid
          if (driverId) {
            const currentBidResponse = await fetch(
              `${import.meta.env.VITE_BACKEND_URL}/api/bids/driver/booking/${
                data.booking._id
              }/current`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (currentBidResponse.ok) {
              const currentBidData = await currentBidResponse.json();
              if (currentBidData.success && currentBidData.data) {
                setCurrentBid(currentBidData.data);
              }
            }
          }
        }
      } catch (err) {
        console.error("Error fetching booking details:", err);
        toast.error("Could not load booking details");

        // Navigate back to available bookings after delay
        setTimeout(() => {
          navigate("/available-bookings");
        }, 3000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId, navigate, driverId]);

  // Set up WebSocket event listeners for real-time updates
  useEffect(() => {
    if (!on || !bookingId) return;

    // Get the current driver ID for comparison
    const currentDriverId = localStorage.getItem("driverId");

    // Listen for new bids - only update UI when a valid bid is received
    const unsubscribeNewBid = on("new_bid", (data) => {
      if (data.bookingId === bookingId && !data.pendingUpdate) {
        setTopBidders((prevBids) => {
          const newBids = [...prevBids];
          const existingBidIndex = newBids.findIndex(
            (bid) => bid.driverId === data.driverId
          );

          if (existingBidIndex !== -1) {
            newBids[existingBidIndex] = {
              ...newBids[existingBidIndex],
              ...data,
            };
          } else {
            newBids.push(data);
          }

          return newBids;
        });

        // Update current bid if it's from the current driver
        if (data.driverId === currentDriverId) {
          setCurrentBid(data);

          // Update localStorage for persistence
          try {
            const storedBids = JSON.parse(
              localStorage.getItem("driverBids") || "{}"
            );
            storedBids[bookingId] = data;
            localStorage.setItem("driverBids", JSON.stringify(storedBids));
          } catch (error) {
            console.error("Error updating bid in localStorage:", error);
          }
        }
      }
    });

    // Listen for bid updates - only update UI when a valid update is received
    const unsubscribeBidUpdate = on("bid_updated", (data) => {
      if (data.bookingId === bookingId && !data.pendingUpdate) {
        setTopBidders((prevBids) => {
          return prevBids.map((bid) =>
            bid.driverId === data.driverId ? { ...bid, ...data } : bid
          );
        });

        // Update current bid if it's from the current driver
        if (data.driverId === currentDriverId) {
          setCurrentBid(data);

          // Update localStorage for persistence
          try {
            const storedBids = JSON.parse(
              localStorage.getItem("driverBids") || "{}"
            );
            storedBids[bookingId] = data;
            localStorage.setItem("driverBids", JSON.stringify(storedBids));
          } catch (error) {
            console.error("Error updating bid in localStorage:", error);
          }
        }
      }
    });

    // Listen for our custom bid:update events
    const handleBidUpdate = (event) => {
      const data = event.detail.bid;
      const eventBookingId = event.detail.bookingId;

      if (eventBookingId === bookingId && data && !data.pendingUpdate) {
        // Update top bidders with the new bid info
        setTopBidders((prevBids) => {
          const existingIndex = prevBids.findIndex(
            (bid) => bid.driverId === data.driverId
          );

          if (existingIndex !== -1) {
            // Update existing bid
            const updatedBids = [...prevBids];
            updatedBids[existingIndex] = {
              ...updatedBids[existingIndex],
              amount: data.amount,
              note: data.note,
              bidTime: data.bidTime,
            };
            return updatedBids;
          } else {
            // Add new bid
            return [...prevBids, data];
          }
        });

        // Update current bid if it's from the current driver
        if (data.driverId === currentDriverId) {
          setCurrentBid((prev) => ({
            ...prev,
            ...data,
          }));

          // Update localStorage for persistence
          try {
            const storedBids = JSON.parse(
              localStorage.getItem("driverBids") || "{}"
            );
            storedBids[bookingId] = data;
            localStorage.setItem("driverBids", JSON.stringify(storedBids));
          } catch (error) {
            console.error("Error updating bid in localStorage:", error);
          }
        }
      }
    };

    // Add event listener for bid updates
    document.addEventListener("bid:update", handleBidUpdate);

    // Cleanup function
    return () => {
      // console.log("Cleaning up WebSocket event listeners");
      if (typeof unsubscribeNewBid === "function") unsubscribeNewBid();
      if (typeof unsubscribeBidUpdate === "function") unsubscribeBidUpdate();
      document.removeEventListener("bid:update", handleBidUpdate);
    };
  }, [on, bookingId, navigate]);

  // Handle bid submission from the BidForm component
  const handleSubmitBid = (bidData) => {
    console.log("Bid submitted from BookingDetails:", bidData);

    if (!placeBid) {
      toast.error("Bid submission service is unavailable");
      return;
    }

    // Always use MongoDB ObjectId for the bid API if available
    const bidBookingId = bookingObjectId || bidData.bookingId;

    // Check if we have a valid MongoDB ObjectId to work with
    if (!bidBookingId) {
      toast.error("Invalid booking reference. Please try again.");
      return;
    }

    // Create a complete bid object
    const completeBidData = {
      ...bidData,
      driverId: localStorage.getItem("driverId"),
      bidTime: new Date().toISOString(),
    };

    // Show immediate toast notification
    toast.success("Bid submitted successfully", {
      id: "bid-submit-success",
    });

    // Immediately dispatch a custom event to update UI
    // This ensures local UI updates even before server confirms
    const localUpdateEvent = new CustomEvent("bid:update", {
      detail: {
        bookingId: bidBookingId,
        bid: completeBidData,
      },
    });
    document.dispatchEvent(localUpdateEvent);

    // Use the placeBid function from WebSocketContext to submit the bid
    placeBid(bidBookingId, bidData.amount, bidData.note)
      .then((result) => {
        if (result.success) {
          // Update localStorage with the new bid data for persistence
          try {
            const storedBids = JSON.parse(
              localStorage.getItem("driverBids") || "{}"
            );
            storedBids[bookingId] = completeBidData;
            localStorage.setItem("driverBids", JSON.stringify(storedBids));
          } catch (error) {
            console.error("Error saving bid to localStorage:", error);
          }
        }
      })
      .catch((error) => {
        console.error("Error submitting bid:", error);
        toast.error("An error occurred while submitting your bid", {
          id: "bid-submit-error",
        });
      });
  };

  // Format date properly based on various possible date formats
  const formatDate = (dateString) => {
    if (!dateString) return "Date not specified";

    try {
      return new Date(dateString).toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString.toString();
    }
  };

  // Updated formatLocation function that properly handles the nested address objects in the booking data
  const formatLocation = (location) => {
    if (!location) return "Address not available";

    // Handle string addresses directly
    if (typeof location === "string") return location;

    // For handling complete address objects like in the sample booking data
    if (location.address && typeof location.address === "string") {
      // This captures the full address string already formatted in the database
      return location.address;
    }

    // Start building the address from individual components
    const parts = [];

    // Add street/address lines
    if (location.street || location.street1 || location.addressLine1) {
      parts.push(location.street || location.street1 || location.addressLine1);
    }

    if (location.street2 || location.addressLine2) {
      parts.push(location.street2 || location.addressLine2);
    }

    // Add city, state, pincode as a group
    const cityStatePin = [];
    if (location.city) cityStatePin.push(location.city);
    if (location.state) cityStatePin.push(location.state);
    if (location.pincode || location.zip || location.postalCode) {
      cityStatePin.push(
        location.pincode || location.zip || location.postalCode
      );
    }

    if (cityStatePin.length > 0) {
      parts.push(cityStatePin.join(", "));
    }

    // Add landmark if available
    if (location.landmark) {
      parts.push(`Landmark: ${location.landmark}`);
    }

    // If we have parts, join them with newlines for better display
    if (parts.length > 0) {
      return parts.join("\n");
    }

    // If no structured parts were found but we have nested objects, try to recurse
    if (typeof location.pickup === "object" && location.pickup) {
      return formatLocation(location.pickup);
    }

    if (typeof location.delivery === "object" && location.delivery) {
      return formatLocation(location.delivery);
    }

    // Last resort fallbacks
    return (
      location.formattedAddress ||
      location.fullAddress ||
      "Address details not available"
    );
  };

  // Get standardized property value from booking with fallbacks
  const getBookingProperty = (property, fallback = "Not specified") => {
    switch (property) {
      case "pickupLocation":
        return formatLocation(booking.pickupLocation || booking.pickup);
      case "deliveryLocation":
        return formatLocation(
          booking.deliveryLocation || booking.delivery || booking.destination
        );
      case "date":
        return formatDate(
          booking.date || booking.schedule?.date || booking.pickupDate
        );
      case "time":
        return booking.time || booking.schedule?.time || "Time not specified";
      case "loadType":
        return booking.loadType || booking.goods?.type || fallback;
      case "weight":
        return (
          booking.weight ||
          (booking.goods?.items
            ? booking.goods.items.reduce(
                (total, item) =>
                  total +
                  (Number(item.weight) || 0) * (Number(item.quantity) || 1),
                0
              ) + " kg"
            : fallback)
        );
      case "distance":
        return booking.distance || fallback;
      case "priceRange":
        if (booking.priceRange) {
          if (typeof booking.priceRange === "string") {
            return booking.priceRange;
          } else if (typeof booking.priceRange === "object") {
            return `₹${booking.priceRange.min} - ₹${booking.priceRange.max}`;
          }
        }
        return booking.estimatedPrice ? `₹${booking.estimatedPrice}` : fallback;
      default:
        return booking[property] || fallback;
    }
  };

  // Handler for header section
  const BookingHeader = ({ booking }) => {
    if (!booking) return null;

    const pickupDate = formatDate(
      booking.schedule?.date || booking.pickupDate || booking.date
    );
    const pickupTime =
      booking.schedule?.time ||
      booking.pickupTime ||
      booking.time ||
      "Not specified";
    const distance = booking.distance
      ? `${booking.distance} km`
      : "Distance not available";
    const loadType = booking.goods?.type || booking.loadType || "Not specified";

    // Enhanced logic to extract vehicle type with more fallbacks
    let vehicleType = "Not specified";

    if (booking.vehicle && typeof booking.vehicle === "string") {
      vehicleType = booking.vehicle;
    } else if (booking.vehicleType && typeof booking.vehicleType === "string") {
      vehicleType = booking.vehicleType;
    } else if (booking.vehicleDetails?.type) {
      vehicleType = booking.vehicleDetails.type;
    } else if (booking.vehicle?.type) {
      vehicleType = booking.vehicle.type;
    } else if (booking.vehiclePreference) {
      vehicleType = booking.vehiclePreference;
    }

    // Handle price range display with comprehensive fallbacks
    let priceRange = "Not specified";
    if (booking.estimatedPrice && typeof booking.estimatedPrice === "object") {
      if (booking.estimatedPrice.min && booking.estimatedPrice.max) {
        priceRange = `₹${booking.estimatedPrice.min.toLocaleString(
          "en-IN"
        )} - ₹${booking.estimatedPrice.max.toLocaleString("en-IN")}`;
      } else if (booking.estimatedPrice.min) {
        priceRange = `₹${booking.estimatedPrice.min.toLocaleString("en-IN")}+`;
      } else if (booking.estimatedPrice.max) {
        priceRange = `Up to ₹${booking.estimatedPrice.max.toLocaleString(
          "en-IN"
        )}`;
      }
    } else if (booking.priceRange && typeof booking.priceRange === "object") {
      if (booking.priceRange.min && booking.priceRange.max) {
        priceRange = `₹${booking.priceRange.min.toLocaleString(
          "en-IN"
        )} - ₹${booking.priceRange.max.toLocaleString("en-IN")}`;
      } else if (booking.priceRange.min) {
        priceRange = `₹${booking.priceRange.min.toLocaleString("en-IN")}+`;
      } else if (booking.priceRange.max) {
        priceRange = `Up to ₹${booking.priceRange.max.toLocaleString("en-IN")}`;
      }
    } else if (booking.price) {
      priceRange = `₹${booking.price.toLocaleString("en-IN")}`;
    }

    return (
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FaTruck className="text-red-500" />
              Booking Details
            </h1>
            <p className="text-sm text-gray-500 mt-1 ml-8">
              ID: {booking.bookingId || booking.id || bookingId}
            </p>
          </div>
          {/* Status badge */}
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mt-2 md:mt-0">
            {booking.status || "Available"}
          </span>
        </div>

        {/* Quick booking details overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mt-4 bg-gray-50 p-3 rounded-lg">
          <div className="flex items-start gap-2">
            <FaCalendarAlt className="text-red-500 mt-1" />
            <div>
              <p className="text-xs text-gray-500 uppercase">Pickup Date</p>
              <p className="text-sm font-medium">{pickupDate}</p>
              <p className="text-xs text-gray-500">{pickupTime}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <FaBoxOpen className="text-red-500 mt-1" />
            <div>
              <p className="text-xs text-gray-500 uppercase">Load Type</p>
              <p className="text-sm font-medium">{loadType}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <FaTruck className="text-red-500 mt-1" />
            <div>
              <p className="text-xs text-gray-500 uppercase">Vehicle Type</p>
              <p className="text-sm font-medium">{vehicleType}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <FaRuler className="text-red-500 mt-1" />
            <div>
              <p className="text-xs text-gray-500 uppercase">Distance</p>
              <p className="text-sm font-medium">{distance}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <FaRupeeSign className="text-red-500 mt-1" />
            <div>
              <p className="text-xs text-gray-500 uppercase">Price Range</p>
              <p className="text-sm font-medium">{priceRange}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Update the ShipmentDetails component for better responsiveness
  const ShipmentDetails = ({ booking }) => {
    if (!booking) return null;

    // Extract items from goods if available
    const items = booking.goods?.items || [];
    const notes =
      booking.specialInstructions ||
      booking.notes ||
      booking.goods?.specialInstructions;

    return (
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Shipment Details
        </h2>

        {/* Pickup date & time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Pickup Date</p>
            <p className="text-gray-800 font-medium">
              {getBookingProperty("date")}
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Load Type</p>
            <p className="text-gray-800 font-medium">
              {getBookingProperty("loadType")}
            </p>
          </div>
        </div>

        {/* Distance and estimated duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Distance</p>
            <p className="text-gray-800 font-medium">
              {getBookingProperty("distance")}
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Expected Duration</p>
            <p className="text-gray-800 font-medium">
              {booking.duration || "Not specified"}
            </p>
          </div>
        </div>

        {/* Items to transport - improved for responsive layout with no horizontal scrollbar */}
        {items.length > 0 && (
          <div className="mb-6">
            <h3 className="text-md font-medium mb-3 flex items-center gap-2">
              <FaBoxes className="text-red-500" /> Items to Transport
            </h3>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="w-full">
                <div className="grid grid-cols-12 gap-2 border-b border-gray-200 pb-2 mb-2">
                  <div className="col-span-6 text-xs font-medium text-gray-500 uppercase">
                    Item
                  </div>
                  <div className="col-span-3 text-xs font-medium text-gray-500 uppercase text-center">
                    Qty
                  </div>
                  <div className="col-span-3 text-xs font-medium text-gray-500 uppercase text-right">
                    Weight
                  </div>
                </div>

                {items.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-2 py-2 border-b border-gray-100"
                  >
                    <div className="col-span-6 text-sm text-gray-700 break-words">
                      {item.name}
                    </div>
                    <div className="col-span-3 text-sm text-gray-700 text-center">
                      {item.quantity || 1}
                    </div>
                    <div className="col-span-3 text-sm text-gray-700 text-right">
                      {item.weight ? `${item.weight} kg` : "N/A"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Additional items text if present */}
        {booking.goods?.additionalItems && (
          <div className="mb-6">
            <h3 className="text-md font-medium mb-2 flex items-center gap-2">
              <FaBoxOpen className="text-red-500" /> Additional Items
            </h3>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
              {booking.goods.additionalItems}
            </p>
          </div>
        )}

        {/* Notes section */}
        {notes && (
          <div className="notes-section">
            <h3 className="text-md font-medium mb-2 flex items-center gap-2">
              <FaInfoCircle className="text-red-500" /> Special Instructions
            </h3>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{notes}</p>
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="h-full flex items-center justify-center mt-25">
          <LoadingSpinner message="Loading booking details..." />
        </div>
      </DashboardLayout>
    );
  }

  if (!booking) {
    return (
      <DashboardLayout>
        <div className="text-center py-10">
          <p className="text-red-500">Booking not found</p>
          <button
            onClick={() => navigate("/available-bookings")}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors cursor-pointer"
          >
            Back to Available Bookings
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="px-4 py-5 sm:p-6">
        {/* Back button */}
        <button
          onClick={() => navigate("/available-bookings")}
          className="flex items-center gap-2 text-gray-600 hover:text-red-600 mb-5 cursor-pointer"
        >
          <FaChevronLeft /> Back to Available Bookings
        </button>

        {/* Header with booking ID and status */}
        <BookingHeader booking={booking} />

        {/* For small screens: Show Bid Form and Top Bidders first - directly after header */}
        <div className="block lg:hidden mb-6 mt-6 space-y-6">
          <BidForm
            booking={booking}
            currentBid={currentBid}
            onBidSubmit={handleSubmitBid}
            isLocked={isBidLocked(booking?.schedule?.date)}
          />
          <TopBidders bidders={topBidders} />
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column: Booking details */}
          <div>
            {/* Pickup and delivery locations */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Locations
              </h2>
              <div className="grid grid-cols-1 gap-4 mb-5">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <FaMapMarkerAlt className="text-red-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Pickup</p>
                      <p className="text-gray-800 font-medium whitespace-pre-line">
                        {booking.pickupLocation?.address ||
                          formatLocation(booking.pickup) ||
                          formatLocation(booking.pickupLocation) ||
                          "Pickup address not available"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <FaFlag className="text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">
                        Delivery
                      </p>
                      <p className="text-gray-800 font-medium whitespace-pre-line">
                        {booking.deliveryLocation?.address ||
                          formatLocation(booking.delivery) ||
                          formatLocation(booking.deliveryLocation) ||
                          formatLocation(booking.destination) ||
                          "Delivery address not available"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map view with corrected address passing */}
              <LocationMap
                pickup={
                  booking.pickupLocation?.address ||
                  formatLocation(booking.pickup) ||
                  formatLocation(booking.pickupLocation)
                }
                delivery={
                  booking.deliveryLocation?.address ||
                  formatLocation(booking.delivery) ||
                  formatLocation(booking.deliveryLocation) ||
                  formatLocation(booking.destination)
                }
              />
            </div>

            {/* Enhanced Shipment Details */}
            <ShipmentDetails booking={booking} />

            {/* Additional notes - if not already displayed in ShipmentDetails */}
            {booking.notes && !document.querySelector(".notes-section") && (
              <div className="bg-white rounded-xl shadow-sm p-6 notes-section">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaInfoCircle className="text-red-500" /> Additional Notes
                </h2>
                <p className="text-gray-700">{booking.notes}</p>
              </div>
            )}
          </div>

          {/* Right column: BidForm and TopBidders - Only show on larger screens */}
          <div className="hidden lg:block space-y-6">
            <BidForm
              booking={booking}
              currentBid={currentBid}
              onBidSubmit={handleSubmitBid}
              isLocked={isBidLocked(booking?.schedule?.date)}
            />
            <TopBidders bidders={topBidders} />
          </div>
        </div>
      </div>
      <AllBiddersModal
        isOpen={showAllBiddersModal}
        onClose={() => setShowAllBiddersModal(false)}
        bidders={topBidders}
      />
      <Toaster position="top-right" />
    </DashboardLayout>
  );
};

export default BookingDetails;