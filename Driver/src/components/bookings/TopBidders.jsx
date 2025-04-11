import React from "react";
import {
  FaUsers,
  FaMedal,
  FaCrown,
  FaStar,
  FaInfoCircle,
  FaChevronRight,
} from "react-icons/fa";

const TopBidders = ({ bidders }) => {
  if (!bidders || bidders.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
          <FaUsers className="text-red-500" /> Current Top Bidders
        </h3>
        <button className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer">
          View All <FaChevronRight className="text-xs" />
        </button>
      </div>

      <div className="space-y-3">
        {bidders.slice(0, 5).map((bidder, index) => (
          <div
            key={bidder.id}
            className={`p-3 rounded-lg flex items-center justify-between transition-all duration-200 hover:shadow-md ${
              bidder.isLowestBid
                ? "bg-gradient-to-r from-green-50 to-green-100 border border-green-200"
                : bidder.isCurrentDriver
                ? "bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200"
                : "bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index === 0
                    ? "bg-yellow-100 text-yellow-700"
                    : index === 1
                    ? "bg-gray-200 text-gray-700"
                    : index === 2
                    ? "bg-orange-100 text-orange-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {index === 0 ? (
                  <FaCrown className="text-yellow-700" />
                ) : index === 1 ? (
                  <FaMedal className="text-gray-700" />
                ) : (
                  index + 1
                )}
              </div>
              <div>
                <div className="flex items-center gap-1 text-sm">
                  {bidder.isCurrentDriver ? "Your Bid" : "Anonymous Driver"}
                  {bidder.isLowestBid && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                      Lowest
                    </span>
                  )}
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <FaStar className="text-yellow-400 mr-1" />{" "}
                  {bidder.driverRating} Rating
                </div>
              </div>
            </div>
            <div className="text-lg font-bold">₹{bidder.amount}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
        <p className="flex items-center gap-1">
          <FaInfoCircle className="text-blue-500" />
          These are the current top bids for this booking. Lower bids have
          higher chances of being selected.
        </p>
      </div>
    </div>
  );
};

export default TopBidders;
