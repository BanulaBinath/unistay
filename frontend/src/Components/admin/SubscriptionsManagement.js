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
        <h1>Subscriptions Management</h1>
        <button onClick={() => navigate('/admin/dashboard')} className="back-btn">
          Back to Dashboard
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="filters">
        <select name="activationStatus" value={filters.activationStatus} onChange={handleFilterChange}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading subscriptions...</div>
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
