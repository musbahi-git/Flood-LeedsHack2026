import React, { useState } from 'react';
import MapView from './components/MapView';
import ReportModal from './components/ReportModal';
import SafeRoutePanel from './components/SafeRoutePanel';
import IncidentList from './components/IncidentList';
import { useIncidents } from './hooks/useIncidents';
import { createIncident } from './api/incidentsApi';
import { getSafeRoute } from './api/routesApi';

/**
 * Main App Component
 * 
 * TODO: Person B - Enhance with proper state management and UI polish.
 */
function App() {
  const { incidents, loading, error, refetch } = useIncidents();
  const [showReportModal, setShowReportModal] = useState(false);
  const [showSafeRoutePanel, setShowSafeRoutePanel] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [routeExplanation, setRouteExplanation] = useState('');

  // Handle report submission
  const handleReportSubmit = async (formData) => {
    try {
      await createIncident(formData);
      setShowReportModal(false);
      refetch(); // Refresh incidents list
    } catch (err) {
      console.error('Failed to submit report:', err);
      alert('Failed to submit report. Please try again.');
    }
  };

  // Handle safe route request
  const handleRequestRoute = async (origin, destination) => {
    try {
      const result = await getSafeRoute({ origin, destination });
      if (result.routes && result.routes.length > 0) {
        setSelectedRoute(result.routes[result.chosenRouteId]);
        setRouteExplanation(result.explanation);
      }
    } catch (err) {
      console.error('Failed to get safe route:', err);
      alert('Failed to calculate safe route. Please try again.');
    }
  };

  return (
    <div className="app">
      {/* Map fills the viewport */}
      <MapView 
        incidents={incidents} 
        selectedRoute={selectedRoute}
      />

      {/* Floating controls */}
      <div className="floating-controls">
        <button 
          className="btn btn-primary"
          onClick={() => setShowReportModal(true)}
        >
          📍 Report
        </button>
        <button 
          className="btn btn-secondary"
          onClick={() => setShowSafeRoutePanel(!showSafeRoutePanel)}
        >
          🛤️ Safe Route
        </button>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <ReportModal
          onSubmit={handleReportSubmit}
          onClose={() => setShowReportModal(false)}
        />
      )}

      {/* Safe Route Panel */}
      {showSafeRoutePanel && (
        <SafeRoutePanel
          onRequestRoute={handleRequestRoute}
          explanation={routeExplanation}
          onClose={() => setShowSafeRoutePanel(false)}
        />
      )}

      {/* Debug: Incident List (optional, can be removed) */}
      {/* <IncidentList incidents={incidents} loading={loading} error={error} /> */}
    </div>
  );
}

export default App;
