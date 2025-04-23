import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import VerifyOTP from "./pages/VerifyOTP";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import { ProfileProvider } from "./context/ProfileContext";
import { DriverAuthProvider } from "./context/DriverAuthContext";
import PublicRoute from "./components/PublicRoute";
import DriverProfile from "./pages/DriverProfile";
import Settings from "./pages/Settings";
import AvailableBookings from "./pages/AvailableBookings";
import BookingDetails from "./pages/BookingDetails";
import MyBookings from "./pages/MyBookings";
import AllBids from "./pages/AllBids";
import { WebSocketProvider } from "./context/WebSocketContext";
import ConfirmedBookingDetails from "./pages/ConfirmedBookingDetails";
import HowItWorks from "./pages/HowItWorks";
import RatingsAndFeedback from "./pages/RatingsAndFeedback";
import EarningsAndPayment from "./pages/EarningsAndPayment";


function App() {
  return (
    <DriverAuthProvider>
      <ProfileProvider>
        <Router>
          <WebSocketProvider>
            <Routes>
              {/* Redirect root to login */}
              <Route path="/" element={<Navigate to="/login" replace />} />

              {/* Public routes */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/signup"
                element={
                  <PublicRoute>
                    <Signup />
                  </PublicRoute>
                }
              />
              <Route
                path="/verify-otp"
                element={
                  <PublicRoute>
                    <VerifyOTP />
                  </PublicRoute>
                }
              />
              <Route path="/terms" element={<Terms />} />
              <Route path="/how-it-works" element={<HowItWorks />} />

              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <PublicRoute protected={true}>
                    <Dashboard />
                  </PublicRoute>
                }
              />
              <Route
                path="/profile/:username"
                element={
                  <PublicRoute protected={true}>
                    <DriverProfile />
                  </PublicRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <PublicRoute protected={true}>
                    <Settings />
                  </PublicRoute>
                }
              />
              <Route
                path="/available-bookings"
                element={
                  <PublicRoute protected={true}>
                    <AvailableBookings />
                  </PublicRoute>
                }
              />
              <Route
                path="/available-bookings/:bookingId"
                element={
                  <PublicRoute protected={true}>
                    <BookingDetails />
                  </PublicRoute>
                }
              />
              <Route
                path="/booking/:bookingId"
                element={
                  <PublicRoute protected={true}>
                    <BookingDetails />
                  </PublicRoute>
                }
              />
              <Route
                path="/my-bookings"
                element={
                  <PublicRoute protected={true}>
                    <MyBookings />
                  </PublicRoute>
                }
              />
              <Route
                path="/my-bids"
                element={
                  <PublicRoute protected={true}>
                    <AllBids />
                  </PublicRoute>
                }
              />
              <Route
                path="/confirmed-bookings/:bookingId"
                element={
                  <PublicRoute protected={true}>
                    <ConfirmedBookingDetails />
                  </PublicRoute>
                }
              />
              <Route
                path="/ratings"
                element={
                  <PublicRoute protected={true}>
                    <RatingsAndFeedback />
                  </PublicRoute>
                }
              />
              <Route
                path="/earnings"
                element={
                  <PublicRoute protected={true}>
                    <EarningsAndPayment />
                  </PublicRoute>
                }
              />
              

              {/* 404 Route - Must be last */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </WebSocketProvider>
        </Router>
      </ProfileProvider>
    </DriverAuthProvider>
  );
}

export default App;
