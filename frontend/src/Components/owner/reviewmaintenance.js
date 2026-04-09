import React, { useState, useEffect } from "react";
import "./reviewmaintenance.css";

const VENDORS = [
  { id: 1, name: "Sunil Repairs",  speciality: "Electrical", rating: 4.5 },
  { id: 2, name: "Nimal Plumbing", speciality: "Plumbing",   rating: 4.2 },
  { id: 3, name: "CoolFix Lanka",  speciality: "AC Service",  rating: 4.8 },
];

export default function ReviewMaintenance() {
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