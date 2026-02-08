
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
    function getApiBase() {
      if (typeof process !== 'undefined' && process.env && process.env.JEST_WORKER_ID) {
        return process.env.VITE_API_URL || '/';
      }
      // In Vite, import.meta.env.VITE_API_URL will be replaced at build time
      return '/';
    }

    let baseUrl = getApiBase();
    // Remove trailing /api for socket.io
    if (baseUrl.endsWith('/api')) baseUrl = baseUrl.replace(/\/api$/, '');

    // Ensure protocol matches deployment
    // If deployed on Railway, use https/wss
    // If local, use http/ws
    // socket.io-client will handle ws/wss automatically based on baseUrl

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
