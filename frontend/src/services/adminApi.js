import axios from 'axios';
import { getAuthHeader } from './api';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with auth header
const createAuthRequest = () => ({
  headers: {
    ...getAuthHeader(),
    'Content-Type': 'application/json'
  }
});

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

// Ticket Management
export const getAllTickets = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await axios.get(
    `${API_URL}/admin/tickets?${params}`,
    createAuthRequest()
  );
  return response.data;
};

export const getTicketStats = async () => {
  const response = await axios.get(
    `${API_URL}/admin/tickets/stats`,
    createAuthRequest()
  );
  return response.data;
};

export const getTicketDetails = async (id) => {
  const response = await axios.get(
    `${API_URL}/admin/tickets/${id}`,
    createAuthRequest()
  );
  return response.data;
};

export const updateTicketStatus = async (id, status, notes = '') => {
  const response = await axios.patch(
    `${API_URL}/admin/tickets/${id}/status`,
    { status, notes },
    createAuthRequest()
  );
  return response.data;
};

export const updateTicketPriority = async (id, priority, notes = '') => {
  const response = await axios.patch(
    `${API_URL}/admin/tickets/${id}/priority`,
    { priority, notes },
    createAuthRequest()
  );
  return response.data;
};

export const resolveTicket = async (id, notes = '') => {
  const response = await axios.patch(
    `${API_URL}/admin/tickets/${id}/resolve`,
    { notes },
    createAuthRequest()
  );
  return response.data;
};

export const closeTicket = async (id, notes = '') => {
  const response = await axios.patch(
    `${API_URL}/admin/tickets/${id}/close`,
    { notes },
    createAuthRequest()
  );
  return response.data;
};
