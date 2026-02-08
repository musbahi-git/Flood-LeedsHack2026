const express = require('express');
const UserLocation = require('../models/UserLocation');

const router = express.Router();

// Update user location
router.post('/location', async (req, res) => {
  try {
    const { userId, lat, lon } = req.body;
    
    if (!userId || lat == null || lon == null) {
      return res.status(400).json({ error: 'userId, lat, and lon are required' });
    }

    const location = await UserLocation.findOneAndUpdate(
      { userId },
      {
        location: {
          type: 'Point',
          coordinates: [parseFloat(lon), parseFloat(lat)]
        },
        lastUpdated: new Date()
      },
      { upsert: true, new: true }
    );

    res.json(location);
  } catch (error) {
    console.error('Error updating user location:', error);
    res.status(500).json({ error: 'Failed to update location' });
  }
});

// Get all active user locations (last 30 min)
router.get('/locations', async (req, res) => {
  try {
    const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000);
    const locations = await UserLocation.find({
      lastUpdated: { $gte: thirtyMinAgo }
    });
    
    res.json(locations);
  } catch (error) {
    console.error('Error fetching user locations:', error);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});

module.exports = router;