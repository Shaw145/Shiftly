import { Navigate } from "react-router-dom";

const PublicRoute = ({ children, protected: isProtected = false }) => {
  const token = localStorage.getItem("driverToken");

  // For protected routes, redirect to login if not authenticated
  if (isProtected && !token) {
    return <Navigate to="/login" replace />;
  }

  // For public routes, redirect to dashboard if already authenticated
  if (!isProtected && token) {
    return <Navigate to="/dashboard" replace />;
  }

  // Show the requested page
  return children;
};

export default PublicRoute;
