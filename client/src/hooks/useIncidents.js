import { useState, useEffect, useCallback } from 'react';
import { getIncidents } from '../api/incidentsApi';

/**
 * useIncidents Hook
 * Fetches and manages incident data.
 * 
 * TODO: Person B - Implement:
 * - Auto-polling every N seconds
 * - Geo-filtered fetching based on map bounds
 * - Optimistic updates
 */
export function useIncidents(params = {}) {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchIncidents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getIncidents(params);
      setIncidents(data);
    } catch (err) {
      console.error('Failed to fetch incidents:', err);
      setError(err.message || 'Failed to fetch incidents');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  // Fetch on mount and when params change
  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  // TODO: Person B - Add auto-polling
  // useEffect(() => {
  //   const interval = setInterval(fetchIncidents, 30000); // Every 30 seconds
  //   return () => clearInterval(interval);
  // }, [fetchIncidents]);

  return {
    incidents,
    loading,
    error,
    refetch: fetchIncidents,
  };
}

export default useIncidents;
