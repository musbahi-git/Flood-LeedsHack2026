// seedIncidents.js
// Script to seed the database with sample incidents for development/testing

const mongoose = require('mongoose');
const Incident = require('../models/Incident');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI not set in environment variables.');
  process.exit(1);
}

const sampleIncidents = [
  {
    type: 'incident',
    category: 'flood',
    description: 'Flooding on Main Street near the park. Water is about knee-high.',
    userId: 'user-1',
    location: { type: 'Point', coordinates: [-1.5491, 53.8008] },
    severity: 'high',
    status: 'active',
  },
  {
    type: 'need_help',
    category: 'medical',
    description: 'Elderly person needs help getting to shelter. Unable to walk far.',
    userId: 'user-2',
    location: { type: 'Point', coordinates: [-1.545, 53.8025] },
    severity: 'medium',
    status: 'active',
  },
  {
    type: 'can_help',
    category: 'supplies',
    description: 'I have spare bottled water and blankets. Can deliver within 2km.',
    userId: 'user-3',
    location: { type: 'Point', coordinates: [-1.552, 53.798] },
    severity: 'low',
    status: 'active',
  },
  {
    type: 'incident',
    category: 'power',
    description: 'Power lines down on Oak Avenue. Area blocked off.',
    userId: 'user-4',
    location: { type: 'Point', coordinates: [-1.54, 53.805] },
    severity: 'critical',
    status: 'active',
  },
  {
    type: 'need_help',
    category: 'travel',
    description: 'Car stuck in flood water on Bridge Road. Need tow or lift.',
    userId: 'user-5',
    location: { type: 'Point', coordinates: [-1.555, 53.796] },
    severity: 'medium',
    status: 'active',
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    await Incident.deleteMany({});
    await Incident.insertMany(sampleIncidents);
    console.log('Sample incidents seeded successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
