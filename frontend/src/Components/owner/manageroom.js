import React, { useState } from "react";
import "./manageroom.css";

const FACILITIES_OPTIONS = [
  "WiFi", "AC", "Attached Bathroom", "Hot Water",
  "Parking", "TV", "Washing Machine", "Kitchen Access", "CCTV", "24hr Security",
];

export default function ManageRooms({ rooms, onUpdate }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm]   = useState({});
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  const startEdit = (room) => {
    setEditingId(room._id);
    setEditForm({ title: room.title, price: room.price, occupied: room.occupied, facilities: room.facilities || [] });
    setError("");
  };

  const cancelEdit = () => { setEditingId(null); setEditForm({}); };

  const toggleFacility = (f) =>
    setEditForm((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(f)
        ? prev.facilities.filter((x) => x !== f)
        : [...prev.facilities, f],
    }));

  const saveEdit = async (id) => {
    setLoading(true); setError("");
    try {
      const res = await fetch(`http://localhost:5000/api/rooms/${id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(editForm),
      });
      if (res.ok) { setEditingId(null); onUpdate(); }
      else { const d = await res.json(); setError(d.message || "Failed to update."); }
    } catch { setError("Could not connect to server."); }
    finally { setLoading(false); }
  };

  const deleteRoom = async (id) => {
    if (!window.confirm("Delete this room?")) return;
    try {
      await fetch(`http://localhost:5000/api/rooms/${id}`, { method: "DELETE" });
      onUpdate();
    } catch { alert("Failed to delete."); }
  };

  const toggleOccupied = async (room) => {
    try {
      await fetch(`http://localhost:5000/api/rooms/${room._id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ ...room, occupied: !room.occupied }),
      });
      onUpdate();
    } catch { alert("Failed to update status."); }
  };

  return (
    <div className="manage-container">
      <h2 className="manage-title">🛏️ Manage Rooms</h2>
      {rooms.length === 0 && <p className="manage-empty">No rooms found.</p>}

      <div className="manage-grid">
        {rooms.map((room) => (
          <div key={room._id} className="manage-card">
            {room.image ? (
              <img src={`http://localhost:5000/uploads/${room.image}`} alt={room.title} className="manage-img"
                onError={(e) => { e.target.style.display = "none"; }} />
            ) : (
              <div className="manage-no-img">No Image</div>
            )}

            {editingId !== room._id ? (
              <>
                <h3 className="manage-room-title">{room.title}</h3>
                <p className="manage-price">💰 LKR {room.price}</p>
                <p className={`manage-status ${room.occupied ? "occupied" : "vacant"}`}>
                  {room.occupied ? "🔴 Occupied" : "🟢 Vacant"}
                </p>
                {room.facilities?.length > 0 && (
                  <p className="manage-facilities">🏷️ {room.facilities.join(", ")}</p>
                )}
                <div className="manage-actions">
                  <button className="btn-edit"   onClick={() => startEdit(room)}>✏️ Edit</button>
                  <button className="btn-toggle" onClick={() => toggleOccupied(room)}>
                    {room.occupied ? "Mark Vacant" : "Mark Occupied"}
                  </button>
                  <button className="btn-delete" onClick={() => deleteRoom(room._id)}>🗑️ Delete</button>
                </div>
              </>
            ) : (
              <div className="edit-form">
                {error && <p className="edit-error">⚠️ {error}</p>}
                <input className="edit-input" type="text"   value={editForm.title} placeholder="Room Title"  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
                <input className="edit-input" type="number" value={editForm.price} placeholder="Price (LKR)" onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} />

                <label className="edit-label">Facilities</label>
                <div className="edit-facilities-grid">
                  {FACILITIES_OPTIONS.map((f) => (
                    <label key={f} className="edit-facility-item">
                      <input type="checkbox" checked={editForm.facilities.includes(f)} onChange={() => toggleFacility(f)} />
                      {f}
                    </label>
                  ))}
                </div>

                <label className="edit-label">Status</label>
                <select className="edit-input" value={editForm.occupied}
                  onChange={(e) => setEditForm({ ...editForm, occupied: e.target.value === "true" })}>
                  <option value="false">Vacant</option>
                  <option value="true">Occupied</option>
                </select>

                <div className="edit-actions">
                  <button className="btn-save"   onClick={() => saveEdit(room._id)} disabled={loading}>{loading ? "Saving..." : "💾 Save"}</button>
                  <button className="btn-cancel" onClick={cancelEdit}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}