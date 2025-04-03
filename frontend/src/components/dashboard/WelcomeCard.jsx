import { FaTruck, FaMapMarkedAlt, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const WelcomeCard = () => {
  const navigate = useNavigate();
  const fullName = localStorage.getItem("fullName") || "User";

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 relative overflow-hidden border border-gray-100">
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800">
              Welcome to Shiftly, {fullName}!
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Your trusted partner for seamless goods transportation across
              India
            </p>
          </div>
          <div className="bg-blue-50 p-3 sm:p-4 rounded-full shrink-0">
            <FaTruck className="text-3xl sm:text-4xl text-red-500" />
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <FaMapMarkedAlt className="text-red-500 text-lg sm:text-xl" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                Easy Booking
              </h3>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm">
              Book your transport in just a few clicks. Enter your pickup and
              delivery locations, and we&apos;ll find the perfect vehicle for
              your needs.
            </p>
          </div>

          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <div className="bg-green-100 p-2 rounded-lg">
                <FaTruck className="text-green-500 text-lg sm:text-xl" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                Real-time Tracking
              </h3>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm">
              Track your shipment in real-time. Get instant updates about your
              delivery status and estimated arrival time.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
          <button
            onClick={() => navigate("/book-transport")}
            className="bg-red-500 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
          >
            Book Your First Transport
            <FaArrowRight />
          </button>
          <button
            onClick={() => navigate("/how-it-works")}
            className="border-2 border-gray-200 text-gray-700 px-4 sm:px-6 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm sm:text-base cursor-pointer"
          >
            See How It Works
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;
