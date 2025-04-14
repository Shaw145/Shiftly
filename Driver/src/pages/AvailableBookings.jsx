import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaTruck,
  FaBoxOpen,
  FaMoneyBillWave,
  FaChevronRight,
  FaFilter,
  FaSearch,
  FaRupeeSign,
  FaExpandAlt,
  FaLocationArrow,
  FaMinus,
  FaPlus,
} from "react-icons/fa";
import DashboardLayout from "../components/DashboardLayout";
import { demoBookings } from "../utils/demoBookings";
import ProfileUpdateModal from "../components/ProfileUpdateModal";

const AvailableBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState(demoBookings);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState(false);
  const [hasAddress, setHasAddress] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchRadius, setSearchRadius] = useState(10); // Default 10km radius

  const [filters, setFilters] = useState({
    date: "",
    loadType: "",
    priceMin: "",
    priceMax: "",
  });

  // Fetch driver profile data
  useEffect(() => {
    const fetchDriverProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/driver/me/profile`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("driverToken")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        setDriver(data);

        // Check if driver has complete address
        const hasValidAddress =
          data?.personalDetails?.address?.current?.addressLine1 &&
          data?.personalDetails?.address?.current?.city &&
          data?.personalDetails?.address?.current?.state &&
          data?.personalDetails?.address?.current?.pincode;

        setHasAddress(hasValidAddress);

        // Show modal if address not found
        if (!hasValidAddress) {
          setIsProfileModalOpen(true);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setLoading(false);
      }
    };

    fetchDriverProfile();
  }, []);

  // Sort bookings by date and filter by distance
  useEffect(() => {
    if (!hasAddress) {
      setBookings([]);
      return;
    }

    // Sort by date
    const sortedBookings = [...demoBookings].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    // Filter by radius (this is simulated as we don't have real geocoding in the demo)
    // In a real implementation, you would calculate actual distances
    const maxDistance = searchRadius; // km
    const filteredByDistance = sortedBookings.filter((booking) => {
      // For demo purposes, we'll use the distance property
      const distanceValue = parseFloat(booking.distance.replace(" km", ""));
      return distanceValue <= maxDistance;
    });

    setBookings(filteredByDistance);
  }, [searchRadius, hasAddress]);

  // Handle search and filter
  useEffect(() => {
    if (!hasAddress) {
      return;
    }

    let filteredBookings = [...demoBookings];

    // Apply radius filter first
    filteredBookings = filteredBookings.filter((booking) => {
      const distanceValue = parseFloat(booking.distance.replace(" km", ""));
      return distanceValue <= searchRadius;
    });

    // Apply search
    if (searchTerm) {
      filteredBookings = filteredBookings.filter(
        (booking) =>
          booking.pickup.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.destination
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.loadType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    if (filters.date) {
      filteredBookings = filteredBookings.filter(
        (booking) => booking.date === filters.date
      );
    }

    if (filters.loadType) {
      filteredBookings = filteredBookings.filter(
        (booking) => booking.loadType === filters.loadType
      );
    }

    // Apply price range filters
    if (filters.priceMin) {
      filteredBookings = filteredBookings.filter(
        (booking) => booking.priceRange.max >= parseInt(filters.priceMin)
      );
    }

    if (filters.priceMax) {
      filteredBookings = filteredBookings.filter(
        (booking) => booking.priceRange.min <= parseInt(filters.priceMax)
      );
    }

    setBookings(filteredBookings);
  }, [searchTerm, filters, searchRadius, hasAddress]);

  const handleBookingClick = (bookingId) => {
    navigate(`/available-bookings/${bookingId}`);
  };

  const handleResetFilters = () => {
    setFilters({
      date: "",
      loadType: "",
      priceMin: "",
      priceMax: "",
    });
    setFilterActive(false);
    setSearchTerm("");

    // Reset bookings but keep radius filter
    const radiusFilteredBookings = demoBookings.filter((booking) => {
      const distanceValue = parseFloat(booking.distance.replace(" km", ""));
      return distanceValue <= searchRadius;
    });

    setBookings(radiusFilteredBookings);
  };

  const handleCloseModal = () => {
    setIsProfileModalOpen(false);
    document.body.style.overflow = "auto"; // Re-enable scrolling
  };

  // Get unique load types for filter
  const loadTypes = [
    ...new Set(demoBookings.map((booking) => booking.loadType)),
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-gray-50">
        <div className="flex-1 overflow-hidden">
          <main className="h-full overflow-y-auto p-4 md:p-6">
            {/* Page Title */}
            {/* <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                Available Bookings
              </h1>
              <p className="text-gray-600">
                Browse and bid on available transport requests from customers
              </p>
            </div> */}

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="pl-10 pr-4 py-3 w-full rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring focus:ring-red-200 transition-all"
                    placeholder="Search by location, booking ID or load type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={!hasAddress}
                  />
                </div>

                {/* Distance/Radius Filter */}
                <div className="relative">
                  <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-700">
                    <FaLocationArrow className="text-red-500" />
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        value={searchRadius}
                        onChange={(e) =>
                          setSearchRadius(Math.max(1, Number(e.target.value)))
                        }
                        className="w-16 appearance-none bg-transparent border-none focus:outline-none text-center"
                        disabled={!hasAddress}
                      />
                      <span className="text-gray-600">km</span>
                    </div>
                    <div className="flex items-center gap-1 ml-2 border-l border-gray-200 pl-2">
                      <button
                        onClick={() =>
                          setSearchRadius((prev) => Math.max(1, prev - 5))
                        }
                        className="p-1 hover:bg-gray-100 rounded-full text-gray-500 disabled:opacity-50 cursor-pointer"
                        disabled={!hasAddress || searchRadius <= 1}
                      >
                        <FaMinus className="text-xs" />
                      </button>
                      <button
                        onClick={() => setSearchRadius((prev) => prev + 5)}
                        className="p-1 hover:bg-gray-100 rounded-full text-gray-500 disabled:opacity-50 cursor-pointer"
                        disabled={!hasAddress}
                      >
                        <FaPlus className="text-xs" />
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setFilterActive(!filterActive)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 cursor-pointer hover:bg-gray-50 hover:shadow-md ${
                    filterActive
                      ? "bg-red-50 border-red-500 text-red-600"
                      : "border-gray-200 text-gray-700"
                  }`}
                  disabled={!hasAddress}
                >
                  <FaFilter /> Filters{" "}
                  {Object.values(filters).some((val) => val) && "(Active)"}
                </button>
              </div>

              {/* Filter Options */}
              {filterActive && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        className="w-full p-2 rounded-lg border-2 border-gray-200 focus:border-red-500"
                        value={filters.date}
                        onChange={(e) =>
                          setFilters({ ...filters, date: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Load Type
                      </label>
                      <select
                        className="w-full p-2 rounded-lg border-2 border-gray-200 focus:border-red-500"
                        value={filters.loadType}
                        onChange={(e) =>
                          setFilters({ ...filters, loadType: e.target.value })
                        }
                      >
                        <option value="">All Types</option>
                        {loadTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Min Price (₹)
                      </label>
                      <input
                        type="number"
                        className="w-full p-2 rounded-lg border-2 border-gray-200 focus:border-red-500"
                        placeholder="Min price"
                        value={filters.priceMin}
                        onChange={(e) =>
                          setFilters({ ...filters, priceMin: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Price (₹)
                      </label>
                      <input
                        type="number"
                        className="w-full p-2 rounded-lg border-2 border-gray-200 focus:border-red-500"
                        placeholder="Max price"
                        value={filters.priceMax}
                        onChange={(e) =>
                          setFilters({ ...filters, priceMax: e.target.value })
                        }
                      />
                    </div>

                    <div className="md:col-span-2 lg:col-span-4 flex justify-end">
                      <button
                        onClick={handleResetFilters}
                        className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 transition rounded-lg cursor-pointer hover:shadow-md"
                      >
                        Reset Filters
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bookings List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
              {hasAddress && bookings.length > 0 ? (
                bookings.map((booking) => (
                  <div
                    key={booking.id}
                    onClick={() => handleBookingClick(booking.id)}
                    className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md hover:border-red-100 transition-all cursor-pointer"
                  >
                    {/* Price highlight on top */}
                    <div className="bg-red-50 rounded-t-lg -mt-4 -mx-4 mb-3 px-4 py-2 flex items-center justify-between">
                      <span className="text-red-600 font-semibold flex items-center">
                        <FaMoneyBillWave className="mr-1" /> Price Range
                      </span>
                      <span className="text-lg font-bold text-gray-800">
                        ₹{booking.priceRange.min} - ₹{booking.priceRange.max}
                      </span>
                    </div>

                    <div className="flex justify-between items-start mb-3">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                        {booking.id}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(booking.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                        {" • "}
                        {booking.time}
                      </span>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-start gap-3">
                        <div className="min-w-[24px] h-6 flex justify-center items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {booking.pickup}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Pickup Location
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="min-w-[24px] h-6 flex justify-center items-center">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {booking.destination}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Delivery Location
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-gray-400" />
                        <span className="text-sm text-gray-700">
                          {booking.distance}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <FaClock className="text-gray-400" />
                        <span className="text-sm text-gray-700">
                          {booking.expectedDuration}
                        </span>
                      </div>

                      <div className="col-span-2 flex items-center gap-2">
                        <FaBoxOpen className="text-gray-400" />
                        <span className="text-sm text-gray-700">
                          {booking.loadType} ({booking.weight})
                        </span>
                      </div>
                    </div>

                    <button className="w-full flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all cursor-pointer">
                      View Details & Bid <FaChevronRight className="text-xs" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <div className="max-w-md mx-auto">
                    <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                      <FaTruck className="text-3xl text-gray-400" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-700 mb-2">
                      {!hasAddress ? "Address Required" : "No bookings found"}
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {!hasAddress
                        ? "Please update your address in your profile to see available bookings in your area."
                        : "There are no bookings matching your filters or within the selected radius. Try changing your search criteria or increasing the search radius."}
                    </p>
                    {!hasAddress ? (
                      <button
                        onClick={() => navigate(`/profile/${driver?.username}`)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition cursor-pointer"
                      >
                        Update Profile
                      </button>
                    ) : (
                      <button
                        onClick={handleResetFilters}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        Reset Filters
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Profile Update Modal */}
      <ProfileUpdateModal
        isOpen={isProfileModalOpen}
        onClose={handleCloseModal}
        username={driver?.username}
      />
    </DashboardLayout>
  );
};

export default AvailableBookings;
