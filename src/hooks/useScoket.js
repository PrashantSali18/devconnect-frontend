import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const useSocket = (token) => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    if (!socketRef.current) {
      console.log("Attempting socket connection...");

      socketRef.current = io("http://localhost:5000", {
        auth: { token },
        transports: ["websocket"],
      });

      socketRef.current.on("connect", () => {
        console.log("✅ Socket connected:", socketRef.current.id);
      });

      socketRef.current.on("disconnect", () => {
        console.log("❌ Socket disconnected");
      });
    }

    return () => {
      // DO NOT disconnect here in development
      // Only disconnect if really needed
    };
  }, [token]);

  return socketRef.current;
};

export default useSocket;
