const mongoose = require('mongoose');

/**
 * RegionTile Model (Placeholder)
 * Represents precomputed risk tiles for optional performance optimization.
 * 
 * TODO: Person C - Implement tile-based flood risk caching if needed.
 * 
 * @typedef {Object} RegionTile
 * @property {string} regionId - Unique identifier for the tile
 * @property {Object} polygon - GeoJSON Polygon defining the tile boundaries
 * @property {number} floodRisk - Risk score from 0 (safe) to 1 (high risk)
 */

const regionTileSchema = new mongoose.Schema({
  regionId: {
    type: String,
    required: true,
    unique: true,
  },
  polygon: {
    type: {
      type: String,
      enum: ['Polygon'],
      required: true,
    },
    coordinates: {
      type: [[[Number]]], // Array of arrays of [lon, lat] pairs
      required: true,
    },
  },
  floodRisk: {
    type: Number,
    min: 0,
    max: 1,
    default: 0,
  },
});

// Create 2dsphere index for geospatial queries
regionTileSchema.index({ polygon: '2dsphere' });

const RegionTile = mongoose.model('RegionTile', regionTileSchema);

module.exports = RegionTile;
