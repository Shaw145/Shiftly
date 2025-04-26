const faqData = [
  {
    question: "What is Shiftly, and how does it work?",
    answer:
      "Shiftly is a transport platform that connects customers with drivers for seamless goods transportation. Customers enter pick-up and destination addresses, choose a vehicle, and receive bids from drivers. After selecting a driver, they can track their shipment in real-time until delivery.",
    category: "General"
  },
  {
    question: "How is the pricing determined?",
    answer:
      "The system generates a price range based on distance, goods type, weight, and vehicle type. Drivers then place bids within this range, and customers choose the most suitable option based on price and driver rating.",
    category: "Pricing"
  },
  {
    question: "What types of goods can I transport using Shiftly?",
    answer:
      "You can transport both household and industrial goods, including furniture, appliances, office equipment, raw materials, and packaged goods. However, hazardous materials and restricted items are not allowed.",
    category: "Services"
  },
  {
    question: "What if I don't know the weight or volume of my goods?",
    answer:
      "If you're unsure, Shiftly provides an AI-powered estimator where you can describe or upload an image of your items, and the system will suggest an approximate weight and volume to help you choose the right vehicle.",
    category: "Services"
  },
  {
    question: "What is the Driver Biding System?",
    answer:
      "Once a customer enters their transport details, Shiftly generates a price range. Drivers in the area can bid within this range, and the customer selects the driver based on price, rating, and availability.",
    category: "How It Works"
  },
  {
    question: "How do I track my goods during transport?",
    answer:
      "After booking, you get a live tracking feature where you can monitor your shipment in real-time on the platform. You'll also receive updates at key checkpoints.",
    category: "Services"
  },
  {
    question: "Does Shiftly offer packing services?",
    answer:
      "Currently, drivers assist with loading and unloading. However, in the future, Shiftly will provide full packing, pickup, delivery, and unpacking services with our own fleet.",
    category: "Services"
  },
  {
    question: "What if a driver cancels my booking?",
    answer:
      "If a driver cancels, the system will automatically match you with the next best available driver based on your original selection criteria. You can also choose a new driver from the bidding list.",
    category: "Bookings & Cancellations"
  },
  {
    question: "Can businesses use Shiftly for regular transportation needs?",
    answer:
      "Absolutely! Businesses can book recurring transport services, track deliveries, and manage logistics efficiently using Shiftly's platform.",
    category: "Business Solutions"
  },
  {
    question: "What if I need to cancel my booking?",
    answer:
      "You can cancel your booking through the app before the scheduled pickup. Cancellation policies vary based on timing, and a small fee may apply if the cancellation is too close to the pickup time.",
    category: "Bookings & Cancellations"
  },
  {
    question: "Can I contact the driver directly?",
    answer:
      "To ensure safety and fair transactions, all communication happens through the Shiftly platform. Customers and drivers can chat or call using our in-app feature without sharing personal contact details.",
    category: "Safety & Security"
  },
  {
    question: "Where is Shiftly currently available?",
    answer:
      "Shiftly is currently launching in major cities of West Bengal and will expand to tier-2 and tier-3 cities across India in the near future. Stay tuned for updates on new locations!",
    category: "General"
  },
  {
    question: "How secure is my personal information with Shiftly?",
    answer: 
      "Shiftly uses industry-standard encryption and security measures to protect your personal data. We only collect information necessary for providing our services and never share your details with unauthorized third parties.",
    category: "Safety & Security"
  },
  {
    question: "What payment methods are accepted on Shiftly?",
    answer: 
      "Shiftly accepts various payment methods including UPI, credit/debit cards, net banking, and digital wallets for a seamless booking experience. All transactions are secure and encrypted.",
    category: "Pricing"
  },
  {
    question: "Can I schedule a transport for a future date?",
    answer: 
      "Yes, you can schedule transports in advance through our platform. Simply select your desired date and time during the booking process, and drivers will bid based on their availability.",
    category: "Bookings & Cancellations"
  },
  {
    question: "Is there insurance coverage for my goods?",
    answer: 
      "Yes, Shiftly offers various insurance options to protect your goods during transit. You can select the appropriate coverage level based on the value of your items during the booking process.",
    category: "Safety & Security"
  },
  {
    question: "How do I become a driver for Shiftly?",
    answer: 
      "To become a Shiftly driver, you need to register on our driver platform, submit necessary documentation (vehicle registration, driving license, identity proof), pass our verification process, and complete a brief orientation.",
    category: "Drivers"
  },
  {
    question: "What types of vehicles are available on Shiftly?",
    answer: 
      "Shiftly offers a range of vehicle types including mini trucks, tempos, large trucks, and container trucks to accommodate different shipment sizes and requirements.",
    category: "Services"
  },


  // ------------------- General -------------------
  {
    question: "Is Shiftly available in rural areas?",
    answer: "Shiftly is actively expanding to tier-2 and tier-3 cities and aims to cover rural areas with optimized logistics support.",
    category: "General"
  },
  {
    question: "Do I need to register to get a price estimate?",
    answer: "No, users can use the Calculate Price section without logging in to get an estimated transport cost.",
    category: "General"
  },
  {
    question: "Does Shiftly support bulk bookings?",
    answer: "Yes, businesses or users with multiple deliveries can use our bulk booking option for better coordination and pricing.",
    category: "General"
  },
  {
    question: "Can I use Shiftly for same-day delivery within the city?",
    answer: "Currently, Shiftly does not offer guaranteed same-day delivery. However, deliveries are scheduled as early as possible based on driver availability.",
    category: "General"
  },
  {
    question: "How do I give feedback on my delivery experience?",
    answer: "After your delivery is completed, you’ll receive a prompt to rate and review the driver and service.",
    category: "General"
  },

  // ------------------- Pricing -------------------
  {
    question: "Why does the estimated price show a range instead of a fixed amount?",
    answer: "The price range reflects possible variations in driver bids, urgency level, and optional services like insurance.",
    category: "Pricing"
  },
  {
    question: "Are there hidden fees in the pricing?",
    answer: "No, Shiftly is transparent. All charges including tolls and insurance are shown before confirmation.",
    category: "Pricing"
  },
  {
    question: "Can I change my transport type after booking if I find a better price?",
    answer: "Yes, you can cancel your existing booking before pickup and rebook with your preferred transport option.",
    category: "Pricing"
  },

  // ------------------- Services -------------------
  {
    question: "Can I transport fragile items through Shiftly?",
    answer: "Yes, just mention the item type during booking. We recommend opting for insurance for fragile goods.",
    category: "Services"
  },
  {
    question: "Does Shiftly offer loading and unloading help?",
    answer: "Drivers usually assist with loading/unloading, but you can check availability during the bidding process.",
    category: "Services"
  },
  {
    question: "Can I book a vehicle for return trips too?",
    answer: "Yes, Shiftly supports round-trip bookings. You can select this option during the booking process.",
    category: "Services"
  },

  // ------------------- How It Works -------------------
  {
    question: "How long do I wait to receive driver bids?",
    answer: "Driver bids typically appear within a few minutes, depending on driver availability in your area.",
    category: "How It Works"
  },
  {
    question: "Can I edit my booking after submitting?",
    answer: "No, You can't edit any details of the booking after submitting. If any major mistake is done then you have to cancel that booking and again submit a new booking. So be careful when submitting the booking, check all the details correctly.",
    category: "How It Works"
  },

  // ------------------- Bookings & Cancellations -------------------
  {
    question: "Will I be charged if I cancel after a driver is assigned?",
    answer: "Yes, a small cancellation fee may apply depending on how close it is to the pickup time.",
    category: "Bookings & Cancellations"
  },
  {
    question: "Can I reschedule a booking instead of cancelling?",
    answer: "Yes, Shiftly allows rescheduling before pickup if the driver accepts the new time.",
    category: "Bookings & Cancellations"
  },

  // ------------------- Business Solutions -------------------
  {
    question: "Does Shiftly support B2B logistics?",
    answer: "Yes, businesses can create an account and manage recurring and high-volume transport orders.",
    category: "Business Solutions"
  },
  {
    question: "Can I integrate Shiftly with my inventory system?",
    answer: "API integration for businesses is in development and will allow syncing of logistics with external systems.",
    category: "Business Solutions"
  },

  // ------------------- Safety & Security -------------------
  {
    question: "Are drivers background-verified?",
    answer: "Yes, all drivers go through document verification and background checks before being approved.",
    category: "Safety & Security"
  },
  {
    question: "What happens if my item is damaged during transport?",
    answer: "If you opted for insurance, you can file a claim. If not, our team will review the case based on available tracking and reports.",
    category: "Safety & Security"
  },

  // ------------------- Drivers -------------------
  {
    question: "How do drivers receive payments?",
    answer: "Payments are processed digitally after delivery confirmation and are credited to the driver's account.",
    category: "Drivers"
  },
  {
    question: "Can a driver reject a booking after bidding?",
    answer: "Drivers are discouraged from canceling after being selected, and repeated cancellations may lead to account suspension.",
    category: "Drivers"
  },

  // ------------------- General (Miscellaneous) -------------------
  {
    question: "Can I use Shiftly to move my house to another state?",
    answer: "Yes, Shiftly supports both intra-city and inter-state transportation with suitable vehicle options.",
    category: "General"
  },
  {
    question: "Do I get an invoice for my booking?",
    answer: "Yes, once your booking is confirmed and payment is completed, an invoice is automatically generated and sent to your email.",
    category: "General"
  },
  // ------------------- General -------------------
  { 
    question: "Can I use Shiftly for transporting goods across states?",
    answer: "Yes, Shiftly supports inter-state as well as local goods transport.",
    category: "General"
  },
  {
    question: "Do I need to install any app to use Shiftly?",
    answer: "No, Shiftly is fully web-based and accessible through any browser.",
    category: "General"
  },
  {
    question: "Is there customer support available if I face issues?",
    answer: "Yes, Shiftly offers email and chat-based customer support for all users.",
    category: "General"
  },
  {
    question: "Can I access my past bookings and invoices?",
    answer: "Yes, all your previous bookings and invoices are saved in your user dashboard.",
    category: "General"
  },
  {
    question: "Can multiple users from the same account book different shipments?",
    answer: "Currently, Shiftly supports single-user login per account, but multi-user access is planned.",
    category: "General"
  },

  // ------------------- Pricing -------------------
  {
    question: "Do different vehicle types affect the final price?",
    answer: "Yes, vehicle size and type directly impact base fare and per-kilometer cost.",
    category: "Pricing"
  },
  {
    question: "Is insurance cost included in the estimated price?",
    answer: "No, insurance is optional and added separately if selected during booking.",
    category: "Pricing"
  },
  {
    question: "Why does pricing vary for the same route?",
    answer: "Pricing may vary due to driver bids, urgency level, toll changes, or traffic conditions.",
    category: "Pricing"
  },
  {
    question: "Are peak hour charges applicable?",
    answer: "Yes, a small surge pricing may apply during high-demand hours or holidays.",
    category: "Pricing"
  },
  {
    question: "How is toll fee calculated?",
    answer: "Users can enter toll charges manually, and future versions will auto-fetch this from Google Maps API.",
    category: "Pricing"
  },

  // ------------------- Services -------------------
  {
    question: "Can Shiftly handle partial-load shipments?",
    answer: "Yes, you can book vehicles for partial loads. The price is calculated accordingly.",
    category: "Services"
  },
  {
    question: "Does Shiftly support fragile or high-value goods?",
    answer: "Yes, Shiftly allows you to select goods type during booking, including fragile and valuable items.",
    category: "Services"
  },
  {
    question: "What types of vehicles are available on Shiftly?",
    answer: "Mini trucks, tempos, large trucks, and container vehicles are available based on your shipment size.",
    category: "Services"
  },
  {
    question: "Can I transport documents or small packages?",
    answer: "Shiftly is optimized for goods transport. Document courier services are not currently available.",
    category: "Services"
  },
  {
    question: "Can I request a vehicle with extra manpower for heavy loading?",
    answer: "This feature will be added in future updates. Currently, assistance depends on the driver.",
    category: "Services"
  },

  // ------------------- How It Works -------------------
  {
    question: "How do I know which vehicle is suitable for my goods?",
    answer: "Based on your inputs, Shiftly recommends a vehicle. An AI-based image model is also being developed.",
    category: "How It Works"
  },
  {
    question: "Can I choose my preferred driver?",
    answer: "You can select a driver based on their bid, rating, and reviews.",
    category: "How It Works"
  },
  {
    question: "What if no drivers bid on my request?",
    answer: "You can retry later, or Shiftly will notify you when new drivers become available.",
    category: "How It Works"
  },
  {
    question: "What happens after delivery is completed?",
    answer: "You’ll receive a delivery confirmation, payment summary, and a prompt to rate the driver.",
    category: "How It Works"
  },
  {
    question: "Is live tracking available for all bookings?",
    answer: "Yes, once a vehicle is assigned, live tracking is enabled on your dashboard.",
    category: "How It Works"
  },

  // ------------------- Bookings & Cancellations -------------------
  {
    question: "What if the driver cancels after accepting the bid?",
    answer: "Shiftly will automatically assign the next available driver or issue a refund if none are available.",
    category: "Bookings & Cancellations"
  },
  {
    question: "How do I know if my cancellation is eligible for refund?",
    answer: "Refund eligibility is shown during cancellation, based on how close it is to the scheduled time.",
    category: "Bookings & Cancellations"
  },
  {
    question: "Can I cancel after vehicle arrival?",
    answer: "No, cancellations after vehicle dispatch are not eligible for refund.",
    category: "Bookings & Cancellations"
  },
  {
    question: "Is there a limit to how many bookings I can make in a day?",
    answer: "There is no limit for regular users. Business accounts may have expanded options.",
    category: "Bookings & Cancellations"
  },

  // ------------------- Business Solutions -------------------
  {
    question: "Does Shiftly offer discounts for bulk business bookings?",
    answer: "Yes, discounts are available for verified business users with recurring bookings.",
    category: "Business Solutions"
  },
  {
    question: "Can I set up recurring shipments for my business?",
    answer: "Yes, Shiftly supports scheduling of recurring deliveries for business accounts.",
    category: "Business Solutions"
  },
  {
    question: "Is there a business dashboard for managing multiple shipments?",
    answer: "Yes, the business dashboard helps track, schedule, and manage all transport activity.",
    category: "Business Solutions"
  },
  {
    question: "Can Shiftly help with goods transport for retail or warehouse supply chains?",
    answer: "Yes, Shiftly supports transport needs for B2B operations including retail, FMCG, and industrial supplies.",
    category: "Business Solutions"
  },

  // ------------------- Safety & Security -------------------
  {
    question: "Is customer data protected on the platform?",
    answer: "Yes, all data is encrypted and Shiftly follows industry-standard security protocols.",
    category: "Safety & Security"
  },
  {
    question: "What security measures are in place during delivery?",
    answer: "Live tracking, verified drivers, and secure communication channels ensure safe delivery.",
    category: "Safety & Security"
  },
  {
    question: "Is payment information stored on Shiftly?",
    answer: "No, payments are handled securely via third-party gateways. Shiftly does not store sensitive info.",
    category: "Safety & Security"
  },
  {
    question: "Can I report suspicious driver behavior?",
    answer: "Yes, you can report any issues from your dashboard. Shiftly investigates all flagged activities.",
    category: "Safety & Security"
  },

  // ------------------- Drivers -------------------
  {
    question: "Do drivers need to own the vehicle they register with?",
    answer: "Yes, drivers must either own or be authorized to operate the registered vehicle.",
    category: "Drivers"
  },
  {
    question: "Can I update my service area as a driver?",
    answer: "Yes, drivers can edit their service radius and availability anytime from their dashboard.",
    category: "Drivers"
  },
  {
    question: "Are drivers rated by customers?",
    answer: "Yes, customers can rate and review drivers after every completed delivery.",
    category: "Drivers"
  },
  {
    question: "How soon do I get notified when a job is available?",
    answer: "Instant notifications are sent to all eligible drivers once a customer submits a request.",
    category: "Drivers"
  },
  {
    question: "Can I decline a booking after bidding?",
    answer: "You can cancel, but repeated cancellations may lead to account penalties.",
    category: "Drivers"
  }

];

export default faqData;