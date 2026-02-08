const express = require('express');
const router = express.Router();
const Shelter = require('../models/Shelter');
const path = require('ngraph.path');
const { buildRoadGraph, findNearestNodeInComponent } = require('../utils/graphBuilder');
const { haversineDistance } = require('../utils/geo');

async function findNearestShelter(origin) {
  return Shelter.findOne({
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates: [origin.lon, origin.lat] },
      },
    },
  });
}

router.post('/', async (req, res) => {
  try {
    const { origin, destination } = req.body;
    console.log(`🗺️ Route Request: ${origin.lat},${origin.lon}`);

    // 1. Destination Logic
    let destCoords;
    let shelterDoc;
    if (destination?.lat) {
      destCoords = destination;
    } else {
      shelterDoc = await findNearestShelter(origin);
      if (!shelterDoc) {
        destCoords = { lat: 53.8008, lon: -1.5491 }; // Fallback
      } else {
        destCoords = { 
          lat: shelterDoc.location.coordinates[1], 
          lon: shelterDoc.location.coordinates[0] 
        };
      }
    }

    // 2. Get Graph & Main Component
    const { graph, spatialIndex, largestComponent } = buildRoadGraph();

    // 3. Snap to MAIN NETWORK (The Fix)
    // This finds the closest node that is GUARANTEED to be connected to the city
    const startNode = findNearestNodeInComponent(origin.lat, origin.lon, spatialIndex, largestComponent);
    const endNode = findNearestNodeInComponent(destCoords.lat, destCoords.lon, spatialIndex, largestComponent);

    // Logging for verification
    if (startNode) console.log(`📍 Start snapped to Main Network (${startNode.dist.toFixed(0)}m away)`);
    else console.warn(`❌ Start point too far from any main road.`);
    
    if (endNode) console.log(`📍 End snapped to Main Network (${endNode.dist.toFixed(0)}m away)`);

    // Safety Check
    if (!startNode || !endNode) {
      return sendFallback(res, origin, destCoords, shelterDoc, "Location outside supported road network.");
    }

    // 4. Run A* (Single run, no loops needed now!)
    const pathFinder = path.aStar(graph, {
      distance: (from, to, link) => {
        let cost = link.data.distance;
        if (link.data.isTunnel) cost *= 10;
        return cost;
      },
      heuristic: (from, to) => haversineDistance(from.data.lat, from.data.lon, to.data.lat, to.data.lon)
    });

    const foundPath = pathFinder.find(startNode.id, endNode.id);

    // 5. Handle Result
    if (foundPath.length === 0) {
      // This should theoretically never happen if start/end are in the same component,
      // but we keep it for 100% crash safety.
      console.warn("⚠️ A* failed inside connected component (Rare).");
      return sendFallback(res, origin, destCoords, shelterDoc, "Complex pathing error.");
    }

    console.log(`✅ Path found: ${foundPath.length} nodes.`);

    // Extract coordinates (No reverse needed for ngraph)
    const coordinates = foundPath.map(n => ({ 
      lat: n.data.lat, 
      lon: n.data.lon 
    }));

    res.json({
      routes: [{ id: 'safe-1', coordinates, dangerScore: 0.1 }],
      chosenRouteId: 'safe-1',
      explanation: "🛡️ Safe route calculated using connected Main Road Network.",
      shelter: shelterDoc
    });

  } catch (err) {
    console.error('[routesSafe] Error:', err);
    res.status(500).json({ error: "Server error" });
  }
});

function sendFallback(res, origin, dest, shelter, reason) {
  res.json({
    routes: [{ 
      id: 'fallback-direct', 
      coordinates: [{ lat: origin.lat, lon: origin.lon }, { lat: dest.lat, lon: dest.lon }], 
      dangerScore: 0.5 
    }],
    chosenRouteId: 'fallback-direct',
    explanation: `⚠️ ${reason} Showing direct line.`,
    shelter: shelter
  });
}

module.exports = router;