import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

function BoardingVendorDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Boarding Vendor Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        <div className="welcome-card">
          <h2>Welcome, {user?.fullName}!</h2>
          <p>Business: {user?.businessName || 'N/A'}</p>
          <p>Email: {user?.email}</p>
          <p>Vendor Type: Boarding</p>
          <p className="status-badge">Status: Active</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Room Management</h3>
            <p>Manage available rooms and bookings</p>
            <button className="card-button">Coming Soon</button>
          </div>

          <div className="dashboard-card">
            <h3>Bookings</h3>
            <p>View and manage room bookings</p>
            <button className="card-button">Coming Soon</button>
          </div>

          <div className="dashboard-card">
            <h3>Analytics</h3>
            <p>View occupancy and revenue metrics</p>
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

export default BoardingVendorDashboard;
