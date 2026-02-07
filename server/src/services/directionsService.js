/**
 * Directions Service
 * Handles communication with Google Directions API.
 * 
 * TODO: Person C - Implement real Google Directions API integration.
 */

const axios = require('axios');

/**
 * Get candidate routes between two points.
 * 
 * @param {Object} origin - { lat, lon }
 * @param {Object} destination - { lat, lon }
 * @returns {Promise<Array>} Array of route objects with coordinates
 * 
 * TODO: Person C - Implement Google Directions API call.
 * - Use GOOGLE_MAPS_API_KEY from environment
 * - Request alternatives=true to get multiple routes
 * - Parse response to extract polyline coordinates
 */
async function getCandidateRoutes(origin, destination) {
  // TODO: Implement real Google Directions API call
  // const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  // const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lon}&destination=${destination.lat},${destination.lon}&alternatives=true&key=${apiKey}`;
  // const response = await axios.get(url);
  // return parseRoutes(response.data);

  // Stubbed response with mock routes
  console.log('[directionsService] getCandidateRoutes called (stubbed)');
  
  // Generate simple mock routes between origin and destination
  const route1 = {
    id: 0,
    coordinates: [
      [origin.lon, origin.lat],
      [origin.lon + 0.005, origin.lat + 0.003],
      [destination.lon - 0.003, destination.lat - 0.002],
      [destination.lon, destination.lat],
    ],
    distance: 2500,
    duration: 600,
  };

  const route2 = {
    id: 1,
    coordinates: [
      [origin.lon, origin.lat],
      [origin.lon - 0.004, origin.lat + 0.004],
      [destination.lon + 0.002, destination.lat - 0.003],
      [destination.lon, destination.lat],
    ],
    distance: 2800,
    duration: 720,
  };

  return [route1, route2];
}

/**
 * Parse Google Directions API response to extract routes.
 * 
 * @param {Object} data - Google Directions API response
 * @returns {Array} Parsed routes with coordinates
 * 
 * TODO: Person C - Implement polyline decoding
 */
function parseRoutes(data) {
  // TODO: Decode polyline from Google response
  // Use @mapbox/polyline or similar library
  return [];
}

module.exports = {
  getCandidateRoutes,
  parseRoutes,
};
