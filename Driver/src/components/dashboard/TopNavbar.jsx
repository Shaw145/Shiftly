import { useState, useEffect, useRef, forwardRef } from "react";
import { FaBars, FaBell, FaCircle } from "react-icons/fa";
import { useProfile } from "../../context/ProfileContext";
import SearchBar from "./SearchBar";
import NotificationModal from "./NotificationModal";
import ProfileDropdown from "./ProfileDropdown";
import logo from "../../assets/Shiftly_logo.png";

const getInitials = (name) => {
  if (!name) return "D";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const getFirstName = (fullName) => {
  if (!fullName) return "Driver";
  return fullName.split(" ")[0];
};

// eslint-disable-next-line react/prop-types
const TopNavbar = forwardRef(({ toggleSidebar }, ref) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [isOnline, setIsOnline] = useState(true);
  const { profileImage, userDetails, updateUserDetails } = useProfile();
  const driverName = localStorage.getItem("driverName");
  const firstName = getFirstName(driverName);
  const driverUsername = localStorage.getItem("driverUsername");

  // Close modals when clicking outside
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchDriverDetails();
  }, []);

  const fetchDriverDetails = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/driver/me`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("driverToken")}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        updateUserDetails(data.driver);
      }
    } catch (error) {
      console.error("Error fetching driver details:", error);
    }
  };

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
    // In real app, make API call to update driver's status
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-40">
      <div className="flex items-center justify-between px-4 md:px-6 py-4">
        {/* Left Side */}
        <div className="flex items-center space-x-6">
          <button
            ref={ref}
            onClick={toggleSidebar}
            className="md:hidden text-gray-700 hover:bg-gray-100 p-2 rounded-lg"
          >
            <FaBars className="w-6 h-6" />
          </button>
          <div className="hidden md:flex items-center space-x-6">
            <div className="w-12 h-12 flex items-center justify-center">
              <a href="/dashboard">
                <img src={logo} alt="Shiftly Logo" className="h-10" />
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <p className="text-lg font-semibold text-gray-500">
                Welcome, {firstName}
              </p>
              <button
                onClick={toggleOnlineStatus}
                className={`hidden md:flex items-center px-3 py-1.5 rounded-full ${
                  isOnline
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <FaCircle
                  className={`w-2 h-2 mr-2 ${
                    isOnline ? "text-green-500" : "text-gray-500"
                  }`}
                />
                {isOnline ? "Online" : "Offline"}
              </button>
            </div>
          </div>
        </div>

        {/* Center - Search Bar (Mobile) */}
        <div className="flex-1 mx-4 md:hidden max-w-[400px]">
          <SearchBar placeholder="Search..." />
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4 md:space-x-6">
          {/* Search Bar (Desktop) */}
          <div className="hidden md:block md:w-80 lg:w-100">
            <SearchBar placeholder="Search..." />
          </div>

          {/* Notification Icon with Modal */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="p-2 rounded-full hover:bg-gray-100 relative cursor-pointer"
            >
              <FaBell className="w-6 h-6 text-gray-700" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>

            {/* Notification Modal */}
            {isNotificationOpen && (
              <div className="fixed inset-x-0 top-16 mx-auto md:absolute md:inset-auto md:right-0 md:top-full md:mx-0 w-[90%] md:w-80 transform translate-x-0 mt-2 z-50">
                <NotificationModal
                  onClose={() => setIsNotificationOpen(false)}
                  setNotificationCount={setNotificationCount}
                />
              </div>
            )}
          </div>

          {/* Profile Section */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center focus:outline-none cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full border-2 border-red-500 overflow-hidden">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={driverName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-red-100 flex items-center justify-center">
                    <span className="text-lg font-bold text-red-600">
                      {getInitials(driverName)}
                    </span>
                  </div>
                )}
              </div>
            </button>

            {isProfileOpen && (
              <ProfileDropdown
                userName={driverUsername}
                userDetails={{
                  ...userDetails,
                  fullName: driverName,
                  profileImage,
                }}
                onClose={() => setIsProfileOpen(false)}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
});

TopNavbar.displayName = "TopNavbar";
export default TopNavbar;
