import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotificationPanel from '../common/Notifications/NotificationPanel';
import './Dashboard.css';

function BoardingVendorDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMenuClick = (menuId) => {
    setActiveMenu(menuId);
  };

  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="2"/>
          <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="2"/>
          <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="2"/>
          <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="2"/>
        </svg>
      )
    },
    { 
      id: 'rooms', 
      label: 'Room Management', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    { 
      id: 'bookings', 
      label: 'Bookings', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    { 
      id: 'notifications', 
      label: 'Notifications', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      )
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    }
  ];

  return (
    <div className="boarding-dashboard-layout">
      {/* Sidebar */}
      <aside className={`boarding-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <svg className="logo-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3L1 9L5 11.18V17.18L12 21L19 17.18V11.18L21 10.09V17H23V9L12 3ZM18.82 9L12 12.72L5.18 9L12 5.28L18.82 9ZM17 15.99L12 18.72L7 15.99V12.27L12 15L17 12.27V15.99Z"/>
            </svg>
            {sidebarOpen && <span className="logo-text">Boarding</span>}
          </div>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar-nav-item ${activeMenu === item.id ? 'active' : ''}`}
              onClick={() => handleMenuClick(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-logout" onClick={handleLogout}>
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="boarding-main-content">
        {/* Dashboard View */}
        {activeMenu === 'dashboard' && (
          <>
            {/* Top Header */}
            <header className="boarding-top-header">
              <div className="header-left">
                <h1 className="page-title">Dashboard</h1>
                <p className="page-subtitle">Welcome back, {user?.fullName}</p>
              </div>
              <div className="header-right">
                <div className="boarding-user-badge">
                  <div className="user-avatar">
                    {user?.fullName?.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-info">
                    <span className="user-name">{user?.fullName}</span>
                    <span className="user-role">Boarding Vendor</span>
                  </div>
                </div>
              </div>
            </header>

        {/* Stats Cards */}
        <div className="stats-grid-modern">
          <div className="stat-card-modern stat-card-blue">
            <div className="stat-card-background-pattern"></div>
            <div className="stat-card-header">
              <div className="stat-icon-wrapper">
                <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="stat-trend stat-trend-up">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Active
              </span>
            </div>
            <div className="stat-card-body">
              <h3 className="stat-label">Total Rooms</h3>
              <p className="stat-value">-</p>
              <div className="stat-progress-bar">
                <div className="stat-progress-fill stat-progress-blue" style={{ width: '0%' }}></div>
              </div>
              <div className="stat-details-row">
                <span className="stat-detail">
                  <span className="stat-detail-dot stat-dot-blue"></span>
                  <span className="stat-detail-label">Available</span>
                </span>
              </div>
            </div>
          </div>

          <div className="stat-card-modern stat-card-green">
            <div className="stat-card-background-pattern"></div>
            <div className="stat-card-header">
              <div className="stat-icon-wrapper">
                <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <span className="stat-trend stat-trend-up">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                +0%
              </span>
            </div>
            <div className="stat-card-body">
              <h3 className="stat-label">Active Bookings</h3>
              <p className="stat-value">-</p>
              <div className="stat-progress-bar">
                <div className="stat-progress-fill stat-progress-green" style={{ width: '0%' }}></div>
              </div>
              <div className="stat-details-row">
                <span className="stat-detail">
                  <span className="stat-detail-dot stat-dot-green"></span>
                  <span className="stat-detail-label">Occupied</span>
                </span>
              </div>
            </div>
          </div>

          <div className="stat-card-modern stat-card-orange">
            <div className="stat-card-background-pattern"></div>
            <div className="stat-card-header">
              <div className="stat-icon-wrapper">
                <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="stat-trend stat-trend-up">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                -
              </span>
            </div>
            <div className="stat-card-body">
              <h3 className="stat-label">Occupancy Rate</h3>
              <p className="stat-value">0%</p>
              <div className="stat-progress-bar">
                <div className="stat-progress-fill stat-progress-orange" style={{ width: '0%' }}></div>
              </div>
              <div className="stat-details-row">
                <span className="stat-detail">
                  <span className="stat-detail-dot stat-dot-orange"></span>
                  <span className="stat-detail-label">Current</span>
                </span>
              </div>
            </div>
          </div>

          <div className="stat-card-modern stat-card-purple">
            <div className="stat-card-background-pattern"></div>
            <div className="stat-card-header">
              <div className="stat-icon-wrapper">
                <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="stat-trend stat-trend-up">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                +0%
              </span>
            </div>
            <div className="stat-card-body">
              <h3 className="stat-label">Monthly Revenue</h3>
              <p className="stat-value">Rs. 0.00</p>
              <div className="stat-progress-bar">
                <div className="stat-progress-fill stat-progress-purple" style={{ width: '0%' }}></div>
              </div>
              <div className="stat-details-row">
                <span className="stat-detail">
                  <span className="stat-detail-dot stat-dot-purple"></span>
                  <span className="stat-detail-label">This Month</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Business Information Section */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Business Information</h2>
          </div>
          
          <div className="info-card-modern">
            <div className="info-card-glow"></div>
            <div className="info-grid">
              <div className="info-item">
                <div className="info-icon-wrapper info-icon-blue">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="info-content">
                  <span className="info-label">Business Name</span>
                  <span className="info-value">{user?.businessName || 'N/A'}</span>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon-wrapper info-icon-green">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="info-content">
                  <span className="info-label">Email Address</span>
                  <span className="info-value">{user?.email}</span>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon-wrapper info-icon-purple">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="info-content">
                  <span className="info-label">Vendor Type</span>
                  <span className="info-value">Boarding Vendor</span>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon-wrapper info-icon-success">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="info-content">
                  <span className="info-label">Account Status</span>
                  <span className="info-value">
                    <span className="status-badge status-badge-success">Active</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Quick Actions</h2>
          </div>
          
          <div className="quick-actions-grid">
            <div className="action-card">
              <div className="action-icon-wrapper action-icon-blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="action-title">Room Management</h3>
              <p className="action-description">Manage available rooms and bookings</p>
              <button className="action-button">Coming Soon</button>
            </div>

            <div className="action-card">
              <div className="action-icon-wrapper action-icon-green">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="action-title">Bookings</h3>
              <p className="action-description">View and manage room bookings</p>
              <button className="action-button">Coming Soon</button>
            </div>

            <div className="action-card">
              <div className="action-icon-wrapper action-icon-orange">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="action-title">Analytics</h3>
              <p className="action-description">View occupancy and revenue metrics</p>
              <button className="action-button">Coming Soon</button>
            </div>

            <div className="action-card">
              <div className="action-icon-wrapper action-icon-purple">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="action-title">Profile</h3>
              <p className="action-description">Manage your vendor profile</p>
              <button className="action-button">Coming Soon</button>
            </div>
          </div>
        </div>
        </>
        )}

        {/* Notifications Tab */}
        {activeMenu === 'notifications' && (
          <div className="boarding-notifications-container">
            <header className="boarding-top-header">
              <div className="header-left">
                <h1 className="page-title">Notifications</h1>
                <p className="page-subtitle">Stay updated with booking and ticket activities</p>
              </div>
            </header>
            <NotificationPanel userRole="vendor" />
          </div>
        )}

        {/* Rooms Tab - Coming Soon */}
        {activeMenu === 'rooms' && (
          <div className="boarding-coming-soon">
            <header className="boarding-top-header">
              <div className="header-left">
                <h1 className="page-title">Room Management</h1>
                <p className="page-subtitle">Manage your rooms and availability</p>
              </div>
            </header>
            <div className="coming-soon-message">
              <h2>Coming Soon</h2>
              <p>Room management features will be available soon.</p>
            </div>
          </div>
        )}

        {/* Bookings Tab - Coming Soon */}
        {activeMenu === 'bookings' && (
          <div className="boarding-coming-soon">
            <header className="boarding-top-header">
              <div className="header-left">
                <h1 className="page-title">Bookings</h1>
                <p className="page-subtitle">View and manage room bookings</p>
              </div>
            </header>
            <div className="coming-soon-message">
              <h2>Coming Soon</h2>
              <p>Booking management features will be available soon.</p>
            </div>
          </div>
        )}

        {/* Analytics Tab - Coming Soon */}
        {activeMenu === 'analytics' && (
          <div className="boarding-coming-soon">
            <header className="boarding-top-header">
              <div className="header-left">
                <h1 className="page-title">Analytics</h1>
                <p className="page-subtitle">View occupancy and revenue metrics</p>
              </div>
            </header>
            <div className="coming-soon-message">
              <h2>Coming Soon</h2>
              <p>Analytics features will be available soon.</p>
            </div>
          </div>
        )}

        {/* Profile Tab - Coming Soon */}
        {activeMenu === 'profile' && (
          <div className="boarding-coming-soon">
            <header className="boarding-top-header">
              <div className="header-left">
                <h1 className="page-title">Profile</h1>
                <p className="page-subtitle">Manage your vendor profile</p>
              </div>
            </header>
            <div className="coming-soon-message">
              <h2>Coming Soon</h2>
              <p>Profile management features will be available soon.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default BoardingVendorDashboard;
