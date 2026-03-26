import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getStudentOrders } from '../../services/orderApi';
import './MyFoodOrders.css';

const MyFoodOrders = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      // Clear the state to prevent showing message on refresh
      navigate(location.pathname, { replace: true, state: {} });
      
      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [location.state, location.pathname, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getStudentOrders();
      if (res.success) {
        setOrders(res.data || []);
      } else {
        setError(res.message || 'Failed to load orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.response?.data?.message || 'Failed to load food orders.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="mfo-container">
      <div className="mfo-content">
        {/* Header */}
        <div className="mfo-header">
          <div className="mfo-header-left">
            <div className="mfo-badge">
              <span className="mfo-badge-dot" />
              FOOD ORDERS
            </div>
            <h1 className="mfo-title">My Food Orders</h1>
            <p className="mfo-subtitle">Track your food orders and delivery status.</p>
          </div>
          <button 
            className="mfo-place-order-btn"
            onClick={() => navigate('/services')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Place New Order
          </button>
        </div>

        {/* Body */}
        <div className="mfo-body">
          {/* Success Message */}
          {successMessage && (
            <div className="mfo-success-banner">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              {successMessage}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mfo-error-banner">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="mfo-loading-state">
              <div className="mfo-loading-spinner" />
              <p className="mfo-loading-text">Loading your orders…</p>
            </div>

          /* Empty */
          ) : orders.length === 0 ? (
            <div className="mfo-empty-state">
              <div className="mfo-empty-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
                  <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                  <line x1="6" y1="1" x2="6" y2="4"/>
                  <line x1="10" y1="1" x2="10" y2="4"/>
                  <line x1="14" y1="1" x2="14" y2="4"/>
                </svg>
              </div>
              <h3 className="mfo-empty-title">No food orders yet</h3>
              <p className="mfo-empty-desc">
                You have not placed any food orders yet. Once you place an order, it will appear here.
              </p>
              <button
                className="mfo-empty-action-btn"
                onClick={() => navigate('/services')}
              >
                Browse Food Menu
              </button>
            </div>

          /* Orders list */
          ) : (
            <div className="mfo-orders-list">
              {orders.map(order => (
                <div
                  key={order._id}
                  className="mfo-order-card"
                  onClick={() => navigate(`/student/orders/${order._id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && navigate(`/student/orders/${order._id}`)}
                >
                  {/* Order icon */}
                  <div className="mfo-order-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
                      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                      <line x1="6" y1="1" x2="6" y2="4"/>
                      <line x1="10" y1="1" x2="10" y2="4"/>
                      <line x1="14" y1="1" x2="14" y2="4"/>
                    </svg>
                  </div>

                  {/* Order details */}
                  <div className="mfo-order-details">
                    <h3 className="mfo-order-name">{order.itemName}</h3>
                    <div className="mfo-order-meta">
                      <span className="mfo-meta-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="1"/>
                          <circle cx="12" cy="5" r="1"/>
                          <circle cx="12" cy="19" r="1"/>
                        </svg>
                        Qty: {order.quantity}
                      </span>
                      <span className="mfo-meta-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                          <line x1="16" y1="2" x2="16" y2="6"/>
                          <line x1="8" y1="2" x2="8" y2="6"/>
                          <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        {formatDate(order.createdAt)}
                      </span>
                      <span className="mfo-meta-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="1" x2="12" y2="23"/>
                          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                        </svg>
                        Rs. {order.totalPrice}
                      </span>
                    </div>
                  </div>

                  {/* Status badge */}
                  <div className={`mfo-status mfo-status-${order.status?.toLowerCase() || 'pending'}`}>
                    {order.status || 'Pending'}
                  </div>

                  {/* Chevron */}
                  <svg className="mfo-chevron" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyFoodOrders;
