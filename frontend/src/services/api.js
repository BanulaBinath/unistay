import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Auth API calls
export const authAPI = {
  // Register SLIIT Student
  registerSLIITStudent: async (data) => {
    const response = await api.post('/auth/register/sliit-student', data);
    return response.data;
  },

  // Verify OTP
  verifyOTP: async (data) => {
    const response = await api.post('/auth/verify-otp', data);
    return response.data;
  },

  // Resend OTP
  resendOTP: async (email) => {
    const response = await api.post('/auth/resend-otp', { email });
    return response.data;
  },

  // Register External Student
  registerExternalStudent: async (data) => {
    const response = await api.post('/auth/register/external-student', data);
    return response.data;
  },

  // Register Vendor
  registerVendor: async (data) => {
    const response = await api.post('/auth/register/vendor', data);
    return response.data;
  },

  // Process Payment Success
  processPaymentSuccess: async (data) => {
    const response = await api.post('/auth/payment/success', data);
    return response.data;
  }
};

export default api;
