import React from 'react';
import Navbar from '../Components/common/Navbar';
import Footer from '../Components/common/Footer';
import './Pages.css';

function Contact() {
  return (
    <div className="page">
      <Navbar />
      <div className="coming-soon-container">
        <div className="coming-soon-content">
          <div className="coming-soon-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="coming-soon-title">Contact Us</h1>
          <h2 className="coming-soon-subtitle">Coming Soon</h2>
          <p className="coming-soon-text">
            We're setting up our contact channels. Soon you'll be able to reach us easily!
          </p>
          <a href="/" className="coming-soon-btn">Back to Home</a>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Contact;
