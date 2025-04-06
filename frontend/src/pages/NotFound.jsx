import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaTruck,
  FaRoute,
  FaMapMarkerAlt,
  FaCompass
} from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-4 overflow-hidden pt-20">
      <div className="max-w-3xl w-full text-center py-8">

        {/* Animated Icons Section */}
        <div className="relative h-48 sm:h-64 mb-8">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <FaRoute className="text-gray-700 text-[180px] sm:text-[250px]" />
          </div>
          <div className="relative z-10 pt-8">
            <div className="relative inline-block">
              <div className="absolute inset-0 rounded-full bg-red-500/10 blur-xl transform scale-150"></div>
              <FaTruck className="text-red-500 text-6xl sm:text-8xl mx-auto animate-bounce relative z-10" />
            </div>
          </div>
          <div className="absolute top-1/2 right-1/4 transform translate-y-[-50%] z-20">
            <div className="relative">
              <div className="absolute inset-0 bg-red-400/10 rounded-full blur-md transform scale-150"></div>
              <FaMapMarkerAlt className="text-red-400 text-3xl animate-ping relative z-10" />
            </div>
          </div>
          <div className="absolute bottom-0 left-1/3 transform z-20">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-400/10 rounded-full blur-md transform scale-150"></div>
              <FaCompass className="text-blue-400 text-3xl animate-spin relative z-10" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3"
        >
          Oops! Your Truck Got Lost 🚛
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base md:text-lg text-gray-600 mb-6"
        >
          Even with GPS, some pages are harder to find than your missing socks!
          🧦
        </motion.p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/dashboard"
              className="inline-block bg-red-500 text-white px-6 py-4 rounded-lg font-semibold hover:bg-red-600 transition-colors duration-300"
            >
              Back to Dashboard! 🏠
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/contact"
              className="inline-block bg-gray-200 text-gray-800 px-8 py-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-300"
            >
              Contact Support
            </Link>
          </motion.div>
        </div>

        {/* Additional Help Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-sm lg:text-lg text-gray-500"
        >
          If you&apos;re convinced this page should exist (like unicorns 🦄),
          <br />
          our support team would love to hear your theory!
        </motion.p>
      </div>
    </div>
  );
};

export default NotFound;
