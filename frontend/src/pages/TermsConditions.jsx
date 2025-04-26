import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaPhone, FaEnvelope, FaChevronRight } from "react-icons/fa";
import logo from "../assets/Shiftly_logo.png";

const TermsandConditions = () => {
  // Create refs for each section
  const sectionRefs = {
    definition: useRef(null),
    eligibility: useRef(null),
    useofservices: useRef(null),
    pricing: useRef(null),
    driver: useRef(null),
    user: useRef(null),
    cancellation: useRef(null),
    liability: useRef(null),
    prohibited: useRef(null),
    termination: useRef(null),
    privacy: useRef(null),
    dispute: useRef(null),
    changes: useRef(null),
    contact: useRef(null),
  };

  // Set dynamic page title when component mounts
  useEffect(() => {
    // Update the document title
    document.title = "Terms & Conditions | Legal Information | Shiftly - A Seamless Transport System";
    
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
    { id: "definition", title: "1. Definition" },
    { id: "eligibility", title: "2. User Eligibility" },
    { id: "useofservices", title: "3. Use of Services" },
    { id: "pricing", title: "4. Pricing & Payments" },
    { id: "driver", title: "5. Driver & Vehicle Responsibilities" },
    { id: "user", title: "6. User Responsibilities" },
    { id: "cancellation", title: "7. Cancellations & Refunds" },
    { id: "liability", title: "8. Liability & Damages" },
    { id: "prohibited", title: "9. Prohibited Uses" },
    { id: "termination", title: "10. Termination & Account Suspension" },
    { id: "privacy", title: "11. Privacy & Data Protection" },
    { id: "dispute", title: "12. Dispute Resolution" },
    { id: "changes", title: "13. Changes to Terms" },
    { id: "contact", title: "14. Contact Us" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 mt-20">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          Terms and Conditions
        </h1>
                <p className="text-gray-700">Last Updated: 16-2-2025</p>
              </div>

              {/* Introduction */}
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Welcome to Shiftly – A Seamless Transport System. These Terms
                  and Conditions govern your access to and use of our website,
                  mobile application, and services. By using Shiftly, you agree
                  to comply with and be bound by these terms. If you do not
                  agree with any part of these terms, please do not use our
                  services.
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
                      <FaChevronRight className="mr-2 text-xs text-red-500" />
                      {item.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Terms Content */}
              <div className="space-y-12 text-gray-700">
                {/* Definition */}
                <section
                  ref={sectionRefs.definition}
                  className="scroll-mt-24 space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 pb-2 border-b">
                    1. Definition
                  </h2>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 mb-4">
                      In these Terms and Conditions:
                    </p>
          <ul className="list-disc list-inside ml-6 space-y-2">
            <li>
                        <strong>
                          &quot;Shiftly,&quot; &quot;we,&quot; &quot;our,&quot;
                          or &quot;us&quot;
                        </strong>{" "}
                        refers to Shiftly, the transport system service
                        provider.
            </li>
            <li>
                        <strong>&quot;User,&quot; &quot;you,&quot; or &quot;customer&quot;</strong> refers to
              individuals or businesses using our platform.
            </li>
            <li>
                        <strong>&quot;Driver&quot;</strong> refers to independent
                        transport providers offering their services through
                        Shiftly.
            </li>
            <li>
                        <strong>"Service"</strong> refers to all transport,
                        logistics, and related features provided by Shiftly.
            </li>
            <li>
                        <strong>"Booking"</strong> refers to a request made by a
                        user to hire transport services.
            </li>
          </ul>
        </div>
                </section>

                {/* User Eligibility */}
                <section
                  ref={sectionRefs.eligibility}
                  className="scroll-mt-24 space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 pb-2 border-b">
                    2. User Eligibility
                  </h2>
                  <div className="prose max-w-none">
          <p className="mb-4">
            To use Shiftly, you must meet the following criteria:
          </p>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <span className="flex-shrink-0 h-6 w-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center mt-0.5">
                            18+
                          </span>
                          <span className="ml-3">
                            <span className="text-gray-700">
                              You must be at least 18 years old to register or
                              book transport services on our platform.
                            </span>
                          </span>
            </li>
                        <li className="flex items-start">
                          <span className="flex-shrink-0 h-6 w-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center mt-0.5">
                            📝
                          </span>
                          <span className="ml-3">
                            <span className="text-gray-700">
                              Users are required to provide accurate and
                              up-to-date information during the registration
                              process. Failure to do so may result in account
                              suspension or termination.
                            </span>
                          </span>
            </li>
                        <li className="flex items-start">
                          <span className="flex-shrink-0 h-6 w-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center mt-0.5">
                            🔒
                          </span>
                          <span className="ml-3">
                            <span className="text-gray-700">
                              You are solely responsible for maintaining the
                              confidentiality of your account credentials and
                              preventing unauthorized access to your account.
                            </span>
                          </span>
            </li>
                        <li className="flex items-start">
                          <span className="flex-shrink-0 h-6 w-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center mt-0.5">
                            ⚠️
                          </span>
                          <span className="ml-3">
                            <span className="text-gray-700">
                              If we detect any fraudulent activity on your
                              account, Shiftly reserves the right to suspend or
                              terminate your access to our services.
                            </span>
                          </span>
            </li>
          </ul>
        </div>
                  </div>
                </section>

                {/* Use of Services */}
                <section
                  ref={sectionRefs.useofservices}
                  className="scroll-mt-24 space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 pb-2 border-b">
                    3. Use of Services
                  </h2>
                  <div className="prose max-w-none">
          <p className="mb-4">
                      By using Shiftly&apos;s services, you agree to the
                      following conditions:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-6 mb-4">
            <li>
                        Our services are available for both personal and
                        business transportation needs. You are responsible for
                        ensuring that your shipments comply with all relevant
                        local, state, and national laws.
            </li>
            <li>
                        Users are prohibited from transporting illegal,
                        hazardous, or restricted goods, including but not
                        limited to explosives, firearms, and narcotics.
            </li>
            <li>
                        All bookings must be confirmed with upfront payment.
                        Additional charges may apply for services beyond the
                        initial booking (e.g., handling extra weight, longer
                        routes).
            </li>
            <li>
                        While we offer a selection of available drivers based on
                        pricing and availability, Shiftly does not guarantee
                        specific drivers for every booking.
            </li>
          </ul>
        </div>
                </section>

                {/* Pricing & Payments */}
                <section
                  ref={sectionRefs.pricing}
                  className="scroll-mt-24 space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 pb-2 border-b">
                    4. Pricing & Payments
                  </h2>
                  <div className="prose max-w-none">
          <p className="mb-4">
                      Shiftly uses a dynamic pricing model based on factors such
                      as distance, vehicle type, and road conditions. The final
                      price may vary depending on various conditions at the time
                      of service.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-red-500">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Price Estimates
                        </h3>
                        <p className="text-gray-700">
                          The estimated price displayed at the time of booking
                          is subject to change based on final weight, distance,
                          and road conditions.
                        </p>
                      </div>

                      <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-red-500">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Dynamic Pricing
                        </h3>
                        <p className="text-gray-700">
                          Prices are calculated based on the distance traveled,
                          type of vehicle selected, fuel charges, tolls, and
                          demand fluctuations.
                        </p>
                      </div>

                      <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-red-500">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Payment Modes
                        </h3>
                        <p className="text-gray-700">
                          Users can pay via UPI, credit/debit cards, net
                          banking, or digital wallets. No cash payments are
                          accepted.
          </p>
        </div>

                      <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-red-500">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          No Cash Payments
                        </h3>
                        <p className="text-gray-700">
                          All transactions must be completed digitally through
                          secure payment gateways to ensure transparency and
                          security.
                        </p>
                      </div>
                    </div>

                    <p className="mt-6 mb-4">
                      All payments are processed securely, and users will
                      receive an electronic receipt upon successful completion
                      of the transaction.
                    </p>
                  </div>
                </section>

                {/* Driver & Vehicle Responsibilities */}
                <section
                  ref={sectionRefs.driver}
                  className="scroll-mt-24 space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 pb-2 border-b">
                    5. Driver & Vehicle Responsibilities
          </h2>
                  <div className="prose max-w-none">
          <p className="mb-4">
                      All drivers using the Shiftly platform are expected to
                      adhere to the following responsibilities:
                    </p>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-6 w-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center mt-0.5">
                            🚗
                          </div>
                          <span className="ml-3 pt-0.5 text-gray-700">
                            Drivers must maintain the condition of their
                            vehicles to ensure safety and compliance with local
                            laws.
                          </span>
            </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-6 w-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center mt-0.5">
                            🔧
                          </div>
                          <span className="ml-3 pt-0.5 text-gray-700">
                            Vehicles should be equipped with necessary safety
                            features and equipment for secure transportation.
                          </span>
            </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-6 w-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center mt-0.5">
                            📋
                          </div>
                          <span className="ml-3 pt-0.5 text-gray-700">
                            Drivers are required to provide accurate information
                            regarding their vehicles, such as size, type, and
                            capacity.
                          </span>
            </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-6 w-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center mt-0.5">
                            ⏰
                          </div>
                          <span className="ml-3 pt-0.5 text-gray-700">
                            Drivers should respect agreed-upon pickup and
                            delivery times and notify customers in the event of
                            delays.
                          </span>
            </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-6 w-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center mt-0.5">
                            📜
                          </div>
                          <span className="ml-3 pt-0.5 text-gray-700">
                            Drivers are prohibited from transporting illegal
                            goods and must comply with all applicable laws.
                          </span>
            </li>
          </ul>
        </div>
                  </div>
                </section>

                {/* User Responsibilities */}
                <section
                  ref={sectionRefs.user}
                  className="scroll-mt-24 space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 pb-2 border-b">
                    6. User Responsibilities
                  </h2>
                  <div className="prose max-w-none">
          <p className="mb-4">
                      Users are responsible for the following when using
                      Shiftly&apos;s services:
                    </p>

                    <div className="space-y-4">
                      <div className="flex items-start p-4 bg-white rounded-lg shadow-sm border-l-4 border-red-500">
                        <span className="text-gray-700">
                          Users must provide accurate shipment details,
                          including weight, volume, and special handling
                          instructions.
                        </span>
                      </div>

                      <div className="flex items-start p-4 bg-white rounded-lg shadow-sm border-l-4 border-red-500">
                        <span className="text-gray-700">
                          Users are responsible for packaging goods securely to
                          prevent damage during transit.
                        </span>
                      </div>

                      <div className="flex items-start p-4 bg-white rounded-lg shadow-sm border-l-4 border-red-500">
                        <span className="text-gray-700">
                          It is the user&apos;s responsibility to ensure that pickup
                          and delivery locations are accessible and safe for
                          drivers.
                        </span>
                      </div>

                      <div className="flex items-start p-4 bg-white rounded-lg shadow-sm border-l-4 border-red-500">
                        <span className="text-gray-700">
                          Users must comply with Shiftly&apos;s guidelines
                          regarding prohibited and restricted items.
                        </span>
        </div>

                      <div className="flex items-start p-4 bg-white rounded-lg shadow-sm border-l-4 border-red-500">
                        <span className="text-gray-700">
                          Users should report any issues with the service to
                          Shiftly&apos;s customer support in a timely manner.
                        </span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Cancellations & Refunds */}
                <section
                  ref={sectionRefs.cancellation}
                  className="scroll-mt-24 space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 pb-2 border-b">
                    7. Cancellations & Refunds
          </h2>
                  <div className="prose max-w-none">
          <p className="mb-4">
                      Our cancellation and refund policies are designed to
                      ensure fairness to both customers and drivers:
                    </p>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <ul className="space-y-4">
                        <li className="flex items-start">
                          <div className="h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mt-0.5 flex-shrink-0">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-gray-700 pt-1.5">
                              Cancellations made before the shipment is picked
                              up are eligible for a full refund, minus any
                              processing fees.
                            </p>
                          </div>
            </li>

                        <li className="flex items-start">
                          <div className="h-8 w-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center mt-0.5 flex-shrink-0">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-gray-700 pt-1.5">
                              If a cancellation is made after pickup, refunds
                              are not available unless the driver fails to
                              deliver the goods.
                            </p>
                          </div>
            </li>

                        <li className="flex items-start">
                          <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mt-0.5 flex-shrink-0">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-gray-700 pt-1.5">
                              Refunds may take 5-7 business days to reflect in
                              your original payment method.
                            </p>
                          </div>
            </li>

                        <li className="flex items-start">
                          <div className="h-8 w-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center mt-0.5 flex-shrink-0">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-gray-700 pt-1.5">
                              Shiftly reserves the right to refuse refunds if it
                              determines that the cancellation was made in bad
                              faith.
                            </p>
                          </div>
            </li>
          </ul>
        </div>
                  </div>
                </section>

                {/* Liability & Damages */}
                <section
                  ref={sectionRefs.liability}
                  className="scroll-mt-24 space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 pb-2 border-b">
                    8. Liability & Damages
                  </h2>
                  <div className="prose max-w-none">
          <p className="mb-4">
            Shiftly&apos;s liability policy covers the following:
          </p>

                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="px-6 py-4">
          <ul className="list-disc list-inside space-y-2 ml-6 mb-4">
            <li>
                            Shiftly is not liable for any damages resulting from
                            the improper packaging of goods by the user.
            </li>
            <li>
                            Any damages caused by the driver during transit will
                            be assessed and compensated based on the insurance
                            coverage chosen by the user.
            </li>
            <li>
                            Shiftly does not accept liability for delays caused
                            by unforeseen events, such as traffic or weather
                            conditions.
            </li>
            <li>
                            Users must report any damage claims within 24 hours
                            of delivery to be eligible for compensation.
            </li>
          </ul>
        </div>
                      <div className="bg-red-50 px-6 py-4 border-t border-red-100">
                        <div className="flex items-center">
                          <svg
                            className="h-5 w-5 text-red-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <p className="ml-2 text-sm text-red-700">
                            For maximum protection, we recommend selecting
                            appropriate insurance coverage for valuable
                            shipments.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Prohibited Uses */}
                <section
                  ref={sectionRefs.prohibited}
                  className="scroll-mt-24 space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 pb-2 border-b">
                    9. Prohibited Uses
                  </h2>
                  <div className="prose max-w-none">
          <p className="mb-4">
                      The following activities are strictly prohibited on the
                      Shiftly platform:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-red-200">
                        <div className="flex items-center mb-2">
                          <div className="bg-red-100 p-2 rounded-full">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-red-600"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367l-8.367-8.368zm3.274-3.274a7.97 7.97 0 012.485 5.797c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8c2.12 0 4.047.816 5.487 2.149"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <h3 className="ml-3 text-lg font-medium text-gray-900">
                            Illegal Goods
                          </h3>
                        </div>
                        <p className="text-gray-600 text-sm">
                          Transporting illegal substances, contraband, or stolen
                          items.
                        </p>
                      </div>

                      <div className="bg-white p-4 rounded-lg shadow-sm border border-red-200">
                        <div className="flex items-center mb-2">
                          <div className="bg-red-100 p-2 rounded-full">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-red-600"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M13 10a1 1 0 011 1v6a1 1 0 01-1 1H7a1 1 0 01-1-1v-6a1 1 0 011-1h6zM7 9V3a1 1 0 011-1h4a1 1 0 011 1v6H7z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <h3 className="ml-3 text-lg font-medium text-gray-900">
                            Dangerous Items
                          </h3>
                        </div>
                        <p className="text-gray-600 text-sm">
                          Explosives, hazardous chemicals, or other dangerous
                          materials.
                        </p>
                      </div>

                      <div className="bg-white p-4 rounded-lg shadow-sm border border-red-200">
                        <div className="flex items-center mb-2">
                          <div className="bg-red-100 p-2 rounded-full">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-red-600"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <h3 className="ml-3 text-lg font-medium text-gray-900">
                            Account Sharing
                          </h3>
                        </div>
                        <p className="text-gray-600 text-sm">
                          Allowing others to use your account or credentials.
                        </p>
                      </div>

                      <div className="bg-white p-4 rounded-lg shadow-sm border border-red-200">
                        <div className="flex items-center mb-2">
                          <div className="bg-red-100 p-2 rounded-full">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-red-600"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <h3 className="ml-3 text-lg font-medium text-gray-900">
                            Harassment
                          </h3>
                        </div>
                        <p className="text-gray-600 text-sm">
                          Engaging in threatening or abusive behavior towards
                          drivers or staff.
                        </p>
                      </div>
                    </div>

                    <p className="mt-6 text-gray-700">
                      Any violation of these prohibitions may result in
                      immediate suspension or termination of your account, as
                      well as potential legal action.
                    </p>
                  </div>
                </section>

                {/* Termination & Account Suspension */}
                <section
                  ref={sectionRefs.termination}
                  className="scroll-mt-24 space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 pb-2 border-b">
                    10. Termination & Account Suspension
                  </h2>
                  <div className="prose max-w-none">
                    <p className="mb-4">
                      Shiftly reserves the right to terminate or suspend user
                      accounts under the following circumstances:
                    </p>
          <ul className="list-disc list-inside space-y-2 ml-6 mb-4">
            <li>
                        Violation of any terms and conditions outlined in this
                        document.
            </li>
                      <li>Engaging in fraudulent or illegal activities.</li>
                      <li>Repeated cancellations or poor user behavior.</li>
                      <li>Non-payment of fees or charges.</li>
            <li>
                        Providing false or misleading information during
                        registration.
            </li>
            <li>
                        Using the platform for purposes other than intended.
            </li>
          </ul>
                    <p className="mb-4">
                      Account termination or suspension will result in the loss
                      of access to the platform and may affect any pending
                      bookings. Shiftly is not liable for any losses incurred as
                      a result of account termination.
                    </p>
        </div>
                </section>

                {/* Privacy & Data Protection */}
                <section
                  ref={sectionRefs.privacy}
                  className="scroll-mt-24 space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 pb-2 border-b">
                    11. Privacy & Data Protection
          </h2>
                  <div className="prose max-w-none">
          <p className="mb-4">
                      Shiftly is committed to protecting your personal
                      information and privacy. Our data practices include:
                    </p>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <ul className="space-y-4">
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-6 w-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center mt-0.5">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path
                                fillRule="evenodd"
                                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-gray-700 pt-0.5">
                              We collect and use personal data as outlined in
                              our Privacy Policy.
                            </p>
                          </div>
            </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-6 w-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center mt-0.5">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-gray-700 pt-0.5">
                              Your data is secured using industry-standard
                              encryption and security measures.
                            </p>
                          </div>
            </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-6 w-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center mt-0.5">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-gray-700 pt-0.5">
                              We may share necessary information with drivers,
                              partners, and service providers to facilitate your
                              bookings.
                            </p>
                          </div>
            </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-6 w-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center mt-0.5">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-gray-700 pt-0.5">
                              You have the right to access, correct, or delete
                              your personal data as per applicable laws.
                            </p>
                          </div>
            </li>
          </ul>
        </div>
                    <p className="mt-4 mb-4">
                      For full details on how we handle your data, please refer
                      to our
                      <Link
                        to="/privacy-policy"
                        className="text-red-600 hover:text-red-800 cursor-pointer"
                      >
                        {" "}
                        Privacy Policy
                      </Link>
                      .
                    </p>
                  </div>
                </section>

                {/* Dispute Resolution */}
                <section
                  ref={sectionRefs.dispute}
                  className="scroll-mt-24 space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 pb-2 border-b">
                    12. Dispute Resolution
          </h2>
                  <div className="prose max-w-none">
          <p className="mb-4">
                      In case of disputes between users and Shiftly or between
                      users and drivers, the following resolution process
                      applies:
          </p>
                    <ol className="list-decimal list-inside space-y-2 ml-6 mb-4">
            <li>
                        <strong>Initial Contact:</strong> All disputes should
                        first be addressed through our customer support channel.
            </li>
            <li>
                        <strong>Internal Review:</strong> Our team will
                        investigate the issue and attempt to resolve it
                        internally.
            </li>
            <li>
                        <strong>Mediation:</strong> If the dispute remains
                        unresolved, we may suggest mediation through a neutral
                        third party.
            </li>
            <li>
                        <strong>Legal Action:</strong> If all other methods
                        fail, legal action may be taken as per the jurisdiction
                        specified below.
            </li>
                    </ol>
                    <p className="mb-4">
                      All disputes shall be governed by the laws of India, and
                      any legal proceedings shall take place in the courts of
                      Delhi.
                    </p>
        </div>
                </section>

                {/* Changes to Terms */}
                <section
                  ref={sectionRefs.changes}
                  className="scroll-mt-24 space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 pb-2 border-b">
                    13. Changes to Terms
                  </h2>
                  <div className="prose max-w-none">
          <p className="mb-4">
                      Shiftly may update these Terms and Conditions from time to
                      time. We will notify users of any significant changes
                      through:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-6 mb-4">
            <li>
                        Email notifications to the address associated with your
                        account.
            </li>
                      <li>In-app notifications or announcements.</li>
                      <li>
                        Updates on our website with a clear indication of the
                        revision date.
            </li>
          </ul>
                    <p className="mb-4">
                      It is the user&apos;s responsibility to review these terms
                      periodically. Continued use of Shiftly&apos;s services
                      after changes indicates acceptance of the updated terms.
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-red-500">
                      <p className="text-gray-700 text-sm">
                        <strong>Note:</strong> For significant changes that may
                        affect your rights or obligations, we will provide at
                        least 30 days&apos; notice before implementation.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Contact Us */}
                <section
                  ref={sectionRefs.contact}
                  className="scroll-mt-24 space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 pb-2 border-b">
                    14. Contact Us
                  </h2>
                  <div className="prose max-w-none">
                    <p className="mb-6">
                      If you have any questions or concerns about these Terms
                      and Conditions, please contact our customer support team:
                    </p>

                    <div className="bg-gray-50 rounded-lg p-6">
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
                          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-sm cursor-pointer hover:scale-105 transition-all duration-200 hover:shadow-lg hover:shadow-red-300"
                        >
                          Contact Support
                        </Link>
                      </div>
                    </div>

                    <p className="mt-6 text-gray-700">
                      Our support team is available Monday through Saturday,
                      9:00 AM to 8:00 PM IST, and will respond to your inquiry
                      as soon as possible.
                    </p>
                  </div>
                </section>
        </div>

              {/* Additional Paragraphs */}
              <div className="border-t border-gray-200 pt-8 mt-8">
                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-4">
                    These Terms and Conditions constitute the entire agreement
                    between users and Shiftly regarding the use of our services.
                    They supersede any prior agreements or understandings,
                    whether written or oral.
                  </p>
                  <p className="text-gray-700 mb-4">
                    If any provision of these terms is found to be invalid or
                    unenforceable, the remaining provisions will continue to be
                    valid and enforceable to the fullest extent permitted by
                    law.
                  </p>
                  <p className="text-gray-700">
                    Thank you for choosing Shiftly. We look forward to providing
                    you with a seamless transport experience.
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

export default TermsandConditions;
