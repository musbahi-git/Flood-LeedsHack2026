require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const http = require('http'); // Changed from 'node:http' for better compatibility
const { Server } = require('socket.io');

// Import routers
const incidentsRouter = require('./routes/incidents');
const sheltersRouter = require('./routes/shelters');
const routesSafeRouter = require('./routes/routesSafe'); 
const usersRouter = require('./routes/users');
const floodZonesRouter = require('./routes/floodZones');
const Shelter = require('./models/Shelter');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(cors({
  origin: true, // Allow all origins for the demo to prevent CORS errors
  credentials: true
}));
app.use(express.json());

// --- DEBUG LOGGER (See exactly what is being requested) ---
app.use((req, res, next) => {
  console.log(`📡 Incoming Request: ${req.method} ${req.url}`);
  next();
});

// --- MOUNT ROUTERS (The Fix) ---
// We mount these on TWO paths so both /api/... and /... work perfectly.

// 1. Safe Routes
app.use('/routes/safe', routesSafeRouter);      // Matches frontend
app.use('/api/routes/safe', routesSafeRouter);  // Backup

// 2. Incidents
app.use('/incidents', incidentsRouter);
app.use('/api/incidents', incidentsRouter);

// 3. Shelters
app.use('/shelters', sheltersRouter);
app.use('/api/shelters', sheltersRouter);

// 4. Users
app.use('/users', usersRouter);
app.use('/api/users', usersRouter);

// 5. Flood Zones
app.use('/', floodZonesRouter);     // For base paths
app.use('/api', floodZonesRouter);  // For api paths

// --- Health Check ---
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.get('/', (req, res) => res.json({ name: 'FloodSafe API', status: 'Running' }));


// --- Start Server Logic ---
async function startServer() {
  try {
    console.log('Starting FloodSafe server...');
    
    // Connect to DB
    if (connectDB) {
        await connectDB(); 
        console.log('MongoDB connected.');
    }

    // Create HTTP server
    const server = http.createServer(app);
    
    // Setup Socket.IO
    const io = new Server(server, {
      cors: {
        origin: "*", 
        methods: ["GET", "POST"]
      }
    });

    app.set('io', io);

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);
    });

    // Start Listening
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`   - Try: http://localhost:${PORT}/routes/safe`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();