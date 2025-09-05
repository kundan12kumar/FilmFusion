import Cookies from 'js-cookie';

/**
 * Cookie utility functions for client-side cookie management
 */

const COOKIE_NAMES = {
  AUTH_TOKEN: 'filmfusion-auth-token',
  THEME: 'filmfusion-theme',
  SESSION: 'filmfusion-session'
};

const COOKIE_OPTIONS = {
  // Default options for client-accessible cookies
  default: {
    expires: 7, // 7 days
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
  },
  
  // Theme preference options (longer expiry)
  theme: {
    expires: 365, // 1 year
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
  }
};

/**
 * Get authentication token from cookies
 * @returns {string|null} - JWT token or null
 */
export const getAuthToken = () => {
  return Cookies.get(COOKIE_NAMES.AUTH_TOKEN) || null;
};

/**
 * Set authentication token cookie (client-side accessible)
 * Note: This is for fallback only. Server should set HTTP-only cookies
 * @param {string} token - JWT token
 */
export const setAuthToken = (token) => {
  Cookies.set(COOKIE_NAMES.AUTH_TOKEN, token, COOKIE_OPTIONS.default);
};

/**
 * Remove authentication token cookie
 */
export const removeAuthToken = () => {
  Cookies.remove(COOKIE_NAMES.AUTH_TOKEN);
};

/**
 * Get theme preference from cookies
 * @returns {string} - Theme preference or default 'dark'
 */
export const getThemePreference = () => {
  return Cookies.get(COOKIE_NAMES.THEME) || 'dark';
};

/**
 * Set theme preference cookie
 * @param {string} theme - Theme preference ('dark', 'light', 'purple')
 */
export const setThemePreference = (theme) => {
  if (!['dark', 'light', 'purple'].includes(theme)) {
    console.warn('Invalid theme preference:', theme);
    return;
  }
  Cookies.set(COOKIE_NAMES.THEME, theme, COOKIE_OPTIONS.theme);
};

/**
 * Remove theme preference cookie
 */
export const removeThemePreference = () => {
  Cookies.remove(COOKIE_NAMES.THEME);
};

/**
 * Get session ID from cookies
 * @returns {string|null} - Session ID or null
 */
export const getSessionId = () => {
  return Cookies.get(COOKIE_NAMES.SESSION) || null;
};

/**
 * Check if user is authenticated based on cookies
 * @returns {boolean} - True if auth token exists
 */
export const isAuthenticated = () => {
  return !!getAuthToken();
};

/**
 * Clear all FilmFusion cookies
 */
export const clearAllCookies = () => {
  removeAuthToken();
  removeThemePreference();
  Cookies.remove(COOKIE_NAMES.SESSION);
};

/**
 * Get all FilmFusion cookies
 * @returns {Object} - Object containing all cookie values
 */
export const getAllCookies = () => {
  return {
    authToken: getAuthToken(),
    theme: getThemePreference(),
    sessionId: getSessionId()
  };
};

/**
 * Check if cookies are enabled in the browser
 * @returns {boolean} - True if cookies are enabled
 */
export const areCookiesEnabled = () => {
  try {
    // Try to set a test cookie
    const testKey = 'filmfusion-test';
    Cookies.set(testKey, 'test', { expires: 1 });
    const testValue = Cookies.get(testKey);
    Cookies.remove(testKey);
    return testValue === 'test';
  } catch (error) {
    return false;
  }
};

/**
 * Migrate data from localStorage to cookies
 * This helps with the transition from localStorage to cookies
 */
export const migrateFromLocalStorage = () => {
  try {
    // Migrate auth token
    const localToken = localStorage.getItem('filmfusion-token');
    if (localToken && !getAuthToken()) {
      setAuthToken(localToken);
    }
    
    // Migrate theme preference
    const localTheme = localStorage.getItem('filmfusion-theme');
    if (localTheme && !Cookies.get(COOKIE_NAMES.THEME)) {
      setThemePreference(localTheme);
    }
    
    console.log('Migration from localStorage to cookies completed');
  } catch (error) {
    console.warn('Failed to migrate from localStorage to cookies:', error);
  }
};

/**
 * Sync cookies with localStorage for backward compatibility
 */
export const syncWithLocalStorage = () => {
  try {
    // Sync auth token
    const cookieToken = getAuthToken();
    const localToken = localStorage.getItem('filmfusion-token');
    
    if (cookieToken && cookieToken !== localToken) {
      localStorage.setItem('filmfusion-token', cookieToken);
    } else if (!cookieToken && localToken) {
      localStorage.removeItem('filmfusion-token');
    }
    
    // Sync theme preference
    const cookieTheme = getThemePreference();
    const localTheme = localStorage.getItem('filmfusion-theme');
    
    if (cookieTheme && cookieTheme !== localTheme) {
      localStorage.setItem('filmfusion-theme', cookieTheme);
    }
  } catch (error) {
    console.warn('Failed to sync cookies with localStorage:', error);
  }
};

const cookieUtils = {
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  getThemePreference,
  setThemePreference,
  removeThemePreference,
  getSessionId,
  isAuthenticated,
  clearAllCookies,
  getAllCookies,
  areCookiesEnabled,
  migrateFromLocalStorage,
  syncWithLocalStorage,
  COOKIE_NAMES
};

export default cookieUtils;
