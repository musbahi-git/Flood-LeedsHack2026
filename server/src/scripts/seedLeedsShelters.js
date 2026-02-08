
const mongoose = require('mongoose');
const Shelter = require('../models/Shelter');
require('dotenv').config();

// Replace this array with real Leeds shelter data
const shelters = [
  {
    name: 'Leeds Civic Hall',
    location: { type: 'Point', coordinates: [-1.5491, 53.8008] },
    address: 'The Headrow, Leeds LS1 3AD',
    capacity: 200,
    currentOccupancy: 45,
    amenities: ['water', 'food', 'medical', 'charging'],
    isActive: true,
  },
  {
    name: 'Leeds Arena',
    location: { type: 'Point', coordinates: [-1.548, 53.7889] },
    address: 'Claypit Lane, Leeds LS2 8BY',
    capacity: 500,
    currentOccupancy: 120,
    amenities: ['water', 'food', 'beds', 'wifi'],
    isActive: true,
  },
  {
    name: 'University of Leeds Sports Centre',
    location: { type: 'Point', coordinates: [-1.5553, 53.8067] },
    address: 'Woodhouse Lane, Leeds LS2 9JT',
    capacity: 300,
    currentOccupancy: 80,
    amenities: ['water', 'food', 'showers'],
    isActive: true,
  },
  {
    name: 'Kirkstall Leisure Centre',
    location: { type: 'Point', coordinates: [-1.6012, 53.8156] },
    address: 'Kirkstall Lane, Leeds LS5 3BE',
    capacity: 150,
    currentOccupancy: 35,
    amenities: ['water', 'food', 'medical'],
    isActive: true,
  },
  {
    name: 'St George’s Centre',
    location: { type: 'Point', coordinates: [-1.5486, 53.8002] },
    address: 'St George’s Rd, Leeds LS1 3DL',
    capacity: 100,
    currentOccupancy: 20,
    amenities: ['water', 'food', 'medical'],
    isActive: true,
  },
  {
    name: 'Holt Park Active',
    location: { type: 'Point', coordinates: [-1.6082, 53.8542] },
    address: 'Holt Rd, Leeds LS16 7QA',
    capacity: 120,
    currentOccupancy: 30,
    amenities: ['water', 'food', 'showers'],
    isActive: true,
  },
  {
    name: 'John Charles Centre for Sport',
    location: { type: 'Point', coordinates: [-1.5537, 53.7692] },
    address: 'Middleton Grove, Leeds LS11 5DJ',
    capacity: 400,
    currentOccupancy: 60,
    amenities: ['water', 'food', 'beds', 'showers'],
    isActive: true,
  },
  {
    name: 'Armley Leisure Centre',
    location: { type: 'Point', coordinates: [-1.5982, 53.8001] },
    address: 'Carr Crofts, Leeds LS12 3HB',
    capacity: 180,
    currentOccupancy: 50,
    amenities: ['water', 'food', 'medical'],
    isActive: true,
  },
  {
    name: 'Fearnville Leisure Centre',
    location: { type: 'Point', coordinates: [-1.4847, 53.8202] },
    address: 'Oakwood Ln, Leeds LS8 3LF',
    capacity: 160,
    currentOccupancy: 40,
    amenities: ['water', 'food', 'showers'],
    isActive: true,
  },
  {
    name: 'Morley Leisure Centre',
    location: { type: 'Point', coordinates: [-1.6017, 53.7442] },
    address: 'Queen St, Morley, Leeds LS27 9JP',
    capacity: 140,
    currentOccupancy: 25,
    amenities: ['water', 'food', 'medical'],
    isActive: true,
  },
];

async function seedLeedsShelters(calledFromServer = false) {
  try {
    if (!calledFromServer) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('Connected to MongoDB');
    }

    // Clear existing shelters
    await Shelter.deleteMany();
    console.log('Cleared existing shelters');

    // Insert real Leeds shelters
    await Shelter.insertMany(shelters);
    console.log(`Seeded ${shelters.length} Leeds shelters successfully`);

    if (!calledFromServer) {
      process.exit(0);
    }
  } catch (error) {
    console.error('Seed error:', error);
    if (!calledFromServer) {
      process.exit(1);
    }
  }
}

// If run directly, seed
if (require.main === module) {
  seedLeedsShelters();
}

module.exports = seedLeedsShelters;
