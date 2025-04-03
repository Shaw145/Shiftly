/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useRef } from "react"; // Added useRef for touch handling
import { FaStar, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import ScrollingFeatures from "./ScrollingFeatures";
import StatsSection from "./StatsSection";
import customer1 from "../assets/Customer 1.png"; // Import customer images
import customer2 from "../assets/Customer 2.jpg";
import customer3 from "../assets/Customer 3.jpg";
import customer4 from "../assets/Customer 4.jpg";
import customer5 from "../assets/Customer 5.jpg";
import customer6 from "../assets/Customer 6.jpg";
import customer7 from "../assets/Customer 7.jpg";
import customer8 from "../assets/Customer 8.jpg";
import customer9 from "../assets/Customer 9.png";
import customer10 from "../assets/Customer 10.png";
import worldMap from "../assets/worldmap.png"; // Import truck image

const reviews = [
  {
    name: "Amit Sharma",
    text: "Amazing service! Everything was handled professionally, and my goods arrived in perfect condition. Will definitely recommend to others.",
    rating: 5,
    image: customer1,
  },
  {
    name: "Sourav Banerjee",
    text: "Great experience! The transport was smooth, and customer support was very helpful throughout the process. Easy to track my shipment as well!",
    rating: 4,
    image: customer2,
  },
  {
    name: "Neha Das",
    text: "Affordable and efficient. Booking was easy, and tracking my shipment in real-time was a big plus. Definitely a great service!",
    rating: 5,
    image: customer3,
  },
  {
    name: "Indranil Basu",
    text: "Good experience overall. The pricing was fair, but there is room for improvement in communication. Would still use again!",
    rating: 3,
    image: customer4,
  },
  {
    name: "Ipsita Dutta",
    text: "The best transport service I've ever used! The drivers were professional, and the process was hassle-free. Highly recommend!",
    rating: 5,
    image: customer5,
  },
  {
    name: "Ritwik Sen",
    text: "Professional and punctual service! The driver arrived on time and handled my goods with care. Will be using again soon!",
    rating: 4,
    image: customer6,
  },
  {
    name: "Madhumita Ghosh",
    text: "Loved the tracking feature! It gave me peace of mind knowing exactly where my shipment was. So convenient and reliable!",
    rating: 5,
    image: customer7,
  },
  {
    name: "Rohan Mehta",
    text: "Fair pricing, great support, and timely delivery. Highly recommend Shiftly for transportation needs. Reliable service!",
    rating: 4,
    image: customer8,
  },
  {
    name: "Eshana Das",
    text: "Quick and safe transport. The entire process was seamless, and I'll definitely use this service again! Best logistics company so far!",
    rating: 5,
    image: customer9,
  },
  {
    name: "Arjun Patel",
    text: "Easy booking, excellent service, and the driver was very courteous. Shiftly is now my go-to transport service!",
    rating: 5,
    image: customer10,
  },
];

const CustomerReviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startX, setStartX] = useState(null); // Track the start position of the swipe
  const carouselRef = useRef(null); // Ref for the carousel container

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Handle touch start event
  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX); // Record the initial touch position
  };

  // Handle touch move event
  const handleTouchMove = (e) => {
    if (!startX) return; // If no initial touch position, do nothing

    const currentX = e.touches[0].clientX; // Get the current touch position
    const diffX = startX - currentX; // Calculate the difference

    if (diffX > 50) {
      // Swipe left (next card)
      handleNext();
      setStartX(null); // Reset the start position
    } else if (diffX < -50) {
      // Swipe right (previous card)
      handlePrev();
      setStartX(null); // Reset the start position
    }
  };

  // Determine which cards to display (3 at a time)
  const visibleCards = [];
  for (let i = 0; i < 3; i++) {
    const index = (currentIndex + i) % reviews.length;
    visibleCards.push(reviews[index]);
  }

  return (
    <>
      <div className="relative ">
        <ScrollingFeatures />

        <section className="relative w-full py-16 px-6 md:px-20 bg-body-dark text-center overflow-hidden">
          <img
            src={worldMap}
            alt="World Map"
            className="absolute top-10 left-20 w-full h-full object-contain opacity-100"
          />
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-10">
            Customer Reviews
          </h2>

          <div className="relative max-w-6xl mx-auto overflow-hidden">
            {/* Left Arrow */}
            <button
              onClick={handlePrev}
              className="hidden md:block absolute left-0 top-1/2 transform -translate-y-1/2 bg-red-500 p-4 rounded-full shadow-lg hover:bg-red-700 z-10 transition-transform duration-300 hover:scale-110"
            >
              <FaArrowLeft className="text-2xl text-white" />
            </button>

            {/* Carousel */}
            <div
              ref={carouselRef}
              className="overflow-hidden relative w-full"
              onTouchStart={handleTouchStart} // Add touch start event
              onTouchMove={handleTouchMove} // Add touch move event
            >
              <div className="flex gap-6 justify-center">
                {visibleCards.map((review, i) => (
                  <div
                    key={i}
                    className="min-w-[300px] md:min-w-[350px] lg:min-w-[400px] max-w-[400px] h-[450px] p-8 bg-white rounded-xl shadow-xl flex flex-col items-center"
                  >
                    <img
                      src={review.image}
                      alt={review.name}
                      className="w-24 h-24 rounded-full mb-6 object-cover"
                    />
                    <h3 className="text-2xl font-bold text-gray-900">
                      {review.name}
                    </h3>
                    <p className="text-gray-800 text-lg mt-4 text-center leading-relaxed">
                      {review.text}
                    </p>
                    <div className="flex mt-4 text-yellow-500 text-2xl">
                      {[...Array(review.rating)].map((_, j) => (
                        <FaStar key={j} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Arrow */}
            <button
              onClick={handleNext}
              className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 bg-red-500 p-4 rounded-full shadow-lg hover:bg-red-700 z-10 transition-transform duration-300 hover:scale-110"
            >
              <FaArrowRight className="text-2xl text-white" />
            </button>
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center mt-8 space-x-2">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  i === currentIndex ? "bg-primary" : "bg-white"
                }`}
              />
            ))}
          </div>
        </section>

        {/* Stats Section (Placed Below on Small Screens) */}
        <div className="relative mt-120 md:mt-30 2xl:mt-27">
          <StatsSection />
        </div>
      </div>
    </>
  );
};

export default CustomerReviews;
