import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './cleaningstaff.css';
import api from '../../services/api';

function CleaningComplaints() {
  const navigate = useNavigate();

  const [complaints, setComplaints]           = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [message, setMessage]                 = useState('');
  const [filter, setFilter]                   = useState('All');
  const [showReplyModal, setShowReplyModal]   = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [replyText, setReplyText]             = useState('');
  const [replyError, setReplyError]           = useState('');
  const [sending, setSending]                 = useState(false);

  // ── Load complaints on mount ──
  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await api.get('/cleaning/vendor/complaints');
      setComplaints(res.data.data || []);
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  // ── Derived filter + counts ──
  const filtered = filter === 'All'
    ? complaints
    : complaints.filter(c => c.status === filter);

  const counts = {
    All:         complaints.length,
    Pending:     complaints.filter(c => c.status === 'Pending').length,
    'In Review': complaints.filter(c => c.status === 'In Review').length,
    Resolved:    complaints.filter(c => c.status === 'Resolved').length,
  };

  const openReplyModal = (complaint) => {
    setSelectedComplaint(complaint);
    setReplyText(complaint.vendorReply || '');
    setReplyError('');
    setShowReplyModal(true);
  };

  // ── Send reply ──
  const handleSendReply = async () => {
    if (!replyText.trim()) {
      setReplyError('❌ Reply cannot be empty.');
      return;
    }
    if (replyText.trim().length < 10) {
      setReplyError('❌ Reply must be at least 10 characters.');
      return;
    }
    setSending(true);
    try {
      await api.put(`/cleaning/vendor/complaints/${selectedComplaint._id}/reply`, {
        vendorReply: replyText
      });
      setMessage(`✅ Reply sent for complaint ${selectedComplaint._id.slice(-6).toUpperCase()}.`);
      setShowReplyModal(false);
      setReplyText('');
      fetchComplaints();
    } catch (err) {
      console.error(err);
      setReplyError('❌ Failed to send reply. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const statusColor = (s) => ({
    'Pending':   '#f59e0b',
    'In Review': '#8b5cf6',
    'Resolved':  '#10b981',
  }[s] || '#6b7280');

  const studentName = (c) =>
    c.student?.fullName || c.student?.name || 'Student';

  const formatDate = (d) =>
    d ? new Date(d).toISOString().split('T')[0] : '—';

  return (
    <div className="cs-page">

      {/* Header */}
      <div className="cs-header">
        <div>
          <h1>⚠️ Complaints</h1>
          <p>View and reply to complaints from students</p>
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

      {/* Loading */}
      {loading && (
        <div className="cs-loading"><p>⏳ Loading complaints...</p></div>
      )}

      {!loading && (
        <>
          {/* Summary Cards */}
          <div className="cs-complaint-summary">
            {[
              { label: 'Total',     count: counts.All,          bg: '#dbeafe', color: '#1e3a8a' },
              { label: 'Pending',   count: counts.Pending,      bg: '#fef3c7', color: '#92400e' },
              { label: 'In Review', count: counts['In Review'], bg: '#ede9fe', color: '#5b21b6' },
              { label: 'Resolved',  count: counts.Resolved,     bg: '#d1fae5', color: '#065f46' },
            ].map(s => (
              <div key={s.label} className="cs-complaint-stat"
                style={{ background: s.bg, color: s.color }}>
                <span className="cs-complaint-stat-num">{s.count}</span>
                <span className="cs-complaint-stat-label">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Filter */}
          <div className="cs-filter-row">
            {['All', 'Pending', 'In Review', 'Resolved'].map(f => (
              <button
                key={f}
                className={`cs-filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f} ({counts[f] ?? 0})
              </button>
            ))}
          </div>

          {/* Complaints List */}
          <div className="cs-section">
            <h3 className="cs-section-title">
              ⚠️ Complaints ({filtered.length})
            </h3>

            {filtered.length === 0 ? (
              <div className="cs-empty">
                <p>No complaints in this category. 🎉</p>
              </div>
            ) : (
              <div className="cs-complaints-list">
                {filtered.map(complaint => (
                  <div key={complaint._id} className="cs-complaint-card">

                    {/* Top Row */}
                    <div className="cs-complaint-top">
                      <div className="cs-review-avatar">
                        {studentName(complaint).charAt(0).toUpperCase()}
                      </div>
                      <div className="cs-review-meta">
                        <strong>{studentName(complaint)}</strong>
                        <span>
                          {complaint.serviceType || '—'} •{' '}
                          {formatDate(complaint.createdAt)}
                        </span>
                      </div>
                      <div className="cs-complaint-right">
                        <span className="cs-status-badge"
                          style={{ background: statusColor(complaint.status) }}>
                          {complaint.status}
                        </span>
                        <span className="cs-complaint-id">
                          #{complaint._id.slice(-6).toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Issue */}
                    <div className="cs-complaint-issue">
                      <span className="cs-issue-label">📌 Issue:</span>
                      <p>"{complaint.description || complaint.issue}"</p>
                    </div>

                    {/* Vendor reply if exists */}
                    {complaint.vendorReply && (
                      <div className="cs-complaint-reply">
                        <span className="cs-reply-label">💬 Your Reply:</span>
                        <p>"{complaint.vendorReply}"</p>
                      </div>
                    )}

                    {/* Action */}
                    {complaint.status !== 'Resolved' && (
                      <button className="cs-reply-btn"
                        onClick={() => openReplyModal(complaint)}>
                        💬 {complaint.vendorReply ? 'Edit Reply' : 'Send Reply'}
                      </button>
                    )}

                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Reply Modal */}
      {showReplyModal && selectedComplaint && (
        <div className="cs-modal-overlay">
          <div className="cs-modal">
            <h3>💬 Reply to Complaint</h3>
            <p style={{ color: '#6b7280', fontSize: '13px', margin: '6px 0 4px' }}>
              <strong>#{selectedComplaint._id.slice(-6).toUpperCase()}</strong>
              {' '}— {studentName(selectedComplaint)}
            </p>
            <div className="cs-complaint-issue" style={{ margin: '12px 0' }}>
              <span className="cs-issue-label">📌 Issue:</span>
              <p style={{ margin: '4px 0 0' }}>
                "{selectedComplaint.description || selectedComplaint.issue}"
              </p>
            </div>
            <div className="cs-form-group">
              <label>Your Reply *</label>
              <textarea
                rows="5"
                value={replyText}
                onChange={(e) => { setReplyText(e.target.value); setReplyError(''); }}
                placeholder="Type your response to the student (min 10 characters)..."
                style={{ borderColor: replyError ? '#ef4444' : '' }}
              />
              {replyError
                ? <span className="cs-error">{replyError}</span>
                : <span className="cs-hint">Min 10 characters • Student will be notified</span>
              }
            </div>
            <div className="cs-modal-actions">
              <button className="cs-modal-cancel"
                onClick={() => setShowReplyModal(false)}
                disabled={sending}>
                Cancel
              </button>
              <button className="cs-submit-btn" style={{ flex: 2 }}
                onClick={handleSendReply} disabled={sending}>
                {sending ? 'Sending...' : 'Send Reply'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default CleaningComplaints;