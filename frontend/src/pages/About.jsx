import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { FaArrowRight, FaCheckCircle, FaGlobe, FaAward } from "react-icons/fa";
import TeamMembers from "../components/TeamMembers";

const AboutUs = () => {
  const navigate = useNavigate();
  const numbersSectionRef = useRef(null);
  const isInView = useInView(numbersSectionRef, { once: true, amount: 0.3 });


  // Set dynamic page title when component mounts
  useEffect(() => {
    // Update the document title
    document.title = "About Us | Learn Our Story | Shiftly - A Seamless Transport System";
    
    // Optional: Restore the original title when component unmounts
    return () => {
      document.title = "Shiftly | A Seamless Transport System";
    };
  }, []);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  // Counter component for statistics
  const Counter = ({ end, duration = 2000 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (isInView) {
        let start = 0;
        const increment = end / (duration / 16);

        const timer = setInterval(() => {
          start += increment;
          setCount(Math.floor(start));

          if (start >= end) {
            clearInterval(timer);
            setCount(end);
          }
        }, 16);

        return () => clearInterval(timer);
      }
    }, [isInView, end, duration]);

    return <span>{count}</span>;
  };

  return (
    <div className="bg-white pt-20">
      {/* Hero Section */}
      <section className="relative py-18 overflow-hidden bg-red-50">
        <div className="container mx-auto px-4 relative z-10 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            <motion.div
              className="lg:w-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-block bg-red-100 text-red-600 px-4 py-1 rounded-full text-sm font-semibold mb-6">
                ABOUT US
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Modernizing Transport Services for India
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Shiftly connects customers with transport providers through a
                seamless digital platform, making shifting simple, reliable, and
                affordable.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate("/login")}
                  className="px-6 py-3 bg-gradient-to-br from-red-500 to-pink-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all duration-300 flex items-center shadow-lg hover:shadow-red-200 cursor-pointer hover:scale-105"
                >
                  Book Now
                  <FaArrowRight className="ml-2" />
                </button>
                <button
                  onClick={() => navigate("/contact-us")}
                  className="px-6 py-3 bg-white border border-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center shadow-sm cursor-pointer"
                >
                  Contact Us
                </button>
              </div>
            </motion.div>

        <motion.div
              className="lg:w-1/2 flex justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2, type: "spring" }}
            >
              <img
                src="https://illustrations.popsy.co/red/paper-plane.svg"
                alt="Shiftly Illustration"
                className="max-w-md w-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="flex flex-col lg:flex-row gap-17 items-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="lg:w-1/2 order-1 lg:order-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="inline-block bg-red-100 text-red-600 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                    OUR STORY
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                    Addressing Real-World Challenges
                  </h2>
                  <p className="text-gray-700 mb-6 md:mb-4 leading-relaxed">
                    Shiftly began as a simple idea born from a real-world problem. Our team member, Suman Shaw, faced difficulties while shifting his home — he struggled to find trusted drivers in his area, and the few available ones quoted extremely high prices. This experience highlighted a larger gap in the logistics industry, where there was no easy, transparent, and affordable solution for everyday people to move their goods safely.ort providers.
                  </p>
                  <p className="text-gray-700 mb-6 md:mb-4 leading-relaxed">
                    When the time came to select a project for our final year at Guru Nanak Institute of Technology, Suman proposed the idea of Shiftly to the team — Sudipto Das, Sujash Das, Subhadeep Dutta, and Swarnali Das. After many brainstorming sessions, reviewing different project possibilities, and understanding the real need in the market, we unanimously decided to bring Shiftly to life.
                  </p>
                  <p className="text-gray-700 mb-6 md:mb-4 leading-relaxed">
                    We wanted to create a platform that not only connects customers with drivers but also ensures fairness, transparency, and ease at every step of the process. Shiftly is more than just a college project for us — it is a solution built out of personal experience, teamwork, and the drive to solve real problems through technology.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    This is the journey that brought Shiftly into existence — a project built with passion, innovation, and a mission to make transportation seamless for everyone.
                  </p>
                </motion.div>
              </div>

              <motion.div
                className="lg:w-1/2 order-2 lg:order-2 flex justify-center"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <img
                  src="https://illustrations.popsy.co/red/communication.svg"
                  alt="Team Communication"
                  className="max-w-lg w-full"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-100 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30 translate-y-1/2 -translate-x-1/3"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block bg-red-100 text-red-600 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                OUR PURPOSE
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Mission & Vision
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Guided by our core values of integrity, innovation, and
                customer-centricity
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <motion.div
                className="relative overflow-hidden bg-white rounded-2xl shadow-xl p-10 border border-red-100"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {/* Background gradient */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-gradient-to-br from-red-200 to-red-100 rounded-full"></div>
                <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-gradient-to-br from-red-100 to-white rounded-full"></div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-200 text-white text-3xl mb-8 -rotate-6 transform hover:rotate-0 transition-all duration-300">
                    <FaGlobe />
                  </div>

                  <h3 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
                    Our Mission
                  </h3>

                  <p className="text-gray-700 leading-relaxed mb-8">
                    To revolutionize India&apos;s transport ecosystem by
                    providing a transparent, reliable, and efficient platform
                    that connects customers with quality transport services. We
                    strive to simplify the logistics experience through
                    cutting-edge technology while creating sustainable
                    livelihoods for transport partners.
                  </p>

                  <div className="space-y-4">
                    {[
                      "Make quality transport accessible to everyone",
                      "Leverage technology to optimize routes and reduce costs",
                      "Ensure transparency in pricing and service delivery",
                      "Support the growth of independent transport professionals",
                    ].map((item, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-6 h-6 rounded-full bg-red-100 border border-red-200 flex items-center justify-center text-red-600 mr-3 mt-0.5 flex-shrink-0">
                          <FaCheckCircle size={12} />
                        </div>
                        <p className="text-gray-700">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="relative overflow-hidden bg-white rounded-2xl shadow-xl p-10 border border-blue-100"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {/* Background gradient */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-gradient-to-br from-blue-200 to-blue-100 rounded-full"></div>
                <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-gradient-to-br from-blue-100 to-white rounded-full"></div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-200 text-white text-3xl mb-8 rotate-6 transform hover:rotate-0 transition-all duration-300">
                    <FaAward />
                  </div>

                  <h3 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
                    Our Vision
                  </h3>

                  <p className="text-gray-700 leading-relaxed mb-8">
                    To become the most trusted transport platform in India,
                    known for reliability, innovation, and customer
                    satisfaction. We envision a future where logistics
                    challenges are solved through smart technology, creating a
                    seamless connection between customers and service providers
                    while contributing to a more sustainable transportation
                    ecosystem.
                  </p>

                  <div className="space-y-4">
                    {[
                      "Create India's largest and most trusted transport network",
                      "Set new standards for service quality in the industry",
                      "Empower communities through technology and accessibility",
                      "Build a sustainable business model that benefits all stakeholders",
                    ].map((item, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-6 h-6 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 mr-3 mt-0.5 flex-shrink-0">
                          <FaCheckCircle size={12} />
                        </div>
                        <p className="text-gray-700">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact in Numbers */}
      <section ref={numbersSectionRef} className="py-20 bg-red-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto gap-12">
            <motion.div
              className="md:w-1/2 mb-8 md:mb-0"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-block bg-red-100 text-red-600 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                OUR IMPACT
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                Making A Difference In Transport
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                At Shiftly, we measure our success by the positive impact we
                create for our customers and communities. Our platform is making
                transportation more accessible, affordable, and efficient across
                India.
              </p>
              <button
                onClick={() => navigate("/contact-us")}
                className="px-6 py-3 bg-gradient-to-br from-red-500 to-pink-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all duration-300 flex items-center shadow-md cursor-pointer"
              >
                Contact Us
                <FaArrowRight className="ml-2" />
              </button>
          </motion.div>

          <motion.div
              className="md:w-1/2 flex justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <img
                src="https://illustrations.popsy.co/red/business-success-chart.svg"
                alt="Business Success Chart"
                className="max-w-md w-full"
              />
          </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-7xl mx-auto mt-16">
            {[
              { number: 10000, suffix: "+", label: "Registered Users" },
              { number: 5000, suffix: "+", label: "Deliveries Completed" },
              { number: 500, suffix: "+", label: "Verified Drivers" },
              { number: 32, suffix: "+", label: "Cities Covered" },
              { number: 98, suffix: "%", label: "Customer Satisfaction" },
            ].map((stat, index) => (
          <motion.div
                key={index}
                className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition-all duration-300 border border-gray-100"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3 className="text-4xl font-bold mb-2 text-gray-900">
                  {isInView ? (
                    <>
                      <Counter end={stat.number} />
                      {stat.suffix}
                    </>
                  ) : (
                    "0"
                  )}
                </h3>
                <p className="text-gray-600">{stat.label}</p>
          </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block bg-red-100 text-red-600 px-4 py-1 rounded-full text-sm font-semibold mb-4">
              OUR PRINCIPLES
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Core Values That Drive Us
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              These fundamental beliefs guide our decisions, shape our culture,
              and define how we serve our customers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "Customer Obsession",
                description:
                  "We put customers first in everything we do, continuously seeking ways to exceed their expectations and add value.",
                icon: "💯",
              },
              {
                title: "Transparency",
                description:
                  "We believe in open, honest communication with our customers, partners, and team members at all times.",
                icon: "🔍",
              },
              {
                title: "Innovation",
                description:
                  "We constantly challenge the status quo, embracing new technologies and ideas to improve our services.",
                icon: "💡",
              },
              {
                title: "Reliability",
                description:
                  "We deliver on our promises, ensuring consistent quality and dependability in all our operations.",
                icon: "🤝",
              },
              {
                title: "Inclusivity",
                description:
                  "We create opportunities for all, regardless of background, and value diverse perspectives.",
                icon: "🌈",
              },
              {
                title: "Sustainability",
                description:
                  "We're committed to environmentally responsible practices and creating long-term positive impact.",
                icon: "🌱",
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Members */}
      <TeamMembers />

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16"
          initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
              <span className="inline-block bg-red-100 text-red-600 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                OUR ADVANTAGES
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Choose Shiftly?
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Our platform stands out with these innovative features and
                benefits
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                {[
                  {
                    title: "User-Centric Design",
                    description:
                      "Intuitive interface designed with extensive user testing and feedback to ensure a seamless experience for all users.",
                  },
                  {
                    title: "Transparent Pricing",
                    description:
                      "Dynamic pricing algorithm that provides fair estimates based on distance, vehicle type, and real-time demand factors.",
                  },
                  {
                    title: "Driver Verification",
                    description:
                      "Comprehensive verification process for all drivers, ensuring reliability and security for every transport booking.",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="w-12 h-12 rounded-lg bg-red-600 flex-shrink-0 flex items-center justify-center text-white">
                      <FaCheckCircle />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-8">
                {[
                  {
                    title: "Real-Time Tracking",
                    description:
                      "Advanced tracking system allowing customers to monitor their shipment's location and estimated arrival time throughout the journey.",
                  },
                  {
                    title: "Multiple Payment Options",
                    description:
                      "Support for various payment methods including credit/debit cards, mobile wallets, and cash on delivery for maximum flexibility.",
                  },
                  {
                    title: "Security & Privacy Focus",
                    description:
                      "Built with industry standard security practices to protect user data, transaction details, and communication within the platform.",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                  >
                    <div className="w-12 h-12 rounded-lg bg-blue-600 flex-shrink-0 flex items-center justify-center text-white">
                      <FaCheckCircle />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="text-center mt-12">
              <button
                onClick={() => navigate("/services")}
                className="px-8 py-3 bg-gradient-to-br from-red-500 to-pink-600 text-white rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-red-200 flex items-center mx-auto cursor-pointer hover:translate-x-1"
              >
                Explore the Features
                <FaArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-red-50 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block bg-red-100 text-red-600 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                GET IN TOUCH
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                Join Us On Our Journey
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We&apos;re proud of what we&apos;ve built at Shiftly. Our
                platform represents our vision for the future of transport
                services in India - bringing transparency, reliability, and
                efficiency to the logistics industry.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Whether you&apos;re a potential user, an industry expert with
                feedback, or interested in our services, we&apos;d love to hear
                from you. Our team is passionate about making transportation
                better for everyone.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate("/signup")}
                  className="px-6 py-3 bg-gradient-to-br from-red-500 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-red-200 transition-all duration-300 flex items-center cursor-pointer"
                >
                  Join Now
                  <FaArrowRight className="ml-2" />
                </button>
                <button
                  onClick={() => navigate("/how-it-works")}
                  className="px-6 py-3 bg-white border border-red-200 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-all duration-300 flex items-center cursor-pointer"
                >
                  See How It Works
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center"
            >
              <img
                src="https://illustrations.popsy.co/red/shaking-hands.svg"
                alt="Collaboration"
                className="max-w-md w-full"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
