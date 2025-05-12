import { useState, useEffect, useRef } from "react";
import {
  FaShare,
  FaCheck,
  FaCopy,
  FaWhatsapp,
  FaEnvelope,
  FaQrcode,
  FaLink,
} from "react-icons/fa";
import PropTypes from "prop-types";

/**
 * Button component that allows sharing a tracking link
 * @param {Object} props
 * @param {string} props.bookingId - The ID of the booking to share
 * @param {boolean} props.isButton - Whether to render as a button or a normal link
 * @param {string} props.className - Additional CSS classes
 */
const ShareTrackingLinkButton = ({
  bookingId,
  isButton = true,
  className = "",
}) => {
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareMenuRef = useRef(null);
  const buttonRef = useRef(null);

  // Create the tracking URL using the public tracking route
  const trackingUrl = `${window.location.origin}/tracking/${bookingId}`;

  // Handle closing the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        shareMenuRef.current &&
        !shareMenuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowShareOptions(false);
      }
    };

    if (showShareOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showShareOptions]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(trackingUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShareWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=Track%20my%20shipment%20in%20real-time%3A%20${encodeURIComponent(
      trackingUrl
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleShareEmail = () => {
    const subject = "Track my shipment in real-time";
    const body = `Here's the tracking link for my shipment: ${trackingUrl}`;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  if (isButton) {
    return (
      <div className="relative">
        <button
          ref={buttonRef}
          onClick={() => setShowShareOptions(!showShareOptions)}
          className={`flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg cursor-pointer ${className}`}
        >
          <FaShare className="text-sm" />
          <span>Share Tracking Link</span>
        </button>

        {showShareOptions && (
          <div
            ref={shareMenuRef}
            className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl z-50 overflow-hidden border border-gray-100"
          >
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-red-50 to-white">
              <h3 className="text-gray-800 font-medium mb-2">
                Share tracking link
              </h3>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={trackingUrl}
                    readOnly
                    className="bg-white border border-gray-200 text-gray-600 text-xs p-2 pr-8 rounded w-full"
                    onClick={(e) => e.target.select()}
                  />
                  <button
                    onClick={handleCopyLink}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                  >
                    {copied ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <FaCopy />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-2">
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-50 text-left rounded-lg transition duration-150"
              >
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                  <FaLink />
                </div>
                <div>
                  <span className="font-medium">Copy link</span>
                  <p className="text-xs text-gray-500">Copy to clipboard</p>
                </div>
              </button>

              <button
                onClick={handleShareWhatsApp}
                className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-50 text-left rounded-lg transition duration-150"
              >
                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                  <FaWhatsapp />
                </div>
                <div>
                  <span className="font-medium">WhatsApp</span>
                  <p className="text-xs text-gray-500">Share via WhatsApp</p>
                </div>
              </button>

              <button
                onClick={handleShareEmail}
                className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-50 text-left rounded-lg transition duration-150"
              >
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                  <FaEnvelope />
                </div>
                <div>
                  <span className="font-medium">Email</span>
                  <p className="text-xs text-gray-500">Share via Email</p>
                </div>
              </button>

              {/* <button
                onClick={handleCopyLink}
                className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-50 text-left rounded-lg transition duration-150"
              >
                <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
                  <FaQrcode />
                </div>
                <div>
                  <span className="font-medium">QR Code</span>
                  <p className="text-xs text-gray-500">Show QR code</p>
                </div>
              </button> */}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Non-button/link version
  return (
    <div className={`relative inline-block ${className}`}>
      <button
        ref={buttonRef}
        onClick={() => setShowShareOptions(!showShareOptions)}
        className="flex items-center gap-1 text-red-500 hover:text-red-600"
      >
        <FaShare className="text-xs" />
        <span className="text-sm">Share</span>
      </button>

      {showShareOptions && (
        <div
          ref={shareMenuRef}
          className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl z-50 overflow-hidden border border-gray-100"
        >
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-red-50 to-white">
            <h3 className="text-gray-800 font-medium mb-2">
              Share tracking link
            </h3>
            <div className="flex items-center gap-2 mb-1">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={trackingUrl}
                  readOnly
                  className="bg-white border border-gray-200 text-gray-600 text-xs p-2 pr-8 rounded w-full"
                  onClick={(e) => e.target.select()}
                />
                <button
                  onClick={handleCopyLink}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  {copied ? <FaCheck className="text-green-500" /> : <FaCopy />}
                </button>
              </div>
            </div>
          </div>

          <div className="p-2">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-50 text-left rounded-lg transition duration-150"
            >
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                <FaLink />
              </div>
              <div>
                <span className="font-medium">Copy link</span>
                <p className="text-xs text-gray-500">Copy to clipboard</p>
              </div>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-50 text-left rounded-lg transition duration-150"
            >
              <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                <FaWhatsapp />
              </div>
              <div>
                <span className="font-medium">WhatsApp</span>
                <p className="text-xs text-gray-500">Share via WhatsApp</p>
              </div>
            </button>

            <button
              onClick={handleShareEmail}
              className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-50 text-left rounded-lg transition duration-150"
            >
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                <FaEnvelope />
              </div>
              <div>
                <span className="font-medium">Email</span>
                <p className="text-xs text-gray-500">Share via Email</p>
              </div>
            </button>

            <button
              onClick={handleCopyLink}
              className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-50 text-left rounded-lg transition duration-150"
            >
              <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
                <FaQrcode />
              </div>
              <div>
                <span className="font-medium">QR Code</span>
                <p className="text-xs text-gray-500">Show QR code</p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

ShareTrackingLinkButton.propTypes = {
  bookingId: PropTypes.string.isRequired,
  isButton: PropTypes.bool,
  className: PropTypes.string,
};

export default ShareTrackingLinkButton;
