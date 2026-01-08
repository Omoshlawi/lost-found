import { useCallback, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { showNotification } from '@mantine/notifications';
import { authClient } from '@/lib/api';

type UseSocketOptions = {
  withAuth?: boolean;
  nameSpace?: string;
};

/**
 * useSocket()
 *
 * React hook for easily interacting with a socket.io server.
 * Provides convenient methods for publishing events (with optional ack), 
 * subscribing to events, and tracking socket state.
 * 
 * @param options - Configuration for the socket connection.
 *   - withAuth: whether to use authentication on the connection.
 *   - nameSpace: namespace for your socket connection (e.g. "/extraction").
 * 
 * @returns {
 *   publishEvent: Function to emit a socket event,
 *   publishEventWithAck: Function to emit & await for an ACK response,
 *   addEventListener: Subscribe to a socket event with automatic cleanup,
 *   socketRef: React ref to the actual Socket instance.
 * }
 * 
 * ## Basic Usage
 * 
 * ```
 * import { useSocket } from '@/hooks/useSocket';
 * 
 * export const MyComponent = () => {
 *   const { publishEvent, addEventListener, socketRef } = useSocket({
 *     withAuth: true,
 *     nameSpace: '/my-namespace',
 *   });
 *
 *   // Publish an event (fire-and-forget)
 *   const sendMessage = () => {
 *     publishEvent('my_event', { foo: 'bar' });
 *   };
 *
 *   // Subscribe to an event
 *   useEffect(() => {
 *     const cleanup = addEventListener('my_event', (data) => {
 *       console.log('Received data:', data);
 *     });
 *     return cleanup; // Automatically cleans up on unmount
 *   }, [addEventListener]);
 *
 *   return <button onClick={sendMessage}>Send Message</button>;
 * };
 * ```
 *
 * ## With Acknowledgement
 * 
 * ```
 * const { publishEventWithAck } = useSocket({
 *   withAuth: true,
 *   nameSpace: '/example',
 * });
 *
 * const onClick = async () => {
 *   try {
 *     const response = await publishEventWithAck('do_something', { x: 123 });
 *     console.log('Server replied:', response);
 *   } catch (e) {
 *     console.error('Server error or timeout', e);
 *   }
 * };
 * ```
 * 
 * ## Listening to Streaming or Progress Events
 * 
 * ```
 * useEffect(() => {
 *   const stop = addEventListener('progress_update', (progress) => {
 *     setState(progress);
 *   });
 *   return stop;
 * }, [addEventListener]);
 * ```
 */


export const useSocket = (options: UseSocketOptions = {}) => {
  const socketRef = useRef<Socket | null>(null);
  const listenersRef = useRef<Map<string, ((...args: any[]) => void)[]>>(new Map());

  useEffect(() => {
    // Cleanup previous connection
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current.removeAllListeners();
    }

    // Construct the socket URL
    const socketUrl = options.nameSpace;

    // Create new socket connection
    const socketInstance = io(socketUrl, {
      auth: options.withAuth
        ? async (cb) => {
            const session = await authClient.getSession();
            cb({ token: session.data?.session.token });
          }
        : undefined,
    });

    // Store socket in ref instead of state
    socketRef.current = socketInstance;

    // Connection status handlers
    socketInstance.on('connect', () => {
      showNotification({
        title: 'Connected',
        message: 'Socket connection succesfull',
        color: 'teal',
      });

      // Re-register all listeners when socket connects (they were stored but not registered)
      listenersRef.current.forEach((callbacks, event) => {
        callbacks.forEach((cb) => {
          socketInstance.on(event, cb);
        });
      });
    });

    // Handle socket disconnection event: update connection state and notify user
    socketInstance.on('disconnect', () => {
      showNotification({
        title: 'Disconnected',
        message: 'Socket disconnected',
        color: 'blue',
      });
      // Remove all custom event listeners (but keep system ones like 'connect', 'disconnect', 'connect_error')
      // We'll re-add stored listeners on reconnect
      listenersRef.current.forEach((callbacks, event) => {
        callbacks.forEach((cb) => {
          socketInstance.off(event, cb);
        });
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
    });

    // Cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.removeAllListeners();
        socketRef.current = null;
      }
      listenersRef.current.clear();
    };
  }, [options.nameSpace, options.withAuth]);

  const publishEvent = useCallback((event: string, ...args: any[]) => {
    if (socketRef.current?.connected) {
      return socketRef.current.emit(event, ...args);
    }
    showNotification({
      title: 'Failure',
      message: "Couldn't Publish event because connection aint established",
      color: 'yellow',
    });
  }, []);

  const publishEventWithAck = useCallback(async <T = any>(event: string, ...args: any[]) => {
    if (socketRef.current?.connected) {
      const response = await socketRef.current.emitWithAck(event, ...args);
      return response as T;
    }
    showNotification({
      title: 'Failure',
      message: "Couldn't Publish event becasue connection aint established",
      color: 'yellow',
    });
  }, []);

  const addEventListener = useCallback((event: string, cb: (...args: any[]) => void) => {
    // Store listener for re-registration on reconnect
    if (!listenersRef.current.has(event)) {
      listenersRef.current.set(event, []);
    }
    listenersRef.current.get(event)?.push(cb);

    // Add listener if socket is already connected
    if (socketRef.current?.connected) {
      socketRef.current.on(event, cb);
    }

    // Return cleanup function
    return () => {
      const callbacks = listenersRef.current.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(cb);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
        if (callbacks.length === 0) {
          listenersRef.current.delete(event);
        }
      }
      socketRef.current?.off(event, cb);
    };
  }, []);

  return {
    socketRef,
    publishEvent,
    publishEventWithAck,
    addEventListener,
  };
};

export const useSocketEvent = (
  option: UseSocketOptions & {
    event: string;
    handleEvent: ((...args: any[]) => void) | ((...args: any[]) => Promise<void>);
  }
) => {
  const { event, handleEvent, ...socketOption } = option;
  const { addEventListener } = useSocket(socketOption);
  useEffect(() => {
    const cleanup = addEventListener(event, handleEvent);
    return cleanup;
  }, [event, handleEvent, addEventListener]);
};
