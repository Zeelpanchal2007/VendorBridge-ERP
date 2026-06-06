import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

import { tokenStore } from '../contexts/AuthContext';

// Request Interceptor: Attach JWT token if available
api.interceptors.request.use((config) => {
  const token = tokenStore.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor: Global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Exclude login/register from global 401 handling
    const isAuthRoute = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/signup');
    
    if (error.response?.status === 401 && !isAuthRoute) {
      toast.error('Session expired. Please log in again.');
      tokenStore.token = null;
      localStorage.removeItem('token'); // Just in case
      localStorage.removeItem('user');
      window.location.href = '/login';
    } else if (error.response?.status === 403 && !isAuthRoute) {
      toast.error('You do not have permission to perform this action.');
      // Optional: redirect to dashboard if totally unauthorized, but usually we just want to block the action.
    } else if (error.response?.data?.detail && !isAuthRoute) {
       toast.error(error.response.data.detail);
    }
    
    return Promise.reject(error);
  }
);

export default api;
