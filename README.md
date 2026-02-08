<div align="center">

# 🌊 Haven

### Emergency Flood Response & Community Safety Platform

*From broadcast-only to peer-to-peer — a flood of information to save lives.*

[![Built at LeedsHack 2026](https://img.shields.io/badge/Built%20at-LeedsHack%202026-blue?style=for-the-badge&logo=hackclub&logoColor=white)](https://leedshack.com)
[![Theme: Systems Rebooted](https://img.shields.io/badge/Theme-Systems%20Rebooted-orange?style=for-the-badge)](https://leedshack.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

**Haven reboots emergency incident response.** Instead of relying on top-down broadcast alerts, Haven empowers communities to share real-time flood reports, find AI-guided safe routes, and coordinate help — all from a single live map.

[Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [Architecture](#-architecture) · [API Reference](#-api-reference) · [Team](#-team)

</div>

---

## 💡 The Problem

Flash floods kill people in the UK every year. When water levels rise, people don't know which roads are safe, where shelters are, or where their neighbours need help. Official alert systems are one-directional and slow. **The system is broken — we rebooted it.**

## ✨ Features

### 🗺️ Live Incident Map
Real-time community reporting on an interactive map. Report floods, road closures, power outages, and more — each pinned with GPS coordinates so everyone can see what's happening around them.

### 🆘 Help Coordination
Users can drop **"I need help"** or **"I can help"** pins on the map, turning passive observers into an active response network. See who needs assistance and who's nearby to provide it.

### 🛤️ AI-Powered Safe Routing
Request a safe route to the nearest shelter. Haven pulls multiple route options from Google Directions, cross-references them against live UK Environment Agency flood data and community reports, then uses **Gemini AI** to select and explain the safest path.

### 🏛️ Shelter Finder
Browse nearby emergency shelters with real-time capacity information. Know where to go — and whether there's room when you get there.

### 📊 Categorised Reporting
Incidents are tagged by category — flood, power outage, travel disruption, medical, supplies needed — making it easy to filter and prioritise during a crisis.

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology |
|:---:|:---|
| **Frontend** | React · Vite · Leaflet · OpenStreetMap |
| **Backend** | Node.js · Express · Mongoose |
| **Database** | MongoDB Atlas (Geospatial 2dsphere indexing) |
| **AI** | Google Gemini API |
| **Routing** | Google Maps Directions API |
| **Flood Data** | UK Environment Agency Real-Time Flood API |

</div>

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- npm
- MongoDB Atlas account (free tier works)
- API keys for Google Maps & Gemini

### Server

```bash
cd server
cp .env.example .env
```

Fill in your `.env`:
```env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/floodapp
GEMINI_API_KEY=your_gemini_key
GOOGLE_MAPS_API_KEY=your_google_maps_key
PORT=5000
```

```bash
npm install
npm run dev
```

### Client

```bash
cd client
npm install
npm run dev
```

The app will be running at `http://localhost:5173` with the API on `http://localhost:5000`.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    React Frontend                     │
│         Leaflet Map · Report Flow · Route UI          │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP / REST
┌──────────────────────▼──────────────────────────────┐
│                  Express API Server                    │
│                                                       │
│  /api/incidents   POST & GET incident reports         │
│  /api/shelters    GET shelters with capacity           │
│  /api/routes/safe POST → AI-guided safe routing       │
└───────┬───────────────┬──────────────┬──────────────┘
        │               │              │
   ┌────▼────┐   ┌──────▼─────┐  ┌────▼──────────────┐
   │ MongoDB │   │  Gemini AI │  │ External APIs      │
   │  Atlas  │   │   (Route   │  │ · Google Directions│
   │         │   │  Analysis) │  │ · EA Flood Data    │
   └─────────┘   └────────────┘  └────────────────────┘
```

---

## 📡 API Reference

### Incidents

| Method | Endpoint | Description |
|:---|:---|:---|
| `POST` | `/api/incidents` | Create a new incident report |
| `GET` | `/api/incidents` | Retrieve incidents (with geo/time/type filters) |

**POST body:**
```json
{
  "type": "incident | need_help | can_help",
  "category": "flood | power | travel | medical | supplies | other",
  "description": "Water rising on Main Street",
  "lat": 53.8008,
  "lon": -1.5491
}
```

**GET query params:** `lat`, `lon`, `radius` (metres), `sinceMinutes`, `type`, `category`

### Shelters

| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/api/shelters` | List all shelters with capacity data |

### Safe Routing

| Method | Endpoint | Description |
|:---|:---|:---|
| `POST` | `/api/routes/safe` | Get AI-analysed safe route to nearest shelter |

**POST body:**
```json
{
  "origin": { "lat": 53.8008, "lon": -1.5491 }
}
```

**Response:**
```json
{
  "routes": [{ "id": 1, "coordinates": [...], "dangerScore": 0.2 }],
  "chosenRouteId": 1,
  "explanation": "Route 1 avoids the flooded section on Kirkstall Road..."
}
```

---

## 📁 Project Structure

```
Haven/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # MapView, ReportModal, SafeRoutePanel, IncidentList
│   │   ├── hooks/           # useIncidents, useUserLocation
│   │   ├── api/             # incidentsApi, routesApi
│   │   └── styles/          # main.css
│   └── package.json
│
├── server/                  # Express backend
│   ├── src/
│   │   ├── models/          # Incident.js (Mongoose + 2dsphere)
│   │   ├── routes/          # incidents.js, shelters.js, routesSafe.js
│   │   ├── data/            # shelters.json, flood_zones.geojson
│   │   └── server.js        # Entry point
│   └── package.json
│
├── docs/                    # Architecture docs & notes
└── README.md
```

---

## 👥 Team

Built in **21 hours** at **LeedsHack 2026** by a team of 3:

| Role | Focus Area |
|:---|:---|
| **Backend Developer** | Express API, MongoDB Atlas, database design & integration |
| **Frontend Developer** | React UI, Leaflet map, user experience |
| **AI / Routing Specialist** | Gemini integration, safe route analysis, flood data |

---

## 🔮 What's Next

- **Flood prediction** using historical data and ML models
- **Authority dashboard** with user location heatmaps and AI situation summaries
- **Multi-language support** via Gemini translation for diverse communities
- **Push notifications** for real-time flood alerts in your area
- **Mobile-native app** for offline-first emergency access

---

<div align="center">

*Built with urgency at LeedsHack 2026 🏗️*

**Because when the water rises, every second counts.**

</div>
