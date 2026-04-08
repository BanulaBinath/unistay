import axios from 'axios';
import { getAuthHeader } from './api';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Student Ticket APIs
export const createTicket = async (ticketData) => {
  const response = await axios.post(`${API_URL}/tickets`, ticketData, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const getMyTickets = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await axios.get(`${API_URL}/tickets/my?${params}`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const getTicketById = async (ticketId) => {
  const response = await axios.get(`${API_URL}/tickets/${ticketId}`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const addTicketMessage = async (ticketId, message) => {
  const response = await axios.post(
    `${API_URL}/tickets/${ticketId}/messages`,
    { message },
    { headers: getAuthHeader() }
  );
  return response.data;
};

export const closeTicket = async (ticketId) => {
  const response = await axios.patch(
    `${API_URL}/tickets/${ticketId}/close`,
    {},
    { headers: getAuthHeader() }
  );
  return response.data;
};

export const reopenTicket = async (ticketId, reason) => {
  const response = await axios.patch(
    `${API_URL}/tickets/${ticketId}/reopen`,
    { reason },
    { headers: getAuthHeader() }
  );
  return response.data;
};

export const escalateTicket = async (ticketId, reason) => {
  const response = await axios.patch(
    `${API_URL}/tickets/${ticketId}/escalate`,
    { reason },
    { headers: getAuthHeader() }
  );
  return response.data;
};

// Admin Ticket APIs
export const getAllTickets = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await axios.get(`${API_URL}/admin/tickets?${params}`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const getTicketStats = async () => {
  const response = await axios.get(`${API_URL}/admin/tickets/stats`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const getAdminTicketDetails = async (ticketId) => {
  const response = await axios.get(`${API_URL}/admin/tickets/${ticketId}`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const updateTicketStatus = async (ticketId, status, notes) => {
  const response = await axios.patch(
    `${API_URL}/admin/tickets/${ticketId}/status`,
    { status, notes },
    { headers: getAuthHeader() }
  );
  return response.data;
};

export const updateTicketPriority = async (ticketId, priority, notes) => {
  const response = await axios.patch(
    `${API_URL}/admin/tickets/${ticketId}/priority`,
    { priority, notes },
    { headers: getAuthHeader() }
  );
  return response.data;
};

export const assignTicket = async (ticketId, adminId, notes) => {
  const response = await axios.patch(
    `${API_URL}/admin/tickets/${ticketId}/assign`,
    { adminId, notes },
    { headers: getAuthHeader() }
  );
  return response.data;
};

export const resolveTicket = async (ticketId, notes) => {
  const response = await axios.patch(
    `${API_URL}/admin/tickets/${ticketId}/resolve`,
    { notes },
    { headers: getAuthHeader() }
  );
  return response.data;
};

export const closeTicketAdmin = async (ticketId, notes) => {
  const response = await axios.patch(
    `${API_URL}/admin/tickets/${ticketId}/close`,
    { notes },
    { headers: getAuthHeader() }
  );
  return response.data;
};

export const issueVendorWarning = async (ticketId, reason) => {
  const response = await axios.patch(
    `${API_URL}/admin/tickets/${ticketId}/warn-vendor`,
    { reason },
    { headers: getAuthHeader() }
  );
  return response.data;
};

export const rejectTicket = async (ticketId, reason) => {
  const response = await axios.patch(
    `${API_URL}/admin/tickets/${ticketId}/reject`,
    { reason },
    { headers: getAuthHeader() }
  );
  return response.data;
};

export const addAdminMessage = async (ticketId, message) => {
  const response = await axios.post(
    `${API_URL}/admin/tickets/${ticketId}/messages`,
    { message },
    { headers: getAuthHeader() }
  );
  return response.data;
};
