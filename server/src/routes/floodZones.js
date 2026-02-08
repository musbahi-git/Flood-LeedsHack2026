const express = require('express');
const path = require('path');
const router = express.Router();

// Serve flood_zones.geojson
router.get('/flood_zones', (req, res) => {
  res.sendFile(path.join(__dirname, '../data/flood_zones.geojson'));
});

// Serve historical_flood_zones.geojson
router.get('/historical_flood_zones', (req, res) => {
  res.sendFile(path.join(__dirname, '../data/historical_flood_zones.geojson'));
});

module.exports = router;
