import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  getToken,
  getRole,
  getName,
  getPhone,
  clearAuthData,
  saveAuthData,
} from '../utils/helpers';

// Create context
const AuthContext = createContext();

// AuthProvider - wrap around whole app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user already logged in when app starts
  useEffect(() => {
    const token = getToken();
    const role = getRole();
    const name = getName();
    const phone = getPhone();

    if (token && role) {
      setUser({ token, role, name, phone });
    }
    setLoading(false);
  }, []);

  // Login - save data and set user
  const login = (token, role, name, phone) => {
    saveAuthData(token, role, name, phone);
    setUser({ token, role, name, phone });
  };

  // Logout - clear data and set user null
  const logout = () => {
    clearAuthData();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth anywhere in app
export const useAuth = () => useContext(AuthContext);

export default AuthContext;