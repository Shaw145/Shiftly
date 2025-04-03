import { FaMoneyBillWave, FaTruck } from "react-icons/fa";

const PriceSection = ({ booking }) => {
  const isPending = booking.status === "pending";

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Price Details</h3>
      <div className="bg-white rounded-lg p-4">
        <div className="space-y-4">
          {/* Estimated Price Range */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaMoneyBillWave className="text-gray-400" />
              <span className="text-sm font-medium">Estimated Price</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">
              ₹{booking.estimatedPrice.min} - ₹{booking.estimatedPrice.max}
            </span>
          </div>

          {/* Divider */}
          <hr className="border-gray-200" />

          {/* Bidding Section */}
          {isPending && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700">
                Available Driver Bids
              </p>
              
              {/* Demo Bids - Replace with actual bids data */}
              <div className="space-y-2">
                {[
                  { id: 1, price: 15500, name: "Driver 1", rating: 4.5 },
                  { id: 2, price: 16000, name: "Driver 2", rating: 4.8 },
                ].map((bid) => (
                  <div
                    key={bid.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FaTruck className="text-gray-400" />
                      <div>
                        <p className="font-medium">{bid.name}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="text-yellow-500">★</span>
                          {bid.rating}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{bid.price}</p>
                      <button className="text-sm text-red-500 hover:text-red-600">
                        Select
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-500 text-center mt-2">
                Select a driver to proceed with booking
              </p>
            </div>
          )}

          {/* If not pending, show selected price */}
          {!isPending && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Final Price</span>
              <span className="text-lg font-semibold text-green-600">
                ₹16,000
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PriceSection;