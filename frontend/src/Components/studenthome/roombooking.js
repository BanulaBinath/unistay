import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./roombooking.css";

const IMAGE_BASE_URL = "http://localhost:5000/uploads/";

export default function RoomBooking() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookedRooms, setBookedRooms] = useState([]);
  const [reviewRoom, setReviewRoom] = useState(null);
  const [bookingRoom, setBookingRoom] = useState(null);
  const [toast, setToast] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    fetch("http://localhost:5000/api/rooms")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch rooms");
        return r.json();
      })
      .then((d) => {
        setRooms(d);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleBookClick = (room) => {
    if (!isAuthenticated()) {
      setShowLoginPopup(true);
      return;
    }
    setBookingRoom(room);
  };

  const handleBookingSuccess = (roomId) => {
    setBookedRooms((prev) => [...prev, roomId]);
    setBookingRoom(null);
    showToast("✅ Booking request sent! The owner will review it shortly.");
  };

  return (
    <div className="rb-wrapper">
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
            <button className="rb-retry-btn" onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="rb-grid">
            {rooms.map((room) => {
              const isBooked = bookedRooms.includes(room._id);
              return (
                <div key={room._id} className="rb-card">
                  <div className="rb-image-wrap">
                    <img
                      src={`${IMAGE_BASE_URL}${room.image}`}
                      alt={room.title}
                      onError={(e) => {
                        e.target.src = "https://placehold.co/400x220?text=No+Image";
                      }}
                    />
                    <span
                      className={`rb-badge ${
                        isBooked ? "booked" : room.occupied ? "occupied" : "available"
                      }`}
                    >
                      {isBooked ? "Requested" : room.occupied ? "Occupied" : "Available"}
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
                          <span key={f} className="rb-tag">
                            {f}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="rb-actions">
                    <button
                      className={`rb-book-btn ${isBooked || room.occupied ? "disabled" : ""}`}
                      onClick={() => handleBookClick(room)}
                      disabled={isBooked || room.occupied}
                    >
                      {isBooked ? "⏳ Requested" : room.occupied ? "Unavailable" : "Book Now"}
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
      </div>

      {/* Booking Form Modal */}
      {bookingRoom && (
        <BookingModal
          room={bookingRoom}
          user={user}
          onClose={() => setBookingRoom(null)}
          onSuccess={handleBookingSuccess}
        />
      )}

      {/* Reviews Modal */}
      {reviewRoom && <ReviewsModal room={reviewRoom} onClose={() => setReviewRoom(null)} />}

      {/* Login Popup */}
      {showLoginPopup && (
        <div className="rb-overlay" onClick={() => setShowLoginPopup(false)}>
          <div className="rb-login-popup" onClick={(e) => e.stopPropagation()}>
            <div className="rb-login-popup-icon">🔒</div>
            <h2>Login Required</h2>
            <p>You need to be logged in to book a room.</p>
            <div className="rb-login-popup-actions">
              <Link to="/login" className="rb-login-popup-btn primary">
                Sign In
              </Link>
              <Link to="/register" className="rb-login-popup-btn secondary">
                Sign Up
              </Link>
            </div>
            <button className="rb-login-popup-close" onClick={() => setShowLoginPopup(false)}>
              Maybe later
            </button>
          </div>
        </div>
      )}

      {toast && <div className="rb-toast">{toast}</div>}
    </div>
  );
}

/* ── Booking Modal ── */
function BookingModal({ room, user, onClose, onSuccess }) {
  const [phone, setPhone] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const studentName = user?.fullName || user?.name || user?.email || "";
  const today = new Date().toISOString().split("T")[0];

  const calcDays = () => {
    if (!checkIn || !checkOut) return null;
    const diff = new Date(checkOut) - new Date(checkIn);
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const days = calcDays();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!phone.trim()) return setError("Please enter your phone number.");
    if (!checkIn) return setError("Please select a check-in date.");
    if (!checkOut) return setError("Please select a check-out date.");
    if (new Date(checkOut) <= new Date(checkIn))
      return setError("Check-out must be after check-in.");

    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: room._id,
          roomTitle: room.title,
          studentName,
          studentEmail: user.email,
          phone: phone.trim(),
          checkIn: new Date(checkIn),
          checkOut: new Date(checkOut),
        }),
      });
      const data = await res.json();
      if (res.ok) onSuccess(room._id);
      else setError(data.message || "Failed to send booking request.");
    } catch {
      setError("Could not connect to server.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rb-overlay" onClick={onClose}>
      <div className="rb-modal rb-booking-modal" onClick={(e) => e.stopPropagation()}>
        <div className="rb-modal-header">
          <div>
            <h2>Book — {room.title}</h2>
            <p className="rb-modal-avg">LKR {room.price.toLocaleString()} / month</p>
          </div>
          <button className="rb-close-btn" onClick={onClose}>✕</button>
        </div>
        <form className="rb-booking-form" onSubmit={handleSubmit}>
          {error && <p className="rb-booking-error">⚠️ {error}</p>}
          <div className="rb-form-group">
            <label className="rb-form-label">Full Name</label>
            <input className="rb-input rb-input-readonly" type="text" value={studentName} readOnly />
            <p className="rb-form-hint">Retrieved from your account</p>
          </div>
          <div className="rb-form-group">
            <label className="rb-form-label">
              Phone Number <span className="rb-required">*</span>
            </label>
            <input
              className="rb-input"
              type="tel"
              placeholder="e.g. 0771234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="rb-form-row">
            <div className="rb-form-group">
              <label className="rb-form-label">
                Check-in Date <span className="rb-required">*</span>
              </label>
              <input
                className="rb-input"
                type="date"
                min={today}
                value={checkIn}
                onChange={(e) => {
                  setCheckIn(e.target.value);
                  setCheckOut("");
                }}
                required
              />
            </div>
            <div className="rb-form-group">
              <label className="rb-form-label">
                Check-out Date <span className="rb-required">*</span>
              </label>
              <input
                className="rb-input"
                type="date"
                min={checkIn || today}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                disabled={!checkIn}
                required
              />
            </div>
          </div>
          {days > 0 && (
            <div className="rb-booking-summary">
              <div className="rb-summary-row">
                <span>📅 Duration</span>
                <b>{days} day{days !== 1 ? "s" : ""}</b>
              </div>
              <div className="rb-summary-row">
                <span>💰 Estimated Cost</span>
                <b>LKR {Math.round((room.price / 30) * days).toLocaleString()}</b>
              </div>
            </div>
          )}
          <button className="rb-submit-btn" type="submit" disabled={submitting}>
            {submitting ? "Sending..." : "Send Booking Request 🚀"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ── Reviews Modal ── */
function ReviewsModal({ room, onClose }) {
  const [reviews, setReviews] = useState([]);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:5000/api/reviews/room/${room._id}`)
      .then((r) => r.json())
      .then((d) => setReviews(d))
      .catch(() => setReviews([]));
  }, [room._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;
    setSubmitting(true);
    try {
      await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: room._id,
          roomTitle: room.title,
          student: name.trim(),
          rating,
          comment: comment.trim(),
        }),
      });
      setName("");
      setRating(5);
      setComment("");
      const res = await fetch(`http://localhost:5000/api/reviews/room/${room._id}`);
      const data = await res.json();
      setReviews(data);
    } catch {
      alert("Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <div className="rb-overlay" onClick={onClose}>
      <div className="rb-modal" onClick={(e) => e.stopPropagation()}>
        <div className="rb-modal-header">
          <div>
            <h2>{room.title}</h2>
            {avg ? (
              <p className="rb-modal-avg">⭐ {avg} / 5 ({reviews.length} review{reviews.length !== 1 ? "s" : ""})</p>
            ) : (
              <p className="rb-modal-avg">No reviews yet</p>
            )}
          </div>
          <button className="rb-close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="rb-modal-reviews">
          {reviews.length === 0 ? (
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
            className="rb-input"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <div className="rb-star-picker">
            {[1,2,3,4,5].map((s) => (
              <span
                key={s}
                className="rb-star-pick"
                style={{ color: s <= (hoveredStar || rating) ? "#f59e0b" : "#ddd" }}
                onClick={() => setRating(s)}
                onMouseEnter={() => setHoveredStar(s)}
                onMouseLeave={() => setHoveredStar(0)}
              >★</span>
            ))}
            <span className="rb-star-label">{rating} / 5</span>
          </div>
          <textarea
            className="rb-input rb-textarea"
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          <button className="rb-submit-btn" type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
}