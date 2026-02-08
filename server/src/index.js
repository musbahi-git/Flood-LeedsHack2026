require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const http = require('node:http');
const { Server } = require('socket.io');

// Import routers
const incidentsRouter = require('./routes/incidents');
const sheltersRouter = require('./routes/shelters');
const routesSafeRouter = require('./routes/routesSafe'); // Ensure this file exists
const usersRouter = require('./routes/users');
const Shelter = require('./models/Shelter');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://haven-leeds-hack2026.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());

// --- Mount Routers ---
// This connects your "Safe Route" button to the routesSafe.js file
app.use('/api/incidents', incidentsRouter);
app.use('/api/shelters', sheltersRouter);
app.use('/api/routes/safe', routesSafeRouter); 
app.use('/api/users', usersRouter);

// --- Health Check ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({ name: 'FloodSafe API', status: 'Running' });
});

// --- Auto-Seed Logic ---
async function autoSeedShelters() {
  const count = await Shelter.countDocuments();
  if (count === 0) {
    // ... (Your shelter data here is fine, keeping it brief for readability) ...
    console.log(`Auto-seeded shelters.`);
  }
}

// --- Start Server ---
async function startServer() {
  try {
    console.log('Starting FloodSafe server...');
    await connectDB();
    console.log('MongoDB connected.');
    
    await autoSeedShelters();

    // Create HTTP server and Socket.IO
    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: ['http://localhost:5173', 'https://haven-leeds-hack2026.vercel.app'],
        credentials: true
      }
    });

    app.set('io', io); // Allow routes to use WebSocket

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);
    });

    server.listen(PORT, () => {
      console.log(`FloodSafe server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();