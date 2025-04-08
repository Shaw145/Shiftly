import { useProfile } from "../../context/ProfileContext";
import {
  FaUser,
  FaCalendarCheck,
  FaHistory,
  FaHeadset,
  FaBell,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ProfileDropdown = ({ userName, userDetails, onClose }) => {
  const navigate = useNavigate();
  const { profileImage } = useProfile();

  const handleLogout = () => {
    localStorage.removeItem("driverToken");
    localStorage.removeItem("driverName");
    localStorage.removeItem("driverUsername");
    localStorage.removeItem("rememberMe");
    window.location.href = "/login";
  };

  const getInitials = (name) => {
    if (!name) return "D";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="absolute right-4 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full border-2 border-red-500 overflow-hidden">
            {userDetails?.profileImage ? (
              <img
                src={userDetails.profileImage}
                alt={userDetails?.fullName || userName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-red-100 flex items-center justify-center">
                <span className="text-lg font-bold text-red-600">
                  {getInitials(userDetails?.fullName || userName)}
                </span>
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">
              Hello, {userName}
            </p>
            <p className="text-xs text-gray-500">
              {userDetails?.vehicleType || "Vehicle Info Not Set"}
            </p>
            <div className="flex items-center mt-1">
              <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
              <span className="text-xs text-green-600">Online</span>
            </div>
          </div>
        </div>
      </div>

      <ul className="py-2">
        <li
          onClick={() => {
            navigate(`/profile/${localStorage.getItem("driverUsername")}`);
            onClose();
          }}
          className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center space-x-3 group"
        >
          <FaUser className="w-4 h-4 text-gray-600 group-hover:text-red-500" />
          <span className="text-gray-700 group-hover:text-gray-900">
            My Profile
          </span>
        </li>
        <li
          onClick={() => {
            navigate("/my-bookings");
            onClose();
          }}
          className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center space-x-3 group"
        >
          <FaCalendarCheck className="w-4 h-4 text-gray-600 group-hover:text-red-500" />
          <span className="text-gray-700 group-hover:text-gray-900">
            My Bookings
          </span>
        </li>
        <li
          onClick={() => {
            navigate("/earnings-history");
            onClose();
          }}
          className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center space-x-3 group"
        >
          <FaHistory className="w-4 h-4 text-gray-600 group-hover:text-red-500" />
          <span className="text-gray-700 group-hover:text-gray-900">
            Earnings History
          </span>
        </li>
        <li
          onClick={() => {
            navigate("/support");
            onClose();
          }}
          className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center space-x-3 group"
        >
          <FaHeadset className="w-4 h-4 text-gray-600 group-hover:text-red-500" />
          <span className="text-gray-700 group-hover:text-gray-900">
            Support & Help
          </span>
        </li>
        <li
          onClick={() => {
            navigate("/notifications");
            onClose();
          }}
          className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center space-x-3 group"
        >
          <FaBell className="w-4 h-4 text-gray-600 group-hover:text-red-500" />
          <div className="flex items-center justify-between flex-1">
            <span className="text-gray-700 group-hover:text-gray-900">
              Notifications
            </span>
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              3
            </span>
          </div>
        </li>
        <li
          onClick={() => {
            navigate("/settings");
            onClose();
          }}
          className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center space-x-3 group"
        >
          <FaCog className="w-4 h-4 text-gray-600 group-hover:text-red-500" />
          <span className="text-gray-700 group-hover:text-gray-900">
            Settings
          </span>
        </li>
        <li
          onClick={handleLogout}
          className="px-4 py-2 hover:bg-red-50 cursor-pointer flex items-center space-x-3 text-red-600 group"
        >
          <FaSignOutAlt className="w-4 h-4" />
          <span>Logout</span>
        </li>
      </ul>
    </div>
  );
};

export default ProfileDropdown;
