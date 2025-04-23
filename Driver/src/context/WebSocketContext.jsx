import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { toast } from "react-hot-toast";
import wsClient from "../utils/websocket";

/**
 * WebSocket Context for handling real-time communications
 */

// Create context
const WebSocketContext = createContext({
  isConnected: false,
  on: () => {},
  off: () => {},
  send: () => {},
  placeBid: async () => {},
});

// Custom hook to use the WebSocket context
export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectCount, setReconnectCount] = useState(0);
  const eventListenerCleanupRef = useRef([]);

  // Connect to WebSocket on mount
  useEffect(() => {
    // Get the driver token specifically - important fix
    const driverToken = localStorage.getItem("driverToken");

    if (!driverToken) {
      console.warn("No driver token found, not connecting to WebSocket");
      return;
    }

    // console.log("Initializing WebSocket with driver token");

    // Setup connection event handlers
    const handleConnect = () => {
      // console.log("WebSocket connected event received");
      setIsConnected(true);
      setReconnectCount(0);

      // Show a toast when connection is established (only after reconnection attempts)
      if (reconnectCount > 0) {
        toast.success("Connected to server", { id: "ws-connected" });
      }
    };

    const handleDisconnect = () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
      // No toast notification on disconnect to avoid annoying users during page refresh
    };

    // Add event listeners
    document.addEventListener("ws:connected", handleConnect);
    document.addEventListener("ws:disconnected", handleDisconnect);

    // Try to connect
    try {
      wsClient.connect(driverToken);
    } catch (error) {
      console.error("Failed to initialize WebSocket connection:", error);
    }

    // Return cleanup function
    return () => {
      document.removeEventListener("ws:connected", handleConnect);
      document.removeEventListener("ws:disconnected", handleDisconnect);

      // Clean up any remaining event handlers
      eventListenerCleanupRef.current.forEach((cleanup) => {
        if (typeof cleanup === "function") {
          cleanup();
        }
      });

      // Disconnect websocket
      wsClient.disconnect();
    };
  }, [reconnectCount]);

  // Add the on method to subscribe to events
  const on = useCallback((eventType, handler) => {
    if (!eventType || typeof handler !== "function") {
      console.error("Invalid event type or handler");
      return () => {};
    }

    try {
      // Register the handler with the WebSocket client
      const cleanup = wsClient.on(eventType, handler);

      // Store cleanup function for component unmount
      eventListenerCleanupRef.current.push(cleanup);

      return cleanup;
    } catch (error) {
      console.error(`Error subscribing to ${eventType}:`, error);
      return () => {};
    }
  }, []);

  // Add the off method to unsubscribe from events
  const off = useCallback((eventType, handler) => {
    if (!eventType || typeof handler !== "function") {
      console.error("Invalid event type or handler");
      return;
    }

    try {
      wsClient.off(eventType, handler);

      // Remove cleanup function from the ref
      eventListenerCleanupRef.current = eventListenerCleanupRef.current.filter(
        (fn) => fn !== handler
      );
    } catch (error) {
      console.error(`Error unsubscribing from ${eventType}:`, error);
    }
  }, []);

  // Add the send method to send messages
  const send = useCallback(
    (eventType, data) => {
      if (!isConnected) {
        // console.log("Not connected, cannot send websocket message");
        return false;
      }

      try {
        return wsClient.send(eventType, data);
      } catch (error) {
        console.error(`Error sending ${eventType}:`, error);
        return false;
      }
    },
    [isConnected]
  );

  // Create a global bid data object to track and process bids
  let bidData = null;

  // Handle bid placement - can use WebSocket or REST API
  const placeBid = async (bookingId, amount, note) => {
    // Check if there's already a bid submission in progress
    if (bidData && bidData.pending) {
      // console.log("Bid submission already in progress");
      return { success: false, message: "Bid submission in progress" };
    }

    // Store the bid data for processing
    bidData = {
      bookingId,
      amount,
      note,
      pending: true,
      timestamp: Date.now(),
    };

    // console.log("Placing bid:", bidData);

    // Try WebSocket if connected
    if (isConnected) {
      return new Promise((resolve, reject) => {
        try {
          // Create a unique ID for this message to track it
          const messageId = `bid_${Date.now()}_${Math.random()
            .toString(36)
            .substring(2, 9)}`;

          // Create the bid payload
          const payload = {
            type: "place_bid",
            messageId,
            data: {
              bookingId,
              amount,
              note,
            },
          };

          // Set up a timeout to switch to REST API if WebSocket doesn't respond
          const timeoutId = setTimeout(() => {
            // console.log("WebSocket bid timed out, switching to REST API");
            // Mark the WebSocket attempt as failed
            bidData.wsAttemptFailed = true;
            // Only proceed with REST if we haven't already succeeded via WebSocket
            if (bidData.pending) {
              submitBidViaRest(bookingId, amount, note)
                .then(resolve)
                .catch(reject);
            }
          }, 8000); // 8 second timeout

          // Set up a one-time response handler for this specific bid
          const handleBidResponse = (event) => {
            const message = JSON.parse(event.data);

            // Check if this is a response to our specific bid message
            if (
              message.type === "bid_response" &&
              message.messageId === messageId
            ) {
              clearTimeout(timeoutId);
              document.removeEventListener("ws:response", handleBidResponse);

              if (message.status === "success") {
                // Bid was successful - mark as not pending anymore
                bidData.pending = false;

                const driverId = localStorage.getItem("driverId");
                const bidDetails = {
                  bookingId,
                  driverId,
                  amount,
                  note,
                  bidTime: new Date().toISOString(),
                };

                // Dispatch event for UI updates only after confirmed
                const event = new CustomEvent("bid:update", {
                  detail: {
                    bookingId,
                    bid: bidDetails,
                  },
                });
                document.dispatchEvent(event);

                resolve({ success: true, data: bidDetails });
              } else {
                // Bid failed
                bidData.pending = false;
                reject(new Error(message.message || "Failed to place bid"));
              }
            }
          };

          // Listen for the response to this specific bid
          document.addEventListener("ws:response", handleBidResponse);

          // Send the bid via WebSocket
          wsClient.send(JSON.stringify(payload));
          // console.log("Bid sent via WebSocket:", payload);
        } catch (error) {
          console.error("WebSocket bid error:", error);
          bidData.pending = false;
          reject(error);
        }
      });
    }

    // Fall back to REST API if WebSocket is not connected
    return submitBidViaRest(bookingId, amount, note);
  };

  // Submit bid via REST API as a fallback
  const submitBidViaRest = async (bookingId, amount, note) => {
    try {
      // console.log("Submitting bid via REST API");

      // Get fresh token from localStorage to ensure we have the latest
      const token = localStorage.getItem("driverToken");
      const driverId = localStorage.getItem("driverId");

      // Validate both token and driverId are present
      if (!token) {
        console.error("No driver token found when attempting to place bid");
        throw new Error("Authentication required - Please log in again");
      }

      if (!driverId) {
        console.error("No driver ID found when attempting to place bid");
        throw new Error("Driver ID not found - Please log in again");
      }

      // Make the API request
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/bids/place`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            bookingId,
            amount,
            note,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to place bid");
      }

      // Update bid status
      bidData.pending = false;

      // Only show toast and update UI if not already done via WebSocket
      if (
        !bidData.wsAttemptFailed ||
        (bidData.wsAttemptFailed && bidData.pending)
      ) {
        const bidDetails = {
          bookingId,
          driverId,
          amount,
          note,
          bidTime: new Date().toISOString(),
        };

        // Dispatch event for UI updates
        const event = new CustomEvent("bid:update", {
          detail: {
            bookingId,
            bid: bidDetails,
          },
        });
        document.dispatchEvent(event);
      }

      // console.log("REST API bid successful:", data);
      return { success: true, data };
    } catch (error) {
      console.error("REST API bid error:", error);
      bidData.pending = false;
      throw error;
    }
  };

  // Context value with connection status and methods
  const contextValue = {
    isConnected,
    reconnectCount,
    on,
    off,
    send,
    placeBid,
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketContext;