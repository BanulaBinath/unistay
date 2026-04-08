import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './laundrystaff.css';
import api from '../../services/api';

const PICKUP_SLOTS = [
  '06:00 - 08:00',
  '08:00 - 10:00',
  '10:00 - 12:00',
  '12:00 - 14:00',
  '14:00 - 16:00',
  '16:00 - 18:00',
  '18:00 - 20:00',
];

function LaundryProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [message, setMessage]       = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);

  const [profile, setProfile] = useState({
    fullName:     '',
    businessName: '',
    address:      '',
    bio:          '',
    services:     [],
    pickupHours:  []   // ✅ changed from '' to []
  });

  const [rates, setRates] = useState({
    washFold:    '',
    dryCleaning: '',
    ironPress:   ''
  });

  const serviceOptions = ['Wash & Fold', 'Dry Cleaning', 'Iron Press'];

  // ── Load profile on mount ──
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res  = await api.get('/laundry/vendor/profile');
        const data = res.data.data;

        setProfile({
          fullName:     data.fullName     || '',
          businessName: data.businessName || '',
          address:      data.address      || '',
          bio:          data.about       || data.bio || '',
          services:     data.serviceType || [],
          pickupHours:  Array.isArray(data.pickupHours) ? data.pickupHours : [] // ✅ always array
        });

        setRates({
          washFold:    data.rates?.['Wash & Fold']  || data.rates?.washFold    || '',
          dryCleaning: data.rates?.['Dry Cleaning'] || data.rates?.dryCleaning || '',
          ironPress:   data.rates?.['Iron Press']   || data.rates?.ironPress   || ''
        });
      } catch (err) {
        console.error(err);
        setMessage('❌ Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleServiceToggle = (service) => {
    const updated = profile.services.includes(service)
      ? profile.services.filter(s => s !== service)
      : [...profile.services, service];
    setProfile({ ...profile, services: updated });
    setFormErrors({ ...formErrors, services: '' });
  };

  // ✅ New: toggle pickup hour slots
  const handlePickupToggle = (slot) => {
    const updated = profile.pickupHours.includes(slot)
      ? profile.pickupHours.filter(s => s !== slot)
      : [...profile.pickupHours, slot];
    setProfile({ ...profile, pickupHours: updated });
    setFormErrors({ ...formErrors, pickupHours: '' });
  };

  const validateProfile = () => {
    const errors = {};
    const onlyLetters = /^[a-zA-Z\s]+$/;
    const noSymbols   = /^[a-zA-Z0-9\s]+$/;

    if (!profile.fullName.trim()) {
      errors.fullName = '❌ Full name is required.';
    } else if (profile.fullName.trim().length < 3) {
      errors.fullName = '❌ Name must be at least 3 characters.';
    } else if (!onlyLetters.test(profile.fullName.trim())) {
      errors.fullName = '❌ Name must contain only letters and spaces.';
    }

    if (profile.services.length === 0) {
      errors.services = '❌ Please select at least one service.';
    }

    // ✅ changed from string check to array length check
    if (profile.pickupHours.length === 0) {
      errors.pickupHours = '❌ Please select at least one pickup slot.';
    }

    if (profile.bio.trim() && !noSymbols.test(profile.bio.trim())) {
      errors.bio = '❌ Description must not contain symbols.';
    }

    if (!rates.washFold    || rates.washFold < 1)    errors.washFold    = '❌ Minimum rate is Rs. 1.';
    if (!rates.dryCleaning || rates.dryCleaning < 1) errors.dryCleaning = '❌ Minimum rate is Rs. 1.';
    if (!rates.ironPress   || rates.ironPress < 1)   errors.ironPress   = '❌ Minimum rate is Rs. 1.';

    return errors;
  };

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: '' });
  };

  const handleRatesChange = (e) => {
    setRates({ ...rates, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: '' });
  };

  // ── Save profile ──
  const handleScrollToForm = () => {
    document.getElementById('ls-profile-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const errors = validateProfile();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setMessage('❌ Please fix the errors before saving.');
      return;
    }

    setSaving(true);
    try {
      await api.put('/laundry/vendor/profile', {
        fullName:    profile.fullName,
        address:     profile.address,
        about:       profile.bio,
        serviceType: profile.services,
        pickupHours: profile.pickupHours,   // ✅ sends array
        rates: {
          'Wash & Fold':  rates.washFold,
          'Dry Cleaning': rates.dryCleaning,
          'Iron Press':   rates.ironPress
        }
      });
      setMessage('✅ Profile updated successfully!');
    } catch (err) {
      console.error(err);
      setMessage(`❌ ${err.response?.data?.message || 'Failed to update profile'}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="ls-page">
        <div className="ls-loading"><p>⏳ Loading profile...</p></div>
      </div>
    );
  }

  return (
    <div className="ls-page">

      {/* Header */}
      <div className="ls-header">
        <div>
          <h1>👤 My Profile</h1>
          <p>Update your laundry service profile and rates</p>
        </div>
        <button className="ls-back-btn"
          onClick={() => navigate('/laundry-vendor/dashboard')}>
          ← Back to Dashboard
        </button>
      </div>

      <div className="ls-section">
        <div className="ls-profile-top">
          <div className="ls-avatar">
            {profile.fullName?.charAt(0).toUpperCase() || 'L'}
          </div>
          <div className="ls-profile-info">
            <h2>{profile.fullName || 'Laundry Vendor'}</h2>
            {profile.businessName && <p>{profile.businessName}</p>}
            {user?.email && <p>{user.email}</p>}
            {profile.address && <p>📍 {profile.address}</p>}
            <div className="ls-service-tags">
              {profile.services.length > 0 ? (
                profile.services.map(service => (
                  <span key={service} className="ls-tag">{service}</span>
                ))
              ) : (
                <span className="ls-tag ls-tag-muted">No services selected yet</span>
              )}
            </div>
          </div>
          <button className="ls-edit-btn" type="button" onClick={handleScrollToForm}>
            ✏️ Edit Profile
          </button>
        </div>
      </div>

      {/* Alert */}
      {message && (
        <div className={`ls-alert ${message.includes('✅') ? 'ls-alert-success' : 'ls-alert-error'}`}>
          {message}
          <button onClick={() => setMessage('')}>✕</button>
        </div>
      )}

      {/* Form */}
      <div className="ls-section">
        <form id="ls-profile-form" onSubmit={handleSaveProfile} className="ls-form">

          <h3 className="ls-section-title">👤 Profile Setup</h3>

          <div className="ls-form-row">
            {/* Full Name */}
            <div className="ls-form-group">
              <label>Full Name *</label>
              <input
                type="text" name="fullName"
                value={profile.fullName}
                onChange={handleProfileChange}
                placeholder="Your full name (letters only)"
                style={{ borderColor: formErrors.fullName ? '#ef4444' : '' }}
              />
              {formErrors.fullName &&
                <span className="ls-error">{formErrors.fullName}</span>}
            </div>

            {/* Address */}
            <div className="ls-form-group">
              <label>Address</label>
              <input
                type="text" name="address"
                value={profile.address}
                onChange={handleProfileChange}
                placeholder="Your service address"
              />
            </div>
          </div>

          <div className="ls-form-row">
            {/* ✅ Pickup Hours — now a checkbox group */}
            <div className="ls-form-group">
              <label>Available Pickup Hours *</label>
              <div className="ls-checkbox-group"
                style={{ borderColor: formErrors.pickupHours ? '#ef4444' : '' }}>
                {PICKUP_SLOTS.map(slot => (
                  <label key={slot} className="ls-checkbox-item">
                    <input
                      type="checkbox"
                      checked={profile.pickupHours.includes(slot)}
                      onChange={() => handlePickupToggle(slot)}
                    />
                    {slot}
                  </label>
                ))}
              </div>
              {formErrors.pickupHours &&
                <span className="ls-error">{formErrors.pickupHours}</span>}
            </div>
          </div>

          {/* Services Offered */}
          <div className="ls-form-group">
            <label>Services Offered *</label>
            <div className="ls-checkbox-group"
              style={{ borderColor: formErrors.services ? '#ef4444' : '' }}>
              {serviceOptions.map(option => (
                <label key={option} className="ls-checkbox-item">
                  <input
                    type="checkbox"
                    checked={profile.services.includes(option)}
                    onChange={() => handleServiceToggle(option)}
                  />
                  {option}
                </label>
              ))}
            </div>
            {formErrors.services &&
              <span className="ls-error">{formErrors.services}</span>}
          </div>

          {/* Bio */}
          <div className="ls-form-group">
            <label>Description / Bio</label>
            <textarea
              name="bio" rows="3"
              value={profile.bio}
              onChange={handleProfileChange}
              placeholder="Tell students about your laundry service (no symbols)"
              style={{ borderColor: formErrors.bio ? '#ef4444' : '' }}
            />
            {formErrors.bio
              ? <span className="ls-error">{formErrors.bio}</span>
              : <span className="ls-hint">Letters and numbers only — no symbols</span>
            }
          </div>

          {/* Rates */}
          <h3 className="ls-section-title" style={{ marginTop: '28px' }}>
            💰 Rates Setup (Rs per dress)
          </h3>
          <div className="ls-rates-grid">
            <div className="ls-rate-card">
              <span className="ls-rate-icon">👕</span>
              <label>Wash & Fold</label>
              <input type="number" name="washFold"
                value={rates.washFold} onChange={handleRatesChange} min="1"
                placeholder="Rs."
                style={{ borderColor: formErrors.washFold ? '#ef4444' : '' }}
              />
              {formErrors.washFold &&
                <span className="ls-error" style={{ fontSize: '11px' }}>
                  {formErrors.washFold}
                </span>}
              <span className="ls-rate-unit">Rs / dress</span>
            </div>

            <div className="ls-rate-card">
              <span className="ls-rate-icon">🧴</span>
              <label>Dry Cleaning</label>
              <input type="number" name="dryCleaning"
                value={rates.dryCleaning} onChange={handleRatesChange} min="1"
                placeholder="Rs."
                style={{ borderColor: formErrors.dryCleaning ? '#ef4444' : '' }}
              />
              {formErrors.dryCleaning &&
                <span className="ls-error" style={{ fontSize: '11px' }}>
                  {formErrors.dryCleaning}
                </span>}
              <span className="ls-rate-unit">Rs / dress</span>
            </div>

            <div className="ls-rate-card">
              <span className="ls-rate-icon">🔥</span>
              <label>Iron Press</label>
              <input type="number" name="ironPress"
                value={rates.ironPress} onChange={handleRatesChange} min="1"
                placeholder="Rs."
                style={{ borderColor: formErrors.ironPress ? '#ef4444' : '' }}
              />
              {formErrors.ironPress &&
                <span className="ls-error" style={{ fontSize: '11px' }}>
                  {formErrors.ironPress}
                </span>}
              <span className="ls-rate-unit">Rs / dress</span>
            </div>
          </div>

          <button type="submit" className="ls-submit-btn" disabled={saving}>
            {saving ? 'Saving...' : '💾 Save Profile & Rates'}
          </button>
        </form>
      </div>

    </div>
  );
}

export default LaundryProfile;