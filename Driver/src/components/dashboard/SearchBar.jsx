import { useState, useRef, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ placeholder = "Search..." }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const searchRef = useRef(null);

  // Driver-specific search items
  const searchItems = [
    { text: "Dashboard", link: "/dashboard" },
    { text: "Available Bookings", link: "/available-bookings" },
    { text: "My Bookings", link: "/my-bookings" },
    { text: "Live Tracking", link: "/live-tracking" },
    { text: "Earnings & Payment", link: "/earnings" },
    { text: "Rating & Feedback", link: "/ratings" },
    { text: "Vehicle Details", link: "/vehicle" },
    { text: "Documents", link: "/documents" },
    { text: "Support", link: "/support" },
    { text: "Profile Settings", link: "/settings" },
    { text: "Notifications", link: "/notifications" },
    { text: "Settings", link: "/settings" },
    { text: "Transaction History", link: "/transactions" },
    { text: "Help Center", link: "/help" },
    { text: "Terms & Conditions", link: "/terms" },
    { text: "Privacy Policy", link: "/privacy" },
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
    <div className="relative w-full" ref={searchRef}>
      <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 border border-gray-200">
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleSearch}
          className="w-full bg-transparent focus:outline-none text-gray-700 placeholder-gray-500 text-sm"
        />
        <FaSearch className="text-red-500 hover:text-red-700 cursor-pointer ml-2 flex-shrink-0" />
      </div>

      {/* Suggestions with custom scrollbar */}
      {suggestions.length > 0 && (
        <div className="absolute top-12 left-0 w-full bg-white rounded-lg shadow-lg border border-gray-100 z-50 max-h-[300px] overflow-y-auto scrollbar-hide">
          <style>
            {`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
              .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}
          </style>
          <ul className="py-2">
            {suggestions.map((item, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-red-50 text-gray-700 hover:text-red-600 cursor-pointer transition-colors duration-200 text-sm"
                onClick={() => {
                  window.location.href = item.link;
                  setSuggestions([]);
                  setQuery("");
                }}
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
