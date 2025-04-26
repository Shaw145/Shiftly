import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaMinus, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const faqData = [
  {
    question: "What is Shiftly, and how does it work?",
    answer:
      "Shiftly is a transport platform that connects customers with drivers for seamless goods transportation. Customers enter pick-up and destination addresses, choose a vehicle, and receive bids from drivers. After selecting a driver, they can track their shipment in real-time until delivery.",
  },
  {
    question: "How is the pricing determined?",
    answer:
      "The system generates a price range based on distance, goods type, weight, and vehicle type. Drivers then place bids within this range, and customers choose the most suitable option based on price and driver rating.",
  },
  {
    question: "What types of goods can I transport using Shiftly?",
    answer:
      "You can transport both household and industrial goods, including furniture, appliances, office equipment, raw materials, and packaged goods. However, hazardous materials and restricted items are not allowed.",
  },
  {
    question: "What if I don't know the weight or volume of my goods?",
    answer:
      "If you're unsure, Shiftly provides an AI-powered estimator where you can describe or upload an image of your items, and the system will suggest an approximate weight and volume to help you choose the right vehicle.",
  },
  {
    question: "What is the Driver Biding System?",
    answer:
      "Once a customer enters their transport details, Shiftly generates a price range. Drivers in the area can bid within this range, and the customer selects the driver based on price, rating, and availability.",
  },
  {
    question: "How do I track my goods during transport?",
    answer:
      "After booking, you get a live tracking feature where you can monitor your shipment in real-time on the platform. You'll also receive updates at key checkpoints.",
  },
  {
    question: "Does Shiftly offer packing services?",
    answer:
      "Currently, drivers assist with loading and unloading. However, in the future, Shiftly will provide full packing, pickup, delivery, and unpacking services with our own fleet.",
  },
  {
    question: "What if a driver cancels my booking?",
    answer:
      "If a driver cancels, the system will automatically match you with the next best available driver based on your original selection criteria. You can also choose a new driver from the bidding list.",
  },
  {
    question: "Can businesses use Shiftly for regular transportation needs?",
    answer:
      "Absolutely! Businesses can book recurring transport services, track deliveries, and manage logistics efficiently using Shiftly's platform.",
  },
  {
    question: "What if I need to cancel my booking?",
    answer:
      "You can cancel your booking through the app before the scheduled pickup. Cancellation policies vary based on timing, and a small fee may apply if the cancellation is too close to the pickup time.",
  },
  {
    question: "Can I contact the driver directly?",
    answer:
      "To ensure safety and fair transactions, all communication happens through the Shiftly platform. Customers and drivers can chat or call using our in-app feature without sharing personal contact details.",
  },
  {
    question: "Where is Shiftly currently available?",
    answer:
      "Shiftly is currently launching in major cities of West Bengal and will expand to tier-2 and tier-3 cities across India in the near future. Stay tuned for updates on new locations!",
  },
];

// eslint-disable-next-line react/prop-types
const FAQSection = ({ toggleChatbox }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-16 px-6 md:px-20 bg-accent">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 text-center mb-10">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden"
              whileHover={{ scale: 1.02 }} // Scale up on hover
              transition={{ type: "spring", stiffness: 300 }} // Smooth spring animation
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-6 focus:outline-none cursor-pointer"
              >
                <h3 className=" md:text-xl font-semibold text-gray-900">
                  {faq.question}
                </h3>
                <span className="text-red-700">
                  {activeIndex === index ? <FaMinus /> : <FaPlus />}
                </span>
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{
                      height: { duration: 0.4, ease: "easeInOut" },
                      opacity: { duration: 0.25, ease: "easeInOut" },
                    }}
                    className="border-t border-gray-100"
                  >
                    <div className="px-6 pb-6 pt-4 bg-gray-100">
                      <p className="text-gray-600 lg:text-lg">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
          <div className="text-right mt-6">
            <Link
              to="/faqs"
              className="inline-flex items-center py-2 px-4 text-red-600 font-medium rounded-lg hover:bg-red-100 group hover:scale-105 transition-all duration-200"
            >
              See all FAQs
              <motion.span
                className="ml-2"
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                <FaArrowRight />
              </motion.span>
            </Link>
          </div>
        </div>

        <div className="mt-10 text-center lg:text-lg">
          <p className="text-gray-600">
            Still need help?{" "}
            <button
              onClick={toggleChatbox} // Open chatbot when clicked
              className="text-red-600 hover:text-red-700 transition-colors duration-300 cursor-pointer"
            >
              Chat to us
            </button>
            .
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
