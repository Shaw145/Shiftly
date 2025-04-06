import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import WelcomeCard from "../components/dashboard/WelcomeCard";
import StatsCard from "../components/dashboard/StatsCard";
import QuickActions from "../components/dashboard/QuickActions";
import BookingsOverview from "../components/dashboard/BookingsOverview";
import PerformanceMetrics from "../components/dashboard/PerformanceMetrics";
import EarningsSummary from "../components/dashboard/EarningsSummary";
import VehicleStatus from "../components/dashboard/VehicleStatus";
import { FaSpinner } from "react-icons/fa";

const Dashboard = () => {
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("driverToken");
    if (!token) {
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
    } catch (error) {
      console.error("Error:", error);
      navigate("/login");
    } finally {
      setLoading(false);
    }
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

      {/* Bookings Overview */}
      <div className="mt-6">
        <BookingsOverview />
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
    </DashboardLayout>
  );
};

export default Dashboard;
