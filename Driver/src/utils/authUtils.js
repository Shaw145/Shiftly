/**
 * Checks if a JWT token is expired
 * @param {string} token - The JWT token to check
 * @returns {boolean} True if token is expired or invalid, false otherwise
 */
export const isTokenExpired = (token) => {
    if (!token) return true;
    
    try {
      // Split the token and get the payload
      const payload = token.split('.')[1];
      // Decode the base64 string
      const decoded = JSON.parse(atob(payload));
      // Check if token is expired
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      console.error('Error parsing token:', error);
      return true; // If there's an error parsing, consider it expired
    }
  };
  
  /**
   * Clears all driver auth data from localStorage
   */
  export const clearDriverAuth = () => {
    localStorage.removeItem('driverToken');
    localStorage.removeItem('driverName');
    localStorage.removeItem('driverUsername');
    localStorage.removeItem('driverId');
    localStorage.removeItem('rememberMe');
  };