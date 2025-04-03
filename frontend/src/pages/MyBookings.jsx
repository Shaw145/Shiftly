import { useState, useEffect } from "react";
import BookingCard from "../components/myBookings/BookingCard";
import { FaBox } from "react-icons/fa";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    fetchBookings();
  }, []);

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
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const filterBookings = (status) => {
    setActiveFilter(status);
  };

  const getFilteredBookings = () => {
    if (activeFilter === "all") return bookings;
    return bookings.filter((booking) => booking.status === activeFilter);
  };

  if (loading) {
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

        <div className="mb-8">
          <div className="flex space-x-2 overflow-x-auto no-scrollbar">
            <div className="flex min-w-full md:min-w-0 pb-2">
              {[
                "all",
                "pending",
                "confirmed",
                "inTransit",
                "completed",
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
      </div>
    </div>
  );
};



export default MyBookings;
