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
    <div className="modern-tickets-container">
      <header className="page-heading-row">
        <div>
          <h1 className="page-title">Tickets Management</h1>
          <p className="page-description">Monitor user issues, vendor warnings, and support tickets.</p>
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

      {stats && (
        <div className="metrics-grid">
          <div className="metric-card complex-card">
            <div className="card-inner-top">
              <div className="metric-data">
                <p className="metric-title">Total Tickets</p>
                <h3 className="metric-value">{stats.total}</h3>
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
                <h3 className="metric-value">{stats.byStatus?.open || 0}</h3>
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
                <p className="metric-title">Urgent</p>
                <h3 className="metric-value">{stats.byPriority?.urgent || 0}</h3>
              </div>
              <div className="metric-icon danger" style={{ background: '#FEF2F2', color: 'var(--sm-danger)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="metric-card complex-card">
            <div className="card-inner-top">
              <div className="metric-data">
                <p className="metric-title">Resolved</p>
                <h3 className="metric-value">{stats.byStatus?.resolved || 0}</h3>
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
            <option value="waiting_vendor">Waiting Vendor</option>
            <option value="waiting_student">Waiting Student</option>
            <option value="escalated">Escalated</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
            <option value="reopened">Reopened</option>
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

          <select name="complaintType" value={filters.complaintType} onChange={handleFilterChange} className="modern-select">
            <option value="">Type: All</option>
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

          <input
            type="text"
            name="search"
            placeholder="Search by ticket number or title..."
            value={filters.search}
            onChange={handleFilterChange}
            className="modern-search-input"
            style={{ padding: '0.5rem 1rem', border: '1px solid #E5E7EB', borderRadius: '8px', flex: '1', minWidth: '200px' }}
          />

          {Object.values(filters).some(v => v) && (
             <button onClick={clearFilters} className="action-btn" style={{ background: '#F1F5F9', color: '#475569', boxShadow: 'none' }}>
               Clear
             </button>
          )}
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
                <th>Title</th>
                <th>Student</th>
                <th>Vendor</th>
                <th>Category</th>
                <th>Type</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Created</th>
                <th className="actions-cell">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan="10" className="empty-state">
                    <div className="empty-state-content">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M23 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75" />
                      </svg>
                      <p>No tickets found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                tickets.map(ticket => (
                  <tr key={ticket._id} style={{ background: ticket.priority === 'urgent' ? '#FEF2F2' : 'inherit' }}>
                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--sm-text-primary)' }}>{ticket.ticketNumber}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500, color: 'var(--sm-text-primary)' }}>{ticket.title}</div>
                    </td>
                    <td>
                      <div className="user-info-cell" style={{ display: 'flex', flexDirection: 'column' }}>
                         <span className="user-name">{ticket.studentId?.fullName || 'N/A'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="user-info-cell" style={{ display: 'flex', flexDirection: 'column' }}>
                         <span className="user-name">{ticket.vendorId?.businessName || ticket.vendorId?.fullName || 'N/A'}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-gray" style={{ textTransform: 'capitalize' }}>
                        {ticket.serviceCategory}
                      </span>
                    </td>
                    <td>
                       <span style={{ fontSize: '0.85rem', color: 'var(--sm-text-secondary)', textTransform: 'capitalize' }}>
                         {ticket.complaintType.replace(/_/g, ' ')}
                       </span>
                    </td>
                    <td>
                      <TicketPriorityBadge priority={ticket.priority} />
                    </td>
                    <td>
                      <TicketStatusBadge status={ticket.status} />
                    </td>
                    <td>{formatDate(ticket.createdAt)}</td>
                    <td className="actions-cell">
                      <button
                        className="action-btn"
                        onClick={() => navigate(`/admin/tickets/${ticket._id}`)}
                        style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}
                      >
                        View
                      </button>
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
};

export default AdminTicketsPage;

