import { forwardRef } from "react";
import {
  FaHome,
  FaBookmark,
  FaCalendarAlt,
  FaMapMarkedAlt,
  FaMoneyBillWave,
  FaStar,
  FaCog,
  FaSignOutAlt,
  FaBell,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useSwipe from "../../hooks/useSwipe";

const Sidebar = forwardRef(({ isSidebarOpen, toggleSidebar }, ref) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("driverToken");
    localStorage.removeItem("driverName");
    localStorage.removeItem("driverUsername");
    localStorage.removeItem("rememberMe");
    navigate("/login");
  };

  const menuItems = [
    { icon: <FaHome />, title: "Dashboard", link: "/dashboard" },
    {
      icon: <FaBookmark />,
      title: "Available Bookings",
      link: "/available-bookings",
    },
    { icon: <FaCalendarAlt />, title: "My Bookings", link: "/my-bookings" },
    {
      icon: <FaMapMarkedAlt />,
      title: "Live Tracking",
      link: "/live-tracking",
    },
    {
      icon: <FaMoneyBillWave />,
      title: "Earnings & Payment",
      link: "/earnings",
    },
    { icon: <FaStar />, title: "Rating & Feedback", link: "/ratings" },
  ];

  const bottomMenuItems = [
    { icon: <FaCog />, title: "Settings", link: "/settings" },
    { icon: <FaSignOutAlt />, title: "Logout", onClick: handleLogout },
  ];

  // Swipe handlers
  const swipeHandlers = useSwipe(
    () => !isSidebarOpen && toggleSidebar(),
    () => isSidebarOpen && toggleSidebar(),
    30,
    10
  );

  return (
    <div
      ref={ref}
      {...swipeHandlers}
      className={`fixed inset-y-0 left-0 bg-white shadow-md z-30 transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-200 ease-in-out md:translate-x-0`}
      style={{ top: "64px", width: isSidebarOpen ? "240px" : "94px" }}
    >
      <div className="flex flex-col h-[calc(100vh-64px)] justify-between">
        {/* Top Menu Items - aligned with logo */}
        <div className="py-4 md:py-6 lg:py-8">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="group flex items-center px-3 py-3 mx-2 md:px-4 md:py-3.5 lg:px-6 lg:py-4 hover:bg-red-100 rounded-lg cursor-pointer mb-2 md:mb-3 lg:mb-4"
              onClick={() => navigate(item.link)}
            >
              <div className="w-12 flex justify-center">
                <span className="text-xl text-gray-700">{item.icon}</span>
              </div>
              {isSidebarOpen && (
                <span className="ml-2 text-gray-700 whitespace-nowrap">
                  {item.title}
                </span>
              )}
              {!isSidebarOpen && (
                <span className="hidden md:group-hover:block absolute left-24 bg-red-500 text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  {item.title}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Menu Items - with same icon alignment */}
        <div className="border-t border-gray-200 py-4 md:py-6 lg:py-8">
          {bottomMenuItems.map((item, index) => (
            <div
              key={index}
              className="group flex items-center px-3 py-3 mx-2 md:px-4 md:py-3.5 lg:px-6 lg:py-4 hover:bg-red-100 rounded-lg cursor-pointer mb-2 md:mb-3 lg:mb-4 last:mb-0"
              onClick={item.onClick || (() => navigate(item.link))}
            >
              <div className="w-12 flex justify-center">
                <span className="text-xl text-gray-700">{item.icon}</span>
              </div>
              {isSidebarOpen && (
                <span className="ml-2 text-gray-700 whitespace-nowrap">
                  {item.title}
                </span>
              )}
              {!isSidebarOpen && (
                <span className="hidden md:group-hover:block absolute left-24 bg-red-500 text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {item.title}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

Sidebar.displayName = "Sidebar";
export default Sidebar;
