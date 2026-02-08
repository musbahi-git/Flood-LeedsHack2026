import { LatLng, Route } from "./types";
import axios from "axios";

// Example: OpenRouteService API (https://openrouteservice.org/dev/#/api-docs/v2/directions/{profile}/post)
const ORS_API_KEY = process.env.ORS_API_KEY || "YOUR_ORS_API_KEY";
const ORS_URL = "https://api.openrouteservice.org/v2/directions/foot-walking";

export async function getCandidateRoutes(
  origin: LatLng,
  destination: LatLng,
  count: number
): Promise<Route[]> {
  try {
    const response = await axios.post(
      ORS_URL,
      {
        coordinates: [
          [origin.lon, origin.lat],
          [destination.lon, destination.lat],
        ],
        alternative_routes: {
          target_count: count,
          share_factor: 0.6,
          weight_factor: 1.6,
        },
        instructions: false,
      },
      {
        headers: {
          Authorization: ORS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    const features = response.data.features || [];
    return features.map((feature: any, idx: number) => ({
      id: feature.properties.uid || String(idx),
      coordinates: feature.geometry.coordinates.map(([lon, lat]: [number, number]) => ({ lat, lon })),
      distanceMeters: feature.properties.summary.distance,
      durationSeconds: feature.properties.summary.duration,
    }));
  } catch (err) {
    console.error("[getCandidateRoutes] Routing API error:", err.message);
    return [];
  }
}
