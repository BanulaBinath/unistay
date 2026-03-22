import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
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
    { value: '', label: 'Select category' },
    { value: 'food', label: 'Food Services' },
    { value: 'boarding', label: 'Boarding/Accommodation' },
    { value: 'laundry', label: 'Laundry Services' },
    { value: 'cleaning', label: 'Cleaning Services' }
  ];

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
    }

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email';
    }

    if (!formData.vendorType) {
      newErrors.vendorType = 'Please select a vendor type';
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
    <div className="vendor-register-container">
      <div className="vendor-register-wrapper">
        {/* Left Side */}
        <div className="vendor-register-left">
          <div className="vendor-badge">🤝 STEP 1 OF 2 (VENDOR SETUP)</div>
          <h1 className="vendor-title">Partner with Unistay</h1>
          <p className="vendor-description">
            Join an exclusive network of high-end academic service providers. Scale your business within the prestigious student housing ecosystem.
          </p>

          <div className="progress-section">
            <div className="progress-header">
              <span className="progress-label">REGISTRATION PROGRESS</span>
              <span className="progress-step">50% Complete</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '50%' }}></div>
            </div>
          </div>

          <div className="feature-list">
            <div className="feature-item">
              <div className="feature-icon">💳</div>
              <div>
                <h3>Seamless Activation</h3>
                <p>Profile activates instantly upon payment success.</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">📊</div>
              <div>
                <h3>Vendor Insights</h3>
                <p>Access detailed dashboard analytics for your academic market share.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="vendor-register-right">
          <form onSubmit={handleSubmit} className="vendor-register-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fullName">FULL NAME</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="Alexander Sterling"
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
                  placeholder="Sterling Gourmet Services"
                  value={formData.businessName}
                  onChange={handleChange}
                  className={errors.businessName ? 'error' : ''}
                />
                {errors.businessName && <span className="error-text">{errors.businessName}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">BUSINESS EMAIL</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="alex@sterling.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

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
            </div>

            <div className="form-row">
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

            <div className="form-group">
              <label>ASSIGNED ROLE</label>
              <div className="role-display">
                <span className="role-icon">🏢</span>
                <span className="role-text">Vendor</span>
              </div>
            </div>

            {apiError && (
              <div className="api-error-message">
                {apiError}
              </div>
            )}

            <div className="subscription-info">
              <div className="info-icon">ℹ️</div>
              <div className="info-content">
                <h4>Annual business subscription activation required.</h4>
                <p>Registration provides access to the Unistay Vendor Slate interface and institutional market tools.</p>
              </div>
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Register & Pay for Activation →'}
            </button>

            <div className="terms-text">
              By registering, you agree to our <a href="/guidelines">Institutional Guidelines</a> and <a href="/terms">Terms of Service</a>.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default VendorRegister;
