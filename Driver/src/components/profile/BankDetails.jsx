import { useState, useEffect } from "react";
import {
  FaUser,
  FaUniversity,
  FaIdCard,
  FaCheck,
  FaShieldAlt,
  FaPencilAlt,
  FaTimes,
  FaSave,
  FaEye,
  FaEyeSlash,
  FaUpload,
  FaFileAlt,
} from "react-icons/fa";
import DocumentUploadCard from "./DocumentUploadCard";

const BankDetails = ({ data, onEdit, onUpdate }) => {
  const [localData, setLocalData] = useState({
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
    ...data,
  });
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [showConfirmNumber, setShowConfirmNumber] = useState(false);

  useEffect(() => {
    if (data) {
      setLocalData((prev) => ({
        ...prev,
        ...data,
        documents: {
          ...prev.documents,
          ...data.documents,
        },
      }));
    }
  }, [data]);

  const handleInputChange = (field, value) => {
    setLocalData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/driver/profile/bank`,
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
      console.error("Error updating bank details:", error);
    }
  };

  const maskAccountNumber = (number) => {
    if (!number) return "";
    const last4 = number.slice(-4);
    return `XXXX-XXXX-${last4}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Section Header */}
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-blue-700 text-transparent bg-clip-text">
            Bank Information
          </h2>
          {localData?.isVerified && (
            <span className="px-3 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-full flex items-center gap-1">
              <FaShieldAlt className="text-green-500" /> Verified
            </span>
          )}
        </div>
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
        {/* Account Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account Holder Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Account Holder Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input
                type="text"
                value={localData.accountHolder}
                onChange={(e) =>
                  handleInputChange("accountHolder", e.target.value)
                }
                disabled={!data.isEditing}
                className="w-full pl-12 py-3 rounded-xl border-2 focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
                placeholder="Enter account holder name"
              />
            </div>
          </div>

          {/* Bank Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Bank Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaUniversity className="text-gray-400" />
              </div>
              <input
                type="text"
                value={localData.bankName}
                onChange={(e) => handleInputChange("bankName", e.target.value)}
                disabled={!data.isEditing}
                className="w-full pl-12 py-3 rounded-xl border-2 focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50 cursor-pointer"
                placeholder="Bank Name"
              />
            </div>
          </div>

          {/* IFSC Code */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              IFSC Code
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaUniversity className="text-gray-400" />
              </div>
              <input
                type="text"
                value={localData.ifscCode}
                onChange={(e) =>
                  handleInputChange("ifscCode", e.target.value.toUpperCase())
                }
                disabled={!data.isEditing}
                className="w-full pl-12 py-3 rounded-xl border-2 focus:ring-2 focus:ring-red-500 focus:border-transparent uppercase disabled:bg-gray-50"
                placeholder="Enter IFSC code"
              />
            </div>
            {localData.branchDetails && (
              <p className="text-sm text-gray-600 mt-1">
                {localData.branchDetails}
              </p>
            )}
          </div>

          {/* Account Number */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Account Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaIdCard className="text-gray-400" />
              </div>
              <input
                type={showAccountNumber ? "text" : "password"}
                value={localData.accountNumber}
                onChange={(e) =>
                  handleInputChange("accountNumber", e.target.value)
                }
                disabled={!data.isEditing}
                className="w-full pl-12 pr-12 py-3 rounded-xl border-2 focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
                placeholder="Enter account number"
              />
              <button
                type="button"
                onClick={() => setShowAccountNumber(!showAccountNumber)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showAccountNumber ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Confirm Account Number */}
          {data.isEditing && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Confirm Account Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaIdCard className="text-gray-400" />
                </div>
                <input
                  type={showConfirmNumber ? "text" : "password"}
                  value={localData.confirmAccountNumber}
                  onChange={(e) =>
                    handleInputChange("confirmAccountNumber", e.target.value)
                  }
                  className="w-full pl-12 pr-12 py-3 rounded-xl border-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Confirm account number"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmNumber(!showConfirmNumber)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showConfirmNumber ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          )}

          {/* Payout Frequency */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Payout Frequency
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaUniversity className="text-gray-400" />
              </div>
              <select
                value={localData.payoutFrequency}
                onChange={(e) =>
                  handleInputChange("payoutFrequency", e.target.value)
                }
                disabled={!data.isEditing}
                className="w-full pl-12 py-3 rounded-xl border-2 focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
              >
                <option value="monthly">Monthly</option>
                <option value="per_delivery">Per Delivery</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bank Documents */}
        <div className="border-t border-gray-100 pt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Bank Documents
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DocumentUploadCard
              title="Bank Passbook First Page"
              status={localData.documents.passbook.status || "pending"}
              file={localData.documents.passbook.file}
              onFileChange={(file) =>
                handleInputChange("documents.passbook.file", file)
              }
              isEditing={data.isEditing}
              hideNumber={true}
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
              <FaSave /> Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BankDetails;
