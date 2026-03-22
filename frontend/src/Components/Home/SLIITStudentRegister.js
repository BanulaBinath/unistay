import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import './SLIITStudentRegister.css';

function SLIITStudentRegister() {
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
    // Clear error for this field
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
    } else if (!formData.email.endsWith('@my.sliit.lk')) {
      newErrors.email = 'Please use your SLIIT student email (@my.sliit.lk)';
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
      const response = await authAPI.registerSLIITStudent({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });

      if (response.success) {
        // Navigate to OTP verification page
        navigate('/verify-otp', { 
          state: { 
            email: formData.email,
            fullName: formData.fullName
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
    <div className="sliit-register-container">
      <div className="sliit-register-wrapper">
        {/* Left Side - Info */}
        <div className="sliit-register-left">
          <div className="sliit-badge">🎓 INSTITUTIONAL PARTNER: SLIIT</div>
          <h1 className="sliit-title">Join Unistay as a SLIIT Student</h1>
          <p className="sliit-description">
            Access exclusive academic housing near Malabe campus. Verified listings curated for the SLIIT community.
          </p>

          <div className="progress-section">
            <div className="progress-header">
              <span className="progress-label">PROGRESS</span>
              <span className="progress-step">STEP 1 OF 2</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '50%' }}></div>
            </div>
            <p className="progress-text">Registration in progress</p>
          </div>

          <div className="advantage-box">
            <div className="advantage-icon">🛡️</div>
            <h3>SLIIT Verified Advantage</h3>
            <p>Registration with your institutional email unlocks immediate access to campus-adjacent hostels and private stays.</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="sliit-register-right">
          <form onSubmit={handleSubmit} className="sliit-register-form">
            <div className="form-group">
              <label>ACCOUNT ROLE</label>
              <div className="role-display">
                <span className="role-icon">🎓</span>
                <span className="role-text">student_sliit</span>
                <span className="role-badge">FIXED</span>
              </div>
            </div>

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
              <label htmlFor="email">SLIIT STUDENT EMAIL</label>
              <div className="email-input-wrapper">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="it21000000@my.sliit.lk"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                />
                <span className="email-icon">@</span>
              </div>
              <p className="input-hint">ℹ️ Use your SLIIT student email to register for free.</p>
              {errors.email && <span className="error-text">{errors.email}</span>}
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

            {apiError && (
              <div className="api-error-message">
                {apiError}
              </div>
            )}

            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Generate OTP & Register →'}
            </button>

            <div className="form-footer">
              <p className="already-account">ALREADY HAVE AN ACCOUNT?</p>
              <button 
                type="button" 
                className="signin-btn"
                onClick={() => navigate('/login')}
              >
                Sign In
              </button>
            </div>

            <div className="help-section">
              <span className="help-icon">❓</span>
              <span className="help-text">Need help with registration?</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SLIITStudentRegister;
