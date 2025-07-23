import React, { createContext, useContext, useState, useEffect } from 'react';
    
    const AuthContext = createContext();
    
    export function useAuth() {
      return useContext(AuthContext);
    }
    
    const getInitialState = () => {
      try {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
      } catch (error) {
        return null;
      }
    };
    
    export const AuthProvider = ({ children }) => {
      const [currentUser, setCurrentUser] = useState(null);
      const [loading, setLoading] = useState(true);
    
      useEffect(() => {
        const user = getInitialState();
        setCurrentUser(user);
        setLoading(false);
      }, []);
    
      useEffect(() => {
        try {
          if (currentUser) {
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
          } else {
            localStorage.removeItem('currentUser');
          }
        } catch (error) {
          console.error("Failed to update localStorage", error);
        }
      }, [currentUser]);
    
      const login = (username, password) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
          setCurrentUser(user);
          return user;
        }
        return null;
      };
    
      const register = (username, password) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.find(u => u.username === username)) {
          return null; 
        }
        const newUser = {
          id: Date.now(),
          username,
          password,
          requestTitle: `Send me anonymous messages!`,
          profilePicture: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
          plan: 'free',
          hitCount: 0,
        };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        return newUser;
      };
    
      const logout = () => {
        setCurrentUser(null);
      };
    
      const updateUser = (updatedData) => {
        if (!currentUser) return;
    
        const updatedUser = { ...currentUser, ...updatedData };
        setCurrentUser(updatedUser);
    
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
          users[userIndex] = updatedUser;
          localStorage.setItem('users', JSON.stringify(users));
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