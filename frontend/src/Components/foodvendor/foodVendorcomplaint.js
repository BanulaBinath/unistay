import React, { useState, useEffect, useRef } from 'react';
import './foodVendorcomplaint.css';
import { useNavigate } from 'react-router-dom';
import ItemSidebar from '../foodvendor/itemsidebar'; 
import { getVendorTickets } from '../../services/ticketApi';
import { useAuth } from '../../context/AuthContext';

function FoodVendorComplaint() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  useEffect(() => {
    fetchTickets();
  }, [user, statusFilter, priorityFilter]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const filters = {};
      if (statusFilter) filters.status = statusFilter;
      if (priorityFilter) filters.priority = priorityFilter;
      
      const response = await getVendorTickets(filters);
      if (response.success) {
        setTickets(response.data);
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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const displayName = user?.fullName || user?.name || user?.email || "Vendor";
  const initials = displayName.charAt(0).toUpperCase();

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
    <div className="vendor-wrapper">
      <ItemSidebar />
      <div className="vendor-main">
        <div className="vendor-header">
          <div>
            <h2 className="vendor-title">Complaints</h2>
            <p className="vendor-subtitle">Manage and respond to student complaints</p>
          </div>
          {/* Profile Button */}
          <div className="vendor-profile-wrap" ref={profileRef}>
            <button
              className="vendor-profile-btn"
              onClick={() => setProfileOpen((p) => !p)}
            >
              <div className="vendor-avatar">{initials}</div>
              <div className="vendor-profile-info">
                <span className="vendor-profile-name">{displayName}</span>
                <span className="vendor-profile-role">Food Vendor</span>
              </div>
              <span className="vendor-profile-chevron">{profileOpen ? "▲" : "▼"}</span>
            </button>

            {/* Dropdown */}
            {profileOpen && (
              <div className="vendor-profile-dropdown">
                <div className="vendor-dropdown-header">
                  <div className="vendor-avatar vendor-avatar-lg">{initials}</div>
                  <div>
                    <p className="vendor-dropdown-name">{displayName}</p>
                    <p className="vendor-dropdown-email">{user?.email || ""}</p>
                  </div>
                </div>
                <div className="vendor-dropdown-divider" />
                <button className="vendor-dropdown-item" onClick={() => { setProfileOpen(false); navigate('/vendor/food/dashboard'); }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '16px', height: '16px', strokeWidth: 2 }}>
                    <rect x="3" y="3" width="7" height="7" rx="1"/>
                    <rect x="14" y="3" width="7" height="7" rx="1"/>
                    <rect x="14" y="14" width="7" height="7" rx="1"/>
                    <rect x="3" y="14" width="7" height="7" rx="1"/>
                  </svg>
                  Dashboard
                </button>
                <button className="vendor-dropdown-item" onClick={() => { setProfileOpen(false); navigate('/ItemManagement'); }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '16px', height: '16px', strokeWidth: 2 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Manage Items
                </button>
                <div className="vendor-dropdown-divider" />
                <button className="vendor-dropdown-item danger" onClick={handleLogout}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '16px', height: '16px', strokeWidth: 2 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="vendor-filters">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="vendor-select"
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
            className="vendor-select"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        {error && <p className="vendor-error">{error}</p>}

        <div className="vendor-table-wrapper">
          <table className="vendor-table">
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
                <tr><td colSpan="7" className="vendor-loading">Loading complaints...</td></tr>
              ) : tickets.length === 0 ? (
                <tr><td colSpan="7" className="vendor-no-items">No complaints assigned to you.</td></tr>
              ) : (
                tickets.map(ticket => (
                  <tr key={ticket._id}>
                    <td className="vendor-ticket-number">{ticket.ticketNumber}</td>
                    <td className="vendor-ticket-title">{ticket.title}</td>
                    <td>{ticket.studentId?.fullName || 'Unknown'}</td>
                    <td className={`priority-${ticket.priority}`}>{ticket.priority}</td>
                    <td>{getStatusBadge(ticket.status)}</td>
                    <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button 
                        onClick={() => navigate(`/foodVendorcomplaint/${ticket._id}`)}
                        className="vendor-btn vendor-btn-view"
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
    </div>
  );
}

export default FoodVendorComplaint;
