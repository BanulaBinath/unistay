import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPayments } from '../../services/adminApi';
import './PaymentsManagement.css';

function PaymentsManagement() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    paymentStatus: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, [filters]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getAllPayments(filters);
      if (response.success) {
        setPayments(response.data.payments);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load payments');
    } finally {
      setLoading(false);
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="payments-management">
      <div className="page-header">
        <div>
          <h1>Payments Management</h1>
          <p className="page-header-subtitle">Track and manage all payment transactions</p>
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
      {!loading && payments.length > 0 && (
        <div className="stats-mini-grid">
          <div className="stat-mini-card">
            <div className="stat-mini-header">
              <div className="stat-mini-icon stat-mini-icon-blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="stat-mini-content">
                <p className="stat-mini-label">Total Revenue</p>
                <h3 className="stat-mini-value">Rs.{payments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}</h3>
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
                <p className="stat-mini-label">Completed</p>
                <h3 className="stat-mini-value">{payments.filter(p => p.paymentStatus === 'completed').length}</h3>
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
                <p className="stat-mini-label">Pending</p>
                <h3 className="stat-mini-value">{payments.filter(p => p.paymentStatus === 'pending').length}</h3>
              </div>
            </div>
          </div>

          <div className="stat-mini-card">
            <div className="stat-mini-header">
              <div className="stat-mini-icon stat-mini-icon-red">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="stat-mini-content">
                <p className="stat-mini-label">Failed</p>
                <h3 className="stat-mini-value">{payments.filter(p => p.paymentStatus === 'failed').length}</h3>
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
          <h3>Filter Payments</h3>
        </div>
        <div className="filters">
          <select name="paymentStatus" value={filters.paymentStatus} onChange={handleFilterChange}>
            <option value="">All Payment Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading payments...</p>
        </div>
      ) : (
        <>
          <div className="table-container">
            <table className="payments-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>User</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="no-data">No payments found</td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr key={payment._id}>
                      <td>{payment.transactionId || 'N/A'}</td>
                      <td>
                        {payment.userId?.fullName || 'Unknown'}<br />
                        <small>{payment.userId?.email}</small>
                      </td>
                      <td>${payment.amount.toFixed(2)}</td>
                      <td>{payment.paymentMethod}</td>
                      <td>
                        <span className={`status-badge ${payment.paymentStatus}`}>
                          {payment.paymentStatus}
                        </span>
                      </td>
                      <td>{formatDate(payment.paymentDate)}</td>
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

export default PaymentsManagement;
