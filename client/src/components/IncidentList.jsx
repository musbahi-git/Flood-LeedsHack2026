import React from 'react';
import PropTypes from 'prop-types';
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

// Type config with SVG icons
const typeConfig = {
  incident: { Icon: IncidentIcon, label: 'Incident', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.15)' },
  need_help: { Icon: NeedHelpIcon, label: 'Needs Help', color: '#f97316', bgColor: 'rgba(249, 115, 22, 0.15)' },
  can_help: { Icon: CanHelpIcon, label: 'Can Help', color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.15)' },
};

// Category config with SVG icons
const categoryConfig = {
  flood: { Icon: FloodIcon, label: 'Flood' },
  power: { Icon: PowerIcon, label: 'Power' },
  travel: { Icon: TravelIcon, label: 'Travel' },
  medical: { Icon: MedicalIcon, label: 'Medical' },
  supplies: { Icon: SuppliesIcon, label: 'Supplies' },
  other: { Icon: OtherIcon, label: 'Other' },
};

/**
 * IncidentList Component
 * Sidebar/panel listing all incidents for debugging and overview.
 */
function IncidentList({ incidents = [], loading = false, error = null, onClose }) {
  return (
    <div className="incident-list-panel">
      <div className="panel-header">
        <h3>
          <span className="panel-header-icon"><ListIcon size={18} /></span>
          Incidents ({incidents.length})
        </h3>
        <button className="panel-close" onClick={onClose} aria-label="Close">&times;</button>
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
                    <config.Icon size={18} />
                  </div>

                  <div className="incident-details">
                    <div className="incident-header">
                      <span className="incident-type">{config.label}</span>
                      <span className="incident-time">
                        {formatRelativeTime(incident.createdAt)}
                      </span>
                    </div>

                    <div className="incident-category">
                      <span className="category-icon"><catConfig.Icon size={14} /></span>
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
