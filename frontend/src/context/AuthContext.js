import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);
const AUTH_TOKEN_PREFIX = 'token_';
const AUTH_USER_PREFIX = 'user_';
const ACTIVE_AUTH_ROLE_KEY = 'activeAuthRole';

const getRoleKey = (role) => role?.replace(/\s+/g, '_') || 'default';
const getTokenStorageKey = (role) => `${AUTH_TOKEN_PREFIX}${getRoleKey(role)}`;
const getUserStorageKey = (role) => `${AUTH_USER_PREFIX}${getRoleKey(role)}`;
const getActiveAuthRole = () => sessionStorage.getItem(ACTIVE_AUTH_ROLE_KEY) || localStorage.getItem(ACTIVE_AUTH_ROLE_KEY);

// Helper: Check if JWT token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (e) {
    return true; // Invalid token
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user and token from localStorage on mount
  useEffect(() => {
    const activeRole = getActiveAuthRole();
    const storedToken = activeRole
      ? localStorage.getItem(getTokenStorageKey(activeRole))
      : localStorage.getItem('token');
    const storedUser = activeRole
      ? localStorage.getItem(getUserStorageKey(activeRole))
      : localStorage.getItem('user');

    // Only set if token exists, user exists, and token is not expired
    if (storedToken && storedUser && !isTokenExpired(storedToken)) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    } else {
      // Clear expired/invalid auth data
      if (activeRole) {
        localStorage.removeItem(getTokenStorageKey(activeRole));
        localStorage.removeItem(getUserStorageKey(activeRole));
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      localStorage.removeItem(ACTIVE_AUTH_ROLE_KEY);
      sessionStorage.removeItem(ACTIVE_AUTH_ROLE_KEY);
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (userData, authToken) => {
    const roleKey = getRoleKey(userData.role);
    setUser(userData);
    setToken(authToken);
    localStorage.setItem(getTokenStorageKey(roleKey), authToken);
    localStorage.setItem(getUserStorageKey(roleKey), JSON.stringify(userData));
    localStorage.setItem(ACTIVE_AUTH_ROLE_KEY, roleKey);
    sessionStorage.setItem(ACTIVE_AUTH_ROLE_KEY, roleKey);
  };

  // Logout function
  const logout = () => {
    const activeRole = getActiveAuthRole();
    setUser(null);
    setToken(null);
    if (activeRole) {
      localStorage.removeItem(getTokenStorageKey(activeRole));
      localStorage.removeItem(getUserStorageKey(activeRole));
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    localStorage.removeItem(ACTIVE_AUTH_ROLE_KEY);
    sessionStorage.removeItem(ACTIVE_AUTH_ROLE_KEY);
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!token && !!user;
  };

  // Get user role
  const getUserRole = () => {
    return user?.role || null;
  };

  // Get vendor type
  const getVendorType = () => {
    return user?.vendorType || null;
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated,
    getUserRole,
    getVendorType
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
