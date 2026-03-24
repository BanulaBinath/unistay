import React, { useEffect, useState } from 'react';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import './Services.css';
import { Link, useNavigate } from 'react-router-dom';
import './Services2.css';
import { getItems } from '../../services/itemApi';

function Services() {
  const navigate = useNavigate();
  const [foodItems, setFoodItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  const imageBaseUrl = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace('/api', '');

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

  const handleOrderNow = (item) => {
    navigate('/buyorder', { state: { item } });
  };

  return (
    <div className="services-page">
      <Navbar />

      <div className="services-content">
        <h1>Our Services</h1>
        <ul>
          <li><Link to="/services"><button>Food Services</button></Link></li>
          <li><Link to="/room-booking"><button>Room Booking</button></Link></li>
          <li><Link to="/laundry"><button>Laundry Service</button></Link></li>
          <li><Link to="/cleaning"><button>Cleaning Service</button></Link></li>
        </ul>
      </div>

      <h3 className="services-note">Choose a service to learn more about food item.</h3>
      <p>"Order your items and receive them directly in your room. Payment is made after delivery, ensuring a safe and convenient experience. We guarantee 100% quality service with the best products delivered right to you."</p>

      {/* Food Items Section */}
      <div className="services-items-container">
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
      </div>

      <Footer />
    </div>
  );
}

export default Services;