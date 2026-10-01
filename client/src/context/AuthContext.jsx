import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const token = localStorage.getItem('telc_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const data = await api.getMe();
      if (data.user?.role !== 'admin' && data.user?.status !== 'active') {
        localStorage.removeItem('telc_token');
        setUser(null);
      } else {
        setUser(data.user);
      }
    } catch (err) {
      console.warn('Session expired or invalid token:', err);
      localStorage.removeItem('telc_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    setError(null);
    try {
      const data = await api.login(email, password);
      localStorage.setItem('telc_token', data.token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  async function register(userData) {
    setError(null);
    try {
      const data = await api.register(userData);
      // Account created with status pending; requires admin activation before login
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  function logout() {
    localStorage.removeItem('telc_token');
    setUser(null);
  }

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    refreshUser: checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
