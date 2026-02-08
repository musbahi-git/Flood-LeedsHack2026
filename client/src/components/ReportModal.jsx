import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';
import {
  IncidentIcon,
  ReportIcon,
  NeedHelpIcon,
  CanHelpIcon,
  FloodIcon,
  PowerIcon,
  TravelIcon,
  MedicalIcon,
  SuppliesIcon,
  OtherIcon,
  LocationIcon,
  ChevronDownIcon,
} from './Icons';

const categoryOptions = [
  { value: 'flood', label: 'Flood / Water', icon: FloodIcon },
  { value: 'power', label: 'Power Outage', icon: PowerIcon },
  { value: 'travel', label: 'Road / Travel Issue', icon: TravelIcon },
  { value: 'medical', label: 'Medical', icon: MedicalIcon },
  { value: 'supplies', label: 'Supplies Needed', icon: SuppliesIcon },
  { value: 'other', label: 'Other', icon: OtherIcon },
];

/**
 * ReportModal Component
 * Controlled modal for creating a new incident/help request.
 */
function ReportModal({ isOpen, onClose, onSubmit, currentLocation, clickedLocation, userId }) {
  const [formData, setFormData] = useState({
    type: 'incident',
    category: 'flood',
    description: '',
    lat: '',
    lon: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const categoryRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setCategoryOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update location when currentLocation or clickedLocation changes
  useEffect(() => {
    if (clickedLocation) {
      setFormData((prev) => ({
        ...prev,
        lat: clickedLocation.lat.toFixed(6),
        lon: clickedLocation.lon.toFixed(6),
      }));
    } else if (currentLocation && !formData.lat && !formData.lon) {
      setFormData((prev) => ({
        ...prev,
        lat: currentLocation.lat.toFixed(6),
        lon: currentLocation.lon.toFixed(6),
      }));
    }
  }, [currentLocation, clickedLocation]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setErrors({});
      setSubmitError(null);
      setCategoryOpen(false);
      if (clickedLocation) {
        setFormData({
          type: 'incident',
          category: 'flood',
          description: '',
          lat: clickedLocation.lat.toFixed(6),
          lon: clickedLocation.lon.toFixed(6),
        });
      } else if (currentLocation) {
        setFormData({
          type: 'incident',
          category: 'flood',
          description: '',
          lat: currentLocation.lat.toFixed(6),
          lon: currentLocation.lon.toFixed(6),
        });
      }
    }
  }, [isOpen, clickedLocation, currentLocation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleUseMyLocation = () => {
    if (currentLocation) {
      setFormData((prev) => ({
        ...prev,
        lat: currentLocation.lat.toFixed(6),
        lon: currentLocation.lon.toFixed(6),
      }));
      setErrors((prev) => ({ ...prev, location: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.type) {
      newErrors.type = 'Please select a type';
    }

    if (!formData.description || formData.description.trim().length < 5) {
      newErrors.description = 'Please provide a description (at least 5 characters)';
    }

    if (!formData.lat || !formData.lon) {
      newErrors.location = 'Please provide a location';
    } else {
      const lat = parseFloat(formData.lat);
      const lon = parseFloat(formData.lon);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        newErrors.location = 'Invalid latitude (must be -90 to 90)';
      } else if (isNaN(lon) || lon < -180 || lon > 180) {
        newErrors.location = 'Invalid longitude (must be -180 to 180)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      await onSubmit({
        type: formData.type,
        category: formData.category,
        description: formData.description.trim(),
        lat: parseFloat(formData.lat),
        lon: parseFloat(formData.lon),
        userId: userId,
      });
      // Reset form on success
      setFormData({
        type: 'incident',
        category: 'flood',
        description: '',
        lat: '',
        lon: '',
      });
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const hasLocation = formData.lat && formData.lon;
  const selectedCategory = categoryOptions.find((o) => o.value === formData.category) || categoryOptions[0];

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal report-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <ReportIcon size={18} />
            Report
          </h2>
          <button
            className="modal-close"
            onClick={handleClose}
            disabled={submitting}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="report-form">
          {/* Type Selection */}
          <div className="form-group">
            <label htmlFor="type">What are you reporting?</label>
            <div className="type-buttons">
              {[
                { value: 'incident', label: 'Incident', desc: 'Report a hazard', Icon: IncidentIcon, iconColor: '#ef4444' },
                { value: 'need_help', label: 'Need Help', desc: 'Request assistance', Icon: NeedHelpIcon },
                { value: 'can_help', label: 'Can Help', desc: 'Offer assistance', Icon: CanHelpIcon },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`type-btn ${formData.type === option.value ? 'active' : ''}`}
                  onClick={() => handleChange({ target: { name: 'type', value: option.value } })}
                >
                  <span className="type-btn-icon" style={option.iconColor ? { color: option.iconColor } : undefined}><option.Icon size={24} /></span>
                  <span className="type-btn-label">{option.label}</span>
                  <span className="type-btn-desc">{option.desc}</span>
                </button>
              ))}
            </div>
            {errors.type && <p className="error">{errors.type}</p>}
          </div>

          {/* Category Selection - Custom Dropdown */}
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <div className="custom-select" ref={categoryRef}>
              <button
                type="button"
                className={`custom-select-trigger ${categoryOpen ? 'open' : ''}`}
                onClick={() => setCategoryOpen(!categoryOpen)}
              >
                <span className="custom-select-icon">
                  <selectedCategory.icon size={18} />
                </span>
                <span className="custom-select-label">{selectedCategory.label}</span>
                <span className={`custom-select-chevron ${categoryOpen ? 'open' : ''}`}>
                  <ChevronDownIcon size={16} />
                </span>
              </button>
              {categoryOpen && (
                <div className="custom-select-dropdown">
                  {categoryOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`custom-select-option ${formData.category === option.value ? 'selected' : ''}`}
                      onClick={() => {
                        handleChange({ target: { name: 'category', value: option.value } });
                        setCategoryOpen(false);
                      }}
                    >
                      <span className="custom-select-option-icon">
                        <option.icon size={18} />
                      </span>
                      <span>{option.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the situation in detail..."
              rows={3}
              className={`form-textarea ${errors.description ? 'input-error' : ''}`}
            />
            {errors.description && <p className="error">{errors.description}</p>}
          </div>

          {/* Location */}
          <div className="form-group">
            <label>Location *</label>
            <div className="location-section">
              {hasLocation ? (
                <div className="location-display">
                  <span className="location-icon"><LocationIcon size={16} /></span>
                  <span className="location-coords">
                    {parseFloat(formData.lat).toFixed(4)}, {parseFloat(formData.lon).toFixed(4)}
                  </span>
                  <button
                    type="button"
                    className="location-clear"
                    onClick={() => setFormData((prev) => ({ ...prev, lat: '', lon: '' }))}
                  >
                    &times;
                  </button>
                </div>
              ) : (
                <div className="location-empty">
                  <p>No location set</p>
                </div>
              )}

              <div className="location-actions">
                {currentLocation && (
                  <button
                    type="button"
                    className="btn btn-outline btn-small"
                    onClick={handleUseMyLocation}
                  >
                    <LocationIcon size={14} /> Use My Location
                  </button>
                )}
                <span className="location-hint">or tap on the map</span>
              </div>

              {/* Hidden inputs for lat/lon */}
              <input type="hidden" name="lat" value={formData.lat} />
              <input type="hidden" name="lon" value={formData.lon} />
            </div>
            {errors.location && <p className="error">{errors.location}</p>}
          </div>

          {/* Submit Error */}
          {submitError && (
            <div className="submit-error">
              <p>{submitError}</p>
            </div>
          )}

          {/* Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={handleClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

ReportModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  currentLocation: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lon: PropTypes.number.isRequired,
  }),
  clickedLocation: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lon: PropTypes.number.isRequired,
  }),
  userId: PropTypes.string,
};

export default ReportModal;
