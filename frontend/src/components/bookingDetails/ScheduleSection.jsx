import { FaClock, FaShieldAlt, FaInfoCircle } from "react-icons/fa";
import { format } from "date-fns";

const ScheduleSection = ({ booking }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="space-y-6">
        <div className="border-b pb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Schedule Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
              <FaClock className="text-gray-400 text-xl" />
              <div>
                <p className="font-medium text-gray-900">Pickup Time</p>
                <p className="text-gray-600">
                  {format(new Date(booking.schedule.date), "PPP")} at{" "}
                  {booking.schedule.time}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
              <FaShieldAlt className="text-gray-400 text-xl" />
              <div>
                <p className="font-medium text-gray-900">Service Type</p>
                <p className="text-gray-600">
                  {booking.schedule.urgency} • {booking.schedule.insurance}{" "}
                  Insurance
                </p>
              </div>
            </div>
          </div>
        </div>

        {booking.schedule.specialInstructions && (
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <FaInfoCircle className="text-blue-500 mt-1" />
              <div>
                <p className="font-medium text-blue-700">
                  Special Instructions
                </p>
                <p className="mt-1 text-blue-600">
                  {booking.schedule.specialInstructions}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleSection;
