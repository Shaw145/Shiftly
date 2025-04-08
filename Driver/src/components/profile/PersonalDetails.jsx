import { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCheck,
  FaPencilAlt,
  FaTimes,
  FaIdCard,
  FaTint,
  FaUserPlus,
  FaSave,
  FaMapPin,
  FaCopy,
  FaUpload,
  FaExclamationTriangle,
  FaShieldAlt,
} from "react-icons/fa";
import DocumentUploadCard from "./DocumentUploadCard";

const PersonalDetails = ({ data, onEdit, onUpdate }) => {
  const [localData, setLocalData] = useState(data);

  const handleInputChange = (section, field, value) => {
    setLocalData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/driver/profile/personal`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("driverToken")}`,
          },
          body: JSON.stringify(localData),
        }
      );

      if (response.ok) {
        onUpdate(localData);
        onEdit(false);
      }
    } catch (error) {
      console.error("Error updating personal details:", error);
    }
  };

  const handleDocumentChange = (section, field, value) => {
    setLocalData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [section]: {
          ...prev.documents[section],
          [field]: value,
        },
      },
    }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Section Header */}
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-blue-700 text-transparent bg-clip-text">
          Personal Information
        </h2>
        <button
          onClick={() => onEdit(!data.isEditing)}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 cursor-pointer ${
            data.isEditing
              ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
              : "bg-red-50 text-red-600 hover:bg-red-100"
          }`}
        >
          {data.isEditing ? (
            <>
              <FaTimes /> Cancel
            </>
          ) : (
            <>
              <FaPencilAlt /> Edit Details
            </>
          )}
        </button>
      </div>

      <div className="p-6 space-y-8">
        {/* Basic Information Section */}
        <div className="border-b border-gray-100 pb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <FaUser className="text-red-500" />
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* First Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                value={localData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                disabled={!data.isEditing}
                className="w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50 cursor-pointer"
                placeholder="First Name"
              />
            </div>

            {/* Middle Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Middle Name
              </label>
              <input
                type="text"
                value={localData.middleName}
                onChange={(e) =>
                  handleInputChange("middleName", e.target.value)
                }
                disabled={!data.isEditing}
                className="w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50 cursor-pointer"
                placeholder="Middle Name (Optional)"
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                value={localData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                disabled={!data.isEditing}
                className="w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50 cursor-pointer"
                placeholder="Last Name"
              />
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                type="date"
                value={localData.dateOfBirth}
                onChange={(e) =>
                  handleInputChange("dateOfBirth", e.target.value)
                }
                disabled={!data.isEditing}
                className="w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50 cursor-pointer"
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                value={localData.gender}
                onChange={(e) => handleInputChange("gender", e.target.value)}
                disabled={!data.isEditing}
                className="w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50 cursor-pointer"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contact Details Section */}
        <div className="border-b border-gray-100 pb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <FaPhone className="text-red-500" />
            Contact Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mobile Number */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaPhone className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  value={localData.contact.mobile}
                  disabled
                  className="w-full pl-12 pr-12 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                {localData.contact.isMobileVerified && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <FaCheck className="text-green-500" />
                  </div>
                )}
              </div>
            </div>

            {/* Alternate Mobile */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Alternate Mobile
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaPhone className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  value={localData.contact.alternateMobile}
                  onChange={(e) =>
                    handleInputChange(
                      "contact",
                      "alternateMobile",
                      e.target.value
                    )
                  }
                  disabled={!data.isEditing}
                  className="w-full pl-12 py-3 rounded-xl border-2 focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Enter alternate mobile number"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  value={localData.contact.email}
                  disabled
                  className="w-full pl-12 pr-12 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                {localData.contact.isEmailVerified && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <FaCheck className="text-green-500" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="border-b border-gray-100 pb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <FaMapMarkerAlt className="text-red-500" />
            Address Information
          </h3>

          {/* Current Address */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border-2 border-gray-100 p-6">
              <h4 className="text-sm font-semibold text-gray-800 mb-4">
                Current Address
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-full">
                  <input
                    type="text"
                    value={localData.address.current.addressLine1}
                    onChange={(e) =>
                      handleInputChange("address", "current", {
                        ...localData.address.current,
                        addressLine1: e.target.value,
                      })
                    }
                    disabled={!data.isEditing}
                    className="w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
                    placeholder="Address Line 1"
                  />
                </div>
                <div className="col-span-full">
                  <input
                    type="text"
                    value={localData.address.current.addressLine2}
                    onChange={(e) =>
                      handleInputChange("address", "current", {
                        ...localData.address.current,
                        addressLine2: e.target.value,
                      })
                    }
                    disabled={!data.isEditing}
                    className="w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
                    placeholder="Address Line 2"
                  />
                </div>
                <input
                  type="text"
                  value={localData.address.current.pincode}
                  onChange={(e) =>
                    handleInputChange("address", "current", {
                      ...localData.address.current,
                      pincode: e.target.value,
                    })
                  }
                  disabled={!data.isEditing}
                  className="w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
                  placeholder="Pincode"
                />
                <input
                  type="text"
                  value={localData.address.current.state}
                  onChange={(e) =>
                    handleInputChange("address", "current", {
                      ...localData.address.current,
                      state: e.target.value,
                    })
                  }
                  disabled={!data.isEditing}
                  className="w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
                  placeholder="State"
                />
                <input
                  type="text"
                  value={localData.address.current.city}
                  onChange={(e) =>
                    handleInputChange("address", "current", {
                      ...localData.address.current,
                      city: e.target.value,
                    })
                  }
                  disabled={!data.isEditing}
                  className="w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
                  placeholder="City/District"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Documents Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <FaIdCard className="text-red-500" />
            Documents
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Driving License */}
            <DocumentUploadCard
              title="Driving License"
              number={localData.documents.drivingLicense.number}
              status={localData.documents.drivingLicense.status}
              file={localData.documents.drivingLicense.file}
              onNumberChange={(value) =>
                handleDocumentChange("drivingLicense", "number", value)
              }
              onFileChange={(file) =>
                handleDocumentChange("drivingLicense", "file", file)
              }
              isEditing={data.isEditing}
            />

            {/* Aadhaar Card */}
            <DocumentUploadCard
              title="Aadhaar Card"
              number={localData.documents.aadhaar.number}
              status={localData.documents.aadhaar.status}
              file={localData.documents.aadhaar.file}
              onNumberChange={(value) =>
                handleDocumentChange("aadhaar", "number", value)
              }
              onFileChange={(file) =>
                handleDocumentChange("aadhaar", "file", file)
              }
              isEditing={data.isEditing}
            />

            {/* PAN Card */}
            <DocumentUploadCard
              title="PAN Card"
              number={localData.documents.panCard.number}
              status={localData.documents.panCard.status}
              file={localData.documents.panCard.file}
              onNumberChange={(value) =>
                handleDocumentChange("panCard", "number", value)
              }
              onFileChange={(file) =>
                handleDocumentChange("panCard", "file", file)
              }
              isEditing={data.isEditing}
            />
          </div>
        </div>

        {/* Save Button */}
        {data.isEditing && (
          <div className="sticky bottom-6 flex justify-end mt-8">
            <button
              onClick={handleSave}
              className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 flex items-center gap-2 font-medium shadow-lg cursor-pointer"
            >
              <FaSave className="text-lg" /> Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalDetails;
