import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import './Contact.css';

function Contact() {
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I register as a vendor?",
      answer: "Click on 'Sign Up' in the navigation menu, select 'Partner with UniStay', and complete the vendor registration form. You'll need to provide business details and choose your service category (Food, Boarding, Laundry, or Cleaning)."
    },
    {
      question: "What if I forgot my password?",
      answer: "On the login page, click 'Forgot Password?' and enter your registered email address. You'll receive a password reset link within minutes. Follow the instructions to create a new password."
    },
    {
      question: "How do I track my complaints?",
      answer: "Log in to your student dashboard and navigate to 'My Tickets' or 'Support' section. You'll see all your submitted complaints with their current status and any responses from our support team."
    },
    {
      question: "How do I update accommodation details?",
      answer: "Vendors can update accommodation details through their dashboard under 'Property Management'. Students can request changes by contacting their accommodation provider directly or submitting a support ticket."
    }
  ];

  return (
    <div className="contact-page">
      <Navbar />
      
      {/* Hero Section */}
      <section className="contact-hero-section">
        <div className="contact-hero-container">
          <div className="contact-hero-content">
            <span className="contact-hero-badge">24/7 SUPPORT</span>
            <h1 className="contact-hero-title">
              We're here to <span className="contact-hero-highlight">help</span>
            </h1>
            <p className="contact-hero-subtitle">
              Have questions or need assistance? Our dedicated support team is ready to help you 
              with any inquiries about accommodation, services, or platform features.
            </p>
            <div className="contact-hero-buttons">
              <Link to="/student/complaints" className="contact-btn-primary">
                Support Center
              </Link>
              <a href="mailto:support@unistay.com" className="contact-btn-secondary">
                Email Us
              </a>
            </div>
          </div>
          <div className="contact-hero-visual">
            <div className="contact-hero-icon-cluster">
              <div className="contact-hero-icon-card contact-hero-icon-card-1">
                <svg className="contact-hero-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="contact-hero-icon-card contact-hero-icon-card-2">
                <svg className="contact-hero-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="contact-hero-icon-card contact-hero-icon-card-3">
                <svg className="contact-hero-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Channels Section */}
      <section className="contact-channels-section">
        <div className="contact-section-container">
          <div className="contact-channels-header">
            <h2 className="contact-section-title">Get in Touch</h2>
            <p className="contact-channels-subtitle">
              Choose your preferred way to reach us
            </p>
          </div>
          <div className="contact-channels-grid">
            <div className="contact-channel-card">
              <div className="contact-channel-icon-wrapper contact-channel-icon-blue">
                <svg className="contact-channel-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="contact-channel-title">Email Support</h3>
              <a href="mailto:support@unistay.com" className="contact-channel-value">
                support@unistay.com
              </a>
              <p className="contact-channel-description">
                Expect a reply within 24 hours. Perfect for detailed inquiries and documentation.
              </p>
            </div>

            <div className="contact-channel-card">
              <div className="contact-channel-icon-wrapper contact-channel-icon-green">
                <svg className="contact-channel-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="contact-channel-title">Phone Support</h3>
              <a href="tel:+94112345678" className="contact-channel-value">
                +94 11 234 5678
              </a>
              <p className="contact-channel-description">
                Reach our team for quick assistance. Available Monday to Friday, 9 AM - 6 PM.
              </p>
            </div>

            <div className="contact-channel-card">
              <div className="contact-channel-icon-wrapper contact-channel-icon-purple">
                <svg className="contact-channel-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="contact-channel-title">Visit Our Office</h3>
              <p className="contact-channel-value">
                123 Campus Road, Malabe
              </p>
              <p className="contact-channel-description">
                Visit our student helpdesk for in-person assistance and consultations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="contact-faq-section">
        <div className="contact-section-container">
          <div className="contact-faq-header">
            <h2 className="contact-section-title">Quick FAQs</h2>
            <p className="contact-faq-subtitle">
              Find answers to commonly asked questions
            </p>
          </div>
          <div className="contact-faq-list">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`contact-faq-item ${activeFaq === index ? 'contact-faq-item-active' : ''}`}
              >
                <button 
                  className="contact-faq-question"
                  onClick={() => toggleFaq(index)}
                >
                  <span>{faq.question}</span>
                  <svg 
                    className="contact-faq-icon" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="contact-faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Support Section */}
      <section className="contact-emergency-section">
        <div className="contact-section-container">
          <div className="contact-emergency-card">
            <div className="contact-emergency-icon-wrapper">
              <svg className="contact-emergency-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="contact-emergency-content">
              <div className="contact-emergency-badge">PRIORITY SUPPORT</div>
              <h2 className="contact-emergency-title">Emergency Assistance</h2>
              <p className="contact-emergency-text">
                For urgent issues affecting safety or accommodation access, please contact our 
                emergency line immediately. We're available 24/7 for critical situations.
              </p>
              <div className="contact-emergency-details">
                <div className="contact-emergency-number">
                  <svg className="contact-emergency-detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href="tel:+94112345999" className="contact-emergency-link">+94 11 234 5999</a>
                </div>
                <div className="contact-emergency-badge-trust">Trusted Student Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="contact-map-section">
        <div className="contact-section-container">
          <div className="contact-map-grid">
            <div className="contact-map-info">
              <h2 className="contact-map-title">Campus Coverage</h2>
              <p className="contact-map-description">
                UniStay serves students across multiple campus locations with verified accommodation 
                and service providers in key student areas.
              </p>
              <div className="contact-map-locations">
                <div className="contact-map-location-item">
                  <svg className="contact-map-location-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <div>
                    <h4>Malabe Campus Area</h4>
                    <p>Primary coverage zone</p>
                  </div>
                </div>
                <div className="contact-map-location-item">
                  <svg className="contact-map-location-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <div>
                    <h4>Metro Colombo</h4>
                    <p>Extended service area</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="contact-map-container">
              <div className="contact-map-placeholder">
                <svg className="contact-map-placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p>Service Coverage Map</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Connect Section */}
      <section className="contact-social-section">
        <div className="contact-section-container">
          <div className="contact-social-header">
            <h2 className="contact-section-title">Connect With Us</h2>
            <p className="contact-social-subtitle">
              Follow us on social media for updates, tips, and community stories
            </p>
          </div>
          <div className="contact-social-grid">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="contact-social-card contact-social-facebook">
              <svg className="contact-social-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Facebook</span>
            </a>

            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="contact-social-card contact-social-instagram">
              <svg className="contact-social-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span>Instagram</span>
            </a>

            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="contact-social-card contact-social-linkedin">
              <svg className="contact-social-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span>LinkedIn</span>
            </a>

            <a href="https://wa.me/94112345678" target="_blank" rel="noopener noreferrer" className="contact-social-card contact-social-whatsapp">
              <svg className="contact-social-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="contact-cta-section">
        <div className="contact-cta-container">
          <div className="contact-cta-content">
            <h2 className="contact-cta-title">Ready to Get Started?</h2>
            <p className="contact-cta-description">
              Join thousands of students who trust UniStay for their accommodation and daily needs. 
              Experience seamless student living today.
            </p>
            <div className="contact-cta-buttons">
              <Link to="/register" className="contact-cta-button-primary">
                Join UniStay Today
              </Link>
              <Link to="/services" className="contact-cta-button-secondary">
                Explore Services
              </Link>
            </div>
          </div>
          <div className="contact-cta-visual">
            <div className="contact-cta-icon-circle">
              <svg className="contact-cta-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Contact;
