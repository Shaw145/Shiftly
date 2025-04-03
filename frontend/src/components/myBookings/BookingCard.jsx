import { useNavigate } from "react-router-dom";
import {
  FaTruck,
  FaMapMarkerAlt,
  FaCalendar,
  FaBox,
  FaArrowRight,
} from "react-icons/fa";
import BookingStatusBadge from "./BookingStatusBadge";

const BookingCard = ({ booking }) => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
      onClick={() => navigate(`/my-bookings/${booking.bookingId}`)}
    >
      <div className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Booking ID</span>
              <span className="font-semibold">#{booking.bookingId}</span>
            </div>
            <BookingStatusBadge status={booking.status} />
          </div>

          <div className="flex items-center gap-2">
            <FaCalendar className="text-gray-400" />
            <span className="text-sm text-gray-600">
              {new Date(booking.schedule.date).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="w-0.5 h-12 bg-gray-300 mx-auto"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <p className="font-medium">{booking.pickup.city}</p>
                  <p className="text-gray-500 text-sm truncate max-w-xs">
                    {booking.pickup.street}
                  </p>
                </div>
                <div>
                  <p className="font-medium">{booking.delivery.city}</p>
                  <p className="text-gray-500 text-sm truncate max-w-xs">
                    {booking.delivery.street}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 md:border-l md:pl-6">
            <div className="flex items-center gap-2">
              <FaTruck className="text-gray-400" />
              <span className="text-sm capitalize">{booking.vehicle}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaBox className="text-gray-400" />
              <span className="text-sm capitalize">
                {booking.goods.type.replace(/_/g, " ")}
              </span>
            </div>
            <div className="text-sm font-medium text-red-500">
              ₹{booking.estimatedPrice.min} - ₹{booking.estimatedPrice.max}
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button className="text-red-500 hover:text-red-600 flex items-center gap-2 text-sm font-medium">
            View Details <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
