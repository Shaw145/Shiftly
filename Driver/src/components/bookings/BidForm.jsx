import React, { useState, useEffect } from "react";
import {
  FaMoneyBillWave,
  FaInfoCircle,
  FaCheck,
  FaEdit,
  FaLock,
  FaHistory,
  FaExclamationTriangle,
  FaWifi,
  FaRupeeSign,
  FaSync,
  FaBell,
  FaClock,
  FaUser,
  FaThumbsUp,
  FaExclamationCircle,
} from "react-icons/fa";
import { useWebSocket } from "../../context/WebSocketContext";
import { toast } from "react-hot-toast";

/**
 * Component for placing and updating bids on bookings
 * @param {Object} booking - The booking object
 * @param {Object} currentBid - The driver's current bid on this booking, if any
 * @param {Function} onBidSubmit - Callback function when bid is submitted
 * @param {Boolean} isLocked - Whether bidding is locked (24h before pickup)
 */
const BidForm = ({ booking, currentBid, onBidSubmit, isLocked = false }) => {
  const { isConnected, placeBid } = useWebSocket();
  const [bidAmount, setBidAmount] = useState("");
  const [bidNote, setBidNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [offlineMode, setOfflineMode] = useState(!isConnected);
  const [lastBid, setLastBid] = useState(null);

  // Load last bid from localStorage if exists
  useEffect(() => {
    // Check localStorage for previous bid on this booking
    try {
      const storedBids = JSON.parse(localStorage.getItem("driverBids") || "{}");
      const bookingId = booking._id || booking.id || booking.bookingId;

      if (bookingId && storedBids[bookingId]) {
        const storedBid = storedBids[bookingId];
        setLastBid(storedBid);

        // If no current bid is set through props, use the stored bid as initial value
        if (!currentBid && storedBid) {
          if (storedBid.amount) {
            setBidAmount(storedBid.amount);
          }
          if (storedBid.note) {
            setBidNote(storedBid.note);
          }
        }
      }
    } catch (error) {
      console.error("Error reading stored bids:", error);
    }
  }, [booking, currentBid]);

  // Update offline mode state when connection changes
  useEffect(() => {
    setOfflineMode(!isConnected);
  }, [isConnected]);

  // Set initial bid amount from current bid if exists
  useEffect(() => {
    if (currentBid && currentBid.amount) {
      setBidAmount(currentBid.amount);
    }
    if (currentBid && currentBid.note) {
      setBidNote(currentBid.note);
    }
  }, [currentBid]);

  // Add this useEffect to BidForm to listen for bid updates directly
  useEffect(() => {
    // Handler for real-time bid updates
    const handleBidUpdate = (event) => {
      const data = event.detail;

      // Make sure we have the right bid for this booking
      if (
        data &&
        data.bookingId === (booking._id || booking.id || booking.bookingId)
      ) {
        const bidData = data.bid;
        const currentDriverId = localStorage.getItem("driverId");

        // Only update if it's our own bid
        if (bidData && bidData.driverId === currentDriverId) {
          // console.log("BidForm received a bid update event:", bidData);

          // Update the form values with the new bid data
          setBidAmount(bidData.amount);
          if (bidData.note) {
            setBidNote(bidData.note);
          }

          // Update the lastBid state to refresh the "Your Current Bid" section
          setLastBid(bidData);
        }
      }
    };

    // Listen for both custom events
    document.addEventListener("bid:update", handleBidUpdate);
    document.addEventListener("ws:message", (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "bid_update" || data.type === "new_bid") {
          handleBidUpdate({ detail: data });
        }
      } catch (err) {
        // Ignore parsing errors
      }
    });

    return () => {
      document.removeEventListener("bid:update", handleBidUpdate);
      document.removeEventListener("ws:message", handleBidUpdate);
    };
  }, [booking]);

  // If bidding is locked, show message
  if (isLocked) {
    return (
      <div className="bg-orange-50 text-orange-600 rounded-xl p-5 mb-4 border border-orange-200 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-orange-100 p-2 rounded-full">
            <FaLock className="text-xl text-orange-500" />
          </div>
          <h3 className="text-lg font-medium">Bidding Locked</h3>
        </div>
        <p className="ml-10 text-orange-700">
          Bids can only be placed more than 24 hours before the scheduled pickup
          time. Contact support if you need assistance.
        </p>
      </div>
    );
  }

  // Update the handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const amount = parseFloat(bidAmount);

      // Validate bid amount
      if (booking.priceRange) {
        const { min, max } = booking.priceRange;
        if (amount < min || amount > max) {
          toast.error(`Bid amount must be between ₹${min} and ₹${max}`);
          setIsSubmitting(false);
          return;
        }
      }

      if (isConnected) {
        const response = await placeBid(booking._id, amount, bidNote);

        if (response.success) {
          // Create a complete bid object
          const newBid = {
            amount: amount,
            note: bidNote,
            bidTime: new Date().toISOString(),
            driverId: localStorage.getItem("driverId"),
            status: "pending",
          };

          // Store in localStorage
          const storedBids = JSON.parse(
            localStorage.getItem("driverBids") || "{}"
          );
          storedBids[booking._id] = newBid;
          localStorage.setItem("driverBids", JSON.stringify(storedBids));

          // Show success message
          toast.success("Bid placed successfully");

          // Dispatch bid:update event for real-time updates
          document.dispatchEvent(
            new CustomEvent("bid:update", {
              detail: {
                bookingId: booking._id,
                bid: newBid,
              },
            })
          );

          // Call parent's onBidSubmit
          if (onBidSubmit) onBidSubmit(newBid);
        } else {
          toast.error(response.error || "Failed to place bid");
        }
      } else {
        toast.error("Not connected to server. Please check your connection.");
      }
    } catch (error) {
      console.error("Error submitting bid:", error);
      toast.error(error.message || "Failed to submit bid");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to attempt reconnection
  const attemptReconnect = () => {
    // We'll use window reload as a simple way to reconnect
    window.location.reload();
  };

  // Get the price range display
  const getPriceRangeDisplay = () => {
    const minPrice =
      booking.priceRange?.min || booking.estimatedPrice?.min || 0;
    const maxPrice = booking.priceRange?.max || booking.estimatedPrice?.max;

    if (minPrice && maxPrice) {
      return `₹${minPrice.toLocaleString("en-IN")} - ₹${maxPrice.toLocaleString(
        "en-IN"
      )}`;
    } else if (minPrice) {
      return `Min: ₹${minPrice.toLocaleString("en-IN")}`;
    } else if (maxPrice) {
      return `Max: ₹${maxPrice.toLocaleString("en-IN")}`;
    }

    return "Price range not available";
  };

  // Determine which bid to display (current bid takes precedence, then lastBid from localStorage)
  const displayBid = currentBid || lastBid;

  useEffect(() => {
    const fetchCurrentBid = async () => {
      if (!booking || !booking._id) return;

      const driverToken = localStorage.getItem("driverToken");
      if (!driverToken) return;

      try {
        const bookingId = booking._id || booking.id || booking.bookingId;
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/bids/driver/booking/${bookingId}/current`,
          {
            headers: {
              Authorization: `Bearer ${driverToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            // Update form with fetched bid
            setBidAmount(data.data.amount);
            if (data.data.notes) {
              setBidNote(data.data.notes);
            }
            setLastBid(data.data);
          }
        }
      } catch (error) {
        console.error("Error fetching current bid:", error);
      }
    };

    fetchCurrentBid();
  }, [booking]);

  return (
    <div className={isLocked ? "opacity-50 pointer-events-none" : ""}>
      {/* Enhanced Current Bid Information */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5 mb-5 border border-gray-200 shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <div className="bg-indigo-100 p-2 rounded-full">
            <FaMoneyBillWave className="text-indigo-500" />
          </div>
          <span>Your Current Bid</span>
        </h2>

        {displayBid?.amount ? (
          <div className="ml-9">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-800">
                ₹{displayBid.amount.toLocaleString("en-IN")}
              </span>
              {displayBid?.isOffline && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                  Offline mode
                </span>
              )}
            </div>
            <div className="flex items-center mt-1">
              <div className="text-sm text-gray-600 flex items-center gap-1">
                <FaCheck className="text-green-500" />
                <span>
                  You can update your bid until 24 hours before the pickup time
                </span>
              </div>
            </div>
            {displayBid.note && (
              <div className="mt-2 bg-white p-2 rounded-md text-sm text-gray-700 border border-gray-200">
                <span className="font-medium">Note:</span> {displayBid.note}
              </div>
            )}
          </div>
        ) : (
          <div className="ml-9 flex items-center">
            <div className="text-lg font-semibold text-gray-500">
              No bid placed yet
            </div>
          </div>
        )}
      </div>

      {/* Price Range Card */}
      {(booking.priceRange || booking.estimatedPrice) && (
        <div className="mb-5 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-gray-200 p-1.5 rounded-full">
              <FaMoneyBillWave className="text-gray-700" />
            </div>
            <h3 className="font-medium text-gray-800">Suggested Price Range</h3>
          </div>
          <div className="ml-9 flex items-center">
            <div className="text-2xl font-bold text-gray-800">
              {getPriceRangeDisplay()}
            </div>
          </div>
        </div>
      )}

      {/* Bid Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm mb-5"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FaMoneyBillWave className="text-red-500" />
          {displayBid ? "Update Your Bid" : "Place Your Bid"}
        </h3>

        <div className="mb-4">
          <label
            htmlFor="bidAmount"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Bid Amount (₹)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaRupeeSign className="text-gray-400" />
            </div>
            <input
              type="number"
              id="bidAmount"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              className="w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 cursor-text text-lg"
              placeholder="Enter your bid amount"
              min="1"
              required
              aria-label="Bid amount in Indian Rupees"
            />
          </div>

          {/* Connection warning only if disconnected */}
          {!isConnected && (
            <div className="flex items-center justify-between mt-2">
              <div className="text-xs text-red-600 flex items-center gap-1">
                <FaWifi className="inline-block" /> Disconnected from server
              </div>
              <button
                type="button"
                onClick={attemptReconnect}
                className="text-xs text-red-600 flex items-center gap-1 hover:text-red-700 cursor-pointer"
              >
                <FaSync className="inline-block" /> Reconnect
              </button>
            </div>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="bidNote"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Note (Optional)
          </label>
          <textarea
            id="bidNote"
            value={bidNote}
            onChange={(e) => setBidNote(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 cursor-text"
            placeholder="Add any additional information about your bid"
            rows="2"
            aria-label="Bid note"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors cursor-pointer flex items-center justify-center gap-2 ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : offlineMode
              ? "bg-orange-500 hover:bg-orange-600"
              : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-md"
          }`}
          aria-label={isSubmitting ? "Submitting bid" : "Submit bid"}
        >
          {isSubmitting ? (
            <>
              <FaSync className="animate-spin" /> Processing...
            </>
          ) : displayBid ? (
            <>
              <FaEdit /> Update Bid {offlineMode ? "(Offline Mode)" : ""}
            </>
          ) : (
            <>
              <FaMoneyBillWave /> Submit Bid{" "}
              {offlineMode ? "(Offline Mode)" : ""}
            </>
          )}
        </button>

        {offlineMode && (
          <p className="text-xs text-orange-600 mt-2 flex items-center gap-1">
            <FaWifi className="text-xs" />
            You are currently offline. Your bid will be saved locally and
            submitted when your connection is restored.
          </p>
        )}
      </form>

      {/* Bidding Information Card */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-5 border border-gray-200 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <FaInfoCircle className="text-blue-500" /> Bidding Information
        </h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-2 text-sm text-gray-700">
            <FaClock className="text-blue-500 mt-1 flex-shrink-0" />
            <span>You can update your bid until 24 hours before pickup</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-gray-700">
            <FaThumbsUp className="text-blue-500 mt-1 flex-shrink-0" />
            <span>Lower bids have a higher chance of being selected</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-gray-700">
            <FaBell className="text-blue-500 mt-1 flex-shrink-0" />
            <span>Customer will be notified when you place/update a bid</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-gray-700 font-medium">
            <FaExclamationCircle className="text-red-500 mt-1 flex-shrink-0" />
            <span>
              You must be 100% sure about the shipment before submitting any bid
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BidForm;
