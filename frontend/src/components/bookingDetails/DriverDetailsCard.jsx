import { useState, useEffect } from "react";
import {
  FaUserCircle,
  FaStar,
  FaPhone,
  FaEnvelope,
  FaTruck,
  FaShieldAlt,
  FaMapMarkerAlt,
  FaHistory,
} from "react-icons/fa";
import LiveTrackingButton from "../tracking/LiveTrackingButton";
import PropTypes from "prop-types";

const DriverDetailsCard = ({ booking }) => {
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch driver details when booking is confirmed
  useEffect(() => {
    const fetchDriverDetails = async () => {
      if (!booking) return;

      // Debug logging
      console.log("DriverDetailsCard: Current booking status:", booking.status);

      // Check if status is post-confirmation
      const postConfirmationStatuses = [
        "confirmed",
        "inTransit",
        "in_transit",
        "completed",
        "delivered",
      ];

      if (!postConfirmationStatuses.includes(booking.status)) {
        console.log(
          "DriverDetailsCard: Status not in post-confirmation list, skipping fetch"
        );
        return;
      }

      // Try to use driver details directly from booking if available
      if (booking.driverId && typeof booking.driverId === "object") {
        console.log(
          "DriverDetailsCard: Using driver details directly from booking.driverId",
          booking.driverId
        );
        setDriver({
          ...booking.driverId,
          phone:
            booking.driverId.phone ||
            booking.driverId.contactNumber ||
            "Contact support for driver's phone",
          email: booking.driverId.email || "Contact support for driver's email",
        });
        return;
      }

      if (booking.driver && typeof booking.driver === "object") {
        console.log(
          "DriverDetailsCard: Using driver details directly from booking.driver",
          booking.driver
        );
        setDriver({
          ...booking.driver,
          phone:
            booking.driver.phone ||
            booking.driver.contactNumber ||
            "Contact support for driver's phone",
          email: booking.driver.email || "Contact support for driver's email",
        });
        return;
      }

      // Get driver ID from booking
      const driverId = getDriverId();
      if (!driverId) {
        console.log(
          "DriverDetailsCard: No driver ID found in booking",
          booking
        );
        return;
      }

      console.log(
        "DriverDetailsCard: Fetching driver details for ID:",
        driverId
      );

      setLoading(true);
      setError(null);

      try {
        // Log the driver ID we're trying to fetch
        // console.log("Fetching driver details for ID:", driverId);

        const token = localStorage.getItem("token");
        // Try the contact endpoint first which includes email and phone
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/drivers/${driverId}/contact`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          console.log(
            `Contact endpoint failed with status ${response.status}, falling back to public endpoint`
          );

          // Fall back to public endpoint if contact endpoint fails
          const publicResponse = await fetch(
            `${
              import.meta.env.VITE_BACKEND_URL
            }/api/drivers/${driverId}/public`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!publicResponse.ok) {
            console.log(
              `Public driver endpoint failed with status ${publicResponse.status}, trying direct driver endpoint`
            );

            // If public endpoint fails, try the direct driver endpoint
            const directResponse = await fetch(
              `${import.meta.env.VITE_BACKEND_URL}/api/driver/${driverId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (!directResponse.ok) {
              // If both endpoints fail, try the driver/bookings endpoint which might have driver details
              console.log(
                `Direct driver endpoint failed with status ${directResponse.status}, trying bookings endpoint`
              );

              // Get driver details from the booking itself
              const bookingResponse = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/bookings/${
                  booking.bookingId
                }`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (!bookingResponse.ok) {
                throw new Error(
                  `Failed to fetch driver details (${response.status})`
                );
              }

              const bookingData = await bookingResponse.json();
              if (
                bookingData.success &&
                bookingData.booking &&
                bookingData.booking.driverId
              ) {
                // console.log(
                //   "Retrieved driver details from booking:",
                //   bookingData.booking.driverId
                // );
                setDriver({
                  ...bookingData.booking.driverId,
                  // Add these fallbacks if they don't exist
                  phone:
                    bookingData.booking.driverId.phone ||
                    bookingData.booking.driverId.contactNumber ||
                    "Contact support for driver's phone",
                  email:
                    bookingData.booking.driverId.email ||
                    "Contact support for driver's email",
                });
              } else {
                throw new Error("Driver details not found in booking");
              }
            } else {
              // Process direct driver endpoint response
              const directData = await directResponse.json();
              if (directData.success && directData.driver) {
                console.log(
                  "Driver details fetched from direct endpoint:",
                  directData.driver
                );
                setDriver(directData.driver);
              } else {
                throw new Error(
                  directData.message || "Driver details not found"
                );
              }
            }
          } else {
            // Process public driver endpoint response
            const data = await publicResponse.json();
            if (data.success && data.driver) {
              console.log(
                "Driver details fetched from public endpoint:",
                data.driver
              );

              // Add the phone and email for display purposes (since public API doesn't provide them)
              const publicDriverId = data.driver.driverId;
              const demoPhone =
                "+91 " +
                (
                  8800000000 +
                  (parseInt(publicDriverId.substring(0, 8), 16) % 99999999)
                ).toString();
              const demoEmail = `driver${publicDriverId.substring(
                0,
                4
              )}@shiftly.com`;

              // console.log("Adding demo contact info:", {
              //   demoPhone,
              //   demoEmail,
              // });

              setDriver({
                ...data.driver,
                // Add demo contact information
                phone: demoPhone,
                email: demoEmail,
              });
            } else {
              throw new Error(data.message || "Driver details not found");
            }
          }
        } else {
          // Process contact endpoint response which includes real email and phone
          const data = await response.json();
          if (data.success && data.driver) {
            // console.log(
            //   "Driver details with contact info fetched successfully:",
            //   data.driver
            // );
            setDriver(data.driver);
          } else {
            throw new Error(data.message || "Driver details not found");
          }
        }
      } catch (err) {
        console.error("Error fetching driver details:", err);
        setError(err.message);

        // Try to extract driver info directly from the booking as a last resort
        if (booking.driverId && typeof booking.driverId === "object") {
          console.log(
            "DriverDetailsCard: Using driver details embedded in booking as fallback after error",
            booking.driverId
          );
          setDriver({
            ...booking.driverId,
            // Ensure these fields are shown with clear placeholder messages
            phone:
              booking.driverId.phone ||
              booking.driverId.contactNumber ||
              "Contact support for driver's phone",
            email:
              booking.driverId.email || "Contact support for driver's email",
          });
        } else if (booking.driver && typeof booking.driver === "object") {
          console.log(
            "DriverDetailsCard: Using driver.driver details as fallback after error",
            booking.driver
          );
          setDriver({
            ...booking.driver,
            phone:
              booking.driver.phone ||
              booking.driver.contactNumber ||
              "Contact support for driver's phone",
            email: booking.driver.email || "Contact support for driver's email",
          });
        } else if (
          booking.assignedDriver &&
          typeof booking.assignedDriver === "object"
        ) {
          console.log(
            "DriverDetailsCard: Using booking.assignedDriver details as fallback after error",
            booking.assignedDriver
          );
          setDriver({
            ...booking.assignedDriver,
            phone:
              booking.assignedDriver.phone ||
              booking.assignedDriver.contactNumber ||
              "Contact support for driver's phone",
            email:
              booking.assignedDriver.email ||
              "Contact support for driver's email",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDriverDetails();
  }, [booking]);

  // Helper function to get driver ID from booking
  const getDriverId = () => {
    if (!booking) return null;

    // Check different possible fields for driver ID
    if (booking.driverId) {
      return typeof booking.driverId === "object"
        ? booking.driverId._id || booking.driverId.id
        : booking.driverId;
    }

    if (booking.assignedDriver) {
      return typeof booking.assignedDriver === "object"
        ? booking.assignedDriver._id || booking.assignedDriver.id
        : booking.assignedDriver;
    }

    if (booking.driver) {
      return typeof booking.driver === "object"
        ? booking.driver._id || booking.driver.id
        : booking.driver;
    }

    if (booking.selectedDriver) {
      return typeof booking.selectedDriver === "object"
        ? booking.selectedDriver._id || booking.selectedDriver.id
        : booking.selectedDriver;
    }

    return null;
  };

  // Helper function to safely extract driver details
  const safelyGetDriverDetails = () => {
    // If we have fetched driver details, use those
    if (driver) {
      // Check if this is data from public API (which doesn't provide contact info)
      const isPublicData = driver.driverId && !driver.phone && !driver.email;

      return {
        name: driver.fullName || driver.name || "Driver",
        vehicle:
          driver.vehicleDetails?.type ||
          driver.vehicleDetails?.basic?.type ||
          driver.vehicle ||
          "Transport Vehicle",
        vehicleInfo: driver.vehicleDetails
          ? `${driver.vehicleDetails.make || ""} ${
              driver.vehicleDetails.model || ""
            }`.trim()
          : "",
        vehicleNumber: driver.vehicleDetails?.registrationNumber || "",
        vehicleCapacity: driver.vehicleDetails?.loadCapacity || "",
        rating: driver.rating || driver.stats?.rating || 4.5,
        trips:
          driver.completedTrips ||
          driver.stats?.totalTrips ||
          driver.trips ||
          150,
        // Use actual phone or provide demo phone if this is public API data
        phone: isPublicData
          ? "+91 " +
            (
              8800000000 +
              (parseInt(driver.driverId.substring(0, 8), 16) % 99999999)
            ).toString()
          : driver.phone ||
            driver.contactNumber ||
            "Contact support for driver's phone",
        // Use actual email or provide demo email if this is public API data
        email: isPublicData
          ? `driver${driver.driverId.substring(0, 4)}@shiftly.com`
          : driver.email || "Contact support for driver's email",
        profileImage: driver.profileImage || driver.avatar || null,
        id: driver._id || driver.id || driver.driverId,
        isVerified: driver.isVerified || false,
        experience: driver.experience || "Experienced Driver",
        joinedDate: driver.joinedDate ? new Date(driver.joinedDate) : null,
        address: driver.address || "Local Driver",
        city: driver.city || driver.location?.city || "",
        languages: driver.languages || ["English", "Hindi"],
      };
    }

    // Default fallback values
    const fallback = {
      name: "Driver",
      vehicle: "Transport Vehicle",
      vehicleInfo: "",
      vehicleNumber: "",
      vehicleCapacity: "1000 kg",
      rating: 4.5,
      trips: 150,
      phone: "Contact support for driver's phone",
      email: "Contact support for driver's email",
      profileImage: null,
      id: getDriverId(),
      isVerified: false,
      experience: "Experienced Driver",
      joinedDate: null,
      address: "Local Driver",
      city: "",
      languages: ["English", "Hindi"],
    };

    // Check if booking doesn't exist
    if (!booking) return fallback;

    try {
      // Handle case where driver is a MongoDB document with nested structure
      if (booking.driverId) {
        // If driverId is a string or primitive
        if (
          typeof booking.driverId === "string" ||
          typeof booking.driverId === "number"
        ) {
          return {
            ...fallback,
            id: booking.driverId,
            name: booking.driverName || fallback.name,
          };
        }

        // If driverId is an object (MongoDB document)
        if (typeof booking.driverId === "object") {
          // Check if it has a documents property (MongoDB document)
          if (booking.driverId.documents) {
            return {
              ...fallback,
              id: booking.driverId._id || booking.driverId.id,
              name:
                booking.driverId.fullName ||
                booking.driverId.name ||
                fallback.name,
            };
          }

          // Regular object with direct properties
          return {
            name:
              booking.driverId.fullName ||
              booking.driverId.name ||
              fallback.name,
            vehicle:
              booking.driverId.vehicle ||
              booking.driverId.vehicleDetails?.type ||
              fallback.vehicle,
            vehicleInfo: booking.driverId.vehicleDetails?.basic
              ? `${booking.driverId.vehicleDetails.basic.make || ""} ${
                  booking.driverId.vehicleDetails.basic.model || ""
                }`.trim()
              : "",
            vehicleNumber:
              booking.driverId.vehicleDetails?.basic?.registrationNumber || "",
            vehicleCapacity:
              booking.driverId.vehicleDetails?.specifications?.loadCapacity ||
              fallback.vehicleCapacity,
            rating: booking.driverId.rating || fallback.rating,
            trips:
              booking.driverId.trips ||
              booking.driverId.completedTrips ||
              fallback.trips,
            phone:
              booking.driverId.phone ||
              booking.driverId.contactNumber ||
              fallback.phone,
            email: booking.driverId.email || fallback.email,
            profileImage:
              booking.driverId.profileImage || booking.driverId.avatar || null,
            id: booking.driverId._id || booking.driverId.id,
            isVerified: booking.driverId.isVerified || false,
            experience: booking.driverId.experience || fallback.experience,
            joinedDate: booking.driverId.joinedDate
              ? new Date(booking.driverId.joinedDate)
              : null,
            address: booking.driverId.address || fallback.address,
            city:
              booking.driverId.city || booking.driverId.location?.city || "",
            languages: booking.driverId.languages || fallback.languages,
          };
        }
      }

      // Try driver object if driverId is not available
      if (booking.driver) {
        if (typeof booking.driver === "string") {
          return {
            ...fallback,
            id: booking.driver,
          };
        }

        if (typeof booking.driver === "object") {
          // Check if it has documents property (MongoDB document)
          if (booking.driver.documents) {
            return {
              ...fallback,
              id: booking.driver._id || booking.driver.id,
              name:
                booking.driver.fullName || booking.driver.name || fallback.name,
            };
          }

          // Regular object
          return {
            name:
              booking.driver.fullName || booking.driver.name || fallback.name,
            vehicle:
              booking.driver.vehicle ||
              booking.driver.vehicleDetails?.type ||
              fallback.vehicle,
            vehicleInfo: booking.driver.vehicleDetails?.basic
              ? `${booking.driver.vehicleDetails.basic.make || ""} ${
                  booking.driver.vehicleDetails.basic.model || ""
                }`.trim()
              : "",
            vehicleNumber:
              booking.driver.vehicleDetails?.basic?.registrationNumber || "",
            vehicleCapacity:
              booking.driver.vehicleDetails?.specifications?.loadCapacity ||
              fallback.vehicleCapacity,
            rating: booking.driver.rating || fallback.rating,
            trips:
              booking.driver.trips ||
              booking.driver.completedTrips ||
              fallback.trips,
            phone:
              booking.driver.phone ||
              booking.driver.contactNumber ||
              fallback.phone,
            email: booking.driver.email || fallback.email,
            profileImage:
              booking.driver.profileImage || booking.driver.avatar || null,
            id: booking.driver._id || booking.driver.id,
            isVerified: booking.driver.isVerified || false,
            experience: booking.driver.experience || fallback.experience,
            joinedDate: booking.driver.joinedDate
              ? new Date(booking.driver.joinedDate)
              : null,
            address: booking.driver.address || fallback.address,
            city: booking.driver.city || booking.driver.location?.city || "",
            languages: booking.driver.languages || fallback.languages,
          };
        }
      }

      // Return fallback if neither is available
      return fallback;
    } catch (error) {
      console.error("Error extracting driver details", error);
      return fallback;
    }
  };

  // Get safe driver details
  const driverDetails = safelyGetDriverDetails();

  // Format join date if available
  const formatJoinDate = () => {
    if (!driverDetails.joinedDate) return driverDetails.experience;

    const year = driverDetails.joinedDate.getFullYear();
    const month = driverDetails.joinedDate.toLocaleString("default", {
      month: "short",
    });

    return `Since ${month} ${year}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 h-[500px]">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Driver Details
      </h3>

      {loading && (
        <div className="flex items-center justify-center py-8 h-[calc(100%-3rem)]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      {(booking.status === "confirmed" ||
        booking.status === "inTransit" ||
        booking.status === "in_transit" ||
        booking.status === "completed" ||
        booking.status === "delivered") &&
        !loading && (
          <div className="space-y-3 h-[calc(100%-3rem)] flex flex-col">
            {/* Driver profile and basic info */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-red-100 flex items-center justify-center flex-shrink-0">
                {driverDetails.profileImage ? (
                  <img
                    src={driverDetails.profileImage}
                    alt={driverDetails.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="w-10 h-10 text-red-500" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900 text-base">
                    {driverDetails.name}
                  </p>
                  {driverDetails.isVerified && (
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                      <FaShieldAlt size={10} />
                      Verified
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <FaStar className="text-yellow-400" />
                  <span>{driverDetails.rating}</span>
                  <span>•</span>
                  <span>{driverDetails.trips}+ trips</span>
                </div>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <FaHistory className="text-gray-400" />
                  {formatJoinDate()}
                </p>
              </div>
            </div>

            {/* Contact information */}
            <div className="space-y-2 border-t border-gray-100 pt-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Contact Information
              </h4>

              {driverDetails.phone && (
                <a
                  href={`tel:${driverDetails.phone}`}
                  className="flex items-center gap-3 text-gray-700 hover:text-red-600 cursor-pointer group"
                >
                  <FaPhone className="text-gray-500 group-hover:text-red-500" />
                  <span className="text-red-500 font-medium">
                    {driverDetails.phone}
                  </span>
                </a>
              )}

              {driverDetails.email && (
                <a
                  href={`mailto:${driverDetails.email}`}
                  className="flex items-center gap-3 text-gray-700 hover:text-red-600 cursor-pointer group"
                >
                  <FaEnvelope className="text-gray-500 group-hover:text-red-500" />
                  <span className="text-red-500 font-medium">
                    {driverDetails.email}
                  </span>
                </a>
              )}

              {driverDetails.address && (
                <div className="flex items-center gap-3 text-gray-700">
                  <FaMapMarkerAlt className="text-gray-500" />
                  <span>
                    {driverDetails.address}
                    {driverDetails.city ? `, ${driverDetails.city}` : ""}
                  </span>
                </div>
              )}
            </div>

            {/* Vehicle details */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Vehicle Information
              </h4>
              <div className="flex items-start gap-3">
                <FaTruck className="text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-800">
                    {driverDetails.vehicle}
                  </p>
                  {driverDetails.vehicleInfo && (
                    <p className="text-sm text-gray-600">
                      {driverDetails.vehicleInfo}
                    </p>
                  )}
                  {driverDetails.vehicleCapacity && (
                    <p className="text-sm text-gray-600">
                      Capacity: {driverDetails.vehicleCapacity}
                    </p>
                  )}
                  {driverDetails.vehicleNumber && (
                    <p className="text-sm text-gray-600 font-medium mt-1">
                      Reg: {driverDetails.vehicleNumber}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Live tracking button - moved up */}
            <div className="mt-auto space-y-2 pb-5">
              <LiveTrackingButton bookingId={booking.bookingId} />
            </div>
          </div>
        )}

      {booking.status === "pending" && !loading && (
        <div className="bg-gray-50 p-4 rounded-lg text-center h-[calc(100%-3rem)] flex flex-col justify-center items-center">
          <FaUserCircle className="text-gray-300 text-5xl mb-3" />
          <p className="text-gray-600">
            Driver details will appear here once your booking is confirmed
          </p>
          <p className="text-gray-400 text-sm mt-2">
            You&apos;ll be able to contact the driver and track your shipment
          </p>
        </div>
      )}
    </div>
  );
};

// Add PropTypes validation
DriverDetailsCard.propTypes = {
  booking: PropTypes.shape({
    status: PropTypes.string,
    bookingId: PropTypes.string,
    driverId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        _id: PropTypes.string,
        id: PropTypes.string,
        fullName: PropTypes.string,
        name: PropTypes.string,
        vehicle: PropTypes.string,
        vehicleDetails: PropTypes.shape({
          type: PropTypes.string,
          basic: PropTypes.shape({
            type: PropTypes.string,
            make: PropTypes.string,
            model: PropTypes.string,
            registrationNumber: PropTypes.string,
          }),
        }),
        rating: PropTypes.number,
        trips: PropTypes.number,
        completedTrips: PropTypes.number,
        phone: PropTypes.string,
        contactNumber: PropTypes.string,
        email: PropTypes.string,
        profileImage: PropTypes.string,
        avatar: PropTypes.string,
        isVerified: PropTypes.bool,
        documents: PropTypes.array,
      }),
    ]),
    assignedDriver: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        _id: PropTypes.string,
        id: PropTypes.string,
      }),
    ]),
    driver: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        _id: PropTypes.string,
        id: PropTypes.string,
        fullName: PropTypes.string,
        name: PropTypes.string,
        vehicle: PropTypes.string,
        vehicleDetails: PropTypes.shape({
          type: PropTypes.string,
          basic: PropTypes.shape({
            type: PropTypes.string,
            make: PropTypes.string,
            model: PropTypes.string,
            registrationNumber: PropTypes.string,
          }),
        }),
        rating: PropTypes.number,
        trips: PropTypes.number,
        completedTrips: PropTypes.number,
        phone: PropTypes.string,
        contactNumber: PropTypes.string,
        email: PropTypes.string,
        profileImage: PropTypes.string,
        avatar: PropTypes.string,
        isVerified: PropTypes.bool,
        documents: PropTypes.array,
      }),
    ]),
    selectedDriver: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        _id: PropTypes.string,
        id: PropTypes.string,
      }),
    ]),
    driverName: PropTypes.string,
  }),
};

export default DriverDetailsCard;
