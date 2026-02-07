import React, { useState } from 'react';
import { useUserLocation } from '../hooks/useUserLocation';

/**
 * ReportModal Component
 * Modal for submitting incident reports.
 * 
 * TODO: Person B - Enhance with:
 * - Better form validation
 * - Location picker on map
 * - Photo upload
 * - Styling
 */
function ReportModal({ onSubmit, onClose }) {
  const { location, error: locationError, requestLocation } = useUserLocation();
  
  const [formData, setFormData] = useState({
    type: 'incident',
    category: 'flood',
    description: '',
    lat: '',
    lon: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUseMyLocation = () => {
    requestLocation();
    if (location) {
      setFormData((prev) => ({
        ...prev,
        lat: location.lat.toString(),
        lon: location.lon.toString(),
      }));
    }
  };

  // Update location when it becomes available
  React.useEffect(() => {
    if (location) {
      setFormData((prev) => ({
        ...prev,
        lat: location.lat.toString(),
        lon: location.lon.toString(),
      }));
    }
  }, [location]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.lat || !formData.lon) {
      alert('Please provide a location');
      return;
    }
    
    onSubmit({
      ...formData,
      lat: parseFloat(formData.lat),
      lon: parseFloat(formData.lon),
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Report an Incident</h2>
        
        <form onSubmit={handleSubmit}>
          {/* Type Selection */}
          <div className="form-group">
            <label htmlFor="type">Type</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="incident">🚨 Incident</option>
              <option value="need_help">🆘 I Need Help</option>
              <option value="can_help">🤝 I Can Help</option>
            </select>
          </div>

          {/* Category Selection */}
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="flood">🌊 Flood</option>
              <option value="power">⚡ Power Outage</option>
              <option value="travel">🚗 Travel Issue</option>
              <option value="other">📋 Other</option>
            </select>
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the situation..."
              rows={3}
            />
          </div>

          {/* Location */}
          <div className="form-group">
            <label>Location</label>
            <div className="location-inputs">
              <input
                type="number"
                name="lat"
                value={formData.lat}
                onChange={handleChange}
                placeholder="Latitude"
                step="any"
              />
              <input
                type="number"
                name="lon"
                value={formData.lon}
                onChange={handleChange}
                placeholder="Longitude"
                step="any"
              />
            </div>
            <button
              type="button"
              className="btn btn-small"
              onClick={handleUseMyLocation}
            >
              📍 Use My Location
            </button>
            {locationError && <p className="error">{locationError}</p>}
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button type="button" className="btn btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReportModal;
