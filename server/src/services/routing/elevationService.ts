import { LatLng } from "./types";

// TODO: Integrate with elevation API (e.g., Google Elevation, SRTM)
export async function getElevationAtPoint(point: LatLng): Promise<number> {
  // For now, always return 0
  return 0;
}
