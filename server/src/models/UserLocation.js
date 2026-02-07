const mongoose = require('mongoose');

const userLocationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
    expires: 1800  // Auto-delete after 30 minutes
  }
});

userLocationSchema.index({ location: '2dsphere' });
userLocationSchema.index({ lastUpdated: -1 });

module.exports = mongoose.model('UserLocation', userLocationSchema);