const express = require('express');
const { chooseBestRouteAndShelter } = require('../services/routing/routingService');

const { FloodRiskService, ElevationService } = require('../services');
const routingApi = require('../services/routingApi');
const incidentService = require('../services/incidentService');
const shelterService = require('../services/shelterService');

const router = express.Router();

const floodRiskService = new FloodRiskService();
const elevationService = new ElevationService();

router.post('/', async (req, res) => {
  const { origin, mode } = req.body;
  if (!origin?.lat || !origin?.lon) {
    return res.status(400).json({ error: 'origin with lat and lon required' });
  }
  try {
    // TODO: Replace the following with your actual service instances
    const ctx = {
      routingApi,
      incidentService,
      floodRiskService,
      elevationService,
      shelterService,
    };
    const result = await chooseBestRouteAndShelter(origin, mode || 'normal', ctx);
    res.json(result);
  } catch (err) {
    console.error('[routesSafe] Error:', err);
    res.status(500).json({ error: 'Failed to compute safe route', details: err.message });
  }
});

module.exports = router;