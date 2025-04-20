import { useState, useEffect } from "react";
import {
  FaUsers,
  FaMedal,
  FaCrown,
  FaStar,
  FaInfoCircle,
  FaTimes,
  FaChevronLeft,
  FaSort,
  FaSortAmountDown,
  FaSortAmountUp,
  FaSearch,
  FaFilter,
  FaUser,
} from "react-icons/fa";

/**
 * Modal component to display all bidders for a booking
 * @param {boolean} isOpen - Whether the modal is open or not
 * @param {function} onClose - Function to call when modal is closed
 * @param {array} bidders - Array of bidder objects
 */
const AllBiddersModal = ({ isOpen, onClose, bidders }) => {
  const [sortedBidders, setSortedBidders] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc"); // asc or desc
  const [search, setSearch] = useState("");
  const [driverId, setDriverId] = useState("");

  // Get the driver ID from localStorage on component mount
  useEffect(() => {
    setDriverId(localStorage.getItem("driverId"));
  }, []);

  // Set up listener for WebSocket bid updates
  useEffect(() => {
    if (!isOpen) return; // Only listen when modal is open

    const handleNewBid = (event) => {
      if (event.detail && event.detail.type === "new_bid") {
        const bidData = event.detail.payload;
        if (bidData && bidData.bid) {
          const newBid = {
            id: bidData.bid.id || Date.now().toString(),
            driverId: bidData.bid.driverId,
            amount: bidData.bid.amount,
            bidTime: bidData.bid.bidTime || new Date().toISOString(),
            isCurrentDriver: bidData.bid.driverId === driverId,
            driverRating: bidData.bid.driverRating || 4.5,
          };

          // Update bidders list with new bid
          setSortedBidders((prevBidders) => {
            // Check if this bid already exists
            const existingIndex = prevBidders.findIndex(
              (bid) => bid.driverId === newBid.driverId
            );

            if (existingIndex >= 0) {
              // Update existing bid
              const updatedBidders = [...prevBidders];
              updatedBidders[existingIndex] = {
                ...updatedBidders[existingIndex],
                amount: newBid.amount,
                bidTime: newBid.bidTime,
              };

              // Re-sort the bids
              return updatedBidders.sort((a, b) =>
                sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount
              );
            } else {
              // Add new bid and sort
              const newBidders = [...prevBidders, newBid];
              return newBidders.sort((a, b) =>
                sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount
              );
            }
          });
        }
      }
    };

    // Add event listener for WebSocket messages
    document.addEventListener("ws:message", handleNewBid);

    // Cleanup
    return () => {
      document.removeEventListener("ws:message", handleNewBid);
    };
  }, [driverId, sortOrder, isOpen]);

  // Filter and sort bidders based on current criteria
  useEffect(() => {
    if (!bidders || !bidders.length) {
      setSortedBidders([]);
      return;
    }

    // Clone the bidders array and add current driver indication
    const processedBidders = bidders.map((bid) => ({
      ...bid,
      isCurrentDriver:
        driverId && (bid.driverId === driverId || bid.isCurrentDriver),
      amount: bid.amount || bid.price,
    }));

    // Apply search filter if search term exists
    let filtered = processedBidders;
    if (search.trim()) {
      const searchLower = search.trim().toLowerCase();
      filtered = processedBidders.filter((bidder) => {
        // Search in various fields that might exist
        const searchableText = [
          bidder.name,
          bidder.driverName,
          bidder.amount?.toString(),
          bidder.driverRating?.toString(),
          bidder.isCurrentDriver ? "my bid your bid" : "", // Searchable keywords
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(searchLower);
      });
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.amount - b.amount;
      }
      return b.amount - a.amount;
    });

    // Mark the lowest bidder
    const withLowestMarked = sorted.map((bidder, index) => ({
      ...bidder,
      isLowestBid: sortOrder === "asc" ? index === 0 : false,
    }));

    setSortedBidders(withLowestMarked);
  }, [bidders, sortOrder, search, driverId]);

  // Prevent modal from rendering if not open
  if (!isOpen) return null;

  // Prevent body scrolling when modal is open
  document.body.style.overflow = "hidden";

  const handleClose = () => {
    document.body.style.overflow = "unset";
    onClose();
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return "";

    // Use a safer date parsing approach without try/catch
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleString("en-IN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button
              onClick={handleClose}
              className="text-white hover:text-red-100 transition-colors cursor-pointer"
            >
              <FaChevronLeft size={18} />
            </button>
            <h2 className="text-white text-xl font-bold flex items-center gap-2">
              <FaUsers /> All Bids ({bidders.length})
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:text-red-100 transition-colors cursor-pointer"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Search and Filters */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search box */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search bidders..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* Sort control */}
            <button
              onClick={toggleSortOrder}
              className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 cursor-pointer"
            >
              Sort:{" "}
              {sortOrder === "asc" ? (
                <>
                  <FaSortAmountDown className="text-gray-500" /> Lowest First
                </>
              ) : (
                <>
                  <FaSortAmountUp className="text-gray-500" /> Highest First
                </>
              )}
            </button>
          </div>
        </div>

        {/* Bidders list */}
        <div
          className="overflow-y-auto p-4"
          style={{ maxHeight: "calc(90vh - 180px)" }}
        >
          {sortedBidders.length === 0 ? (
            <div className="text-center p-8 text-gray-500">
              {search.trim()
                ? "No bidders match your search criteria"
                : "No bids have been placed yet"}
            </div>
          ) : (
            <div className="space-y-3">
              {sortedBidders.map((bidder, index) => (
                <div
                  key={bidder.id || index}
                  className={`p-4 rounded-lg flex items-center justify-between transition-all duration-200 ${
                    bidder.isCurrentDriver
                      ? "bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 shadow-sm"
                      : bidder.isLowestBid
                      ? "bg-gradient-to-r from-green-50 to-green-100 border border-green-200 shadow-sm"
                      : "bg-white border border-gray-200 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        index === 0
                          ? "bg-yellow-100 text-yellow-700"
                          : index === 1
                          ? "bg-gray-200 text-gray-700"
                          : index === 2
                          ? "bg-orange-100 text-orange-700"
                          : bidder.isCurrentDriver
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {index === 0 ? (
                        <FaCrown className="text-yellow-700 text-lg" />
                      ) : index === 1 ? (
                        <FaMedal className="text-gray-700" />
                      ) : bidder.isCurrentDriver ? (
                        <FaUser className="text-blue-700" />
                      ) : (
                        <span className="font-medium">{index + 1}</span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {bidder.isCurrentDriver
                            ? "Your Bid"
                            : "Anonymous Driver"}
                        </span>
                        {bidder.isLowestBid && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                            Lowest
                          </span>
                        )}
                        {bidder.isCurrentDriver && !bidder.isLowestBid && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                            Your Bid
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <div className="flex items-center">
                          <FaStar className="text-yellow-400 mr-1" />
                          <span>{bidder.driverRating || "4.5"}</span>
                          <span className="mx-1">•</span>
                          <span>
                            {formatDate(bidder.bidTime || bidder.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-gray-800">
                    ₹{bidder.amount.toLocaleString("en-IN")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with info */}
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <FaInfoCircle className="text-blue-500 mt-1 flex-shrink-0" />
            <div>
              <p>
                Bidding is enabled until 24 hours before the scheduled pickup
                time.
              </p>
              <p className="mt-1">
                Lower bids have higher chances of being selected by the
                customer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllBiddersModal;
