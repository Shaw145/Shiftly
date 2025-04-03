import { FaMapMarkerAlt } from "react-icons/fa";

const AddressSection = ({ booking }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Location Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pickup Address */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-red-600">
            <FaMapMarkerAlt />
            <h3 className="font-semibold">Pickup Location</h3>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-900">{booking.pickup.street}</p>
            <p className="text-gray-600">
              {booking.pickup.city}, {booking.pickup.state}
            </p>
            <p className="text-gray-600">PIN: {booking.pickup.pincode}</p>
            {booking.pickup.landmark && (
              <p className="text-gray-500 mt-1">
                Landmark: {booking.pickup.landmark}
              </p>
            )}
          </div>
        </div>

        {/* Delivery Address */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-green-600">
            <FaMapMarkerAlt />
            <h3 className="font-semibold">Delivery Location</h3>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-900">{booking.delivery.street}</p>
            <p className="text-gray-600">
              {booking.delivery.city}, {booking.delivery.state}
            </p>
            <p className="text-gray-600">PIN: {booking.delivery.pincode}</p>
            {booking.delivery.landmark && (
              <p className="text-gray-500 mt-1">
                Landmark: {booking.delivery.landmark}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressSection;
