import React, { useEffect, useState } from 'react';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import { Link, useNavigate } from 'react-router-dom';
import '../pages/Services.css';
import './cleaningservices.css';
import api from '../../services/api';

function Cleaningservices() {
  const navigate = useNavigate();

  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  // ── Load vendors on mount ──
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await api.get('/cleaning/vendors');
        setVendors(res.data.data || []);
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
    navigate('/student-cleaning', { state: { selectedVendor: vendor } });
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
          <li><Link to="/laundry"><button>Laundry Service</button></Link></li>
          <li><Link to="/cleaning"><button className="active-service">Cleaning Service</button></Link></li>
        </ul>
      </div>

      {/* ── Quote ── */}
      <div className="cleaning-quote-section">
        <h2>Choose a vendor to book your cleaning service.</h2>
        <p>"Get your room and bathroom professionally cleaned right at your hostel.
           Payment is made after service, ensuring a safe and convenient experience.
           We guarantee 100% quality cleaning delivered right to your door."</p>
      </div>

      {/* ── Vendor Cards ── */}
      <div className="cleaning-vendors-section">

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
            <p>😕 No cleaning vendors available at the moment.</p>
          </div>
        )}

        {/* Cards */}
        {!loading && !error && vendors.length > 0 && (
          <div className="cleaning-vendors-grid">
            {vendors.map(vendor => (
              <div key={vendor._id} className="cleaning-vendor-card">
                <div className="cleaning-vendor-avatar">
                  {(vendor.businessName || vendor.fullName).charAt(0).toUpperCase()}
                </div>
                <h3>{vendor.businessName || vendor.fullName}</h3>
                <p className="cleaning-vendor-location">
                  📍 {vendor.address || 'Location not set'}
                </p>
                <p className="cleaning-vendor-rating">
                  ⭐ {vendor.rating ? `${vendor.rating}/5` : 'No ratings yet'}
                </p>

                <div className="cleaning-rates-box">
                  <div className="cleaning-rate-row">
                    <span className="cleaning-rate-label">🛏️ Room Cleaning</span>
                    <span className="cleaning-rate-value">
                      Rs. {vendor.rates?.['Room Cleaning'] || 'N/A'}
                    </span>
                  </div>
                  <div className="cleaning-rate-row">
                    <span className="cleaning-rate-label">🚿 Bathroom</span>
                    <span className="cleaning-rate-value">
                      Rs. {vendor.rates?.['Bathroom Cleaning'] || 'N/A'}
                    </span>
                  </div>
                  <div className="cleaning-rate-row">
                    <span className="cleaning-rate-label">🏠 Room + Bathroom</span>
                    <span className="cleaning-rate-value">
                      Rs. {vendor.rates?.['Room + Bathroom Cleaning'] || 'N/A'}
                    </span>
                  </div>
                </div>

                <button
                  className="cleaning-select-btn"
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

export default Cleaningservices;