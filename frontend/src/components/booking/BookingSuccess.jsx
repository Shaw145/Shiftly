import { Link } from "react-router-dom";
import { FaCheckCircle, FaArrowRight } from "react-icons/fa";
import { useEffect } from "react";

const BookingSuccess = ({ bookingId }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-[rgba(20,20,20,0.66)] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 text-center">
        <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-6" />
        <h2 className="text-2xl font-bold mb-4">Booking Successful!</h2>
        <p className="text-gray-600 mb-6">
          Your booking has been confirmed. Booking ID: #{bookingId}
        </p>
        <p className="text-gray-600 mb-8">
          You can track your booking and select a driver from the My Bookings
          page.
        </p>
        <Link
          to="/my-bookings"
          className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Go to My Bookings
          <FaArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default BookingSuccess;
