import React, { createContext, useState, useEffect } from 'react';
import AuthService from '../services/AuthServices';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(localStorage.getItem('user')? JSON.parse(localStorage.getItem('user')) : null);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    } 
  }, []);

  const login = (username, password) => {
    const data = AuthService.login(username, password);
    setCurrentUser(data);
    return data;
  };

  const logout = () => {
    AuthService.logout();
    setCurrentUser(null);
  };

  const contextValue = {
    currentUser,
    setCurrentUser,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};