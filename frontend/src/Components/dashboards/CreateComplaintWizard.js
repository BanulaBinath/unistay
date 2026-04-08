import React, { useState, useEffect } from 'react';
import { createTicket } from '../../services/ticketApi';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './CreateComplaintWizard.css';

const CreateComplaintWizard = ({ onCancel, onSuccess }) => {
  const { token } = useAuth();
  const [step, setStep] = useState(1);
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
    serviceItemReference: '',
    attachment: null
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

  const categoryToComplaintTypes = {
    food: ['service_not_delivered', 'poor_quality', 'late_delivery', 'wrong_item', 'bad_behavior', 'payment_issue', 'other'],
    boarding: ['poor_quality', 'bad_behavior', 'payment_issue', 'fraud_or_fake_service', 'cleanliness_issue', 'other'],
    laundry: ['service_not_delivered', 'poor_quality', 'late_delivery', 'wrong_item', 'bad_behavior', 'payment_issue', 'other'],
    cleaning: ['service_not_delivered', 'poor_quality', 'late_delivery', 'bad_behavior', 'payment_issue', 'cleanliness_issue', 'other']
  };

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
        vendorId: '',
        complaintType: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData(prev => ({
        ...prev,
        attachment: e.target.files[0]
      }));
    }
  };

  const isStep1Valid = formData.serviceCategory && formData.complaintType;

  const handleNext = () => {
    if (isStep1Valid) {
      setStep(2);
      setError('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setError('Please select both category and complaint type.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.description || !formData.vendorId) {
      setError('Please fill in all required fields (Title, Description, Vendor).');
      return;
    }

    try {
      setLoading(true);
      
      // Use FormData if there's an attachment
      if (formData.attachment instanceof File) {
        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('complaintType', formData.complaintType);
        formDataToSend.append('serviceCategory', formData.serviceCategory);
        if (formData.vendorId) formDataToSend.append('vendorId', formData.vendorId);
        if (formData.vendorReference) formDataToSend.append('vendorReference', formData.vendorReference);
        if (formData.serviceItemReference) formDataToSend.append('serviceItemReference', formData.serviceItemReference);
        formDataToSend.append('complaintImage', formData.attachment);
        
        const response = await createTicket(formDataToSend, true);
        if (response.success) {
          onSuccess();
        }
      } else {
        // Send as JSON if no attachment
        const payload = {
          title: formData.title,
          description: formData.description,
          complaintType: formData.complaintType,
          serviceCategory: formData.serviceCategory,
          vendorId: formData.vendorId || undefined,
          vendorReference: formData.vendorReference || undefined,
          serviceItemReference: formData.serviceItemReference || undefined
        };
        
        const response = await createTicket(payload);
        if (response.success) {
          onSuccess();
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create complaint');    
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-complaint-wizard complaint-card ccp-form">
      <div className="wizard-header-minimal">
        <div className="step-breadcrumb">
          <span className={`breadcrumb-item ${step === 1 ? 'active' : 'completed'}`}>
            {step > 1 ? '✓' : '1'}
          </span>
          <span className="breadcrumb-separator">—</span>
          <span className={`breadcrumb-item ${step === 2 ? 'active' : ''}`}>2</span>
        </div>
        <h3 className="wizard-title">{step === 1 ? 'Choose Issue' : 'Complaint Details'}</h3>
      </div>

      {error && (
        <div className="error-message" id="ccp-error-banner">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">     
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="complaint-form" noValidate>

        {step === 1 && (
          <div className="ccp-form-section">
            <p className="ccp-section-label">
              <span>Step 1</span> Complaint Basics
            </p>

            <div className="form-group" style={{ marginBottom: '32px' }}>
              <label style={{ marginBottom: '16px', fontSize: '1rem' }}>
                Service Category <span className="req">*</span>
              </label>
              <div className="category-grid">
                {serviceCategories.map(cat => (
                  <div
                    key={cat.value}
                    className={`category-card ${formData.serviceCategory === cat.value ? 'selected' : ''} category-${cat.value}`}
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        serviceCategory: cat.value,
                        vendorId: '',
                        complaintType: ''
                      }));
                    }}
                  >
                    <div className="category-icon">
                      {cat.value === 'food' && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                          <line x1="6" y1="1" x2="6" y2="4"></line>
                          <line x1="10" y1="1" x2="10" y2="4"></line>
                          <line x1="14" y1="1" x2="14" y2="4"></line>
                        </svg>
                      )}
                      {cat.value === 'boarding' && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                          <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                      )}
                      {cat.value === 'laundry' && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="1" width="18" height="22" rx="2" ry="2"></rect>
                          <circle cx="12" cy="13" r="5"></circle>
                          <path d="M12 18a5 5 0 0 1 0-10"></path>
                        </svg>
                      )}
                      {cat.value === 'cleaning' && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 3v15"></path>
                          <path d="M6 21h12"></path>
                          <path d="M6 18h12v3H6z"></path>
                          <path d="M9 3h6"></path>
                        </svg>
                      )}
                    </div>
                    <div className="category-label">{cat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label style={{ marginBottom: '16px', fontSize: '1rem' }}>
                Complaint Type <span className="req">*</span>
              </label>
              {!formData.serviceCategory ? (
                <div className="empty-state-box">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                  <p>Please select a service category first</p>
                </div>
              ) : (
                <div className="complaint-type-grid">
                  {complaintTypes
                    .filter(type => categoryToComplaintTypes[formData.serviceCategory]?.includes(type.value))
                    .map(type => (
                      <div
                        key={type.value}
                        className={`complaint-type-card ${formData.complaintType === type.value ? 'selected' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, complaintType: type.value }))}
                      >
                        <div className="complaint-type-radio">
                          {formData.complaintType === type.value && <div className="radio-dot"></div>}
                        </div>
                        <div className="complaint-type-content">
                          <div className="complaint-type-label">{type.label}</div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="form-actions" style={{ justifyContent: 'flex-end', marginTop: '32px' }}>
              <button
                type="button"
                className="submit-button"
                onClick={handleNext}
                disabled={!isStep1Valid}
              >
                Continue to Details
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="ccp-form-section">
            <p className="ccp-section-label">
              <span>Step 2</span> Complaint Details
            </p>

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

            <div className="form-row" style={{ marginBottom: '18px' }}>
              <div className="form-group">
                <label htmlFor="vendorId">Vendor <span className="req">*</span></label>
                <div className="ccp-select-wrapper">
                  <select
                    id="vendorId"
                    name="vendorId"
                    value={formData.vendorId}
                    onChange={handleChange}
                    required
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
                <label htmlFor="vendorReference">Vendor Reference <span className="opt">(optional)</span></label>       
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
              <label htmlFor="serviceItemReference">Service / Item Reference <span className="opt">(optional)</span></label>
              <input
                type="text"
                id="serviceItemReference"
                name="serviceItemReference"
                value={formData.serviceItemReference}
                onChange={handleChange}
                placeholder="Order number, room number, etc."
              />
            </div>

            <div className="form-group" style={{ marginTop: '18px' }}>
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

            <div className="form-group" style={{ marginTop: '18px' }}>
              <label htmlFor="attachment">
                Attachment / Proof Upload <span className="opt">(optional)</span>
              </label>
              <input
                type="file"
                id="attachment"
                name="attachment"
                onChange={handleFileChange}
                accept="image/*,.pdf"
              />
              {formData.attachment && (
                <div className="file-upload-hint">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <small>
                    {formData.attachment.name} ({(formData.attachment.size / 1024).toFixed(1)} KB)
                  </small>
                </div>
              )}
            </div>

            <div className="form-actions" style={{ justifyContent: 'space-between', marginTop: '24px' }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="cancel-button"
                disabled={loading}
              >
                Back
              </button>
              <button
                type="submit"
                className="submit-button"
                disabled={loading}
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
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateComplaintWizard;
