import React, { useState } from "react";
import "./manageroom.css";

function ManageRooms() {

  const [rooms, setRooms] = useState([
    { id:1, title:"Room A", price:5000, status:"Occupied", rating:4.5, bookings:5 },
    { id:2, title:"Room B", price:4200, status:"Vacant", rating:3.8, bookings:2 },
    { id:3, title:"Room C", price:4800, status:"Vacant", rating:0, bookings:0 }
  ]);

  const deleteRoom = (id) => {
    setRooms(rooms.filter(room => room.id !== id));
  };

  const editRoom = (id) => {
    alert("Edit feature coming soon for Room ID: " + id);
  };

  return (
    <div className="manage-container">

      <h1>Manage Rooms</h1>

      <div className="room-table">

        <div className="table-head">
          <span>Title</span>
          <span>Price</span>
          <span>Status</span>
          <span>Rating</span>
          <span>Bookings</span>
          <span>Action</span>
        </div>

        {rooms.map(room => (
          <div key={room.id} className="table-row">

            <span>{room.title}</span>
            <span>LKR {room.price}</span>
            <span className={room.status === "Occupied" ? "occ" : "vac"}>
              {room.status}
            </span>
            <span>{room.rating} ⭐</span>
            <span>{room.bookings}</span>

            <span className="actions">
              <button className="edit" onClick={()=>editRoom(room.id)}>Edit</button>
              <button className="delete" onClick={()=>deleteRoom(room.id)}>Delete</button>
            </span>

          </div>
        ))}

      </div>

    </div>
  );
}

export default ManageRooms;