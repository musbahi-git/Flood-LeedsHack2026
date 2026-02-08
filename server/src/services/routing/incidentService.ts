import { LatLng } from "./types";
const Incident = require("../../models/Incident");

// Returns a normalized incident score [0,1] for a point
export async function getIncidentScoreAtPoint(point: LatLng): Promise<number> {
  // Find incidents within 100m in last 2 hours
  const windowMinutes = 120;
  const radiusMeters = 100;
  const since = new Date(Date.now() - windowMinutes * 60 * 1000);
  const incidents = await Incident.find({
    createdAt: { $gte: since },
    location: {
      $near: {
        $geometry: { type: "Point", coordinates: [point.lon, point.lat] },
        $maxDistance: radiusMeters,
      },
    },
  });
  // Score: 0 if none, up to 1 if many
  return Math.min(incidents.length / 5, 1); // 5+ incidents = max risk
}
