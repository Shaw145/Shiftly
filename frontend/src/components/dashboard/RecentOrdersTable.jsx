import {
  FaTruck,
  FaArrowRight,
  FaStar,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const RecentOrdersTable = () => {
  const navigate = useNavigate();

  // Sample data - in real app, this would come from your backend
  const recentOrders = [
    {
      id: "ORD001",
      date: "2024-03-20",
      pickup: "Delhi, Delhi",
      delivery: "Jaipur, Rajasthan",
      amount: "₹2,500",
      status: "Completed",
      rating: 5,
    },
    {
      id: "ORD002",
      date: "2024-03-19",
      pickup: "Chennai, Tamil Nadu",
      delivery: "Bangalore, Karnataka",
      amount: "₹3,800",
      status: "Completed",
      rating: 4,
    },
    {
      id: "ORD003",
      date: "2024-03-18",
      pickup: "Kolkata, West Bengal",
      delivery: "Patna, Bihar",
      amount: "₹4,200",
      status: "Completed",
      rating: 5,
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
          <p className="text-sm text-gray-500">Your recent transport history</p>
        </div>
        <button
          onClick={() => navigate("/my-bookings")}
          className="text-red-500 hover:text-red-600 flex items-center gap-1 cursor-pointer"
        >
          View All
          <FaArrowRight />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                Route
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recentOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                  #{order.id}
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                  {order.date}
                </td>
                <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm text-gray-500">
                  <div className="flex flex-col">
                    <span className="font-medium">{order.pickup}</span>
                    <span className="text-gray-400">→</span>
                    <span className="font-medium">{order.delivery}</span>
                  </div>
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                  ₹{order.amount}
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs sm:text-sm rounded-full ${
                      order.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : order.status === "In Transit"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`${
                          i < order.rating ? "text-yellow-400" : "text-gray-300"
                        }`}
                        size={12}
                      />
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {recentOrders.length === 0 && (
        <div className="text-center py-8">
          <FaTruck className="text-gray-400 text-4xl mx-auto mb-3" />
          <p className="text-gray-500">No recent orders found</p>
          <button
            onClick={() => navigate("/book-transport")}
            className="mt-4 text-blue-500 hover:text-blue-600 flex items-center gap-1 mx-auto"
          >
            Book Your First Transport
            <FaArrowRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentOrdersTable;
