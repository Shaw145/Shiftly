# Frontend WebSocket Integration Guide

## Setup Instructions

The frontend application (running on port 5174) can connect to the WebSocket server using the same approach as the Driver app. Here's how to set it up:

### 1. Environment Configuration

In the frontend app's `.env` file, ensure you have:

```
VITE_BACKEND_URL=http://localhost:5000
VITE_WS_URL=ws://localhost:5000/ws
```

### 2. WebSocket Context Integration

The frontend can use a similar WebSocket context as the Driver app. The key differences will be:

- Use the frontend's authentication token (`token` instead of `driverToken`)
- Handle customer-specific event types

### 3. Event Types

The frontend application will need to handle these event types:

- `new_bid`: When a driver places a bid on a customer's booking
- `booking_status_updated`: When a booking status changes
- `bid_placed`: Confirmation of bid receipt

### 4. Connection Optimization

To prevent connection issues:

- Only connect when a user is authenticated
- Don't reconnect aggressively (use exponential backoff)
- Close connections when components unmount
- Use a shared WebSocket context to prevent multiple connections

### 5. Testing

You can add the WebSocketTester component to your frontend app for easy debugging:

1. Copy the `WebSocketTester.jsx` component from the Driver app
2. Modify it to use the frontend user token
3. Add it to a development-only section of your app

## Example Code Snippet

Here's how to use the WebSocket context in your components:

```jsx
import { useWebSocket } from "../contexts/WebSocketContext";

function MyComponent() {
  const { socket, isConnected } = useWebSocket();

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Listen for new bids
    const unsubscribe = socket.on("new_bid", (data) => {
      console.log("New bid received:", data);
      // Update your UI accordingly
    });

    return () => {
      unsubscribe();
    };
  }, [socket, isConnected]);

  // Function to accept a bid
  const acceptBid = (bookingId, driverId, amount) => {
    if (!socket || !isConnected) {
      toast.error("Not connected to server");
      return;
    }

    socket.emit("accept_bid", {
      bookingId,
      driverId,
      bidAmount: amount
    });
  };

  return (
    // Your component JSX
  );
}
```

## Troubleshooting

If you experience connection issues:

1. Verify backend server is running
2. Check that your token is valid
3. Check browser console for CORS errors
4. Make sure your WebSocket URL includes the `/ws` path
5. Ensure you're not creating multiple concurrent connections

For any additional issues, refer to the `WebSocket-Troubleshooting.md` file.
