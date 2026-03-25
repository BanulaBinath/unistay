import React, { useState, useEffect } from 'react';
import './studentlaundry.css';
import ServicesSidebar from './ServicesSidebar';


function StudentLaundry() {
  const [activeTab, setActiveTab] = useState('vendors');
  const [vendors, setVendors] = useState([
    { id: 1, name: 'CleanPro Laundry', rate: 100, rating: 4.5, location: 'Block A' },
    { id: 2, name: 'FreshWash Services', rate: 150, rating: 4.2, location: 'Block B' },
    { id: 3, name: 'QuickClean', rate: 75, rating: 4.8, location: 'Block C' },
  ]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [formData, setFormData] = useState({
    serviceType: '',
    numberOfDresses: 1,
    hostelName: '',
    roomNumber: '',
    pickupDate: '',
    pickupTime: '',
    notes: '',
    location: ''
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [requests, setRequests] = useState([
    { id: 'LND001', vendor: 'CleanPro Laundry', service: 'Wash & Fold', dresses: 5, status: 'Completed', amount: 500 },
    { id: 'LND002', vendor: 'FreshWash Services', service: 'Iron Press', dresses: 3, status: 'In Progress', amount: 450 },
    { id: 'LND003', vendor: 'QuickClean', service: 'Dry Cleaning', dresses: 2, status: 'Pending', amount: 150 },
  ]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [ratingData, setRatingData] = useState({ serviceId: '', stars: 0, review: '' });
  const [complaintData, setComplaintData] = useState({ serviceId: '', description: '' });
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);


  useEffect(() => {
    if (selectedVendor && formData.numberOfDresses) {
      setTotalPrice(selectedVendor.rate * formData.numberOfDresses);
    }
  }, [selectedVendor, formData.numberOfDresses]);


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
      const response = await fetch('http://localhost:5000/api/laundry/request', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...formData, vendorId: selectedVendor.id, totalAmount: totalPrice })
      });
      const data = await response.json();
      if (response.ok) {
        const newRequest = {
          id: `LND00${requests.length + 1}`,
          vendor: selectedVendor.name,
          service: formData.serviceType,
          dresses: formData.numberOfDresses,
          status: 'Pending',
          amount: totalPrice
        };
        setRequests([...requests, newRequest]);
        setMessage('✅ Laundry request submitted successfully!');
        setFormData({ serviceType: '', numberOfDresses: 1, hostelName: '', roomNumber: '', pickupDate: '', pickupTime: '', notes: '', location: '' });
        setSelectedVendor(null);
        setActiveTab('myRequests');
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (error) {
      // Using mock data for now until backend is ready
      const newRequest = {
        id: `LND00${requests.length + 1}`,
        vendor: selectedVendor.name,
        service: formData.serviceType,
        dresses: formData.numberOfDresses,
        status: 'Pending',
        amount: totalPrice
      };
      setRequests([...requests, newRequest]);
      setMessage('✅ Request submitted! (Demo mode)');
      setActiveTab('myRequests');
    } finally {
      setLoading(false);
    }
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
    const colors = { 'Pending': '#f59e0b', 'Picked Up': '#3b82f6', 'In Progress': '#8b5cf6', 'Completed': '#10b981' };
    return colors[status] || '#6b7280';
  };


  const renderStars = (count) => '★'.repeat(count) + '☆'.repeat(5 - count);


  return (
    <div style={{ display: 'flex' }}>
      <ServicesSidebar />
      <div className="laundry-dashboard" style={{ marginLeft: '220px', flex: 1 }}>

        {/* Header */}
        <div className="laundry-header">
          <div>
            <h1>🧺 Laundry Service</h1>
            <p>Manage your laundry requests easily</p>
          </div>
        </div>


        {/* Message */}
        {message && (
          <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-error'}`}>
            {message}
            <button onClick={() => setMessage('')}>✕</button>
          </div>
        )}


        {/* Tab Navigation */}
        <div className="tab-nav">
          {['vendors', 'request', 'myRequests'].map(tab => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'vendors' ? '🏪 Browse Vendors' : tab === 'request' ? '📝 New Request' : '📋 My Requests'}
            </button>
          ))}
        </div>


        {/* TAB 1: Browse Vendors */}
        {activeTab === 'vendors' && (
          <div className="vendors-grid">
            {vendors.map(vendor => (
              <div key={vendor.id} className="vendor-card">
                <div className="vendor-avatar">{vendor.name.charAt(0)}</div>
                <h3>{vendor.name}</h3>
                <p className="vendor-location">📍 {vendor.location}</p>
                <p className="vendor-rating">⭐ {vendor.rating}/5</p>
                <div className="vendor-rate">
                  <span className="rate-label">Rate per dress</span>
                  <span className="rate-value">Rs. {vendor.rate}</span>
                </div>
                <button className="select-vendor-btn" onClick={() => handleSelectVendor(vendor)}>
                  Select Vendor
                </button>
              </div>
            ))}
          </div>
        )}


        {/* TAB 2: New Request Form */}
        {activeTab === 'request' && (
          <div className="request-section">
            {selectedVendor ? (
              <div className="selected-vendor-banner">
                ✅ Selected: <strong>{selectedVendor.name}</strong> — Rs. {selectedVendor.rate}/dress
                <button onClick={() => { setSelectedVendor(null); setActiveTab('vendors'); }}>Change</button>
              </div>
            ) : (
              <div className="no-vendor-banner">
                ⚠️ No vendor selected. <button onClick={() => setActiveTab('vendors')}>Browse Vendors</button>
              </div>
            )}


            <form onSubmit={handleSubmitRequest} className="request-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Service Type *</label>
                  <select name="serviceType" value={formData.serviceType} onChange={handleFormChange} required>
                    <option value="">-- Select Service --</option>
                    <option value="Wash & Fold">Wash & Fold</option>
                    <option value="Dry Cleaning">Dry Cleaning</option>
                    <option value="Iron Press">Iron Press</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Number of Dresses *</label>
                  <input type="number" name="numberOfDresses" min="1" value={formData.numberOfDresses} onChange={handleFormChange} required />
                </div>
              </div>


              <div className="form-row">
                <div className="form-group">
                  <label>Hostel Name *</label>
                  <select name="hostelName" value={formData.hostelName} onChange={handleFormChange} required>
                    <option value="">-- Select Hostel --</option>
                    <option value="Block A">Block A</option>
                    <option value="Block B">Block B</option>
                    <option value="Block C">Block C</option>
                    <option value="Block D">Block D</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Room Number *</label>
                  <input type="text" name="roomNumber" placeholder="e.g. A-204" value={formData.roomNumber} onChange={handleFormChange} required />
                </div>
              </div>


              <div className="form-row">
                <div className="form-group">
                  <label>Pickup Date *</label>
                  <input type="date" name="pickupDate" value={formData.pickupDate} onChange={handleFormChange} required />
                </div>
                <div className="form-group">
                  <label>Pickup Time *</label>
                  <input type="time" name="pickupTime" value={formData.pickupTime} onChange={handleFormChange} required />
                </div>
              </div>


              <div className="form-group">
                <label>Optional Notes</label>
                <textarea name="notes" placeholder="Any special instructions..." value={formData.notes} onChange={handleFormChange} rows="3" />
              </div>


              <div className="form-group">
                <label>📍 Location Pin (Google Maps link)</label>
                <input type="text" name="location" placeholder="Paste Google Maps link here" value={formData.location} onChange={handleFormChange} />
              </div>


              {/* Price Calculator */}
              {selectedVendor && formData.numberOfDresses > 0 && (
                <div className="price-calculator">
                  <span>💰 Estimated Price:</span>
                  <span className="price-formula">Rs. {selectedVendor.rate} × {formData.numberOfDresses} dresses</span>
                  <span className="price-total">= Rs. {totalPrice}</span>
                </div>
              )}


              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Submitting...' : '🚀 Submit Request'}
              </button>
            </form>
          </div>
        )}


        {/* TAB 3: My Requests */}
        {activeTab === 'myRequests' && (
          <div className="requests-section">
            <h3>My Laundry Requests</h3>
            <div className="requests-table-wrapper">
              <table className="requests-table">
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
                    <tr key={req.id}>
                      <td><strong>{req.id}</strong></td>
                      <td>{req.vendor}</td>
                      <td>{req.service}</td>
                      <td>{req.dresses}</td>
                      <td>Rs. {req.amount}</td>
                      <td>
                        <span className="status-badge" style={{ backgroundColor: getStatusColor(req.status) }}>
                          {req.status}
                        </span>
                      </td>
                      <td className="action-btns">
                        {req.status === 'Completed' && (
                          <button className="rate-btn" onClick={() => openRating(req.id)}>⭐ Rate</button>
                        )}
                        <button className="complaint-btn" onClick={() => openComplaint(req.id)}>⚠️ Complaint</button>
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
          <div className="modal-overlay">
            <div className="modal">
              <h3>⭐ Rate Service</h3>
              <p>Service ID: <strong>{ratingData.serviceId}</strong></p>
              <form onSubmit={handleRatingSubmit}>
                <div className="stars-row">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} type="button"
                      className={`star-btn ${ratingData.stars >= star ? 'active' : ''}`}
                      onClick={() => setRatingData({ ...ratingData, stars: star })}>★</button>
                  ))}
                </div>
                <textarea placeholder="Write your review..." value={ratingData.review}
                  onChange={e => setRatingData({ ...ratingData, review: e.target.value })} rows="3" required />
                <div className="modal-actions">
                  <button type="submit" className="submit-btn">Submit Rating</button>
                  <button type="button" className="cancel-btn" onClick={() => setShowRatingModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}


        {/* Complaint Modal */}
        {showComplaintModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>⚠️ Submit Complaint</h3>
              <div className="form-group">
                <label>Service ID (auto-filled)</label>
                <input type="text" value={complaintData.serviceId} readOnly className="readonly-input" />
              </div>
              <form onSubmit={handleComplaintSubmit}>
                <div className="form-group">
                  <label>Complaint Description *</label>
                  <textarea placeholder="Describe your issue..." value={complaintData.description}
                    onChange={e => setComplaintData({ ...complaintData, description: e.target.value })} rows="4" required />
                </div>
                <div className="modal-actions">
                  <button type="submit" className="submit-btn">Submit Complaint</button>
                  <button type="button" className="cancel-btn" onClick={() => setShowComplaintModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}


export default StudentLaundry;
