import React from 'react';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import './About.css';

function About() {
  return (
    <div className="about-page">
      <Navbar />
      
      <div className="about-content">
        <h1>About Us</h1>
        <p>About Us page content will be designed by team member.</p>
      </div>

      <Footer />
    </div>
  );
}

export default About;
