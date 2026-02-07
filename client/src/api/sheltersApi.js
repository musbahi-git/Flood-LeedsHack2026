import axios from 'axios';

// API base URL - uses Vite proxy in development
const API_BASE = import.meta.env.VITE_API_URL || '/api';

/**
 * Shelters API
 * Handles all shelter-related API calls.
 */

/**
 * Get all shelters.
 * 
 * @returns {Promise<Array>} Array of shelter objects
 */
export async function getShelters() {
  try {
    const response = await axios.get(`${API_BASE}/shelters`, {
      timeout: 10000,
    });
    return response.data;
  } catch (error) {
    console.error('[sheltersApi] getShelters error:', error);
    throw error;
  }
}

/**
 * Get nearest shelter to a location.
 * 
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} Nearest shelter
 */
export async function getNearestShelter(lat, lon) {
  try {
    const response = await axios.get(`${API_BASE}/shelters`, {
      params: { lat, lon, limit: 1 },
      timeout: 10000,
    });
    return response.data[0] || null;
  } catch (error) {
    console.error('[sheltersApi] getNearestShelter error:', error);
    throw error;
  }
}
