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
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const res = await axios.post('/api/auth/login', { username, password });
      if (res.data.user) {
        setCurrentUser(res.data.user);
        localStorage.setItem('currentUser', JSON.stringify(res.data.user));
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
      const res = await axios.post('/api/auth/register', { username, password });
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateUser = async (updatedData) => {
    if (!currentUser) return;
    try {
      const res = await axios.post('/api/auth/updateUser', { userId: currentUser._id, updatedData });
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