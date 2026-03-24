import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './roombooking.css';

export default function ReviewsPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  // Mock reviews data (can be fetched from backend in real app)
  const [reviews, setReviews] = useState([
    { id: 1, name: 'Alice', rating: 5, comment: 'Great room!' },
    { id: 2, name: 'Bob', rating: 4, comment: 'Very comfortable.' },
  ]);

  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleAddReview = (e) => {
    e.preventDefault();
    setReviews([...reviews, { id: reviews.length + 1, name, rating, comment }]);
    setName('');
    setRating(5);
    setComment('');
  };

  return (
    <div className="container">
      <h1 className="title">Reviews for Room {roomId}</h1>
      <div className="reviews-list">
        {reviews.map(r => (
          <div key={r.id} className="review-card">
            <p><strong>{r.name}</strong> ⭐ {r.rating}</p>
            <p>{r.comment}</p>
          </div>
        ))}
      </div>
      <form className="booking-form" onSubmit={handleAddReview}>
        <h2>Add a Review</h2>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Rating:
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <label>
          Comment:
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} required />
        </label>
        <button type="submit" className="book-btn">Submit Review</button>
      </form>
      <button className="book-btn" onClick={() => navigate(-1)}>Back to Dashboard</button>
    </div>
  );
}
