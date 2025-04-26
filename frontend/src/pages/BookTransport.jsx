import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StepProgress from "../components/booking/StepProgress";
import AddressStep from "../components/booking/AddressStep";
import GoodsStep from "../components/booking/GoodsStep";
import VehicleStep from "../components/booking/VehicleStep";
import ScheduleStep from "../components/booking/ScheduleStep";
import ConfirmationModal from "../components/booking/ConfirmationModal";
import BookingSuccess from "../components/booking/BookingSuccess";
import ProfileUpdateModal from "../components/ProfileUpdateModal";
import { calculateBookingPrice } from "../utils/priceCalculator";
import axios from "axios";
import useProfileCheck from "../hooks/useProfileCheck";
import { FaExclamationCircle } from "react-icons/fa";

const BookTransport = () => {
  const navigate = useNavigate();
  const { isProfileComplete, user, loading } = useProfileCheck();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Address details
    pickupAddressId: "",
    pickupStreet: "",
    pickupCity: "",
    pickupState: "",
    pickupPincode: "",
    pickupLandmark: "",
    deliveryStreet: "",
    deliveryCity: "",
    deliveryState: "",
    deliveryPincode: "",
    deliveryLandmark: "",

    // Goods details
    goodsType: "household_small",
    items: {},
    additionalItems: "",

    // Vehicle details
    vehicleType: "",

    // Schedule details
    date: "",
    time: "",
    urgency: "standard",
    insurance: "none",
    specialInstructions: "",
  });

  const [errors, setErrors] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [distance, setDistance] = useState(null);

  // Set dynamic page title when component mounts
  useEffect(() => {
    // Update the document title
    document.title = "Book Transport | Request a Service | Shiftly - A Seamless Transport System";
    
    // Optional: Restore the original title when component unmounts
    return () => {
      document.title = "Shiftly | A Seamless Transport System";
    };
  }, []);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Show the modal if profile is not complete (after initial loading)
    if (!loading && !isProfileComplete) {
      setShowProfileModal(true);
    }
  }, [isProfileComplete, loading]);

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1: // Address Step
        if (!formData.pickupAddressId) {
          // If not using saved address
          if (!formData.pickupStreet) {
            newErrors.pickupStreet = "Address Line 1 is required for pickup";
          }
          if (!formData.pickupCity) {
            newErrors.pickupCity = "City is required for pickup";
          }
          if (!formData.pickupState) {
            newErrors.pickupState = "State is required for pickup";
          }
          if (!formData.pickupPincode) {
            newErrors.pickupPincode = "PIN Code is required for pickup";
          }
        }
        if (!formData.deliveryStreet) {
          newErrors.deliveryStreet = "Address Line 1 is required for delivery";
        }
        if (!formData.deliveryCity) {
          newErrors.deliveryCity = "City is required for delivery";
        }
        if (!formData.deliveryState) {
          newErrors.deliveryState = "State is required for delivery";
        }
        if (!formData.deliveryPincode) {
          newErrors.deliveryPincode = "PIN Code is required for delivery";
        }
        break;

      case 2: // Goods Step
        if (Object.keys(formData.items).length === 0) {
          newErrors.items = "Please select at least one item to transport";
        }
        break;

      case 3: // Vehicle Step
        if (!formData.vehicleType) {
          newErrors.vehicleType = "Please select a vehicle type";
        }
        break;

      case 4: // Schedule Step
        if (!formData.date) {
          newErrors.date = "Please select a pickup date";
        }
        if (!formData.time) {
          newErrors.time = "Please select a pickup time";
        }
        if (!formData.urgency) {
          newErrors.urgency = "Please select urgency level";
        }
        if (!formData.insurance) {
          newErrors.insurance = "Please select insurance coverage";
        }
        break;
    }

    return newErrors;
  };

  const calculateDistance = async () => {
    try {
      // Format pickup address
      let pickupAddress = "";
      if (formData.pickupAddressId && savedAddresses.length > 0) {
        const savedAddress = savedAddresses.find(
          (addr) => addr._id === formData.pickupAddressId
        );
        if (savedAddress) {
          // Format saved address with more specific location details
          pickupAddress = `${savedAddress.street}, ${savedAddress.city}, ${savedAddress.state}, ${savedAddress.pincode}, India`;
        }
      } else {
        // Format manual address with more specific location details
        pickupAddress = `${formData.pickupStreet}, ${formData.pickupCity}, ${formData.pickupState}, ${formData.pickupPincode}, India`;
      }

      // Format delivery address with more specific location details
      const deliveryAddress = `${formData.deliveryStreet}, ${formData.deliveryCity}, ${formData.deliveryState}, ${formData.deliveryPincode}, India`;

      // console.log("Searching addresses:", { pickupAddress, deliveryAddress });

      const API_KEY = import.meta.env.VITE_OPENROUTE_API;

      // Try city-level search first
      const [startCityResponse, endCityResponse] = await Promise.all([
        axios.get(
          `https://api.openrouteservice.org/geocode/search?api_key=${API_KEY}&text=${encodeURIComponent(
            `${formData.pickupCity}, ${formData.pickupState}, India`
          )}&size=1&boundary.country=IND`
        ),
        axios.get(
          `https://api.openrouteservice.org/geocode/search?api_key=${API_KEY}&text=${encodeURIComponent(
            `${formData.deliveryCity}, ${formData.deliveryState}, India`
          )}&size=1&boundary.country=IND`
        ),
      ]);

      // Log responses for debugging
      console.log("City-level Geocoding responses:", {
        pickup: startCityResponse.data,
        delivery: endCityResponse.data,
      });

      // Check if we got valid coordinates at city level
      if (
        !startCityResponse.data.features?.[0]?.geometry?.coordinates ||
        !endCityResponse.data.features?.[0]?.geometry?.coordinates
      ) {
        console.error("Could not find coordinates even at city level");
        return 50; // Default distance if no coordinates found
      }

      // Use the city-level coordinates
      const coords = {
        start: startCityResponse.data.features[0].geometry.coordinates,
        end: endCityResponse.data.features[0].geometry.coordinates,
      };

      // Get driving distance
      const response = await axios.post(
        "https://api.openrouteservice.org/v2/directions/driving-car",
        {
          coordinates: [coords.start, coords.end],
        },
        {
          headers: {
            Authorization: API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.data.routes?.[0]?.summary?.distance) {
        console.error("Invalid routing response", response.data);
        return 50; // Default distance
      }

      const calculatedDistance = Math.ceil(
        response.data.routes[0].summary.distance / 1000
      );
      console.log("Calculated distance:", calculatedDistance, "km");
      return calculatedDistance;
    } catch (error) {
      console.error("Error calculating distance:", error);
      return 50; // Default distance if calculation fails
    }
  };

  const handleNext = async () => {
    if (currentStep < 4) {
      // Move to next step without calculating distance
      setCurrentStep(currentStep + 1);
      setErrors({});
    } else {
      // On final submission (step 4), validate all steps
      const allErrors = {};
      let hasErrors = false;

      // Validate all steps
      for (let step = 1; step <= 4; step++) {
        const stepErrors = validateStep(step);
        if (Object.keys(stepErrors).length > 0) {
          hasErrors = true;
          Object.assign(allErrors, stepErrors);
        }
      }

      // Set all errors to be displayed
      setErrors(allErrors);

      if (!hasErrors) {
        try {
          // Calculate distance only when clicking "Book Now"
          const calculatedDistance = await calculateDistance();
          if (calculatedDistance) {
            setDistance(calculatedDistance);
            setShowConfirmation(true);
          } else {
            throw new Error("Could not calculate distance");
          }
        } catch (error) {
          console.error("Error calculating distance:", error);
          // Set a default distance if calculation fails
          setDistance(50);
          setShowConfirmation(true);
        }
      }
    }
  };

  // Format addresses for confirmation modal
  const getFormattedAddress = (prefix) => {
    if (prefix === "pickup" && formData.pickupAddressId) {
      const savedAddress = savedAddresses.find(
        (addr) => addr.id === formData.pickupAddressId
      );
      if (savedAddress) {
        return `${savedAddress.street}, 
                ${savedAddress.city}, 
                ${savedAddress.state} - 
                ${savedAddress.pincode}
                ${
                  savedAddress.landmark ? `, ${savedAddress.landmark}` : ""
                }`.trim();
      }
    }

    // For new addresses or delivery address
    return `${formData[`${prefix}Street`] || ""}, 
            ${formData[`${prefix}City`] || ""}, 
            ${formData[`${prefix}State`] || ""} - 
            ${formData[`${prefix}Pincode`] || ""}
            ${
              formData[`${prefix}Landmark`]
                ? `, ${formData[`${prefix}Landmark`]}`
                : ""
            }`.trim();
  };

  // Prepare booking details for confirmation modal
  const getBookingDetails = () => {
    return {
      ...formData,
      pickupAddress: getFormattedAddress("pickup"),
      deliveryAddress: getFormattedAddress("delivery"),
      distance: distance,
    };
  };

  const handleConfirmBooking = async () => {
    try {
      const bookingDetails = getBookingDetails();
      const priceDetails = calculateBookingPrice(bookingDetails);

      // Get pickup address details (either from saved address or form data)
      let pickupAddress;
      if (formData.pickupAddressId) {
        const savedAddress = savedAddresses.find(
          (addr) => addr.id === formData.pickupAddressId
        );
        pickupAddress = {
          street: savedAddress.street,
          city: savedAddress.city,
          state: savedAddress.state,
          pincode: savedAddress.pincode,
          landmark: savedAddress.landmark || "",
        };
      } else {
        pickupAddress = {
          street: formData.pickupStreet,
          city: formData.pickupCity,
          state: formData.pickupState,
          pincode: formData.pickupPincode,
          landmark: formData.pickupLandmark || "",
        };
      }

      // Convert items object to array format with all details
      const itemsArray = Object.entries(formData.items).map(([key, item]) => ({
        id: key,
        name: item.name,
        weight: Number(item.weight) || 0,
        quantity: Number(item.quantity) || 1,
        description: item.description || "",
      }));

      const bookingData = {
        pickup: pickupAddress,
        delivery: {
          street: formData.deliveryStreet,
          city: formData.deliveryCity,
          state: formData.deliveryState,
          pincode: formData.deliveryPincode,
          landmark: formData.deliveryLandmark || "",
        },
        goods: {
          type: formData.goodsType,
          items: itemsArray,
          additionalItems: formData.additionalItems || "", // Including additional items notes
        },
        vehicle: formData.vehicleType,
        schedule: {
          date: formData.date,
          time: formData.time,
          urgency: formData.urgency || "standard",
          insurance: formData.insurance || "none",
          specialInstructions: formData.specialInstructions || "",
        },
        distance: distance || 50,
        estimatedPrice: {
          min: priceDetails.lowerRange,
          max: priceDetails.upperRange,
        },
        // Additional metadata for tracking
        createdAt: new Date().toISOString(),
        status: "pending",
        totalWeight: Object.values(formData.items).reduce(
          (sum, item) =>
            sum + (Number(item.weight) || 0) * (Number(item.quantity) || 1),
          0
        ),
      };


      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/bookings/create`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create booking");
      }

      if (data.bookingId) {
        setBookingId(data.bookingId);
        setShowConfirmation(false);
        setShowSuccess(true);
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      alert(error.message || "Failed to create booking. Please try again.");
    }
  };

  // Navigate to profile page
  const goToProfile = () => {
    if (user && user.username) {
      navigate(`/user/${user.username}`);
    }
  };

  return (
    <div className="p-4 sm:p-6 mt-20 md:ml-20 lg:ml-24">

      {/* Profile Update */}
      {!loading && !isProfileComplete && !showProfileModal ? (
        <div className="max-w-6xl mx-auto mt-5">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaExclamationCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Profile Update Required</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>Please update your mobile number in your profile to book transport services.</p>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    // onClick={() => user && user.username && (window.location.href = `/user/${user.username}`)}
                    onClick={goToProfile}
                    className="ml-1 rounded-md bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none cursor-pointer hover:scale-110 transition-all duration-200 hover:shadow-lg hover:shadow-red-300"
                  >
                    Update Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
            Book Transport
          </h1>

          {/* Progress Steps */}
          <div className="bg-white rounded-xl shadow-lg p-4">
            <StepProgress
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
            />
          </div>

          {/* Step Content */}
          <div className="mt-6 bg-white rounded-xl shadow-lg">
            <div className="p-6">
              {currentStep === 1 && (
                <AddressStep
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                  savedAddresses={savedAddresses}
                  setSavedAddresses={setSavedAddresses}
                />
              )}
              {currentStep === 2 && (
                <GoodsStep
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                />
              )}
              {currentStep === 3 && (
                <VehicleStep
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                />
              )}
              {currentStep === 4 && (
                <ScheduleStep
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                />
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            {currentStep > 1 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200"
              >
                Previous
              </button>
            )}
            <button
              onClick={handleNext}
              className={`px-6 py-2 bg-red-500 text-white rounded-lg cursor-pointer hover:bg-red-600 ${
                currentStep === 1 ? "ml-auto" : ""
              }`}
            >
              {currentStep === 4 ? "Book Now" : "Next"}
            </button>
          </div>

          {/* Modals */}
          {showConfirmation && (
            <ConfirmationModal
              isOpen={showConfirmation}
              onClose={() => setShowConfirmation(false)}
              onConfirm={handleConfirmBooking}
              bookingDetails={getBookingDetails()}
            />
          )}
          {showSuccess && <BookingSuccess bookingId={bookingId} />}
        </div>
      )}

      {/* Profile Update Modal */}
      {!loading && user && (
        <ProfileUpdateModal 
          isOpen={showProfileModal} 
          onClose={() => setShowProfileModal(false)}
          username={user.username}
        />
      )}
    </div>
  );
};

export default BookTransport;
