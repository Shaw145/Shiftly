import { motion } from "framer-motion";
import { FaEnvelope, FaPhone } from "react-icons/fa";
import customerCare from "../assets/customercare.png";

export default function HaveAQuestion() {
  return (
    <section className="relative w-full min-h-[550px] py-20 px-6 md:px-32 mt-24 flex flex-col md:flex-row items-center justify-center bg-white">
      {/* Left Side - Text Content */}
      <div className="md:w-1/2 text-left md:pl-8 lg:pl-50">
        <motion.h2
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
        >
          Have Questions?<br /> Talk to us!
        </motion.h2>
        <p className="text-gray-700 text-lg mb-6">
          Need assistance with your transport needs? Our expert support team is
          here to help. Contact us anytime for quick and efficient solutions.
        </p>
        <div className="space-y-4">
          <motion.a
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            href="mailto:support@shiftly.com"
            className="flex items-center bg-primary text-white px-3 py-2 rounded-lg space-x-2 text-base lg:text-lg font-bold shadow-lg cursor-pointer w-fit"
          >
            <FaEnvelope className="text-xl" />
            <span>support@shiftly.com</span>
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            href="tel:+918765432100"
            className="flex items-center border-2 border-gray-400 px-3 py-2 rounded-lg space-x-2 text-base lg:text-lg font-bold text-gray-900 shadow-lg cursor-pointer w-fit"
          >
            <FaPhone className="text-xl text-gray-900" />
            <span>+91 87654 32100</span>
          </motion.a>
        </div>
      </div>

      {/* Right Side - Image */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="relative md:w-1/2 flex justify-center mt-10 md:mt-0"
      >
        <div className="relative">
          <motion.img
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
            src={customerCare}
            alt="Customer Support"
            className="w-64 md:w-72 lg:w-80 rounded-lg shadow-lg"
          />
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 bg-primary text-white px-5 py-3 rounded-lg text-base lg:text-lg font-bold shadow-lg md:w-[75%] text-center"
          >
            Industry Expert Support with 100% Satisfaction
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
