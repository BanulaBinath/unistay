import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';



function StudentDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Student Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        <div className="welcome-card">
          <h2>Welcome, {user?.fullName}!</h2>
          <p>Email: {user?.email}</p>
          <p>Role: {user?.role === 'student_sliit' ? 'SLIIT Student' : 'External Student'}</p>
          <p className="status-badge">Status: Active</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Room Booking</h3>
            <p>Book and manage your accommodation</p>
            <button className="card-button">Coming Soon</button>
          </div>
        
          <div className="dashboard-card">
            <h3>Food Services</h3>
            <p>Order meals from campus vendors</p>
            <button className="card-button">Explore Services</button>
          </div>
        
          <div className="dashboard-card">
            <h3>Food Orders</h3>
            <p>Order meals from campus vendors</p>
            <button className="card-button">Coming Soon</button>
          </div>

          <div className="dashboard-card">
            <h3>Laundry Services</h3>
            <p>Schedule laundry pickups</p>
            <button className="card-button">Coming Soon</button>
          </div>

          <div className="dashboard-card">
            <h3>Cleaning Services</h3>
            <p>Request cleaning services</p>
            <button className="card-button">Coming Soon</button>
          </div>

          <div className="dashboard-card">
            <h3>Complaints</h3>
            <p>Submit and track complaints</p>
            <button
              className="card-button"
              onClick={() => navigate('/student/complaints')}
            >
              My Complaints
            </button>
            <button
              className="card-button"
              onClick={() => navigate('/student/complaints/new')}
              style={{ marginTop: '8px' }}
            >
              Submit New Complaint
            </button>
          </div>

          <div className="dashboard-card">
            <h3>Profile</h3>
            <p>Manage your account settings</p>
            <button className="card-button">Coming Soon</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
