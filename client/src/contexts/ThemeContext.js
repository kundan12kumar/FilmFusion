import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getThemePreference,
  setThemePreference,
  areCookiesEnabled
} from '../utils/cookies';
import { preferencesAPI } from '../services/api';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Get theme from cookies first, then localStorage, or default to 'dark'
    const cookieTheme = getThemePreference();
    const localTheme = localStorage.getItem('filmfusion-theme');
    return cookieTheme || localTheme || 'dark';
  });
  const [cookiesEnabled, setCookiesEnabled] = useState(true);

  useEffect(() => {
    // Check if cookies are enabled
    setCookiesEnabled(areCookiesEnabled());
  }, []);

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Save to both cookies and localStorage
    if (cookiesEnabled) {
      setThemePreference(theme);
      // Also sync with server
      preferencesAPI.setTheme(theme).catch(error => {
        console.warn('Failed to sync theme with server:', error);
      });
    }
    localStorage.setItem('filmfusion-theme', theme);
  }, [theme, cookiesEnabled]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  const value = {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
    cookiesEnabled
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
