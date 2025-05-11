import { FaClock, FaShieldAlt, FaInfoCircle } from "react-icons/fa";
import { format } from "date-fns";

const ScheduleSection = ({ booking }) => {
  // Helper to safely format dates
  const formatDate = (dateString) => {
    if (!dateString) return null;
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return String(dateString);
      return format(date, "PPP");
    } catch (error) {
      console.error("Error formatting date:", error);
      return null;
    }
  };
  
  // Safely access schedule data with fallbacks
  const getScheduleData = () => {
    try {
      // Handle missing schedule entirely
      if (!booking || !booking.schedule) {
        return {
          date: null,
          time: "Not specified",
          urgency: "standard",
          insurance: "none",
          specialInstructions: null
        };
      }
      
      // Handle MongoDB document objects
      if (booking.schedule.documents) {
        console.warn("Found MongoDB document in schedule, using safe values");
        return {
          date: null,
          time: "Not specified",
          urgency: "standard",
          insurance: "none",
          specialInstructions: null
        };
      }
      
      // Safely extract each property
      return {
        date: booking.schedule.date || null,
        time: booking.schedule.time || "Not specified",
        urgency: booking.schedule.urgency || "standard",
        insurance: booking.schedule.insurance || "none",
        specialInstructions: booking.schedule.specialInstructions || null
      };
    } catch (error) {
      console.error("Error accessing schedule data:", error);
      return {
        date: null,
        time: "Not specified",
        urgency: "standard",
        insurance: "none",
        specialInstructions: null
      };
    }
  };
  
  const schedule = getScheduleData();

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
                  {formatDate(schedule.date)} at {schedule.time}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
              <FaShieldAlt className="text-gray-400 text-xl" />
              <div>
                <p className="font-medium text-gray-900">Service Type</p>
                <p className="text-gray-600">
                  {schedule.urgency} • {schedule.insurance} Insurance
                </p>
              </div>
            </div>
          </div>
        </div>

        {schedule.specialInstructions && (
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <FaInfoCircle className="text-blue-500 mt-1" />
              <div>
                <p className="font-medium text-blue-700">
                  Special Instructions
                </p>
                <p className="mt-1 text-blue-600">
                  {schedule.specialInstructions}
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
