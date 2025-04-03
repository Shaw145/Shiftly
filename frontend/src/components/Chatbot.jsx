import { FaCommentDots, FaTimes, FaPaperPlane } from "react-icons/fa";
import { motion } from "framer-motion";

// eslint-disable-next-line react/prop-types
const ChatbotButton = ({ isOpen, toggleChatbox }) => {
  return (
    <>
      {/* Chatbot Button */}
      <motion.button
        onClick={toggleChatbox}
        className="chatbotButton fixed bottom-24 right-6 bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition-all duration-300 hover:scale-110 z-50 cursor-pointer" //Whole chatbot modification
        whileHover={{ scale: 1.1 }} // Hover animation
        whileTap={{ scale: 0.9 }} // Click animation
        title="Chat with us"
      >
        <FaCommentDots className="text-2xl" />
      </motion.button>

      {/* Chat Box Modification*/}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-[28rem] bg-white rounded-lg shadow-lg z-50 md:w-96 md:h-[37rem] lg:right-12 lg:w-120 lg:bottom-35"> 
          {/* Chat Box Header */}
          <div className="bg-red-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="text-lg font-semibold">Shiftly Bot</h3>
            <button
              onClick={toggleChatbox}
              className="text-white hover:text-gray-200"
            >
              <FaTimes className="text-xl cursor-pointer" />
            </button>
          </div>

          {/* Chat Field Modification*/}
          <div className="p-4 h-74 md:h-105 overflow-y-auto">
            <div className="text-sm text-gray-700">
              <p className="bg-gray-100 p-3 rounded-lg mb-2 lg:text-base">
                Hi! How can I help you today?
              </p>
            </div>
          </div>

          {/* Input Field and Send Button */}
          <div className="p-4 border-t border-gray-200 flex gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
            />
            <button className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors duration-300 cursor-pointer">
              <FaPaperPlane className="text-xl" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotButton;