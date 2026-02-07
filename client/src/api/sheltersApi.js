import axios from 'axios';

// Base URL for API
const API_BASE = '/api';

/**
 * Shelters API
 * 
 * TODO: Person B - Add caching for shelter data.
 */

/**
 * Get all shelters.
 * 
 * @returns {Promise<Array>} Array of shelters
 */
export async function getShelters() {
  const response = await axios.get(`${API_BASE}/shelters`);
  return response.data;
}
