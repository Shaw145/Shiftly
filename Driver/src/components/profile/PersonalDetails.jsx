import { useState, useEffect } from "react";
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
  FaChevronDown,
} from "react-icons/fa";
import DocumentUploadCard from "./DocumentUploadCard";
import { toast } from "react-hot-toast";
import { indianStates } from "../../utils/indianStates";

const PersonalDetails = ({ data, onEdit, onUpdate }) => {
  const [localData, setLocalData] = useState({
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
      drivingLicense: {
        number: "",
        file: null,
        status: "pending",
      },
      aadhaar: {
        number: "",
        file: null,
        status: "pending",
      },
      panCard: {
        number: "",
        file: null,
        status: "pending",
      },
    },
  });

  const [alternatePhoneError, setAlternatePhoneError] = useState("");

  useEffect(() => {
    if (data) {
      setLocalData((prev) => ({
        ...prev,
        firstName: data.firstName || "",
        middleName: data.middleName || "",
        lastName: data.lastName || "",
        dateOfBirth: data.dateOfBirth || "",
        gender: data.gender || "",
        contact: {
          ...prev.contact,
          ...data.contact,
        },
        address: {
          current: {
            ...prev.address.current,
            ...data.address?.current,
          },
        },
        documents: {
          ...prev.documents,
          ...data.documents,
        },
      }));
    }
  }, [data]);

  useEffect(() => {
    // Disable autofill on page load
    const inputs = document.querySelectorAll("input, select");
    inputs.forEach((input) => {
      input.setAttribute("autoComplete", "new-password");
    });
  }, []);

  const validateMobileNumber = (number) => {
    const pattern = /^[6-9]\d{9}$/;
    return number ? pattern.test(number) : true; // Return true if empty (optional field)
  };

  const handleInputChange = (field, value, secondValue) => {
    if (field === "contact" && value === "alternateMobile") {
      if (value && !validateMobileNumber(value)) {
        setAlternatePhoneError("Please enter a valid 10-digit mobile number");
      } else {
        setAlternatePhoneError("");
      }
    }

    setLocalData((prev) => {
      // For basic fields
      if (
        field === "firstName" ||
        field === "middleName" ||
        field === "lastName"
      ) {
        return {
          ...prev,
          [field]: value || "",
        };
      }

      // For address field
      if (field === "address") {
        return {
          ...prev,
          address: {
            ...prev.address,
            current: {
              ...prev.address?.current,
              [value]: secondValue,
            },
          },
        };
      }

      // For nested fields (like contact.email)
      if (field.includes(".")) {
        const [parent, child] = field.split(".");
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value,
          },
        };
      }

      // For first-level fields
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const handleSave = async () => {
    if (alternatePhoneError) {
      toast.error("Please fix the alternate mobile number");
      return;
    }
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

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update profile");
      }

      toast.success(result.message || "Personal details updated successfully");
      onUpdate({
        ...result.data,
        fullName: [
          localData.firstName,
          localData.middleName,
          localData.lastName,
        ]
          .filter(Boolean)
          .join(" "),
      });
      onEdit(false);
    } catch (error) {
      console.error("Error updating personal details:", error);
      toast.error(error.message || "Failed to update profile");
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

  const fetchAddressFromPincode = async (pincode) => {
    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = await response.json();

      if (data[0].Status === "Success") {
        const postOffice = data[0].PostOffice[0];
        setLocalData((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            current: {
              ...prev.address.current,
              city: postOffice.District,
              state: postOffice.State,
            },
          },
        }));
        return true;
      } else {
        toast.error("Invalid PIN Code. Please enter a valid PIN Code.");
        return false;
      }
    } catch (error) {
      console.error("Error fetching PIN Code data:", error);
      toast.error("Error fetching PIN Code data. Please try again.");
      return false;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Hidden form to prevent browser autofill */}
      <form style={{ display: "none" }} aria-hidden="true">
        <input type="text" id="prevent-autofill-1" />
        <input type="email" id="prevent-autofill-2" />
        <input type="password" id="prevent-autofill-3" />
      </form>

      {/* Section Header */}
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-blue-700 text-transparent bg-clip-text">
          Personal Information
        </h2>
        <div className="flex items-center gap-2">
          {data.isEditing && (
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 cursor-pointer bg-red-600 text-white hover:bg-red-700"
            >
              <FaSave /> Save
            </button>
          )}
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
                value={localData.firstName || ""}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                disabled={!data.isEditing}
                className="w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
                placeholder="First Name"
                autoComplete="off"
              />
            </div>

            {/* Middle Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Middle Name
              </label>
              <input
                type="text"
                value={localData.middleName || ""}
                onChange={(e) =>
                  handleInputChange("middleName", e.target.value)
                }
                disabled={!data.isEditing}
                className="w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
                placeholder="Middle Name (Optional)"
                autoComplete="off"
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                value={localData.lastName || ""}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                disabled={!data.isEditing}
                className="w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
                placeholder="Last Name"
                autoComplete="off"
              />
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                type="date"
                value={localData.dateOfBirth || ""}
                onChange={(e) =>
                  handleInputChange("dateOfBirth", e.target.value)
                }
                disabled={!data.isEditing}
                className="w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
                autoComplete="off"
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
                className="w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
                autoComplete="off"
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
                  autoComplete="off"
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
                  value={localData.contact.alternateMobile || ""}
                  onKeyPress={(e) => {
                    // Allow only numbers
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    // Limit to 10 digits and only numbers
                    const value = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10);
                    handleInputChange("contact.alternateMobile", value);

                    // Validate only if there's a value and length is less than 10
                    if (value && value.length < 10) {
                      setAlternatePhoneError(
                        "Please enter a valid 10-digit mobile number"
                      );
                    } else {
                      setAlternatePhoneError("");
                    }
                  }}
                  disabled={!data.isEditing}
                  className={`w-full pl-12 py-3 rounded-xl border-2 focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 ${
                    alternatePhoneError ? "border-red-500" : ""
                  }`}
                  placeholder="Enter alternate mobile number"
                  autoComplete="off"
                  maxLength={10}
                />
              </div>
              {alternatePhoneError && (
                <p className="text-sm text-red-600 mt-1">
                  {alternatePhoneError}
                </p>
              )}
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
                  autoComplete="off"
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
                    value={localData.address?.current?.addressLine1 || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "address",
                        "addressLine1",
                        e.target.value
                      )
                    }
                    disabled={!data.isEditing}
                    className="w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
                    placeholder="Address Line 1"
                    autoComplete="off"
                  />
                </div>
                <div className="col-span-full">
                  <input
                    type="text"
                    value={localData.address?.current?.addressLine2 || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "address",
                        "addressLine2",
                        e.target.value
                      )
                    }
                    disabled={!data.isEditing}
                    className="w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
                    placeholder="Address Line 2"
                    autoComplete="off"
                  />
                </div>
                <div className="col-span-full">
                  <input
                    type="text"
                    value={localData.address?.current?.pincode || ""}
                    onChange={(e) => {
                      const pincode = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6);
                      handleInputChange("address", "pincode", pincode);
                      if (pincode.length === 6) {
                        fetchAddressFromPincode(pincode);
                      }
                    }}
                    disabled={!data.isEditing}
                    className="w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
                    placeholder="Pincode"
                    autoComplete="off"
                  />
                </div>
                <div className="col-span-full">
                  <input
                    type="text"
                    value={localData.address?.current?.city || ""}
                    onChange={(e) =>
                      handleInputChange("address", "city", e.target.value)
                    }
                    disabled={!data.isEditing}
                    className="w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
                    placeholder="City/District"
                    autoComplete="off"
                  />
                </div>
                <div className="col-span-full">
                  <div className="relative">
                    <select
                      value={localData.address?.current?.state || ""}
                      onChange={(e) =>
                        handleInputChange("address", "state", e.target.value)
                      }
                      disabled={!data.isEditing}
                      className="w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50 appearance-none"
                      autoComplete="off"
                      style={{ scrollbarWidth: "none" }} // Hide scrollbar
                    >
                      <option value="">Select State</option>
                      {indianStates.map((state) => (
                        <option key={state.code} value={state.name}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <FaChevronDown className="text-gray-400 text-sm" />
                    </div>
                  </div>
                </div>
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
