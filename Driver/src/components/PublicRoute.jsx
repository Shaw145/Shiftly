import { Navigate } from "react-router-dom";
import { isTokenExpired, clearDriverAuth } from "../utils/authUtils";

const PublicRoute = ({ children, protected: isProtected = false }) => {
  const token = localStorage.getItem("driverToken");
  
  // Check if token is expired
  if (token && isTokenExpired(token)) {
    // Token is expired, clean up localStorage
    clearDriverAuth();
    // If this was a protected route, we'll redirect to login
    if (isProtected) {
      return <Navigate to="/login" replace />;
    }
  }

  // For protected routes, redirect to login if not authenticated
  if (isProtected && !token) {
    return <Navigate to="/login" replace />;
  }

  // For public routes, redirect to dashboard if already authenticated
  if (!isProtected && token && !isTokenExpired(token)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Show the requested page
  return children;
};

export default PublicRoute;





// import { Navigate } from "react-router-dom";

// const PublicRoute = ({ children, protected: isProtected = false }) => {
//   const token = localStorage.getItem("driverToken");

//   // For protected routes, redirect to login if not authenticated
//   if (isProtected && !token) {
//     return <Navigate to="/login" replace />;
//   }

//   // For public routes, redirect to dashboard if already authenticated
//   if (!isProtected && token) {
//     return <Navigate to="/dashboard" replace />;
//   }

//   // Show the requested page
//   return children;
// };

// export default PublicRoute;
