import React from 'react';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import './Contact.css';

function Contact() {
  return (
    <div className="contact-page">
      <Navbar />
      
      <div className="contact-content">
        <h1>Contact Us</h1>
        <p>Contact page content will be designed by team member.</p>
      </div>

      <Footer />
    </div>
  );
}

export default Contact;
