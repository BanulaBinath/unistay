import React, { useEffect, useState } from 'react';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import './Services.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { getItems } from '../../services/itemApi';
import RoomBooking from '../studenthome/roombooking';

export default function Services() {
  const location = useLocation();
  const navigate = useNavigate();
  const [foodItems, setFoodItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activeService, setActiveService] = useState('food');

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

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      // Clear state to avoid persistent toast on refresh
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

  const handleOrderNow = (item) => {
    navigate('/buyorder', { state: { item } });
  };

  const tabs = [
    { id: 'food', label: 'Food Services', icon: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" /> }, // Example simple svg paths later
  ];

  return (
    <div className="services-page-wrap">
      <Navbar />
      
      {/* Advanced Hero Section */}
      <section className="services-hero-advanced">
        {/* Animated Background Spheres & Pattern */}
        <div className="hero-gradient-sphere s-one"></div>
        <div className="hero-gradient-sphere s-two"></div>
        <div className="hero-pattern-overlay"></div>

        <div className="hero-advanced-container">
          <div className="hero-left-content">
            <div className="hero-badge-pill">
              <span className="sparkle-icon">✨</span> UniStay Premium Services
            </div>
            <h1 className="hero-title">
              Elevate Your <br />
              <span className="highlight-text">Student Living.</span>
            </h1>
            <p className="hero-subtitle">
              Say goodbye to daily chores. Enjoy fresh hot meals, top-tier room cleaning, and seamless laundry services delivered right to your door.
            </p>
            
            <div className="hero-action-group">
              <button 
                className="btn-primary-large" 
                onClick={() => document.getElementById('services-nav')?.scrollIntoView({behavior: 'smooth'})}
              >
                Explore Services
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
              
              <div className="hero-trust-indicators">
                <div className="avatars">
                  <img src="https://i.pravatar.cc/100?img=33" alt="Student" />
                  <img src="https://i.pravatar.cc/100?img=47" alt="Student" />
                  <img src="https://i.pravatar.cc/100?img=12" alt="Student" />
                </div>
                <div className="trust-text">
                  <strong>500+</strong> Students trust us
                </div>
              </div>
            </div>
          </div>

          <div className="hero-right-visuals">
            {/* Main Interactive Glass Card */}
            <div className="glass-card main-glass-card">
               <div className="glass-icon-box food-icon">
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>
               </div>
               <div className="glass-text">
                 <h4>Hot Meals</h4>
                 <p>Delivered in 30 mins</p>
               </div>
               <div className="glass-status active">Available</div>
            </div>

            {/* Secondary Floating Card */}
            <div className="glass-card secondary-glass-card float-slow">
               <div className="glass-icon-box clean-icon">
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M12 2v10l3.5 3.5"/></svg>
               </div>
               <div className="glass-text">
                 <h4>Deep Cleaning</h4>
                 <p>Weekly schedules</p>
               </div>
            </div>

            {/* Tertiary Floating Card */}
            <div className="glass-card tertiary-glass-card float-fast">
               <div className="glass-icon-box room-icon">
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
               </div>
               <div className="glass-text">
                 <h4>Premium Rooms</h4>
                 <p>Fully furnished</p>
               </div>
            </div>
          </div>
        </div>
        
        {/* Soft bottom transition wave */}
        <div className="hero-wave-bottom">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
             <path d="M0,0 C240,100 480,120 720,80 C960,40 1200,60 1440,100 L1440,120 L0,120 Z" className="wave-fill"></path>
          </svg>
        </div>
      </section>

      <div className="services-container">
        {/* Status Toast */}
        {successMessage && (
          <div className="services-toast success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>{successMessage}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="services-tab-nav" id="services-nav">
          <button 
            className={`tab-btn ${activeService === 'food' ? 'active' : ''}`}
            onClick={() => setActiveService('food')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3"/>
            </svg>
            Food Delivery
          </button>
          
          <button 
            className={`tab-btn ${activeService === 'room' ? 'active' : ''}`}
            onClick={() => setActiveService('room')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Room Booking
          </button>

          <button 
            className={`tab-btn ${activeService === 'laundry' ? 'active' : ''}`}
            onClick={() => setActiveService('laundry')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="16" rx="2" ry="2"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
              <circle cx="12" cy="15" r="2"/>
            </svg>
            Laundry Service
          </button>

          <button 
            className={`tab-btn ${activeService === 'cleaning' ? 'active' : ''}`}
            onClick={() => setActiveService('cleaning')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <path d="M12 2v10l3.5 3.5"/>
            </svg>
            Cleaning
          </button>
        </div>

        {/* Dynamic Service Area */}
        <main className="services-main-body">
          
          {/* Section Header */}
          <div className="service-section-header">
            {activeService === 'food' && (
              <>
                <h2>Campus Cravings Delivered</h2>
                <p>Order your favorite meals and receive them directly in your room. Fresh quality guaranteed. Fast payment after delivery.</p>
              </>
            )}
            {activeService === 'room' && (
              <>
                <h2>Your Perfect Stay Awaits</h2>
                <p>Browse our selection of comfortable, fully-furnished rooms designed specifically for student living.</p>
              </>
            )}
            {activeService === 'laundry' && (
              <>
                <h2>Professional Laundry Care</h2>
                <p>Fresh clothes without the hassle. Drop off your laundry and we'll handle the rest with premium care.</p>
              </>
            )}
            {activeService === 'cleaning' && (
              <>
                <h2>Spotless Room Cleaning</h2>
                <p>Schedule regular cleaning services to maintain a neat, tidy, and hygienic living space so you can focus on your studies.</p>
              </>
            )}
          </div>

          <div className="service-view-window">
            
            {/* FOOD SERVICE */}
            {activeService === 'food' && (
              <div className="service-grid-layout">
                {isLoading && (
                  <div className="state-feedback skeleton-layout">
                    {[1,2,3,4,5,6].map(i => (
                      <div key={i} className="service-card-skeleton" />
                    ))}
                  </div>
                )}
                
                {!isLoading && fetchError && (
                  <div className="state-feedback error-state">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <p>{fetchError}</p>
                    <button onClick={() => window.location.reload()} className="retry-btn">Try Again</button>
                  </div>
                )}

                {!isLoading && !fetchError && foodItems.length === 0 && (
                  <div className="state-feedback empty-state">
                    <div className="empty-icon-wrapper">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                    </div>
                    <h4>No Service Items Currently Available</h4>
                    <p>Our kitchen is updating its menu. Please check back later for delicious fresh meals.</p>
                  </div>
                )}

                {!isLoading && !fetchError && foodItems.map((item) => (
                  <article className="premium-service-card" key={item._id}>
                    <div className="card-media">
                      <img src={`${imageBaseUrl}${item.itemImage}`} alt={item.itemName} loading="lazy" />
                      <span className="card-price-badge">RS. {Number(item.price).toFixed(0)}</span>
                    </div>
                    <div className="card-body">
                      <h3 className="card-title">{item.itemName}</h3>
                      <p className="card-desc">{item.description}</p>
                      <button className="card-action-btn" onClick={() => handleOrderNow(item)}>
                        <span>Order Now</span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12"/>
                          <polyline points="12 5 19 12 12 19"/>
                        </svg>
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* ROOM BOOKING */}
            {activeService === 'room' && (
              <div className="integrated-module-wrap">
                <RoomBooking />
              </div>
            )}

            {/* LAUNDRY & CLEANING */}
            {['laundry', 'cleaning'].includes(activeService) && (
              <div className="coming-soon-banner">
                <div className="coming-soon-icon">
                  {activeService === 'laundry' ? (
                     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="10"/>
                        <circle cx="12" cy="12" r="4"/>
                        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
                     </svg>
                  ) : (
                     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                        <line x1="12" y1="22.08" x2="12" y2="12"/>
                     </svg>
                  )}
                </div>
                <h2>Launching Highly Soon</h2>
                <p>We are putting the final polish on our premium {activeService} service. Register your interest and get notified first!</p>
                <button className="notify-btn" onClick={() => alert('Thanks! We will notify you.')}>Notify Me</button>
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}