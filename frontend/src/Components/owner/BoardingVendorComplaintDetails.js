import React, { useState, useEffect } from 'react';
import { getVendorTicketById, addVendorReply, resolveVendorTicket } from '../../services/ticketApi';
import { useAuth } from '../../context/AuthContext';
import './BoardingVendorComplaintDetails.css';

function BoardingVendorComplaintDetails({ ticketId, onBack }) {
  const { user } = useAuth();
  
  const [ticketData, setTicketData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);
  
  const [resolveNotes, setResolveNotes] = useState('');
  const [resolveLoading, setResolveLoading] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);

  useEffect(() => {
    if (ticketId) {
      fetchTicketDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketId]);

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      const response = await getVendorTicketById(ticketId);
      if (response.success) {
        setTicketData(response.data.ticket);
        setMessages(response.data.messages || []);
      } else {
        setError('Failed to fetch ticket details');
      }
    } catch (err) {
      console.error('Error fetching ticket details:', err);
      setError(err.response?.data?.message || 'Failed to load details');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    
    try {
      setReplyLoading(true);
      const response = await addVendorReply(ticketId, replyText);
      if (response.success) {
        setReplyText('');
        fetchTicketDetails();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reply');
    } finally {
      setReplyLoading(false);
    }
  };

  const handleResolve = async () => {
    try {
      setResolveLoading(true);
      const response = await resolveVendorTicket(ticketId, resolveNotes);
      if (response.success) {
        setShowResolveModal(false);
        fetchTicketDetails();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resolve ticket');
    } finally {
      setResolveLoading(false);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  if (loading) return <div className="boarding-detail-container">Loading details...</div>;
  if (error && !ticketData) return <div className="boarding-detail-container boarding-detail-error">{error}</div>;
  if (!ticketData) return <div className="boarding-detail-container">Ticket not found.</div>;

  const isClosedOrResolved = ['resolved', 'closed'].includes(ticketData.status);

  return (
    <div className="boarding-detail-container">
      <button onClick={handleBack} className="boarding-detail-back-btn">
        &larr; Back to Complaints
      </button>

      <div className="boarding-detail-header">
        <h2>Complaint #{ticketData.ticketNumber}</h2>
        <span className={`boarding-detail-status-badge status-${ticketData.status}`}>
          {ticketData.status.replace('_', ' ')}
        </span>
      </div>

      {error && <p className="boarding-detail-error">{error}</p>}

      <div className="boarding-detail-grid">
        <div className="boarding-detail-card">
          <h3>Student Details</h3>
          <p><strong>Name:</strong> {ticketData.studentId?.fullName}</p>
          <p><strong>Email:</strong> {ticketData.studentId?.email}</p>
        </div>

        <div className="boarding-detail-card">
          <h3>Complaint Details</h3>
          <p><strong>Title:</strong> {ticketData.title}</p>
          <p><strong>Type:</strong> {ticketData.complaintType.replace(/_/g, ' ')}</p>
          <p><strong>Priority:</strong> {ticketData.priority}</p>
          <p><strong>Date:</strong> {new Date(ticketData.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="boarding-detail-card">
        <h3>Description</h3>
        <p>{ticketData.description}</p>
      </div>

      {ticketData.complaintImage && (
        <div className="boarding-detail-card" style={{ marginTop: '20px' }}>
          <h3>Attached Image</h3>
          <div style={{ marginTop: '12px' }}>
            <img 
              src={`${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}${ticketData.complaintImage}`}
              alt="Complaint evidence"
              style={{
                maxWidth: '100%',
                maxHeight: '400px',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                objectFit: 'contain'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        </div>
      )}

      <div className="boarding-detail-messages-section">
        <h3>Conversation History</h3>
        <div className="boarding-detail-messages-container">
          {messages.length === 0 ? (
            <p className="boarding-detail-no-messages">No messages yet.</p>
          ) : (
            messages.map(msg => (
              <div key={msg._id} className={`boarding-detail-message ${msg.senderRole === 'vendor' ? 'vendor-msg' : 'other-msg'}`}>
                <div className="boarding-detail-message-header">
                  <strong>{msg.senderId?.fullName || msg.senderRole}</strong>
                  <span className="boarding-detail-message-date">{new Date(msg.createdAt).toLocaleString()}</span>
                </div>
                <div className="boarding-detail-message-body">{msg.message}</div>
              </div>
            ))
          )}
        </div>

        {!isClosedOrResolved && (
          <form onSubmit={handleReply} className="boarding-detail-reply-form">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply here..."
              required
              rows="4"
            />
            <div className="boarding-detail-form-actions">
              <button type="submit" disabled={replyLoading || !replyText.trim()} className="boarding-detail-btn boarding-detail-btn-send">
                {replyLoading ? 'Sending...' : 'Send Reply'}
              </button>
              <button 
                type="button" 
                onClick={() => setShowResolveModal(true)} 
                className="boarding-detail-btn boarding-detail-btn-resolve"
              >
                Mark as Resolved
              </button>
            </div>
          </form>
        )}

        {isClosedOrResolved && (
          <div className="boarding-detail-resolved-notice">
            This complaint is marked as {ticketData.status} and cannot receive new replies.
          </div>
        )}
      </div>

      {showResolveModal && (
        <div className="boarding-detail-modal-overlay">
          <div className="boarding-detail-modal-content">
            <h3>Resolve Complaint?</h3>
            <p>Are you sure you want to mark this complaint as resolved? This will notify the student and admin.</p>
            <textarea
              placeholder="Optional notes for resolution..."
              value={resolveNotes}
              onChange={(e) => setResolveNotes(e.target.value)}
              rows="3"
            />
            <div className="boarding-detail-modal-actions">
              <button 
                onClick={() => setShowResolveModal(false)}
                className="boarding-detail-btn boarding-detail-btn-cancel" disabled={resolveLoading}
              >
                Cancel
              </button>
              <button 
                onClick={handleResolve}
                className="boarding-detail-btn boarding-detail-btn-confirm" disabled={resolveLoading}
              >
                {resolveLoading ? 'Resolving...' : 'Confirm Resolve'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BoardingVendorComplaintDetails;
