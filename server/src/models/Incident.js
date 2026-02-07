const mongoose = require('mongoose');

/**
 * Incident Model
 * Represents incidents, help requests, and help offers on the map.
 * 
 * @typedef {Object} Incident
 * @property {string} type - Type of report: "incident" | "need_help" | "can_help"
 * @property {string} category - Category: "flood", "power", "travel", "other"
 * @property {string} description - User description of the incident
 * @property {Object} location - GeoJSON Point with coordinates [lon, lat]
 * @property {Date} createdAt - Timestamp when incident was created
 */

const incidentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['incident', 'need_help', 'can_help'],
    required: true,
  },
  category: {
    type: String,
    enum: ['flood', 'power', 'travel', 'other'],
    default: 'other',
  },
  description: {
    type: String,
    default: '',
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create 2dsphere index for geospatial queries
incidentSchema.index({ location: '2dsphere' });

const Incident = mongoose.model('Incident', incidentSchema);

module.exports = Incident;
