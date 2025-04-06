import {
  FaRoute,
  FaStar,
  FaTruck,
  FaMoneyBillWave,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";

const StatsCard = ({ driver }) => {
  const stats = [
    {
      icon: <FaRoute className="text-xl sm:text-2xl" />,
      title: "Total Trips",
      value: driver?.totalTrips || "285",
      color: "blue",
    },
    {
      icon: <FaStar className="text-xl sm:text-2xl" />,
      title: "Rating",
      value: `${driver?.rating || "4.8"}/5`,
      color: "yellow",
    },
    {
      icon: <FaMoneyBillWave className="text-xl sm:text-2xl" />,
      title: "Monthly Earnings",
      value: `₹${driver?.monthlyEarnings || "45,000"}`,
      color: "green",
    },
    {
      icon: <FaCheckCircle className="text-xl sm:text-2xl" />,
      title: "Completion Rate",
      value: `${driver?.completionRate || "98"}%`,
      color: "purple",
    },
    {
      icon: <FaClock className="text-xl sm:text-2xl" />,
      title: "Online Hours",
      value: driver?.onlineHours || "180h",
      color: "red",
    },
    {
      icon: <FaTruck className="text-xl sm:text-2xl" />,
      title: "Vehicle Status",
      value: driver?.vehicleStatus || "Active",
      color: "indigo",
    },
  ];

  const getColorClasses = (color) =>
    ({
      blue: {
        bg: "bg-blue-50",
        text: "text-blue-600",
        icon: "text-blue-500",
      },
      yellow: {
        bg: "bg-yellow-50",
        text: "text-yellow-600",
        icon: "text-yellow-500",
      },
      green: {
        bg: "bg-green-50",
        text: "text-green-600",
        icon: "text-green-500",
      },
      purple: {
        bg: "bg-purple-50",
        text: "text-purple-600",
        icon: "text-purple-500",
      },
      red: {
        bg: "bg-red-50",
        text: "text-red-600",
        icon: "text-red-500",
      },
      indigo: {
        bg: "bg-indigo-50",
        text: "text-indigo-600",
        icon: "text-indigo-500",
      },
    }[color]);

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 h-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 sm:mb-6">
        Performance Overview
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {stats.map((stat, index) => {
          const colors = getColorClasses(stat.color);
          return (
            <div
              key={index}
              className={`${colors.bg} rounded-xl p-3 sm:p-4 transition-all duration-200 hover:shadow-md`}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center mb-2 sm:mb-3">
                  <div className="p-2 sm:p-2.5 bg-white rounded-lg">
                    <div className={colors.icon}>{stat.icon}</div>
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 mb-1 line-clamp-1">
                    {stat.title}
                  </p>
                  <p
                    className={`text-base sm:text-lg lg:text-xl font-bold ${colors.text} break-words`}
                  >
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatsCard;
