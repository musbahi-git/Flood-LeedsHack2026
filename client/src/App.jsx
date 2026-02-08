import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import LearningPanel from './components/LearningPanel';
import ChatPanel from './components/ChatPanel';
import { requestNotificationPermission, showNotification } from './utils/notifications';
import MapView from './components/MapView';
import ReportModal from './components/ReportModal';
import SafeRoutePanel from './components/SafeRoutePanel';
import IncidentList from './components/IncidentList';
import { ReportIcon, RouteIcon, ListIcon, LocationIcon, MapIcon, LearnIcon, SunIcon, MoonIcon } from './components/Icons';
import { useIncidents } from './hooks/useIncidents';
import { useShelters } from './hooks/useShelters';
import { useIncidentWebSocket } from './hooks/useIncidentWebSocket';
import { useUserLocation } from './hooks/useUserLocation';
import { createIncident } from './api/incidentsApi';
import { getSafeRoute } from './api/routesApi';
import { getOrCreateUserId } from './utils/userId';

// ErrorBoundary to catch runtime errors and display them
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <div style={{color:'red',padding:'2rem'}}><h2>Something went wrong.</h2><pre>{this.state.error?.toString()}</pre></div>;
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node
};

// Get or create anonymous user ID for this device
const userId = getOrCreateUserId();

/**
 * Haven - Main App Component
 *
 * Community incident map with AI-guided safe routing.
 */
function App() {
  // Flood risk alert state
  const [showFloodAlert, setShowFloodAlert] = useState(true);
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

    // Show device notification if permission granted
    showNotification(notification, {
      body: incident?.description || '',
      icon: '/icons/icon-192.svg',
      tag: 'haven-incident',
    });
  });
  const { location: userLocation, loading: locationLoading, requestLocation } = useUserLocation();

  // UI state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [showIncidentList, setShowIncidentList] = useState(false);
  const [activeView, setActiveView] = useState('map');
  const [darkMode, setDarkMode] = useState(false);

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
    // Prompt for notification permission on first load
    requestNotificationPermission();

    // Subscribe to push notifications (if supported)
    import('./utils/push').then(({ subscribeUserToPush }) => {
      subscribeUserToPush();
    });

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

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  return (
    <ErrorBoundary>
    <div className={"app" + (darkMode ? " dark" : "") }>
      {/* Flood Risk Alert Overlay */}
      {showFloodAlert && (
        <div style={{
          position:'fixed',
          top:0,
          left:0,
          width:'100vw',
          height:'100vh',
          zIndex:1000,
          background:'rgba(255,0,0,0.08)',
          pointerEvents:'auto',
          boxShadow:'0 0 0 8px rgba(255,0,0,0.15) inset, 0 0 32px 8px rgba(255,0,0,0.25)',
        }}>
          <div style={{
            position:'absolute',
            top:'32px',
            left:'50%',
            transform:'translateX(-50%)',
            background:'#fff',
            border:'2px solid #dc2626',
            borderRadius:'16px',
            boxShadow:'0 4px 24px #dc2626',
            padding:'32px 24px',
            maxWidth:'420px',
            textAlign:'center',
            zIndex:1001
          }}>
            <div style={{fontSize:'2.5rem',color:'#dc2626',marginBottom:'12px'}}>🌊</div>
            <h2 style={{color:'#dc2626',fontWeight:'bold',marginBottom:'8px'}}>Major Flood Risk Alert</h2>
            <p style={{color:'#b91c1c',fontSize:'1.1rem',marginBottom:'16px'}}>Severe flood risk is active in Leeds. Please avoid low-lying areas, follow official guidance, and check safe routes before traveling.</p>
            <button style={{background:'#dc2626',color:'#fff',border:'none',borderRadius:'8px',padding:'12px 32px',fontWeight:'bold',fontSize:'1rem',boxShadow:'0 2px 8px #dc2626',cursor:'pointer'}} onClick={()=>setShowFloodAlert(false)}>Dismiss</button>
          </div>
          {/* Red corner shadow overlay */}
          <div style={{position:'absolute',top:0,left:0,width:'100vw',height:'100vh',pointerEvents:'none'}}>
            <div style={{position:'absolute',top:0,left:0,width:'120px',height:'120px',background:'radial-gradient(circle at top left, #dc2626 60%, transparent 100%)',zIndex:1002}}></div>
            <div style={{position:'absolute',top:0,right:0,width:'120px',height:'120px',background:'radial-gradient(circle at top right, #dc2626 60%, transparent 100%)',zIndex:1002}}></div>
            <div style={{position:'absolute',bottom:0,left:0,width:'120px',height:'120px',background:'radial-gradient(circle at bottom left, #dc2626 60%, transparent 100%)',zIndex:1002}}></div>
            <div style={{position:'absolute',bottom:0,right:0,width:'120px',height:'120px',background:'radial-gradient(circle at bottom right, #dc2626 60%, transparent 100%)',zIndex:1002}}></div>
          </div>
        </div>
      )}
      {/* WebSocket notification banner */}
      {wsNotification && (
        <div className={`ws-notification ws-notification-${wsNotifType || 'default'}`} role="alert" aria-live="assertive">
          <span>{wsNotification}</span>
        </div>
      )}
      {/* Header */}
      <header className="app-header">
        <h1 className="app-title">Haven</h1>

        <nav className="nav-tabs">
          <button
            className={"nav-tab" + (activeView === 'map' ? ' nav-tab-active' : '')}
            onClick={() => setActiveView('map')}
            aria-label="Show map view"
          >
            <MapIcon size={16} />
            <span>Map</span>
          </button>
          <button
            className={"nav-tab" + (activeView === 'learn' ? ' nav-tab-active' : '')}
            onClick={() => setActiveView('learn')}
            aria-label="Show learning panel"
          >
            <LearnIcon size={16} />
            <span>Learn</span>
          </button>
          <button
            className={"nav-tab" + (activeView === 'chat' ? ' nav-tab-active' : '')}
            onClick={() => setActiveView('chat')}
            aria-label="Show local chat"
          >
            <span role="img" aria-label="Chat" style={{fontSize:'1.2rem'}}>💬</span>
            <span>Chat</span>
          </button>
        </nav>

        <button
          className="theme-toggle"
          onClick={() => setDarkMode(dm => !dm)}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? <SunIcon size={18} /> : <MoonIcon size={18} />}
        </button>
      </header>

      {/* Main content: Map, LearningPanel, or ChatPanel */}
      {activeView === 'map' ? (
        <MapView
          incidents={incidents}
          routes={routes}
          chosenRouteId={chosenRouteId}
          userLocation={userLocation}
          shelters={shelters}
          onMapClick={handleMapClick}
          currentUserId={userId}
          darkMode={darkMode}
        />
      ) : activeView === 'learn' ? (
        <LearningPanel />
      ) : activeView === 'chat' ? (
        <ChatPanel />
      ) : null}

      {/* Floating action buttons (only show on map view) */}
      {activeView === 'map' && (
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
      )}

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
    </ErrorBoundary>
  );
}

export default App;
