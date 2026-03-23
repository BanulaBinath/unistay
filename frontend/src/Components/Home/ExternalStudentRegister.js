import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
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
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
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
    <div className="external-register-container">
      <div className="external-register-wrapper">
        {/* Left Side */}
        <div className="external-register-left">
          <div className="external-badge">ENROLLMENT PHASE</div>
          <h1 className="external-title">External Student Enrollment</h1>
          <p className="external-description">
            Join the premier academic housing network. Secure your place in high-standard accommodation curated for serious scholars.
          </p>

          <div className="progress-section">
            <div className="progress-header">
              <span className="progress-label">Step 1 of 2: Registration</span>
              <span className="progress-step">50% Complete</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '50%' }}></div>
            </div>
          </div>

          <div className="feature-box">
            <div className="feature-icon">⚡</div>
            <h3>Instant Activation</h3>
            <p>Profile activates instantly upon payment success. Your academic journey begins the moment your subscription is confirmed.</p>
          </div>

          <div className="security-badge">
            <span className="security-icon">🔒</span>
            <span>Bank-grade 256-bit encryption</span>
          </div>
        </div>

        {/* Right Side */}
        <div className="external-register-right">
          <form onSubmit={handleSubmit} className="external-register-form">
            <div className="form-header">
              <div className="form-group-inline">
                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    placeholder="e.g. Alexander Thorne"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={errors.fullName ? 'error' : ''}
                  />
                  {errors.fullName && <span className="error-text">{errors.fullName}</span>}
                </div>

                <div className="form-group">
                  <label>Account Role</label>
                  <div className="role-display">
                    <span>student_external</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Personal Email</label>
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

            <div className="form-group-inline">
              <div className="form-group">
                <label htmlFor="password">Password</label>
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
                <label htmlFor="confirmPassword">Confirm Password</label>
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
                <span>Annual subscription activation required.</span>
                <span className="subscription-price">$120<span className="price-period">/ YEAR</span></span>
              </div>
              <p className="subscription-description">
                Billed once a year. Full access to all properties.
              </p>
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              <span className="btn-icon">💳</span>
              {loading ? 'Processing...' : 'Register & Pay Annual Subscription'}
            </button>

            <div className="payment-badges">
              <div className="payment-badge">💳</div>
              <div className="payment-badge">💳</div>
              <span className="pci-text">PCI DSS COMPLIANT</span>
            </div>

            <div className="terms-text">
              By clicking register, you agree to our <a href="/terms">Terms of Service</a> and <a href="/guidelines">Institutional Guidelines</a>.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ExternalStudentRegister;
