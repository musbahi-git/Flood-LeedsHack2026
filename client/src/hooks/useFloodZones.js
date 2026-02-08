import { useEffect, useState } from 'react';


// Helper to get API base URL in a Jest-safe way
function getApiBase() {
  // Use process.env in test, otherwise '/api' (Vite will replace in build)
  if (typeof process !== 'undefined' && process.env && process.env.JEST_WORKER_ID) {
    return process.env.VITE_API_URL || '/api';
  }
  // In Vite, import.meta.env.VITE_API_URL will be replaced at build time
  return '/api';
}



export function useFloodZones() {
  const [floodZones, setFloodZones] = useState(null);
  useEffect(() => {
    const apiBase = getApiBase();
    const url = apiBase.replace(/\/$/, '') + '/flood_zones';
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
    const url = apiBase.replace(/\/$/, '') + '/historical_flood_zones';
    fetch(url)
      .then(res => res.json())
      .then(setHistoricalFloodZones)
      .catch(() => setHistoricalFloodZones(null));
  }, []);
  return historicalFloodZones;
}
