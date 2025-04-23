class WebSocketClient {
  constructor(url, options = {}) {
    this.url = url;
    this.socket = null;
    this.listeners = {};
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = options.maxReconnectAttempts || 10;
    this.reconnectTimeout = null;
    this.messageQueue = [];
    this.pendingMessages = new Map();
    this.visibilityReconnecting = false;

    // Add visibility change event listener to handle page refresh/tab switch
    document.addEventListener(
      "visibilitychange",
      this.handleVisibilityChange.bind(this)
    );
  }

  // Handle page visibility changes to reconnect when page becomes visible
  handleVisibilityChange() {
    if (document.visibilityState === "visible") {
      if (!this.isConnected) {
        // console.log("Page became visible, attempting to reconnect WebSocket");
        this.visibilityReconnecting = true;
        this.reconnect(true);
      }
    } else {
      // Page is hidden, might be navigating away or refreshing
      // console.log("Page hidden, WebSocket might disconnect temporarily");
    }
  }

  connect(token) {
    try {
      // If a token was provided, update the URL with it
      if (token) {
        const wsUrl = new URL(this.url);
        wsUrl.searchParams.set("token", token);
        this.url = wsUrl.toString();
      }

      this.socket = new WebSocket(this.url);

      this.socket.onopen = () => {
        // console.log("WebSocket connected");
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.visibilityReconnecting = false;
        this.processQueue();

        // Dispatch connect event
        const event = new CustomEvent("ws:connected");
        document.dispatchEvent(event);

        this.emit("connect");
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
      
          // Dispatch message event for specific handling
          const wsEvent = new CustomEvent("ws:response", { detail: data });
          document.dispatchEvent(wsEvent);
      
          // Add this new event for raw message access (for real-time bid updates)
          window.postMessage(
            { type: "ws:raw_message", message: JSON.parse(event.data) },
            window.location.origin
          );
      
          // Specific events for bid updates
          if (data.type === "new_bid" || data.type === "bid_updated") {
            const bidEvent = new CustomEvent("ws:message", { detail: data });
            document.dispatchEvent(bidEvent);
          }
      
          this.emit("message", data);
      
          // Handle pending message responses
          if (data.messageId && this.pendingMessages.has(data.messageId)) {
            const { resolve } = this.pendingMessages.get(data.messageId);
            resolve(data);
            this.pendingMessages.delete(data.messageId);
          }
        } catch (err) {
          console.error("Error parsing WebSocket message:", err);
        }
      };

      this.socket.onclose = () => {
        if (this.isConnected) {
          this.isConnected = false;

          // Dispatch disconnect event
          const event = new CustomEvent("ws:disconnected");
          document.dispatchEvent(event);

          this.emit("disconnect");

          // Only auto-reconnect if page is visible
          if (document.visibilityState === "visible") {
            this.reconnect();
          }
        }
      };

      this.socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        this.emit("error", error);
      };
    } catch (error) {
      console.error("WebSocket connection error:", error);
      this.reconnect();
    }
  }

  reconnect(fromVisibilityChange = false) {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;

      // Shorter delays for visibility change reconnects or initial attempts
      let delay;
      if (fromVisibilityChange || this.reconnectAttempts <= 2) {
        delay = 500; // Fast reconnect when page becomes visible or on initial attempts
      } else {
        delay = Math.min(
          1000 * Math.pow(1.3, this.reconnectAttempts - 2),
          5000
        ); // Cap at 5 seconds
      }

      // console.log(
      //   `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms`
      // );

      this.reconnectTimeout = setTimeout(() => {
        if (document.visibilityState === "visible") {
          const token = localStorage.getItem("driverToken");
          this.connect(token);
        }
      }, delay);
    } else {
      console.log("Max reconnection attempts reached");
      // Silently reset and let the next user action trigger reconnection
      this.reconnectAttempts = 0;
    }
  }

  send(message) {
    if (typeof message === "object") {
      message = JSON.stringify(message);
    }

    if (this.isConnected && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
      return true;
    } else {
      this.messageQueue.push(message);
      return false;
    }
  }

  sendWithPromise(message, timeout = 10000) {
    return new Promise((resolve, reject) => {
      // Add unique messageId if not present
      if (typeof message === "object" && !message.messageId) {
        message.messageId = this.generateMessageId();
      }

      const messageId = message.messageId;
      const stringifiedMessage = JSON.stringify(message);

      // Set up timeout for this message
      const timeoutId = setTimeout(() => {
        if (this.pendingMessages.has(messageId)) {
          this.pendingMessages.delete(messageId);
          reject(new Error("WebSocket message timed out"));
        }
      }, timeout);

      // Store the promise handlers and timeout
      this.pendingMessages.set(messageId, {
        resolve,
        reject,
        timeoutId,
      });

      // Send the message
      if (this.isConnected && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(stringifiedMessage);
      } else {
        this.messageQueue.push(stringifiedMessage);
        reject(new Error("WebSocket not connected"));
      }
    });
  }

  generateMessageId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  processQueue() {
    if (this.messageQueue.length > 0 && this.isConnected) {
      while (this.messageQueue.length > 0) {
        const message = this.messageQueue.shift();
        this.socket.send(message);
      }
    }
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(
        (cb) => cb !== callback
      );
    }
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} listener:`, error);
        }
      });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  }

  cleanup() {
    // Remove event listener when component unmounts
    document.removeEventListener(
      "visibilitychange",
      this.handleVisibilityChange.bind(this)
    );

    // Clear any pending timeouts
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    // Clear any pending message timeouts
    this.pendingMessages.forEach(({ timeoutId }) => {
      clearTimeout(timeoutId);
    });

    this.disconnect();
  }
}

// Create a singleton instance of the WebSocketClient
const wsUrl = import.meta.env.VITE_WS_URL || import.meta.env.VITE_WS_URL_PUBLIC;
const wsClient = new WebSocketClient(wsUrl, {
  maxReconnectAttempts: 15, // Increased max reconnection attempts
});

export default wsClient;