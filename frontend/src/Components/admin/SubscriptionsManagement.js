import React, { useState, useEffect } from 'react';
import { getAllSubscriptions, updateSubscriptionStatus } from '../../services/adminApi';
import './SubscriptionsManagement.css';

function SubscriptionsManagement() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    activationStatus: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchSubscriptions();
  }, [filters]);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getAllSubscriptions(filters);
      if (response.success) {
        setSubscriptions(response.data.subscriptions);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (subscriptionId, newStatus) => {
    try {
      const response = await updateSubscriptionStatus(subscriptionId, newStatus);
      if (response.success) {
        fetchSubscriptions();
      }
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to update subscription status');
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
      case 'active': return 'success';
      case 'inactive': return 'warning';
      case 'expired': return 'danger';
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'danger';
      default: return 'gray';
    }
  };

  return (
    <div className="modern-subscriptions-container">
      <header className="page-heading-row">
        <div>
          <h1 className="page-title">Subscriptions Management</h1>
          <p className="page-description">Monitor user plans, renewal dates, and payment statuses.</p>
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

      {!loading && subscriptions.length > 0 && (
        <div className="metrics-grid">
          <div className="metric-card complex-card">
            <div className="card-inner-top">
              <div className="metric-data">
                <p className="metric-title">Total Subscriptions</p>
                <h3 className="metric-value">{pagination?.total || subscriptions.length}</h3>
              </div>
              <div className="metric-icon primary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="metric-card complex-card">
            <div className="card-inner-top">
              <div className="metric-data">
                <p className="metric-title">Active</p>
                <h3 className="metric-value">{subscriptions.filter(s => s.activationStatus === 'active').length}</h3>
              </div>
              <div className="metric-icon success">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="metric-card complex-card">
            <div className="card-inner-top">
              <div className="metric-data">
                <p className="metric-title">Inactive</p>
                <h3 className="metric-value">{subscriptions.filter(s => s.activationStatus === 'inactive').length}</h3>
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
                <p className="metric-title">Expired</p>
                <h3 className="metric-value">{subscriptions.filter(s => s.activationStatus === 'expired').length}</h3>
              </div>
              <div className="metric-icon danger" style={{ background: '#FEF2F2', color: 'var(--sm-danger)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="toolbar-card">
        <div className="filters-wrapper" style={{ width: '100%', justifyContent: 'flex-start' }}>
          <select name="activationStatus" value={filters.activationStatus} onChange={handleFilterChange} className="modern-select">
            <option value="">Status: All</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
            <option value="expired">Expired Only</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loader-container">
          <div className="modern-spinner"></div>
          <p>Fetching subscriptions...</p>
        </div>
      ) : (
        <>
          <div className="modern-table-card">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Payment Status</th>
                  <th>Paid Date</th>
                  <th>Expiry Date</th>
                  <th className="actions-cell">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="empty-state">
                      <div className="empty-state-content">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M23 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75" />
                        </svg>
                        <p>No matching subscriptions found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  subscriptions.map((subscription) => (
                    <tr key={subscription._id}>
                      <td>
                        <div className="user-profile-cell">
                          <div className="user-avatar-small">
                            {subscription.userId?.fullName?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <div className="user-profile-info">
                            <span className="user-profile-name">{subscription.userId?.fullName || 'Unknown'}</span>
                            <span className="user-profile-email">{subscription.userId?.email || 'N/A'}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                         <span className="vendor-type-tag" style={{ textTransform: 'capitalize' }}>
                            {subscription.subscriptionType}
                         </span>
                      </td>
                      <td>
                        <strong>${subscription.amount.toFixed(2)}</strong>
                      </td>
                      <td>
                        <span className={`status-dot-badge ${subscription.activationStatus === 'active' ? 'active' : 'inactive'}`}>
                          <span className="dot"></span>
                          <span style={{ textTransform: 'capitalize' }}>{subscription.activationStatus}</span>
                        </span>
                      </td>
                      <td>
                         <span className={`modern-badge badge-${getStatusBadgeColor(subscription.paymentStatus)}`}>
                            {subscription.paymentStatus}
                         </span>
                      </td>
                      <td>{formatDate(subscription.paidDate)}</td>
                      <td>{formatDate(subscription.expiryDate)}</td>
                      <td className="actions-cell">
                        <select
                          value={subscription.activationStatus}
                          onChange={(e) => handleStatusUpdate(subscription._id, e.target.value)}
                          className="modern-select"
                          style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="expired">Expired</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {pagination && pagination.pages > 1 && (
            <div className="modern-pagination">
              <button 
                onClick={() => handlePageChange(filters.page - 1)} 
                disabled={filters.page === 1} 
                className="page-nav-btn"
              >
                &larr; Prev
              </button>
              <div className="page-numbers-wrapper">
                {[...Array(pagination.pages)].map((_, i) => (
                  <button 
                    key={i + 1} 
                    onClick={() => handlePageChange(i + 1)} 
                    className={`page-jump-btn ${filters.page === i + 1 ? 'active' : ''}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => handlePageChange(filters.page + 1)} 
                disabled={filters.page === pagination.pages} 
                className="page-nav-btn"
              >
                Next &rarr;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SubscriptionsManagement;
