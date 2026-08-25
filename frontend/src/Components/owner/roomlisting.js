import React, { useState } from "react";
import "./owner.css";

const FACILITIES_OPTIONS = [
  "WiFi", "AC", "Attached Bathroom", "Hot Water",
  "Parking", "TV", "Washing Machine", "Kitchen Access", "CCTV", "24hr Security",
];

export default function RoomListing({ onSuccess }) {
  const [title, setTitle]                           = useState("");
  const [price, setPrice]                           = useState("");
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [image, setImage]                           = useState(null);
  const [preview, setPreview]                       = useState(null);
  const [loading, setLoading]                       = useState(false);
  const [error, setError]                           = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const toggleFacility = (f) =>
    setSelectedFacilities((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !price) { setError("Title and price are required."); return; }
    if (!image) { setError("Please upload a room image."); return; }

    const formData = new FormData();
    formData.append("title",      title.trim());
    formData.append("price",      price);
    formData.append("facilities", selectedFacilities.join(","));
    formData.append("image",      image);

    setLoading(true);
    try {
      const res  = await fetch("http://localhost:5000/api/rooms", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        alert("Room added successfully!");
        onSuccess && onSuccess();
      } else {
        setError(data.message || "Failed to add room.");
      }
    } catch (err) {
      setError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <h2>Add Room</h2>
      {error && (
        <p style={{ color: "#ef4444", marginBottom: "12px", fontSize: "14px", fontWeight: "500" }}>
          ⚠️ {error}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="text" placeholder="Room Title" required
          value={title} onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="number" placeholder="Price (LKR)" required
          value={price} onChange={(e) => setPrice(e.target.value)}
        />

        <div>
          <span className="facilities-label">Facilities</span>
          <div className="facilities-grid">
            {FACILITIES_OPTIONS.map((f) => (
              <label key={f} className="facility-item">
                <input
                  type="checkbox"
                  checked={selectedFacilities.includes(f)}
                  onChange={() => toggleFacility(f)}
                />
                {f}
              </label>
            ))}
          </div>
        </div>

        {/* File input with visual indicator */}
        <div>
          <span className="facilities-label">Room Image <span style={{ color: "#ef4444" }}>*</span></span>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {!image && (
            <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "6px" }}>
              📷 A room image is required.
            </p>
          )}
        </div>

        {preview && <img src={preview} alt="preview" className="image-preview" />}

        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? "Adding..." : "Add Room"}
        </button>
      </form>
    </div>
  );
}