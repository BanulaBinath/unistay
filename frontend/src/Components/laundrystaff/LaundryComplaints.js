import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './laundrystaff.css';
import api from '../../services/api';

function LaundryComplaints() {
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
      const res = await api.get('/laundry/vendor/complaints');
      setComplaints(res.data.data || []);
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  // ── Filter ──
  const filtered = filter === 'All'
    ? complaints
    : complaints.filter(c => c.complaint?.status === filter);

  // ── Counts ──
  const counts = {
    All:         complaints.length,
    Pending:     complaints.filter(c => c.complaint?.status === 'Pending').length,
    'In Review': complaints.filter(c => c.complaint?.status === 'In Review').length,
    Resolved:    complaints.filter(c => c.complaint?.status === 'Resolved').length,
  };

  const openReplyModal = (complaint) => {
    setSelectedComplaint(complaint);
    setReplyText(complaint.complaint?.vendorReply || complaint.complaint?.reply || '');
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
      await api.put(`/laundry/vendor/complaints/${selectedComplaint._id}/reply`, {
        vendorReply: replyText,
        reply: replyText
      });
      setMessage(`✅ Reply sent successfully.`);
      setShowReplyModal(false);
      setReplyText('');
      fetchComplaints();
    } catch (err) {
      console.error(err);
      setReplyError('❌ Failed to send reply. Try again.');
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
    <div className="ls-page">

      {/* Header */}
      <div className="ls-header">
        <div>
          <h1>⚠️ Complaints</h1>
          <p>View and reply to complaints from students</p>
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

      {/* Loading */}
      {loading && (
        <div className="ls-loading"><p>⏳ Loading complaints...</p></div>
      )}

      {!loading && (
        <>
          {/* Summary Cards */}
          <div className="ls-complaint-summary">
            {[
              { label: 'Total',     count: counts.All,           bg: '#dbeafe', color: '#1e3a8a' },
              { label: 'Pending',   count: counts.Pending,       bg: '#fef3c7', color: '#92400e' },
              { label: 'In Review', count: counts['In Review'],  bg: '#ede9fe', color: '#5b21b6' },
              { label: 'Resolved',  count: counts.Resolved,      bg: '#d1fae5', color: '#065f46' },
            ].map(s => (
              <div key={s.label} className="ls-complaint-stat"
                style={{ background: s.bg, color: s.color }}>
                <span className="ls-complaint-stat-num">{s.count}</span>
                <span className="ls-complaint-stat-label">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Filter */}
          <div className="ls-filter-row">
            {['All', 'Pending', 'In Review', 'Resolved'].map(f => (
              <button
                key={f}
                className={`ls-filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f} ({counts[f] ?? 0})
              </button>
            ))}
          </div>

          {/* Complaints List */}
          <div className="ls-section">
            <h3 className="ls-section-title">
              ⚠️ Complaints ({filtered.length})
            </h3>

            {/* Empty */}
            {complaints.length === 0 && (
              <div className="ls-empty">
                🎉 No complaints yet. Keep up the great work!
              </div>
            )}

            {complaints.length > 0 && filtered.length === 0 && (
              <div className="ls-empty">No complaints in this category. 🎉</div>
            )}

            {filtered.length > 0 && (
              <div className="ls-complaints-list">
                {filtered.map(complaint => (
                  <div key={complaint._id} className="ls-complaint-card">

                    {/* Top Row */}
                    <div className="ls-complaint-top">
                      <div className="ls-review-avatar">
                        {studentName(complaint).charAt(0).toUpperCase()}
                      </div>
                      <div className="ls-review-meta">
                        <strong>{studentName(complaint)}</strong>
                        <span>
                          {complaint.service} • {formatDate(complaint.createdAt)}
                        </span>
                      </div>
                      <div className="ls-complaint-right">
                        <span className="ls-status-badge"
                          style={{ background: statusColor(complaint.complaint?.status) }}>
                          {complaint.complaint?.status || 'Pending'}
                        </span>
                        <span className="ls-complaint-id">
                          #{complaint._id.slice(-6).toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Issue */}
                    <div className="ls-complaint-issue">
                      <span className="ls-issue-label">📌 Issue:</span>
                      <p>"{complaint.complaint?.description || complaint.complaint?.text}"</p>
                    </div>

                    {/* Reply if exists */}
                    {(complaint.complaint?.vendorReply || complaint.complaint?.reply) && (
                      <div className="ls-complaint-reply">
                        <span className="ls-reply-label">💬 Your Reply:</span>
                        <p>"{complaint.complaint?.vendorReply || complaint.complaint?.reply}"</p>
                      </div>
                    )}

                    {/* Action */}
                    {complaint.complaint?.status !== 'Resolved' && (
                      <button className="ls-reply-btn"
                        onClick={() => openReplyModal(complaint)}>
                        💬 {complaint.complaint?.vendorReply || complaint.complaint?.reply ? 'Edit Reply' : 'Send Reply'}
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
        <div className="ls-modal-overlay">
          <div className="ls-modal">
            <h3>💬 Reply to Complaint</h3>
            <p style={{ color: '#6b7280', fontSize: '13px', margin: '6px 0 4px' }}>
              <strong>#{selectedComplaint._id.slice(-6).toUpperCase()}</strong> — {studentName(selectedComplaint)}
            </p>
            <div className="ls-complaint-issue" style={{ margin: '12px 0' }}>
              <span className="ls-issue-label">📌 Issue:</span>
              <p style={{ margin: '4px 0 0' }}>
                "{selectedComplaint.complaint?.description || selectedComplaint.complaint?.text}"
              </p>
            </div>
            <div className="ls-form-group">
              <label>Your Reply *</label>
              <textarea
                rows="5"
                value={replyText}
                onChange={(e) => { setReplyText(e.target.value); setReplyError(''); }}
                placeholder="Type your response (min 10 characters)..."
                style={{ borderColor: replyError ? '#ef4444' : '' }}
              />
              {replyError
                ? <span className="ls-error">{replyError}</span>
                : <span className="ls-hint">Min 10 characters • Student will be notified</span>
              }
            </div>
            <div className="ls-modal-actions">
              <button className="ls-modal-cancel"
                onClick={() => setShowReplyModal(false)}>
                Cancel
              </button>
              <button className="ls-submit-btn" style={{ flex: 2 }}
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

export default LaundryComplaints;