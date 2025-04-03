import { useState, useEffect } from "react";
import { FaCalendarAlt, FaClock, FaInfoCircle } from "react-icons/fa";

const ScheduleStep = ({ formData, setFormData, errors }) => {
  const [isNearDate, setIsNearDate] = useState(false);

  // Get today and next 3 days dates
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  // Check if selected date is within next 3 days
  useEffect(() => {
    if (!formData.date) return;

    const selectedDate = new Date(formData.date);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(today.getDate() + 2);

    const threeDaysFromNow = new Date(today);
    threeDaysFromNow.setDate(today.getDate() + 3);

    // Reset the time part for accurate date comparison
    selectedDate.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    dayAfterTomorrow.setHours(0, 0, 0, 0);
    threeDaysFromNow.setHours(0, 0, 0, 0);

    // Check which date range the selected date falls into
    if (selectedDate.getTime() === tomorrow.getTime()) {
      // If tomorrow is selected
      setIsNearDate(true);
      setFormData({ ...formData, urgency: "priority" });
    } else if (
      selectedDate.getTime() >= dayAfterTomorrow.getTime() &&
      selectedDate.getTime() <= threeDaysFromNow.getTime()
    ) {
      // If day after tomorrow or third day is selected
      setIsNearDate(true);
      setFormData({ ...formData, urgency: "express" });
    } else {
      // If date is after 3 days
      setIsNearDate(false);
      setFormData({ ...formData, urgency: "standard" });
    }
  }, [formData.date]);

  // Validate selected date is not today
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    const todayStr = new Date().toISOString().split("T")[0];

    if (selectedDate === todayStr) {
      setFormData({ ...formData, date: "" });
      alert("Cannot book for today. Please select a future date.");
      return;
    }

    setFormData({ ...formData, date: selectedDate });
  };

  // Minimum time if date is today
  const getMinTime = () => {
    if (formData.date === today) {
      const now = new Date();
      const hours = String(now.getHours() + 2).padStart(2, "0"); // Add 2 hours buffer
      const minutes = String(now.getMinutes()).padStart(2, "0");
      return `${hours}:${minutes}`;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Date and Time Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pickup Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
            <input
              type="date"
              name="date"
              value={formData.date}
              min={minDate}
              onChange={handleDateChange}
              className={`pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 ${
                errors.date ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
          </div>
          {errors.date && (
            <p className="text-red-500 text-sm mt-1">{errors.date}</p>
          )}

          {/* Date selection message */}
          <div className="mt-2 text-sm text-gray-600 flex items-start">
            <FaInfoCircle className="text-blue-500 mr-2 mt-1" />
            <p>
              {formData.date &&
              new Date(formData.date).getTime() ===
                new Date(tomorrow.toISOString().split("T")[0]).getTime()
                ? "For next-day delivery, priority service is automatically selected"
                : formData.date &&
                  new Date(formData.date) <=
                    new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000)
                ? "For delivery within 2-3 days, express service is automatically selected"
                : "Booking 3+ days in advance ensures better pricing and driver availability"}
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Time <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <FaClock className="absolute left-3 top-3 text-gray-400" />
            <input
              type="time"
              name="time"
              value={formData.time}
              min={getMinTime()}
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
              className={`pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 ${
                errors.time ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
          </div>
          {errors.time && (
            <p className="text-red-500 text-sm mt-1">{errors.time}</p>
          )}
        </div>
      </div>

      {/* Urgency Level */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Urgency Level</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label
            className={`block p-4 border rounded-lg cursor-pointer transition-colors
            ${
              formData.urgency === "standard"
                ? "border-red-500 bg-red-50"
                : "border-gray-200"
            }
            ${isNearDate ? "opacity-50 cursor-not-allowed" : ""}
            hover:border-red-200`}
          >
            <input
              type="radio"
              name="urgency"
              value="standard"
              checked={formData.urgency === "standard"}
              onChange={(e) =>
                setFormData({ ...formData, urgency: e.target.value })
              }
              disabled={isNearDate}
              className="mr-2"
            />
            <span className="font-medium">Standard Delivery</span>
            <p className="text-sm text-gray-600 mt-1">No extra charge</p>
          </label>

          <label
            className={`block p-4 border rounded-lg cursor-pointer transition-colors
            ${
              formData.urgency === "express"
                ? "border-red-500 bg-red-50"
                : "border-gray-200"
            }
            ${
              formData.urgency === "priority"
                ? "opacity-50 cursor-not-allowed"
                : ""
            }
            hover:border-red-200`}
          >
            <input
              type="radio"
              name="urgency"
              value="express"
              checked={formData.urgency === "express"}
              onChange={(e) =>
                setFormData({ ...formData, urgency: e.target.value })
              }
              disabled={formData.urgency === "priority"}
              className="mr-2"
            />
            <span className="font-medium">Express Delivery</span>
            <p className="text-sm text-gray-600 mt-1">+10% additional charge</p>
          </label>

          <label
            className={`block p-4 border rounded-lg cursor-pointer transition-colors
            ${
              formData.urgency === "priority"
                ? "border-red-500 bg-red-50"
                : "border-gray-200"
            }
            ${
              formData.urgency !== "priority"
                ? "opacity-50 cursor-not-allowed"
                : ""
            }
            hover:border-red-200`}
          >
            <input
              type="radio"
              name="urgency"
              value="priority"
              checked={formData.urgency === "priority"}
              onChange={(e) =>
                setFormData({ ...formData, urgency: e.target.value })
              }
              disabled={formData.urgency !== "priority"}
              className="mr-2"
            />
            <span className="font-medium">Priority Delivery</span>
            <p className="text-sm text-gray-600 mt-1">+20% additional charge</p>
          </label>
        </div>
        {errors.urgency && (
          <p className="text-red-500 text-sm mt-1">{errors.urgency}</p>
        )}

        {/* Warning message for Priority Delivery */}
        {formData.urgency === "priority" && (
          <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
            <div className="flex items-start">
              <FaInfoCircle className="text-yellow-400 mt-1 flex-shrink-0" />
              <div className="ml-3">
                <h4 className="text-sm font-medium text-yellow-800">
                  Important Notice About Priority Delivery
                </h4>
                <p className="mt-1 text-sm text-yellow-700">
                  For priority deliveries, our system will automatically assign
                  the most suitable driver to ensure immediate pickup and
                  fastest delivery. The bidding option will not be available,
                  and the price will be calculated based on our priority rates.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Warning message for Express Delivery */}
        {formData.urgency === "express" && (
          <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
            <div className="flex items-start">
              <FaInfoCircle className="text-yellow-400 mt-1 flex-shrink-0" />
              <div className="ml-3">
                <h4 className="text-sm font-medium text-yellow-800">
                  Important Notice About Express Delivery
                </h4>
                <p className="mt-1 text-sm text-yellow-700">
                  For express deliveries, our system will prioritize your
                  booking to ensure faster service. However, the bidding option
                  will not be available, and the price will be calculated based
                  on our express rates.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Insurance Coverage */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Insurance Coverage</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label
            className={`block p-4 border rounded-lg cursor-pointer transition-colors
            ${
              formData.insurance === "none"
                ? "border-red-500 bg-red-50"
                : "border-gray-200"
            }
            hover:border-red-200`}
          >
            <input
              type="radio"
              name="insurance"
              value="none"
              checked={formData.insurance === "none"}
              onChange={(e) =>
                setFormData({ ...formData, insurance: e.target.value })
              }
              className="mr-2"
            />
            <span className="font-medium">No Insurance</span>
            <p className="text-sm text-gray-600 mt-1">
              Transport at your own risk
            </p>
          </label>

          <label
            className={`block p-4 border rounded-lg cursor-pointer transition-colors
            ${
              formData.insurance === "basic"
                ? "border-red-500 bg-red-50"
                : "border-gray-200"
            }
            hover:border-red-200`}
          >
            <input
              type="radio"
              name="insurance"
              value="basic"
              checked={formData.insurance === "basic"}
              onChange={(e) =>
                setFormData({ ...formData, insurance: e.target.value })
              }
              className="mr-2"
            />
            <span className="font-medium">Basic Coverage</span>
            <p className="text-sm text-gray-600 mt-1">
              Covers minor damage, up to ₹10,000
            </p>
          </label>

          <label
            className={`block p-4 border rounded-lg cursor-pointer transition-colors
            ${
              formData.insurance === "full"
                ? "border-red-500 bg-red-50"
                : "border-gray-200"
            }
            hover:border-red-200`}
          >
            <input
              type="radio"
              name="insurance"
              value="full"
              checked={formData.insurance === "full"}
              onChange={(e) =>
                setFormData({ ...formData, insurance: e.target.value })
              }
              className="mr-2"
            />
            <span className="font-medium">Full Coverage</span>
            <p className="text-sm text-gray-600 mt-1">
              Covers all damages, up to ₹50,000
            </p>
          </label>
        </div>
        {errors.insurance && (
          <p className="text-red-500 text-sm mt-1">{errors.insurance}</p>
        )}
      </div>

      {/* Special Instructions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Special Instructions (Optional)
        </label>
        <textarea
          name="specialInstructions"
          value={formData.specialInstructions}
          onChange={(e) =>
            setFormData({ ...formData, specialInstructions: e.target.value })
          }
          className="w-full p-2 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-red-500"
          placeholder="Any special handling instructions or additional details..."
        />
      </div>

      {/* Show all validation errors */}
      {Object.keys(errors).length > 0 && (
        <div className="mt-6 bg-red-50 p-4 rounded-lg">
          <h4 className="font-medium text-red-800 mb-2">
            Please fix the following errors:
          </h4>
          <div className="space-y-1">
            {/* Address Errors */}
            {errors.pickupStreet && (
              <p className="text-red-600 text-sm">
                • Pickup Address: Address Line 1 is required
              </p>
            )}
            {errors.pickupPincode && (
              <p className="text-red-600 text-sm">
                • Pickup Address: PIN Code is required
              </p>
            )}
            {errors.pickupCity && (
              <p className="text-red-600 text-sm">
                • Pickup Address: City is required
              </p>
            )}
            {errors.pickupState && (
              <p className="text-red-600 text-sm">
                • Pickup Address: State is required
              </p>
            )}
            {/* Delivery Address Errors */}
            {errors.deliveryStreet && (
              <p className="text-red-600 text-sm">
                • Delivery Address: Address Line 1 is required
              </p>
            )}
            {errors.deliveryPincode && (
              <p className="text-red-600 text-sm">
                • Delivery Address: PIN Code is required
              </p>
            )}
            {errors.deliveryCity && (
              <p className="text-red-600 text-sm">
                • Delivery Address: City is required
              </p>
            )}
            {errors.deliveryState && (
              <p className="text-red-600 text-sm">
                • Delivery Address: State is required
              </p>
            )}
            {/* Goods Errors */}
            {errors.items && (
              <p className="text-red-600 text-sm">• {errors.items}</p>
            )}
            {/* Schedule Errors */}
            {errors.date && (
              <p className="text-red-600 text-sm">• {errors.date}</p>
            )}
            {errors.time && (
              <p className="text-red-600 text-sm">• {errors.time}</p>
            )}
            {errors.urgency && (
              <p className="text-red-600 text-sm">• {errors.urgency}</p>
            )}
            {errors.insurance && (
              <p className="text-red-600 text-sm">• {errors.insurance}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleStep;
