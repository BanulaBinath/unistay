import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyTickets } from '../../services/ticketApi';
import TicketStatusBadge from '../../Components/tickets/TicketStatusBadge';
import TicketPriorityBadge from '../../Components/tickets/TicketPriorityBadge';
import './MyTicketsPage.css';

const MyTicketsPage = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    serviceCategory: ''
  });

  useEffect(() => {
    fetchTickets();
  }, [filters]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getMyTickets(filters);
      
      if (response.success) {
        setTickets(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      priority: '',
      serviceCategory: ''
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="my-tickets-page">
      <div className="page-header">
        <button onClick={() => navigate('/student/dashboard')} className="back-button">
          ← Back to Dashboard
        </button>
        <div className="header-content">
          <h1>My Complaints</h1>
          <button
            onClick={() => navigate('/student/complaints/new')}
            className="new-complaint-button"
          >
            + New Complaint
          </button>
        </div>
      </div>

      <div className="filters-section">
        <div className="filters-row">
          <select name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="waiting_vendor">Waiting Vendor</option>
            <option value="waiting_student">Waiting Student</option>
            <option value="escalated">Escalated</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
            <option value="reopened">Reopened</option>
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

          {(filters.status || filters.priority || filters.serviceCategory) && (
            <button onClick={clearFilters} className="clear-filters-button">
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading tickets...</div>
      ) : tickets.length === 0 ? (
        <div className="no-tickets">
          <p>No complaints found</p>
          <button
            onClick={() => navigate('/student/complaints/new')}
            className="create-first-button"
          >
            Create Your First Complaint
          </button>
        </div>
      ) : (
        <div className="tickets-list">
          {tickets.map(ticket => (
            <div
              key={ticket._id}
              className="ticket-card"
              onClick={() => navigate(`/student/complaints/${ticket._id}`)}
            >
              <div className="ticket-header">
                <div className="ticket-number">{ticket.ticketNumber}</div>
                <div className="ticket-badges">
                  <TicketPriorityBadge priority={ticket.priority} />
                  <TicketStatusBadge status={ticket.status} />
                </div>
              </div>

              <h3 className="ticket-title">{ticket.title}</h3>

              <div className="ticket-meta">
                <span className="meta-item">
                  <strong>Category:</strong> {ticket.serviceCategory}
                </span>
                {ticket.vendorId && (
                  <span className="meta-item">
                    <strong>Vendor:</strong> {ticket.vendorId.businessName || ticket.vendorId.fullName}
                  </span>
                )}
                {ticket.vendorReference && (
                  <span className="meta-item">
                    <strong>Ref:</strong> {ticket.vendorReference}
                  </span>
                )}
              </div>

              <div className="ticket-footer">
                <span className="ticket-date">Created: {formatDate(ticket.createdAt)}</span>
                {ticket.escalationLevel > 0 && (
                  <span className="escalation-badge">
                    Escalation Level {ticket.escalationLevel}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTicketsPage;
