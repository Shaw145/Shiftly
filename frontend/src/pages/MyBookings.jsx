import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BookingCard from "../components/myBookings/BookingCard";
import ProfileUpdateModal from "../components/ProfileUpdateModal";
import useProfileCheck from "../hooks/useProfileCheck";
import { FaBox, FaExclamationCircle } from "react-icons/fa";

const MyBookings = () => {
  const { isProfileComplete, user, loading } = useProfileCheck();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading2, setLoading2] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const navigate = useNavigate();

  // Set dynamic page title when component mounts
  useEffect(() => {
    // Update the document title
    document.title =
      "My Bookings | View Your Orders | Shiftly - A Seamless Transport System";

    // Optional: Restore the original title when component unmounts
    return () => {
      document.title = "Shiftly | A Seamless Transport System";
    };
  }, []);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Show the modal if profile is not complete (after initial loading)
    if (!loading && !isProfileComplete) {
      setShowProfileModal(true);
    }

    // Only fetch bookings if not loading the profile check
    if (!loading) {
      fetchBookings();
    }
  }, [loading, isProfileComplete]);

  // Navigate to profile page
  const goToProfile = () => {
    if (user && user.username) {
      navigate(`/user/${user.username}`);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/bookings/my-bookings`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch bookings");
      }

      setBookings(data.bookings);
      setLoading2(false);
    } catch (error) {
      setError(error.message);
      setLoading2(false);
    }
  };

  const filterBookings = (status) => {
    setActiveFilter(status);
  };

  const getFilteredBookings = () => {
    if (activeFilter === "all") return bookings;

    // Special case for "completed" filter to include both "completed" and "delivered" statuses
    if (activeFilter === "completed") {
      return bookings.filter(
        (booking) =>
          booking.status === "completed" || booking.status === "delivered"
      );
    }

    return bookings.filter((booking) => booking.status === activeFilter);
  };

  if (loading || loading2) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <h3 className="text-xl font-semibold mb-2">Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 mt-20 md:ml-22 lg:ml-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>

        {!isProfileComplete && !showProfileModal ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaExclamationCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Profile Update Required
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    Please update your mobile number in your profile to view
                    your bookings.
                  </p>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={goToProfile}
                    className="ml-1 rounded-md bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none cursor-pointer hover:scale-110 transition-all duration-200 hover:shadow-lg hover:shadow-red-300"
                  >
                    Update Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <div className="flex space-x-2 overflow-x-auto no-scrollbar">
                <div className="flex min-w-full md:min-w-0 pb-2">
                  {[
                    "all",
                    "pending",
                    "confirmed",
                    "inTransit",
                    "completed",
                    "delivered",
                    "cancelled",
                  ].map((status) => (
                    <button
                      key={status}
                      onClick={() => filterBookings(status)}
                      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap mr-2
                        ${
                          activeFilter === status
                            ? "bg-red-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {getFilteredBookings().length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaBox className="text-2xl text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-600 mb-2">
                  No {activeFilter !== "all" ? activeFilter : ""} bookings found
                </h3>
                <p className="text-gray-500">
                  {activeFilter === "all"
                    ? "Your bookings will appear here once you make a booking"
                    : activeFilter === "completed"
                    ? "You don't have any completed or delivered bookings at the moment"
                    : `You don't have any ${activeFilter} bookings at the moment`}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {getFilteredBookings().map((booking) => (
                  <BookingCard key={booking.bookingId} booking={booking} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Profile Update Modal */}
        {!loading && user && (
          <ProfileUpdateModal
            isOpen={showProfileModal}
            onClose={() => setShowProfileModal(false)}
            username={user.username}
          />
        )}
      </div>
    </div>
  );
};

export default MyBookings;
