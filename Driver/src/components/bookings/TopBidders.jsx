import { useState, useEffect } from "react";
import {
  FaUsers,
  FaMedal,
  FaCrown,
  FaStar,
  FaInfoCircle,
  FaChevronRight,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaList,
  FaSortAmountDown,
  FaSortAmountUp,
  FaFilter,
  FaUser,
} from "react-icons/fa";
import AllBiddersModal from "./AllBiddersModal";

/**
 * Displays a single bidder item in the list
 * @param {Object} bidder - The bidder data object
 * @param {Number} index - The index of the bidder in the sorted list
 */
const BidderItem = ({ bidder, index }) => (
  <div
    className={`p-3 sm:p-4 mb-3 rounded-lg flex items-center justify-between transition-all duration-200 hover:shadow-md ${
      bidder.isLowestBid
        ? "bg-gradient-to-r from-green-50 to-green-100 border border-green-200"
        : bidder.isCurrentDriver
        ? "bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200"
        : "bg-white border border-gray-200"
    }`}
  >
    <div className="flex items-center gap-2 sm:gap-3">
      <div
        className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center ${
          index === 0
            ? "bg-yellow-100 text-yellow-700"
            : index === 1
            ? "bg-gray-200 text-gray-700"
            : index === 2
            ? "bg-orange-100 text-orange-700"
            : bidder.isCurrentDriver
            ? "bg-blue-100 text-blue-700"
            : "bg-gray-100 text-gray-700"
        }`}
      >
        {index === 0 ? (
          <FaCrown className="text-yellow-700 text-xs sm:text-sm" />
        ) : index === 1 ? (
          <FaMedal className="text-gray-700 text-xs sm:text-sm" />
        ) : bidder.isCurrentDriver ? (
          <FaUser className="text-blue-700 text-xs sm:text-sm" />
        ) : (
          index + 1
        )}
      </div>
      <div>
        <div className="flex items-center gap-1 text-xs sm:text-sm">
          {bidder.isCurrentDriver ? "Your Bid" : "Anonymous Driver"}
          {bidder.isLowestBid && (
            <span className="px-1 sm:px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
              Lowest
            </span>
          )}
        </div>
        <div className="flex items-center text-xs text-gray-500">
          <FaStar className="text-yellow-400 mr-1" />{" "}
          {bidder.driverRating || "4.5"} Rating
          {bidder.bidTime && (
            <span className="ml-2 text-gray-400">
              •{" "}
              {new Date(bidder.bidTime).toLocaleString("en-IN", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>
      </div>
    </div>
    <div className="text-base sm:text-lg font-bold">
      ₹{bidder.amount || bidder.price}
    </div>
  </div>
);

/**
 * Enhanced TopBidders component with sorting and filtering functionality
 *
 * @param {Object} props Component props
 * @param {Array} props.bidders Array of bidder objects
 * @param {string} props.title Title for the bidders list section
 * @param {string} props.className Additional class names for the container
 */
const TopBidders = ({
  bidders = [],
  title = "Top Bidders",
  className = "",
}) => {
  const [sortedBidders, setSortedBidders] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc"); // asc or desc
  const [showAll, setShowAll] = useState(false);
  const [showAllBiddersModal, setShowAllBiddersModal] = useState(false);
  const DEFAULT_DISPLAY_COUNT = 5;

  // Get the driver ID from localStorage
  const driverId = localStorage.getItem("driverId");

  // Set up listener for WebSocket bid updates
  useEffect(() => {
    // Function to process and update bid data
    const processBidData = (bidData) => {
      if (!bidData || !bidData.driverId) return;

      // console.log("Processing bid in TopBidders:", bidData);

      // Create standardized bid object
      const newBid = {
        id: bidData.id || bidData._id || Date.now().toString(),
        driverId: bidData.driverId,
        amount: Number(bidData.amount || bidData.price || 0),
        bidTime:
          bidData.bidTime || bidData.timestamp || new Date().toISOString(),
        isCurrentDriver: bidData.driverId === driverId,
        driverRating: bidData.driverRating || 4.5,
      };

      // Update sorted bidders list
      setSortedBidders((prev) => {
        // Check if this driver already has a bid
        const existingIndex = prev.findIndex(
          (b) => b.driverId === newBid.driverId
        );

        let newBidders;
        if (existingIndex >= 0) {
          // Update existing bid
          newBidders = [...prev];
          newBidders[existingIndex] = {
            ...newBidders[existingIndex],
            amount: newBid.amount,
            bidTime: newBid.bidTime,
          };
        } else {
          // Add new bid
          newBidders = [...prev, newBid];
        }

        // Re-sort the bids
        return newBidders.sort((a, b) =>
          sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount
        );
      });
    };

    // Handle the new custom driver:bid_update event
    const handleDriverBidUpdate = (event) => {
      // console.log("TopBidders received driver:bid_update event:", event.detail);
      if (event.detail && event.detail.bid) {
        processBidData(event.detail.bid);
      }
    };

    // Handle regular bid:update events
    const handleBidUpdate = (event) => {
      if (event.detail && event.detail.bid) {
        processBidData(event.detail.bid);
      }
    };

    // Handle raw WebSocket messages
    const handleRawWSMessage = (event) => {
      if (event.detail && event.detail.data) {
        const data = event.detail.data;

        if (
          (data.type === "new_bid" || data.type === "bid_updated") &&
          data.data
        ) {
          processBidData(data.data);
        }
      }
    };

    // Add all event listeners
    document.addEventListener("driver:bid_update", handleDriverBidUpdate);
    document.addEventListener("bid:update", handleBidUpdate);
    document.addEventListener("ws:raw_message", handleRawWSMessage);

    // Cleanup
    return () => {
      document.removeEventListener("driver:bid_update", handleDriverBidUpdate);
      document.removeEventListener("bid:update", handleBidUpdate);
      document.removeEventListener("ws:raw_message", handleRawWSMessage);
    };
  }, [driverId, sortOrder]);

  // Mark the current driver's bid and sort bidders whenever the input changes
  useEffect(() => {
    if (bidders && bidders.length > 0) {
      // Remove any duplicates based on driverId
      const uniqueBidders = bidders.reduce((acc, bid) => {
        const existingIndex = acc.findIndex((b) => b.driverId === bid.driverId);
        if (existingIndex >= 0) {
          // Keep the more recent bid (assume it has a timestamp)
          const existingBid = acc[existingIndex];
          const existingTime = new Date(
            existingBid.bidTime || existingBid.createdAt || 0
          ).getTime();
          const newTime = new Date(bid.bidTime || bid.createdAt || 0).getTime();

          if (newTime > existingTime) {
            acc[existingIndex] = { ...bid };
          }
        } else {
          acc.push({ ...bid });
        }
        return acc;
      }, []);

      // Process the uniqueBidders to ensure consistent properties
      const processedBidders = uniqueBidders.map((bid) => ({
        ...bid,
        id: bid.id || bid._id,
        amount: Number(bid.amount) || Number(bid.price) || 0,
        driverId: bid.driverId,
        isCurrentDriver: bid.driverId === driverId || bid.isCurrentDriver,
      }));

      // Then sort by amount according to the current sort order
      const sorted = [...processedBidders].sort((a, b) =>
        sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount
      );

      // Mark the lowest bid
      const withLowestMarked = sorted.map((bidder, index) => ({
        ...bidder,
        isLowestBid: sortOrder === "asc" ? index === 0 : false,
      }));

      setSortedBidders(withLowestMarked);
    } else {
      setSortedBidders([]);
    }
  }, [bidders, sortOrder, driverId]);

  // Toggle sort order between ascending and descending
  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  // Toggle between showing all bidders or limited number
  const toggleShowAll = () => {
    setShowAll((prev) => !prev);
  };

  // Calculate displayed bidders based on showAll flag
  const displayedBidders = showAll
    ? sortedBidders
    : sortedBidders.slice(0, DEFAULT_DISPLAY_COUNT);

  const hasMoreBidders = sortedBidders.length > DEFAULT_DISPLAY_COUNT;

  // This creates a polling mechanism for fetching fresh bids
  useEffect(() => {
    // Skip if no valid bookingId is passed
    if (!bidders || bidders.length === 0) return;

    // First bid contains the bookingId we need
    const firstBid = bidders[0];
    const bookingId = firstBid?.bookingId || firstBid?.bookingRefId;

    if (!bookingId) return;

    // console.log("Setting up bid refresh polling for booking:", bookingId);

    // Function to fetch fresh bids
    const refreshBids = async () => {
      try {
        const token = localStorage.getItem("driverToken");
        if (!token) return;

        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/bids/driver/booking/${bookingId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (
          response.ok &&
          data.data &&
          Array.isArray(data.data) &&
          data.data.length > 0
        ) {
          // Process the new bids data
          const freshBids = data.data.map((bid) => ({
            id: bid.id || bid._id,
            driverId: bid.driverId,
            amount: Number(bid.amount || bid.price || 0),
            bidTime: bid.bidTime || bid.timestamp || new Date().toISOString(),
            note: bid.note || "",
            driverRating: bid.rating || bid.driverRating || 4.5,
            isCurrentDriver: bid.driverId === driverId,
          }));

          // Notify about new bids in console
          // console.log(
          //   `Refreshed ${freshBids.length} bids for booking ${bookingId}`
          // );

          // Update with fetched bids - don't set directly to keep existing state transforms
          setSortedBidders((prevBids) => {
            // Create a unified list with fresh bids taking precedence
            const combinedBids = [...prevBids];

            freshBids.forEach((freshBid) => {
              const existingIndex = combinedBids.findIndex(
                (existingBid) => existingBid.driverId === freshBid.driverId
              );

              if (existingIndex >= 0) {
                // Compare timestamps to only update if newer
                const existingTime = new Date(
                  combinedBids[existingIndex].bidTime || 0
                ).getTime();
                const newTime = new Date(freshBid.bidTime || 0).getTime();

                if (newTime > existingTime) {
                  combinedBids[existingIndex] = {
                    ...combinedBids[existingIndex],
                    ...freshBid,
                  };
                }
              } else {
                // Add completely new bid
                combinedBids.push(freshBid);
              }
            });

            // Sort according to current preference
            return combinedBids.sort((a, b) =>
              sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount
            );
          });
        }
      } catch (error) {
        console.error("Error refreshing bids:", error);
      }
    };

    // Initial refresh
    refreshBids();

    // Set up polling interval (every 10 seconds)
    const intervalId = setInterval(refreshBids, 10000);

    // Clean up
    return () => {
      clearInterval(intervalId);
    };
  }, [bidders]);

  // Add to TopBidders component within the outer useEffect for bidders
  // Create a polling mechanism for real-time updates
  useEffect(() => {
    if (!bidders || bidders.length === 0) return;

    // Find the booking ID from the first bid
    const firstBid = bidders[0];
    const bookingId = firstBid?.bookingId || firstBid?._id;

    if (!bookingId) return;

    // console.log("Setting up bid polling for booking:", bookingId);

    // Function to refresh bids
    const refreshBids = async () => {
      try {
        const token = localStorage.getItem("driverToken");
        if (!token) return;

        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/bids/driver/booking/${bookingId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) return;

        const data = await response.json();

        if (data.data && Array.isArray(data.data)) {
          // For each new bid, dispatch a bid update event
          data.data.forEach((bid) => {
            const event = new CustomEvent("bid:update", {
              detail: {
                bookingId,
                bid: {
                  ...bid,
                  driverId: bid.driverId,
                  amount: Number(bid.amount || bid.price || 0),
                  bidTime:
                    bid.bidTime || bid.timestamp || new Date().toISOString(),
                },
              },
            });
            document.dispatchEvent(event);
          });
        }
      } catch (error) {
        console.error("Error polling bids:", error);
      }
    };

    // Initial refresh
    refreshBids();

    // Set up polling interval (every 5 seconds)
    const intervalId = setInterval(refreshBids, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [bidders]);

  // If there are no bidders, show empty state
  if (!bidders || bidders.length === 0) {
    return (
      <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
        <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2 mb-4">
          <FaUsers className="text-red-500" /> {title}
        </h3>
        <div className="p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600">No bids have been placed yet.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`bg-white rounded-xl shadow-sm p-5 ${className}`}>
        {/* Header with controls - responsive design */}
        <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
          <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
            <FaUsers className="text-red-500" /> {title}
            <span className="ml-1 text-sm text-gray-500">
              ({sortedBidders.length})
            </span>
          </h3>

          {/* Controls with better mobile support */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Sort control */}
            <button
              onClick={toggleSortOrder}
              className="text-sm text-gray-600 hover:text-red-600 flex items-center gap-1 px-2 py-1 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
              aria-label={
                sortOrder === "asc"
                  ? "Sort by highest price"
                  : "Sort by lowest price"
              }
            >
              {sortOrder === "asc" ? (
                <>
                  <FaSortAmountDown className="text-xs" /> Lowest first
                </>
              ) : (
                <>
                  <FaSortAmountUp className="text-xs" /> Highest first
                </>
              )}
            </button>

            {/* View all toggle button */}
            {hasMoreBidders && (
              <button
                onClick={toggleShowAll}
                className="text-sm text-gray-600 hover:text-red-600 flex items-center gap-1 px-2 py-1 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
                aria-label={showAll ? "Show less" : "Show all"}
              >
                {showAll ? (
                  <>
                    <FaChevronUp className="text-xs" /> Show less
                  </>
                ) : (
                  <>
                    <FaChevronDown className="text-xs" /> Show all
                  </>
                )}
              </button>
            )}

            {/* View all in modal button */}
            <button
              onClick={() => setShowAllBiddersModal(true)}
              className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1 px-2 py-1 border border-red-200 rounded-md hover:bg-red-50 cursor-pointer font-medium"
              aria-label="View all bidders in detail"
            >
              <FaFilter className="text-xs" /> View All
            </button>
          </div>
        </div>

        {/* Bidders list with improved spacing */}
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {displayedBidders.map((bidder, index) => (
            <BidderItem
              key={bidder.id || index}
              bidder={bidder}
              index={index}
            />
          ))}

          {!showAll && hasMoreBidders && (
            <button
              onClick={toggleShowAll}
              className="w-full py-2 text-center text-sm text-gray-600 hover:text-red-600 bg-gray-50 rounded-md border border-gray-200 cursor-pointer mt-2"
            >
              Show {sortedBidders.length - DEFAULT_DISPLAY_COUNT} more bidders
            </button>
          )}
        </div>

        {/* Statistics with improved styling */}
        {sortedBidders.length >= 3 && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-center">
            <div className="bg-red-50 rounded-lg p-2 sm:p-3">
              <p className="text-xs text-gray-600">Lowest Bid</p>
              <p className="font-bold text-red-700 text-sm sm:text-lg">
                ₹{Math.min(...sortedBidders.map((b) => b.amount))}
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-2 sm:p-3">
              <p className="text-xs text-gray-600">Average Bid</p>
              <p className="font-bold text-blue-700 text-sm sm:text-lg">
                ₹
                {Math.round(
                  sortedBidders.reduce((sum, b) => sum + Number(b.amount), 0) /
                    sortedBidders.length
                )}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
              <p className="text-xs text-gray-600">Highest Bid</p>
              <p className="font-bold text-gray-700 text-sm sm:text-lg">
                ₹{Math.max(...sortedBidders.map((b) => b.amount))}
              </p>
            </div>
          </div>
        )}

        {/* Information note with improved styling */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
          <p className="flex items-start gap-2">
            <FaInfoCircle className="text-blue-500 mt-1 flex-shrink-0" />
            <span>
              These are the current top bids for this booking. Lower bids have
              higher chances of being selected.
            </span>
          </p>
        </div>
      </div>

      {/* All Bidders Modal */}
      <AllBiddersModal
        isOpen={showAllBiddersModal}
        onClose={() => setShowAllBiddersModal(false)}
        bidders={sortedBidders}
      />
    </>
  );
};

export default TopBidders;
