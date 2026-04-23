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
  { 
    key: "dashboard", 
    label: "Dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="2"/>
        <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="2"/>
        <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="2"/>
        <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="2"/>
      </svg>
    )
  },
  { 
    key: "add", 
    label: "Add Room",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
      </svg>
    )
  },
  { 
    key: "manage", 
    label: "Manage Rooms",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    )
  },
  { 
    key: "bookings", 
    label: "Requests",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    )
  },
  { 
    key: "reviews", 
    label: "Reviews",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    )
  },
  { 
    key: "complaints", 
    label: "Complaints",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    )
  },
];

export default function Owner() {
  const [activeTab, setActiveTab]         = useState("dashboard");
  const [rooms, setRooms]                 = useState([]);
  const [profileOpen, setProfileOpen]     = useState(false);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [sidebarOpen, setSidebarOpen]     = useState(true);
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

  const displayName = user?.fullName || user?.name || user?.email || "Owner";
  const initials    = displayName.charAt(0).toUpperCase();

  return (
    <div className="owner-wrapper">
        {/* ── Sidebar ── */}
        <aside className={`owner-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <div className="owner-sidebar-header">
            <div className="owner-sidebar-logo">
              <svg className="owner-sidebar-logo-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3L1 9L5 11.18V17.18L12 21L19 17.18V11.18L21 10.09V17H23V9L12 3ZM18.82 9L12 12.72L5.18 9L12 5.28L18.82 9ZM17 15.99L12 18.72L7 15.99V12.27L12 15L17 12.27V15.99Z"/>
              </svg>
              {sidebarOpen && <span className="owner-sidebar-logo-text">Unistay</span>}
            </div>
            <button className="owner-sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          <nav className="owner-sidebar-nav">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`owner-nav-item ${activeTab === item.key ? "active" : ""}`}
              >
                <span className="owner-nav-icon">{item.icon}</span>
                {sidebarOpen && <span className="owner-nav-label">{item.label}</span>}
              </button>
            ))}
          </nav>

          <div className="owner-sidebar-footer">
            <button className="owner-sidebar-logout" onClick={handleLogout}>
              <svg className="owner-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {sidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </aside>

        {/* ── Content ── */}
        <main className="owner-content">
          {/* Top Header with Profile - Show for all tabs except bookings, reviews, and complaints */}
          <header className="owner-top-header" style={{ display: (activeTab === "bookings" || activeTab === "reviews" || activeTab === "complaints") ? "none" : "flex" }}>
            <div className="header-left">
              {activeTab !== "bookings" && (
                <>
                  <h1 className="page-title">
                    {activeTab === "dashboard" && "My Rooms"}
                    {activeTab === "add" && "Add New Room"}
                    {activeTab === "manage" && "Manage Rooms"}
                    {activeTab === "reviews" && "Reviews"}
                    {activeTab === "complaints" && "Complaints"}
                  </h1>
                  <p className="page-subtitle">Welcome back, {displayName}</p>
                </>
              )}
            </div>
            <div className="header-right">
              {activeTab === "dashboard" && (
                <button className="owner-add-btn" onClick={() => setActiveTab("add")}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '16px', height: '16px', strokeWidth: 2 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Add New Room
                </button>
              )}
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
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '16px', height: '16px', strokeWidth: 2 }}>
                        <rect x="3" y="3" width="7" height="7" rx="1"/>
                        <rect x="14" y="3" width="7" height="7" rx="1"/>
                        <rect x="14" y="14" width="7" height="7" rx="1"/>
                        <rect x="3" y="14" width="7" height="7" rx="1"/>
                      </svg>
                      Dashboard
                    </button>
                    <button className="owner-dropdown-item" onClick={() => { setProfileOpen(false); setActiveTab("manage"); }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '16px', height: '16px', strokeWidth: 2 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      Manage Rooms
                    </button>
                    <div className="owner-dropdown-divider" />
                    <button className="owner-dropdown-item danger" onClick={handleLogout}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '16px', height: '16px', strokeWidth: 2 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* DASHBOARD */}
          {activeTab === "dashboard" && (
            <>
              {rooms.length === 0 ? (
                <div className="owner-empty">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '64px', height: '64px', strokeWidth: 1.5, color: '#9ca3af' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <p>No rooms added yet.</p>
                  <button className="owner-add-btn" onClick={() => setActiveTab("add")}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '16px', height: '16px', strokeWidth: 2 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
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
                          {room.occupied ? "● Occupied" : "● Vacant"}
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
          {activeTab === "bookings" && <BookingRequest user={user} profileOpen={profileOpen} setProfileOpen={setProfileOpen} profileRef={profileRef} handleLogout={handleLogout} setActiveTab={setActiveTab} displayName={displayName} initials={initials} />}
          {activeTab === "reviews"  && <ReviewMaintenance user={user} profileOpen={profileOpen} setProfileOpen={setProfileOpen} profileRef={profileRef} handleLogout={handleLogout} setActiveTab={setActiveTab} displayName={displayName} initials={initials} />}
          {activeTab === "complaints" && (
            selectedComplaintId ? (
              <BoardingVendorComplaintDetails 
                ticketId={selectedComplaintId}
                onBack={() => setSelectedComplaintId(null)} 
                user={user}
                profileOpen={profileOpen}
                setProfileOpen={setProfileOpen}
                profileRef={profileRef}
                handleLogout={handleLogout}
                setActiveTab={setActiveTab}
                displayName={displayName}
                initials={initials}
              />
            ) : (
              <BoardingVendorComplaint 
                onViewDetails={(ticketId) => setSelectedComplaintId(ticketId)}
                user={user}
                profileOpen={profileOpen}
                setProfileOpen={setProfileOpen}
                profileRef={profileRef}
                handleLogout={handleLogout}
                setActiveTab={setActiveTab}
                displayName={displayName}
                initials={initials}
              />
            )
          )}
        </main>
    </div>
  );
}
