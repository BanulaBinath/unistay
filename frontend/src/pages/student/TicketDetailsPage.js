import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getTicketById,
  addTicketMessage,
  closeTicket,
  reopenTicket,
  escalateTicket
} from '../../services/ticketApi';
import TicketStatusBadge from '../../Components/tickets/TicketStatusBadge';
import TicketPriorityBadge from '../../Components/tickets/TicketPriorityBadge';
import './TicketDetailsPage.css';

const TicketDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [actionLogs, setActionLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [showReopenModal, setShowReopenModal] = useState(false);
  const [escalateReason, setEscalateReason] = useState('');
  const [reopenReason, setReopenReason] = useState('');

  useEffect(() => {
    fetchTicketDetails();
  }, [id]);

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getTicketById(id);
      
      if (response.success) {
        setTicket(response.data.ticket);
        setMessages(response.data.messages);
        setActionLogs(response.data.actionLogs);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load ticket details');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    try {
      setActionLoading(true);
      const response = await addTicketMessage(id, newMessage);
      
      if (response.success) {
        setMessages([...messages, response.data]);
        setNewMessage('');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send message');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCloseTicket = async () => {
    if (!window.confirm('Are you sure you want to close this ticket?')) return;

    try {
      setActionLoading(true);
      const response = await closeTicket(id);
      
      if (response.success) {
        fetchTicketDetails();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to close ticket');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReopenTicket = async () => {
    try {
      setActionLoading(true);
      const response = await reopenTicket(id, reopenReason);
      
      if (response.success) {
        setShowReopenModal(false);
        setReopenReason('');
        fetchTicketDetails();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reopen ticket');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEscalateTicket = async () => {
    try {
      setActionLoading(true);
      const response = await escalateTicket(id, escalateReason);
      
      if (response.success) {
        setShowEscalateModal(false);
        setEscalateReason('');
        fetchTicketDetails();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to escalate ticket');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading">Loading ticket details...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate('/student/complaints')} className="back-button">
          ← Back to My Complaints
        </button>
      </div>
    );
  }

  if (!ticket) {
    return <div className="loading">Ticket not found</div>;
  }

  const canAddMessage = ticket.status !== 'closed';
  const canClose = ticket.status !== 'closed' && ticket.status !== 'resolved';
  const canReopen = ticket.status === 'closed' || ticket.status === 'resolved';
  const canEscalate = ticket.status !== 'closed' && ticket.status !== 'resolved' && ticket.escalationLevel < 3;

  return (
    <div className="ticket-details-page">
      <div className="page-header">
        <button onClick={() => navigate('/student/complaints')} className="back-button">
          ← Back to My Complaints
        </button>
      </div>

      <div className="ticket-details-container">
        <div className="ticket-info-section">
          <div className="ticket-header-info">
            <div>
              <div className="ticket-number">{ticket.ticketNumber}</div>
              <h1 className="ticket-title">{ticket.title}</h1>
            </div>
            <div className="ticket-badges">
              <TicketPriorityBadge priority={ticket.priority} />
              <TicketStatusBadge status={ticket.status} />
            </div>
          </div>

          <div className="ticket-details-grid">
            <div className="detail-item">
              <strong>Service Category:</strong>
              <span>{ticket.serviceCategory}</span>
            </div>
            <div className="detail-item">
              <strong>Complaint Type:</strong>
              <span>{ticket.complaintType.replace(/_/g, ' ')}</span>
            </div>
            {ticket.vendorId && (
              <div className="detail-item">
                <strong>Vendor:</strong>
                <span>{ticket.vendorId.businessName || ticket.vendorId.fullName}</span>
              </div>
            )}
            {ticket.vendorReference && (
              <div className="detail-item">
                <strong>Vendor Reference:</strong>
                <span>{ticket.vendorReference}</span>
              </div>
            )}
            {ticket.serviceItemReference && (
              <div className="detail-item">
                <strong>Service Reference:</strong>
                <span>{ticket.serviceItemReference}</span>
              </div>
            )}
            <div className="detail-item">
              <strong>Created:</strong>
              <span>{formatDate(ticket.createdAt)}</span>
            </div>
            {ticket.escalationLevel > 0 && (
              <div className="detail-item">
                <strong>Escalation Level:</strong>
                <span className="escalation-level">{ticket.escalationLevel}</span>
              </div>
            )}
            {ticket.warningIssued && (
              <div className="detail-item warning-issued">
                <strong>Warning Issued:</strong>
                <span>Yes</span>
              </div>
            )}
          </div>

          <div className="description-section">
            <h3>Description</h3>
            <p>{ticket.description}</p>
          </div>

          {ticket.rejectionReason && (
            <div className="rejection-section">
              <h3>Rejection Reason</h3>
              <p>{ticket.rejectionReason}</p>
            </div>
          )}

          <div className="action-buttons">
            {canAddMessage && (
              <button className="action-btn primary" disabled>
                Reply Below
              </button>
            )}
            {canEscalate && (
              <button
                className="action-btn warning"
                onClick={() => setShowEscalateModal(true)}
                disabled={actionLoading}
              >
                Escalate
              </button>
            )}
            {canClose && (
              <button
                className="action-btn secondary"
                onClick={handleCloseTicket}
                disabled={actionLoading}
              >
                Close Ticket
              </button>
            )}
            {canReopen && (
              <button
                className="action-btn success"
                onClick={() => setShowReopenModal(true)}
                disabled={actionLoading}
              >
                Reopen Ticket
              </button>
            )}
          </div>
        </div>

        <div className="messages-section">
          <h2>Conversation</h2>
          
          <div className="messages-list">
            {messages.length === 0 ? (
              <p className="no-messages">No messages yet</p>
            ) : (
              messages.map(msg => (
                <div key={msg._id} className={`message ${msg.senderRole}`}>
                  <div className="message-header">
                    <strong>{msg.senderId.fullName}</strong>
                    <span className="message-role">({msg.senderRole})</span>
                    <span className="message-time">{formatDate(msg.createdAt)}</span>
                  </div>
                  <div className="message-content">{msg.message}</div>
                </div>
              ))
            )}
          </div>

          {canAddMessage && (
            <form onSubmit={handleSendMessage} className="message-form">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                rows="4"
                maxLength="1000"
                disabled={actionLoading}
              />
              <div className="message-form-footer">
                <small>{newMessage.length}/1000 characters</small>
                <button type="submit" disabled={actionLoading || !newMessage.trim()}>
                  {actionLoading ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {showEscalateModal && (
        <div className="modal-overlay" onClick={() => setShowEscalateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Escalate Ticket</h3>
            <p>Please provide a reason for escalating this ticket:</p>
            <textarea
              value={escalateReason}
              onChange={(e) => setEscalateReason(e.target.value)}
              placeholder="Reason for escalation..."
              rows="4"
            />
            <div className="modal-actions">
              <button onClick={() => setShowEscalateModal(false)} className="cancel-btn">
                Cancel
              </button>
              <button
                onClick={handleEscalateTicket}
                className="confirm-btn"
                disabled={actionLoading || !escalateReason.trim()}
              >
                {actionLoading ? 'Escalating...' : 'Escalate'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showReopenModal && (
        <div className="modal-overlay" onClick={() => setShowReopenModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Reopen Ticket</h3>
            <p>Please provide a reason for reopening this ticket:</p>
            <textarea
              value={reopenReason}
              onChange={(e) => setReopenReason(e.target.value)}
              placeholder="Reason for reopening..."
              rows="4"
            />
            <div className="modal-actions">
              <button onClick={() => setShowReopenModal(false)} className="cancel-btn">
                Cancel
              </button>
              <button
                onClick={handleReopenTicket}
                className="confirm-btn"
                disabled={actionLoading}
              >
                {actionLoading ? 'Reopening...' : 'Reopen'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketDetailsPage;
