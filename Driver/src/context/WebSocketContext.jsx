import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { toast } from "react-hot-toast";

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
  // We're not using getToken anymore, so we don't need to destructure it
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectCount, setReconnectCount] = useState(0);
  const eventListenerCleanupRef = useRef([]);
  const pendingBids = useRef([]);
  const recentBids = useRef({});
  const driverIdRef = useRef(null);
  const isBidding = useRef(false);
  const wsClientRef = useRef(null);

  // Handle socket open
  const handleSocketOpen = () => {
    console.log("WebSocket connection opened");
    setIsConnected(true);
  };

  // Handle socket close
  const handleSocketClose = (event) => {
    console.log("WebSocket connection closed:", event.code);
    setIsConnected(false);

    // Attempt to reconnect after a delay
    setTimeout(() => {
      setReconnectCount((prev) => prev + 1);
    }, 3000);
  };

  // Handle socket error
  const handleSocketError = (error) => {
    console.error("WebSocket error:", error);
  };

  // Update the handleWebSocketMessage function
  const handleWebSocketMessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      const { type, message, status, bid } = data;

      // Check if we got a direct bid_response from the server
      if (type === "bid_response") {
        const pendingBid = pendingBids.current.find(
          (bid) => bid.messageId === data.messageId
        );

        if (pendingBid) {
          // Clear timeout for this bid
          clearTimeout(pendingBid.timeoutId);
          // Remove from pending bids
          pendingBids.current = pendingBids.current.filter(
            (bid) => bid.messageId !== data.messageId
          );

          if (status === "success") {
            // Create a standardized bid object
            const standardizedBid = {
              amount: pendingBid.amount,
              note: pendingBid.note,
              bidTime: new Date().toISOString(),
              driverId: driverIdRef.current,
              status: "pending",
              ...bid, // Include any additional data from server
            };

            // Dispatch success event
            document.dispatchEvent(
              new CustomEvent("bid_placed", {
                detail: {
                  success: true,
                  message: message || "Bid placed successfully",
                  bookingId: pendingBid.bookingId,
                  bid: standardizedBid,
                },
              })
            );

            // Also dispatch bid:update for real-time updates
            document.dispatchEvent(
              new CustomEvent("bid:update", {
                detail: {
                  bookingId: pendingBid.bookingId,
                  bid: standardizedBid,
                },
              })
            );

            // Show success toast
            toast.success(message || "Bid placed successfully");
          } else {
            // Handle error case
            document.dispatchEvent(
              new CustomEvent("bid_error", {
                detail: {
                  error: message || "Failed to place bid",
                  bookingId: pendingBid.bookingId,
                },
              })
            );
            toast.error(message || "Failed to place bid");
          }
        }
      }

      // Broadcast the message to all listeners
      document.dispatchEvent(new CustomEvent("ws:message", { detail: data }));
    } catch (error) {
      console.error("Error handling WebSocket message:", error);
    }
  };

  // Connect to WebSocket on mount
  useEffect(() => {
    // Get the driver token specifically - important fix
    const driverToken = localStorage.getItem("driverToken");

    if (!driverToken) {
      console.warn("No driver token found, not connecting to WebSocket");
      return;
    }

    // Setup connection event handlers
    const handleConnect = () => {
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
    };

    // Add event listeners
    document.addEventListener("ws:connected", handleConnect);
    document.addEventListener("ws:disconnected", handleDisconnect);

    // Try to connect
    try {
      const wsUrl = `${
        import.meta.env.VITE_WS_URL || "ws://localhost:5000"
      }?token=${driverToken}&role=driver`;
      const socket = new WebSocket(wsUrl);
      wsClientRef.current = socket;

      socket.addEventListener("open", handleSocketOpen);
      socket.addEventListener("close", handleSocketClose);
      socket.addEventListener("error", handleSocketError);
      socket.addEventListener("message", handleWebSocketMessage);
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
      if (wsClientRef.current) {
        const socket = wsClientRef.current;

        // Remove event listeners
        socket.removeEventListener("open", handleSocketOpen);
        socket.removeEventListener("close", handleSocketClose);
        socket.removeEventListener("error", handleSocketError);
        socket.removeEventListener("message", handleWebSocketMessage);

        // Close socket if it's open
        if (
          socket.readyState === WebSocket.OPEN ||
          socket.readyState === WebSocket.CONNECTING
        ) {
          socket.close();
        }

        wsClientRef.current = null;
      }
    };
  }, [reconnectCount]);

  // Add the on method to subscribe to events
  const on = useCallback((eventType, handler) => {
    if (!eventType || typeof handler !== "function") {
      console.error("Invalid event type or handler");
      return () => {};
    }

    try {
      // Create a wrapper function that will be called when the event is emitted
      const wrapperFn = (data) => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in ${eventType} handler:`, error);
        }
      };

      // Store the event handler in a map
      if (!eventListenerCleanupRef.current[eventType]) {
        eventListenerCleanupRef.current[eventType] = [];
      }

      eventListenerCleanupRef.current[eventType].push(wrapperFn);

      // Return a function to remove this specific handler
      return () => {
        if (eventListenerCleanupRef.current[eventType]) {
          eventListenerCleanupRef.current[eventType] =
            eventListenerCleanupRef.current[eventType].filter(
              (fn) => fn !== wrapperFn
            );
        }
      };
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
      if (eventListenerCleanupRef.current[eventType]) {
        eventListenerCleanupRef.current[eventType] =
          eventListenerCleanupRef.current[eventType].filter(
            (fn) => fn !== handler
          );
      }
    } catch (error) {
      console.error(`Error unsubscribing from ${eventType}:`, error);
    }
  }, []);

  // Add the send method to send messages
  const send = useCallback(
    (eventType, data) => {
      if (!isConnected || !wsClientRef.current) {
        console.log("Not connected, cannot send websocket message");
        return false;
      }

      try {
        const message =
          typeof data === "object"
            ? JSON.stringify({ type: eventType, payload: data })
            : JSON.stringify({ type: eventType, payload: { message: data } });

        wsClientRef.current.send(message);
        return true;
      } catch (error) {
        console.error(`Error sending ${eventType}:`, error);
        return false;
      }
    },
    [isConnected]
  );

  // Handle bid placement - can use WebSocket or REST API
  const placeBid = async (bookingId, amount, note) => {
    // Generate a unique message ID for this bid
    const messageId = `bid_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 9)}`;

    // Prevent duplicate bid submissions within a short time period
    const recentBidKey = `${bookingId}_${amount}_${note}`;
    const now = Date.now();
    const recentBid = recentBids.current[recentBidKey];

    if (recentBid && now - recentBid.timestamp < 5000) {
      return recentBid.result; // Return the cached result if bid was placed in last 5 seconds
    }

    // Prevent submitting bids while another submission is in progress
    if (isBidding.current) {
      return {
        success: false,
        error: "A bid submission is already in progress",
      };
    }

    // Mark as submitting bid
    isBidding.current = true;

    try {
      // Get driver ID from localStorage
      const driverId = localStorage.getItem("driverId");

      if (!driverId) {
        throw new Error("Driver ID not found. Please log in again.");
      }

      const bidData = {
        bookingId,
        amount,
        note,
        driverId,
        status: "pending",
      };

      let result;

      // Store current driverId for event dispatching
      driverIdRef.current = driverId;

      if (
        wsClientRef.current &&
        wsClientRef.current.readyState === WebSocket.OPEN
      ) {
        // Send bid data through WebSocket
        const message = {
          type: "place_bid",
          payload: {
            bookingId,
            amount,
            note,
          },
          messageId, // Include the message ID
        };

        // Add to pending bids
        const timeoutId = setTimeout(() => {
          console.log("WebSocket bid timed out, trying REST API");
          submitBidViaRest(bidData);
        }, 8000); // Wait 8 seconds for WebSocket response

        // Add to pending bids with timeout id
        pendingBids.current.push({
          bookingId,
          amount,
          note,
          messageId,
          timeoutId,
          timestamp: Date.now(),
        });

        wsClientRef.current.send(JSON.stringify(message));

        // Cache this bid request to prevent duplicates
        const resultPromise = new Promise((resolve) => {
          // Set up a listener for this specific bid response
          const bidResponseHandler = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "bid_response" && data.messageId === messageId) {
              // Remove listener for this specific response
              wsClientRef.current.removeEventListener(
                "message",
                bidResponseHandler
              );

              const result = {
                success: data.status === "success",
                message: data.message,
                bid: data.bid,
              };

              resolve(result);
            }
          };

          // Listen for the specific response
          wsClientRef.current.addEventListener("message", bidResponseHandler);
        });

        // Store in recentBids cache
        recentBids.current[recentBidKey] = {
          timestamp: now,
          result: resultPromise,
        };

        result = await resultPromise;
      } else {
        // Fall back to REST API if WebSocket is not connected
        result = await submitBidViaRest(bidData);

        // Store in recentBids cache
        recentBids.current[recentBidKey] = {
          timestamp: now,
          result,
        };
      }

      return result;
    } catch (error) {
      console.error("Error placing bid:", error);
      return {
        success: false,
        error: error.message || "Failed to place bid",
      };
    } finally {
      // Reset bidding status
      isBidding.current = false;

      // Clean up old entries from recentBids
      const now = Date.now();
      Object.keys(recentBids.current).forEach((key) => {
        if (now - recentBids.current[key].timestamp > 60000) {
          // 1 minute expiry
          delete recentBids.current[key];
        }
      });
    }
  };

  // Update the submitBidViaRest function
  const submitBidViaRest = async (bidData) => {
    try {
      const { bookingId, amount, note } = bidData;
      if (!amount || amount <= 0) {
        throw new Error("Valid bid price is required");
      }

      const token = localStorage.getItem("driverToken");
      if (!token) {
        throw new Error("Authentication required");
      }

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
            notes: note,
          }),
        }
      );

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to place bid");
      }

      return data;
    } catch (error) {
      console.error("REST API bid error:", error);
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
