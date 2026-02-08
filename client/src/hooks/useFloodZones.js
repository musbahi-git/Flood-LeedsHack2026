import { useEffect, useState } from 'react';

// ...existing icon and helper code...


export function useFloodZones() {
  const [floodZones, setFloodZones] = useState(null);
  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_URL || '';
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
    const apiBase = import.meta.env.VITE_API_URL || '';
    const url = apiBase.replace(/\/$/, '') + '/historical_flood_zones';
    fetch(url)
      .then(res => res.json())
      .then(setHistoricalFloodZones)
      .catch(() => setHistoricalFloodZones(null));
  }, []);
  return historicalFloodZones;
}
