import { useState, useRef, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const searchRef = useRef(null);

  const searchItems = [
    { text: "Home", link: "/" },
    { text: "Book Transport", link: "/book-transport" },
    { text: "Book Now", link: "/book-transport" },
    { text: "My Bookings", link: "/my-bookings" },
    { text: "Live Tracking", link: "/live-tracking" },
    { text: "Support", link: "/support" },
    { text: "Offers", link: "/offers" },
    { text: "About Us", link: "/about-us" },
    { text: "Contact Us", link: "/contact-us" },
    { text: "Services", link: "/services"},
    { text: "Calculate Price", link: "/calculate-price"},
    { text: "Terms & Conditions", link: "/terms-and-conditions" },
    { text: "Privacy Policy", link: "/privacy-policy" },
    { text: "Dashboard", link: "/dashboard" },
    { text: "Profile", link: "/profile"},
    { text: "Settings", link: "/settings"},
    { text: "Transactions History", link: "/transactions"},
    { text: "Driver", link: "/drivers"},
    { text: "How it works", link: "/how-it-works"},
  ];

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value) {
      const filteredSuggestions = searchItems.filter((item) =>
        item.text.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full sm:w-82" ref={searchRef}>
      <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 border border-gray-200">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={handleSearch}
          className="w-full bg-transparent focus:outline-none"
        />
        <FaSearch className="text-red-500 hover:text-red-700 cursor-pointer" />
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="absolute top-10 left-0 w-full bg-white rounded-lg shadow-lg border border-gray-100 z-50">
          <ul className="py-2">
            {suggestions.map((item, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-red-500 hover:text-white cursor-pointer"
                onClick={() => window.location.href = item.link}
              >
                {item.text}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;