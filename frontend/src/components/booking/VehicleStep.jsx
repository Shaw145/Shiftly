import { useEffect, useMemo } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { determineVehicleType } from "../../utils/vehicleSelector";
import miniTruck from "../../assets/mini-truck.png";
import tempo from "../../assets/tempo.png";
import largeTruck from "../../assets/large-truck.png";
import largeContainerTruck from "../../assets/large-container-truck.jpg";

const VehicleStep = ({ formData, setFormData, errors }) => {
  const vehicles = [
    {
      id: "mini",
      name: "Mini Truck",
      description: "Tata Ace - Small Loads",
      capacity: "Up to 500kg",
      ideal: "Small household items, few boxes",
      image: miniTruck,
      maxWeight: 500,
    },
    {
      id: "tempo",
      name: "Tempo",
      description: "Mahindra Bolero Pickup - Medium Loads",
      capacity: "Up to 1000kg",
      ideal: "Medium furniture, appliances",
      image: tempo,
      maxWeight: 1000,
    },
    {
      id: "large",
      name: "Large Truck",
      description: "14ft Truck - Heavy Loads",
      capacity: "Up to 2500kg",
      ideal: "Full house moving, large items",
      image: largeTruck,
      maxWeight: 2500,
    },
    {
      id: "container",
      name: "Container Truck",
      description: "20-32ft Trucks - Bulk Transport",
      capacity: "Up to 5000kg",
      ideal: "Industrial goods, bulk materials",
      image: largeContainerTruck,
      maxWeight: 5000,
    },
  ];

  // Calculate total weight with buffer
  const calculateTotalWeight = useMemo(() => {
    const itemsWeight = Object.entries(formData.items).reduce(
      (total, [_, item]) => {
        return total + (item.weight || 0) * item.quantity;
      },
      0
    );

    const bufferPercentage = formData.goodsType.includes("household")
      ? 0.2
      : 0.1;
    const additionalBuffer = formData.additionalItems ? 100 : 0;

    const totalWithBuffer =
      itemsWeight * (1 + bufferPercentage) + additionalBuffer;
    return Math.ceil(totalWithBuffer);
  }, [formData.items, formData.goodsType, formData.additionalItems]);

  // Get recommended vehicle based on weight and type
  const recommendedVehicle = useMemo(() => {
    return determineVehicleType(
      formData.items, 
      formData.goodsType,
      formData.additionalItems  // Pass the additional items
    );
  }, [formData.items, formData.goodsType, formData.additionalItems]);

  // Set recommended vehicle whenever it changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      vehicleType: recommendedVehicle,
    }));
  }, [recommendedVehicle]);

  // Check if selected vehicle is appropriate
  const getVehicleStatus = (vehicleId) => {
    const selectedIndex = vehicles.findIndex((v) => v.id === vehicleId);
    const recommendedIndex = vehicles.findIndex(
      (v) => v.id === recommendedVehicle
    );

    if (selectedIndex < recommendedIndex) {
      return "undersized";
    } else if (selectedIndex === recommendedIndex) {
      return "recommended";
    } else {
      return "larger";
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Vehicle Selection</h3>
        <p className="text-sm text-gray-600">
          Estimated total weight: {calculateTotalWeight}kg
          <span className="text-gray-500 text-xs ml-2">
            (includes buffer for packaging and additional items)
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {vehicles.map((vehicle) => {
          const isRecommended = vehicle.id === recommendedVehicle;
          const isSelected = formData.vehicleType === vehicle.id;
          const vehicleStatus = getVehicleStatus(vehicle.id);
          const isOverweight = calculateTotalWeight > vehicle.maxWeight;

          return (
            <div
              key={vehicle.id}
              className={`border rounded-lg transition-all duration-200 cursor-pointer ${
                isSelected
                  ? vehicleStatus === "undersized"
                    ? "border-red-500 bg-red-50"
                    : "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-blue-500"
              }`}
              onClick={() =>
                setFormData({ ...formData, vehicleType: vehicle.id })
              }
            >
              <img
                src={vehicle.image}
                alt={vehicle.name}
                className="w-full h-40 object-cover rounded-t-lg"
              />
              <div className="p-3">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">{vehicle.name}</h3>
                  {isRecommended && (
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  {vehicle.description}
                </p>
                <p className="text-sm text-gray-600">{vehicle.capacity}</p>
                <p className="text-xs text-gray-500 mt-1">{vehicle.ideal}</p>

                {isSelected && isOverweight && (
                  <div className="mt-2 flex items-center text-amber-600 text-xs bg-amber-50 p-2 rounded">
                    <FaExclamationTriangle className="mr-2" />
                    <span>Weight exceeds vehicle capacity</span>
                  </div>
                )}

                {isSelected && vehicleStatus === "undersized" && (
                  <div className="mt-2 flex items-center text-red-600 text-xs bg-red-50 p-2 rounded">
                    <FaExclamationTriangle className="mr-2" />
                    <span>Vehicle may be too small for your items</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {errors.vehicleType && (
        <p className="text-red-500 text-sm mt-2">{errors.vehicleType}</p>
      )}

      <div className="mt-6 bg-gray-50 border border-gray-200 p-4 rounded-lg">
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-gray-700">Important Notice:</span>{" "}
          The actual vehicle provided may vary from the images shown above,
          depending on availability and local fleet. However, we ensure that the
          vehicle capacity and specifications will match or exceed your
          requirements.
        </p>
      </div>
    </div>
  );
};

export default VehicleStep;
