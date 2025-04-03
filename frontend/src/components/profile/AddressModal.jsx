import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  FaTimes,
  FaMapMarkerAlt,
  FaCity,
  FaHome,
  FaChevronDown,
} from "react-icons/fa";
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
      <label className="block text-sm font-medium text-gray-700 mb-1">
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

InputField.propTypes = {
  icon: PropTypes.node,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  type: PropTypes.string,
  maxLength: PropTypes.number,
  pattern: PropTypes.string,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
};

const AddressModal = ({ address, onClose, onSave }) => {
  const [formData, setFormData] = useState(
    address || {
      type: "home",
      street: "",
      addressLine2: "",
      landmark: "",
      city: "",
      state: "",
      pincode: "",
      isDefault: false,
    }
  );
  const [errors, setErrors] = useState({});
  const [pincodeError, setPincodeError] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.street) {
      newErrors.street = "Street address is required";
    }
    if (!formData.city) {
      newErrors.city = "City is required";
    }
    if (!formData.state) {
      newErrors.state = "State is required";
    }
    if (!formData.pincode) {
      newErrors.pincode = "PIN Code is required";
    } else if (formData.pincode.length !== 6) {
      newErrors.pincode = "PIN Code must be 6 digits";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
  };

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
          state: postOffice.State,
          city: postOffice.District,
        }));
      } else {
        setPincodeError("Invalid PIN Code. Please enter a valid PIN Code.");
        setFormData((prev) => ({
          ...prev,
          state: "",
          city: "",
        }));
      }
    } catch (error) {
      setPincodeError("Error fetching PIN Code data. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {address ? "Edit Address" : "Add New Address"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address Type
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500 cursor-pointer"
            >
              <option value="home">Home</option>
              <option value="work">Work</option>
              <option value="other">Other</option>
            </select>
          </div>

          <InputField
            icon={<FaHome />}
            label="Address Line 1"
            name="street"
            value={formData.street}
            onChange={(e) =>
              setFormData({ ...formData, street: e.target.value })
            }
            error={errors.street}
            required
            placeholder="House/Flat No., Building Name, Street"
          />

          <InputField
            label="Address Line 2"
            name="addressLine2"
            value={formData.addressLine2 || ""}
            onChange={(e) =>
              setFormData({ ...formData, addressLine2: e.target.value })
            }
            placeholder="Area, Colony (Optional)"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              label="PIN Code"
              name="pincode"
              value={formData.pincode}
              onChange={(e) => {
                const pincode = e.target.value.replace(/\D/g, "");
                setFormData({ ...formData, pincode });
                if (pincode.length === 6) {
                  fetchAddressFromPincode(pincode);
                }
              }}
              error={errors.pincode || pincodeError}
              maxLength={6}
              pattern="\d*"
              required
              placeholder="6-digit PIN Code"
            />

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                  className={`w-full p-2.5 pr-10 border rounded-lg appearance-none cursor-pointer focus:ring-2 focus:ring-red-500 ${
                    errors.state ? "border-red-500" : "border-gray-300"
                  }`}
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
              {errors.state && (
                <p className="text-red-500 text-sm mt-1">{errors.state}</p>
              )}
            </div>

            <InputField
              icon={<FaCity />}
              label="City/District"
              name="city"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              error={errors.city}
              required
              placeholder="Enter city/district"
            />
          </div>

          <InputField
            icon={<FaMapMarkerAlt />}
            label="Landmark"
            name="landmark"
            value={formData.landmark || ""}
            onChange={(e) =>
              setFormData({ ...formData, landmark: e.target.value })
            }
            placeholder="Nearby landmark for easy location (Optional)"
          />

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isDefault"
              checked={formData.isDefault}
              onChange={(e) =>
                setFormData({ ...formData, isDefault: e.target.checked })
              }
              className="h-4 w-4 text-red-500 focus:ring-red-500 border-gray-300 rounded cursor-pointer"
            />
            <label
              htmlFor="isDefault"
              className="ml-2 text-sm text-gray-700 cursor-pointer"
            >
              Set as default address
            </label>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer"
            >
              {address ? "Save Changes" : "Add Address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddressModal.propTypes = {
  address: PropTypes.shape({
    type: PropTypes.string,
    street: PropTypes.string,
    addressLine2: PropTypes.string,
    landmark: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    pincode: PropTypes.string,
    isDefault: PropTypes.bool,
  }),
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default AddressModal;
