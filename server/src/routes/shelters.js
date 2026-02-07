const express = require('express');
// const Shelter = require('../models/Shelter');

const router = express.Router();

/**
 * GET /api/shelters
 * Retrieve all shelters.
 * 
 * TODO: Person A - Replace with database query from Shelter model.
 * For now, returns static dummy data.
 */
router.get('/', async (req, res) => {
  try {
    // TODO: Replace with actual database query
    // const shelters = await Shelter.find();

    // Dummy shelters for initial development (Leeds area)
    const shelters = [
      {
        _id: 'shelter-1',
        name: 'Leeds Civic Hall',
        location: {
          type: 'Point',
          coordinates: [-1.5491, 53.8008],
        },
      },
      {
        _id: 'shelter-2',
        name: 'University of Leeds Sports Centre',
        location: {
          type: 'Point',
          coordinates: [-1.5553, 53.8067],
        },
      },
      {
        _id: 'shelter-3',
        name: 'Leeds Arena',
        location: {
          type: 'Point',
          coordinates: [-1.5480, 53.7889],
        },
      },
      {
        _id: 'shelter-4',
        name: 'Kirkstall Leisure Centre',
        location: {
          type: 'Point',
          coordinates: [-1.6012, 53.8156],
        },
      },
    ];

    res.json(shelters);
  } catch (error) {
    console.error('Error fetching shelters:', error);
    res.status(500).json({ error: 'Failed to fetch shelters' });
  }
});

module.exports = router;
