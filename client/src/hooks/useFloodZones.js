import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, GeoJSON, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// ...existing icon and helper code...

export function useFloodZones() {
  const [floodZones, setFloodZones] = useState(null);
  useEffect(() => {
    fetch('/api/flood_zones')
      .then(res => res.json())
      .then(setFloodZones)
      .catch(() => setFloodZones(null));
  }, []);
  return floodZones;
}

export function useHistoricalFloodZones() {
  const [historicalFloodZones, setHistoricalFloodZones] = useState(null);
  useEffect(() => {
    fetch('/api/historical_flood_zones')
      .then(res => res.json())
      .then(setHistoricalFloodZones)
      .catch(() => setHistoricalFloodZones(null));
  }, []);
  return historicalFloodZones;
}
