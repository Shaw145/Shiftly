import { FaTruck, FaBox, FaCheckCircle, FaMapMarkerAlt } from "react-icons/fa";
import { format } from "date-fns";

const ShipmentTracker = ({ booking }) => {
  if (!booking) return null;

  const formatDate = (date) => {
    if (!date) return null;
    try {
      return format(new Date(date), "MMM d, h:mm a");
    } catch (error) {
      return null;
    }
  };

  const steps = [
    {
      icon: FaBox,
      title: "Confirmed",
      date: formatDate(booking.confirmedAt || booking.updatedAt),
      description: "Booking confirmed with driver",
      status: "completed",
    },
    {
      icon: FaMapMarkerAlt,
      title: "Pickup Reached",
      date: formatDate(booking.pickupReachedAt),
      description: "Driver reached pickup location",
      status:
        booking.status === "pickup_reached"
          ? "current"
          : booking.status === "in_transit" || booking.status === "delivered"
          ? "completed"
          : "upcoming",
    },
    {
      icon: FaTruck,
      title: "In Transit",
      date: formatDate(booking.inTransitAt),
      description: "Goods in transit",
      status:
        booking.status === "in_transit"
          ? "current"
          : booking.status === "delivered"
          ? "completed"
          : "upcoming",
    },
    {
      icon: FaCheckCircle,
      title: "Delivered",
      date: formatDate(booking.deliveredAt),
      description: "Shipment delivered successfully",
      status: booking.status === "delivered" ? "completed" : "upcoming",
    },
  ];

  return (
    <div className="p-6 bg-white rounded-xl">
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-6 top-8 h-[calc(100%-32px)] w-1 bg-gray-200">
          <div
            className="h-full bg-green-500 transition-all duration-500"
            style={{
              width: "2px",
              transform: `scaleY(${
                steps.filter((step) => step.status === "completed").length /
                (steps.length - 1)
              })`,
            }}
          />
        </div>

        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center gap-4">
              {/* Icon Container */}
              <div
                className={`
                  relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-2
                  ${
                    step.status === "completed"
                      ? "bg-green-500 border-green-500"
                      : step.status === "current"
                      ? "bg-white border-blue-500"
                      : "bg-white border-gray-300"
                  }
                `}
              >
                <step.icon
                  className={`
                    w-5 h-5
                    ${
                      step.status === "completed"
                        ? "text-white"
                        : step.status === "current"
                        ? "text-blue-500"
                        : "text-gray-400"
                    }
                  `}
                />
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-baseline justify-between">
                  <h3
                    className={`
                    font-medium
                    ${
                      step.status === "completed"
                        ? "text-green-500"
                        : step.status === "current"
                        ? "text-blue-500"
                        : "text-gray-500"
                    }
                  `}
                  >
                    {step.title}
                  </h3>
                  {step.date && (
                    <span className="text-sm text-gray-500">{step.date}</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShipmentTracker;
