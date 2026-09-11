import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [bloodBank, setBloodBank] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('eraktkosh_token') || null);
  const [loading, setLoading] = useState(true);

  const initAuth = async () => {
    const savedToken = localStorage.getItem('eraktkosh_token');
    if (!savedToken) {
      setLoading(false);
      return;
    }

    try {
      const data = await authApi.getMe();
      if (data.success) {
        setUser(data.user);
        setProfile(data.profile || null);
        setBloodBank(data.bloodBank || null);
      } else {
        logout();
      }
    } catch (err) {
      console.warn('Session verification failed:', err.message);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initAuth();
  }, []);

  const login = async (email, password, role) => {
    const res = await authApi.login({ email, password, role });
    if (res.success && res.token) {
      localStorage.setItem('eraktkosh_token', res.token);
      setToken(res.token);
      setUser(res.user);
      setProfile(res.profile || null);
      setBloodBank(res.bloodBank || null);
    }
    return res;
  };

  const registerDonor = async (formData) => {
    const res = await authApi.registerDonor(formData);
    if (res.success && res.token) {
      localStorage.setItem('eraktkosh_token', res.token);
      setToken(res.token);
      setUser(res.user);
      setProfile(res.profile);
    }
    return res;
  };

  const logout = () => {
    try {
      localStorage.removeItem('eraktkosh_token');
      sessionStorage.clear();
    } catch (e) {
      console.warn('Storage clear error:', e);
    }
    setToken(null);
    setUser(null);
    setProfile(null);
    setBloodBank(null);
  };

  const refreshUser = async () => {
    try {
      const data = await authApi.getMe();
      if (data.success) {
        setUser(data.user);
        setProfile(data.profile || null);
        setBloodBank(data.bloodBank || null);
      }
    } catch (err) {
      console.error('Refresh user error:', err);
    }
  };

  const isDonor = user?.role === 'donor';
  const isAdmin = user?.role === 'admin';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        bloodBank,
        token,
        loading,
        isAuthenticated,
        isDonor,
        isAdmin,
        login,
        registerDonor,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
