import { FaInfoCircle, FaUserCircle, FaStar, FaTruck } from "react-icons/fa";
import { format } from "date-fns";

const generateRandomPrice = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const PendingBookingSection = ({ booking, onDriverSelect }) => {
  // Generate random driver bids within the estimated price range
  const dummyDrivers = [
    {
      id: "1",
      name: "Rahul Singh",
      rating: 4.5,
      trips: 120,
      vehicle: "Tata Ace",
      price: generateRandomPrice(
        booking.estimatedPrice.min,
        booking.estimatedPrice.max
      ),
    },
    {
      id: "2",
      name: "Amit Kumar",
      rating: 4.8,
      trips: 200,
      vehicle: "Mahindra Pickup",
      price: generateRandomPrice(
        booking.estimatedPrice.min,
        booking.estimatedPrice.max
      ),
    },
  ];

  return (
    <div className="mb-6 bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold text-gray-900">Driver Bidding</h2>
            <p className="mt-2 text-gray-600">
              Select from available driver bids for your transport
            </p>
          </div>
          <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg">
            <p className="text-lg font-medium text-gray-900">Estimated Price</p>
            <p className="text-3xl font-bold text-red-600">
              ₹{booking.estimatedPrice.min} - ₹{booking.estimatedPrice.max}
            </p>
          </div>
        </div>

        <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
          <div className="flex items-start">
            <FaInfoCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
            <div className="ml-3">
              <p className="text-sm text-yellow-700 font-medium">
                Important Notice
              </p>
              <p className="mt-1 text-sm text-yellow-600">
                To ensure timely service, please select your preferred driver at
                least 24 hours before your scheduled pickup time. If no
                selection is made, our system will automatically assign the most
                suitable driver based on rating and price to ensure your booking
                proceeds smoothly.
              </p>
              <p className="mt-2 text-sm font-medium text-yellow-700">
                Pickup scheduled for:{" "}
                {format(new Date(booking.schedule.date), "PPP")} at{" "}
                {booking.schedule.time}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {dummyDrivers.map((driver) => (
            <div
              key={driver.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:border-red-500 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
                    <FaUserCircle className="w-12 h-12 text-gray-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {driver.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      {driver.rating}
                    </div>
                    <span>•</span>
                    <span>{driver.trips} trips</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    <FaTruck className="inline mr-1" />
                    {driver.vehicle}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{driver.price}
                    </p>
                    <button
                      onClick={() => onDriverSelect(driver)}
                      className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
                    >
                      Select
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PendingBookingSection;
