import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaUserCheck,
  FaIdCard,
  FaSearch,
  FaCar,
  FaMoneyBillWave,
  FaMapMarkedAlt,
  FaShippingFast,
  FaCheckCircle,
  FaMobile,
  FaClock,
  FaRoute,
  FaHeadset,
  FaShieldAlt,
  FaHandshake,
  FaChartLine
} from "react-icons/fa";
import { Link } from "react-router-dom";

const HowItWorks = () => {
  const [selectedTab, setSelectedTab] = useState("onboarding");
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [timelineLoaded, setTimelineLoaded] = useState(false);
  const [expandedFeature, setExpandedFeature] = useState(null);

  // Set dynamic page title when component mounts
  useEffect(() => {
    // Update the document title
    document.title = "How Shiftly Works | Driver Guide | Shiftly - A Seamless Transport System";
    
    // Optional: Restore the original title when component unmounts
    return () => {
      document.title = "Shiftly | A Seamless Transport System";
    };
  }, []);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  // Check for screen size
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    handleResize(); // Check on initial load
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Set timeline loaded state after component mount
  useEffect(() => {
    // Short delay to ensure elements are properly rendered
    const timer = setTimeout(() => {
      setTimelineLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [selectedTab]);
  
  // Toggle expanded feature for mobile view
  const toggleFeature = (index) => {
    setExpandedFeature(expandedFeature === index ? null : index);
  };

  // List of onboarding steps for drivers
  const onboardingSteps = [
    {
      title: "Sign up / Login",
      description: "Create your driver account or login to access the platform.",
      icon: <FaUserCheck className="text-3xl text-white" />,
      color: "#FF5757",
    },
    {
      title: "Complete Profile",
      description: "Add your personal details, vehicle information, and upload required documents.",
      icon: <FaIdCard className="text-3xl text-white" />,
      color: "#FF9F57",
    },
    {
      title: "Vehicle Verification",
      description: "Submit your vehicle documents for verification by our team.",
      icon: <FaCar className="text-3xl text-white" />,
      color: "#5E8BFF",
    },
    {
      title: "Background Check",
      description: "Pass our background verification process for safety and security.",
      icon: <FaShieldAlt className="text-3xl text-white" />,
      color: "#57C9FF",
    },
    {
      title: "Approval Process",
      description: "Get approved by our team to start accepting booking requests.",
      icon: <FaCheckCircle className="text-3xl text-white" />,
      color: "#66CC8A",
    },
    {
      title: "Start Earning",
      description: "Access available bookings and start earning with Shiftly.",
      icon: <FaMoneyBillWave className="text-3xl text-white" />,
      color: "#8557FF",
    },
  ];

  // List of booking process steps for drivers
  const bookingSteps = [
    {
      title: "Browse Available Bookings",
      description: "View and filter available booking requests in your area.",
      icon: <FaSearch className="text-3xl text-white" />,
      color: "#FF5757",
    },
    {
      title: "Check Booking Details",
      description: "Review shipment details, pickup and delivery locations, and payment info.",
      icon: <FaRoute className="text-3xl text-white" />,
      color: "#FF9F57",
    },
    {
      title: "Place Your Bid",
      description: "Submit your competitive price bid for the booking you want to accept.",
      icon: <FaMoneyBillWave className="text-3xl text-white" />,
      color: "#5E8BFF",
    },
    {
      title: "Get Selected",
      description: "If selected by the customer, you'll receive a booking confirmation.",
      icon: <FaHandshake className="text-3xl text-white" />,
      color: "#57C9FF",
    },
    {
      title: "Complete Delivery",
      description: "Pick up the shipment and deliver it to the destination on time.",
      icon: <FaShippingFast className="text-3xl text-white" />,
      color: "#66CC8A",
    },
    {
      title: "Get Paid",
      description: "Receive your payment directly to your account after successful delivery.",
      icon: <FaCheckCircle className="text-3xl text-white" />,
      color: "#8557FF",
    },
  ];

  // Enhanced list of driver benefits
  const benefits = [
    {
      title: "Flexible Schedule",
      description: "Work on your own terms and schedule. Choose when you want to work and which bookings to accept.",
      icon: <FaClock className="text-3xl text-white" />,
      color: "#FF5757",
    },
    {
      title: "Competitive Earnings",
      description: "Earn competitive rates for each delivery. Set your own bid amounts based on your expertise and vehicle.",
      icon: <FaMoneyBillWave className="text-3xl text-white" />,
      color: "#5E8BFF",
    },
    {
      title: "Real-time Navigation",
      description: "Access optimized routes for efficient deliveries. Our system helps you navigate to pickup and delivery locations.",
      icon: <FaMapMarkedAlt className="text-3xl text-white" />,
      color: "#66CC8A",
    },
    {
      title: "Instant Notifications",
      description: "Receive real-time alerts about new bookings, bid statuses, and customer messages directly on your mobile.",
      icon: <FaMobile className="text-3xl text-white" />,
      color: "#FF9F57",
    },
    {
      title: "Growth Opportunities",
      description: "Increase your earnings potential through good ratings and performance metrics. Build your reputation to get more bookings.",
      icon: <FaChartLine className="text-3xl text-white" />,
      color: "#57C9FF",
    },
    {
      title: "24/7 Support",
      description: "Our dedicated driver support team is available round the clock to assist you with any issues or concerns.",
      icon: <FaHeadset className="text-3xl text-white" />,
      color: "#8557FF",
    },
    {
      title: "Route Optimization",
      description: "Get access to intelligent route planning tools that help you save time and fuel costs.",
      icon: <FaRoute className="text-3xl text-white" />,
      color: "#FF5757",
    },
    {
      title: "Transparent System",
      description: "Our transparent platform ensures fair booking assignments and clear payment structures with no hidden deductions.",
      icon: <FaHandshake className="text-3xl text-white" />,
      color: "#66CC8A",
    },
  ];

  return (
    <div className="">
      {/* Hero Section with Background Gradient */}
      <section className="relative py-20 px-6 bg-gradient-to-r from-gray-900 to-body-dark overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: "url('/assets/worldmap.png')" }}
        ></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-block bg-primary px-6 py-2 rounded-full text-white font-bold mb-4"
          >
            Driver Partnership
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
          >
            How Shiftly Works for Drivers
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Join our network of professional drivers and start earning on your own terms.
            We've made it simple to get started and find delivery opportunities.
          </motion.p>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedTab("onboarding")}
            className={`px-6 py-4 font-bold text-lg transition-all cursor-pointer ${
              selectedTab === "onboarding"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500 hover:text-primary"
            }`}
          >
            Driver Onboarding
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedTab("booking")}
            className={`px-6 py-4 font-bold text-lg transition-all cursor-pointer ${
              selectedTab === "booking"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500 hover:text-primary"
            }`}
          >
            Booking Process
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedTab("benefits")}
            className={`px-6 py-4 font-bold text-lg transition-all cursor-pointer ${
              selectedTab === "benefits"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500 hover:text-primary"
            }`}
          >
            Driver Benefits
          </motion.button>
        </div>
      </div>

      {/* Onboarding Process Section - Enhanced Timeline */}
      {selectedTab === "onboarding" && (
        <section className="py-16 px-4 sm:px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-center text-body-dark mb-16"
            >
              Get Started in{" "}
              <span className="text-primary">6 Simple Steps</span>
            </motion.h2>

            <div className="relative">
              {/* Timeline container with preload class */}
              <div
                className={`booking-timeline ${
                  timelineLoaded ? "timeline-loaded" : "timeline-preload"
                }`}
              >
                {onboardingSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`timeline-item ${
                      index % 2 === 0 ? "left" : "right"
                    }`}
                  >
                    {/* Step number with improved border */}
                    <motion.div 
                      className="step-number-container"
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                    >
                      <div
                        className="step-number"
                        style={{
                          background: `linear-gradient(135deg, ${step.color}, ${step.color}DD)`,
                          color: "white",
                        }}
                      >
                        {index + 1}
                      </div>
                    </motion.div>

                    {/* Content with accent color */}
                    <motion.div
                      className="timeline-content"
                      style={{ borderColor: step.color }}
                      whileHover={{ 
                        y: -5, 
                        boxShadow: "0 15px 35px rgba(0,0,0,0.1)" 
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <div
                        className="icon-container"
                        style={{ background: step.color }}
                      >
                        {step.icon}
                        <div
                          className="icon-pulse"
                          style={{ borderColor: step.color }}
                        ></div>
                      </div>
                      <h3 className="step-title" style={{ color: step.color }}>
                        {step.title}
                      </h3>
                      <p className="step-description">{step.description}</p>
                      <div
                        className="glow-dot"
                        style={{ background: step.color }}
                      ></div>
                    </motion.div>

                    {/* Add connection dot for last step */}
                    {index === onboardingSteps.length - 1 && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.6 }}
                        className="timeline-end"
                        style={{ background: step.color }}
                      ></motion.div>
                    )}

                    {/* Add connection dot for first step */}
                    {index === 0 && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="timeline-start"
                        style={{ background: onboardingSteps[0].color }}
                      ></motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-20 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Link
                  to="/signup"
                  className="inline-block bg-primary hover:bg-body-dark text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 text-lg shadow-lg transform hover:-translate-y-1 hover:shadow-xl cursor-pointer"
                >
                  Sign Up Now
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Booking Process Section - Enhanced Timeline */}
      {selectedTab === "booking" && (
        <section className="py-16 px-4 sm:px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-center text-body-dark mb-16"
            >
              Booking Process in{" "}
              <span className="text-primary">6 Easy Steps</span>
            </motion.h2>

            <div className="relative">
              {/* Timeline container with preload class */}
              <div
                className={`booking-timeline ${
                  timelineLoaded ? "timeline-loaded" : "timeline-preload"
                }`}
              >
                {bookingSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`timeline-item ${
                      index % 2 === 0 ? "left" : "right"
                    }`}
                  >
                    {/* Step number with improved border */}
                    <motion.div 
                      className="step-number-container"
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                    >
                      <div
                        className="step-number"
                        style={{
                          background: `linear-gradient(135deg, ${step.color}, ${step.color}DD)`,
                          color: "white",
                        }}
                      >
                        {index + 1}
                      </div>
                    </motion.div>

                    {/* Content with accent color */}
                    <motion.div
                      className="timeline-content"
                      style={{ borderColor: step.color }}
                      whileHover={{ 
                        y: -5, 
                        boxShadow: "0 15px 35px rgba(0,0,0,0.1)" 
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <div
                        className="icon-container"
                        style={{ background: step.color }}
                      >
                        {step.icon}
                        <div
                          className="icon-pulse"
                          style={{ borderColor: step.color }}
                        ></div>
                      </div>
                      <h3 className="step-title" style={{ color: step.color }}>
                        {step.title}
                      </h3>
                      <p className="step-description">{step.description}</p>
                      <div
                        className="glow-dot"
                        style={{ background: step.color }}
                      ></div>
                    </motion.div>

                    {/* Add connection dot for last step */}
                    {index === bookingSteps.length - 1 && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.6 }}
                        className="timeline-end"
                        style={{ background: step.color }}
                      ></motion.div>
                    )}

                    {/* Add connection dot for first step */}
                    {index === 0 && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="timeline-start"
                        style={{ background: bookingSteps[0].color }}
                      ></motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-20 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Link
                  to="/available-bookings"
                  className="inline-block bg-primary hover:bg-body-dark text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 text-lg shadow-lg transform hover:-translate-y-1 hover:shadow-xl cursor-pointer"
                >
                  View Available Bookings
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Benefits Section */}
      {selectedTab === "benefits" && (
        <section className="py-16 px-4 sm:px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-center text-body-dark mb-16"
            >
              Why Drive With <span className="text-primary">Shiftly</span>?
            </motion.h2>

            {/* Benefits Grid for desktop and tablet */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ 
                    y: -10, 
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)" 
                  }}
                  className="feature-card"
                  style={{ borderTopColor: benefit.color }}
                >
                  <div className="feature-icon-container">
                    <motion.div
                      className="feature-icon"
                      style={{ background: benefit.color }}
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {benefit.icon}
                    </motion.div>
                    <div
                      className="feature-highlight"
                      style={{ background: benefit.color }}
                    ></div>
                  </div>
                  <h3
                    className="feature-title"
                    style={{ color: benefit.color }}
                  >
                    {benefit.title}
                  </h3>
                  <p className="feature-description">{benefit.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Mobile Benefits Cards (Stacked) */}
            <div className="md:hidden space-y-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileTap={() => toggleFeature(index)}
                  className="mobile-feature-card"
                  style={{ borderLeftColor: benefit.color }}
                >
                  <div className="flex items-center mb-3">
                    <motion.div
                      className="mobile-feature-icon"
                      style={{ background: benefit.color }}
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {benefit.icon}
                    </motion.div>
                    <h3
                      className="mobile-feature-title"
                      style={{ color: benefit.color }}
                    >
                      {benefit.title}
                    </h3>
                  </div>
                  <p className="mobile-feature-description">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-gray-900 to-body-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto text-center text-white relative z-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Journey with Shiftly?
          </h2>
          <p className="text-lg mb-8 text-gray-200">
            Join thousands of drivers who trust Shiftly for consistent earning opportunities.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/signup"
                className="block bg-primary text-white hover:bg-white hover:text-primary font-bold py-3 px-8 rounded-lg transition-all duration-300 text-lg shadow-lg transform hover:-translate-y-1 hover:shadow-xl cursor-pointer"
              >
                Register as Driver
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/login"
                className="block bg-transparent border-2 border-white text-white hover:bg-white hover:text-body-dark font-bold py-3 px-8 rounded-lg transition-all duration-300 text-lg cursor-pointer"
              >
                Login to Account
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Enhanced CSS for timeline and features */}
      <style jsx>{`
        /* Timeline Styles */
        .booking-timeline {
          position: relative;
          max-width: 1200px;
          margin: 0 auto;
          min-height: 800px;
        }

        /* Timeline preload state - hide until ready */
        .timeline-preload::after {
          opacity: 0;
        }

        .timeline-loaded::after {
          opacity: 1;
          transition: opacity 0.5s ease-in-out;
        }

        .booking-timeline::after {
          content: "";
          position: absolute;
          width: 6px;
          background: linear-gradient(to bottom, #ff5757, #8557ff);
          top: 20px; /* Start from first step */
          bottom: 20px; /* End at last step */
          left: 50%;
          margin-left: -3px;
          border-radius: 10px;
          z-index: 1;
        }

        /* Timeline Items */
        .timeline-item {
          padding: 10px 40px;
          position: relative;
          width: 50%;
          margin-bottom: 70px;
          z-index: 5;
        }

        /* Left side items */
        .timeline-item.left {
          left: 0;
        }

        /* Right side items */
        .timeline-item.right {
          left: 50%;
        }

        /* Enhanced Start and End dots */
        .timeline-start,
        .timeline-end {
          position: absolute;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          z-index: 2;
          left: 50%;
          transform: translateX(-50%);
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        }

        .timeline-start {
          top: 0;
        }

        .timeline-end {
          bottom: 0;
        }

        /* Enhanced Step Number */
        .step-number-container {
          position: absolute;
          width: 50px;
          height: 50px;
          right: -25px;
          top: 15px;
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .step-number {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          font-weight: bold;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2),
            0 2px 5px rgba(0, 0, 0, 0.1);
          position: relative;
          z-index: 17;
          border: 3px solid white;
        }

        /* Place the step number for the right side */
        .timeline-item.right .step-number-container {
          left: -25px;
        }

        /* The actual content */
        .timeline-content {
          padding: 25px 30px;
          background-color: white;
          position: relative;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.07);
          border-left: 5px solid transparent;
          transition: all 0.3s ease;
          overflow: hidden;
        }

        .timeline-item.right .timeline-content {
          border-left: none;
          border-right: 5px solid transparent;
        }

        .timeline-content:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
        }

        /* Glowing dot effect */
        .glow-dot {
          position: absolute;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          bottom: 15px;
          right: 15px;
          opacity: 0.7;
          filter: blur(1px);
        }

        /* Step content styling */
        .icon-container {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 15px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
          position: relative;
        }

        .icon-pulse {
          position: absolute;
          top: -5px;
          left: -5px;
          right: -5px;
          bottom: -5px;
          border: 2px solid transparent;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          70% {
            transform: scale(1.1);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }

        .step-title {
          font-size: 1.4rem;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .step-description {
          color: #666;
          line-height: 1.6;
          font-size: 1.05rem;
        }

        /* Enhanced Feature Cards */
        .feature-card {
          background: white;
          padding: 30px 25px;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          border-top: 5px solid;
          position: relative;
          overflow: hidden;
        }

        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .feature-icon-container {
          position: relative;
          margin-bottom: 20px;
        }

        .feature-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          position: relative;
          z-index: 2;
        }

        .feature-highlight {
          position: absolute;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          opacity: 0.1;
          z-index: 1;
        }

        .feature-title {
          font-size: 1.4rem;
          font-weight: bold;
          margin-bottom: 15px;
        }

        .feature-description {
          color: #666;
          line-height: 1.6;
          flex-grow: 1;
          font-size: 1.05rem;
        }

        /* Mobile Feature Cards */
        .mobile-feature-card {
          background: white;
          padding: 20px;
          border-radius: 16px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          border-left: 5px solid;
          transition: all 0.3s ease;
        }

        .mobile-feature-card:hover {
          transform: translateX(5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .mobile-feature-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
          flex-shrink: 0;
        }

        .mobile-feature-title {
          font-size: 1.2rem;
          font-weight: bold;
        }

        .mobile-feature-description {
          color: #666;
          line-height: 1.5;
          margin-top: 5px;
          padding-left: 65px;
        }

        /* Responsive Timeline */
        @media screen and (max-width: 768px) {
          .booking-timeline {
            min-height: 1000px;
          }

          .booking-timeline::after {
            left: 30px;
          }

          .timeline-item {
            width: 100%;
            padding-left: 70px;
            padding-right: 20px;
            left: 0;
          }

          .timeline-item.right {
            left: 0;
          }

          .step-number-container {
            left: 6px;
            right: auto;
          }

          .timeline-item.right .step-number-container {
            left: 6px;
          }

          .timeline-item.right .timeline-content {
            border-right: none;
            border-left: 5px solid;
          }

          .timeline-content {
            max-width: 100%;
          }

          .timeline-start,
          .timeline-end {
            left: 30px;
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

export default HowItWorks;