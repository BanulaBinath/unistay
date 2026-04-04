import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";
import "./roombooking.css";

const IMAGE_BASE_URL = "http://localhost:5000/uploads/";

export default function RoomBooking() {
  const [rooms, setRooms]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [bookedRooms, setBookedRooms] = useState([]);
  const [reviewRoom, setReviewRoom]   = useState(null);
  const [toast, setToast]             = useState(null);
  const [search, setSearch]           = useState("");
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const { isAuthenticated } = useAuth();
  const navigate            = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/rooms")
      .then((r) => { if (!r.ok) throw new Error("Failed to fetch"); return r.json(); })
      .then((d) => { setRooms(d); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleBook = (room) => {
    // Check if logged in first
    if (!isAuthenticated()) {
      setShowLoginPopup(true);
      return;
    }
    if (bookedRooms.includes(room._id)) return;
    setBookedRooms((p) => [...p, room._id]);
    showToast(`✅ ${room.title} booked successfully!`);
  };

  const filteredRooms = rooms.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    (r.facilities && r.facilities.some((f) => f.toLowerCase().includes(search.toLowerCase())))
  );

  return (
    <div className="rb-wrapper">
      <Navbar />

      <div className="rb-page">
        {/* Hero Banner */}
        <div className="rb-hero">
          <div className="rb-hero-content">
            <h1>Find Your <span className="rb-hero-accent">Perfect Room</span></h1>
            <p>Browse available student accommodation at UniStay</p>
            <div className="rb-search-bar">
              <span className="rb-search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search by room name or facility..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rb-search-input"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="rb-content">
          {loading && (
            <div className="rb-center">
              <div className="rb-spinner"></div>
              <p>Loading rooms...</p>
            </div>
          )}

          {error && (
            <div className="rb-error">
              <p>⚠️ {error}</p>
              <button className="rb-retry-btn" onClick={() => window.location.reload()}>Retry</button>
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="rb-results-bar">
                <p className="rb-results-count">
                  <b>{filteredRooms.length}</b> room{filteredRooms.length !== 1 ? "s" : ""} available
                </p>
              </div>

              {filteredRooms.length === 0 ? (
                <div className="rb-empty">
                  <p>😕 No rooms match your search.</p>
                </div>
              ) : (
                <div className="rb-grid">
                  {filteredRooms.map((room) => {
                    const isBooked = bookedRooms.includes(room._id);
                    return (
                      <div key={room._id} className="rb-card">
                        <div className="rb-image-wrap">
                          <img
                            src={`${IMAGE_BASE_URL}${room.image}`}
                            alt={room.title}
                            onError={(e) => { e.target.src = "https://placehold.co/400x220?text=No+Image"; }}
                          />
                          <span className={`rb-badge ${isBooked ? "booked" : room.occupied ? "occupied" : "available"}`}>
                            {isBooked ? "Booked" : room.occupied ? "Occupied" : "Available"}
                          </span>
                        </div>

                        <div className="rb-body">
                          <div className="rb-row">
                            <h3 className="rb-room-title">{room.title}</h3>
                            <div className="rb-price">
                              LKR {room.price.toLocaleString()}
                              <span>/mo</span>
                            </div>
                          </div>
                          {room.location && <p className="rb-location">📍 {room.location}</p>}
                          {room.facilities && room.facilities.length > 0 && (
                            <div className="rb-tags">
                              {room.facilities.map((f) => (
                                <span key={f} className="rb-tag">{f}</span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="rb-actions">
                          <button
                            className={`rb-book-btn ${isBooked || room.occupied ? "disabled" : ""}`}
                            onClick={() => handleBook(room)}
                            disabled={isBooked || room.occupied}
                          >
                            {isBooked ? "✅ Booked" : room.occupied ? "Unavailable" : "Book Now"}
                          </button>
                          <button className="rb-review-btn" onClick={() => setReviewRoom(room)}>
                            ⭐ Reviews
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />

      {/* Reviews Modal */}
      {reviewRoom && <ReviewsModal room={reviewRoom} onClose={() => setReviewRoom(null)} />}

      {/* Login Required Popup */}
      {showLoginPopup && (
        <div className="rb-overlay" onClick={() => setShowLoginPopup(false)}>
          <div className="rb-login-popup" onClick={(e) => e.stopPropagation()}>
            <div className="rb-login-popup-icon">🔒</div>
            <h2>Login Required</h2>
            <p>You need to be logged in to book a room.</p>
            <div className="rb-login-popup-actions">
              <Link to="/login" className="rb-login-popup-btn primary">Sign In</Link>
              <Link to="/register" className="rb-login-popup-btn secondary">Sign Up</Link>
            </div>
            <button className="rb-login-popup-close" onClick={() => setShowLoginPopup(false)}>
              Maybe later
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <div className="rb-toast">{toast}</div>}
    </div>
  );
}

/* ── Reviews Modal ── */
function ReviewsModal({ room, onClose }) {
  const [reviews, setReviews]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [name, setName]               = useState("");
  const [rating, setRating]           = useState(5);
  const [comment, setComment]         = useState("");
  const [submitting, setSubmitting]   = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  const fetchReviews = () => {
    setLoading(true);
    fetch(`http://localhost:5000/api/reviews/room/${room._id}`)
      .then((r) => r.json())
      .then((d) => { setReviews(d); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchReviews(); }, [room._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:5000/api/reviews", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: room._id, roomTitle: room.title,
          student: name.trim(), rating, comment: comment.trim(),
        }),
      });
      if (res.ok) { setName(""); setRating(5); setComment(""); fetchReviews(); }
    } catch { alert("Failed to submit review."); }
    finally { setSubmitting(false); }
  };

  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="rb-overlay" onClick={onClose}>
      <div className="rb-modal" onClick={(e) => e.stopPropagation()}>
        <div className="rb-modal-header">
          <div>
            <h2>{room.title}</h2>
            {avg
              ? <p className="rb-modal-avg">⭐ {avg} / 5 &nbsp;({reviews.length} review{reviews.length !== 1 ? "s" : ""})</p>
              : <p className="rb-modal-avg">No reviews yet</p>
            }
          </div>
          <button className="rb-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="rb-modal-reviews">
          {loading ? (
            <p className="rb-modal-empty">Loading...</p>
          ) : reviews.length === 0 ? (
            <p className="rb-modal-empty">No reviews yet — be the first!</p>
          ) : (
            reviews.map((r) => (
              <div key={r._id} className="rb-review-item">
                <div className="rb-review-top">
                  <b>{r.student}</b>
                  <span className="rb-review-stars">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i} style={{ color: i < r.rating ? "#f59e0b" : "#ddd" }}>★</span>
                    ))}
                  </span>
                </div>
                <p className="rb-review-comment">"{r.comment}"</p>
                {r.reply && <div className="rb-review-reply">💬 <b>Owner:</b> {r.reply}</div>}
                <p className="rb-review-date">{new Date(r.createdAt).toLocaleDateString()}</p>
              </div>
            ))
          )}
        </div>

        <form className="rb-review-form" onSubmit={handleSubmit}>
          <h3>Leave a Review</h3>
          <input
            className="rb-input" type="text" placeholder="Your name"
            value={name} onChange={(e) => setName(e.target.value)} required
          />
          <div className="rb-star-picker">
            {[1,2,3,4,5].map((s) => (
              <span key={s} className="rb-star-pick"
                style={{ color: s <= (hoveredStar || rating) ? "#f59e0b" : "#ddd" }}
                onClick={() => setRating(s)}
                onMouseEnter={() => setHoveredStar(s)}
                onMouseLeave={() => setHoveredStar(0)}
              >★</span>
            ))}
            <span className="rb-star-label">{rating} / 5</span>
          </div>
          <textarea
            className="rb-input rb-textarea" placeholder="Write your review..."
            value={comment} onChange={(e) => setComment(e.target.value)} required
          />
          <button className="rb-submit-btn" type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
}