import React, { useEffect, useState } from 'react';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import './Services.css';
import './Services2.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { getItems } from '../../services/itemApi';
import RoomBooking from '../studenthome/roombooking'; // RoomBooking component

function Services() {
  const location = useLocation();
  const navigate = useNavigate();
  const [foodItems, setFoodItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activeService, setActiveService] = useState('food'); // tab state

  const imageBaseUrl = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace('/api', '');

  // Load food items
  useEffect(() => {
    const loadItems = async () => {
      try {
        setIsLoading(true);
        setFetchError('');
        const response = await getItems({ category: 'active' });
        setFoodItems(response?.data || []);
      } catch (error) {
        setFetchError(error?.response?.data?.message || 'Failed to load food services');
      } finally {
        setIsLoading(false);
      }
    };
    loadItems();
  }, []);

  // Show success message after navigation
  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

  const handleOrderNow = (item) => {
    navigate('/buyorder', { state: { item } });
  };

  return (
    <div className="services-page">
      <Navbar />

      <div className="services-content">
        <h1>Our Services</h1>
        {successMessage && <p className="order-success-message">{successMessage}</p>}

        {/* TABS */}
        <div className="services-tabs">
          <button className={activeService === 'food' ? 'active' : ''} onClick={() => setActiveService('food')}>Food Services</button>
          <button className={activeService === 'room' ? 'active' : ''} onClick={() => setActiveService('room')}>Room Booking</button>
          <button className={activeService === 'laundry' ? 'active' : ''} onClick={() => setActiveService('laundry')}>Laundry Service</button>
          <button className={activeService === 'cleaning' ? 'active' : ''} onClick={() => setActiveService('cleaning')}>Cleaning Service</button>
        </div>
      </div>

      {/* Service Note */}
      <h3 className="services-note">
        {activeService === 'food' ? 'Choose a service to learn more about food item.' :
         activeService === 'room' ? 'Browse available rooms for booking.' :
         activeService === 'laundry' ? 'Check laundry service options.' :
         'Check cleaning service options.'}
      </h3>

      <p>
        {activeService === 'food' && '"Order your items and receive them directly in your room. Payment is made after delivery, ensuring a safe and convenient experience. We guarantee 100% quality service with the best products delivered right to you."'}
      </p>

      {/* DYNAMIC CONTENT */}
      <div className="services-items-container">
        {/* FOOD */}
        {activeService === 'food' && (
          <>
            {isLoading && <p>Loading services...</p>}
            {!isLoading && fetchError && <p>{fetchError}</p>}
            {!isLoading && !fetchError && foodItems.length === 0 && <p>No food items available right now.</p>}

            {!isLoading && !fetchError && foodItems.map((item) => (
              <div className="service-card" key={item._id}>
                <h4>{item.itemName}</h4>
                <img src={`${imageBaseUrl}${item.itemImage}`} alt={item.itemName} />
                <p className="service-desc">{item.description}</p>
                <p className="service-price">Rs.{Number(item.price).toFixed(2)}</p>
                <button className="order-btn" onClick={() => handleOrderNow(item)}>Order Buy Now</button>
              </div>
            ))}
          </>
        )}

        {/* ROOM BOOKING */}
        {activeService === 'room' && <RoomBooking />}

        {/* LAUNDRY */}
        {activeService === 'laundry' && <h2>Laundry Service Coming Soon 🧺</h2>}

        {/* CLEANING */}
        {activeService === 'cleaning' && <h2>Cleaning Service Coming Soon 🧹</h2>}
      </div>

      <Footer />
    </div>
  );
}

export default Services;