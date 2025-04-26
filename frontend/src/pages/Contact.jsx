import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MdSend, MdAccessTime } from "react-icons/md";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaCheckCircle,
} from "react-icons/fa";
import bgImage from "../assets/bg-image.jpg";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    submitting: false,
    error: null,
  });

  // Set dynamic page title when component mounts
  useEffect(() => {
    // Update the document title
    document.title = "Contact Us | Get Support | Shiftly - A Seamless Transport System";
    
    // Optional: Restore the original title when component unmounts
    return () => {
      document.title = "Shiftly | A Seamless Transport System";
    };
  }, []);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus({ submitted: false, submitting: true, error: null });

    // Simulate form submission
    setTimeout(() => {
      setFormStatus({ submitted: true, submitting: false, error: null });
      setFormData({ name: "", email: "", subject: "", message: "" });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setFormStatus({ submitted: false, submitting: false, error: null });
      }, 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen mt-20">
      {/* Main content section */}
      <div
        className="bg-cover bg-center py-20 relative"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h1
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Get In Touch
            </motion.h1>
            <motion.p
              className="text-lg text-gray-200 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Have questions about our services? We&apos;re here to help you
              with all your shipping needs.
            </motion.p>
          </div>

          {/* Two column layout for form and info */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Contact form */}
            <motion.div
              className="lg:col-span-3 bg-gray-900/60 backdrop-blur-lg rounded-xl shadow-xl p-8 h-full flex flex-col border border-gray-700/50"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-white">
                Send Us a Message
              </h2>

              {formStatus.submitted ? (
                <motion.div
                  className="bg-green-900/80 border border-green-700 rounded-lg p-6 text-center my-auto backdrop-blur-lg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <FaCheckCircle className="text-green-400 text-3xl mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-green-100">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-green-300 mt-2">
                    Thank you for contacting us. We&apos;ll get back to you
                    shortly.
                  </p>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-6 flex-grow flex flex-col"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800/60 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors backdrop-blur-sm placeholder-gray-400"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800/60 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors backdrop-blur-sm placeholder-gray-400"
                        placeholder="Your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800/60 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors backdrop-blur-sm placeholder-gray-400"
                      placeholder="What is this regarding?"
                    />
                  </div>

                  <div className="flex-grow">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full h-56 px-4 py-3 rounded-lg border border-gray-700 bg-gray-800/60 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors resize-none backdrop-blur-sm placeholder-gray-400"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={formStatus.submitting}
                    className={`w-full px-6 py-3 bg-gradient-to-l from-red-500 to-pink-600 text-white font-medium rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors flex items-center justify-center mt-auto cursor-pointer ${
                      formStatus.submitting
                        ? "opacity-75 cursor-not-allowed"
                        : ""
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {formStatus.submitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <MdSend className="ml-2" />
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </motion.div>

            {/* Contact information */}
            <motion.div
              className="lg:col-span-2 bg-gray-900/60 backdrop-blur-lg rounded-xl shadow-xl overflow-hidden h-full flex flex-col border border-gray-700/50"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-gradient-to-br from-red-500 to-pink-600 p-8 text-white">
                <h3 className="text-2xl font-bold mb-2">Contact Information</h3>
                <p className="text-red-100 mb-4">
                  Reach out to us for any questions or concerns
                </p>
              </div>

              <div className="p-8 space-y-6 flex-grow">
                <div className="flex items-start">
                  <div className="bg-red-900/70 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1 cursor-pointer">
                    <FaMapMarkerAlt className="text-red-300" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-md font-semibold text-gray-200">
                      Address
                    </h4>
                    <p className="text-gray-400 mt-1">
                      123 Park Street, Kolkata
                      <br />
                      West Bengal, 700016, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-red-900/70 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1 cursor-pointer">
                    <FaPhone className="text-red-300" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-md font-semibold text-gray-200">
                      Phone
                    </h4>
                    <p className="text-gray-400 mt-1">+91 8765 432100</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-red-900/70 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1 cursor-pointer">
                    <FaEnvelope className="text-red-300" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-md font-semibold text-gray-200">
                      Email
                    </h4>
                    <p className="text-gray-400 mt-1">support@shiftly.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-red-900/70 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1 cursor-pointer">
                    <MdAccessTime className="text-red-300" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-md font-semibold text-gray-200">
                      Working Hours
                    </h4>
                    <p className="text-gray-400 mt-1">
                      Monday - Friday: 9:00 AM - 6:00 PM
                      <br />
                      Saturday: 9:00 AM - 1:00 PM
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-auto border-t border-gray-700/50">
                  <h4 className="text-md font-semibold text-gray-200 mb-4">
                    Connect With Us
                  </h4>
                  <div className="flex space-x-4">
                    <a
                      href="#"
                      className="bg-gray-800/80 hover:bg-gradient-to-br from-red-500 to-pink-600 text-gray-300 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer hover:-translate-y-1"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="bg-gray-800/80 hover:bg-gradient-to-br from-red-500 to-pink-600 text-gray-300 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer hover:-translate-y-1"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 120 120"
                        aria-hidden="true"
                      >
                        <path d="M95.4 10H112L73.1 54.6 119 110H83.7l-27.2-32.4-31 32.4H8l40.7-46.1L1 10h37.3l25.1 29.9L95.4 10zm-6.5 92.3h10.6L34.9 19.6H23.6l65.3 82.7z"/>
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="bg-gray-800/80 hover:bg-gradient-to-br from-red-500 to-pink-600 text-gray-300 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer hover:-translate-y-1"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="bg-gray-800/80 hover:bg-gradient-to-br from-red-500 to-pink-600 text-gray-300 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer hover:-translate-y-1"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Map section with container */}
      <div className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Location
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find us easily at our centrally located office in Park Street, one
              of Kolkata&apos;s most vibrant areas
            </p>
          </div>

          <div className="rounded-xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29487.151668712272!2d88.33463716241723!3d22.544451274412744!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0277c5a6f69dbd%3A0xd578fbd7e6887daa!2sPark%20Street%2C%20Kolkata%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1631234567890!5m2!1sen!2sin"
              width="100%"
              height="450"
              className="border-0"
              allowFullScreen=""
              loading="lazy"
              title="Shiftly Office Location"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
