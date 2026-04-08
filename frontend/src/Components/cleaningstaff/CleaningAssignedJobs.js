import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './cleaningstaff.css';
import api from '../../services/api';

function CleaningAssignedJobs() {
  const navigate = useNavigate();

  const [jobs, setJobs]                         = useState([]);
  const [loading, setLoading]                   = useState(true);
  const [message, setMessage]                   = useState('');
  const [showStatusModal, setShowStatusModal]   = useState(false);
  const [showCancelModal, setShowCancelModal]   = useState(false);
  const [selectedJob, setSelectedJob]           = useState(null);
  const [newStatus, setNewStatus]               = useState('');
  const [completionNote, setCompletionNote]     = useState('');
  const [cancelReason, setCancelReason]         = useState('');
  const [updating, setUpdating]                 = useState(false);

  // ── Load jobs on mount ──
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/cleaning/vendor/jobs');
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
    setUpdating(true);
    try {
      await api.put(`/cleaning/vendor/jobs/${selectedJob._id}/status`, {
        status: newStatus,
        completionNote
      });
      setMessage(`✅ Job updated to "${newStatus}" successfully!`);
      setShowStatusModal(false);
      setCompletionNote('');
      fetchJobs();
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to update status');
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
    setUpdating(true);
    try {
      await api.put(`/cleaning/vendor/jobs/${selectedJob._id}/status`, {
        status: 'Cancelled',
        cancelReason
      });
      setMessage(`✅ Job cancelled. Student notified.`);
      setShowCancelModal(false);
      setCancelReason('');
      fetchJobs();
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to cancel job');
    } finally {
      setUpdating(false);
    }
  };

  const statusColor = (s) => ({
    'Pending':     '#f59e0b',
    'Accepted':    '#3b82f6',
    'On The Way':  '#06b6d4',
    'In Progress': '#8b5cf6',
    'Completed':   '#10b981',
    'Cancelled':   '#ef4444'
  }[s] || '#6b7280');

  const studentName = (job) =>
    job.student?.fullName || job.student?.name || 'N/A';

  return (
    <div className="cs-page">

      {/* Header */}
      <div className="cs-header">
        <div>
          <h1>📋 Assigned Jobs</h1>
          <p>View and manage your cleaning job requests</p>
        </div>
        <button className="cs-back-btn"
          onClick={() => navigate('/cleaning-vendor/dashboard')}>
          ← Back to Dashboard
        </button>
      </div>

      {/* Alert */}
      {message && (
        <div className={`cs-alert ${message.includes('✅') ? 'cs-alert-success' : 'cs-alert-error'}`}>
          {message}
          <button onClick={() => setMessage('')}>✕</button>
        </div>
      )}

      {/* Table */}
      <div className="cs-section">
        <h3 className="cs-section-title">📋 Assigned Jobs</h3>

        {/* Loading */}
        {loading && (
          <div className="cs-loading">
            <p>⏳ Loading jobs...</p>
          </div>
        )}

        {/* Empty */}
        {!loading && jobs.length === 0 && (
          <div className="cs-empty">
            <p>😕 No jobs assigned yet.</p>
          </div>
        )}

        {/* Table */}
        {!loading && jobs.length > 0 && (
          <div className="cs-table-wrapper">
            <table className="cs-table">
              <thead>
                <tr>
                  <th>JOB ID</th>
                  <th>STUDENT</th>
                  <th>ROOM</th>
                  <th>SERVICE</th>
                  <th>DATE</th>
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
                    <td>{job.serviceType}</td>
                    <td>
                      {job.requestDate
                        ? new Date(job.requestDate).toISOString().split('T')[0]
                        : '—'}
                    </td>
                    <td>Rs. {job.price}</td>
                    <td>
                      {job.locationPin ? (
                        <a href={job.locationPin} target="_blank"
                          rel="noreferrer" className="cs-map-btn">
                          📍 Open
                        </a>
                      ) : (
                        <span style={{ color: '#9ca3af', fontSize: '12px' }}>—</span>
                      )}
                    </td>
                    <td>
                      <span className="cs-status-badge"
                        style={{ backgroundColor: statusColor(job.status) }}>
                        {job.status}
                      </span>
                    </td>
                    <td>
                      {job.status !== 'Completed' && job.status !== 'Cancelled' ? (
                        <div className="cs-action-btns">
                          <button className="cs-update-btn"
                            onClick={() => openStatusModal(job)}>
                            🔄 Update
                          </button>
                          <button className="cs-cancel-btn"
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
        <div className="cs-modal-overlay">
          <div className="cs-modal">
            <h3>🔄 Update Job Status</h3>
            <p style={{ color: '#6b7280', fontSize: '13px', margin: '8px 0 16px' }}>
              Job: <strong>{selectedJob._id.slice(-6).toUpperCase()}</strong> — {studentName(selectedJob)}
            </p>
            <div className="cs-form-group">
              <label>New Status</label>
              <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                <option>Pending</option>
                <option>Accepted</option>
                <option>On The Way</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </div>
            {newStatus === 'Completed' && (
              <div className="cs-form-group" style={{ marginTop: '12px' }}>
                <label>Completion Notes (optional)</label>
                <textarea
                  rows="3"
                  value={completionNote}
                  onChange={(e) => setCompletionNote(e.target.value)}
                  placeholder="Any notes about this job..."
                />
              </div>
            )}
            <div className="cs-modal-actions">
              <button className="cs-modal-cancel"
                onClick={() => setShowStatusModal(false)}>
                Cancel
              </button>
              <button className="cs-submit-btn" style={{ flex: 2 }}
                onClick={handleStatusUpdate} disabled={updating}>
                {updating ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && selectedJob && (
        <div className="cs-modal-overlay">
          <div className="cs-modal">
            <h3>✕ Cancel Job</h3>
            <p style={{ color: '#6b7280', fontSize: '13px', margin: '8px 0 16px' }}>
              Job: <strong>{selectedJob._id.slice(-6).toUpperCase()}</strong> — {studentName(selectedJob)}
            </p>
            <div className="cs-form-group">
              <label>Cancel Reason *</label>
              <textarea
                rows="4"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Explain why you're cancelling (student will be notified)..."
              />
            </div>
            <div className="cs-modal-actions">
              <button className="cs-modal-cancel"
                onClick={() => setShowCancelModal(false)}>
                Back
              </button>
              <button className="cs-cancel-confirm-btn"
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

export default CleaningAssignedJobs;