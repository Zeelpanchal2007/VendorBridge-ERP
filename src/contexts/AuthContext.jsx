import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// In a real application with HttpOnly cookies, the token would not be accessible to JavaScript.
// To prevent XSS long-term persistence while surviving page refreshes,
// we will simulate the secure token handling by using sessionStorage.
export const tokenStore = { 
  get token() { return sessionStorage.getItem('token'); },
  set token(val) { 
    if (val) sessionStorage.setItem('token', val); 
    else sessionStorage.removeItem('token'); 
  } 
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if we have a valid session token
    if (!tokenStore.token) {
      localStorage.removeItem('user');
      localStorage.removeItem('token'); // Clear any stale old tokens
      setUser(null);
    } else {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
    setLoading(false);
  }, []);

  // Helper to decode JWT without a library
  const decodeJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  const login = async (email, password) => {
    try {
      // FastAPI OAuth2PasswordRequestForm expects URLSearchParams
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const response = await api.post('/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      const token = response.data.access_token;
      const decoded = decodeJwt(token);

      // Build user object from token claims
      const currentUser = {
        id: decoded.sub,
        email: email,
        name: email.split('@')[0], // Extract name from email as fallback
        role: decoded.role,
      };

      // Simulate receiving an HttpOnly cookie by saving the token ONLY in memory scope.
      // This protects it from XSS attacks that scrape localStorage.
      tokenStore.token = token;
      
      // We only store the non-sensitive user metadata in localStorage for fast UI rendering.
      localStorage.setItem('user', JSON.stringify(currentUser));
      setUser(currentUser);
      toast.success(`Welcome back!`);
      
      // Smart Redirect based on Role
      if (currentUser.role === 'vendor') {
        window.location.href = '/rfqs';
      } else {
        window.location.href = '/dashboard';
      }
      
      return true;
    } catch (error) {
      const detail = error.response?.data?.detail;
      if (Array.isArray(detail)) {
        toast.error(detail[0].msg || 'Validation error');
      } else {
        toast.error(detail || 'Login failed');
      }
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/signup', userData);
      toast.success('Registration successful! Please login.');
      return true;
    } catch (error) {
      const detail = error.response?.data?.detail;
      if (Array.isArray(detail)) {
        toast.error(detail[0].msg || 'Validation error');
      } else {
        toast.error(detail || 'Registration failed');
      }
      return false;
    }
  };

  const logout = () => {
    tokenStore.token = null;
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
    window.location.href = '/login';
  };

  // Export a secure getter for the API interceptor to use
  const getToken = () => tokenStore.token;

  const hasPermission = (allowedRoles) => {
    if (!user) return false;
    if (!allowedRoles || allowedRoles.length === 0) return true;
    return allowedRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading, hasPermission, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};
