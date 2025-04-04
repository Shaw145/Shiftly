const client = require("../config/twilio");

const formatPhoneNumber = (phone) => {
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, "");

  // Add India country code (+91) if not present
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }

  // If number already has country code
  if (cleaned.length === 12 && cleaned.startsWith("91")) {
    return `+${cleaned}`;
  }

  throw new Error("Invalid phone number format");
};

const sendSMS = async (phone, message) => {
  try {
    const formattedPhone = formatPhoneNumber(phone);
    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone,
    });
    return response;
  } catch (error) {
    console.error("SMS Error:", error);
    throw error;
  }
};

const sendOTPviaSMS = async (phone, otp) => {
  const message = `Welcome to Shiftly! Your verification code is: ${otp}. Valid for 10 minutes. please do not share this code with anyone.`;
  return sendSMS(phone, message);
};

module.exports = { sendSMS, sendOTPviaSMS };
