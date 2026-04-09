import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import { FaHome, FaLifeRing } from 'react-icons/fa';
import './login.css';

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="20" height="20">
    <path d="M12 3.172 3 10.2V21h6v-6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6h6V10.2l-9-7.028Z" />
  </svg>
);

const ChatIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="20" height="20">
    <path d="M4 4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3v3a1 1 0 0 0 1.555.832L13.303 17H20a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H4Z" />
  </svg>
);

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
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

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
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
      const response = await authAPI.login(formData);

      if (response.success) {
        // Store token and user data
        login(response.data.user, response.data.token);

        // Redirect based on role
        const { role, vendorType } = response.data.user;

        if (role === 'admin') {
          navigate('/admin/dashboard');
        } else if (role === 'student_sliit' || role === 'student_external') {
          // Navigate to home page instead of dashboard for students
          navigate('/');
        } else if (role === 'vendor') {
          navigate(`/vendor/${vendorType}/dashboard`);
        }
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        const apiErrors = {};
        err.response.data.errors.forEach(e => {
          apiErrors[e.field] = e.message;
        });
        setErrors(apiErrors);
      } else {
        setApiError(
          err.response?.data?.message || 'Login failed. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Navbar />
      <div className="login-container">
        <div className="login-left">
          <h1 className="login-hero-title">
            Your <span className="highlight">Academic Sanctuary</span> Awaits
          </h1>
          <p className="login-hero-subtitle">
            Unistay helps you spend less time managing essentials and more time focusing on what matters most - your education.
          </p>
          
          <div className="feature-cards">
            <div className="feature-card">
              <div className="feature-icon-wrapper blue">
                <FaHome className="feature-icon" />
              </div>
              <div className="feature-content">
                <h3>Verified Student Housing</h3>
                <p>Pre-vetted for safety and academic proximity.</p>
              </div>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon-wrapper purple">
                <FaLifeRing className="feature-icon" />
              </div>
              <div className="feature-content">
                <h3>24/7 Support</h3>
                <p>Dedicated assistance for your sanctuary at any hour.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="login-right">
          <div className="login-box">
            <div className="welcome-badge">WELCOME BACK</div>
            <h2 className="login-title">Sign In</h2>
            <p className="login-subtitle">Enter your credentials to access your account</p>
            
            {apiError && <div className="api-error-message">{apiError}</div>}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="student@university.edu"
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="form-group">
                <div className="password-label-row">
                  <label htmlFor="password">Password</label>
                  <a href="/forgot-password" className="forgot-link">Forgot Password?</a>
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={errors.password ? 'error' : ''}
                />
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              <div className="remember-me-row">
                <label className="remember-checkbox">
                  <input type="checkbox" />
                  <span>Remember me on this device</span>
                </label>
              </div>

              <button 
                type="submit" 
                className="login-button"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Log in'}
              </button>
            </form>

            <div className="login-footer">
              <p>Don't have an account? <a href="/register">Sign Up Now</a></p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Login;
