import React from 'react';
import Navbar from '../Components/common/Navbar';
import Footer from '../Components/common/Footer';
import './Pages.css';

function Services() {
  return (
    <div className="page">
      <Navbar />
      <div className="coming-soon-container">
        <div className="coming-soon-content">
          <div className="coming-soon-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
          <h1 className="coming-soon-title">Services Page</h1>
          <h2 className="coming-soon-subtitle">Coming Soon</h2>
          <p className="coming-soon-text">
            Our team is working hard to bring you detailed information about all our services. 
            Check back soon!
          </p>
          <a href="/" className="coming-soon-btn">Back to Home</a>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Services;
