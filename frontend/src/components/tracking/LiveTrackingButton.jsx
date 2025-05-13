import { useNavigate } from "react-router-dom";
import { FaMapMarkedAlt } from "react-icons/fa";
import PropTypes from "prop-types";

/**
 * Live tracking button component for navigating to the tracking page
 * @param {Object} props Component props
 * @param {string} props.bookingId The ID of the booking to track
 * @param {string} props.buttonText Custom button text (optional)
 */
const LiveTrackingButton = ({ bookingId, buttonText }) => {
  const navigate = useNavigate();

  // Navigate directly to the customer tracking view
  const goToTracking = () => {
    navigate(`/track/${bookingId}`);
  };

  return (
    <button
      onClick={goToTracking}
      className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-all flex items-center justify-center gap-2 shadow-md font-medium cursor-pointer"
    >
      <FaMapMarkedAlt className="text-lg" />
      {buttonText || "View Live Tracking Map"}
    </button>
  );
};

LiveTrackingButton.propTypes = {
  bookingId: PropTypes.string.isRequired,
  buttonText: PropTypes.string,
};

export default LiveTrackingButton;
