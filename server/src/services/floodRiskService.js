/**
 * Flood Risk Service
 * Handles flood zone data and risk calculations.
 * 
 * TODO: Person C - Implement real flood risk assessment using GeoJSON data.
 */

const fs = require('node:fs');
const path = require('node:path');

// Load flood zones GeoJSON (placeholder)
let floodZones = null;

/**
 * Load flood zones data from GeoJSON file.
 * Called once at startup.
 * 
 * TODO: Person C - Implement proper GeoJSON loading
 */
function loadFloodZones() {
  try {
    const filePath = path.join(__dirname, '../data/flood_zones.geojson');
    const data = fs.readFileSync(filePath, 'utf8');
    floodZones = JSON.parse(data);
    console.log('[floodRiskService] Flood zones loaded');
  } catch (error) {
    console.warn('[floodRiskService] Could not load flood zones:', error.message);
    floodZones = { type: 'FeatureCollection', features: [] };
  }
}

/**
 * Get flood risk score for a given point.
 * 
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {number} Risk score from 0 (safe) to 1 (high risk)
 * 
 * TODO: Person C - Implement point-in-polygon check against flood zones
 * - Use @turf/boolean-point-in-polygon or similar library
 * - Consider multiple flood zone severity levels
 */
function getFloodRisk(lat, lon) {
  // TODO: Implement real flood risk calculation
  // - Check if point is in any flood zone polygon
  // - Return severity based on zone properties
  
  // Stubbed response - returns random risk for demonstration
  console.log(`[floodRiskService] getFloodRisk called for (${lat}, ${lon}) - stubbed`);
  return 0; // Return safe by default
}

/**
 * Get flood risk along a route by sampling points.
 * 
 * @param {Array} coordinates - Array of [lon, lat] coordinates
 * @returns {number} Average risk score along the route
 * 
 * TODO: Person C - Sample points along route and calculate average risk
 */
function getRouteFloodRisk(coordinates) {
  // TODO: Implement route-based flood risk calculation
  // - Sample points at regular intervals
  // - Calculate average or max flood risk
  
  console.log('[floodRiskService] getRouteFloodRisk called - stubbed');
  return 0;
}

// Initialize flood zones on module load
loadFloodZones();

module.exports = {
  loadFloodZones,
  getFloodRisk,
  getRouteFloodRisk,
};
