import React, { useState, useEffect, useRef } from "react";
import {
  FaMapMarkerAlt,
  FaToggleOn,
  FaToggleOff,
  FaExclamationTriangle,
  FaInfoCircle,
  FaCheck,
  FaLocationArrow,
  FaSync,
  FaSpinner,
  FaTimes,
  FaExclamationCircle,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import PropTypes from "prop-types";

// Make sure the localStorage keys are defined consistently
const getStorageKeys = (bookingId) => ({
  sharingStateKey: `location_sharing_${bookingId}`,
  lastLocationKey: `last_location_${bookingId}`,
  manuallyStoppedKey: `manually_stopped_${bookingId}`,
});

/**
 * LiveLocationSharing component for drivers to share their real-time location
 * @param {Object} props - Component props
 * @param {string} props.bookingId - The ID of the booking for which location is shared
 * @param {string} props.bookingStatus - The current status of the booking
 * @param {Function} props.onLocationUpdate - Callback function when location is updated
 */
const LiveLocationSharing = ({
  bookingId,
  bookingStatus,
  onLocationUpdate,
}) => {
  const [isSharing, setIsSharing] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [lastLocation, setLastLocation] = useState(null);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState("unknown");
  const [isLoading, setIsLoading] = useState(false);
  const [isGeolocationAvailable, setIsGeolocationAvailable] = useState(true);

  // Get consistent localStorage keys
  const { sharingStateKey, lastLocationKey, manuallyStoppedKey } =
    getStorageKeys(bookingId);

  // Reference to store current position without triggering re-renders
  const currentPositionRef = useRef(null);
  // Reference to interval timer for controlled updates
  const updateIntervalRef = useRef(null);
  // Flag to track if sharing was manually stopped by the user
  const manuallyStopped = useRef(
    localStorage.getItem(manuallyStoppedKey) === "true"
  );
  // Reference to watchPosition ID
  const watchIdRef = useRef(null);
  // Reference to retry attempts
  const retryAttemptsRef = useRef(0);
  // Reference to retry timeout
  const retryTimeoutRef = useRef(null);

  // Check for previously saved location settings when component mounts or when bookingId changes
  useEffect(() => {
    console.log("LiveLocationSharing component mounted or bookingId changed");

    // Try to restore previous sharing state for this booking
    const sharingState = localStorage.getItem(sharingStateKey);
    const savedLocation = localStorage.getItem(lastLocationKey);
    const wasManuallyStopped =
      localStorage.getItem(manuallyStoppedKey) === "true";

    console.log("Previous state:", {
      sharingState,
      wasManuallyStopped,
      hasLocation: !!savedLocation,
    });

    if (savedLocation) {
      try {
        const parsedLocation = JSON.parse(savedLocation);
        setLastLocation(parsedLocation);
        setLastUpdateTime(new Date(parsedLocation.timestamp || Date.now()));
      } catch (err) {
        console.error("Error parsing saved location:", err);
      }
    }

    // Check if we should auto-start location sharing:
    // Only if it was active before AND wasn't manually stopped
    if (sharingState === "true" && !wasManuallyStopped) {
      console.log("Auto-resuming location sharing from previous session");
      // We need to set this first because startLocationSharing is async
      setIsSharing(true);
      startLocationSharing();
    } else if (wasManuallyStopped) {
      console.log(
        "Location sharing was manually stopped, will not auto-resume"
      );
      manuallyStopped.current = true;
    }

    // Check for permissions
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((result) => {
          setPermissionStatus(result.state);

          // Listen for permission changes
          result.onchange = () => {
            setPermissionStatus(result.state);
            if (result.state === "denied") {
              stopLocationSharing();
              setLocationError(
                "Location permission denied. Please enable location access in your browser settings."
              );
            }
          };
        })
        .catch((err) => {
          console.error("Error checking location permission:", err);
        });
    }

    // Cleanup function
    return () => {
      console.log("LiveLocationSharing component unmounting - cleaning up");

      // Clear retry timeout if any
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }

      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }

      if (updateIntervalRef.current !== null) {
        clearInterval(updateIntervalRef.current);
        updateIntervalRef.current = null;
      }
    };
  }, [bookingId, sharingStateKey, lastLocationKey, manuallyStoppedKey]);

  // Add logic to check if the booking is delivered and stop location sharing
  useEffect(() => {
    // If the booking is completed, stop location sharing
    if (bookingStatus === "delivered" || bookingStatus === "completed") {
      console.log("Booking is delivered/completed. Stopping location sharing.");
      setIsSharing(false);
      localStorage.setItem(sharingStateKey, "false");

      // Clean up the watcher if it exists
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
        console.log("Cleared geolocation watch due to delivered status");
      }
    }
  }, [bookingStatus, sharingStateKey]);

  // Function to update driver location on the server
  const updateDriverLocation = (position) => {
    try {
      const { latitude, longitude, accuracy } = position.coords;

      // Store the last known location
      const locationData = {
        lat: latitude,
        lng: longitude,
        accuracy: accuracy,
        timestamp: new Date().toISOString(),
      };

      // Update state with new location
      setLastLocation(locationData);
      setLastUpdateTime(new Date());

      // Store in localStorage for persistence across page refreshes
      localStorage.setItem(lastLocationKey, JSON.stringify(locationData));

      // Notify parent component about the location update
      if (onLocationUpdate) {
        onLocationUpdate({
          lat: latitude,
          lng: longitude,
        });
      }

      // Send the update to the server
      const token = localStorage.getItem("driverToken");
      if (!token) {
        setLocationError("Authentication required");
        return;
      }

      fetch(
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
      )
        .then((response) => {
          if (!response.ok) {
            return response.json().then((data) => {
              throw new Error(data.message || "Failed to update location");
            });
          }
          // Clear any server-related errors on successful update
          if (locationError && locationError.includes("Server error")) {
            setLocationError(null);
          }

          // Reset retry attempts on successful update
          retryAttemptsRef.current = 0;
        })
        .catch((error) => {
          console.error("Error sending location update:", error);
          setLocationError(
            "Failed to send location update. Check your network connection."
          );
        });
    } catch (error) {
      console.error("Error processing location update:", error);
    }
  };

  // Function to get the current position once with retries
  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"));
        return;
      }

      // Define an error handler that might retry
      const handlePositionError = (error) => {
        console.error("Geolocation error in getCurrentPosition:", error);

        // If it's a timeout error and we haven't exceeded retry attempts, try again
        if (error.code === error.TIMEOUT && retryAttemptsRef.current < 3) {
          retryAttemptsRef.current++;
          console.log(
            `Retrying getCurrentPosition (attempt ${retryAttemptsRef.current})`
          );

          // Clear any existing retry timeout
          if (retryTimeoutRef.current) {
            clearTimeout(retryTimeoutRef.current);
          }

          // Retry after a delay
          retryTimeoutRef.current = setTimeout(() => {
            navigator.geolocation.getCurrentPosition(
              resolve,
              handlePositionError,
              {
                enableHighAccuracy: true,
                timeout: 30000, // 30 seconds timeout
                maximumAge: 0,
              }
            );
          }, 2000); // 2 second delay before retry
        } else {
          // Either not a timeout error or we've exceeded retry attempts
          reject(error);
        }
      };

      navigator.geolocation.getCurrentPosition(resolve, handlePositionError, {
        enableHighAccuracy: true,
        timeout: 30000, // 30 seconds timeout
        maximumAge: 0,
      });
    });
  };

  // Start location sharing
  const startLocationSharing = async () => {
    console.log("Starting location sharing");

    // Clear any existing watch and intervals
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    if (updateIntervalRef.current !== null) {
      clearInterval(updateIntervalRef.current);
      updateIntervalRef.current = null;
    }

    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    if (!navigator.geolocation) {
      setLocationError(
        "Geolocation is not supported by your browser. Please use a modern browser that supports location sharing."
      );
      toast.error("Location sharing is not supported by your browser");
      setIsSharing(false);
      return;
    }

    // Reset manually stopped flag
    manuallyStopped.current = false;
    localStorage.removeItem(manuallyStoppedKey);

    // Set sharing status in localStorage first
    localStorage.setItem(sharingStateKey, "true");
    setIsSharing(true);

    // Clear any existing errors
    setLocationError(null);

    try {
      // Reset retry counter
      retryAttemptsRef.current = 0;

      // Get initial position
      const initialPosition = await getCurrentPosition();

      // Update position immediately
      updateDriverLocation(initialPosition);
      setPermissionStatus("granted");

      // Store current position in the ref
      currentPositionRef.current = initialPosition;

      // Start watching position with high accuracy in background
      // This just updates the currentPositionRef but doesn't trigger updates
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          // Just update the ref, don't trigger any UI updates or network calls
          currentPositionRef.current = position;
        },
        (error) => {
          console.error("Geolocation watchPosition error:", error);

          // Handle permission denied error specifically
          if (error.code === error.PERMISSION_DENIED) {
            stopLocationSharing();
            setPermissionStatus("denied");
            setLocationError(
              "Location access denied. Please enable location services in your browser settings and reload this page."
            );
            toast.error("Location permission denied");
          }
          // For timeout or unavailable errors, don't stop sharing, just log the error
          // The interval will try again
        },
        {
          enableHighAccuracy: true,
          timeout: 60000, // 1 minute timeout
          maximumAge: 0,
        }
      );

      watchIdRef.current = watchId;

      // Setup an interval to send location updates every 20 seconds
      const updateInterval = setInterval(() => {
        if (!isSharing) {
          console.log("Not sharing anymore, clearing interval");
          clearInterval(updateIntervalRef.current);
          updateIntervalRef.current = null;
          return;
        }

        console.log("Sending scheduled location update");

        // Use the latest position from the ref to update
        if (currentPositionRef.current) {
          updateDriverLocation(currentPositionRef.current);
        } else {
          // If we don't have a current position, try to get one
          getCurrentPosition()
            .then((position) => {
              currentPositionRef.current = position;
              updateDriverLocation(position);
            })
            .catch((error) => {
              console.error(
                "Error getting current position in interval:",
                error
              );

              // Only show errors if we're still sharing and it's not a temporary timeout
              if (isSharing && error.code !== error.TIMEOUT) {
                setLocationError(
                  `Error updating location: ${
                    error.message || "Unknown error"
                  }. Will try again.`
                );
              }
            });
        }
      }, 20000); // Update every 20 seconds

      updateIntervalRef.current = updateInterval;

      toast.success("Location sharing started");
    } catch (error) {
      console.error("Error starting location sharing:", error);

      // Handle specific error cases
      if (error.code === 1) {
        // PERMISSION_DENIED
        setPermissionStatus("denied");
        setLocationError(
          "Location permission denied. Please allow location access in your browser settings and reload this page."
        );
      } else if (error.code === 2) {
        // POSITION_UNAVAILABLE
        setLocationError(
          "Your current location is unavailable. Please check your device's GPS and internet connection."
        );
      } else if (error.code === 3) {
        // TIMEOUT
        setLocationError(
          "Location request timed out. Please check your internet connection and try again."
        );
      } else {
        setLocationError(`Error starting location sharing: ${error.message}`);
      }

      toast.error("Unable to access your location");
      setIsSharing(false);
      localStorage.removeItem(sharingStateKey);
    }
  };

  // Stop location sharing
  const stopLocationSharing = () => {
    console.log("Stopping location sharing");

    // Set manually stopped flag
    manuallyStopped.current = true;
    localStorage.setItem(manuallyStoppedKey, "true");

    // Clear the watch position
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    // Clear the update interval
    if (updateIntervalRef.current !== null) {
      clearInterval(updateIntervalRef.current);
      updateIntervalRef.current = null;
    }

    // Clear retry timeout if any
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    setIsSharing(false);
    localStorage.removeItem(sharingStateKey);
    toast.success("Location sharing stopped");
  };

  // Toggle location sharing
  const toggleLocationSharing = () => {
    if (isSharing) {
      stopLocationSharing();
    } else {
      startLocationSharing();
    }
  };

  // Get status description based on booking status
  const getStatusDescription = () => {
    switch (bookingStatus) {
      case "confirmed":
        return "When you arrive at the pickup location, update the booking status to 'In Transit'";
      case "inTransit":
      case "in_transit":
        return "You are currently en route to the delivery location. Update the status to 'Completed' once delivery is done.";
      case "completed":
      case "delivered":
        return "Delivery has been completed. Thank you for your service!";
      default:
        return "Keep the customer informed about your location during delivery";
    }
  };

  // Helper to get action instruction based on booking status
  const getActionInstruction = () => {
    switch (bookingStatus) {
      case "confirmed":
        return "Start sharing your location and proceed to the pickup location. When you arrive, update the status to 'In Transit'";
      case "inTransit":
      case "in_transit":
        return "Continue sharing your location until you reach the delivery location. Then update the status to 'Completed'";
      case "completed":
      case "delivered":
        return "Delivery complete - you can stop sharing location";
      default:
        return "Share your location to help the customer track their delivery";
    }
  };

  return (
    <div className="rounded-lg overflow-hidden">
      {/* Don't render sharing controls if the booking is delivered */}
      {bookingStatus === "delivered" || bookingStatus === "completed" ? (
        // For delivered bookings, we already show the delivery completed UI from the parent component
        <p className="hidden">Location sharing has been stopped.</p>
      ) : (
        // For active bookings, show the sharing controls
        <div>
          <div
            className={`p-4 ${
              isSharing ? "bg-green-50" : "bg-gray-50"
            } rounded-lg`}
          >
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                    isSharing ? "bg-green-100" : "bg-gray-200"
                  }`}
                >
                  {isLoading ? (
                    <FaSpinner className="text-gray-500 animate-spin text-xl" />
                  ) : isSharing ? (
                    <FaToggleOn className="text-green-600 text-3xl" />
                  ) : (
                    <FaToggleOff className="text-gray-500 text-3xl" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium">
                    {isSharing
                      ? "Location sharing is enabled"
                      : "Location sharing is disabled"}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {isSharing
                      ? "Your live location is being shared with the customer"
                      : "Enable location sharing to help customer track your delivery"}
                  </p>
                </div>
              </div>

              <button
                onClick={isSharing ? stopLocationSharing : startLocationSharing}
                disabled={isLoading || !isGeolocationAvailable}
                className={`${
                  isSharing
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-600 hover:bg-green-700"
                } px-4 py-2 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2 w-full sm:w-auto justify-center`}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Processing...
                  </>
                ) : isSharing ? (
                  <>
                    <FaTimes />
                    Stop Sharing
                  </>
                ) : (
                  <>
                    <FaLocationArrow />
                    Start Sharing
                  </>
                )}
              </button>
            </div>
          </div>

          {lastUpdateTime && isSharing && (
            <div className="mt-3 text-sm text-gray-600 flex justify-between items-center">
              <span>
                Last updated:{" "}
                {new Date(lastUpdateTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
              <span className="flex items-center">
                <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse mr-1"></span>
                Live
              </span>
            </div>
          )}

          {locationError && (
            <div className="mt-3 p-3 bg-red-50 text-red-700 rounded-lg border border-red-100 text-sm">
              <div className="flex items-start gap-2">
                <FaExclamationCircle className="text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Location Error</p>
                  <p className="mt-1">{locationError}</p>
                </div>
              </div>
            </div>
          )}

          {!isGeolocationAvailable && (
            <div className="mt-3 p-3 bg-yellow-50 text-yellow-700 rounded-lg border border-yellow-100 text-sm">
              <div className="flex items-start gap-2">
                <FaExclamationTriangle className="text-yellow-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Location sharing not available</p>
                  <p className="mt-1">
                    Geolocation is not supported or permission has been denied.
                    Please check your browser settings.
                  </p>
                </div>
              </div>
            </div>
          )}

          {isSharing && permissionStatus === "denied" && (
            <div className="mt-3 p-3 bg-red-50 text-red-700 rounded-lg border border-red-100 text-sm">
              <div className="flex items-start gap-2">
                <FaExclamationCircle className="text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Location Permission Denied</p>
                  <p className="mt-1">
                    You have denied location permission. Please enable location
                    access in your browser settings to continue sharing.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

LiveLocationSharing.propTypes = {
  bookingId: PropTypes.string.isRequired,
  bookingStatus: PropTypes.string,
  onLocationUpdate: PropTypes.func,
};

LiveLocationSharing.defaultProps = {
  bookingStatus: "",
  onLocationUpdate: () => {},
};

export default LiveLocationSharing;
