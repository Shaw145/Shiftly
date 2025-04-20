import { createContext, useContext, useState, useCallback } from "react";

/**
 * Driver Authentication Context
 * Provides driver authentication state and methods
 */
const DriverAuthContext = createContext();

export const DriverAuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("driverToken"));
  const [driverId, setDriverId] = useState(() => {
    try {
      const token = localStorage.getItem("driverToken");
      if (token) {
        // Simple decode of the JWT token to get the driverId
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(window.atob(base64));
        return payload.driverId;
      }
      return null;
    } catch (error) {
      console.log("Error parsing driver token:", error);
      return null;
    }
  });

  // Get the current auth token
  const getToken = useCallback(() => {
    return localStorage.getItem("driverToken");
  }, []);

  // Login function - set token and auth state
  const login = useCallback((token, id) => {
    localStorage.setItem("driverToken", token);
    setIsAuth(true);
    setDriverId(id);
  }, []);

  // Logout function - clear token and auth state
  const logout = useCallback(() => {
    localStorage.removeItem("driverToken");
    setIsAuth(false);
    setDriverId(null);
  }, []);

  return (
    <DriverAuthContext.Provider
      value={{
        isAuth,
        driverId,
        getToken,
        login,
        logout,
      }}
    >
      {children}
    </DriverAuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useDriverAuth = () => {
  const context = useContext(DriverAuthContext);
  if (!context) {
    throw new Error("useDriverAuth must be used within a DriverAuthProvider");
  }
  return context;
};

export default DriverAuthProvider;
