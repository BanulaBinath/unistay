import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Create axios instance with auth
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Get notifications with pagination
 */
export const getNotifications = async (params = {}) => {
  try {
    const response = await api.get('/notifications', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get unread notification count
 */
export const getUnreadCount = async () => {
  try {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Mark single notification as read
 */
export const markAsRead = async (notificationId) => {
  try {
    const response = await api.patch(`/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async () => {
  try {
    const response = await api.patch('/notifications/read-all');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a notification
 */
export const deleteNotification = async (notificationId) => {
  try {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete all read notifications
 */
export const deleteAllRead = async () => {
  try {
    const response = await api.delete('/notifications/read/all');
    return response.data;
  } catch (error) {
    throw error;
  }
};
