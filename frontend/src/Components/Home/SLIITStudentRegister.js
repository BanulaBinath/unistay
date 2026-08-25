import React, { useState, useEffect } from 'react';
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
  
  // OTP Modal State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Resend timer effect
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

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

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!formData.email.endsWith('@my.sliit.lk')) {
      newErrors.email = 'Please use your SLIIT student email (@my.sliit.lk)';
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
      const response = await authAPI.registerSLIITStudent({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });

      if (response.success) {
        // Show OTP modal instead of navigating
        setShowOtpModal(true);
        setResendTimer(60);
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

  // OTP Handlers
  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      value = value[0];
    }

    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError('');

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) {
      return;
    }

    const newOtp = pastedData.split('');
    while (newOtp.length < 6) {
      newOtp.push('');
    }
    setOtp(newOtp);

    const lastIndex = Math.min(pastedData.length, 5);
    const lastInput = document.getElementById(`otp-${lastIndex}`);
    if (lastInput) lastInput.focus();
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpError('');

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setOtpError('Please enter all 6 digits');
      return;
    }

    setOtpLoading(true);

    try {
      const response = await authAPI.verifyOTP({
        email: formData.email,
        otp: otpString
      });

      if (response.success) {
        setOtpSuccess(true);
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: 'Account verified successfully! Please log in.' 
            } 
          });
        }, 1500);
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setOtpError(error.response?.data?.message || 'Invalid or expired OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    setResending(true);
    setOtpError('');

    try {
      const response = await authAPI.resendOTP(formData.email);
      if (response.success) {
        setResendTimer(60);
        setOtp(['', '', '', '', '', '']);
        const firstInput = document.getElementById('otp-0');
        if (firstInput) firstInput.focus();
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      setOtpError(error.response?.data?.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="sliit-register-container">
        <div className="sliit-register-wrapper">
          {/* Left Side - Purple Section */}
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

        {/* OTP Modal */}
        {showOtpModal && (
          <div className="otp-modal-overlay">
            <div className="otp-modal">
              <div className="otp-modal-header">
                <div className="otp-modal-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>Verify Your Email</h3>
                <p>We've sent a 6-digit code to <strong>{formData.email}</strong></p>
              </div>

              <form onSubmit={handleVerifyOtp} className="otp-modal-form">
                <div className="otp-inputs-container">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={handleOtpPaste}
                      className={`otp-digit-input ${otpError ? 'error' : ''} ${otpSuccess ? 'success' : ''}`}
                      disabled={otpLoading || otpSuccess}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>

                {otpError && (
                  <div className="otp-error-message">
                    {otpError}
                  </div>
                )}

                {otpSuccess && (
                  <div className="otp-success-message">
                    ✓ Verification successful! Redirecting...
                  </div>
                )}

                <button 
                  type="submit" 
                  className="otp-verify-btn"
                  disabled={otpLoading || otpSuccess}
                >
                  {otpLoading ? 'Verifying...' : otpSuccess ? 'Verified!' : 'Verify OTP'}
                </button>

                <div className="otp-resend-section">
                  <span>Didn't receive the code?</span>
                  <button
                    type="button"
                    className="otp-resend-btn"
                    onClick={handleResendOtp}
                    disabled={resending || resendTimer > 0}
                  >
                    {resending ? 'Sending...' : resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default SLIITStudentRegister;
