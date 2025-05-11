// Add this helper function to extract the actual driver ID
const getActualDriverId = (driver) => {
  // If driver has a nested driverId property, use that
  if (driver && driver.driverId) {
    return driver.driverId;
  }

  // Otherwise use the driver's _id or id
  return driver && (driver._id || driver.id);
};

// When making the API call to generate payment token, use the helper function
const generatePaymentToken = async () => {
  try {
    setIsLoading(true);
    setError(null);

    // Get the actual driver ID using the helper function
    const actualDriverId = getActualDriverId(selectedDriver);

    console.log("Generating payment token with driver ID:", actualDriverId);

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/payments/generate-token/${
        booking.bookingId
      }`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          driverId: actualDriverId,
        }),
      }
    );
  } catch (error) {
    console.error("Error generating payment token:", error);
    setError("An error occurred while generating the payment token.");
  } finally {
    setIsLoading(false);
  }
};
