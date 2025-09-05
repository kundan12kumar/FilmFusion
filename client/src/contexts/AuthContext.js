import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';
import {
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  migrateFromLocalStorage,
  syncWithLocalStorage,
  areCookiesEnabled
} from '../utils/cookies';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    // Try to get token from cookies first, then localStorage
    return getAuthToken() || localStorage.getItem('filmfusion-token');
  });
  const [loading, setLoading] = useState(true);
  const [cookiesEnabled, setCookiesEnabled] = useState(true);

  useEffect(() => {
    // Check if cookies are enabled and migrate data if needed
    const initializeCookies = () => {
      const enabled = areCookiesEnabled();
      setCookiesEnabled(enabled);

      if (enabled) {
        // Migrate from localStorage to cookies
        migrateFromLocalStorage();
        // Sync cookies with localStorage for backward compatibility
        syncWithLocalStorage();
      }
    };

    initializeCookies();
  }, []);

  const logout = useCallback(async () => {
    try {
      // Call server logout endpoint to clear HTTP-only cookies
      await authAPI.logout();
    } catch (error) {
      console.warn('Server logout failed:', error);
    }

    setUser(null);
    setToken(null);

    // Clear both cookies and localStorage
    if (cookiesEnabled) {
      removeAuthToken();
    }
    localStorage.removeItem('filmfusion-token');
  }, [cookiesEnabled]);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await authAPI.getProfile();
        setUser(response.data);
      } catch (error) {
        console.error('Token validation error:', error);

        // Only logout on authentication errors (401, 403), not server errors (500)
        if (error.response?.status === 401 || error.response?.status === 403) {
          logout();
        } else if (error.response?.status >= 500) {
          // For server errors, keep the token but don't set user data
          console.warn('Server error during token validation, keeping token for retry');
          // Set a minimal user object to indicate authentication without full profile
          const tokenPayload = JSON.parse(atob(token.split('.')[1]));
          setUser({ id: tokenPayload.userId, email: 'Loading...', name: 'Loading...' });
        } else {
          // For other errors, logout
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    // Check if user is logged in on app start
    if (token) {
      validateToken();
    } else {
      setLoading(false);
    }
  }, [token, logout]);



  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);

    // Store in both cookies and localStorage for compatibility
    if (cookiesEnabled) {
      setAuthToken(authToken);
    }
    localStorage.setItem('filmfusion-token', authToken);
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    cookiesEnabled
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
