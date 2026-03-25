import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDashboardStats } from '../../services/adminApi';
import './AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

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
    navigate('/login');
  };

  if (loading) {
    return <div className="admin-loading">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-user-info">
          <span>Welcome, {user?.fullName}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="admin-nav">
        <button onClick={() => navigate('/admin/users')} className="nav-btn">
          Manage Users
        </button>
        <button onClick={() => navigate('/admin/payments')} className="nav-btn">
          Manage Payments
        </button>
        <button onClick={() => navigate('/admin/subscriptions')} className="nav-btn">
          Manage Subscriptions
        </button>
        <button onClick={() => navigate('/admin/tickets')} className="nav-btn">
          Manage Tickets
        </button>
      </div>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Users</h3>
            <div className="stat-details">
              <p>Total: <strong>{stats.users.total}</strong></p>
              <p>Active: <strong>{stats.users.active}</strong></p>
              <p>Students: <strong>{stats.users.students}</strong></p>
              <p>Vendors: <strong>{stats.users.vendors}</strong></p>
            </div>
          </div>

          <div className="stat-card">
            <h3>Subscriptions</h3>
            <div className="stat-details">
              <p>Active: <strong>{stats.subscriptions.active}</strong></p>
              <p>Expired: <strong>{stats.subscriptions.expired}</strong></p>
            </div>
          </div>

          <div className="stat-card">
            <h3>Payments</h3>
            <div className="stat-details">
              <p>Completed: <strong>{stats.payments.completed}</strong></p>
              <p>Pending: <strong>{stats.payments.pending}</strong></p>
            </div>
          </div>

          <div className="stat-card">
            <h3>Revenue</h3>
            <div className="stat-details">
              <p>Total: <strong>${stats.revenue.total.toFixed(2)}</strong></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
