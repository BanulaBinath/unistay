import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTicket } from '../../services/ticketApi';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './CreateComplaintPage.css';

const CreateComplaintPage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [vendors, setVendors] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    complaintType: '',
    serviceCategory: '',
    vendorId: '',
    vendorReference: '',
    serviceItemReference: ''
  });

  const complaintTypes = [
    { value: 'service_not_delivered', label: 'Service Not Delivered' },
    { value: 'poor_quality', label: 'Poor Quality' },
    { value: 'late_delivery', label: 'Late Delivery' },
    { value: 'wrong_item', label: 'Wrong Item' },
    { value: 'bad_behavior', label: 'Bad Behavior' },
    { value: 'payment_issue', label: 'Payment Issue' },
    { value: 'fraud_or_fake_service', label: 'Fraud / Fake Service' },
    { value: 'cleanliness_issue', label: 'Cleanliness Issue' },
    { value: 'other', label: 'Other' }
  ];

  const serviceCategories = [
    { value: 'food', label: 'Food' },
    { value: 'boarding', label: 'Boarding' },
    { value: 'laundry', label: 'Laundry' },
    { value: 'cleaning', label: 'Cleaning' }
  ];

  useEffect(() => {
    fetchVendors();
  }, [formData.serviceCategory]);

  const fetchVendors = async () => {
    if (!formData.serviceCategory) return;
    
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const response = await axios.get(`${API_URL}/user/vendors?vendorType=${formData.serviceCategory}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setVendors(response.data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch vendors:', err);
      setVendors([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'serviceCategory') {
      setFormData(prev => ({
        ...prev,
        vendorId: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.description || !formData.complaintType || !formData.serviceCategory) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const response = await createTicket(formData);
      
      if (response.success) {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-complaint-page">

      {/* ── Topbar ── */}
      <header className="ccp-topbar">
        <a href="/" className="ccp-topbar-brand">
          <svg className="ccp-logo-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3L1 9L5 11.18V17.18L12 21L19 17.18V11.18L21 10.09V17H23V9L12 3ZM18.82 9L12 12.72L5.18 9L12 5.28L18.82 9ZM17 15.99L12 18.72L7 15.99V12.27L12 15L17 12.27V15.99Z"/>
          </svg>
          Unistay
        </a>

        <button onClick={() => navigate('/student/dashboard')} className="back-button" id="ccp-back-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back to Dashboard
        </button>
      </header>

      {/* ── Body ── */}
      <div className="ccp-body">

        {/* Page header */}
        <div className="ccp-page-header">
          <div className="ccp-header-badge">Submit a Complaint</div>
          <h1>What went wrong?</h1>
          <p className="ccp-header-sub">
            Describe your issue below. Our support team will review and respond within 24 hours.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="error-message" id="ccp-error-banner">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        {/* Form card */}
        <form onSubmit={handleSubmit} className="complaint-form" id="ccp-form" noValidate>

          {/* ── Section 1: Basic Info ── */}
          <div className="ccp-form-section">
            <p className="ccp-section-label">Complaint Details</p>

            {/* Title */}
            <div className="form-group" style={{ marginBottom: '18px' }}>
              <label htmlFor="title">
                Complaint Title <span className="req">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Brief summary of your complaint"
                maxLength="200"
                required
              />
            </div>

            {/* Category + Type */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="serviceCategory">
                  Service Category <span className="req">*</span>
                </label>
                <div className="ccp-select-wrapper">
                  <select
                    id="serviceCategory"
                    name="serviceCategory"
                    value={formData.serviceCategory}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {serviceCategories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="complaintType">
                  Complaint Type <span className="req">*</span>
                </label>
                <div className="ccp-select-wrapper">
                  <select
                    id="complaintType"
                    name="complaintType"
                    value={formData.complaintType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Type</option>
                    {complaintTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* ── Section 2: Vendor Info ── */}
          <div className="ccp-form-section">
            <p className="ccp-section-label">Vendor Information <span style={{ fontWeight: 400, letterSpacing: 0, textTransform: 'none', fontSize: '0.72rem', color: '#94a3b8', marginLeft: 4 }}>(optional)</span></p>

            <div className="form-row" style={{ marginBottom: '18px' }}>
              <div className="form-group">
                <label htmlFor="vendorId">Vendor</label>
                <div className="ccp-select-wrapper">
                  <select
                    id="vendorId"
                    name="vendorId"
                    value={formData.vendorId}
                    onChange={handleChange}
                  >
                    <option value="">Select Vendor</option>
                    {vendors.map(vendor => (
                      <option key={vendor._id} value={vendor._id}>
                        {vendor.businessName || vendor.fullName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="vendorReference">Vendor Reference</label>
                <input
                  type="text"
                  id="vendorReference"
                  name="vendorReference"
                  value={formData.vendorReference}
                  onChange={handleChange}
                  placeholder="Vendor name or reference"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="serviceItemReference">Service / Item Reference</label>
              <input
                type="text"
                id="serviceItemReference"
                name="serviceItemReference"
                value={formData.serviceItemReference}
                onChange={handleChange}
                placeholder="Order number, room number, etc."
              />
            </div>
          </div>

          {/* ── Section 3: Description ── */}
          <div className="ccp-form-section">
            <p className="ccp-section-label">Full Description</p>

            <div className="form-group">
              <label htmlFor="description">
                Description <span className="req">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide detailed information about your complaint — what happened, when, and how it affected you."
                rows="6"
                maxLength="2000"
                required
              />
              <small>{formData.description.length}/2000 characters</small>
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/student/dashboard')}
              className="cancel-button"
              disabled={loading}
              id="ccp-cancel-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={loading}
              id="ccp-submit-btn"
            >
              {loading ? (
                <>
                  <span className="ccp-btn-spinner" />
                  Submitting…
                </>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                  Submit Complaint
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateComplaintPage;
