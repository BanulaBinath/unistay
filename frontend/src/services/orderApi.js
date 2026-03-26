import api from './api';

export const createOrder = async (payload) => {
  const response = await api.post('/orders', payload, { skipAuthRedirect: true });
  return response.data;
};

export const getVendorOrders = async () => {
  const response = await api.get('/orders/vendor');
  return response.data;
};

export const updateVendorOrderStatus = async (orderId, status) => {
  const response = await api.patch(`/orders/vendor/${orderId}/status`, { status });
  return response.data;
};

export const deleteVendorOrder = async (orderId) => {
  const response = await api.delete(`/orders/vendor/${orderId}`);
  return response.data;
};

// Student order functions
export const getStudentOrders = async () => {
  const response = await api.get('/orders/student');
  return response.data;
};

export const getOrderById = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};
