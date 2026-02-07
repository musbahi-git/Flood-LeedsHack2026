const express = require('express');
const Incident = require('../models/Incident');

const router = express.Router();

/**
 * POST /api/incidents
 * Create a new incident report.
 * 
 * Body: { type, category, description, lat, lon }
 */
router.post('/', async (req, res) => {
  try {
    const { type, category, description, lat, lon, userId } = req.body;

    // Basic validation
    if (!type) {
      return res.status(400).json({ error: 'type is required' });
    }
    if (lat === undefined || lon === undefined) {
      return res.status(400).json({ error: 'lat and lon are required' });
    }

    // Create incident with GeoJSON location
    const incident = new Incident({
      type,
      category: category || 'other',
      description: description || '',
      userId: userId || null,
      location: {
        type: 'Point',
        coordinates: [parseFloat(lon), parseFloat(lat)], // GeoJSON uses [lon, lat]
      },
    });

    await incident.save();
    res.status(201).json(incident);
  } catch (error) {
    console.error('Error creating incident:', error);
    res.status(500).json({ error: 'Failed to create incident' });
  }
});

/**
 * GET /api/incidents
 * Retrieve incidents with optional filtering.
 * 
 * Query params:
 * - lat, lon: Center point for geo query
 * - radius: Radius in meters (default 5000)
 * - sinceMinutes: Only incidents created within last N minutes
 * - type: Filter by incident type
 * - category: Filter by category
 */
router.get('/', async (req, res) => {
  try {
    const { lat, lon, radius, sinceMinutes, type, category } = req.query;

    let query = {};

    // Geo filter if lat/lon provided
    if (lat && lon) {
      const radiusMeters = parseInt(radius) || 5000;
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lon), parseFloat(lat)],
          },
          $maxDistance: radiusMeters,
        },
      };
    }

    // Time filter
    if (sinceMinutes) {
      const since = new Date(Date.now() - parseInt(sinceMinutes) * 60 * 1000);
      query.createdAt = { $gte: since };
    }

    // Type filter
    if (type) {
      query.type = type;
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    const incidents = await Incident.find(query).sort({ createdAt: -1 }).limit(100);
    res.json(incidents);
  } catch (error) {
    console.error('Error fetching incidents:', error);
    res.status(500).json({ error: 'Failed to fetch incidents' });
  }
});

module.exports = router;
