import { FaTruck, FaMapMarkerAlt, FaClock, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const LiveTrackingCard = () => {
  const navigate = useNavigate();

  // Sample data - in real app, this would come from your backend
  const activeShipments = [
    {
      id: "SHIP001",
      pickup: "Mumbai, Maharashtra",
      delivery: "Delhi, Delhi",
      status: "In Transit",
      progress: 65,
      eta: "2 hours",
      driver: "Rajesh Kumar",
    },
    {
      id: "SHIP002",
      pickup: "Bangalore, Karnataka",
      delivery: "Chennai, Tamil Nadu",
      status: "Pickup Scheduled",
      progress: 0,
      eta: "Tomorrow",
      driver: "Suresh Patel",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Live Tracking</h2>
          <p className="text-sm text-gray-500">Track your active shipments</p>
        </div>
        <button
          onClick={() => navigate("/live-tracking")}
          className="text-red-500 hover:text-red-600 flex items-center gap-1 cursor-pointer"
        >
          View All
          <FaArrowRight />
        </button>
      </div>

      <div className="space-y-4">
        {activeShipments.map((shipment) => (
          <div
            key={shipment.id}
            className="border border-gray-100 rounded-lg p-4 hover:border-red-400 transition-colors cursor-pointer"
            onClick={() => navigate(`/live-tracking/${shipment.id}`)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FaTruck className="text-red-500" />
                <span className="font-medium text-gray-800">
                  #{shipment.id}
                </span>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  shipment.status === "In Transit"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {shipment.status}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <FaMapMarkerAlt className="text-gray-400" />
                <span className="text-gray-600">{shipment.pickup}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FaMapMarkerAlt className="text-gray-400" />
                <span className="text-gray-600">{shipment.delivery}</span>
              </div>
            </div>

            {shipment.progress > 0 && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Progress</span>
                  <span className="text-gray-800 font-medium">
                    {shipment.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${shipment.progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm">
                <FaClock className="text-gray-400" />
                <span className="text-gray-600">ETA: {shipment.eta}</span>
              </div>
              <span className="text-sm text-gray-600">
                Driver: {shipment.driver}
              </span>
            </div>
          </div>
        ))}

        {activeShipments.length === 0 && (
          <div className="text-center py-8">
            <FaTruck className="text-gray-400 text-4xl mx-auto mb-3" />
            <p className="text-gray-500">No active shipments to track</p>
            <button
              onClick={() => navigate("/book-transport")}
              className="mt-4 text-blue-500 hover:text-blue-600 flex items-center gap-1 mx-auto"
            >
              Book a Transport
              <FaArrowRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveTrackingCard;
