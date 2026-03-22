import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../../services/api';
import './PaymentProcess.css';

function PaymentProcess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, email, paymentSession, userType, vendorType } = location.state || {};

  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, processing, success, failed

  useEffect(() => {
    if (!userId || !paymentSession) {
      navigate('/register');
    }
  }, [userId, paymentSession, navigate]);

  const amount = userType === 'vendor' ? 200 : 120;

  const handlePayment = async () => {
    setProcessing(true);
    setPaymentStatus('processing');

    // Simulate payment processing
    setTimeout(async () => {
      try {
        const response = await authAPI.processPaymentSuccess({
          userId,
          sessionId: paymentSession.sessionId
        });

        if (response.success) {
          setPaymentStatus('success');
          setTimeout(() => {
            navigate('/login', {
              state: {
                message: 'Payment successful! Your account is now active. Please log in.'
              }
            });
          }, 3000);
        } else {
          setPaymentStatus('failed');
        }
      } catch (error) {
        console.error('Payment error:', error);
        setPaymentStatus('failed');
      } finally {
        setProcessing(false);
      }
    }, 3000);
  };

  const handleRetry = () => {
    setPaymentStatus('pending');
  };

  if (!userId || !paymentSession) {
    return null;
  }

  return (
    <div className="payment-process-container">
      <div className="payment-process-wrapper">
        {paymentStatus === 'pending' && (
          <div className="payment-card">
            <div className="payment-header">
              <h1>Complete Your Subscription</h1>
              <p>Secure payment to activate your Unistay account</p>
            </div>

            <div className="payment-details">
              <div className="detail-row">
                <span className="detail-label">Account Type:</span>
                <span className="detail-value">
                  {userType === 'vendor' ? `Vendor (${vendorType})` : 'External Student'}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{email}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Subscription:</span>
                <span className="detail-value">Annual Access</span>
              </div>
              <div className="detail-row total-row">
                <span className="detail-label">Total Amount:</span>
                <span className="detail-value amount">${amount}.00 USD</span>
              </div>
            </div>

            <div className="payment-info-box">
              <div className="info-icon">ℹ️</div>
              <div className="info-text">
                <h4>What happens next?</h4>
                <ul>
                  <li>Your account will be activated immediately upon payment</li>
                  <li>You'll receive a confirmation email</li>
                  <li>Full access to all Unistay services</li>
                </ul>
              </div>
            </div>

            <button 
              className="payment-btn"
              onClick={handlePayment}
              disabled={processing}
            >
              💳 Proceed to Payment - ${amount}.00
            </button>

            <div className="security-badges">
              <div className="security-badge">
                <span className="badge-icon">🔒</span>
                <span>256-bit SSL Encryption</span>
              </div>
              <div className="security-badge">
                <span className="badge-icon">✓</span>
                <span>PCI DSS Compliant</span>
              </div>
            </div>

            <p className="cancel-text">
              <span onClick={() => navigate('/register')}>Cancel and return to registration</span>
            </p>
          </div>
        )}

        {paymentStatus === 'processing' && (
          <div className="payment-card processing-card">
            <div className="processing-animation">
              <div className="spinner"></div>
            </div>
            <h2>Processing Payment...</h2>
            <p>Please wait while we process your payment securely.</p>
            <p className="processing-note">Do not close this window or press the back button.</p>
          </div>
        )}

        {paymentStatus === 'success' && (
          <div className="payment-card success-card">
            <div className="success-icon">✅</div>
            <h2>Payment Successful!</h2>
            <p>Your account has been activated successfully.</p>
            <div className="success-details">
              <p><strong>Transaction ID:</strong> {paymentSession.sessionId}</p>
              <p><strong>Amount Paid:</strong> ${amount}.00 USD</p>
            </div>
            <p className="redirect-text">Redirecting to login page...</p>
          </div>
        )}

        {paymentStatus === 'failed' && (
          <div className="payment-card failed-card">
            <div className="failed-icon">❌</div>
            <h2>Payment Failed</h2>
            <p>We couldn't process your payment. Please try again.</p>
            <button className="retry-btn" onClick={handleRetry}>
              Try Again
            </button>
            <p className="cancel-text">
              <span onClick={() => navigate('/register')}>Return to registration</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentProcess;
