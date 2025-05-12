import React, { useState, useEffect, useCallback } from "react";
import {
  FaMapMarkerAlt,
  FaToggleOn,
  FaToggleOff,
  FaExclamationTriangle,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

/**
 * LiveLocationSharing component for drivers to share their real-time location
 * @param {Object} props - Component props
 * @param {string} props.bookingId - The ID of the booking for which location is shared
 */
const LiveLocationSharing = ({ bookingId }) => {
  const [isSharing, setIsSharing] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [lastLocation, setLastLocation] = useState(null);
  const [watchId, setWatchId] = useState(null);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);

  // Function to update driver location on the server
  const updateDriverLocation = useCallback(
    async (position) => {
      try {
        const { latitude, longitude } = position.coords;

        // Store the last known location
        setLastLocation({ lat: latitude, lng: longitude });
        setLastUpdateTime(new Date());

        const token = localStorage.getItem("driverToken");
        if (!token) {
          setLocationError("Authentication required");
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/tracking/driver/location`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              bookingId,
              location: {
                lat: latitude,
                lng: longitude,
              },
            }),
          }
        );

        if (!response.ok) {
          const data = await response.json();
          console.error("Error updating location:", data);
        }
      } catch (error) {
        console.error("Error sending location update:", error);
        setLocationError("Failed to send location update");
      }
    },
    [bookingId]
  );

  // Start location sharing
  const startLocationSharing = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      toast.error("Location sharing is not supported by your browser");
      return;
    }

    try {
      // Clear any existing errors
      setLocationError(null);

      // Get initial position
      navigator.geolocation.getCurrentPosition(
        (position) => {
          updateDriverLocation(position);

          // Start watching position
          const id = navigator.geolocation.watchPosition(
            updateDriverLocation,
            (error) => {
              console.error("Geolocation error:", error);
              setLocationError(`Location error: ${error.message}`);
              toast.error("Unable to access your location");
              setIsSharing(false);
            },
            {
              enableHighAccuracy: true,
              timeout: 15000,
              maximumAge: 10000,
            }
          );

          setWatchId(id);
          setIsSharing(true);
          toast.success("Location sharing started");
        },
        (error) => {
          console.error("Initial geolocation error:", error);
          setLocationError(`Location error: ${error.message}`);
          toast.error("Unable to access your location");
          setIsSharing(false);
        }
      );
    } catch (error) {
      console.error("Error starting location sharing:", error);
      setLocationError("Failed to start location sharing");
      toast.error("Failed to start location sharing");
    }
  }, [updateDriverLocation]);

  // Stop location sharing
  const stopLocationSharing = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setIsSharing(false);
      toast.success("Location sharing stopped");
    }
  }, [watchId]);

  // Toggle location sharing
  const toggleLocationSharing = () => {
    if (isSharing) {
      stopLocationSharing();
    } else {
      startLocationSharing();
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <FaMapMarkerAlt className="text-blue-600" /> Live Location Sharing
      </h2>

      <div className="bg-gray-50 rounded-lg p-5 flex flex-col items-center border border-gray-100">
        {locationError && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 w-full border border-red-100">
            <FaExclamationTriangle />
            <span className="text-sm">{locationError}</span>
          </div>
        )}

        <div className="flex items-center justify-center mb-4">
          <button
            onClick={toggleLocationSharing}
            className={`flex items-center gap-3 px-6 py-3 rounded-lg transition-colors ${
              isSharing
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {isSharing ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
            {isSharing ? "Stop Sharing Location" : "Start Sharing Location"}
          </button>
        </div>

        {isSharing && lastLocation && (
          <div className="w-full text-center p-4 bg-green-50 rounded-lg border border-green-100">
            <p className="text-sm text-gray-600 mb-2">
              Currently sharing your location
            </p>
            <p className="font-medium text-gray-800">
              Lat: {lastLocation.lat.toFixed(6)}, Lng:{" "}
              {lastLocation.lng.toFixed(6)}
            </p>
            {lastUpdateTime && (
              <p className="text-xs text-gray-500 mt-1">
                Last updated: {lastUpdateTime.toLocaleTimeString()}
              </p>
            )}
          </div>
        )}

        <div className="mt-4 text-xs text-gray-500 text-center w-full">
          <p>
            {isSharing
              ? "Your location is being shared with the customer in real-time"
              : "Enable location sharing to help the customer track their delivery"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiveLocationSharing;
