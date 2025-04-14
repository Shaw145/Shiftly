import { useState, useEffect } from "react";
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
  FaChevronRight,
  FaTimes,
} from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";
import DashboardLayout from "../components/DashboardLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import BidForm from "../components/bookings/BidForm";
import LocationMap from "../components/bookings/LocationMap";
import TopBidders from "../components/bookings/TopBidders";

// Demo data for available bookings (will be replaced with API call)
import { demoBookings } from "../utils/demoBookings";

const BookingDetails = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBidSuccess, setIsBidSuccess] = useState(false);
  const [currentBid, setCurrentBid] = useState(null);

  // Demo bidders data
  const [topBidders, setTopBidders] = useState([
    {
      id: "bid1",
      amount: 920,
      driverId: "driver1",
      driverRating: 4.8,
      isLowestBid: true,
    },
    {
      id: "bid2",
      amount: 950,
      driverId: "driver2",
      driverRating: 4.5,
      isLowestBid: false,
    },
    {
      id: "bid3",
      amount: 980,
      driverId: "driver3",
      driverRating: 4.9,
      isLowestBid: false,
    },
    {
      id: "bid4",
      amount: 1000,
      driverId: "driver4",
      driverRating: 4.6,
      isLowestBid: false,
    },
    {
      id: "bid5",
      amount: 1050,
      driverId: "driver5",
      driverRating: 4.7,
      isLowestBid: false,
    },
  ]);

  // First, add a new state for showing all bidders
  const [showAllBidders, setShowAllBidders] = useState(false);

  // Calculate if bidding is locked (24 hours before pickup)
  const isBidLocked = (date) => {
    if (!date) return false;
    const pickupDate = new Date(date);
    const now = new Date();
    const hoursRemaining = (pickupDate - now) / (1000 * 60 * 60);
    return hoursRemaining <= 24;
  };

  useEffect(() => {
    // Simulate API call to fetch booking details
    setIsLoading(true);

    // Find the booking in demo data (this will be a real API call in production)
    const foundBooking = demoBookings.find((b) => b.id === bookingId);

    if (foundBooking) {
      // Simulate network delay
      setTimeout(() => {
        setBooking(foundBooking);
        setIsLoading(false);

        // Simulate having a current bid
        const hasBid = Math.random() > 0.5;
        if (hasBid) {
          const bidAmount = Math.floor(
            (foundBooking.priceRange.min + foundBooking.priceRange.max) / 2
          );
          setCurrentBid({
            amount: bidAmount,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
            note: "I can deliver this promptly and safely. I have experience with similar items.",
          });
        }
      }, 1000);
    } else {
      // Booking not found
      toast.error("Booking not found");
      navigate("/available-bookings");
    }
  }, [bookingId, navigate]);

  const handleBidSubmit = (bidAmount, note) => {
    return new Promise((resolve) => {
      // Simulate API call to submit bid
      setTimeout(() => {
        // Update current bid
        setCurrentBid({
          amount: bidAmount,
          createdAt: new Date().toISOString(),
          note: note,
        });

        // Show success message
        setIsBidSuccess(true);

        // Add to top bidders if lower than existing bids
        const isLowest = !topBidders.some((bid) => bid.amount <= bidAmount);
        if (isLowest) {
          const newBidders = [
            {
              id: "myBid",
              amount: bidAmount,
              driverId: "currentDriver",
              driverRating: 4.7,
              isLowestBid: true,
              isCurrentDriver: true,
            },
            ...topBidders.map((bid) => ({ ...bid, isLowestBid: false })),
          ].sort((a, b) => a.amount - b.amount);

          // Keep top 5 bids only
          setTopBidders(newBidders.slice(0, 5));
        } else {
          // Just add to the list and sort
          const newBidders = [
            ...topBidders,
            {
              id: "myBid",
              amount: bidAmount,
              driverId: "currentDriver",
              driverRating: 4.7,
              isLowestBid: false,
              isCurrentDriver: true,
            },
          ].sort((a, b) => a.amount - b.amount);

          // Set the lowest as the lowest bid
          newBidders[0].isLowestBid = true;

          // Keep top 5 bids only
          setTopBidders(newBidders.slice(0, 5));
        }

        resolve();
      }, 1500);
    });
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
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Booking Not Found
            </h2>
            <p className="text-gray-600 mb-4">
              The booking you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate("/available-bookings")}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition cursor-pointer"
            >
              Back to Available Bookings
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Format date
  const formattedDate = new Date(booking.date).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Check if bidding is locked
  const bidLocked = isBidLocked(booking.date);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Back Button */}
        <button
          onClick={() => navigate("/available-bookings")}
          className="flex items-center gap-2 text-gray-600 hover:text-red-600 mb-6 transition-all cursor-pointer"
        >
          <FaArrowLeft /> Back to Available Bookings
        </button>

        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-red-50 text-red-600 text-sm font-medium rounded-full">
                    {booking.id}
                  </span>
                  {bidLocked && (
                    <span className="px-3 py-1 bg-orange-50 text-orange-600 text-sm font-medium rounded-full flex items-center gap-1">
                      <FaLock className="text-xs" /> Bidding Locked
                    </span>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {booking.pickup} to {booking.destination}
                </h1>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-gray-500 text-sm">Price Range</div>
                <div className="text-xl font-bold text-gray-800">
                  ₹{booking.priceRange.min} - ₹{booking.priceRange.max}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Status Bar */}
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-100">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-red-500" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaClock className="text-red-500" />
                <span>{booking.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-red-500" />
                <span>{booking.distance}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaBoxOpen className="text-red-500" />
                <span>{booking.loadType}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bidding Interface for Large Screens */}
        <div className="hidden lg:block mb-6">
          <BidForm
            booking={booking}
            currentBid={currentBid}
            onSubmitBid={handleBidSubmit}
            isBidLocked={bidLocked}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bidding Interface for Mobile */}
            <div className="lg:hidden">
              <BidForm
                booking={booking}
                currentBid={currentBid}
                onSubmitBid={handleBidSubmit}
                isBidLocked={bidLocked}
              />
            </div>

            {/* Mobile Top Bidders */}
            <div className="lg:hidden">
              <TopBidders bidders={topBidders} />
            </div>

            {/* Journey Details */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Journey Details
              </h2>
              <div className="space-y-4 mb-4">
                {/* Pickup */}
                <div className="flex items-start gap-3">
                  <div className="min-w-[28px] h-10 flex justify-center">
                    <div className="flex flex-col items-center h-full">
                      <div className="w-4 h-4 rounded-full bg-green-500 z-10"></div>
                      <div className="w-0.5 flex-grow bg-gray-300 -mt-1"></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      Pickup Location
                    </h4>
                    <p className="text-gray-700">{booking.pickup}</p>
                    {/* We don't show the full address anymore as per requirement #5 */}
                  </div>
                </div>

                {/* Destination */}
                <div className="flex items-start gap-3">
                  <div className="min-w-[28px] h-7 flex justify-center">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-red-500 z-10"></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Destination</h4>
                    <p className="text-gray-700">{booking.destination}</p>
                    {/* We don't show the full address anymore as per requirement #5 */}
                  </div>
                </div>
              </div>

              {/* Update the journey details footer to be more responsive */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-gray-400" />
                  <span className="text-sm text-gray-700">
                    Distance:{" "}
                    <span className="font-medium">{booking.distance}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaClock className="text-gray-400" />
                  <span className="text-sm text-gray-700">
                    Est. Duration:{" "}
                    <span className="font-medium">
                      {booking.expectedDuration}
                    </span>
                  </span>
                </div>
                <button className="text-sm text-red-600 flex items-center gap-1 hover:text-red-700 cursor-pointer">
                  <FaDirections /> Get Directions
                </button>
              </div>
            </div>

            {/* Map */}
            <LocationMap
              pickup={booking.pickup}
              destination={booking.destination}
            />

            {/* Load Details and Description Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Load Details */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                  <FaBoxOpen className="text-red-500" /> Load Details
                </h3>
                <div className="space-y-3">
                  <div className="flex flex-wrap justify-between">
                    <span className="text-gray-600 w-full sm:w-auto mb-1 sm:mb-0">
                      Type:
                    </span>
                    <span className="font-medium">{booking.loadType}</span>
                  </div>
                  <div className="flex flex-wrap justify-between">
                    <span className="text-gray-600 w-full sm:w-auto mb-1 sm:mb-0">
                      Weight:
                    </span>
                    <span className="font-medium">{booking.weight}</span>
                  </div>
                  <div className="flex flex-wrap justify-between">
                    <span className="text-gray-600 w-full sm:w-auto mb-1 sm:mb-0">
                      Size:
                    </span>
                    <span className="font-medium">{booking.dimensions}</span>
                  </div>
                  <div className="flex flex-wrap justify-between">
                    <span className="text-gray-600 w-full sm:w-auto mb-1 sm:mb-0">
                      Vehicle Needed:
                    </span>
                    <span className="font-medium">
                      {booking.vehiclePreference}
                    </span>
                  </div>
                  <div className="flex flex-wrap justify-between">
                    <span className="text-gray-600 w-full sm:w-auto mb-1 sm:mb-0">
                      Loading Help:
                    </span>
                    <span className="font-medium">
                      {booking.requiresLoading ? "Required" : "Not Required"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center gap-2">
                  <FaFileAlt className="text-red-500" /> Booking Description
                </h3>
                <p className="text-gray-700">{booking.description}</p>
                {booking.specialInstructions && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                      <FaInfoCircle className="text-yellow-500" /> Special
                      Instructions
                    </h4>
                    <p className="text-gray-700">
                      {booking.specialInstructions}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Top Bidders (Desktop only) */}
          <div className="hidden lg:block lg:col-span-1">
            <TopBidders bidders={topBidders} />
          </div>
        </div>
      </div>

      {/* Toaster for notifications */}
      <Toaster />
    </DashboardLayout>
  );
};

export default BookingDetails;
