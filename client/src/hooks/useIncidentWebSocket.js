
import { useEffect } from 'react';
import { io } from 'socket.io-client';

/**
 * useIncidentWebSocket
 * Connects to the backend WebSocket and handles new-incident events.
 * @param {function} onNewIncident - Callback for new incident (incident, notification, type)
 */
export function useIncidentWebSocket(onNewIncident) {
  useEffect(() => {

    // Helper to get API base URL in a Jest-safe way
    // Use VITE_API_URL if set, else fallback to current origin
    let baseUrl = import.meta.env.VITE_API_URL || window.location.origin;
    // Remove trailing /api for socket.io
    if (baseUrl.endsWith('/api')) baseUrl = baseUrl.replace(/\/api$/, '');

    const socket = io(baseUrl, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    socket.on('connect', () => {
      // Connected
      socket.emit('subscribe', 'incidents');
    });

    socket.on('new-incident', (data) => {
      if (onNewIncident) onNewIncident(data.incident, data.notification, data.type);
    });

    socket.on('disconnect', () => {
      // Disconnected
      // Attempt reconnection handled by socket.io
    });

    return () => {
      socket.disconnect();
    };
  }, [onNewIncident]);
}
