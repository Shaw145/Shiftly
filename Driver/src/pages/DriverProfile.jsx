import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import {
  PersonalDetails,
  BankDetails,
  VehicleDetails,
} from "../components/profile";
import TabNavigation from "../components/profile/TabNavigation";
import {
  FaCamera,
  FaCheck,
  FaUser,
  FaExclamationTriangle,
} from "react-icons/fa";

const DriverProfile = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    profileImage: "",
    isVerified: false,
    totalTrips: 0,
    rating: "0.0",
    joinedDate: "",
    personalDetails: {
      firstName: "",
      middleName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      bloodGroup: "",
      isEditing: false,
      contact: {
        mobile: "",
        alternateMobile: "",
        email: "",
        isMobileVerified: false,
        isEmailVerified: false,
        emergency: {
          name: "",
          relation: "",
          phone: "",
        },
      },
      address: {
        current: {
          street: "",
          city: "",
          state: "",
          pincode: "",
          country: "",
          coordinates: { lat: null, lng: null },
        },
        permanent: {
          sameAsCurrent: false,
          street: "",
          city: "",
          state: "",
          pincode: "",
          country: "",
        },
      },
      documents: {
        drivingLicense: {
          number: "",
          file: null,
          status: "pending",
          isVerified: false,
        },
        aadhaar: {
          number: "",
          file: null,
          status: "pending",
          isVerified: false,
        },
        panCard: {
          number: "",
          file: null,
          status: "pending",
          isVerified: false,
        },
      },
    },

    bankDetails: {
      isEditing: false,
      accountHolder: "",
      accountNumber: "",
      confirmAccountNumber: "",
      bankName: "",
      ifscCode: "",
      branchDetails: "",
      accountType: "",
      payoutFrequency: "",
      isVerified: false,
      documents: {
        passbook: {
          image: "",
          isVerified: false,
        },
      },
    },

    vehicleDetails: {
      isEditing: false,
      basic: {
        type: "",
        make: "",
        model: "",
        year: "",
        color: "",
      },
      registration: {
        number: "",
        date: "",
        rcFront: "",
        rcBack: "",
        fitnessExpiryDate: "",
        permitType: "",
        isVerified: false,
      },
      specifications: {
        loadCapacity: "",
        dimensions: {
          length: "",
          width: "",
          height: "",
        },
        photos: {
          front: "",
          back: "",
          left: "",
          right: "",
          interior: "",
        },
        features: [],
        fuelType: "",
      },
      insurance: {
        provider: "",
        policyNumber: "",
        expiryDate: "",
        document: "",
        isVerified: false,
      },
      maintenance: {
        lastServiceDate: "",
        nextServiceDue: "",
        odometer: "",
        healthScore: 0,
      },
    },
  });

  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/driver/me/profile`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("driverToken")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }
        const data = await response.json();

        setFormData((prev) => ({
          ...prev,
          ...data,
          totalTrips: data.totalTrips || 0,
          rating: data.rating || "4.5",
          joinedDate: data.joinedDate || new Date().toISOString(),
          personalDetails: {
            ...prev.personalDetails,
            ...data.personalDetails,
            firstName: data.fullName?.split(" ")[0] || "",
            lastName: data.fullName?.split(" ").slice(1).join(" ") || "",
          },
        }));
      } catch (error) {
        console.error("Error fetching driver data:", error);
      }
    };

    fetchDriverData();
  }, []);

  const handleSectionEdit = (section, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        isEditing: value,
      },
    }));
  };

  const handleProfilePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Handle file upload logic here
      console.log("File to upload:", file);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header with Photo */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            <div className="h-40 bg-gradient-to-r from-red-800 to-blue-900"></div>
            <div className="px-6 pb-6">
              <div className="flex flex-col items-center -mt-24">
                <div className="relative">
                  <div className="w-36 h-36 md:w-44 md:h-44 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
                    {formData.profileImage ? (
                      <img
                        src={formData.profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <FaUser className="text-5xl md:text-6xl text-gray-400" />
                      </div>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 cursor-pointer group">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfilePhotoUpload}
                    />
                    <div className="bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition-all duration-300 transform group-hover:scale-110">
                      <FaCamera className="text-lg" />
                    </div>
                  </label>
                </div>
                <div className="mt-4 text-center">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {formData.fullName
                      ? formData.fullName
                          .split(" ")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() +
                              word.slice(1).toLowerCase()
                          )
                          .join(" ")
                      : "Driver Name"}
                  </h1>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <span className="text-gray-600 text-lg font-semibold">
                      @{formData.username || "username"}
                    </span>
                    {formData.isVerified && (
                      <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <FaCheck className="text-green-500" /> Verified
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap justify-center gap-4">
                  <div className="bg-blue-50 px-4 py-2 rounded-xl text-center">
                    <p className="text-sm text-blue-600">Total Trips</p>
                    <p className="text-xl font-semibold text-blue-700">
                      {formData.totalTrips || 0}
                    </p>
                  </div>
                  <div className="bg-green-50 px-4 py-2 rounded-xl text-center">
                    <p className="text-sm text-green-600">Rating</p>
                    <p className="text-xl font-semibold text-green-700">
                      {formData.rating || "4.5"}
                    </p>
                  </div>
                  <div className="bg-purple-50 px-4 py-2 rounded-xl text-center">
                    <p className="text-sm text-purple-600">Member Since</p>
                    <p className="text-xl font-semibold text-purple-700">
                      {new Date(
                        formData.joinedDate || Date.now()
                      ).getFullYear()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Profile Sections */}
          <div className="mt-8 space-y-8">
            {activeTab === "personal" && (
              <PersonalDetails
                data={formData.personalDetails}
                onEdit={(value) => handleSectionEdit("personalDetails", value)}
                onUpdate={(updatedData) => {
                  setFormData((prev) => ({
                    ...prev,
                    personalDetails: updatedData,
                  }));
                }}
              />
            )}

            {activeTab === "bank" && (
              <BankDetails
                data={formData.bankDetails}
                onEdit={(value) => handleSectionEdit("bankDetails", value)}
                onUpdate={(updatedData) => {
                  setFormData((prev) => ({
                    ...prev,
                    bankDetails: updatedData,
                  }));
                }}
              />
            )}

            {activeTab === "vehicle" && (
              <VehicleDetails
                data={formData.vehicleDetails}
                onEdit={(value) => handleSectionEdit("vehicleDetails", value)}
                onUpdate={(updatedData) => {
                  setFormData((prev) => ({
                    ...prev,
                    vehicleDetails: updatedData,
                  }));
                }}
              />
            )}
          </div>

          {/* Document verification message */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-sm text-yellow-700 flex items-start gap-2">
              <FaExclamationTriangle className="text-yellow-500 mt-0.5" />
              <span>
                Please ensure all necessary documents are uploaded and verified.
                Your profile completion and verification status depends on the
                submission of valid documents.
              </span>
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DriverProfile;
