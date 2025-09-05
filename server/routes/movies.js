const express = require('express');
const axios = require('axios');
const { query } = require('../database/connection');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

// Helper function to make TMDB API calls
const tmdbRequest = async (endpoint, params = {}) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}${endpoint}`, {
      params: {
        api_key: TMDB_API_KEY,
        ...params
      }
    });
    return response.data;
  } catch (error) {
    console.error('TMDB API error:', error.response?.data || error.message);
    throw new Error('Failed to fetch data from TMDB');
  }
};

// Cache movie data in database (updated to use content_cache)
const cacheMovie = async (movie) => {
  try {
    await query(
      `INSERT INTO content_cache (content_id, content_type, category, title, overview, poster_path, backdrop_path,
       release_date, genre_ids, vote_average, vote_count, popularity, original_language, origin_country)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       ON CONFLICT (content_id, content_type) DO UPDATE SET
       category = EXCLUDED.category,
       title = EXCLUDED.title,
       overview = EXCLUDED.overview,
       poster_path = EXCLUDED.poster_path,
       backdrop_path = EXCLUDED.backdrop_path,
       release_date = EXCLUDED.release_date,
       genre_ids = EXCLUDED.genre_ids,
       vote_average = EXCLUDED.vote_average,
       vote_count = EXCLUDED.vote_count,
       popularity = EXCLUDED.popularity,
       original_language = EXCLUDED.original_language,
       origin_country = EXCLUDED.origin_country,
       cached_at = CURRENT_TIMESTAMP`,
      [
        movie.id,
        'movie',
        'hollywood', // Default category for movies
        movie.title || 'Unknown Title',
        movie.overview || '',
        movie.poster_path,
        movie.backdrop_path,
        movie.release_date,
        movie.genre_ids || [],
        movie.vote_average || 0,
        movie.vote_count || 0,
        movie.popularity || 0,
        movie.original_language || 'en',
        movie.origin_country || ['US']
      ]
    );
  } catch (error) {
    console.error('Error caching movie:', error);
  }
};

// Get trending movies
router.get('/trending', optionalAuth, async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const data = await tmdbRequest('/trending/movie/week', { page });
    
    // Cache movies in background
    data.results.forEach(movie => cacheMovie(movie));
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    res.status(500).json({ error: 'Failed to fetch trending movies' });
  }
});

// Get popular movies
router.get('/popular', optionalAuth, async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const data = await tmdbRequest('/movie/popular', { page });
    
    data.results.forEach(movie => cacheMovie(movie));
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    res.status(500).json({ error: 'Failed to fetch popular movies' });
  }
});

// Search movies
router.get('/search', optionalAuth, async (req, res) => {
  try {
    const { query: searchQuery, page = 1 } = req.query;
    
    if (!searchQuery) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const data = await tmdbRequest('/search/movie', { 
      query: searchQuery, 
      page 
    });
    
    data.results.forEach(movie => cacheMovie(movie));
    
    res.json(data);
  } catch (error) {
    console.error('Error searching movies:', error);
    res.status(500).json({ error: 'Failed to search movies' });
  }
});

// Get movie details
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const data = await tmdbRequest(`/movie/${id}`, {
      append_to_response: 'credits,videos,similar'
    });
    
    await cacheMovie(data);
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching movie details:', error);
    res.status(500).json({ error: 'Failed to fetch movie details' });
  }
});

// Get movie genres
router.get('/genres/list', async (req, res) => {
  try {
    const data = await tmdbRequest('/genre/movie/list');
    res.json(data);
  } catch (error) {
    console.error('Error fetching genres:', error);
    res.status(500).json({ error: 'Failed to fetch genres' });
  }
});

// Discover movies with filters
router.get('/discover/movies', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      genre,
      year,
      sort_by = 'popularity.desc',
      vote_average_gte,
      vote_average_lte
    } = req.query;
    
    const params = {
      page,
      sort_by,
      with_genres: genre,
      year,
      'vote_average.gte': vote_average_gte,
      'vote_average.lte': vote_average_lte
    };
    
    // Remove undefined values
    Object.keys(params).forEach(key => {
      if (params[key] === undefined) {
        delete params[key];
      }
    });
    
    const data = await tmdbRequest('/discover/movie', params);
    
    data.results.forEach(movie => cacheMovie(movie));
    
    res.json(data);
  } catch (error) {
    console.error('Error discovering movies:', error);
    res.status(500).json({ error: 'Failed to discover movies' });
  }
});

module.exports = router;
