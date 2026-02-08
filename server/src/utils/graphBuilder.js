const createGraph = require('ngraph.graph');
const fs = require('fs');
const path = require('path');
const { haversineDistance } = require('./geo');

// Caches
let cachedGraph = null;
let cachedSpatialIndex = [];
let cachedLargestComponent = null; // Stores the Set of "Main Network" node IDs

// --- FIX 1: Component Analysis ---
function getLargestConnectedComponent(graph) {
  const visited = new Set();
  let largest = new Set();

  graph.forEachNode(node => {
    if (visited.has(node.id)) return;

    const stack = [node.id];
    const component = new Set();

    while (stack.length) {
      const id = stack.pop();
      if (visited.has(id)) continue;
      visited.add(id);
      component.add(id);

      // Traverse neighbors
      const links = graph.getLinks(id) || [];
      for (const l of links) {
        const other = l.fromId === id ? l.toId : l.fromId;
        if (!visited.has(other)) stack.push(other);
      }
    }

    if (component.size > largest.size) {
      largest = component;
    }
  });

  return largest;
}

// Snapping Helper (Precision 5 ≈ 1.1m)
function snapCoord(val) {
  return Number(val.toFixed(5));
}

function snapPoint(lon, lat) {
  const sLon = snapCoord(lon);
  const sLat = snapCoord(lat);
  return {
    lon: sLon,
    lat: sLat,
    id: `${sLon},${sLat}`
  };
}

// --- Main Builder ---
function buildRoadGraph() {
  if (cachedGraph) {
    return { 
      graph: cachedGraph, 
      spatialIndex: cachedSpatialIndex, 
      largestComponent: cachedLargestComponent 
    };
  }

  // Load File
  let filePath = path.join(__dirname, '../data/leeds_roads.json');
  if (!fs.existsSync(filePath)) {
    filePath = path.join(__dirname, '../data/leeds_roads.geojson');
  }
  
  if (!fs.existsSync(filePath)) {
    console.error('❌ leeds_roads file missing! Using empty graph.');
    return { graph: createGraph(), spatialIndex: [], largestComponent: new Set() };
  }

  console.log('🏗️ Building Leeds road graph...');
  const graph = createGraph();
  const geoData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const tempSpatialIndex = []; 

  // Build Graph
  geoData.features.forEach(feature => {
    if (feature.geometry.type === 'LineString') {
      const coords = feature.geometry.coordinates;
      for (let i = 0; i < coords.length - 1; i++) {
        const from = coords[i];
        const to = coords[i+1];
        
        // Snap
        const fromNode = snapPoint(from[0], from[1]);
        const toNode = snapPoint(to[0], to[1]);

        // Add Nodes
        if (!graph.getNode(fromNode.id)) {
          graph.addNode(fromNode.id, { lon: fromNode.lon, lat: fromNode.lat });
          tempSpatialIndex.push({ id: fromNode.id, lon: fromNode.lon, lat: fromNode.lat });
        }
        if (!graph.getNode(toNode.id)) {
          graph.addNode(toNode.id, { lon: toNode.lon, lat: toNode.lat });
          tempSpatialIndex.push({ id: toNode.id, lon: toNode.lon, lat: toNode.lat });
        }

        const dist = haversineDistance(fromNode.lat, fromNode.lon, toNode.lat, toNode.lon);
        
        // Add Links (Bidirectional)
        if (!graph.hasLink(fromNode.id, toNode.id)) {
          graph.addLink(fromNode.id, toNode.id, { 
            distance: dist,
            type: feature.properties.highway,
            isTunnel: feature.properties.tunnel === 'yes'
          });
        }
        if (!graph.hasLink(toNode.id, fromNode.id)) {
          graph.addLink(toNode.id, fromNode.id, { 
            distance: dist,
            type: feature.properties.highway,
            isTunnel: feature.properties.tunnel === 'yes'
          });
        }
      }
    }
  });

  // FIX 2: Compute Largest Component
  console.log('🧠 Analyzing graph connectivity...');
  const largestComponent = getLargestConnectedComponent(graph);
  console.log(`✅ Graph Analysis Complete.`);
  console.log(`   Total Nodes: ${graph.getNodesCount()}`);
  console.log(`   Main Network Size: ${largestComponent.size} nodes`);
  console.log(`   Disconnected Islands: ${graph.getNodesCount() - largestComponent.size} nodes (Ignored)`);

  cachedGraph = graph;
  cachedSpatialIndex = tempSpatialIndex;
  cachedLargestComponent = largestComponent;

  return { graph, spatialIndex: tempSpatialIndex, largestComponent };
}

// FIX 3: Component-Aware Snapping
function findNearestNodeInComponent(lat, lon, spatialIndex, component) {
  let closest = null;
  let minDist = Infinity;

  // Scan all nodes, but ONLY pick ones in the Main Network
  for (const node of spatialIndex) {
    if (!component.has(node.id)) continue; 

    const d = haversineDistance(lat, lon, node.lat, node.lon);
    if (d < minDist) {
      minDist = d;
      closest = node;
    }
  }
  
  if (closest) closest.dist = minDist;
  return closest;
}

module.exports = { buildRoadGraph, findNearestNodeInComponent };