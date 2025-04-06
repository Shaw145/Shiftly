import { useState } from "react";
import {
  FaTimes,
  FaCheck,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaStar,
} from "react-icons/fa";

const NotificationModal = ({ onClose, setNotificationCount }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "booking",
      text: "New booking request from Salt Lake to Park Street",
      time: "Just now",
      read: false,
      icon: <FaMapMarkerAlt className="text-green-500" />,
    },
    {
      id: 2,
      type: "payment",
      text: "Payment of ₹1,200 has been credited to your account",
      time: "2 hours ago",
      read: false,
      icon: <FaMoneyBillWave className="text-blue-500" />,
    },
    {
      id: 3,
      type: "rating",
      text: "You received a 5-star rating from your last trip",
      time: "1 day ago",
      read: false,
      icon: <FaStar className="text-yellow-500" />,
    },
  ]);

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map((n) => ({
      ...n,
      read: true,
    }));
    setNotifications(updatedNotifications);
    setNotificationCount(0);
  };

  const markAsRead = (id) => {
    const updatedNotifications = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifications);
    setNotificationCount((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const getNotificationBg = (type, read) => {
    if (read) return "bg-gray-50";
    switch (type) {
      case "booking":
        return "bg-green-50";
      case "payment":
        return "bg-blue-50";
      case "rating":
        return "bg-yellow-50";
      default:
        return "bg-white";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-red-500 transition-colors duration-200 cursor-pointer"
        >
          <FaTimes className="w-5 h-5" />
        </button>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No new notifications
          </div>
        ) : (
          <ul className="py-2">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${getNotificationBg(
                  notification.type,
                  notification.read
                )}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className="mt-1">{notification.icon}</div>
                  <div className="flex-1">
                    <p
                      className={`text-sm ${
                        notification.read ? "text-gray-600" : "text-gray-800"
                      }`}
                    >
                      {notification.text}
                    </p>
                    <p className="text-xs text-red-500 mt-1">
                      {notification.time}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={markAllAsRead}
            className="w-full flex items-center justify-center space-x-2 text-sm text-red-500 hover:text-red-700 transition-colors duration-200 cursor-pointer"
          >
            <FaCheck className="w-4 h-4" />
            <span>Mark all as read</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationModal;
