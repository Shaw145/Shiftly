import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa";
import CancelConfirmationModal from "../components/myBookings/CancelConfirmationModal";
import DriverConfirmationModal from "../components/myBookings/DriverConfirmationModal";
//import { format, differenceInHours } from "date-fns";
import ShipmentTracker from "../components/tracking/ShipmentTracker";
//import LiveTrackingButton from "../components/tracking/LiveTrackingButton";
import Header from "../components/bookingDetails/Header";
import PendingBookingSection from "../components/bookingDetails/PendingBookingSection";
import AddressSection from "../components/bookingDetails/AddressSection";
import ScheduleSection from "../components/bookingDetails/ScheduleSection";
import GoodsSection from "../components/bookingDetails/GoodsSection";
import TransportSection from "../components/bookingDetails/TransportSection";
import PriceDetailsCard from "../components/bookingDetails/PriceDetailsCard";
import DriverDetailsCard from "../components/bookingDetails/DriverDetailsCard";
import { useWebSocket } from "../context/WebSocketContext";
import { toast } from "react-hot-toast";

/**
 * @typedef {Object} DriverBid
 * @property {string} id
 * @property {string} name
 * @property {number} price
 * @property {number} rating
 * @property {number} trips
 * @property {string} vehicle
 * @property {string} [image]
 * @property {Date} bidTime
 * @property {'pending' | 'accepted' | 'rejected'} status
 */

const BookingDetailPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [error, setError] = useState(null);
  const { on, isConnected } = useWebSocket();

  /** @type {[DriverBid[], Function]} */
  const [driverBids, setDriverBids] = useState([]);

  // Handle real-time bid updates via WebSocket
  useEffect(() => {
    if (!isConnected || !bookingId) return;

    // Listen for new bid events
    const unsubscribe = on("new_bid", (data) => {
      // console.log("Received new bid via WebSocket:", data);

      // Make sure the bid is for the current booking
      if (data.bookingId === bookingId) {
        // Update driver bids list with the new bid
        setDriverBids((prevBids) => {
          // Check if the bid already exists (from same driver)
          const existingBidIndex = prevBids.findIndex(
            (bid) => bid.driverId === data.bid.driverId
          );

          if (existingBidIndex >= 0) {
            // Update existing bid
            const updatedBids = [...prevBids];
            updatedBids[existingBidIndex] = {
              ...updatedBids[existingBidIndex],
              ...data.bid,
            };
            return updatedBids;
          } else {
            // Add new bid
            return [...prevBids, data.bid];
          }
        });

        // Show a notification
        toast.success("A driver has placed a new bid!", {
          icon: "🔔",
          duration: 5000,
        });
      }
    });

    // Listen for bid updates
    const unsubscribeBidUpdates = on("bid_updated", (data) => {
      // console.log("Received bid update via WebSocket:", data);

      // Make sure the update is for the current booking
      if (data.bookingId === bookingId) {
        // Update driver bids list with the updated bid info
        setDriverBids((prevBids) =>
          prevBids.map((bid) =>
            bid.driverId === data.bid.driverId ? { ...bid, ...data.bid } : bid
          )
        );

        // Show notification
        toast.success("A driver has updated their bid!", {
          icon: "📝",
          duration: 5000,
        });
      }
    });

    return () => {
      unsubscribe();
      unsubscribeBidUpdates();
    };
  }, [bookingId, isConnected, on]);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        if (!bookingId) {
          throw new Error("No booking ID provided");
        }

        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/bookings/find/${bookingId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Log the raw response for debugging
        const responseText = await response.text();

        let data;
        try {
          data = JSON.parse(responseText);
        } catch (e) {
          console.error("Error parsing response:", e);
          throw new Error("Invalid response from server");
        }

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch booking details");
        }

        if (!data.booking) {
          throw new Error("No booking data received");
        }

        // Ensure the booking has the correct ID format and driver details
        const bookingData = {
          ...data.booking,
          bookingId: data.booking.bookingId || bookingId,
          driver: data.booking.driverId || {
            name: "Test Driver",
            vehicle: "Tata Ace",
            rating: 4.5,
            trips: 150,
          },
          payment: data.booking.payment,
        };

        setBooking(bookingData);

        // Load bids for the booking
        await fetchDriverBids(bookingId, token);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching booking details:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  // Fetch driver bids for the booking - with better error handling
  const fetchDriverBids = async (bookingId, token) => {
    try {
      console.log(`Fetching bids for booking: ${bookingId}`);

      // Try to fetch bids from the proper API endpoint
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/bids/booking/${bookingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check if we got a valid response
      if (!response.ok) {
        console.warn(
          `Error fetching bids from main endpoint: ${response.status} ${response.statusText}`
        );

        // Try the alternative endpoint
        const fallbackResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/bookings/${bookingId}/bids`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!fallbackResponse.ok) {
          console.warn(
            `Error fetching bids from fallback endpoint: ${fallbackResponse.status} ${fallbackResponse.statusText}`
          );
          return false;
        }

        const fallbackData = await fallbackResponse.json();
        console.log("Bid API fallback response:", fallbackData);

        if (fallbackData.success) {
          if (fallbackData.bids && fallbackData.bids.length > 0) {
            console.log(
              `Found ${fallbackData.bids.length} bids from fallback API`
            );

            // Process bids to ensure they have consistent properties
            const processedBids = fallbackData.bids.map((bid) => ({
              ...bid,
              id: bid.id || bid._id,
              amount: bid.amount || bid.price,
              name: bid.name || "Driver",
              rating: bid.rating || 4.5,
              trips: bid.trips || 0,
              vehicle: bid.vehicle || "Transport Vehicle",
              bidTime: new Date(bid.bidTime || bid.createdAt || new Date()),
              status: bid.status || "pending",
            }));

            setDriverBids(processedBids);
            return true;
          }
        }

        return false;
      }

      const data = await response.json();
      console.log("Bid API primary response:", data);

      if (data.success) {
        let bidsData = [];

        // Handle different response structures
        if (data.data && Array.isArray(data.data)) {
          bidsData = data.data;
        } else if (data.bids && Array.isArray(data.bids)) {
          bidsData = data.bids;
        } else if (Array.isArray(data)) {
          bidsData = data;
        }

        if (bidsData.length > 0) {
          console.log(`Found ${bidsData.length} bids from API`);

          // Process bids to ensure they have consistent properties
          const processedBids = bidsData.map((bid) => ({
            ...bid,
            id: bid.id || bid._id,
            amount: bid.amount || bid.price,
            name: bid.name || "Driver",
            rating: bid.rating || 4.5,
            trips: bid.trips || 0,
            vehicle: bid.vehicle || "Transport Vehicle",
            bidTime: new Date(bid.bidTime || bid.createdAt || new Date()),
            status: bid.status || "pending",
          }));

          setDriverBids(processedBids);
          return true;
        } else {
          console.log("No bids found from API");
          return false;
        }
      } else {
        console.error("API Error:", data.message || "Unknown error");
        return false;
      }
    } catch (error) {
      console.error("Error fetching driver bids:", error);
      return false;
    }
  };

  // Add an effect to refresh bids when returning to the page
  useEffect(() => {
    // This will run when the component mounts or when the URL changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && bookingId) {
        console.log("Page is now visible, refreshing bids");
        fetchDriverBids(bookingId, localStorage.getItem("token"));
      }
    };

    // Listen for visibility changes (when user returns from payment page)
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Also refresh bids if we return via browser history
    window.addEventListener("popstate", () => {
      if (bookingId) {
        console.log("User navigated back, refreshing bids");
        fetchDriverBids(bookingId, localStorage.getItem("token"));
      }
    });

    // Clean up
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("popstate", handleVisibilityChange);
    };
  }, [bookingId]);

  useEffect(() => {
    // Check for status and message in URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get("status");
    const message = urlParams.get("message");

    if (status === "failed" && message) {
      // Show toast message
      const toast = document.createElement("div");
      toast.className =
        "fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50";
      toast.textContent = decodeURIComponent(message);
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);

      // Clean up the URL
      window.history.replaceState({}, "", `/my-bookings/${bookingId}`);
    }
  }, [bookingId]);

  const handleCancelBooking = async () => {
    setCancelling(true);
    setCancelError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/bookings/${bookingId}/cancel`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            reason: cancelReason || "Cancelled by user",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to cancel booking");
      }

      setBooking(data.booking);
      setShowCancelModal(false);

      // Show success toast
      const successToast = document.createElement("div");
      successToast.className =
        "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2";
      successToast.innerHTML = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span>Booking cancelled successfully</span>
      `;
      document.body.appendChild(successToast);

      setTimeout(() => {
        successToast.remove();
      }, 3000);
    } catch (error) {
      // Show error toast
      const errorToast = document.createElement("div");
      errorToast.className =
        "fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2";
      errorToast.innerHTML = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
        <span>${error.message}</span>
      `;
      document.body.appendChild(errorToast);

      setTimeout(() => {
        errorToast.remove();
      }, 3000);
    } finally {
      setCancelling(false);
    }
  };

  const handleDriverSelect = (driver) => {
    setSelectedDriver(driver);
    setShowDriverModal(true);
  };

  const handleDriverConfirm = async (data) => {
    setShowDriverModal(false);
    navigate(`/payment/${booking.bookingId}`, {
      state: {
        paymentToken: data.paymentToken,
        booking: {
          ...booking,
          bookingId: booking.bookingId,
        },
        driver: {
          ...selectedDriver,
          _id: selectedDriver.id,
        },
      },
      replace: true,
    });
  };

  if (loading) {
    return (
      <div className="flex-1 p-4 lg:pl-72 mt-20">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex-1 p-4 lg:ml-24 mt-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Booking Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The booking you&apos;re looking for doesn&apos;t exist.
          </p>
          {error && <p className="text-red-500 text-sm">Error: {error}</p>}
          <button
            onClick={() => navigate("/my-bookings")}
            className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer"
          >
            Go Back to My Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 mt-20 md:ml-22 lg:ml-24">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Back button */}
        <button
          onClick={() => navigate("/my-bookings")}
          className="flex items-center gap-2 text-gray-600 hover:text-red-600 mb-5 cursor-pointer"
        >
          <FaChevronLeft /> Back to My Bookings
        </button>

        {/* Header */}
        <Header
          booking={booking}
          onCancelClick={() => setShowCancelModal(true)}
        />

        {/* Shipment Status for confirmed bookings */}
        {booking.status === "confirmed" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ShipmentTracker booking={booking} />
            </div>
            <DriverDetailsCard booking={booking} />
          </div>
        )}

        {/* Pending Booking Section */}
        {booking.status === "pending" && (
          <PendingBookingSection
            booking={booking}
            driverBids={driverBids}
            onDriverSelect={handleDriverSelect}
          />
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6">
          <AddressSection booking={booking} />
          <ScheduleSection booking={booking} />
          <GoodsSection booking={booking} />
          <TransportSection booking={booking} />
          <PriceDetailsCard booking={booking} />
        </div>

        {/* Modals */}
        <CancelConfirmationModal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          onConfirm={handleCancelBooking}
          loading={cancelling}
          reason={cancelReason}
          setReason={setCancelReason}
        />

        <DriverConfirmationModal
          isOpen={showDriverModal}
          onClose={() => setShowDriverModal(false)}
          driver={selectedDriver}
          booking={booking}
          onConfirm={handleDriverConfirm}
        />
      </div>
    </div>
  );
};

export default BookingDetailPage;
