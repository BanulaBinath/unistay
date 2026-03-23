import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getAdminTicketDetails,
  updateTicketStatus,
  updateTicketPriority,
  assignTicket,
  resolveTicket,
  closeTicketAdmin,
  issueVendorWarning,
  rejectTicket,
  addAdminMessage
} from '../../services/ticketApi';
import TicketStatusBadge from '../../Components/tickets/TicketStatusBadge';
import TicketPriorityBadge from '../../Components/tickets/TicketPriorityBadge';
import './AdminTicketDetailsPage.css';

const AdminTicketDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [actionLogs, setActionLogs] = useState([]);
  const [vendorWarningInfo, setVendorWarningInfo] = useState(null);
  const [studentMisuseInfo, setStudentMisuseInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  
  const [newMessage, setNewMessage] = useState('');
  const [showModal, setShowModal] = useState(null);
  const [modalData, setModalData] = useState({});

  useEffect(() => {
    fetchTicketDetails();
  }, [id]);

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getAdminTicketDetails(id);
      
      if (response.success) {
        setTicket(response.data.ticket);
        setMessages(response.data.messages);
        setActionLogs(response.data.actionLogs);
        setVendorWarningInfo(response.data.vendorWarningInfo);
        setStudentMisuseInfo(response.data.studentMisuseInfo);
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
      const response = await addAdminMessage(id, newMessage);
      
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

  const handleStatusChange = async () => {
    try {
      setActionLoading(true);
      const response = await updateTicketStatus(id, modalData.status, modalData.notes);
      
      if (response.success) {
        setShowModal(null);
        setModalData({});
        fetchTicketDetails();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePriorityChange = async () => {
    try {
      setActionLoading(true);
      const response = await updateTicketPriority(id, modalData.priority, modalData.notes);
      
      if (response.success) {
        setShowModal(null);
        setModalData({});
        fetchTicketDetails();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update priority');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResolve = async () => {
    try {
      setActionLoading(true);
      const response = await resolveTicket(id, modalData.notes);
      
      if (response.success) {
        setShowModal(null);
        setModalData({});
        fetchTicketDetails();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to resolve ticket');
    } finally {
      setActionLoading(false);
    }
  };

  const handleClose = async () => {
    try {
      setActionLoading(true);
      const response = await closeTicketAdmin(id, modalData.notes);
      
      if (response.success) {
        setShowModal(null);
        setModalData({});
        fetchTicketDetails();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to close ticket');
    } finally {
      setActionLoading(false);
    }
  };

  const handleWarnVendor = async () => {
    try {
      setActionLoading(true);
      const response = await issueVendorWarning(id, modalData.reason);
      
      if (response.success) {
        setShowModal(null);
        setModalData({});
        fetchTicketDetails();
        alert('Warning issued successfully');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to issue warning');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setActionLoading(true);
      const response = await rejectTicket(id, modalData.reason);
      
      if (response.success) {
        setShowModal(null);
        setModalData({});
        fetchTicketDetails();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject ticket');
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
        <button onClick={() => navigate('/admin/tickets')} className="back-button">
          ← Back to Tickets
        </button>
      </div>
    );
  }

  if (!ticket) {
    return <div className="loading">Ticket not found</div>;
  }

  return (
    <div className="admin-ticket-details-page">
      <div className="page-header">
        <button onClick={() => navigate('/admin/tickets')} className="back-button">
          ← Back to Tickets
        </button>
      </div>

      <div className="ticket-details-container">
        <div className="main-content">
          <div className="ticket-info-card">
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
                <strong>Student:</strong>
                <span>{ticket.studentId?.fullName}</span>
                <small>{ticket.studentId?.email}</small>
              </div>
              <div className="detail-item">
                <strong>Service Category:</strong>
                <span>{ticket.serviceCategory}</span>
              </div>
              <div className="detail-item">
                <strong>Complaint Type:</strong>
                <span>{ticket.complaintType.replace(/_/g, ' ')}</span>
              </div>
              <div className="detail-item">
                <strong>Created:</strong>
                <span>{formatDate(ticket.createdAt)}</span>
              </div>
              {ticket.vendorId && (
                <div className="detail-item">
                  <strong>Vendor:</strong>
                  <span>{ticket.vendorId.businessName || ticket.vendorId.fullName}</span>
                  <small>{ticket.vendorId.email}</small>
                </div>
              )}
              {ticket.escalationLevel > 0 && (
                <div className="detail-item escalation">
                  <strong>Escalation Level:</strong>
                  <span>{ticket.escalationLevel}</span>
                </div>
              )}
              {ticket.warningIssued && (
                <div className="detail-item warning">
                  <strong>Warning Issued:</strong>
                  <span>Yes - {formatDate(ticket.warningDetails.issuedAt)}</span>
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

            {vendorWarningInfo && vendorWarningInfo.shouldWarn && (
              <div className="warning-recommendation">
                <h4>⚠️ Vendor Warning Recommendation</h4>
                <p><strong>Level:</strong> {vendorWarningInfo.level}</p>
                <p><strong>Reason:</strong> {vendorWarningInfo.reason}</p>
              </div>
            )}

            {studentMisuseInfo && studentMisuseInfo.shouldFlag && (
              <div className="misuse-alert">
                <h4>⚠️ Student Misuse Alert</h4>
                <p>{studentMisuseInfo.reason}</p>
              </div>
            )}
          </div>

          <div className="messages-card">
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

            <form onSubmit={handleSendMessage} className="message-form">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type admin message..."
                rows="3"
                maxLength="1000"
                disabled={actionLoading}
              />
              <div className="message-form-footer">
                <small>{newMessage.length}/1000</small>
                <button type="submit" disabled={actionLoading || !newMessage.trim()}>
                  {actionLoading ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="sidebar">
          <div className="actions-card">
            <h3>Admin Actions</h3>
            
            <button
              className="action-btn"
              onClick={() => {
                setShowModal('status');
                setModalData({ status: ticket.status, notes: '' });
              }}
            >
              Change Status
            </button>

            <button
              className="action-btn"
              onClick={() => {
                setShowModal('priority');
                setModalData({ priority: ticket.priority, notes: '' });
              }}
            >
              Change Priority
            </button>

            <button
              className="action-btn success"
              onClick={() => {
                setShowModal('resolve');
                setModalData({ notes: '' });
              }}
              disabled={ticket.status === 'resolved' || ticket.status === 'closed'}
            >
              Resolve Ticket
            </button>

            <button
              className="action-btn secondary"
              onClick={() => {
                setShowModal('close');
                setModalData({ notes: '' });
              }}
              disabled={ticket.status === 'closed'}
            >
              Close Ticket
            </button>

            {ticket.vendorId && !ticket.warningIssued && (
              <button
                className="action-btn warning"
                onClick={() => {
                  setShowModal('warn');
                  setModalData({ reason: '' });
                }}
              >
                Warn Vendor
              </button>
            )}

            <button
              className="action-btn danger"
              onClick={() => {
                setShowModal('reject');
                setModalData({ reason: '' });
              }}
              disabled={ticket.status === 'rejected'}
            >
              Reject Ticket
            </button>
          </div>

          <div className="action-logs-card">
            <h3>Action History</h3>
            <div className="action-logs-list">
              {actionLogs.slice(0, 10).map(log => (
                <div key={log._id} className="action-log-item">
                  <div className="log-action">{log.actionType.replace(/_/g, ' ')}</div>
                  <div className="log-user">{log.actionBy?.fullName}</div>
                  <div className="log-time">{formatDate(log.createdAt)}</div>
                  {log.notes && <div className="log-notes">{log.notes}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showModal === 'status' && (
        <div className="modal-overlay" onClick={() => setShowModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Change Status</h3>
            <select
              value={modalData.status}
              onChange={(e) => setModalData({ ...modalData, status: e.target.value })}
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="waiting_vendor">Waiting Vendor</option>
              <option value="waiting_student">Waiting Student</option>
              <option value="escalated">Escalated</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <textarea
              placeholder="Notes (optional)"
              value={modalData.notes}
              onChange={(e) => setModalData({ ...modalData, notes: e.target.value })}
              rows="3"
            />
            <div className="modal-actions">
              <button onClick={() => setShowModal(null)} className="cancel-btn">Cancel</button>
              <button onClick={handleStatusChange} className="confirm-btn" disabled={actionLoading}>
                {actionLoading ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal === 'priority' && (
        <div className="modal-overlay" onClick={() => setShowModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Change Priority</h3>
            <select
              value={modalData.priority}
              onChange={(e) => setModalData({ ...modalData, priority: e.target.value })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
            <textarea
              placeholder="Notes (optional)"
              value={modalData.notes}
              onChange={(e) => setModalData({ ...modalData, notes: e.target.value })}
              rows="3"
            />
            <div className="modal-actions">
              <button onClick={() => setShowModal(null)} className="cancel-btn">Cancel</button>
              <button onClick={handlePriorityChange} className="confirm-btn" disabled={actionLoading}>
                {actionLoading ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal === 'resolve' && (
        <div className="modal-overlay" onClick={() => setShowModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Resolve Ticket</h3>
            <textarea
              placeholder="Resolution notes (optional)"
              value={modalData.notes}
              onChange={(e) => setModalData({ ...modalData, notes: e.target.value })}
              rows="4"
            />
            <div className="modal-actions">
              <button onClick={() => setShowModal(null)} className="cancel-btn">Cancel</button>
              <button onClick={handleResolve} className="confirm-btn" disabled={actionLoading}>
                {actionLoading ? 'Resolving...' : 'Resolve'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal === 'close' && (
        <div className="modal-overlay" onClick={() => setShowModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Close Ticket</h3>
            <textarea
              placeholder="Closing notes (optional)"
              value={modalData.notes}
              onChange={(e) => setModalData({ ...modalData, notes: e.target.value })}
              rows="4"
            />
            <div className="modal-actions">
              <button onClick={() => setShowModal(null)} className="cancel-btn">Cancel</button>
              <button onClick={handleClose} className="confirm-btn" disabled={actionLoading}>
                {actionLoading ? 'Closing...' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal === 'warn' && (
        <div className="modal-overlay" onClick={() => setShowModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Issue Vendor Warning</h3>
            <p>This action will issue a formal warning to the vendor.</p>
            <textarea
              placeholder="Warning reason (required)"
              value={modalData.reason}
              onChange={(e) => setModalData({ ...modalData, reason: e.target.value })}
              rows="4"
              required
            />
            <div className="modal-actions">
              <button onClick={() => setShowModal(null)} className="cancel-btn">Cancel</button>
              <button
                onClick={handleWarnVendor}
                className="confirm-btn warning"
                disabled={actionLoading || !modalData.reason?.trim()}
              >
                {actionLoading ? 'Issuing...' : 'Issue Warning'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal === 'reject' && (
        <div className="modal-overlay" onClick={() => setShowModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Reject Ticket</h3>
            <p>This will mark the complaint as invalid/rejected.</p>
            <textarea
              placeholder="Rejection reason (required)"
              value={modalData.reason}
              onChange={(e) => setModalData({ ...modalData, reason: e.target.value })}
              rows="4"
              required
            />
            <div className="modal-actions">
              <button onClick={() => setShowModal(null)} className="cancel-btn">Cancel</button>
              <button
                onClick={handleReject}
                className="confirm-btn danger"
                disabled={actionLoading || !modalData.reason?.trim()}
              >
                {actionLoading ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTicketDetailsPage;
