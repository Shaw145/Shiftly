import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle, FaTimes, FaUser } from 'react-icons/fa';

const ProfileUpdateModal = ({ isOpen, onClose, username }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleProfileRedirect = () => {
    navigate(`/profile/${username}`);
  };

  // Prevent body scrolling when modal is open
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/40 bg-opacity-60" onClick={onClose}>
      <div className="relative w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="bg-white rounded-xl shadow-xl p-6 border-2 border-red-100">
          <div className="absolute top-3 right-3">
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-red-600 transition-colors duration-200 focus:outline-none cursor-pointer"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
          
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <FaExclamationTriangle className="text-red-500 text-4xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Profile Update Required</h3>
            <p className="text-gray-600">
              Please update your address and other information to participate in the bidding process. 
              Bookings are shown based on your location.
            </p>
          </div>
          
          <div className="flex flex-col-reverse sm:flex-row gap-3 justify-center">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleProfileRedirect}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <FaUser className="text-sm" /> Go to Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdateModal;