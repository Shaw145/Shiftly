import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTruck,
  FaArrowRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const UpcomingBookings = () => {
  const navigate = useNavigate();

  // Sample data - in real app, this would come from your backend
  const upcomingBookings = [
    {
      id: "BK001",
      date: "2024-03-25",
      time: "10:00 AM",
      pickup: "Pune, Maharashtra",
      delivery: "Mumbai, Maharashtra",
      vehicle: "Mini Truck",
      status: "Confirmed",
    },
    {
      id: "BK002",
      date: "2024-03-26",
      time: "2:00 PM",
      pickup: "Hyderabad, Telangana",
      delivery: "Bangalore, Karnataka",
      vehicle: "Large Truck",
      status: "Pending",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Upcoming Bookings</h2>
          <p className="text-sm text-gray-500">Your scheduled transports</p>
        </div>
        <button
          onClick={() => navigate("/my-bookings")}
          className="text-red-500 hover:text-red-600 flex items-center gap-1 cursor-pointer"
        >
          View All
          <FaArrowRight />
        </button>
      </div>

      <div className="space-y-4">
        {upcomingBookings.map((booking) => (
          <div
            key={booking.id}
            className="border border-gray-100 rounded-lg p-4 hover:border-red-400 transition-colors cursor-pointer"
            onClick={() => navigate(`/my-bookings/${booking.id}`)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-red-500" />
                <span className="font-medium text-gray-800">#{booking.id}</span>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  booking.status === "Confirmed"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {booking.status}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <FaTruck className="text-gray-400" />
              <span>{booking.vehicle}</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <FaMapMarkerAlt className="text-gray-400" />
                <span className="text-gray-600">{booking.pickup}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FaMapMarkerAlt className="text-gray-400" />
                <span className="text-gray-600">{booking.delivery}</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {new Date(booking.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="text-gray-800 font-medium">
                  {booking.time}
                </span>
              </div>
            </div>
          </div>
        ))}

        {upcomingBookings.length === 0 && (
          <div className="text-center py-8">
            <FaCalendarAlt className="text-gray-400 text-4xl mx-auto mb-3" />
            <p className="text-gray-500">No upcoming bookings</p>
            <button
              onClick={() => navigate("/book-transport")}
              className="mt-4 text-blue-500 hover:text-blue-600 flex items-center gap-1 mx-auto"
            >
              Schedule a Transport
              <FaArrowRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingBookings;
