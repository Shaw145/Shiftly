import { useState, useEffect, useRef, useCallback } from "react";
import {
  useNavigate,
  useParams,
  useLocation,
  useBeforeUnload,
} from "react-router-dom";
import PaymentSuccessModal from "../components/payment/PaymentSuccessModal";
import PaymentSummary from "../components/payment/PaymentSummary";
import {
  FaExclamationTriangle,
  FaClock,
  FaCreditCard,
  FaLock,
  FaExclamationCircle,
} from "react-icons/fa";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [driver, setDriver] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(() => {
    const token = location.state?.paymentToken;
    if (!token) return 0;

    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(window.atob(base64));
      const expiryTime = payload.exp * 1000; // Convert to milliseconds
      const now = Date.now();
      return Math.max(0, Math.floor((expiryTime - now) / 1000));
    } catch (error) {
      return 0;
    }
  });
  const [isLeavingPage, setIsLeavingPage] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isBlocked, setIsBlocked] = useState(true);

  // Add a ref to track if we're handling navigation
  const isHandlingNavigation = useRef(false);

  const showToast = (message, type = "error") => {
    const toast = document.createElement("div");
    toast.className = `fixed top-4 right-4 ${
      type === "error" ? "bg-red-500" : "bg-green-500"
    } text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  // Handle page reload and navigation
  useEffect(() => {
    // Check if we have valid state
    if (
      !location.state?.paymentToken ||
      !location.state?.booking ||
      !location.state?.driver
    ) {
      navigate(`/my-bookings/${bookingId}`, {
        state: { message: "Payment session expired. Please try again." },
      });
      return;
    }

    setBooking(location.state.booking);
    setDriver(location.state.driver);

    // Push current state to prevent direct back navigation
    window.history.pushState(null, null, window.location.pathname);

    // Handle page refresh and navigation attempts
    const handleBeforeUnload = (e) => {
      if (isBlocked) {
        e.preventDefault();
        setShowWarningModal(true);
        e.returnValue = "";
        return e.returnValue;
      }
    };

    // Handle back button and navigation attempts
    const handlePopState = (e) => {
      if (isBlocked) {
        e.preventDefault();
        setShowWarningModal(true);
        // Push state again to maintain the page
        window.history.pushState(null, null, window.location.pathname);
      }
    };

    // Handle clicks on any anchor tags or navigation elements
    const handleClick = (e) => {
      const anchor = e.target.closest("a");
      const button = e.target.closest("button");

      if ((anchor || button) && isBlocked) {
        const href = anchor?.getAttribute("href");
        const isNavigationButton =
          button?.getAttribute("data-navigation") === "true";

        if (href || isNavigationButton) {
          e.preventDefault();
          setShowWarningModal(true);
        }
      }
    };

    // Handle URL changes
    const handleUrlChange = () => {
      if (isBlocked) {
        setShowWarningModal(true);
        window.history.pushState(null, null, window.location.pathname);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);
    document.addEventListener("click", handleClick, true);
    window.addEventListener("hashchange", handleUrlChange);

    // Prevent F5 and Ctrl+R
    const handleKeyDown = (e) => {
      if (e.key === "F5" || ((e.ctrlKey || e.metaKey) && e.key === "r")) {
        e.preventDefault();
        setShowWarningModal(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("hashchange", handleUrlChange);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [location.state, bookingId, navigate, isBlocked]);

  // Add useBeforeUnload hook
  useBeforeUnload(
    useCallback(
      (event) => {
        if (isBlocked) {
          event.preventDefault();
          return "";
        }
      },
      [isBlocked]
    )
  );

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      showToast("Payment session expired");
      navigate(`/my-bookings/${booking?.bookingId}`, {
        state: { message: "Payment session expired. Please try again." },
      });
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handlePaymentSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const paymentToken = location.state?.paymentToken;
      if (!paymentToken) {
        throw new Error("Payment session expired");
      }

      // Use the booking's MongoDB _id
      const bookingMongoId = booking._id;

      console.log("Submitting payment with:", {
        bookingId: bookingMongoId,
        amount: driver.price,
        booking,
        paymentToken,
      });

      const initiateResponse = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/payments/initiate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "X-Payment-Token": paymentToken,
          },
          body: JSON.stringify({
            bookingId: bookingMongoId,
            amount: driver.price,
            paymentMethod: "card",
          }),
        }
      );

      const initiateData = await initiateResponse.json();

      if (!initiateResponse.ok) {
        throw new Error(initiateData.error || "Payment initiation failed");
      }

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const verifyResponse = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/payments/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "X-Payment-Token": paymentToken,
          },
          body: JSON.stringify({
            transactionId: initiateData.payment.transactionId,
            bookingId: booking._id,
          }),
        }
      );

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        throw new Error(verifyData.error || "Payment verification failed");
      }

      setTransactionDetails({
        transactionId: initiateData.payment.transactionId,
        amount: driver.price,
        date: new Date().toISOString(),
        paymentMethod: "card",
        status: "success",
      });

      showToast("Payment processed successfully!", "success");
      setShowSuccessModal(true);
    } catch (error) {
      showToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    showToast("Payment cancelled");
    navigate(`/my-bookings/${booking.bookingId}`, {
      state: { message: "Payment was cancelled." },
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePageLeave = async () => {
    try {
      setIsBlocked(false); // Unblock navigation before leaving

      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/payments/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "X-Payment-Token": location.state?.paymentToken,
        },
        body: JSON.stringify({
          bookingId: booking._id,
          reason: "User left payment page",
        }),
      });

      // Use window.location.replace to ensure we can't go back to the payment page
      window.location.replace(
        `/my-bookings/${
          booking.bookingId
        }?status=failed&message=${encodeURIComponent(
          "Payment was cancelled because you left the page."
        )}`
      );
    } catch (error) {
      console.error("Error cancelling payment:", error);
      window.location.replace(
        `/my-bookings/${
          booking.bookingId
        }?status=failed&message=${encodeURIComponent("Payment session ended.")}`
      );
    }
  };

  // Update the WarningModal component
  const WarningModal = () => (
    <div className="fixed inset-0 bg-[rgba(20,20,20,0.85)] flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold mb-4">Leave Payment Page?</h3>
        <p className="text-gray-600 mb-6">
          Your payment will be cancelled and you'll need to start over. Are you
          sure you want to leave?
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => {
              setShowWarningModal(false);
              // Push state again to ensure we stay on the page
              window.history.pushState(null, null, window.location.pathname);
            }}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer"
          >
            Stay on Page
          </button>
          <button
            onClick={handlePageLeave}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer"
          >
            Leave & Cancel
          </button>
        </div>
      </div>
    </div>
  );

  if (!booking || !driver) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 px-4">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 mt-8">
          <div className="flex items-center gap-3 text-yellow-600">
            <FaExclamationTriangle className="text-2xl" />
            <p className="text-lg font-medium">Loading payment details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 mt-20 md:ml-22 lg:ml-24">
      {/* Timer - adjusted top spacing */}
      <div className="fixed top-28 right-4 bg-white rounded-full shadow-lg p-4 z-10">
        <div className="flex items-center gap-2 text-red-500">
          <FaClock />
          <span className="font-bold">{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Warning Message - moved below */}
        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mb-8">
          <div className="flex items-center gap-2 text-yellow-800">
            <FaExclamationCircle className="text-xl" />
            <p className="font-medium">
              DO NOT refresh this page. Your payment session will expire if you
              refresh or leave this page.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Payment Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Header */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  Complete Your Payment
                </h1>
                <div className="flex items-center text-green-600">
                  <FaLock className="mr-2" />
                  <span className="text-sm">Secure Payment</span>
                </div>
              </div>

              {/* Payment Card */}
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 text-white mb-6">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-gray-400 text-sm">Amount to Pay</p>
                    <p className="text-3xl font-bold">₹{driver.price}</p>
                  </div>
                  <FaCreditCard className="text-2xl text-gray-400" />
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-gray-400 text-sm">Booking ID</p>
                    <p className="font-medium">#{booking.bookingId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">Valid Till</p>
                    <p className="font-medium">{formatTime(timeLeft)}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={handlePaymentSubmit}
                  disabled={loading}
                  className={`cursor-pointer w-full ${
                    loading ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"
                  } text-white py-4 rounded-lg transition-all transform hover:scale-[1.02] flex items-center justify-center`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      Processing Payment...
                    </>
                  ) : (
                    "Pay Securely"
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="w-full bg-gray-100 text-gray-700 py-4 rounded-lg hover:bg-gray-200 transition-all cursor-pointer"
                >
                  Cancel Payment
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <PaymentSummary
              booking={booking}
              driver={driver}
              estimatedPrice={booking.estimatedPrice}
            />
          </div>
        </div>

        {/* Success Modal */}
        <PaymentSuccessModal
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            navigate(`/my-bookings/${booking.bookingId}`);
          }}
          details={transactionDetails}
        />

        {/* Cancel Confirmation Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-[rgba(20,20,20,0.66)] bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold mb-4">Cancel Payment?</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel this payment? You can try again
                later.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer"
                >
                  Go Back
                </button>
                <button
                  onClick={confirmCancel}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg cursor-pointer"
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Warning Modal */}
        {showWarningModal && <WarningModal />}
      </div>
    </div>
  );
};

export default Payment;
