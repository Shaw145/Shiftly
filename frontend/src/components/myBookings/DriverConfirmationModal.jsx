import { FaUserCircle, FaStar, FaTruck } from "react-icons/fa";
import { useEffect, useState } from "react";

const DriverConfirmationModal = ({
  isOpen,
  onClose,
  driver,
  booking,
  onConfirm,
}) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen || !booking || !driver) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      // Ensure we have a consistent driver ID
      const driverId = driver._id || driver.id;

      console.log("Confirming driver with data:", {
        bookingId: booking.bookingId,
        driverId,
        driver,
        booking,
      });

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/payments/generate-token/${
          booking.bookingId
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            driverId: driverId || "1", // Ensure driverId is sent
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate payment token");
      }

      onConfirm({
        paymentToken: data.paymentToken,
        booking: {
          ...booking,
          bookingId: booking.bookingId,
          _id: booking._id,
        },
        driver: {
          ...driver,
          _id: driverId,
        },
      });
    } catch (error) {
      console.error("Error in handleConfirm:", error);
      const errorToast = document.createElement("div");
      errorToast.className =
        "fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2";
      errorToast.textContent = error.message;
      document.body.appendChild(errorToast);
      setTimeout(() => errorToast.remove(), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[rgba(20,20,20,0.66)] z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Confirm Driver Selection
          </h2>

          {/* Driver Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
                  <FaUserCircle className="w-12 h-12 text-gray-400" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900">
                  {driver.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400 mr-1" />
                    {driver.rating}
                  </div>
                  <span>•</span>
                  <span>{driver.trips} trips</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  <FaTruck className="inline mr-1" />
                  {driver.vehicle}
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{driver.price}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Price Range Info */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-700">
              Estimated Price Range: ₹{booking?.estimatedPrice?.min || 0} - ₹
              {booking?.estimatedPrice?.max || 0}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Selected driver's bid: ₹{driver?.price || 0}
            </p>
          </div>

          {/* Warning/Info Message */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg mb-6">
            <p className="text-sm text-yellow-700">
              By proceeding, you agree to book this driver for your transport.
              You'll be redirected to the payment page to complete your booking
              within 10 minutes.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Processing...
                </>
              ) : (
                "Proceed to Payment"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverConfirmationModal;
