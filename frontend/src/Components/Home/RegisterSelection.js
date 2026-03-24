import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import './RegisterSelection.css';

function RegisterSelection() {
  const navigate = useNavigate();

  return (
    <div className="register-selection-page">
      <Navbar />
      <div className="register-selection-container">
        <div className="register-selection-content">
        <h1 className="register-selection-title">Join Unistay</h1>
        <p className="register-selection-subtitle">Choose your account type to get started</p>
        
        <div className="registration-cards">
          {/* SLIIT Student Card */}
          <div className="registration-card sliit-card">
            <div className="card-badge">INSTITUTIONAL PARTNER: SLIIT</div>
            <h2>SLIIT Student</h2>
            <p className="card-description">
              Access exclusive academic housing near Malabe campus. Verified listings curated for the SLIIT community.
            </p>
            <div className="card-features">
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Free Registration</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>SLIIT Email Verification</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Instant Access</span>
              </div>
            </div>
            <button 
              className="register-btn sliit-btn"
              onClick={() => navigate('/register/sliit-student')}
            >
              Register as SLIIT Student
            </button>
          </div>

          {/* External Student Card */}
          <div className="registration-card external-card">
            <div className="card-badge">ENROLLMENT PHASE</div>
            <h2>External Student</h2>
            <p className="card-description">
              Join the premier academic housing network. Secure your place in high-standard accommodation curated for serious scholars.
            </p>
            <div className="card-features">
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Full Access to All Properties</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Instant Activation</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">$</span>
                <span>$120/Year Subscription</span>
              </div>
            </div>
            <button 
              className="register-btn external-btn"
              onClick={() => navigate('/register/external-student')}
            >
              Register as External Student
            </button>
          </div>

          {/* Vendor Card */}
          <div className="registration-card vendor-card">
            <div className="card-badge">VENDOR SETUP</div>
            <h2>Partner with Unistay</h2>
            <p className="card-description">
              Join an exclusive network of high-end academic service providers. Scale your business within the prestigious student housing ecosystem.
            </p>
            <div className="card-features">
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Vendor Dashboard</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Business Analytics</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">$</span>
                <span>$200/Year Subscription</span>
              </div>
            </div>
            <button 
              className="register-btn vendor-btn"
              onClick={() => navigate('/register/vendor')}
            >
              Register as Vendor
            </button>
          </div>
        </div>

        <div className="login-link">
          <p>Already have an account? <span onClick={() => navigate('/login')}>Sign In</span></p>
        </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default RegisterSelection;
