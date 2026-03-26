import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getOrderById } from '../../services/orderApi';
import Navbar from '../../Components/common/Navbar';
import Footer from '../../Components/common/Footer';
import './OrderDetailsPage.css';

function OrderDetailsPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError('');
      
      const data = await getOrderById(orderId);

      if (data.success) {
        setOrder(data.data);
      } else {
        setError(data.message || 'Failed to fetch order details');
      }
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError(err.response?.data?.message || 'Failed to load order details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'status-pending';
      case 'Accepted':
        return 'status-accepted';
      case 'Completed':
        return 'status-completed';
      case 'Cancelled':
        return 'status-cancelled';
      case 'Rejected':
        return 'status-rejected';
      default:
        return 'status-pending';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'Accepted':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'Completed':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'Cancelled':
      case 'Rejected':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="order-details-page">
        <Navbar />
        <div className="order-details-loading">
          <div className="loading-spinner"></div>
          <p>Loading order details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-details-page">
        <Navbar />
        <div className="order-details-error">
          <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2>Order Not Found</h2>
          <p>{error}</p>
          <Link to="/student/orders" className="back-button">
            Back to Orders
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="order-details-page">
      <Navbar />
      
      <div className="order-details-container">
        <div className="order-details-header">
          <button onClick={() => navigate(-1)} className="back-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="order-details-title">Order Details</h1>
          <div className="order-id-badge">Order #{order._id.slice(-8).toUpperCase()}</div>
        </div>

        <div className="order-details-content">
          {/* Status Card */}
          <div className="order-status-card">
            <div className="status-header">
              <h2>Order Status</h2>
              <div className={`status-badge ${getStatusColor(order.status)}`}>
                <span className="status-icon">{getStatusIcon(order.status)}</span>
                <span>{order.status}</span>
              </div>
            </div>
            
            <div className="status-timeline">
              <div className={`timeline-step ${order.status === 'Pending' || order.status === 'Accepted' || order.status === 'Completed' ? 'active' : ''}`}>
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h4>Pending</h4>
                  <p>Waiting for vendor approval</p>
                </div>
              </div>
              <div className={`timeline-step ${order.status === 'Accepted' || order.status === 'Completed' ? 'active' : ''}`}>
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h4>Accepted</h4>
                  <p>Vendor is preparing your order</p>
                </div>
              </div>
              <div className={`timeline-step ${order.status === 'Completed' ? 'active' : ''}`}>
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h4>Completed</h4>
                  <p>Order delivered successfully</p>
                </div>
              </div>
            </div>

            {(order.status === 'Cancelled' || order.status === 'Rejected') && (
              <div className="status-cancelled-notice">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>
                  {order.status === 'Cancelled' 
                    ? 'This order has been cancelled' 
                    : 'This order has been rejected by the vendor'}
                </p>
              </div>
            )}
          </div>

          {/* Item Details Card */}
          <div className="order-item-card">
            <h2>Item Details</h2>
            <div className="item-details-content">
              <div className="item-image-wrapper">
                {order.itemImage ? (
                  <img 
                    src={`http://localhost:5000/${order.itemImage}`} 
                    alt={order.itemName}
                    className="item-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="item-image-placeholder" style={{ display: order.itemImage ? 'none' : 'flex' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
                    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                    <line x1="6" y1="1" x2="6" y2="4"/>
                    <line x1="10" y1="1" x2="10" y2="4"/>
                    <line x1="14" y1="1" x2="14" y2="4"/>
                  </svg>
                </div>
              </div>
              <div className="item-info">
                <h3 className="item-name">{order.itemName}</h3>
                <div className="item-details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Quantity</span>
                    <span className="detail-value">{order.quantity}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Unit Price</span>
                    <span className="detail-value">Rs. {order.unitPrice.toFixed(2)}</span>
                  </div>
                  <div className="detail-item detail-item-total">
                    <span className="detail-label">Total Price</span>
                    <span className="detail-value">Rs. {order.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Information Card */}
          <div className="order-delivery-card">
            <h2>Delivery Information</h2>
            <div className="delivery-info-grid">
              <div className="info-item">
                <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <span className="info-label">Order Date</span>
                  <span className="info-value">{order.orderDate}</span>
                </div>
              </div>
              <div className="info-item">
                <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <span className="info-label">Delivery Time</span>
                  <span className="info-value">{order.time}</span>
                </div>
              </div>
              <div className="info-item">
                <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <div>
                  <span className="info-label">Room Number</span>
                  <span className="info-value">{order.roomNumber}</span>
                </div>
              </div>
              <div className="info-item">
                <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <span className="info-label">Phone</span>
                  <span className="info-value">{order.phone}</span>
                </div>
              </div>
            </div>
            {order.liveLocation && (
              <div className="location-info">
                <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <span className="info-label">Live Location</span>
                  <span className="info-value">{order.liveLocation}</span>
                </div>
              </div>
            )}
            {order.notes && (
              <div className="notes-section">
                <h4>Additional Notes</h4>
                <p>{order.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default OrderDetailsPage;
