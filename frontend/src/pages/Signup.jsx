import { useState, useEffect } from "react";
import { FaCheck, FaTimes, FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import authBg from "../assets/auth-bg.jpg";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Set dynamic page title when component mounts
  useEffect(() => {
    // Update the document title
    document.title = "Create Account | Join Shiftly | Shiftly - A Seamless Transport System";
    
    // Optional: Restore the original title when component unmounts
    return () => {
      document.title = "Shiftly | A Seamless Transport System";
    };
  }, []);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);


  // Enhanced username availability check
  useEffect(() => {
    if (username && username.length >= 3) {
      const checkUsername = async () => {
        setIsCheckingUsername(true); // Start loading
        try {
          const response = await fetch(
            `${
              import.meta.env.VITE_BACKEND_URL
            }/api/auth/check-username?username=${username}`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          setIsUsernameAvailable(data.isAvailable);
          setUsernameError("");
        } catch (error) {
          console.error("Error checking username:", error);
          setUsernameError("");
        } finally {
          setIsCheckingUsername(false); // Stop loading
        }
      };

      const debounceTimer = setTimeout(() => {
        checkUsername();
      }, 500);

      return () => {
        clearTimeout(debounceTimer);
        setIsUsernameAvailable(null);
        setUsernameError("");
        setIsCheckingUsername(false);
      };
    } else {
      setIsUsernameAvailable(null);
      setUsernameError(
        username.length > 0 && username.length < 3
          ? "Username must be at least 3 characters"
          : ""
      );
    }
  }, [username]);

  const validatePassword = (value) => {
    const hasNumber = /\d/.test(value);
    const hasLetter = /[a-zA-Z]/.test(value);
    if (value.length < 6 || !hasNumber || !hasLetter) {
      setPasswordError(
        "Password must be at least 6 characters with 1 number and 1 letter"
      );
    } else {
      setPasswordError("");
    }
  };

  const validateConfirmPassword = (value) => {
    if (value !== password) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      alert("Please accept the terms and conditions.");
      return;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }
    if (isUsernameAvailable === false) {
      setUsernameError("Username already in use");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName,
            username,
            email,
            password,
            confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      // Redirect to Verify Email page with email and username as query parameters
      navigate(
        `/verify-email?email=${encodeURIComponent(
          email
        )}&username=${encodeURIComponent(username)}`
      );
    } catch (error) {
      setError(error.message || "Failed to sign up. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${authBg})` }}
    >
      <div className="w-full max-w-md bg-[#151616af] p-8 rounded-lg shadow-lg mx-4 mt-29 mb-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">
          Create Account
        </h1>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* <div className="flex items-center justify-center mb-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-white lg:text-lg">Or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div> */}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-base font-medium text-white">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg text-white"
              required
            />
          </div>
          <div>
            <label className="block text-base font-medium text-white">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg text-white"
              required
            />
            {usernameError && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <FaTimes className="mr-1" /> {usernameError}
              </p>
            )}
            {isCheckingUsername && (
              <p className="text-gray-400 text-sm mt-1 flex items-center">
                <FaSpinner className="animate-spin mr-1" /> Checking username...
              </p>
            )}
            {!isCheckingUsername && isUsernameAvailable === true && (
              <p className="text-green-500 text-sm mt-1 flex items-center">
                <FaCheck className="mr-1" /> Username is available
              </p>
            )}
            {!isCheckingUsername && isUsernameAvailable === false && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <FaTimes className="mr-1" /> Username already in use
              </p>
            )}
          </div>
          <div>
            <label className="block text-base font-medium text-white">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg text-white"
              required
            />
          </div>
          <div>
            <label className="block text-base font-medium text-white">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePassword(e.target.value);
                }}
                className="w-full p-2 border border-gray-300 rounded-lg text-white pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {passwordError && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <FaTimes className="mr-1" /> {passwordError}
              </p>
            )}
            {!passwordError && password.length > 0 && (
              <p className="text-green-500 text-sm mt-1 flex items-center">
                <FaCheck className="mr-1" /> Password is valid
              </p>
            )}
          </div>
          <div>
            <label className="block text-base font-medium text-white">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  validateConfirmPassword(e.target.value);
                }}
                className="w-full p-2 border border-gray-300 rounded-lg text-white pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {confirmPasswordError && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <FaTimes className="mr-1" /> {confirmPasswordError}
              </p>
            )}
            {!confirmPasswordError && confirmPassword.length > 0 && (
              <p className="text-green-500 text-sm mt-1 flex items-center">
                <FaCheck className="mr-1" /> Passwords match
              </p>
            )}
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mr-2 cursor-pointer"
              required
            />
            <span className="text-base text-white">
              I accept the{" "}
              <Link to="/terms-and-conditions" target="_blank" className="text-red-500 hover:underline">
                terms and conditions
              </Link>
            </span>
          </div>
          <button
            type="submit"
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-700 flex items-center justify-center cursor-pointer"
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
                Signing Up...
              </div>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="text-center mt-4 text-base text-white">
          Already have an account?{" "}
          <Link to="/login" className="text-red-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
