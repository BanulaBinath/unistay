// Mock Payment Service
// In production, integrate with real payment gateway like Stripe, PayPal, etc.

const processPayment = async (paymentData) => {
  const { amount, email, userId, subscriptionType } = paymentData;

  // Simulate payment processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock payment success (90% success rate for testing)
  const isSuccess = Math.random() > 0.1;

  if (isSuccess) {
    return {
      success: true,
      transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      amount,
      paymentMethod: 'card',
      message: 'Payment processed successfully'
    };
  } else {
    return {
      success: false,
      message: 'Payment failed. Please try again.'
    };
  }
};

// Generate payment session (for frontend integration)
const createPaymentSession = async (subscriptionData) => {
  const { userId, email, subscriptionType, amount } = subscriptionData;

  // In production, create actual payment session with payment gateway
  // For now, return mock session data
  return {
    sessionId: `SESSION_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    amount,
    currency: 'USD',
    // Mock payment URL - in production, this would be the actual payment gateway URL
    paymentUrl: `${process.env.FRONTEND_URL}/payment/process`,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
  };
};

module.exports = {
  processPayment,
  createPaymentSession
};
