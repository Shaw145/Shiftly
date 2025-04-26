import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaLinkedin, FaXTwitter, FaArrowRight } from "react-icons/fa6";
import { motion } from "framer-motion";
import worldMap from "../assets/worldmap.png";
import truck1 from "../assets/truck-1.png";
import truck2 from "../assets/truck-2.png";
import truck3 from "../assets/truck-3.png";
import footerShape from "../assets/footer-shape.png";
import ShiftlyLogo from "../assets/Shiftly_logo.png";

export default function Footer() {
  const [truckSpeeds, setTruckSpeeds] = useState({ truck1: 7, truck2: 9, truck3: 11 });

  // Adjust speeds based on screen size
  useEffect(() => {
    const updateSpeed = () => {
      if (window.innerWidth < 668) {
        setTruckSpeeds({ truck1: 3, truck2: 4, truck3: 5 }); // Faster on small screens
      } else if (window.innerWidth < 1024) {
        setTruckSpeeds({ truck1: 7, truck2: 7, truck3: 12 }); // Medium speed
      } else {
        setTruckSpeeds({ truck1: 16, truck2: 11, truck3: 21 }); // Normal speed
      }
    };
    
    updateSpeed(); // Set on load
    window.addEventListener("resize", updateSpeed); // Update on resize
    
    return () => window.removeEventListener("resize", updateSpeed);
  }, []);

  return (
    <footer className="relative w-full bg-white text-gray-900 overflow-hidden">
      {/* World Map Background */}
      <div className="absolute inset-0 bg-contain bg-center opacity-80 bg-no-repeat" style={{ backgroundImage: `url(${worldMap})` }}></div>

      {/* Footer Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 text-left">
        {/* Company Info */}
        <div>
          <img src={ShiftlyLogo} alt="Shiftly" className="w-30 lg:w-40 text-center mx-auto" />
          <p className="text-lg">Technology-driven transport platform offering seamless booking, real-time tracking, and secure goods delivery.</p>
          <div className="flex space-x-3 mt-4">
            {[
              { name: "facebook", link: "https://facebook.com/shiftly" },
              { name: "x-twitter", link: "https://x.com/shiftly" },
              { name: "instagram", link: "https://instagram.com/shiftly" },
              { name: "linkedin", link: "https://linkedin.com/in/shiftly" }
            ].map((platform, index) => (
              <a 
                key={index} 
                href={platform.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-accent p-2 rounded transition-all duration-300 hover:bg-red-500 hover:-translate-y-1 hover:text-white cursor-pointer"
              >
                {platform.name === "facebook" && <FaFacebookF className="text-xl text-gray-900 hover:text-white" />}
                {platform.name === "x-twitter" && <FaXTwitter className="text-xl text-gray-900 hover:text-white" />}
                {platform.name === "instagram" && <FaInstagram className="text-xl text-gray-900 hover:text-white" />}
                {platform.name === "linkedin" && <FaLinkedin className="text-xl text-gray-900 hover:text-white" />}
              </a>
            ))}
          </div>
        </div>

        {/* Company Links */}
        <div>
          <h3 className="text-xl lg:text-2xl font-bold mb-4 text-text-heading border-b-2 border-primary inline-block">Company</h3>
          <ul className="space-y-3 font-bold">
            {[
              { name: "About Us", path: "/about-us" },
              { name: "Our Services", path: "/services" },
              { name: "Calculate Price", path: "/Calculate-Price" },
              { name: "FAQs", path: "/faqs"},
              { name: "Privacy Policy", path: "/privacy-policy" },
              { name: "Contact Us", path: "/contact-us" }
            ].map((item, index) => (
              <li key={index}>
                <span className="text-primary lg:text-2xl">&raquo;</span> 
                <Link to={item.path} className="lg:text-lg hover:text-primary ml-2">{item.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl lg:text-2xl font-bold mb-4 text-text-heading border-b-2 border-primary inline-block">Get In Touch</h3>
          <ul className="space-y-4">
            <li>
              <p className="text-red-600 font-bold lg:text-lg">ADDRESS:</p>
              <p className="lg:text-lg">123 Park Street, Kolkata, India</p>
            </li>
            <li>
              <p className="text-red-600 font-bold lg:text-lg">PHONE:</p>
              <p className="lg:text-lg">+91 8765 432100</p>
            </li>
            <li>
              <p className="text-red-600 font-bold lg:text-lg">MAIL US:</p>
              <p className="lg:text-lg">support@shiftly.com</p>
            </li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div>
          <h3 className="text-xl lg:text-2xl font-bold mb-4 text-text-heading border-b-2 border-primary inline-block">Newsletter Signup</h3>
          <div className="relative bg-accent rounded-lg p-2 flex items-center shadow-lg">
            <input type="email" placeholder="Your Email" className="bg-transparent flex-1 px-2 focus:outline-none lg:text-lg" />
            <button className="bg-red-500 text-white p-3 rounded-lg cursor-pointer hover:bg-red-700 hover:-translate-y-1"><FaArrowRight /></button>
          </div>
          <p className="mt-4 text-base">Subscribe to us and get all the benefits from today.</p>
        </div>
      </div>

      {/* Footer Shape with Trucks */}
      <div className="relative w-full bg-cover bg-bottom bg-no-repeat h-24 md:h-32 mt-8 overflow-hidden" style={{ backgroundImage: `url(${footerShape})` }}>
        <div className="absolute bottom-0 w-full h-full flex items-end">
          {/* 🚛 Truck 1 - Left to Right */}
          <motion.img 
            key={truckSpeeds.truck1}
            src={truck1}
            className="w-24 lg:w-28 h-auto absolute bottom-0" 
            alt="Truck 1"
            animate={{ x: ["100vw", "-100vw"] }} 
            transition={{ repeat: Infinity, duration: truckSpeeds.truck1, ease: "linear" }} 
          />

          {/* 🚚 Truck 2 - Right to Left */}
          <motion.img 
            key={truckSpeeds.truck2}
            src={truck2}
            className="w-24 lg:w-28 h-auto absolute bottom-0" 
            alt="Truck 2"
            animate={{ x: ["-100vw", "100vw"] }} 
            transition={{ repeat: Infinity, duration: truckSpeeds.truck2, ease: "linear" }} 
          />

          {/* 🚛 Truck 3 - Left to Right */}
          <motion.img 
            key={truckSpeeds.truck3}
            src={truck3}
            className="w-26 lg:w-36 h-auto absolute bottom-0" 
            alt="Truck 3"
            animate={{ x: ["100vw", "-100vw"] }} 
            transition={{ repeat: Infinity, duration: truckSpeeds.truck3, ease: "linear" }} 
          />
        </div>
      </div>

      {/* Copyright Section */}
      <div className="bg-body-dark text-white text-center py-6 lg:text-[17px] relative z-10">
        <span>© {new Date().getFullYear()} Shiftly, All Rights Reserved. Design By </span>
        <a href="https://linkedin.com/in/codecrafters" target="_blank" 
           className="text-primary font-bold cursor-pointer underline inline-block">
           @CodeCrafters
        </a>
      </div>
    </footer>
  );
}
