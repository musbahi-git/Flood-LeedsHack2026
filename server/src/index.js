require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');


// Import routers
const incidentsRouter = require('./routes/incidents');
const sheltersRouter = require('./routes/shelters');
const routesSafeRouter = require('./routes/routesSafe');
const usersRouter = require('./routes/users');

// Auto-seed shelters if empty
const Shelter = require('./models/Shelter');
async function autoSeedShelters() {
  const count = await Shelter.countDocuments();
  if (count === 0) {
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
    await Shelter.insertMany(shelters);
    console.log(`Auto-seeded ${shelters.length} Leeds shelters.`);
  }
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: [
    'https://haven-leeds-hack2026.vercel.app',
    'https://haven-leeds-hack2026-musbahi.vercel.app',
    'https://haven-leeds-hack2026-git-main-musbahi.vercel.app',
    'https://haven-leeds-hack2026-64guzmq1s-musbahi.vercel.app',
    'https://affectionate-flexibility-production.up.railway.app',
    'http://localhost:5173',
  ],
  credentials: true
}));
app.use(express.json());

// Mount routers
app.use('/api/incidents', incidentsRouter);
app.use('/api/shelters', sheltersRouter);
app.use('/api/routes/safe', routesSafeRouter);
app.use('/api/users', usersRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'FloodSafe API',
    version: '1.0.0',
    endpoints: {
      incidents: '/api/incidents',
      shelters: '/api/shelters',
      safeRoute: '/api/routes/safe',
      health: '/api/health',
    },
  });
});

// --- WebSocket Setup ---
const http = require('node:http');
const { Server } = require('socket.io');


async function startServer() {
  try {
    console.log('Starting FloodSafe server...');
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');

    await connectDB();
    console.log('MongoDB connected.');
    await autoSeedShelters();

    // Create HTTP server and Socket.IO instance
    console.log('Setting up HTTP server and Socket.IO...');
    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: [
          'https://haven-leeds-hack2026.vercel.app',
          'https://haven-leeds-hack2026-musbahi.vercel.app',
          'https://haven-leeds-hack2026-git-main-musbahi.vercel.app',
          'https://haven-leeds-hack2026-64guzmq1s-musbahi.vercel.app',
          'https://affectionate-flexibility-production.up.railway.app',
          'http://localhost:5173',
        ],
        credentials: true
      }
    });

    // Attach io to app for access in routes
    app.set('io', io);

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    // Start listening
    console.log('Starting HTTP server...');
    server.listen(PORT, () => {
      console.log(`FloodSafe server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
