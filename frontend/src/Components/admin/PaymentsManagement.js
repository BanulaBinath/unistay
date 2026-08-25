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
    <div className="pm-container">
      {/* Header Section */}
      <header className="pm-header">
        <div className="pm-header-title">
          <h1>Payments Management</h1>
          <p>Track, analyze, and manage all user transaction records.</p>
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="pm-alert pm-alert-danger">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{error}</span>
        </div>
      )}

      {/* Metrics Cards */}
      {!loading && payments.length > 0 && (
        <div className="pm-metrics-grid">
          <div className="pm-metric-card pm-complex-card">
            <div className="pm-card-inner-top">
              <div className="pm-metric-data">
                <p className="pm-metric-title">Total Revenue</p>
                <h3 className="pm-metric-value">Rs. {payments.filter(p => p.paymentStatus === 'completed').reduce((sum, p) => sum + p.amount, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
              </div>
              <div className="pm-metric-icon primary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
            </div>
            <div className="pm-card-inner-bottom">
              <span className="pm-trend-badge pm-trend-up">
                <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"/></svg>
                Active
              </span>
              <span className="pm-trend-text">Based on completed</span>
            </div>
          </div>

          <div className="pm-metric-card pm-complex-card">
            <div className="pm-card-inner-top">
              <div className="pm-metric-data">
                <p className="pm-metric-title">Completed</p>
                <h3 className="pm-metric-value">{payments.filter(p => p.paymentStatus === 'completed').length}</h3>
              </div>
              <div className="pm-metric-icon success">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
            </div>
            <div className="pm-card-inner-bottom pm-progress-bottom">
              <div className="pm-progress-info">
                <span className="pm-progress-label">Success Rate</span>
                <span className="pm-progress-percent">{payments.length > 0 ? Math.round((payments.filter(p => p.paymentStatus === 'completed').length / payments.length) * 100) : 0}%</span>
              </div>
              <div className="pm-progress-bar-bg">
                <div className="pm-progress-bar-fill" style={{ width: `${payments.length > 0 ? Math.round((payments.filter(p => p.paymentStatus === 'completed').length / payments.length) * 100) : 0}%` }}></div>
              </div>
            </div>
          </div>

          <div className="pm-metric-card pm-complex-card">
            <div className="pm-card-inner-top">
              <div className="pm-metric-data">
                <p className="pm-metric-title">Pending</p>
                <h3 className="pm-metric-value">{payments.filter(p => p.paymentStatus === 'pending').length}</h3>
              </div>
              <div className="pm-metric-icon warning">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
            </div>
            <div className="pm-card-inner-bottom pm-progress-bottom">
               <div className="pm-progress-info">
                <span className="pm-progress-label">Pending Checks</span>
                <span className="pm-progress-percent">{payments.length > 0 ? Math.round((payments.filter(p => p.paymentStatus === 'pending').length / payments.length) * 100) : 0}%</span>
              </div>
              <div className="pm-progress-bar-bg">
                <div className="pm-progress-bar-fill warning-fill" style={{ width: `${payments.length > 0 ? Math.round((payments.filter(p => p.paymentStatus === 'pending').length / payments.length) * 100) : 0}%`, background: 'var(--pm-warning)' }}></div>
              </div>
            </div>
          </div>

          <div className="pm-metric-card pm-complex-card">
            <div className="pm-card-inner-top">
              <div className="pm-metric-data">
                <p className="pm-metric-title">Failed / Issues</p>
                <h3 className="pm-metric-value">{payments.filter(p => p.paymentStatus === 'failed').length}</h3>
              </div>
              <div className="pm-metric-icon danger">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </div>
            </div>
            <div className="pm-card-inner-bottom">
              <span className="pm-trend-text">Requires Attention</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="pm-main-card">
        {/* Toolbar */}
        <div className="pm-toolbar">
          <div className="pm-toolbar-left">
            <h2 className="pm-section-title">Transactions List</h2>
          </div>
          <div className="pm-toolbar-right">
            <div className="pm-filter-group">
               <svg className="pm-filter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
               <select className="pm-select" name="paymentStatus" value={filters.paymentStatus} onChange={handleFilterChange}>                                                                         
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
               </select>
            </div>
          </div>
        </div>

        {/* Data Table */}
        {loading ? (
          <div className="pm-loading-state">
            <div className="pm-spinner"></div>
            <p>Fetching latest transactions...</p>
          </div>
        ) : (
          <div className="pm-table-wrapper">
            <table className="pm-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Customer Info</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="pm-empty-state">
                      <div className="pm-empty-content">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                        <p>No payment records found.</p>
                      </div>
                    </td>  
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr key={payment._id}>
                      <td className="pm-cell-id">
                        <span className="pm-id-badge">{payment.transactionId || 'N/A'}</span>
                      </td>
                      <td className="pm-cell-user">
                        <p className="pm-user-name">{payment.userId?.fullName || 'Unknown Customer'}</p>
                        <p className="pm-user-email">{payment.userId?.email || 'No email provided'}</p>
                      </td>
                      <td className="pm-cell-amount">
                        <span className="pm-amount">Rs. {payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </td>
                      <td className="pm-cell-method">
                        <span className="pm-method-tag">{payment.paymentMethod || 'system'}</span>
                      </td>
                      <td className="pm-cell-date">
                        {formatDate(payment.paymentDate)}
                      </td>
                      <td className="pm-cell-status">
                        <span className={`pm-badge pm-badge-${(payment.paymentStatus || '').toLowerCase()}`}>                                                                                                        
                          {payment.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && pagination && pagination.pages > 1 && (
          <div className="pm-pagination">
            <button
              onClick={() => handlePageChange(filters.page - 1)}
              disabled={filters.page === 1}
              className="pm-page-btn"
            >
              Previous
            </button>
            <div className="pm-page-indicator">
              Page <span>{pagination.page}</span> of <span>{pagination.pages}</span>
            </div>
            <button
              onClick={() => handlePageChange(filters.page + 1)}
              disabled={filters.page === pagination.pages}
              className="pm-page-btn"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentsManagement;
