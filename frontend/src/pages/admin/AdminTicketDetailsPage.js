import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getAdminTicketDetails,
  updateTicketStatus,
  updateTicketPriority,
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
    return (
      <div className="modern-tickets-container">
        <div className="loader-container">
          <div className="modern-spinner"></div>
          <p>Loading ticket details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="modern-tickets-container">
        <div className="alert-banner alert-danger" style={{ marginBottom: '20px' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {error}
        </div>
        <button onClick={() => navigate('/admin/tickets')} className="btn-modern btn-ghost" style={{ border: '1px solid var(--sm-border)', color: 'var(--sm-text-main)' }}>
          ← Back to Tickets
        </button>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="modern-tickets-container">
        <div className="empty-state">
           <div className="empty-state-content">
             <p>Ticket not found</p>
             <button onClick={() => navigate('/admin/tickets')} className="btn-modern btn-primary mt-2">
               Back to Tickets
             </button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modern-tickets-container ticket-details-view">
      <header className="page-heading-row" style={{ alignItems: 'flex-start' }}>
        <div>
          <button onClick={() => navigate('/admin/tickets')} className="back-link-btn" style={{ background: 'transparent', border: 'none', color: 'var(--sm-text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', fontWeight: 500, padding: 0, marginBottom: '12px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Back to Tickets
          </button>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {ticket.title}
          </h1>
          <p className="page-description" style={{ marginTop: '6px' }}>Ticket #{ticket.ticketNumber}</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <TicketPriorityBadge priority={ticket.priority} />
          <TicketStatusBadge status={ticket.status} />
        </div>
      </header>

      <div className="ticket-layout-grid">
        <div className="ticket-main-col">
          <div className="modern-dtl-card">
            <h3 className="dtl-card-title">Ticket Information</h3>
            
            <div className="details-info-grid">
              <div className="info-box">
                <label>Student</label>
                <div className="detail-text">{ticket.studentId?.fullName || 'N/A'}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--sm-text-muted)' }}>{ticket.studentId?.email}</div>
              </div>
              
              {ticket.vendorId && (
                <div className="info-box">
                  <label>Vendor</label>
                  <div className="detail-text">{ticket.vendorId.businessName || ticket.vendorId.fullName || 'N/A'}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--sm-text-muted)' }}>{ticket.vendorId.email}</div>
                </div>
              )}
              
              <div className="info-box">
                <label>Service Category</label>
                <div className="detail-text" style={{ textTransform: 'capitalize' }}>{ticket.serviceCategory}</div>
              </div>
              
              <div className="info-box">
                <label>Complaint Type</label>
                <div className="detail-text" style={{ textTransform: 'capitalize' }}>{ticket.complaintType.replace(/_/g, ' ')}</div>
              </div>

              <div className="info-box">
                <label>Created Date</label>
                <div className="detail-text">{formatDate(ticket.createdAt)}</div>
              </div>

              {ticket.escalationLevel > 0 && (
                <div className="info-box" style={{ background: '#FEF2F2', borderColor: '#FECACA' }}>
                  <label style={{ color: '#991B1B' }}>Escalation Level</label>
                  <div className="detail-text" style={{ color: '#991B1B', fontWeight: 700 }}>Level {ticket.escalationLevel}</div>
                </div>
              )}

              {ticket.warningIssued && (
                <div className="info-box" style={{ background: '#FFFBEB', borderColor: '#FDE68A' }}>
                  <label style={{ color: '#92400E' }}>Warning Issued</label>
                  <div className="detail-text" style={{ color: '#92400E', fontWeight: 600 }}>
                    Yes - {formatDate(ticket.warningDetails.issuedAt)}
                  </div>
                </div>
              )}
            </div>

            <div className="dtl-divider"></div>

            <div className="dtl-desc-section">
              <label>Description</label>
              <div className="dtl-desc-content">
                {ticket.description}
              </div>
            </div>

            {ticket.rejectionReason && (
              <div className="dtl-desc-section" style={{ marginTop: '20px' }}>
                <label style={{ color: '#991B1B' }}>Rejection Reason</label>
                <div className="dtl-desc-content" style={{ background: '#FEF2F2', borderLeft: '4px solid #EF4444' }}>
                  {ticket.rejectionReason}
                </div>
              </div>
            )}

            {vendorWarningInfo && vendorWarningInfo.shouldWarn && (
              <div className="dtl-alert-box alert-warning" style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>Vendor Warning Recommendation</h4>
                </div>
                <div style={{ fontSize: '0.85rem' }}>
                  <strong>Level:</strong> {vendorWarningInfo.level}<br/>
                  <strong>Reason:</strong> {vendorWarningInfo.reason}
                </div>
              </div>
            )}

            {studentMisuseInfo && studentMisuseInfo.shouldFlag && (
              <div className="dtl-alert-box alert-danger" style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>Student Misuse Alert</h4>
                </div>
                <div style={{ fontSize: '0.85rem' }}>{studentMisuseInfo.reason}</div>
              </div>
            )}
          </div>

          <div className="modern-dtl-card mt-4">
            <h3 className="dtl-card-title">Conversation</h3>
            
            <div className="msg-thread">
              {messages.length === 0 ? (
                <div className="empty-state" style={{ padding: '2rem 1rem' }}>
                  <p>No messages yet</p>
                </div>
              ) : (
                messages.map(msg => (
                  <div key={msg._id} className={`msg-bubble ${msg.senderRole}`}>
                    <div className="msg-header">
                      <span className="msg-author">{msg.senderId.fullName} <span style={{ fontWeight: 400, opacity: 0.8 }}>({msg.senderRole})</span></span>
                      <span className="msg-time">{formatDate(msg.createdAt)}</span>
                    </div>
                    <div className="msg-text">{msg.message}</div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleSendMessage} className="msg-reply-box">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type admin message..."
                rows="3"
                maxLength="1000"
                disabled={actionLoading}
                className="modern-textarea"
              />
              <div className="msg-reply-footer">
                <span className="char-count">{newMessage.length}/1000</span>
                <button type="submit" className="btn-modern btn-primary" disabled={actionLoading || !newMessage.trim()}>
                  {actionLoading ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="ticket-sidebar-col">
          <div className="modern-dtl-card">
            <h3 className="dtl-card-title">Admin Actions</h3>
            <div className="admin-actions-grid">
              <button className="btn-action-panel primary" onClick={() => { setShowModal('status'); setModalData({ status: ticket.status, notes: '' }); }}>
                Change Status
              </button>
              <button className="btn-action-panel primary" onClick={() => { setShowModal('priority'); setModalData({ priority: ticket.priority, notes: '' }); }}>
                Change Priority
              </button>
              
              <div className="dtl-divider" style={{ margin: '12px 0' }}></div>
              
              <button className="btn-action-panel success" onClick={() => { setShowModal('resolve'); setModalData({ notes: '' }); }} disabled={ticket.status === 'resolved' || ticket.status === 'closed'}>
                Resolve Ticket
              </button>
              <button className="btn-action-panel neutral" onClick={() => { setShowModal('close'); setModalData({ notes: '' }); }} disabled={ticket.status === 'closed'}>
                Close Ticket
              </button>

              {ticket.vendorId && !ticket.warningIssued && (
                <button className="btn-action-panel warning mt-2" onClick={() => { setShowModal('warn'); setModalData({ reason: '' }); }}>
                  Warn Vendor
                </button>
              )}

              <button className="btn-action-panel danger mt-2" onClick={() => { setShowModal('reject'); setModalData({ reason: '' }); }} disabled={ticket.status === 'rejected'}>
                Reject Ticket
              </button>
            </div>
          </div>

          <div className="modern-dtl-card mt-4">
            <h3 className="dtl-card-title">Action History</h3>
            <div className="action-timeline">
              {actionLogs.length === 0 ? (
                <div style={{ fontSize: '0.85rem', color: 'var(--sm-text-muted)', textAlign: 'center', padding: '1rem' }}>No actions recorded</div>
              ) : (
                actionLogs.slice(0, 10).map((log, idx) => (
                  <div key={log._id} className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <div className="timeline-action">{log.actionType.replace(/_/g, ' ')}</div>
                      <div className="timeline-meta">by {log.actionBy?.fullName} • {formatDate(log.createdAt)}</div>
                      {log.notes && <div className="timeline-notes">{log.notes}</div>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modern-modal-overlay" onClick={() => setShowModal(null)}>
          <div className="modern-modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h3>
                {showModal === 'status' && 'Change Status'}
                {showModal === 'priority' && 'Change Priority'}
                {showModal === 'resolve' && 'Resolve Ticket'}
                {showModal === 'close' && 'Close Ticket'}
                {showModal === 'warn' && 'Issue Vendor Warning'}
                {showModal === 'reject' && 'Reject Ticket'}
              </h3>
              <button className="btn-close" onClick={() => setShowModal(null)}>&times;</button>
            </div>
            
            <div className="modal-body">
              {showModal === 'status' && (
                <>
                  <select value={modalData.status} onChange={e => setModalData({...modalData, status: e.target.value})} className="modern-select" style={{ width: '100%', marginBottom: '16px' }}>
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="waiting_vendor">Waiting Vendor</option>
                    <option value="waiting_student">Waiting Student</option>
                    <option value="escalated">Escalated</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                  <textarea className="modern-textarea" placeholder="Notes (optional)" value={modalData.notes} onChange={e => setModalData({...modalData, notes: e.target.value})} rows="3" />
                </>
              )}
              {showModal === 'priority' && (
                <>
                  <select value={modalData.priority} onChange={e => setModalData({...modalData, priority: e.target.value})} className="modern-select" style={{ width: '100%', marginBottom: '16px' }}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                  <textarea className="modern-textarea" placeholder="Notes (optional)" value={modalData.notes} onChange={e => setModalData({...modalData, notes: e.target.value})} rows="3" />
                </>
              )}
              {showModal === 'resolve' && (
                <textarea className="modern-textarea" placeholder="Resolution notes (optional)" value={modalData.notes} onChange={e => setModalData({...modalData, notes: e.target.value})} rows="4" />
              )}
              {showModal === 'close' && (
                <textarea className="modern-textarea" placeholder="Closing notes (optional)" value={modalData.notes} onChange={e => setModalData({...modalData, notes: e.target.value})} rows="4" />
              )}
              {showModal === 'warn' && (
                <>
                  <p style={{ fontSize: '0.85rem', color: 'var(--sm-text-muted)', marginBottom: '12px' }}>This action will issue a formal warning to the vendor.</p>
                  <textarea className="modern-textarea" placeholder="Warning reason (required)" value={modalData.reason} onChange={e => setModalData({...modalData, reason: e.target.value})} rows="4" required />
                </>
              )}
              {showModal === 'reject' && (
                <>
                  <p style={{ fontSize: '0.85rem', color: 'var(--sm-text-muted)', marginBottom: '12px' }}>This will mark the complaint as invalid/rejected.</p>
                  <textarea className="modern-textarea" placeholder="Rejection reason (required)" value={modalData.reason} onChange={e => setModalData({...modalData, reason: e.target.value})} rows="4" required />
                </>
              )}
            </div>

            <div className="modal-footer">
              <button onClick={() => setShowModal(null)} className="btn-modern btn-ghost" style={{ border: '1px solid var(--sm-border)', color: 'var(--sm-text-main)' }}>Cancel</button>
              <button 
                onClick={() => {
                  if (showModal === 'status') handleStatusChange();
                  if (showModal === 'priority') handlePriorityChange();
                  if (showModal === 'resolve') handleResolve();
                  if (showModal === 'close') handleClose();
                  if (showModal === 'warn') handleWarnVendor();
                  if (showModal === 'reject') handleReject();
                }} 
                className={`btn-modern ${showModal === 'warn' ? 'btn-danger' : showModal === 'reject' ? 'btn-danger' : 'btn-primary'}`}
                disabled={actionLoading || ((showModal === 'warn' || showModal === 'reject') && !modalData.reason?.trim())}
                style={showModal === 'warn' ? { background: '#F59E0B', color: 'white' } : {}}
              >
                {actionLoading ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTicketDetailsPage;