import { motion } from "framer-motion";
import { FaHandHoldingUsd, FaTruckMoving, FaShieldAlt, FaGavel, FaMapMarkedAlt, FaHandshake, FaCheck } from "react-icons/fa";

export default function Features() {
  return (
    <section className="relative w-full py-16 px-6 md:px-38 bg-accent overflow-hidden">
      {/* Heading and Button */}
      <motion.div 
        initial={{ opacity: 0, y: -50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
        className="flex flex-col lg:flex-row justify-between items-center mb-10 text-center lg:text-left"
      >
        <h2 className="text-3xl pb-4 md:text-4xl lg:text-4xl lg:text-center font-bold text-gray-900 relative inline-block lg:w-auto">
          <span className="absolute left-0 top-0 h-full w-2 bg-primary"></span>
          <span className="pl-4">Our Special Features That Make Your Move Hassle-Free</span>
        </h2>
        <motion.a
          href="/services"
          whileHover={{ x: 10, backgroundColor: "#04223E", scale: 1.1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center bg-primary text-white xxs:px-3 xxs:py-2 lg:px-6 lg:py-3 rounded-lg space-x-2 text-base lg:text-lg font-bold shadow-lg cursor-pointer"
        >       
          <span className="whitespace-nowrap">See More...</span>
        </motion.a>
      </motion.div>
      
      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {features.map((feature, index) => (
          <motion.div 
            key={index} 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center text-center md:text-left md:items-start space-y-4 bg-white p-6 rounded-lg shadow-xl"
          >
            <motion.div 
              initial={{ rotateY: 180 }}
              animate={{ rotateY: 0 }}
              transition={{ duration: 0.6 }}
              className="relative flex items-center justify-center"
            >
              <feature.icon className="text-6xl md:text-7xl text-black drop-shadow-lg" />
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.2 }}
                className="absolute top-0 right-0 bg-green w-6 h-6 flex items-center justify-center rounded-full"
              >
                <FaCheck className="text-white text-sm" />
              </motion.span>
            </motion.div>
            <div>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-gray-600 lg:text-lg">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

const features = [
  {
    title: "Transparent Pricing",
    description: "Get clear and competitive pricing with no hidden charges.",
    icon: FaHandHoldingUsd,
  },
  {
    title: "Wide Vehicle Options",
    description: "Choose from small tempos to large trucks as per your needs.",
    icon: FaTruckMoving,
  },
  {
    title: "Secure Transportation",
    description: "Your goods are protected with our insurance-backed delivery.",
    icon: FaShieldAlt,
  },
  {
    title: "Driver Bidding",
    description: "Drivers bid within a set price range, ensuring fair competition and choice for customers.",
    icon: FaGavel,
  },
  {
    title: "Live Tracking",
    description: "Monitor your shipment in real-time with GPS tracking.",
    icon: FaMapMarkedAlt,
  }, 
  {
    title: "Verified Drivers",
    description: "All drivers are background-checked for safety and reliability.",
    icon: FaHandshake,
  },
];
