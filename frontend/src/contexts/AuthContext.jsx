import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await authService.checkAuth();
      setUser(userData);
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (loginData) => {
    try {
      setError(null);
      console.log('AuthContext: Attempting login with:', loginData);
      const response = await authService.login(loginData);
      console.log('AuthContext: Login response:', response);
      
      if (!response.user) {
        throw new Error('Invalid response from server');
      }
      
      // Check if the user's role is valid (customer or shopkeeper)
      if (!['customer', 'shopkeeper'].includes(response.user.role)) {
        authService.logout(); // Clear the token if role is invalid
        throw new Error('Invalid role for this account');
      }
      
      // If role is specified, check if it matches
      if (loginData.role && response.user.role !== loginData.role) {
        authService.logout();
        throw new Error('Invalid role selected');
      }
      
      setUser(response.user);
      return response.user;
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.message || 'Login failed');
      throw error;
    }
  };

  const register = async (name, email, password, role) => {
    try {
      setError(null);
      const response = await authService.register({ name, email, password, role });
      const { token, ...userData } = response.data;
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Registration failed:', error);
      setError(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    currentUser: user,
    loading,
    error,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;