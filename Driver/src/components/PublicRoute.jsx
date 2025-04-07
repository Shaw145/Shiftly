import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("driverToken");

  // If driver is logged in, redirect to dashboard
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  // If driver is not logged in, show the requested page
  return children;
};

export default PublicRoute;
