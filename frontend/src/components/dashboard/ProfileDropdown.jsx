import { useProfile } from "../../context/ProfileContext";
import {
  FaUser,
  FaCalendar,
  FaHistory,
  FaQuestionCircle,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const ProfileDropdown = ({ userName, userDetails, onClose }) => {
  const navigate = useNavigate();
  const { profileImage } = useProfile();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("fullName");
    localStorage.removeItem("rememberMe");
    window.location.href = "/login";
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="absolute right-4 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full border-2 border-red-500 overflow-hidden">
            {profileImage || userDetails?.profileImage ? (
              <img
                src={profileImage || userDetails.profileImage}
                alt={userName}
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
            <p className="text-sm font-semibold">Hello, {userName}</p>
            <p className="text-xs text-gray-500">{userDetails?.email}</p>
          </div>
        </div>
      </div>

      <ul className="py-2">
        <li
          onClick={() => {
            navigate(`/user/${userName}`);
            onClose();
          }}
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2"
        >
          <FaUser className="w-4 h-4 text-gray-700" />
          <span>My Profile</span>
        </li>
        <li
          onClick={() => {
            navigate("/my-bookings");
            onClose();
          }}
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2"
        >
          <FaCalendar className="w-4 h-4 text-gray-700" />
          <span>My Bookings</span>
        </li>
        <li
          onClick={() => {
            navigate("/transactions");
            onClose();
          }}
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2"
        >
          <FaHistory className="w-4 h-4 text-gray-700" />
          <span>Transaction History</span>
        </li>
        <li
          onClick={() => {
            navigate("/help");
            onClose();
          }}
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2"
        >
          <FaQuestionCircle className="w-4 h-4 text-gray-700" />
          <span>Help Center</span>
        </li>
        <li
          onClick={() => {
            navigate("/settings");
            onClose();
          }}
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2"
        >
          <FaCog className="w-4 h-4 text-gray-700" />
          <span>Settings</span>
        </li>
        <li
          onClick={handleLogout}
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2 text-red-500"
        >
          <FaSignOutAlt className="w-4 h-4" />
          <span>Logout</span>
        </li>
      </ul>
    </div>
  );
};

export default ProfileDropdown;
