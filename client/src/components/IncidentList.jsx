import React from 'react';

/**
 * IncidentList Component
 * Debug/admin list of all incidents.
 * 
 * TODO: Person B - Enhance with:
 * - Filtering and sorting
 * - Click to zoom on map
 * - Delete/edit functionality
 */
function IncidentList({ incidents = [], loading = false, error = null }) {
  if (loading) {
    return (
      <div className="incident-list">
        <p>Loading incidents...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="incident-list">
        <p className="error">Error loading incidents: {error}</p>
      </div>
    );
  }

  if (incidents.length === 0) {
    return (
      <div className="incident-list">
        <p>No incidents reported yet.</p>
      </div>
    );
  }

  // Type icons
  const typeIcons = {
    incident: '🚨',
    need_help: '🆘',
    can_help: '🤝',
  };

  // Category icons
  const categoryIcons = {
    flood: '🌊',
    power: '⚡',
    travel: '🚗',
    other: '📋',
  };

  return (
    <div className="incident-list">
      <h3>Recent Incidents ({incidents.length})</h3>
      <ul>
        {incidents.map((incident) => (
          <li key={incident._id} className="incident-item">
            <span className="incident-icon">
              {typeIcons[incident.type] || '📍'}
            </span>
            <div className="incident-details">
              <strong>
                {incident.type.replace('_', ' ')}
                {' - '}
                {categoryIcons[incident.category] || ''} {incident.category}
              </strong>
              <p>{incident.description || 'No description'}</p>
              <small>
                {new Date(incident.createdAt).toLocaleString()}
              </small>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default IncidentList;
