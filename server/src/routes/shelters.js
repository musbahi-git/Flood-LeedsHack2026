const express = require('express');
const Shelter = require('../models/Shelter');

const router = express.Router();

/**
 * GET /api/shelters
 */
router.get('/', async (req, res) => {
  try {
    const shelters = await Shelter.find();
    res.json(shelters);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch shelters' });
  }
});

module.exports = router;
