import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import worldMap from "../assets/worldmap.png"; 

const CalculatePrice = () => {
  const [distance, setDistance] = useState(0);
  const [goodsType, setGoodsType] = useState("small");
  const [vehicleType, setVehicleType] = useState("mini");
  const [urgency, setUrgency] = useState("standard");
  const [insurance, setInsurance] = useState("none");
  const [priceRange, setPriceRange] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [distanceError, setDistanceError] = useState("");
  const [vehicleError, setVehicleError] = useState("");

  // Handle vehicle type restrictions based on goods type
  useEffect(() => {
    if (
      (goodsType === "large" || goodsType === "heavy") &&
      vehicleType === "mini"
    ) {
      setVehicleError("Mini Truck is not suitable for this type of goods.");
    } else {
      setVehicleError("");
    }
  }, [goodsType, vehicleType]);

  // Handle body overflow when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isModalOpen]);

  // Calculate price based on inputs
  const calculatePrice = () => {
    if (distance < 1) {
      setDistanceError("Please enter a valid distance greater than 1 km.");
      return;
    }
    if (
      (goodsType === "large" || goodsType === "heavy") &&
      vehicleType === "mini"
    ) {
      setVehicleError("Please select a valid vehicle type.");
      return;
    }
    setDistanceError("");
    setVehicleError("");

    // Base fare based on distance ranges (reduced by 10-15% from priceCalculator)
    const baseFareTable = {
      mini: [350, 520, 700], // Reduced from [400, 600, 800]
      tempo: [520, 700, 870], // Reduced from [600, 800, 1000]
      large: [870, 950, 1200], // Reduced from [1000, 1100, 1400]
      container: [1100, 1300, 1650], // Reduced from [1300, 1500, 1900]
    };

    const costPerKmTable = {
      mini: [13, 19, 17], // Reduced from [15, 22, 20]
      tempo: [17, 23, 22], // Reduced from [20, 27, 25]
      large: [30, 28, 26], // Reduced from [35, 32, 30]
      container: [35, 33, 30], // Reduced from [40, 38, 35]
    };

    // Determine rate index based on distance
    let rateIndex = 0;
    if (distance > 50 && distance <= 300) rateIndex = 1;
    else if (distance > 300) rateIndex = 2;

    // Base calculations
    const baseFare = baseFareTable[vehicleType][rateIndex];
    const costPerKm = costPerKmTable[vehicleType][rateIndex];
    const distanceCharge = costPerKm * distance;

    // Goods handling fee (reduced by ~10%)
    const goodsFeeTable = {
      small: 270, // Reduced from 300
      medium: 450, // Reduced from 500
      large: 720, // Reduced from 800
      light: 720, // Reduced from 800
      heavy: 1350, // Reduced from 1500
    };
    const goodsFee = goodsFeeTable[goodsType];

    // Urgency multiplier
    const urgencyMultiplier = {
      standard: 1,
      express: 1.1, // 10% extra
      priority: 1.2, // 20% extra
    }[urgency];

    // Insurance cost
    const insuranceCost = {
      none: 0,
      basic: 100,
      full: 200,
    }[insurance];

    // Calculate subtotal
    const subtotal =
      (baseFare + distanceCharge + goodsFee) * urgencyMultiplier +
      insuranceCost;

    // Add GST (18%)
    const gstAmount = subtotal * 0.18;
    const totalPrice = subtotal + gstAmount;

    // Round to nearest lower 100
    const roundedTotal = Math.floor(totalPrice / 100) * 100;

    // Calculate range (slightly smaller range to show more certainty)
    const lowerRange = roundedTotal;
    const upperRange =
      roundedTotal + (goodsType.includes("household") ? 1500 : 2000); // Reduced range spread

    setPriceRange({ lower: lowerRange, upper: upperRange });
    setIsModalOpen(true);
  };

  return (
    <motion.section
      className="py-16 px-6 md:px-20 relative overflow-hidden"
      id="CalculatePrice"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      {/* Background Image */}
      <img
        src={worldMap} // Add your image path here
        alt="World Map"
        className="absolute top-30 left-7 inset-0 w-full h-150 object-contain z-15"
      />

      {/* Dark Blue Overlay */}
      <div className="absolute inset-0 bg-body-dark bg-opacity-90 z-10"></div>

      {/* Content */}
      <div className="relative z-20 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-18 lg:gap-30 items-center">
        {/* Left Side: Heading and Description */}
        <div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 lg:mb-12">
            Calculate Your Transport Price
          </h2>
          <p className="text-white text-base md:text-xl">
            Estimate the cost of transporting your goods with our easy-to-use
            calculator. Simply enter the details below, and we will provide you
            with a fair price range.
          </p>
        </div>

        {/* Right Side: Form */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <form>
            {/* Distance */}
            <div className="mb-6">
              <label className="block text-black font-semibold mb-2">
                Distance (km)
              </label>
              <input
                type="number"
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow empty input or valid numbers (including 0)
                  if (value === "" || !isNaN(value)) {
                    setDistance(value === "" ? 0 : Number(value)); // Convert to number if not empty
                  }
                }}
                className="w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:border-red-500 bg-white text-black"
                placeholder="Enter distance in kilometers"
              />
              {distanceError && (
                <p className="text-red-500 text-sm mt-2">{distanceError}</p>
              )}
            </div>

            {/* Type of Goods */}
            <div className="mb-6">
              <label className="block text-black font-semibold mb-2">
                Type of Goods
              </label>
              <select
                value={goodsType}
                onChange={(e) => setGoodsType(e.target.value)}
                className="w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:border-red-500 bg-white text-black"
              >
                <option value="small">
                  Small Household Items (e.g. Appliances, Boxes)
                </option>
                <option value="medium">
                  Medium Household Items (e.g. Furniture, Beds)
                </option>
                <option value="large">
                  Large Household Items (e.g. Entire Home Shifting)
                </option>
                <option value="light">
                  Light Industrial Goods (e.g. Office Equipment)
                </option>
                <option value="heavy">
                  Heavy Industrial Goods (e.g. Machinery, Raw Materials)
                </option>
              </select>
            </div>

            {/* Vehicle Type */}
            <div className="mb-6">
              <label className="block text-black font-semibold mb-2">
                Vehicle Type
              </label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:border-red-500 bg-white text-black"
              >
                <option value="mini">
                  Mini Truck (Tata Ace - Small Loads)
                </option>
                <option value="tempo">
                  Tempo (Mahindra Bolero Pickup - Medium Loads)
                </option>
                <option value="large">
                  Large Truck (14ft Truck - Heavy Loads)
                </option>
                <option value="container">
                  Container Truck (20-32ft Trucks - Bulk Transport)
                </option>
              </select>
              {vehicleError && (
                <p className="text-red-500 text-sm mt-2">{vehicleError}</p>
              )}
            </div>

            {/* Urgency Level */}
            <div className="mb-6">
              <label className="block text-black font-semibold mb-2">
                Urgency Level
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="standard"
                    checked={urgency === "standard"}
                    onChange={() => setUrgency("standard")}
                    className="mr-2"
                  />
                  Standard (No extra charge)
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="express"
                    checked={urgency === "express"}
                    onChange={() => setUrgency("express")}
                    className="mr-2"
                  />
                  Express (+10%)
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="priority"
                    checked={urgency === "priority"}
                    onChange={() => setUrgency("priority")}
                    className="mr-2"
                  />
                  Priority (+20%)
                </label>
              </div>
            </div>

            {/* Insurance Option */}
            <div className="mb-6">
              <label className="block text-black font-semibold mb-2">
                Insurance Option
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="none"
                    checked={insurance === "none"}
                    onChange={() => setInsurance("none")}
                    className="mr-2"
                  />
                  No Insurance
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="basic"
                    checked={insurance === "basic"}
                    onChange={() => setInsurance("basic")}
                    className="mr-2"
                  />
                  Basic (Covers minor damage, up to ₹10,000)
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="full"
                    checked={insurance === "full"}
                    onChange={() => setInsurance("full")}
                    className="mr-2"
                  />
                  Full Coverage (Covers all damages, up to ₹50,000)
                </label>
              </div>
            </div>

            {/* Generate Price Button */}
            <button
              type="button"
              onClick={calculatePrice}
              className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-700 transition-colors duration-300 lg:text-lg cursor-pointer"
            >
              Calculate Price
            </button>
          </form>

          {/* Note */}
          <p className="text-gray-600 text-sm lg:text-base mt-4">
            *The generated price is an estimation only. The actual price may
            vary.
          </p>
        </div>
      </div>

      {/* Result Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(20,20,20,0.5)] z-500 overflow-hidden">
          <motion.div
            className="bg-white p-8 rounded-lg shadow-lg w-75 md:w-85 lg:w-96"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Estimated Price
            </h3>

            {/* Display User-Selected Details */}
            <div className="space-y-4 text-gray-700">
              <p>
                <span className="font-semibold">Distance:</span> {distance} km
              </p>
              <p>
                <span className="font-semibold">Type of Goods:</span>{" "}
                {goodsType === "small"
                  ? "Small Household Items"
                  : goodsType === "medium"
                  ? "Medium Household Items"
                  : goodsType === "large"
                  ? "Large Household Items"
                  : goodsType === "light"
                  ? "Light Industrial Goods"
                  : "Heavy Industrial Goods"}
              </p>
              <p>
                <span className="font-semibold">Vehicle Type:</span>{" "}
                {vehicleType === "mini"
                  ? "Mini Truck"
                  : vehicleType === "tempo"
                  ? "Tempo"
                  : vehicleType === "large"
                  ? "Large Truck"
                  : "Container Truck"}
              </p>
              <p>
                <span className="font-semibold">Urgency Level:</span>{" "}
                {urgency === "standard"
                  ? "Standard"
                  : urgency === "express"
                  ? "Express"
                  : "Priority"}
              </p>
              <p>
                <span className="font-semibold">Insurance Option:</span>{" "}
                {insurance === "none"
                  ? "No Insurance"
                  : insurance === "basic"
                  ? "Basic"
                  : "Full Coverage"}
              </p>
              <p>
                <span className="font-semibold block">Price Range:</span>
                <span className="block text-2xl lg:text-3xl font-bold mt-1 text-center">
                  ₹{priceRange.lower} - ₹{priceRange.upper}
                </span>
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-6 w-full bg-red-500 text-white p-2 rounded-lg hover:bg-red-700 transition-colors duration-300 cursor-pointer"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </motion.section>
  );
};

export default CalculatePrice;
