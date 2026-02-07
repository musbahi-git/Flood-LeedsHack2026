const Incident = require('../models/Incident');

/**
 * Haversine distance in meters
 */
function distance(a, b) {
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

/**
 * Score routes based on proximity to recent incidents
 */
async function scoreRoutes(routes) {
  const recentIncidents = await Incident.find({
    createdAt: { $gte: new Date(Date.now() - 2 * 60 * 60 * 1000) },
  });

  return routes.map(route => {
    let risk = 0;

    for (const point of route.coordinates) {
      for (const incident of recentIncidents) {
        const [lon, lat] = incident.location.coordinates;
        const d = distance(point, { lat, lon });

        if (d < 100) risk += 0.04;
        else if (d < 250) risk += 0.015;
      }
    }

    return {
      ...route,
      dangerScore: Math.min(risk, 1),
    };
  });
}

module.exports = { scoreRoutes };
