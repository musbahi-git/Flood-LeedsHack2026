const axios = require('axios');
const polyline = require('@mapbox/polyline');

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

/**
 * Get multiple candidate routes using Google Directions API
 */
async function getCandidateRoutes(origin, destination) {
  const url = 'https://maps.googleapis.com/maps/api/directions/json';

  const response = await axios.get(url, {
    params: {
      origin: `${origin.lat},${origin.lon}`,
      destination: `${destination.lat},${destination.lon}`,
      alternatives: true,
      mode: 'walking',
      key: GOOGLE_API_KEY,
    },
  });

  if (response.data.status !== 'OK') {
    throw new Error('Google Directions API failed');
  }

  return response.data.routes.map((route, idx) => {
    const decoded = polyline.decode(route.overview_polyline.points);

    return {
      id: idx,
      coordinates: decoded.map(([lat, lon]) => ({ lat, lon })),
      distance: route.legs[0].distance.value,
      duration: route.legs[0].duration.value,
    };
  });
}

module.exports = { getCandidateRoutes };
