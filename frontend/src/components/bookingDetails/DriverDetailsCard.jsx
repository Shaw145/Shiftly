import { FaUserCircle, FaStar } from "react-icons/fa";
import LiveTrackingButton from "../tracking/LiveTrackingButton";

const DriverDetailsCard = ({ booking }) => {
  // Use either driverId or driver object, with fallback values
  const driverDetails = booking.driverId ||
    booking.driver || {
      name: "Test Driver",
      vehicle: "Tata Ace",
      rating: 4.5,
      trips: 150,
    };

  return (
    <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        Driver Details
      </h3>
      {booking.status === "confirmed" && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <FaUserCircle className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{driverDetails.name}</p>
              <p className="text-sm text-gray-600">{driverDetails.vehicle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaStar className="text-yellow-400" />
            <span>{driverDetails.rating}</span>
            <span>•</span>
            <span>{driverDetails.trips}+ trips</span>
          </div>
          <div className="mt-4">
            <LiveTrackingButton bookingId={booking.bookingId} />
          </div>
        </div>
      )}
      {booking.status !== "confirmed" && (
        <p className="text-gray-600">
          Driver details will appear here once booking is confirmed
        </p>
      )}
    </div>
  );
};

export default DriverDetailsCard;
