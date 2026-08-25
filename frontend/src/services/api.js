import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    if (config.skipAuth) {
      return config;
    }

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url || '';
    const requestMethod = (error.config?.method || '').toLowerCase();
    const isCreateOrderRequest = requestMethod === 'post' && requestUrl.includes('/orders');

    if (
      error.response?.status === 401 &&
      !error.config?.skipAuth &&
      !error.config?.skipAuthRedirect &&
      !isCreateOrderRequest
    ) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  // Login
  login: async (data) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

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
