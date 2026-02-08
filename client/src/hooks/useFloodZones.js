import { useEffect, useState } from 'react';


// Helper to get API base URL in a Jest-safe way
function getApiBase() {
  // Use VITE_API_URL if set, else fallback to '/api'
  return (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
}




export function useFloodZones() {
  const [floodZones, setFloodZones] = useState(null);
  useEffect(() => {
    const apiBase = getApiBase();
    const url = apiBase + '/flood_zones';
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
    const apiBase = getApiBase();
    const url = apiBase + '/historical_flood_zones';
    fetch(url)
      .then(res => res.json())
      .then(setHistoricalFloodZones)
      .catch(() => setHistoricalFloodZones(null));
  }, []);
  return historicalFloodZones;
}
