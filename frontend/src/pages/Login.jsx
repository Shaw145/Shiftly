import { useState, useEffect } from "react";
import { FaTimes, FaSpinner, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import authBg from "../assets/auth-bg.jpg";

const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usernameOrEmailError, setUsernameOrEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            usernameOrEmail,
            password,
            rememberMe,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Invalid email or password");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("fullName", data.fullName);
      localStorage.setItem("username", data.username);
      localStorage.setItem("rememberMe", rememberMe);

      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${authBg})` }}
    >
      <div className="w-full max-w-md bg-[#151616af] p-8 rounded-lg shadow-lg mx-4 mt-29 mb-10">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">
          Login
        </h1>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4 text-white">
          <div>
            <label className="block text-base font-medium text-white">
              Email / Username
            </label>
            <input
              type="text"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              className="w-full p-2 border border-white rounded-lg lg:text-base"
              required
            />
            {usernameOrEmailError && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <FaTimes className="mr-1" /> {usernameOrEmailError}
              </p>
            )}
          </div>
          <div>
            <label className="block text-base font-medium text-white">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg pr-10"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 focus:outline-none cursor-pointer"
              >
                {showPassword ? (
                  <FaEyeSlash className="text-lg" />
                ) : (
                  <FaEye className="text-lg" />
                )}
              </button>
            </div>
            {passwordError && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <FaTimes className="mr-1" /> {passwordError}
              </p>
            )}
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mr-2 cursor-pointer"
            />
            <span className="text-sm text-white">Remember me</span>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-700 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin text-lg" />
                Logging in...
              </>
            ) : (
              "Log in"
            )}
          </button>
        </form>

        <p className="text-center mt-4 text-base">
          <a href="/forgot-password" className="text-red-500 hover:underline">
            Forgot password?
          </a>
        </p>

        <p className="text-center mt-4 text-base text-white">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-red-500 hover:underline">
            Sign up Now!
          </Link>
        </p>

        {/* Driver Login Link */}
        <div className="mt-6 pt-6 border-t border-gray-600">
          <p className="text-center text-base text-white">
            Are you a driver looking to join our network?{" "}
            <a
              href={`${import.meta.env.VITE_FRONTEND_DRIVER_URL}`}
              target="_blank"
              className="text-red-500 hover:underline font-medium"
            >
              Join as a Driver
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
