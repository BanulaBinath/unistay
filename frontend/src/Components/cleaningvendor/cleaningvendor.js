import React, { useState } from 'react';
import './cleaningvendor.css';
import CleaningVendorSidebar from './CleaningVendorSidebar';

function CleaningVendorDashboard() {
  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [formErrors, setFormErrors] = useState({});

  const [profile, setProfile] = useState({
    fullName: '',
    bio: '',
    services: [],
    photo: null
  });

  const [rates, setRates] = useState({
    room: 500,
    bathroom: 300,
    roomBathroom: 750
  });

  const [jobs, setJobs] = useState([
    { id: 'CLN001', student: 'Siddarth', room: 'A-204', service: 'Room',          price: 500, location: 'https://maps.google.com', status: 'Pending' },
    { id: 'CLN002', student: 'Kavya',    room: 'B-101', service: 'Bathroom',      price: 300, location: 'https://maps.google.com', status: 'In Progress' },
    { id: 'CLN003', student: 'Rahul',    room: 'C-305', service: 'Room+Bathroom', price: 750, location: 'https://maps.google.com', status: 'Completed' },
  ]);

  const [ratings] = useState([
    { id: 'CLN001', student: 'Kavya',    stars: 5, review: 'Very thorough cleaning, very happy!', date: '2026-03-22' },
    { id: 'CLN003', student: 'Siddarth', stars: 4, review: 'Good service, arrived on time.',      date: '2026-03-23' },
  ]);

  const [complaints, setComplaints] = useState([
    { id: 'CLN002', student: 'Rahul', description: 'Room was not cleaned properly near the window.', reply: '', date: '2026-03-23' },
  ]);

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedJob, setSelectedJob]         = useState(null);
  const [newStatus, setNewStatus]             = useState('');
  const [completionNote, setCompletionNote]   = useState('');
  const [cancelReason, setCancelReason]       = useState('');
  const [replyTexts, setReplyTexts]           = useState({});

  // ── SERVICE OPTIONS ──
  const serviceOptions = ['Room Cleaning', 'Bathroom Cleaning', 'Room and Bathroom'];

  // ── HANDLE CHECKBOX CHANGE ──
  const handleServiceToggle = (service) => {
    const updated = profile.services.includes(service)
      ? profile.services.filter(s => s !== service)
      : [...profile.services, service];
    setProfile({ ...profile, services: updated });
    setFormErrors({ ...formErrors, services: '' });
  };

  // ── VALIDATION FUNCTION ──
  const validateProfile = () => {
    const errors = {};
    const onlyLetters   = /^[a-zA-Z\s]+$/;
    const noSymbols     = /^[a-zA-Z0-9\s]+$/;

    // Full Name
    if (!profile.fullName.trim()) {
      errors.fullName = '❌ Full name is required.';
    } else if (profile.fullName.trim().length < 3) {
      errors.fullName = '❌ Name must be at least 3 characters.';
    } else if (!onlyLetters.test(profile.fullName.trim())) {
      errors.fullName = '❌ Name must contain only letters and spaces.';
    }

    // Services
    if (profile.services.length === 0) {
      errors.services = '❌ Please select at least one service.';
    }

    // Bio — no symbols
    if (profile.bio.trim() && !noSymbols.test(profile.bio.trim())) {
      errors.bio = '❌ Description must not contain symbols.';
    }

    // Photo
    if (profile.photo) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const maxSize = 2 * 1024 * 1024;
      if (!allowedTypes.includes(profile.photo.type)) {
        errors.photo = '❌ Only JPG, PNG, or WEBP images are allowed.';
      } else if (profile.photo.size > maxSize) {
        errors.photo = '❌ Photo size must be less than 2MB.';
      }
    }

    // Rates
    if (!rates.room || rates.room < 1)                 errors.room         = '❌ Minimum rate is Rs. 1.';
    if (!rates.bathroom || rates.bathroom < 1)         errors.bathroom     = '❌ Minimum rate is Rs. 1.';
    if (!rates.roomBathroom || rates.roomBathroom < 1) errors.roomBathroom = '❌ Minimum rate is Rs. 1.';

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
      const res = await fetch('http://localhost:5000/api/cleaning/vendor/profile', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...profile, services: profile.services.join(', '), ...rates, isAvailable })
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

  const statusColor = (s) => ({ Pending: '#f59e0b', 'In Progress': '#8b5cf6', Completed: '#10b981', Cancelled: '#ef4444' }[s] || '#6b7280');
  const renderStars = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);

  return (
    <div style={{ display: 'flex' }}>
      <CleaningVendorSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="cv-dashboard">

        {/* Header */}
        <div className="cv-header">
          <div>
            <h1>🧹 Cleaning Vendor Dashboard</h1>
            <p>Manage your profile, jobs, ratings and complaints</p>
          </div>
          <div className="cv-availability-toggle">
            <span style={{ color: 'white', fontSize: '14px' }}>Status:</span>
            <button
              className={`cv-toggle-btn ${isAvailable ? 'active' : 'inactive'}`}
              onClick={() => { setIsAvailable(!isAvailable); setMessage(`✅ Status set to ${!isAvailable ? 'Active' : 'Inactive'}`); }}
            >
              {isAvailable ? '🟢 Active' : '🔴 Inactive'}
            </button>
          </div>
        </div>

        {/* Alert */}
        {message && (
          <div className={`cv-alert ${message.includes('✅') ? 'cv-alert-success' : 'cv-alert-error'}`}>
            {message}
            <button onClick={() => setMessage('')}>✕</button>
          </div>
        )}

        {/* ── TAB 1: Profile & Rates ── */}
        {activeTab === 'profile' && (
          <div className="cv-section">
            <form onSubmit={handleSaveProfile} className="cv-form">
              <h3 className="cv-section-title">👤 Profile Setup</h3>

              <div className="cv-form-row">
                {/* Full Name */}
                <div className="cv-form-group">
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

                {/* ── SERVICES OFFERED → CHECKBOXES ── */}
                <div className="cv-form-group">
                  <label>Services Offered *</label>
                  <div style={{
                    display: 'flex', flexDirection: 'column', gap: '8px',
                    padding: '10px 14px', border: `1.5px solid ${formErrors.services ? '#ef4444' : '#e5e7eb'}`,
                    borderRadius: '10px', background: '#fafafa'
                  }}>
                    {serviceOptions.map(option => (
                      <label key={option} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={profile.services.includes(option)}
                          onChange={() => handleServiceToggle(option)}
                          style={{ width: '16px', height: '16px', accentColor: '#1e3a8a' }}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                  {formErrors.services && <span style={{ color: '#ef4444', fontSize: '12px' }}>{formErrors.services}</span>}
                </div>
              </div>

              {/* ── DESCRIPTION — NO SYMBOLS ── */}
              <div className="cv-form-group">
                <label>Description / Bio</label>
                <textarea
                  name="bio"
                  rows="3"
                  value={profile.bio}
                  onChange={handleProfileChange}
                  placeholder="Tell students about your cleaning service (no symbols)"
                  style={{ borderColor: formErrors.bio ? '#ef4444' : '' }}
                />
                {formErrors.bio
                  ? <span style={{ color: '#ef4444', fontSize: '12px' }}>{formErrors.bio}</span>
                  : <span style={{ fontSize: '11px', color: '#9ca3af' }}>Letters and numbers only — no symbols</span>
                }
              </div>

              {/* Profile Photo */}
              <div className="cv-form-group">
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

              <h3 className="cv-section-title" style={{ marginTop: '28px' }}>💰 Rates Setup (Rs per service)</h3>
              <div className="cv-rates-grid">
                <div className="cv-rate-card">
                  <span className="cv-rate-icon">🛏️</span>
                  <label>Room Cleaning</label>
                  <input type="number" name="room" value={rates.room} onChange={handleRatesChange} min="1" style={{ borderColor: formErrors.room ? '#ef4444' : '' }} />
                  {formErrors.room && <span style={{ color: '#ef4444', fontSize: '11px' }}>{formErrors.room}</span>}
                  <span className="cv-rate-unit">Rs / service</span>
                </div>
                <div className="cv-rate-card">
                  <span className="cv-rate-icon">🚿</span>
                  <label>Bathroom Cleaning</label>
                  <input type="number" name="bathroom" value={rates.bathroom} onChange={handleRatesChange} min="1" style={{ borderColor: formErrors.bathroom ? '#ef4444' : '' }} />
                  {formErrors.bathroom && <span style={{ color: '#ef4444', fontSize: '11px' }}>{formErrors.bathroom}</span>}
                  <span className="cv-rate-unit">Rs / service</span>
                </div>
                <div className="cv-rate-card">
                  <span className="cv-rate-icon">🏠</span>
                  <label>Room + Bathroom</label>
                  <input type="number" name="roomBathroom" value={rates.roomBathroom} onChange={handleRatesChange} min="1" style={{ borderColor: formErrors.roomBathroom ? '#ef4444' : '' }} />
                  {formErrors.roomBathroom && <span style={{ color: '#ef4444', fontSize: '11px' }}>{formErrors.roomBathroom}</span>}
                  <span className="cv-rate-unit">Rs / service</span>
                </div>
              </div>

              <button type="submit" className="cv-submit-btn">💾 Save Profile & Rates</button>
            </form>
          </div>
        )}

        {/* ── TAB 2: Assigned Jobs ── */}
        {activeTab === 'jobs' && (
          <div className="cv-section">
            <h3 className="cv-section-title">📋 Assigned Jobs</h3>
            <div className="cv-table-wrapper">
              <table className="cv-table">
                <thead>
                  <tr>
                    <th>JOB ID</th><th>STUDENT</th><th>ROOM</th><th>SERVICE</th>
                    <th>PRICE</th><th>MAP</th><th>STATUS</th><th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map(job => (
                    <tr key={job.id}>
                      <td><strong>{job.id}</strong></td>
                      <td>{job.student}</td>
                      <td>{job.room}</td>
                      <td>{job.service}</td>
                      <td>Rs. {job.price}</td>
                      <td><a href={job.location} target="_blank" rel="noreferrer" className="cv-map-btn">📍 Open</a></td>
                      <td><span className="cv-status-badge" style={{ backgroundColor: statusColor(job.status) }}>{job.status}</span></td>
                      <td>
                        {job.status !== 'Completed' && job.status !== 'Cancelled' ? (
                          <div className="cv-action-btns">
                            <button className="cv-update-btn" onClick={() => openStatusModal(job)}>🔄 Update</button>
                            <button className="cv-cancel-btn" onClick={() => openCancelModal(job)}>✕ Cancel</button>
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
          <div className="cv-section">
            <h3 className="cv-section-title">⭐ Ratings & Reviews</h3>
            {ratings.length === 0 ? <p className="cv-empty">No ratings yet.</p> : (
              <div className="cv-ratings-grid">
                {ratings.map((r, i) => (
                  <div key={i} className="cv-rating-card">
                    <div className="cv-rating-header">
                      <span className="cv-rating-student">👤 {r.student}</span>
                      <span className="cv-rating-date">{r.date}</span>
                    </div>
                    <div className="cv-rating-stars">{renderStars(r.stars)}</div>
                    <p className="cv-rating-review">"{r.review}"</p>
                    <span className="cv-rating-id">Service ID: {r.id}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 4: Complaints ── */}
        {activeTab === 'complaints' && (
          <div className="cv-section">
            <h3 className="cv-section-title">⚠️ Complaints</h3>
            {complaints.length === 0 ? <p className="cv-empty">No complaints received.</p> : (
              <div className="cv-complaints-list">
                {complaints.map((c, i) => (
                  <div key={i} className="cv-complaint-card">
                    <div className="cv-complaint-header">
                      <span>👤 <strong>{c.student}</strong></span>
                      <span className="cv-complaint-id">Service ID: {c.id}</span>
                      <span className="cv-complaint-date">{c.date}</span>
                    </div>
                    <p className="cv-complaint-desc">📝 {c.description}</p>
                    {c.reply ? (
                      <div className="cv-complaint-replied">✅ Your reply: <em>"{c.reply}"</em></div>
                    ) : (
                      <div className="cv-reply-box">
                        <textarea
                          placeholder="Write your reply to the student..."
                          rows="2"
                          value={replyTexts[i] || ''}
                          onChange={(e) => setReplyTexts({ ...replyTexts, [i]: e.target.value })}
                        />
                        <button className="cv-reply-btn" onClick={() => handleComplaintReply(i)}>Send Reply</button>
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
          <div className="cv-modal-overlay">
            <div className="cv-modal">
              <h3>🔄 Update Job Status</h3>
              <p style={{ color: '#6b7280', fontSize: '13px', margin: '8px 0 16px' }}>Job: <strong>{selectedJob.id}</strong> — {selectedJob.student}</p>
              <div className="cv-form-group">
                <label>New Status</label>
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>
              {newStatus === 'Completed' && (
                <div className="cv-form-group" style={{ marginTop: '12px' }}>
                  <label>Completion Notes (optional)</label>
                  <textarea rows="3" value={completionNote} onChange={(e) => setCompletionNote(e.target.value)} placeholder="Any notes about this job..." />
                </div>
              )}
              <div className="cv-modal-actions">
                <button className="cv-modal-cancel" onClick={() => setShowStatusModal(false)}>Cancel</button>
                <button className="cv-submit-btn" style={{ flex: 2 }} onClick={handleStatusUpdate}>Update Status</button>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Modal */}
        {showCancelModal && selectedJob && (
          <div className="cv-modal-overlay">
            <div className="cv-modal">
              <h3>✕ Cancel Job</h3>
              <p style={{ color: '#6b7280', fontSize: '13px', margin: '8px 0 16px' }}>Job: <strong>{selectedJob.id}</strong> — {selectedJob.student}</p>
              <div className="cv-form-group">
                <label>Cancel Reason *</label>
                <textarea rows="4" value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} placeholder="Explain why you're cancelling (student will be notified)..." />
              </div>
              <div className="cv-modal-actions">
                <button className="cv-modal-cancel" onClick={() => setShowCancelModal(false)}>Back</button>
                <button className="cv-cancel-confirm-btn" onClick={handleCancelJob}>Confirm Cancel</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default CleaningVendorDashboard;
