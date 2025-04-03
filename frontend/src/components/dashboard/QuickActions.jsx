import {
  FaTruck,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaHeadset,
  FaUserFriends,
  FaCog,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      icon: <FaCalendarAlt size={24} />,
      label: "Book Transport",
      description: "Schedule a new transport",
      color: "bg-red-500",
      path: "/book-transport",
    },
    {
      icon: <FaTruck size={24} />,
      label: "My Bookings",
      description: "View all your bookings",
      color: "bg-green-500",
      path: "/my-bookings",
    },
    {
      icon: <FaMapMarkerAlt size={24} />,
      label: "Live Tracking",
      description: "Track your shipments",
      color: "bg-purple-500",
      path: "/live-tracking",
    },
    {
      icon: <FaHeadset size={24} />,
      label: "Help & Support",
      description: "Get assistance",
      color: "bg-orange-500",
      path: "/support",
    },
    {
      icon: <FaUserFriends size={24} />,
      label: "Drivers",
      description: "View driver profiles",
      color: "bg-red-500",
      path: "/drivers",
    },
    {
      icon: <FaCog size={24} />,
      label: "Settings",
      description: "Account settings",
      color: "bg-gray-500",
      path: "/settings",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <div className="flex flex-col gap-2 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
          Quick Actions
        </h2>
        <p className="text-sm text-gray-500">Access your most used features</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => navigate(action.path)}
            className="group flex flex-col items-center p-3 sm:p-4 lg:p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 border border-gray-100 cursor-pointer"
          >
            <div
              className={`${action.color} text-white p-2 sm:p-3 lg:p-4 rounded-full mb-2 sm:mb-3 lg:mb-4 group-hover:scale-110 transition-transform duration-200`}
            >
              {action.icon}
            </div>
            <span className="font-medium text-gray-800 text-sm sm:text-base mb-1 sm:mb-2 text-center">
              {action.label}
            </span>
            <span className="text-xs sm:text-sm text-gray-500 text-center">
              {action.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
