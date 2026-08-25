import React, { useState, useEffect } from "react";
import "./reviewmaintenance.css";

const VENDORS = [
  { id: 1, name: "Sunil Repairs",  speciality: "Electrical", rating: 4.5 },
  { id: 2, name: "Nimal Plumbing", speciality: "Plumbing",   rating: 4.2 },
  { id: 3, name: "CoolFix Lanka",  speciality: "AC Service",  rating: 4.8 },
];

export default function ReviewMaintenance({ user, profileOpen, setProfileOpen, profileRef, handleLogout, setActiveTab: setOwnerActiveTab, displayName, initials }) {
  const [reviews, setReviews]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [replyDrafts, setReplyDrafts] = useState({});
  const [savingId, setSavingId]       = useState(null);
  const [error, setError]             = useState("");

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res  = await fetch("http://localhost:5000/api/reviews");
      const data = await res.json();
      setReviews(data);
    } catch { setError("Could not load reviews."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReviews(); }, []);

  const submitReply = async (id) => {
    const text = replyDrafts[id] || "";
    if (!text.trim()) return;
    setSavingId(id);
    try {
      const res = await fetch(`http://localhost:5000/api/reviews/${id}/reply`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ reply: text }),
      });
      if (res.ok) { setReplyDrafts((p) => ({ ...p, [id]: "" })); fetchReviews(); }
    } catch { alert("Failed to save reply."); }
    finally { setSavingId(null); }
  };

  const deleteReview = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await fetch(`http://localhost:5000/api/reviews/${id}`, { method: "DELETE" });
      fetchReviews();
    } catch { alert("Failed to delete."); }
  };

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < rating ? "#f59e0b" : "#ddd", fontSize: "18px" }}>★</span>
    ));

  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="rm-container">
      {/* Header */}
      <div className="rm-header">
        <div>
          <h2 className="rm-title">⭐ Reviews</h2>
          {avg && <p className="rm-avg">Average Rating: <b>{avg}</b> / 5 &nbsp;({reviews.length} reviews)</p>}
        </div>
        {/* Profile Button */}
        {displayName && (
          <div className="rm-profile-wrap" ref={profileRef}>
            <button
              className="rm-profile-btn"
              onClick={() => setProfileOpen((p) => !p)}
            >
              <div className="rm-avatar">{initials}</div>
              <div className="rm-profile-info">
                <span className="rm-profile-name">{displayName}</span>
                <span className="rm-profile-role">Room Owner</span>
              </div>
              <span className="rm-profile-chevron">{profileOpen ? "▲" : "▼"}</span>
            </button>

            {/* Dropdown */}
            {profileOpen && (
              <div className="rm-profile-dropdown">
                <div className="rm-dropdown-header">
                  <div className="rm-avatar rm-avatar-lg">{initials}</div>
                  <div>
                    <p className="rm-dropdown-name">{displayName}</p>
                    <p className="rm-dropdown-email">{user?.email || ""}</p>
                  </div>
                </div>
                <div className="rm-dropdown-divider" />
                <button className="rm-dropdown-item" onClick={() => { setProfileOpen(false); setOwnerActiveTab("dashboard"); }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '16px', height: '16px', strokeWidth: 2 }}>
                    <rect x="3" y="3" width="7" height="7" rx="1"/>
                    <rect x="14" y="3" width="7" height="7" rx="1"/>
                    <rect x="14" y="14" width="7" height="7" rx="1"/>
                    <rect x="3" y="14" width="7" height="7" rx="1"/>
                  </svg>
                  Dashboard
                </button>
                <button className="rm-dropdown-item" onClick={() => { setProfileOpen(false); setOwnerActiveTab("manage"); }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '16px', height: '16px', strokeWidth: 2 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Manage Rooms
                </button>
                <div className="rm-dropdown-divider" />
                <button className="rm-dropdown-item danger" onClick={handleLogout}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '16px', height: '16px', strokeWidth: 2 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {error   && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p className="rm-loading">Loading reviews...</p>}

      {!loading && reviews.length === 0 && <p className="rm-empty">No reviews yet.</p>}

      {!loading && (
        <div className="rm-reviews-grid">
          {reviews.map((r) => (
            <div key={r._id} className="rm-review-card">
              <div className="rm-review-header">
                <div>
                  <h3 className="rm-review-room">{r.roomTitle || "Room"}</h3>
                  <span className="rm-review-student">👤 {r.student}</span>
                </div>
                <button className="rm-delete-btn" onClick={() => deleteReview(r._id)}>🗑️</button>
              </div>

              <div className="rm-stars">{renderStars(r.rating)}</div>
              <p className="rm-comment">"{r.comment}"</p>
              <p className="rm-date">{new Date(r.createdAt).toLocaleDateString()}</p>

              {r.reply && (
                <div className="rm-reply-display">💬 <b>Your reply:</b> {r.reply}</div>
              )}

              <div className="rm-reply-box">
                <input
                  className="rm-reply-input"
                  placeholder={r.reply ? "Update reply..." : "Write a reply..."}
                  value={replyDrafts[r._id] || ""}
                  onChange={(e) => setReplyDrafts((p) => ({ ...p, [r._id]: e.target.value }))}
                />
                <button className="rm-reply-btn" onClick={() => submitReply(r._id)} disabled={savingId === r._id}>
                  {savingId === r._id ? "..." : "Send"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vendors */}
      <h2 className="rm-title rm-vendor-title">🔧 Maintenance Vendors</h2>
      <div className="rm-vendor-grid">
        {VENDORS.map((v) => (
          <div key={v.id} className="rm-vendor-card">
            <h3 className="rm-vendor-name">{v.name}</h3>
            <p className="rm-vendor-info">🛠️ {v.speciality}</p>
            <p className="rm-vendor-info">⭐ {v.rating} / 5</p>
            <button className="rm-assign-btn" onClick={() => alert(`✅ ${v.name} assigned!`)}>Assign Vendor</button>
          </div>
        ))}
      </div>
    </div>
  );
}