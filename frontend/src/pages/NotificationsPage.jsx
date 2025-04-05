import { useState } from "react";
import { FaBell, FaCheck, FaTruck, FaCalendarAlt, FaTrash } from "react-icons/fa";

const NotificationsPage = () => {
  // Demo notifications data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "booking",
      title: "New Booking Confirmed",
      message: "Your booking #BK001 has been confirmed. Track your shipment now.",
      timestamp: "2024-03-10T10:30:00",
      isRead: false,
      icon: <FaTruck className="text-red-500" />,
    },
    {
      id: 2,
      type: "schedule",
      title: "Pickup Scheduled",
      message: "Pickup for booking #BK001 is scheduled for tomorrow at 10:00 AM",
      timestamp: "2024-03-09T15:45:00",
      isRead: false,
      icon: <FaCalendarAlt className="text-blue-500" />,
    },
    {
      id: 3,
      type: "delivery",
      title: "Delivery Update",
      message: "Your shipment #BK001 will be delivered today by 6:00 PM",
      timestamp: "2024-03-08T09:15:00",
      isRead: true,
      icon: <FaTruck className="text-green-500" />,
    },
  ]);

  // Format timestamp to relative time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
  };

  // Delete notification
  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-20 md:ml-22 lg:ml-24">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <FaBell className="text-2xl text-red-500" />
            <h1 className="text-2xl font-semibold text-gray-800">Notifications</h1>
          </div>
          <button
            onClick={markAllAsRead}
            className="text-sm text-red-500 hover:text-red-600 flex items-center space-x-1"
          >
            <FaCheck className="w-4 h-4" />
            <span>Mark all as read</span>
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-lg shadow-sm p-4 transition-all ${
                !notification.isRead ? 'border-l-4 border-red-500' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="mt-1">{notification.icon}</div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {notification.title}
                    </h3>
                    <p className="text-gray-600 mt-1">{notification.message}</p>
                    <span className="text-sm text-gray-500 mt-2 block">
                      {formatTime(notification.timestamp)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!notification.isRead && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <FaCheck className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="text-center py-12">
              <FaBell className="text-4xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No notifications to show</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;