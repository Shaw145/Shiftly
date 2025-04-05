import { useState, useEffect } from "react";
import { FaCheck, FaTimes, FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import authBg from "../assets/signup-bg.png";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);
  const navigate = useNavigate();

  // Username availability check
  useEffect(() => {
    if (formData.username && formData.username.length >= 3) {
      const checkUsername = async () => {
        setIsCheckingUsername(true);
        try {
          const response = await fetch(
            `${
              import.meta.env.VITE_BACKEND_URL
            }/api/driver/auth/check-username?username=${formData.username}`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          setIsUsernameAvailable(data.isAvailable);
          if (!data.isAvailable) {
            setErrors((prev) => ({
              ...prev,
              username: "Username already taken",
            }));
          }
        } catch (error) {
          console.error("Error checking username:", error);
        } finally {
          setIsCheckingUsername(false);
        }
      };

      const debounceTimer = setTimeout(() => {
        checkUsername();
      }, 500);

      return () => {
        clearTimeout(debounceTimer);
        setIsUsernameAvailable(null);
      };
    } else {
      setIsUsernameAvailable(null);
    }
  }, [formData.username]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Phone number validation - only allow numbers and max 10 digits
    if (name === "phone") {
      const value = e.target.value.replace(/\D/g, "");
      if (value.length > 10) return;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Username validation
    if (name === "username") {
      if (value.length > 0 && value.length < 3) {
        setErrors((prev) => ({
          ...prev,
          username: "Username must be at least 3 characters",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          username: "",
        }));
      }
    }

    // Password validation
    if (name === "password") {
      const hasMinLength = value.length >= 6;
      const hasNumber = /\d/.test(value);
      const hasLetter = /[a-zA-Z]/.test(value);

      if (value && (!hasMinLength || !hasNumber || !hasLetter)) {
        setErrors((prev) => ({
          ...prev,
          password:
            "Password must be at least 6 characters with 1 number and 1 letter",
        }));
      } else if (value) {
        setErrors((prev) => ({
          ...prev,
          password: "success",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          password: "",
        }));
      }
    }

    // Confirm password validation
    if (name === "confirmPassword") {
      if (value !== formData.password) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords do not match",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "",
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.username) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      const hasNumber = /\d/.test(formData.password);
      const hasLetter = /[a-zA-Z]/.test(formData.password);
      if (formData.password.length < 6 || !hasNumber || !hasLetter) {
        newErrors.password =
          "Password must be at least 6 characters with 1 number and 1 letter";
      }
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm() || !termsAccepted) {
      if (!termsAccepted) {
        alert("Please accept the terms and conditions");
      }
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/driver/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        // Clear any existing OTP verification data
        localStorage.removeItem("otpStartTime");
        localStorage.removeItem("failedAttempts");

        const data = await response.json();
        navigate(
          `/verify-otp?email=${encodeURIComponent(
            formData.email
          )}&phone=${encodeURIComponent(formData.phone)}`
        );
      } else {
        const data = await response.json();
        throw new Error(data.error || "Something went wrong");
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        submit: error.message || "Failed to sign up. Please try again.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative py-8">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={authBg}
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 to-black/10"></div>
      </div>

      {/* Card */}
      <div className="w-full max-w-md p-8 bg-white/90 rounded-2xl shadow-2xl space-y-6 z-10 mx-4">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-600">Join our driver community today</p>
        </div>

        {errors.submit && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-500 text-sm">{errors.submit}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400"
              placeholder="Enter your full name"
              required
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <FaTimes className="mr-1" /> {errors.fullName}
              </p>
            )}
          </div>

          {/* Username Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400"
              placeholder="Choose a username"
              required
            />
            {isCheckingUsername && (
              <p className="text-gray-500 text-sm mt-1 flex items-center">
                <FaSpinner className="animate-spin mr-1" /> Checking username...
              </p>
            )}
            {!isCheckingUsername && isUsernameAvailable === true && (
              <p className="text-green-500 text-sm mt-1 flex items-center">
                <FaCheck className="mr-1" /> Username is available
              </p>
            )}
            {errors.username && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <FaTimes className="mr-1" /> {errors.username}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400"
              placeholder="Enter your email"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <FaTimes className="mr-1" /> {errors.email}
              </p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400"
              placeholder="Enter your phone number"
              required
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <FaTimes className="mr-1" /> {errors.phone}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400 pr-10"
                placeholder="Create a password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
            {errors.password && errors.password !== "success" && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <FaTimes className="mr-1" /> {errors.password}
              </p>
            )}
            {errors.password === "success" && formData.password && (
              <p className="text-green-500 text-sm mt-1 flex items-center">
                <FaCheck className="mr-1" /> Password is valid
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400 pr-10"
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showConfirmPassword ? (
                  <FaEyeSlash size={20} />
                ) : (
                  <FaEye size={20} />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <FaTimes className="mr-1" /> {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="h-4 w-4 text-red-500 focus:ring-red-500 border-gray-300 rounded cursor-pointer"
              required
            />
            <span className="ml-2 text-sm text-gray-600">
              I accept the{" "}
              <Link
                to="/terms"
                className="text-red-500 hover:text-red-600 hover:underline"
              >
                terms and conditions
              </Link>
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-[1.02] font-medium text-lg shadow-lg flex items-center justify-center cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <FaSpinner className="animate-spin mr-2" />
                Creating Account...
              </div>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-red-500 hover:text-red-600 hover:underline font-medium"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
