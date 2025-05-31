import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://customer-connect-deploy.onrender.com/api';

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
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (credentials) => {
    try {
      console.log('API Service: Sending login request with credentials:', {
        email: credentials.email,
        role: credentials.role
      });
      
      const response = await api.post('/auth/login', credentials);
      console.log('API Service: Login response:', response.data);
      
      if (!response.data.token || !response.data.user) {
        console.error('API Service: Invalid response format:', response.data);
        throw new Error('Invalid response from server');
      }
      
      // Store token
      localStorage.setItem('token', response.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      return response.data;
    } catch (error) {
      console.error('API Service: Login error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.response?.status === 400) {
        throw new Error(error.response.data.message || 'Invalid credentials');
      }
      
      throw new Error(error.response?.data?.message || 'Login failed. Please try again.');
    }
  },

  register: async (userData) => {
    try {
      console.log('Sending registration request:', userData);
      const response = await api.post('/auth/register', userData);
      console.log('Registration response:', response.data);
      
      if (!response.data.token) {
        console.error('Invalid response format:', response.data);
        throw new Error('Invalid response from server');
      }
      
      // Store token
      localStorage.setItem('token', response.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      // If user data is not in response, create it from the registration data
      const userResponse = response.data.user || {
        name: userData.name,
        email: userData.email,
        role: userData.role
      };
      
      return {
        token: response.data.token,
        user: userResponse
      };
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  },

  checkAuth: async () => {
    try {
      const response = await api.get('/auth/user');
      return response.data;
    } catch (error) {
      console.error('Auth check error:', error.response?.data || error.message);
      throw error;
    }
  }
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

// Product services
export const productService = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.patch(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

// Order services
export const orderService = {
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
  update: (id, data) => api.patch(`/orders/${id}`, data),
  getCustomerOrders: () => api.get('/orders/customer'),
  getShopkeeperOrders: () => api.get('/orders/shopkeeper'),
};

export default api;