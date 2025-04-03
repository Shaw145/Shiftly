import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaCity, FaHome, FaChevronDown } from "react-icons/fa";
import { indianStates } from "../../utils/indianStates";

const InputField = ({
  icon,
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  maxLength,
  pattern,
  required,
  placeholder,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-3 text-gray-400">{icon}</span>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          pattern={pattern}
          placeholder={placeholder}
          required={required}
          className={`w-full p-2.5 ${
            icon ? "pl-10" : ""
          } border rounded-lg focus:ring-2 focus:ring-red-500 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

const AddressFields = ({ prefix, formData, setFormData, errors }) => {
  const [pincodeError, setPincodeError] = useState("");

  const fetchAddressFromPincode = async (pincode) => {
    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = await response.json();

      if (data[0].Status === "Success") {
        setPincodeError("");
        const postOffice = data[0].PostOffice[0];
        setFormData((prev) => ({
          ...prev,
          [`${prefix}State`]: postOffice.State,
          [`${prefix}City`]: postOffice.District,
        }));
      } else {
        setPincodeError("Invalid PIN Code. Please enter a valid PIN Code.");
        setFormData((prev) => ({
          ...prev,
          [`${prefix}State`]: "",
          [`${prefix}City`]: "",
        }));
      }
    } catch (error) {
      setPincodeError("Error fetching PIN Code data. Please try again.");
    }
  };

  return (
    <div className="space-y-4">
      {/* Address Line 1 */}
      <InputField
        icon={<FaHome />}
        label="Address Line 1"
        name={`${prefix}Street`}
        value={formData[`${prefix}Street`] || ""}
        onChange={(e) =>
          setFormData({
            ...formData,
            [`${prefix}Street`]: e.target.value,
          })
        }
        error={errors[`${prefix}Street`]}
        required
        placeholder="House/Flat No., Building Name, Street"
      />

      {/* Address Line 2 */}
      <InputField
        label="Address Line 2"
        name={`${prefix}AddressLine2`}
        value={formData[`${prefix}AddressLine2`] || ""}
        onChange={(e) =>
          setFormData({
            ...formData,
            [`${prefix}AddressLine2`]: e.target.value,
          })
        }
        placeholder="Area, Colony (Optional)"
      />

      {/* PIN Code, State, City Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField
          label="PIN Code"
          name={`${prefix}Pincode`}
          value={formData[`${prefix}Pincode`] || ""}
          onChange={(e) => {
            const pincode = e.target.value.replace(/\D/g, "");
            setFormData({ ...formData, [`${prefix}Pincode`]: pincode });
            if (pincode.length === 6) {
              fetchAddressFromPincode(pincode);
            }
          }}
          error={errors[`${prefix}Pincode`] || pincodeError}
          maxLength={6}
          pattern="\d*"
          required
          placeholder="6-digit PIN Code"
        />

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              name={`${prefix}State`}
              value={formData[`${prefix}State`] || ""}
              onChange={(e) =>
                setFormData({ ...formData, [`${prefix}State`]: e.target.value })
              }
              className={`
                w-full p-2.5 pr-10 border rounded-lg appearance-none 
                focus:ring-2 focus:ring-red-500 bg-white
              `}
              required
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
          {errors[`${prefix}State`] && (
            <p className="text-red-500 text-sm mt-1">
              {errors[`${prefix}State`]}
            </p>
          )}
        </div>

        <InputField
          icon={<FaCity />}
          label="City/District"
          name={`${prefix}City`}
          value={formData[`${prefix}City`] || ""}
          onChange={(e) =>
            setFormData({ ...formData, [`${prefix}City`]: e.target.value })
          }
          error={errors[`${prefix}City`]}
          required
          placeholder="Enter city/district"
        />
      </div>

      {/* Landmark */}
      <InputField
        icon={<FaMapMarkerAlt />}
        label="Landmark"
        name={`${prefix}Landmark`}
        value={formData[`${prefix}Landmark`] || ""}
        onChange={(e) =>
          setFormData({ ...formData, [`${prefix}Landmark`]: e.target.value })
        }
        placeholder="Nearby landmark for easy location (Optional)"
      />
    </div>
  );
};

const AddressStep = ({
  formData,
  setFormData,
  errors,
  savedAddresses,
  setSavedAddresses,
}) => {
  const [useNewPickupAddress, setUseNewPickupAddress] = useState(true);
  const [addressError, setAddressError] = useState("");

  useEffect(() => {
    fetchSavedAddresses();
  }, []);

  const fetchSavedAddresses = async () => {
    try {
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");

      if (!token || !username) {
        setAddressError("User not authenticated");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/${username}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (
        data.success &&
        data.user.addresses &&
        data.user.addresses.length > 0
      ) {
        setSavedAddresses(
          data.user.addresses.map((addr) => ({
            ...addr,
            id: addr._id || Math.random().toString(36).substr(2, 9),
          }))
        );

        const defaultAddress = data.user.addresses.find(
          (addr) => addr.isDefault
        );
        if (defaultAddress) {
          handleSavedAddressSelect({
            ...defaultAddress,
            id: defaultAddress._id || Math.random().toString(36).substr(2, 9),
          });
        }
      } else {
        setAddressError("No saved addresses found. Please add a new address.");
        setSavedAddresses([]);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      setAddressError("Failed to load saved addresses");
      setSavedAddresses([]);
    }
  };

  const handleSavedAddressSelect = (address) => {
    setFormData({
      ...formData,
      pickupAddressId: address.id,
      pickupStreet: address.street,
      pickupAddressLine2: address.addressLine2 || "",
      pickupCity: address.city,
      pickupState: address.state,
      pickupPincode: address.pincode,
      pickupLandmark: address.landmark || "",
    });
    setUseNewPickupAddress(false);
  };

  const clearPickupAddress = () => {
    setFormData({
      ...formData,
      pickupAddressId: "",
      pickupStreet: "",
      pickupCity: "",
      pickupState: "",
      pickupPincode: "",
      pickupLandmark: "",
      pickupAddressLine2: "",
    });
  };

  return (
    <div className="space-y-6">
      {/* Pickup Address */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Pickup Address</h3>

        {/* Saved Addresses */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Saved Addresses
          </h4>
          {addressError ? (
            <div className="text-red-500 text-sm mb-4 p-3 bg-red-50 rounded-lg">
              {addressError}
            </div>
          ) : (
            <div className="flex flex-wrap gap-3 mb-4">
              {savedAddresses.map((address) => (
                <button
                  key={address.id}
                  onClick={() => handleSavedAddressSelect(address)}
                  className={`flex flex-col px-4 py-2 rounded-lg border cursor-pointer ${
                    formData.pickupAddressId === address.id
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                >
                  <span className="font-medium capitalize">{address.type}</span>
                  <span className="text-sm text-gray-500">
                    {address.street}, {address.city}
                  </span>
                </button>
              ))}
              <button
                onClick={() => {
                  setUseNewPickupAddress(true);
                  clearPickupAddress();
                }}
                className={`px-4 py-2 rounded-lg border cursor-pointer ${
                  useNewPickupAddress
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
              >
                New Address
              </button>
            </div>
          )}
        </div>

        {useNewPickupAddress && (
          <AddressFields
            prefix="pickup"
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        )}

        {errors.pickupAddress && (
          <p className="text-red-500 text-sm mt-2">{errors.pickupAddress}</p>
        )}
      </div>

      {/* Delivery Address */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Delivery Address</h3>
        <AddressFields
          prefix="delivery"
          formData={formData}
          setFormData={setFormData}
          errors={errors}
        />
        {errors.deliveryAddress && (
          <p className="text-red-500 text-sm mt-2">{errors.deliveryAddress}</p>
        )}
      </div>
    </div>
  );
};

export default AddressStep;
