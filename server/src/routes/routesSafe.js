const express = require('express');
const { getCandidateRoutes } = require('../services/directionsService');
const { scoreRoutes } = require('../services/scoringService');
const { chooseRouteWithGemini } = require('../services/geminiService');

const router = express.Router();

/**
 * POST /api/routes/safe
 * Get AI-assisted safe route to a destination.
 * 
 * Body: {
 *   origin: { lat, lon },
 *   destination: { lat, lon }
 * }
 * 
 * Returns: {
 *   routes: [{ id, coordinates, dangerScore }],
 *   chosenRouteId: number,
 *   explanation: string
 * }
 * 
 * TODO: Person C - Implement full logic with real Google Directions, 
 *       flood risk scoring, and Gemini route selection.
 */
router.post('/', async (req, res) => {
  try {
    const { origin, destination } = req.body;

    // Basic validation
    if (!origin || !origin.lat || !origin.lon) {
      return res.status(400).json({ error: 'origin with lat and lon is required' });
    }
    if (!destination || !destination.lat || !destination.lon) {
      return res.status(400).json({ error: 'destination with lat and lon is required' });
    }

    // Step 1: Get candidate routes from Google Directions (stubbed)
    const routes = await getCandidateRoutes(origin, destination);

    // Step 2: Score routes based on flood risk and incidents (stubbed)
    const scoredRoutes = scoreRoutes(routes, []);

    // Step 3: Use Gemini to choose the safest route (stubbed)
    const { chosenRouteId, explanation } = await chooseRouteWithGemini(scoredRoutes);

    res.json({
      routes: scoredRoutes,
      chosenRouteId,
      explanation,
    });
  } catch (error) {
    console.error('Error calculating safe route:', error);
    res.status(500).json({ error: 'Failed to calculate safe route' });
  }
});

module.exports = router;
