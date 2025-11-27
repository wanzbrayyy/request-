import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const token = localStorage.getItem('token');
    if (user && token) {
      setCurrentUser(user);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const res = await axios.post('http://localhost:3001/api/auth/login', { username, password });
      if (res.data.user) {
        setCurrentUser(res.data.user);
        localStorage.setItem('currentUser', JSON.stringify(res.data.user));
        localStorage.setItem('token', res.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        return res.data.user;
      }
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const register = async (username, password) => {
    try {
      const res = await axios.post('http://localhost:3001/api/auth/register', { username, password });
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateUser = async (updatedData) => {
    if (!currentUser) return;
    try {
      const res = await axios.post('http://localhost:3001/api/auth/updateUser', { userId: currentUser._id, updatedData });
      setCurrentUser(res.data.user);
      localStorage.setItem('currentUser', JSON.stringify(res.data.user));
    } catch (error) {
      console.error(error);
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};