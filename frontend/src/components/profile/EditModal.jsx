import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FaTimes } from "react-icons/fa";

const EditModal = ({ section, data, onClose, onSave }) => {
  const [formData, setFormData] = useState(() => {
    // Format date for the input if it exists
    if (data && data.dateOfBirth) {
      const date = new Date(data.dateOfBirth);
      return {
        ...data,
        dateOfBirth: date.toISOString().split("T")[0],
      };
    }
    return data || {};
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Prevent scrolling when modal is open
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (section === "personal") {
      if (formData.phone && !validatePhone(formData.phone)) {
        newErrors.phone = "Please enter a valid 10-digit phone number";
      }
      if (formData.alternatePhone && !validatePhone(formData.alternatePhone)) {
        newErrors.alternatePhone = "Please enter a valid 10-digit phone number";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Prepare the data for submission
    const submitData = { ...formData };

    // Convert empty strings to null/undefined
    Object.keys(submitData).forEach((key) => {
      if (submitData[key] === "") {
        submitData[key] = undefined;
      }
    });

    onSave(section, submitData);
  };

  const renderPersonalForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          type="text"
          value={formData.fullName || ""}
          onChange={(e) =>
            setFormData({ ...formData, fullName: e.target.value })
          }
          className="w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          value={formData.phone || ""}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "").slice(0, 10);
            setFormData({ ...formData, phone: value });
            if (value && !validatePhone(value)) {
              setErrors({
                ...errors,
                phone: "Please enter a valid 10-digit phone number",
              });
            } else {
              setErrors({ ...errors, phone: "" });
            }
          }}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500 ${
            errors.phone ? "border-red-500" : ""
          }`}
          placeholder="10-digit phone number"
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Alternate Phone Number
        </label>
        <input
          type="tel"
          value={formData.alternatePhone || ""}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "").slice(0, 10);
            setFormData({ ...formData, alternatePhone: value });
            if (value && !validatePhone(value)) {
              setErrors({
                ...errors,
                alternatePhone: "Please enter a valid 10-digit phone number",
              });
            } else {
              setErrors({ ...errors, alternatePhone: "" });
            }
          }}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500 ${
            errors.alternatePhone ? "border-red-500" : ""
          }`}
          placeholder="10-digit phone number (optional)"
        />
        {errors.alternatePhone && (
          <p className="text-red-500 text-sm mt-1">{errors.alternatePhone}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date of Birth
        </label>
        <input
          type="date"
          value={formData.dateOfBirth || ""}
          onChange={(e) =>
            setFormData({ ...formData, dateOfBirth: e.target.value })
          }
          className="w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Gender
        </label>
        <select
          value={formData.gender || ""}
          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
          <option value="prefer not to say">Prefer not to say</option>
        </select>
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
          Save Changes
        </button>
      </div>
    </form>
  );

  const renderAboutForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bio
        </label>
        <textarea
          value={formData.bio || ""}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
          rows="4"
          placeholder="Tell us about yourself..."
        />
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
          Save Changes
        </button>
      </div>
    </form>
  );

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {section === "personal" ? "Edit Personal Info" : "Edit Bio"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {section === "personal" ? renderPersonalForm() : renderAboutForm()}
      </div>
    </div>
  );
};

EditModal.propTypes = {
  section: PropTypes.string.isRequired,
  data: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditModal;
