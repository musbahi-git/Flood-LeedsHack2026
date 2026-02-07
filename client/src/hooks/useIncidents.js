import { useState, useEffect, useCallback, useRef } from 'react';
import { getIncidents } from '../api/incidentsApi';

// Polling interval in milliseconds (15 seconds)
const POLL_INTERVAL = 15000;

/**
 * useIncidents Hook
 * Fetches and manages incident data with automatic polling.
 * 
 * @param {Object} params - Optional filter parameters
 * @param {boolean} enablePolling - Whether to enable automatic polling (default: true)
 * @returns {Object} { incidents, loading, error, refresh }
 */
export function useIncidents(params = {}, enablePolling = true) {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pollTimeoutRef = useRef(null);
  const isMountedRef = useRef(true);

  const fetchIncidents = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    setError(null);

    try {
      const data = await getIncidents(params);
      if (isMountedRef.current) {
        setIncidents(data);
      }
    } catch (err) {
      console.error('[useIncidents] Failed to fetch:', err);
      if (isMountedRef.current) {
        setError(err.response?.data?.error || err.message || 'Failed to load incidents');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [JSON.stringify(params)]);

  // Manual refresh function
  const refresh = useCallback(() => {
    return fetchIncidents(true);
  }, [fetchIncidents]);

  // Initial fetch
  useEffect(() => {
    isMountedRef.current = true;
    fetchIncidents(true);

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchIncidents]);

  // Polling effect
  useEffect(() => {
    if (!enablePolling) return;

    const poll = () => {
      pollTimeoutRef.current = setTimeout(async () => {
        if (isMountedRef.current) {
          await fetchIncidents(false); // Don't show loading for polls
          poll(); // Schedule next poll
        }
      }, POLL_INTERVAL);
    };

    poll();

    return () => {
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
      }
    };
  }, [fetchIncidents, enablePolling]);

  return {
    incidents,
    loading,
    error,
    refresh,
  };
}

export default useIncidents;
