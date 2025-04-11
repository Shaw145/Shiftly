import { useState, useEffect } from "react";
import { 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaClock, 
  FaTruck, 
  FaBoxOpen, 
  FaWeightHanging, 
  FaRulerCombined, 
  FaMoneyBillWave, 
  FaStar, 
  FaUser, 
  FaTimes, 
  FaDirections, 
  FaFileAlt,
  FaHandsHelping,
  FaCreditCard,
  FaInfoCircle,
  FaCheck
} from "react-icons/fa";
import { toast } from "react-hot-toast";

const BookingDetailsModal = ({ isOpen, onClose, booking }) => {
  const [bidAmount, setBidAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBidSuccess, setIsBidSuccess] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (booking) {
      setBidAmount(Math.floor((booking.priceRange.min + booking.priceRange.max) / 2));
    }
  }, [booking]);

  // Reset states when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setIsBidSuccess(false);
      setNote("");
    }
  }, [isOpen]);

  const handleBidSubmit = () => {
    // Validate bid amount
    if (bidAmount < booking.priceRange.min || bidAmount > booking.priceRange.max) {
      toast.error(`Bid must be between ₹${booking.priceRange.min} and ₹${booking.priceRange.max}`);
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsBidSuccess(true);
      toast.success("Your bid has been submitted successfully!");
    }, 1500);
  };

  if (!isOpen || !booking) return null;

  // Format date
  const formattedDate = new Date(booking.date).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="px-3 py-1 bg-red-50 text-red-600 text-sm font-medium rounded-full">
              {booking.id}
            </span>
            Booking Details
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-all cursor-pointer"
          >
            <FaTimes className="text-gray-600" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Main details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Locations */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="space-y-4 mb-4">
                  {/* Pickup */}
                  <div className="flex items-start gap-3">
                    <div className="min-w-[28px] h-10 flex justify-center">
                      <div className="flex flex-col items-center h-full">
                        <div className="w-4 h-4 rounded-full bg-green-500 z-10"></div>
                        <div className="w-0.5 flex-grow bg-gray-300 -mt-1"></div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Pickup Location</h4>
                      <p className="text-gray-700 mb-1">{booking.pickup_address.full}</p>
                      {booking.pickup_address.landmark && (
                        <p className="text-sm text-gray-500">Landmark: {booking.pickup_address.landmark}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Destination */}
                  <div className="flex items-start gap-3">
                    <div className="min-w-[28px] h-7 flex justify-center">
                      <div className="flex flex-col items-center">
                        <div className="w-4 h-4 rounded-full bg-red-500 z-10"></div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Destination</h4>
                      <p className="text-gray-700 mb-1">{booking.destination_address.full}</p>
                      {booking.destination_address.landmark && (
                        <p className="text-sm text-gray-500">Landmark: {booking.destination_address.landmark}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-gray-400" />
                    <span className="text-sm text-gray-700">
                      Distance: <span className="font-medium">{booking.distance}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaClock className="text-gray-400" />
                    <span className="text-sm text-gray-700">
                      Est. Duration: <span className="font-medium">{booking.expectedDuration}</span>
                    </span>
                  </div>
                  <button className="text-sm text-red-600 flex items-center gap-1 hover:text-red-700 cursor-pointer">
                    <FaDirections /> Get Directions
                  </button>
                </div>
              </div>
              
              {/* Schedule and load details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Schedule */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                    <FaCalendarAlt className="text-red-500" /> Schedule
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{formattedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium">{booking.time}</span>
                    </div>
                  </div>
                </div>
                
                {/* Load Details */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                    <FaBoxOpen className="text-red-500" /> Load Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{booking.loadType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Weight:</span>
                      <span className="font-medium">{booking.weight}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Size:</span>
                      <span className="font-medium">{booking.dimensions}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Customer and Requirements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Customer */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                    <FaUser className="text-red-500" /> Customer
                  </h3>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                      {booking.customerName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-medium">{booking.customerName}</h4>
                      <div className="flex items-center">
                        <FaStar className="text-yellow-400 mr-1" />
                        <span className="text-sm text-gray-600">{booking.customerRating} Rating</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Additional Requirements */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                    <FaFileAlt className="text-red-500" /> Requirements
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Loading Help:</span>
                      <span className="font-medium">{booking.requiresLoading ? "Required" : "Not Required"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vehicle:</span>
                      <span className="font-medium">{booking.vehiclePreference}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment:</span>
                      <span className="font-medium">{booking.paymentMethod}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Special Instructions */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center gap-2">
                  <FaInfoCircle className="text-red-500" /> Special Instructions
                </h3>
                <p className="text-gray-700">
                  {booking.specialInstructions || "No special instructions provided."}
                </p>
              </div>
              
              {/* Description */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center gap-2">
                  <FaFileAlt className="text-red-500" /> Booking Description
                </h3>
                <p className="text-gray-700">
                  {booking.description}
                </p>
              </div>
            </div>
            
            {/* Right column - Bid section */}
            <div className="lg:col-span-1">
              {!isBidSuccess ? (
                <div className="bg-gray-50 rounded-xl p-4 sticky top-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                    <FaMoneyBillWave className="text-red-500" /> Place Your Bid
                  </h3>
                  
                  {/* Price Range */}
                  <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-600 mb-2">Customer's Price Range:</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-green-600 font-medium">₹{booking.priceRange.min}</span>
                      <span className="text-gray-400">-</span>
                      <span className="text-red-600 font-medium">₹{booking.priceRange.max}</span>
                    </div>
                  </div>
                  
                  {/* Bid Amount Input */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Bid Amount (₹)
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">₹</span>
                      </div>
                      <input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(Number(e.target.value))}
                        className="focus:ring-red-500 focus:border-red-500 block w-full pl-7 pr-12 py-3 sm:text-sm border-gray-300 rounded-md"
                        placeholder="0"
                        min={booking.priceRange.min}
                        max={booking.priceRange.max}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">INR</span>
                      </div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      <span>Min: ₹{booking.priceRange.min}</span>
                      <span>Max: ₹{booking.priceRange.max}</span>
                    </div>
                  </div>
                  
                  {/* Add Note */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Note (Optional)
                    </label>
                    <textarea
                      rows="3"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Any special conditions or notes about your bid..."
                    ></textarea>
                  </div>
                  
                  {/* Submit Button */}
                  <button
                    onClick={handleBidSubmit}
                    disabled={isSubmitting}
                    className={`w-full py-3 px-4 rounded-xl text-white font-medium flex items-center justify-center gap-2 ${
                      isSubmitting 
                        ? "bg-gray-400 cursor-not-allowed" 
                        : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 cursor-pointer"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FaMoneyBillWave /> Submit Bid
                      </>
                    )}
                  </button>
                  
                  {/* Bid guidelines */}
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                    <h4 className="font-medium flex items-center gap-1 mb-1">
                      <FaInfoCircle /> Bidding Guidelines
                    </h4>
                    <ul className="list-disc ml-5 space-y-1 text-blue-700">
                      <li>Your bid must be within the customer's price range</li>
                      <li>You cannot change your bid once submitted</li>
                      <li>Customer will be notified immediately of your bid</li>
                      <li>If your bid is accepted, you'll be notified right away</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border-2 border-green-100 rounded-xl p-6 text-center sticky top-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaCheck className="text-2xl text-green-600" />
                  </div>
                  <h3 className="text-xl font-medium text-green-800 mb-2">Bid Submitted Successfully!</h3>
                  <p className="text-green-700 mb-6">
                    Your bid of <span className="font-bold">₹{bidAmount}</span> has been submitted. You'll be notified if the customer accepts your bid.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-white border border-green-300 text-green-700 rounded-lg hover:bg-green-100 transition-all cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;