import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaPhone, FaEnvelope, FaChevronRight } from "react-icons/fa";
import logo from "../assets/logo.png";

const Terms = () => {
  // Create refs for each section
  const sectionRefs = {
    introduction: useRef(null),
    eligibility: useRef(null),
    account: useRef(null),
    service: useRef(null),
    vehicle: useRef(null),
    payment: useRef(null),
    safety: useRef(null),
    termination: useRef(null),
    privacy: useRef(null),
    dispute: useRef(null),
    contact: useRef(null),
  };

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const scrollToSection = (sectionRef) => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Table of Contents data
  const tableOfContents = [
    { id: "introduction", title: "Introduction" },
    { id: "eligibility", title: "Eligibility Requirements" },
    { id: "account", title: "Account Management" },
    { id: "service", title: "Service Standards" },
    { id: "vehicle", title: "Vehicle Requirements" },
    { id: "payment", title: "Payment Terms" },
    { id: "safety", title: "Safety and Security" },
    { id: "termination", title: "Termination Clauses" },
    { id: "privacy", title: "Privacy and Data" },
    { id: "dispute", title: "Dispute Resolution" },
    { id: "contact", title: "Contact Information" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="Shiftly"
              className="h-10 w-auto object-contain"
            />
          </Link>
          <Link
            to="/signup"
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            Join as Driver
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Table of Contents - Sticky Sidebar */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 bg-white rounded-xl shadow-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Table of Contents
              </h3>
              <nav className="space-y-2">
                {tableOfContents.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(sectionRefs[item.id])}
                    className="block w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    {item.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 space-y-8">
              {/* Title Section */}
              <div className="text-center space-y-2 pb-6 border-b">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  Driver Terms & Conditions
                </h1>
                <p className="text-gray-600">
                  Last Updated: {new Date().toLocaleDateString()}
                </p>
              </div>

              {/* Mobile Table of Contents */}
              <div className="lg:hidden bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Quick Navigation
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {tableOfContents.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(sectionRefs[item.id])}
                      className="flex items-center text-sm text-gray-700 hover:text-red-600"
                    >
                      <FaChevronRight className="mr-2 text-xs" />
                      {item.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Terms Content */}
              <div className="space-y-12 text-gray-700">
                {/* Introduction */}
                <section
                  ref={sectionRefs.introduction}
                  className="scroll-mt-24 space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 pb-2 border-b">
                    1. Introduction
                  </h2>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      Welcome to Shiftly, your trusted partner in the delivery
                      service industry. These Terms and Conditions constitute a
                      legally binding agreement between you ("Driver" or "You")
                      and Shiftly ("Company," "We," or "Us"). This document
                      outlines your rights, obligations, and responsibilities as
                      a driver on our platform.
                    </p>
                    <p className="text-gray-700 leading-relaxed mt-4">
                      By registering as a driver on Shiftly, you acknowledge
                      that you have read, understood, and agree to be bound by
                      these terms. These terms may be updated periodically, and
                      you will be notified of any significant changes.
                    </p>
                  </div>
                </section>

                {/* Eligibility Requirements */}
                <section
                  ref={sectionRefs.eligibility}
                  className="scroll-mt-24 space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 pb-2 border-b">
                    2. Eligibility Requirements
                  </h2>
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Basic Requirements
                      </h3>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <span className="flex-shrink-0 h-6 w-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center mt-0.5">
                            18+
                          </span>
                          <span className="ml-3">
                            <strong className="block text-gray-900">
                              Age Requirement
                            </strong>
                            <span className="text-gray-600">
                              Must be at least 18 years old with valid
                              government ID proof.
                            </span>
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="flex-shrink-0 h-6 w-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center mt-0.5">
                            📄
                          </span>
                          <span className="ml-3">
                            <strong className="block text-gray-900">
                              Valid Driving License
                            </strong>
                            <span className="text-gray-600">
                              You must hold a valid driving license appropriate
                              for the vehicle you will be using.
                            </span>
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="flex-shrink-0 h-6 w-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center mt-0.5">
                            🚗
                          </span>
                          <span className="ml-3">
                            <strong className="block text-gray-900">
                              Vehicle Ownership
                            </strong>
                            <span className="text-gray-600">
                              You must own or have access to a vehicle that
                              meets our requirements.
                            </span>
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="flex-shrink-0 h-6 w-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center mt-0.5">
                            ✅
                          </span>
                          <span className="ml-3">
                            <strong className="block text-gray-900">
                              Background Verification
                            </strong>
                            <span className="text-gray-600">
                              You must pass our background verification process.
                            </span>
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="flex-shrink-0 h-6 w-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center mt-0.5">
                            🛡️
                          </span>
                          <span className="ml-3">
                            <strong className="block text-gray-900">
                              Valid Insurance
                            </strong>
                            <span className="text-gray-600">
                              You must maintain valid vehicle insurance.
                            </span>
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="flex-shrink-0 h-6 w-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center mt-0.5">
                            📜
                          </span>
                          <span className="ml-3">
                            <strong className="block text-gray-900">
                              Clean Driving Record
                            </strong>
                            <span className="text-gray-600">
                              You must have a clean driving record with no major
                              violations.
                            </span>
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="flex-shrink-0 h-6 w-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center mt-0.5">
                            📝
                          </span>
                          <span className="ml-3">
                            <strong className="block text-gray-900">
                              Accurate Information
                            </strong>
                            <span className="text-gray-600">
                              You must provide accurate personal and vehicle
                              information.
                            </span>
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Account Management */}
                <section
                  ref={sectionRefs.account}
                  className="scroll-mt-24 space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 pb-2 border-b">
                    3. Account Management
                  </h2>
                  <div className="space-y-2">
                    <p>As a driver, you are responsible for:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        Maintaining the confidentiality of your account
                        credentials.
                      </li>
                      <li>Keeping your profile information up to date.</li>
                      <li>
                        Reporting any unauthorized access to your account.
                      </li>
                      <li>Maintaining a professional profile picture.</li>
                      <li>
                        Ensuring your contact information is always current.
                      </li>
                    </ul>
                  </div>
                </section>

                {/* Service Standards */}
                <section
                  ref={sectionRefs.service}
                  className="scroll-mt-24 space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 pb-2 border-b">
                    4. Service Standards
                  </h2>
                  <div className="space-y-2">
                    <p>
                      Drivers must maintain high service standards, including:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Maintaining a minimum rating of 4.0 stars.</li>
                      <li>
                        Accepting at least 80% of delivery requests when online.
                      </li>
                      <li>
                        Completing deliveries within the estimated time frame.
                      </li>
                      <li>Following all delivery instructions carefully.</li>
                      <li>Maintaining professional behavior with customers.</li>
                      <li>
                        Wearing appropriate attire and maintaining personal
                        hygiene.
                      </li>
                      <li>
                        Keeping delivery vehicles clean and well-maintained.
                      </li>
                    </ul>
                  </div>
                </section>

                {/* Vehicle Requirements */}
                <section
                  ref={sectionRefs.vehicle}
                  className="scroll-mt-24 space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 pb-2 border-b">
                    5. Vehicle Requirements
                  </h2>
                  <div className="space-y-2">
                    <p>Your vehicle must meet these requirements:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        Not older than 10 years from the date of manufacture.
                      </li>
                      <li>Valid registration and insurance.</li>
                      <li>Regular maintenance and safety checks.</li>
                      <li>Appropriate capacity for delivery services.</li>
                      <li>Clean and presentable condition.</li>
                      <li>
                        Proper storage equipment for different types of
                        deliveries.
                      </li>
                    </ul>
                  </div>
                </section>

                {/* Payment Terms */}
                <section
                  ref={sectionRefs.payment}
                  className="scroll-mt-24 space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 pb-2 border-b">
                    6. Payment Terms
                  </h2>
                  <div className="space-y-2">
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        Weekly payment processing for completed deliveries.
                      </li>
                      <li>
                        Commission structure based on delivery distance and
                        type.
                      </li>
                      <li>Bonus opportunities for high performance.</li>
                      <li>Surge pricing during peak hours.</li>
                      <li>
                        Cancellation fees for customer-initiated cancellations.
                      </li>
                      <li>Tips are 100% retained by drivers.</li>
                      <li>Tax compliance is driver's responsibility.</li>
                    </ul>
                  </div>
                </section>

                {/* Safety and Security */}
                <section
                  ref={sectionRefs.safety}
                  className="scroll-mt-24 space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 pb-2 border-b">
                    7. Safety and Security
                  </h2>
                  <div className="space-y-2">
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Adherence to traffic rules and regulations.</li>
                      <li>Maintaining appropriate insurance coverage.</li>
                      <li>Following safety protocols for handling items.</li>
                      <li>Regular vehicle maintenance checks.</li>
                      <li>Reporting accidents or incidents immediately.</li>
                      <li>Following COVID-19 safety guidelines.</li>
                      <li>Using safety equipment as required.</li>
                    </ul>
                  </div>
                </section>

                {/* Termination Clauses */}
                <section
                  ref={sectionRefs.termination}
                  className="scroll-mt-24 space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 pb-2 border-b">
                    8. Termination Clauses
                  </h2>
                  <div className="space-y-2">
                    <p>Your account may be terminated for:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Maintaining a rating below 4.0 stars.</li>
                      <li>Violating any terms of service.</li>
                      <li>Fraudulent activity.</li>
                      <li>Repeated customer complaints.</li>
                      <li>Safety violations.</li>
                      <li>Inappropriate behavior.</li>
                      <li>Extended periods of inactivity.</li>
                    </ul>
                  </div>
                </section>

                {/* Privacy and Data */}
                <section
                  ref={sectionRefs.privacy}
                  className="scroll-mt-24 space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 pb-2 border-b">
                    9. Privacy and Data
                  </h2>
                  <div className="space-y-2">
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Collection and use of personal information.</li>
                      <li>Location tracking during active deliveries.</li>
                      <li>Data sharing with customers and partners.</li>
                      <li>
                        Security measures for protecting driver information.
                      </li>
                      <li>
                        Rights regarding personal data access and modification.
                      </li>
                    </ul>
                  </div>
                </section>

                {/* Dispute Resolution */}
                <section
                  ref={sectionRefs.dispute}
                  className="scroll-mt-24 space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 pb-2 border-b">
                    10. Dispute Resolution
                  </h2>
                  <div className="space-y-2">
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Process for handling customer complaints.</li>
                      <li>Arbitration procedures.</li>
                      <li>Resolution timeframes.</li>
                      <li>Appeals process.</li>
                      <li>Mediation options.</li>
                    </ul>
                  </div>
                </section>

                {/* Contact Information */}
                <section
                  ref={sectionRefs.contact}
                  className="scroll-mt-24 space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 pb-2 border-b">
                    11. Contact Information
                  </h2>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <p className="mb-4">
                      For any queries or concerns regarding these terms, please
                      contact us through:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <a
                        href="mailto:support@shiftly.com"
                        className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                          <FaEnvelope className="text-red-600" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Email Us</div>
                          <div className="text-red-600 font-medium">
                            support@shiftly.com
                          </div>
                        </div>
                      </a>
                      <a
                        href="tel:+918765432100"
                        className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                          <FaPhone className="text-red-600" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Call Us</div>
                          <div className="text-red-600 font-medium">
                            +91 8765 432100
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Shiftly. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Terms;
