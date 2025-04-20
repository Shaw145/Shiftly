import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaWifi,
  FaExclamationTriangle,
  FaSync,
  FaInfoCircle,
  FaPlayCircle,
  FaStopCircle,
  FaServer,
  FaArrowLeft,
  FaRegCheckCircle,
} from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";
import DashboardLayout from "../components/DashboardLayout";
import { useWebSocket } from "../context/WebSocketContext";

/**
 * WebSocket Debug and Management Page
 * This page allows users to see WebSocket connection details and manually
 * manage the connection for troubleshooting purposes
 */
const WebsocketDebug = () => {
  const {
    socket,
    isConnected,
    reconnect,
    isConnectionBlocked,
    isServerAvailable,
  } = useWebSocket();
  const navigate = useNavigate();

  // Local state for tracking events and connection attempts
  const [lastReconnectTime, setLastReconnectTime] = useState(null);
  const [connectionEvents, setConnectionEvents] = useState([
    {
      type: "info",
      message: "WebSocket debug page loaded",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [lastReceivedMessage, setLastReceivedMessage] = useState(null);

  // Add event to log
  const logEvent = useCallback((type, message) => {
    const newEvent = {
      type,
      message,
      timestamp: new Date().toISOString(),
    };

    setConnectionEvents((prev) => [newEvent, ...prev.slice(0, 19)]);
  }, []);

  // Handle manual reconnection
  const handleReconnect = async () => {
    logEvent("info", "Manual reconnect initiated");
    setLastReconnectTime(new Date().toISOString());

    try {
      const result = await reconnect();
      if (result) {
        logEvent("success", "Reconnection successful");
        toast.success("WebSocket connection reestablished");
      } else {
        logEvent("error", "Reconnection failed - server may be offline");
        toast.error("Failed to reconnect. Server may be offline.");
      }
    } catch (error) {
      logEvent("error", `Reconnection error: ${error.message}`);
      toast.error("Reconnection error: " + error.message);
    }
  };

  // Listen for WebSocket events
  useEffect(() => {
    if (!socket || !socket.on) return;

    // Log connection status changes
    logEvent(
      isConnected ? "success" : "warning",
      isConnected ? "WebSocket connected" : "WebSocket disconnected"
    );

    // Set up listener for various WebSocket events
    const messageHandler = (data) => {
      setLastReceivedMessage({
        type: data.type || "unknown",
        payload: data.payload || {},
        timestamp: new Date().toISOString(),
      });

      logEvent("info", `Received message of type: ${data.type || "unknown"}`);
    };

    // Subscribe to all events
    const unsubscribe = socket.on("*", messageHandler);

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [socket, isConnected, logEvent]);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header with back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-red-600 mb-6 transition-all cursor-pointer"
        >
          <FaArrowLeft /> Back
        </button>

        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          WebSocket Connection Debug
        </h1>
        <p className="text-gray-600 mb-6">
          Monitor and troubleshoot your real-time connection to the server
        </p>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Connection Status */}
          <div
            className={`bg-white rounded-xl shadow-sm p-6 border-l-4 ${
              isConnected ? "border-green-500" : "border-red-500"
            }`}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                Connection Status
              </h2>
              <span
                className={`flex items-center justify-center w-12 h-12 rounded-full ${
                  isConnected
                    ? "bg-green-100 text-green-500"
                    : "bg-red-100 text-red-500"
                }`}
              >
                <FaWifi size={24} />
              </span>
            </div>
            <p
              className={`text-lg mt-2 font-medium ${
                isConnected ? "text-green-600" : "text-red-600"
              }`}
            >
              {isConnected ? "Connected" : "Disconnected"}
            </p>
            {!isConnected && (
              <button
                onClick={handleReconnect}
                disabled={isConnectionBlocked}
                className={`mt-4 px-4 py-2 rounded-md flex items-center gap-2 ${
                  isConnectionBlocked
                    ? "bg-gray-300 cursor-not-allowed text-gray-500"
                    : "bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                }`}
              >
                <FaSync /> Reconnect
              </button>
            )}
          </div>

          {/* Server Status */}
          <div
            className={`bg-white rounded-xl shadow-sm p-6 border-l-4 ${
              isServerAvailable ? "border-green-500" : "border-yellow-500"
            }`}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                Server Status
              </h2>
              <span
                className={`flex items-center justify-center w-12 h-12 rounded-full ${
                  isServerAvailable
                    ? "bg-green-100 text-green-500"
                    : "bg-yellow-100 text-yellow-500"
                }`}
              >
                <FaServer size={24} />
              </span>
            </div>
            <p
              className={`text-lg mt-2 font-medium ${
                isServerAvailable ? "text-green-600" : "text-yellow-600"
              }`}
            >
              {isServerAvailable ? "Online" : "Offline"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {isServerAvailable
                ? "Server is accepting connections"
                : "Server appears to be unreachable"}
            </p>
          </div>

          {/* Connection Block Status */}
          <div
            className={`bg-white rounded-xl shadow-sm p-6 border-l-4 ${
              isConnectionBlocked ? "border-orange-500" : "border-green-500"
            }`}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                Connection Policy
              </h2>
              <span
                className={`flex items-center justify-center w-12 h-12 rounded-full ${
                  isConnectionBlocked
                    ? "bg-orange-100 text-orange-500"
                    : "bg-green-100 text-green-500"
                }`}
              >
                {isConnectionBlocked ? (
                  <FaExclamationTriangle size={24} />
                ) : (
                  <FaRegCheckCircle size={24} />
                )}
              </span>
            </div>
            <p
              className={`text-lg mt-2 font-medium ${
                isConnectionBlocked ? "text-orange-600" : "text-green-600"
              }`}
            >
              {isConnectionBlocked ? "Temporarily Blocked" : "Available"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {isConnectionBlocked
                ? "Too many reconnection attempts. Please wait."
                : "Reconnection is allowed"}
            </p>
          </div>
        </div>

        {/* Event Log and Last Message */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Event Log */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaInfoCircle className="text-red-500" /> Connection Events
            </h2>
            <div className="h-96 overflow-y-auto border border-gray-200 rounded-md p-2">
              {connectionEvents.map((event, index) => (
                <div
                  key={index}
                  className={`p-2 mb-2 rounded ${
                    event.type === "error"
                      ? "bg-red-50 border-l-4 border-red-500"
                      : event.type === "success"
                      ? "bg-green-50 border-l-4 border-green-500"
                      : event.type === "warning"
                      ? "bg-yellow-50 border-l-4 border-yellow-500"
                      : "bg-gray-50 border-l-4 border-blue-500"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium">{event.message}</span>
                    <span className="text-xs text-gray-500">
                      {formatDate(event.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
              {connectionEvents.length === 0 && (
                <div className="text-center p-4 text-gray-500">
                  No events logged yet
                </div>
              )}
            </div>
          </div>

          {/* Last Message Received */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaInfoCircle className="text-red-500" /> Last Received Message
            </h2>
            {lastReceivedMessage ? (
              <div>
                <div className="mb-2 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    Type:{" "}
                    <span className="font-bold">
                      {lastReceivedMessage.type}
                    </span>
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(lastReceivedMessage.timestamp)}
                  </span>
                </div>
                <div className="bg-gray-50 p-3 rounded-md border border-gray-200 max-h-80 overflow-y-auto">
                  <pre className="text-xs whitespace-pre-wrap overflow-x-auto">
                    {JSON.stringify(lastReceivedMessage.payload, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-center p-8 text-gray-500 bg-gray-50 rounded-md">
                No messages received yet
              </div>
            )}
          </div>
        </div>

        {/* Technical Information */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Technical Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="mb-2">
                <span className="font-medium">Connection URL:</span>{" "}
                <code className="bg-gray-100 p-1 rounded text-xs">
                  {import.meta.env.VITE_WS_URL || "ws://localhost:5000/ws"}
                </code>
              </p>
              <p className="mb-2">
                <span className="font-medium">Last Reconnect Attempt:</span>{" "}
                {lastReconnectTime ? formatDate(lastReconnectTime) : "Never"}
              </p>
            </div>
            <div>
              <p className="mb-2">
                <span className="font-medium">Connection ID:</span>{" "}
                <code className="bg-gray-100 p-1 rounded text-xs">
                  {isConnected ? "Connected" : "Disconnected"}
                </code>
              </p>
              <p className="mb-2">
                <span className="font-medium">Driver ID:</span>{" "}
                <code className="bg-gray-100 p-1 rounded text-xs">
                  {localStorage.getItem("driverId") || "Unknown"}
                </code>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </DashboardLayout>
  );
};

export default WebsocketDebug;
