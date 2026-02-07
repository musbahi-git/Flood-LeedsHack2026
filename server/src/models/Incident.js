const mongoose = require('mongoose');

/**
 * Incident Model
 * Represents incidents, help requests, and help offers on the map.
 * 
 * @typedef {Object} Incident
 * @property {string} type - Type of report: "incident" | "need_help" | "can_help"
 * @property {string} category - Category: "flood", "power", "travel", "medical", "supplies", "other"
 * @property {string} description - User description of the incident
 * @property {string} userId - User identifier (default: 'anonymous')
 * @property {Object} location - GeoJSON Point with coordinates [lon, lat]
 * @property {string} severity - Severity level: "low" | "medium" | "high" | "critical"
 * @property {string} status - Current status: "active" | "resolved" | "verified"
 * @property {Date} createdAt - Timestamp when incident was created
 * @property {Date} expiresAt - When incident auto-expires (default: 24h from creation)
 */

const incidentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['incident', 'need_help', 'can_help'],
    required: true,
  },
  category: {
    type: String,
    enum: ['flood', 'power', 'travel', 'medical', 'supplies', 'other'],
    default: 'other',
  },
  description: {
    type: String,
    default: '',
  },
  userId: {              
    type: String,     
    index: true,         
    default: 'anonymous'
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
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
  },
  status: {
    type: String,
    enum: ['active', 'resolved', 'verified'],
    default: 'active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
  },
});

// Create 2dsphere index for geospatial queries
incidentSchema.index({ location: '2dsphere' });

// TTL index - MongoDB will auto-delete expired incidents
incidentSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Incident = mongoose.model('Incident', incidentSchema);

module.exports = Incident;