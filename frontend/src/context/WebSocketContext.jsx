import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { toast } from "react-hot-toast";

// Create context for WebSocket functionality
const WebSocketContext = createContext(null);

/**
 * Custom hook to access WebSocket functionality
 * @returns {Object} WebSocket context methods and state
 */
export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};

/**
 * WebSocket Provider Component
 * Manages WebSocket connection and provides WebSocket functionality to children
 */
export const WebSocketProvider = ({ children }) => {
  // WebSocket connection states
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [lastMessageTime, setLastMessageTime] = useState(null);

  // Flag to stop reconnection attempts when server explicitly rejects us
  const [shouldReconnect, setShouldReconnect] = useState(true);

  // WebSocket instance reference
  const socketRef = useRef(null);

  // Reconnection settings
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 3;
  const reconnectInterval = 3000;
  const reconnectBackoffFactor = 1.5;

  // Event listeners storage
  const eventListenersRef = useRef({});

  /**
   * Connect to WebSocket server
   */
  const connect = useCallback(() => {
    // Don't connect if already connected or if reconnection is disabled
    if (socketRef.current || !shouldReconnect) return;

    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    try {
      // Create WebSocket URL with token
      const wsUrl = `${
        import.meta.env.VITE_WS_URL || "ws://localhost:5000"
      }?token=${token}&role=user`;

      console.log("Connecting to WebSocket:", wsUrl);

      // Create a new WebSocket instance with proper error handling
      const socket = new WebSocket(wsUrl);

      // Set a timeout to ensure the socket doesn't hang in connecting state
      const connectionTimeout = setTimeout(() => {
        if (socket.readyState !== WebSocket.OPEN) {
          console.error("WebSocket connection timeout");
          socket.close();
        }
      }, 5000);

      // Connection opened
      socket.addEventListener("open", () => {
        clearTimeout(connectionTimeout);
        console.log("WebSocket connection established");
        setIsConnected(true);
        setConnectionError(null);
        setIsReconnecting(false);
        reconnectAttemptsRef.current = 0;
      });

      // Connection closed
      socket.addEventListener("close", (event) => {
        // console.log("WebSocket connection closed:", event);
        setIsConnected(false);
        socketRef.current = null;

        // Stop reconnect attempts for specific close codes
        if (event.code === 1008) {
          // Authentication error
          // console.log(
          //   `Authentication error: ${event.reason}. Stopping reconnection attempts.`
          // );
          setShouldReconnect(false);
          setConnectionError(`Connection error: ${event.reason}`);
          return;
        }

        // Attempt to reconnect
        if (
          shouldReconnect &&
          reconnectAttemptsRef.current < maxReconnectAttempts
        ) {
          const delay =
            reconnectInterval *
            Math.pow(reconnectBackoffFactor, reconnectAttemptsRef.current);

          // console.log(
          //   `Reconnecting in ${delay}ms (attempt ${
          //     reconnectAttemptsRef.current + 1
          //   }/${maxReconnectAttempts})`
          // );

          setIsReconnecting(true);
          const timeoutId = setTimeout(() => {
            reconnectAttemptsRef.current++;
            connect();
          }, delay);

          // Store timeout ID for cleanup
          return () => clearTimeout(timeoutId);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          setConnectionError("Maximum reconnection attempts reached");
          setIsReconnecting(false);
          setShouldReconnect(false);
          console.error(
            "WebSocket reconnection failed after multiple attempts"
          );
        }
      });

      // Connection error
      socket.addEventListener("error", (error) => {
        console.error("WebSocket error:", error);
        setConnectionError("Connection error");
      });

      // Message received
      socket.addEventListener("message", (event) => {
        setLastMessageTime(new Date());

        try {
          const message = JSON.parse(event.data);
          // Skip logging heartbeat messages to reduce console noise
          if (message.type !== "heartbeat") {
            console.log("Received WebSocket message:", message);
          }

          // Handle event listeners
          if (message.type && eventListenersRef.current[message.type]) {
            eventListenersRef.current[message.type].forEach((listener) => {
              listener(message.payload || message);
            });
          }

          // Handle all event listeners
          if (eventListenersRef.current["*"]) {
            eventListenersRef.current["*"].forEach((listener) => {
              listener(message);
            });
          }

          // Special handling for bid updates
          if (message.type === "new_bid") {
            // Process the bid data to ensure consistent format
            const bid = message.payload?.bid || message.bid;
            const bookingId = message.payload?.bookingId || message.bookingId;

            if (bid && bookingId) {
              // Standardize the bid object format
              const processedBid = {
                id: bid.id || bid._id || Date.now().toString(),
                driverId: bid.driverId || bid.driver,
                amount: bid.amount || bid.price || 0,
                note: bid.note || bid.notes || "",
                bidTime: new Date(bid.bidTime || bid.createdAt || new Date()),
                driverRating: bid.driverRating || bid.rating || 4.5,
                name: bid.name || "Anonymous Driver",
                vehicle: bid.vehicle || "Transport Vehicle",
                trips: bid.trips || Math.floor(Math.random() * 100) + 50,
              };

              // Dispatch a custom event with the standardized bid data
              const customEvent = new CustomEvent("bid:update", {
                detail: {
                  type: "new_bid",
                  bookingId,
                  bid: processedBid,
                },
              });
              document.dispatchEvent(customEvent);

              // Show a toast notification
              toast.success(`New bid received from a driver!`, {
                id: `new-bid-${processedBid.id}`,
                duration: 3000,
              });
            }
          }

          // Handle bid updates similarly
          if (message.type === "bid_updated") {
            const bid = message.payload?.bid || message.bid;
            const bookingId = message.payload?.bookingId || message.bookingId;

            if (bid && bookingId) {
              const processedBid = {
                id: bid.id || bid._id || Date.now().toString(),
                driverId: bid.driverId || bid.driver,
                amount: bid.amount || bid.price || 0,
                note: bid.note || bid.notes || "",
                bidTime: new Date(bid.bidTime || bid.updatedAt || new Date()),
                driverRating: bid.driverRating || bid.rating || 4.5,
                name: bid.name || "Anonymous Driver",
                vehicle: bid.vehicle || "Transport Vehicle",
                trips: bid.trips || Math.floor(Math.random() * 100) + 50,
              };

              // Dispatch a custom event for bid updates
              const customEvent = new CustomEvent("bid:update", {
                detail: {
                  type: "bid_updated",
                  bookingId,
                  bid: processedBid,
                },
              });
              document.dispatchEvent(customEvent);

              toast.success(`A driver has updated their bid!`, {
                id: `bid-update-${processedBid.id}`,
                duration: 3000,
              });
            }
          }

          // Special handling for driver updates
          if (message.type === "driver_updated") {
            const driverData = message.payload?.driver;
            const driverId = message.payload?.driverId;

            if (driverData && driverId) {
              // Create and dispatch driver update event
              const driverEvent = new CustomEvent("driver:update", {
                detail: {
                  driverId,
                  driver: driverData,
                },
              });
              document.dispatchEvent(driverEvent);

              // Cache driver data in localStorage
              try {
                const cachedDrivers = JSON.parse(
                  localStorage.getItem("cachedDrivers") || "{}"
                );
                cachedDrivers[driverId] = {
                  ...driverData,
                  cachedAt: new Date().toISOString(),
                };
                localStorage.setItem(
                  "cachedDrivers",
                  JSON.stringify(cachedDrivers)
                );
              } catch (e) {
                console.error("Error caching driver data:", e);
              }
            }
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      });

      socketRef.current = socket;
    } catch (error) {
      console.error("Error creating WebSocket:", error);
      setConnectionError("Failed to create WebSocket connection");
      setIsConnected(false);

      // Attempt to reconnect
      if (
        shouldReconnect &&
        reconnectAttemptsRef.current < maxReconnectAttempts
      ) {
        const delay =
          reconnectInterval *
          Math.pow(reconnectBackoffFactor, reconnectAttemptsRef.current);
        setIsReconnecting(true);
        setTimeout(() => {
          reconnectAttemptsRef.current++;
          connect();
        }, delay);
      }
    }
  }, [shouldReconnect]);

  /**
   * Disconnect from WebSocket server
   */
  const disconnect = useCallback(() => {
    if (!socketRef.current) return;

    try {
      socketRef.current.close();
    } catch (error) {
      console.error("Error closing WebSocket:", error);
    }

    socketRef.current = null;
    setIsConnected(false);
  }, []);

  /**
   * Send a message through WebSocket
   * @param {string} type - Message type
   * @param {Object} data - Message data
   */
  const send = useCallback((type, data) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      console.error("WebSocket is not connected");
      return false;
    }

    try {
      socketRef.current.send(
        JSON.stringify({
          type,
          payload: data,
        })
      );
      return true;
    } catch (error) {
      console.error("Error sending WebSocket message:", error);
      return false;
    }
  }, []);

  /**
   * Add event listener for a specific message type
   * @param {string} type - Message type to listen for
   * @param {Function} callback - Callback function
   */
  const on = useCallback((type, callback) => {
    if (!type || typeof callback !== "function") {
      console.error("Invalid event type or handler");
      return () => {};
    }

    if (!eventListenersRef.current[type]) {
      eventListenersRef.current[type] = [];
    }
    eventListenersRef.current[type].push(callback);

    // Return a function to remove the listener
    return () => {
      if (!eventListenersRef.current[type]) return;
      eventListenersRef.current[type] = eventListenersRef.current[type].filter(
        (cb) => cb !== callback
      );
    };
  }, []);

  /**
   * Remove event listener
   * @param {string} type - Message type
   * @param {Function} callback - Callback function to remove
   */
  const off = useCallback((type, callback) => {
    if (!type || typeof callback !== "function") return;
    if (!eventListenersRef.current[type]) return;
    eventListenersRef.current[type] = eventListenersRef.current[type].filter(
      (cb) => cb !== callback
    );
  }, []);

  // Reset the shouldReconnect flag when token changes
  const resetConnection = useCallback(() => {
    disconnect();
    setShouldReconnect(true);
    reconnectAttemptsRef.current = 0;
    setConnectionError(null);
    setTimeout(connect, 500);
  }, [connect, disconnect]);

  // Connect on mount and disconnect on unmount
  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  // Reconnect when token changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "token") {
        resetConnection();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [resetConnection]);

  return (
    <WebSocketContext.Provider
      value={{
        isConnected,
        connectionError,
        isReconnecting,
        lastMessageTime,
        connect,
        disconnect,
        send,
        on,
        off,
        resetConnection,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketContext;
