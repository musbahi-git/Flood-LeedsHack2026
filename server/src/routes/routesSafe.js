const express = require('express');
const Shelter = require('../models/Shelter');
const { getCandidateRoutes } = require('../services/directionsService');
const { scoreRoutes } = require('../services/scoringService');
const { chooseRouteWithGemini } = require('../services/geminiService');

const router = express.Router();

/**
 * Find nearest shelter using geo query
 */
async function findNearestShelter(origin) {
  return Shelter.findOne({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [origin.lon, origin.lat],
        },
      },
    },
  });
}

/**
 * POST /api/routes/safe
 */
router.post('/', async (req, res) => {
  try {
    const { origin, destination } = req.body;

    if (!origin?.lat || !origin?.lon) {
      return res.status(400).json({ error: 'origin required' });
    }

    const shelter = destination
      ? destination
      : await findNearestShelter(origin);

    if (!shelter) {
      return res.status(404).json({ error: 'No shelter found' });
    }

    const routes = await getCandidateRoutes(origin, {
      lat: shelter.location.coordinates[1],
      lon: shelter.location.coordinates[0],
    });

    const scoredRoutes = await scoreRoutes(routes);
    const { chosenRouteId, explanation } =
      await chooseRouteWithGemini(scoredRoutes);

    res.json({
      routes: scoredRoutes,
      chosenRouteId,
      explanation,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to calculate route' });
  }
});

module.exports = router;
