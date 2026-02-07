import React, { useState } from 'react';
import { useUserLocation } from '../hooks/useUserLocation';
import { getShelters } from '../api/sheltersApi';

/**
 * SafeRoutePanel Component
 * Panel for requesting safe routes to shelters.
 * 
 * TODO: Person B - Enhance with:
 * - Shelter selection dropdown (fetched from API)
 * - Route preview on map
 * - Multiple route options display
 * - Better explanation formatting
 */
function SafeRoutePanel({ onRequestRoute, explanation, onClose }) {
  const { location, requestLocation } = useUserLocation();
  const [loading, setLoading] = useState(false);
  const [shelters, setShelters] = useState([]);
  const [selectedShelterId, setSelectedShelterId] = useState('');

  // Fetch shelters on mount
  React.useEffect(() => {
    const fetchShelters = async () => {
      try {
        const data = await getShelters();
        setShelters(data);
        if (data.length > 0) {
          setSelectedShelterId(data[0]._id);
        }
      } catch (err) {
        console.error('Failed to fetch shelters:', err);
      }
    };
    fetchShelters();
  }, []);

  const handleFindRoute = async () => {
    if (!location) {
      alert('Please allow location access first');
      requestLocation();
      return;
    }

    const selectedShelter = shelters.find((s) => s._id === selectedShelterId);
    if (!selectedShelter) {
      alert('Please select a shelter');
      return;
    }

    setLoading(true);
    try {
      await onRequestRoute(
        { lat: location.lat, lon: location.lon },
        {
          lat: selectedShelter.location.coordinates[1],
          lon: selectedShelter.location.coordinates[0],
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel safe-route-panel">
      <div className="panel-header">
        <h3>🛤️ Safe Route to Shelter</h3>
        <button className="btn-close" onClick={onClose}>×</button>
      </div>

      <div className="panel-content">
        {/* Get user location */}
        <div className="form-group">
          <label>Your Location</label>
          {location ? (
            <p className="location-display">
              📍 {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
            </p>
          ) : (
            <button className="btn btn-small" onClick={requestLocation}>
              📍 Get My Location
            </button>
          )}
        </div>

        {/* Shelter selection */}
        <div className="form-group">
          <label htmlFor="shelter">Destination Shelter</label>
          <select
            id="shelter"
            value={selectedShelterId}
            onChange={(e) => setSelectedShelterId(e.target.value)}
          >
            {shelters.length === 0 && <option value="">Loading shelters...</option>}
            {shelters.map((shelter) => (
              <option key={shelter._id} value={shelter._id}>
                {shelter.name}
              </option>
            ))}
          </select>
        </div>

        {/* Find route button */}
        <button
          className="btn btn-primary btn-full"
          onClick={handleFindRoute}
          disabled={loading || !location}
        >
          {loading ? '⏳ Calculating...' : '🚀 Find Safe Route'}
        </button>

        {/* Explanation display */}
        {explanation && (
          <div className="explanation-box">
            <h4>🤖 AI Recommendation</h4>
            <p>{explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SafeRoutePanel;
