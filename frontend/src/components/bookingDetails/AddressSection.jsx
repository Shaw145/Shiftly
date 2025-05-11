import { FaMapMarkerAlt } from "react-icons/fa";

const AddressSection = ({ booking }) => {
  // Helper function to safely access properties with fallbacks
  const safelyGetAddress = (addressObj, type) => {
    // Default address info
    const defaultAddress = {
      street: type === 'pickup' ? 'Pickup address' : 'Delivery address',
      city: 'City',
      state: 'State',
      pincode: '000000',
      landmark: '',
    };

    // If address field doesn't exist or is null
    if (!addressObj) return defaultAddress;

    try {
      // If it's a MongoDB document with documents field
      if (addressObj.documents) {
        console.warn(`Found MongoDB document in ${type} address, using safe values`);
        return defaultAddress;
      }

      // Handle standard address object
      return {
        street: addressObj.street || addressObj.address || defaultAddress.street,
        city: addressObj.city || defaultAddress.city,
        state: addressObj.state || defaultAddress.state,
        pincode: addressObj.pincode || addressObj.zipcode || addressObj.postalCode || defaultAddress.pincode,
        landmark: addressObj.landmark || '',
      };
    } catch (error) {
      console.error(`Error accessing ${type} address:`, error);
      return defaultAddress;
    }
  };

  // Get safe address objects
  const pickup = safelyGetAddress(booking?.pickup, 'pickup');
  const delivery = safelyGetAddress(booking?.delivery, 'delivery');

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
            <p className="text-gray-900">{pickup.street}</p>
            <p className="text-gray-600">
              {pickup.city}, {pickup.state}
            </p>
            <p className="text-gray-600">PIN: {pickup.pincode}</p>
            {pickup.landmark && (
              <p className="text-gray-500 mt-1">
                Landmark: {pickup.landmark}
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
            <p className="text-gray-900">{delivery.street}</p>
            <p className="text-gray-600">
              {delivery.city}, {delivery.state}
            </p>
            <p className="text-gray-600">PIN: {delivery.pincode}</p>
            {delivery.landmark && (
              <p className="text-gray-500 mt-1">
                Landmark: {delivery.landmark}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressSection;
