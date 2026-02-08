import React, { useState, useEffect, useRef } from 'react';
import {
  IncidentIcon,
  NeedHelpIcon,
  CanHelpIcon,
  FloodIcon,
  LocationIcon,
  PowerIcon,
  TravelIcon,
  MedicalIcon,
  SuppliesIcon,
  OtherIcon,
  ChevronDownIcon,
} from './Icons';

const categories = [
  { value: 'flood', label: 'Flood / Water', Icon: FloodIcon },
  { value: 'power', label: 'Power Outage', Icon: PowerIcon },
  { value: 'travel', label: 'Road / Travel Issue', Icon: TravelIcon },
  { value: 'medical', label: 'Medical', Icon: MedicalIcon },
  { value: 'supplies', label: 'Supplies Needed', Icon: SuppliesIcon },
  { value: 'other', label: 'Other', Icon: OtherIcon },
];

/**
 * ReportModal Component
 * Controlled modal for creating a new incident/help request.
 *
 * Props:
 * - isOpen: boolean - whether modal is visible
 * - onClose(): close the modal
 * - onSubmit(formData): called with { type, category, description, lat, lon }
 * - currentLocation: from useUserLocation (optional)
 * - clickedLocation: location from map click (optional)
 */
function ReportModal({ isOpen, onClose, onSubmit, currentLocation, clickedLocation }) {
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

  // Close category dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setCategoryOpen(false);
      }
    };
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
      // Reset and pre-fill location
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
    // Clear error when user types
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
  const selectedCategory = categories.find(c => c.value === formData.category) || categories[0];

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal report-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Report</h2>
          <button
            className="modal-close"
            onClick={handleClose}
            disabled={submitting}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="report-form">
          {/* Type Selection */}
          <div className="form-group">
            <label>What are you reporting?</label>
            <div className="type-buttons">
              {[
                { value: 'incident', icon: <IncidentIcon />, label: 'Incident', desc: 'Report a hazard' },
                { value: 'need_help', icon: <NeedHelpIcon />, label: 'Need Help', desc: 'Request assistance' },
                { value: 'can_help', icon: <CanHelpIcon />, label: 'Can Help', desc: 'Offer assistance' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`type-btn ${formData.type === option.value ? 'active' : ''}`}
                  onClick={() => handleChange({ target: { name: 'type', value: option.value } })}
                >
                  <span className="type-btn-icon">{option.icon}</span>
                  <span className="type-btn-label">{option.label}</span>
                  <span className="type-btn-desc">{option.desc}</span>
                </button>
              ))}
            </div>
            {errors.type && <p className="error">{errors.type}</p>}
          </div>

          {/* Category Selection - Custom Dropdown */}
          <div className="form-group">
            <label>Category</label>
            <div className="custom-select" ref={categoryRef}>
              <button
                type="button"
                className={`custom-select-trigger ${categoryOpen ? 'open' : ''}`}
                onClick={() => setCategoryOpen(!categoryOpen)}
              >
                <span className="custom-select-icon">
                  <selectedCategory.Icon size={18} />
                </span>
                <span className="custom-select-label">{selectedCategory.label}</span>
                <ChevronDownIcon size={16} />
              </button>
              {categoryOpen && (
                <div className="custom-select-dropdown">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      className={`custom-select-option ${formData.category === cat.value ? 'active' : ''}`}
                      onClick={() => {
                        handleChange({ target: { name: 'category', value: cat.value } });
                        setCategoryOpen(false);
                      }}
                    >
                      <span className="custom-select-icon">
                        <cat.Icon size={18} />
                      </span>
                      <span>{cat.label}</span>
                    </button>
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
                  <span className="location-icon"><LocationIcon size={18} /></span>
                  <span className="location-coords">
                    {parseFloat(formData.lat).toFixed(4)}, {parseFloat(formData.lon).toFixed(4)}
                  </span>
                  <button
                    type="button"
                    className="location-clear"
                    onClick={() => setFormData(prev => ({ ...prev, lat: '', lon: '' }))}
                  >
                    ×
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
                    <LocationIcon size={16} /> Use My Location
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

export default ReportModal;
