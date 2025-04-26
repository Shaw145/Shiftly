import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaTruck,
  FaGavel,
  FaShieldAlt,
  FaHeadset,
  FaGlobe,
  FaArrowRight,
  FaMapMarkedAlt,
  FaBoxOpen,
  FaChartLine,
  FaPhoneAlt,
  FaStar,
  FaCheckCircle,
  FaLock,
  FaCalculator,
  FaUserShield,
  FaMoneyBillWave,
  FaTruckMoving,
} from "react-icons/fa";

// Import images dynamically
import houseShifting from "../assets/house-shifting-services.jpg";
import officeShifting from "../assets/office-relocation.jpg";
import industryShifting from "../assets/industryshifting.jpg";
import worldMap from "../assets/worldmap.png";
import customer5 from "../assets/Customer 5.jpg";
import customer6 from "../assets/Customer 6.jpg";
import customer8 from "../assets/Customer 8.jpg";

const Services = () => {
  // References for scroll animations
  const featuresRef = useRef(null);
  const testimonialsRef = useRef(null);

  // Set dynamic page title when component mounts
  useEffect(() => {
    // Update the document title
    document.title = "Our Services | Transportation Solutions | Shiftly - A Seamless Transport System";
    
    // Optional: Restore the original title when component unmounts
    return () => {
      document.title = "Shiftly | A Seamless Transport System";
    };
  }, []);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  // Core service offerings
  const coreServices = [
    {
      id: 1,
      title: "Household Shifting",
      description:
        "Professional and reliable household relocation services. We handle everything from packing and loading to transportation and unpacking, ensuring your belongings reach safely.",
      image: houseShifting,
      features: [
        "Furniture disassembly & reassembly",
        "Specialized packing for fragile items",
        "Complete home inventory management",
        "Flexible scheduling options",
      ],
      icon: <FaBoxOpen />,
      color: "from-blue-500 to-blue-600",
    },
    {
      id: 2,
      title: "Office Shifting",
      description:
        "Minimize downtime with our efficient office relocation services. Our team ensures your business gets back up and running quickly with minimal disruption to your operations.",
      image: officeShifting,
      features: [
        "IT equipment relocation specialists",
        "Organized workspace planning",
        "Weekend & after-hours options",
        "Business continuity focus",
      ],
      icon: <FaChartLine />,
      color: "from-green-500 to-green-600",
    },
    {
      id: 3,
      title: "Industrial Material Shifting",
      description:
        "Specialized solutions for heavy machinery and industrial equipment transportation. Our expertise and equipment ensure safe handling of your valuable industrial assets.",
      image: industryShifting,
      features: [
        "Heavy machinery transportation",
        "Safety compliance guaranteed",
        "Specialized equipment fleet",
        "Project management included",
      ],
      icon: <FaTruck />,
      color: "from-amber-500 to-amber-600",
    },
  ];

  // Shiftly Platform Features
  const platformFeatures = [
    {
      id: 1,
      icon: <FaGavel />,
      title: "Real-Time Driver Bidding",
      description:
        "Once a user submits a transport request, available drivers in the area can place competitive bids. This allows users to compare offers and select the best one based on price, driver rating, and vehicle suitability — giving full control over whom they choose.",
      color: "#4F46E5",
    },
    {
      id: 2,
      icon: <FaMoneyBillWave />,
      title: "Fair & Transparent Pricing",
      description:
        "Shiftly uses a smart pricing system that considers distance, goods category, urgency, and toll fees to generate a price range. This ensures users get an honest estimate before booking, with no hidden charges later on.",
      color: "#10B981",
    },
    {
      id: 3,
      icon: <FaTruckMoving />,
      title: "Vehicle Recommendation Based on Goods",
      description:
        "Users don't need to guess which vehicle they need. Based on inputs (or image analysis in future), the system suggests the most suitable vehicle size — saving money and avoiding under- or over-sized transport.",
      color: "#F59E0B",
    },
    {
      id: 4,
      icon: <FaMapMarkedAlt />,
      title: "Live Tracking of Your Shipment",
      description:
        "Once the goods are picked up, users can track the exact location of the vehicle in real time. This ensures better coordination, transparency, and peace of mind throughout the delivery journey.",
      color: "#EC4899",
    },
    {
      id: 5,
      icon: <FaLock />,
      title: "Secure User Accounts & Bookings",
      description:
        "All user data and bookings are protected with secure login (Firebase) and token-based authentication. Users can safely manage their orders, history, and preferences through their personal dashboard.",
      color: "#8B5CF6",
    },
    {
      id: 6,
      icon: <FaCalculator />,
      title: "Instant Price Calculator (No Login Needed)",
      description:
        "Before even signing up, users can access a calculator tool to get an estimated delivery cost. This helps users plan better and decide whether to proceed with booking.",
      color: "#0EA5E9",
    },
    {
      id: 7,
      icon: <FaUserShield />,
      title: "Verified Drivers & Rating System",
      description:
        "Only drivers who pass document verification and profile checks can bid on transport jobs. After delivery, users can rate and review drivers — helping others make informed decisions and keeping service quality high.",
      color: "#EF4444",
    },
    {
      id: 8,
      icon: <FaHeadset />,
      title: "24/7 Customer Support",
      description:
        "Shiftly offers round-the-clock support to help users with any issues related to booking, payments, driver communication, or delivery tracking — ensuring help is always just a message away.",
      color: "#14B8A6",
    },
    {
      id: 9,
      icon: <FaGlobe />,
      title: "Nationwide Coverage",
      description:
        "Shiftly operates across cities and states in India, making it easy for users to book both local and long-distance deliveries through a single platform — no matter where they are.",
      color: "#6366F1",
    },
    {
      id: 10,
      icon: <FaShieldAlt />,
      title: "Secure Transportation",
      description:
        "Shiftly ensures your goods are transported safely with trusted drivers, live tracking, and optional insurance coverage — giving users complete confidence throughout the delivery process.",
      color: "#0891B2",
    },
  ];

  // Testimonials
  const testimonials = [
    {
      id: 1,
      name: "Ritwik Sen",
      position: "Business Owner",
      content:
        "Professional and punctual service! The driver arrived on time and handled my goods with care. Will be using again soon!",
      rating: 4,
      image: customer6,
    },
    {
      id: 2,
      name: "Ipsita Dutta",
      position: "Homeowner",
      content:
        "The best transport service I've ever used! The drivers were professional, and the process was hassle-free. Highly recommend!",
      rating: 5,
      image: customer5,
    },
    {
      id: 3,
      name: "Rohan Mehta",
      position: "Factory Manager",
      content:
        "Fair pricing, great support, and timely delivery. Highly recommend Shiftly for transportation needs to everyone. Reliable service!",
      rating: 5,
      image: customer8,
    },
  ];

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section - Simplified and Improved */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-body-dark via-gray-800 to-gray-900"></div>
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `url(${worldMap})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        ></div>

        {/* Simple gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-block bg-primary px-4 py-1 rounded-full text-sm font-semibold mb-6 text-white">
                Transport Solutions
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-white leading-tight">
                Professional Transport & Shifting Services
              </h1>
              <p className="text-lg md:text-xl text-gray-200 mb-10 leading-relaxed">
                Expert solutions for household, office, and industrial
                transportation needs with real-time tracking, secure handling,
                and competitive pricing across India.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/login"
                  className="px-8 py-4 bg-white text-body-dark rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg flex items-center cursor-pointer hover:shadow-xl hover:-translate-y-1"
                >
                  <FaTruck className="mr-2" />
                  Book Now
                </Link>
                <Link
                  to="/contact-us"
                  className="px-8 py-4 bg-gradient-to-br from-red-500 to-pink-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all duration-300 shadow-lg flex items-center cursor-pointer hover:shadow-xl hover:-translate-y-1"
                >
                  <FaPhoneAlt className="mr-2" />
                  Contact Us
                </Link>
                <Link
                  to="/calculate-price"
                  className="px-8 py-4 bg-gradient-to-br from-red-600 to-blue-800 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg flex items-center cursor-pointer hover:shadow-xl hover:-translate-y-1"
                >
                  <FaCalculator className="mr-2" />
                  Calculate Price
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Services Section */}
      <section className="py-24 md:py-32 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-body-dark mb-4">
              Our Transport Services
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Specialized moving solutions tailored to your specific needs,
              whether you&apos;re relocating your home, office, or industrial
              equipment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreServices.map((service, index) => (
              <motion.div
                key={service.id}
                className="bg-white rounded-xl overflow-hidden shadow-xl border border-gray-100 h-full flex flex-col hover:shadow-2xl transition-all duration-500"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="relative h-70 overflow-hidden group">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                    <div className="p-6">
                      <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-r ${service.color} flex items-center justify-center text-white mb-3`}
                      >
                        {service.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-white">
                        {service.title}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="p-6 flex-grow">
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-green-500 mt-1 mr-2">
                          <FaCheckCircle />
                        </span>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 pt-0 mt-auto">
                  <Link
                    to="/calculate-price"
                    className={`inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r ${service.color} text-white font-medium hover:opacity-90 transition-all cursor-pointer hover:translate-x-1.5`}
                  >
                    Calculate Price
                    <FaArrowRight className="ml-2" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Completely redesigned */}
      <section ref={featuresRef} className="py-16 md:py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <motion.span
              className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-semibold mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              PLATFORM FEATURES
            </motion.span>
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-body-dark mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              The Shiftly Advantages
            </motion.h2>
            <motion.p
              className="text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Our transport platform is designed with cutting-edge features that
              make your shipping experience seamless, secure, and stress-free.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {platformFeatures.map((feature, index) => (
              <motion.div
                key={feature.id}
                className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 flex"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <div
                  className="w-2 flex-shrink-0"
                  style={{ backgroundColor: feature.color }}
                ></div>
                <div className="p-6 flex flex-col md:flex-row items-start gap-4">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl flex-shrink-0 mb-4 md:mb-0"
                    style={{ backgroundColor: feature.color }}
                  >
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
                      <span className="mr-2">{feature.id}.</span>{" "}
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works section replaced with simple illustration and CTA */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-r from-red-50 to-red-100">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <motion.span
                className="inline-block bg-red-100 text-red-700 px-4 py-1 rounded-full text-sm font-semibold mb-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                SIMPLE PROCESS
              </motion.span>
              <motion.h2
                className="text-3xl md:text-4xl font-bold text-body-dark mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Discover How Shiftly Makes Transportation Easy
              </motion.h2>
              <motion.p
                className="text-lg text-gray-600 mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                From booking to delivery, our streamlined process ensures a
                seamless experience. Learn how our platform connects you with
                verified drivers, provides real-time tracking, and guarantees
                secure transportation for your goods.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Link
                  to="/how-it-works"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-br from-red-500 to-pink-600 text-white rounded-lg font-medium transition-all duration-200 shadow-lg cursor-pointer hover:-translate-y-1"
                >
                  See How It Works
                  <FaArrowRight className="ml-2" />
                </Link>
              </motion.div>
            </div>

            <motion.div
              className="order-1 lg:order-2 flex justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img
                src="https://illustrations.popsy.co/red/woman-with-a-laptop.svg"
                alt="How Shiftly Works"
                className="max-w-full w-96"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Completely redesigned */}
      <section
        ref={testimonialsRef}
        className="py-16 md:py-24 px-4 bg-gradient-to-b from-white to-gray-50"
      >
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <motion.span
              className="inline-block bg-yellow-100 text-yellow-700 px-4 py-1 rounded-full text-sm font-semibold mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              CUSTOMER STORIES
            </motion.span>
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-body-dark mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              What Our Customers Say
            </motion.h2>
            <motion.p
              className="text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Don&apos;t just take our word for it. See what our satisfied
              customers have to say about their experiences with Shiftly.
            </motion.p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 h-full"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100,
                  }}
                  whileHover={{
                    y: -10,
                    transition: { duration: 0.3 },
                  }}
                >
                  <div className="h-3 bg-yellow-400"></div>
                  <div className="p-6">
                    <div className="flex mb-6">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={
                            i < testimonial.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }
                          size={20}
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 italic mb-6 text-base leading-relaxed">
                      &quot;{testimonial.content}&quot;
                    </p>
                    <div className="flex items-center pt-4 border-t border-gray-100">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400 mr-4"
                      />
                      <div>
                        <h4 className="font-bold text-gray-900">
                          {testimonial.name}
                        </h4>
                        <p className="text-gray-500 text-sm">
                          {testimonial.position}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="mt-12 text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium">
                <span className="mr-2 text-yellow-500">
                  <FaStar />
                </span>
                <span className="font-bold">4.9/5</span>
                <span className="mx-2 text-gray-400">|</span>
                <span>Based on 500+ verified customer reviews</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-body-dark mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about our transportation
              services.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-body-dark">
                    What types of goods can I transport using Shiftly?
                  </h3>
                </div>
                <div className="px-6 py-5">
                  <p className="text-gray-600">
                    You can transport both household and industrial goods,
                    including furniture, appliances, office equipment, raw
                    materials, and packaged goods. However, hazardous materials
                    and restricted items are not allowed.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-body-dark">
                    Does Shiftly offer packing services?
                  </h3>
                </div>
                <div className="px-6 py-5">
                  <p className="text-gray-600">
                    Currently, drivers assist with loading and unloading.
                    However, in the future, Shiftly will provide full packing,
                    pickup, delivery, and unpacking services with our own fleet.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-body-dark">
                    What is the Driver Biding System?
                  </h3>
                </div>
                <div className="px-6 py-5">
                  <p className="text-gray-600">
                    Once a customer enters their transport details, Shiftly
                    generates a price range. Drivers in the area can bid within
                    this range, and the customer selects the driver based on
                    price, rating, and availability.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mt-10">
              <Link
                to="/faqs"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-br from-red-500 to-pink-600 text-white rounded-lg font-medium hover:bg-gray-800 transition-all duration-200 shadow-md cursor-pointer hover:translate-x-1.5 hover:shadow-lg hover:shadow-pink-300"
              >
                View All FAQs
                <FaArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-r from-body-dark to-gray-900 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${worldMap})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        ></div>
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Experience Seamless Transport?
            </h2>
            <p className="text-xl text-gray-300 mb-10">
              Get started with Shiftly today and enjoy hassle-free shipping for
              all your transportation needs.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link
                to="/login"
                className="px-8 py-4 bg-white text-body-dark rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg flex items-center cursor-pointer"
              >
                <FaTruck className="mr-2" />
                Book Now
              </Link>
              <Link
                to="/contact-us"
                className="px-8 py-4 bg-gradient-to-br from-red-500 to-pink-600 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg flex items-center cursor-pointer"
              >
                <FaPhoneAlt className="mr-2" />
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
