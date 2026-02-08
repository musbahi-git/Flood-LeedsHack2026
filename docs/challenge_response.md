Frontend: React (18.2.0), Vite (build tool), React-Leaflet/Leaflet (interactive map), Axios  in (API calls), Socket.io-client (real-time updates), Prop-types (type checking), uuid (unique IDs), Jest (testing), Babel (transpilation), ESBuild (bundling), Service Worker (PWA), CSS (styling).
Backend: Node.js, Express, custom services for flood risk, routing, elevation, and incident management. Data stored in GeoJSON files and models (MongoDB
Deployment: Vercel (frontend), Railway (backend).
Algorithms:

Safe Routing: Calculates safest path using flood risk, elevation, and incident data. Combines map graph traversal (A*) with real-time risk scoring.
Flood Risk Scoring: Aggregates flood zone, historical data, and elevation to assess route safety.
Incident Management: Real-time updates via WebSocket, stores and displays community-reported incidents.
Map Rendering: Uses React-Leaflet for dynamic display of routes, incidents, shelters, and flood zones.
Other Features:

Learning Panel: Educational resources for flood safety.
Report Modal: Allows users to report incidents directly on the map.
PWA: Offline support and push notifications.
Error Boundary: Robust error handling for UI stability.
Describe: The app is a community safety platform combining real-time incident reporting, AI-guided safe routing, and educational resources, using modern web technologies and custom algorithms for risk-aware navigation.