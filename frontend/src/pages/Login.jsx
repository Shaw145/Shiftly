import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import authBg from "../assets/auth-bg.jpg";

const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usernameOrEmailError, setUsernameOrEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usernameOrEmail,
          password,
          rememberMe,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Invalid email or password");
      }

      // Store token and full name in localStorage for both cases
      localStorage.setItem("token", data.token);
      localStorage.setItem("fullName", data.fullName);
      localStorage.setItem("username", data.username);
      localStorage.setItem("rememberMe", rememberMe); // Store rememberMe preference

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard"); // Redirect to dashboard if logged in
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url(${authBg})` }}>
      <div className="w-full max-w-md bg-[#151616af] p-8 rounded-lg shadow-lg mx-4 mt-29 mb-10">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">Login</h1>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* <div className="flex items-center justify-center mb-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-white text-base">Or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div> */}

        <form onSubmit={handleSubmit} className="space-y-4 text-white">
          <div>
            <label className="block text-base font-medium text-white">Email / Username</label>
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
            <label className="block text-base font-medium text-white">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
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
          <button type="submit" className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-700 cursor-pointer">
            Log in
          </button>
        </form>

        <p className="text-center mt-4 text-base">
          <a href="/forgot-password" className="text-red-500 hover:underline">
            Forgot password?
          </a>
        </p>

        <p className="text-center mt-4 text-base text-white">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-red-500 hover:underline">
            Sign up Now!
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;