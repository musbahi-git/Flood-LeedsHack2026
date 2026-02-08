import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, GeoJSON, useMap, useMapEvents } from 'react-leaflet';
import { useFloodZones, useHistoricalFloodZones } from '../hooks/useFloodZones';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Inline SVG marker icons (HTML strings for Leaflet divIcon)
const svgMarkers = {
  incident: `<svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  need_help: `<svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/><path d="M12 5.67V21.23"/></svg>`,
  can_help: `<svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  shelter: `<svg viewBox="0 0 24 24" fill="none" width="16" height="16" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12l9-9 9 9"/><path d="M5 10v10h14V10"/><path d="M9 21v-6h6v6"/></svg>`,
};

const createSvgIcon = (color, svgHtml) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="marker-pin" style="background-color: ${color};">
        <span class="marker-svg">${svgHtml}</span>
      </div>
      <div class="marker-shadow"></div>
    `,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -36],
  });
};

// User location icon
const userLocationIcon = L.divIcon({
  className: 'user-location-marker',
  html: `
    <div class="user-location-dot">
      <div class="user-location-pulse"></div>
    </div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Incident type icons with colors
const incidentIcons = {
  incident: createSvgIcon('#ef4444', svgMarkers.incident),
  need_help: createSvgIcon('#f97316', svgMarkers.need_help),
  can_help: createSvgIcon('#22c55e', svgMarkers.can_help),
};

// Shelter icon
const shelterIcon = createSvgIcon('#3b82f6', svgMarkers.shelter);

/**
 * Component to handle map clicks
 */
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      if (onMapClick) {
        onMapClick(e.latlng);
      }
    },
  });
  return null;
}

MapClickHandler.propTypes = {
  onMapClick: PropTypes.func,
};

/**
 * Component to center map on user location
 */
function LocationMarker({ location }) {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.flyTo([location.lat, location.lon], map.getZoom(), {
        duration: 1,
      });
    }
  }, [location, map]);

  if (!location) return null;

  return (
    <>
      <Marker position={[location.lat, location.lon]} icon={userLocationIcon}>
        <Popup>
          <div className="location-popup">
            <strong>Your Location</strong>
            <p>{location.lat.toFixed(5)}, {location.lon.toFixed(5)}</p>
          </div>
        </Popup>
      </Marker>
      {/* Accuracy circle */}
      {location.accuracy && (
        <Circle
          center={[location.lat, location.lon]}
          radius={location.accuracy}
          pathOptions={{
            color: '#3b82f6',
            fillColor: '#3b82f6',
            fillOpacity: 0.1,
            weight: 1,
          }}
        />
      )}
    </>
  );
}

LocationMarker.propTypes = {
  location: PropTypes.shape({
    lat: PropTypes.number,
    lon: PropTypes.number,
    accuracy: PropTypes.number,
  }),
};

/**
 * Format relative time
 */
function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

/**
 * MapView Component
 * Displays the interactive map with incidents, routes, and user location.
 */
function MapView({
  incidents = [],
  routes = [],
  chosenRouteId = null,
  userLocation = null,
  shelters = [],
  onMapClick = null,
  currentUserId = null,
}) {
  // Load flood zones and historical flood zones
  const floodZones = useFloodZones();
  const historicalFloodZones = useHistoricalFloodZones();
  console.log('Flood Zones:', floodZones);
  console.log('Historical Flood Zones:', historicalFloodZones);

  // Default center: Leeds, UK
  const defaultCenter = [53.8008, -1.5491];
  const defaultZoom = 13;

  // Convert route coordinates to Leaflet format
  const formatRouteCoords = (coords) => {
    if (!coords || !Array.isArray(coords)) return [];
    return coords.map(coord => {
      // Handle both array format [lon, lat] and object format {lat, lon}
      if (Array.isArray(coord)) {
        return [coord[1], coord[0]]; // [lat, lon]
      }
      return [coord.lat, coord.lon];
    });
  };

  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      className="map-container"
      zoomControl={false}
    >
      {/* Flood Zones Overlay */}
      {floodZones && (
        <GeoJSON data={floodZones} style={{
          color: '#ef4444', // red border
          fillColor: '#ef4444', // red fill
          fillOpacity: 0.35,
          weight: 2,
        }} />
      )}
      {/* Historical Flood Zones Overlay - lighter, textured */}
      {historicalFloodZones && (
        <GeoJSON data={historicalFloodZones} style={{
          color: '#f59e42',
          fillColor: '#f59e42',
                fillOpacity: '0.1',
          weight: 1,
          dashArray: '8, 4',
        }} />
      )}
      {/* Base tile layer - Dark theme */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Map click handler */}
      {onMapClick && <MapClickHandler onMapClick={onMapClick} />}

      {/* User location marker */}
      <LocationMarker location={userLocation} />

      {/* Render all routes (non-chosen in grey) */}
      {routes.map((route) => {
        const isChosen = route.id === chosenRouteId;
        const positions = formatRouteCoords(route.coordinates);

        if (positions.length === 0) return null;

        return (
          <Polyline
            key={`route-${route.id}`}
            positions={positions}
            pathOptions={{
              color: isChosen ? '#22c55e' : '#9ca3af',
              weight: isChosen ? 6 : 3,
              opacity: isChosen ? 0.9 : 0.5,
              dashArray: isChosen ? null : '10, 10',
            }}
          >
            <Popup>
              <div className="route-popup">
                <strong>{isChosen ? 'Recommended Route' : 'Alternative Route'}</strong>
                {route.dangerScore !== undefined && (
                  <p>Danger Score: {(route.dangerScore * 100).toFixed(0)}%</p>
                )}
              </div>
            </Popup>
          </Polyline>
        );
      })}

      {/* Render incident markers */}
      {(Array.isArray(incidents) ? incidents : []).map((incident) => {
        // Handle different location formats
        let lat, lon;
        if (incident.location?.coordinates) {
          [lon, lat] = incident.location.coordinates;
        } else if (incident.lat && incident.lon) {
          lat = incident.lat;
          lon = incident.lon;
        } else {
          return null;
        }

        const icon = incidentIcons[incident.type] || incidentIcons.incident;
        const typeLabels = {
          incident: 'Incident',
          need_help: 'Needs Help',
          can_help: 'Can Help',
        };

        // Check if this incident belongs to the current user
        const isOwnIncident = currentUserId && incident.userId === currentUserId;

        return (
          <Marker
            key={incident._id || incident.id}
            position={[lat, lon]}
            icon={icon}
          >
            <Popup>
              <div className="incident-popup">
                <div className="popup-header">
                  <strong>
                    {typeLabels[incident.type] || incident.type}
                    {isOwnIncident && <span className="own-pin-badge"> (You)</span>}
                  </strong>
                  <span className="popup-time">{formatRelativeTime(incident.createdAt)}</span>
                </div>
                <div className="popup-category">{incident.category}</div>
                <p className="popup-description">{incident.description || 'No description provided'}</p>
              </div>
            </Popup>
          </Marker>
        );
      })}

      {/* Render shelter markers */}
      {shelters.map((shelter) => {
        let lat, lon;
        if (shelter.location?.coordinates) {
          [lon, lat] = shelter.location.coordinates;
        } else if (shelter.lat && shelter.lon) {
          lat = shelter.lat;
          lon = shelter.lon;
        } else {
          return null;
        }

        return (
          <Marker
            key={shelter._id || shelter.id}
            position={[lat, lon]}
            icon={shelterIcon}
          >
            <Popup>
              <div className="shelter-popup">
                <strong>🏠 {shelter.name}</strong>
                <p>{shelter.address}</p>
                <p><b>Capacity:</b> {shelter.capacity} | <b>Current:</b> {shelter.currentOccupancy}</p>
                <p><b>Amenities:</b> {Array.isArray(shelter.amenities) ? shelter.amenities.join(', ') : 'N/A'}</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

MapView.propTypes = {
  incidents: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    id: PropTypes.string,
    location: PropTypes.shape({
      coordinates: PropTypes.arrayOf(PropTypes.number),
    }),
    lat: PropTypes.number,
    lon: PropTypes.number,
    type: PropTypes.string,
    category: PropTypes.string,
    description: PropTypes.string,
    createdAt: PropTypes.string,
    userId: PropTypes.string,
  })),
  routes: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    coordinates: PropTypes.array,
    dangerScore: PropTypes.number,
  })),
  chosenRouteId: PropTypes.string,
  userLocation: PropTypes.shape({
    lat: PropTypes.number,
    lon: PropTypes.number,
    accuracy: PropTypes.number,
  }),
  shelters: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    location: PropTypes.shape({
      coordinates: PropTypes.arrayOf(PropTypes.number),
    }),
  })),
  onMapClick: PropTypes.func,
  currentUserId: PropTypes.string,
};

export default MapView;
