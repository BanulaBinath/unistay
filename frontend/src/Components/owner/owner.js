import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './owner.css';

function OwnerDashboard() {

  const navigate = useNavigate();

  const defaultRooms = [
    { title: "Room A", price: 5000, occupied: true, bookings: 5, reviews: [4,5], facilities: ["WiFi", "Desk"] },
    { title: "Room B", price: 4000, occupied: false, bookings: 2, reviews: [3], facilities: ["AC"] },
    { title: "Room C", price: 4500, occupied: true, bookings: 3, reviews: [], facilities: [] }
  ];

  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);

  /* LOAD DATA */
  useEffect(() => {

    const storedRooms = JSON.parse(localStorage.getItem("rooms"));

    if (storedRooms && storedRooms.length) {
      setRooms(storedRooms);
    } else {
      setRooms(defaultRooms);
      localStorage.setItem("rooms", JSON.stringify(defaultRooms));
    }

    const storedRequests =
      JSON.parse(localStorage.getItem("requests")) || [];

    const pending =
      storedRequests.filter(r => r.status === "pending").length;

    setPendingRequests(pending);

  }, []);

  const filteredRooms = rooms.filter(room => {

    const avgRating = room.reviews?.length
      ? room.reviews.reduce((a,b)=>a+b,0)/room.reviews.length
      : 0;

    return (
      room.title.toLowerCase().includes(search.toLowerCase()) &&
      avgRating >= minRating
    );
  });

  return (
    <div className="owner-dashboard">

      {/* DASHBOARD CARDS */}
      <div className="dashboard-cards">

        <div
          className="dashboard-card"
          onClick={() => navigate("/roomlisting")}
        >
          Add Room
        </div>

        <div
          className="dashboard-card"
          onClick={() => navigate("/manage-rooms")}
        >
          Manage Rooms
        </div>

        <div
          className="dashboard-card"
          onClick={() => navigate("/booking-requests")}
        >
          Bookings
          {pendingRequests > 0 && (
            <span className="badge">{pendingRequests}</span>
          )}
        </div>

        <div
          className="dashboard-card"
          onClick={() => navigate("/reviews-maintenance")}
        >
          Reviews & Maintenance
        </div>

      </div>

      {/* AVAILABLE LISTINGS */}
      <section className="available-listings">

        <h2>Available Listings</h2>

        <div className="filters">

          <input
            type="text"
            placeholder="Search by room title"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <input
            type="number"
            placeholder="Minimum Rating"
            value={minRating}
            onChange={e => setMinRating(Number(e.target.value))}
            min="0"
            max="5"
          />

        </div>

        <div className="room-list">

          {filteredRooms.length === 0 && (
            <p className="no-data">No rooms found</p>
          )}

          {filteredRooms.map((room, idx) => {

            const avgRating = room.reviews?.length
              ? (room.reviews.reduce((a,b)=>a+b,0)/room.reviews.length).toFixed(1)
              : "0";

            return (
              <div key={idx} className="room-card">

                <h3>{room.title}</h3>

                <p className="price">LKR {room.price}</p>

                <p className="facility">
                  {room.facilities?.length
                    ? room.facilities.join(", ")
                    : "No facilities"}
                </p>

                <div className="room-meta">

                  <span>Rating: {avgRating}</span>
                  <span>Bookings: {room.bookings || 0}</span>
                  <span className={room.occupied ? "occupied" : "vacant"}>
                    {room.occupied ? "Occupied" : "Vacant"}
                  </span>

                </div>

              </div>
            );

          })}

        </div>

      </section>

    </div>
  );
}

export default OwnerDashboard;