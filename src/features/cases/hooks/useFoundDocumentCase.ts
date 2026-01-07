import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { showNotification } from '@mantine/notifications';
import { authClient } from '@/lib/api';
import { FoundDocumentCaseFormData } from '../types';

export const useStreamFoundDocumentCase = () => {
  const [connected, setConnected] = useState(false);
  const [state, setState] = useState();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Cleanup previous connection
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current.removeAllListeners();
    }

    // Construct the socket URL
    const socketUrl = `/documents/cases`;

    // Create new socket connection
    const socketInstance = io(socketUrl, {
      async auth(cb) {
        const session = await authClient.getSession();
        cb({ token: session.data?.session.token });
      },
    });

    // Store socket in ref instead of state
    socketRef.current = socketInstance;

    // Connection status handlers
    socketInstance.on('connect', () => {
      setConnected(true);
      showNotification({
        title: 'Connected',
        message: 'Socket connection succesfulll',
        color: 'teal',
      });
    });

    // Handle socket disconnection event: update connection state and notify user
    socketInstance.on('disconnect', () => {
      setConnected(false);
      showNotification({
        title: 'Disconnected',
        message: 'Socket disconnected',
        color: 'blue',
      });
    });

    // Error handling
    socketInstance.on('connect_error', (error) => {
      // eslint-disable-next-line no-console
      console.error('Socket connection error:', error);

      showNotification({
        title: 'Connection error',
        message: error.message || 'Failed to connect to WebSocket server',
        color: 'red',
      });
      setConnected(false);
    });

    // Data stream handler
    socketInstance.on('stream_progress', (payload) => {
      const data = JSON.parse(payload);
      setState(data);
    });

    // Cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.removeAllListeners();
        socketRef.current = null;
      }
    };
  }, []); // Empty dependency array - only run once on mount

  const createFoundDocumentCase = (payload: FoundDocumentCaseFormData) => {
    if (connected && socketRef.current) {
      socketRef.current.emit('found', payload);
    }
  };

  return {
    socketRef,
    connected,
    state,
    createFoundDocumentCase,
  };
};
