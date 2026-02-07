import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * useUserLocation Hook
 * Manages user's geolocation with error handling.
 * 
 * @param {boolean} autoRequest - Automatically request location on mount (default: true)
 * @returns {Object} { location, error, loading, requestLocation }
 */
export function useUserLocation(autoRequest = true) {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const watchIdRef = useRef(null);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
        setLoading(false);
        setError(null);
      },
      (err) => {
        let message = 'Failed to get location';
        switch (err.code) {
          case err.PERMISSION_DENIED:
            message = 'Location permission denied. Please enable location access.';
            break;
          case err.POSITION_UNAVAILABLE:
            message = 'Location information unavailable';
            break;
          case err.TIMEOUT:
            message = 'Location request timed out';
            break;
        }
        setError(message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000,
      }
    );
  }, []);

  // Watch position for continuous updates
  const watchPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    if (watchIdRef.current !== null) {
      return; // Already watching
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
        setError(null);
      },
      (err) => {
        console.warn('[useUserLocation] Watch error:', err);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 30000,
      }
    );
  }, []);

  // Stop watching position
  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  // Auto-request location on mount if enabled
  useEffect(() => {
    if (autoRequest) {
      requestLocation();
    }

    return () => {
      stopWatching();
    };
  }, [autoRequest, requestLocation, stopWatching]);

  return {
    location,
    error,
    loading,
    requestLocation,
    watchPosition,
    stopWatching,
  };
}

export default useUserLocation;
