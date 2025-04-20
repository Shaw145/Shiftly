/**
 * Global configuration for the Driver app
 */

const config = {
  // API endpoints
  API_URL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api",

  // WebSocket configuration
  WEBSOCKET_URL: import.meta.env.VITE_WS_URL || "ws://localhost:5000",

  // Default radius for available bookings (in km)
  DEFAULT_RADIUS: 100,

  // Default filters
  DEFAULT_FILTERS: {
    priceRange: [0, 10000], // Default price range (0 to 10,000 INR)
    radius: 100, // Default radius (100 km)
    vehicleTypes: [], // All vehicle types
    goodsTypes: [], // All goods types
  },

  // App configuration
  APP_NAME: "Shiftly Driver",
  VERSION: "1.0.0",
};

export default config;
