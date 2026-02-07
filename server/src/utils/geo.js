/**
 * Geo Utilities
 * Helper functions for geospatial calculations.
 * 
 * TODO: Person C - Implement geo utility functions.
 */

/**
 * Sample points along a polyline at regular intervals.
 * 
 * @param {Array} coordinates - Array of [lon, lat] coordinates
 * @param {number} step - Number of intermediate points to generate between each pair
 * @returns {Array} Sampled coordinates array
 * 
 * TODO: Person C - Implement polyline sampling
 * - Use linear interpolation between points
 * - Consider using @turf/along for distance-based sampling
 */
function samplePolyline(coordinates, step = 5) {
  // TODO: Implement polyline sampling
  // For now, just return the original coordinates
  console.log('[geo] samplePolyline called - stubbed');
  return coordinates;
}

/**
 * Calculate distance between two points using Haversine formula.
 * 
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} Distance in meters
 * 
 * TODO: Person C - Implement Haversine distance
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
  // TODO: Implement Haversine formula
  const R = 6371000; // Earth's radius in meters
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Convert degrees to radians.
 * 
 * @param {number} deg - Degrees
 * @returns {number} Radians
 */
function toRad(deg) {
  return deg * (Math.PI / 180);
}

/**
 * Check if a point is inside a polygon.
 * 
 * @param {Array} point - [lon, lat]
 * @param {Array} polygon - Array of [lon, lat] coordinates forming the polygon
 * @returns {boolean} True if point is inside polygon
 * 
 * TODO: Person C - Implement point-in-polygon check
 * - Consider using @turf/boolean-point-in-polygon
 */
function pointInPolygon(point, polygon) {
  // TODO: Implement point-in-polygon algorithm
  console.log('[geo] pointInPolygon called - stubbed');
  return false;
}

module.exports = {
  samplePolyline,
  haversineDistance,
  toRad,
  pointInPolygon,
};
