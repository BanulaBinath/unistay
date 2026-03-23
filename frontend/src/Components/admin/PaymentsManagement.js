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
        <h1>Payments Management</h1>
        <button onClick={() => navigate('/admin/dashboard')} className="back-btn">
          Back to Dashboard
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="filters">
        <select name="paymentStatus" value={filters.paymentStatus} onChange={handleFilterChange}>
          <option value="">All Payment Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading payments...</div>
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
