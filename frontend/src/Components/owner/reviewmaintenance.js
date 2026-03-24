import React, { useState } from "react";
import "./reviewmaintenance.css";

function ReviewMaintenance() {

  const [reviews, setReviews] = useState([
    {
      id:1,
      room:"Room A",
      student:"Kamal",
      rating:4,
      comment:"Good environment",
      reply:""
    },
    {
      id:2,
      room:"Room B",
      student:"Nimal",
      rating:3,
      comment:"Water pressure low",
      reply:""
    }
  ]);

  const [vendors] = useState([
    {
      id:1,
      name:"Sunil Repairs",
      speciality:"Electrical",
      rating:4.5
    },
    {
      id:2,
      name:"Nimal Plumbing",
      speciality:"Plumbing",
      rating:4.2
    },
    {
      id:3,
      name:"CoolFix Lanka",
      speciality:"AC Service",
      rating:4.8
    }
  ]);

  const handleReply = (id, text) => {
    setReviews(
      reviews.map(r =>
        r.id === id ? { ...r, reply:text } : r
      )
    );
  };

  const assignVendor = (name) => {
    alert(name + " assigned");
  };

  return (
    <div className="rm-container">

      <h1>Reviews</h1>

      <div className="reviews-section">
        {reviews.map(r => (
          <div key={r.id} className="review-card">

            <h3>{r.room}</h3>

            <p><b>{r.student}</b></p>

            <p>Rating: {r.rating} ⭐</p>

            <p>{r.comment}</p>

            <input
              placeholder="Reply to review"
              onChange={(e)=>handleReply(r.id,e.target.value)}
            />

            {r.reply && (
              <div className="reply">
                Owner Reply: {r.reply}
              </div>
            )}

          </div>
        ))}
      </div>

      <h1 className="vendor-title">Maintenance Vendors</h1>

      <div className="vendor-grid">
        {vendors.map(v => (
          <div key={v.id} className="vendor-card">

            <h3>{v.name}</h3>

            <p>Speciality: {v.speciality}</p>

            <p>Rating: {v.rating} ⭐</p>

            <button onClick={()=>assignVendor(v.name)}>
              Assign Vendor
            </button>

          </div>
        ))}
      </div>

    </div>
  );
}

export default ReviewMaintenance;