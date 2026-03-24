import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./roomlisting.css";

function RoomListing() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    price: "",
    facilities: "",
    description: "",
    occupancy: "vacant"
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let newErrors = {};

    if (!form.title.trim())
      newErrors.title = "Room title is required";

    if (!form.price)
      newErrors.price = "Price is required";
    else if (form.price < 1000)
      newErrors.price = "Minimum price is 1000";

    if (!form.facilities.trim())
      newErrors.facilities = "Enter at least one facility";

    if (!form.description.trim())
      newErrors.description = "Description is required";

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newRoom = {
      title: form.title,
      price: Number(form.price),
      facilities: form.facilities.split(",").map(f => f.trim()),
      description: form.description,
      occupied: form.occupancy === "occupied",
      bookings: 0,
      reviews: []
    };

    const existingRooms =
      JSON.parse(localStorage.getItem("rooms")) || [];

    const updatedRooms = [...existingRooms, newRoom];

    localStorage.setItem("rooms", JSON.stringify(updatedRooms));

    alert("Room Added Successfully");

    navigate("/");
  };

  const handleCancel = () => {
    if (
      form.title ||
      form.price ||
      form.facilities ||
      form.description
    ) {
      const confirmLeave = window.confirm(
        "You have unsaved changes. Leave page?"
      );
      if (!confirmLeave) return;
    }

    navigate("/");
  };

  return (
    <div className="roomlisting-container">

      <form className="room-form" onSubmit={handleSubmit}>

        <h1>Add New Room</h1>

        <label>Room Title</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
        />
        {errors.title && <span className="error">{errors.title}</span>}

        <label>Price (LKR)</label>
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
        />
        {errors.price && <span className="error">{errors.price}</span>}

        <label>Facilities (comma separated)</label>
        <input
          type="text"
          name="facilities"
          value={form.facilities}
          onChange={handleChange}
        />
        {errors.facilities && <span className="error">{errors.facilities}</span>}

        <label>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
        />
        {errors.description && (
          <span className="error">{errors.description}</span>
        )}

        <label>Status</label>
        <select
          name="occupancy"
          value={form.occupancy}
          onChange={handleChange}
        >
          <option value="vacant">Vacant</option>
          <option value="occupied">Occupied</option>
        </select>

        <button type="submit">Add Room</button>

        <button
          type="button"
          className="cancel-btn"
          onClick={handleCancel}
        >
          Cancel
        </button>

      </form>

    </div>
  );
}

export default RoomListing;