const mongoose = require('mongoose');
const Shelter = require('../models/Shelter');
require('dotenv').config();

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);

  await Shelter.deleteMany();

  await Shelter.insertMany([
    {
      name: 'Leeds Civic Hall',
      location: { type: 'Point', coordinates: [-1.5491, 53.8008] },
    },
    {
      name: 'Leeds Arena',
      location: { type: 'Point', coordinates: [-1.5480, 53.7889] },
    },
    {
      name: 'Kirkstall Leisure Centre',
      location: { type: 'Point', coordinates: [-1.6012, 53.8156] },
    },
  ]);

  console.log('Shelters seeded');
  process.exit();
}

seed();
