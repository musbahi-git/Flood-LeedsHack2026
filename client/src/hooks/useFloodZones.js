import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, GeoJSON, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// ...existing icon and helper code...

export function useFloodZones() {
  const [floodZones, setFloodZones] = useState(null);
  useEffect(() => {
    const url =
      window.location.hostname === 'haven-leeds-hack2026.vercel.app'
        ? 'https://affectionate-flexibility-production.up.railway.app/api/flood_zones'
        : '/api/flood_zones';
    fetch(url)
      .then(res => res.json())
      .then(setFloodZones)
      .catch(() => setFloodZones(null));
  }, []);
  return floodZones;
}

export function useHistoricalFloodZones() {
  const [historicalFloodZones, setHistoricalFloodZones] = useState(null);
  useEffect(() => {
    const url =
      window.location.hostname === 'haven-leeds-hack2026.vercel.app'
        ? 'https://affectionate-flexibility-production.up.railway.app/api/historical_flood_zones'
        : '/api/historical_flood_zones';
    fetch(url)
      .then(res => res.json())
      .then(setHistoricalFloodZones)
      .catch(() => setHistoricalFloodZones(null));
  }, []);
  return historicalFloodZones;
}
