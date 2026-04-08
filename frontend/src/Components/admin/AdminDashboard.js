import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDashboardStats } from '../../services/adminApi';
import UsersManagement from './UsersManagement';
import PaymentsManagement from './PaymentsManagement';
import SubscriptionsManagement from './SubscriptionsManagement';
import AdminTicketsPage from '../../pages/admin/AdminTicketsPage';
import AdminTicketDetailsPage from '../../pages/admin/AdminTicketDetailsPage';
import NotificationBell from '../common/NotificationBell';
import './AdminDashboard.css';

function AdminDashboard({ defaultTab = 'dashboard' }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState(defaultTab);

  useEffect(() => {
    setActiveMenu(defaultTab);
  }, [defaultTab]);

  // Only load dashboard stats if the dashboard tab is active
  useEffect(() => {
    if (activeMenu === 'dashboard') {
      fetchStats();
    }
  }, [activeMenu]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await getDashboardStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', path: '/admin/dashboard' },
    { id: 'users', label: 'Users', icon: 'users', path: '/admin/users' },
    { id: 'vendors', label: 'Vendors', icon: 'vendors', path: '/admin/users' },
    { id: 'payments', label: 'Payments', icon: 'payments', path: '/admin/payments' },
    { id: 'subscriptions', label: 'Subscriptions', icon: 'subscriptions', path: '/admin/subscriptions' },
    { id: 'tickets', label: 'Tickets', icon: 'tickets', path: '/admin/tickets' },
  ];

  const handleMenuClick = (item) => {
    setActiveMenu(item.id);
    if (item.path) {
      navigate(item.path);
    }
  };

  if (loading && activeMenu === 'dashboard') {
    return (
      <div className="admin-loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <svg className="logo-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3L1 9L5 11.18V17.18L12 21L19 17.18V11.18L21 10.09V17H23V9L12 3ZM18.82 9L12 12.72L5.18 9L12 5.28L18.82 9ZM17 15.99L12 18.72L7 15.99V12.27L12 15L17 12.27V15.99Z"/>
            </svg>
            {sidebarOpen && <span className="logo-text">Unistay</span>}
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
              className={`sidebar-nav-item ${(activeMenu === item.id || (activeMenu === 'ticket-details' && item.id === 'tickets')) ? 'active' : ''}`}
              onClick={() => handleMenuClick(item)}
            >
              {item.icon === 'dashboard' && (
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="2"/>
                  <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="2"/>
                  <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="2"/>
                  <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="2"/>
                </svg>
              )}
              {item.icon === 'users' && (
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              )}
              {item.icon === 'vendors' && (
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              )}
              {item.icon === 'payments' && (
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              )}
              {item.icon === 'subscriptions' && (
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              )}
              {item.icon === 'tickets' && (
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
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
      <main className="admin-main-content">
        {/* Render either Dashboard Stats or Active Tab Module */}
        {activeMenu === 'dashboard' && (
          <>
            <header className="admin-top-header">
              <div className="header-left">
                <h1 className="page-title">Dashboard</h1>
                <p className="page-subtitle">Welcome back, {user?.fullName}</p>
              </div>
              <div className="header-right">
                <NotificationBell />
                <div className="admin-user-badge">
                  <div className="user-avatar">
                    {user?.fullName?.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-info">
                    <span className="user-name">{user?.fullName}</span>
                    <span className="user-role">Administrator</span>
                  </div>
                </div>
              </div>
            </header>

            {error && (
              <div className="alert-error">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

        {/* Stats Cards */}
        {stats && (
          <>
            <div className="stats-grid-modern">
              <div className="stat-card-modern stat-card-blue">
                <div className="stat-card-background-pattern"></div>
                <div className="stat-card-header">
                  <div className="stat-icon-wrapper">
                    <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <span className="stat-trend stat-trend-up">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    +12%
                  </span>
                </div>
                <div className="stat-card-body">
                  <h3 className="stat-label">Total Users</h3>
                  <p className="stat-value">{stats.users.total}</p>
                  <div className="stat-progress-bar">
                    <div className="stat-progress-fill stat-progress-blue" style={{ width: '75%' }}></div>
                  </div>
                  <div className="stat-details-row">
                    <span className="stat-detail">
                      <span className="stat-detail-dot stat-dot-blue"></span>
                      <span className="stat-detail-label">Active:</span>
                      <span className="stat-detail-value">{stats.users.active}</span>
                    </span>
                    <span className="stat-detail">
                      <span className="stat-detail-dot stat-dot-light-blue"></span>
                      <span className="stat-detail-label">Students:</span>
                      <span className="stat-detail-value">{stats.users.students}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="stat-card-modern stat-card-purple">
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
                    +8%
                  </span>
                </div>
                <div className="stat-card-body">
                  <h3 className="stat-label">Total Vendors</h3>
                  <p className="stat-value">{stats.users.vendors}</p>
                  <div className="stat-progress-bar">
                    <div className="stat-progress-fill stat-progress-purple" style={{ width: '60%' }}></div>
                  </div>
                  <div className="stat-details-row">
                    <span className="stat-detail">
                      <span className="stat-detail-dot stat-dot-purple"></span>
                      <span className="stat-detail-label">Active:</span>
                      <span className="stat-detail-value">{stats.users.vendors}</span>
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
                    +15%
                  </span>
                </div>
                <div className="stat-card-body">
                  <h3 className="stat-label">Subscriptions</h3>
                  <p className="stat-value">{stats.subscriptions.active}</p>
                  <div className="stat-progress-bar">
                    <div className="stat-progress-fill stat-progress-green" style={{ width: '85%' }}></div>
                  </div>
                  <div className="stat-details-row">
                    <span className="stat-detail">
                      <span className="stat-detail-dot stat-dot-green"></span>
                      <span className="stat-detail-label">Active:</span>
                      <span className="stat-detail-value">{stats.subscriptions.active}</span>
                    </span>
                    <span className="stat-detail">
                      <span className="stat-detail-dot stat-dot-light-green"></span>
                      <span className="stat-detail-label">Expired:</span>
                      <span className="stat-detail-value">{stats.subscriptions.expired}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="stat-card-modern stat-card-orange">
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
                    +22%
                  </span>
                </div>
                <div className="stat-card-body">
                  <h3 className="stat-label">Total Revenue</h3>
                  <p className="stat-value">Rs.{stats.revenue.total.toFixed(2)}</p>
                  <div className="stat-progress-bar">
                    <div className="stat-progress-fill stat-progress-orange" style={{ width: '92%' }}></div>
                  </div>
                  <div className="stat-details-row">
                    <span className="stat-detail">
                      <span className="stat-detail-dot stat-dot-orange"></span>
                      <span className="stat-detail-label">Payments:</span>
                      <span className="stat-detail-value">{stats.payments.completed}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity Section */}
            <div className="dashboard-section">
              <div className="section-header">
                <h2 className="section-title">Recent Activity</h2>
                <button className="btn-view-all">View All</button>
              </div>
              
              <div className="activity-grid">
                <div className="activity-card activity-card-enhanced">
                  <div className="activity-card-glow"></div>
                  <div className="activity-card-header">
                    <div className="activity-header-left">
                      <div className="activity-icon-wrapper activity-icon-green">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div>
                        <h3>Recent Payments</h3>
                        <p className="activity-card-subtitle">Transaction overview</p>
                      </div>
                    </div>
                    <span className="activity-badge activity-badge-success">{stats.payments.completed} completed</span>
                  </div>
                  
                  <div className="activity-stats-enhanced">
                    <div className="activity-stat-box activity-stat-success-box">
                      <div className="stat-box-header">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="stat-box-label">Completed</span>
                      </div>
                      <span className="stat-box-value">{stats.payments.completed}</span>
                      <div className="stat-box-progress">
                        <div className="stat-box-progress-fill stat-box-progress-success" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    
                    <div className="activity-stat-box activity-stat-warning-box">
                      <div className="stat-box-header">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="stat-box-label">Pending</span>
                      </div>
                      <span className="stat-box-value">{stats.payments.pending}</span>
                      <div className="stat-box-progress">
                        <div className="stat-box-progress-fill stat-box-progress-warning" style={{ width: '15%' }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="activity-card-footer">
                    <div className="activity-meta">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      <span>+22% from last month</span>
                    </div>
                    <button className="activity-btn-minimal" onClick={() => navigate('/admin/payments')}>
                      Manage Payments
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="activity-card activity-card-enhanced">
                  <div className="activity-card-glow"></div>
                  <div className="activity-card-header">
                    <div className="activity-header-left">
                      <div className="activity-icon-wrapper activity-icon-blue">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3>User Management</h3>
                        <p className="activity-card-subtitle">User distribution</p>
                      </div>
                    </div>
                    <span className="activity-badge activity-badge-info">{stats.users.total} total</span>
                  </div>
                  
                  <div className="activity-stats-enhanced">
                    <div className="activity-stat-box activity-stat-info-box">
                      <div className="stat-box-header">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <span className="stat-box-label">Students</span>
                      </div>
                      <span className="stat-box-value">{stats.users.students}</span>
                      <div className="stat-box-progress">
                        <div className="stat-box-progress-fill stat-box-progress-info" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    
                    <div className="activity-stat-box activity-stat-purple-box">
                      <div className="stat-box-header">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span className="stat-box-label">Vendors</span>
                      </div>
                      <span className="stat-box-value">{stats.users.vendors}</span>
                      <div className="stat-box-progress">
                        <div className="stat-box-progress-fill stat-box-progress-purple" style={{ width: '25%' }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="activity-card-footer">
                    <div className="activity-meta">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      <span>+12% from last month</span>
                    </div>
                    <button className="activity-btn-minimal" onClick={() => navigate('/admin/users')}>
                      Manage Users
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="dashboard-section">
              <div className="section-header">
                <h2 className="section-title">Quick Stats</h2>
              </div>
              
              <div className="quick-stats-grid">
                <div className="quick-stat-card">
                  <div className="quick-stat-icon quick-stat-icon-blue">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div className="quick-stat-content">
                    <span className="quick-stat-label">Active Sessions</span>
                    <span className="quick-stat-value">{stats.users.active}</span>
                  </div>
                  <div className="quick-stat-change quick-stat-positive">+5.2%</div>
                </div>

                <div className="quick-stat-card">
                  <div className="quick-stat-icon quick-stat-icon-green">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="quick-stat-content">
                    <span className="quick-stat-label">Completed Today</span>
                    <span className="quick-stat-value">{stats.payments.completed}</span>
                  </div>
                  <div className="quick-stat-change quick-stat-positive">+12.5%</div>
                </div>

                <div className="quick-stat-card">
                  <div className="quick-stat-icon quick-stat-icon-orange">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="quick-stat-content">
                    <span className="quick-stat-label">Pending Actions</span>
                    <span className="quick-stat-value">{stats.payments.pending}</span>
                  </div>
                  <div className="quick-stat-change quick-stat-neutral">-</div>
                </div>

                <div className="quick-stat-card">
                  <div className="quick-stat-icon quick-stat-icon-purple">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="quick-stat-content">
                    <span className="quick-stat-label">Avg Response Time</span>
                    <span className="quick-stat-value">1.2s</span>
                  </div>
                  <div className="quick-stat-change quick-stat-positive">-0.3s</div>
                </div>
              </div>
            </div>
          </>
        )}
        </>
      )}

        {/* Users Management Tab */}
        {activeMenu === 'users' && (
          <UsersManagement />
        )}
        
        {/* Payments Management Tab */}
        {activeMenu === 'payments' && (
          <PaymentsManagement />
        )}
        
        {/* Subscriptions Management Tab */}
        {activeMenu === 'subscriptions' && (
          <SubscriptionsManagement />
        )}

        {/* Tickets Management Tab */}
        {activeMenu === 'tickets' && (
          <AdminTicketsPage />
        )}
        
        {/* Ticket Details Tab */}
        {activeMenu === 'ticket-details' && (
          <AdminTicketDetailsPage />
        )}

      </main>
    </div>
  );
}

export default AdminDashboard;
