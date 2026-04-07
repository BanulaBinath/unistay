import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVendorTicketById, addVendorReply, resolveVendorTicket } from '../../services/ticketApi';
import { useAuth } from '../../context/AuthContext';
import ItemSidebar from './itemsidebar';
import './foodVendorcomplaint.css';

function FoodVendorComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
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
    fetchTicketDetails();
  }, [id]);

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      const response = await getVendorTicketById(id);
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
      const response = await addVendorReply(id, replyText);
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
      const response = await resolveVendorTicket(id, resolveNotes);
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

  if (loading) return <div className="vendor-wrapper"><ItemSidebar/><div className="vendor-main">Loading details...</div></div>;
  if (error && !ticketData) return <div className="vendor-wrapper"><ItemSidebar/><div className="vendor-main vendor-error">{error}</div></div>;
  if (!ticketData) return <div className="vendor-wrapper"><ItemSidebar/><div className="vendor-main">Ticket not found.</div></div>;

  const isClosedOrResolved = ['resolved', 'closed'].includes(ticketData.status);

  return (
    <div className="vendor-wrapper">
      <ItemSidebar />
      <div className="ticket-details-main">
        <button onClick={() => navigate('/complaint')} className="back-btn">
          &larr; Back to Complaints
        </button>

        <div className="details-header">
          <h2>Complaint #{ticketData.ticketNumber}</h2>
          <span className={`status-badge`}>{ticketData.status.replace('_', ' ')}</span>
        </div>

        {error && <p className="vendor-error">{error}</p>}

        <div className="details-grid">
          <div className="info-card">
            <h3>Student Details</h3>
            <p><strong>Name:</strong> {ticketData.studentId?.fullName}</p>
            <p><strong>Email:</strong> {ticketData.studentId?.email}</p>
          </div>

          <div className="info-card">
            <h3>Complaint Details</h3>
            <p><strong>Title:</strong> {ticketData.title}</p>
            <p><strong>Type:</strong> {ticketData.complaintType.replace(/_/g, ' ')}</p>
            <p><strong>Priority:</strong> {ticketData.priority}</p>
            <p><strong>Date:</strong> {new Date(ticketData.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="description-card">
          <h3>Description</h3>
          <p>{ticketData.description}</p>
        </div>

        <div className="messages-section">
          <h3>Conversation History</h3>
          <div className="messages-container">
            {messages.length === 0 ? (
              <p className="vendor-no-items">No messages yet.</p>
            ) : (
              messages.map(msg => (
                <div key={msg._id} className={`message-bubble ${msg.senderRole === 'vendor' ? 'vendor-msg' : 'other-msg'}`}>
                  <div className="message-header">
                    <strong>{msg.senderId?.fullName || msg.senderRole}</strong>
                    <span className="message-date">{new Date(msg.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="message-body">{msg.message}</div>
                </div>
              ))
            )}
          </div>

          {!isClosedOrResolved && (
            <form onSubmit={handleReply} className="reply-form">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply here..."
                required
                rows="4"
              />
              <div className="form-actions">
                <button type="submit" disabled={replyLoading || !replyText.trim()} className="vendor-btn">
                  {replyLoading ? 'Sending...' : 'Send Reply'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowResolveModal(true)} 
                  className="vendor-btn vendor-btn-update"
                >
                  Mark as Resolved
                </button>
              </div>
            </form>
          )}

          {isClosedOrResolved && (
            <div className="resolved-notice">
              This complaint is marked as {ticketData.status} and cannot receive new replies.
            </div>
          )}
        </div>
      </div>

      {showResolveModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Resolve Complaint?</h3>
            <p>Are you sure you want to mark this complaint as resolved? This will notify the student and admin.</p>
            <textarea
              placeholder="Optional notes for resolution..."
              value={resolveNotes}
              onChange={(e) => setResolveNotes(e.target.value)}
              rows="3"
            />
            <div className="modal-actions">
              <button 
                onClick={() => setShowResolveModal(false)}
                className="vendor-btn" disabled={resolveLoading}
              >
                Cancel
              </button>
              <button 
                onClick={handleResolve}
                className="vendor-btn vendor-btn-update" disabled={resolveLoading}
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

export default FoodVendorComplaintDetails;