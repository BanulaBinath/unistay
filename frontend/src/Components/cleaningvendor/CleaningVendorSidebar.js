import React from 'react';
import { useNavigate } from 'react-router-dom';
import './cleaningvendor.css';

function CleaningVendorSidebar({ activeTab, setActiveTab }) {
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
    <div className="cv-sidebar">
      <div className="cv-sidebar-title">
        <h2>🧹 Cleaning Vendor</h2>
      </div>
      <nav className="cv-sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.key}
            className={`cv-sidebar-item ${activeTab === item.key ? 'active' : ''}`}
            onClick={() => setActiveTab(item.key)}
          >
            <span className="cv-sidebar-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      <button className="cv-sidebar-logout" onClick={handleLogout}>
        🔴 Logout
      </button>
    </div>
  );
}

export default CleaningVendorSidebar;
