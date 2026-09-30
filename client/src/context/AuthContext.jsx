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
      // Default to student demo if no token
      try {
        const data = await api.demoLogin('student');
        localStorage.setItem('telc_token', data.token);
        setUser(data.user);
      } catch (e) {
        console.error('Demo auth fallback error:', e);
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      const data = await api.getMe();
      setUser(data.user);
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
      localStorage.setItem('telc_token', data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  async function switchDemoRole(role) {
    setLoading(true);
    try {
      const data = await api.demoLogin(role);
      localStorage.setItem('telc_token', data.token);
      setUser(data.user);
    } catch (err) {
      console.error('Failed to switch demo role:', err);
    } finally {
      setLoading(false);
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
    switchDemoRole,
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
