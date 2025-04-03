import BookingStatusBadge from "../myBookings/BookingStatusBadge";
import { FaTimes } from "react-icons/fa";

const Header = ({ booking, onCancelClick }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Booking #{booking.bookingId}
          </h1>
          <div className="flex items-center gap-3">
            <BookingStatusBadge status={booking.status} />
            <span className="text-gray-500">
              Created on {new Date(booking.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        {booking.status === "pending" && (
          <button
            onClick={onCancelClick}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors cursor-pointer"
          >
            <FaTimes />
            Cancel Booking
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
