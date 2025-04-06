import {
  FaRoute,
  FaMoneyBillWave,
  FaClipboardList,
  FaMapMarkedAlt,
  FaUser,
  FaStar,
  FaBell,
  FaHeadset,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const QuickActions = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("driverUsername");
  const notificationCount = 3; // This should come from your notification context/state

  const actions = [
    {
      icon: <FaRoute className="text-3xl" />,
      title: "Available Bookings",
      description: "Find new transport requests",
      link: "/available-bookings",
      color: "blue",
    },
    {
      icon: <FaClipboardList className="text-3xl" />,
      title: "My Bookings",
      description: "View active & completed trips",
      link: "/my-bookings",
      color: "purple",
    },
    {
      icon: <FaMoneyBillWave className="text-3xl" />,
      title: "Earnings & Payments",
      description: "Track earnings & withdraw",
      link: "/earnings",
      color: "green",
    },
    {
      icon: <FaStar className="text-3xl" />,
      title: "Rating & Feedback",
      description: "View your performance",
      link: "/ratings",
      color: "yellow",
    },
    {
      icon: <FaMapMarkedAlt className="text-3xl" />,
      title: "Live Tracking",
      description: "Track current deliveries",
      link: "/live-tracking",
      color: "red",
    },
    {
      icon: <FaUser className="text-3xl" />,
      title: "Profile",
      description: "View your profile",
      link: `/driver/profile/${username}`,
      color: "indigo",
    },
    {
      icon: (
        <div className="relative">
          <FaBell className="text-3xl" />
          {notificationCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </div>
      ),
      title: "Notifications",
      description: "View your alerts",
      link: "/notifications",
      color: "pink",
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
      indigo: "bg-indigo-500 text-white hover:bg-indigo-600",
      pink: "bg-pink-500 text-white hover:bg-pink-600",
      orange: "bg-orange-500 text-white hover:bg-orange-600",
    }[color]);

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 sm:mb-6">
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
