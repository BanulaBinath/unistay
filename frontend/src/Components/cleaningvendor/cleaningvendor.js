import React, { useState } from 'react';
import './cleaningvendor.css';
import CleaningVendorSidebar from './CleaningVendorSidebar';

function CleaningVendorDashboard() {
  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);

  const [profile, setProfile] = useState({
    fullName: '',
    bio: '',
    services: '',
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
  const [showCancelModal, setShowCancelModal]   = useState(false);
  const [selectedJob, setSelectedJob]           = useState(null);
  const [newStatus, setNewStatus]               = useState('');
  const [completionNote, setCompletionNote]     = useState('');
  const [cancelReason, setCancelReason]         = useState('');
  const [replyTexts, setReplyTexts]             = useState({});

  const handleProfileChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });
  const handleRatesChange   = (e) => setRates({ ...rates, [e.target.name]: e.target.value });

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/cleaning/vendor/profile', {
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
    const updated = [...complaints];
    updated[index].reply = replyTexts[index] || '';
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
                <div className="cv-form-group">
                  <label>Full Name *</label>
                  <input type="text" name="fullName" value={profile.fullName} onChange={handleProfileChange} placeholder="Your full name" required minLength={3}/>
                </div>
                <div className="cv-form-group">
                  <label>Services Offered</label>
                  <input type="text" name="services" value={profile.services} onChange={handleProfileChange} placeholder="e.g. Room, Bathroom, Room+Bathroom" />
                </div>
              </div>

              <div className="cv-form-group">
                <label>Description / Bio</label>
                <textarea name="bio" rows="3" value={profile.bio} onChange={handleProfileChange} placeholder="Tell students about your cleaning service..." />
              </div>

              <div className="cv-form-group">
                <label>Profile Photo</label>
                <input type="file" accept="image/*" onChange={(e) => setProfile({ ...profile, photo: e.target.files[0] })} />
              </div>

              <h3 className="cv-section-title" style={{ marginTop: '28px' }}>💰 Rates Setup (Rs per service)</h3>
              <div className="cv-rates-grid">
                <div className="cv-rate-card">
                  <span className="cv-rate-icon">🛏️</span>
                  <label>Room Cleaning</label>
                  <input type="number" name="room" value={rates.room} onChange={handleRatesChange} min="1" required />
                  <span className="cv-rate-unit">Rs / service</span>
                </div>
                <div className="cv-rate-card">
                  <span className="cv-rate-icon">🚿</span>
                  <label>Bathroom Cleaning</label>
                  <input type="number" name="bathroom" value={rates.bathroom} onChange={handleRatesChange} min="1" required />
                  <span className="cv-rate-unit">Rs / service</span>
                </div>
                <div className="cv-rate-card">
                  <span className="cv-rate-icon">🏠</span>
                  <label>Room + Bathroom</label>
                  <input type="number" name="roomBathroom" value={rates.roomBathroom} onChange={handleRatesChange} min="1" required />
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
                <textarea rows="4" value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} placeholder="Explain why you're cancelling (student will be notified)..." required />
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
