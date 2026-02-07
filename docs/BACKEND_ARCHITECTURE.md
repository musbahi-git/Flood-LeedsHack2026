# BACKEND_ARCHITECTURE.md

## Backend Architecture Brief

**Quick overview for the team**

---

## What Backend Does

**Stores & Serves Data:**
- Community incident reports (floods, road closures)
- User locations (for heatmap)
- Shelter locations

**Provides APIs:**
- Frontend fetches/posts data
- Routing logic connects here

---

## Architecture

```
Frontend (Person 2)
    ↓ HTTP requests
Express API (Person 1) ← You are here
    ↓
MongoDB Atlas (cloud database)

AI/Routing (Person 3) → Connects to Express API
```

---

## Tech Stack

- **Express.js** - Web server framework
- **MongoDB Atlas** - Cloud database (free tier)
- **Mongoose** - MongoDB object modeling
- **CORS** - Allow frontend to call API

---

## API Endpoints (What You're Building)

### 1. Incidents
```
POST /api/incidents
- Saves flood/road closure reports
- Stores: type, text, location (lat/lng), timestamp

GET /api/incidents?lat=X&lng=Y&radius=5
- Returns incidents within radius
- Uses geospatial query (MongoDB 2dsphere index)
```

### 2. Shelters
```
GET /api/shelters
- Returns list of safe shelters
- From hardcoded JSON file (no database needed)
```

### 3. User Locations
```
POST /api/users/location
- Saves user's GPS position

GET /api/users/locations
- Returns all active user positions (last 30 min)
- For authority dashboard heatmap
```

### 4. Safe Routes
```
POST /api/routes/safe
- Endpoint shell that calls Person 3's routing logic
- You create endpoint, Person 3 provides calculateSafeRoute() function
- Returns: { route, riskLevel, explanation }
```

---

## Database Schema

### Incidents Collection
```javascript
{
  _id: ObjectId,
  type: "flood" | "road_closure" | "other",
  text: "Main Street flooded",
  location: {
    type: "Point",
    coordinates: [-1.5491, 53.8008]  // [lng, lat] - MongoDB format
  },
  timestamp: ISODate("2024-02-07T10:30:00Z"),
  userId: "user_123" (optional)
}
```

### User Locations Collection
```javascript
{
  _id: ObjectId,
  userId: "user_123",
  location: {
    type: "Point",
    coordinates: [-1.5491, 53.8008]
  },
  lastUpdated: ISODate("2024-02-07T10:35:00Z")
}
```

---

## Key Features

**Geospatial Queries:**
- MongoDB can find incidents within X km of a point
- Uses `$geoNear` or `$geoWithin` operators
- Requires 2dsphere index on location field

**Real-time Updates:**
- Frontend polls GET /api/incidents every 10 seconds
- OR use WebSockets (optional, probably skip for hackathon)

---

## Integration Points

### With Frontend (Person 2):
**What they need from you:**
- API base URL (e.g., `http://localhost:5000`)
- Endpoint documentation
- Response formats (JSON examples)

**What you need from them:**
- Nothing! They just call your API

### With AI/Routing (Person 3):
**What they need from you:**
- POST /api/routes/safe endpoint created

**What you need from them:**
- `calculateSafeRoute(userLat, userLng, destLat, destLng)` function
- Import it and call it from your endpoint

---

## File Structure

```
flood-backend/
├── server.js              # Main Express app
├── models/
│   ├── Incident.js        # Mongoose schema
│   └── UserLocation.js    # Mongoose schema
├── routes/
│   ├── incidents.js       # Incident endpoints
│   ├── users.js           # User location endpoints
│   └── routing.js         # Safe route endpoint
├── data/
│   └── shelters.json      # Hardcoded shelter data
├── .env                   # MongoDB connection string
└── package.json
```

---

## Deployment (Optional)

**If time allows:**
- Deploy to Railway or Render (free tier)
- Update frontend to use deployed URL

**For demo:**
- Run locally is fine
- Share localhost URL with team on same network

---

## Timeline

**Hour 1:** MongoDB + Express setup, incidents endpoints working
**Hour 2:** Shelters + user locations + route shell
**Hour 3:** Integration testing with frontend
**Hour 4:** Polish + error handling

---

## Questions Your Team Might Ask

**Q: Can frontend call the API?**
A: Yes, CORS is enabled for all origins

**Q: Where is the flood zone data?**
A: Person 3 handles that, you just provide the endpoint

**Q: Do we need authentication?**
A: No, skip for hackathon (use optional userId)

**Q: What if MongoDB is slow?**
A: Geospatial queries with indexes are fast (<100ms)

---

## Quick Reference

**Start server:**
```bash
npm start
```

**Test endpoint:**
```bash
curl -X POST http://localhost:5000/api/incidents \
  -H "Content-Type: application/json" \
  -d '{"type":"flood","text":"Test","location":{"lat":53.8,"lng":-1.5}}'
```

**Check MongoDB:**
- Go to MongoDB Atlas dashboard
- Browse collections
- View documents

---

**That's it! You're building the data layer that powers the whole app.** 💪
