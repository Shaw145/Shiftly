import { useNavigate } from "react-router-dom";
import {
  FaTruck,
  FaRoute,
  FaMapMarkerAlt,
  FaCompass,
  FaHome,
  FaArrowLeft,
} from "react-icons/fa";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Animated Icons Section */}
        <div className="relative h-48 sm:h-64 mb-8">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <FaRoute className="text-gray-700 text-[180px] sm:text-[250px]" />
          </div>
          <div className="relative z-10 pt-8">
            <div className="relative inline-block">
              <div className="absolute inset-0 rounded-full bg-red-500/10 blur-xl transform scale-150"></div>
              <FaTruck className="text-red-500 text-5xl sm:text-7xl mx-auto animate-bounce relative z-10" />
            </div>
          </div>
          <div className="absolute top-1/2 right-1/4 transform translate-y-[-50%] z-20">
            <div className="relative">
              <div className="absolute inset-0 bg-red-400/10 rounded-full blur-md transform scale-150"></div>
              <FaMapMarkerAlt className="text-red-400 text-2xl sm:text-4xl animate-ping relative z-10" />
            </div>
          </div>
          <div className="absolute bottom-0 left-1/3 transform z-20">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-400/10 rounded-full blur-md transform scale-150"></div>
              <FaCompass className="text-blue-400 text-2xl sm:text-4xl animate-spin relative z-10" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="relative z-20">
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-red-500 mb-4 drop-shadow">
            Oops! Wrong Turn
          </h1>

          {/* Humorous Message */}
          <div className="space-y-2 sm:space-y-3 mb-8 sm:mb-10">
            <p className="text-lg sm:text-2xl lg:text-3xl text-gray-700 font-medium">
              Looks like our driver took a wrong route!
            </p>
            <p className="text-sm sm:text-base lg:text-xl text-gray-600">
              Error 404: This page went on a chai break
            </p>
            <p className="text-xs sm:text-sm lg:text-base text-gray-500 italic">
              Even our best GPS can't locate this page
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
            <button
              onClick={() => navigate(-1)}
              className="group bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 sm:gap-3 w-full sm:w-auto border border-gray-200 hover:border-gray-300 cursor-pointer"
            >
              <FaArrowLeft className="text-base sm:text-lg group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="text-base sm:text-lg">Go Back</span>
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="group bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 sm:gap-3 w-full sm:w-auto shadow-lg shadow-red-500/10 hover:shadow-red-500/20 cursor-pointer"
            >
              <FaHome className="text-base sm:text-lg group-hover:scale-110 transition-transform duration-300" />
              <span className="text-base sm:text-lg">Back to Dashboard</span>
            </button>
          </div>

          {/* Fun Facts */}
          <div className="mt-8 sm:mt-12 p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 max-w-lg mx-auto shadow-sm">
            <p className="text-sm sm:text-base text-gray-600 italic">
              Even our best drivers sometimes take the scenic route...
              accidentally! 🚚
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
