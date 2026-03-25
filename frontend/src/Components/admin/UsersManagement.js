import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, activateUser, deactivateUser } from '../../services/adminApi';
import './UsersManagement.css';

function UsersManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    role: '',
    isActive: '',
    vendorType: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('table');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showUserDetails, setShowUserDetails] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getAllUsers(filters);
      if (response.success) {
        setUsers(response.data.users);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (userId) => {
    try {
      const response = await activateUser(userId);
      if (response.success) {
        fetchUsers();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to activate user');
    }
  };

  const handleDeactivate = async (userId) => {
    try {
      const response = await deactivateUser(userId);
      if (response.success) {
        fetchUsers();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to deactivate user');
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
      page: 1
    });
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u._id));
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedUsers.length === 0) {
      alert('Please select users first');
      return;
    }
    
    if (!window.confirm(`Are you sure you want to ${action} ${selectedUsers.length} user(s)?`)) {
      return;
    }

    try {
      for (const userId of selectedUsers) {
        if (action === 'activate') {
          await activateUser(userId);
        } else if (action === 'deactivate') {
          await deactivateUser(userId);
        }
      }
      setSelectedUsers([]);
      fetchUsers();
    } catch (err) {
      alert(`Failed to ${action} users`);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const getRoleBadgeColor = (role) => {
    const colors = {
      'student_sliit': 'blue',
      'student_external': 'purple',
      'vendor': 'orange',
      'admin': 'red'
    };
    return colors[role] || 'gray';
  };

  const getVendorIcon = (vendorType) => {
    const icons = {
      food: '🍔',
      boarding: '🏠',
      laundry: '👕',
      cleaning: '🧹'
    };
    return icons[vendorType] || '📦';
  };

  return (
    <div className="users-management">
      <div className="page-header">
        <div className="page-header-top">
          <button onClick={() => navigate('/admin/dashboard')} className="back-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
        </div>
        <div className="page-title-section">
          <div className="page-title-content">
            <h1>User Management</h1>
            <p className="page-subtitle">Manage and monitor all platform users</p>
          </div>
          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Table
            </button>
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Grid
            </button>
          </div>
        </div>
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
      {!loading && users.length > 0 && (
        <div className="stats-mini-grid">
          <div className="stat-mini-card">
            <div className="stat-mini-header">
              <div className="stat-mini-icon stat-mini-icon-blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="stat-mini-content">
                <p className="stat-mini-label">Total Users</p>
                <h3 className="stat-mini-value">{pagination?.total || users.length}</h3>
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
                <p className="stat-mini-label">Active Users</p>
                <h3 className="stat-mini-value">{users.filter(u => u.isActive).length}</h3>
              </div>
            </div>
          </div>

          <div className="stat-mini-card">
            <div className="stat-mini-header">
              <div className="stat-mini-icon stat-mini-icon-purple">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="stat-mini-content">
                <p className="stat-mini-label">Students</p>
                <h3 className="stat-mini-value">{users.filter(u => u.role.includes('student')).length}</h3>
              </div>
            </div>
          </div>

          <div className="stat-mini-card">
            <div className="stat-mini-header">
              <div className="stat-mini-icon stat-mini-icon-orange">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="stat-mini-content">
                <p className="stat-mini-label">Vendors</p>
                <h3 className="stat-mini-value">{users.filter(u => u.role === 'vendor').length}</h3>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="search-filter-section">
        <div className="search-bar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="filters-section">
          <div className="filters-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <h3>Filters</h3>
          </div>
          <div className="filters">
            <select name="role" value={filters.role} onChange={handleFilterChange}>
              <option value="">All Roles</option>
              <option value="student_sliit">SLIIT Student</option>
              <option value="student_external">External Student</option>
              <option value="vendor">Vendor</option>
            </select>

            <select name="isActive" value={filters.isActive} onChange={handleFilterChange}>
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>

            <select name="vendorType" value={filters.vendorType} onChange={handleFilterChange}>
              <option value="">All Vendor Types</option>
              <option value="food">Food</option>
              <option value="boarding">Boarding</option>
              <option value="laundry">Laundry</option>
              <option value="cleaning">Cleaning</option>
            </select>
          </div>
        </div>
      </div>

      {selectedUsers.length > 0 && (
        <div className="bulk-actions-bar">
          <div className="bulk-actions-info">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{selectedUsers.length} user(s) selected</span>
          </div>
          <div className="bulk-actions-buttons">
            <button onClick={() => handleBulkAction('activate')} className="bulk-btn activate">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Activate Selected
            </button>
            <button onClick={() => handleBulkAction('deactivate')} className="bulk-btn deactivate">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Deactivate Selected
            </button>
            <button onClick={() => setSelectedUsers([])} className="bulk-btn cancel">
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading users...</p>
        </div>
      ) : (
        <>
          {viewMode === 'table' ? (
            <div className="table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                        onChange={handleSelectAll}
                        className="checkbox"
                      />
                    </th>
                    <th onClick={() => handleSort('fullName')} className="sortable">
                      Name
                      {sortConfig.key === 'fullName' && (
                        <span className="sort-icon">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </th>
                    <th onClick={() => handleSort('email')} className="sortable">
                      Email
                      {sortConfig.key === 'email' && (
                        <span className="sort-icon">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </th>
                    <th>Role</th>
                    <th>Vendor Type</th>
                    <th onClick={() => handleSort('isActive')} className="sortable">
                      Status
                      {sortConfig.key === 'isActive' && (
                        <span className="sort-icon">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </th>
                    <th>Subscription</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedUsers.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="no-data">
                        <div className="no-data-content">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                          <p>No users found</p>
                          <span>Try adjusting your filters or search term</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    sortedUsers.map((user) => (
                      <tr key={user._id} className={selectedUsers.includes(user._id) ? 'selected' : ''}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user._id)}
                            onChange={() => handleSelectUser(user._id)}
                            className="checkbox"
                          />
                        </td>
                        <td>
                          <div className="user-name-cell">
                            <div className="user-avatar">
                              {user.fullName?.charAt(0).toUpperCase()}
                            </div>
                            <span>{user.fullName}</span>
                          </div>
                        </td>
                        <td className="email-cell">{user.email}</td>
                        <td>
                          <span className={`role-badge role-${getRoleBadgeColor(user.role)}`}>
                            {user.role.replace('_', ' ')}
                          </span>
                        </td>
                        <td>
                          {user.vendorType ? (
                            <span className="vendor-type-badge">
                              <span className="vendor-icon">{getVendorIcon(user.vendorType)}</span>
                              {user.vendorType}
                            </span>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td>
                          <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                            <span className="status-dot"></span>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <span className={`subscription-badge ${user.subscriptionStatus?.toLowerCase()}`}>
                            {user.subscriptionStatus || 'None'}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              onClick={() => setShowUserDetails(user)}
                              className="action-btn-icon view-btn"
                              title="View Details"
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            {user.isActive ? (
                              <button
                                onClick={() => handleDeactivate(user._id)}
                                className="action-btn-icon deactivate-btn"
                                title="Deactivate"
                              >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleActivate(user._id)}
                                className="action-btn-icon activate-btn"
                                title="Activate"
                              >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
          ) : (
            <div className="users-grid">
              {sortedUsers.length === 0 ? (
                <div className="no-data-grid">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p>No users found</p>
                  <span>Try adjusting your filters or search term</span>
                </div>
              ) : (
                sortedUsers.map((user) => (
                  <div key={user._id} className={`user-card ${selectedUsers.includes(user._id) ? 'selected' : ''}`}>
                    <div className="user-card-header">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user._id)}
                        onChange={() => handleSelectUser(user._id)}
                        className="checkbox card-checkbox"
                      />
                      <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                        <span className="status-dot"></span>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="user-card-avatar">
                      {user.fullName?.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="user-card-name">{user.fullName}</h3>
                    <p className="user-card-email">{user.email}</p>
                    <div className="user-card-info">
                      <div className="info-item">
                        <span className="info-label">Role</span>
                        <span className={`role-badge role-${getRoleBadgeColor(user.role)}`}>
                          {user.role.replace('_', ' ')}
                        </span>
                      </div>
                      {user.vendorType && (
                        <div className="info-item">
                          <span className="info-label">Vendor Type</span>
                          <span className="vendor-type-badge">
                            <span className="vendor-icon">{getVendorIcon(user.vendorType)}</span>
                            {user.vendorType}
                          </span>
                        </div>
                      )}
                      <div className="info-item">
                        <span className="info-label">Subscription</span>
                        <span className={`subscription-badge ${user.subscriptionStatus?.toLowerCase()}`}>
                          {user.subscriptionStatus || 'None'}
                        </span>
                      </div>
                    </div>
                    <div className="user-card-actions">
                      <button
                        onClick={() => setShowUserDetails(user)}
                        className="card-action-btn view"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View
                      </button>
                      {user.isActive ? (
                        <button
                          onClick={() => handleDeactivate(user._id)}
                          className="card-action-btn deactivate"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                          </svg>
                          Deactivate
                        </button>
                      ) : (
                        <button
                          onClick={() => handleActivate(user._id)}
                          className="card-action-btn activate"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Activate
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}

      {showUserDetails && (
        <div className="modal-overlay" onClick={() => setShowUserDetails(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>User Details</h2>
              <button onClick={() => setShowUserDetails(null)} className="modal-close">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="user-details-avatar">
                {showUserDetails.fullName?.charAt(0).toUpperCase()}
              </div>
              <h3 className="user-details-name">{showUserDetails.fullName}</h3>
              <p className="user-details-email">{showUserDetails.email}</p>
              
              <div className="user-details-grid">
                <div className="detail-item">
                  <span className="detail-label">Role</span>
                  <span className={`role-badge role-${getRoleBadgeColor(showUserDetails.role)}`}>
                    {showUserDetails.role.replace('_', ' ')}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Status</span>
                  <span className={`status-badge ${showUserDetails.isActive ? 'active' : 'inactive'}`}>
                    <span className="status-dot"></span>
                    {showUserDetails.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {showUserDetails.vendorType && (
                  <div className="detail-item">
                    <span className="detail-label">Vendor Type</span>
                    <span className="vendor-type-badge">
                      <span className="vendor-icon">{getVendorIcon(showUserDetails.vendorType)}</span>
                      {showUserDetails.vendorType}
                    </span>
                  </div>
                )}
                <div className="detail-item">
                  <span className="detail-label">Subscription</span>
                  <span className={`subscription-badge ${showUserDetails.subscriptionStatus?.toLowerCase()}`}>
                    {showUserDetails.subscriptionStatus || 'None'}
                  </span>
                </div>
                {showUserDetails.phoneNumber && (
                  <div className="detail-item">
                    <span className="detail-label">Phone</span>
                    <span className="detail-value">{showUserDetails.phoneNumber}</span>
                  </div>
                )}
                {showUserDetails.createdAt && (
                  <div className="detail-item">
                    <span className="detail-label">Joined</span>
                    <span className="detail-value">
                      {new Date(showUserDetails.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="modal-actions">
                {showUserDetails.isActive ? (
                  <button
                    onClick={() => {
                      handleDeactivate(showUserDetails._id);
                      setShowUserDetails(null);
                    }}
                    className="modal-action-btn deactivate"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                    Deactivate User
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handleActivate(showUserDetails._id);
                      setShowUserDetails(null);
                    }}
                    className="modal-action-btn activate"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Activate User
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {pagination && pagination.pages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(filters.page - 1)}
            disabled={filters.page === 1}
            className="page-btn"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>
          <div className="page-numbers">
            {[...Array(pagination.pages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`page-number ${filters.page === i + 1 ? 'active' : ''}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <span className="page-info">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => handlePageChange(filters.page + 1)}
            disabled={filters.page === pagination.pages}
            className="page-btn"
          >
            Next
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

export default UsersManagement;
