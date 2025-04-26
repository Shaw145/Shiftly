import { useState, useEffect } from "react";
// import TopNavbar from "../components/dashboard/TopNavbar";
// import Sidebar from "../components/dashboard/Sidebar";
import WelcomeCard from "../components/dashboard/WelcomeCard";
import StatisticsCard from "../components/dashboard/StatisticsCard";
import QuickActions from "../components/dashboard/QuickActions";
import LiveTrackingCard from "../components/dashboard/LiveTrackingCard";
import UpcomingBookings from "../components/dashboard/UpcomingBookings";
import RecentOrdersTable from "../components/dashboard/RecentOrdersTable";
import ProfileUpdateModal from "../components/ProfileUpdateModal";
import useProfileCheck from "../hooks/useProfileCheck";

const Dashboard = () => {
  const { isProfileComplete, user, loading } = useProfileCheck();
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Set dynamic page title when component mounts
  useEffect(() => {
    // Update the document title
    document.title = "Customer Dashboard | Manage Your Account | Shiftly - A Seamless Transport System";
    
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
    // Show the modal if profile is not complete (after initial loading)
    if (!loading && !isProfileComplete) {
      setShowProfileModal(true);
    }
  }, [isProfileComplete, loading]);

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 mt-20 lg:ml-24 md:ml-22">
      {/* Welcome Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 mb-4 sm:mb-6">
        <div className="lg:col-span-2">
          <WelcomeCard />
        </div>
        <div className="lg:col-span-1 lg:order-2">
          <StatisticsCard />
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="mb-4 sm:mb-6">
        <QuickActions />
      </div>

      {/* Live Tracking and Upcoming Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <LiveTrackingCard />
        <UpcomingBookings />
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <RecentOrdersTable />
      </div>

      {/* Profile Update Modal */}
      {!loading && user && (
        <ProfileUpdateModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          username={user.username}
        />
      )}
    </main>
  );
};

export default Dashboard;

// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";

// const Dashboard = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       navigate("/login"); // Redirect to login if no token
//       return;
//     }

//     // Check token expiration
//     const decodedToken = jwtDecode(token);
//     const currentTime = Date.now() / 1000; // Convert to seconds

//     if (decodedToken.exp < currentTime) {
//       // Token expired, log the user out
//       localStorage.removeItem("token");
//       localStorage.removeItem("fullName");
//       localStorage.removeItem("rememberMe");
//       navigate("/login");
//     }
//   }, [navigate]);

//   const fullName = localStorage.getItem("fullName");

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-lg text-center">
//         <h1 className="text-3xl font-bold mb-4">Welcome to Your Dashboard, {fullName}!</h1>
//         <p className="text-gray-700">You are now logged in!</p>
//         <button
//           onClick={() => {
//             localStorage.removeItem("token");
//             localStorage.removeItem("fullName");
//             localStorage.removeItem("rememberMe");
//             navigate("/login");
//           }}
//           className="mt-6 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-700"
//         >
//           Log Out
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
