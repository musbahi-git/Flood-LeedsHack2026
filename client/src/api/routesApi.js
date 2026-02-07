import axios from 'axios';

// API base URL - uses Vite proxy in development
const API_BASE = import.meta.env.VITE_API_URL || '/api';

/**
 * Routes API
 * Handles safe route calculation requests.
 */

/**
 * Get AI-assisted safe route to shelter.
 * 
 * @param {Object} body - Route request
 * @param {Object} body.origin - { lat, lon } starting point
 * @param {Object} [body.destination] - { lat, lon } destination (optional, backend picks nearest shelter)
 * @returns {Promise<Object>} Route response
 * @returns {Array} response.routes - Array of route objects with coordinates
 * @returns {number} response.chosenRouteId - ID of the recommended route
 * @returns {string} response.explanation - AI explanation for route choice
 * 
 * @example
 * const result = await getSafeRoute({ 
 *   origin: { lat: 53.8008, lon: -1.5491 } 
 * });
 * // result = {
 * //   routes: [{ id: 0, coordinates: [...], dangerScore: 0.2 }],
 * //   chosenRouteId: 0,
 * //   explanation: "Route selected because..."
 * // }
 */
export async function getSafeRoute(body) {
  try {
    const response = await axios.post(`${API_BASE}/routes/safe`, body, {
      timeout: 30000, // Longer timeout for route calculation
    });
    return response.data;
  } catch (error) {
    console.error('[routesApi] getSafeRoute error:', error);
    throw error;
  }
}
