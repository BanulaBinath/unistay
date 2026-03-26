import React, { useState } from 'react';
import './laundryvendor.css';
import LaundryVendorSidebar from './LaundryVendorSidebar';

function LaundryVendorDashboard() {
  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [formErrors, setFormErrors] = useState({});

  const [profile, setProfile] = useState({
    fullName: '',
    bio: '',
    services: '',
    pickupHours: '',
    photo: null
  });

  const [rates, setRates] = useState({
    washFold: 100,
    dryCleaning: 200,
    ironPress: 75
  });

  const [jobs, setJobs] = useState([
    { id: 'LND001', student: 'Siddarth', room: 'A-204', service: 'Wash & Fold',  dresses: 5, price: 500, pickup: '2026-03-25 10:00', location: 'https://maps.google.com', status: 'Pending' },
    { id: 'LND002', student: 'Kavya',    room: 'B-101', service: 'Iron Press',   dresses: 3, price: 225, pickup: '2026-03-25 14:00', location: 'https://maps.google.com', status: 'In Progress' },
    { id: 'LND003', student: 'Rahul',    room: 'C-305', service: 'Dry Cleaning', dresses: 2, price: 400, pickup: '2026-03-24 09:00', location: 'https://maps.google.com', status: 'Completed' },
  ]);

  const [ratings] = useState([
    { id: 'LND001', student: 'Kavya', stars: 5, review: 'Excellent service! Very punctual.', date: '2026-03-22' },
    { id: 'LND003', student: 'Rahul', stars: 4, review: 'Good job, clothes were clean.',     date: '2026-03-23' },
  ]);

  const [complaints, setComplaints] = useState([
    { id: 'LND002', student: 'Siddarth', description: 'Clothes were returned late.', reply: '', date: '2026-03-23' },
  ]);

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedJob, setSelectedJob]         = useState(null);
  const [newStatus, setNewStatus]             = useState('');
  const [completionNote, setCompletionNote]   = useState('');
  const [cancelReason, setCancelReason]       = useState('');
  const [replyTexts, setReplyTexts]           = useState({});

  // ── PICKUP HOURS TIME SLOT OPTIONS ──
  const pickupHourOptions = [
    '06:00 - 08:00',
    '08:00 - 10:00',
    '10:00 - 12:00',
    '12:00 - 14:00',
    '14:00 - 16:00',
    '16:00 - 18:00',
    '18:00 - 20:00',
    '08:00 - 18:00',
    '06:00 - 20:00',
  ];

  // ── VALIDATION FUNCTION ──
  const validateProfile = () => {
    const errors = {};
    const onlyLetters       = /^[a-zA-Z\s]+$/;
    const lettersAndCommas  = /^[a-zA-Z\s,&]+$/;

    // Full Name
    if (!profile.fullName.trim()) {
      errors.fullName = '❌ Full name is required.';
    } else if (profile.fullName.trim().length < 3) {
      errors.fullName = '❌ Name must be at least 3 characters.';
    } else if (!onlyLetters.test(profile.fullName.trim())) {
      errors.fullName = '❌ Name must contain only letters and spaces.';
    }

    // Pickup Hours
    if (!profile.pickupHours) {
      errors.pickupHours = '❌ Please select a pickup time slot.';
    }

    // Services Offered
    if (profile.services.trim() && !lettersAndCommas.test(profile.services.trim())) {
      errors.services = '❌ Services must contain only letters (no numbers or symbols).';
    }

    // Photo validation
    if (profile.photo) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (!allowedTypes.includes(profile.photo.type)) {
        errors.photo = '❌ Only JPG, PNG, or WEBP images are allowed.';
      } else if (profile.photo.size > maxSize) {
        errors.photo = '❌ Photo size must be less than 2MB.';
      }
    }

    // Rates
    if (!rates.washFold || rates.washFold < 1)     errors.washFold    = '❌ Minimum rate is Rs. 1.';
    if (!rates.dryCleaning || rates.dryCleaning < 1) errors.dryCleaning = '❌ Minimum rate is Rs. 1.';
    if (!rates.ironPress || rates.ironPress < 1)   errors.ironPress   = '❌ Minimum rate is Rs. 1.';

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

  // ── PHOTO CHANGE WITH INSTANT VALIDATION ──
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 2 * 1024 * 1024;
    if (!allowedTypes.includes(file.type)) {
      setFormErrors({ ...formErrors, photo: '❌ Only JPG, PNG, or WEBP images are allowed.' });
      return;
    }
    if (file.size > maxSize) {
      setFormErrors({ ...formErrors, photo: '❌ Photo size must be less than 2MB.' });
      return;
    }
    setProfile({ ...profile, photo: file });
    setFormErrors({ ...formErrors, photo: '' });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const errors = validateProfile();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setMessage('❌ Please fix the errors before saving.');
      return;
    }
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/laundry/vendor/profile', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...profile, ...rates, isAvailable })
      });
      setMessage(res.ok ? '✅ Profile updated successfully!' : '❌ Failed to update profile.');
    } catch {
      setMessage('✅ Profile saved! (Demo mode)');
    }
  };

  const openStatusModal = (job) => { setSelectedJob(job); setNewStatus(job.status); setShowStatusModal(true); };
  const openCancelModal = (job) => { setSelectedJob(job); setShowCancelModal(true); };

  const handleStatusUpdate = () => {
    setJobs(jobs.map(j => j.id === selectedJob.id ? { ...j, status: newStatus } : j));
    setMessage(`✅ Job ${selectedJob.id} updated to "${newStatus}"!`);
    setShowStatusModal(false); setCompletionNote('');
  };

  const handleCancelJob = () => {
    if (!cancelReason.trim()) { setMessage('❌ Please provide a cancel reason.'); return; }
    setJobs(jobs.map(j => j.id === selectedJob.id ? { ...j, status: 'Cancelled' } : j));
    setMessage(`✅ Job ${selectedJob.id} cancelled. Student notified.`);
    setShowCancelModal(false); setCancelReason('');
  };

  const handleComplaintReply = (index) => {
    if (!replyTexts[index] || !replyTexts[index].trim()) {
      setMessage('❌ Reply cannot be empty!');
      return;
    }
    const updated = [...complaints];
    updated[index].reply = replyTexts[index];
    setComplaints(updated);
    setMessage('✅ Reply sent to student!');
    setReplyTexts({ ...replyTexts, [index]: '' });
  };

  const statusColor = (s) => ({ Pending: '#f59e0b', 'Picked Up': '#3b82f6', 'In Progress': '#8b5cf6', Completed: '#10b981', Cancelled: '#ef4444' }[s] || '#6b7280');
  const renderStars = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);

  return (
    <div style={{ display: 'flex' }}>
      <LaundryVendorSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="lv-dashboard">

        {/* Header */}
        <div className="lv-header">
          <div>
            <h1>🧺 Laundry Vendor Dashboard</h1>
            <p>Manage your profile, jobs, ratings and complaints</p>
          </div>
          <div className="lv-availability-toggle">
            <span style={{ color: 'white', fontSize: '14px' }}>Status:</span>
            <button
              className={`lv-toggle-btn ${isAvailable ? 'active' : 'inactive'}`}
              onClick={() => { setIsAvailable(!isAvailable); setMessage(`✅ Status set to ${!isAvailable ? 'Active' : 'Inactive'}`); }}
            >
              {isAvailable ? '🟢 Active' : '🔴 Inactive'}
            </button>
          </div>
        </div>

        {/* Alert */}
        {message && (
          <div className={`lv-alert ${message.includes('✅') ? 'lv-alert-success' : 'lv-alert-error'}`}>
            {message}
            <button onClick={() => setMessage('')}>✕</button>
          </div>
        )}

        {/* ── TAB 1: Profile & Rates ── */}
        {activeTab === 'profile' && (
          <div className="lv-section">
            <form onSubmit={handleSaveProfile} className="lv-form">
              <h3 className="lv-section-title">👤 Profile Setup</h3>

              <div className="lv-form-row">
                {/* Full Name */}
                <div className="lv-form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={profile.fullName}
                    onChange={handleProfileChange}
                    placeholder="Your full name (letters only)"
                    style={{ borderColor: formErrors.fullName ? '#ef4444' : '' }}
                  />
                  {formErrors.fullName && <span style={{ color: '#ef4444', fontSize: '12px' }}>{formErrors.fullName}</span>}
                </div>

                {/* ── PICKUP HOURS → DROPDOWN ── */}
                <div className="lv-form-group">
                  <label>Available Pickup Hours *</label>
                  <select
                    name="pickupHours"
                    value={profile.pickupHours}
                    onChange={handleProfileChange}
                    style={{ borderColor: formErrors.pickupHours ? '#ef4444' : '' }}
                  >
                    <option value="">-- Select Time Slot --</option>
                    {pickupHourOptions.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                  {formErrors.pickupHours && <span style={{ color: '#ef4444', fontSize: '12px' }}>{formErrors.pickupHours}</span>}
                </div>
              </div>

              <div className="lv-form-group">
                <label>Description / Bio</label>
                <textarea name="bio" rows="3" value={profile.bio} onChange={handleProfileChange} placeholder="Tell students about your service..." />
              </div>

              {/* ── SERVICES OFFERED → LETTERS ONLY ── */}
              <div className="lv-form-group">
                <label>Services Offered</label>
                <input
                  type="text"
                  name="services"
                  value={profile.services}
                  onChange={handleProfileChange}
                  placeholder="e.g. Wash and Fold, Dry Cleaning, Iron and Press"
                  style={{ borderColor: formErrors.services ? '#ef4444' : '' }}
                />
                {formErrors.services && <span style={{ color: '#ef4444', fontSize: '12px' }}>{formErrors.services}</span>}
                <span style={{ fontSize: '11px', color: '#9ca3af' }}>Letters and commas only — no numbers or symbols</span>
              </div>

              {/* ── PROFILE PHOTO → FILE TYPE & SIZE VALIDATION ── */}
              <div className="lv-form-group">
                <label>Profile Photo</label>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handlePhotoChange}
                  style={{ borderColor: formErrors.photo ? '#ef4444' : '' }}
                />
                {formErrors.photo
                  ? <span style={{ color: '#ef4444', fontSize: '12px' }}>{formErrors.photo}</span>
                  : <span style={{ fontSize: '11px', color: '#9ca3af' }}>JPG, PNG, WEBP only • Max 2MB</span>
                }
              </div>

              <h3 className="lv-section-title" style={{ marginTop: '28px' }}>💰 Rates Setup (Rs per dress)</h3>
              <div className="lv-rates-grid">
                <div className="lv-rate-card">
                  <span className="lv-rate-icon">👕</span>
                  <label>Wash & Fold</label>
                  <input type="number" name="washFold" value={rates.washFold} onChange={handleRatesChange} min="1" style={{ borderColor: formErrors.washFold ? '#ef4444' : '' }} />
                  {formErrors.washFold && <span style={{ color: '#ef4444', fontSize: '11px' }}>{formErrors.washFold}</span>}
                  <span className="lv-rate-unit">Rs / dress</span>
                </div>
                <div className="lv-rate-card">
                  <span className="lv-rate-icon">🧴</span>
                  <label>Dry Cleaning</label>
                  <input type="number" name="dryCleaning" value={rates.dryCleaning} onChange={handleRatesChange} min="1" style={{ borderColor: formErrors.dryCleaning ? '#ef4444' : '' }} />
                  {formErrors.dryCleaning && <span style={{ color: '#ef4444', fontSize: '11px' }}>{formErrors.dryCleaning}</span>}
                  <span className="lv-rate-unit">Rs / dress</span>
                </div>
                <div className="lv-rate-card">
                  <span className="lv-rate-icon">♨️</span>
                  <label>Iron & Press</label>
                  <input type="number" name="ironPress" value={rates.ironPress} onChange={handleRatesChange} min="1" style={{ borderColor: formErrors.ironPress ? '#ef4444' : '' }} />
                  {formErrors.ironPress && <span style={{ color: '#ef4444', fontSize: '11px' }}>{formErrors.ironPress}</span>}
                  <span className="lv-rate-unit">Rs / dress</span>
                </div>
              </div>

              <button type="submit" className="lv-submit-btn">💾 Save Profile & Rates</button>
            </form>
          </div>
        )}

        {/* ── TAB 2: Assigned Jobs ── */}
        {activeTab === 'jobs' && (
          <div className="lv-section">
            <h3 className="lv-section-title">📋 Assigned Jobs</h3>
            <div className="lv-table-wrapper">
              <table className="lv-table">
                <thead>
                  <tr>
                    <th>JOB ID</th><th>STUDENT</th><th>ROOM</th><th>SERVICE</th>
                    <th>DRESSES</th><th>PRICE</th><th>PICKUP</th><th>MAP</th>
                    <th>STATUS</th><th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map(job => (
                    <tr key={job.id}>
                      <td><strong>{job.id}</strong></td>
                      <td>{job.student}</td>
                      <td>{job.room}</td>
                      <td>{job.service}</td>
                      <td>{job.dresses}</td>
                      <td>Rs. {job.price}</td>
                      <td>{job.pickup}</td>
                      <td><a href={job.location} target="_blank" rel="noreferrer" className="lv-map-btn">📍 Open</a></td>
                      <td><span className="lv-status-badge" style={{ backgroundColor: statusColor(job.status) }}>{job.status}</span></td>
                      <td>
                        {job.status !== 'Completed' && job.status !== 'Cancelled' ? (
                          <div className="lv-action-btns">
                            <button className="lv-update-btn" onClick={() => openStatusModal(job)}>🔄 Update</button>
                            <button className="lv-cancel-btn" onClick={() => openCancelModal(job)}>✕ Cancel</button>
                          </div>
                        ) : (
                          <span style={{ color: '#9ca3af', fontSize: '12px' }}>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB 3: Ratings ── */}
        {activeTab === 'ratings' && (
          <div className="lv-section">
            <h3 className="lv-section-title">⭐ Ratings & Reviews</h3>
            {ratings.length === 0 ? <p className="lv-empty">No ratings yet.</p> : (
              <div className="lv-ratings-grid">
                {ratings.map((r, i) => (
                  <div key={i} className="lv-rating-card">
                    <div className="lv-rating-header">
                      <span className="lv-rating-student">👤 {r.student}</span>
                      <span className="lv-rating-date">{r.date}</span>
                    </div>
                    <div className="lv-rating-stars">{renderStars(r.stars)}</div>
                    <p className="lv-rating-review">"{r.review}"</p>
                    <span className="lv-rating-id">Service ID: {r.id}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 4: Complaints ── */}
        {activeTab === 'complaints' && (
          <div className="lv-section">
            <h3 className="lv-section-title">⚠️ Complaints</h3>
            {complaints.length === 0 ? <p className="lv-empty">No complaints received.</p> : (
              <div className="lv-complaints-list">
                {complaints.map((c, i) => (
                  <div key={i} className="lv-complaint-card">
                    <div className="lv-complaint-header">
                      <span>👤 <strong>{c.student}</strong></span>
                      <span className="lv-complaint-id">Service ID: {c.id}</span>
                      <span className="lv-complaint-date">{c.date}</span>
                    </div>
                    <p className="lv-complaint-desc">📝 {c.description}</p>
                    {c.reply ? (
                      <div className="lv-complaint-replied">✅ Your reply: <em>"{c.reply}"</em></div>
                    ) : (
                      <div className="lv-reply-box">
                        <textarea
                          placeholder="Write your reply to the student..."
                          rows="2"
                          value={replyTexts[i] || ''}
                          onChange={(e) => setReplyTexts({ ...replyTexts, [i]: e.target.value })}
                        />
                        <button className="lv-reply-btn" onClick={() => handleComplaintReply(i)}>Send Reply</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Status Modal */}
        {showStatusModal && selectedJob && (
          <div className="lv-modal-overlay">
            <div className="lv-modal">
              <h3>🔄 Update Job Status</h3>
              <p style={{ color: '#6b7280', fontSize: '13px', margin: '8px 0 16px' }}>Job: <strong>{selectedJob.id}</strong> — {selectedJob.student}</p>
              <div className="lv-form-group">
                <label>New Status</label>
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                  <option>Pending</option>
                  <option>Picked Up</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>
              {newStatus === 'Completed' && (
                <div className="lv-form-group" style={{ marginTop: '12px' }}>
                  <label>Completion Notes (optional)</label>
                  <textarea rows="3" value={completionNote} onChange={(e) => setCompletionNote(e.target.value)} placeholder="Any notes about this job..." />
                </div>
              )}
              <div className="lv-modal-actions">
                <button className="lv-modal-cancel" onClick={() => setShowStatusModal(false)}>Cancel</button>
                <button className="lv-submit-btn" style={{ flex: 2 }} onClick={handleStatusUpdate}>Update Status</button>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Modal */}
        {showCancelModal && selectedJob && (
          <div className="lv-modal-overlay">
            <div className="lv-modal">
              <h3>✕ Cancel Job</h3>
              <p style={{ color: '#6b7280', fontSize: '13px', margin: '8px 0 16px' }}>Job: <strong>{selectedJob.id}</strong> — {selectedJob.student}</p>
              <div className="lv-form-group">
                <label>Cancel Reason *</label>
                <textarea rows="4" value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} placeholder="Explain why you're cancelling (student will be notified)..." />
              </div>
              <div className="lv-modal-actions">
                <button className="lv-modal-cancel" onClick={() => setShowCancelModal(false)}>Back</button>
                <button className="lv-cancel-confirm-btn" onClick={handleCancelJob}>Confirm Cancel</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default LaundryVendorDashboard;
