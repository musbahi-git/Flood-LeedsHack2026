import { LatLng } from "./types";

// Returns array of sampled points along polyline, spaced by approx. intervalMeters
export function samplePolyline(
  coordinates: LatLng[],
  intervalMeters: number
): LatLng[] {
  if (coordinates.length < 2) return coordinates;
  const result: LatLng[] = [coordinates[0]];
  let last = coordinates[0];
  let accDist = 0;
  for (let i = 1; i < coordinates.length; i++) {
    const curr = coordinates[i];
    const segDist = haversine(last, curr);
    accDist += segDist;
    if (accDist >= intervalMeters) {
      result.push(curr);
      accDist = 0;
    }
    last = curr;
  }
  if (result[result.length - 1] !== coordinates[coordinates.length - 1]) {
    result.push(coordinates[coordinates.length - 1]);
  }
  return result;
}

// Haversine distance in meters
function haversine(a: LatLng, b: LatLng): number {
  const R = 6371e3;
  const φ1 = a.lat * Math.PI / 180;
  const φ2 = b.lat * Math.PI / 180;
  const Δφ = (b.lat - a.lat) * Math.PI / 180;
  const Δλ = (b.lon - a.lon) * Math.PI / 180;
  const x =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}
