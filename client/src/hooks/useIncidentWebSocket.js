import { useEffect } from 'react';
import { io } from 'socket.io-client';

/**
 * useIncidentWebSocket
 * Connects to the backend WebSocket and handles new-incident events.
 * @param {function} onNewIncident - Callback for new incident (incident, notification, type)
 */
export function useIncidentWebSocket(onNewIncident) {
  useEffect(() => {
    // Use VITE_API_URL as base, but replace /api with '' for socket.io
    let baseUrl = '';
    if (typeof process !== 'undefined' && process.env?.VITE_API_URL) {
      baseUrl = process.env.VITE_API_URL;
    }
    if (baseUrl.endsWith('/api')) baseUrl = baseUrl.replace(/\/api$/, '');
    const socket = io(baseUrl, {
      transports: ['websocket'],
      withCredentials: true,
    });

    socket.on('connect', () => {
      // Connected
    });

    socket.on('new-incident', (data) => {
      if (onNewIncident) onNewIncident(data.incident, data.notification, data.type);
    });

    socket.on('disconnect', () => {
      // Disconnected
    });

    return () => {
      socket.disconnect();
    };
  }, [onNewIncident]);
}
