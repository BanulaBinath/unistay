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
      <div className="register-selection-container" style={{ paddingTop: '10px' }}>
        <div className="register-selection-content">
          {/* Header Section */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h1 className="register-selection-title" style={{ fontSize: '30px' }}>Join Unistay</h1>
            <p className="register-selection-subtitle" style={{ textAlign: 'center', margin: '8px auto 0' }}>
              Choose your account type to get started with the best student housing network.
            </p>
          </div>
          
          {/* Registration Cards */}
          <div className="registration-cards">
            {/* SLIIT Student Card */}
            <div className="registration-card purple">
              <div className="card-header">
                <span className="card-badge purple">SLIIT STUDENT</span>
              </div>
              <h2 className="card-title">SLIIT Student</h2>
              <p className="card-description">
                Exclusive academic housing options curated specifically for SLIIT university students with verified institutional benefits.
              </p>
              <ul className="card-features">
                <li className="feature-item">
                  <svg className="feature-icon purple" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Free Registration</span>
                </li>
                <li className="feature-item">
                  <svg className="feature-icon purple" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>SLIIT Email Verification</span>
                </li>
                <li className="feature-item">
                  <svg className="feature-icon purple" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Instant Access</span>
                </li>
              </ul>
              <button 
                className="register-btn purple"
                onClick={() => navigate('/register/sliit-student')}
              >
                Register as SLIIT Student
              </button>
            </div>

            {/* External Student Card */}
            <div className="registration-card lightblue">
              <div className="card-header">
                <span className="card-badge lightblue">EXTERNAL STUDENT</span>
              </div>
              <h2 className="card-title">External Student</h2>
              <p className="card-description">
                Join the premier academic housing network. Access premium stays and community features across all listed locations.
              </p>
              <ul className="card-features">
                <li className="feature-item">
                  <svg className="feature-icon lightblue" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Full Access to All Properties</span>
                </li>
                <li className="feature-item">
                  <svg className="feature-icon lightblue" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Instant Activation</span>
                </li>
                <li className="feature-item">
                  <svg className="feature-icon lightblue" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Rs.1000/Year Subscription</span>
                </li>
              </ul>
              <button 
                className="register-btn lightblue"
                onClick={() => navigate('/register/external-student')}
              >
                Register as External Student
              </button>
            </div>

            {/* Vendor Card */}
            <div className="registration-card blue">
              <div className="card-header">
                <span className="card-badge blue">VENDOR SETUP</span>
              </div>
              <h2 className="card-title">Partner with Unistay</h2>
              <p className="card-description">
                Scale your business within the student housing ecosystem. Reach thousands of verified students instantly.
              </p>
              <ul className="card-features">
                <li className="feature-item">
                  <svg className="feature-icon blue" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Vendor Dashboard</span>
                </li>
                <li className="feature-item">
                  <svg className="feature-icon blue" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Business Analytics</span>
                </li>
                <li className="feature-item">
                  <svg className="feature-icon blue" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Rs.1000/Year Subscription</span>
                </li>
              </ul>
              <button 
                className="register-btn blue"
                onClick={() => navigate('/register/vendor')}
              >
                Register as Vendor
              </button>
            </div>
          </div>

          {/* Help Section */}
          <div className="help-section">
            <div className="help-content">
              <h3 className="help-title">Need help choosing?</h3>
              <p className="help-description">
                Our support team is available 24/7 to guide you through the registration process and answer any questions about our housing tiers.
              </p>
            </div>
            <button 
              className="help-btn"
              onClick={() => navigate('/contact')}
            >
              Contact Admissions
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default RegisterSelection;
