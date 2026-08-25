import React, { useEffect, useRef, useState } from 'react';
import './foodorder.css';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import { Link, useLocation, useNavigate } from "react-router-dom";
import L from "leaflet";
import { createOrder } from '../../services/orderApi';

function FoodOrder() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedItem = location.state?.item || null;

  const [formData, setFormData] = useState({
    email: '',
    roomNumber: '',
    phone: '',
    quantity: '',
    orderDate: '',
    time: '',
    liveLocation: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const imageBaseUrl = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace('/api', '');

  /* ------------------ LEAFLET LIVE LOCATION ------------------ */
  useEffect(() => {
    if (!selectedItem || !mapContainerRef.current || mapInstanceRef.current) return;

    let isActive = true;
    const map = L.map(mapContainerRef.current).setView([0, 0], 15);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18 }).addTo(map);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (!isActive || !mapInstanceRef.current) return;

          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;

          mapInstanceRef.current.setView([lat, lng], 16);

          L.marker([lat, lng]).addTo(mapInstanceRef.current)
            .bindPopup("Your current location")
            .openPopup();

          setFormData(prev => ({ ...prev, liveLocation: `${lat}, ${lng}` }));
        },
        (error) => {
          console.error("Geolocation error:", error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }

    return () => {
      isActive = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [selectedItem]);

  /* ------------------ VALIDATION ------------------ */
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "email":
        if (!value) error = "Email is required";
        else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value))
          error = "Invalid email address";
        break;

      case "roomNumber":
        if (!value) error = "Room number is required";
        else if (value <= 0) error = "Invalid number";
        break;

      case "phone":
        if (!value) error = "Phone is required";
        else if (!/^\d{10}$/.test(value)) error = "Phone must be 10 numbers";
        break;

      case "quantity":
        if (!value) error = "Quantity is required";
        else if (value <= 0) error = "Invalid quantity";
        break;

      case "orderDate":
        if (!value) error = "Order date required";
        else {
          const selected = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (selected < today) error = "Cannot select past date";
        }
        break;

      case "time":
        if (!value) error = "Choose a time slot";
        break;

      default:
        break;
    }

    setErrors(prev => ({ ...prev, [name]: error }));
    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      if (field === 'liveLocation') return;
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitError('');

    if (!selectedItem) {
      setSubmitError('No item selected.');
      return;
    }

    if (!validateForm()) {
      setSubmitError('Fix the errors first.');
      return;
    }

    try {
      setIsSubmitting(true);

      await createOrder({
        itemId: selectedItem._id,
        email: formData.email,
        roomNumber: formData.roomNumber,
        phone: formData.phone,
        quantity: formData.quantity,
        orderDate: formData.orderDate,
        time: formData.time,
        liveLocation: formData.liveLocation,
        notes: formData.notes
      });

      // Show success message
      alert('Order placed successfully!');
      
      // Navigate to Services page after user clicks OK
      navigate('/services');

    } catch (error) {
      // Show error alert
      if (error?.response?.status === 401) {
        alert('Please login as a student account to place an order.');
      } else {
        alert(error?.response?.data?.message || 'Failed to place order. Please try again.');
      }
      setSubmitError(error?.response?.data?.message || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const todayDate = new Date().toISOString().split("T")[0];

  const totalPrice = formData.quantity && selectedItem
    ? formData.quantity * Number(selectedItem.price)
    : 0;

  if (!selectedItem) {
    return (
      <div className="order-page">
        <Navbar />
        <h2>No item selected</h2>
        <Link to="/services">
          <button className="back-btn">Go back</button>
        </Link>
        <Footer />
      </div>
    );
  }

  return (
    <div className="order-page">
      <Navbar />

      <div className="order-header">
        <Link to="/services"><button className="back-btn">Back</button></Link>
        <h2>Buy Order</h2>
      </div>

      <div className="order-container">
        
        {/* LEFT SIDE */}
        <div className="order-left">
          <div className="service-card">

            <h4>{selectedItem.itemName}</h4>

            {/* FIXED IMAGE WRAPPER */}
            <div className="image-box">
              <img 
                src={`${imageBaseUrl}${selectedItem.itemImage}`} 
                alt={selectedItem.itemName}
              />
            </div>

            <p className="service-desc">{selectedItem.description}</p>
            <p className="service-price">Rs.{Number(selectedItem.price).toFixed(2)}</p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="order-right">
          <button className="camplain-btn">Complaint</button>

          <form className="order-form" onSubmit={handleSubmit}>
            {submitError && <span className="error">{submitError}</span>}

            <div className="form-group">
              <label>Email</label>
              <input name="email" value={formData.email} onChange={handleChange} />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Room Number</label>
              <input name="roomNumber" type="number" value={formData.roomNumber} onChange={handleChange} />
              {errors.roomNumber && <span className="error">{errors.roomNumber}</span>}
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input name="phone" value={formData.phone} onChange={handleChange} />
              {errors.phone && <span className="error">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label>Quantity</label>
              <input name="quantity" type="number" value={formData.quantity} min={1} onChange={handleChange} />
              {errors.quantity && <span className="error">{errors.quantity}</span>}

              {formData.quantity > 0 && (
                <p className="total-price">Total: Rs.{totalPrice}</p>
              )}
            </div>

            <div className="form-group">
              <label>Order Date</label>
              <input type="date" name="orderDate" min={todayDate} value={formData.orderDate} onChange={handleChange} />
              {errors.orderDate && <span className="error">{errors.orderDate}</span>}
            </div>

            <div className="form-group">
              <label>Time</label>
              <select name="time" value={formData.time} onChange={handleChange}>
                <option value="">Select</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
              </select>
              {errors.time && <span className="error">{errors.time}</span>}
            </div>

            <div className="form-group">
              <label>Live Location</label>
              <div style={{ display: "flex", gap: "10px" }}>
                <input value={formData.liveLocation} readOnly placeholder="Fetching location..." />
                <button 
                  type="button" 
                  style={{ width: "auto", padding: "0 10px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(
                        (pos) => {
                          const lat = pos.coords.latitude;
                          const lng = pos.coords.longitude;
                          setFormData(prev => ({ ...prev, liveLocation: `${lat}, ${lng}` }));
                          if (mapInstanceRef.current) {
                            mapInstanceRef.current.setView([lat, lng], 16);
                            L.marker([lat, lng]).addTo(mapInstanceRef.current)
                              .bindPopup("Your current location")
                              .openPopup();
                          }
                        },
                        (err) => alert("Could not fetch location. Please enable location permissions."),
                        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
                      );
                    } else {
                      alert("Geolocation is not supported by your browser.");
                    }
                  }}
                >
                  Fetch
                </button>
              </div>
            </div>

           

            <div ref={mapContainerRef} className="map-box"></div>

            <button className="btn-update" disabled={isSubmitting}>
              {isSubmitting ? "Placing..." : "Order Item"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default FoodOrder;