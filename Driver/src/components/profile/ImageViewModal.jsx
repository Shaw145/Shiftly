import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const ImageViewModal = ({ image, onClose, onDelete, fullName }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete();
    setIsDeleting(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 backdrop-blur-sm bg-black/25 z-50 flex items-center justify-center"
        style={{ overflow: "hidden" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          className="relative max-w-lg w-[90%] p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col items-center bg-white/90 rounded-xl overflow-hidden backdrop-blur-sm">
            {/* Image Container */}
            <div className="w-full">
              <img
                src={image}
                alt={fullName}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            </div>

            {/* Buttons */}
            <div className="w-full flex justify-center gap-4 p-4">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2 cursor-pointer"
              >
                <FaTrash className="w-4 h-4" />
                <span>{isDeleting ? "Deleting..." : "Delete Photo"}</span>
              </button>
              <button
                onClick={onClose}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ImageViewModal;
