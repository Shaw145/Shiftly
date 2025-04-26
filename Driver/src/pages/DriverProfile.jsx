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
  FaSpinner,
} from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";
import ImageViewModal from "../components/profile/ImageViewModal";
import { useProfile } from "../context/ProfileContext";

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
      contact: {
        mobile: "",
        alternateMobile: "",
        email: "",
        isMobileVerified: false,
        isEmailVerified: false,
      },
      address: {
        current: {
          addressLine1: "",
          addressLine2: "",
          city: "",
          state: "",
          pincode: "",
        },
      },
      documents: {
        drivingLicense: { number: "", file: null, status: "pending" },
        aadhaar: { number: "", file: null, status: "pending" },
        panCard: { number: "", file: null, status: "pending" },
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
      payoutFrequency: "monthly",
      isVerified: false,
      documents: {
        passbook: {
          file: null,
          status: "pending",
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
        rcFront: null,
        rcBack: null,
        rcFrontStatus: "pending",
        rcBackStatus: "pending",
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
        document: null,
        documentStatus: "pending",
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

  const [showWarningModal, setShowWarningModal] = useState(false);
  const [pendingTabChange, setPendingTabChange] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const { updateProfileImage } = useProfile();

  // Set dynamic page title when component mounts
  useEffect(() => {
    // Update the document title
    document.title = "Driver Profile | Manage Your Account | Shiftly - A Seamless Transport System";
    
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

        // Update profile image in context when profile is loaded
        if (data.profileImage) {
          updateProfileImage(data.profileImage);
        }

        setFormData((prev) => ({
          ...prev,
          ...data,
          fullName: data.fullName,
          personalDetails: {
            ...prev.personalDetails,
            ...data.personalDetails,
            firstName: data.personalDetails?.firstName || "",
            middleName: data.personalDetails?.middleName || "",
            lastName: data.personalDetails?.lastName || "",
            contact: {
              ...prev.personalDetails.contact,
              ...data.personalDetails?.contact,
              mobile: data.phone || "",
              email: data.email || "",
              isMobileVerified: data.isPhoneVerified || false,
              isEmailVerified: data.isEmailVerified || false,
            },
          },
          bankDetails: {
            ...prev.bankDetails,
            ...data.bankDetails,
          },
          vehicleDetails: {
            ...prev.vehicleDetails,
            ...data.vehicleDetails,
          },
        }));
      } catch (error) {
        console.error("Error fetching driver data:", error);
        toast.error("Failed to load profile data");
      }
    };

    fetchDriverData();
  }, [updateProfileImage]);

  const handleSectionEdit = (section, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        isEditing: value,
      },
    }));
  };

  const handleProfilePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Show loading state
    setIsUploadingImage(true);

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/driver/upload-photo`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("driverToken")}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success && data.driver) {
        // Update profile image in state
        setFormData((prev) => ({
          ...prev,
          profileImage: data.driver.profileImage,
        }));

        // Update the profile image in the context so it updates everywhere
        updateProfileImage(data.driver.profileImage);

        toast.success("Profile photo updated successfully");
      } else {
        throw new Error(data.error || "Failed to upload image");
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      toast.error("Failed to upload image");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveProfilePhoto = async () => {
    try {
      setIsUploadingImage(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/driver/remove-photo`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("driverToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success && data.driver) {
        // Update profile image in state
        setFormData((prev) => ({
          ...prev,
          profileImage: "",
        }));

        // Update the profile image in the context to empty
        updateProfileImage("");

        toast.success("Profile photo removed successfully");
      } else {
        throw new Error(data.error || "Failed to remove image");
      }
    } catch (err) {
      console.error("Error removing image:", err);
      toast.error("Failed to remove image");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleTabChange = (newTab) => {
    // Check if any section is in editing mode
    const isEditing = formData[`${activeTab}Details`]?.isEditing;

    if (isEditing) {
      setShowWarningModal(true);
      setPendingTabChange(newTab);
    } else {
      setActiveTab(newTab);
    }
  };

  const handleModalConfirm = () => {
    // Reset the editing section data
    setFormData((prev) => ({
      ...prev,
      [`${activeTab}Details`]: {
        ...prev[`${activeTab}Details`],
        isEditing: false,
      },
    }));
    setActiveTab(pendingTabChange);
    setShowWarningModal(false);
  };

  const handleModalCancel = () => {
    setShowWarningModal(false);
    setPendingTabChange(null);
  };

  const openImageModal = () => {
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
  };

  useEffect(() => {
    if (showWarningModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showWarningModal]);

  return (
    <DashboardLayout>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#333",
            color: "#fff",
            padding: "16px",
            borderRadius: "10px",
          },
          success: {
            style: {
              background: "#22c55e",
            },
            iconTheme: {
              primary: "white",
              secondary: "#22c55e",
            },
          },
          error: {
            style: {
              background: "#ef4444",
            },
            iconTheme: {
              primary: "white",
              secondary: "#ef4444",
            },
          },
        }}
      />
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
                      <div
                        className="relative group cursor-pointer"
                        onClick={openImageModal}
                      >
                        <img
                          src={formData.profileImage}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                          View Photo
                        </div>
                      </div>
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
                      disabled={isUploadingImage}
                    />
                    <div className="bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition-all duration-300 transform group-hover:scale-110">
                      {isUploadingImage ? (
                        <FaSpinner className="text-lg animate-spin" />
                      ) : (
                        <FaCamera className="text-lg" />
                      )}
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
                      {formData.rating || "0.0"}
                    </p>
                  </div>
                  <div className="bg-purple-50 px-4 py-2 rounded-xl text-center">
                    <p className="text-sm text-purple-600">Member Since</p>
                    <p className="text-xl font-semibold text-purple-700">
                      {formData.joinedDate
                        ? new Date(formData.joinedDate).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                            }
                          )
                        : new Date().getFullYear()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <TabNavigation activeTab={activeTab} setActiveTab={handleTabChange} />

          {/* Warning Modal */}
          {showWarningModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <style jsx>{`
                body {
                  overflow: hidden;
                }
              `}</style>
              <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 no-scroll">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Unsaved Changes
                </h3>
                <p className="text-gray-600 mb-6">
                  You have unsaved changes. If you leave this tab, your changes
                  will be lost. Do you want to proceed?
                </p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={handleModalCancel}
                    className="px-4 py-2 bg-gray-100 text-gray-600 hover:text-gray-800 cursor-pointer hover:bg-gray-300 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleModalConfirm}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer"
                  >
                    Leave Without Saving
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Profile Sections */}
          <div className="mt-8 space-y-8">
            {activeTab === "personal" && (
              <PersonalDetails
                data={formData.personalDetails}
                onEdit={(value) => handleSectionEdit("personalDetails", value)}
                onUpdate={(updatedData) => {
                  setFormData((prev) => ({
                    ...prev,
                    fullName: updatedData.fullName,
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
      {showImageModal && formData.profileImage && (
        <ImageViewModal
          image={formData.profileImage}
          fullName={formData.fullName}
          onClose={closeImageModal}
          onDelete={handleRemoveProfilePhoto}
          onUpload={handleProfilePhotoUpload}
        />
      )}
    </DashboardLayout>
  );
};

export default DriverProfile;
