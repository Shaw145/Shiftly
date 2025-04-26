import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSpinner, FaArrowLeft } from "react-icons/fa";
import authBg from "../assets/signup-bg.png";

const VerifyOTP = () => {
  const [emailOTP, setEmailOTP] = useState(["", "", "", "", "", ""]);
  const [phoneOTP, setPhoneOTP] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [sessionExpired, setSessionExpired] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("email");
  const phone = searchParams.get("phone");

  // Set dynamic page title when component mounts
  useEffect(() => {
    // Update the document title
    document.title = "Verify OTP | Security Check | Shiftly - A Seamless Transport System";
    
    // Optional: Restore the original title when component unmounts
    return () => {
      document.title = "Shiftly | A Seamless Transport System";
    };
  }, []);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Check if this is a valid verification session
    const checkSession = async () => {
      if (!email || !phone) {
        // Clear verification data and redirect
        localStorage.removeItem("otpStartTime");
        localStorage.removeItem("failedAttempts");
        navigate("/signup", { replace: true });
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/driver/auth/check-session`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, phone }),
          }
        );

        if (!response.ok) {
          setSessionExpired(true);
          // Clear verification data before redirecting
          localStorage.removeItem("otpStartTime");
          localStorage.removeItem("failedAttempts");
          setTimeout(() => {
            navigate("/signup", { replace: true });
          }, 3000);
        }
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        // Clear verification data before redirecting
        localStorage.removeItem("otpStartTime");
        localStorage.removeItem("failedAttempts");
        navigate("/signup", { replace: true });
      }
    };

    checkSession();

    // Store initial timestamp in localStorage only if it doesn't exist
    const storedStartTime = localStorage.getItem("otpStartTime");
    if (!storedStartTime) {
      localStorage.setItem("otpStartTime", Date.now().toString());
      setTimeLeft(600);
    } else {
      const elapsedTime = Math.floor(
        (Date.now() - parseInt(storedStartTime)) / 1000
      );
      const remainingTime = Math.max(600 - elapsedTime, 0);
      setTimeLeft(remainingTime);

      // If time has expired, clear data and redirect
      if (remainingTime === 0) {
        setSessionExpired(true);
        localStorage.removeItem("otpStartTime");
        localStorage.removeItem("failedAttempts");
        navigate("/signup", { replace: true });
      }
    }

    // Cleanup function
    return () => {
      if (window.location.pathname === "/dashboard") {
        localStorage.removeItem("otpStartTime");
        localStorage.removeItem("failedAttempts");
      }
    };
  }, [email, phone, navigate]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleOTPChange = (index, value, type) => {
    if (!/^\d*$/.test(value)) return;

    if (type === "email") {
      const newOTP = [...emailOTP];
      newOTP[index] = value;
      setEmailOTP(newOTP);

      // Auto-focus next input
      if (value && index < 5) {
        document.getElementById(`email-otp-${index + 1}`).focus();
      }
    } else {
      const newOTP = [...phoneOTP];
      newOTP[index] = value;
      setPhoneOTP(newOTP);

      // Auto-focus next input
      if (value && index < 5) {
        document.getElementById(`phone-otp-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (e, index, type) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      const prevInput = document.getElementById(`${type}-otp-${index - 1}`);
      prevInput.focus();
    }
  };

  const handleVerify = async () => {
    const emailOTPValue = emailOTP.join("");
    const phoneOTPValue = phoneOTP.join("");

    if (emailOTPValue.length !== 6 || phoneOTPValue.length !== 6) {
      setError("Please enter complete OTP codes");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/driver/auth/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            phone,
            emailOTP: emailOTPValue,
            phoneOTP: phoneOTPValue,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Verification failed");
      }

      // Store token and navigate to dashboard
      localStorage.setItem("driverToken", data.token);
      localStorage.setItem("driverName", data.driver.fullName);
      localStorage.setItem("driverUsername", data.driver.username);

      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
      // If verification fails 3 times or time expires, redirect to signup
      const failedAttempts =
        parseInt(localStorage.getItem("failedAttempts") || "0") + 1;
      localStorage.setItem("failedAttempts", failedAttempts.toString());

      if (failedAttempts >= 3 || timeLeft === 0) {
        setSessionExpired(true);
        setTimeout(() => {
          navigate("/signup", { replace: true });
        }, 3000);
      }
    } finally {
      setIsLoading(false);
    }
  };

//   const handleResendOTP = async () => {
//     setIsLoading(true);
//     setError("");

//     try {
//       const response = await fetch(
//         `${import.meta.env.VITE_BACKEND_URL}/api/driver/auth/resend-otp`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ email, phone }),
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || "Failed to resend OTP");
//       }

//       setTimeLeft(600); // Reset timer
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

  const handleGoBack = async () => {
    try {
      // Cancel the registration process
      await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/driver/auth/cancel-registration`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, phone }),
        }
      );
    } catch (error) {
      console.error("Error canceling registration:", error);
    }
    // Clear verification data before navigating back
    localStorage.removeItem("otpStartTime");
    localStorage.removeItem("failedAttempts");
    navigate("/signup", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative py-4 px-2 sm:py-6 sm:px-4">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={authBg}
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 to-black/10"></div>
      </div>

      <div className="w-full max-w-md space-y-4 sm:space-y-6 bg-white/90 p-4 sm:p-6 md:p-8 rounded-xl shadow-lg relative mx-2 sm:mx-4">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            Verify Your Account
          </h2>
          <div className="mt-2 space-y-1 px-2">
            <p className="text-xs sm:text-sm text-gray-600">
              We've sent verification codes to:
            </p>
            <p className="text-xs sm:text-sm font-medium text-gray-800 break-all">
              {email}
            </p>
            <p className="text-xs sm:text-sm font-medium text-gray-800">
              {phone.replace(/(\d{2})(\d{5})(\d{3})/, "+91 $1-$2-$3")}
            </p>
            <p className="text-xs text-red-500 mt-2">
              Please check your spam/junk folder if you don't see the email in
              your inbox.
            </p>
          </div>
        </div>

        {sessionExpired && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 rounded text-xs sm:text-sm">
            <p className="text-red-500">
              Verification session expired. Please register again.
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 rounded text-xs sm:text-sm">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        <div className="space-y-4 sm:space-y-6">
          {/* Email OTP */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Email OTP
            </label>
            <div className="flex gap-1 sm:gap-2 justify-between">
              {emailOTP.map((digit, index) => (
                <input
                  key={`email-${index}`}
                  id={`email-otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) =>
                    handleOTPChange(index, e.target.value, "email")
                  }
                  onKeyDown={(e) => handleKeyDown(e, index, "email")}
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-center text-lg sm:text-xl border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              ))}
            </div>
          </div>

          {/* Phone OTP */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Phone OTP
            </label>
            <div className="flex gap-1 sm:gap-2 justify-between">
              {phoneOTP.map((digit, index) => (
                <input
                  key={`phone-${index}`}
                  id={`phone-otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) =>
                    handleOTPChange(index, e.target.value, "phone")
                  }
                  onKeyDown={(e) => handleKeyDown(e, index, "phone")}
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-center text-lg sm:text-xl border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              ))}
            </div>
          </div>

          {/* Timer and Warning Message */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-1">
              <div className="bg-gray-100 px-3 py-1 rounded-lg">
                <span className="text-lg font-semibold text-gray-800">
                  {Math.floor(timeLeft / 60)}:
                  {(timeLeft % 60).toString().padStart(2, "0")}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-amber-600 text-xs sm:text-sm flex items-center justify-center">
                <span className="mr-1">⚠️</span>
                This verification session will expire in{" "}
                {Math.floor(timeLeft / 60)} minutes
              </p>
              <p className="text-gray-600 text-xs">
                Please complete the verification before it expires to avoid
                starting over
              </p>
            </div>
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={isLoading}
            className="w-full flex justify-center py-2.5 sm:py-3 px-4 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 cursor-pointer"
          >
            {isLoading ? (
              <div className="flex items-center">
                <FaSpinner className="animate-spin mr-2" />
                Verifying...
              </div>
            ) : (
              "Verify Account"
            )}
          </button>

          {/* Back Button */}
          <button
            onClick={handleGoBack}
            className="w-full flex justify-center items-center py-2 sm:py-2.5 px-4 border border-gray-300 rounded-md shadow-sm text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 cursor-pointer"
          >
            <FaArrowLeft className="mr-2" />
            Back to Signup
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
