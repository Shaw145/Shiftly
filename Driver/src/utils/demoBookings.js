// Demo data for available bookings
export const demoBookings = [
    {
      id: "BK12345",
      pickup: "Andheri East, Mumbai",
      destination: "Powai, Mumbai",
      distance: "9.5 km",
      date: "2025-06-15",
      time: "14:30",
      loadType: "Furniture",
      weight: "250 kg",
      dimensions: "6ft x 4ft x 3ft",
      priceRange: { min: 850, max: 1200 },
      customerRating: 4.8,
      requiresLoading: true,
      description: "Need to transport a sofa set and dining table from my old apartment to new one. Careful handling required.",
      customerName: "Rahul Sharma",
      pickup_address: {
        full: "Flat 302, Silver Heights, Andheri East, Mumbai - 400069",
        landmark: "Near Railway Station"
      },
      destination_address: {
        full: "Villa 12, Green Valley, Powai, Mumbai - 400076",
        landmark: "Opposite Hiranandani Gardens"
      },
      expectedDuration: "45 minutes",
      vehiclePreference: "Pickup Truck or Mini Truck",
      paymentMethod: "Online",
      specialInstructions: "Please bring 2 helpers for loading and unloading. Building has elevator access."
    },
    {
      id: "BK12346",
      pickup: "Koramangala, Bangalore",
      destination: "HSR Layout, Bangalore",
      distance: "8.2 km",
      date: "2025-10-16",
      time: "09:00",
      loadType: "Electronics",
      weight: "75 kg",
      dimensions: "3ft x 2ft x 2ft",
      priceRange: { min: 650, max: 900 },
      customerRating: 4.5,
      requiresLoading: false,
      description: "Need to transport office equipment including 2 desktop computers, monitors and other accessories.",
      customerName: "Priya Desai",
      pickup_address: {
        full: "Office #205, Tech Park, 5th Block Koramangala, Bangalore - 560034",
        landmark: "Next to Forum Mall"
      },
      destination_address: {
        full: "Workspace Hub, 7th Sector, HSR Layout, Bangalore - 560102",
        landmark: "Near BDA Complex"
      },
      expectedDuration: "30 minutes",
      vehiclePreference: "Sedan or SUV",
      paymentMethod: "Cash",
      specialInstructions: "Items are packed and ready to load. Please handle with care as they are fragile electronics."
    },
    {
      id: "BK12347",
      pickup: "Chandni Chowk, Delhi",
      destination: "Lajpat Nagar, Delhi",
      distance: "15.3 km",
      date: "2023-10-17",
      time: "11:15",
      loadType: "Retail Goods",
      weight: "350 kg",
      dimensions: "Multiple boxes",
      priceRange: { min: 1200, max: 1800 },
      customerRating: 4.2,
      requiresLoading: true,
      description: "Transport of clothing merchandise from warehouse to retail store. Multiple boxes of varying sizes.",
      customerName: "Vikram Malhotra",
      pickup_address: {
        full: "Gali Paranthe Wali, 2131, Chandni Chowk, Delhi - 110006",
        landmark: "Near Red Fort"
      },
      destination_address: {
        full: "Shop #45, Central Market, Lajpat Nagar, Delhi - 110024",
        landmark: "Opposite Metro Station"
      },
      expectedDuration: "1 hour 15 minutes",
      vehiclePreference: "Mini Truck",
      paymentMethod: "Online",
      specialInstructions: "Delivery needs to be completed before store opening at 1 PM. Need help with unloading."
    },
    {
      id: "BK12348",
      pickup: "Salt Lake, Kolkata",
      destination: "Park Street, Kolkata",
      distance: "9.7 km",
      date: "2023-10-18",
      time: "16:45",
      loadType: "Home Appliances",
      weight: "120 kg",
      dimensions: "4ft x 3ft x 3ft",
      priceRange: { min: 750, max: 1100 },
      customerRating: 4.7,
      requiresLoading: true,
      description: "Need to transport a washing machine and microwave oven. Both are brand new in boxes.",
      customerName: "Amrita Sen",
      pickup_address: {
        full: "Block CD-25, Salt Lake City, Kolkata - 700064",
        landmark: "Near City Centre Mall"
      },
      destination_address: {
        full: "Flat 1202, Park Residences, Park Street, Kolkata - 700016",
        landmark: "Next to Oxford Bookstore"
      },
      expectedDuration: "40 minutes",
      vehiclePreference: "Pickup Truck",
      paymentMethod: "Cash",
      specialInstructions: "Please bring tools to unpack and install the washing machine."
    },
    {
      id: "BK12349",
      pickup: "Aundh, Pune",
      destination: "Viman Nagar, Pune",
      distance: "11.3 km",
      date: "2025-05-19",
      time: "10:30",
      loadType: "Documents & Packages",
      weight: "15 kg",
      dimensions: "Small packages",
      priceRange: { min: 400, max: 600 },
      customerRating: 4.9,
      requiresLoading: false,
      description: "Urgent courier delivery of legal documents and small packages to corporate office.",
      customerName: "Sunil Patil",
      pickup_address: {
        full: "Law Chambers, DP Road, Aundh, Pune - 411007",
        landmark: "Next to Axis Bank"
      },
      destination_address: {
        full: "Blue Ridge Corporate Office, Viman Nagar, Pune - 411014",
        landmark: "Near Phoenix Mall"
      },
      expectedDuration: "35 minutes",
      vehiclePreference: "Bike or Car",
      paymentMethod: "Online",
      specialInstructions: "Time-sensitive delivery, needs to reach before 12 PM meeting."
    },
    {
      id: "BK12350",
      pickup: "Adyar, Chennai",
      destination: "T. Nagar, Chennai",
      distance: "10.0 km",
      date: "2025-04-20",
      time: "13:00",
      loadType: "Food Delivery",
      weight: "30 kg",
      dimensions: "Catering containers",
      priceRange: { min: 500, max: 750 },
      customerRating: 4.4,
      requiresLoading: false,
      description: "Catering order delivery for corporate event. Food is packaged in insulated containers.",
      customerName: "Lakshmi Narayanan",
      pickup_address: {
        full: "Spice Garden Restaurant, Adyar, Chennai - 600020",
        landmark: "Opposite IDBI Bank"
      },
      destination_address: {
        full: "Tech Solutions Office, T. Nagar, Chennai - 600017",
        landmark: "Behind Panagal Park"
      },
      expectedDuration: "45 minutes",
      vehiclePreference: "Car with AC",
      paymentMethod: "Already Paid",
      specialInstructions: "Food must remain hot, please use insulated bags. Delivery exactly at 1:45 PM for the event."
    }
  ];