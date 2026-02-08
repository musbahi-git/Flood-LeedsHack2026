import React from 'react';
import PropTypes from 'prop-types';

/**
 * SafeRoutePanel Component
 * Panel for requesting and displaying safe routes to shelters.
 * 
 * Props:
 * - onRequestRoute(): function called when user presses "Find safe route"
 * - onClearRoute(): function called when user clears the route
 * - explanation: string from backend
 * - loading: boolean
 * - error: string or null
 * - hasRoute: boolean - whether a route is currently displayed
 * - userLocation: current user location or null
 * - onRequestLocation(): request user location
 * - locationLoading: boolean
 */
function SafeRoutePanel({ 
  onRequestRoute, 
  onClearRoute,
  explanation, 
  loading, 
  error,
  hasRoute,
  userLocation,
  onRequestLocation,
  locationLoading,
}) {
  // Don't show panel if no route and not loading
  const isVisible = hasRoute || loading || error;

  return (
    <>
      {/* Collapsed state - show only if route exists */}
      {isVisible && (
        <div className="safe-route-panel">
          <div className="panel-header">
            <h3>🛤️ Safe Route</h3>
            {hasRoute && (
              <button 
                className="panel-close" 
                onClick={onClearRoute}
                aria-label="Clear route"
              >
                ×
              </button>
            )}
          </div>

          <div className="panel-content">
            {/* Loading state */}
            {loading && (
              <div className="route-loading">
                <div className="loading-spinner"></div>
                <p>Calculating safest route...</p>
                <span className="loading-hint">Analyzing flood data and incidents</span>
              </div>
            )}

            {/* Error state */}
            {error && !loading && (
              <div className="route-error">
                <span className="error-icon">⚠️</span>
                <p>{error}</p>
                <button 
                  className="btn btn-small btn-outline"
                  onClick={onRequestRoute}
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Success state with explanation */}
            {hasRoute && !loading && !error && (
              <div className="route-success">
                <div className="route-badge">
                  <span className="badge-icon">✅</span>
                  <span className="badge-text">Route Found</span>
                </div>
                
                {explanation && (
                  <div className="explanation-box">
                    <div className="explanation-header">
                      <span>🤖</span>
                      <strong>AI Safety Analysis</strong>
                    </div>
                    <p className="explanation-text">{explanation}</p>
                  </div>
                )}

                <div className="route-actions">
                  <button 
                    className="btn btn-outline btn-full"
                    onClick={onClearRoute}
                  >
                    Clear Route
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Location prompt - shown when trying to get route without location */}
      {!userLocation && !loading && (
        <div className="location-prompt" style={{ display: 'none' }}>
          {/* This will be shown via the FAB button interaction */}
        </div>
      )}
    </>
  );
}

export default SafeRoutePanel;

SafeRoutePanel.propTypes = {
  onRequestRoute: PropTypes.func.isRequired,
  onClearRoute: PropTypes.func.isRequired,
  explanation: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  hasRoute: PropTypes.bool.isRequired,
  userLocation: PropTypes.shape({
    lat: PropTypes.number,
    lon: PropTypes.number,
    accuracy: PropTypes.number,
  }),
  onRequestLocation: PropTypes.func,
  locationLoading: PropTypes.bool,
};
