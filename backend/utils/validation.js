/**
 * Utility functions for validating data in the application
 */

/**
 * Validates if the bid amount is within acceptable range based on the booking price
 * @param {Number} bidAmount - The amount of the bid
 * @param {Object|Number} bookingPrice - The booking price object (can be a direct number or an object with min/max)
 * @returns {Object} - Object containing isValid boolean and message string
 */
const validateBidAmount = (bidAmount, bookingPrice) => {
  // Convert bid amount to number if it's a string
  const amount = Number(bidAmount);

  // Check if bid amount is a valid positive number
  if (isNaN(amount) || amount <= 0) {
    return {
      isValid: false,
      message: "Bid amount must be a positive number",
    };
  }

  // Handle case where bookingPrice is a direct number
  if (typeof bookingPrice === "number") {
    // Allow bids that are at most 15% lower than the booking price
    const minAllowed = bookingPrice * 0.85;

    if (amount < minAllowed) {
      return {
        isValid: false,
        message: `Bid amount (₹${amount}) is too low. Minimum allowed is ₹${minAllowed.toFixed(
          2
        )} (85% of booking price)`,
      };
    }

    // For direct price, we generally don't need to check for too high bids
    return {
      isValid: true,
      message: "Bid amount is valid",
    };
  }

  // Handle case where bookingPrice is an object with min/max
  if (bookingPrice && typeof bookingPrice === "object") {
    const minPrice = bookingPrice.min || 0;
    const maxPrice = bookingPrice.max;

    // Check if bid is below minimum price
    if (minPrice && amount < minPrice) {
      return {
        isValid: false,
        message: `Bid amount (₹${amount}) is below the minimum estimated price (₹${minPrice})`,
      };
    }

    // Check if bid is too much higher than maximum price (allowing up to 15% higher)
    if (maxPrice && amount > maxPrice * 1.15) {
      return {
        isValid: false,
        message: `Bid amount (₹${amount}) is too high. Maximum allowed is ₹${(
          maxPrice * 1.15
        ).toFixed(2)} (15% above maximum estimated price)`,
      };
    }
  }

  // Default to valid if no specific validation rules matched
  return {
    isValid: true,
    message: "Bid amount is valid",
  };
};

/**
 * Validates a phone number format
 * @param {String} phone - The phone number to validate
 * @returns {Boolean} - True if valid, false otherwise
 */
const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

/**
 * Validates an email address format
 * @param {String} email - The email to validate
 * @returns {Boolean} - True if valid, false otherwise
 */
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

module.exports = {
  validateBidAmount,
  validatePhone,
  validateEmail,
};
