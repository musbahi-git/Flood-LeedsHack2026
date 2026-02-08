import { useState, useEffect, useCallback, useRef } from 'react';
import { getShelters } from '../api/sheltersApi';

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
        setShelters(Array.isArray(data) ? data : []);
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

  const refresh = useCallback(() => {
    return fetchShelters();
  }, [fetchShelters]);

  useEffect(() => {
    isMountedRef.current = true;
    fetchShelters();

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchShelters]);

  return { shelters, loading, error, refresh };
}

export default useShelters;
