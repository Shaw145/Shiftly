import { motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function WhyChooseUs() {
  return (
    <section className="relative w-full py-16 px-6 md:px-20 bg-white flex justify-center">
      <div className="w-full max-w-5xl">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-5xl font-bold text-center text-gray-900 mb-10"
        >
          Why Choose Us?
        </motion.h2>
        
        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="overflow-hidden shadow-lg rounded-lg w-full"
        >
          <div className="grid grid-cols-3 bg-gray-100 text-center text-sm md:text-lg">
            {/* Feature Names */}
            <div className="p-6 bg-gray-200">
              <h3 className="text-base md:text-xl font-semibold text-gray-800 mb-13 sm:mb-11"></h3>
              {features.map((feature, index) => (
                <div key={index} className="flex items-center justify-center p-4 border-b border-gray-300 last:border-b-0 text-gray-800 font-semibold min-h-[90px] md:min-h-[100px]">
                  {feature.title}
                </div>
              ))}
            </div>
            
            {/* Other Platforms */}
            <div className="p-6 bg-gray-100">
              <h3 className="text-base md:text-xl font-semibold text-gray-800 mb-1 sm:mb-4">Other Platforms</h3>
              {features.map((feature, index) => (
                <div key={index} className="flex items-center justify-center p-4 border-b border-gray-300 last:border-b-0 min-h-[90px] md:min-h-[100px]">
                  {feature.availableOnOthers ? (
                    <FaCheckCircle className="text-green-500 text-xl" />
                  ) : (
                    <FaTimesCircle className="text-red-500 text-xl" />
                  )}
                </div>
              ))}
            </div>

            {/* Shiftly */}
            <div className="p-6 bg-white">
              <h3 className="text-base md:text-xl font-semibold text-primary mb-7 sm:mb-4">Shiftly</h3>
              {features.map((feature, index) => (
                <div key={index} className="flex items-center justify-center p-4 border-b border-gray-300 last:border-b-0 min-h-[90px] md:min-h-[100px]">
                  <FaCheckCircle className="text-green-500 text-xl" />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const features = [
  { title: "Secure Transportation", availableOnOthers: true },
  { title: "Verified Drivers", availableOnOthers: true },
  { title: "Timely Deliveries", availableOnOthers: true },
  { title: "Driver Bidding", availableOnOthers: false },
  { title: "Transparent Pricing", availableOnOthers: false },
  { title: "Live Tracking", availableOnOthers: false },
  { title: "Wide Vehicle Options", availableOnOthers: false },
  { title: "24/7 Customer Support", availableOnOthers: false },
];