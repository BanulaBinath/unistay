import React, { useEffect, useState, useRef } from 'react';
import './AcceptItem.css';
import ItemSidebar from '../foodvendor/itemsidebar';
import { deleteVendorOrder, getVendorOrders, updateVendorOrderStatus } from '../../services/orderApi';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function AcceptItem() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [actionOrderId, setActionOrderId] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleUpdateStatus = async (orderId, currentStatus) => {
    const normalizedStatus = String(currentStatus || 'Pending').toLowerCase();
    const nextStatus = normalizedStatus === 'pending' ? 'Accepted' : 'Pending';

    try {
      setActionOrderId(orderId);
      setFetchError('');
      const response = await updateVendorOrderStatus(orderId, nextStatus);

      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? response.data : o))
      );
    } catch (error) {
      setFetchError(error?.response?.data?.message || 'Failed to update order status');
    } finally {
      setActionOrderId('');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    const confirmed = window.confirm('Are you sure you want to delete this order?');
    if (!confirmed) return;

    try {
      setActionOrderId(orderId);
      setFetchError('');
      await deleteVendorOrder(orderId);
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
    } catch (error) {
      setFetchError(error?.response?.data?.message || 'Failed to delete order');
    } finally {
      setActionOrderId('');
    }
  };

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setFetchError('');
      const response = await getVendorOrders();
      setOrders(response?.data || []);
    } catch (error) {
      setFetchError(error?.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const displayName = user?.fullName || user?.name || user?.email || "Vendor";
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <div className="vendor-wrapper">
      <ItemSidebar />

      <div className="vendor-main">
        <div className="vendor-header">
          <div>
            <h2 className="vendor-title">Accept Orders</h2>
            <p className="vendor-subtitle">Manage and process incoming food orders</p>
          </div>
          {/* Profile Button */}
          <div className="vendor-profile-wrap" ref={profileRef}>
            <button
              className="vendor-profile-btn"
              onClick={() => setProfileOpen((p) => !p)}
            >
              <div className="vendor-avatar">{initials}</div>
              <div className="vendor-profile-info">
                <span className="vendor-profile-name">{displayName}</span>
                <span className="vendor-profile-role">Food Vendor</span>
              </div>
              <span className="vendor-profile-chevron">{profileOpen ? "▲" : "▼"}</span>
            </button>

            {/* Dropdown */}
            {profileOpen && (
              <div className="vendor-profile-dropdown">
                <div className="vendor-dropdown-header">
                  <div className="vendor-avatar vendor-avatar-lg">{initials}</div>
                  <div>
                    <p className="vendor-dropdown-name">{displayName}</p>
                    <p className="vendor-dropdown-email">{user?.email || ""}</p>
                  </div>
                </div>
                <div className="vendor-dropdown-divider" />
                <button className="vendor-dropdown-item" onClick={() => { setProfileOpen(false); navigate('/vendor/food/dashboard'); }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '16px', height: '16px', strokeWidth: 2 }}>
                    <rect x="3" y="3" width="7" height="7" rx="1"/>
                    <rect x="14" y="3" width="7" height="7" rx="1"/>
                    <rect x="14" y="14" width="7" height="7" rx="1"/>
                    <rect x="3" y="14" width="7" height="7" rx="1"/>
                  </svg>
                  Dashboard
                </button>
                <button className="vendor-dropdown-item" onClick={() => { setProfileOpen(false); navigate('/ItemManagement'); }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '16px', height: '16px', strokeWidth: 2 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Manage Items
                </button>
                <div className="vendor-dropdown-divider" />
                <button className="vendor-dropdown-item danger" onClick={handleLogout}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '16px', height: '16px', strokeWidth: 2 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {fetchError && <p className="vendor-error">{fetchError}</p>}

        <div className="vendor-table-wrapper">
          <table className="vendor-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Item Name</th>
                <th>Price</th>
                <th>Email</th>
                <th>Room</th>
                <th>Phone</th>
                <th>Qty</th>
                <th>Date</th>
                <th>Time</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan="12" className="vendor-loading">Loading orders...</td>
                </tr>
              )}

              {!isLoading && orders.length === 0 && (
                <tr>
                  <td colSpan="12" className="vendor-no-items">No orders available</td>
                </tr>
              )}

              {!isLoading &&
                orders.map((order) => (
                  <tr key={order._id}>
                    <td className="vendor-order-id">{order.userId}</td>
                    <td className="vendor-order-name">{order.itemName}</td>
                    <td className="vendor-order-price">Rs. {Number(order.totalPrice || 0).toFixed(2)}</td>
                    <td>{order.email}</td>
                    <td>{order.roomNumber}</td>
                    <td>{order.phone}</td>
                    <td>{order.quantity}</td>
                    <td>{order.orderDate}</td>
                    <td>{order.time}</td>
                    <td>{order.liveLocation || '-'}</td>
                    <td>
                      <span className={`vendor-status-badge ${order.status?.toLowerCase() === 'accepted' ? 'vendor-status-active' : 'vendor-status-pending'}`}>
                        {order.status || 'Pending'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="vendor-btn vendor-btn-update"
                        onClick={() =>
                          handleUpdateStatus(order._id, order.status)
                        }
                        disabled={actionOrderId === order._id}
                      >
                        {actionOrderId === order._id ? 'Updating...' : 'Update'}
                      </button>

                      <button
                        className="vendor-btn vendor-btn-delete"
                        onClick={() => handleDeleteOrder(order._id)}
                        disabled={actionOrderId === order._id}
                      >
                        {actionOrderId === order._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AcceptItem;