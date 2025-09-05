/**
 * Cookie utility functions for secure cookie management
 */

const COOKIE_OPTIONS = {
  // Authentication token cookie options
  auth: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    path: '/'
  },
  
  // Theme preference cookie options (accessible by client)
  theme: {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year in milliseconds
    path: '/'
  },

  // Session ID cookie options
  session: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    path: '/'
  }
};

/**
 * Set authentication token cookie
 * @param {Object} res - Express response object
 * @param {string} token - JWT token
 */
const setAuthCookie = (res, token) => {
  res.cookie('filmfusion-auth-token', token, COOKIE_OPTIONS.auth);
};

/**
 * Set theme preference cookie
 * @param {Object} res - Express response object
 * @param {string} theme - Theme preference ('dark' or 'light')
 */
const setThemeCookie = (res, theme) => {
  res.cookie('filmfusion-theme', theme, COOKIE_OPTIONS.theme);
};

/**
 * Set session ID cookie
 * @param {Object} res - Express response object
 * @param {string} sessionId - Session identifier
 */
const setSessionCookie = (res, sessionId) => {
  res.cookie('filmfusion-session', sessionId, COOKIE_OPTIONS.session);
};

/**
 * Clear authentication cookie
 * @param {Object} res - Express response object
 */
const clearAuthCookie = (res) => {
  res.clearCookie('filmfusion-auth-token', {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
  });
};

/**
 * Clear theme cookie
 * @param {Object} res - Express response object
 */
const clearThemeCookie = (res) => {
  res.clearCookie('filmfusion-theme', {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
  });
};

/**
 * Clear session cookie
 * @param {Object} res - Express response object
 */
const clearSessionCookie = (res) => {
  res.clearCookie('filmfusion-session', {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
  });
};

/**
 * Clear all FilmFusion cookies
 * @param {Object} res - Express response object
 */
const clearAllCookies = (res) => {
  clearAuthCookie(res);
  clearThemeCookie(res);
  clearSessionCookie(res);
};

/**
 * Get token from request (checks both cookies and headers)
 * @param {Object} req - Express request object
 * @returns {string|null} - JWT token or null
 */
const getTokenFromRequest = (req) => {
  // First check cookies
  if (req.cookies && req.cookies['filmfusion-auth-token']) {
    return req.cookies['filmfusion-auth-token'];
  }
  
  // Fallback to Authorization header
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  
  return null;
};

/**
 * Get theme from request cookies
 * @param {Object} req - Express request object
 * @returns {string} - Theme preference or default 'dark'
 */
const getThemeFromRequest = (req) => {
  if (req.cookies && req.cookies['filmfusion-theme']) {
    return req.cookies['filmfusion-theme'];
  }
  return 'dark'; // Default theme
};

/**
 * Validate cookie security settings for production
 * @returns {boolean} - True if settings are secure for production
 */
const validateCookieSettings = () => {
  if (process.env.NODE_ENV === 'production') {
    // In production, ensure secure cookies are enabled
    return COOKIE_OPTIONS.auth.secure && COOKIE_OPTIONS.theme.secure;
  }
  return true;
};

module.exports = {
  COOKIE_OPTIONS,
  setAuthCookie,
  setThemeCookie,
  setSessionCookie,
  clearAuthCookie,
  clearThemeCookie,
  clearSessionCookie,
  clearAllCookies,
  getTokenFromRequest,
  getThemeFromRequest,
  validateCookieSettings
};
