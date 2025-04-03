import { useState, useEffect } from "react";
import { FaTruck, FaMapMarkerAlt } from "react-icons/fa";

const LiveTrackingMap = ({ bookingId }) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/tracking/live/${bookingId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error);
        }

        setLocation(data.location);
      } catch (error) {
        console.error("Error fetching live location:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
    // Poll for location updates every 30 seconds
    const interval = setInterval(fetchLocation, 30000);
    return () => clearInterval(interval);
  }, [bookingId]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 min-h-[400px] flex items-center justify-center">
        <div className="text-center text-gray-600">
          <FaMapMarkerAlt className="text-4xl text-red-500 mb-2 mx-auto" />
          <p>Unable to load tracking map</p>
          <p className="text-sm text-gray-500 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Live Location</h2>
      
      {/* Placeholder for actual map implementation */}
      <div className="relative bg-gray-100 rounded-lg min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <FaTruck className="text-4xl text-red-500 animate-bounce" />
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <div className="absolute top-0 left-0 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
            </div>
          </div>
          <p className="mt-4 text-gray-600">Vehicle Last Location:</p>
          <p className="font-medium text-gray-800">
            {location ? (
              <>
                Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}
                <br />
                <span className="text-sm text-gray-500">
                  Last updated: {new Date(location.lastUpdated).toLocaleTimeString()}
                </span>
              </>
            ) : (
              "Location data unavailable"
            )}
          </p>
        </div>
      </div>

      <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
        <p className="text-sm text-yellow-700">
          <strong>Note:</strong> This is a placeholder map. In production, you would integrate with a mapping service like Google Maps or Mapbox to show real-time vehicle location.
        </p>
      </div>
    </div>
  );
};

export default LiveTrackingMap;