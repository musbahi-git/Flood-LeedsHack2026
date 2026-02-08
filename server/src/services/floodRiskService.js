/**
 * Flood Risk Service
 * Handles flood zone data and risk calculations.
 * 
 * TODO: Person C - Implement real flood risk assessment using GeoJSON data.
 */

const fs = require('node:fs');
const path = require('node:path');
const { booleanPointInPolygon } = require('@turf/boolean-point-in-polygon');

let floodZones = null;
let historicalFloodZones = null;

/**
 * Load flood zones data from GeoJSON file.
 * Called once at startup.
 * 
 * TODO: Person C - Implement proper GeoJSON loading
 */
function loadFloodZones() {
  try {
    const floodFile = path.join(__dirname, '../data/flood_zones.geojson');
    const floodData = fs.readFileSync(floodFile, 'utf8');
    floodZones = JSON.parse(floodData);
    console.log('[floodRiskService] Flood zones loaded');
  } catch (error) {
    console.warn('[floodRiskService] Could not load flood zones:', error.message);
    floodZones = { type: 'FeatureCollection', features: [] };
  }
  try {
    const histFile = path.join(__dirname, '../data/historical_flood_zones.geojson');
    const histData = fs.readFileSync(histFile, 'utf8');
    historicalFloodZones = JSON.parse(histData);
    console.log('[floodRiskService] Historical flood zones loaded');
  } catch (error) {
    console.warn('[floodRiskService] Could not load historical flood zones:', error.message);
    historicalFloodZones = { type: 'FeatureCollection', features: [] };
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
  // Check active flood zones
  for (const feature of floodZones.features) {
    if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
      if (booleanPointInPolygon([lon, lat], feature)) {
        return feature.properties.risk === 'high' ? 1 : feature.properties.risk === 'medium' ? 0.5 : 0.2;
      }
    }
  }
  // Check historical flood zones
  for (const feature of historicalFloodZones.features) {
    if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
      if (booleanPointInPolygon([lon, lat], feature)) {
        return feature.properties.risk === 'high' ? 0.8 : feature.properties.risk === 'medium' ? 0.4 : 0.1;
      }
    }
  }
  return 0; // Safe by default
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
  // Sample points along route and check risk
  if (!Array.isArray(coordinates) || coordinates.length === 0) return 0;
  let totalRisk = 0;
  let count = 0;
  for (const coord of coordinates) {
    const lon = Array.isArray(coord) ? coord[0] : coord.lon;
    const lat = Array.isArray(coord) ? coord[1] : coord.lat;
    totalRisk += getFloodRisk(lat, lon);
    count++;
  }
  return count > 0 ? totalRisk / count : 0;
}

// Initialize flood zones on module load
loadFloodZones();

module.exports = {
  loadFloodZones,
  getFloodRisk,
  getRouteFloodRisk,
};
