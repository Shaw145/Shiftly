import {
  FaCar,
  FaGasPump,
  FaRoute,
  FaCheckCircle,
  FaTools,
  FaCalendarCheck,
  FaFileAlt,
  FaExclamationTriangle,
} from "react-icons/fa";

const VehicleStatus = ({ vehicle }) => {
  // Sample data - In real app, this would come from props
  const vehicleData = vehicle || {
    type: "Tata Ace",
    number: "WB 23 AB 1234",
    status: "Active",
    lastMaintenance: "2024-03-15",
    nextMaintenance: "2024-04-15",
    fuelLevel: 75,
    totalDistance: "12,450",
    dailyDistance: "120",
    healthScore: 92,
    documents: {
      insurance: { status: "Valid", expiry: "Dec 2024" },
      permit: { status: "Valid", expiry: "Nov 2024" },
      pollution: { status: "Valid", expiry: "Aug 2024" },
      fitness: { status: "Valid", expiry: "Oct 2024" },
    },
    alerts: [
      { type: "maintenance", message: "Oil change due in 5 days" },
      { type: "document", message: "Pollution certificate expires in 30 days" },
    ],
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <FaCar className="text-blue-500 text-lg sm:text-xl" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">
              Vehicle Status
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Monitor your vehicle's health
            </p>
          </div>
        </div>
        <span
          className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm flex items-center ${
            vehicleData.status === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          <FaCheckCircle className="mr-1 sm:mr-2" />
          {vehicleData.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6">
        {/* Main Vehicle Info */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-6">
            {/* Vehicle Details */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="font-semibold text-sm sm:text-base text-gray-800">
                  {vehicleData.type}
                </h3>
                <span className="text-xs sm:text-sm text-gray-600">
                  {vehicleData.number}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Health Score
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-600">
                    {vehicleData.healthScore}%
                  </p>
                </div>
                <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full border-4 border-blue-200 flex items-center justify-center">
                  <FaCheckCircle className="text-blue-500 text-xl sm:text-2xl" />
                </div>
              </div>
            </div>

            {/* Fuel Status */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="font-semibold text-sm sm:text-base text-gray-800">
                  Fuel Level
                </h3>
                <FaGasPump className="text-green-500" />
              </div>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xl sm:text-2xl font-bold text-green-600">
                      {vehicleData.fuelLevel}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 sm:h-3 mb-4 text-xs flex rounded-full bg-green-200">
                  <div
                    style={{ width: `${vehicleData.fuelLevel}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all duration-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Distance Metrics */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <FaRoute className="text-gray-500" />
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Total Distance
                  </p>
                  <p className="text-base sm:text-lg font-semibold text-gray-800">
                    {vehicleData.totalDistance} km
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <FaRoute className="text-gray-500" />
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Today's Distance
                  </p>
                  <p className="text-base sm:text-lg font-semibold text-gray-800">
                    {vehicleData.dailyDistance} km
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Document Status */}
        <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="font-semibold text-sm sm:text-base text-gray-800">
              Document Status
            </h3>
            <FaFileAlt className="text-gray-500" />
          </div>
          <div className="space-y-2 sm:space-y-3">
            {Object.entries(vehicleData.documents).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-gray-600 capitalize">
                  {key}
                </span>
                <div className="flex items-center">
                  <span
                    className={`text-xs sm:text-sm font-medium ${
                      value.status === "Valid"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {value.expiry}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Maintenance Info & Alerts */}
      <div className="mt-3 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="bg-yellow-50 rounded-xl p-3 sm:p-4">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="font-semibold text-sm sm:text-base text-gray-800">
              Maintenance Schedule
            </h3>
            <FaTools className="text-yellow-600" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-gray-600">
                Last Service
              </span>
              <span className="text-xs sm:text-sm font-medium text-gray-800">
                {vehicleData.lastMaintenance}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-gray-600">
                Next Service Due
              </span>
              <span className="text-xs sm:text-sm font-medium text-yellow-600">
                {vehicleData.nextMaintenance}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-red-50 rounded-xl p-3 sm:p-4">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="font-semibold text-sm sm:text-base text-gray-800">
              Active Alerts
            </h3>
            <FaExclamationTriangle className="text-red-500" />
          </div>
          <div className="space-y-2">
            {vehicleData.alerts.map((alert, index) => (
              <div
                key={index}
                className="flex items-center text-xs sm:text-sm text-red-600"
              >
                <FaExclamationTriangle className="mr-2 flex-shrink-0" />
                <span className="line-clamp-2">{alert.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleStatus;
