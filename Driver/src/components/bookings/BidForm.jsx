import { useState, useEffect } from "react";
import {
  FaMoneyBillWave,
  FaInfoCircle,
  FaCheck,
  FaEdit,
  FaLock,
  FaHistory,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

const BidForm = ({ booking, currentBid, onSubmitBid, isBidLocked }) => {
  const [bidAmount, setBidAmount] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(!currentBid);

  useEffect(() => {
    if (currentBid) {
      setBidAmount(currentBid.amount.toString());
      setNote(currentBid.note || "");
      setIsEditing(false);
    } else {
      setBidAmount(
        Math.floor(
          (booking.priceRange.min + booking.priceRange.max) / 2
        ).toString()
      );
      setIsEditing(true);
    }
  }, [booking, currentBid]);

  const handleBidSubmit = async () => {
    const numericBidAmount = bidAmount ? parseInt(bidAmount, 10) : 0;

    if (
      !bidAmount ||
      numericBidAmount < booking.priceRange.min ||
      numericBidAmount > booking.priceRange.max
    ) {
      toast.error(
        `Bid must be between ₹${booking.priceRange.min} and ₹${booking.priceRange.max}`,
        {
          duration: 4000,
          position: "top-center",
        }
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmitBid(numericBidAmount, note);
      toast.success(
        currentBid
          ? "Your bid has been updated successfully!"
          : "Your bid has been submitted successfully!",
        {
          duration: 4000,
          position: "top-center",
        }
      );
      setIsEditing(false);
    } catch (error) {
      toast.error("There was an error submitting your bid. Please try again.", {
        duration: 4000,
        position: "top-center",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isBidLocked) {
    return (
      <div className="bg-orange-50 border-2 border-orange-100 rounded-xl p-6 sticky top-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
            <FaLock className="text-orange-500" />
          </div>
          <h3 className="text-lg font-medium text-orange-800">
            Bidding Locked
          </h3>
        </div>
        <p className="text-orange-700 mb-4">
          Bidding is locked as the pickup date is less than 24 hours away. You
          can no longer place or modify bids for this booking.
        </p>

        {currentBid ? (
          <div className="bg-white rounded-lg p-4 border border-orange-200">
            <div className="text-sm text-gray-500 mb-1">Your current bid:</div>
            <div className="text-2xl font-bold text-gray-800 mb-2">
              ₹{currentBid.amount}
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-1 mb-3">
              <FaHistory /> Submitted on {formatDate(currentBid.createdAt)}
            </div>
            {currentBid.note && (
              <div className="border-t border-gray-100 pt-3 mt-3">
                <div className="text-sm text-gray-700">{currentBid.note}</div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-orange-700 text-center p-4 bg-white rounded-lg border border-orange-200">
            You have not placed a bid for this booking.
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"></div>
      {!isEditing && currentBid ? (
        // Current Bid View
        <div className="relative">
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-green-100 rounded-full opacity-50 blur-xl"></div>
          <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-blue-100 rounded-full opacity-50 blur-xl"></div>

          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
              <FaCheck className="text-green-500" /> Your Bid
            </h3>
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-700 transition-all flex items-center gap-1 text-sm font-medium cursor-pointer"
              disabled={isBidLocked}
            >
              <FaEdit className="text-xs" /> Edit Bid
            </button>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border border-green-100 mb-4">
            <div className="text-sm text-gray-600 mb-1">Your bid amount:</div>
            <div className="text-2xl font-bold text-gray-800 mb-1">
              ₹{currentBid.amount}
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <FaHistory /> Last updated: {formatDate(currentBid.createdAt)}
            </div>
          </div>

          {currentBid.note && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Your Note:
              </h4>
              <div className="p-3 bg-gray-50 rounded-lg text-gray-700 text-sm">
                {currentBid.note}
              </div>
            </div>
          )}

          <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-800 mb-4">
            <h4 className="font-medium flex items-center gap-1 mb-1">
              <FaInfoCircle /> Bidding Information
            </h4>
            <ul className="list-disc ml-5 space-y-1 text-blue-700">
              <li>You can update your bid until 24 hours before pickup</li>
              <li>Lower bids have a higher chance of being selected</li>
              <li>Customer will be notified when you place/update a bid</li>
            </ul>
          </div>
        </div>
      ) : (
        // Edit Bid Form
        <div className="relative">
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-red-100 rounded-full opacity-50 blur-xl"></div>
          <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-orange-100 rounded-full opacity-50 blur-xl"></div>

          <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
            <FaMoneyBillWave className="text-red-500" />{" "}
            {currentBid ? "Update Your Bid" : "Place Your Bid"}
          </h3>

          {/* Price Range Card */}
          <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
            <h4 className="text-sm font-medium text-gray-600 mb-3">
              Price Range:
            </h4>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-1">Minimum</div>
                <div className="text-xl font-bold text-green-600">
                  ₹{booking.priceRange.min}
                </div>
              </div>
              <div className="h-px w-16 bg-gradient-to-r from-green-500 to-red-500"></div>
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-1">Maximum</div>
                <div className="text-xl font-bold text-red-600">
                  ₹{booking.priceRange.max}
                </div>
              </div>
            </div>
          </div>

          {/* Bid Amount Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Bid Amount
            </label>
            <div className="relative">
              <input
                type="text"
                value={bidAmount}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setBidAmount(value);
                }}
                className="block w-full px-4 py-3 text-2xl font-bold text-gray-700 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all appearance-none"
                placeholder="Enter bid amount"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <span className="text-gray-500">INR</span>
              </div>
            </div>

            {/* Bid Range Indicator */}
            <div className="mt-4">
              <div className="mb-2 flex justify-between items-center">
                <span className="text-xs font-medium text-green-600">
                  Best Value
                </span>
                <span className="text-xs font-medium text-red-600">
                  Higher Price
                </span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full transition-all duration-300 relative"
                  style={{
                    width: `${
                      bidAmount
                        ? ((parseInt(bidAmount, 10) - booking.priceRange.min) /
                            (booking.priceRange.max - booking.priceRange.min)) *
                          100
                        : 0
                    }%`,
                    background: `linear-gradient(90deg, #4ade80 0%, #fbbf24 50%, #ef4444 100%)`,
                  }}
                >
                  <span className="absolute right-0 top-0 h-full w-2 bg-white rounded-full shadow-md transform translate-x-1/2"></span>
                </div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-600">
                <span>₹{booking.priceRange.min}</span>
                <span>₹{booking.priceRange.max}</span>
              </div>
            </div>
          </div>

          {/* Add Note */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Note (Optional)
            </label>
            <textarea
              rows="3"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-2 border-gray-300 rounded-md p-2"
              placeholder="Any special conditions or notes about your bid..."
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleBidSubmit}
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-xl text-white font-medium flex items-center justify-center gap-2 ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 cursor-pointer"
            }`}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <FaMoneyBillWave /> {currentBid ? "Update Bid" : "Submit Bid"}
              </>
            )}
          </button>

          {/* Bid guidelines */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
            <h4 className="font-medium flex items-center gap-1 mb-1">
              <FaInfoCircle /> Bidding Guidelines
            </h4>
            <ul className="list-disc ml-5 space-y-1 text-blue-700">
              <li>Your bid must be within the customer's price range</li>
              <li>
                You can update your bid anytime until 24 hours before pickup
              </li>
              <li>
                Lower bids typically have a higher chance of being selected
              </li>
              <li>If your bid is accepted, you'll be notified right away</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default BidForm;
