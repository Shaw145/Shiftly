import { useState, useEffect } from "react";
import {
  FaTruck,
  FaIdCard,
  FaCalendarAlt,
  FaCheck,
  FaClock,
  FaFileAlt,
  FaUpload,
  FaPencilAlt,
  FaTimes,
  FaSave,
  FaRuler,
  FaGasPump,
  FaCar,
  FaTools,
  FaShieldAlt,
  FaImage,
} from "react-icons/fa";
import DocumentUploadCard from "./DocumentUploadCard";
import { toast } from "react-hot-toast";

const VehicleDetails = ({ data, onEdit, onUpdate }) => {
  const [localData, setLocalData] = useState({
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
      permitType: null,
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
  });

  useEffect(() => {
    if (data) {
      setLocalData((prev) => ({
        ...prev,
        ...data,
        basic: {
          ...prev.basic,
          ...data.basic,
        },
        registration: {
          ...prev.registration,
          ...data.registration,
        },
        specifications: {
          ...prev.specifications,
          ...data.specifications,
          dimensions: {
            ...prev.specifications.dimensions,
            ...data.specifications?.dimensions,
          },
          photos: {
            ...prev.specifications.photos,
            ...data.specifications?.photos,
          },
          features: [...(data.specifications?.features || [])],
        },
        insurance: {
          ...prev.insurance,
          ...data.insurance,
        },
        maintenance: {
          ...prev.maintenance,
          ...data.maintenance,
        },
      }));
    }
  }, [data]);

  const handleInputChange = (section, field, value) => {
    setLocalData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handlePhotoUpload = (view, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleInputChange("specifications", "photos", {
          ...localData.specifications.photos,
          [view]: e.target.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/driver/profile/vehicle`,
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
        throw new Error(result.error || "Failed to update vehicle details");
      }

      toast.success(result.message || "Vehicle details updated successfully");
      onUpdate(result.data);
      onEdit(false);
    } catch (error) {
      console.error("Error updating vehicle details:", error);
      toast.error(error.message || "Failed to update vehicle details");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Section Header */}
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-blue-700 text-transparent bg-clip-text">
            Vehicle Information
          </h2>
          {localData.registration.isVerified && (
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
        {/* Basic Vehicle Information */}
        <div className="border-b border-gray-100 pb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <FaCar className="text-red-500" />
            Basic Vehicle Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Vehicle Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Vehicle Type
              </label>
              <select
                value={localData.basic.type}
                onChange={(e) =>
                  handleInputChange("basic", "type", e.target.value)
                }
                disabled={!data.isEditing}
                className="w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50 cursor-pointer"
              >
                <option value="">Select Type</option>
                <option value="mini_truck">Mini Truck</option>
                <option value="tempo">Tempo</option>
                <option value="large_truck">Large Truck</option>
                <option value="container_truck">Container Truck</option>
              </select>
            </div>

            {/* Make */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Make</label>
              <input
                type="text"
                value={localData.basic.make}
                onChange={(e) =>
                  handleInputChange("basic", "make", e.target.value)
                }
                disabled={!data.isEditing}
                className="w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
                placeholder="Enter vehicle make"
              />
            </div>

            {/* Model */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Model</label>
              <input
                type="text"
                value={localData.basic.model}
                onChange={(e) =>
                  handleInputChange("basic", "model", e.target.value)
                }
                disabled={!data.isEditing}
                className="w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
                placeholder="Enter model"
              />
            </div>

            {/* Year & Color */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Year of Manufacture
              </label>
              <input
                type="number"
                value={localData.basic.year}
                onChange={(e) =>
                  handleInputChange("basic", "year", e.target.value)
                }
                disabled={!data.isEditing}
                className="w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
                placeholder="YYYY"
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Vehicle Color
              </label>
              <input
                type="text"
                value={localData.basic.color}
                onChange={(e) =>
                  handleInputChange("basic", "color", e.target.value)
                }
                disabled={!data.isEditing}
                className="w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
                placeholder="Enter color"
              />
            </div>
          </div>
        </div>

        {/* Registration Details */}
        <div className="border-b border-gray-100 pb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <FaIdCard className="text-red-500" />
            Registration Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Registration Number */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Registration Number
              </label>
              <input
                type="text"
                value={localData.registration.number}
                onChange={(e) =>
                  handleInputChange(
                    "registration",
                    "number",
                    e.target.value.toUpperCase()
                  )
                }
                disabled={!data.isEditing}
                className="w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-red-500 focus:border-transparent uppercase disabled:bg-gray-50"
                placeholder="Enter registration number"
              />
            </div>

            {/* Registration Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Registration Date
              </label>
              <input
                type="date"
                value={localData.registration.date}
                onChange={(e) =>
                  handleInputChange("registration", "date", e.target.value)
                }
                disabled={!data.isEditing}
                className="w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>

            {/* RC Book Upload */}
            <div className="col-span-full space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <FaIdCard className="text-red-500" />
                RC Book
              </h3>
              <div className="col-span-full">
                <DocumentUploadCard
                  title="RC(Both Sides)"
                  status={localData.registration.rcFrontStatus || "pending"}
                  file={localData.registration.rcFront}
                  onFileChange={(file) =>
                    handleInputChange("registration", "rcFront", file)
                  }
                  isEditing={data.isEditing}
                  hideNumber={true}
                  acceptedFileTypes=".pdf"
                  fileTypeLabel="Upload Document (PDF only)"
                />
              </div>
            </div>

            {/* Fitness Certificate */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Fitness Certificate Expiry
              </label>
              <input
                type="date"
                value={localData.registration.fitnessExpiryDate}
                onChange={(e) =>
                  handleInputChange(
                    "registration",
                    "fitnessExpiryDate",
                    e.target.value
                  )
                }
                disabled={!data.isEditing}
                className="w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50 cursor-pointer"
              />
            </div>

            {/* Permit Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Permit Type
              </label>
              <select
                value={localData.registration.permitType || ""}
                onChange={(e) =>
                  handleInputChange(
                    "registration",
                    "permitType",
                    e.target.value || null
                  )
                }
                disabled={!data.isEditing}
                className="w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50 cursor-pointer"
              >
                <option value="">Select Permit Type</option>
                <option value="national">National Permit</option>
                <option value="state">State Permit</option>
              </select>
            </div>
          </div>
        </div>

        {/* Capacity & Features Section */}
        <div className="border-b border-gray-100 pb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <FaRuler className="text-red-500" />
            Capacity & Features
          </h3>

          <div className="space-y-6">
            {/* Load Capacity & Dimensions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Load Capacity (kg)
                </label>
                <input
                  type="number"
                  value={localData.specifications.loadCapacity}
                  onChange={(e) =>
                    handleInputChange(
                      "specifications",
                      "loadCapacity",
                      e.target.value
                    )
                  }
                  disabled={!data.isEditing}
                  className="w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
                  placeholder="Enter capacity"
                />
              </div>

              {/* Dimensions */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Length (ft)
                </label>
                <input
                  type="number"
                  value={localData.specifications.dimensions.length}
                  onChange={(e) =>
                    handleInputChange("specifications", "dimensions", {
                      ...localData.specifications.dimensions,
                      length: e.target.value,
                    })
                  }
                  disabled={!data.isEditing}
                  className="w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
                  placeholder="Length"
                  step="0.1"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Width (ft)
                </label>
                <input
                  type="number"
                  value={localData.specifications.dimensions.width}
                  onChange={(e) =>
                    handleInputChange("specifications", "dimensions", {
                      ...localData.specifications.dimensions,
                      width: e.target.value,
                    })
                  }
                  disabled={!data.isEditing}
                  className="w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
                  placeholder="Width"
                  step="0.1"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Height (ft)
                </label>
                <input
                  type="number"
                  value={localData.specifications.dimensions.height}
                  onChange={(e) =>
                    handleInputChange("specifications", "dimensions", {
                      ...localData.specifications.dimensions,
                      height: e.target.value,
                    })
                  }
                  disabled={!data.isEditing}
                  className="w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
                  placeholder="Height"
                  step="0.1"
                />
              </div>
            </div>

            {/* Vehicle Photos */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FaImage className="text-red-500" />
                Vehicle Photos
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {[
                  { key: "front", label: "Front View" },
                  { key: "back", label: "Back View" },
                  { key: "left", label: "Left Side" },
                  { key: "right", label: "Right Side" },
                  { key: "interior", label: "Interior" },
                ].map(({ key, label }) => (
                  <div
                    key={key}
                    className="bg-white rounded-xl border-2 border-gray-100 p-4"
                  >
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {label}
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/jpg"
                          onChange={(e) =>
                            handlePhotoUpload(key, e.target.files[0])
                          }
                          disabled={!data.isEditing}
                          className="hidden"
                          id={`photo-${key}`}
                        />
                        {localData.specifications.photos[key] ? (
                          <div className="relative aspect-square rounded-lg overflow-hidden group">
                            <img
                              src={localData.specifications.photos[key]}
                              alt={label}
                              className="w-full h-full object-cover"
                            />
                            {data.isEditing && (
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <label
                                  htmlFor={`photo-${key}`}
                                  className="cursor-pointer text-white hover:text-red-400 transition-colors"
                                >
                                  <FaUpload className="text-2xl" />
                                </label>
                              </div>
                            )}
                          </div>
                        ) : (
                          <label
                            htmlFor={`photo-${key}`}
                            className={`aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${
                              data.isEditing
                                ? "border-red-300 hover:border-red-500 text-red-500 hover:bg-red-50"
                                : "border-gray-300 text-gray-400"
                            }`}
                          >
                            <FaUpload className="text-2xl" />
                            <span className="text-sm font-medium">
                              Upload Photo
                            </span>
                            <span className="text-xs text-gray-500">
                              JPG, JPEG or PNG
                            </span>
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Features & Fuel Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Special Features
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "Refrigerated",
                    "Hydraulic",
                    "GPS Tracking",
                    "Container",
                    "Box Body",
                    "High Deck",
                  ].map((feature) => (
                    <label
                      key={feature}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        checked={localData.specifications.features.includes(
                          feature
                        )}
                        onChange={(e) => {
                          const features = e.target.checked
                            ? [...localData.specifications.features, feature]
                            : localData.specifications.features.filter(
                                (f) => f !== feature
                              );
                          handleInputChange(
                            "specifications",
                            "features",
                            features
                          );
                        }}
                        disabled={!data.isEditing}
                        className="rounded text-red-500 focus:ring-red-500 cursor-pointer"
                      />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Fuel Type
                </label>
                <select
                  value={localData.specifications.fuelType}
                  onChange={(e) =>
                    handleInputChange(
                      "specifications",
                      "fuelType",
                      e.target.value
                    )
                  }
                  disabled={!data.isEditing}
                  className="w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50 cursor-pointer"
                >
                  <option value="">Select Fuel Type</option>
                  <option value="diesel">Diesel</option>
                  <option value="petrol">Petrol</option>
                  <option value="cng">CNG</option>
                  <option value="electric">Electric</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Insurance Section */}
        <div className="border-b border-gray-100 pb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <FaShieldAlt className="text-red-500" />
            Insurance Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Insurance Provider
              </label>
              <input
                type="text"
                value={localData.insurance.provider}
                onChange={(e) =>
                  handleInputChange("insurance", "provider", e.target.value)
                }
                disabled={!data.isEditing}
                className="w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
                placeholder="Enter provider name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Policy Number
              </label>
              <input
                type="text"
                value={localData.insurance.policyNumber}
                onChange={(e) =>
                  handleInputChange("insurance", "policyNumber", e.target.value)
                }
                disabled={!data.isEditing}
                className="w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
                placeholder="Enter policy number"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Expiry Date
              </label>
              <input
                type="date"
                value={localData.insurance.expiryDate}
                onChange={(e) =>
                  handleInputChange("insurance", "expiryDate", e.target.value)
                }
                disabled={!data.isEditing}
                className="w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>

            {/* Insurance Document Upload */}
            <div className="col-span-full">
              <DocumentUploadCard
                title="Insurance Document"
                status={localData.insurance.documentStatus || "pending"}
                file={localData.insurance.document}
                onFileChange={(file) =>
                  handleInputChange("insurance", "document", file)
                }
                isEditing={data.isEditing}
                hideNumber={true}
                acceptedFileTypes=".pdf"
                fileTypeLabel="Upload Document (PDF only)"
              />
            </div>
          </div>
        </div>

        {/* Maintenance Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <FaTools className="text-red-500" />
            Maintenance Records
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Last Service Date
              </label>
              <input
                type="date"
                value={localData.maintenance.lastServiceDate}
                onChange={(e) =>
                  handleInputChange(
                    "maintenance",
                    "lastServiceDate",
                    e.target.value
                  )
                }
                disabled={!data.isEditing}
                className="w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50 cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Next Service Due
              </label>
              <input
                type="date"
                value={localData.maintenance.nextServiceDue}
                onChange={(e) =>
                  handleInputChange(
                    "maintenance",
                    "nextServiceDue",
                    e.target.value
                  )
                }
                disabled={!data.isEditing}
                className="w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50 cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Odometer Reading (km)
              </label>
              <input
                type="number"
                value={localData.maintenance.odometer}
                onChange={(e) =>
                  handleInputChange("maintenance", "odometer", e.target.value)
                }
                disabled={!data.isEditing}
                className="w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
                placeholder="Enter reading"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Vehicle Health Score
              </label>
              <div
                className={`w-full h-12 rounded-xl border-2 flex items-center justify-center font-medium ${
                  localData.maintenance.healthScore >= 80
                    ? "bg-green-50 text-green-700 border-green-200"
                    : localData.maintenance.healthScore >= 50
                    ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                {localData.maintenance.healthScore}%
              </div>
            </div>
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

export default VehicleDetails;
