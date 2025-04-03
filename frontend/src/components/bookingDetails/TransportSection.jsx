import { FaTruck } from "react-icons/fa";

const TransportSection = ({ booking }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Transport Details
      </h3>
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <FaTruck className="text-gray-400 text-xl" />
          <div>
            <p className="font-medium text-gray-900">{booking.vehicle}</p>
            <p className="text-sm text-gray-600 mt-1">
              Total Distance: {booking.distance} km
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransportSection;
