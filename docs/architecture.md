                 ┌────────────────────────────┐
                 │        User (Browser)      │
                 │  - Sees map & pins         │
                 │  - Reports incidents/help  │
                 │  - Requests safe route     │
                 └────────────┬───────────────┘
                              │ HTTP (REST)
                              ▼
                ┌──────────────────────────────┐
                │        React Client          │
                │   (Person B – Frontend)      │
                │                              │
                │  Components:                 │
                │   - MapView (React-Leaflet)  │
                │   - ReportModal              │
                │   - SafeRoutePanel           │
                │                              │
                │  API calls:                  │
                │   - GET/POST /api/incidents  │
                │   - GET       /api/shelters  │
                │   - POST      /api/routes/safe
                └───────────────┬──────────────┘
                                │
                                │ HTTP (REST)
                                ▼
        ┌────────────────────────────────────────────────┐
        │                 Express Server                  │
        │             (Persons A + C – Backend)           │
        │                                                │
        │ Routes:                                        │
        │  - /api/incidents   → incidentsRouter          │
        │  - /api/shelters    → sheltersRouter           │
        │  - /api/routes/safe → routesSafeRouter         │
        │                                                │
        │ Services:                                      │
        │  - MongoDB Service (A)                         │
        │      • save/find incidents                     │
        │      • get shelters                            │
        │  - Directions Service (C)                      │
        │      • call Google Directions API              │
        │      • return candidate routes                 │
        │  - FloodRisk Service (C)                       │
        │      • load flood_zones.geojson                │
        │      • isPointInFloodZone(lat, lon)            │
        │  - Scoring Service (C)                         │
        │      • sample route points                     │
        │      • query nearby incidents                  │
        │      • combine with flood risk → dangerScore   │
        │  - Gemini Service (C)                          │
        │      • choose safest route from summaries      │
        │      • generate explanation text               │
        └───────────────┬────────────────────────────────┘
                        │
                        │ MongoDB driver
                        ▼
              ┌───────────────────────────┐
              │      MongoDB Atlas        │
              │   (Person A – Data)       │
              │                           │
              │ Collections:              │
              │  - incidents              │
              │  - shelters               │
              │  - region tiles (optional)│
              └───────────────────────────┘


         ┌─────────────────────┐          ┌─────────────────────────┐
         │ Google Directions   │  HTTPS   │   Gemini API            │
         │    API              │◀────────▶│  (Vertex / Gemini)      │
         │ (Person B→C usage)  │          │ (Person C – AI logic)   │
         └─────────────────────┘          └─────────────────────────┘

                ┌──────────────────────────────┐
                │ Flood Zones Data (GeoJSON)   │
                │  - LA County / Leeds layers  │
                │  - Loaded by FloodRiskSvc    │
                └──────────────────────────────┘
