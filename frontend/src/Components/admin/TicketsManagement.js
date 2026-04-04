import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllTickets, updateTicketStatus, updateTicketPriority, resolveTicket, closeTicket } from '../../services/adminApi';
import './TicketsManagement.css';

function TicketsManagement() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    serviceCategory: '',
    search: ''
  });

  useEffect(() => {
    fetchTickets();
  }, [filters]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getAllTickets(filters);
      if (response.success) {
        setTickets(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      const response = await updateTicketStatus(ticketId, newStatus);
      if (response.success) {
        fetchTickets();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update ticket status');
    }
  };

  const handlePriorityChange = async (ticketId, newPriority) => {
    try {
      const response = await updateTicketPriority(ticketId, newPriority);
      if (response.success) {
        fetchTickets();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update ticket priority');
    }
  };

  const handleResolve = async (ticketId) => {
    try {
      const response = await resolveTicket(ticketId);
      if (response.success) {
        fetchTickets();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to resolve ticket');
    }
  };

  const handleClose = async (ticketId) => {
    try {
      const response = await closeTicket(ticketId);
      if (response.success) {
        fetchTickets();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to close ticket');
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
      case 'closed':
        return 'success';
      case 'open':
        return 'warning';
      case 'in_progress':
        return 'primary';
      case 'escalated':
      case 'rejected':
        return 'danger';
      default:
        return 'gray';
    }
  };

  return (
    <div className="modern-tickets-container">
      <header className="page-heading-row">
        <div>
          <h1 className="page-title">Tickets Management</h1>
          <p className="page-description">Monitor and resolve support tickets</p>
        </div>
      </header>

      {error && (
        <div className="alert-banner alert-danger">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {!loading && tickets.length > 0 && (
        <div className="metrics-grid">
          <div className="metric-card complex-card">
            <div className="card-inner-top">
              <div className="metric-data">
                <p className="metric-title">Total Tickets</p>
                <h3 className="metric-value">{tickets.length}</h3>
              </div>
              <div className="metric-icon primary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="metric-card complex-card">
            <div className="card-inner-top">
              <div className="metric-data">
                <p className="metric-title">Open</p>
                <h3 className="metric-value">{tickets.filter(t => t.status === 'open').length}</h3>
              </div>
              <div className="metric-icon warning">
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="metric-card complex-card">
            <div className="card-inner-top">
              <div className="metric-data">
                <p className="metric-title">In Progress</p>
                <h3 className="metric-value">{tickets.filter(t => t.status === 'in_progress').length}</h3>
              </div>
              <div className="metric-icon success" style={{ background: '#EEF2FF', color: 'var(--sm-primary)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="metric-card complex-card">
            <div className="card-inner-top">
              <div className="metric-data">
                <p className="metric-title">Resolved</p>
                <h3 className="metric-value">{tickets.filter(t => t.status === 'resolved').length}</h3>
              </div>
              <div className="metric-icon success">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="toolbar-card">
        <div className="filters-wrapper" style={{ width: '100%', justifyContent: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <select name="status" value={filters.status} onChange={handleFilterChange} className="modern-select">
            <option value="">Status: All</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="escalated">Escalated</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
            <option value="rejected">Rejected</option>
          </select>

          <select name="priority" value={filters.priority} onChange={handleFilterChange} className="modern-select">
            <option value="">Priority: All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>

          <select name="serviceCategory" value={filters.serviceCategory} onChange={handleFilterChange} className="modern-select">
            <option value="">Category: All</option>
            <option value="food">Food</option>
            <option value="boarding">Boarding</option>
            <option value="laundry">Laundry</option>
            <option value="cleaning">Cleaning</option>
          </select>

          <input
            type="text"
            name="search"
            placeholder="Search by ticket number or title..."
            value={filters.search}
            onChange={handleFilterChange}
            className="modern-search-input"
            style={{ padding: '0.5rem 1rem', border: '1px solid #E5E7EB', borderRadius: '8px', flex: '1', minWidth: '200px' }}
          />
        </div>
      </div>

      {loading ? (
        <div className="loader-container">
          <div className="modern-spinner"></div>
          <p>Loading tickets...</p>
        </div>
      ) : (
        <div className="modern-table-card">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Ticket #</th>
                <th>Subject</th>
                <th>Student</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Created</th>
                <th className="actions-cell">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-state">
                    <div className="empty-state-content">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M23 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75" />
                      </svg>
                      <p>No matching tickets found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket._id}>
                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--sm-text-primary)' }}>{ticket.ticketNumber}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500, color: 'var(--sm-text-primary)' }}>{ticket.title}</div>
                      <small style={{ color: 'var(--sm-text-secondary)' }}>{ticket.complaintType}</small>
                    </td>
                    <td>
                      <div className="user-info-cell" style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className="user-name">{ticket.studentId?.fullName || 'Unknown'}</span>
                        <span className="user-email" style={{ fontSize: '0.8rem', color: 'var(--sm-text-secondary)' }}>{ticket.studentId?.email}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-gray" style={{ textTransform: 'capitalize' }}>
                        {ticket.serviceCategory}
                      </span>
                    </td>
                    <td>
                      <select
                        value={ticket.priority}
                        onChange={(e) => handlePriorityChange(ticket._id, e.target.value)}
                        className="modern-select"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem' }}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </td>
                    <td>
                      <span className={adge badge-}>
                        {ticket.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td>{formatDate(ticket.createdAt)}</td>
                    <td className="actions-cell">
                      <div className="action-buttons-modern" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-start' }}>
                        {ticket.status !== 'resolved' && ticket.status !== 'closed' && (
                          <button
                            onClick={() => handleResolve(ticket._id)}
                            className="btn-icon success-icon"
                            title="Resolve"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--sm-success)' }}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                        )}
                        {ticket.status !== 'closed' && (
                          <button
                            onClick={() => handleClose(ticket._id)}
                            className="btn-icon danger-icon"
                            title="Close"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--sm-danger)' }}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TicketsManagement;
