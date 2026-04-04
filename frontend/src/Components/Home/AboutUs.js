import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import './AboutUs.css';

function AboutUs() {
  return (
    <div className="about-page">
      <Navbar />
      
      {/* Hero Section */}
      <section className="about-hero-section">
        <div className="about-hero-container">
          <div className="about-hero-content">
            <span className="about-hero-badge">ABOUT UNISTAY</span>
            <h1 className="about-hero-title">
              Redefining <span className="about-hero-highlight">student living</span> for the modern era.
            </h1>
            <p className="about-hero-subtitle">
              We're building the most trusted platform connecting students with quality accommodation 
              and essential services, making campus life simpler and more focused on what truly matters.
            </p>
            <div className="about-hero-buttons">
              <Link to="/register" className="about-btn-primary">
                Join Our Community
              </Link>
              <Link to="/contact" className="about-btn-secondary">
                Get in Touch
              </Link>
            </div>
          </div>
          <div className="about-hero-stats">
            <div className="about-stat-card">
              <div className="about-stat-value">2,500+</div>
              <div className="about-stat-label">Active Students</div>
            </div>
            <div className="about-stat-card">
              <div className="about-stat-value">150+</div>
              <div className="about-stat-label">Verified Vendors</div>
            </div>
            <div className="about-stat-card">
              <div className="about-stat-value">98%</div>
              <div className="about-stat-label">Satisfaction Rate</div>
            </div>
            <div className="about-stat-card">
              <div className="about-stat-value">24/7</div>
              <div className="about-stat-label">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="about-story-section">
        <div className="about-section-container">
          <div className="about-story-grid">
            <div className="about-story-content">
              <div className="about-section-decoration"></div>
              <h2 className="about-section-title">Our Story</h2>
              <p className="about-story-text">
                UniStay was born from a simple observation: students deserve better. Better housing options, 
                better service connections, and better support systems that understand the unique challenges 
                of academic life.
              </p>
              <p className="about-story-text">
                Founded by former students who experienced these challenges firsthand, we've built a platform 
                that bridges the gap between students and quality service providers. Our mission is to create 
                an ecosystem where students can focus on their education while we handle the essentials.
              </p>
              <p className="about-story-text">
                Today, UniStay serves thousands of students across multiple institutions, connecting them with 
                verified vendors for accommodation, food, laundry, and cleaning services—all through one 
                seamless platform.
              </p>
            </div>
            <div className="about-story-visual">
              <div className="about-story-card about-story-card-1">
                <svg className="about-story-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <h3>Student-Centered</h3>
                <p>Built by students, for students</p>
              </div>
              <div className="about-story-card about-story-card-2">
                <svg className="about-story-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <h3>Verified Quality</h3>
                <p>Every vendor thoroughly vetted</p>
              </div>
              <div className="about-story-card about-story-card-3">
                <svg className="about-story-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h3>Fast & Simple</h3>
                <p>Streamlined for busy students</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="about-mission-section">
        <div className="about-section-container">
          <div className="about-mission-grid">
            <div className="about-mission-card about-mission-card-primary">
              <div className="about-mission-icon-wrapper">
                <svg className="about-mission-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h2 className="about-mission-title">Our Mission</h2>
              <p className="about-mission-text">
                To empower students by simplifying their daily lives through a trusted, comprehensive platform 
                that connects them with quality accommodation and essential services. We're committed to creating 
                an environment where students can thrive academically without the stress of managing life's basics.
              </p>
            </div>
            <div className="about-mission-card about-mission-card-secondary">
              <div className="about-mission-icon-wrapper">
                <svg className="about-mission-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h2 className="about-mission-title">Our Vision</h2>
              <p className="about-mission-text">
                To become the leading student support ecosystem globally, where every student has access to 
                safe, affordable, and quality living solutions. We envision a future where student accommodation 
                and services are seamlessly integrated, transparent, and student-first.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="about-offer-section">
        <div className="about-section-container">
          <div className="about-offer-header">
            <h2 className="about-section-title">What We Offer</h2>
            <p className="about-offer-subtitle">
              Comprehensive solutions designed to make student life easier and more productive
            </p>
          </div>
          <div className="about-offer-grid">
            <div className="about-offer-card">
              <div className="about-offer-icon-box about-offer-icon-blue">
                <svg className="about-offer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="about-offer-title">Verified Accommodation</h3>
              <p className="about-offer-description">
                Access to pre-vetted, quality student housing near campus with transparent pricing and 
                verified safety standards.
              </p>
            </div>
            <div className="about-offer-card">
              <div className="about-offer-icon-box about-offer-icon-orange">
                <svg className="about-offer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h18v18H3V3zm9 9h6m-6 0H6m6 0V6m0 6v6" />
                </svg>
              </div>
              <h3 className="about-offer-title">Food Services</h3>
              <p className="about-offer-description">
                Connect with trusted food vendors offering nutritious meals delivered right to your doorstep 
                with flexible plans.
              </p>
            </div>
            <div className="about-offer-card">
              <div className="about-offer-icon-box about-offer-icon-teal">
                <svg className="about-offer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="about-offer-title">Laundry & Cleaning</h3>
              <p className="about-offer-description">
                Professional laundry and cleaning services with convenient scheduling, saving you time 
                for what matters most.
              </p>
            </div>
            <div className="about-offer-card">
              <div className="about-offer-icon-box about-offer-icon-purple">
                <svg className="about-offer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="about-offer-title">Support System</h3>
              <p className="about-offer-description">
                Dedicated complaint resolution and 24/7 support to ensure your concerns are addressed 
                promptly and professionally.
              </p>
            </div>
            <div className="about-offer-card">
              <div className="about-offer-icon-box about-offer-icon-indigo">
                <svg className="about-offer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="about-offer-title">Secure Platform</h3>
              <p className="about-offer-description">
                Secure payment processing, verified user accounts, and data protection ensuring your 
                information stays safe.
              </p>
            </div>
            <div className="about-offer-card">
              <div className="about-offer-icon-box about-offer-icon-pink">
                <svg className="about-offer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="about-offer-title">Transparent Pricing</h3>
              <p className="about-offer-description">
                Clear, upfront pricing with flexible subscription plans and no hidden fees. Budget-friendly 
                options for students.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="about-why-section">
        <div className="about-section-container">
          <div className="about-why-header">
            <h2 className="about-section-title">Why Choose UniStay</h2>
            <p className="about-why-subtitle">
              The advantages that make us the preferred choice for students
            </p>
          </div>
          <div className="about-why-grid">
            <div className="about-why-item">
              <div className="about-why-number">01</div>
              <div className="about-why-content">
                <h3 className="about-why-title">Student-First Approach</h3>
                <p className="about-why-text">
                  Every feature, every policy, every decision is made with student needs at the forefront. 
                  We understand academic life because we've lived it.
                </p>
              </div>
            </div>
            <div className="about-why-item">
              <div className="about-why-number">02</div>
              <div className="about-why-content">
                <h3 className="about-why-title">Verified Ecosystem</h3>
                <p className="about-why-text">
                  All vendors undergo rigorous verification. We ensure quality, safety, and reliability 
                  so you can trust every service on our platform.
                </p>
              </div>
            </div>
            <div className="about-why-item">
              <div className="about-why-number">03</div>
              <div className="about-why-content">
                <h3 className="about-why-title">Multi-Role Support</h3>
                <p className="about-why-text">
                  Whether you're a SLIIT student, external student, or vendor, our platform adapts to 
                  your specific needs with tailored features.
                </p>
              </div>
            </div>
            <div className="about-why-item">
              <div className="about-why-number">04</div>
              <div className="about-why-content">
                <h3 className="about-why-title">Seamless Experience</h3>
                <p className="about-why-text">
                  Modern, intuitive interface designed for efficiency. Manage all your services from 
                  one dashboard without complexity.
                </p>
              </div>
            </div>
            <div className="about-why-item">
              <div className="about-why-number">05</div>
              <div className="about-why-content">
                <h3 className="about-why-title">Trusted Community</h3>
                <p className="about-why-text">
                  Join thousands of students who rely on UniStay daily. Our growing community is built 
                  on trust, quality, and mutual support.
                </p>
              </div>
            </div>
            <div className="about-why-item">
              <div className="about-why-number">06</div>
              <div className="about-why-content">
                <h3 className="about-why-title">Responsive Support</h3>
                <p className="about-why-text">
                  24/7 support team ready to assist. Quick response times and dedicated complaint 
                  resolution ensure your issues are handled promptly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Journey Section */}
      <section className="about-journey-section">
        <div className="about-section-container">
          <div className="about-journey-header">
            <span className="about-journey-badge">HOW IT WORKS</span>
            <h2 className="about-section-title">Your UniStay Journey</h2>
            <p className="about-journey-subtitle">
              Four simple steps to transform your student living experience
            </p>
          </div>
          <div className="about-journey-timeline">
            <div className="about-journey-step">
              <div className="about-journey-step-number">
                <span>1</span>
              </div>
              <div className="about-journey-step-content">
                <h3 className="about-journey-step-title">Create Your Account</h3>
                <p className="about-journey-step-text">
                  Sign up as a SLIIT student, external student, or vendor. Quick registration with 
                  email verification to get started.
                </p>
              </div>
              <div className="about-journey-connector"></div>
            </div>
            <div className="about-journey-step">
              <div className="about-journey-step-number">
                <span>2</span>
              </div>
              <div className="about-journey-step-content">
                <h3 className="about-journey-step-title">Choose Your Services</h3>
                <p className="about-journey-step-text">
                  Browse verified accommodation options and service providers. Compare features, 
                  pricing, and reviews to find your perfect match.
                </p>
              </div>
              <div className="about-journey-connector"></div>
            </div>
            <div className="about-journey-step">
              <div className="about-journey-step-number">
                <span>3</span>
              </div>
              <div className="about-journey-step-content">
                <h3 className="about-journey-step-title">Manage Everything</h3>
                <p className="about-journey-step-text">
                  Access your personalized dashboard to manage bookings, track orders, submit 
                  complaints, and communicate with vendors.
                </p>
              </div>
              <div className="about-journey-connector"></div>
            </div>
            <div className="about-journey-step">
              <div className="about-journey-step-number">
                <span>4</span>
              </div>
              <div className="about-journey-step-content">
                <h3 className="about-journey-step-title">Focus on Studies</h3>
                <p className="about-journey-step-text">
                  With essentials handled, dedicate your time and energy to what matters most—your 
                  education and personal growth.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="about-values-section">
        <div className="about-section-container">
          <div className="about-values-header">
            <h2 className="about-section-title">Our Core Values</h2>
            <p className="about-values-subtitle">
              The principles that guide everything we do at UniStay
            </p>
          </div>
          <div className="about-values-grid">
            <div className="about-value-card">
              <div className="about-value-icon-wrapper">
                <svg className="about-value-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="about-value-title">Trust</h3>
              <p className="about-value-text">
                Building lasting relationships through transparency, reliability, and consistent quality 
                in every interaction.
              </p>
            </div>
            <div className="about-value-card">
              <div className="about-value-icon-wrapper">
                <svg className="about-value-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="about-value-title">Simplicity</h3>
              <p className="about-value-text">
                Making complex processes effortless. We believe the best solutions are intuitive and 
                straightforward.
              </p>
            </div>
            <div className="about-value-card">
              <div className="about-value-icon-wrapper">
                <svg className="about-value-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="about-value-title">Accessibility</h3>
              <p className="about-value-text">
                Ensuring every student, regardless of background, has access to quality accommodation 
                and services.
              </p>
            </div>
            <div className="about-value-card">
              <div className="about-value-icon-wrapper">
                <svg className="about-value-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="about-value-title">Student-First</h3>
              <p className="about-value-text">
                Every decision prioritizes student needs, well-being, and academic success above all else.
              </p>
            </div>
            <div className="about-value-card">
              <div className="about-value-icon-wrapper">
                <svg className="about-value-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="about-value-title">Reliable Support</h3>
              <p className="about-value-text">
                Always available, always responsive. We're here when you need us, providing consistent 
                and dependable assistance.
              </p>
            </div>
            <div className="about-value-card">
              <div className="about-value-icon-wrapper">
                <svg className="about-value-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="about-value-title">Innovation</h3>
              <p className="about-value-text">
                Continuously improving and adapting to meet evolving student needs with modern solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta-section">
        <div className="about-cta-container">
          <div className="about-cta-content">
            <h2 className="about-cta-title">Ready to Transform Your Student Life?</h2>
            <p className="about-cta-description">
              Join thousands of students who trust UniStay for their accommodation and daily needs. 
              Start your journey with us today and experience the difference.
            </p>
            <div className="about-cta-buttons">
              <Link to="/register" className="about-cta-button-primary">
                Get Started Now
              </Link>
              <Link to="/contact" className="about-cta-button-secondary">
                Contact Support
              </Link>
            </div>
          </div>
          <div className="about-cta-visual">
            <div className="about-cta-icon-circle">
              <svg className="about-cta-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default AboutUs;
