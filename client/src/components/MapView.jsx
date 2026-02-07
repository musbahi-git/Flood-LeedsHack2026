import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
// TODO: Person B - Add custom icons for different incident types
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom icons for different incident types
// TODO: Person B - Create proper custom marker icons
const createIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const incidentIcons = {
  incident: createIcon('#ef4444'), // red
  need_help: createIcon('#f97316'), // orange
  can_help: createIcon('#22c55e'), // green
};

/**
 * MapView Component
 * Displays the interactive map with incidents and routes.
 * 
 * TODO: Person B - Enhance with:
 * - Shelter markers
 * - Route polylines with danger score coloring
 * - Click-to-report functionality
 * - Current location marker
 */
function MapView({ incidents = [], selectedRoute = null, shelters = [] }) {
  // Default center: Leeds, UK
  const defaultCenter = [53.8008, -1.5491];
  const defaultZoom = 13;

  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      className="map-container"
      style={{ height: '100%', width: '100%' }}
    >
      {/* Base tile layer - OpenStreetMap */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Render incident markers */}
      {incidents.map((incident) => (
        <Marker
          key={incident._id}
          position={[
            incident.location.coordinates[1], // lat
            incident.location.coordinates[0], // lon
          ]}
          icon={incidentIcons[incident.type] || incidentIcons.incident}
        >
          <Popup>
            <div className="incident-popup">
              <strong>{incident.type.replace('_', ' ').toUpperCase()}</strong>
              <p><em>{incident.category}</em></p>
              <p>{incident.description || 'No description'}</p>
              <small>{new Date(incident.createdAt).toLocaleString()}</small>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Render selected route */}
      {selectedRoute && selectedRoute.coordinates && (
        <Polyline
          positions={selectedRoute.coordinates.map(coord => [coord[1], coord[0]])}
          color="#3b82f6"
          weight={5}
          opacity={0.8}
        />
      )}

      {/* TODO: Person B - Add shelter markers */}
      {/* TODO: Person B - Add current location marker */}
    </MapContainer>
  );
}

export default MapView;
