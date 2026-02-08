import { LatLng } from "./types";

// TODO: Integrate with flood risk polygons/tiles or external API
export async function getFloodRiskAtPoint(point: LatLng): Promise<number> {
  // For now, always return 0 (safe)
  return 0;
}
