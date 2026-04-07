import React from 'react';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../common/NotificationBell';
import './FoodVendorDashboard.css';
import ItemSidebar from '../foodvendor/itemsidebar'; 

function FoodVendorDashboard() {
  const { user } = useAuth();

  return (
    <div className="vendor-dashboard-wrapper">

      <ItemSidebar />

      <div className="vendor-dashboard-content">
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
          <NotificationBell />
        </div>
        <div className="vendor-dashboard-card">
          <h2 className="vendor-dashboard-title">
            Welcome, {user?.fullName}!
          </h2>

          <p className="vendor-dashboard-info">
            <strong>Business:</strong> {user?.businessName || 'N/A'}
          </p>

          <p className="vendor-dashboard-info">
            <strong>Email:</strong> {user?.email}
          </p>

          <p className="vendor-dashboard-info">
            <strong>Vendor Type:</strong> Food
          </p>

          <p className="vendor-dashboard-status">
            Status: Active
          </p>
        </div>

      </div>
    </div>
  );
}

export default FoodVendorDashboard;