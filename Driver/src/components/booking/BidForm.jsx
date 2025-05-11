import React, { useState, useEffect } from "react";
import {
  FaRupeeSign,
  FaFileAlt,
  FaArrowRight,
  FaInfoCircle,
  FaCheck,
} from "react-icons/fa";
import PropTypes from "prop-types";

const BidForm = ({
  booking,
  currentBid,
  onBidSubmit,
  isLocked,
  onAcceptClick,
}) => {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const [touched, setTouched] = useState(false);

  // Populate form with current bid if exists
  useEffect(() => {
    if (currentBid) {
      setAmount(currentBid.amount || "");
      setNote(currentBid.note || "");
    }
  }, [currentBid]);

  // Get estimated price range from booking data with fallback
  const getEstimatedPrice = () => {
    if (!booking) return null;

    // Handle different formats of price data
    if (booking.estimatedPrice) {
      if (typeof booking.estimatedPrice === "object") {
        const min = booking.estimatedPrice.min;
        const max = booking.estimatedPrice.max;
        return { min, max };
      } else {
        // Single value
        const value = Number(booking.estimatedPrice);
        return { min: value * 0.9, max: value * 1.1 };
      }
    } else if (booking.priceRange) {
      if (typeof booking.priceRange === "object") {
        return {
          min: booking.priceRange.min,
          max: booking.priceRange.max,
        };
      } else {
        // Parse string like "₹1000 - ₹1200"
        const parts = booking.priceRange
          .replace(/[₹,]/g, "")
          .split("-")
          .map((p) => parseInt(p.trim()));
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          return { min: parts[0], max: parts[1] };
        }
      }
    }

    // Default fallback
    return { min: 1000, max: 2000 };
  };

  const priceRange = getEstimatedPrice();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Please enter a valid bid amount");
      return;
    }

    // Success handling
    setSuccess("Bid submitted successfully!");

    // Pass the bid data to parent component
    onBidSubmit({
      bookingId: booking._id || booking.id,
      amount: Number(amount),
      note: note,
    });

    setTimeout(() => {
      setSuccess("");
    }, 3000);
  };

  // Check if driver already has a bid on this booking
  const hasBid = currentBid && currentBid.amount > 0;

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        {hasBid ? "Your Bid" : "Place Your Bid"}
      </h2>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4">
          {success}
        </div>
      )}

      {isLocked ? (
        <div className="bg-yellow-50 p-4 rounded-lg mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaInfoCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Bidding Closed
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Bidding is no longer available for this booking as it's too
                  close to the pickup date.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Your Bid Amount (₹)
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaRupeeSign className="text-gray-400" />
              </div>
              <input
                type="number"
                name="amount"
                id="amount"
                className="focus:ring-red-500 focus:border-red-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
                placeholder="0"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setTouched(true);
                }}
                disabled={isLocked}
              />
            </div>
            {priceRange && (
              <p className="text-xs text-gray-500 mt-1">
                Suggested price range: ₹{priceRange.min} - ₹{priceRange.max}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="note"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Additional Notes (Optional)
            </label>
            <div className="mt-1">
              <textarea
                rows={3}
                name="note"
                id="note"
                className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Any special conditions or information you want to add to your bid..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                disabled={isLocked}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLocked}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                isLocked
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              }`}
            >
              {hasBid ? "Update Bid" : "Submit Bid"}
              <FaArrowRight className="ml-2" />
            </button>
          </div>
        </form>
      )}

      {/* Add Accept Booking button if driver has already placed a bid */}
      {hasBid && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={onAcceptClick}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
          >
            <FaCheck className="text-white" /> Accept Booking
          </button>
          <p className="text-xs text-gray-500 mt-2 text-center">
            By accepting this booking, you agree to fulfill the transportation
            requirements as specified.
          </p>
        </div>
      )}
    </div>
  );
};

BidForm.propTypes = {
  booking: PropTypes.object.isRequired,
  currentBid: PropTypes.object,
  onBidSubmit: PropTypes.func.isRequired,
  isLocked: PropTypes.bool,
  onAcceptClick: PropTypes.func,
};

export default BidForm;
