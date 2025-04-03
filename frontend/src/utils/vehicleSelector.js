import { ITEM_CHARACTERISTICS_MAP } from "./goodsData";

// Define vehicle capacities
const VEHICLE_CAPACITIES = {
  mini: {
    width: 4.5, // feet
    length: 7, // feet
    height: 5, // feet
    maxWeight: 500, // kg
    maxItems: 15,
  },
  tempo: {
    width: 5.5,
    length: 9,
    height: 6,
    maxWeight: 1000,
    maxItems: 25,
  },
  large: {
    width: 7,
    length: 14,
    height: 7,
    maxWeight: 2500,
    maxItems: 40,
  },
  container: {
    width: 8,
    length: 20,
    height: 8,
    maxWeight: 5000,
    maxItems: 100,
  },
};

// Rethink item dimensions with practical loading characteristics
const ITEM_CHARACTERISTICS = {
  // Large Appliances - Can be stacked/arranged efficiently
  refrigerator: {
    weight: 80,
    spaceScore: 15,
    category: "large_appliance",
    stackable: true,
    needsSpace: "medium",
  },
  washing: {
    weight: 60,
    spaceScore: 12,
    category: "large_appliance",
    stackable: true,
    needsSpace: "medium",
  },

  // Furniture - Needs specific arrangement
  sofa: {
    weight: 70,
    spaceScore: 18,
    category: "furniture",
    stackable: false,
    needsSpace: "large",
    variants: {
      "seater-3": { spaceMultiplier: 1 },
      "seater-2": { spaceMultiplier: 0.7 },
      "l-shaped": { spaceMultiplier: 1.5 },
    },
  },
  bed: {
    weight: 90,
    spaceScore: 20,
    category: "furniture",
    stackable: false,
    needsSpace: "large",
    variants: {
      king: { spaceMultiplier: 1.2 },
      queen: { spaceMultiplier: 1 },
      single: { spaceMultiplier: 0.6 },
    },
  },

  // Compact but Heavy Items
  cylinder: {
    weight: 30,
    spaceScore: 6,
    category: "heavy_compact",
    stackable: true,
    needsSpace: "small",
    maxStack: 3, // Maximum items that can be safely stacked
  },

  // Standard Items
  wardrobe: {
    weight: 70,
    spaceScore: 12,
    category: "furniture",
    stackable: false,
    needsSpace: "medium",
  },

  // Add more items with their characteristics...
};

// Vehicle loading characteristics
const VEHICLE_CHARACTERISTICS = {
  mini: {
    maxWeight: 500,
    baseSpace: 100,
    loadingEfficiency: 0.85,
    categories: {
      large_appliance: { max: 2, efficient: true },
      furniture: { max: 2, efficient: false },
      heavy_compact: { max: 6, efficient: true },
    },
  },
  tempo: {
    maxWeight: 1000,
    baseSpace: 200,
    loadingEfficiency: 0.9,
    categories: {
      large_appliance: { max: 3, efficient: true },
      furniture: { max: 3, efficient: true },
      heavy_compact: { max: 12, efficient: true },
    },
  },
  // Add characteristics for other vehicles...
};

export const determineVehicleType = (
  items,
  goodsType,
  additionalItems = ""
) => {
  const hasAdditionalItems = additionalItems?.trim().length > 0;

  // Calculate metrics based on item characteristics
  const metrics = Object.entries(items).reduce(
    (acc, [_, item]) => {
      const characteristics = ITEM_CHARACTERISTICS_MAP[item.name] || {};
      const quantity = item.quantity || 1;
      const weight = item.weight * quantity;

      // Calculate space requirements
      let spaceScore = characteristics.spaceScore || 10;
      if (characteristics.stackable && quantity > 1) {
        const stacks = Math.ceil(quantity / (characteristics.maxStack || 2));
        spaceScore = spaceScore * stacks;
      } else {
        spaceScore = spaceScore * quantity;
      }

      // Apply multipliers
      if (characteristics.baseMultiplier) {
        spaceScore *= characteristics.baseMultiplier;
      }

      return {
        totalWeight: acc.totalWeight + weight,
        totalSpace: acc.totalSpace + spaceScore,
        largeItems:
          acc.largeItems +
          (characteristics.needsSpace === "large" ? quantity : 0),
        verticalItems:
          acc.verticalItems +
          (characteristics.needsVerticalSpace ? quantity : 0),
        maxComplexity: Math.max(
          acc.maxComplexity,
          characteristics.loadingComplexity || 1
        ),
      };
    },
    {
      totalWeight: 0,
      totalSpace: 0,
      largeItems: 0,
      verticalItems: 0,
      maxComplexity: 1,
    }
  );

  // Smart vehicle selection based on metrics
  const buffer = hasAdditionalItems ? 0.15 : 0.05;
  const adjustedWeight = metrics.totalWeight * (1 + buffer);
  const adjustedSpace = metrics.totalSpace * (1 + buffer);

  // Vehicle selection logic
  if (
    adjustedWeight <= 300 &&
    metrics.largeItems === 0 &&
    metrics.verticalItems <= 1
  ) {
    return "mini";
  } else if (
    adjustedWeight <= 800 &&
    metrics.largeItems <= 2 &&
    adjustedSpace <= 100
  ) {
    return "tempo";
  } else if (adjustedWeight <= 2000 && adjustedSpace <= 200) {
    return "large";
  } else {
    return "container";
  }
};
