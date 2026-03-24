import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import { HiHome, HiChatAlt2 } from 'react-icons/hi';
import './login.css';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
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
          navigate('/student/dashboard');
        } else if (role === 'vendor') {
          navigate(`/vendor/${vendorType}/dashboard`);
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Please try again.'
      );
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
              <div className="feature-icon blue">
                <HiHome />
              </div>
              <div className="feature-content">
                <h3>Verified Student Housing</h3>
                <p>Pre-vetted for safety and academic proximity.</p>
              </div>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon purple">
                <HiChatAlt2 />
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
            
            {error && <div className="error-message">{error}</div>}

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
                  required
                />
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
                  required
                />
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
