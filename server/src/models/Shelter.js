const mongoose = require('mongoose');

/**
 * Shelter Model
 * Represents safe shelter locations on the map.
 * 
 * @typedef {Object} Shelter
 * @property {string} name - Name of the shelter
 * @property {Object} location - GeoJSON Point with coordinates [lon, lat]
 * @property {string} address - Physical address
 * @property {number} capacity - Maximum capacity
 * @property {number} currentOccupancy - Current number of people
 * @property {Array<string>} amenities - Available amenities
 * @property {boolean} isActive - Whether shelter is currently accepting people
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
  address: {
    type: String,
    default: '',
  },
  capacity: {
    type: Number,
    default: 100,
    min: 0,
  },
  currentOccupancy: {
    type: Number,
    default: 0,
    min: 0,
  },
  amenities: {
    type: [String],
    default: [],
    // Examples: 'water', 'food', 'medical', 'charging', 'beds', 'wifi', 'showers'
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

// Create 2dsphere index for geospatial queries
shelterSchema.index({ location: '2dsphere' });

const Shelter = mongoose.model('Shelter', shelterSchema);

module.exports = Shelter;