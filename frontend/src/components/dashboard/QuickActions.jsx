import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaHeadset,
  FaUserFriends,
  FaClipboardList,
  FaCog,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      icon: <FaCalendarAlt className="text-3xl" />,
      title: "Book Transport",
      description: "Schedule new shipment",
      link: "/book-transport",
      color: "blue",
    },
    {
      icon: <FaClipboardList className="text-3xl" />,
      title: "My Bookings",
      description: "View all shipments",
      link: "/my-bookings",
      color: "purple",
    },
    {
      icon: <FaMapMarkerAlt className="text-3xl" />,
      title: "Live Tracking",
      description: "Track your shipments",
      link: "/live-tracking",
      color: "green",
    },
    {
      icon: <FaUserFriends className="text-3xl" />,
      title: "Find Drivers",
      description: "View available drivers",
      link: "/drivers",
      color: "red",
    },
    {
      icon: <FaCog className="text-3xl" />,
      title: "Settings",
      description: "Account settings",
      link: "/settings",
      color: "yellow",
    },
    {
      icon: <FaHeadset className="text-3xl" />,
      title: "Support",
      description: "Get help & support",
      link: "/support",
      color: "orange",
    },
  ];

  const getColorClasses = (color) =>
    ({
      blue: "bg-blue-500 text-white hover:bg-blue-600",
      purple: "bg-purple-500 text-white hover:bg-purple-600",
      green: "bg-green-500 text-white hover:bg-green-600",
      yellow: "bg-yellow-500 text-white hover:bg-yellow-600",
      red: "bg-red-500 text-white hover:bg-red-600",
      orange: "bg-orange-500 text-white hover:bg-orange-600",
    }[color]);

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
      <div className="flex flex-col gap-2 mb-6">
        <h2 className="text-xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
          Quick Actions
        </h2>
        <p className="text-sm text-gray-500">Access your most used features</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => navigate(action.link)}
            className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-lg cursor-pointer"
          >
            <div className={`p-4 sm:p-6 ${getColorClasses(action.color)}`}>
              <div className="absolute top-0 right-0 -mr-8 -mt-8 bg-white/10 w-32 h-32 rounded-full transition-all duration-300 group-hover:scale-150" />
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="relative mb-3 sm:mb-4">{action.icon}</div>
                <h3 className="font-semibold text-base sm:text-lg mb-1">
                  {action.title}
                </h3>
                <p className="text-xs sm:text-sm text-white/80">
                  {action.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
