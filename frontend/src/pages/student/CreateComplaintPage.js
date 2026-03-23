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
        navigate('/student/complaints');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-complaint-page">
      <div className="page-header">
        <button onClick={() => navigate('/student/dashboard')} className="back-button">
          ← Back to Dashboard
        </button>
        <h1>Submit a Complaint</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="complaint-form">
        <div className="form-group">
          <label htmlFor="title">Complaint Title *</label>
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

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="serviceCategory">Service Category *</label>
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

          <div className="form-group">
            <label htmlFor="complaintType">Complaint Type *</label>
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

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="vendorId">Vendor (Optional)</label>
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

          <div className="form-group">
            <label htmlFor="vendorReference">Vendor Reference (Optional)</label>
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
          <label htmlFor="serviceItemReference">Service/Item Reference (Optional)</label>
          <input
            type="text"
            id="serviceItemReference"
            name="serviceItemReference"
            value={formData.serviceItemReference}
            onChange={handleChange}
            placeholder="Order number, room number, etc."
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Provide detailed information about your complaint"
            rows="6"
            maxLength="2000"
            required
          />
          <small>{formData.description.length}/2000 characters</small>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/student/dashboard')}
            className="cancel-button"
            disabled={loading}
          >
            Cancel
          </button>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateComplaintPage;
