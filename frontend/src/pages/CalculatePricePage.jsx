import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import worldMap from "../assets/worldmap.png";
import {
  FaCalculator,
  FaRoad,
  FaBoxOpen,
  FaTruck,
  FaShippingFast,
  FaShieldAlt,
} from "react-icons/fa";

const CalculatePricePage = () => {
  const [distance, setDistance] = useState(0);
  const [goodsType, setGoodsType] = useState("small");
  const [vehicleType, setVehicleType] = useState("mini");
  const [urgency, setUrgency] = useState("standard");
  const [insurance, setInsurance] = useState("none");
  const [priceRange, setPriceRange] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [distanceError, setDistanceError] = useState("");
  const [vehicleError, setVehicleError] = useState("");
  const [activeSection, setActiveSection] = useState("calculator");

  // Set dynamic page title when component mounts
  useEffect(() => {
    // Update the document title
    document.title =
      "Price Calculator | Get Transport Estimates | Shiftly - A Seamless Transport System";

    // Optional: Restore the original title when component unmounts
    return () => {
      document.title = "Shiftly | A Seamless Transport System";
    };
  }, []);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

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
    <>
      <main className="pt-20">
        {/* Hero Section */}
        <motion.section
          className="bg-gradient-to-r from-gray-900 to-body-dark py-20 px-6 relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10"
            // style={{ backgroundImage: `url('../assets/auth-bg.jpg')` }}
          ></div>
          <div className="max-w-6xl mx-auto relative z-10 text-center">
            <motion.h1
              className="text-4xl md:text-6xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Calculate Your Shipping Price
            </motion.h1>
            <motion.p
              className="text-xl text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              Get an instant estimate for your shipping needs with our
              easy-to-use price calculator. Plan your budget and make informed
              decisions without any commitment.
            </motion.p>
          </div>
        </motion.section>

        {/* Navigation Tabs */}
        <section className="bg-white border-b border-gray-200 top-20 z-30">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap justify-center">
              <button
                onClick={() => setActiveSection("calculator")}
                className={`px-6 py-4 text-lg font-medium transition-all cursor-pointer ${
                  activeSection === "calculator"
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-500 hover:text-primary"
                }`}
              >
                <FaCalculator className="inline mr-2 mb-1" />
                Price Calculator
              </button>
              <button
                onClick={() => setActiveSection("factors")}
                className={`px-6 py-4 text-lg font-medium transition-all cursor-pointer ${
                  activeSection === "factors"
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-500 hover:text-primary"
                }`}
              >
                <FaBoxOpen className="inline mr-2 mb-1" />
                Pricing Factors
              </button>
              <button
                onClick={() => setActiveSection("faq")}
                className={`px-6 py-4 text-lg font-medium transition-all cursor-pointer ${
                  activeSection === "faq"
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-500 hover:text-primary"
                }`}
              >
                <FaShippingFast className="inline mr-2 mb-1" />
                Shipping FAQ
              </button>
            </div>
          </div>
        </section>

        {/* Calculator Section */}
        {activeSection === "calculator" && (
          <motion.section
            className="py-16 px-6 relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Background Image */}
            <div className="absolute inset-0 opacity-100">
              <img
                src={worldMap}
                alt="World Map"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Calculator Form - Takes 3 columns */}
                <div className="lg:col-span-3">
                  <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-100">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                      Estimate Your Shipping Cost
                    </h2>
                    <p className="text-gray-600 mb-8">
                      Fill in the details below to get an accurate price
                      estimate for your shipment. Our calculator considers
                      distance, goods type, vehicle requirements, and additional
                      services.
                    </p>

                    <form>
                      {/* Distance */}
                      <div className="mb-6">
                        <label className="block text-gray-700 font-semibold mb-2">
                          <FaRoad className="inline mr-2 text-primary" />
                          Distance (km)
                        </label>
                        <input
                          type="number"
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "" || !isNaN(value)) {
                              setDistance(value === "" ? 0 : Number(value));
                            }
                          }}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          placeholder="Enter distance in kilometers"
                        />
                        {distanceError && (
                          <p className="text-red-500 text-sm mt-2">
                            {distanceError}
                          </p>
                        )}
                      </div>

                      {/* Type of Goods */}
                      <div className="mb-6">
                        <label className="block text-gray-700 font-semibold mb-2">
                          <FaBoxOpen className="inline mr-2 text-primary" />
                          Type of Goods
                        </label>
                        <select
                          value={goodsType}
                          onChange={(e) => setGoodsType(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none bg-white"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23999' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 1rem center",
                            backgroundSize: "1rem",
                          }}
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
                            Heavy Industrial Goods (e.g. Machinery, Raw
                            Materials)
                          </option>
                        </select>
                      </div>

                      {/* Vehicle Type */}
                      <div className="mb-6">
                        <label className="block text-gray-700 font-semibold mb-2">
                          <FaTruck className="inline mr-2 text-primary" />
                          Vehicle Type
                        </label>
                        <select
                          value={vehicleType}
                          onChange={(e) => setVehicleType(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none bg-white"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23999' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 1rem center",
                            backgroundSize: "1rem",
                          }}
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
                          <p className="text-red-500 text-sm mt-2">
                            {vehicleError}
                          </p>
                        )}
                      </div>

                      {/* Urgency Level */}
                      <div className="mb-6">
                        <label className="block text-gray-700 font-semibold mb-2">
                          <FaShippingFast className="inline mr-2 text-primary" />
                          Urgency Level
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <label className="relative flex items-center p-3 rounded-lg border border-gray-200 cursor-pointer hover:border-primary transition-colors">
                            <input
                              type="radio"
                              value="standard"
                              checked={urgency === "standard"}
                              onChange={() => setUrgency("standard")}
                              className="absolute opacity-0"
                            />
                            <span
                              className={`w-5 h-5 inline-block rounded-full border border-gray-400 mr-3 flex-shrink-0 ${
                                urgency === "standard"
                                  ? "bg-primary border-primary"
                                  : "bg-white"
                              }`}
                            ></span>
                            <div>
                              <p className="font-medium text-gray-800">
                                Standard
                              </p>
                              <p className="text-xs text-gray-500">
                                Regular delivery time
                              </p>
                            </div>
                          </label>
                          <label className="relative flex items-center p-3 rounded-lg border border-gray-200 cursor-pointer hover:border-primary transition-colors">
                            <input
                              type="radio"
                              value="express"
                              checked={urgency === "express"}
                              onChange={() => setUrgency("express")}
                              className="absolute opacity-0"
                            />
                            <span
                              className={`w-5 h-5 inline-block rounded-full border border-gray-400 mr-3 flex-shrink-0 ${
                                urgency === "express"
                                  ? "bg-primary border-primary"
                                  : "bg-white"
                              }`}
                            ></span>
                            <div>
                              <p className="font-medium text-gray-800">
                                Express
                              </p>
                              <p className="text-xs text-gray-500">
                                +10% faster delivery
                              </p>
                            </div>
                          </label>
                          <label className="relative flex items-center p-3 rounded-lg border border-gray-200 cursor-pointer hover:border-primary transition-colors">
                            <input
                              type="radio"
                              value="priority"
                              checked={urgency === "priority"}
                              onChange={() => setUrgency("priority")}
                              className="absolute opacity-0"
                            />
                            <span
                              className={`w-5 h-5 inline-block rounded-full border border-gray-400 mr-3 flex-shrink-0 ${
                                urgency === "priority"
                                  ? "bg-primary border-primary"
                                  : "bg-white"
                              }`}
                            ></span>
                            <div>
                              <p className="font-medium text-gray-800">
                                Priority
                              </p>
                              <p className="text-xs text-gray-500">
                                +20% premium service
                              </p>
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* Insurance Option */}
                      <div className="mb-8">
                        <label className="block text-gray-700 font-semibold mb-2">
                          <FaShieldAlt className="inline mr-2 text-primary" />
                          Insurance Option
                        </label>
                        <div className="grid grid-cols-1 gap-4">
                          <label className="relative flex items-center p-3 rounded-lg border border-gray-200 cursor-pointer hover:border-primary transition-colors">
                            <input
                              type="radio"
                              value="none"
                              checked={insurance === "none"}
                              onChange={() => setInsurance("none")}
                              className="absolute opacity-0"
                            />
                            <span
                              className={`w-5 h-5 inline-block rounded-full border border-gray-400 mr-3 flex-shrink-0 ${
                                insurance === "none"
                                  ? "bg-primary border-primary"
                                  : "bg-white"
                              }`}
                            ></span>
                            <div>
                              <p className="font-medium text-gray-800">
                                No Insurance
                              </p>
                              <p className="text-xs text-gray-500">
                                Standard shipping without additional protection
                              </p>
                            </div>
                          </label>
                          <label className="relative flex items-center p-3 rounded-lg border border-gray-200 cursor-pointer hover:border-primary transition-colors">
                            <input
                              type="radio"
                              value="basic"
                              checked={insurance === "basic"}
                              onChange={() => setInsurance("basic")}
                              className="absolute opacity-0"
                            />
                            <span
                              className={`w-5 h-5 inline-block rounded-full border border-gray-400 mr-3 flex-shrink-0 ${
                                insurance === "basic"
                                  ? "bg-primary border-primary"
                                  : "bg-white"
                              }`}
                            ></span>
                            <div>
                              <p className="font-medium text-gray-800">
                                Basic Insurance
                              </p>
                              <p className="text-xs text-gray-500">
                                Covers minor damage, up to ₹10,000
                              </p>
                            </div>
                          </label>
                          <label className="relative flex items-center p-3 rounded-lg border border-gray-200 cursor-pointer hover:border-primary transition-colors">
                            <input
                              type="radio"
                              value="full"
                              checked={insurance === "full"}
                              onChange={() => setInsurance("full")}
                              className="absolute opacity-0"
                            />
                            <span
                              className={`w-5 h-5 inline-block rounded-full border border-gray-400 mr-3 flex-shrink-0 ${
                                insurance === "full"
                                  ? "bg-primary border-primary"
                                  : "bg-white"
                              }`}
                            ></span>
                            <div>
                              <p className="font-medium text-gray-800">
                                Full Coverage
                              </p>
                              <p className="text-xs text-gray-500">
                                Covers all damages, up to ₹50,000
                              </p>
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* Generate Price Button */}
                      <motion.button
                        type="button"
                        onClick={calculatePrice}
                        className="w-full bg-gradient-to-br from-red-500 to-pink-600 text-white py-3 px-4 md:py-4 md:px-6 rounded-lg md:text-lg font-semibold hover:bg-primary-dark transition-colors duration-300 cursor-pointer shadow-lg"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Calculate My Price
                      </motion.button>
                    </form>

                    {/* Note */}
                    <p className="text-gray-500 text-sm mt-4 text-center">
                      *The generated price is an estimation. Actual price may
                      vary based on specific requirements.
                    </p>
                  </div>
                </div>

                {/* Info Cards Section - Takes 2 columns */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Why Use Our Calculator */}
                  <motion.div
                    className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                      Why Use Our Calculator?
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="bg-green-100 p-2 rounded-full text-green-600 mr-3 mt-0.5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <p className="text-gray-700 mt-1.5">
                          Instant accurate pricing without waiting
                        </p>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-green-100 p-2 rounded-full text-green-600 mr-3 mt-0.5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <p className="text-gray-700 mt-1.5">
                          Plan your budget with confidence
                        </p>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-green-100 p-2 rounded-full text-green-600 mr-3 mt-0.5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <p className="text-gray-700 mt-1.5">
                          Transparent pricing with all fees included
                        </p>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-green-100 p-2 rounded-full text-green-600 mr-3 mt-0.5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <p className="text-gray-700 mt-1.5">
                          Compare different options and services
                        </p>
                      </li>
                    </ul>
                  </motion.div>

                  {/* Customer Testimonial */}
                  <motion.div
                    className="bg-gradient-to-br from-blue-100 to-gray-100 p-6 rounded-xl shadow-lg border border-blue-100"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <div className="flex justify-center mb-4">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-yellow-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 italic mb-4">
                      &quot;Amazing service! Everything was handled
                      professionally, and my goods arrived in perfect condition.
                      Will definitely recommend to others.&quot;
                    </p>
                    <div className="flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-semibold">AS</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Amit Sharma</p>
                        <p className="text-xs text-gray-500">Delhi to Mumbai</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Need Help */}
                  <motion.div
                    className="bg-transparent bg-opacity-10 p-6 rounded-xl shadow-lg border border-primary border-opacity-30"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <h3 className="text-xl font-bold text-primary mb-4">
                      Need Help?
                    </h3>
                    <p className="text-gray-700 mb-4">
                      If you need assistance with calculating your shipping cost
                      or have any questions, our customer support team is ready
                      to help.
                    </p>
                    <Link
                      to="/contact-us"
                      className="block w-full py-3 bg-gradient-to-br from-red-500 to-pink-600 text-white text-center rounded-lg font-medium hover:bg-primary-dark transition-all duration-200 hover:scale-105 cursor-pointer  hover:shadow-lg hover:shadow-red-300"
                    >
                      Contact Support
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Pricing Factors Section */}
        {activeSection === "factors" && (
          <motion.section
            className="py-16 px-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Factors That Affect Shipping Price
                </h2>
                <p className="text-gray-600 max-w-3xl mx-auto">
                  Understanding what influences shipping costs can help you
                  optimize your expenditure and plan better. Here are the key
                  factors that determine your shipping price.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Distance Factor */}
                <motion.div
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border-t-4 border-blue-500"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                    <FaRoad className="text-2xl text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    Distance
                  </h3>
                  <p className="text-gray-600">
                    The distance between pickup and delivery locations is one of
                    the primary factors affecting shipping costs. Longer
                    distances typically mean higher fuel consumption, more
                    driver time, and increased wear on vehicles.
                  </p>
                  <div className="mt-4 text-sm">
                    <p className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Short Distance (0-50 km): Base rate applies
                    </p>
                    <p className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Medium Distance (51-300 km): Medium rate applies
                    </p>
                    <p className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Long Distance (300+ km): Long distance rate applies
                    </p>
                  </div>
                </motion.div>

                {/* Vehicle Type Factor */}
                <motion.div
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border-t-4 border-green-500"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                    <FaTruck className="text-2xl text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    Vehicle Type
                  </h3>
                  <p className="text-gray-600">
                    Different vehicle types have varying costs of operation,
                    capacities, and fuel efficiencies. Larger vehicles generally
                    cost more to operate but can be more economical for bulky
                    shipments.
                  </p>
                  <div className="mt-4 text-sm">
                    <p className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Mini Truck: Most economical for small loads
                    </p>
                    <p className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Tempo: Cost-effective for medium loads
                    </p>
                    <p className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Large Truck: Higher cost but efficient for heavy loads
                    </p>
                    <p className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Container Truck: Highest cost but best for bulk transport
                    </p>
                  </div>
                </motion.div>

                {/* Goods Type Factor */}
                <motion.div
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border-t-4 border-purple-500"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-purple-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                    <FaBoxOpen className="text-2xl text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    Type of Goods
                  </h3>
                  <p className="text-gray-600">
                    The nature of goods affects handling requirements, packing
                    needs, and the type of vehicle required. Delicate or
                    hazardous items often require additional care and
                    specialized equipment.
                  </p>
                  <div className="mt-4 text-sm">
                    <p className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                      Small Items: Lowest handling fee
                    </p>
                    <p className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                      Medium Items: Moderate handling fee
                    </p>
                    <p className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                      Large & Industrial Items: Higher handling fees
                    </p>
                  </div>
                </motion.div>

                {/* Urgency Factor */}
                <motion.div
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border-t-4 border-red-500"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-red-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                    <FaShippingFast className="text-2xl text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    Urgency Level
                  </h3>
                  <p className="text-gray-600">
                    Expedited shipping requires additional resources and
                    priority handling. The faster you need your goods delivered,
                    the higher the cost will typically be.
                  </p>
                  <div className="mt-4 text-sm">
                    <p className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                      Standard: No additional cost
                    </p>
                    <p className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                      Express: 10% surcharge for faster delivery
                    </p>
                    <p className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                      Priority: 20% surcharge for premium service
                    </p>
                  </div>
                </motion.div>

                {/* Insurance Factor */}
                <motion.div
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border-t-4 border-amber-500"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-amber-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                    <FaShieldAlt className="text-2xl text-amber-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    Insurance Coverage
                  </h3>
                  <p className="text-gray-600">
                    Protecting your goods during transit provides peace of mind
                    but adds to the shipping cost. Different levels of insurance
                    cover different risks and values of goods.
                  </p>
                  <div className="mt-4 text-sm">
                    <p className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                      No Insurance: No additional cost
                    </p>
                    <p className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                      Basic Insurance: Adds ₹100 to cover up to ₹10,000
                    </p>
                    <p className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                      Full Coverage: Adds ₹200 to cover up to ₹50,000
                    </p>
                  </div>
                </motion.div>

                {/* Other Factors */}
                <motion.div
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border-t-4 border-gray-500"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-gray-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    Additional Factors
                  </h3>
                  <p className="text-gray-600">
                    Several other factors may affect your final shipping price,
                    including seasonal demand, fuel surcharges, and location
                    accessibility.
                  </p>
                  <div className="mt-4 text-sm">
                    <p className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
                      Seasonal peaks (holidays, month-end)
                    </p>
                    <p className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
                      Remote or difficult-to-access locations
                    </p>
                    <p className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
                      Special handling requirements
                    </p>
                    <p className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
                      Government taxes and duties (GST: 18%)
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Price Guarantee Banner */}
              <motion.div
                className="mt-16 bg-gradient-to-r from-blue-600 to-primary p-8 rounded-xl text-white shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="mb-6 md:mb-0">
                    <h3 className="text-2xl font-bold mb-2">
                      Our Price Guarantee
                    </h3>
                    <p className="text-blue-100">
                      We&apos;re committed to transparent pricing with no hidden
                      fees. The price you see is the price you pay.
                    </p>
                  </div>
                  <Link
                    to="/login"
                    className="bg-white text-primary font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors shadow-md cursor-pointer"
                  >
                    Book a Shipment
                  </Link>
                </div>
              </motion.div>
            </div>
          </motion.section>
        )}

        {/* FAQ Section */}
        {activeSection === "faq" && (
          <motion.section
            className="py-16 px-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Frequently Asked Questions
                </h2>
                <p className="text-gray-600">
                  Find answers to common questions about our shipping services
                  and price calculations.
                </p>
              </div>

              <div className="space-y-6">
                {/* FAQ Item 1 */}
                <motion.div
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      How accurate is the price calculator?
                    </h3>
                    <p className="text-gray-600">
                      Our price calculator provides a reliable estimate based on
                      the information you provide. In most cases, the final
                      price falls within the calculated range. However,
                      additional factors like difficult access points, extra
                      loading/unloading time, or special handling requirements
                      may affect the final price.
                    </p>
                  </div>
                </motion.div>

                {/* FAQ Item 2 */}
                <motion.div
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      What if my goods don&apos;t fit in the selected vehicle?
                    </h3>
                    <p className="text-gray-600">
                      It&apos;s important to select an appropriate vehicle for
                      your goods. If the goods are larger than anticipated, we
                      may need to arrange a different vehicle, which could
                      affect the price. Our system will alert you if your
                      selected combination seems incompatible (e.g., large goods
                      with a mini truck).
                    </p>
                  </div>
                </motion.div>

                {/* FAQ Item 3 */}
                <motion.div
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Are there any additional charges not included in the
                      calculator?
                    </h3>
                    <p className="text-gray-600">
                      Our calculator includes the base fare, distance charges,
                      goods handling fee, urgency surcharges, insurance costs,
                      and GST. Additional charges might apply for waiting time
                      beyond the allowed period, multiple pickup/drop locations,
                      or special loading/unloading requirements. These will be
                      discussed and agreed upon before confirmation.
                    </p>
                  </div>
                </motion.div>

                {/* FAQ Item 4 */}
                <motion.div
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      How do I know which vehicle type to select?
                    </h3>
                    <p className="text-gray-600">
                      The appropriate vehicle depends on the size, weight, and
                      quantity of your goods:
                    </p>
                    <ul className="list-disc list-inside mt-2 text-gray-600">
                      <li>
                        <strong>Mini Truck (Tata Ace):</strong> Small households
                        items, 5-7 boxes, small appliances
                      </li>
                      <li>
                        <strong>Tempo (Bolero Pickup):</strong> Medium
                        furniture, 1-2 bedroom contents, office equipment
                      </li>
                      <li>
                        <strong>Large Truck (14ft):</strong> Full home moves,
                        large furniture sets, heavy machinery
                      </li>
                      <li>
                        <strong>Container Truck:</strong> Bulk goods, industrial
                        equipment, commercial inventory
                      </li>
                    </ul>
                  </div>
                </motion.div>

                {/* FAQ Item 5 */}
                <motion.div
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                >
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      What is the cancellation policy?
                    </h3>
                    <p className="text-gray-600">
                      Our cancellation policy varies based on when you cancel:
                    </p>
                    <ul className="list-disc list-inside mt-2 text-gray-600">
                      <li>More than 24 hours before pickup: Full refund</li>
                      <li>12-24 hours before pickup: 80% refund</li>
                      <li>4-12 hours before pickup: 50% refund</li>
                      <li>Less than 4 hours before pickup: 20% refund</li>
                      <li>After driver has been dispatched: No refund</li>
                    </ul>
                  </div>
                </motion.div>

                {/* FAQ Item 6 */}
                <motion.div
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                >
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      How is the distance calculated?
                    </h3>
                    <p className="text-gray-600">
                      Distance is calculated based on the standard road route
                      between pickup and delivery locations. This is typically
                      determined using mapping APIs. The actual driving distance
                      may vary slightly due to detours, traffic diversions, or
                      specific location access requirements. For highly accurate
                      estimates, it&apos;s best to provide exact addresses when
                      making a booking.
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Still Have Questions Banner */}
              <div className="mt-12 text-center p-8 bg-gray-50 rounded-xl border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Still Have Questions?
                </h3>
                <p className="text-gray-600 mb-6">
                  Our customer support team is ready to help you with any
                  additional questions.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link
                    to="/contact-us"
                    className="bg-primary text-white font-medium py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors shadow-md cursor-pointer"
                  >
                    Contact Support
                  </Link>
                  <Link
                    to="/faqs"
                    className="bg-white text-gray-700 font-medium py-3 px-6 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    View Full FAQ
                  </Link>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-gray-900 to-body-dark py-16 px-6 relative">
          <div className="absolute inset-0 bg-pattern opacity-10"></div>
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Ship Your Goods?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Now that you&apos;ve calculated your shipping cost, take the next
              step and book your shipment with confidence.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/signup"
                className="bg-gradient-to-br from-red-500 to-pink-600 text-white font-bold py-4 px-8 rounded-lg hover:bg-primary-dark transition-all shadow-lg cursor-pointer hover:scale-105"
              >
                Sign Up & Book
              </Link>
              <Link
                to="/how-it-works"
                className="bg-transparent border-2 border-white text-white font-bold py-4 px-8 rounded-lg hover:bg-white hover:text-body-dark transition-colors cursor-pointer"
              >
                See How It Works
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Result Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 bg-opacity-50 z-50 p-4 overflow-y-auto no-scrollbar">
          <motion.div
            className="bg-white p-6 sm:p-8 rounded-xl shadow-xl w-full max-w-md my-8 mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            style={{ maxHeight: "90vh" }}
          >
            <div
              className="overflow-y-auto"
              style={{ maxHeight: "calc(90vh - 32px)" }}
            >
              <div className="text-center mb-4">
                <div className="inline-block p-3 bg-green-100 rounded-full mb-3">
                  <FaCalculator className="text-2xl sm:text-3xl text-green-600" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Estimated Price Range
                </h3>
                <div className="mt-2 text-2xl sm:text-3xl font-bold text-primary">
                  ₹{priceRange.lower} - ₹{priceRange.upper}
                </div>
              </div>

              {/* Display User-Selected Details */}
              <div className="space-y-3 text-gray-700 mb-4">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 text-sm sm:text-base">
                    Distance:
                  </span>
                  <span className="font-medium text-sm sm:text-base">
                    {distance} km
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 text-sm sm:text-base">
                    Goods Type:
                  </span>
                  <span className="font-medium text-sm sm:text-base">
                    {goodsType === "small"
                      ? "Small Household Items"
                      : goodsType === "medium"
                      ? "Medium Household Items"
                      : goodsType === "large"
                      ? "Large Household Items"
                      : goodsType === "light"
                      ? "Light Industrial Goods"
                      : "Heavy Industrial Goods"}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 text-sm sm:text-base">
                    Vehicle Type:
                  </span>
                  <span className="font-medium text-sm sm:text-base">
                    {vehicleType === "mini"
                      ? "Mini Truck"
                      : vehicleType === "tempo"
                      ? "Tempo"
                      : vehicleType === "large"
                      ? "Large Truck"
                      : "Container Truck"}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 text-sm sm:text-base">
                    Urgency Level:
                  </span>
                  <span className="font-medium text-sm sm:text-base">
                    {urgency === "standard"
                      ? "Standard"
                      : urgency === "express"
                      ? "Express"
                      : "Priority"}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 text-sm sm:text-base">
                    Insurance:
                  </span>
                  <span className="font-medium text-sm sm:text-base">
                    {insurance === "none"
                      ? "No Insurance"
                      : insurance === "basic"
                      ? "Basic"
                      : "Full Coverage"}
                  </span>
                </div>
              </div>

              <div className="p-3 sm:p-4 bg-blue-50 rounded-lg text-xs sm:text-sm text-blue-700 mb-4">
                <p className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 mr-2 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>
                    This is an estimated price range. The final price may vary
                    based on specific requirements and actual conditions. Taxes
                    (18% GST) are included in this estimate.
                  </span>
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-200 text-gray-800 p-3 rounded-lg hover:bg-gray-300 transition-colors font-medium cursor-pointer"
                >
                  Close
                </button>
                <Link
                  to="/login"
                  className="flex-1 bg-gradient-to-br from-red-500 to-pink-600 text-white p-3 rounded-lg hover:bg-primary-dark transition-colors font-medium text-center cursor-pointer"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default CalculatePricePage;
