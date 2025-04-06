import {
  FaStar,
  FaCheck,
  FaTimes,
  FaChartLine,
  FaThumbsUp,
  FaClock,
  FaTruck,
  FaUsers,
} from "react-icons/fa";

const PerformanceMetrics = ({ driver }) => {
  const metrics = {
    rating: {
      current: driver?.rating || 4.8,
      total: driver?.totalRatings || 150,
      recent: driver?.recentRating || 5.0,
    },
    completion: {
      rate: driver?.completionRate || 95,
      total: driver?.completedTrips || 285,
      streak: driver?.currentStreak || 15,
    },
    cancellation: {
      rate: driver?.cancellationRate || 5,
      total: driver?.cancelledTrips || 15,
      lastCancelled: driver?.lastCancelled || "7 days ago",
    },
    feedback: {
      positive: driver?.positiveFeedback || 98,
      total: driver?.totalFeedback || 200,
      badges: driver?.badges || 12,
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <FaChartLine className="text-blue-500 text-xl" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Performance Metrics
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Your service quality overview
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {/* Rating Card */}
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <span className="text-sm sm:text-base text-gray-600">Rating</span>
            <FaStar className="text-yellow-500" />
          </div>
          <div className="mb-3 sm:mb-4">
            <div className="flex items-baseline">
              <span className="text-2xl sm:text-3xl font-bold text-gray-800">
                {metrics.rating.current}
              </span>
              <span className="text-yellow-500 ml-2">/5.0</span>
            </div>
            <div className="flex mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`w-3 h-3 sm:w-4 sm:h-4 ${
                    star <= Math.floor(metrics.rating.current)
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="text-xs sm:text-sm text-gray-600">
            Based on {metrics.rating.total} ratings
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <span className="text-sm sm:text-base text-gray-600">
              Completion Rate
            </span>
            <FaCheck className="text-green-500" />
          </div>
          <div className="mb-3 sm:mb-4">
            <span className="text-2xl sm:text-3xl font-bold text-gray-800">
              {metrics.completion.rate}%
            </span>
          </div>
          <div className="text-xs sm:text-sm text-gray-600">
            {metrics.completion.total} completed trips
            <div className="mt-1 text-green-600">
              {metrics.completion.streak} trip streak
            </div>
          </div>
        </div>

        {/* Cancellation Rate */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <span className="text-sm sm:text-base text-gray-600">
              Cancellation Rate
            </span>
            <FaTimes className="text-red-500" />
          </div>
          <div className="mb-3 sm:mb-4">
            <span className="text-2xl sm:text-3xl font-bold text-gray-800">
              {metrics.cancellation.rate}%
            </span>
          </div>
          <div className="text-xs sm:text-sm text-gray-600">
            {metrics.cancellation.total} cancelled trips
            <div className="mt-1">
              Last cancelled: {metrics.cancellation.lastCancelled}
            </div>
          </div>
        </div>

        {/* Customer Feedback */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <span className="text-sm sm:text-base text-gray-600">
              Customer Feedback
            </span>
            <FaThumbsUp className="text-purple-500" />
          </div>
          <div className="mb-3 sm:mb-4">
            <span className="text-2xl sm:text-3xl font-bold text-gray-800">
              {metrics.feedback.positive}%
            </span>
          </div>
          <div className="text-xs sm:text-sm text-gray-600">
            Positive feedback from {metrics.feedback.total} customers
            <div className="mt-1">
              {metrics.feedback.badges} achievement badges
            </div>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mt-3 sm:mt-6">
        <div className="bg-gray-50 rounded-xl p-3 sm:p-4 flex items-center space-x-3 sm:space-x-4">
          <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
            <FaClock className="text-blue-500 text-base sm:text-lg" />
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-600">
              Average Response Time
            </p>
            <p className="text-base sm:text-lg font-semibold text-gray-800">
              2.5 mins
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-3 sm:p-4 flex items-center space-x-3 sm:space-x-4">
          <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
            <FaTruck className="text-green-500 text-base sm:text-lg" />
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-600">On-Time Delivery</p>
            <p className="text-base sm:text-lg font-semibold text-gray-800">
              97%
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-3 sm:p-4 flex items-center space-x-3 sm:space-x-4">
          <div className="p-2 sm:p-3 bg-purple-100 rounded-lg">
            <FaUsers className="text-purple-500 text-base sm:text-lg" />
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-600">Repeat Customers</p>
            <p className="text-base sm:text-lg font-semibold text-gray-800">
              45%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;
