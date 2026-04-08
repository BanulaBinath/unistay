import React, { useEffect, useState } from 'react';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import { Link, useNavigate } from 'react-router-dom';
import '../pages/Services.css';
import './londriservices.css';
import api from '../../services/api';

function Londriservices() {
  const navigate = useNavigate();

  const [vendors, setVendors]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  const isValidLaundryVendor = (vendor) => {
    const rates = vendor.rates || {};
    return [
      'Wash & Fold',
      'Dry Cleaning',
      'Iron Press'
    ].some(key => Number(rates[key]) > 0);
  };

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await api.get('/laundry/vendors');
        const results = (res.data.data || []).filter(isValidLaundryVendor);
        setVendors(results);
      } catch (err) {
        console.error(err);
        setError('Failed to load vendors. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  const handleSelectVendor = (vendor) => {
    navigate('/student-laundry', { state: { selectedVendor: vendor } });
  };

  return (
    <div className="services-page">
      <Navbar />

      {/* ── Service Tabs ── */}
      <div className="services-content">
        <h1>Our Services</h1>
        <ul>
          <li><Link to="/services"><button>Food Services</button></Link></li>
          <li><Link to="/room-booking"><button>Room Booking</button></Link></li>
          <li><Link to="/laundry"><button className="active-service">Laundry Service</button></Link></li>
          <li><Link to="/cleaning"><button>Cleaning Service</button></Link></li>
        </ul>
      </div>

      {/* ── Quote ── */}
      <div className="laundry-quote-section">
        <h2>Choose a vendor to book your laundry service.</h2>
        <p>"Drop off your clothes and get them back fresh and clean. Payment is made after service,
           ensuring a safe and convenient experience. We guarantee 100% quality service delivered
           right to your room."</p>
      </div>

      {/* ── Vendor Cards ── */}
      <div className="vendors-section">

        {/* Loading */}
        {loading && (
          <div className="vendors-loading">
            <p>⏳ Loading vendors...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="vendors-error">
            <p>❌ {error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && vendors.length === 0 && (
          <div className="vendors-empty">
            <p>😕 No laundry vendors available at the moment.</p>
          </div>
        )}

        {/* Cards */}
        {!loading && !error && vendors.length > 0 && (
          <div className="vendors-grid">
            {vendors.map(vendor => (
              <div key={vendor._id} className="vendor-card">
                <div className="vendor-avatar">
                  {vendor.businessName
                    ? vendor.businessName.charAt(0).toUpperCase()
                    : vendor.fullName.charAt(0).toUpperCase()}
                </div>
                <h3>{vendor.businessName || vendor.fullName}</h3>
                <p className="vendor-location">📍 {vendor.address || 'Location not set'}</p>
                <p className="vendor-rating">
                  ⭐ {vendor.rating ? `${vendor.rating}/5` : 'No ratings yet'}
                </p>
                <div className="vendor-rate">
                  <span className="rate-label">Rate per dress</span>
                  <span className="rate-value">
                    Rs. {vendor.rates?.['Wash & Fold'] || vendor.rates?.basic || 'N/A'}
                  </span>
                </div>
                <button
                  className="select-vendor-btn"
                  onClick={() => handleSelectVendor(vendor)}
                >
                  Select Vendor
                </button>
              </div>
            ))}
          </div>
        )}

      </div>

      <Footer />
    </div>
  );
}

export default Londriservices;