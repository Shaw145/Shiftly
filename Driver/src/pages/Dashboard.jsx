import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import WelcomeCard from "../components/dashboard/WelcomeCard";
import StatsCard from "../components/dashboard/StatsCard";
import QuickActions from "../components/dashboard/QuickActions";
import BookingsOverview from "../components/dashboard/BookingsOverview";
import BidActivity from "../components/dashboard/BidActivity";
import PerformanceMetrics from "../components/dashboard/PerformanceMetrics";
import EarningsSummary from "../components/dashboard/EarningsSummary";
import VehicleStatus from "../components/dashboard/VehicleStatus";
import ProfileUpdateModal from "../components/ProfileUpdateModal";
import { FaSpinner } from "react-icons/fa";
import { isTokenExpired, clearDriverAuth } from "../utils/authUtils";


const Dashboard = () => {
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [hasAddress, setHasAddress] = useState(true); // Default to true to avoid flash of modal
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("driverToken");
    if (!token) {
      navigate("/login");
      return;
    }


    // Check if token is expired
    if (isTokenExpired(token)) {
      // Token is expired, clean up localStorage
      clearDriverAuth();
      navigate("/login");
      return;
    }


    fetchDriver();
  }, [navigate]);

  const fetchDriver = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/driver/me`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("driverToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch driver data");
      }

      const data = await response.json();
      setDriver(data);

      // After getting basic info, fetch the full profile to check for address
      fetchDriverProfile(data.username);
    } catch (error) {
      console.error("Error:", error);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchDriverProfile = async (username) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/driver/me/profile`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("driverToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch profile details");
      }

      const profileData = await response.json();

      // Check if driver has complete address
      const addressExists =
        profileData?.personalDetails?.address?.current?.addressLine1 &&
        profileData?.personalDetails?.address?.current?.city &&
        profileData?.personalDetails?.address?.current?.state &&
        profileData?.personalDetails?.address?.current?.pincode;

      setHasAddress(addressExists);

      // Show modal if address not found
      if (!addressExists) {
        setIsProfileModalOpen(true);
      }
    } catch (error) {
      console.error("Error fetching profile details:", error);
    }
  };

  const handleCloseModal = () => {
    setIsProfileModalOpen(false);
    document.body.style.overflow = "auto"; // Re-enable scrolling
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-red-500" />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-5">
        {/* Welcome Card - Takes 3 columns on large screens */}
        <div className="lg:col-span-3">
          <WelcomeCard driver={driver} />
        </div>

        {/* Quick Stats Summary - Takes 2 columns on large screens */}
        <div className="lg:col-span-2">
          <StatsCard driver={driver} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6">
        <QuickActions />
      </div>

      {/* Two column grid for Bookings Overview and Bid Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Bookings Overview */}
        <div>
          <BookingsOverview />
        </div>

        {/* Bid Activity */}
        <div>
          <BidActivity />
        </div>
      </div>

      {/* Earnings Summary */}
      <div className="mt-6">
        <EarningsSummary />
      </div>

      {/* Performance Metrics */}
      <div className="mt-6">
        <PerformanceMetrics driver={driver} />
      </div>

      {/* Vehicle Status */}
      <div className="mt-6">
        <VehicleStatus vehicle={driver?.vehicle} />
      </div>

      {/* Profile Update Modal */}
      <ProfileUpdateModal
        isOpen={isProfileModalOpen}
        onClose={handleCloseModal}
        username={driver?.username}
      />
    </DashboardLayout>
  );
};

export default Dashboard;