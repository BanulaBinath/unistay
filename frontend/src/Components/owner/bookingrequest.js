import React, { useState, useEffect } from "react";
import "./bookingrequest.css";

const STATUS_CONFIG = {
  pending:  { label: "Pending",  bg: "#fff7ed", color: "#c2410c", dot: "#fb923c" },
  accepted: { label: "Accepted", bg: "#f0fdf4", color: "#15803d", dot: "#22c55e" },
  rejected: { label: "Rejected", bg: "#fef2f2", color: "#b91c1c", dot: "#f87171" },
};

export default function BookingRequest({ user, profileOpen, setProfileOpen, profileRef, handleLogout, setActiveTab: setOwnerActiveTab, displayName, initials }) {
  const [activeTab, setActiveTab] = useState("booking");
  const [filter, setFilter]       = useState("all");
  const [requests, setRequests]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res  = await fetch("http://localhost:5000/api/bookings");
      const data = await res.json();
      const shaped = data.map((b) => ({
        id:       b._id,
        room:     b.roomTitle || "Room",
        student:  b.studentName,
        email:    b.studentEmail,
        phone:    b.phone,
        checkIn:  b.checkIn  ? new Date(b.checkIn).toLocaleDateString()  : null,
        checkOut: b.checkOut ? new Date(b.checkOut).toLocaleDateString() : null,
        days:     b.checkIn && b.checkOut
          ? Math.ceil((new Date(b.checkOut) - new Date(b.checkIn)) / (1000 * 60 * 60 * 24))
          : b.days,
        type:     "booking",
        status:   b.status,
        time:     new Date(b.createdAt).toLocaleDateString(),
      }));
      setRequests(shaped);
    } catch {
      setError("Could not load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ status }),
      });
      if (res.ok) setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
    } catch { alert("Failed to update status."); }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("Delete this booking?")) return;
    try {
      await fetch(`http://localhost:5000/api/bookings/${id}`, { method: "DELETE" });
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch { alert("Failed to delete."); }
  };

  const visible = requests
    .filter((r) => r.type === activeTab)
    .filter((r) => filter === "all" || r.status === filter);

  const pendingCount  = requests.filter((r) => r.status === "pending").length;
  const acceptedCount = requests.filter((r) => r.status === "accepted").length;
  const rejectedCount = requests.filter((r) => r.status === "rejected").length;
  const totalCount    = requests.length;

  return (
    <div className="br-container">

      {/* Header with title, stats, and profile */}
      <div className="br-header">
        <div>
          <h2 className="br-title">Requests Center</h2>
          <p className="br-subtitle">Manage booking and maintenance requests</p>
        </div>
        <div className="br-stats">
          <div className="br-stat">
            <span className="br-stat-num pending-num">{pendingCount}</span>
            <span className="br-stat-label">Pending</span>
          </div>
          <div className="br-stat">
            <span className="br-stat-num accepted-num">{acceptedCount}</span>
            <span className="br-stat-label">Accepted</span>
          </div>
        </div>
        {/* Profile Button */}
        {displayName && (
          <div className="br-profile-wrap" ref={profileRef}>
            <button
              className="br-profile-btn"
              onClick={() => setProfileOpen((p) => !p)}
            >
              <div className="br-avatar">{initials}</div>
              <div className="br-profile-info">
                <span className="br-profile-name">{displayName}</span>
                <span className="br-profile-role">Room Owner</span>
              </div>
              <span className="br-profile-chevron">{profileOpen ? "▲" : "▼"}</span>
            </button>

            {/* Dropdown */}
            {profileOpen && (
              <div className="br-profile-dropdown">
                <div className="br-dropdown-header">
                  <div className="br-avatar br-avatar-lg">{initials}</div>
                  <div>
                    <p className="br-dropdown-name">{displayName}</p>
                    <p className="br-dropdown-email">{user?.email || ""}</p>
                  </div>
                </div>
                <div className="br-dropdown-divider" />
                <button className="br-dropdown-item" onClick={() => { setProfileOpen(false); setOwnerActiveTab("dashboard"); }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '16px', height: '16px', strokeWidth: 2 }}>
                    <rect x="3" y="3" width="7" height="7" rx="1"/>
                    <rect x="14" y="3" width="7" height="7" rx="1"/>
                    <rect x="14" y="14" width="7" height="7" rx="1"/>
                    <rect x="3" y="14" width="7" height="7" rx="1"/>
                  </svg>
                  Dashboard
                </button>
                <button className="br-dropdown-item" onClick={() => { setProfileOpen(false); setOwnerActiveTab("manage"); }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '16px', height: '16px', strokeWidth: 2 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Manage Rooms
                </button>
                <div className="br-dropdown-divider" />
                <button className="br-dropdown-item danger" onClick={handleLogout}>
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

      {/* Tabs */}
      <div className="br-tabs">
        <button className={`br-tab ${activeTab === "booking" ? "active" : ""}`} onClick={() => setActiveTab("booking")}>
          🏠 Booking Requests
          {pendingCount > 0 && activeTab !== "booking" && (
            <span className="br-badge">{pendingCount}</span>
          )}
        </button>
        <button className={`br-tab ${activeTab === "maintenance" ? "active" : ""}`} onClick={() => setActiveTab("maintenance")}>
          🔧 Maintenance
        </button>
      </div>

      {/* Filter */}
      <div className="br-filter-bar">
        {["all", "pending", "accepted", "rejected"].map((f) => (
          <button
            key={f}
            className={`br-filter-btn ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {error   && <p className="br-error">{error}</p>}
      {loading && (
        <div className="br-loading">
          <div className="br-spinner" />
          <p>Loading requests...</p>
        </div>
      )}

      {!loading && activeTab === "booking" && (
        <>
          {visible.length === 0 ? (
            <div className="br-empty-state">
              <p className="br-empty-icon">📭</p>
              <p className="br-empty-text">No booking requests found.</p>
            </div>
          ) : (
            <div className="br-cards">
              {visible.map((req) => {
                const cfg = STATUS_CONFIG[req.status] || STATUS_CONFIG.pending;
                return (
                  <div key={req.id} className="br-card">

                    {/* Card top strip */}
                    <div className="br-card-strip" style={{ background: cfg.bg }}>
                      <div className="br-card-room">
                        <span className="br-room-icon">🏠</span>
                        <span className="br-room-name">{req.room}</span>
                      </div>
                      <div className="br-status-pill" style={{ background: cfg.bg, color: cfg.color }}>
                        <span className="br-status-dot" style={{ background: cfg.dot }} />
                        {cfg.label}
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="br-card-body">
                      <div className="br-card-grid">
                        <div className="br-info-block">
                          <span className="br-info-label">Student</span>
                          <span className="br-info-value">👤 {req.student}</span>
                        </div>
                        <div className="br-info-block">
                          <span className="br-info-label">Phone</span>
                          <span className="br-info-value">📞 {req.phone || "—"}</span>
                        </div>
                        <div className="br-info-block">
                          <span className="br-info-label">Email</span>
                          <span className="br-info-value">✉️ {req.email || "—"}</span>
                        </div>
                        <div className="br-info-block">
                          <span className="br-info-label">Duration</span>
                          <span className="br-info-value">📅 {req.days ? `${req.days} days` : "—"}</span>
                        </div>
                        {req.checkIn && (
                          <div className="br-info-block">
                            <span className="br-info-label">Check-in</span>
                            <span className="br-info-value">🟢 {req.checkIn}</span>
                          </div>
                        )}
                        {req.checkOut && (
                          <div className="br-info-block">
                            <span className="br-info-label">Check-out</span>
                            <span className="br-info-value">🔴 {req.checkOut}</span>
                          </div>
                        )}
                      </div>

                      <div className="br-card-footer">
                        <span className="br-card-time">🕒 Requested on {req.time}</span>
                        <div className="br-card-actions">
                          {req.status === "pending" && (
                            <>
                              <button className="br-action-btn accept" onClick={() => updateStatus(req.id, "accepted")}>
                                ✅ Accept
                              </button>
                              <button className="br-action-btn reject" onClick={() => updateStatus(req.id, "rejected")}>
                                ❌ Reject
                              </button>
                            </>
                          )}
                          {req.status !== "pending" && (
                            <button className="br-action-btn delete" onClick={() => deleteBooking(req.id)}>
                              🗑️ Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {!loading && activeTab === "maintenance" && (
        <div className="br-empty-state">
          <p className="br-empty-icon">🔧</p>
          <p className="br-empty-text">No maintenance requests yet.</p>
        </div>
      )}
    </div>
  );
}