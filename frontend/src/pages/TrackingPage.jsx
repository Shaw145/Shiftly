import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ShipmentTracker from "../components/tracking/ShipmentTracker";
import LiveTrackingMap from "../components/tracking/LiveTrackingMap";

const TrackingPage = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set dynamic page title when component mounts
  useEffect(() => {
    // Update the document title
    document.title = "Live Tracking | Monitor Your Shipment | Shiftly - A Seamless Transport System";
    
    // Optional: Restore the original title when component unmounts
    return () => {
      document.title = "Shiftly | A Seamless Transport System";
    };
  }, []);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/bookings/find/${bookingId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch booking details");
        }

        setBooking(data.booking);
      } catch (error) {
        console.error("Error fetching booking:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Unable to load tracking information
          </h2>
          <p className="text-gray-600">{error || "Booking not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 mt-30 md:ml-24 lg:ml-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Track Shipment #{booking.bookingId}
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ShipmentTracker booking={booking} />
          <LiveTrackingMap bookingId={bookingId} />
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;
