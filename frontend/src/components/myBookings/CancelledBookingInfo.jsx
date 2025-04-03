import { FaTimesCircle } from "react-icons/fa";

const CancelledBookingInfo = ({ booking }) => {
  return (
    <div className="bg-red-50 rounded-xl p-6 border border-red-100">
      <div className="flex items-center gap-3 mb-4">
        <FaTimesCircle className="text-red-500 text-2xl" />
        <div>
          <h3 className="font-semibold text-red-700">Booking Cancelled</h3>
          <p className="text-sm text-red-600">
            Cancelled on {new Date(booking.cancelledAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      {booking.cancellationReason && (
        <p className="text-sm text-red-600">
          Reason: {booking.cancellationReason}
        </p>
      )}
    </div>
  );
};

export default CancelledBookingInfo;