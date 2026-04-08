import api, { getAuthHeader } from './api';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const addItem = async (formData) => {
  const response = await axios.post(`${API_BASE_URL}/items/add`, formData, {
    headers: getAuthHeader()
  });

  return response.data;
};

export const getItems = async (params = {}) => {
  const response = await api.get('/items', { params });
  return response.data;
};

export const getItemById = async (itemId) => {
  const response = await api.get(`/items/${itemId}`);
  return response.data;
};

export const updateItem = async (itemId, payload) => {
  const response = await axios.put(`${API_BASE_URL}/items/${itemId}`, payload, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const deleteItem = async (itemId) => {
  const response = await api.delete(`/items/${itemId}`);
  return response.data;
};
