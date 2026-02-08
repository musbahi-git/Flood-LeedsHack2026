const axios = require('axios');

module.exports = {
  async getCandidateRoutes(origin, destination) {
    // Example: OpenRouteService API
    const ORS_API_KEY = process.env.ORS_API_KEY;
    const url = 'https://api.openrouteservice.org/v2/directions/foot-walking';
    const response = await axios.post(url, {
      coordinates: [
        [origin.lon, origin.lat],
        [destination.lon, destination.lat],
      ],
      alternative_routes: {
        target_count: 3,
        share_factor: 0.6,
        weight_factor: 1.6,
      },
      instructions: false,
    }, {
      headers: {
        Authorization: ORS_API_KEY,
        'Content-Type': 'application/json',
      },
    });
    const features = response.data.features || [];
    return features.map((feature, idx) => ({
      id: feature.properties.uid || String(idx),
      coordinates: feature.geometry.coordinates.map(([lon, lat]) => ({ lat, lon })),
      distanceMeters: feature.properties.summary.distance,
      durationSeconds: feature.properties.summary.duration,
    }));
  }
};
