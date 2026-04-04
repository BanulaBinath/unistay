import React, { useState, useEffect } from "react";
import "./bookingrequest.css";

export default function BookingRequest() {
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
      // Shape bookings to match our card format
      const shaped = data.map((b) => ({
        id:      b._id,
        room:    b.roomTitle || "Room",
        student: b.studentName,
        email:   b.studentEmail,
        type:    "booking",
        status:  b.status,
        time:    new Date(b.createdAt).toLocaleDateString(),
      }));
      setRequests(shaped);
    } catch (err) {
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
      if (res.ok) {
        setRequests((prev) =>
          prev.map((r) => r.id === id ? { ...r, status } : r)
        );
      }
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("Delete this booking request?")) return;
    try {
      await fetch(`http://localhost:5000/api/bookings/${id}`, { method: "DELETE" });
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch {
      alert("Failed to delete.");
    }
  };

  const visible = requests
    .filter((r) => r.type === activeTab)
    .filter((r) => filter === "all" || r.status === filter);

  return (
    <div className="br-container">
      <h2 className="br-title">📋 Requests Center</h2>

      <div className="br-tabs">
        <button
          className={`br-tab ${activeTab === "booking" ? "active" : ""}`}
          onClick={() => setActiveTab("booking")}
        >
          🏠 Booking Requests
        </button>
        <button
          className={`br-tab ${activeTab === "maintenance" ? "active" : ""}`}
          onClick={() => setActiveTab("maintenance")}
        >
          🔧 Maintenance
        </button>
      </div>

      <div className="br-filter">
        <select className="br-select" onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {error   && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p className="br-empty">Loading...</p>}

      {!loading && visible.length === 0 && (
        <p className="br-empty">No requests found.</p>
      )}

      {!loading && visible.map((req) => (
        <div key={req.id} className="br-card">
          <div className="br-left">
            <h3 className="br-room">{req.room}</h3>
            <p className="br-info">
              Booking request from <b>{req.student}</b>
              {req.email && <span style={{ color: "#9ca3af" }}> — {req.email}</span>}
            </p>
            <span className={`br-status ${req.status}`}>{req.status}</span>
            <p className="br-time">🕒 {req.time}</p>
          </div>

          <div className="br-actions">
            {req.status === "pending" && (
              <>
                <button className="br-btn accept" onClick={() => updateStatus(req.id, "accepted")}>
                  ✅ Accept
                </button>
                <button className="br-btn reject" onClick={() => updateStatus(req.id, "rejected")}>
                  ❌ Reject
                </button>
              </>
            )}
            {req.status !== "pending" && (
              <button className="br-btn delete" onClick={() => deleteBooking(req.id)}>
                🗑️ Delete
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Maintenance tab - still dummy for now */}
      {activeTab === "maintenance" && !loading && (
        <p className="br-empty">No maintenance requests yet.</p>
      )}
    </div>
  );
}