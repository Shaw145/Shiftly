import { useState, useEffect, useRef } from "react";
import {
  FaSpinner,
  FaLocationArrow,
  FaDirections,
  FaInfoCircle,
  FaTruck,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";
import PropTypes from "prop-types";

// Helper function to load Google Maps script
const loadGoogleMapsScript = (callback) => {
  // If the script is already loaded
  if (window.google) {
    callback();
    return;
  }

  // Create script element
  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  }&libraries=geometry,places`;
  script.async = true;
  script.defer = true;
  script.addEventListener("load", callback);
  document.head.appendChild(script);
};

const LiveTrackingMap = ({
  bookingId,
  initialLocation,
  isDelivered = false,
}) => {
  // State for location and UI
  const [location, setLocation] = useState(initialLocation);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [eta, setEta] = useState(null);
  const [distance, setDistance] = useState(null);
  const [directionsShown, setDirectionsShown] = useState(false);

  // Refs for Google Maps
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const driverMarkerRef = useRef(null);
  const pickupMarkerRef = useRef(null);
  const deliveryMarkerRef = useRef(null);
  const directionsRendererRef = useRef(null);

  // Load Google Maps script
  useEffect(() => {
    loadGoogleMapsScript(() => {
      setGoogleMapsLoaded(true);
    });
  }, []);

  // Fetch booking details
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);

        // Check if we're in a protected route
        const isProtectedRoute = window.location.pathname.startsWith("/track/");
        const token = localStorage.getItem("token");

        let url = "";
        let headers = {};

        if (isProtectedRoute && token) {
          // Use authenticated endpoint
          url = `${
            import.meta.env.VITE_BACKEND_URL
          }/api/bookings/find/${bookingId}`;
          headers = {
            Authorization: `Bearer ${token}`,
          };
        } else {
          // Use public endpoint
          url = `${
            import.meta.env.VITE_BACKEND_URL
          }/api/tracking/public/${bookingId}`;
        }

        const response = await fetch(url, { headers });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch booking details");
        }

        if (isProtectedRoute && token) {
          // Handle data from authenticated endpoint
          if (data.success && data.booking) {
            setBookingDetails(data.booking);
          } else {
            setError("Booking not found");
          }
        } else {
          // Handle data from public endpoint
          if (data.success && data.tracking && data.tracking.booking) {
            setBookingDetails(data.tracking.booking);
          } else {
            setError("Booking not found");
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching booking details:", error);
        setError(error.message || "Failed to load booking details");
        setLoading(false);
      }
    };

    if (googleMapsLoaded) {
      fetchBookingDetails();
    }
  }, [googleMapsLoaded, bookingId]);

  // Initialize map when Google Maps is loaded and booking details are available
  useEffect(() => {
    if (!googleMapsLoaded || !bookingDetails || !mapRef.current) return;

    // Default center in India
    const defaultCenter = { lat: 20.5937, lng: 78.9629 };

    // Create map instance
    const mapInstance = new window.google.maps.Map(mapRef.current, {
      zoom: 13,
      center: defaultCenter,
      mapTypeControl: true,
      mapTypeControlOptions: {
        // Position the map type control at the top-right corner
        position: window.google.maps.ControlPosition.TOP_RIGHT,
        style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      },
      streetViewControl: false,
      fullscreenControl: true,
      fullscreenControlOptions: {
        position: window.google.maps.ControlPosition.RIGHT_TOP,
      },
      zoomControl: true,
      zoomControlOptions: {
        position: window.google.maps.ControlPosition.RIGHT_CENTER,
      },
      mapTypeId: window.google.maps.MapTypeId.ROADMAP,
    });

    mapInstanceRef.current = mapInstance;

    // Create directions renderer
    const directionsRenderer = new window.google.maps.DirectionsRenderer({
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: isDelivered ? "#4CAF50" : "#ff4444", // Green for delivered, red for active
        strokeOpacity: 0.8,
        strokeWeight: 5,
      },
    });
    directionsRenderer.setMap(mapInstance);
    directionsRendererRef.current = directionsRenderer;

    // Add markers for pickup and delivery
    if (bookingDetails.pickup) {
      addMarkerFromAddress(bookingDetails.pickup, "pickup");
    }

    if (bookingDetails.delivery) {
      addMarkerFromAddress(bookingDetails.delivery, "delivery");
    }

    // Special handling for delivered bookings
    if (isDelivered) {
      // For delivered bookings, show the completed route rather than live tracking
      // Add a completion marker at the delivery location
      if (deliveryMarkerRef.current) {
        // Create a completion indicator at delivery
        new window.google.maps.Marker({
          position: deliveryMarkerRef.current.getPosition(),
          map: mapInstance,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#4CAF50",
            fillOpacity: 1,
            strokeColor: "#FFFFFF",
            strokeWeight: 2,
          },
          zIndex: 11,
        });

        // Add completion message as an InfoWindow
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; text-align: center;">
              <div style="color: #4CAF50; font-weight: bold; margin-bottom: 4px;">
                Delivery Completed
              </div>
              <div style="font-size: 12px; color: #555;">
                ${new Date(
                  bookingDetails.updatedAt ||
                    bookingDetails.completedAt ||
                    new Date()
                ).toLocaleDateString()}
        </div>
      </div>
          `,
        });

        // Show info window by default for delivered bookings
        infoWindow.open(mapInstance, deliveryMarkerRef.current);
      }
    } else {
      // Add driver marker with custom truck icon for active deliveries
      const driverMarker = new window.google.maps.Marker({
        map: mapInstance,
        icon: {
          // Use a custom truck SVG icon
          url:
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="#ea1010" d="M48 0C21.5 0 0 21.5 0 48L0 368c0 26.5 21.5 48 48 48l16 0c0 53 43 96 96 96s96-43 96-96l128 0c0 53 43 96 96 96s96-43 96-96l32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l0-64 0-32 0-18.7c0-17-6.7-33.3-18.7-45.3L512 114.7c-12-12-28.3-18.7-45.3-18.7L416 96l0-48c0-26.5-21.5-48-48-48L48 0zM416 160l50.7 0L544 237.3l0 18.7-128 0 0-96zM112 416a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm368-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/></svg>

            `),
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: new window.google.maps.Point(20, 20),
          origin: new window.google.maps.Point(0, 0),
        },
        title: "Driver Location",
        zIndex: 10, // Put the truck on top of other markers
      });
      driverMarkerRef.current = driverMarker;

      // Pulse effect around driver marker
      const pulseRadius = new window.google.maps.Circle({
        strokeColor: "#ff4444",
        strokeOpacity: 0.5,
        strokeWeight: 2,
        fillColor: "#ff4444",
        fillOpacity: 0.1,
        map: mapInstance,
        radius: 80,
      });

      // Connect pulse to driver position
      driverMarker.addListener("position_changed", () => {
        pulseRadius.setCenter(driverMarker.getPosition());
      });

      // If we already have a location, set it
      if (location) {
        const position = new window.google.maps.LatLng(
          location.lat,
          location.lng
        );
        driverMarker.setPosition(position);
        pulseRadius.setCenter(position);

        // Center map on driver location
        mapInstance.setCenter(position);
        mapInstance.setZoom(15);

        // Calculate ETA if delivery marker exists
        if (deliveryMarkerRef.current) {
          calculateEta(position, deliveryMarkerRef.current.getPosition());
        }
      }
    }

    // Always calculate route between pickup and delivery for all bookings
    setTimeout(() => {
      if (pickupMarkerRef.current && deliveryMarkerRef.current) {
        calculateRoute();
      }
    }, 1000);

    // Set directions shown state
    setDirectionsShown(true);
  }, [googleMapsLoaded, bookingDetails, location, isDelivered]);

  // Set up WebSocket connection for live updates
  useEffect(() => {
    if (!bookingId || isDelivered) return; // Don't set up websocket if delivered

    // Determine the protocol based on the current page protocol
    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";

    // Get host from env or default
    let wsHost = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

    // Remove http:// or https:// from host if present
    wsHost = wsHost.replace(/^(https?:\/\/)/, "");

    // Construct WebSocket URL
    const wsUrl = `${wsProtocol}//${wsHost}/ws`;
    console.log("Connecting to WebSocket:", wsUrl);

    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("WebSocket connection established");

      // Send initial message
      socket.send(
        JSON.stringify({
          type: "hello",
          userType: "public",
        })
      );

      // Subscribe to booking updates
      const subscribeMsg = {
        type: "subscribe",
        channel: `booking:${bookingId}`,
      };
      socket.send(JSON.stringify(subscribeMsg));
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "driverLocation" && data.location) {
          setLocation(data.location);

          // Update driver marker position if map is loaded
          if (driverMarkerRef.current && mapInstanceRef.current) {
            const driverPosition = new window.google.maps.LatLng(
              data.location.lat,
              data.location.lng
            );

            driverMarkerRef.current.setPosition(driverPosition);

            // Calculate ETA if delivery marker exists
            if (deliveryMarkerRef.current) {
              calculateEta(
                driverPosition,
                deliveryMarkerRef.current.getPosition()
              );
            }
          }
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // Clean up WebSocket on component unmount
    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [bookingId, isDelivered]);

  // Set up interval polling for driver location
  useEffect(() => {
    if (!bookingId || isDelivered) return; // Don't poll if delivered

    // Poll driver location every 20 seconds
    const intervalId = setInterval(() => {
      pollDriverLocation();
    }, 20000);

    // Initial poll
    pollDriverLocation();

    return () => {
      clearInterval(intervalId);
    };
  }, [bookingId, isDelivered]);

  // Poll driver location function
  const pollDriverLocation = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/tracking/public/${bookingId}/location`
      );

      const data = await response.json();

      if (response.ok && data.success && data.location) {
        setLocation(data.location);
      }
    } catch (error) {
      console.error("Error polling driver location:", error);
    }
  };

  // Add marker from address
  const addMarkerFromAddress = (addressObject, type) => {
    if (!addressObject) return;

    const address = formatAddress(addressObject);
    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK" && results[0]) {
        const position = results[0].geometry.location;

        // Different marker settings based on type
        const settings = {
          pickup: {
            icon: {
              url:
                "data:image/svg+xml;charset=UTF-8," +
                encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                  <path fill="#4CAF50" d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(40, 40),
              anchor: new window.google.maps.Point(20, 40),
              origin: new window.google.maps.Point(0, 0),
            },
            title: "Pickup Location",
            ref: pickupMarkerRef,
            infoContent: `<div><strong>Pickup Location</strong><p>${address}</p></div>`,
            label: {
              text: "PICKUP",
              color: "#000",
              fontWeight: "bold",
              fontSize: "14px",
              className: "marker-label",
            },
          },
          delivery: {
            icon: {
              url:
                "data:image/svg+xml;charset=UTF-8," +
                encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                  <path fill="#F44336" d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(40, 40),
              anchor: new window.google.maps.Point(20, 40),
              origin: new window.google.maps.Point(0, 0),
            },
            title: "Delivery Location",
            ref: deliveryMarkerRef,
            infoContent: `<div><strong>Delivery Location</strong><p>${address}</p></div>`,
            label: {
              text: "DELIVERY",
              color: "#000",
              fontWeight: "bold",
              fontSize: "14px",
              className: "marker-label",
            },
          },
        };

        const config = settings[type];

        // Create the marker with the label
        const marker = new window.google.maps.Marker({
          position,
          map: mapInstanceRef.current,
          icon: config.icon,
          title: config.title,
          label: config.label,
        });

        config.ref.current = marker;

        // Add info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: config.infoContent,
        });

        marker.addListener("click", () => {
          infoWindow.open(mapInstanceRef.current, marker);
        });

        // Set center to pick up location initially if no driver location
        if (type === "pickup" && !location) {
          mapInstanceRef.current.setCenter(position);
        }
      } else {
        console.error(`Geocode was not successful for ${type}: ${status}`);
      }
    });
  };

  // Format address for display and geocoding
  const formatAddress = (addressObj) => {
    if (!addressObj) return "Not specified";

    // Handle string locations
    if (typeof addressObj === "string") return addressObj;

    // Handle object locations
    if (typeof addressObj === "object" && addressObj !== null) {
      const parts = [];

      if (addressObj.street) parts.push(addressObj.street);
      if (addressObj.addressLine1) parts.push(addressObj.addressLine1);
      if (addressObj.addressLine2) parts.push(addressObj.addressLine2);
      if (addressObj.city) parts.push(addressObj.city);
      if (addressObj.state) parts.push(addressObj.state);
      if (addressObj.pincode) parts.push(addressObj.pincode);

      return parts.length > 0
        ? parts.join(", ")
        : "Address details not available";
    }

    return "Location format not recognized";
  };

  // Calculate ETA between two points
  const calculateEta = (origin, destination) => {
    if (!window.google || !origin || !destination) return;

    const service = new window.google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: window.google.maps.TravelMode.DRIVING,
        unitSystem: window.google.maps.UnitSystem.METRIC,
      },
      (response, status) => {
        if (status === "OK") {
          const etaData = response.rows[0].elements[0];
          if (etaData.status === "OK") {
            setEta(etaData.duration.text);
            setDistance(etaData.distance.text);
          }
        }
      }
    );
  };

  // Calculate and display route
  const calculateRoute = () => {
    if (
      !googleMapsLoaded ||
      !pickupMarkerRef.current ||
      !deliveryMarkerRef.current
    )
      return;

    const directionsService = new window.google.maps.DirectionsService();
    const origin = pickupMarkerRef.current.getPosition();
    const destination = deliveryMarkerRef.current.getPosition();

    directionsService.route(
      {
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          directionsRendererRef.current.setDirections(result);
          setDirectionsShown(true);

          // Calculate ETA from current position if available
          if (
            driverMarkerRef.current &&
            driverMarkerRef.current.getPosition()
          ) {
            calculateEta(driverMarkerRef.current.getPosition(), destination);
          } else {
            // Otherwise calculate from pickup to delivery
            calculateEta(origin, destination);
          }
        } else {
          console.error("Directions request failed:", status);
        }
      }
    );
  };

  // Hide route
  const hideRoute = () => {
    if (directionsRendererRef.current) {
      directionsRendererRef.current.setDirections({ routes: [] });
      setDirectionsShown(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col">
      {/* Map container */}
      <div className="relative h-full w-full flex-grow">
        {/* Map element */}
        <div ref={mapRef} className="h-full w-full"></div>

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
            <div className="flex flex-col items-center">
              <FaSpinner className="animate-spin text-red-500 text-3xl mb-2" />
              <p className="text-gray-700">Loading map...</p>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
            <div className="max-w-md p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-start">
                <FaInfoCircle className="text-red-500 text-xl mt-0.5 mr-3" />
                <div>
                  <h3 className="font-medium text-red-800">
                    Error loading map
                  </h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Map controls */}
        <div className="absolute bottom-2 left-2 z-10 space-y-2">
          {!directionsShown && (
            <button
              onClick={calculateRoute}
              className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg shadow cursor-pointer z-10"
              aria-label="Show route"
            >
              <FaDirections />
              <span className="text-sm">Show Route</span>
            </button>
          )}

          {directionsShown && (
            <button
              onClick={hideRoute}
              className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg shadow cursor-pointer z-10"
              aria-label="Hide route"
            >
              <FaDirections />
              <span className="text-sm">Hide Route</span>
            </button>
          )}

          {location && (
            <button
              onClick={() => {
                if (mapInstanceRef.current && driverMarkerRef.current) {
                  mapInstanceRef.current.setCenter(
                    driverMarkerRef.current.getPosition()
                  );
                  mapInstanceRef.current.setZoom(15);
                }
              }}
              className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg shadow cursor-pointer z-10"
              aria-label="Find driver location"
            >
              <FaLocationArrow />
              <span className="text-sm">Find Driver</span>
            </button>
          )}
        </div>
      </div>

      {/* ETA information */}
      {(eta || distance) && (
        <div className="mt-3 bg-red-50 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center">
            <div className="flex items-center gap-2 text-gray-700 mr-4">
              <FaTruck className="text-red-500" />
              <span className="text-sm font-medium">
                {distance ? `Distance: ${distance}` : "Calculating distance..."}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <FaClock className="text-red-500" />
              <span className="text-sm font-medium">
                {eta ? `ETA: ${eta}` : "Calculating ETA..."}
              </span>
            </div>
          </div>
        </div>
      )}

      {!location && !loading && !error && (
        <div className="mt-3 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
          <div className="flex items-center gap-3">
            <FaInfoCircle className="text-yellow-500 text-lg" />
            <p className="text-gray-700">
              Driver&apos;s live location will appear here once they start
              sharing their location.
        </p>
      </div>
        </div>
      )}
    </div>
  );
};

LiveTrackingMap.propTypes = {
  bookingId: PropTypes.string.isRequired,
  initialLocation: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }),
  isDelivered: PropTypes.bool,
};

LiveTrackingMap.defaultProps = {
  initialLocation: null,
  isDelivered: false,
};

export default LiveTrackingMap;
