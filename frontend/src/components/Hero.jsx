import { motion } from "framer-motion";
import { FaArrowRight, FaGlobe, FaBolt } from "react-icons/fa";

// Correctly import images with the accurate folder structure
// import heroImage from "../assets/hero-image.jpg";
import worldMap from "../assets/worldmap.png";
import heroBadge from "../assets/hero-badge.png";
import heroTruck from "../assets/hero-truck2.png";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative w-full mb-7 lg:mb-40 flex flex-col md:flex-row items-center justify-between px-17 py-15 pt-30 md:pt-30 lg:pt-60  bg-white overflow-hidden"
      
    >
      {/* Background World Map */}
      <img
        src={worldMap}
        alt="World Map"
        className="absolute top-30 left-20 w-full h-full object-contain opacity-85"
      />

      {/* Text Content */}
      <div className="md:w-1/3 text-left space-y-6 z-10 md:pl-25">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-3xl  lg:text-5xl font-bold text-gray-900"
        >
          Effortless Goods Transport, Anytime, Anywhere
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-base lg:text-lg text-gray-700"
        >
          Shiftly provides seamless transportation solutions for households and
          businesses, ensuring fast, safe, and reliable delivery across India.
        </motion.p>

        <div className="flex space-x-6">
          <a href="/login">
            <motion.button
              whileHover={{ x: 10, backgroundColor: "#04223E" }}
              transition={{ duration: 0.3 }}
              className="flex items-center bg-primary text-white xxs:px-3 xxs:py-2 lg:px-6 lg:py-3 rounded-lg space-x-2 text-base lg:text-lg font-bold shadow-lg cursor-pointer"
            >
              <span>Book Now</span>
            </motion.button>
          </a>
          <a
            href="/about"
            className="flex items-center space-x-2 text-gray-900 font-semibold relative group hover:text-primary transition-all"
          >
            <span>Learn More</span>
            <FaArrowRight />
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 ease-in-out group-hover:w-full"></span>
          </a>
        </div>

        <div className="flex xxs:space-x-8 lg:space-x-20 mt-12">
          <div className="flex items-center space-x-2">
            <FaGlobe className="text-7xl md:text-6xl text-black" />
            <div>
              <h3 className="text-xl font-semibold">Live Tracking</h3>
              <p className="text-gray-600">
                Track your goods in real-time with precise updates.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <FaBolt className="text-7xl md:text-6xl text-black" />
            <div>
              <h3 className="text-xl font-semibold">Fast Delivery</h3>
              <p className="text-gray-600">
                Efficient logistics to get your items delivered on time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Images Section */}
      <div className="relative md:w-1/2 flex items-center justify-center mt-10 md:mt-0 z-10">
        <motion.img
          src={heroBadge}
          alt="Express Delivery"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-0 left-10 w-17 sm:w-20 md:w-25 lg:w-32"
        />

        <motion.img
          src={heroTruck}
          alt="Hero Truck"
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.5, type: "spring" }}
          className="w-full "
        />
      </div>
    </section>
  );
}
