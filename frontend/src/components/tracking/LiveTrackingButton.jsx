import { useNavigate } from "react-router-dom";
import { FaMapMarkedAlt } from "react-icons/fa";

const LiveTrackingButton = ({ bookingId }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/track/${bookingId}`)}
      className="w-full bg-red-500 text-white py-4 rounded-lg hover:bg-red-600 transition-all flex items-center justify-center gap-2"
    >
      <FaMapMarkedAlt className="text-xl" />
      Track Live Location
    </button>
  );
};

export default LiveTrackingButton;
