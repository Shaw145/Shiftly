import { FaChartLine, FaTruck, FaMapMarkedAlt } from "react-icons/fa";

const StatisticsCard = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Platform Statistics</h2>
        <FaChartLine className="text-red-500 text-2xl" />
      </div>

      <div className="space-y-4">
        {/* Today's Bookings */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FaTruck className="text-red-500" />
              <span className="text-sm text-gray-600">Today's Bookings</span>
            </div>
            <span className="text-sm text-gray-500">Your Area</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-800">15+</span>
            <span className="text-sm text-green-500">↑ 12%</span>
          </div>
        </div>

        {/* Total Bookings */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FaMapMarkedAlt className="text-red-500" />
              <span className="text-sm text-gray-600">Total Bookings</span>
            </div>
            <span className="text-sm text-gray-500">India</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-800">1K+</span>
            <span className="text-sm text-green-500">↑ 8%</span>
          </div>
        </div>

        {/* Monthly Shipments */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FaTruck className="text-red-500" />
              <span className="text-sm text-gray-600">Monthly Shipments</span>
            </div>
            <span className="text-sm text-gray-500">This Month</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-800">10K+</span>
            <span className="text-sm text-green-500">↑ 15%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsCard;
