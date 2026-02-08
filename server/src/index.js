require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routers
const incidentsRouter = require('./routes/incidents');
const sheltersRouter = require('./routes/shelters');
const routesSafeRouter = require('./routes/routesSafe');
const usersRouter = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: [
    'https://your-client.vercel.app', // Vercel client domain
    'http://localhost:5173', // Local dev
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


try {
  // Connect to MongoDB
  await connectDB();

  // Create HTTP server and Socket.IO instance
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: [
        'https://your-client.vercel.app',
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
  server.listen(PORT, () => {
    console.log(`FloodSafe server running on http://localhost:${PORT}`);
  });
} catch (error) {
  console.error('Failed to start server:', error);
  process.exit(1);
}
