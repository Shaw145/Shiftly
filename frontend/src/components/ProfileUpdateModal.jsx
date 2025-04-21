import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle, FaTimes, FaUser } from 'react-icons/fa';

const ProfileUpdateModal = ({ isOpen, onClose, username }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleProfileRedirect = () => {
    navigate(`/user/${username}`);
  };

  // Prevent body scrolling when modal is open
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/40 bg-opacity-60" onClick={onClose}>
      <div className="relative w-full max-w-md mx-4 px-4" onClick={(e) => e.stopPropagation()}>
        <div className="bg-white rounded-xl shadow-xl p-6 border-2 border-red-100">
          <div className="absolute top-4 right-8">
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-red-600 transition-colors duration-200 focus:outline-none cursor-pointer hover:scale-110"
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
              Please update your mobile number to continue using our services. 
              This helps us provide better support and communication.
            </p>
          </div>
          
          <div className="flex flex-col-reverse sm:flex-row gap-3 justify-center">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200 cursor-pointer hover:shadow-lg hover:shadow-gray-300"
            >
              Later
            </button>
            <button
              onClick={handleProfileRedirect}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer hover:shadow-lg hover:shadow-red-300"
            >
              <FaUser className="text-sm" /> Update Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdateModal;