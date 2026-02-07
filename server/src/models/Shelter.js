const mongoose = require('mongoose');

/**
 * Shelter Model
 * Represents safe shelter locations on the map.
 * 
 * @typedef {Object} Shelter
 * @property {string} name - Name of the shelter
 * @property {Object} location - GeoJSON Point with coordinates [lon, lat]
 */

const shelterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
});

// Create 2dsphere index for geospatial queries
shelterSchema.index({ location: '2dsphere' });

const Shelter = mongoose.model('Shelter', shelterSchema);

module.exports = Shelter;
