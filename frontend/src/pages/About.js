import React from 'react';
import Navbar from '../Components/common/Navbar';
import Footer from '../Components/common/Footer';
import './Pages.css';

function About() {
  return (
    <div className="page">
      <Navbar />
      <div className="coming-soon-container">
        <div className="coming-soon-content">
          <div className="coming-soon-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="coming-soon-title">About Us</h1>
          <h2 className="coming-soon-subtitle">Coming Soon</h2>
          <p className="coming-soon-text">
            We're crafting our story to share with you. Learn more about Unistay and our mission soon!
          </p>
          <a href="/" className="coming-soon-btn">Back to Home</a>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default About;
