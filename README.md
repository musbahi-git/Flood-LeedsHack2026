# Haven - LeedsHack 2026

Haven is a web app that lets people:
- Post incidents and "I need help / I can help" pins on a live map.
- Request an AI-assisted safe route through safer zones to a nearby shelter, using community reports, flood-risk data, Google Directions, and Gemini.

## Structure

- `client/` - React frontend (map, report flow, safe-route button).
- `server/` - Express backend (incidents, shelters, routesSafe, MongoDB, Google Directions, Gemini).
- `docs/` - architecture docs and notes.

## Quick start

### Server
```bash
cd server
cp .env.example .env
# fill in MONGODB_URI, GEMINI_API_KEY, GOOGLE_MAPS_API_KEY
npm install
npm run dev
```

### Client
```bash
cd client
npm install
npm run dev
```
