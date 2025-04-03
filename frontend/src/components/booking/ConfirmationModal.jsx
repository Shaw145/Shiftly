import {
  FaTruck,
  FaMapMarkerAlt,
  FaBox,
  FaCalendarAlt,
  FaRoute,
} from "react-icons/fa";
import { calculateBookingPrice } from "../../utils/priceCalculator";
import { useEffect } from "react";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, bookingDetails }) => {
  // Add useEffect to handle body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const priceDetails = calculateBookingPrice(bookingDetails);

  // Vehicle name mapping
  const vehicleNames = {
    mini: "Mini Truck (Tata Ace)",
    tempo: "Tempo (Mahindra Bolero)",
    large: "Large Truck (14ft)",
    container: "Container Truck (20-32ft)",
  };

  // Add goods type mapping
  const goodsTypeNames = {
    household_small: "Small Household Items (1-2 rooms)",
    household_medium: "Medium Household Items (2-3 rooms)",
    household_large: "Large Household Items (3+ rooms)",
    light: "Light Industrial Goods",
    heavy: "Heavy Industrial Goods",
  };

  return (
    <div className="fixed inset-0 bg-[rgba(20,20,20,0.66)] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Confirm Your Booking</h2>

        <div className="space-y-6">
          {/* Addresses */}
          <div className="border-b pb-4">
            <h3 className="font-semibold flex items-center gap-2 mb-3">
              <FaMapMarkerAlt className="text-red-500" />
              Locations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Pickup Address</p>
                <p className="text-gray-700">{bookingDetails.pickupAddress}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Delivery Address</p>
                <p className="text-gray-700">
                  {bookingDetails.deliveryAddress}
                </p>
              </div>
            </div>
          </div>

          {/* Add Goods Type before Items section */}
          <div className="border-b pb-4">
            <h3 className="font-semibold flex items-center gap-2 mb-3">
              <FaBox className="text-red-500" />
              Goods Type
            </h3>
            <p className="text-gray-700">
              {goodsTypeNames[bookingDetails.goodsType]}
            </p>
          </div>

          {/* Items */}
          <div className="border-b pb-4">
            <h3 className="font-semibold flex items-center gap-2 mb-3">
              <FaBox className="text-red-500" />
              Items
            </h3>
            <div className="space-y-2">
              {Object.entries(bookingDetails.items).map(([id, item]) => (
                <div key={id} className="flex justify-between">
                  <span>{item.name}</span>
                  <span>×{item.quantity}</span>
                </div>
              ))}
              {bookingDetails.additionalItems && (
                <div className="mt-2 text-sm text-gray-600">
                  <p className="font-medium">Additional Items:</p>
                  <p>{bookingDetails.additionalItems}</p>
                </div>
              )}
            </div>
          </div>

          {/* Vehicle & Schedule */}
          <div className="border-b pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <FaTruck className="text-red-500" />
                  Vehicle
                </h3>
                <p className="text-gray-700">
                  {vehicleNames[bookingDetails.vehicleType]}
                </p>
              </div>
              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <FaCalendarAlt className="text-red-500" />
                  Schedule
                </h3>
                <p className="text-gray-700">
                  {new Date(bookingDetails.date).toLocaleDateString()} at{" "}
                  {bookingDetails.time}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {bookingDetails.urgency.charAt(0).toUpperCase() +
                    bookingDetails.urgency.slice(1)}{" "}
                  Delivery
                </p>
              </div>
            </div>
          </div>

          {/* Add Distance Information */}
          <div className="flex items-center gap-2 mb-4">
            <FaRoute className="text-gray-400" />
            <div>
              <h3 className="font-semibold">Estimated Distance</h3>
              <p className="text-gray-700">
                {bookingDetails.distance} kilometers
              </p>
            </div>
          </div>

          {/* Price Estimate Section */}
          <div>
            <h3 className="font-semibold mb-3">Price Estimate</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Estimated Price Range
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{priceDetails.lowerRange} - ₹{priceDetails.upperRange}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Final price will be determined through competitive driver
                  bidding to ensure best value.
                </p>
              </div>
            </div>
            {bookingDetails.insurance !== "none" && (
              <p className="text-sm text-gray-600 mt-2">
                Includes {bookingDetails.insurance} insurance coverage
              </p>
            )}
            {bookingDetails.urgency !== "standard" && (
              <p className="text-sm text-gray-600 mt-1">
                Includes {bookingDetails.urgency} delivery charges
              </p>
            )}
          </div>

          {/* Add Special Instructions */}
          {bookingDetails.specialInstructions && (
            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold mb-2">Special Instructions</h3>
              <p className="text-gray-700">
                {bookingDetails.specialInstructions}
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
