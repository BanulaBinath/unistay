import React, { useEffect, useState, useRef } from 'react';
import './foodvendor.css';
import { Link, useNavigate } from 'react-router-dom';
import ItemSidebar from '../foodvendor/itemsidebar';
import { deleteItem as deleteItemApi, getItems } from '../../services/itemApi';
import { useAuth } from '../../context/AuthContext';

function FoodVendor() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [actionItemId, setActionItemId] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const imageBaseUrl = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace('/api', '');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      setFetchError('');
      const response = await getItems({ vendorId: user?.id });
      setItems(response?.data || []);
    } catch (error) {
      setFetchError(
        error?.response?.data?.message ||
          (error?.code === 'ERR_NETWORK'
            ? 'Cannot connect to backend. Please start the server on port 5000.'
            : 'Failed to load items')
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchItems();
    }
  }, [user?.id]);

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

  const handleUpdate = (itemId) => {
    navigate(`/updateItem/${itemId}`);
  };

  const handleDelete = async (itemId) => {
    const confirmed = window.confirm('Are you sure you want to delete this item?');
    if (!confirmed) return;

    setActionItemId(itemId);
    setFetchError('');

    try {
      await deleteItemApi(itemId);
      setItems((previous) => previous.filter((item) => item._id !== itemId));
    } catch (error) {
      setFetchError(error?.response?.data?.message || 'Failed to delete item');
    } finally {
      setActionItemId('');
    }
  };

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
            <h2 className="vendor-title">Food Items</h2>
            <p className="vendor-subtitle">Manage your food menu and inventory</p>
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
                <Link to="/vendor/food/dashboard" className="vendor-dropdown-item" onClick={() => setProfileOpen(false)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '16px', height: '16px', strokeWidth: 2 }}>
                    <rect x="3" y="3" width="7" height="7" rx="1"/>
                    <rect x="14" y="3" width="7" height="7" rx="1"/>
                    <rect x="14" y="14" width="7" height="7" rx="1"/>
                    <rect x="3" y="14" width="7" height="7" rx="1"/>
                  </svg>
                  Dashboard
                </Link>
                <Link to="/ItemManagement" className="vendor-dropdown-item" onClick={() => setProfileOpen(false)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '16px', height: '16px', strokeWidth: 2 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Manage Items
                </Link>
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

        <div className="vendor-actions">
          <Link to="/addItem" className="vendor-action-btn vendor-action-btn-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '16px', height: '16px', strokeWidth: 2 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Item
          </Link>
          <Link to="/ItemManagement" className="vendor-action-btn vendor-action-btn-secondary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '16px', height: '16px', strokeWidth: 2 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Manage Items
          </Link>
        </div>

        {fetchError && <p className="vendor-error">{fetchError}</p>}

        <div className="vendor-table-wrapper">
          <table className="vendor-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Description</th>
                <th>Price (RS)</th>
                <th>Category</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan="6" className="vendor-loading">Loading items...</td>
                </tr>
              )}

              {!isLoading && items.length === 0 && (
                <tr>
                  <td colSpan="6" className="vendor-no-items">No items available</td>
                </tr>
              )}

              {!isLoading &&
                items.map((item) => (
                  <tr key={item._id}>
                    <td className="vendor-item-name">{item.itemName}</td>
                    <td className="vendor-item-desc">{item.description}</td>
                    <td className="vendor-item-price">Rs. {Number(item.price).toFixed(2)}</td>
                    <td>
                      <span className={item.category === 'active' ? 'vendor-status-badge vendor-status-active' : 'vendor-status-badge vendor-status-inactive'}>
                        {item.category}
                      </span>
                    </td>
                    <td>
                      <img
                        src={`${imageBaseUrl}${item.itemImage}`}
                        alt={item.itemName}
                        className="vendor-item-img"
                      />
                    </td>
                    <td>
                      <button
                        className="vendor-btn vendor-btn-update"
                        onClick={() => handleUpdate(item._id)}
                        disabled={actionItemId === item._id}
                      >
                        Update
                      </button>
                      <button
                        className="vendor-btn vendor-btn-delete"
                        onClick={() => handleDelete(item._id)}
                        disabled={actionItemId === item._id}
                      >
                        {actionItemId === item._id ? 'Deleting...' : 'Delete'}
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

export default FoodVendor;