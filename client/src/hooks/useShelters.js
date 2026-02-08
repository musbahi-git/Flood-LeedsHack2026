import { useState, useEffect, useCallback, useRef } from 'react';
import { getShelters } from '../api/sheltersApi';

/**
 * useShelters Hook
 * Fetches and manages shelter data.
 *
 * @returns {Object} { shelters, loading, error, refresh }
 */
export function useShelters() {
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(true);

  const fetchShelters = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getShelters();
      if (isMountedRef.current) {
        setShelters(data);
      }
    } catch (err) {
      console.error('[useShelters] Failed to fetch:', err);
      if (isMountedRef.current) {
        setError(err.response?.data?.error || err.message || 'Failed to load shelters');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    fetchShelters();

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchShelters]);

  return {
    shelters,
    loading,
    error,
    refresh: fetchShelters,
  };
}

export default useShelters;
