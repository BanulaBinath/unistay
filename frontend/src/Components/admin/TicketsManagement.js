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

  return (
    <div className="tickets-management">
      <div className="page-header">
        <div>
          <h1>Tickets Management</h1>
          <p className="page-header-subtitle">Monitor and resolve support tickets</p>
        </div>
        <button onClick={() => navigate('/admin/dashboard')} className="back-btn">
          Back to Dashboard
        </button>
      </div>

      {error && (
        <div className="error-message">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Stats Mini Cards */}
      {!loading && tickets.length > 0 && (
        <div className="stats-mini-grid">
          <div className="stat-mini-card">
            <div className="stat-mini-header">
              <div className="stat-mini-icon stat-mini-icon-blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <div className="stat-mini-content">
                <p className="stat-mini-label">Total Tickets</p>
                <h3 className="stat-mini-value">{tickets.length}</h3>
              </div>
            </div>
          </div>

          <div className="stat-mini-card">
            <div className="stat-mini-header">
              <div className="stat-mini-icon stat-mini-icon-orange">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="stat-mini-content">
                <p className="stat-mini-label">Open</p>
                <h3 className="stat-mini-value">{tickets.filter(t => t.status === 'open').length}</h3>
              </div>
            </div>
          </div>

          <div className="stat-mini-card">
            <div className="stat-mini-header">
              <div className="stat-mini-icon stat-mini-icon-purple">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="stat-mini-content">
                <p className="stat-mini-label">In Progress</p>
                <h3 className="stat-mini-value">{tickets.filter(t => t.status === 'in_progress').length}</h3>
              </div>
            </div>
          </div>

          <div className="stat-mini-card">
            <div className="stat-mini-header">
              <div className="stat-mini-icon stat-mini-icon-green">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="stat-mini-content">
                <p className="stat-mini-label">Resolved</p>
                <h3 className="stat-mini-value">{tickets.filter(t => t.status === 'resolved').length}</h3>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="filters-section">
        <div className="filters-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <h3>Filter Tickets</h3>
        </div>
        <div className="filters">
          <select name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="escalated">Escalated</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
            <option value="rejected">Rejected</option>
          </select>

          <select name="priority" value={filters.priority} onChange={handleFilterChange}>
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>

          <select name="serviceCategory" value={filters.serviceCategory} onChange={handleFilterChange}>
            <option value="">All Categories</option>
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
            className="search-input"
          />
        </div>
      </div>

      {loading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading tickets...</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="tickets-table">
            <thead>
              <tr>
                <th>Ticket #</th>
                <th>Subject</th>
                <th>Student</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan="8" className="no-data">No tickets found</td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket._id}>
                    <td>
                      <span className="ticket-number">{ticket.ticketNumber}</span>
                    </td>
                    <td>
                      <div className="ticket-title">{ticket.title}</div>
                      <small>{ticket.complaintType}</small>
                    </td>
                    <td>
                      {ticket.studentId?.fullName || 'Unknown'}<br />
                      <small>{ticket.studentId?.email}</small>
                    </td>
                    <td>
                      <span className={`category-badge category-${ticket.serviceCategory}`}>
                        {ticket.serviceCategory}
                      </span>
                    </td>
                    <td>
                      <select
                        value={ticket.priority}
                        onChange={(e) => handlePriorityChange(ticket._id, e.target.value)}
                        className={`priority-select priority-${ticket.priority}`}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </td>
                    <td>
                      <span className={`status-badge status-${ticket.status}`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>{formatDate(ticket.createdAt)}</td>
                    <td>
                      <div className="action-buttons">
                        {ticket.status !== 'resolved' && ticket.status !== 'closed' && (
                          <button
                            onClick={() => handleResolve(ticket._id)}
                            className="action-btn resolve-btn"
                            title="Resolve"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                        )}
                        {ticket.status !== 'closed' && (
                          <button
                            onClick={() => handleClose(ticket._id)}
                            className="action-btn close-btn"
                            title="Close"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
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
