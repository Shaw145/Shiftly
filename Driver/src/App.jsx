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
import PublicRoute from "./components/PublicRoute";
import DriverProfile from "./pages/DriverProfile";
import Settings from "./pages/Settings";
import AvailableBookings from "./pages/AvailableBookings";
import BookingDetails from "./pages/BookingDetails";

function App() {
  return (
    <ProfileProvider>
      <Router>
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

          {/* 404 Route - Must be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ProfileProvider>
  );
}

export default App;
