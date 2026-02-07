import axios from 'axios';

// Base URL for API
const API_BASE = '/api';

/**
 * Routes API
 * 
 * TODO: Person B - Add loading state management.
 */

/**
 * Get AI-assisted safe route to destination.
 * 
 * @param {Object} body - Route request
 * @param {Object} body.origin - { lat, lon }
 * @param {Object} body.destination - { lat, lon }
 * @returns {Promise<Object>} Route response with routes, chosenRouteId, explanation
 */
export async function getSafeRoute(body) {
  const response = await axios.post(`${API_BASE}/routes/safe`, body);
  return response.data;
}
