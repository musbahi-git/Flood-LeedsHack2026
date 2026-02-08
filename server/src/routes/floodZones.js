const express = require('express');
const path = require('node:path');
const router = express.Router();

// Serve flood_zones.geojson
router.get('/flood_zones', (req, res) => {
  const filePath = path.join(__dirname, '../data/flood_zones.geojson');
  console.log('Serving flood_zones.geojson:', filePath);
  res.setHeader('Content-Type', 'application/json');
  res.sendFile(filePath, (err) => {
    if (err && !res.headersSent) {
      console.error('Error serving flood_zones.geojson:', err);
      res.status(500).send('Failed to serve flood zones');
    }
  });
});

// Serve historical_flood_zones.geojson
router.get('/historical_flood_zones', (req, res) => {
  const filePath = path.join(__dirname, '../data/historical_flood_zones.geojson');
  console.log('Serving historical_flood_zones.geojson:', filePath);
  res.setHeader('Content-Type', 'application/json');
  res.sendFile(filePath, (err) => {
    if (err && !res.headersSent) {
      console.error('Error serving historical_flood_zones.geojson:', err);
      res.status(500).send('Failed to serve historical flood zones');
    }
  });
});

module.exports = router;
