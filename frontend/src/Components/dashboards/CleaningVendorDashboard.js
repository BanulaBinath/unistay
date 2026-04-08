import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './CleaningVendorDashboard.css';
import api from '../../services/api';

function CleaningVendorDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [isAvailable, setIsAvailable]   = useState(false);
  const [message, setMessage]           = useState('');
  const [profile, setProfile]           = useState(null);
  const [stats, setStats]               = useState(null);
  const [loading, setLoading]           = useState(true);
  const [toggling, setToggling]         = useState(false);

  // ── Load profile + stats on mount ──
  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const [profileRes, statsRes] = await Promise.all([
        api.get('/cleaning/vendor/profile'),
        api.get('/cleaning/vendor/stats'),
      ]);
      const profileData = profileRes.data.data;
      setProfile(profileData);
      setIsAvailable(profileData.isAvailable ?? false);
      setStats(statsRes.data.data || null);
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // ── Toggle availability ──
  const handleToggleAvailability = async () => {
    const next = !isAvailable;
    setToggling(true);
    try {
      await api.put('/cleaning/vendor/availability', { isAvailable: next });
      setIsAvailable(next);
      setMessage(`✅ Status set to ${next ? 'Active' : 'Inactive'}`);
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to update availability');
    } finally {
      setToggling(false);
    }
  };

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
      route: '/cleaning-vendor/profile'
    },
    {
      icon: '📋',
      title: 'Assigned Jobs',
      desc: 'View and manage your assigned cleaning jobs',
      color: '#d1fae5',
      accent: '#065f46',
      route: '/cleaning-vendor/assigned-jobs'
    },
    {
      icon: '⭐',
      title: 'Ratings & Reviews',
      desc: 'See what students are saying about your service',
      color: '#fef3c7',
      accent: '#92400e',
      route: '/cleaning-vendor/ratings'
    },
    {
      icon: '⚠️',
      title: 'Complaints',
      desc: 'View and reply to complaints from students',
      color: '#fee2e2',
      accent: '#991b1b',
      route: '/cleaning-vendor/complaints'
    }
  ];

  const displayName    = profile?.fullName     || user?.fullName     || 'Vendor';
  const businessName   = profile?.businessName || user?.businessName || '—';
  const email          = profile?.email        || user?.email        || '—';

  return (
    <div className="cvd-page">

      {/* Header */}
      <div className="cvd-header">
        <div>
          <h1>🧹 Cleaning Vendor Dashboard</h1>
          <p>Manage your profile, jobs, ratings and complaints</p>
        </div>
        <div className="cvd-header-right">
          <div className="cvd-status-wrap">
            <span>Status:</span>
            <button
              className={`cvd-toggle-btn ${isAvailable ? 'active' : 'inactive'}`}
              onClick={handleToggleAvailability}
              disabled={toggling}
            >
              {toggling
                ? '⏳ Updating...'
                : isAvailable ? '🟢 Active' : '🔴 Inactive'}
            </button>
          </div>
          <button className="cvd-logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Alert */}
      {message && (
        <div className={`cvd-alert ${message.includes('✅') ? 'cvd-alert-success' : 'cvd-alert-error'}`}>
          {message}
          <button onClick={() => setMessage('')}>✕</button>
        </div>
      )}

      {/* Welcome Card */}
      <div className="cvd-welcome-card">
        <div className="cvd-welcome-info">
          <h2>Welcome, {displayName}! 👋</h2>
          <p>Business: {businessName}</p>
          <p>Email: {email}</p>
          <p>Vendor Type: Cleaning</p>
        </div>
        <span className={`cvd-welcome-status ${isAvailable ? 'active' : 'inactive'}`}>
          {isAvailable ? '🟢 Status: Active' : '🔴 Status: Inactive'}
        </span>
      </div>

      {/* Stats Row */}
      {!loading && stats && (
        <div className="cvd-stats-row">
          <div className="cvd-stat-card">
            <span className="cvd-stat-value">{stats.totalJobs ?? 0}</span>
            <span className="cvd-stat-label">Total Jobs</span>
          </div>
          <div className="cvd-stat-card">
            <span className="cvd-stat-value">{stats.pendingJobs ?? 0}</span>
            <span className="cvd-stat-label">Pending</span>
          </div>
          <div className="cvd-stat-card">
            <span className="cvd-stat-value">{stats.completedJobs ?? 0}</span>
            <span className="cvd-stat-label">Completed</span>
          </div>
          <div className="cvd-stat-card">
            <span className="cvd-stat-value">
              {stats.averageRating ? `${stats.averageRating}/5` : '—'}
            </span>
            <span className="cvd-stat-label">Avg. Rating</span>
          </div>
        </div>
      )}

      {/* Loading skeleton for stats */}
      {loading && (
        <div className="cvd-stats-row">
          {[1,2,3,4].map(i => (
            <div key={i} className="cvd-stat-card cvd-stat-skeleton">
              <div className="cvd-skeleton-val" />
              <div className="cvd-skeleton-lbl" />
            </div>
          ))}
        </div>
      )}

      {/* Cards Grid */}
      <div className="cvd-cards-grid">
        {cards.map((card, i) => (
          <div
            key={i}
            className="cvd-card"
            style={{ borderTop: `4px solid ${card.accent}` }}
            onClick={() => navigate(card.route)}
          >
            <div className="cvd-card-icon" style={{ background: card.color }}>
              {card.icon}
            </div>
            <div className="cvd-card-body">
              <h3 style={{ color: card.accent }}>{card.title}</h3>
              <p>{card.desc}</p>
            </div>
            <div className="cvd-card-arrow" style={{ color: card.accent }}>→</div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default CleaningVendorDashboard;