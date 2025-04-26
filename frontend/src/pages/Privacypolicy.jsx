import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaPhone, FaEnvelope, FaChevronRight } from "react-icons/fa";
import logo from "../assets/Shiftly_logo.png";

const PrivacyPolicy = () => {
  // Create refs for each section
  const sectionRefs = {
    information: useRef(null),
    useInfo: useRef(null),
    shareInfo: useRef(null),
    protectInfo: useRef(null),
    rights: useRef(null),
    retention: useRef(null),
    children: useRef(null),
    changes: useRef(null),
    contact: useRef(null),
  };

  // Set dynamic page title when component mounts
  useEffect(() => {
    // Update the document title
    document.title = "Privacy Policy | Data Protection | Shiftly - A Seamless Transport System";
    
    // Optional: Restore the original title when component unmounts
    return () => {
      document.title = "Shiftly | A Seamless Transport System";
    };
  }, []);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const scrollToSection = (sectionRef) => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Table of Contents data
  const tableOfContents = [
    { id: "information", title: "Information We Collect" },
    { id: "useInfo", title: "How We Use Your Information" },
    { id: "shareInfo", title: "How We Share Your Information" },
    { id: "protectInfo", title: "How We Protect Your Information" },
    { id: "rights", title: "Your Rights & Choices" },
    { id: "retention", title: "Data Retention" },
    { id: "children", title: "Children's Privacy" },
    { id: "changes", title: "Policy Updates & Changes" },
    { id: "contact", title: "Contact Us" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-20">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
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
                <div className="flex justify-center items-center mb-4">
                  <img className="w-20 h-auto" src={logo} alt="Shiftly logo" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Privacy Policy
        </h1>
                <div className="flex flex-col sm:flex-row justify-center gap-3 text-gray-600">
                  <p>Effective Date: 16-2-2025</p>
                  <p className="hidden sm:block">•</p>
                  <p>Last Updated: 16-2-2025</p>
                </div>
              </div>

              {/* Introduction */}
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Welcome to Shiftly - A Seamless Transport System. We are
                  committed to safeguarding your privacy and ensuring that your
                  personal data is protected. This Privacy Policy explains how
                  we collect, use, and protect your information when you use our
                  services, website, and mobile application.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  By using Shiftly, you agree to the terms of this Privacy
                  Policy. Please read the full details below and refer to each
                  section for more comprehensive information.
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

              {/* Privacy Policy Content */}
              <div className="space-y-12 text-gray-700">
                {/* Information We Collect */}
                <section
                  ref={sectionRefs.information}
                  className="scroll-mt-24 space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 pb-2 border-b">
                    1. Information We Collect
          </h2>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      Shiftly collects both personal and non-personal
                      information to provide and enhance our transport services.
                      The information we gather helps us improve our service,
                      ensure user safety, and enable features such as bookings,
                      payments, and location tracking.
                    </p>

                    <div className="mt-6 space-y-6">
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          Personal Information
                        </h3>
                        <p className="text-gray-700 mb-4">
                          We may collect personal data like your name, email
                          address, phone number, and payment information when
                          you create an account, book transport services, or
                          make a payment. Additionally, drivers may be required
                          to provide government-issued IDs such as Aadhaar or
                          PAN for verification purposes. Your address details,
                          including pickup and destination locations, are also
                          collected for service delivery.
          </p>
        </div>

                      <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          Non-Personal Information
                        </h3>
                        <p className="text-gray-700 mb-4">
                          We collect non-personal data like your device
                          information (e.g., IP address, browser type, device
                          model) and usage data (e.g., pages visited, time spent
                          on the platform) to better understand how you interact
                          with our service and improve performance.
          </p>
        </div>

                      <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          Location Information
                        </h3>
          <p className="text-gray-700 mb-4">
                          To ensure accurate transport service, we collect
                          location data from users and drivers. This includes
                          real-time location tracking for drivers and
                          approximate location data for users, which helps us
                          optimize our service availability and routing.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* How We Use Your Information */}
                <section
                  ref={sectionRefs.useInfo}
                  className="scroll-mt-24 space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 pb-2 border-b">
                    2. How We Use Your Information
          </h2>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      Shiftly uses your information to provide reliable,
                      efficient transport services. Your personal data is used
                      for processing bookings, making payments, and connecting
                      users with drivers.
                    </p>

                    <div className="mt-6 space-y-6">
                      <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          Service Delivery
                        </h3>
                        <p className="text-gray-700 mb-4">
                          We use your information to complete transactions,
                          ensure accurate routing, and notify you of updates
                          during the delivery process.
          </p>
        </div>

                      <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-500">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          Service Improvement
                        </h3>
          <p className="text-gray-700 mb-4">
                          Your feedback and usage data help us improve Shiftly
                          by optimizing routes, increasing efficiency, and
                          resolving technical issues.
          </p>
        </div>

                      <div className="bg-purple-50 rounded-lg p-6 border-l-4 border-purple-500">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          Communication
                        </h3>
          <p className="text-gray-700 mb-4">
                          We may send you emails, SMS, or notifications to
                          inform you about updates, offers, and important
                          service announcements.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* How We Share Your Information */}
                <section
                  ref={sectionRefs.shareInfo}
                  className="scroll-mt-24 space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 pb-2 border-b">
                    3. How We Share Your Information
          </h2>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      At Shiftly, we share your information only with trusted
                      third parties necessary to provide our services, and only
                      when required for operations.
                    </p>

                    <div className="mt-6 space-y-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-blue-600"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            Service Providers
                          </h3>
                          <p className="text-gray-700">
                            We work with third-party service providers to
                            process payments, verify driver credentials, and
                            maintain our platform. Your information is shared
                            with them only to the extent necessary for these
                            services.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center mt-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-amber-600"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            Legal Obligations
                          </h3>
                          <p className="text-gray-700">
                            In cases where we are required to comply with legal
                            obligations, such as responding to court orders or
                            government requests, we may share your information
                            as necessary.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mt-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-green-600"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            Business Transfers
                          </h3>
                          <p className="text-gray-700">
                            In the event of a merger, acquisition, or asset
                            sale, we may transfer your information to the new
                            entity, ensuring that your privacy remains
                            protected.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* How We Protect Your Information */}
                <section
                  ref={sectionRefs.protectInfo}
                  className="scroll-mt-24 space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 pb-2 border-b">
                    4. How We Protect Your Information
          </h2>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      At Shiftly, we take data security very seriously. We
                      implement industry-standard security measures to protect
                      your information from unauthorized access, disclosure,
                      alteration, and destruction.
                    </p>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500">
                        <div className="flex items-center justify-center h-14 w-14 rounded-full bg-blue-100 mx-auto mb-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-blue-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-center text-gray-900 mb-2">
                          Encryption
                        </h3>
                        <p className="text-gray-700 text-center">
                          All sensitive information is encrypted using SSL
                          (Secure Socket Layer) technology, ensuring that your
                          personal data is protected during transmission.
          </p>
        </div>

                      <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500">
                        <div className="flex items-center justify-center h-14 w-14 rounded-full bg-green-100 mx-auto mb-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-green-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                            />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-center text-gray-900 mb-2">
                          Data Storage
                        </h3>
                        <p className="text-gray-700 text-center">
                          Your information is stored on secure servers with
                          access controls, ensuring that only authorized
                          personnel can access your data.
          </p>
        </div>

                      <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-purple-500">
                        <div className="flex items-center justify-center h-14 w-14 rounded-full bg-purple-100 mx-auto mb-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-purple-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-center text-gray-900 mb-2">
                          Regular Audits
                        </h3>
                        <p className="text-gray-700 text-center">
                          We perform regular security audits to identify and
                          address any potential vulnerabilities in our system.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Your Rights & Choices */}
                <section
                  ref={sectionRefs.rights}
                  className="scroll-mt-24 space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 pb-2 border-b">
                    5. Your Rights & Choices
                  </h2>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      You have the right to access, update, or delete your
                      personal information at any time. We are committed to
                      providing you with control over your data, including the
                      ability to opt-out of certain data processing activities.
                    </p>

                    <div className="mt-6 space-y-6">
                      <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                              />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">
                              Access to Information
                            </h3>
                            <p className="mt-2 text-gray-600">
                              You can request a copy of your personal
                              information that we have on file by contacting our
                              support team.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-md bg-green-100 text-green-600">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">
                              Update or Delete Information
                            </h3>
                            <p className="mt-2 text-gray-600">
                              If your personal information is inaccurate or
                              incomplete, you can update or delete it by
                              accessing your account settings.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-md bg-red-100 text-red-600">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                              />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">
                              Opt-Out
                            </h3>
                            <p className="mt-2 text-gray-600">
                              You can opt-out of receiving promotional emails or
                              choose to limit the data we collect by updating
                              your preferences in the settings.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Data Retention */}
                <section
                  ref={sectionRefs.retention}
                  className="scroll-mt-24 space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 pb-2 border-b">
                    6. Data Retention
          </h2>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      Shiftly retains your personal information only for as long
                      as necessary to provide our services, comply with legal
                      obligations, or resolve disputes.
                    </p>

                    <div className="mt-6 bg-gray-50 rounded-lg p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            Retention Period
                          </h3>
                          <p className="text-gray-700">
                            We retain your information as long as your account
                            is active and for a reasonable period afterward in
                            accordance with our data retention policies.
                          </p>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            Legal Compliance
                          </h3>
                          <p className="text-gray-700">
                            We may retain certain information for a longer
                            period to comply with legal obligations, such as
                            tax, regulatory, or fraud prevention requirements.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Children's Privacy */}
                <section
                  ref={sectionRefs.children}
                  className="scroll-mt-24 space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 pb-2 border-b">
                    7. Children&apos;s Privacy
          </h2>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      At Shiftly, we are committed to protecting the privacy of
                      children who may use our platform. This Children&apos;s Privacy
                      Policy explains how we handle the collection, use, and
                      disclosure of personal information from children under the
                      age of 13 in compliance with applicable laws, including
                      the Children&apos;s Online Privacy Protection Act (COPPA).
                    </p>

                    <div className="mt-6 space-y-6">
                      <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="bg-yellow-50 px-6 py-4 border-l-4 border-yellow-400">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <svg
                                className="h-5 w-5 text-yellow-400"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-yellow-800">
                                Information We Collect
                              </h3>
                              <div className="mt-2 text-sm text-yellow-700">
                                <p>
                                  We do not knowingly collect personal
                                  information from children under the age of 13.
                                  If we become aware that we have collected
                                  personal information from a child under 13
                                  without parental consent, we will take steps
                                  to delete that information.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="border-t border-gray-200 px-6 py-4">
                          <h3 className="text-lg font-medium text-gray-900">
                            Parental Consent
                          </h3>
                          <p className="mt-2 text-gray-600">
                            If Shiftly becomes aware that a user is under 13
                            years old, we will not collect personal information
                            from the child unless we receive verifiable parental
                            consent. Parents or legal guardians can provide
                            consent by contacting us at support@shiftly.com.
                          </p>
                        </div>
                        <div className="border-t border-gray-200 px-6 py-4">
                          <h3 className="text-lg font-medium text-gray-900">
                            How We Use Children&apos;s Information
                          </h3>
                          <p className="mt-2 text-gray-600">
                            We only use personal information collected from
                            children under 13 to provide services that the
                            child&apos;s parent or guardian has authorized. The
                            information will not be used for any other purpose.
                          </p>
                        </div>
                        <div className="border-t border-gray-200 px-6 py-4">
                          <h3 className="text-lg font-medium text-gray-900">
                            Parental Rights
                          </h3>
                          <p className="mt-2 text-gray-600">
                            Parents have the right to review, update, or delete
                            their child&apos;s personal information at any time. If
                            you would like to exercise these rights, please
                            contact us at support@shiftly.com.
                          </p>
                        </div>
                        <div className="border-t border-gray-200 px-6 py-4">
                          <h3 className="text-lg font-medium text-gray-900">
                            Security of Children&apos;s Information
                          </h3>
                          <p className="mt-2 text-gray-600">
                            We take appropriate security measures to protect
                            children&apos;s personal information from unauthorized
                            access, alteration, or disclosure. However, no
                            method of online transmission or storage is 100%
                            secure.
                          </p>
                        </div>
                        <div className="border-t border-gray-200 px-6 py-4">
                          <h3 className="text-lg font-medium text-gray-900">
                            Changes to This Children&apos;s Privacy Policy
                          </h3>
                          <p className="mt-2 text-gray-600">
                            We may update this Children&apos;s Privacy Policy from
                            time to time. If we make any changes, we will notify
                            parents or guardians as required by law. We
                            encourage you to review this policy periodically for
                            the latest information.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Changes to This Policy */}
                <section
                  ref={sectionRefs.changes}
                  className="scroll-mt-24 space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 pb-2 border-b">
                    8. Policy Updates & Changes
          </h2>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      Shiftly may update this Privacy Policy from time to time.
                      We will notify you of any changes by posting the revised
                      policy on our platform or by other communication methods.
                    </p>

                    <div className="mt-6 bg-red-50 rounded-lg p-6">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Notification of Changes
                          </h3>
                          <p className="mt-2 text-gray-700">
                            Major updates will be communicated directly to
                            users, while minor updates will be posted on our
                            website. We encourage you to review the Privacy
                            Policy periodically.
          </p>
        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Continued Use
                          </h3>
                          <p className="mt-2 text-gray-700">
                            Your continued use of Shiftly following any changes
                            indicates your acceptance of the updated Privacy
                            Policy.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Contact Us */}
                <section
                  ref={sectionRefs.contact}
                  className="scroll-mt-24 space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 pb-2 border-b">
                    9. Contact Us
          </h2>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      If you have any questions about our Privacy Policy or how
                      we handle your data, please don&apos;t hesitate to contact us.
                      Our dedicated privacy team is here to help.
                    </p>

                    <div className="mt-6 bg-gray-50 rounded-lg p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <a
                          href="mailto:support@shiftly.com"
                          className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                        >
                          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                            <FaEnvelope className="text-red-600 text-xl" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">
                              Email Us
                            </div>
                            <div className="text-red-600 font-medium">
                              support@shiftly.com
                            </div>
                          </div>
                        </a>
                        <a
                          href="tel:+918765432100"
                          className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                        >
                          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                            <FaPhone className="text-red-600 text-xl" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Call Us</div>
                            <div className="text-red-600 font-medium">
                              +91 8765 432100
                            </div>
                          </div>
                        </a>
                      </div>

                      <div className="mt-6 text-center">
                        <Link
                          to="/contact-us"
                          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-sm cursor-pointer hover:scale-105 transition-all duration-200 hover:shadow-lg hover:shadow-red-400"
                        >
                          Contact Support
                        </Link>
                      </div>
                    </div>
                  </div>
                </section>
        </div>

        {/* Additional Paragraphs */}
              <div className="border-t border-gray-200 pt-8 mt-8">
                <div className="prose max-w-none">
        <p className="text-gray-700 mb-4">
                    At Shiftly, we believe that transparency is key to building
                    trust with our users. This Privacy Policy outlines how your
                    data is handled and your rights in managing that data. We
                    have made every effort to ensure that your personal data is
                    only used in a manner that aligns with your expectations and
                    applicable regulations.
        </p>
        <p className="text-gray-700 mb-4">
                    We also encourage you to regularly review this Privacy
                    Policy as we may update it periodically. Continued use of
                    our services after updates signifies your acceptance of the
                    new policy terms. You can contact our support team if you
                    have any questions regarding your privacy or need assistance
                    in managing your personal data.
        </p>
      </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
