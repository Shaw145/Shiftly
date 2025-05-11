import { FaTruck } from "react-icons/fa";

const TransportSection = ({ booking }) => {
  // Helper function to safely extract transport details
  const safelyGetTransportData = () => {
    try {
      // Default values
      if (!booking)
        return {
          vehicle: "Not specified",
          distance: 0,
        };

      // Handle MongoDB document references
      if (
        booking.vehicle &&
        typeof booking.vehicle === "object" &&
        booking.vehicle.documents
      ) {
        console.warn(
          "Found MongoDB document in vehicle object, using safe value"
        );
        return {
          vehicle: "Transport Vehicle",
          distance: booking.distance || 0,
        };
      }

      return {
        vehicle: booking.vehicle || "Transport Vehicle",
        distance: booking.distance || 0,
      };
    } catch (error) {
      console.error("Error extracting transport data:", error);
      return {
        vehicle: "Not specified",
        distance: 0,
      };
    }
  };

  const transport = safelyGetTransportData();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Transport Details
      </h3>
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <FaTruck className="text-gray-400 text-xl" />
          <div>
            <p className="font-medium text-gray-900">{transport.vehicle}</p>
            <p className="text-sm text-gray-600 mt-1">
              Total Distance: {transport.distance} km
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransportSection;
