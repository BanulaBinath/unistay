import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './LaundryVendorDashboard.css';

function LaundryVendorDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isAvailable, setIsAvailable] = useState(true);
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoadingStats(true);
      try {
        const response = await api.get('/laundry/vendor/stats');
        setStats(response.data.data || {});
      } catch (error) {
        console.error('Failed to load laundry stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cards = [
    {
      icon: '👤',
      title: 'My Profile',
      desc: 'View and edit your profile, rates and services',
      color: '#dbeafe',
      accent: '#1e3a8a',
      route: '/laundry-vendor/profile'         // ✅
    },
    {
      icon: '📋',
      title: 'Assigned Jobs',
      desc: 'View and manage your assigned laundry jobs',
      color: '#d1fae5',
      accent: '#065f46',
      route: '/laundry-vendor/assigned-jobs'   // ✅ FIXED (was /jobs)
    },
    {
      icon: '⭐',
      title: 'Ratings & Reviews',
      desc: 'See what students are saying about your service',
      color: '#fef3c7',
      accent: '#92400e',
      route: '/laundry-vendor/ratings'         // ✅
    },
    {
      icon: '⚠️',
      title: 'Complaints',
      desc: 'View and reply to complaints from students',
      color: '#fee2e2',
      accent: '#991b1b',
      route: '/laundry-vendor/complaints'      // ✅
    }
  ];

  return (
    <div className="lvd-page">

      {/* Header */}
      <div className="lvd-header">
        <div>
          <h1>🧺 Laundry Vendor Dashboard</h1>
          <p>Manage your profile, jobs, ratings and complaints</p>
        </div>
        <div className="lvd-header-right">
          <div className="lvd-status-wrap">
            <span>Status:</span>
            <button
              className={`lvd-toggle-btn ${isAvailable ? 'active' : 'inactive'}`}
              onClick={() => {
                setIsAvailable(!isAvailable);
                setMessage(`✅ Status set to ${!isAvailable ? 'Active' : 'Inactive'}`);
              }}
            >
              {isAvailable ? '🟢 Active' : '🔴 Inactive'}
            </button>
          </div>
          <button className="lvd-logout-btn" onClick={handleLogout}>🚪 Logout</button>
        </div>
      </div>

      {/* Alert */}
      {message && (
        <div className="lvd-alert">
          {message}
          <button onClick={() => setMessage('')}>✕</button>
        </div>
      )}

      {/* Welcome Card */}
      <div className="lvd-welcome-card">
        <div className="lvd-welcome-info">
          <h2>Welcome, {user?.fullName || user?.businessName || 'Vendor'}! 👋</h2>
          <p>Business: {user?.businessName || '—'}</p>
          <p>Email: {user?.email || '—'}</p>
          <p>Vendor Type: Laundry</p>
        </div>
        <span className={`lvd-welcome-status ${isAvailable ? 'active' : 'inactive'}`}>
          {isAvailable ? '🟢 Status: Active' : '🔴 Status: Inactive'}
        </span>
      </div>

      {/* Stats Row */}
      <div className="lvd-stats-row">
        {loadingStats ? (
          [1, 2, 3, 4].map((item) => (
            <div key={item} className="lvd-stat-card lvd-stat-skeleton">
              <div className="lvd-skeleton-val" />
              <div className="lvd-skeleton-lbl" />
            </div>
          ))
        ) : (
          [
            { value: stats?.totalJobs ?? 0, label: 'Total Jobs' },
            { value: stats?.pendingJobs ?? 0, label: 'Pending' },
            { value: stats?.inProgressJobs ?? 0, label: 'In Progress' },
            { value: stats?.completedJobs ?? 0, label: 'Completed' },
            { value: stats?.averageRating ? `${stats.averageRating}/5` : '—', label: 'Avg. Rating' }
          ].map((item, index) => (
            <div key={index} className="lvd-stat-card">
              <span className="lvd-stat-value">{item.value}</span>
              <span className="lvd-stat-label">{item.label}</span>
            </div>
          ))
        )}
      </div>

      {/* Cards Grid */}
      <div className="lvd-cards-grid">
        {cards.map((card, i) => (
          <div
            key={i}
            className="lvd-card"
            style={{ borderTop: `4px solid ${card.accent}` }}
            onClick={() => navigate(card.route)}
          >
            <div className="lvd-card-icon" style={{ background: card.color }}>
              {card.icon}
            </div>
            <div className="lvd-card-body">
              <h3 style={{ color: card.accent }}>{card.title}</h3>
              <p>{card.desc}</p>
            </div>
            <div className="lvd-card-arrow" style={{ color: card.accent }}>→</div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default LaundryVendorDashboard;