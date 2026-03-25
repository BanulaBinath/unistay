import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllTickets, getTicketStats } from '../../services/ticketApi';
import TicketStatusBadge from '../../Components/tickets/TicketStatusBadge';
import TicketPriorityBadge from '../../Components/tickets/TicketPriorityBadge';
import './AdminTicketsPage.css';

const AdminTicketsPage = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    serviceCategory: '',
    complaintType: '',
    search: ''
  });

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [ticketsResponse, statsResponse] = await Promise.all([
        getAllTickets(filters),
        getTicketStats()
      ]);
      
      if (ticketsResponse.success) {
        setTickets(ticketsResponse.data);
      }
      
      if (statsResponse.success) {
        setStats(statsResponse.data);
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
      serviceCategory: '',
      complaintType: '',
      search: ''
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
    <div className="admin-tickets-page">
      <div className="page-header">
        <button onClick={() => navigate('/admin/dashboard')} className="back-button">
          ← Back to Dashboard
        </button>
        <h1>Ticket Management</h1>
      </div>

      {stats && (
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Tickets</div>
          </div>
          <div className="stat-card open">
            <div className="stat-value">{stats.byStatus.open}</div>
            <div className="stat-label">Open</div>
          </div>
          <div className="stat-card escalated">
            <div className="stat-value">{stats.byStatus.escalated}</div>
            <div className="stat-label">Escalated</div>
          </div>
          <div className="stat-card resolved">
            <div className="stat-value">{stats.byStatus.resolved}</div>
            <div className="stat-label">Resolved</div>
          </div>
          <div className="stat-card urgent">
            <div className="stat-value">{stats.byPriority.urgent}</div>
            <div className="stat-label">Urgent</div>
          </div>
          <div className="stat-card warned">
            <div className="stat-value">{stats.warnedVendorsCount}</div>
            <div className="stat-label">Warned Vendors</div>
          </div>
        </div>
      )}

      <div className="filters-section">
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
          placeholder="Search by ticket number or title..."
          className="search-input"
        />

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

          <select name="complaintType" value={filters.complaintType} onChange={handleFilterChange}>
            <option value="">All Types</option>
            <option value="service_not_delivered">Service Not Delivered</option>
            <option value="poor_quality">Poor Quality</option>
            <option value="late_delivery">Late Delivery</option>
            <option value="wrong_item">Wrong Item</option>
            <option value="bad_behavior">Bad Behavior</option>
            <option value="payment_issue">Payment Issue</option>
            <option value="fraud_or_fake_service">Fraud/Fake Service</option>
            <option value="cleanliness_issue">Cleanliness Issue</option>
            <option value="other">Other</option>
          </select>

          {Object.values(filters).some(v => v) && (
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
          <p>No tickets found</p>
        </div>
      ) : (
        <div className="tickets-table-container">
          <table className="tickets-table">
            <thead>
              <tr>
                <th>Ticket #</th>
                <th>Title</th>
                <th>Student</th>
                <th>Vendor</th>
                <th>Category</th>
                <th>Type</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(ticket => (
                <tr key={ticket._id} className={ticket.priority === 'urgent' ? 'urgent-row' : ''}>
                  <td className="ticket-number-cell">{ticket.ticketNumber}</td>
                  <td className="title-cell">{ticket.title}</td>
                  <td>{ticket.studentId?.fullName || 'N/A'}</td>
                  <td>{ticket.vendorId?.businessName || ticket.vendorId?.fullName || 'N/A'}</td>
                  <td className="category-cell">{ticket.serviceCategory}</td>
                  <td className="type-cell">{ticket.complaintType.replace(/_/g, ' ')}</td>
                  <td>
                    <TicketPriorityBadge priority={ticket.priority} />
                  </td>
                  <td>
                    <TicketStatusBadge status={ticket.status} />
                  </td>
                  <td className="date-cell">{formatDate(ticket.createdAt)}</td>
                  <td>
                    <button
                      className="view-button"
                      onClick={() => navigate(`/admin/tickets/${ticket._id}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminTicketsPage;
