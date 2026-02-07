/**
 * Scoring Service
 * Calculates danger scores for routes based on flood risk and incidents.
 * 
 * TODO: Person C - Implement full scoring algorithm.
 */

const { getFloodRisk, getRouteFloodRisk } = require('./floodRiskService');
const { samplePolyline } = require('../utils/geo');

/**
 * Score routes based on danger factors.
 * 
 * @param {Array} routes - Array of route objects with coordinates
 * @param {Array} incidents - Array of nearby incident objects
 * @returns {Array} Routes with added dangerScore property
 * 
 * TODO: Person C - Implement comprehensive scoring:
 * - Sample points along each route polyline
 * - Check flood risk at each sample point
 * - Check proximity to incidents
 * - Weight factors appropriately
 * - Normalize final score to 0-1 range
 */
function scoreRoutes(routes, incidents) {
  console.log('[scoringService] scoreRoutes called - stubbed');

  return routes.map((route, index) => {
    // TODO: Implement real scoring logic
    // const floodRisk = getRouteFloodRisk(route.coordinates);
    // const incidentRisk = calculateIncidentRisk(route.coordinates, incidents);
    // const dangerScore = (floodRisk * 0.6) + (incidentRisk * 0.4);

    // Stubbed: assign random danger scores for demonstration
    const dangerScore = Math.random() * 0.5; // 0 to 0.5 range for demo

    return {
      ...route,
      dangerScore: parseFloat(dangerScore.toFixed(3)),
    };
  });
}

/**
 * Calculate incident-based risk for a route.
 * 
 * @param {Array} coordinates - Route coordinates
 * @param {Array} incidents - Nearby incidents
 * @returns {number} Risk score from 0 to 1
 * 
 * TODO: Person C - Implement incident proximity scoring
 */
function calculateIncidentRisk(coordinates, incidents) {
  // TODO: Implement incident-based risk calculation
  // - For each route point, find nearby incidents
  // - Weight by incident type and recency
  // - Sum and normalize
  
  return 0;
}

/**
 * Generate route summary for Gemini.
 * 
 * @param {Object} route - Scored route object
 * @returns {Object} Summary object for AI consumption
 * 
 * TODO: Person C - Format route data for Gemini prompt
 */
function generateRouteSummary(route) {
  return {
    id: route.id,
    distance: route.distance,
    duration: route.duration,
    dangerScore: route.dangerScore,
    // TODO: Add more details like flood zone crossings, incident counts
  };
}

module.exports = {
  scoreRoutes,
  calculateIncidentRisk,
  generateRouteSummary,
};
