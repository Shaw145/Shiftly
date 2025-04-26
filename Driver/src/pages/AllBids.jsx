import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaFilter,
  FaCalendarAlt,
  FaSortAmountDown,
  FaSortAmountUp,
  FaSyncAlt,
  FaExclamationTriangle,
  FaClipboardList,
  FaCheckCircle,
  FaTimesCircle,
  FaChevronRight,
} from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";
import DashboardLayout from "../components/DashboardLayout";
import LoadingSpinner from "../components/LoadingSpinner";
// import BiddersListView from "../components/bookings/BiddersListView";

// Demo data for bids (will be replaced with API call)
const demoBids = [
  {
    id: "bid1",
    bookingId: "booking123",
    amount: 850,
    status: "active",
    bidTime: "2023-09-15T10:30:00",
    route: "Mumbai to Pune",
    pickupDate: "2023-09-20",
    isLowestBid: true,
    totalBids: 5,
  },
  {
    id: "bid2",
    bookingId: "booking456",
    amount: 1200,
    status: "active",
    bidTime: "2023-09-14T15:45:00",
    route: "Delhi to Agra",
    pickupDate: "2023-09-22",
    isLowestBid: false,
    totalBids: 8,
  },
  {
    id: "bid3",
    bookingId: "booking789",
    amount: 950,
    status: "accepted",
    bidTime: "2023-09-10T09:15:00",
    route: "Bangalore to Mysore",
    pickupDate: "2023-09-18",
    isLowestBid: true,
    totalBids: 3,
  },
  {
    id: "bid4",
    bookingId: "booking101",
    amount: 1450,
    status: "rejected",
    bidTime: "2023-09-08T11:20:00",
    route: "Chennai to Pondicherry",
    pickupDate: "2023-09-16",
    isLowestBid: false,
    totalBids: 10,
  },
  {
    id: "bid5",
    bookingId: "booking202",
    amount: 780,
    status: "active",
    bidTime: "2023-09-13T14:50:00",
    route: "Hyderabad to Warangal",
    pickupDate: "2023-09-19",
    isLowestBid: true,
    totalBids: 6,
  },
];

/**
 * Displays all bids placed by the current driver across different bookings
 */
const AllBids = () => {
  const navigate = useNavigate();
  const [bids, setBids] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all"); // all, active, accepted, rejected
  const [sortOrder, setSortOrder] = useState("desc"); // desc = newest first, asc = oldest first
  const [groupedBids, setGroupedBids] = useState({
    active: [],
    accepted: [],
    rejected: [],
  });

  // Set dynamic page title when component mounts
  useEffect(() => {
    // Update the document title
    document.title = "My Bids | Track Your Proposals | Shiftly - A Seamless Transport System";
    
    // Optional: Restore the original title when component unmounts
    return () => {
      document.title = "Shiftly | A Seamless Transport System";
    };
  }, []);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  // Fetch all bids on component mount
  useEffect(() => {
    fetchAllBids();
  }, []);

  // Group bids by status whenever bids change
  useEffect(() => {
    if (bids.length > 0) {
      const grouped = {
        active: bids.filter((bid) => bid.status === "active"),
        accepted: bids.filter((bid) => bid.status === "accepted"),
        rejected: bids.filter((bid) => bid.status === "rejected"),
      };
      setGroupedBids(grouped);
    }
  }, [bids]);

  /**
   * Fetch all bids from the API
   */
  const fetchAllBids = async () => {
    setIsLoading(true);

    try {
      // Get driver token from localStorage
      const driverToken = localStorage.getItem("driverToken");

      if (!driverToken) {
        toast.error("Authentication required. Please login again.");
        navigate("/login");
        return;
      }

      // Attempt to fetch bids from API
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/bids/driver`,
        {
          headers: {
            Authorization: `Bearer ${driverToken}`,
          },
        }
      );

      // Check if response is successful
      if (response.ok) {
        const data = await response.json();
        // console.log("Bids data from API:", data);

        // Process and sort bids
        const processedBids = sortBids(data.bids || []);
        setBids(processedBids);
      } else {
        // If API fails, use demo data as fallback
        // console.log("Using fallback demo bid data");
        const processedBids = sortBids(demoBids);
        setBids(processedBids);

        if (response.status === 401) {
          toast.error("Authentication required. Please login again.");
          setTimeout(() => navigate("/login"), 2000);
        } else {
          toast.error("Failed to fetch your bids. Using demo data instead.");
        }
      }
    } catch (error) {
      console.error("Error fetching bids:", error);
      // Use demo data as fallback
      const processedBids = sortBids(demoBids);
      setBids(processedBids);
      toast.error("Error fetching your bids. Using demo data instead.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Sort bids based on sortOrder
   * @param {Array} bidsToSort - Array of bids to sort
   * @returns {Array} Sorted bids
   */
  const sortBids = (bidsToSort) => {
    return [...bidsToSort].sort((a, b) => {
      const dateA = new Date(a.bidTime).getTime();
      const dateB = new Date(b.bidTime).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });
  };

  /**
   * Toggle sort order between newest and oldest
   */
  const toggleSortOrder = () => {
    const newOrder = sortOrder === "desc" ? "asc" : "desc";
    setSortOrder(newOrder);
    setBids((prevBids) => sortBids(prevBids));
  };

  /**
   * Handle bid item click to navigate to booking details
   * @param {string} bookingId - ID of the booking
   */
  const handleBidClick = (bookingId) => {
    navigate(`/booking/${bookingId}`);
  };

  /**
   * Get status badge component based on bid status
   * @param {string} status - Status of the bid
   * @returns {JSX.Element} Status badge component
   */
  const getBidStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full flex items-center gap-1">
            <FaClipboardList className="text-xs" /> Active
          </span>
        );
      case "accepted":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
            <FaCheckCircle className="text-xs" /> Accepted
          </span>
        );
      case "rejected":
        return (
          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full flex items-center gap-1">
            <FaTimesCircle className="text-xs" /> Rejected
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full flex items-center gap-1">
            <FaExclamationTriangle className="text-xs" /> Unknown
          </span>
        );
    }
  };

  /**
   * Get filtered bids based on current filter status
   * @returns {Array} Filtered bids
   */
  const getFilteredBids = () => {
    if (filterStatus === "all") {
      return bids;
    }
    return bids.filter((bid) => bid.status === filterStatus);
  };

  /**
   * Format date to readable format
   * @param {string} dateString - Date string
   * @returns {string} Formatted date
   */
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error, "Input:", dateString);
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="h-full flex items-center justify-center">
          <LoadingSpinner message="Loading your bids..." />
        </div>
      </DashboardLayout>
    );
  }

  const filteredBids = getFilteredBids();

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Your Bids</h1>
            <p className="text-gray-600">
              View and manage all your bids across different bookings
            </p>
          </div>
          <div className="flex gap-2 flex-wrap md:flex-nowrap">
            {/* Filter buttons */}
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                onClick={() => setFilterStatus("all")}
                className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                  filterStatus === "all"
                    ? "bg-red-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                } border border-gray-300 cursor-pointer`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus("active")}
                className={`px-4 py-2 text-sm font-medium ${
                  filterStatus === "active"
                    ? "bg-red-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                } border-y border-r border-gray-300 cursor-pointer`}
              >
                Active
              </button>
              <button
                onClick={() => setFilterStatus("accepted")}
                className={`px-4 py-2 text-sm font-medium ${
                  filterStatus === "accepted"
                    ? "bg-red-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                } border-y border-r border-gray-300 cursor-pointer`}
              >
                Accepted
              </button>
              <button
                onClick={() => setFilterStatus("rejected")}
                className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                  filterStatus === "rejected"
                    ? "bg-red-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                } border-y border-r border-gray-300 cursor-pointer`}
              >
                Rejected
              </button>
            </div>

            {/* Sort button */}
            <button
              onClick={toggleSortOrder}
              className="px-4 py-2 text-sm font-medium bg-white text-gray-700 border border-gray-300 rounded-md flex items-center gap-1 hover:bg-gray-50 cursor-pointer"
            >
              {sortOrder === "desc" ? (
                <>
                  <FaSortAmountDown className="text-xs" /> Newest first
                </>
              ) : (
                <>
                  <FaSortAmountUp className="text-xs" /> Oldest first
                </>
              )}
            </button>

            {/* Refresh button */}
            <button
              onClick={fetchAllBids}
              className="px-4 py-2 text-sm font-medium bg-white text-gray-700 border border-gray-300 rounded-md flex items-center gap-1 hover:bg-gray-50 cursor-pointer"
            >
              <FaSyncAlt className="text-xs" /> Refresh
            </button>
          </div>
        </div>

        {/* Bids Lists */}
        {filteredBids.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              No bids found
            </h3>
            <p className="text-gray-600 mb-4">
              {filterStatus === "all"
                ? "You haven't placed any bids yet."
                : `You don't have any ${filterStatus} bids.`}
            </p>
            <button
              onClick={() => navigate("/available-bookings")}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors cursor-pointer"
            >
              Browse Available Bookings
            </button>
          </div>
        ) : (
          <>
            {/* Active Bids section */}
            {filterStatus === "all" && groupedBids.active.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaClipboardList className="text-blue-600" /> Active Bids
                </h2>
                <div className="space-y-4">
                  {groupedBids.active.map((bid) => (
                    <BidCard
                      key={bid.id}
                      bid={bid}
                      onClick={() => handleBidClick(bid.bookingId)}
                      statusBadge={getBidStatusBadge(bid.status)}
                      formatDate={formatDate}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Accepted Bids section */}
            {filterStatus === "all" && groupedBids.accepted.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaCheckCircle className="text-green-600" /> Accepted Bids
                </h2>
                <div className="space-y-4">
                  {groupedBids.accepted.map((bid) => (
                    <BidCard
                      key={bid.id}
                      bid={bid}
                      onClick={() => handleBidClick(bid.bookingId)}
                      statusBadge={getBidStatusBadge(bid.status)}
                      formatDate={formatDate}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Rejected Bids section */}
            {filterStatus === "all" && groupedBids.rejected.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaTimesCircle className="text-red-600" /> Rejected Bids
                </h2>
                <div className="space-y-4">
                  {groupedBids.rejected.map((bid) => (
                    <BidCard
                      key={bid.id}
                      bid={bid}
                      onClick={() => handleBidClick(bid.bookingId)}
                      statusBadge={getBidStatusBadge(bid.status)}
                      formatDate={formatDate}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Filtered bids (when not showing 'all') */}
            {filterStatus !== "all" && (
              <div className="space-y-4 mb-8">
                {filteredBids.map((bid) => (
                  <BidCard
                    key={bid.id}
                    bid={bid}
                    onClick={() => handleBidClick(bid.bookingId)}
                    statusBadge={getBidStatusBadge(bid.status)}
                    formatDate={formatDate}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <Toaster />
    </DashboardLayout>
  );
};

/**
 * Bid card component displays a single bid
 */
const BidCard = ({ bid, onClick, statusBadge, formatDate }) => {
  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-4 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-gray-500">
              #{bid.bookingId}
            </span>
            {statusBadge}
            {bid.isLowestBid && (
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                Lowest Bid
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            {bid.route}
          </h3>
          <div className="text-sm text-gray-600 flex items-center gap-2">
            <FaCalendarAlt className="text-gray-400" />
            Pickup: {formatDate(bid.pickupDate)}
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-2xl font-bold text-gray-800 mb-1">
            ₹{bid.amount}
          </div>
          <div className="text-xs text-gray-500">
            Placed on {formatDate(bid.bidTime)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {bid.totalBids} total bids
          </div>
        </div>
      </div>
      <div className="mt-4 pt-2 border-t border-gray-100 flex justify-end">
        <span className="text-sm text-red-600 flex items-center gap-1 hover:text-red-700">
          View Details <FaChevronRight className="text-xs" />
        </span>
      </div>
    </div>
  );
};

export default AllBids;
