// frontend/src/pages/VerifyEmail.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import authBg from "../assets/auth-bg.jpg";

const VerifyEmail = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = new URLSearchParams(location.search).get("email");
  const username = new URLSearchParams(location.search).get("username");

  // Redirect if no email or username in URL
  useEffect(() => {
    if (!email || !username) {
      navigate("/signup", { replace: true });
    }
  }, [email, username, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp: otpCode,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Invalid OTP");
      }

      if (!data.token || !data.username || !data.fullName) {
        throw new Error("Incomplete user data received");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("fullName", data.fullName);
      localStorage.setItem("username", data.username);

      navigate("/dashboard");
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${authBg})` }}
    >
      <div className="w-full max-w-md bg-[#151616af] p-8 rounded-lg shadow-lg mx-4 mt-29 mb-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">
          Verify Email
        </h1>

        {/* Email Display */}
        <div className="text-center mb-6">
          <p className="text-gray-300 text-sm mb-1">
            We've sent a verification code to:
          </p>
          <p className="text-white font-medium break-all">
            {email || "your email"}
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Please check your Inbox or Spam folder for the verification code
          </p>
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center space-x-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                className="w-12 h-12 text-center text-2xl border border-gray-300 rounded-lg text-white bg-transparent focus:border-red-500 focus:ring-1 focus:ring-red-500"
                required
              />
            ))}
          </div>
          <button
            type="submit"
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-700 flex items-center justify-center cursor-pointer transition-colors duration-300"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Verifying...
              </div>
            ) : (
              "Verify"
            )}
          </button>
        </form>

        <p className="text-center mt-4 text-base text-white">
          <a href="/signup" className="text-red-500 hover:underline">
            Go Back
          </a>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
