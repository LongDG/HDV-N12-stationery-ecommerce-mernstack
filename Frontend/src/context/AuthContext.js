import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra user đã đăng nhập
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      const user = JSON.parse(userData);
      console.log('=== AuthContext DEBUG ===');
      console.log('User data from localStorage:', user);
      console.log('User role_id:', user.role_id);
      console.log('=== END DEBUG ===');
      setUser(user);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      console.log('AuthContext login - credentials:', credentials);
      console.log('AuthContext login - credentials type:', typeof credentials);
      
      const response = await authService.login(credentials);
      
      console.log('AuthContext login - response:', response);
      
      if (response.success) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      console.error('AuthContext login error:', error);
      return { success: false, message: error.message || 'Đăng nhập thất bại' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      if (response.success) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message || 'Đăng ký thất bại' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    console.log('=== LOGOUT DEBUG ===');
    console.log('User data cleared, redirecting to login...');
    console.log('=== END LOGOUT DEBUG ===');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
