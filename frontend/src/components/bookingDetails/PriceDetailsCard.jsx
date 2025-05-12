import { calculateBookingPrice } from "../../utils/priceCalculator";

const PriceDetailsCard = ({ booking }) => {
  // Helper function to safely get payment amount
  const safelyGetAmount = () => {
    try {
      // console.log("Booking price data:", {
      //   finalPrice: booking.finalPrice,
      //   payment: booking.payment,
      //   price: booking.price,
      //   driverId: booking.driverId,
      //   acceptedBid: booking.acceptedBid,
      //   driverBids: booking.driverBids,
      // });

      // First check for finalPrice (most reliable source)
      if (booking.finalPrice && !isNaN(parseFloat(booking.finalPrice))) {
        return parseFloat(booking.finalPrice);
      }

      // If we have a payment object with amount
      if (
        booking.payment &&
        booking.payment.amount &&
        !isNaN(parseFloat(booking.payment.amount))
      ) {
        return parseFloat(booking.payment.amount);
      }

      // Direct price property
      if (booking.price && !isNaN(parseFloat(booking.price))) {
        return parseFloat(booking.price);
      }

      // If we have a payment ID with an amount
      if (booking.paymentId) {
        // Handle case where paymentId is an object with amount
        if (typeof booking.paymentId === "object" && booking.paymentId.amount) {
          return parseFloat(booking.paymentId.amount);
        }
      }

      // Try to get price from driver's bid
      if (booking.driverId) {
        if (typeof booking.driverId === "object" && booking.driverId.price) {
          return parseFloat(booking.driverId.price);
        }
      }

      // Check for acceptedBid
      if (booking.acceptedBid && booking.acceptedBid.amount) {
        return parseFloat(booking.acceptedBid.amount);
      }

      if (booking.acceptedBid && booking.acceptedBid.price) {
        return parseFloat(booking.acceptedBid.price);
      }

      // Check for driver bids with accepted status
      if (booking.driverBids && Array.isArray(booking.driverBids)) {
        const acceptedBid = booking.driverBids.find(
          (bid) => bid.status === "accepted"
        );
        if (acceptedBid && acceptedBid.price) {
          return parseFloat(acceptedBid.price);
        }
      }

      // If there's a driver assigned, assume the price is at least the min estimated price
      if (
        (booking.status === "confirmed" ||
          booking.status === "inTransit" ||
          booking.status === "completed") &&
        booking.estimatedPrice?.min
      ) {
        return parseFloat(booking.estimatedPrice.min);
      }

      return 0;
    } catch (error) {
      console.error("Error extracting price information", error);
      return 0;
    }
  };

  // Get the total price for all non-pending bookings
  const totalPrice = safelyGetAmount() || 0;

  // Only show price range for pending bookings
  if (booking.status === "pending") {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Price Details</h2>
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            Estimated Price Range: ₹{booking.estimatedPrice?.min || 0} - ₹
            {booking.estimatedPrice?.max || 0}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Final price will be determined after driver selection
          </p>
        </div>
      </div>
    );
  }

  // For confirmed bookings, show the price breakdown
  if (
    booking.status === "confirmed" ||
    booking.status === "inTransit" ||
    booking.status === "in_transit" ||
    booking.status === "completed"
  ) {
    // Calculate GST and base amount
    const gstAmount = Math.round(totalPrice * 0.18);
    const baseAmount = Math.round(totalPrice - gstAmount);

    // Calculate component percentages of base amount (excluding insurance and urgency)
    const baseSubtotal =
      baseAmount -
      (booking.schedule?.insurance === "basic"
        ? 100
        : booking.schedule?.insurance === "full"
        ? 200
        : 0);

    const baseFare = Math.round(baseSubtotal * 0.4);
    const distanceCharge = Math.round(baseSubtotal * 0.3);
    const goodsFee = Math.round(baseSubtotal * 0.2);

    // Calculate additional charges
    const insuranceCost =
      booking.schedule?.insurance === "basic"
        ? 100
        : booking.schedule?.insurance === "full"
        ? 200
        : 0;

    const urgencyMultiplier =
      booking.schedule?.urgency === "express"
        ? 0.1
        : booking.schedule?.urgency === "priority"
        ? 0.2
        : 0;

    const urgencyCharge = Math.round(baseSubtotal * urgencyMultiplier);

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Price Details</h2>

        {/* Show estimated price range for reference */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-700">
            Estimated Price Range: ₹{booking.estimatedPrice?.min || 0} - ₹
            {booking.estimatedPrice?.max || 0}
          </p>
          <p className="text-sm font-semibold text-blue-800 mt-1">
            Final Price: ₹{totalPrice.toLocaleString("en-IN")}
          </p>
          {booking.finalPrice ? (
            <p className="text-xs text-blue-600 mt-1">
              Payment completed. This is the final amount charged.
            </p>
          ) : (
            <p className="text-xs text-blue-600 mt-1">
              This is the confirmed price for your booking.
            </p>
          )}
        </div>

        {/* Price Breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Base Fare</span>
            <span className="text-gray-900">₹{baseFare}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">
              Distance Charge ({booking.distance || "N/A"} km)
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
    );
  }

  // Fallback for other cases
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Price Details</h2>
      <p className="text-gray-600">Price information not available</p>
    </div>
  );
};

export default PriceDetailsCard;
