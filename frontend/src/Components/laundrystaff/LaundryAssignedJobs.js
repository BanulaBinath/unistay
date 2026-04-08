import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './laundrystaff.css';
import api from '../../services/api';

function LaundryAssignedJobs() {
  const navigate = useNavigate();

  const [jobs, setJobs]                     = useState([]);
  const [loading, setLoading]               = useState(true);
  const [message, setMessage]               = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedJob, setSelectedJob]       = useState(null);
  const [newStatus, setNewStatus]           = useState('');
  const [completionNote, setCompletionNote] = useState('');
  const [cancelReason, setCancelReason]     = useState('');
  const [updating, setUpdating]             = useState(false);

  // ── Load jobs on mount ──
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/laundry/vendor/jobs');
      setJobs(res.data.data || []);
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const openStatusModal = (job) => {
    setSelectedJob(job);
    setNewStatus(job.status);
    setCompletionNote('');
    setShowStatusModal(true);
  };

  const openCancelModal = (job) => {
    setSelectedJob(job);
    setCancelReason('');
    setShowCancelModal(true);
  };

  // ── Update status ──
  const handleStatusUpdate = async () => {
    if (!selectedJob) {
      setMessage('❌ No job selected.');
      return;
    }
    const jobId = selectedJob._id || selectedJob.id;
    setUpdating(true);
    try {
      await api.put(`/laundry/vendor/jobs/${jobId}/status`, {
        status: newStatus,
        completionNote
      });
      setMessage(`✅ Job updated to "${newStatus}" successfully!`);
      setShowStatusModal(false);
      setCompletionNote('');
      fetchJobs();
    } catch (err) {
      console.error(err);
      setMessage(`❌ Failed to update status: ${err.response?.data?.message || err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  // ── Cancel job ──
  const handleCancelJob = async () => {
    if (!cancelReason.trim()) {
      setMessage('❌ Please provide a cancel reason.');
      return;
    }
    if (!selectedJob) {
      setMessage('❌ No job selected.');
      return;
    }
    const jobId = selectedJob._id || selectedJob.id;
    setUpdating(true);
    try {
      await api.put(`/laundry/vendor/jobs/${jobId}/status`, {
        status: 'Cancelled',
        cancelReason
      });
      setMessage(`✅ Job cancelled. Student notified.`);
      setShowCancelModal(false);
      setCancelReason('');
      fetchJobs();
    } catch (err) {
      console.error(err);
      setMessage(`❌ Failed to cancel job: ${err.response?.data?.message || err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const statusColor = (s) => ({
    'Pending':     '#f59e0b',
    'Accepted':    '#3b82f6',
    'In Progress': '#8b5cf6',
    'Completed':   '#10b981',
    'Cancelled':   '#ef4444'
  }[s] || '#6b7280');

  // ── Helper: student name ──
  const studentName = (job) =>
    job.student?.fullName || job.student?.name || 'N/A';

  return (
    <div className="ls-page">

      {/* Header */}
      <div className="ls-header">
        <div>
          <h1>📋 Assigned Jobs</h1>
          <p>View and manage your laundry job requests</p>
        </div>
        <button className="ls-back-btn"
          onClick={() => navigate('/laundry-vendor/dashboard')}>
          ← Back to Dashboard
        </button>
      </div>

      {/* Alert */}
      {message && (
        <div className={`ls-alert ${message.includes('✅') ? 'ls-alert-success' : 'ls-alert-error'}`}>
          {message}
          <button onClick={() => setMessage('')}>✕</button>
        </div>
      )}

      {/* Table */}
      <div className="ls-section">
        <h3 className="ls-section-title">📋 Assigned Jobs</h3>

        {/* Loading */}
        {loading && (
          <div className="ls-loading">
            <p>⏳ Loading jobs...</p>
          </div>
        )}

        {/* Empty */}
        {!loading && jobs.length === 0 && (
          <div className="ls-empty">
            <p>😕 No jobs assigned yet.</p>
          </div>
        )}

        {/* Table */}
        {!loading && jobs.length > 0 && (
          <div className="ls-table-wrapper">
            <table className="ls-table">
              <thead>
                <tr>
                  <th>JOB ID</th>
                  <th>STUDENT</th>
                  <th>ROOM</th>
                  <th>SERVICE</th>
                  <th>DRESSES</th>
                  <th>PRICE</th>
                  <th>MAP</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job._id}>
                    <td><strong>{job._id.slice(-6).toUpperCase()}</strong></td>
                    <td>{studentName(job)}</td>
                    <td>{job.roomNumber || '—'}</td>
                    <td>{job.service}</td>
                    <td>{job.quantity}</td>
                    <td>Rs. {job.price}</td>
                    <td>
                      {job.locationPin ? (
                        <a href={job.locationPin} target="_blank"
                          rel="noreferrer" className="ls-map-btn">
                          📍 Open
                        </a>
                      ) : (
                        <span style={{ color: '#9ca3af', fontSize: '12px' }}>—</span>
                      )}
                    </td>
                    <td>
                      <span className="ls-status-badge"
                        style={{ backgroundColor: statusColor(job.status) }}>
                        {job.status}
                      </span>
                    </td>
                    <td>
                      {job.status !== 'Completed' && job.status !== 'Cancelled' ? (
                        <div className="ls-action-btns">
                          <button className="ls-update-btn"
                            onClick={() => openStatusModal(job)}>
                            🔄 Update
                          </button>
                          <button className="ls-cancel-btn"
                            onClick={() => openCancelModal(job)}>
                            ✕ Cancel
                          </button>
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
        )}
      </div>

      {/* Status Modal */}
      {showStatusModal && selectedJob && (
        <div className="ls-modal-overlay">
          <div className="ls-modal">
            <h3>🔄 Update Job Status</h3>
            <p style={{ color: '#6b7280', fontSize: '13px', margin: '8px 0 16px' }}>
              Job: <strong>{selectedJob._id.slice(-6).toUpperCase()}</strong> — {studentName(selectedJob)}
            </p>
            <div className="ls-form-group">
              <label>New Status</label>
              <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                <option>Pending</option>
                <option>Accepted</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </div>
            {newStatus === 'Completed' && (
              <div className="ls-form-group" style={{ marginTop: '12px' }}>
                <label>Completion Notes (optional)</label>
                <textarea
                  rows="3"
                  value={completionNote}
                  onChange={(e) => setCompletionNote(e.target.value)}
                  placeholder="Any notes about this job..."
                />
              </div>
            )}
            <div className="ls-modal-actions">
              <button className="ls-modal-cancel"
                onClick={() => setShowStatusModal(false)}>
                Cancel
              </button>
              <button className="ls-submit-btn" style={{ flex: 2 }}
                onClick={handleStatusUpdate} disabled={updating}>
                {updating ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && selectedJob && (
        <div className="ls-modal-overlay">
          <div className="ls-modal">
            <h3>✕ Cancel Job</h3>
            <p style={{ color: '#6b7280', fontSize: '13px', margin: '8px 0 16px' }}>
              Job: <strong>{selectedJob._id.slice(-6).toUpperCase()}</strong> — {studentName(selectedJob)}
            </p>
            <div className="ls-form-group">
              <label>Cancel Reason *</label>
              <textarea
                rows="4"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Explain why you're cancelling (student will be notified)..."
              />
            </div>
            <div className="ls-modal-actions">
              <button className="ls-modal-cancel"
                onClick={() => setShowCancelModal(false)}>
                Back
              </button>
              <button className="ls-cancel-confirm-btn"
                onClick={handleCancelJob} disabled={updating}>
                {updating ? 'Cancelling...' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default LaundryAssignedJobs;