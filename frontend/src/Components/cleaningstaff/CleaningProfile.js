import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './cleaningstaff.css';
import api from '../../services/api';

function CleaningProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [message, setMessage]   = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [errors, setErrors]     = useState({});

  const [profile, setProfile] = useState(null);
  const [form, setForm]       = useState({
    fullName:     '',
    businessName: '',
    email:        '',
    phone:        '',
    address:      '',
    experience:   '',
    about:        '',
  });
  const [rates, setRates] = useState({
    'Room Cleaning':            '',
    'Bathroom Cleaning':        '',
    'Room + Bathroom Cleaning': '',
  });
  const [selectedService, setSelectedService] = useState('Room Cleaning');

  const serviceOptions = [
    { label: 'Room Cleaning',            icon: '🛏️'    },
    { label: 'Bathroom Cleaning',        icon: '🚿'    },
    { label: 'Room + Bathroom Cleaning', icon: '🛏️🚿' },
  ];

  const serviceIcons = {
    'Room Cleaning':            '🛏️',
    'Bathroom Cleaning':        '🚿',
    'Room + Bathroom Cleaning': '🛏️🚿',
  };

  // ── Load profile on mount ──
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get('/cleaning/vendor/profile');
      const data = res.data.data;
      setProfile(data);

      const formValues = {
        fullName:     data.fullName     || '',
        businessName: data.businessName || '',
        email:        data.email        || '',
        phone:        data.phone        || '',
        address:      data.address      || '',
        experience:   data.experience   || '',
        about:        data.about        || '',
      };
      setForm(formValues);

      // Populate rates from backend
      if (data.rates) {
        setRates({
          'Room Cleaning':            String(data.rates['Room Cleaning']            || ''),
          'Bathroom Cleaning':        String(data.rates['Bathroom Cleaning']        || ''),
          'Room + Bathroom Cleaning': String(data.rates['Room + Bathroom Cleaning'] || ''),
        });
      }

      // Set primary service type if stored
      if (data.serviceType) {
        setSelectedService(Array.isArray(data.serviceType) ? data.serviceType[0] : data.serviceType);
      }

    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim())     e.fullName     = 'Full name is required';
    if (!form.businessName.trim()) e.businessName = 'Business name is required';
    if (!form.phone.trim())        e.phone        = 'Phone is required';
    else if (!/^0\d{9}$/.test(form.phone)) e.phone = 'Enter valid phone (e.g. 0771234567)';
    if (!form.address.trim())      e.address      = 'Address is required';
    return e;
  };

  // ── Save profile & rates ──
  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSaving(true);
    try {
      const response = await api.put('/cleaning/vendor/profile', {
        fullName:     form.fullName,
        businessName: form.businessName,
        phone:        form.phone,
        address:      form.address,
        experience:   form.experience,
        about:        form.about,
        serviceType:  selectedService,
        rates: {
          'Room Cleaning':            Number(rates['Room Cleaning'])            || 0,
          'Bathroom Cleaning':        Number(rates['Bathroom Cleaning'])        || 0,
          'Room + Bathroom Cleaning': Number(rates['Room + Bathroom Cleaning']) || 0,
        }
      });

      const updated = response.data.data;
      setProfile(updated);
      setForm({
        fullName:     updated.fullName     || '',
        businessName: updated.businessName || '',
        email:        updated.email        || '',
        phone:        updated.phone        || '',
        address:      updated.address      || '',
        experience:   updated.experience   || '',
        about:        updated.about        || '',
      });
      setRates({
        'Room Cleaning':            String(updated.rates?.['Room Cleaning']            || ''),
        'Bathroom Cleaning':        String(updated.rates?.['Bathroom Cleaning']        || ''),
        'Room + Bathroom Cleaning': String(updated.rates?.['Room + Bathroom Cleaning'] || ''),
      });
      setSelectedService(Array.isArray(updated.serviceType)
        ? updated.serviceType[0] || 'Room Cleaning'
        : updated.serviceType || 'Room Cleaning');
      setErrors({});
      setIsEditing(false);
      setMessage('✅ Profile updated successfully!');
    } catch (err) {
      console.error(err);
      setMessage(`❌ ${err.response?.data?.message || 'Failed to update profile'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      fullName:     profile.fullName     || '',
      businessName: profile.businessName || '',
      email:        profile.email        || '',
      phone:        profile.phone        || '',
      address:      profile.address      || '',
      experience:   profile.experience   || '',
      about:        profile.about        || '',
    });
    if (profile.rates) {
      setRates({
        'Room Cleaning':            String(profile.rates['Room Cleaning']            || ''),
        'Bathroom Cleaning':        String(profile.rates['Bathroom Cleaning']        || ''),
        'Room + Bathroom Cleaning': String(profile.rates['Room + Bathroom Cleaning'] || ''),
      });
    }
    if (profile.serviceType) {
      setSelectedService(Array.isArray(profile.serviceType)
        ? profile.serviceType[0] || 'Room Cleaning'
        : profile.serviceType);
    }
    setErrors({});
    setIsEditing(false);
  };

  const currentService = serviceOptions.find(s => s.label === selectedService);

  // ── Loading state ──
  if (loading) {
    return (
      <div className="cs-page">
        <div className="cs-loading"><p>⏳ Loading profile...</p></div>
      </div>
    );
  }

  return (
    <div className="cs-page">

      {/* Header */}
      <div className="cs-header">
        <div>
          <h1>👤 My Profile</h1>
          <p>Manage your cleaning business profile and services</p>
        </div>
        <button className="cs-back-btn"
          onClick={() => navigate('/cleaning-vendor/dashboard')}>
          ← Back to Dashboard
        </button>
      </div>

      {/* Alert */}
      {message && (
        <div className={`cs-alert ${message.includes('✅') ? 'cs-alert-success' : 'cs-alert-error'}`}>
          {message}
          <button onClick={() => setMessage('')}>✕</button>
        </div>
      )}

      {/* Profile Card */}
      <div className="cs-section">
        <div className="cs-profile-top">
          <div className="cs-avatar">
            {form.fullName?.charAt(0).toUpperCase() || '?'}
          </div>
          <div className="cs-profile-info">
            <h2>{form.fullName}</h2>
            <p>{form.businessName}</p>
            <p>{form.email}</p>
            <div className="cs-service-tags">
              <span className="cs-tag">
                {currentService?.icon} {selectedService}
              </span>
            </div>
          </div>
          {!isEditing && (
            <button className="cs-edit-btn" onClick={() => setIsEditing(true)}>
              ✏️ Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Personal Details */}
      <div className="cs-section">
        <h3 className="cs-section-title">📋 Personal Details</h3>
        <div className="cs-form">
          <div className="cs-form-row">
            <div className="cs-form-group">
              <label>Full Name *</label>
              <input
                value={form.fullName}
                onChange={e => setForm({ ...form, fullName: e.target.value })}
                disabled={!isEditing}
                placeholder="Your full name"
              />
              {errors.fullName && <span className="cs-error">{errors.fullName}</span>}
            </div>
            <div className="cs-form-group">
              <label>Business Name *</label>
              <input
                value={form.businessName}
                onChange={e => setForm({ ...form, businessName: e.target.value })}
                disabled={!isEditing}
                placeholder="Your business name"
              />
              {errors.businessName && <span className="cs-error">{errors.businessName}</span>}
            </div>
          </div>
          <div className="cs-form-row">
            <div className="cs-form-group">
              <label>Email</label>
              <input value={form.email} disabled placeholder="Email address" />
              <span className="cs-hint">Email cannot be changed</span>
            </div>
            <div className="cs-form-group">
              <label>Phone *</label>
              <input
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                disabled={!isEditing}
                placeholder="0771234567"
              />
              {errors.phone && <span className="cs-error">{errors.phone}</span>}
            </div>
          </div>
          <div className="cs-form-row">
            <div className="cs-form-group">
              <label>Address *</label>
              <input
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                disabled={!isEditing}
                placeholder="Your address"
              />
              {errors.address && <span className="cs-error">{errors.address}</span>}
            </div>
            <div className="cs-form-group">
              <label>Experience</label>
              <input
                value={form.experience}
                onChange={e => setForm({ ...form, experience: e.target.value })}
                disabled={!isEditing}
                placeholder="e.g. 5 years"
              />
            </div>
          </div>
          <div className="cs-form-group">
            <label>About / Bio</label>
            <textarea
              rows="3"
              value={form.about}
              onChange={e => setForm({ ...form, about: e.target.value })}
              disabled={!isEditing}
              placeholder="Describe your cleaning service..."
            />
          </div>

          {isEditing && (
            <div className="cs-form-row">
              <button className="cs-cancel-outline-btn"
                onClick={handleCancel} disabled={saving}>
                Cancel
              </button>
              <button className="cs-submit-btn"
                onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : '💾 Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Service Type */}
      <div className="cs-section">
        <h3 className="cs-section-title">🧹 Service Type</h3>
        <div className="cs-service-options">
          {serviceOptions.map(opt => (
            <div
              key={opt.label}
              className={`cs-service-option ${selectedService === opt.label ? 'active' : ''}`}
              onClick={() => isEditing && setSelectedService(opt.label)}
              style={{ cursor: isEditing ? 'pointer' : 'default' }}
            >
              <span className="cs-service-option-icon">{opt.icon}</span>
              <span className="cs-service-option-label">{opt.label}</span>
              {selectedService === opt.label && (
                <span className="cs-service-option-check">✓</span>
              )}
            </div>
          ))}
        </div>
        {!isEditing && (
          <p className="cs-hint" style={{ marginTop: '10px' }}>
            Click ✏️ Edit Profile to change your service type.
          </p>
        )}
      </div>

      {/* Rates */}
      <div className="cs-section">
        <h3 className="cs-section-title">💰 Service Rates (Rs.)</h3>
        <div className="cs-rates-grid">
          {Object.keys(rates).map(service => (
            <div key={service} className="cs-rate-card">
              <span className="cs-rate-icon">{serviceIcons[service]}</span>
              <label>{service}</label>
              <input
                type="number"
                min="0"
                value={rates[service]}
                disabled={!isEditing}
                onChange={e => setRates({ ...rates, [service]: e.target.value })}
              />
              <span className="cs-rate-unit">per session</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default CleaningProfile;