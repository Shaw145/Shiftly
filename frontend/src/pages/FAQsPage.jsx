import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus,
  FaMinus,
  FaSearch,
  FaArrowRight,
  FaEnvelope,
  FaPhone,
  FaShippingFast,
  FaMapMarkedAlt,
  FaRegHandshake,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import faqData from "../utils/faqData";

const FAQsPage = () => {
  // State management
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredFaqs, setFilteredFaqs] = useState([]);

  const faqsPerPage = 10;

  // Extract unique categories from faqData
  const categories = ["All", ...new Set(faqData.map((faq) => faq.category))];

  // Set dynamic page title when component mounts
  useEffect(() => {
    // Update the document title
    document.title = "Frequently Asked Questions | Help Center | Shiftly - A Seamless Transport System";
    
    // Optional: Restore the original title when component unmounts
    return () => {
      document.title = "Shiftly | A Seamless Transport System";
    };
  }, []);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  // Initialize filtered FAQs when component mounts
  useEffect(() => {
    setFilteredFaqs(faqData);
  }, []);

  // Filter FAQs based on search query and selected category
  useEffect(() => {
    let results = faqData;

    if (searchQuery) {
      results = results.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      results = results.filter((faq) => faq.category === selectedCategory);
    }

    setFilteredFaqs(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, selectedCategory]);

  // Toggle FAQ accordion
  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Calculate pagination
  const indexOfLastFaq = currentPage * faqsPerPage;
  const indexOfFirstFaq = indexOfLastFaq - faqsPerPage;
  const currentFaqs = filteredFaqs.slice(indexOfFirstFaq, indexOfLastFaq);
  const totalPages = Math.ceil(filteredFaqs.length / faqsPerPage);

  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-20 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="relative overflow-hidden mb-16">
          <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-5 z-0"></div>
          <div className="relative z-10 py-12 md:py-20 px-6 md:px-12 bg-gradient-to-r from-red-50 to-rose-50 rounded-3xl shadow-sm">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <motion.h1
                  className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  Find Answers to{" "}
                  <span className="text-red-600">Everything</span> About Shiftly
                </motion.h1>
                <motion.p
                  className="text-lg text-gray-600 mb-8"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  Browse through our frequently asked questions to learn more
                  about our services, policies, and how to get the most from
                  Shiftly.
                </motion.p>
                <motion.div
                  className="flex flex-wrap gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Link
                    to="/how-it-works"
                    className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-md cursor-pointer"
                  >
                    How It Works
                    <FaArrowRight className="ml-2" />
                  </Link>
                  <a
                    href="#search-faqs"
                    className="inline-flex items-center px-6 py-3 bg-white text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors border border-red-200 cursor-pointer"
                  >
                    Search FAQs
                    <FaSearch className="ml-2" />
                  </a>
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="hidden md:block"
              >
                <img
                  src="https://illustrations.popsy.co/red/customer-support.svg"
                  alt="FAQ Illustration"
                  className="w-full max-w-md mx-auto"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <motion.section
          id="search-faqs"
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Find Your Answer
            </h2>
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
              {/* Search Box */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Search for questions or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Category Filter */}
              <div className="md:w-64">
                <select
                  className="block w-full px-4 py-4 border border-gray-200 rounded-xl bg-gray-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 cursor-pointer appearance-none"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                    backgroundPosition: "right 1rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.5em 1.5em",
                    paddingRight: "2.5rem",
                  }}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Category Pills */}
        <motion.div
          className="flex overflow-x-auto space-x-2 pb-4 mb-8 no-scrollbar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex-shrink-0 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 shadow-sm ${
                selectedCategory === category
                  ? "bg-red-600 text-white transform scale-105"
                  : "bg-white text-gray-700 hover:bg-red-50 hover:text-red-600"
              } cursor-pointer`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* FAQ Cards */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Main FAQ List */}
            <div className="md:col-span-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {selectedCategory === "All"
                  ? "All Questions"
                  : `${selectedCategory} Questions`}
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({filteredFaqs.length} results)
                </span>
              </h2>

              {currentFaqs.length > 0 ? (
                <div className="space-y-6">
                  {currentFaqs.map((faq, index) => (
                    <motion.div
                      key={index}
                      className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <button
                        onClick={() => toggleFAQ(index)}
                        className="w-full flex justify-between items-center p-6 focus:outline-none cursor-pointer"
                      >
                        <div className="flex flex-col items-start text-left">
                          <div className="flex items-center mb-2">
                            <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                              {faq.category}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {faq.question}
                          </h3>
                        </div>
                        <div
                          className={`flex-shrink-0 ml-4 w-8 h-8 rounded-full flex items-center justify-center bg-red-100 transition-all duration-300 ${
                            activeIndex === index ? "bg-red-600" : ""
                          }`}
                        >
                          {activeIndex === index ? (
                            <FaMinus className="text-white" />
                          ) : (
                            <FaPlus className="text-red-600" />
                          )}
                        </div>
                      </button>

                      <AnimatePresence>
                        {activeIndex === index && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{
                              height: { duration: 0.4, ease: "easeInOut" },
                              opacity: { duration: 0.25, ease: "easeInOut" },
                            }}
                            className="border-t border-gray-100"
                          >
                            <div className="p-6 bg-gray-50">
                              <p className="text-gray-700 leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  className="py-16 px-6 text-center bg-white rounded-xl shadow-sm border border-gray-100"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <img
                    src="https://illustrations.popsy.co/red/question-mark.svg"
                    alt="No results"
                    className="w-48 h-48 mx-auto mb-6"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No results found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your search or filter to find what you&apos;re
                    looking for.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("All");
                    }}
                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white font-medium text-sm rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                  >
                    Clear Filters
                  </button>
                </motion.div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-10 flex justify-center">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        paginate(currentPage > 1 ? currentPage - 1 : 1)
                      }
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium ${
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                      } transition-colors`}
                    >
                      Previous
                    </button>

                    <div className="hidden sm:flex space-x-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (number) => (
                          <button
                            key={number}
                            onClick={() => paginate(number)}
                            className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium ${
                              currentPage === number
                                ? "bg-red-600 text-white"
                                : "bg-white text-gray-700 hover:bg-red-50 hover:text-red-600"
                            } transition-colors cursor-pointer`}
                          >
                            {number}
                          </button>
                        )
                      )}
                    </div>

                    <div className="sm:hidden text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </div>

                    <button
                      onClick={() =>
                        paginate(
                          currentPage < totalPages
                            ? currentPage + 1
                            : totalPages
                        )
                      }
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium ${
                        currentPage === totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                      } transition-colors`}
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="md:col-span-4 space-y-6">
              {/* Quick Help Card */}
              <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-xl shadow-lg p-6 text-white">
                <h3 className="text-xl font-bold mb-4">Need Quick Help?</h3>
                <p className="text-red-100 mb-6">
                  Our support team is available to assist you with any questions
                  or issues.
                </p>
                <div className="space-y-3">
                  <a
                    href="tel:+918765432100"
                    className="flex items-center py-3 px-4 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors cursor-pointer"
                  >
                    <FaPhone className="mr-3 text-red-500" />
                    <span className="text-black">+91 8765 432100</span>
                  </a>
                  <a
                    href="mailto:support@shiftly.com"
                    className="flex items-center py-3 px-4 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors cursor-pointer"
                  >
                    <FaEnvelope className="mr-3 text-red-500" />
                    <span className="text-black">support@shiftly.com</span>
                  </a>
                </div>
              </div>

              {/* Popular Categories */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Popular Categories
                </h3>
                <div className="space-y-2">
                  {categories
                    .filter((cat) => cat !== "All")
                    .slice(0, 5)
                    .map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className="flex items-center justify-between w-full py-3 px-4 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <span className="text-gray-700">{category}</span>
                        <span className="text-xs font-medium bg-red-100 text-red-800 rounded-full px-2 py-1">
                          {
                            faqData.filter((faq) => faq.category === category)
                              .length
                          }
                        </span>
                      </button>
                    ))}
                </div>
              </div>

              {/* How It Works Card */}
              <div className="relative overflow-hidden bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="absolute top-0 right-0 w-32 h-32 -mt-10 -mr-10 bg-red-100 rounded-full z-0"></div>
                <div className="relative z-10 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    How Shiftly Works
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Learn about our easy-to-use platform and how we connect you
                    with reliable transport services.
                  </p>
                  <Link
                    to="/how-it-works"
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-br from-red-500 to-pink-600 text-white font-medium rounded-lg hover:bg-red-700 transition-all cursor-pointer hover:scale-105 duration-200"
                  >
                    Learn More
                    <FaArrowRight className="ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resources Section */}
        <section className="rounded-2xl overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            <div className="bg-gradient-to-br from-red-500 to-pink-600 p-10 text-white">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-red-700 rounded-full flex items-center justify-center mr-4">
                  <FaShippingFast className="text-xl" />
                </div>
                <h2 className="text-2xl font-bold">Quick Ship Guide</h2>
              </div>
              <p className="text-red-100 mb-8">
                Learn how to prepare your items for shipping, choose the right
                vehicle, and get the best rates.
              </p>
              <Link
                to="/calculate-price"
                className="inline-flex items-center py-3 px-6 bg-white text-red-600 font-medium rounded-lg hover:bg-red-100 transition-all duration-200 cursor-pointer hover:translate-x-1.5"
              >
                Calculate Shipping Rate
                <FaArrowRight className="ml-2" />
              </Link>
            </div>

            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-10 text-white">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mr-4">
                  <FaMapMarkedAlt className="text-xl" />
                </div>
                <h2 className="text-2xl font-bold">Service Areas</h2>
              </div>
              <p className="text-gray-300 mb-8">
                Explore the cities and regions we currently serve with our
                logistics and transportation network.
              </p>
              <Link
                to="/services"
                className="inline-flex items-center py-3 px-6 bg-white text-gray-800 font-medium rounded-lg hover:bg-gray-100 duration-200 cursor-pointer hover:translate-x-1.5"
              >
                View Service Areas
                <FaArrowRight className="ml-2" />
              </Link>
            </div>

            <div className="bg-gradient-to-r from-red-100 to-white p-10">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center mr-4">
                  <FaRegHandshake className="text-xl text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Business Solutions
                </h2>
              </div>
              <p className="text-gray-600 mb-8">
                Special shipping options for businesses with regular logistics
                needs.
              </p>
              <Link
                to="/contact-us"
                className="inline-flex items-center py-3 px-6 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 duration-200 cursor-pointer hover:translate-x-1.5"
              >
                Business Inquiry
                <FaArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FAQsPage;
