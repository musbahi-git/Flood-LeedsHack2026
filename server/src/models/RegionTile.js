const mongoose = require('mongoose');

/**
 * RegionTile Model (Placeholder)
 * Represents precomputed risk tiles for optional performance optimization.
 * 
 * Implements tile-based flood risk caching (placeholder, extend as needed).
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

// Placeholder for caching logic (extend as needed)
regionTileSchema.statics.cacheFloodRisk = async function(regionId, polygon, floodRisk) {
  // Upsert a tile for the given region
  return this.findOneAndUpdate(
    { regionId },
    { polygon, floodRisk },
    { upsert: true, new: true }
  );
};
regionTileSchema.index({ polygon: '2dsphere' });

const RegionTile = mongoose.model('RegionTile', regionTileSchema);

module.exports = RegionTile;
