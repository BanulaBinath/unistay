import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./owner.css";
import RoomListing from "./roomlisting";
import ManageRooms from "./manageroom";
import BookingRequest from "./bookingrequest";
import ReviewMaintenance from "./reviewmaintenance";
import BoardingVendorComplaint from "./BoardingVendorComplaint";
import BoardingVendorComplaintDetails from "./BoardingVendorComplaintDetails";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard",    icon: "🏠" },
  { key: "add",       label: "Add Room",     icon: "➕" },
  { key: "manage",    label: "Manage Rooms", icon: "🛏️" },
  { key: "bookings",  label: "Requests",     icon: "📋" },
  { key: "reviews",   label: "Reviews",      icon: "⭐" },
  { key: "complaints", label: "Complaints",  icon: "📝" },
];

export default function Owner() {
  const [activeTab, setActiveTab]         = useState("dashboard");
  const [rooms, setRooms]                 = useState([]);
  const [profileOpen, setProfileOpen]     = useState(false);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const profileRef                        = useRef(null);
  const navigate                          = useNavigate();
  const { user, logout }                  = useAuth();

  const fetchRooms = async () => {
    try {
      const res  = await fetch("http://localhost:5000/api/rooms");
      const data = await res.json();
      setRooms(data);
    } catch (err) {
      console.error("Failed to fetch rooms:", err);
    }
  };

  useEffect(() => { fetchRooms(); }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const displayName = user?.name || user?.email || "Owner";
  const initials    = displayName.charAt(0).toUpperCase();

  return (
    <div className="owner-wrapper">

      {/* ── Top Header ── */}
      <div className="owner-header">
        {/* Logo */}
        <div className="owner-header-logo">
          <svg className="owner-logo-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3L1 9L5 11.18V17.18L12 21L19 17.18V11.18L21 10.09V17H23V9L12 3ZM18.82 9L12 12.72L5.18 9L12 5.28L18.82 9ZM17 15.99L12 18.72L7 15.99V12.27L12 15L17 12.27V15.99Z"/>
          </svg>
          Unistay
        </div>

        {/* Profile Button (top right) */}
        <div className="owner-profile-wrap" ref={profileRef}>
          <button
            className="owner-profile-btn"
            onClick={() => setProfileOpen((p) => !p)}
          >
            <div className="owner-avatar">{initials}</div>
            <div className="owner-profile-info">
              <span className="owner-profile-name">{displayName}</span>
              <span className="owner-profile-role">Room Owner</span>
            </div>
            <span className="owner-profile-chevron">{profileOpen ? "▲" : "▼"}</span>
          </button>

          {/* Dropdown */}
          {profileOpen && (
            <div className="owner-profile-dropdown">
              <div className="owner-dropdown-header">
                <div className="owner-avatar owner-avatar-lg">{initials}</div>
                <div>
                  <p className="owner-dropdown-name">{displayName}</p>
                  <p className="owner-dropdown-email">{user?.email || ""}</p>
                </div>
              </div>
              <div className="owner-dropdown-divider" />
              <button className="owner-dropdown-item" onClick={() => { setProfileOpen(false); setActiveTab("dashboard"); }}>
                🏠 Dashboard
              </button>
              <button className="owner-dropdown-item" onClick={() => { setProfileOpen(false); setActiveTab("manage"); }}>
                🛏️ Manage Rooms
              </button>
              <div className="owner-dropdown-divider" />
              <button className="owner-dropdown-item danger" onClick={handleLogout}>
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="owner-body">
        {/* ── Sidebar ── */}
        <div className="owner-sidebar">
          <p className="owner-sidebar-label">MENU</p>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`owner-nav-btn ${activeTab === item.key ? "active" : ""}`}
            >
              <span className="owner-nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
          <div style={{ marginTop: "auto" }}>
            <button className="owner-nav-logout" onClick={handleLogout}>
              <span>🚪</span> Logout
            </button>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="owner-content">

          {/* DASHBOARD */}
          {activeTab === "dashboard" && (
            <>
              <div className="owner-page-header">
                <h2>My Rooms</h2>
                <button className="owner-add-btn" onClick={() => setActiveTab("add")}>
                  ➕ Add New Room
                </button>
              </div>

              {rooms.length === 0 ? (
                <div className="owner-empty">
                  <p style={{ fontSize: "48px" }}>🏠</p>
                  <p>No rooms added yet.</p>
                  <button className="owner-add-btn" onClick={() => setActiveTab("add")}>
                    Add Your First Room
                  </button>
                </div>
              ) : (
                <div className="owner-rooms-grid">
                  {rooms.map((room) => (
                    <div key={room._id} className="owner-room-card">
                      {room.image ? (
                        <img
                          src={`http://localhost:5000/uploads/${room.image}`}
                          alt={room.title}
                          className="owner-room-img"
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      ) : (
                        <div className="owner-room-no-img">No Image</div>
                      )}
                      <div className="owner-room-body">
                        <h3 className="owner-room-title">{room.title}</h3>
                        <p className="owner-room-price">
                          LKR {room.price.toLocaleString()}<span>/mo</span>
                        </p>
                        <span className={`owner-room-status ${room.occupied ? "occupied" : "vacant"}`}>
                          {room.occupied ? "🔴 Occupied" : "🟢 Vacant"}
                        </span>
                        {room.facilities && room.facilities.length > 0 && (
                          <div className="owner-room-tags">
                            {room.facilities.map((f) => (
                              <span key={f} className="owner-room-tag">{f}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === "add"      && <RoomListing onSuccess={() => { fetchRooms(); setActiveTab("dashboard"); }} />}
          {activeTab === "manage"   && <ManageRooms rooms={rooms} onUpdate={fetchRooms} />}
          {activeTab === "bookings" && <BookingRequest />}
          {activeTab === "reviews"  && <ReviewMaintenance />}
          {activeTab === "complaints" && (
            selectedComplaintId ? (
              <BoardingVendorComplaintDetails 
                ticketId={selectedComplaintId}
                onBack={() => setSelectedComplaintId(null)} 
              />
            ) : (
              <BoardingVendorComplaint 
                onViewDetails={(ticketId) => setSelectedComplaintId(ticketId)}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}