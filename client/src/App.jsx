import React, { useState, useCallback, useEffect } from 'react';
import MapView from './components/MapView';
import ReportModal from './components/ReportModal';
import SafeRoutePanel from './components/SafeRoutePanel';
import IncidentList from './components/IncidentList';
import { ReportIcon, RouteIcon, ListIcon, LocationIcon } from './components/Icons';
import { useIncidents } from './hooks/useIncidents';
import { useShelters } from './hooks/useShelters';
import { useIncidentWebSocket } from './hooks/useIncidentWebSocket';
import { useUserLocation } from './hooks/useUserLocation';
import { createIncident } from './api/incidentsApi';
import { getSafeRoute } from './api/routesApi';
import { getOrCreateUserId } from './utils/userId';

// Get or create anonymous user ID for this device
const userId = getOrCreateUserId();

/**
 * Haven - Main App Component
 *
 * Community incident map with AI-guided safe routing.
 */
function App() {
  // Data hooks
  const { incidents, loading: incidentsLoading, error: incidentsError, refresh } = useIncidents();
  const { shelters } = useShelters();

  // Notification state
  const [wsNotification, setWsNotification] = useState(null);
  const [wsNotifType, setWsNotifType] = useState(null);
  const wsNotifTimeout = React.useRef(null);

  // WebSocket: listen for new incidents
  useIncidentWebSocket((incident, notification, type) => {
    setWsNotification(notification);
    setWsNotifType(type);
    refresh(); // Refresh incidents list
    if (wsNotifTimeout.current) clearTimeout(wsNotifTimeout.current);
    // Auto-hide notification after 5s
    wsNotifTimeout.current = setTimeout(() => setWsNotification(null), 5000);
  });
  const { location: userLocation, loading: locationLoading, requestLocation } = useUserLocation();

  // UI state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [showIncidentList, setShowIncidentList] = useState(false);

  // PWA install prompt state
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  // Route state
  const [routes, setRoutes] = useState([]);
  const [chosenRouteId, setChosenRouteId] = useState(null);
  const [routeExplanation, setRouteExplanation] = useState('');
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState(null);

  // Map click location (for report modal)
  const [clickedLocation, setClickedLocation] = useState(null);

  // Handle map click - can be used to set report location
  const handleMapClick = useCallback((latlng) => {
    setClickedLocation({ lat: latlng.lat, lon: latlng.lng });
  }, []);

  // PWA install prompt handling
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Store the event so it can be triggered later
      setDeferredPrompt(e);
      // Show custom install banner
      setShowInstallBanner(true);
    };

    globalThis.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      globalThis.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Handle PWA install
  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user's response
    const { outcome } = await deferredPrompt.userChoice;
    console.log('[PWA] Install prompt outcome:', outcome);

    // Clear the deferred prompt
    setDeferredPrompt(null);
    setShowInstallBanner(false);
  };

  // Handle report submission
  const handleReportSubmit = async (formData) => {
    try {
      await createIncident(formData);
      setIsReportModalOpen(false);
      setClickedLocation(null);
      refresh(); // Refresh incidents list
    } catch (err) {
      console.error('Failed to submit report:', err);
      throw err; // Let modal handle the error display
    }
  };

  // Handle safe route request
  const handleRequestRoute = async () => {
    // First ensure we have user location
    if (!userLocation) {
      requestLocation();
      return;
    }

    setRouteLoading(true);
    setRouteError(null);

    try {
      const result = await getSafeRoute({
        origin: { lat: userLocation.lat, lon: userLocation.lon },
        // Destination will be chosen by backend (nearest shelter)
      });

      if (result.routes && result.routes.length > 0) {
        setRoutes(result.routes);
        setChosenRouteId(result.chosenRouteId);
        setRouteExplanation(result.explanation);
      } else {
        setRouteError('No safe routes found');
      }
    } catch (err) {
      console.error('Failed to get safe route:', err);
      setRouteError(err.response?.data?.error || 'Failed to calculate safe route');
    } finally {
      setRouteLoading(false);
    }
  };

  // Clear route
  const handleClearRoute = () => {
    setRoutes([]);
    setChosenRouteId(null);
    setRouteExplanation('');
    setRouteError(null);
  };

  // Open report modal
  const handleOpenReport = () => {
    if (!userLocation) {
      requestLocation();
    }
    setIsReportModalOpen(true);
  };

  return (
    <div className="app">
      {/* WebSocket notification banner */}
      {wsNotification && (
        <div className={`ws-notification ws-notification-${wsNotifType || 'default'}`}>
          <span>{wsNotification}</span>
        </div>
      )}
      {/* Header */}
      <header className="app-header">
        <h1 className="app-title">Haven</h1>
        <span className="app-tagline">Community Safety Map</span>
      </header>

      {/* Map fills the viewport */}
      <MapView
        incidents={incidents}
        routes={routes}
        chosenRouteId={chosenRouteId}
        userLocation={userLocation}
        shelters={shelters}
        onMapClick={handleMapClick}
        currentUserId={userId}
      />

      {/* Floating action buttons */}
      <div className="floating-actions">
        <button
          className="fab fab-report"
          onClick={handleOpenReport}
          title="Report incident or request help"
        >
          <span className="fab-icon"><ReportIcon size={18} /></span>
          <span className="fab-label">Report</span>
        </button>

        <button
          className="fab fab-route"
          onClick={handleRequestRoute}
          disabled={routeLoading}
          title="Find safe route to shelter"
        >
          <span className="fab-icon"><RouteIcon size={18} /></span>
          <span className="fab-label">{routeLoading ? 'Finding...' : 'Safe Route'}</span>
        </button>

        <button
          className="fab fab-list"
          onClick={() => setShowIncidentList(!showIncidentList)}
          title="View incident list"
        >
          <span className="fab-icon"><ListIcon size={18} /></span>
          <span className="fab-label">List</span>
        </button>
      </div>

      {/* Safe Route Panel - shows when route is calculated */}
      <SafeRoutePanel
        onRequestRoute={handleRequestRoute}
        onClearRoute={handleClearRoute}
        explanation={routeExplanation}
        loading={routeLoading}
        error={routeError}
        hasRoute={routes.length > 0}
        userLocation={userLocation}
        onRequestLocation={requestLocation}
        locationLoading={locationLoading}
      />

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => {
          setIsReportModalOpen(false);
          setClickedLocation(null);
        }}
        onSubmit={handleReportSubmit}
        currentLocation={userLocation}
        clickedLocation={clickedLocation}
        userId={userId}
      />

      {/* Incident List (debug/overview) */}
      {showIncidentList && (
        <IncidentList
          incidents={incidents}
          loading={incidentsLoading}
          error={incidentsError}
          onClose={() => setShowIncidentList(false)}
        />
      )}

      {/* Location status indicator */}
      {userLocation && (
        <div className="location-indicator">
          <LocationIcon size={14} />
          Location active
        </div>
      )}

      {/* PWA Install Banner */}
      {showInstallBanner && (
        <div className="install-banner">
          <span className="install-text">Install Haven for quick access</span>
          <div className="install-actions">
            <button className="btn btn-small btn-primary" onClick={handleInstallClick}>
              Install
            </button>
            <button
              className="btn btn-small btn-ghost"
              onClick={() => setShowInstallBanner(false)}
            >
              Later
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
