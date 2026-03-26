import React, { useState, useEffect } from 'react';
import './studentcleaning.css';
import ServicesSidebar from './ServicesSidebar';

function StudentCleaning() {
  const [activeTab, setActiveTab] = useState('vendors');
  const [vendors] = useState([
    { id: 1, name: 'SparkleClean', roomRate: 300, bathroomRate: 200, bothRate: 400, location: 'Block A' },
    { id: 2, name: 'FreshSpace Services', roomRate: 450, bathroomRate: 250, bothRate: 550, location: 'Block B' },
    { id: 3, name: 'ProClean Co.', roomRate: 200, bathroomRate: 200, bothRate: 500, location: 'Block C' },
  ]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [formData, setFormData] = useState({
    serviceType: '',
    hostelName: '',
    roomNumber: '',
    preferredDate: '',
    timeSlot: '',
    location: '',
    notes: ''
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [requests, setRequests] = useState([
    { id: 'CLN001', vendor: 'SparkleClean', service: 'Room', date: '2026-03-20', status: 'Completed', amount: 300 },
    { id: 'CLN002', vendor: 'FreshSpace Services', service: 'Bathroom', date: '2026-03-22', status: 'In Progress', amount: 250 },
    { id: 'CLN003', vendor: 'ProClean Co.', service: 'Room+Bathroom', date: '2026-03-24', status: 'Pending', amount: 500 },
  ]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [ratingData, setRatingData] = useState({ serviceId: '', stars: 0, review: '' });
  const [complaintData, setComplaintData] = useState({ serviceId: '', description: '' });
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);

  useEffect(() => {
    if (selectedVendor && formData.serviceType) {
      if (formData.serviceType === 'Room') setTotalPrice(selectedVendor.roomRate);
      else if (formData.serviceType === 'Bathroom') setTotalPrice(selectedVendor.bathroomRate);
      else if (formData.serviceType === 'Room+Bathroom') setTotalPrice(selectedVendor.bothRate);
      else setTotalPrice(0);
    }
  }, [selectedVendor, formData.serviceType]);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectVendor = (vendor) => {
    setSelectedVendor(vendor);
    setActiveTab('request');
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    if (!selectedVendor) { setMessage('❌ Please select a vendor first!'); return; }
    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:5000/api/cleaning/request', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...formData, vendorId: selectedVendor.id, totalAmount: totalPrice })
      });
      const data = await response.json();
      if (response.ok) {
        addNewRequest();
        setMessage('✅ Cleaning request submitted successfully!');
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (error) {
      addNewRequest();
      setMessage('✅ Request submitted! (Demo mode)');
    } finally {
      setLoading(false);
    }
  };

  const addNewRequest = () => {
    const newRequest = {
      id: `CLN00${requests.length + 1}`,
      vendor: selectedVendor.name,
      service: formData.serviceType,
      date: formData.preferredDate,
      status: 'Pending',
      amount: totalPrice
    };
    setRequests([...requests, newRequest]);
    setFormData({ serviceType: '', hostelName: '', roomNumber: '', preferredDate: '', timeSlot: '', location: '', notes: '' });
    setSelectedVendor(null);
    setActiveTab('myRequests');
  };

  const handleRatingSubmit = (e) => {
    e.preventDefault();
    setMessage('✅ Rating submitted successfully!');
    setShowRatingModal(false);
    setRatingData({ serviceId: '', stars: 0, review: '' });
  };

  const handleComplaintSubmit = (e) => {
    e.preventDefault();
    setMessage('✅ Complaint submitted to vendor!');
    setShowComplaintModal(false);
    setComplaintData({ serviceId: '', description: '' });
  };

  const openRating = (reqId) => {
    setRatingData({ ...ratingData, serviceId: reqId });
    setShowRatingModal(true);
  };

  const openComplaint = (reqId) => {
    setComplaintData({ ...complaintData, serviceId: reqId });
    setShowComplaintModal(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': '#f59e0b',
      'In Progress': '#3b82f6',
      'Completed': '#10b981'
    };
    return colors[status] || '#6b7280';
  };

  const getServiceIcon = (service) => {
    if (service === 'Room') return '🛏️';
    if (service === 'Bathroom') return '🚿';
    return '🏠';
  };

  // ── DATE VALIDATION ──
  const today = new Date().toISOString().split('T')[0];

  return (
    <div style={{ display: 'flex' }}>
      <ServicesSidebar />
      <div className="cleaning-dashboard" style={{ marginLeft: '220px', flex: 1 }}>

        {/* Header */}
        <div className="cleaning-header">
          <div>
            <h1>🧹 Cleaning Service</h1>
            <p>Book professional room cleaning for your hostel</p>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`cl-alert ${message.includes('✅') ? 'cl-alert-success' : 'cl-alert-error'}`}>
            {message}
            <button onClick={() => setMessage('')}>✕</button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="cl-tab-nav">
          {['vendors', 'request', 'myRequests'].map(tab => (
            <button
              key={tab}
              className={`cl-tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'vendors' ? '🏪 Browse Vendors' : tab === 'request' ? '📝 New Request' : '📋 My Requests'}
            </button>
          ))}
        </div>

        {/* TAB 1: Browse Vendors */}
        {activeTab === 'vendors' && (
          <div className="cl-vendors-grid">
            {vendors.map(vendor => (
              <div key={vendor.id} className="cl-vendor-card">
                <div className="cl-vendor-avatar">{vendor.name.charAt(0)}</div>
                <h3>{vendor.name}</h3>
                <p className="cl-vendor-location">📍 {vendor.location}</p>
                <div className="cl-rates-table">
                  <div className="cl-rate-row">
                    <span>🛏️ Room only</span>
                    <span className="cl-rate-val">Rs. {vendor.roomRate}</span>
                  </div>
                  <div className="cl-rate-row">
                    <span>🚿 Bathroom only</span>
                    <span className="cl-rate-val">Rs. {vendor.bathroomRate}</span>
                  </div>
                  <div className="cl-rate-row highlight">
                    <span>🏠 Room + Bathroom</span>
                    <span className="cl-rate-val">Rs. {vendor.bothRate}</span>
                  </div>
                </div>
                <button className="cl-select-btn" onClick={() => handleSelectVendor(vendor)}>
                  Select Vendor
                </button>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: New Request Form */}
        {activeTab === 'request' && (
          <div className="cl-request-section">
            {selectedVendor ? (
              <div className="cl-selected-banner">
                ✅ Selected: <strong>{selectedVendor.name}</strong>
                <button onClick={() => { setSelectedVendor(null); setActiveTab('vendors'); }}>Change</button>
              </div>
            ) : (
              <div className="cl-no-vendor-banner">
                ⚠️ No vendor selected. <button onClick={() => setActiveTab('vendors')}>Browse Vendors</button>
              </div>
            )}

            <form onSubmit={handleSubmitRequest} className="cl-form">
              <div className="cl-form-group">
                <label>Service Type *</label>
                <div className="cl-service-options">
                  {['Room', 'Bathroom', 'Room+Bathroom'].map(type => (
                    <label key={type} className={`cl-service-card ${formData.serviceType === type ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="serviceType"
                        value={type}
                        checked={formData.serviceType === type}
                        onChange={handleFormChange}
                        style={{ display: 'none' }}
                      />
                      <span className="cl-service-icon">{getServiceIcon(type)}</span>
                      <span className="cl-service-label">{type}</span>
                      {selectedVendor && (
                        <span className="cl-service-price">
                          Rs. {type === 'Room' ? selectedVendor.roomRate : type === 'Bathroom' ? selectedVendor.bathroomRate : selectedVendor.bothRate}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              <div className="cl-form-row">
                <div className="cl-form-group">
                  <label>Hostel Name *</label>
                  <select name="hostelName" value={formData.hostelName} onChange={handleFormChange} required>
                    <option value="">-- Select Hostel --</option>
                    <option value="Block A">Block A</option>
                    <option value="Block B">Block B</option>
                    <option value="Block C">Block C</option>
                    <option value="Block D">Block D</option>
                  </select>
                </div>
                <div className="cl-form-group">
                  <label>Room Number *</label>
                  <input type="text" name="roomNumber" placeholder="e.g. A-204" value={formData.roomNumber} onChange={handleFormChange} required />
                </div>
              </div>

              <div className="cl-form-row">
                {/* ── UPDATED DATE INPUT ── */}
                <div className="cl-form-group">
                  <label>Preferred Date *</label>
                  <input
                    type="date"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleFormChange}
                    min={today}
                    required
                  />
                </div>
                <div className="cl-form-group">
                  <label>Preferred Time Slot *</label>
                  <select name="timeSlot" value={formData.timeSlot} onChange={handleFormChange} required>
                    <option value="">-- Select Time --</option>
                    <option value="08:00 - 10:00">08:00 - 10:00 AM</option>
                    <option value="10:00 - 12:00">10:00 - 12:00 PM</option>
                    <option value="12:00 - 14:00">12:00 - 02:00 PM</option>
                    <option value="14:00 - 16:00">02:00 - 04:00 PM</option>
                    <option value="16:00 - 18:00">04:00 - 06:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="cl-form-group">
                <label>📍 Location Pin (Google Maps link)</label>
                <input type="text" name="location" placeholder="Paste Google Maps link here" value={formData.location} onChange={handleFormChange} />
              </div>

              <div className="cl-form-group">
                <label>Optional Notes</label>
                <textarea name="notes" placeholder="Any special instructions..." value={formData.notes} onChange={handleFormChange} rows="3" />
              </div>

              {/* Price Display */}
              {selectedVendor && formData.serviceType && (
                <div className="cl-price-box">
                  <span>💰 Total Price:</span>
                  <span className="cl-price-service">{getServiceIcon(formData.serviceType)} {formData.serviceType}</span>
                  <span className="cl-price-total">Rs. {totalPrice}</span>
                </div>
              )}

              <button type="submit" className="cl-submit-btn" disabled={loading}>
                {loading ? '⏳ Submitting...' : '✅ Submit Cleaning Request'}
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: My Requests Table */}
        {activeTab === 'myRequests' && (
          <div className="cl-requests-section">
            <h3>🧹 My Cleaning Requests</h3>
            <div className="cl-table-wrapper">
              <table className="cl-table">
                <thead>
                  <tr>
                    <th>REQUEST ID</th>
                    <th>VENDOR</th>
                    <th>SERVICE</th>
                    <th>DATE</th>
                    <th>AMOUNT</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map(req => (
                    <tr key={req.id}>
                      <td><strong>{req.id}</strong></td>
                      <td>{req.vendor}</td>
                      <td>{getServiceIcon(req.service)} {req.service}</td>
                      <td>{req.date}</td>
                      <td>Rs. {req.amount}</td>
                      <td>
                        <span className="cl-status-badge" style={{ backgroundColor: getStatusColor(req.status) }}>
                          {req.status}
                        </span>
                      </td>
                      <td>
                        <div className="cl-action-btns">
                          {req.status === 'Completed' && (
                            <button className="cl-rate-btn" onClick={() => openRating(req.id)}>⭐ Rate</button>
                          )}
                          <button className="cl-complaint-btn" onClick={() => openComplaint(req.id)}>⚠️ Complaint</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Rating Modal */}
        {showRatingModal && (
          <div className="cl-modal-overlay">
            <div className="cl-modal">
              <h3>⭐ Rate this Service</h3>
              <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '16px' }}>
                Service ID: <strong>{ratingData.serviceId}</strong>
              </p>
              <form onSubmit={handleRatingSubmit}>
                <div className="cl-stars-row">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      className={`cl-star-btn ${ratingData.stars >= star ? 'active' : ''}`}
                      onClick={() => setRatingData({ ...ratingData, stars: star })}
                    >★</button>
                  ))}
                </div>
                <div className="cl-form-group" style={{ marginTop: '12px' }}>
                  <label>Written Review</label>
                  <textarea
                    placeholder="Share your experience..."
                    value={ratingData.review}
                    onChange={(e) => setRatingData({ ...ratingData, review: e.target.value })}
                    rows="3"
                    required
                  />
                </div>
                <div className="cl-modal-actions">
                  <button type="button" className="cl-cancel-btn" onClick={() => setShowRatingModal(false)}>Cancel</button>
                  <button type="submit" className="cl-submit-btn">Submit Rating</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Complaint Modal */}
        {showComplaintModal && (
          <div className="cl-modal-overlay">
            <div className="cl-modal">
              <h3>⚠️ Submit Complaint</h3>
              <form onSubmit={handleComplaintSubmit}>
                <div className="cl-form-group">
                  <label>Service ID</label>
                  <input type="text" value={complaintData.serviceId} readOnly className="cl-readonly-input" />
                </div>
                <div className="cl-form-group" style={{ marginTop: '12px' }}>
                  <label>Complaint Description *</label>
                  <textarea
                    placeholder="Describe your issue..."
                    value={complaintData.description}
                    onChange={(e) => setComplaintData({ ...complaintData, description: e.target.value })}
                    rows="4"
                    required
                  />
                </div>
                <div className="cl-modal-actions">
                  <button type="button" className="cl-cancel-btn" onClick={() => setShowComplaintModal(false)}>Cancel</button>
                  <button type="submit" className="cl-submit-btn">Submit Complaint</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default StudentCleaning;
