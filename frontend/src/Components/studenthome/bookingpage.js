import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './roombooking.css'; // reuse your CSS

export default function RoomBooking() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [studentName, setStudentName] = useState('');
  const [date, setDate] = useState('');

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    // Here you can integrate backend API for booking
    alert(`Room ${roomId} successfully booked by ${studentName} for ${date}`);
    navigate('/'); // go back to dashboard
  };

  return (
    <div className="container">
      <h1 className="title">Book Room {roomId}</h1>
      <form className="booking-form" onSubmit={handleBookingSubmit}>
        <label>
          Student Name:
          <input 
            type="text" 
            value={studentName} 
            onChange={(e) => setStudentName(e.target.value)} 
            required 
          />
        </label>
        <label>
          Booking Date:
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            required 
          />
        </label>
        <button type="submit" className="book-btn">Confirm Booking</button>
      </form>
    </div>
  );
}
