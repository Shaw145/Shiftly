import { useState, useEffect, useRef } from "react";
import { FaBars, FaTimes, FaTruck, FaUser } from "react-icons/fa";
import { motion } from "framer-motion";
import { useLocation, Link } from "react-router-dom";
import logoLight from "../assets/logo-light.png";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  const isLoginSignupPage =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/verify-email";

  return (
    <nav className="w-full h-20 flex items-center justify-between bg-white shadow-md border-b border-gray-200 z-50 fixed top-0 left-0">
      {/* Left Section: Logo with Dark Blue Background */}
      <div className="h-full flex items-center bg-body-dark pl-30 pr-16 xxs:pl-15 xs:pl-20 clip-path-angle relative">
        {/* Logo Image */}
        <Link to="/">
          <img
            src={logoLight}
            alt="Shiftly Logo"
            className="h-10 xs:h-13 md:h-14 lg:h-12"
          />
        </Link>
        {/* Red Strip Separator */}
        <div className="absolute right-0 top-0 h-full w-3 bg-primary transform -skew-x-160 mr-6 xs:-skew-x-156 sm:mr-7 sm:-skew-x-156 md:mr-8 md:-skew-x-154 lg:mr-7 lg:-skew-x-156"></div>
      </div>

      {/* Middle Section: Page Links */}
      <div className="hidden lg2:flex flex-grow justify-center space-x-8 items-center">
        <a
          href="/"
          className="text-dark font-bold text-lg hover:text-primary transition-all relative group"
        >
          Home
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
        </a>
        <a
          href="/about"
          className="text-dark font-bold text-lg hover:text-primary transition-all relative group"
        >
          About Us
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
        </a>
        <a
          href="/services"
          className="text-dark font-bold text-lg hover:text-primary transition-all relative group"
        >
          Our Services
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
        </a>
        <a
          href="/#CalculatePrice"
          className="text-dark font-bold text-lg hover:text-primary transition-all relative group"
        >
          Calculate Price
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
        </a>
        <a
          href="/contact"
          className="text-dark font-bold text-lg hover:text-primary transition-all relative group"
        >
          Contact Us
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
        </a>
      </div>

      {/* Right Section: Conditionally render buttons */}
      {!isLoginSignupPage && (
        <div className="hidden lg2:flex items-center pr-10">
          {token ? (
            <Link to="/dashboard">
              <motion.button
                whileHover={{ x: 10, backgroundColor: "#04223E" }}
                transition={{ duration: 0.3 }}
                className="flex items-center bg-primary text-white px-6 py-3 rounded-lg space-x-2 text-lg font-bold cursor-pointer"
              >
                <FaUser className="text-lg" />
                <span>Dashboard</span>
              </motion.button>
            </Link>
          ) : (
            <Link to="/login">
              <motion.button
                whileHover={{ x: 10, backgroundColor: "#04223E" }}
                transition={{ duration: 0.3 }}
                className="flex items-center bg-primary text-white px-6 py-3 rounded-lg space-x-2 text-lg font-bold cursor-pointer"
              >
                <FaTruck className="text-xl" />
                <span>Login/Signup</span>
              </motion.button>
            </Link>
          )}
        </div>
      )}

      {/* Hamburger Menu for Mobile */}
      <div className="lg2:hidden pr-8">
        <button
          ref={buttonRef}
          onClick={toggleMenu}
          className="text-dark focus:outline-none"
        >
          {isMenuOpen ? (
            <FaTimes className="text-2xl" />
          ) : (
            <FaBars className="text-2xl" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute top-20 left-0 w-full bg-white shadow-lg lg2:hidden z-50"
        >
          <a
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className="block px-6 py-3 text-dark font-bold text-lg hover:bg-accent relative group"
          >
            Home
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
          </a>
          <a
            href="/about"
            onClick={() => setIsMenuOpen(false)}
            className="block px-6 py-3 text-dark font-bold text-lg hover:bg-accent relative group"
          >
            About Us
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
          </a>
          <a
            href="/services"
            onClick={() => setIsMenuOpen(false)}
            className="block px-6 py-3 text-dark font-bold text-lg hover:bg-accent relative group"
          >
            Our Services
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
          </a>
          <a
            href="/#CalculatePrice"
            onClick={() => setIsMenuOpen(false)}
            className="block px-6 py-3 text-dark font-bold text-lg hover:bg-accent relative group"
          >
            Calculate Price
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
          </a>
          <a
            href="/contact"
            onClick={() => setIsMenuOpen(false)}
            className="block px-6 py-3 text-dark font-bold text-lg hover:bg-accent relative group"
          >
            Contact Us
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
          </a>
          {/* Add gap between Contact Us and the button */}
          {!isLoginSignupPage && (
            <div className="mt-4 px-6 mb-4">
              {token ? (
                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                  <motion.button
                    whileHover={{ x: 10, backgroundColor: "#04223E" }}
                    transition={{ duration: 0.3 }}
                    className="w-full flex items-center justify-center bg-primary text-white px-6 py-3 space-x-2 hover:bg-body-dark transition-all text-lg font-bold rounded-lg"
                  >
                    <FaUser className="text-xl" />
                    <span>Dashboard</span>
                  </motion.button>
                </Link>
              ) : (
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <motion.button
                    whileHover={{ x: 10, backgroundColor: "#04223E" }}
                    transition={{ duration: 0.3 }}
                    className="w-full flex items-center justify-center bg-primary text-white px-6 py-3 space-x-2 hover:bg-body-dark transition-all text-lg font-bold rounded-lg"
                  >
                    <FaTruck className="text-xl" />
                    <span>Login/Signup</span>
                  </motion.button>
                </Link>
              )}
            </div>
          )}
        </motion.div>
      )}
    </nav>
  );
}
