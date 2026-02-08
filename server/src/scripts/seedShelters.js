const mongoose = require('mongoose');
const Shelter = require('../models/Shelter');
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing shelters
    await Shelter.deleteMany();
    console.log('Cleared existing shelters');

    // Insert shelters with complete data
    const shelters = await Shelter.insertMany([
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
        location: { type: 'Point', coordinates: [-1.5480, 53.7889] },
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
    ]);

    console.log(`Seeded ${shelters.length} shelters successfully`);
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();