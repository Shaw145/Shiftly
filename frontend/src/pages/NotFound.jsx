import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import notFoundImage from "../assets/404.png";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-4 overflow-hidden pt-20">
      <div className="max-w-3xl w-full text-center py-8">
        {/* Animated Image */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 2,
          }}
          className="mb-4"
        >
          <img
            src={notFoundImage}
            alt="404 Error"
            className="w-full max-w-xl mx-auto px-4"
          />
        </motion.div>

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
              to="/"
              className="inline-block bg-red-500 text-white px-6 py-4 rounded-lg font-semibold hover:bg-red-600 transition-colors duration-300"
            >
              Back to Safety! 🏠
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
          If you're convinced this page should exist (like unicorns 🦄),
          <br />
          our support team would love to hear your theory!
        </motion.p>
      </div>
    </div>
  );
};

export default NotFound;
