import axios from 'axios';

// API base URL - uses Vite proxy in development
const API_BASE = import.meta.env.VITE_API_URL || '/api';

/**
 * Incidents API
 * Handles all incident-related API calls.
 */

/**
 * Get incidents with optional filters.
 * 
 * @param {Object} params - Query parameters
 * @param {number} [params.lat] - Latitude for geo query
 * @param {number} [params.lon] - Longitude for geo query
 * @param {number} [params.radius] - Radius in meters (default 5000)
 * @param {number} [params.sinceMinutes] - Only incidents from last N minutes
 * @param {string} [params.type] - Filter by type (incident, need_help, can_help)
 * @param {string} [params.category] - Filter by category
 * @returns {Promise<Array>} Array of incidents
 */
export async function getIncidents(params = {}) {
  try {
    const response = await axios.get(`${API_BASE}/incidents`, { 
      params,
      timeout: 10000,
    });
    return response.data;
  } catch (error) {
    console.error('[incidentsApi] getIncidents error:', error);
    throw error;
  }
}

/**
 * Create a new incident.
 * 
 * @param {Object} body - Incident data
 * @param {string} body.type - "incident" | "need_help" | "can_help"
 * @param {string} body.category - "flood" | "power" | "travel" | "medical" | "supplies" | "other"
 * @param {string} body.description - Description text
 * @param {number} body.lat - Latitude
 * @param {number} body.lon - Longitude
 * @returns {Promise<Object>} Created incident
 */
export async function createIncident(body) {
  try {
    const response = await axios.post(`${API_BASE}/incidents`, body, {
      timeout: 10000,
    });
    return response.data;
  } catch (error) {
    console.error('[incidentsApi] createIncident error:', error);
    throw error;
  }
}
