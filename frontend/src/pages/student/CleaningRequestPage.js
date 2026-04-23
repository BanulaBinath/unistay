import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../Components/common/Navbar';
import Footer from '../../Components/common/Footer';
import './CleaningRequestPage.css';
import api from '../../services/api';

function CleaningRequestPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab]           = useState('request');
  const [selectedVendor, setSelectedVendor] = useState(location.state?.selectedVendor || null);
  const [formData, setFormData]             = useState({
    serviceType:   '',
    hostelName:    '',
    roomNumber:    '',
    preferredDate: '',
    timeSlot:      '',
    notes:         '',
    location:      ''
  });
  const [totalPrice, setTotalPrice]           = useState(0);
  const [requests, setRequests]               = useState([]);
  const [message, setMessage]                 = useState('');
  const [loading, setLoading]                 = useState(false);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [ratingData, setRatingData]           = useState({ serviceId: '', stars: 0, review: '' });
  const [showRatingModal, setShowRatingModal] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  // ── Calculate price ──
  useEffect(() => {
    if (selectedVendor && formData.serviceType) {
      if (formData.serviceType === 'Room Cleaning')
        setTotalPrice(selectedVendor.rates?.['Room Cleaning'] || selectedVendor.roomRate || 0);
      else if (formData.serviceType === 'Bathroom Cleaning')
        setTotalPrice(selectedVendor.rates?.['Bathroom Cleaning'] || selectedVendor.bathroomRate || 0);
      else if (formData.serviceType === 'Room + Bathroom Cleaning')
        setTotalPrice(selectedVendor.rates?.['Room + Bathroom Cleaning'] || selectedVendor.bothRate || 0);
      else setTotalPrice(0);
    }
  }, [selectedVendor, formData.serviceType]);

  // ── Load my requests when tab switches ──
  useEffect(() => {
    if (activeTab === 'myRequests') {
      fetchMyRequests();
    }
  }, [activeTab]);

  const fetchMyRequests = async () => {
    setRequestsLoading(true);
    try {
      const res = await api.get('/cleaning/my-requests');
      setRequests(res.data.data || []);
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to load requests');
    } finally {
      setRequestsLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ── Submit request ──
  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    if (!selectedVendor) { setMessage('❌ Please select a vendor first!'); return; }
    if (!formData.serviceType) { setMessage('❌ Please select a service type!'); return; }
    setLoading(true);
    try {
      await api.post('/cleaning/request', {
        vendorId:    selectedVendor._id || selectedVendor.id,
        serviceType: formData.serviceType,
        requestDate: formData.preferredDate,
        timeSlot:    formData.timeSlot,
        hostelName:  formData.hostelName,
        roomNumber:  formData.roomNumber,
        specialNote: formData.notes,
        locationPin: formData.location,
        price:       totalPrice
      });
      setMessage('✅ Cleaning request submitted successfully!');
      resetForm();
      setActiveTab('myRequests');
    } catch (err) {
      console.error(err);
      setMessage(`❌ ${err.response?.data?.message || 'Failed to submit request'}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      serviceType: '', hostelName: '', roomNumber: '',
      preferredDate: '', timeSlot: '', notes: '', location: ''
    });
  };

  // ── Submit rating ──
  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/cleaning/request/${ratingData.serviceId}/rate`, {
        score:   ratingData.stars,
        comment: ratingData.review
      });
      setMessage('✅ Rating submitted successfully!');
      setShowRatingModal(false);
      setRatingData({ serviceId: '', stars: 0, review: '' });
      fetchMyRequests();
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to submit rating');
    }
  };

  const getStatusColor = (status) => ({
    'Pending':     '#f59e0b',
    'Accepted':    '#3b82f6',
    'In Progress': '#8b5cf6',
    'Completed':   '#10b981',
    'Cancelled':   '#ef4444'
  }[status] || '#6b7280');

  const getServiceIcon = (service) => {
    if (service === 'Room Cleaning')            return '🛏️';
    if (service === 'Bathroom Cleaning')        return '🚿';
    if (service === 'Room + Bathroom Cleaning') return '🏠';
    // legacy support
    if (service === 'Room')                     return '🛏️';
    if (service === 'Bathroom')                 return '🚿';
    return '🏠';
  };

  const vendorName = (req) =>
    req.vendor?.businessName || req.vendor?.fullName || 'N/A';

  const formatDate = (d) =>
    d ? new Date(d).toISOString().split('T')[0] : '—';

  return (
    <div className="crp-page">
      <Navbar />
      <div className="crp-container">

        {/* Header */}
        <div className="crp-header">
          <div>
            <h1>🧹 Cleaning Service</h1>
            <p>Book professional room cleaning for your hostel</p>
          </div>
          <button className="crp-back-btn" onClick={() => navigate('/services', { state: { activeService: 'cleaning' } })}>
            ← Back to Vendors
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`crp-alert ${message.includes('✅') ? 'crp-alert-success' : 'crp-alert-error'}`}>
            {message}
            <button onClick={() => setMessage('')}>✕</button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="crp-tab-nav">
          <button
            className={`crp-tab-btn ${activeTab === 'request' ? 'active' : ''}`}
            onClick={() => setActiveTab('request')}
          >
            📝 New Request
          </button>
          <button
            className={`crp-tab-btn ${activeTab === 'myRequests' ? 'active' : ''}`}
            onClick={() => setActiveTab('myRequests')}
          >
            📋 My Requests
          </button>
        </div>

        {/* TAB 1: New Request */}
        {activeTab === 'request' && (
          <div className="crp-request-section">
            {selectedVendor ? (
              <div className="crp-vendor-banner crp-vendor-selected">
                ✅ Selected Vendor: <strong>
                  {selectedVendor.businessName || selectedVendor.name}
                </strong>
                <button onClick={() => navigate('/services', { state: { activeService: 'cleaning' } })}>Change Vendor</button>
              </div>
            ) : (
              <div className="crp-vendor-banner crp-vendor-none">
                ⚠️ No vendor selected.
                <button onClick={() => navigate('/services', { state: { activeService: 'cleaning' } })}>Browse Vendors</button>
              </div>
            )}

            <form onSubmit={handleSubmitRequest} className="crp-form">

              {/* Service Type */}
              <div className="crp-form-group">
                <label>Service Type *</label>
                <div className="crp-service-options">
                  {[
                    'Room Cleaning',
                    'Bathroom Cleaning',
                    'Room + Bathroom Cleaning'
                  ].map(type => (
                    <label key={type}
                      className={`crp-service-card ${formData.serviceType === type ? 'selected' : ''}`}>
                      <input
                        type="radio" name="serviceType" value={type}
                        checked={formData.serviceType === type}
                        onChange={handleFormChange}
                        style={{ display: 'none' }}
                      />
                      <span className="crp-service-icon">{getServiceIcon(type)}</span>
                      <span className="crp-service-label">{type}</span>
                      {selectedVendor && (
                        <span className="crp-service-price">
                          Rs. {selectedVendor.rates?.[type]
                            || (type === 'Room Cleaning'            ? selectedVendor.roomRate
                              : type === 'Bathroom Cleaning'        ? selectedVendor.bathroomRate
                              : selectedVendor.bothRate)
                            || 'N/A'}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              <div className="crp-form-row">
                <div className="crp-form-group">
                  <label>Hostel Name *</label>
                  <select name="hostelName" value={formData.hostelName}
                    onChange={handleFormChange} required>
                    <option value="">-- Select Hostel --</option>
                    <option value="Block A">Block A</option>
                    <option value="Block B">Block B</option>
                    <option value="Block C">Block C</option>
                    <option value="Block D">Block D</option>
                  </select>
                </div>
                <div className="crp-form-group">
                  <label>Room Number *</label>
                  <input type="text" name="roomNumber" placeholder="e.g. A-204"
                    value={formData.roomNumber} onChange={handleFormChange} required />
                </div>
              </div>

              <div className="crp-form-row">
                <div className="crp-form-group">
                  <label>Preferred Date *</label>
                  <input type="date" name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleFormChange} min={today} required />
                </div>
                <div className="crp-form-group">
                  <label>Preferred Time Slot *</label>
                  <select name="timeSlot" value={formData.timeSlot}
                    onChange={handleFormChange} required>
                    <option value="">-- Select Time --</option>
                    <option value="08:00 - 10:00">08:00 - 10:00 AM</option>
                    <option value="10:00 - 12:00">10:00 - 12:00 PM</option>
                    <option value="12:00 - 14:00">12:00 - 02:00 PM</option>
                    <option value="14:00 - 16:00">02:00 - 04:00 PM</option>
                    <option value="16:00 - 18:00">04:00 - 06:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="crp-form-group">
                <label>Optional Notes</label>
                <textarea name="notes" placeholder="Any special instructions..."
                  value={formData.notes} onChange={handleFormChange} rows="3" />
              </div>

              <div className="crp-form-group">
                <label>📍 Location Pin (Google Maps link)</label>
                <input type="text" name="location"
                  placeholder="Paste Google Maps link here"
                  value={formData.location} onChange={handleFormChange} />
              </div>

              {selectedVendor && formData.serviceType && (
                <div className="crp-price-calc">
                  <span>💰 Total Price:</span>
                  <span className="crp-price-service">
                    {getServiceIcon(formData.serviceType)} {formData.serviceType}
                  </span>
                  <span className="crp-price-total">Rs. {totalPrice}</span>
                </div>
              )}

              <button type="submit" className="crp-submit-btn" disabled={loading}>
                {loading ? 'Submitting...' : '🚀 Submit Request'}
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: My Requests */}
        {activeTab === 'myRequests' && (
          <div className="crp-requests-section">
            <h3>My Cleaning Requests</h3>

            {/* Loading */}
            {requestsLoading && <p>⏳ Loading your requests...</p>}

            {/* Empty */}
            {!requestsLoading && requests.length === 0 && (
              <div className="crp-empty">
                <p>😕 No requests yet. Submit your first cleaning request!</p>
              </div>
            )}

            {/* Table */}
            {!requestsLoading && requests.length > 0 && (
              <div className="crp-table-wrapper">
                <table className="crp-table">
                  <thead>
                    <tr>
                      <th>Request ID</th>
                      <th>Vendor</th>
                      <th>Service</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map(req => (
                      <tr key={req._id}>
                        <td><strong>{req._id.slice(-6).toUpperCase()}</strong></td>
                        <td>{vendorName(req)}</td>
                        <td>{getServiceIcon(req.serviceType)} {req.serviceType}</td>
                        <td>{formatDate(req.requestDate)}</td>
                        <td>Rs. {req.price}</td>
                        <td>
                          <span className="crp-status-badge"
                            style={{ backgroundColor: getStatusColor(req.status) }}>
                            {req.status}
                          </span>
                        </td>
                        <td className="crp-action-btns">
                          {req.status === 'Completed' && !req.rating?.score && (
                            <button className="crp-rate-btn"
                              onClick={() => {
                                setRatingData({ ...ratingData, serviceId: req._id });
                                setShowRatingModal(true);
                              }}>
                              ⭐ Rate
                            </button>
                          )}
                          {req.rating?.score && (
                            <span className="crp-rated-badge">
                              ⭐ {req.rating.score}/5
                            </span>
                          )}
                          <button className="crp-complaint-btn"
                            onClick={() => navigate('/student/complaints/new', {
                              state: {
                                serviceId:   req._id,
                                serviceType: 'Cleaning',
                                vendorName:  vendorName(req)
                              }
                            })}>
                            ⚠️ Complaint
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Rating Modal */}
        {showRatingModal && (
          <div className="crp-modal-overlay">
            <div className="crp-modal">
              <h3>⭐ Rate Service</h3>
              <p>Request ID: <strong>{ratingData.serviceId.slice(-6).toUpperCase()}</strong></p>
              <form onSubmit={handleRatingSubmit}>
                <div className="crp-stars-row">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} type="button"
                      className={`crp-star-btn ${ratingData.stars >= star ? 'active' : ''}`}
                      onClick={() => setRatingData({ ...ratingData, stars: star })}>★</button>
                  ))}
                </div>
                <textarea placeholder="Write your review..."
                  value={ratingData.review}
                  onChange={e => setRatingData({ ...ratingData, review: e.target.value })}
                  rows="3" required />
                <div className="crp-modal-actions">
                  <button type="submit" className="crp-submit-btn">Submit Rating</button>
                  <button type="button" className="crp-cancel-btn"
                    onClick={() => setShowRatingModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
}

export default CleaningRequestPage;