import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import Navbar from '../common/Navbar';
import './VendorRegister.css';

function VendorRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    email: '',
    vendorType: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const vendorTypes = [
    { value: '', label: 'Select your business category' },
    { value: 'food', label: 'Food Services' },
    { value: 'boarding', label: 'Boarding/Accommodation' },
    { value: 'laundry', label: 'Laundry Services' },
    { value: 'cleaning', label: 'Cleaning Services' }
  ];

  const validatePassword = (pwd) => {
    if (!pwd) return 'Password is required';
    if (pwd.length < 8) return 'At least 8 characters required';
    if (!/[A-Z]/.test(pwd)) return 'At least one uppercase letter';
    if (!/[a-z]/.test(pwd)) return 'At least one lowercase letter';
    if (!/[0-9]/.test(pwd)) return 'At least one number required';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) return 'At least one special character';
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'password') {
      const pwdError = validatePassword(value);
      setErrors(prev => ({
        ...prev,
        password: pwdError
      }));
    } else if (errors[name]) {
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

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Business email must contain "@"';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email';
    }

    if (!formData.vendorType) {
      newErrors.vendorType = 'Please select a vendor type';
    }

    const pwdError = validatePassword(formData.password);
    if (pwdError) {
      newErrors.password = pwdError;
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
      const response = await authAPI.registerVendor({
        fullName: formData.fullName,
        businessName: formData.businessName,
        email: formData.email,
        vendorType: formData.vendorType,
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
            userType: 'vendor',
            vendorType: response.data.vendorType
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
      <div className="vendor-register-container">
        <div className="vendor-register-wrapper">
          {/* Left Side - Blue Section */}
          <div className="vendor-register-left">
            <div className="vendor-badge">VENDOR SETUP</div>
            
            <h1 className="vendor-title">Partner with Unistay</h1>
            
            <p className="vendor-description">
              Join the premier network for academic search services and grow your business with our global student community. 
            </p>

            <p className="vendor-description-secondary">
              Access advanced analytics, automated booking systems, and dedicated support to scale your operations efficiently across multiple locations.
            </p>

            <div className="vendor-insights-card">
              <div className="insights-header">
                <div className="insights-title-section">
                  <span className="insights-label">VENDOR INSIGHTS</span>
                  <h3>Growth Metrics</h3>
                </div>
                <div className="insights-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              
              <div className="insights-chart">
                <div className="chart-bar" style={{ height: '35%' }}></div>
                <div className="chart-bar" style={{ height: '55%' }}></div>
                <div className="chart-bar" style={{ height: '45%' }}></div>
                <div className="chart-bar" style={{ height: '75%' }}></div>
                <div className="chart-bar" style={{ height: '60%' }}></div>
                <div className="chart-bar" style={{ height: '85%' }}></div>
              </div>
              
              <p className="insights-footer">Average partner growth: +34% per quarter</p>
            </div>
          </div>

          {/* Right Side - Form Section */}
          <div className="vendor-register-right">
            <div className="form-header">
              <h2>Create Vendor Account</h2>
              <p>Complete the details below to begin your partnership</p>
            </div>

            <div className="form-card">
              <form onSubmit={handleSubmit} className="vendor-register-form">
              <div className="form-row-three">
                <div className="form-group">
                  <label htmlFor="fullName">FULL NAME</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={errors.fullName ? 'error' : ''}
                  />
                  {errors.fullName && <span className="error-text">{errors.fullName}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="businessName">BUSINESS NAME</label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    placeholder="Sanctuary Livings Ltd"
                    value={formData.businessName}
                    onChange={handleChange}
                    className={errors.businessName ? 'error' : ''}
                  />
                  {errors.businessName && <span className="error-text">{errors.businessName}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">BUSINESS EMAIL</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="partners@yourcompany.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>
              </div>

              <div className="form-row-three">
                <div className="form-group">
                  <label htmlFor="vendorType">VENDOR TYPE</label>
                  <select
                    id="vendorType"
                    name="vendorType"
                    value={formData.vendorType}
                    onChange={handleChange}
                    className={errors.vendorType ? 'error' : ''}
                  >
                    {vendorTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {errors.vendorType && <span className="error-text">{errors.vendorType}</span>}
                </div>

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
                  Billed once a year. Full access to vendor dashboard and business analytics.
                </p>
              </div>

              <div className="form-footer-new">
                <div className="form-footer-left">
                  <label className="checkbox-container">
                    <input type="checkbox" required />
                    <span className="checkmark"></span>
                    <span className="checkbox-label">
                      I agree to the <a href="/terms">Partner Terms</a> and <a href="/privacy">Privacy Policy</a>
                    </span>
                  </label>

                  <div className="signin-link">
                    Already a partner? <a href="/login">Sign In to Dashboard</a>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Register & Pay'}
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

export default VendorRegister;
