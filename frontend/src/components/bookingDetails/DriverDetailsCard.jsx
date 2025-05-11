import { FaUserCircle, FaStar } from "react-icons/fa";
import LiveTrackingButton from "../tracking/LiveTrackingButton";

const DriverDetailsCard = ({ booking }) => {
  // Helper function to safely extract driver details
  const safelyGetDriverDetails = () => {
    // Default fallback values
    const fallback = {
      name: "Driver",
      vehicle: "Transport Vehicle",
      rating: 4.5,
      trips: 150,
    };

    // Check if booking doesn't exist
    if (!booking) return fallback;

    try {
      // Handle case where driver is a MongoDB document with nested structure
      if (booking.driverId) {
        // If driverId is a string or primitive
        if (
          typeof booking.driverId === "string" ||
          typeof booking.driverId === "number"
        ) {
          return {
            ...fallback,
            id: booking.driverId,
            name: booking.driverName || fallback.name,
          };
        }

        // If driverId is an object (MongoDB document)
        if (typeof booking.driverId === "object") {
          // Check if it has a documents property (MongoDB document)
          if (booking.driverId.documents) {
            return {
              ...fallback,
              id: booking.driverId._id || booking.driverId.id,
              name:
                booking.driverId.fullName ||
                booking.driverId.name ||
                fallback.name,
            };
          }

          // Regular object with direct properties
          return {
            name:
              booking.driverId.fullName ||
              booking.driverId.name ||
              fallback.name,
            vehicle:
              booking.driverId.vehicle ||
              booking.driverId.vehicleDetails?.type ||
              fallback.vehicle,
            rating: booking.driverId.rating || fallback.rating,
            trips:
              booking.driverId.trips ||
              booking.driverId.completedTrips ||
              fallback.trips,
            id: booking.driverId._id || booking.driverId.id,
          };
        }
      }

      // Try driver object if driverId is not available
      if (booking.driver) {
        if (typeof booking.driver === "string") {
          return {
            ...fallback,
            id: booking.driver,
          };
        }

        if (typeof booking.driver === "object") {
          // Check if it has documents property (MongoDB document)
          if (booking.driver.documents) {
            return {
              ...fallback,
              id: booking.driver._id || booking.driver.id,
              name:
                booking.driver.fullName || booking.driver.name || fallback.name,
            };
          }

          // Regular object
          return {
            name:
              booking.driver.fullName || booking.driver.name || fallback.name,
            vehicle:
              booking.driver.vehicle ||
              booking.driver.vehicleDetails?.type ||
              fallback.vehicle,
            rating: booking.driver.rating || fallback.rating,
            trips:
              booking.driver.trips ||
              booking.driver.completedTrips ||
              fallback.trips,
            id: booking.driver._id || booking.driver.id,
          };
        }
      }

      // Return fallback if neither is available
      return fallback;
    } catch (error) {
      console.error("Error extracting driver details", error);
      return fallback;
    }
  };

  // Get safe driver details
  const driverDetails = safelyGetDriverDetails();

  return (
    <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 overflow-y-auto">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        Driver Details
      </h3>
      {booking.status === "confirmed" && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <FaUserCircle className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{driverDetails.name}</p>
              <p className="text-sm text-gray-600">{driverDetails.vehicle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaStar className="text-yellow-400" />
            <span>{driverDetails.rating}</span>
            <span>•</span>
            <span>{driverDetails.trips}+ trips</span>
          </div>
          <div className="mt-4">
            <LiveTrackingButton bookingId={booking.bookingId} />
          </div>
        </div>
      )}
      {booking.status !== "confirmed" && (
        <p className="text-gray-600">
          Driver details will appear here once booking is confirmed
        </p>
      )}
    </div>
  );
};

export default DriverDetailsCard;
