import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './FoodVendorDashboard.css';
import ItemSidebar from '../foodvendor/itemsidebar'; 

function FoodVendorDashboard() {
  const { user } = useAuth();

  return (
    <div className="vendor-dashboard-layout">
      <ItemSidebar />

      <main className="vendor-main-content">
        {/* Top Header */}
        <header className="vendor-top-header">
          <div className="header-left">
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Welcome back, {user?.fullName}</p>
          </div>
          <div className="header-right">
            <div className="vendor-user-badge">
              <div className="user-avatar">
                {user?.fullName?.charAt(0).toUpperCase()}
              </div>
              <div className="user-info">
                <span className="user-name">{user?.fullName}</span>
                <span className="user-role">Food Vendor</span>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
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
              <h3 className="stat-label">Total Items</h3>
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
              <h3 className="stat-label">Total Orders</h3>
              <p className="stat-value">-</p>
              <div className="stat-progress-bar">
                <div className="stat-progress-fill stat-progress-green" style={{ width: '0%' }}></div>
              </div>
              <div className="stat-details-row">
                <span className="stat-detail">
                  <span className="stat-detail-dot stat-dot-green"></span>
                  <span className="stat-detail-label">Completed</span>
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
              <h3 className="stat-label">Pending Orders</h3>
              <p className="stat-value">-</p>
              <div className="stat-progress-bar">
                <div className="stat-progress-fill stat-progress-orange" style={{ width: '0%' }}></div>
              </div>
              <div className="stat-details-row">
                <span className="stat-detail">
                  <span className="stat-detail-dot stat-dot-orange"></span>
                  <span className="stat-detail-label">Awaiting</span>
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
              <h3 className="stat-label">Total Revenue</h3>
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
                  <span className="info-value">Food Vendor</span>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="action-title">Add New Item</h3>
              <p className="action-description">Add new food items to your menu</p>
            </div>

            <div className="action-card">
              <div className="action-icon-wrapper action-icon-green">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="action-title">Manage Orders</h3>
              <p className="action-description">View and process customer orders</p>
            </div>

            <div className="action-card">
              <div className="action-icon-wrapper action-icon-orange">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="action-title">Update Menu</h3>
              <p className="action-description">Edit existing menu items</p>
            </div>

            <div className="action-card">
              <div className="action-icon-wrapper action-icon-purple">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="action-title">View Analytics</h3>
              <p className="action-description">Check sales and performance</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default FoodVendorDashboard;