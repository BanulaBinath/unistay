import React from 'react';
import { useAuth } from '../../context/AuthContext';
import NotificationPanel from '../common/Notifications/NotificationPanel';
import ItemSidebar from './itemsidebar';
import '../dashboards/FoodVendorDashboard.css';

function FoodVendorNotifications() {
  const { user } = useAuth();

  return (
    <div className="vendor-dashboard-layout">
      <ItemSidebar />

      <main className="vendor-main-content">
        {/* Top Header */}
        <header className="vendor-top-header">
          <div className="header-left">
            <h1 className="page-title">Notifications</h1>
            <p className="page-subtitle">Stay updated with ticket activities and orders</p>
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

        {/* Notification Panel */}
        <div className="dashboard-section">
          <NotificationPanel userRole="vendor" />
        </div>
      </main>
    </div>
  );
}

export default FoodVendorNotifications;
