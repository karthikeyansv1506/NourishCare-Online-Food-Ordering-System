import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const menuAPI = {
  getAll: () => api.get('/menu'),
  getRecommended: (condition) => api.get(`/menu/recommended/${condition || 'None'}`),
};

export const ordersAPI = {
  create: (orderData) => api.post('/orders', orderData),
  getAllOrders: () => api.get('/orders'),
  getUserOrders: (userId) => api.get(`/orders/${userId}`),
  updateStatus: (orderId, status) => api.put(`/orders/${orderId}/status`, { status }),
};

export default api;
