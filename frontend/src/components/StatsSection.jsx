import { motion } from "framer-motion";
import { FaUsers, FaIdBadge, FaShippingFast } from "react-icons/fa";
import worldMap from "../assets/worldmap.png"; // Import the world map image

export default function StatsSection() {
  return (
    <motion.div
      className="absolute left-1/2 transform -translate-x-1/2 -bottom-5 md:-bottom-8 w-[90%] md:w-[75%] bg-white shadow-[0px_15px_40px_rgba(0,0,0,0.15)] rounded-xl py-12 px-6 md:px-29 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left border border-gray-200 z-20"
      style={{
        backgroundImage: `url(${worldMap})`, // Use the imported world map image
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          className="flex flex-col md:flex-row items-center space-x-4 md:space-x-6 w-full md:w-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: index * 0.2 }}
        >
          {/* Icon with Soft Background */}
          <div className="relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20">
            <motion.div
              className="absolute inset-0 w-full h-full bg-gray-200/50 rounded-xl blur-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
            <stat.icon className="relative z-10 text-primary text-4xl md:text-5xl" />
          </div>

          {/* Number & Label */}
          <div className="max-w-[120px] md:max-w-[150px]">
            <motion.h3
              className="text-3xl md:text-4xl font-bold whitespace-nowrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              {stat.number}
            </motion.h3>
            <p className="text-gray-600 text-sm md:text-base">{stat.label}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

const stats = [
  { number: "1K+", label: "Registered Users", icon: FaUsers },
  { number: "500+", label: "Verified Drivers", icon: FaIdBadge },
  { number: "5K+", label: "Successful Deliveries", icon: FaShippingFast },
];
