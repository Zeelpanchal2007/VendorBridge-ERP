import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password, role) => {
    // In a real app, this calls the backend API and receives a JWT + user data.
    // For now, we mock it.
    
    const mockUser = {
      id: Math.random().toString(36).substring(2, 9),
      email,
      name: email.split('@')[0],
      role: role || 'officer', // Default to procurement officer
    };
    
    localStorage.setItem('token', 'mock-jwt-token-123');
    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
    toast.success(`Welcome back, ${mockUser.name}`);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
