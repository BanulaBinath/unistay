import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllSubscriptions, updateSubscriptionStatus } from '../../services/adminApi';
import './SubscriptionsManagement.css';

function SubscriptionsManagement() {
  const navigate = useNavigate();
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
      setError(err.response?.data?.message || 'Failed to load subscriptions');
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
      alert(err.response?.data?.message || 'Failed to update subscription status');
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

  return (
    <div className="subscriptions-management">
      <div className="page-header">
        <div>
          <h1>Subscriptions Management</h1>
          <p className="page-header-subtitle">Monitor and manage user subscriptions</p>
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
      {!loading && subscriptions.length > 0 && (
        <div className="stats-mini-grid">
          <div className="stat-mini-card">
            <div className="stat-mini-header">
              <div className="stat-mini-icon stat-mini-icon-blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="stat-mini-content">
                <p className="stat-mini-label">Total Subscriptions</p>
                <h3 className="stat-mini-value">{pagination?.total || subscriptions.length}</h3>
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
                <p className="stat-mini-label">Active</p>
                <h3 className="stat-mini-value">{subscriptions.filter(s => s.activationStatus === 'active').length}</h3>
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
                <p className="stat-mini-label">Inactive</p>
                <h3 className="stat-mini-value">{subscriptions.filter(s => s.activationStatus === 'inactive').length}</h3>
              </div>
            </div>
          </div>

          <div className="stat-mini-card">
            <div className="stat-mini-header">
              <div className="stat-mini-icon stat-mini-icon-gray">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="stat-mini-content">
                <p className="stat-mini-label">Expired</p>
                <h3 className="stat-mini-value">{subscriptions.filter(s => s.activationStatus === 'expired').length}</h3>
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
          <h3>Filter Subscriptions</h3>
        </div>
        <div className="filters">
          <select name="activationStatus" value={filters.activationStatus} onChange={handleFilterChange}>
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading subscriptions...</p>
        </div>
      ) : (
        <>
          <div className="table-container">
            <table className="subscriptions-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Payment Status</th>
                  <th>Paid Date</th>
                  <th>Expiry Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="no-data">No subscriptions found</td>
                  </tr>
                ) : (
                  subscriptions.map((subscription) => (
                    <tr key={subscription._id}>
                      <td>
                        {subscription.userId?.fullName || 'Unknown'}<br />
                        <small>{subscription.userId?.email}</small>
                      </td>
                      <td>{subscription.subscriptionType}</td>
                      <td>${subscription.amount.toFixed(2)}</td>
                      <td>
                        <span className={`status-badge ${subscription.activationStatus}`}>
                          {subscription.activationStatus}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${subscription.paymentStatus}`}>
                          {subscription.paymentStatus}
                        </span>
                      </td>
                      <td>{formatDate(subscription.paidDate)}</td>
                      <td>{formatDate(subscription.expiryDate)}</td>
                      <td>
                        <select
                          value={subscription.activationStatus}
                          onChange={(e) => handleStatusUpdate(subscription._id, e.target.value)}
                          className="status-select"
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
            <div className="pagination">
              <button
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page === 1}
                className="page-btn"
              >
                Previous
              </button>
              <span className="page-info">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page === pagination.pages}
                className="page-btn"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SubscriptionsManagement;
