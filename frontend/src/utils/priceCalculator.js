export const calculateBookingPrice = (formData) => {
  // Add validation check at the start
  if (!formData || !formData.vehicleType) {
    console.error("Invalid form data:", formData);
    return {
      lowerRange: 0,
      upperRange: 0,
      distance: 0,
      baseFare: 0,
      distanceCharge: 0,
      goodsFee: 0,
      weightSurcharge: 0,
      urgencyCharge: "0%",
      insuranceCost: 0,
      gstAmount: 0,
      subtotal: 0,
    };
  }

  // Base fare table based on distance ranges
  const baseFareTable = {
    mini: [400, 600, 800, 1000], // [0-50km, 51-300km, >300km, >1000km]
    tempo: [600, 800, 1000, 1200],
    large: [1000, 1100, 1400, 1500],
    container: [1300, 1500, 1900, 2000],
  };

  // Cost per km based on distance ranges
  const distanceRates = {
    mini: [15, 22, 20, 17], // [0-50km, 51-300km, >300km, >1000km]
    tempo: [20, 27, 25, 22],
    large: [35, 32, 30, 27],
    container: [40, 38, 35, 32],
  };

  // Use the calculated distance with a fallback
  const distance = formData.distance || 50; // Fallback to 50km if distance calculation failed

  // Determine rate index based on distance
  let rateIndex = 0;
  if (distance > 50 && distance <= 300) rateIndex = 1;
  else if (distance > 300 && distance <= 1000) rateIndex = 2;
  else if (distance > 1000) rateIndex = 3;

  // Base calculations
  const baseFare = baseFareTable[formData.vehicleType][rateIndex];
  const costPerKm = distanceRates[formData.vehicleType][rateIndex];
  const distanceCharge = costPerKm * distance;

  // Update the goods fee calculation with fallback
  const goodsFeeTable = {
    household_small: 300,
    household_medium: 500,
    household_large: 800,
    light: 800,
    heavy: 1500,
  };
  const goodsFee = goodsFeeTable[formData.goodsType] || 300; // Default to smallest fee

  // Weight surcharge
  const totalWeight = Object.values(formData.items).reduce(
    (sum, item) => sum + (item.weight || 0) * item.quantity,
    0
  );
  const weightSurcharge = totalWeight > 1000 ? (totalWeight - 1000) * 0.5 : 0;

  // Urgency multiplier
  const urgencyMultiplier = {
    standard: 1,
    express: 1.1, // 10% extra for express
    priority: 1.2, // 20% extra for priority
  }[formData.urgency];

  // Insurance cost
  const insuranceCost = {
    none: 0,
    basic: 100,
    full: 200,
  }[formData.insurance];

  // Calculate subtotal
  let subtotal =
    (baseFare + distanceCharge + goodsFee + weightSurcharge) *
      urgencyMultiplier +
    insuranceCost;

  // Add GST (18%)
  const gstRate = 0.18;
  const gstAmount = subtotal * gstRate;

  // Calculate final total
  let totalPrice = subtotal + gstAmount;

  // Round to nearest lower 100
  totalPrice = Math.floor(totalPrice / 100) * 100;

  // Update the range calculation with safe type check
  const isHouseholdGoods = (formData.goodsType || "").includes("household");
  const lowerRange = totalPrice;
  const upperRange = totalPrice + (isHouseholdGoods ? 2000 : 2500);

  return {
    lowerRange,
    upperRange,
    distance,
    baseFare,
    distanceCharge,
    goodsFee,
    weightSurcharge,
    urgencyCharge: `${((urgencyMultiplier - 1) * 100).toFixed(0)}%`,
    insuranceCost,
    gstAmount: Math.round(gstAmount),
    subtotal: Math.round(subtotal),
  };
};
