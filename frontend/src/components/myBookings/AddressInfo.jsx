import { FaMapMarkerAlt } from "react-icons/fa";

const AddressInfo = ({ pickup, delivery }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Location Details</h3>
      <div className="space-y-4">
        {/* Pickup Address */}
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <FaMapMarkerAlt className="text-red-500" />
            </div>
            <div>
              <p className="font-medium">Pickup Location</p>
              <div className="text-gray-600 text-sm mt-1">
                <p>{pickup.street}</p>
                <p>
                  {pickup.city}, {pickup.state} - {pickup.pincode}
                </p>
                {pickup.landmark && (
                  <p className="text-gray-500 mt-1">
                    Landmark: {pickup.landmark}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <FaMapMarkerAlt className="text-green-500" />
            </div>
            <div>
              <p className="font-medium">Delivery Location</p>
              <div className="text-gray-600 text-sm mt-1">
                <p>{delivery.street}</p>
                <p>
                  {delivery.city}, {delivery.state} - {delivery.pincode}
                </p>
                {delivery.landmark && (
                  <p className="text-gray-500 mt-1">
                    Landmark: {delivery.landmark}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressInfo;