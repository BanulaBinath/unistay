import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

function LaundryVendorDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Laundry Vendor Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        <div className="welcome-card">
          <h2>Welcome, {user?.fullName}!</h2>
          <p>Business: {user?.businessName || 'N/A'}</p>
          <p>Email: {user?.email}</p>
          <p>Vendor Type: Laundry</p>
          <p className="status-badge">Status: Active</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Service Management</h3>
            <p>Manage laundry services and pricing</p>
            <button className="card-button">Coming Soon</button>
          </div>

          <div className="dashboard-card">
            <h3>Orders</h3>
            <p>View and manage laundry orders</p>
            <button className="card-button">Coming Soon</button>
          </div>

          <div className="dashboard-card">
            <h3>Analytics</h3>
            <p>View service and revenue metrics</p>
            <button className="card-button">Coming Soon</button>
          </div>

          <div className="dashboard-card">
            <h3>Profile</h3>
            <p>Manage your vendor profile</p>
            <button className="card-button">Coming Soon</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LaundryVendorDashboard;
