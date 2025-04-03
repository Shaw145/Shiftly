import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import linePattern from "../assets/line-pattern.png";

export default function ScrollingFeatures() {
    const features = [
        "Seamless Booking",
        "Driver Bidding",
        "Live Tracking",
        "Fair Pricing",
        "Multiple Vehicles",
        "AI-Powered Estimates",
        "Verified Drivers",
        "Secure Payments",
        "Damage Protection",
        "Route Optimization",
    ];    

  const [speed, setSpeed] = useState(60); // Default speed

  useEffect(() => {
    const updateSpeed = () => {
      if (window.innerWidth < 768) {
        setSpeed(30); // Faster on small screens
      } else {
        setSpeed(60); // Slower on big screens
      }
    };

    updateSpeed(); // Call on mount
    window.addEventListener("resize", updateSpeed); // Update on resize

    return () => window.removeEventListener("resize", updateSpeed);
  }, []);

  return (
    <div className="relative w-full bg-primary overflow-hidden" style={{ height: "80px" }}>
      {/* Background Image (Top Border Effect) */}
      <div className="absolute top-0 left-0 w-full h-7 bg-no-repeat bg-top bg-cover opacity-100" style={{ backgroundImage: `url(${linePattern})` }}></div>

      {/* Infinite Scrolling Container */}
      <motion.div
        key={speed} // Forces animation reset when speed changes
        className="flex space-x-1 whitespace-nowrap items-center h-full"
        animate={{ x: ["0%", "-100%"] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: speed, // Adjusted dynamically
        }}
      >
        {[...features, ...features, ...features].map((feature, index) => (
          <div key={index} className="flex items-center text-white text-lg md:text-xl font-bold">
            <span className="mx-2">{feature}</span>
            <span className="text-xl md:text-2xl mx-2">❄</span> {/* Centered Icon */}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
