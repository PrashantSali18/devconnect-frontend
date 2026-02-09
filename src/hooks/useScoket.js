import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { addNotification } from '../redux/slices/notificationSlice';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

const useSocket = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
    });

    const socket = socketRef.current;

    socket.on('connect', () => console.log('Socket connected'));
    socket.on('notification:new', (notification) => {
      dispatch(addNotification(notification));
    });

    return () => {
      socket.disconnect();
    };
  }, [token, dispatch]);

  return socketRef.current;
};

export default useSocket;