import { forwardRef, useState, useEffect } from "react";
import {
  FaHome,
  FaTruck,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaQuestionCircle,
  FaCog,
  FaSignOutAlt,
  FaBell,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useSwipe from "../../hooks/useSwipe";

const Sidebar = forwardRef(({ isSidebarOpen, toggleSidebar }, ref) => {
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(3);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("fullName");
    localStorage.removeItem("username");
    localStorage.removeItem("rememberMe");
    navigate("/login");
  };

  const menuItems = [
    { icon: <FaHome />, title: "Dashboard", link: "/dashboard" },
    { icon: <FaTruck />, title: "Book Transport", link: "/book-transport" },
    { icon: <FaCalendarAlt />, title: "My Bookings", link: "/my-bookings" },
    {
      icon: <FaMapMarkerAlt />,
      title: "Live Tracking",
      link: "/live-tracking",
    },
    {
      icon: (
        <div className="relative">
          <FaBell />
          {notificationCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </div>
      ),
      title: "Notifications",
      link: "/notifications",
    },
    { icon: <FaQuestionCircle />, title: "Help & Support", link: "/support" },
  ];

  const bottomMenuItems = [
    { icon: <FaCog />, title: "Settings", link: "/settings" },
    { icon: <FaSignOutAlt />, title: "Logout", onClick: handleLogout },
  ];

  // Swipe handlers
  const swipeHandlers = useSwipe(
    () => !isSidebarOpen && toggleSidebar(), // Open on swipe right
    () => isSidebarOpen && toggleSidebar() // Close on swipe left
  );

  return (
    <div
      ref={ref}
      {...swipeHandlers}
      className={`fixed inset-y-0 left-0 bg-white shadow-md z-30 transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-200 ease-in-out md:translate-x-0`}
      style={{ top: "64px", width: isSidebarOpen ? "200px" : "94px" }}
    >
      <div className="flex flex-col h-[calc(100vh-64px)]">
        {/* Top Menu Items - with scrolling */}
        <div className="flex-1 overflow-y-auto py-8 space-y-6 md:space-y-10">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="group flex items-center p-2 md:pl-6 hover:bg-red-100 rounded-lg cursor-pointer"
              onClick={() => navigate(item.link)}
            >
              <span className="text-xl text-gray-700 ml-4">{item.icon}</span>
              {isSidebarOpen && (
                <span className="ml-4 text-gray-700 whitespace-nowrap">
                  {item.title}
                </span>
              )}
              <span className="hidden md:group-hover:block absolute left-16 bg-red-500 text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                {item.title}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom Menu Items - fixed at bottom */}
        <div className="py-8 space-y-4 border-t border-gray-200 bg-white">
          {bottomMenuItems.map((item, index) => (
            <div
              key={index}
              className="group flex items-center p-2 md:pl-6 hover:bg-red-100 rounded-lg cursor-pointer"
              onClick={item.onClick || (() => navigate(item.link))}
            >
              <span className="text-xl text-gray-700 ml-4">{item.icon}</span>
              {isSidebarOpen && (
                <span className="ml-4 text-gray-700 whitespace-nowrap">
                  {item.title}
                </span>
              )}
              <span className="hidden md:group-hover:block absolute left-16 bg-red-500 text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {item.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

Sidebar.displayName = "Sidebar";
export default Sidebar;

// const Sidebar = forwardRef(({ isSidebarOpen, toggleSidebar }, ref) => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("fullName");
//     localStorage.removeItem("rememberMe");
//     navigate("/login");
//   };

//   const menuItems = [
//     { icon: <FaHome />, title: "Dashboard", link: "/dashboard" },
//     { icon: <FaTruck />, title: "Book Transport", link: "/book-transport" },
//     { icon: <FaCalendarAlt />, title: "My Bookings", link: "/my-bookings" },
//     {
//       icon: <FaMapMarkerAlt />,
//       title: "Live Tracking",
//       link: "/live-tracking",
//     },
//     { icon: <FaQuestionCircle />, title: "Help & Support", link: "/support" },
//   ];

//   const bottomMenuItems = [
//     { icon: <FaCog />, title: "Settings", link: "/settings" },
//     { icon: <FaSignOutAlt />, title: "Logout", onClick: handleLogout },
//   ];

//   return (
//     <div
//       ref={ref}
//       className={`fixed inset-y-0 left-0 bg-white shadow-md z-30 transform ${
//         isSidebarOpen ? "translate-x-0" : "-translate-x-full"
//       } transition-transform duration-200 ease-in-out md:translate-x-0`}
//       style={{ top: "64px", width: isSidebarOpen ? "200px" : "94px" }}
//     >
//       <div className="flex flex-col justify-between h-[calc(100vh-64px)] py-8">
//         {/* Top Menu Items */}
//         <div className="space-y-6 md:space-y-10">
//           {menuItems.map((item, index) => (
//             <div
//               key={index}
//               className="group flex items-center p-2 md:pl-6 hover:bg-red-100 rounded-lg cursor-pointer"
//               onClick={() => navigate(item.link)}
//             >
//               <span className="text-xl text-gray-700 ml-4">{item.icon}</span>{" "}
//               {/* Added margin-left */}
//               {/* Show title on small screens only when sidebar is open */}
//               {isSidebarOpen && (
//                 <span className="ml-4 text-gray-700 whitespace-nowrap">
//                   {item.title}
//                 </span>
//               )}
//               {/* Show title on hover for large screens */}
//               <span className="hidden md:group-hover:block absolute left-16 bg-red-500 text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
//                 {item.title}
//               </span>
//             </div>
//           ))}
//         </div>

//         {/* Bottom Menu Items */}
//         <div className="space-y-4 md:space-y-8">
//           {bottomMenuItems.map((item, index) => (
//             <div
//               key={index}
//               className="group flex items-center p-2 md:pl-6 hover:bg-red-100 rounded-lg cursor-pointer"
//               onClick={item.onClick || (() => navigate(item.link))}
//             >
//               <span className="text-xl text-gray-700 ml-4">{item.icon}</span>{" "}
//               {/* Added margin-left */}
//               {/* Show title on small screens only when sidebar is open */}
//               {isSidebarOpen && (
//                 <span className="ml-4 text-gray-700 whitespace-nowrap">
//                   {item.title}
//                 </span>
//               )}
//               {/* Show title on hover for large screens */}
//               <span className="hidden md:group-hover:block absolute left-16 bg-red-500 text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//                 {item.title}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// });

// Sidebar.displayName = "Sidebar";
// export default Sidebar;
