import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './cleaningstaff.css';
import api from '../../services/api';

function CleaningRatings() {
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [filter, setFilter]   = useState('All');

  // ── Load ratings on mount ──
  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/cleaning/vendor/ratings');
      setReviews(res.data.data || []);
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to load ratings');
    } finally {
      setLoading(false);
    }
  };

  // ── Derived stats ──
  const filtered = filter === 'All'
    ? reviews
    : reviews.filter(r => r.rating?.score === parseInt(filter));

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + (r.rating?.score || 0), 0) / reviews.length).toFixed(1)
    : '0.0';

  const starCounts = [5, 4, 3, 2, 1].map(star => {
    const count = reviews.filter(r => r.rating?.score === star).length;
    return {
      star,
      count,
      percent: reviews.length ? Math.round((count / reviews.length) * 100) : 0
    };
  });

  const renderStars = (rating) =>
    [1, 2, 3, 4, 5].map(i => (
      <span key={i} style={{ color: i <= rating ? '#f59e0b' : '#e5e7eb', fontSize: '16px' }}>★</span>
    ));

  const studentName = (r) =>
    r.student?.fullName || r.student?.name || 'Student';

  const formatDate = (d) =>
    d ? new Date(d).toISOString().split('T')[0] : '—';

  return (
    <div className="cs-page">

      {/* Header */}
      <div className="cs-header">
        <div>
          <h1>⭐ Ratings & Reviews</h1>
          <p>See what students are saying about your cleaning service</p>
        </div>
        <button className="cs-back-btn"
          onClick={() => navigate('/cleaning-vendor/dashboard')}>
          ← Back to Dashboard
        </button>
      </div>

      {/* Alert */}
      {message && (
        <div className="cs-alert cs-alert-error">
          {message}
          <button onClick={() => setMessage('')}>✕</button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="cs-loading"><p>⏳ Loading ratings...</p></div>
      )}

      {/* No ratings yet */}
      {!loading && reviews.length === 0 && (
        <div className="cs-section">
          <div className="cs-empty">
            <p>😕 No ratings received yet.</p>
          </div>
        </div>
      )}

      {/* Summary */}
      {!loading && reviews.length > 0 && (
        <>
          <div className="cs-rating-summary">

            {/* Avg Score */}
            <div className="cs-avg-card">
              <div className="cs-avg-score">{avgRating}</div>
              <div className="cs-avg-stars">
                {renderStars(Math.round(parseFloat(avgRating)))}
              </div>
              <div className="cs-avg-label">Average Rating</div>
              <div className="cs-avg-total">{reviews.length} reviews</div>
            </div>

            {/* Star Breakdown */}
            <div className="cs-star-breakdown">
              {starCounts.map(({ star, count, percent }) => (
                <div key={star} className="cs-star-row">
                  <span className="cs-star-label">{star} ★</span>
                  <div className="cs-bar-bg">
                    <div
                      className="cs-bar-fill"
                      style={{
                        width: `${percent}%`,
                        background: star >= 4 ? '#10b981'
                          : star === 3 ? '#f59e0b'
                          : '#ef4444'
                      }}
                    />
                  </div>
                  <span className="cs-star-count">{count}</span>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="cs-quick-stats">
              <div className="cs-stat-box"
                style={{ background: '#d1fae5', color: '#065f46' }}>
                <span>{reviews.filter(r => (r.rating?.score || 0) >= 4).length}</span>
                <label>Positive</label>
              </div>
              <div className="cs-stat-box"
                style={{ background: '#fef3c7', color: '#92400e' }}>
                <span>{reviews.filter(r => r.rating?.score === 3).length}</span>
                <label>Neutral</label>
              </div>
              <div className="cs-stat-box"
                style={{ background: '#fee2e2', color: '#991b1b' }}>
                <span>{reviews.filter(r => (r.rating?.score || 0) <= 2).length}</span>
                <label>Negative</label>
              </div>
            </div>

          </div>

          {/* Filter */}
          <div className="cs-filter-row">
            {['All', '5', '4', '3', '2', '1'].map(f => (
              <button
                key={f}
                className={`cs-filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'All' ? 'All Reviews' : `${f} ★`}
              </button>
            ))}
          </div>

          {/* Reviews List */}
          <div className="cs-section">
            <h3 className="cs-section-title">
              💬 Student Reviews ({filtered.length})
            </h3>

            {filtered.length === 0 ? (
              <div className="cs-empty">
                <p>No reviews for this rating.</p>
              </div>
            ) : (
              <div className="cs-reviews-list">
                {filtered.map(review => (
                  <div key={review._id} className="cs-review-card">
                    <div className="cs-review-top">
                      <div className="cs-review-avatar">
                        {studentName(review).charAt(0).toUpperCase()}
                      </div>
                      <div className="cs-review-meta">
                        <strong>{studentName(review)}</strong>
                        <span>{review.serviceType || '—'}</span>
                      </div>
                      <div className="cs-review-right">
                        <div>{renderStars(review.rating?.score || 0)}</div>
                        <span className="cs-review-date">
                          {formatDate(review.rating?.createdAt || review.requestDate)}
                        </span>
                      </div>
                    </div>
                    {review.rating?.comment && (
                      <p className="cs-review-comment">
                        "{review.rating.comment}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

    </div>
  );
}

export default CleaningRatings;