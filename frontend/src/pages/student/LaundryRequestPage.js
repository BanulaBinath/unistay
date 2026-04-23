import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../Components/common/Navbar';
import Footer from '../../Components/common/Footer';
import './LaundryRequestPage.css';
import api from '../../services/api';

function LaundryRequestPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab]             = useState('request');
  const [selectedVendor, setSelectedVendor]   = useState(location.state?.selectedVendor || null);
  const [formData, setFormData]               = useState({
    serviceType:     '',
    numberOfDresses: 1,
    hostelName:      '',
    roomNumber:      '',
    pickupDate:      '',
    pickupTime:      '',
    notes:           '',
    location:        ''
  });
  const [totalPrice, setTotalPrice]           = useState(0);
  const [requests, setRequests]               = useState([]);
  const [message, setMessage]                 = useState('');
  const [requestsError, setRequestsError]     = useState('');   // ✅ separate error state
  const [loading, setLoading]                 = useState(false);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [ratingData, setRatingData]           = useState({ serviceId: '', stars: 0, review: '' });
  const [showRatingModal, setShowRatingModal] = useState(false);

  const today       = new Date().toISOString().split('T')[0];
  const currentTime = new Date().toTimeString().slice(0, 5);

  // ── Calculate price ──────────────────────────────────────────
  // ✅ Fixed: use formData.serviceType as key, not hardcoded 'Wash & Fold'
  useEffect(() => {
    if (selectedVendor && formData.serviceType && formData.numberOfDresses > 0) {
      const rate = selectedVendor.rates?.[formData.serviceType] || 0;
      setTotalPrice(rate * Number(formData.numberOfDresses));
    } else {
      setTotalPrice(0);
    }
  }, [selectedVendor, formData.serviceType, formData.numberOfDresses]); // ✅ added serviceType

  // ── Load my requests on tab switch ──────────────────────────
  useEffect(() => {
    if (activeTab === 'myRequests') fetchMyRequests();
  }, [activeTab]);

  const fetchMyRequests = async () => {
    setRequestsLoading(true);
    setRequestsError('');                                         // ✅ clear previous error
    try {
      const res = await api.get('/laundry/my-requests');
      setRequests(res.data.data || []);
    } catch (err) {
      console.error('Failed to load requests', err);
      setRequestsError(
        `❌ Failed to load requests: ${err.response?.data?.message || err.message}`
      );
    } finally {
      setRequestsLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ── Submit new request ───────────────────────────────────────
  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    if (!selectedVendor) { setMessage('❌ Please select a vendor first!'); return; }
    if (!formData.serviceType) { setMessage('❌ Please select a service type!'); return; }
    if (totalPrice === 0) { setMessage('❌ Selected vendor has no rate for this service.'); return; }

    setLoading(true);
    try {
      await api.post('/laundry/request', {
        vendorId:    selectedVendor._id || selectedVendor.id,
        service:     formData.serviceType,
        quantity:    Number(formData.numberOfDresses),
        hostelName:  formData.hostelName,
        roomNumber:  formData.roomNumber,
        pickupDate:  formData.pickupDate,
        pickupTime:  formData.pickupTime,
        specialNote: formData.notes,
        locationPin: formData.location,
        price:       totalPrice
      });
      setMessage('✅ Laundry request submitted successfully!');
      resetForm();
      setActiveTab('myRequests');
      fetchMyRequests();
    } catch (err) {
      console.error(err);
      setMessage(`❌ ${err.response?.data?.message || 'Failed to submit request'}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      serviceType: '', numberOfDresses: 1, hostelName: '',
      roomNumber: '', pickupDate: '', pickupTime: '', notes: '', location: ''
    });
    setTotalPrice(0);
  };

  // ── Submit rating ────────────────────────────────────────────
  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/laundry/request/${ratingData.serviceId}/rate`, {
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

  const getStatusColor = (status) => {
    const colors = {
      'Pending':     '#f59e0b',
      'Accepted':    '#3b82f6',
      'In Progress': '#8b5cf6',
      'Completed':   '#10b981',
      'Cancelled':   '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const vendorName = (req) =>
    req.vendor?.businessName || req.vendor?.fullName || 'N/A';

  // ✅ Get rate for currently selected service
  const selectedRate = selectedVendor?.rates?.[formData.serviceType] || 0;

  return (
    <div className="lrp-page">
      <Navbar />
      <div className="lrp-container">

        {/* Header */}
        <div className="lrp-header">
          <div>
            <h1>🧺 Laundry Service</h1>
            <p>Manage your laundry requests easily</p>
          </div>
          <button className="lrp-back-btn" onClick={() => navigate('/services', { state: { activeService: 'laundry' } })}>
            ← Back to Vendors
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`lrp-alert ${message.includes('✅') ? 'lrp-alert-success' : 'lrp-alert-error'}`}>
            {message}
            <button onClick={() => setMessage('')}>✕</button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="lrp-tab-nav">
          <button
            className={`lrp-tab-btn ${activeTab === 'request' ? 'active' : ''}`}
            onClick={() => setActiveTab('request')}>
            📝 New Request
          </button>
          <button
            className={`lrp-tab-btn ${activeTab === 'myRequests' ? 'active' : ''}`}
            onClick={() => setActiveTab('myRequests')}>
            📋 My Requests
          </button>
        </div>

        {/* TAB 1: New Request */}
        {activeTab === 'request' && (
          <div className="lrp-request-section">
            {selectedVendor ? (
              <div className="lrp-vendor-banner lrp-vendor-selected">
                ✅ Selected Vendor: <strong>
                  {selectedVendor.businessName || selectedVendor.fullName}
                </strong>
                <button onClick={() => navigate('/services', { state: { activeService: 'laundry' } })}>Change Vendor</button>
              </div>
            ) : (
              <div className="lrp-vendor-banner lrp-vendor-none">
                ⚠️ No vendor selected.
                <button onClick={() => navigate('/services', { state: { activeService: 'laundry' } })}>Browse Vendors</button>
              </div>
            )}

            <form onSubmit={handleSubmitRequest} className="lrp-form">
              <div className="lrp-form-row">
                <div className="lrp-form-group">
                  <label>Service Type *</label>
                  <select name="serviceType" value={formData.serviceType}
                    onChange={handleFormChange} required>
                    <option value="">-- Select Service --</option>
                    {/* ✅ Only show services the vendor actually offers */}
                    {selectedVendor
                      ? (selectedVendor.serviceType || []).map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))
                      : (
                        <>
                          <option value="Wash & Fold">Wash & Fold</option>
                          <option value="Dry Cleaning">Dry Cleaning</option>
                          <option value="Iron Press">Iron Press</option>
                        </>
                      )
                    }
                  </select>
                </div>
                <div className="lrp-form-group">
                  <label>Number of Dresses *</label>
                  <input type="number" name="numberOfDresses" min="1"
                    value={formData.numberOfDresses}
                    onChange={handleFormChange} required />
                </div>
              </div>

              <div className="lrp-form-row">
                <div className="lrp-form-group">
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
                <div className="lrp-form-group">
                  <label>Room Number *</label>
                  <input type="text" name="roomNumber" placeholder="e.g. A-204"
                    value={formData.roomNumber}
                    onChange={handleFormChange} required />
                </div>
              </div>

              <div className="lrp-form-row">
                <div className="lrp-form-group">
                  <label>Pickup Date *</label>
                  <input type="date" name="pickupDate" value={formData.pickupDate}
                    onChange={handleFormChange} min={today} required />
                </div>
                <div className="lrp-form-group">
                  <label>Pickup Time *</label>
                  <input type="time" name="pickupTime" value={formData.pickupTime}
                    onChange={handleFormChange}
                    min={formData.pickupDate === today ? currentTime : '00:00'} required />
                </div>
              </div>

              <div className="lrp-form-group">
                <label>Optional Notes</label>
                <textarea name="notes" placeholder="Any special instructions..."
                  value={formData.notes} onChange={handleFormChange} rows="3" />
              </div>

              <div className="lrp-form-group">
                <label>📍 Location Pin (Google Maps link)</label>
                <input type="text" name="location"
                  placeholder="Paste Google Maps link here"
                  value={formData.location} onChange={handleFormChange} />
              </div>

              {/* ✅ Price calculation using selected service type */}
              {selectedVendor && formData.serviceType && formData.numberOfDresses > 0 && (
                <div className="lrp-price-calc">
                  <span>💰 Estimated Price:</span>
                  <span className="lrp-price-formula">
                    Rs. {selectedRate} × {formData.numberOfDresses} dresses
                  </span>
                  <span className="lrp-price-total">= Rs. {totalPrice}</span>
                  {selectedRate === 0 && (
                    <span style={{ color: '#ef4444', fontSize: '13px' }}>
                      ⚠️ Vendor has not set a rate for this service
                    </span>
                  )}
                </div>
              )}

              <button type="submit" className="lrp-submit-btn" disabled={loading}>
                {loading ? 'Submitting...' : '🚀 Submit Request'}
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: My Requests */}
        {activeTab === 'myRequests' && (
          <div className="lrp-requests-section">
            <h3>My Laundry Requests</h3>

            {requestsLoading && <p>⏳ Loading your requests...</p>}

            {/* ✅ Separate error shown here, doesn't overwrite success message */}
            {!requestsLoading && requestsError && (
              <div className="lrp-alert lrp-alert-error">
                {requestsError}
                <button onClick={fetchMyRequests}>🔄 Retry</button>
              </div>
            )}

            {!requestsLoading && !requestsError && requests.length === 0 && (
              <div className="lrp-empty">
                <p>😕 No requests yet. Submit your first laundry request!</p>
              </div>
            )}

            {!requestsLoading && !requestsError && requests.length > 0 && (
              <div className="lrp-table-wrapper">
                <table className="lrp-table">
                  <thead>
                    <tr>
                      <th>Request ID</th>
                      <th>Vendor</th>
                      <th>Service</th>
                      <th>Dresses</th>
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
                        <td>{req.service}</td>
                        <td>{req.quantity}</td>
                        <td>Rs. {req.price}</td>
                        <td>
                          <span className="lrp-status-badge"
                            style={{ backgroundColor: getStatusColor(req.status) }}>
                            {req.status}
                          </span>
                        </td>
                        <td className="lrp-action-btns">
                          {req.status === 'Completed' && !req.rating?.score && (
                            <button className="lrp-rate-btn"
                              onClick={() => {
                                setRatingData({ ...ratingData, serviceId: req._id });
                                setShowRatingModal(true);
                              }}>
                              ⭐ Rate
                            </button>
                          )}
                          {req.rating?.score && (
                            <span className="lrp-rated-badge">⭐ {req.rating.score}/5</span>
                          )}
                          <button className="lrp-complaint-btn"
                            onClick={() => navigate('/student/complaints/new', {
                              state: {
                                serviceId:   req._id,
                                serviceType: 'Laundry',
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
          <div className="lrp-modal-overlay">
            <div className="lrp-modal">
              <h3>⭐ Rate Service</h3>
              <p>Request ID: <strong>{ratingData.serviceId.slice(-6).toUpperCase()}</strong></p>
              <form onSubmit={handleRatingSubmit}>
                <div className="lrp-stars-row">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} type="button"
                      className={`lrp-star-btn ${ratingData.stars >= star ? 'active' : ''}`}
                      onClick={() => setRatingData({ ...ratingData, stars: star })}>★</button>
                  ))}
                </div>
                <textarea placeholder="Write your review..."
                  value={ratingData.review}
                  onChange={e => setRatingData({ ...ratingData, review: e.target.value })}
                  rows="3" required />
                <div className="lrp-modal-actions">
                  <button type="submit" className="lrp-submit-btn">Submit Rating</button>
                  <button type="button" className="lrp-cancel-btn"
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

export default LaundryRequestPage;