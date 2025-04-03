import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login"); // Redirect to login if no token
      return;
    }

    // Check token expiration
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Convert to seconds

    if (decodedToken.exp < currentTime) {
      // Token expired, log the user out
      localStorage.removeItem("token");
      localStorage.removeItem("fullName");
      localStorage.removeItem("rememberMe");
      navigate("/login");
    }
  }, [navigate]);

  return children;
};

export default ProtectedRoute;