export const goodsTypeOptions = [
  { value: "household_small", label: "Small Household Shifting (1-2 rooms)" },
  { value: "household_medium", label: "Medium Household Shifting (2-3 rooms)" },
  { value: "household_large", label: "Large Household Shifting (3+ rooms)" },
  { value: "light", label: "Light Industrial/Office Goods" },
  { value: "heavy", label: "Heavy Industrial Goods" },
];

// Define item characteristics that affect vehicle selection
const ITEM_PROPERTIES = {
  canDisassemble: false, // Can the item be taken apart?
  stackable: false, // Can items be stacked on each other?
  maxStack: 1, // Maximum items that can be safely stacked
  fragile: false, // Needs careful handling
  needsSpace: "small", // small/medium/large - space needed around item
  loadingComplexity: 1, // 1-5 scale, affects loading time and space efficiency
};

// Common household items with detailed characteristics
const householdItems = {
  electronics: [
    {
      id: "fridge_double",
      name: "Refrigerator (Double-door)",
      weight: 85,
      spaceScore: 15,
      ...ITEM_PROPERTIES,
      stackable: true,
      maxStack: 1,
      needsSpace: "medium",
      loadingComplexity: 4,
    },
    {
      id: "fridge_small",
      name: "Refrigerator (Small)",
      weight: 45,
      spaceScore: 12,
      ...ITEM_PROPERTIES,
      stackable: true,
      maxStack: 1,
      needsSpace: "medium",
      loadingComplexity: 3,
    },
    {
      id: "washer",
      name: "Washing Machine",
      weight: 45,
      spaceScore: 12,
      ...ITEM_PROPERTIES,
      stackable: true,
      maxStack: 2,
      needsSpace: "medium",
      loadingComplexity: 3,
    },
    { id: "tv_32", name: "TV (32-inch)", weight: 5 },
    { id: "tv_50", name: "TV (50-inch)", weight: 12 },
    { id: "tv_65", name: "TV (65-inch)", weight: 25 },
    { id: "ac_split", name: "AC Split Unit", weight: 40 },
    { id: "ac_window", name: "AC Window Unit", weight: 30 },
    { id: "microwave", name: "Microwave Oven", weight: 12 },
    { id: "dishwasher", name: "Dishwasher", weight: 35 },
    { id: "dryer", name: "Clothes Dryer", weight: 35 },
    { id: "water_purifier", name: "Water Purifier", weight: 8 },
  ],
  furniture: [
    {
      id: "bed_wooden_king",
      name: "King Size Wooden Bed",
      weight: 150,
      spaceScore: 25,
      ...ITEM_PROPERTIES,
      canDisassemble: false,
      needsSpace: "large",
      loadingComplexity: 5,
    },
    {
      id: "bed_metal_king",
      name: "King Size Metal Bed",
      weight: 80,
      spaceScore: 20,
      ...ITEM_PROPERTIES,
      canDisassemble: true,
      needsSpace: "medium",
      loadingComplexity: 3,
    },
    {
      id: "sofa_3",
      name: "3-Seater Sofa",
      weight: 65,
      spaceScore: 18,
      ...ITEM_PROPERTIES,
      needsSpace: "large",
      loadingComplexity: 4,
    },
    {
      id: "sofa_l",
      name: "L-Shaped Sofa",
      weight: 120,
      spaceScore: 25,
      ...ITEM_PROPERTIES,
      needsSpace: "large",
      loadingComplexity: 5,
    },
    { id: "sofa_1", name: "Single Sofa", weight: 25 },
    { id: "sofa_2", name: "2-Seater Sofa", weight: 45 },
    { id: "bed_single", name: "Single Bed with Mattress", weight: 40 },
    { id: "bed_double", name: "Double Bed with Mattress", weight: 70 },
    { id: "bed_queen", name: "Queen Size Bed Set", weight: 100 },
    { id: "dining_4", name: "4-Seater Dining Set", weight: 60 },
    { id: "dining_6", name: "6-Seater Dining Set", weight: 85 },
    { id: "dining_8", name: "8-Seater Dining Set", weight: 120 },
    { id: "wardrobe_2", name: "2-Door Wardrobe", weight: 70 },
    { id: "wardrobe_3", name: "3-Door Wardrobe", weight: 90 },
    { id: "wardrobe_4", name: "4-Door Wardrobe", weight: 120 },
    { id: "showcase", name: "Showcase/Display Unit", weight: 60 },
    { id: "chair", name: "Chair", weight: 5 },
    { id: "tv_unit", name: "Television Unit", weight: 30 },
    { id: "center_table", name: "Center Table", weight: 15 },
    { id: "side_table", name: "Side Table", weight: 8 },
    { id: "study_table", name: "Study Table", weight: 25 },
    { id: "bookshelf", name: "Bookshelf", weight: 35 },
    { id: "shoe_rack", name: "Shoe Rack", weight: 8 },
  ],
  appliances: [
    { id: "geyser", name: "Water Heater/Geyser", weight: 10 },
    { id: "ceiling_fan", name: "Ceiling Fan", weight: 4 },
    { id: "cooler", name: "Air Cooler", weight: 15 },
    { id: "sewing_machine", name: "Sewing Machine", weight: 12 },
    { id: "vacuum", name: "Vacuum Cleaner", weight: 5 },
  ],
  misc: [
    {
      id: "cylinder",
      name: "Gas Cylinder",
      weight: 29.5,
      spaceScore: 6,
      ...ITEM_PROPERTIES,
      stackable: true,
      maxStack: 3,
      needsSpace: "small",
      loadingComplexity: 2,
    },
    { id: "boxes_small", name: "Small Boxes/Bags (per box)", weight: 8 },
    { id: "boxes_medium", name: "Medium Boxes/Bags (per box)", weight: 15 },
    { id: "boxes_large", name: "Large Boxes/Bags (per box)", weight: 25 },
    { id: "mattress_single", name: "Single Mattress", weight: 15 },
    { id: "mattress_double", name: "Double Mattress", weight: 25 },
    { id: "gas_stove", name: "Gas Stove", weight: 12 },
  ],
};

export const itemsByType = {
  household_small: Object.values(householdItems).flat(),
  household_medium: Object.values(householdItems).flat(),
  household_large: Object.values(householdItems).flat(),
  light: [
    { id: "desk_small", name: "Office Desk (Small)", weight: 30 },
    { id: "desk_large", name: "Office Desk (Large)", weight: 50 },
    { id: "chair_office", name: "Office Chair", weight: 15 },
    { id: "chair_executive", name: "Executive Chair", weight: 20 },
    { id: "cabinet_file", name: "Filing Cabinet", weight: 50 },
    { id: "cabinet_storage", name: "Storage Cabinet", weight: 70 },
    { id: "computer_set", name: "Computer Workstation", weight: 20 },
    { id: "printer_small", name: "Office Printer (Small)", weight: 15 },
    { id: "printer_large", name: "Office Printer (Large)", weight: 40 },
    { id: "scanner", name: "Scanner", weight: 15 },
    { id: "ups", name: "UPS System", weight: 25 },
    { id: "server_rack", name: "Server Rack", weight: 80 },
    { id: "conference_table", name: "Conference Table", weight: 100 },
    { id: "reception_desk", name: "Reception Desk", weight: 90 },
    { id: "cubicle", name: "Office Cubicle Set", weight: 120 },
  ],
  heavy: [
    // Manufacturing Equipment
    { id: "cnc_machine", name: "CNC Machine", weight: 800 },
    { id: "lathe", name: "Lathe Machine", weight: 700 },
    { id: "milling", name: "Milling Machine", weight: 900 },
    { id: "press", name: "Hydraulic Press", weight: 1000 },
    { id: "welding", name: "Welding Machine", weight: 300 },

    // Power & Electrical
    { id: "generator_small", name: "Generator (Small)", weight: 400 },
    { id: "generator_large", name: "Generator (Large)", weight: 800 },
    { id: "transformer_small", name: "Transformer (Small)", weight: 500 },
    { id: "transformer_large", name: "Transformer (Large)", weight: 1200 },
    { id: "ups_industrial", name: "Industrial UPS", weight: 600 },

    // Construction Equipment
    { id: "concrete_mixer", name: "Concrete Mixer", weight: 750 },
    { id: "scaffold", name: "Scaffolding Set", weight: 400 },
    { id: "compactor", name: "Plate Compactor", weight: 300 },

    // Material Handling
    { id: "forklift_small", name: "Forklift (1.5 ton)", weight: 2000 },
    { id: "forklift_large", name: "Forklift (3 ton)", weight: 3500 },
    { id: "pallet_jack", name: "Pallet Jack", weight: 200 },
    { id: "crane_mobile", name: "Mobile Crane", weight: 5000 },

    // Processing Equipment
    { id: "boiler_small", name: "Industrial Boiler (Small)", weight: 800 },
    { id: "boiler_large", name: "Industrial Boiler (Large)", weight: 1500 },
    { id: "compressor_air", name: "Air Compressor", weight: 400 },
    { id: "chiller", name: "Industrial Chiller", weight: 900 },

    // Printing Industry
    { id: "printing_press", name: "Printing Press", weight: 2000 },
    { id: "paper_cutter", name: "Industrial Paper Cutter", weight: 500 },

    // Food Industry
    { id: "mixer_industrial", name: "Industrial Mixer", weight: 600 },
    { id: "oven_industrial", name: "Industrial Oven", weight: 800 },
    {
      id: "refrigeration",
      name: "Industrial Refrigeration Unit",
      weight: 1000,
    },
  ],
};

// Define item characteristics that affect vehicle selection
const ITEM_CHARACTERISTICS_MAP = {
  // Refrigerators
  "Refrigerator (Double-door)": {
    spaceScore: 15,
    stackable: false,
    needsVerticalSpace: true,
    loadingComplexity: 4,
    category: "large_appliance",
    needsSpace: "medium",
  },
  "Refrigerator (Small)": {
    spaceScore: 12,
    stackable: false,
    needsVerticalSpace: true,
    loadingComplexity: 3,
    category: "large_appliance",
    needsSpace: "medium",
  },

  // Washing Machines
  "Washing Machine": {
    spaceScore: 12,
    stackable: true,
    needsVerticalSpace: false,
    loadingComplexity: 3,
    category: "large_appliance",
    needsSpace: "medium",
  },

  // Beds
  "King Size Bed Set": {
    spaceScore: 25,
    canDisassemble: true,
    stackable: false,
    loadingComplexity: 5,
    category: "furniture",
    needsSpace: "large",
    baseMultiplier: 1.2,
  },
  "Queen Size Bed Set": {
    spaceScore: 22,
    canDisassemble: true,
    stackable: false,
    loadingComplexity: 4,
    category: "furniture",
    needsSpace: "large",
    baseMultiplier: 1,
  },
  "Double Bed with Mattress": {
    spaceScore: 20,
    canDisassemble: true,
    stackable: false,
    loadingComplexity: 4,
    category: "furniture",
    needsSpace: "medium",
    baseMultiplier: 0.8,
  },
  "Single Bed with Mattress": {
    spaceScore: 15,
    canDisassemble: true,
    stackable: false,
    loadingComplexity: 3,
    category: "furniture",
    needsSpace: "medium",
    baseMultiplier: 0.6,
  },

  // Sofas
  "L-Shaped Sofa": {
    spaceScore: 25,
    stackable: false,
    needsSpace: "large",
    loadingComplexity: 5,
    category: "furniture",
    baseMultiplier: 1.5,
  },
  "3-Seater Sofa": {
    spaceScore: 18,
    stackable: false,
    needsSpace: "large",
    loadingComplexity: 4,
    category: "furniture",
    baseMultiplier: 1,
  },

  // Compact but heavy items
  "Gas Cylinder": {
    spaceScore: 6,
    stackable: true,
    maxStack: 3,
    needsSpace: "small",
    loadingComplexity: 2,
    category: "heavy_compact",
  },
  // ... add more items
};

// Export the characteristics map
export { ITEM_CHARACTERISTICS_MAP };
