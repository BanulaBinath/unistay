import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import './ExternalStudentRegister.css';

function ExternalStudentRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    setApiError('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (/\d/.test(formData.fullName)) {
      newErrors.fullName = 'Full name cannot contain numbers';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Personal email must contain "@"';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email';
    } else if (formData.email.endsWith('@my.sliit.lk')) {
      newErrors.email = 'SLIIT students should use the SLIIT registration form';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.registerExternalStudent({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });

      if (response.success) {
        // Navigate to payment page
        navigate('/payment/process', {
          state: {
            userId: response.data.userId,
            email: response.data.email,
            paymentSession: response.data.paymentSession,
            userType: 'external_student'
          }
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response?.data?.errors) {
        const apiErrors = {};
        error.response.data.errors.forEach(err => {
          apiErrors[err.field] = err.message;
        });
        setErrors(apiErrors);
      } else {
        setApiError(error.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="external-register-container">
        <div className="external-register-wrapper">
          {/* Left Side - Purple Section */}
          <div className="external-register-left">
            <div className="external-badge">EXTERNAL STUDENT</div>
            
            <h1 className="external-title">External Student Enrollment</h1>
            
            <p className="external-description">
              Join the premier academic housing network. Secure your place in high-standard accommodation curated for serious scholars.
            </p>

            <p className="external-description-secondary">
              Access premium stays and community features across all listed locations. Your profile activates instantly upon payment confirmation.
            </p>

            <div className="external-insights-card">
              <div className="insights-header">
                <div className="insights-title-section">
                  <span className="insights-label">PREMIUM ACCESS</span>
                  <h3>Network Coverage</h3>
                </div>
                <div className="insights-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              
              <div className="insights-chart">
                <div className="chart-bar" style={{ height: '50%' }}></div>
                <div className="chart-bar" style={{ height: '70%' }}></div>
                <div className="chart-bar" style={{ height: '60%' }}></div>
                <div className="chart-bar" style={{ height: '85%' }}></div>
                <div className="chart-bar" style={{ height: '75%' }}></div>
                <div className="chart-bar" style={{ height: '95%' }}></div>
              </div>
              
              <p className="insights-footer">Access to 200+ verified properties across 15 locations</p>
            </div>
          </div>

          {/* Right Side - Form Section */}
          <div className="external-register-right">
            <div className="form-header">
              <h2>Create Premium Account</h2>
              <p>Complete the details below to unlock full access</p>
            </div>

            <div className="form-card">
              <form onSubmit={handleSubmit} className="external-register-form">
                <div className="form-row-two">
                  <div className="form-group">
                    <label htmlFor="fullName">FULL NAME</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      placeholder="Alexander Thorne"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={errors.fullName ? 'error' : ''}
                    />
                    {errors.fullName && <span className="error-text">{errors.fullName}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">PERSONAL EMAIL</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="alex.thorne@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>
                </div>

                <div className="form-row-two">
                  <div className="form-group">
                    <label htmlFor="password">PASSWORD</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className={errors.password ? 'error' : ''}
                    />
                    {errors.password && <span className="error-text">{errors.password}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">CONFIRM PASSWORD</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={errors.confirmPassword ? 'error' : ''}
                    />
                    {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                  </div>
                </div>

                {apiError && (
                  <div className="api-error-message">
                    {apiError}
                  </div>
                )}

                <div className="subscription-info">
                  <div className="subscription-header">
                    <span className="subscription-label">Annual Subscription</span>
                    <span className="subscription-price">Rs.1000<span className="price-period">/YEAR</span></span>
                  </div>
                  <p className="subscription-description">
                    Billed once a year. Full access to all properties and premium features.
                  </p>
                </div>

                <div className="form-footer-new">
                  <div className="form-footer-left">
                    <div className="info-text">
                      🔒 Bank-grade 256-bit encryption. PCI DSS compliant payment processing.
                    </div>

                    <div className="signin-link">
                      By registering, you agree to our <a href="/terms">Terms of Service</a>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Register & Pay Subscription'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ExternalStudentRegister;
