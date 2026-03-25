import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Create axios instance with auth header
const createAuthRequest = () => {
  const token = getAuthToken();
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

// Dashboard Stats
export const getDashboardStats = async () => {
  const response = await axios.get(
    `${API_URL}/admin/dashboard/stats`,
    createAuthRequest()
  );
  return response.data;
};

// User Management
export const getAllUsers = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await axios.get(
    `${API_URL}/admin/users?${params}`,
    createAuthRequest()
  );
  return response.data;
};

export const getUserById = async (id) => {
  const response = await axios.get(
    `${API_URL}/admin/users/${id}`,
    createAuthRequest()
  );
  return response.data;
};

export const activateUser = async (id) => {
  const response = await axios.patch(
    `${API_URL}/admin/users/${id}/activate`,
    {},
    createAuthRequest()
  );
  return response.data;
};

export const deactivateUser = async (id) => {
  const response = await axios.patch(
    `${API_URL}/admin/users/${id}/deactivate`,
    {},
    createAuthRequest()
  );
  return response.data;
};

// Payment Management
export const getAllPayments = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await axios.get(
    `${API_URL}/admin/payments?${params}`,
    createAuthRequest()
  );
  return response.data;
};

export const getPaymentById = async (id) => {
  const response = await axios.get(
    `${API_URL}/admin/payments/${id}`,
    createAuthRequest()
  );
  return response.data;
};

// Subscription Management
export const getAllSubscriptions = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await axios.get(
    `${API_URL}/admin/subscriptions?${params}`,
    createAuthRequest()
  );
  return response.data;
};

export const getSubscriptionById = async (id) => {
  const response = await axios.get(
    `${API_URL}/admin/subscriptions/${id}`,
    createAuthRequest()
  );
  return response.data;
};

export const updateSubscriptionStatus = async (id, activationStatus) => {
  const response = await axios.patch(
    `${API_URL}/admin/subscriptions/${id}/status`,
    { activationStatus },
    createAuthRequest()
  );
  return response.data;
};
