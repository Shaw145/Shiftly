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

function App() {
  return (
    <ProfileProvider>
      <Router>
        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/terms" element={<Terms />} />

          {/* 404 Route - Must be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ProfileProvider>
  );
}

export default App;
