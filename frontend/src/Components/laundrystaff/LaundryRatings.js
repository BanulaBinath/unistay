import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './laundrystaff.css';
import api from '../../services/api';

function LaundryRatings() {
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [filter, setFilter]   = useState('All');

  // ── Load ratings on mount ──
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const res = await api.get('/laundry/vendor/ratings');
        setReviews(res.data.data || []);
      } catch (err) {
        console.error(err);
        setError('❌ Failed to load ratings');
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, []);

  // ── Helpers ──
  const filtered = filter === 'All'
    ? reviews
    : reviews.filter(r => r.rating?.score === parseInt(filter));

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + (r.rating?.score || 0), 0) / reviews.length).toFixed(1)
    : '0.0';

  const starCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count:   reviews.filter(r => r.rating?.score === star).length,
    percent: reviews.length > 0
      ? Math.round((reviews.filter(r => r.rating?.score === star).length / reviews.length) * 100)
      : 0
  }));

  const renderStars = (rating) =>
    [1, 2, 3, 4, 5].map(i => (
      <span key={i} style={{ color: i <= rating ? '#f59e0b' : '#e5e7eb', fontSize: '16px' }}>★</span>
    ));

  const studentName = (review) =>
    review.student?.fullName || review.student?.name || 'Student';

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toISOString().split('T')[0] : '—';

  return (
    <div className="ls-page">

      {/* Header */}
      <div className="ls-header">
        <div>
          <h1>⭐ Ratings & Reviews</h1>
          <p>See what students are saying about your service</p>
        </div>
        <button className="ls-back-btn"
          onClick={() => navigate('/laundry-vendor/dashboard')}>
          ← Back to Dashboard
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="ls-loading"><p>⏳ Loading ratings...</p></div>
      )}

      {/* Error */}
      {error && (
        <div className="ls-alert ls-alert-error">
          {error}
          <button onClick={() => setError('')}>✕</button>
        </div>
      )}

      {/* No ratings yet */}
      {!loading && !error && reviews.length === 0 && (
        <div className="ls-section">
          <div className="ls-empty">
            <p>😕 No ratings yet. Complete some jobs to get reviews!</p>
          </div>
        </div>
      )}

      {/* Main content */}
      {!loading && !error && reviews.length > 0 && (
        <>
          {/* Summary Cards */}
          <div className="ls-rating-summary">

            {/* Avg Score */}
            <div className="ls-avg-card">
              <div className="ls-avg-score">{avgRating}</div>
              <div className="ls-avg-stars">{renderStars(Math.round(avgRating))}</div>
              <div className="ls-avg-label">Average Rating</div>
              <div className="ls-avg-total">{reviews.length} reviews</div>
            </div>

            {/* Star Breakdown */}
            <div className="ls-star-breakdown">
              {starCounts.map(({ star, count, percent }) => (
                <div key={star} className="ls-star-row">
                  <span className="ls-star-label">{star} ★</span>
                  <div className="ls-bar-bg">
                    <div
                      className="ls-bar-fill"
                      style={{
                        width: `${percent}%`,
                        background: star >= 4 ? '#10b981' : star === 3 ? '#f59e0b' : '#ef4444'
                      }}
                    />
                  </div>
                  <span className="ls-star-count">{count}</span>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="ls-quick-stats">
              <div className="ls-stat-box" style={{ background: '#d1fae5', color: '#065f46' }}>
                <span>{reviews.filter(r => (r.rating?.score || 0) >= 4).length}</span>
                <label>Positive</label>
              </div>
              <div className="ls-stat-box" style={{ background: '#fef3c7', color: '#92400e' }}>
                <span>{reviews.filter(r => r.rating?.score === 3).length}</span>
                <label>Neutral</label>
              </div>
              <div className="ls-stat-box" style={{ background: '#fee2e2', color: '#991b1b' }}>
                <span>{reviews.filter(r => (r.rating?.score || 0) <= 2).length}</span>
                <label>Negative</label>
              </div>
            </div>

          </div>

          {/* Filter */}
          <div className="ls-filter-row">
            {['All', '5', '4', '3', '2', '1'].map(f => (
              <button
                key={f}
                className={`ls-filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'All' ? 'All Reviews' : `${f} ★`}
              </button>
            ))}
          </div>

          {/* Reviews List */}
          <div className="ls-section">
            <h3 className="ls-section-title">
              💬 Student Reviews ({filtered.length})
            </h3>

            {filtered.length === 0 ? (
              <div className="ls-empty">No reviews for this rating.</div>
            ) : (
              <div className="ls-reviews-list">
                {filtered.map(review => (
                  <div key={review._id} className="ls-review-card">
                    <div className="ls-review-top">
                      <div className="ls-review-avatar">
                        {studentName(review).charAt(0).toUpperCase()}
                      </div>
                      <div className="ls-review-meta">
                        <strong>{studentName(review)}</strong>
                        <span>{review.service}</span>
                      </div>
                      <div className="ls-review-right">
                        <div className="ls-review-stars">
                          {renderStars(review.rating?.score || 0)}
                        </div>
                        <span className="ls-review-date">
                          {formatDate(review.updatedAt)}
                        </span>
                      </div>
                    </div>
                    <p className="ls-review-comment">
                      "{review.rating?.comment || 'No comment provided.'}"
                    </p>
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

export default LaundryRatings;