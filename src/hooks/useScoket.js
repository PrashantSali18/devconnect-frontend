import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { addNotification } from "../redux/slices/notificationSlice";
import { selectAuthToken } from "../redux/slices/authSlice";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export const useSocket = () => {
  const dispatch = useDispatch();
  const token = useSelector(selectAuthToken);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    // Initialize socket connection
    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"], // Try websocket first, fallback to polling
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      secure: true, // Force secure connection
      rejectUnauthorized: false, // For development
    });

    const socket = socketRef.current;

    // Connection events
    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error.message);
    });

    socket.on("reconnect", (attemptNumber) => {
      console.log("🔄 Socket reconnected after", attemptNumber, "attempts");
    });

    socket.on("reconnect_error", (error) => {
      console.error("❌ Reconnection error:", error.message);
    });

    socket.on("reconnect_failed", () => {
      console.error("❌ Reconnection failed");
    });

    // Listen for notifications
    socket.on("notification:new", (notification) => {
      console.log("📬 New notification:", notification);
      dispatch(addNotification(notification));
    });

    // User online/offline status
    socket.on("user:online", (data) => {
      console.log("👤 User online:", data.userId);
    });

    socket.on("user:offline", (data) => {
      console.log("👤 User offline:", data.userId);
    });

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [token, dispatch]);

  return socketRef.current;
};

export default useSocket;
