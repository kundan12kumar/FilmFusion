import axios from 'axios';
import { getAuthToken } from '../utils/cookies';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies in requests
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  // Try to get token from cookies first, then localStorage
  const token = getAuthToken() || localStorage.getItem('filmfusion-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('filmfusion-token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  googleLogin: (token) => api.post('/auth/google', { token }),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/users/profile'),
};

// Movies API (legacy - kept for backward compatibility)
export const moviesAPI = {
  getTrending: (page = 1) => api.get(`/movies/trending?page=${page}`),
  getPopular: (page = 1) => api.get(`/movies/popular?page=${page}`),
  search: (query, page = 1) => api.get(`/movies/search?query=${encodeURIComponent(query)}&page=${page}`),
  getDetails: (movieId) => api.get(`/movies/${movieId}`),
  getGenres: () => api.get('/movies/genres/list'),
  discover: (filters) => {
    const params = new URLSearchParams(filters).toString();
    return api.get(`/movies/discover/movies?${params}`);
  },
};

// New unified Content API
export const contentAPI = {
  getTrending: (page = 1, category = 'all') => api.get(`/content/trending?page=${page}&category=${category}`),
  getPopular: (page = 1, category = 'all') => api.get(`/content/popular?page=${page}&category=${category}`),
  getByCategory: (category, page = 1) => api.get(`/content/category/${category}?page=${page}`),
  search: (query, page = 1) => api.get(`/content/search?query=${encodeURIComponent(query)}&page=${page}`),
  getDetails: (type, contentId) => api.get(`/content/${type}/${contentId}`),
  getGenres: (type) => api.get(`/content/genres/${type}`),
  discover: (type, filters) => {
    const params = new URLSearchParams(filters).toString();
    return api.get(`/content/discover/${type}?${params}`);
  },
};

// User API (updated to support all content types)
export const userAPI = {
  // Legacy movie functions for backward compatibility
  rateMovie: (movieId, rating, review) => api.post('/users/rate', { movieId, rating, review }),
  getUserRating: (movieId) => api.get(`/users/rating/${movieId}`),
  addToWatchlist: (movieId) => api.post('/users/watchlist', { movieId }),
  removeFromWatchlist: (movieId) => api.delete(`/users/watchlist/${movieId}`),
  checkWatchlist: (movieId) => api.get(`/users/watchlist/check/${movieId}`),

  // New content functions
  rateContent: (contentId, contentType, category, rating, review) =>
    api.post('/users/rate', { contentId, contentType, category, rating, review }),
  getContentRating: (contentId, contentType = 'movie') =>
    api.get(`/users/rating/${contentId}?contentType=${contentType}`),
  addContentToWatchlist: (contentId, contentType, category) =>
    api.post('/users/watchlist', { contentId, contentType, category }),
  removeContentFromWatchlist: (contentId, contentType = 'movie') =>
    api.delete(`/users/watchlist/${contentId}/${contentType}`),
  checkContentWatchlist: (contentId, contentType = 'movie') =>
    api.get(`/users/watchlist/check/${contentId}?contentType=${contentType}`),

  // Common functions
  getRatings: (page = 1) => api.get(`/users/ratings?page=${page}`),
  getWatchlist: (page = 1) => api.get(`/users/watchlist?page=${page}`),
};

// Recommendations API
export const recommendationsAPI = {
  getPersonalized: (page = 1) => api.get(`/recommendations?page=${page}`),
  getByGenre: (genreId, page = 1) => api.get(`/recommendations/by-genre/${genreId}?page=${page}`),
  getSimilar: (movieId, page = 1) => api.get(`/recommendations/similar/${movieId}?page=${page}`),
};

// Preferences API
export const preferencesAPI = {
  getTheme: () => api.get('/preferences/theme'),
  setTheme: (theme) => api.post('/preferences/theme', { theme }),
};

export default api;
