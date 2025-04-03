import { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";
import { motion } from "framer-motion";

const GoToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when user scrolls past hero section
  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById("hero");
      if (heroSection) {
        const heroHeight = heroSection.offsetHeight;
        if (window.scrollY > heroHeight) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          className="GoToTopButton fixed bottom-6 right-6 bg-red-600 text-white p-2 rounded-lg shadow-lg hover:bg-red-700 transition-all duration-300 hover:scale-105 z-50 cursor-pointer"
          whileHover={{ scale: 1.1 }} // Hover animation
          whileTap={{ scale: 0.9 }} // Click animation
        >
          <FaArrowUp className="text-lg" />
        </motion.button>
      )}
    </>
  );
};

export default GoToTop;