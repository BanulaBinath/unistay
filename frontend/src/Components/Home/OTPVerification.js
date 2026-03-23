import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../../services/api';
import './OTPVerification.css';

function OTPVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, fullName } = location.state || {};

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (index, value) => {
    if (value.length > 1) {
      value = value[0];
    }

    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handlePaste = (e) => {
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

    // Focus last filled input
    const lastIndex = Math.min(pastedData.length, 5);
    document.getElementById(`otp-${lastIndex}`).focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.verifyOTP({
        email,
        otp: otpString
      });

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: 'Account verified successfully! Please log in.' 
            } 
          });
        }, 2000);
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setError(error.response?.data?.message || 'Invalid or expired OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;

    setResending(true);
    setError('');

    try {
      const response = await authAPI.resendOTP(email);
      if (response.success) {
        setResendTimer(60);
        setOtp(['', '', '', '', '', '']);
        document.getElementById('otp-0').focus();
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      setError(error.response?.data?.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setResending(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <div className="otp-verification-container">
      <div className="otp-verification-wrapper">
        {/* Left Side */}
        <div className="otp-left">
          <div className="otp-badge">🎓 SLIIT STUDENT VERIFICATION</div>
          <h1 className="otp-title">Verify Your Email</h1>
          <p className="otp-description">
            We've sent a 6-digit verification code to <strong>{email}</strong>
          </p>

          <div className="progress-section">
            <div className="progress-header">
              <span className="progress-label">PROGRESS</span>
              <span className="progress-step">STEP 2 OF 2</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '100%' }}></div>
            </div>
            <p className="progress-text">Email verification</p>
          </div>

          <div className="info-box">
            <div className="info-icon">⏱️</div>
            <h3>OTP Expires Soon</h3>
            <p>Your verification code will expire in 10 minutes. Please enter it promptly to complete your registration.</p>
          </div>
        </div>

        {/* Right Side */}
        <div className="otp-right">
          <form onSubmit={handleSubmit} className="otp-form">
            <div className="welcome-text">
              <h2>Welcome, {fullName}!</h2>
              <p>Enter the 6-digit code to activate your account</p>
            </div>

            <div className="otp-inputs">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className={`otp-input ${error ? 'error' : ''} ${success ? 'success' : ''}`}
                  disabled={loading || success}
                />
              ))}
            </div>

            {error && (
              <div className="error-message">
                ❌ {error}
              </div>
            )}

            {success && (
              <div className="success-message">
                ✅ Verification successful! Redirecting to login...
              </div>
            )}

            <button 
              type="submit" 
              className="verify-btn"
              disabled={loading || success}
            >
              {loading ? 'Verifying...' : success ? 'Verified!' : 'Verify & Activate Account'}
            </button>

            <div className="resend-section">
              <p>Didn't receive the code?</p>
              <button
                type="button"
                className="resend-btn"
                onClick={handleResendOTP}
                disabled={resending || resendTimer > 0}
              >
                {resending ? 'Sending...' : resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
              </button>
            </div>

            <div className="help-section">
              <p>Check your spam folder if you don't see the email</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default OTPVerification;
