// import { useState } from "react";
import {
  FaMapMarkerAlt,
  FaClock,
  FaRupeeSign,
  FaTruck,
  FaArrowRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const BookingsOverview = () => {
  const navigate = useNavigate();

  // Sample data - In real app, this would come from API
  const availableBookings = [
    {
      id: 1,
      pickup: "Sector V, Kolkata",
      dropoff: "Park Street, Kolkata",
      time: "2:30 PM",
      date: "Today",
      amount: "850",
      distance: "12.5 km",
      vehicleType: "Mini Truck",
      goodsType: "Electronics",
    },
    {
      id: 2,
      pickup: "Salt Lake, Kolkata",
      dropoff: "Howrah, Kolkata",
      time: "4:00 PM",
      date: "Today",
      amount: "1200",
      distance: "18 km",
      vehicleType: "Pickup Truck",
      goodsType: "Furniture",
    },
    {
      id: 3,
      pickup: "New Town, Kolkata",
      dropoff: "Barasat, Kolkata",
      time: "5:30 PM",
      date: "Today",
      amount: "1500",
      distance: "25 km",
      vehicleType: "Large Truck",
      goodsType: "Construction Materials",
    },
  ];

  const myBookings = [
    {
      id: 4,
      pickup: "Dumdum, Kolkata",
      dropoff: "Sealdah, Kolkata",
      time: "Now",
      date: "In Progress",
      amount: "650",
      distance: "9 km",
      status: "In Transit",
      customerName: "Rahul Sharma",
    },
    {
      id: 5,
      pickup: "Garia, Kolkata",
      dropoff: "Behala, Kolkata",
      time: "1:30 PM",
      date: "Today",
      amount: "750",
      distance: "15 km",
      status: "Picked Up",
      customerName: "Priya Singh",
    },
    {
      id: 6,
      pickup: "Kasba, Kolkata",
      dropoff: "EM Bypass, Kolkata",
      time: "11:30 AM",
      date: "Today",
      amount: "550",
      distance: "8 km",
      status: "Completed",
      customerName: "Amit Roy",
    },
  ];

  const BookingCard = ({ booking, type }) => (
    <div className="bg-white rounded-lg border border-gray-100 p-3 sm:p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4 mb-3 sm:mb-4">
        <div className="flex-1">
          <div className="flex items-center text-gray-600 text-sm mb-2">
            <FaClock className="mr-2 text-red-500" />
            <span>{booking.time}</span>
            <span className="mx-2">•</span>
            <span>{booking.date}</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-start">
              <FaMapMarkerAlt className="text-green-500 mt-1 mr-2 flex-shrink-0" />
              <p className="text-gray-800 text-sm sm:text-base">
                {booking.pickup}
              </p>
            </div>
            <div className="flex items-start">
              <FaMapMarkerAlt className="text-red-500 mt-1 mr-2 flex-shrink-0" />
              <p className="text-gray-800 text-sm sm:text-base">
                {booking.dropoff}
              </p>
            </div>
          </div>
        </div>
        <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-0">
          <div className="flex items-center text-lg font-semibold text-gray-800">
            <FaRupeeSign className="text-red-500" />
            {booking.amount}
          </div>
          <p className="text-sm text-gray-600">{booking.distance}</p>
        </div>
      </div>

      {type === "available" ? (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <div className="flex items-center text-gray-600">
              <FaTruck className="mr-2 text-blue-500" />
              <span className="text-sm">{booking.vehicleType}</span>
            </div>
            <span className="text-sm text-gray-600">{booking.goodsType}</span>
          </div>
          <button
            onClick={() => navigate(`/booking/${booking.id}`)}
            className="w-full sm:w-auto bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors duration-200 cursor-pointer"
          >
            View Details
          </button>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">{booking.customerName}</p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs sm:text-sm ${
                booking.status === "Completed"
                  ? "bg-green-100 text-green-700"
                  : booking.status === "In Transit"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {booking.status}
            </span>
          </div>
          <button
            onClick={() => navigate(`/my-booking/${booking.id}`)}
            className="w-full sm:w-auto bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-red-500 hover:text-white transition-colors duration-200 cursor-pointer"
          >
            Track
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* Available Bookings */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Available Bookings
          </h2>
          <button
            onClick={() => navigate("/available-bookings")}
            className="text-red-500 hover:text-red-600 flex items-center text-sm font-medium cursor-pointer"
          >
            View All <FaArrowRight className="ml-2" />
          </button>
        </div>
        <div className="space-y-3 sm:space-y-4">
          {availableBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} type="available" />
          ))}
        </div>
      </div>

      {/* My Bookings */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">My Bookings</h2>
          <button
            onClick={() => navigate("/my-bookings")}
            className="text-red-500 hover:text-red-600 flex items-center text-sm font-medium cursor-pointer"
          >
            View All <FaArrowRight className="ml-2" />
          </button>
        </div>
        <div className="space-y-4">
          {myBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} type="my" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookingsOverview;
