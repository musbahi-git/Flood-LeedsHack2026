const express = require('express');
const router = express.Router();
const Shelter = require('../models/Shelter');
const Incident = require('../models/Incident'); // Import Incident Model
const path = require('ngraph.path');
const { buildRoadGraph, findNearestNodeInComponent } = require('../utils/graphBuilder');
const { haversineDistance } = require('../utils/geo');
const { getFloodRisk } = require('../services/floodRiskService');

// Helper to find nearest shelter
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
        destCoords = { lat: 53.8008, lon: -1.5491 }; 
      } else {
        destCoords = { 
          lat: shelterDoc.location.coordinates[1], 
          lon: shelterDoc.location.coordinates[0] 
        };
      }
    }

    // 2. Get Graph
    const { graph, spatialIndex, largestComponent } = buildRoadGraph();

    // 3. Snap to Network
    const startNode = findNearestNodeInComponent(origin.lat, origin.lon, spatialIndex, largestComponent);
    const endNode = findNearestNodeInComponent(destCoords.lat, destCoords.lon, spatialIndex, largestComponent);

    if (!startNode || !endNode) {
      return sendFallback(res, origin, destCoords, shelterDoc, "Location outside supported road network.");
    }

    // --- NEW: DYNAMIC HAZARD LOADING ---
    // Fetch incidents from the last 24 hours
    const activeIncidents = await Incident.find({
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    // Create a "Danger Set" of blocked Node IDs
    const dangerNodes = new Set();
    const DANGER_RADIUS = 150; // Meters around an incident to block

    if (activeIncidents.length > 0) {
      console.log(`⚠️ Processing ${activeIncidents.length} active incidents...`);
      
      activeIncidents.forEach(inc => {
        const [iLon, iLat] = inc.location.coordinates;
        
        // Scan spatial index for nodes close to this incident
        spatialIndex.forEach(node => {
          if (Math.abs(node.lat - iLat) > 0.005) return; 
          if (Math.abs(node.lon - iLon) > 0.005) return;

          const dist = haversineDistance(iLat, iLon, node.lat, node.lon);
          if (dist < DANGER_RADIUS) {
            dangerNodes.add(node.id);
          }
        });
      });
      console.log(`🚫 Blocked ${dangerNodes.size} road nodes due to flooding.`);
    }

    // 4. A* Search with Penalties
    const pathFinder = path.aStar(graph, {
      distance: (from, to, link) => {
        let cost = link.data.distance;

        // RULE 1: Avoid Tunnels
        if (link.data.isTunnel) cost *= 10;

          // RULE 2: AVOID FLOOD ZONES
          if (dangerNodes.has(from.id) || dangerNodes.has(to.id)) {
            return cost * 10000; // Virtually impossible cost
          }
          // RULE 3: Avoid flood zones (active and historical)
          const floodRiskFrom = getFloodRisk(from.data.lat, from.data.lon);
          const floodRiskTo = getFloodRisk(to.data.lat, to.data.lon);
          if (floodRiskFrom > 0.1 || floodRiskTo > 0.1) {
           return cost * 10000; // Block route through flood zone
          }

        return cost;
      },
      heuristic: (from, to) => haversineDistance(from.data.lat, from.data.lon, to.data.lat, to.data.lon)
    });

    const foundPath = pathFinder.find(startNode.id, endNode.id);

    // 5. Response
    if (foundPath.length === 0) {
      return sendFallback(res, origin, destCoords, shelterDoc, "Route blocked by hazards.");
    }

    let explanation = "🛡️ Safe route calculated.";
    if (dangerNodes.size > 0) {
      explanation = "⚠️ Route altered to avoid reported flood incidents.";
    }

    const coordinates = foundPath.map(n => ({ 
      lat: n.data.lat, 
      lon: n.data.lon 
    }));

    res.json({
      routes: [{ id: 'safe-1', coordinates, dangerScore: 0.1 }],
      chosenRouteId: 'safe-1',
      explanation: explanation,
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
    explanation: `⚠️ ${reason}`,
    shelter: shelter
  });
}

module.exports = router;