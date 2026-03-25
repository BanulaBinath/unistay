import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import './Home.css';

function NomalHome() {
  const location = useLocation();

  return (
    <div className="home-page">
      <Navbar />
      {location.state?.orderSuccess && (
        <div className="home-order-success">
          {location.state.orderMessage || 'Order placed successfully.'}
        </div>
      )}
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Your academic <span className="hero-highlight">sanctuary</span> awaits.
            </h1>
            <p className="hero-subtitle">
              Unistay helps you spend less time managing essentials and more time focusing on what matters most - your education.
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="btn-primary">
                Get Started Now
              </Link>
              <Link to="/services" className="btn-secondary">
                <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="section-container">
          <div className="services-header">
            <div className="services-header-decoration"></div>
            <h2 className="section-title">Elevated living for the modern student.</h2>
            <p className="services-subtitle">Comprehensive solutions designed to enhance your academic journey</p>
          </div>
          <div className="services-grid">
            <div className="service-card service-card-food">
              <div className="service-card-glow"></div>
              <div className="service-icon-wrapper">
                <div className="service-icon-box">
                  <svg className="service-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h18v18H3V3zm9 9h6m-6 0H6m6 0V6m0 6v6" />
                  </svg>
                </div>
                <div className="service-icon-bg"></div>
              </div>
              
            <Link to="/services">
              <div className="service-content">
                <h3 className="service-title">Food</h3>
                <p className="service-description">
                  Delicious and nutritious meals delivered right to your doorstep. Choose from a variety of cuisines.
                </p>
              </div>
              </Link>
              <div className="service-card-pattern"></div>
            </div>
            <div className="service-card service-card-boarding">
              <div className="service-card-glow"></div>
              <div className="service-icon-wrapper">
                <div className="service-icon-box">
                  <svg className="service-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div className="service-icon-bg"></div>
              </div>
              <div className="service-content">
                <h3 className="service-title">Boarding</h3>
                <p className="service-description">
                  Comfortable and affordable accommodation options near your campus with all amenities included.
                </p>
              </div>
              <div className="service-card-pattern"></div>
            </div>
            <div className="service-card service-card-laundry">
              <div className="service-card-glow"></div>
              <div className="service-icon-wrapper">
                <div className="service-icon-box">
                  <svg className="service-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="service-icon-bg"></div>
              </div>
              <div className="service-content">
                <h3 className="service-title">Laundry</h3>
                <p className="service-description">
                  Professional laundry services that save you time. Pick-up and delivery at your convenience.
                </p>
              </div>
              <div className="service-card-pattern"></div>
            </div>
            <div className="service-card service-card-cleaning">
              <div className="service-card-glow"></div>
              <div className="service-icon-wrapper">
                <div className="service-icon-box">
                  <svg className="service-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div className="service-icon-bg"></div>
              </div>
              <div className="service-content">
                <h3 className="service-title">Cleaning</h3>
                <p className="service-description">
                  Keep your living space spotless with our reliable cleaning services. Flexible scheduling available.
                </p>
              </div>
              <div className="service-card-pattern"></div>
            </div>
          </div>
        </div>
      </section>

      {/* The Unistay Journey Section */}
      <section className="journey-section">
        <div className="section-container">
          <div className="journey-header">
            <span className="journey-badge">How It Works</span>
            <h2 className="section-title">The Unistay Journey</h2>
            <p className="journey-subtitle">Three simple steps to transform your student life</p>
          </div>
          <div className="journey-grid">
            <div className="journey-card journey-card-1">
              <div className="journey-number">01</div>
              <div className="journey-icon-container">
                <div className="journey-icon-circle">
                  <svg className="journey-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 11l5 5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 11l-5 5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="journey-icon-glow"></div>
              </div>
              <div className="journey-content">
                <h3 className="journey-title">Register</h3>
                <p className="journey-description">
                  Create your account in minutes. It's quick, easy, and completely free to get started.
                </p>
              </div>
              <div className="journey-connector"></div>
            </div>
            <div className="journey-card journey-card-2">
              <div className="journey-number">02</div>
              <div className="journey-icon-container">
                <div className="journey-icon-circle">
                  <svg className="journey-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="3" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
                    <rect x="14" y="3" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
                    <rect x="14" y="14" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
                    <rect x="3" y="14" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="journey-icon-glow"></div>
              </div>
              <div className="journey-content">
                <h3 className="journey-title">Browse & Select</h3>
                <p className="journey-description">
                  Explore our verified providers and choose the services that fit your needs and budget.
                </p>
              </div>
              <div className="journey-connector"></div>
            </div>
            <div className="journey-card journey-card-3">
              <div className="journey-number">03</div>
              <div className="journey-icon-container">
                <div className="journey-icon-circle">
                  <svg className="journey-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="journey-icon-glow"></div>
              </div>
              <div className="journey-content">
                <h3 className="journey-title">Live Better</h3>
                <p className="journey-description">
                  Enjoy a seamless student life while we handle the essentials. Focus on your studies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="why-choose-section">
        <div className="section-container">
          <div className="why-choose-header">
            <h2 className="section-title">Why the World's Brightest Choose Unistay</h2>
            <p className="why-choose-subtitle">Discover the features that make us the preferred choice for students worldwide</p>
          </div>
          <div className="features-grid">
            <div className="feature-card feature-card-light">
              <div className="feature-icon-wrapper">
                <svg className="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <div className="feature-content">
                <span className="feature-badge">Core Platform</span>
                <h3 className="feature-title">Unified Ecosystem</h3>
                <p className="feature-description">
                  All your student support services in one place. No more juggling multiple apps and contacts. Seamlessly manage food, boarding, laundry, and cleaning services from a single platform.
                </p>
                <div className="feature-stats">
                  <div className="feature-stat">
                    <span className="feature-stat-value">4+</span>
                    <span className="feature-stat-label">Services</span>
                  </div>
                  <div className="feature-stat">
                    <span className="feature-stat-value">1</span>
                    <span className="feature-stat-label">Platform</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="feature-card feature-card-light">
              <div className="feature-icon-wrapper">
                <svg className="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div className="feature-content">
                <span className="feature-badge">Pricing</span>
                <h3 className="feature-title">Subscription Clarity</h3>
                <p className="feature-description">
                  Transparent pricing with flexible subscription plans. No hidden fees, no surprises. Choose monthly or semester-based plans that fit your budget and lifestyle perfectly.
                </p>
                <div className="feature-stats">
                  <div className="feature-stat">
                    <span className="feature-stat-value">100%</span>
                    <span className="feature-stat-label">Transparent</span>
                  </div>
                  <div className="feature-stat">
                    <span className="feature-stat-value">0</span>
                    <span className="feature-stat-label">Hidden Fees</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="feature-card feature-card-light">
              <div className="feature-icon-wrapper">
                <svg className="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="feature-content">
                <span className="feature-badge">Security</span>
                <h3 className="feature-title">Verified Providers</h3>
                <p className="feature-description">
                  We vet every provider to ensure quality, reliability, and safety for our student community. All vendors undergo thorough background checks and quality assessments.
                </p>
                <div className="feature-stats">
                  <div className="feature-stat">
                    <span className="feature-stat-value">100%</span>
                    <span className="feature-stat-label">Verified</span>
                  </div>
                  <div className="feature-stat">
                    <span className="feature-stat-value">24/7</span>
                    <span className="feature-stat-label">Monitoring</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="feature-card feature-card-light">
              <div className="feature-icon-wrapper">
                <svg className="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="feature-content">
                <span className="feature-badge">Support</span>
                <h3 className="feature-title">Dedicated Complaint Support</h3>
                <p className="feature-description">
                  Dedicated support team ready to help. Quick resolution for any issues you encounter. Our 24/7 support ensures your concerns are addressed promptly and professionally.
                </p>
                <div className="feature-stats">
                  <div className="feature-stat">
                    <span className="feature-stat-value">&lt;2h</span>
                    <span className="feature-stat-label">Response Time</span>
                  </div>
                  <div className="feature-stat">
                    <span className="feature-stat-value">98%</span>
                    <span className="feature-stat-label">Satisfaction</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">Need a custom plan?</h2>
            <p className="cta-description">
              Join thousands of students who trust Unistay for their daily needs. Start your journey with us today and experience the difference.
            </p>
            <Link to="/register" className="cta-button">
              Schedule a call
            </Link>
          </div>
          <div className="cta-visual">
            <div className="cta-icon-circle">
              <svg className="cta-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default NomalHome;
