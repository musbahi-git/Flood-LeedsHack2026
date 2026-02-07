const express = require('express');
const Shelter = require('../models/Shelter');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const shelters = await Shelter.find();
    
    // If no shelters in DB, seed with default data
    if (shelters.length === 0) {
      const defaultShelters = [
        {
          name: 'Leeds Civic Hall',
          location: { type: 'Point', coordinates: [-1.5491, 53.8008] }
        },
        {
          name: 'University of Leeds Sports Centre',
          location: { type: 'Point', coordinates: [-1.5553, 53.8067] }
        },
        {
          name: 'Leeds Arena',
          location: { type: 'Point', coordinates: [-1.5480, 53.7889] }
        },
        {
          name: 'Kirkstall Leisure Centre',
          location: { type: 'Point', coordinates: [-1.6012, 53.8156] }
        }
      ];
      
      await Shelter.insertMany(defaultShelters);
      const newShelters = await Shelter.find();
      return res.json(newShelters);
    }
    
    res.json(shelters);
  } catch (error) {
    console.error('Error fetching shelters:', error);
    res.status(500).json({ error: 'Failed to fetch shelters' });
  }
});

module.exports = router;