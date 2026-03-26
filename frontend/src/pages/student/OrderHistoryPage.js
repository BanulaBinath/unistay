import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getStudentOrders } from '../../services/orderApi';
import Navbar from '../../Components/common/Navbar';
import Footer from '../../Components/common/Footer';
import './OrderHistoryPage.css';

function OrderHistoryPage() {
  const location = useLocation();
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Check for success message from navigation state
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      // Clear the message after 5 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      // Clear the navigation state
      window.history.replaceState({}, document.title);
    }
    
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [filterStatus, searchQuery, orders]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      
      const data = await getStudentOrders();

      if (data.success) {
        setOrders(data.data);
        setFilteredOrders(data.data);
      } else {
        setError(data.message || 'Failed to fetch orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.response?.data?.message || 'Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // Filter by status
    if (filterStatus !== 'All') {
      filtered = filtered.filter(order => order.status === filterStatus);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(order =>
        order.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order._id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="order-history-page">
        <Navbar />
        <div className="order-history-loading">
          <div className="loading-spinner"></div>
          <p>Loading your orders...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="order-history-page">
      <Navbar />
      
      <div className="order-history-container">
        <div className="order-history-header">
          <div className="header-content">
            <h1 className="order-history-title">My Orders</h1>
            <p className="order-history-subtitle">
              Track and manage all your food orders in one place
            </p>
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <span className="stat-value">{orders.length}</span>
              <span className="stat-label">Total Orders</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">
                {orders.filter(o => o.status === 'Pending').length}
              </span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">
                {orders.filter(o => o.status === 'Completed').length}
              </span>
              <span className="stat-label">Completed</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="order-filters">
          {successMessage && (
            <div className="success-message">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{successMessage}</span>
            </div>
          )}
          <div className="search-box">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by item name or order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-buttons">
            {['All', 'Pending', 'Accepted', 'Completed', 'Cancelled', 'Rejected'].map(status => (
              <button
                key={status}
                className={`filter-btn ${filterStatus === status ? 'active' : ''}`}
                onClick={() => setFilterStatus(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {error && (
          <div className="error-message">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {filteredOrders.length === 0 ? (
          <div className="empty-state">
            <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3>No Orders Found</h3>
            <p>
              {searchQuery || filterStatus !== 'All'
                ? 'Try adjusting your filters'
                : 'You have not placed any food orders yet. Once you place an order, it will appear here.'}
            </p>
            <Link to="/buyorder" className="empty-cta">
              Browse Food Items
            </Link>
          </div>
        ) : (
          <div className="orders-grid">
            {filteredOrders.map(order => (
              <div key={order._id} className="order-card">
                <div className="order-card-header">
                  <div className="order-card-id">
                    Order #{order._id.slice(-8).toUpperCase()}
                  </div>
                  <div className={`order-status-badge ${getStatusColor(order.status)}`}>
                    {order.status}
                  </div>
                </div>

                <div className="order-card-content">
                  <div className="order-item-preview">
                    <img
                      src={`http://localhost:5000/${order.itemImage}`}
                      alt={order.itemName}
                      className="order-item-image"
                      onError={(e) => {
                        e.target.src = '/placeholder-food.png';
                      }}
                    />
                    <div className="order-item-info">
                      <h3 className="order-item-name">{order.itemName}</h3>
                      <p className="order-item-quantity">Quantity: {order.quantity}</p>
                    </div>
                  </div>

                  <div className="order-card-details">
                    <div className="order-detail-row">
                      <svg className="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{order.orderDate}</span>
                    </div>
                    <div className="order-detail-row">
                      <svg className="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="order-price">Rs. {order.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="order-card-footer">
                  <Link to={`/student/orders/${order._id}`} className="view-details-btn">
                    View Details
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default OrderHistoryPage;
