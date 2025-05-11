import { useState, useEffect } from "react";
import {
  FaTruck,
  FaBox,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaClock,
  FaCalendarAlt,
} from "react-icons/fa";
import { format } from "date-fns";

// Helper to sanitize tracking data and prevent MongoDB document errors
const sanitizeTracking = (tracking) => {
  if (!tracking) return [];

  try {
    // Make a deep copy to remove MongoDB document references
    const safeTracking = JSON.parse(JSON.stringify(tracking));

    return safeTracking.map((item) => {
      // Remove documents property if it exists
      if (item && typeof item === "object") {
        // Create a new object without the documents property
        const { documents, ...cleanItem } = item;

        // Ensure dates are in string format
        if (cleanItem.timestamp && typeof cleanItem.timestamp === "object") {
          cleanItem.timestamp = new Date(cleanItem.timestamp).toISOString();
        }

        // Handle any nested MongoDB objects
        if (
          cleanItem.location &&
          typeof cleanItem.location === "object" &&
          cleanItem.location.documents
        ) {
          cleanItem.location =
            cleanItem.location.name || String(cleanItem.location);
        }

        return cleanItem;
      }
      return item;
    });
  } catch (error) {
    console.error("Error sanitizing tracking data:", error);
    return [];
  }
};

const ShipmentTracker = ({ booking }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [trackingData, setTrackingData] = useState([]);

  useEffect(() => {
    if (!booking) return;

    // If booking has tracking data, sanitize and use it
    if (booking && booking.tracking && Array.isArray(booking.tracking)) {
      const sanitizedTracking = sanitizeTracking(booking.tracking);
      setTrackingData(sanitizedTracking);

      // Determine the current active step based on tracking status
      const completedSteps = sanitizedTracking.filter(
        (step) => step.status === "completed" || step.status === "delivered"
      ).length;

      setActiveStep(completedSteps);
    } else {
      // Generate tracking data based on booking status
      generateTrackingFromStatus();
    }
  }, [booking]);

  // Generate tracking data based on booking status
  const generateTrackingFromStatus = () => {
    if (!booking) return;

    // Default tracking steps for all bookings
    const trackingSteps = [
      {
        status: "confirmed",
        description: "Booking Confirmed",
        timestamp: booking.confirmedAt || booking.createdAt || new Date(),
        location: booking.pickup?.address || "Pickup Location",
      },
    ];

    // Add more steps based on current booking status
    switch (booking.status) {
      case "confirmed":
        // Only booking confirmation is completed
        trackingSteps.push(
          {
            status: "pending",
            description: "Picked up from Origin",
            timestamp: null,
            location: booking.pickup?.address || "Pickup Location",
          },
          {
            status: "pending",
            description: "In Transit",
            timestamp: null,
            location: "En Route",
          },
          {
            status: "pending",
            description: "Delivered",
            timestamp: null,
            location: booking.delivery?.address || "Delivery Location",
          }
        );
        setActiveStep(0); // Only first step complete
        break;

      case "pickup_reached":
        // Booking confirmed and pickup reached
        trackingSteps.push(
          {
            status: "completed",
            description: "Picked up from Origin",
            timestamp: booking.pickupReachedAt || new Date(),
            location: booking.pickup?.address || "Pickup Location",
          },
          {
            status: "pending",
            description: "In Transit",
            timestamp: null,
            location: "En Route",
          },
          {
            status: "pending",
            description: "Delivered",
            timestamp: null,
            location: booking.delivery?.address || "Delivery Location",
          }
        );
        setActiveStep(1); // Two steps complete
        break;

      case "in_transit":
        // Booking confirmed, pickup reached, and in transit
        trackingSteps.push(
          {
            status: "completed",
            description: "Picked up from Origin",
            timestamp:
              booking.pickupReachedAt ||
              new Date(Date.now() - 2 * 60 * 60 * 1000),
            location: booking.pickup?.address || "Pickup Location",
          },
          {
            status: "completed",
            description: "In Transit",
            timestamp: booking.inTransitAt || new Date(),
            location: "En Route",
          },
          {
            status: "pending",
            description: "Delivered",
            timestamp: null,
            location: booking.delivery?.address || "Delivery Location",
          }
        );
        setActiveStep(2); // Three steps complete
        break;

      case "delivered":
        // All steps completed
        trackingSteps.push(
          {
            status: "completed",
            description: "Picked up from Origin",
            timestamp:
              booking.pickupReachedAt ||
              new Date(Date.now() - 5 * 60 * 60 * 1000),
            location: booking.pickup?.address || "Pickup Location",
          },
          {
            status: "completed",
            description: "In Transit",
            timestamp:
              booking.inTransitAt || new Date(Date.now() - 3 * 60 * 60 * 1000),
            location: "En Route",
          },
          {
            status: "completed",
            description: "Delivered",
            timestamp: booking.deliveredAt || new Date(),
            location: booking.delivery?.address || "Delivery Location",
          }
        );
        setActiveStep(3); // All steps complete
        break;

      default:
        // For pending or other states, show only confirmation step
        trackingSteps.push(
          {
            status: "pending",
            description: "Picked up from Origin",
            timestamp: null,
            location: booking.pickup?.address || "Pickup Location",
          },
          {
            status: "pending",
            description: "In Transit",
            timestamp: null,
            location: "En Route",
          },
          {
            status: "pending",
            description: "Delivered",
            timestamp: null,
            location: booking.delivery?.address || "Delivery Location",
          }
        );
        setActiveStep(0); // Only first step might be complete
        break;
    }

    setTrackingData(trackingSteps);
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return "Pending";

    try {
      return format(new Date(date), "MMM d, yyyy - h:mm a");
    } catch (error) {
      return String(date);
    }
  };

  // Get status text with proper styling
  const getStatusText = (index) => {
    if (index < activeStep) return "text-green-600 font-medium";
    if (index === activeStep) return "text-blue-600 font-medium";
    return "text-gray-400";
  };

  // Get connector line styling
  const getConnectorStyle = (index) => {
    if (index < activeStep) return "bg-green-500";
    return "bg-gray-300";
  };

  // Get icon styling
  const getIconStyle = (index) => {
    if (index < activeStep) return "bg-green-500 text-white";
    if (index === activeStep) return "bg-blue-500 text-white";
    return "bg-gray-300 text-gray-500";
  };

  // Get icon for each step
  const getIcon = (step) => {
    switch (step.status) {
      case "confirmed":
        return <FaCheckCircle />;
      case "pickup":
      case "pickup_reached":
        return <FaMapMarkerAlt />;
      case "transit":
      case "in_transit":
        return <FaTruck />;
      case "out_for_delivery":
        return <FaTruck />;
      case "delivered":
        return <FaBox />;
      default:
        return <FaClock />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        Shipment Tracking
      </h3>

      <div className="relative">
        {trackingData.map((step, index) => (
          <div key={index} className="mb-8 flex items-start">
            {/* Step indicator */}
            <div className="flex flex-col items-center mr-4">
              <div
                className={`w-10 h-10 rounded-full ${getIconStyle(
                  index
                )} flex items-center justify-center`}
              >
                {getIcon(step)}
              </div>
              {index < trackingData.length - 1 && (
                <div
                  className={`w-1 h-full ${getConnectorStyle(index)} mt-2`}
                  style={{ height: "30px" }}
                ></div>
                  )}
                </div>

            {/* Step details */}
            <div className="flex-1">
              <h4 className={`text-lg ${getStatusText(index)}`}>
                {step.description}
              </h4>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <FaCalendarAlt className="mr-1" />
                <span>{formatDate(step.timestamp)}</span>
              </div>
              {step.location && (
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <FaMapMarkerAlt className="mr-1" />
                  <span>
                    {typeof step.location === "object"
                      ? step.location.address || "Location"
                      : step.location}
                  </span>
                </div>
              )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ShipmentTracker;
