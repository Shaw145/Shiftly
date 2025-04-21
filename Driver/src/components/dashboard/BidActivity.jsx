import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaGavel,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaArrowRight,
  FaWifi,
} from "react-icons/fa";

// Demo data for bid activity (will be replaced with API call)
const demoBidActivity = [
  {
    id: "bid1",
    bookingId: "booking123",
    route: "Mumbai to Pune",
    amount: 2500,
    status: "active",
    bidTime: "2023-09-15T10:30:00",
    totalBids: 8,
    isLowestBid: true,
  },
  {
    id: "bid2",
    bookingId: "booking456",
    route: "Delhi to Agra",
    amount: 3800,
    status: "accepted",
    bidTime: "2023-09-10T15:45:00",
    totalBids: 5,
    isLowestBid: false,
  },
  {
    id: "bid3",
    bookingId: "booking789",
    route: "Bangalore to Mysore",
    amount: 1950,
    status: "rejected",
    bidTime: "2023-09-05T09:15:00",
    totalBids: 12,
    isLowestBid: false,
  },
  {
    id: "bid4",
    bookingId: "booking101",
    route: "Chennai to Pondicherry",
    amount: 2200,
    status: "active",
    bidTime: "2023-09-12T11:20:00",
    totalBids: 6,
    isLowestBid: false,
    offlineMode: true,
  },
];

/**
 * Displays recent bid activity on the dashboard
 */
const BidActivity = () => {
  const [bidActivity, setBidActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch bid activity on component mount
  useEffect(() => {
    const fetchBidActivity = async () => {
      setIsLoading(true);
      try {
        // Get driver token from localStorage
        const driverToken = localStorage.getItem("driverToken");

        if (!driverToken) {
          throw new Error("Authentication required");
        }

        // Attempt to fetch bids from API
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/bids/driver/recent`,
          {
            headers: {
              Authorization: `Bearer ${driverToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setBidActivity(data.bids || []);
        } else {
          // Use demo data if API fails
          // console.log("Using fallback demo bid activity data");
          setBidActivity(demoBidActivity);

          if (response.status === 401) {
            setError("Authentication required");
          }
        }
      } catch (error) {
        console.error("Error fetching bid activity:", error);
        // Use demo data as fallback
        setBidActivity(demoBidActivity);
        setError("Could not load bid activity");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBidActivity();
  }, []);

  /**
   * Format date relative to now (e.g. "2 days ago")
   */
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInHours / 24;

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else if (diffInDays < 7) {
      const days = Math.floor(diffInDays);
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    } else {
      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      });
    }
  };

  /**
   * Render status icon based on bid status
   */
  const renderStatusIcon = (status, offlineMode) => {
    if (offlineMode) {
      return (
        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
          <FaWifi />
        </div>
      );
    }

    switch (status) {
      case "active":
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">
            <FaHourglassHalf />
          </div>
        );
      case "accepted":
        return (
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-500">
            <FaCheckCircle />
          </div>
        );
      case "rejected":
        return (
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-500">
            <FaTimesCircle />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
            <FaExclamationTriangle />
          </div>
        );
    }
  };

  /**
   * Render status badge for bid status
   */
  const renderStatusBadge = (status, isLowestBid, offlineMode) => {
    if (offlineMode) {
      return (
        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-orange-100 text-orange-700">
          Offline
        </span>
      );
    }

    let badgeClasses = "px-2 py-0.5 text-xs font-medium rounded-full ";

    switch (status) {
      case "active":
        badgeClasses += "bg-blue-100 text-blue-700";
        return <span className={badgeClasses}>Active</span>;
      case "accepted":
        badgeClasses += "bg-green-100 text-green-700";
        return <span className={badgeClasses}>Accepted</span>;
      case "rejected":
        badgeClasses += "bg-red-100 text-red-700";
        return <span className={badgeClasses}>Rejected</span>;
      default:
        badgeClasses += "bg-gray-100 text-gray-700";
        return <span className={badgeClasses}>Unknown</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FaGavel className="text-red-500" /> Recent Bids
          </h2>
        </div>
        <div className="flex items-center justify-center p-6">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-gray-200 h-10 w-10"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <FaGavel className="text-red-500" /> Recent Bids
        </h2>
        <Link
          to="/my-bids"
          className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
        >
          View All <FaArrowRight className="text-xs" />
        </Link>
      </div>

      {bidActivity.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <p className="text-gray-600">You haven't placed any bids yet.</p>
          <Link
            to="/available-bookings"
            className="inline-block mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors cursor-pointer"
          >
            Browse Available Bookings
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bidActivity.slice(0, 4).map((bid) => (
            <Link
              key={bid.id}
              to={`/booking/${bid.bookingId}`}
              className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
            >
              {renderStatusIcon(bid.status, bid.offlineMode)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-gray-800 truncate">
                    {bid.route}
                  </h3>
                  {renderStatusBadge(
                    bid.status,
                    bid.isLowestBid,
                    bid.offlineMode
                  )}
                  {bid.isLowestBid && bid.status === "active" && (
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">
                      Lowest
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-3">
                  <span>₹{bid.amount}</span>
                  <span>•</span>
                  <span>{formatRelativeTime(bid.bidTime)}</span>
                  <span>•</span>
                  <span>{bid.totalBids} total bids</span>
                </div>
              </div>
              <FaArrowRight className="text-gray-400" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default BidActivity;
