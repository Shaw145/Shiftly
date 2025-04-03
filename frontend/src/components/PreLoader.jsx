import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import truckLoader from "../assets/truck-loader.gif";

export default function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // Adjust time if needed
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const chatbotButton = document.querySelector(".chatbotButton");
    const goToTopButton = document.querySelector(".GoToTopButton");
    if (loading) {
      if (chatbotButton) chatbotButton.style.display = "none";
      if (goToTopButton) goToTopButton.style.display = "none";
    } else {
      if (chatbotButton) chatbotButton.style.display = "block";
      if (goToTopButton) goToTopButton.style.display = "block";
    }
  }, [loading]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-white z-100"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -50 }} // Moves up while fading out
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <img
            src={truckLoader} // Path to GIF
            alt="Loading..."
            className="w-30 lg:w-40"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
