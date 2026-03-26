import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
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
    } else if (/\d/.test(formData.fullName)) {
      newErrors.fullName = 'Full name cannot contain numbers';
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
    <>
      <Navbar />
      <div className="sliit-register-container">
        <div className="sliit-register-wrapper">
          {/* Left Side - Emerald Section */}
          <div className="sliit-register-left">
            <div className="sliit-badge">SLIIT STUDENT</div>
            
            <h1 className="sliit-title">Join Unistay as a SLIIT Student</h1>
            
            <p className="sliit-description">
              Access exclusive academic housing near Malabe campus. Verified listings curated specifically for the SLIIT community.
            </p>

            <p className="sliit-description-secondary">
              Register with your institutional email for instant access to campus-adjacent hostels, private stays, and verified accommodation partners.
            </p>

            <div className="sliit-insights-card">
              <div className="insights-header">
                <div className="insights-title-section">
                  <span className="insights-label">STUDENT BENEFITS</span>
                  <h3>Campus Proximity</h3>
                </div>
                <div className="insights-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              
              <div className="insights-chart">
                <div className="chart-bar" style={{ height: '45%' }}></div>
                <div className="chart-bar" style={{ height: '65%' }}></div>
                <div className="chart-bar" style={{ height: '55%' }}></div>
                <div className="chart-bar" style={{ height: '80%' }}></div>
                <div className="chart-bar" style={{ height: '70%' }}></div>
                <div className="chart-bar" style={{ height: '90%' }}></div>
              </div>
              
              <p className="insights-footer">95% of SLIIT students find housing within 2km of campus</p>
            </div>
          </div>

          {/* Right Side - Form Section */}
          <div className="sliit-register-right">
            <div className="form-header">
              <h2>Create Student Account</h2>
              <p>Complete the details below to access exclusive housing</p>
            </div>

            <div className="form-card">
              <form onSubmit={handleSubmit} className="sliit-register-form">
                <div className="form-row-two">
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
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="it21000000@my.sliit.lk"
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

                <div className="form-footer-new">
                  <div className="form-footer-left">
                    <div className="info-text">
                      ℹ️ Use your SLIIT student email (@my.sliit.lk) to register for free access.
                    </div>

                    <div className="signin-link">
                      Already have an account? <a href="/login">Sign In</a>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Generate OTP & Register'}
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

export default SLIITStudentRegister;
