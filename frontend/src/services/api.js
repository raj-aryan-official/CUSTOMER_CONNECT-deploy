import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth services
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Customer services
export const customerService = {
  getAll: () => api.get('/customers'),
  getById: (id) => api.get(`/customers/${id}`),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
};

// Analytics services
export const analyticsService = {
  getCustomerAnalytics: () => api.get('/analytics/customers'),
  getInteractionAnalytics: () => api.get('/analytics/interactions'),
  getPerformanceMetrics: () => api.get('/analytics/performance'),
};

// Report services
export const reportService = {
  generate: (data) => api.post('/reports/generate', data),
  sendEmail: (data) => api.post('/reports/send-email', data),
  getHistory: () => api.get('/reports/history'),
};

export default api; 