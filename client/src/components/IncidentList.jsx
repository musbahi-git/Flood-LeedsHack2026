import React from 'react';
import {
  IncidentIcon,
  NeedHelpIcon,
  CanHelpIcon,
  FloodIcon,
  PowerIcon,
  TravelIcon,
  MedicalIcon,
  SuppliesIcon,
  OtherIcon,
  ListIcon,
} from './Icons';

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

// Type config with SVG icons (gradient) on subtle colored backgrounds
const typeConfig = {
  incident: { icon: <IncidentIcon size={20} />, label: 'Incident', bgColor: 'rgba(239, 68, 68, 0.15)' },
  need_help: { icon: <NeedHelpIcon size={20} />, label: 'Needs Help', bgColor: 'rgba(249, 115, 22, 0.15)' },
  can_help: { icon: <CanHelpIcon size={20} />, label: 'Can Help', bgColor: 'rgba(34, 197, 94, 0.15)' },
};

// Category config with SVG icons
const categoryConfig = {
  flood: { icon: <FloodIcon size={14} />, label: 'Flood / Water' },
  power: { icon: <PowerIcon size={14} />, label: 'Power Outage' },
  travel: { icon: <TravelIcon size={14} />, label: 'Road / Travel' },
  medical: { icon: <MedicalIcon size={14} />, label: 'Medical' },
  supplies: { icon: <SuppliesIcon size={14} />, label: 'Supplies' },
  other: { icon: <OtherIcon size={14} />, label: 'Other' },
};

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
  return (
    <div className="incident-list-panel">
      <div className="panel-header">
        <h3><span className="panel-header-icon"><ListIcon size={16} /></span> Incidents ({incidents.length})</h3>
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
            <p>{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && incidents.length === 0 && (
          <div className="list-empty">
            <span className="empty-icon"><IncidentIcon size={32} /></span>
            <p>No incidents reported yet</p>
            <span className="empty-hint">Be the first to report!</span>
          </div>
        )}

        {/* Incident list */}
        {!loading && incidents.length > 0 && (
          <ul className="incident-list">
            {incidents.map((incident) => {
              const config = typeConfig[incident.type] || typeConfig.incident;
              const catConfig = categoryConfig[incident.category] || categoryConfig.other;

              return (
                <li key={incident._id || incident.id} className="incident-item">
                  <div
                    className="incident-type-badge"
                    style={{ backgroundColor: config.bgColor }}
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
                      <span className="category-icon">{catConfig.icon}</span>
                      {incident.category}
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
