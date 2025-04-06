import {
  FaTruck,
  FaRoute,
  FaMoneyBillWave,
  FaStar,
  FaShareSquare,
  FaCheckCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const WelcomeCard = ({ driver }) => {
  const navigate = useNavigate();
  const isFirstTime = !driver?.totalTrips;

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 h-full">
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full -mr-32 -mt-32 opacity-50" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-50 rounded-full -ml-24 -mb-24 opacity-50" />

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                {isFirstTime ? "Welcome to Shiftly, Partner!" : "Great to See You Back!"}
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                {isFirstTime
                  ? "Your journey as a trusted transport partner begins now - let's move India's goods together!"
                  : "Ready for another successful day of deliveries?"}
              </p>
            </div>
            <div className="hidden sm:block">
              <FaTruck className="text-4xl sm:text-5xl text-red-500" />
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="bg-gradient-to-r from-red-50 to-red-100 p-3 sm:p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <FaRoute className="text-red-500 text-lg sm:text-xl" />
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Today's Goal
                  </p>
                  <p className="text-base sm:text-lg font-semibold text-gray-800">
                    {driver?.dailyGoal || "5"} Deliveries
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 sm:p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <FaTruck className="text-blue-500 text-lg sm:text-xl" />
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Vehicle Status
                  </p>
                  <p className="text-base sm:text-lg font-semibold text-gray-800">
                    Ready to Go
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 sm:p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <FaMoneyBillWave className="text-green-500 text-lg sm:text-xl" />
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Today's Earnings
                  </p>
                  <p className="text-base sm:text-lg font-semibold text-gray-800">
                    ₹{driver?.todayEarnings || "2,500"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex items-center p-3 sm:p-4 bg-gray-50 rounded-lg">
              <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                <FaStar className="text-yellow-500 text-base sm:text-lg" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600">Rating</p>
                <div className="flex items-center">
                  <p className="text-base sm:text-lg font-semibold text-gray-800 mr-2 whitespace-nowrap">
                    {driver?.rating || "4.8"}
                  </p>
                  <div className="hidden sm:flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={`w-3 h-3 ${
                          star <= Math.floor(driver?.rating || 4.8)
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center p-3 sm:p-4 bg-gray-50 rounded-lg">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <FaCheckCircle className="text-green-500 text-base sm:text-lg" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">
                  Completion Rate
                </p>
                <p className="text-base sm:text-lg font-semibold text-gray-800">
                  {driver?.completionRate || "98"}%
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <button
              onClick={() => navigate("/available-bookings")}
              className="w-full bg-red-500 text-white px-3 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium sm:font-semibold hover:bg-red-600 transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
            >
              <span className="whitespace-nowrap">Find Bookings</span>
              <FaTruck className="text-lg sm:text-xl" />
            </button>
            <button
              onClick={() => navigate("/how-it-works")}
              className="w-full border-2 border-gray-200 text-gray-700 px-3 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium sm:font-semibold hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
            >
              <span className="whitespace-nowrap">How It Works</span>
              <FaShareSquare className="text-lg sm:text-xl" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;
