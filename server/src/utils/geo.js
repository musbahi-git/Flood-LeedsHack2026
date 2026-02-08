/**
 * Geo Utilities
 * Helper functions for geospatial calculations.
 * 

 */

/**
 * Sample points along a polyline at regular intervals.
 * 
 * @param {Array} coordinates - Array of [lon, lat] coordinates
 * @param {number} step - Number of intermediate points to generate between each pair
 * @returns {Array} Sampled coordinates array
 * 
 * Implements polyline sampling using linear interpolation between points.
 */
function samplePolyline(coordinates, step = 5) {
  if (!Array.isArray(coordinates) || coordinates.length < 2) return coordinates;
  const sampled = [];
  for (let i = 0; i < coordinates.length - 1; i++) {
    const [lon1, lat1] = coordinates[i];
    const [lon2, lat2] = coordinates[i + 1];
    sampled.push([lon1, lat1]);
    for (let s = 1; s < step; s++) {
      const t = s / step;
      const lat = lat1 + (lat2 - lat1) * t;
      const lon = lon1 + (lon2 - lon1) * t;
      sampled.push([lon, lat]);
    }
  }
  sampled.push(coordinates.at(-1));
  return sampled;
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
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
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
 * - Consider using @turf/boolean-point-in-polygon
 */
function pointInPolygon(point, polygon) {
  // Ray-casting algorithm for point-in-polygon
  let x = point[0], y = point[1];
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    let xi = polygon[i][0], yi = polygon[i][1];
    let xj = polygon[j][0], yj = polygon[j][1];
    let intersect = ((yi > y) !== (yj > y)) &&
      (x < (xj - xi) * (y - yi) / (yj - yi + 1e-12) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

module.exports = {
  samplePolyline,
  haversineDistance,
  toRad,
  pointInPolygon,
};
