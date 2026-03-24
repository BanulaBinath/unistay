import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./roombooking.css";

export default function RoomsDashboard() {
  const initialRooms = Array.from({ length: 12 }).map((_, i) => ({
    id: i + 1,
    title: `Student Room ${i + 1}`,
    price: Math.floor(Math.random() * 20000) + 5000,
    rating: (Math.random() * 5).toFixed(1),
    facilities: ["WiFi", "AC", "Attached Bathroom", "Parking", "Meals"].filter(() => Math.random() > 0.5),
    reviews: Math.floor(Math.random() * 120),
  }));

  const [rooms] = useState(initialRooms);
  const [search, setSearch] = useState("");
  const [facility, setFacility] = useState("all");
  const [sort, setSort] = useState("rating");
  const [minRating, setMinRating] = useState("");
  const [bookedRooms, setBookedRooms] = useState([]);

  const navigate = useNavigate();

  const handleBook = (roomId) => {
    if (bookedRooms.includes(roomId)) {
      alert("This room is already booked!");
      return;
    }
    setBookedRooms([...bookedRooms, roomId]);
    navigate(`/booking/${roomId}`);
  };

  const handleReview = (roomId) => {
    navigate(`/reviews/${roomId}`);
  };

  const filtered = useMemo(() => {
    let data = [...rooms];
    if (search) data = data.filter((r) => r.title.toLowerCase().includes(search.toLowerCase()));
    if (facility !== "all") data = data.filter((r) => r.facilities.includes(facility));
    if (minRating && !isNaN(minRating)) data = data.filter((r) => Number(r.rating) >= Number(minRating));
    if (sort === "price") data.sort((a, b) => a.price - b.price);
    if (sort === "rating") data.sort((a, b) => b.rating - a.rating);
    return data;
  }, [rooms, search, facility, sort, minRating]);

  return (
    <div className="container">
      <h1 className="title">🏠 Student Rooms Dashboard</h1>

      <div className="filters">
        <input className="input" placeholder="Search room..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="input" onChange={(e) => setFacility(e.target.value)}>
          <option value="all">All Facilities</option>
          <option value="WiFi">WiFi</option>
          <option value="AC">AC</option>
          <option value="Parking">Parking</option>
          <option value="Meals">Meals</option>
        </select>
        <select className="input" onChange={(e) => setSort(e.target.value)}>
          <option value="rating">Top Rated</option>
          <option value="price">Lowest Price</option>
        </select>
        <input
          className="input"
          placeholder="Min Rating (0-5)"
          value={minRating}
          onChange={(e) => {
            const v = e.target.value;
            if (v === "" || (Number(v) >= 0 && Number(v) <= 5)) setMinRating(v);
          }}
        />
      </div>

      <div className="grid">
        {filtered.map((room) => (
          <div key={room.id} className="card">
            <h2>{room.title}</h2>
            <p className="price">LKR {room.price}</p>
            <div className="rating">
              ⭐ {room.rating} <span className="reviews">({room.reviews} reviews)</span>
            </div>
            <div className="facilities">
              {room.facilities.map((f) => (
                <span key={f} className="badge">{f}</span>
              ))}
            </div>
            <button className="book-btn" onClick={() => handleBook(room.id)}>Book Now</button>
            <button className="review-btn" onClick={() => handleReview(room.id)}>Reviews</button>
          </div>
        ))}
      </div>
    </div>
  );
}