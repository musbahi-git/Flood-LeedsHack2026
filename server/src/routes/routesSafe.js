const express = require('express');
const Shelter = require('../models/Shelter');
const { scoreRoutes } = require('../services/scoringService');

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
 * Calculate safe route to nearest shelter.
 * 
 * Body: { origin: { lat, lon }, destination?: { lat, lon } }
 * Returns: { routes, chosenRouteId, explanation, shelter }
 */
router.post('/', async (req, res) => {
  try {
    const { origin, destination } = req.body;

    // Validate origin
    if (!origin?.lat || !origin?.lon) {
      return res.status(400).json({ error: 'origin with lat and lon required' });
    }



    // Find destination shelter
    let shelterDoc;
    let destCoords;

    if (destination?.lat && destination?.lon) {
      // Use provided destination
      destCoords = {
        lat: destination.lat,
        lon: destination.lon,
      };
      // Try to find matching shelter (optional)
      shelterDoc = await Shelter.findOne({
        'location.coordinates.0': { $gte: destCoords.lon - 0.001, $lte: destCoords.lon + 0.001 },
        'location.coordinates.1': { $gte: destCoords.lat - 0.001, $lte: destCoords.lat + 0.001 },
      });
    } else {
      // Find nearest shelter
      shelterDoc = await findNearestShelter(origin);
      
      if (!shelterDoc) {
        return res.status(404).json({ error: 'No shelter found nearby' });
      }
      
      destCoords = {
        lat: shelterDoc.location.coordinates[1],
        lon: shelterDoc.location.coordinates[0],
      };
    }


    // Fallback: create a single direct route (origin -> destination)
    const fallbackRoute = {
      id: 0,
      coordinates: [
        { lat: origin.lat, lon: origin.lon },
        { lat: destCoords.lat, lon: destCoords.lon }
      ],
      distance: 0, // Not calculated
      duration: 0, // Not calculated
      dangerScore: 0
    };
    const scoredRoutes = await scoreRoutes([fallbackRoute]);
    const chosenRouteId = 0;
    const explanation = 'This is the shortest direct route to the nearest shelter.';
    const response = {
      routes: scoredRoutes,
      chosenRouteId,
      explanation,
    };

    // Add shelter info if available
    if (shelterDoc) {
      response.shelter = {
        id: shelterDoc._id,
        name: shelterDoc.name,
        lat: shelterDoc.location.coordinates[1],
        lon: shelterDoc.location.coordinates[0],
        address: shelterDoc.address,
        capacity: shelterDoc.capacity,
        currentOccupancy: shelterDoc.currentOccupancy,
        amenities: shelterDoc.amenities,
        isActive: shelterDoc.isActive,
      };
    }

    res.json(response);
  } catch (err) {
    console.error('[routesSafe] Error:', err);
    res.status(500).json({ 
      error: 'Failed to calculate route',
      details: err.message 
    });
  }
});

module.exports = router;