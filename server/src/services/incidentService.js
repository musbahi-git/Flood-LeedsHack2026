const Incident = require('../models/Incident');

module.exports = {
  async getIncidentsNearPoint(point, windowMinutes, radiusMeters) {
    const since = new Date(Date.now() - windowMinutes * 60 * 1000);
    return Incident.find({
      createdAt: { $gte: since },
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [point.lon, point.lat] },
          $maxDistance: radiusMeters,
        },
      },
    });
  }
};
