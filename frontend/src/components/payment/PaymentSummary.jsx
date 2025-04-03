import { FaTruck, FaMapMarkerAlt, FaMoneyBillWave } from "react-icons/fa";
import { calculateBookingPrice } from "../../utils/priceCalculator";

const PaymentSummary = ({ booking, driver }) => {
  const totalPrice = driver.price;
  const gstAmount = Math.round(totalPrice * 0.18);
  const baseAmount = Math.round(totalPrice - gstAmount);

  // Calculate component percentages of base amount
  const baseFare = Math.round(baseAmount * 0.4);
  const distanceCharge = Math.round(baseAmount * 0.3);
  const goodsFee = Math.round(baseAmount * 0.2);

  // Calculate additional charges
  const insuranceCost =
    booking.schedule?.insurance === "basic"
      ? 100
      : booking.schedule?.insurance === "full"
      ? 200
      : 0;

  const urgencyCharge =
    booking.schedule?.urgency === "express"
      ? Math.round(baseAmount * 0.1)
      : booking.schedule?.urgency === "priority"
      ? Math.round(baseAmount * 0.2)
      : 0;

  const formatAddress = (location) => {
    const parts = [];
    if (location.street) parts.push(location.street);
    if (location.city) parts.push(location.city);
    if (location.state) parts.push(location.state);
    if (location.pincode) parts.push(location.pincode);
    return parts.join(", ");
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Booking Summary</h2>

      {/* Pickup & Delivery */}
      <div className="space-y-4 mb-6">
        <div>
          <div className="flex items-start gap-2">
            <FaMapMarkerAlt className="text-red-500 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Pickup Location</p>
              <p className="font-medium text-gray-900">
                {formatAddress(booking.pickup)}
              </p>
              {booking.pickup.landmark && (
                <p className="text-sm text-gray-500">
                  Near {booking.pickup.landmark}
                </p>
              )}
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-start gap-2">
            <FaMapMarkerAlt className="text-green-500 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Delivery Location</p>
              <p className="font-medium text-gray-900">
                {formatAddress(booking.delivery)}
              </p>
              {booking.delivery.landmark && (
                <p className="text-sm text-gray-500">
                  Near {booking.delivery.landmark}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div className="border-t border-gray-100 pt-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Schedule Details</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Date</span>
            <span className="text-gray-900">
              {new Date(booking.schedule.date).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Time</span>
            <span className="text-gray-900">{booking.schedule.time}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Vehicle Type</span>
            <span className="text-gray-900">{booking.vehicle}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Booking ID</span>
            <span className="text-gray-900">
              #
              {booking.bookingId ||
                "B" + booking._id.substring(booking._id.length - 9)}
            </span>
          </div>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="border-t border-gray-100 pt-4">
        <h3 className="font-semibold text-gray-900 mb-3">Price Details</h3>

        {/* Estimated Price Range */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-700">
            Estimated Price Range: ₹{booking.estimatedPrice?.min || 0} - ₹
            {booking.estimatedPrice?.max || 0}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Final Price: ₹{totalPrice}
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Base Fare</span>
            <span className="text-gray-900">₹{baseFare}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">
              Distance Charge ({booking.distance} km)
            </span>
            <span className="text-gray-900">₹{distanceCharge}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Goods Handling Fee</span>
            <span className="text-gray-900">₹{goodsFee}</span>
          </div>

          {/* Always show insurance */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Insurance Coverage</span>
            <span className="text-gray-900">
              {booking.schedule?.insurance === "none"
                ? "No Insurance (₹0)"
                : booking.schedule?.insurance === "basic"
                ? `Basic Coverage (₹${insuranceCost})`
                : `Full Coverage (₹${insuranceCost})`}
            </span>
          </div>

          {/* Always show urgency */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Delivery Speed</span>
            <span className="text-gray-900">
              {booking.schedule?.urgency === "standard"
                ? "Standard (No Extra Charge)"
                : booking.schedule?.urgency === "express"
                ? `Express (₹${urgencyCharge})`
                : `Priority (₹${urgencyCharge})`}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">GST (18%)</span>
            <span className="text-gray-900">₹{gstAmount}</span>
          </div>

          <div className="border-t pt-3 mt-3">
            <div className="flex justify-between items-center font-bold">
              <span className="text-gray-900">Total Amount</span>
              <span className="text-xl text-red-600">₹{totalPrice}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummary;
