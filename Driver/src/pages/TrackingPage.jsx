import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import {
  FaMapMarkerAlt,
  FaTruck,
  FaToggleOn,
  FaToggleOff,
  FaSpinner,
  FaArrowLeft,
  FaRoute,
  FaLocationArrow,
  FaDirections,
  FaPhone,
  FaInfoCircle,
  FaUser,
  FaWarehouse,
  FaHome,
  FaCalendarAlt,
  FaClock,
  FaShippingFast,
  FaExclamationTriangle,
  FaMapMarkedAlt,
  FaCheckCircle,
  FaSearch,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import LiveLocationSharing from "../components/bookings/LiveLocationSharing";

// Helper function to load Google Maps script
const loadGoogleMapsScript = (callback) => {
  if (window.google && window.google.maps) {
    callback();
    return;
  }

  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  }&libraries=places,geometry`;
  script.async = true;
  script.defer = true;
  script.onload = callback;
  document.head.appendChild(script);
};

// Function to create truck icon only after Google Maps is loaded
function createTruckIcon() {
  if (!window.google || !window.google.maps) {
    return null;
  }

  // Use a proper truck icon with a detailed truck SVG path
  return {
    path: "M48 0C21.5 0 0 21.5 0 48L0 368c0 26.5 21.5 48 48 48l16 0c0 53 43 96 96 96s96-43 96-96l128 0c0 53 43 96 96 96s96-43 96-96l32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l0-64 0-32 0-18.7c0-17-6.7-33.3-18.7-45.3L512 114.7c-12-12-28.3-18.7-45.3-18.7L416 96l0-48c0-26.5-21.5-48-48-48L48 0zM416 160l50.7 0L544 237.3l0 18.7-128 0 0-96zM112 416a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm368-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z",
    fillColor: "#FF0000",
    fillOpacity: 1,
    strokeColor: "#FF0000",
    strokeWeight: 0,
    scale: 0.05,
    anchor: new window.google.maps.Point(14, 11.5),
    rotation: 0
  };
}

const TrackingPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  // States for various data and UI states
  const [booking, setBooking] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [eta, setEta] = useState(null);
  const [distance, setDistance] = useState(null);
  const [directionsShown, setDirectionsShown] = useState(false);
  const [driverLocation, setDriverLocation] = useState(null);

  // Refs for Google Maps
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const pickupMarkerRef = useRef(null);
  const deliveryMarkerRef = useRef(null);
  const driverMarkerRef = useRef(null);
  const directionsRendererRef = useRef(null);

  // Set page title
  useEffect(() => {
    document.title = "Live Location Sharing | Shiftly Driver";
    return () => {
      document.title = "Shiftly | A Seamless Transport System";
    };
  }, []);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  // Fetch booking details
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const token = localStorage.getItem("driverToken");
        if (!token) {
          console.error("No driver token found");
          navigate("/login");
          return;
        }

        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/driver/bookings/${bookingId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch booking details");
        }

        if (data.success && data.booking) {
          // Sanitize booking data
          const sanitizedBooking = JSON.parse(JSON.stringify(data.booking));
          setBooking(sanitizedBooking);

          if (sanitizedBooking.userId) {
            // Sanitize customer data
            const sanitizedCustomer = JSON.parse(
              JSON.stringify(sanitizedBooking.userId)
            );
            setCustomer(sanitizedCustomer);
          }
        } else {
          toast.error("Booking not found");
          navigate("/my-bookings");
        }
      } catch (error) {
        console.error("Error fetching booking details:", error);
        toast.error("Failed to load booking details: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId, navigate]);

  // Load Google Maps script
  useEffect(() => {
    loadGoogleMapsScript(() => {
      setMapLoaded(true);
    });
  }, []);

  // Check localStorage immediately for last known location
  useEffect(() => {
    // Try to get cached location from localStorage
    try {
      const sharingStateKey = `location_sharing_${bookingId}`;
      const lastLocationKey = `last_location_${bookingId}`;

      const isSharing = localStorage.getItem(sharingStateKey) === "true";
      const lastLocationData = localStorage.getItem(lastLocationKey);

      if (isSharing && lastLocationData) {
        const parsedLocation = JSON.parse(lastLocationData);
        console.log(
          "Found cached driver location in localStorage:",
          parsedLocation
        );
        setDriverLocation({
          lat: parsedLocation.lat,
          lng: parsedLocation.lng,
        });
      }
    } catch (error) {
      console.error("Error parsing cached location from localStorage:", error);
    }
  }, [bookingId]);

  // Initialize map
  useEffect(() => {
    if (!mapLoaded || !booking || !mapRef.current) return;

    // Default center in India
    const defaultCenter = { lat: 20.5937, lng: 78.9629 };

    // Create map instance
    const mapInstance = new window.google.maps.Map(mapRef.current, {
      zoom: 12,
      center: defaultCenter,
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
      mapTypeId: window.google.maps.MapTypeId.ROADMAP,
    });

    mapInstanceRef.current = mapInstance;

    // Create directions renderer
    const directionsRenderer = new window.google.maps.DirectionsRenderer({
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 5,
      },
    });
    directionsRenderer.setMap(mapInstance);
    directionsRendererRef.current = directionsRenderer;

    // Add markers for pickup and delivery
    if (booking.pickup) {
      addMarkerFromAddress(booking.pickup, "pickup");
    }

    if (booking.delivery) {
      addMarkerFromAddress(booking.delivery, "delivery");
    }

    // Add driver marker with custom truck icon if driverLocation exists
    if (driverLocation) {
      // Create custom truck icon
      const truckIcon = createTruckIcon();

      // Create driver marker
      const driverMarker = new window.google.maps.Marker({
        position: driverLocation,
        map: mapInstance,
        icon: truckIcon,
        title: "Your Location",
        zIndex: 10,
      });

      driverMarkerRef.current = driverMarker;

      // Add pulse effect around driver marker
      const pulseRadius = new window.google.maps.Circle({
        strokeColor: "#2196F3",
        strokeOpacity: 0.5,
        strokeWeight: 2,
        fillColor: "#2196F3",
        fillOpacity: 0.2,
        map: mapInstance,
        radius: 50,
        center: driverLocation,
      });

      // Center map on driver location
      mapInstance.setCenter(driverLocation);
      mapInstance.setZoom(15);

      // Connect pulse to driver position
      driverMarker.addListener("position_changed", () => {
        pulseRadius.setCenter(driverMarker.getPosition());
      });
    } else {
      // Pre-create the driver marker with null position
      // This ensures the marker object exists for later updates
      const truckIcon = createTruckIcon();

      // Create driver marker but don't add to map yet
      const driverMarker = new window.google.maps.Marker({
        map: mapInstance,
        icon: truckIcon,
        title: "Your Location",
        visible: false, // Hide until we have a location
        zIndex: 10,
      });

      driverMarkerRef.current = driverMarker;
    }

    // Initial directions if we have pickup and delivery
    if (pickupMarkerRef.current && deliveryMarkerRef.current) {
      calculateRoute();
    }
  }, [mapLoaded, booking, driverLocation]);

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
              url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
              scaledSize: new window.google.maps.Size(40, 40),
              labelOrigin: new window.google.maps.Point(20, -10),
            },
            title: "Pickup Location",
            ref: pickupMarkerRef,
            infoContent: `<div><strong>Pickup Location</strong><p>${address}</p></div>`,
            label: {
              text: "Pickup",
              color: "#006400",
              fontWeight: "bold",
            },
          },
          delivery: {
            icon: {
              url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
              scaledSize: new window.google.maps.Size(40, 40),
              labelOrigin: new window.google.maps.Point(20, -10),
            },
            title: "Delivery Location",
            ref: deliveryMarkerRef,
            infoContent: `<div><strong>Delivery Location</strong><p>${address}</p></div>`,
            label: {
              text: "Delivery",
              color: "#8B0000",
              fontWeight: "bold",
            },
          },
        };

        // Create marker
        const marker = new window.google.maps.Marker({
          position,
          map: mapInstanceRef.current,
          icon: settings[type].icon,
          title: settings[type].title,
          label: settings[type].label,
          animation: window.google.maps.Animation.DROP,
        });

        // Set ref
        settings[type].ref.current = marker;

        // Add info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: settings[type].infoContent,
        });

        marker.addListener("click", () => {
          infoWindow.open(mapInstanceRef.current, marker);
        });

        // Fit bounds to include this marker
        if (pickupMarkerRef.current && deliveryMarkerRef.current) {
          const bounds = new window.google.maps.LatLngBounds();
          bounds.extend(pickupMarkerRef.current.getPosition());
          bounds.extend(deliveryMarkerRef.current.getPosition());
          mapInstanceRef.current.fitBounds(bounds);
        } else {
          mapInstanceRef.current.setCenter(position);
          mapInstanceRef.current.setZoom(15);
        }
      } else {
        console.error(`Geocode failed: ${status}`);
        toast.error(
          `Failed to locate ${type} address. Please check the address.`
        );
      }
    });
  };

  // Format address to string
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

  // New function to center map on driver's current location
  const centerOnDriverLocation = useCallback(() => {
    if (mapInstanceRef.current && driverLocation) {
      mapInstanceRef.current.setCenter(driverLocation);
      mapInstanceRef.current.setZoom(15); // Closer zoom when centering on driver
    }
  }, [driverLocation]);

  // Modify calculateRoute to handle driver position and update ETA more reliably
  const calculateRoute = (force = false) => {
    if (
      !mapInstanceRef.current ||
      !window.google ||
      (!force && directionsShown)
    )
      return;

    if (!booking.pickup || !booking.delivery) {
      console.error("Pickup or delivery locations not available");
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();

    // Clear existing directions renderer if it exists
    if (directionsRendererRef.current) {
      directionsRendererRef.current.setMap(null);
    }

    const directionsRenderer = new window.google.maps.DirectionsRenderer({
      polylineOptions: {
        strokeColor: "#ff4545",
        strokeWeight: 5,
        strokeOpacity: 0.7,
      },
      suppressMarkers: true, // We're using our own markers
    });

    directionsRenderer.setMap(mapInstanceRef.current);
    directionsRendererRef.current = directionsRenderer;

    // Use driver's current location as origin if available, otherwise use pickup
    let origin;

    if (driverLocation) {
      origin = driverLocation;
      console.log("Using driver location for route:", origin);
    } else if (booking.pickup.lat && booking.pickup.lng) {
      origin = { lat: booking.pickup.lat, lng: booking.pickup.lng };
      console.log("Using pickup coordinates for route:", origin);
    } else {
      origin = formatAddress(booking.pickup);
      console.log("Using pickup address for route:", origin);
    }

    // Get destination coordinates or address
    let destination;
    if (booking.delivery.lat && booking.delivery.lng) {
      destination = { lat: booking.delivery.lat, lng: booking.delivery.lng };
    } else {
      destination = formatAddress(booking.delivery);
    }

    console.log("Calculating route from", origin, "to", destination);

    // Calculate route
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          console.log("Route calculation successful", result);
          directionsRenderer.setDirections(result);
          setDirectionsShown(true);

          // Extract distance and ETA information
          const route = result.routes[0];
          if (route && route.legs && route.legs[0]) {
            const leg = route.legs[0];
            setDistance(leg.distance.text);
            setEta(leg.duration.text);
            console.log(
              "Updated distance:",
              leg.distance.text,
              "ETA:",
              leg.duration.text
            );
          }
        } else {
          console.error("Directions request failed:", status);
          toast.error("Could not calculate route");
        }
      }
    );
  };

  // Hide route
  const hideRoute = () => {
    if (directionsRendererRef.current) {
      directionsRendererRef.current.setMap(null);
      directionsRendererRef.current = null;
    }
    setDirectionsShown(false);
    setDistance(null);
    setEta(null);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      // This intentionally left empty as we don't need cleanup for map instances
    };
  }, []);

  // Update handleLocationUpdate to store the driver location and update ETA
  const handleLocationUpdate = (location) => {
    if (!mapInstanceRef.current || !window.google) return;

    console.log("Location update received:", location);
    setDriverLocation(location);

    // Update driver marker if it exists or create a new one
    if (driverMarkerRef.current) {
      driverMarkerRef.current.setPosition(location);
      driverMarkerRef.current.setVisible(true); // Ensure marker is visible

      // Check if map is centered far from driver, recenter if needed
      const mapCenter = mapInstanceRef.current.getCenter();
      const driverLatLng = new window.google.maps.LatLng(
        location.lat,
        location.lng
      );

      // Calculate distance between map center and driver
      let distance = 0;
      // Check if geometry library is available
      if (
        window.google.maps.geometry &&
        window.google.maps.geometry.spherical
      ) {
        distance = window.google.maps.geometry.spherical.computeDistanceBetween(
          mapCenter,
          driverLatLng
        );
      } else {
        // Fallback to simplified distance calculation (haversine formula)
        const R = 6371e3; // Earth radius in meters
        const lat1 = (mapCenter.lat() * Math.PI) / 180;
        const lat2 = (location.lat * Math.PI) / 180;
        const deltaLat = ((location.lat - mapCenter.lat()) * Math.PI) / 180;
        const deltaLng = ((location.lng - mapCenter.lng()) * Math.PI) / 180;

        const a =
          Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
          Math.cos(lat1) *
            Math.cos(lat2) *
            Math.sin(deltaLng / 2) *
            Math.sin(deltaLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        distance = R * c; // Distance in meters
      }

      // If distance is more than 2km, recenter map
      if (distance > 2000) {
        mapInstanceRef.current.setCenter(location);
      }
    } else {
      // Create a new driver marker if it doesn't exist
      const truckIcon = createTruckIcon();

      const newDriverMarker = new window.google.maps.Marker({
        position: location,
        map: mapInstanceRef.current,
        icon: truckIcon,
        title: "Driver Location",
        zIndex: 10,
      });

      driverMarkerRef.current = newDriverMarker;

      // Add pulse effect
      const pulseRadius = new window.google.maps.Circle({
        strokeColor: "#2196F3",
        strokeOpacity: 0.5,
        strokeWeight: 2,
        fillColor: "#2196F3",
        fillOpacity: 0.2,
        map: mapInstanceRef.current,
        radius: 50,
        center: location,
      });

      // Connect pulse to driver position
      newDriverMarker.addListener("position_changed", () => {
        pulseRadius.setCenter(newDriverMarker.getPosition());
      });

      // Center on driver location
      mapInstanceRef.current.setCenter(location);
      mapInstanceRef.current.setZoom(15);
    }

    // If we have both pickup and delivery markers and directions are shown, recalculate
    if (booking && booking.pickup && booking.delivery && directionsShown) {
      calculateRoute(true); // Force recalculation with updated driver position
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 flex items-center justify-center min-h-[80vh]">
          <div className="flex flex-col items-center">
            <FaSpinner className="animate-spin text-red-500 text-4xl mb-4" />
            <p className="text-gray-600">Loading tracking details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!booking) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Booking Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The booking you're looking for could not be found or you don't
              have permission to view it.
            </p>
            <button
              onClick={() => navigate("/my-bookings")}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center gap-2 mx-auto"
            >
              <FaArrowLeft />
              Back to My Bookings
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Format date for better display
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Not available";
      return date.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      return "Not available";
    }
  };

  // Format time for better display
  const formatTime = (timeString) => {
    if (!timeString) return "Not specified";
    return timeString;
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        {/* Back button and header - Standard across pages */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2 text-gray-600 hover:text-red-500 cursor-pointer"
          >
            <FaArrowLeft size={14} />
            <span>Back to Bookings</span>
          </button>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-800">
                    Live Tracking - #{booking.bookingId}
                  </h1>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium 
                    ${
                      booking.status === "confirmed"
                        ? "bg-blue-100 text-blue-800"
                        : booking.status === "inTransit" ||
                          booking.status === "in_transit"
                        ? "bg-yellow-100 text-yellow-800"
                        : booking.status === "completed" ||
                          booking.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {typeof booking.status === "string"
                      ? booking.status.charAt(0).toUpperCase() +
                        booking.status
                          .slice(1)
                          .replace(/([A-Z])|(_\w)/g, (match) =>
                            match.startsWith("_")
                              ? " " + match[1].toUpperCase()
                              : " " + match
                          )
                      : "Unknown Status"}
                  </span>
                </div>
                <p className="text-gray-500 mt-1">
                  {formatDate(
                    booking.schedule?.date ||
                      booking.bookingDate ||
                      booking.createdAt
                  )}
                </p>
              </div>
              <div>
                {booking.status === "inTransit" ||
                booking.status === "in_transit" ? (
                  <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse mr-2"></span>
                    Active Delivery
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column with map - Made smaller but still prominent */}
          <div className="lg:col-span-2 space-y-6">
            {/* Map container */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <FaMapMarkedAlt className="text-red-600" /> Live Location
                    Map
                  </h2>

                  {/* Route controls */}
                  <button
                    onClick={directionsShown ? hideRoute : calculateRoute}
                    className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <FaRoute size={14} />
                    <span>{directionsShown ? "Hide Route" : "Show Route"}</span>
                  </button>
                </div>
              </div>

              <div className="relative h-[350px]">
                {/* Map will be rendered in this div */}
                <div ref={mapRef} className="absolute inset-0"></div>
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <div className="flex flex-wrap gap-4 justify-between items-center">
                  {/* Distance and ETA */}
                  {distance || eta ? (
                    <div className="flex items-center gap-4 text-sm">
                      {distance && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <FaTruck className="text-red-500" />
                          <span className="font-medium">{distance}</span>
                        </div>
                      )}
                      {eta && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <FaClock className="text-red-500" />
                          <span className="font-medium">ETA: {eta}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">
                      Show route to see distance and ETA
                    </div>
                  )}

                  {/* Map control buttons */}
                  <div className="flex items-center gap-2">
                    {/* Find Me button */}
                    <button
                      onClick={centerOnDriverLocation}
                      disabled={!driverLocation}
                      className={`flex items-center gap-2 px-3 py-2.5 
                        ${
                          !driverLocation
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                        } 
                        text-white text-sm rounded-lg transition-colors`}
                    >
                      <FaLocationArrow size={14} />
                      <span>Find Me</span>
                    </button>

                    {/* Navigate in Google button */}
                    {booking.pickup && booking.delivery && (
                      <button
                        onClick={() => {
                          const destination = formatAddress(booking.delivery);
                          const encodedDestination =
                            encodeURIComponent(destination);
                          window.open(
                            `https://www.google.com/maps/dir/?api=1&destination=${encodedDestination}&travelmode=driving`,
                            "_blank"
                          );
                        }}
                        className="flex items-center gap-2 px-3 py-2.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                      >
                        <FaDirections size={14} />
                        <span>Navigate in Google Maps</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Location sharing component */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaLocationArrow className="text-red-600" /> Live Location
                Sharing
              </h2>

              <LiveLocationSharing
                bookingId={bookingId}
                bookingStatus={booking?.status}
                onLocationUpdate={handleLocationUpdate}
              />
            </div>
          </div>

          {/* Right column with information cards */}
          <div className="space-y-6">
            {/* Customer card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaUser className="text-red-600" /> Customer Details
              </h2>

              {customer ? (
                <div className="flex flex-col">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-16 w-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
                      {customer.profileImage ? (
                        <img
                          src={customer.profileImage}
                          alt={customer.fullName || customer.name || "Customer"}
                          className="h-full w-full object-cover rounded-full"
                        />
                      ) : (
                        <FaUser className="text-red-400 text-2xl" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-lg">
                        {customer.fullName || customer.name || "Customer"}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {customer.email || "Email not available"}
                      </p>
                    </div>
                  </div>

                  {/* Contact button */}
                  {customer.phone && (
                    <a
                      href={`tel:${customer.phone}`}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <FaPhone />
                      <span>Call Customer</span>
                    </a>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4 text-center">
                  <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <FaUser className="text-gray-400 text-2xl" />
                  </div>
                  <p className="text-gray-500">
                    Customer details not available
                  </p>
                </div>
              )}
            </div>

            {/* Booking details card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaShippingFast className="text-red-600" /> Booking Details
              </h2>

              <div className="space-y-4">
                {/* Pickup location */}
                <div className="flex gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <FaMapMarkerAlt className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-green-800">
                      Pickup Location
                    </p>
                    <p className="text-gray-700 text-sm mt-1">
                      {formatAddress(booking.pickup)}
                    </p>
                  </div>
                </div>

                {/* Delivery location */}
                <div className="flex gap-3">
                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <FaMapMarkerAlt className="text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-red-800">
                      Delivery Location
                    </p>
                    <p className="text-gray-700 text-sm mt-1">
                      {formatAddress(booking.delivery)}
                    </p>
                  </div>
                </div>

                {/* Date and time */}
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="text-sm">
                    <p className="text-gray-500">Date</p>
                    <p className="font-medium text-gray-800">
                      {formatDate(booking.schedule?.date || booking.createdAt)}
                    </p>
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-500">Time</p>
                    <p className="font-medium text-gray-800">
                      {formatTime(booking.schedule?.time || "Not specified")}
                    </p>
                  </div>
                </div>

                {/* Vehicle type if available */}
                {booking.vehicle ||
                  (booking.vehicleType && (
                    <div className="text-sm mt-2">
                      <p className="text-gray-500">Vehicle Type</p>
                      <p className="font-medium text-gray-800">
                        {booking.vehicle ||
                          booking.vehicleType ||
                          "Not specified"}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TrackingPage;
