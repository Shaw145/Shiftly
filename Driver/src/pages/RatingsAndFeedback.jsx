import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaStar,
  FaThumbsUp,
  FaComment,
  FaCalendarAlt,
  FaChartLine,
  FaAward,
  FaArrowUp,
  FaArrowDown,
  FaExclamationTriangle,
  FaSearch,
  FaFilter,
} from "react-icons/fa";
import { useDriverAuth } from "../context/DriverAuthContext";
import DashboardLayout from "../components/DashboardLayout";

// Demo data for ratings and feedback
const demoRatings = [
  {
    id: 1,
    customerName: "John Smith",
    rating: 5,
    comment:
      "Excellent service! Driver was very professional and delivered my package on time. Would definitely use again.",
    date: "2023-05-15",
    bookingId: "BK78945612",
    responseGiven: true,
    response:
      "Thank you for your kind feedback. It was a pleasure serving you!",
  },
  {
    id: 2,
    customerName: "Emily Johnson",
    rating: 4,
    comment:
      "Very good service overall. The driver was polite and my shipment arrived in good condition.",
    date: "2023-05-10",
    bookingId: "BK45678923",
    responseGiven: false,
  },
  {
    id: 3,
    customerName: "Michael Brown",
    rating: 3,
    comment:
      "Delivery was a bit delayed but the driver communicated well about the issue. Items arrived safely.",
    date: "2023-05-05",
    bookingId: "BK12378945",
    responseGiven: true,
    response: "I apologize for the delay. Thank you for your understanding.",
  },
  {
    id: 4,
    customerName: "Sarah Williams",
    rating: 5,
    comment:
      "Amazing service! The driver went above and beyond to ensure my fragile items were handled with care.",
    date: "2023-04-28",
    bookingId: "BK78912345",
    responseGiven: true,
    response:
      "I'm glad I could help. Thank you for trusting me with your valuable items.",
  },
  {
    id: 5,
    customerName: "David Martinez",
    rating: 2,
    comment:
      "Delivery was late and the driver didn't follow my specific instructions for drop-off location.",
    date: "2023-04-20",
    bookingId: "BK56789012",
    responseGiven: true,
    response:
      "I sincerely apologize for the inconvenience. I'll ensure this doesn't happen again.",
  },
  {
    id: 6,
    customerName: "Jennifer Taylor",
    rating: 5,
    comment:
      "Exceptional service! Driver was friendly, professional, and delivery was ahead of schedule.",
    date: "2023-04-15",
    bookingId: "BK34567890",
    responseGiven: false,
  },
  {
    id: 7,
    customerName: "Robert Anderson",
    rating: 4,
    comment:
      "Good service. Driver kept me updated throughout the delivery process. Items arrived in good condition.",
    date: "2023-04-08",
    bookingId: "BK23456789",
    responseGiven: false,
  },
  {
    id: 8,
    customerName: "Lisa Garcia",
    rating: 5,
    comment:
      "Perfect service! The driver was extremely helpful and accommodating with my special requests.",
    date: "2023-04-01",
    bookingId: "BK12345678",
    responseGiven: true,
    response:
      "Thank you for your feedback. I'm happy I could accommodate your needs.",
  },
];

// Demo stats for performance
const demoStats = {
  averageRating: 4.1,
  totalRatings: 28,
  fiveStars: 14,
  fourStars: 8,
  threeStars: 3,
  twoStars: 2,
  oneStars: 1,
  topComments: [
    "Professional",
    "On time",
    "Careful",
    "Friendly",
    "Communicative",
  ],
  improvementAreas: ["Drop-off location", "Communication"],
  trend: "+0.3",
  lastMonth: 3.8,
};

const RatingsAndFeedback = () => {
  const { driverId } = useDriverAuth();
  const [stats, setStats] = useState(demoStats);
  const [ratings, setRatings] = useState(demoRatings);
  const [filteredRatings, setFilteredRatings] = useState(demoRatings);
  const [loading, setLoading] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [selectedRating, setSelectedRating] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isResponding, setIsResponding] = useState(false);

  // Set dynamic page title when component mounts
  useEffect(() => {
    // Update the document title
    document.title = "Ratings & Feedback | Performance Metrics | Shiftly - A Seamless Transport System";
    
    // Optional: Restore the original title when component unmounts
    return () => {
      document.title = "Shiftly | A Seamless Transport System";
    };
  }, []);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  // Fetch driver ratings and stats (simulated API call)
  useEffect(() => {
    setLoading(true);

    // Simulating API call
    setTimeout(() => {
      setRatings(demoRatings);
      setFilteredRatings(demoRatings);
      setStats(demoStats);
      setLoading(false);
    }, 800);
  }, [driverId]);

  // Filter ratings based on filter and search
  useEffect(() => {
    let results = [...ratings];

    // Apply star filter
    if (filter !== "all") {
      results = results.filter((rating) => {
        if (filter === "5") return rating.rating === 5;
        if (filter === "4") return rating.rating === 4;
        if (filter === "3") return rating.rating === 3;
        if (filter === "1-2") return rating.rating <= 2;
        if (filter === "pending") return !rating.responseGiven;
        return true;
      });
    }

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      results = results.filter(
        (rating) =>
          rating.customerName.toLowerCase().includes(search) ||
          rating.comment.toLowerCase().includes(search) ||
          rating.bookingId.toLowerCase().includes(search)
      );
    }

    setFilteredRatings(results);
  }, [filter, searchTerm, ratings]);

  // Handle response submission
  const handleSubmitResponse = (id) => {
    if (!responseText.trim()) return;

    // Update the rating with the response
    const updatedRatings = ratings.map((rating) =>
      rating.id === id
        ? { ...rating, responseGiven: true, response: responseText }
        : rating
    );

    setRatings(updatedRatings);
    setFilteredRatings(updatedRatings);
    setResponseText("");
    setIsResponding(false);
    setSelectedRating(null);
  };

  // Handle initiating a response
  const handleStartResponse = (rating) => {
    setSelectedRating(rating);
    setResponseText(rating.responseGiven ? rating.response : "");
    setIsResponding(true);
  };

  // Calculate percentage for the rating bars
  const calculatePercentage = (count) => {
    return (count / stats.totalRatings) * 100;
  };

  // Format date to more readable format
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-body-dark"
            >
              Your Ratings & Feedback
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-gray-600 mt-2"
            >
              Monitor your performance and respond to customer feedback
            </motion.p>
          </div>

          {/* Performance Overview Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {/* Average Rating Card */}
            <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-primary">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">
                    Average Rating
                  </h3>
                  <div className="mt-1 flex items-baseline">
                    <p className="text-3xl font-bold text-body-dark">
                      {stats.averageRating}
                    </p>
                    <p className="ml-2 text-sm text-gray-500">/ 5</p>
                  </div>
                </div>
                <div className="p-3 bg-primary bg-opacity-10 rounded-lg">
                  <FaStar className="text-2xl text-primary" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                {stats.trend.startsWith("+") ? (
                  <FaArrowUp className="text-green-500 mr-1" />
                ) : (
                  <FaArrowDown className="text-red-500 mr-1" />
                )}
                <span
                  className={`text-sm font-medium ${
                    stats.trend.startsWith("+")
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {stats.trend} from last month
                </span>
              </div>
            </div>

            {/* Total Reviews Card */}
            <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-blue-500">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">
                    Total Reviews
                  </h3>
                  <p className="mt-1 text-3xl font-bold text-body-dark">
                    {stats.totalRatings}
                  </p>
                </div>
                <div className="p-3 bg-blue-500 bg-opacity-10 rounded-lg">
                  <FaComment className="text-2xl text-blue-500" />
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                Last review: {formatDate(ratings[0]?.date || new Date())}
              </div>
            </div>

            {/* Top Feedback Card */}
            <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-green-500">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">
                    Top Feedback
                  </h3>
                  <p className="mt-1 text-3xl font-bold text-body-dark">
                    {stats.topComments[0]}
                  </p>
                </div>
                <div className="p-3 bg-green-500 bg-opacity-10 rounded-lg">
                  <FaThumbsUp className="text-2xl text-green-500" />
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {stats.topComments.slice(1, 4).map((comment, idx) => (
                  <span
                    key={idx}
                    className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full"
                  >
                    {comment}
                  </span>
                ))}
              </div>
            </div>

            {/* Improvement Areas Card */}
            <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-amber-500">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">
                    Improvement Areas
                  </h3>
                  <p className="mt-1 text-3xl font-bold text-body-dark">
                    {stats.improvementAreas.length}
                  </p>
                </div>
                <div className="p-3 bg-amber-500 bg-opacity-10 rounded-lg">
                  <FaExclamationTriangle className="text-2xl text-amber-500" />
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {stats.improvementAreas.map((area, idx) => (
                  <span
                    key={idx}
                    className="inline-block px-2 py-1 text-xs bg-amber-100 text-amber-800 rounded-full"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Ratings Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-xl shadow-md p-6 mb-8"
          >
            <h2 className="text-xl font-bold text-body-dark mb-6">
              Ratings Distribution
            </h2>
            <div className="space-y-3">
              {/* 5 Stars */}
              <div className="flex items-center">
                <div className="w-20 text-sm text-gray-600 flex items-center">
                  <FaStar className="text-amber-400 mr-1" /> 5
                </div>
                <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{
                      width: `${calculatePercentage(stats.fiveStars)}%`,
                    }}
                  ></div>
                </div>
                <div className="w-20 text-sm text-gray-600 text-right">
                  {stats.fiveStars} (
                  {Math.round(calculatePercentage(stats.fiveStars))}%)
                </div>
              </div>

              {/* 4 Stars */}
              <div className="flex items-center">
                <div className="w-20 text-sm text-gray-600 flex items-center">
                  <FaStar className="text-amber-400 mr-1" /> 4
                </div>
                <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full"
                    style={{
                      width: `${calculatePercentage(stats.fourStars)}%`,
                    }}
                  ></div>
                </div>
                <div className="w-20 text-sm text-gray-600 text-right">
                  {stats.fourStars} (
                  {Math.round(calculatePercentage(stats.fourStars))}%)
                </div>
              </div>

              {/* 3 Stars */}
              <div className="flex items-center">
                <div className="w-20 text-sm text-gray-600 flex items-center">
                  <FaStar className="text-amber-400 mr-1" /> 3
                </div>
                <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="bg-green-500 h-full rounded-full"
                    style={{
                      width: `${calculatePercentage(stats.threeStars)}%`,
                    }}
                  ></div>
                </div>
                <div className="w-20 text-sm text-gray-600 text-right">
                  {stats.threeStars} (
                  {Math.round(calculatePercentage(stats.threeStars))}%)
                </div>
              </div>

              {/* 2 Stars */}
              <div className="flex items-center">
                <div className="w-20 text-sm text-gray-600 flex items-center">
                  <FaStar className="text-amber-400 mr-1" /> 2
                </div>
                <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="bg-orange-500 h-full rounded-full"
                    style={{ width: `${calculatePercentage(stats.twoStars)}%` }}
                  ></div>
                </div>
                <div className="w-20 text-sm text-gray-600 text-right">
                  {stats.twoStars} (
                  {Math.round(calculatePercentage(stats.twoStars))}%)
                </div>
              </div>

              {/* 1 Star */}
              <div className="flex items-center">
                <div className="w-20 text-sm text-gray-600 flex items-center">
                  <FaStar className="text-amber-400 mr-1" /> 1
                </div>
                <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="bg-red-500 h-full rounded-full"
                    style={{ width: `${calculatePercentage(stats.oneStars)}%` }}
                  ></div>
                </div>
                <div className="w-20 text-sm text-gray-600 text-right">
                  {stats.oneStars} (
                  {Math.round(calculatePercentage(stats.oneStars))}%)
                </div>
              </div>
            </div>
          </motion.div>

          {/* Ratings List Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h2 className="text-xl font-bold text-body-dark">
                Customer Feedback
              </h2>

              {/* Filter Controls */}
              <div className="mt-4 md:mt-0 w-full md:w-auto flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full sm:w-60 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Search feedback..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaFilter className="text-gray-400" />
                  </div>
                  <select
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full sm:w-auto appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="all">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="1-2">1-2 Stars</option>
                    <option value="pending">Pending Response</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Ratings List */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredRatings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No ratings match your filters</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredRatings.map((rating) => (
                  <motion.div
                    key={rating.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className={`p-5 border rounded-xl ${
                      rating.rating >= 4
                        ? "border-green-200 bg-green-50"
                        : rating.rating >= 3
                        ? "border-blue-200 bg-blue-50"
                        : "border-amber-200 bg-amber-50"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row justify-between">
                      <div className="mb-4 md:mb-0">
                        <div className="flex items-center">
                          <h3 className="text-lg font-semibold">
                            {rating.customerName}
                          </h3>
                          <span className="ml-3 px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                            {rating.bookingId}
                          </span>
                        </div>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`${
                                i < rating.rating
                                  ? "text-amber-400"
                                  : "text-gray-300"
                              } text-xl`}
                            />
                          ))}
                          <span className="ml-2 text-sm text-gray-600">
                            {formatDate(rating.date)}
                          </span>
                        </div>
                        <p className="mt-3 text-gray-700">{rating.comment}</p>
                      </div>

                      <div className="flex flex-col md:items-end">
                        {/* Status Badge */}
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full ${
                            rating.responseGiven
                              ? "bg-green-100 text-green-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {rating.responseGiven
                            ? "Responded"
                            : "Response Needed"}
                        </span>

                        {/* Response or Respond Button */}
                        {isResponding && selectedRating?.id === rating.id ? (
                          <div className="mt-3 w-full md:w-80">
                            <textarea
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                              rows="3"
                              placeholder="Type your response here..."
                              value={responseText}
                              onChange={(e) => setResponseText(e.target.value)}
                            ></textarea>
                            <div className="flex justify-end mt-2 gap-2">
                              <button
                                className="px-3 py-1 text-sm bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 cursor-pointer"
                                onClick={() => setIsResponding(false)}
                              >
                                Cancel
                              </button>
                              <button
                                className="px-3 py-1 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark cursor-pointer"
                                onClick={() => handleSubmitResponse(rating.id)}
                              >
                                Submit
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            {rating.responseGiven ? (
                              <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200 w-full md:w-80">
                                <p className="text-sm text-gray-700 italic">
                                  "{rating.response}"
                                </p>
                                <button
                                  className="mt-2 text-xs text-primary hover:underline cursor-pointer"
                                  onClick={() => handleStartResponse(rating)}
                                >
                                  Edit Response
                                </button>
                              </div>
                            ) : (
                              <button
                                className="mt-3 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark cursor-pointer"
                                onClick={() => handleStartResponse(rating)}
                              >
                                Respond
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RatingsAndFeedback;
