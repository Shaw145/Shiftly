import { FaExclamationTriangle } from "react-icons/fa";
import { useEffect } from "react";

const CancelConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  reason,
  setReason,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const cancelReasons = [
    "Changed my mind",
    "Found better price elsewhere",
    "Incorrect booking details",
    "Schedule conflict",
    "Vehicle type not suitable",
    "Other",
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(20,20,20,0.66)] flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <div className="text-center mb-6">
          <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Cancel Booking
          </h2>
          <p className="text-gray-600">
            Are you sure you want to cancel this booking? This action cannot be
            undone.
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Reason for cancellation (optional)
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent cursor-pointer"
          >
            <option value="">Select a reason</option>
            {cancelReasons.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          {reason === "Other" && (
            <textarea
              placeholder="Please specify your reason..."
              onChange={(e) => setReason(e.target.value)}
              className="mt-3 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              rows="3"
            />
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="w-full sm:flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 cursor-pointer whitespace-nowrap text-sm sm:text-base font-medium"
          >
            Keep Booking
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="w-full sm:flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap text-sm sm:text-base font-medium"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Cancelling...</span>
              </>
            ) : (
              "Cancel Booking"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelConfirmationModal;
