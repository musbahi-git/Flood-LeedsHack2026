import axios from 'axios';

// Base URL for API (proxied in dev, can be configured for production)
const API_BASE = '/api';

/**
 * Incidents API
 * 
 * TODO: Person B - Add error handling and retry logic.
 */

/**
 * Get incidents with optional filters.
 * 
 * @param {Object} params - Query parameters
 * @param {number} params.lat - Latitude for geo query
 * @param {number} params.lon - Longitude for geo query
 * @param {number} params.radius - Radius in meters
 * @param {number} params.sinceMinutes - Only incidents from last N minutes
 * @param {string} params.type - Filter by type
 * @param {string} params.category - Filter by category
 * @returns {Promise<Array>} Array of incidents
 */
export async function getIncidents(params = {}) {
  const response = await axios.get(`${API_BASE}/incidents`, { params });
  return response.data;
}

/**
 * Create a new incident.
 * 
 * @param {Object} body - Incident data
 * @param {string} body.type - "incident" | "need_help" | "can_help"
 * @param {string} body.category - "flood" | "power" | "travel" | "other"
 * @param {string} body.description - Description text
 * @param {number} body.lat - Latitude
 * @param {number} body.lon - Longitude
 * @returns {Promise<Object>} Created incident
 */
export async function createIncident(body) {
  const response = await axios.post(`${API_BASE}/incidents`, body);
  return response.data;
}
