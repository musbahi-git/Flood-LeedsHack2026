import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Inline SVG strings for map markers (white strokes on colored pins)
const svgIncident = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;

const svgNeedHelp = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;

const svgCanHelp = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;

const svgShelter = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;

// Custom marker icon factory
const createMarkerIcon = (color, svgHtml) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="marker-pin" style="background-color: ${color};">
        <span class="marker-emoji">${svgHtml}</span>
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
  incident: createMarkerIcon('#ef4444', svgIncident),
  need_help: createMarkerIcon('#f97316', svgNeedHelp),
  can_help: createMarkerIcon('#22c55e', svgCanHelp),
};

// Shelter icon
const shelterIcon = createMarkerIcon('#3b82f6', svgShelter);

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
            color: '#06b6d4',
            fillColor: '#06b6d4',
            fillOpacity: 0.1,
            weight: 1,
          }}
        />
      )}
    </>
  );
}

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
}) {
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

  // Type labels for popups
  const typeLabels = {
    incident: 'Incident',
    need_help: 'Needs Help',
    can_help: 'Can Help',
  };

  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      className="map-container"
      zoomControl={false}
    >
      {/* Base tile layer - OpenStreetMap */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
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
              color: isChosen ? '#10b981' : '#9ca3af',
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
      {incidents.map((incident) => {
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

        return (
          <Marker
            key={incident._id || incident.id}
            position={[lat, lon]}
            icon={icon}
          >
            <Popup>
              <div className="incident-popup">
                <div className="popup-header">
                  <strong>{typeLabels[incident.type] || incident.type}</strong>
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
                <strong>{shelter.name}</strong>
                <p>Safe shelter location</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

export default MapView;
