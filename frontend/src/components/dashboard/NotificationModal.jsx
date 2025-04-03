import { useState } from "react";
import { FaTimes, FaCheck } from "react-icons/fa";

// eslint-disable-next-line react/prop-types
const NotificationModal = ({ onClose, setNotificationCount }) => {
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Your booking is confirmed!", time: "2 hours ago", read: false },
    { id: 2, text: "New offer: Get 10% off!", time: "1 day ago", read: false },
    { id: 3, text: "Delivery scheduled for tomorrow.", time: "3 days ago", read: false },
  ]);

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map((n) => ({ ...n, read: true }));
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

  return (
    <div className="absolute -right-7 md:right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-primary">Notifications</h2>
        <button onClick={onClose} className="text-red-500 hover:text-red-700 cursor-pointer">
          <FaTimes className="w-5 h-5" />
        </button>
      </div>
      <ul className="py-2">
        {notifications.map((notification) => (
          <li
            key={notification.id}
            className={`px-4 py-2 hover:bg-red-100 cursor-pointer ${
              notification.read ? "bg-gray-100" : "bg-white"
            }`}
            onClick={() => markAsRead(notification.id)}
          >
            <p className="text-sm">{notification.text}</p>
            <p className="text-xs text-red-500">{notification.time}</p>
          </li>
        ))}
      </ul>
      <div className="p-2 border-t border-gray-200">
        <button
          onClick={markAllAsRead}
          className="w-full flex items-center justify-center space-x-2 text-sm text-red-500 hover:text-red-700 cursor-pointer"
        >
          <FaCheck className="w-4 h-4" />
          <span>Mark all as read</span>
        </button>
      </div>
    </div>
  );
};

export default NotificationModal;