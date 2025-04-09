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
import { toast } from "react-hot-toast";

const BankDetails = ({ data, onEdit, onUpdate }) => {
  const [localData, setLocalData] = useState({
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
  });
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [showConfirmNumber, setShowConfirmNumber] = useState(false);
  const [accountError, setAccountError] = useState("");

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

    // Validate confirm account number
    if (field === "confirmAccountNumber") {
      if (value !== localData.accountNumber) {
        setAccountError("Account numbers do not match");
      } else {
        setAccountError("");
      }
    }
    if (field === "accountNumber") {
      if (
        localData.confirmAccountNumber &&
        value !== localData.confirmAccountNumber
      ) {
        setAccountError("Account numbers do not match");
      } else if (
        localData.confirmAccountNumber &&
        value === localData.confirmAccountNumber
      ) {
        setAccountError("");
      }
    }
  };

  const handleSave = async () => {
    if (accountError) {
      toast.error("Please fix the account number mismatch");
      return;
    }
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

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update bank details");
      }

      toast.success(result.message || "Bank details updated successfully");
      onUpdate(result.data);
      onEdit(false);
    } catch (error) {
      console.error("Error updating bank details:", error);
      toast.error(error.message || "Failed to update bank details");
    }
  };

  // const maskAccountNumber = (number) => {
  //   if (!number) return "";
  //   const last4 = number.slice(-4);
  //   return `XXXX-XXXX-${last4}`;
  // };

  // Add this function to fetch bank details from IFSC code
  const fetchBankDetailsFromIFSC = async (ifsc) => {
    try {
      // Only proceed with valid IFSC code format
      const ifscPattern = /^[A-Z]{4}0[A-Z0-9]{6}$/;
      if (!ifscPattern.test(ifsc)) {
        return;
      }

      const response = await fetch(`https://ifsc.razorpay.com/${ifsc}`);
      if (!response.ok) {
        return;
      }

      const data = await response.json();

      // Update the bank name and branch details
      setLocalData((prev) => ({
        ...prev,
        bankName: data.BANK || prev.bankName,
        branchDetails: data.BRANCH
          ? `${data.BRANCH}, ${data.CITY}, ${data.STATE}`
          : prev.branchDetails,
      }));

      // Don't show a toast here since it will be distracting during typing
    } catch (error) {
      console.error("Error fetching bank details:", error);
      // Silently fail
    }
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
                className="w-full pl-12 py-3 rounded-xl border-2 focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
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
                onChange={(e) => {
                  const value = e.target.value.toUpperCase();
                  handleInputChange("ifscCode", value);

                  // If the IFSC code is 11 characters long, fetch bank details immediately
                  if (value.length === 11) {
                    fetchBankDetailsFromIFSC(value);
                  }
                }}
                disabled={!data.isEditing}
                className="w-full pl-12 py-3 rounded-xl border-2 focus:ring-2 focus:ring-red-500 focus:border-transparent uppercase disabled:bg-gray-50"
                placeholder="Enter IFSC code"
                autoComplete="off"
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
              {accountError && (
                <p className="text-sm text-red-600 mt-1">{accountError}</p>
              )}
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
