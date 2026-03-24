import React from 'react';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import './Services.css';

function Services() {
  return (
    <div className="services-page">
      <Navbar />
      
      <div className="services-content">
        <h1>Our Services</h1>
        <p>Services page content will be designed by team member.</p>
      </div>

      <Footer />
    </div>
  );
}

export default Services;
