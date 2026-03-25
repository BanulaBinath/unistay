import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './servicessidebar.css';

function ServicesSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
    { label: 'Student Profile', icon: '👤', path: '/student/dashboard' },
    { label: 'Laundry Service', icon: '🧺', path: '/student/laundry' },
    { label: 'Cleaning Service', icon: '🧹', path: '/student/cleaning' },
    { label: 'Complaint', icon: '⚠️', path: '/student/complaints' },
  ];

  return (
    <div className="student-sidebar">
      <div className="sidebar-title">
        <h2>Student</h2>
        <h2>Services</h2>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.path}
            className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="sidebar-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <button className="sidebar-logout" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default ServicesSidebar;
