import React, { useState } from "react";
import "./bookingrequest.css";

function BookingRequest() {

  const [activeTab, setActiveTab] = useState("booking");
  const [filter, setFilter] = useState("all");

  const [requests, setRequests] = useState([
    {
      id: 1,
      room: "Room A",
      student: "Kamal",
      type: "booking",
      status: "pending",
      time: "2 hrs ago"
    },
    {
      id: 2,
      room: "Room B",
      student: "Nimal",
      type: "booking",
      status: "accepted",
      time: "1 day ago"
    },
    {
      id: 3,
      room: "Room C",
      type: "maintenance",
      issue: "Water leakage",
      status: "pending",
      time: "30 mins ago"
    }
  ]);

  const updateStatus = (id, newStatus) => {
    setRequests(
      requests.map(req =>
        req.id === id ? { ...req, status: newStatus } : req
      )
    );
  };

  const visibleRequests = requests
    .filter(r => r.type === activeTab)
    .filter(r => filter === "all" ? true : r.status === filter);

  return (
    <div className="requests-page">

      <h1>Requests Center</h1>

      {/* TABS */}
      <div className="tabs">
        <button
          className={activeTab === "booking" ? "active" : ""}
          onClick={() => setActiveTab("booking")}
        >
          Booking Requests
        </button>

        <button
          className={activeTab === "maintenance" ? "active" : ""}
          onClick={() => setActiveTab("maintenance")}
        >
          Maintenance
        </button>
      </div>

      {/* FILTER */}
      <div className="filter-bar">
        <select onChange={(e)=>setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* LIST */}
      {visibleRequests.length === 0 && (
        <p className="empty">No requests found</p>
      )}

      {visibleRequests.map(req => (
        <div key={req.id} className="request-card">

          <div className="left">

            <h3>{req.room}</h3>

            {req.type === "booking" && (
              <p>Booking request from <b>{req.student}</b></p>
            )}

            {req.type === "maintenance" && (
              <p>Issue: {req.issue}</p>
            )}

            <span className={`status ${req.status}`}>
              {req.status}
            </span>

            <div className="time">{req.time}</div>

          </div>

          <div className="actions">

            {req.status === "pending" && req.type === "booking" && (
              <>
                <button
                  className="accept"
                  onClick={()=>updateStatus(req.id,"accepted")}
                >
                  Accept
                </button>

                <button
                  className="reject"
                  onClick={()=>updateStatus(req.id,"rejected")}
                >
                  Reject
                </button>
              </>
            )}

            {req.status === "pending" && req.type === "maintenance" && (
              <button
                className="vendor"
                onClick={()=>updateStatus(req.id,"vendor requested")}
              >
                Request Vendor
              </button>
            )}

          </div>

        </div>
      ))}

    </div>
  );
}

export default BookingRequest;