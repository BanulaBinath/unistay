import React from 'react';
import { useNavigate } from 'react-router-dom';
import './laundryvendor.css';

function LaundryVendorSidebar({ activeTab, setActiveTab }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
    { key: 'profile',    icon: '🏪', label: 'My Profile' },
    { key: 'jobs',       icon: '📋', label: 'Assigned Jobs' },
    { key: 'ratings',    icon: '⭐', label: 'Ratings & Reviews' },
    { key: 'complaints', icon: '⚠️', label: 'Complaints' },
  ];

  return (
    <div className="lv-sidebar">
      <div className="lv-sidebar-title">
        <h2>🧺 Laundry Vendor</h2>
      </div>
      <nav className="lv-sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.key}
            className={`lv-sidebar-item ${activeTab === item.key ? 'active' : ''}`}
            onClick={() => setActiveTab(item.key)}
          >
            <span className="lv-sidebar-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      <button className="lv-sidebar-logout" onClick={handleLogout}>
        🔴 Logout
      </button>
    </div>
  );
}

export default LaundryVendorSidebar;
