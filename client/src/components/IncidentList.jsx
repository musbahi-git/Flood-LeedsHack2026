import React from 'react';
import PropTypes from 'prop-types';

/**
 * Format relative time from date string
 */
function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

/**
 * IncidentList Component
 * Sidebar/panel listing all incidents for debugging and overview.
 * 
 * Props:
 * - incidents: array of incident objects
 * - loading: boolean
 * - error: string or null
 * - onClose: function to close the panel
 */
function IncidentList({ incidents = [], loading = false, error = null, onClose }) {
  // Type icons and labels
  const typeConfig = {
    incident: { icon: '🚨', label: 'Incident', color: '#ef4444' },
    need_help: { icon: '🆘', label: 'Needs Help', color: '#f97316' },
    can_help: { icon: '🤝', label: 'Can Help', color: '#22c55e' },
  };

  // Category icons
  const categoryIcons = {
    flood: '🌊',
    power: '⚡',
    travel: '🚗',
    medical: '🏥',
    supplies: '📦',
    other: '📋',
  };

  return (
    <div className="incident-list-panel">
      <div className="panel-header">
        <h3>📋 Incidents ({incidents.length})</h3>
        <button className="panel-close" onClick={onClose} aria-label="Close">×</button>
      </div>

      <div className="panel-content">
        {/* Loading state */}
        {loading && (
          <div className="list-loading">
            <div className="loading-spinner"></div>
            <p>Loading incidents...</p>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="list-error">
            <span>⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && incidents.length === 0 && (
          <div className="list-empty">
            <span className="empty-icon">📍</span>
            <p>No incidents reported yet</p>
            <span className="empty-hint">Be the first to report!</span>
          </div>
        )}

        {/* Incident list */}
        {!loading && incidents.length > 0 && (
          <ul className="incident-list">
            {incidents.map((incident) => {
              const config = typeConfig[incident.type] || typeConfig.incident;
              const categoryIcon = categoryIcons[incident.category] || '📋';

              return (
                <li key={incident._id || incident.id} className="incident-item">
                  <div 
                    className="incident-type-badge"
                    style={{ backgroundColor: config.color }}
                  >
                    {config.icon}
                  </div>
                  
                  <div className="incident-details">
                    <div className="incident-header">
                      <span className="incident-type">{config.label}</span>
                      <span className="incident-time">
                        {formatRelativeTime(incident.createdAt)}
                      </span>
                    </div>
                    
                    <div className="incident-category">
                      {categoryIcon} {incident.category}
                    </div>
                    
                    {incident.description && (
                      <p className="incident-description">
                        {incident.description.length > 80
                          ? `${incident.description.substring(0, 80)}...`
                          : incident.description}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default IncidentList;

IncidentList.propTypes = {
  incidents: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    id: PropTypes.string,
    type: PropTypes.string,
    category: PropTypes.string,
    description: PropTypes.string,
    createdAt: PropTypes.string,
  })),
  loading: PropTypes.bool,
  error: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};
