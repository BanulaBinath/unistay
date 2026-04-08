import React, { useState, useEffect } from 'react';
import './BoardingVendorComplaint.css';
import { getVendorTickets } from '../../services/ticketApi';
import { useAuth } from '../../context/AuthContext';

function BoardingVendorComplaint({ onViewDetails }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  useEffect(() => {
    fetchTickets();
  }, [user, statusFilter, priorityFilter]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const filters = {};
      if (statusFilter) filters.status = statusFilter;
      if (priorityFilter) filters.priority = priorityFilter;
      
      console.log('Fetching vendor tickets with filters:', filters);
      const response = await getVendorTickets(filters);
      console.log('Vendor tickets response:', response);
      
      if (response.success) {
        setTickets(response.data);
        console.log('Tickets loaded:', response.data.length);
      } else {
        setError('Failed to fetch complaints');
      }
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError(err.response?.data?.message || 'Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      open: { color: '#3b82f6', text: 'Open', bg: '#eff6ff' },
      in_progress: { color: '#f59e0b', text: 'In Progress', bg: '#fef3c7' },
      waiting_vendor: { color: '#ef4444', text: 'Action Required', bg: '#fef2f2' },
      waiting_student: { color: '#8b5cf6', text: 'Waiting for Student', bg: '#f5f3ff' },
      escalated: { color: '#b91c1c', text: 'Escalated', bg: '#fef2f2' },
      resolved: { color: '#10b981', text: 'Resolved', bg: '#ecfdf5' },
      closed: { color: '#6b7280', text: 'Closed', bg: '#f3f4f6' },
      reopened: { color: '#8b5cf6', text: 'Reopened', bg: '#f5f3ff' },
    };
    const mapped = statusMap[status] || { color: '#6b7280', text: status, bg: '#f3f4f6' };
    return (
      <span className="status-badge" style={{ backgroundColor: mapped.bg, color: mapped.color }}>
        {mapped.text}
      </span>
    );
  };

  return (
    <div className="boarding-complaint-container">
      <div className="boarding-complaint-header">
        <h2>Boarding Complaints</h2>
        <p>Manage complaints related to your boarding services</p>
      </div>
      
      <div className="boarding-complaint-filters">
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className="boarding-complaint-select"
        >
          <option value="">All Statuses</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="waiting_vendor">Action Required</option>
          <option value="waiting_student">Waiting for Student</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>

        <select 
          value={priorityFilter} 
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="boarding-complaint-select"
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      {error && <p className="boarding-complaint-error">{error}</p>}

      <div className="boarding-complaint-table-wrapper">
        <table className="boarding-complaint-table">
          <thead>
            <tr>
              <th>Ticket #</th>
              <th>Title</th>
              <th>Student</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="boarding-complaint-loading">Loading complaints...</td></tr>
            ) : tickets.length === 0 ? (
              <tr><td colSpan="7" className="boarding-complaint-no-items">No complaints assigned to you.</td></tr>
            ) : (
              tickets.map(ticket => (
                <tr key={ticket._id}>
                  <td>{ticket.ticketNumber}</td>
                  <td>{ticket.title}</td>
                  <td>{ticket.studentId?.fullName || 'Unknown'}</td>
                  <td className={`priority-${ticket.priority}`}>{ticket.priority}</td>
                  <td>{getStatusBadge(ticket.status)}</td>
                  <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button 
                      onClick={() => {
                        console.log('View Details clicked for ticket:', ticket._id);
                        if (onViewDetails) {
                          onViewDetails(ticket._id);
                        } else {
                          console.error('onViewDetails callback is not defined!');
                        }
                      }}
                      className="boarding-complaint-btn boarding-complaint-btn-view"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BoardingVendorComplaint;
