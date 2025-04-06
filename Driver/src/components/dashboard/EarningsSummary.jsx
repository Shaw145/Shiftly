import { useState } from "react";
import {
  FaChartLine,
  FaRupeeSign,
  FaArrowUp,
  FaArrowDown,
  FaClock,
  FaTruck,
  FaRoute,
  FaCalendarAlt,
} from "react-icons/fa";

const EarningsSummary = () => {
  const [timeframe, setTimeframe] = useState("weekly");

  const earningsData = {
    daily: {
      total: "2,500",
      trips: 8,
      hours: 10,
      avgPerTrip: "312",
      avgPerHour: "250",
      topEarning: "450",
      distance: "120",
      comparison: "+15%",
      isPositive: true,
    },
    weekly: {
      total: "15,000",
      trips: 45,
      hours: 58,
      avgPerTrip: "333",
      avgPerHour: "258",
      topEarning: "3,200",
      distance: "685",
      comparison: "+8%",
      isPositive: true,
    },
    monthly: {
      total: "58,000",
      trips: 180,
      hours: 220,
      avgPerTrip: "322",
      avgPerHour: "263",
      topEarning: "12,500",
      distance: "2,450",
      comparison: "-3%",
      isPositive: false,
    },
  };

  const timeframeOptions = [
    { value: "daily", label: "Today" },
    { value: "weekly", label: "This Week" },
    { value: "monthly", label: "This Month" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex flex-wrap justify-between items-center mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-red-50 rounded-lg">
            <FaChartLine className="text-red-500 text-xl" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Earnings Summary
            </h2>
            <p className="text-sm text-gray-500">Track your earnings growth</p>
          </div>
        </div>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          {timeframeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setTimeframe(option.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                timeframe === option.value
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-600">Total Earnings</p>
            <span
              className={`flex items-center text-sm ${
                earningsData[timeframe].isPositive
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {earningsData[timeframe].isPositive ? (
                <FaArrowUp className="mr-1" />
              ) : (
                <FaArrowDown className="mr-1" />
              )}
              {earningsData[timeframe].comparison}
            </span>
          </div>
          <div className="flex items-baseline">
            <FaRupeeSign className="text-2xl text-red-500 mr-1" />
            <span className="text-3xl font-bold text-gray-800">
              {earningsData[timeframe].total}
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-600">Total Trips</p>
            <FaTruck className="text-blue-500" />
          </div>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-gray-800">
              {earningsData[timeframe].trips}
            </span>
            <span className="text-gray-600 ml-2">trips</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-600">Hours Online</p>
            <FaClock className="text-green-500" />
          </div>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-gray-800">
              {earningsData[timeframe].hours}
            </span>
            <span className="text-gray-600 ml-2">hours</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-600">Distance Covered</p>
            <FaRoute className="text-purple-500" />
          </div>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-gray-800">
              {earningsData[timeframe].distance}
            </span>
            <span className="text-gray-600 ml-2">km</span>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-600">Average Per Trip</p>
            <FaRupeeSign className="text-gray-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            ₹{earningsData[timeframe].avgPerTrip}
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-600">Average Per Hour</p>
            <FaClock className="text-gray-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            ₹{earningsData[timeframe].avgPerHour}
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-600">Top Earning</p>
            <FaCalendarAlt className="text-gray-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            ₹{earningsData[timeframe].topEarning}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EarningsSummary;
