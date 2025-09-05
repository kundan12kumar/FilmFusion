const express = require('express');
const axios = require('axios');
const { query } = require('../database/connection');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const {
  trendingCache,
  popularCache,
  categoryCache,
  movieDetailsCache,
  searchCache,
  genresCache
} = require('../middleware/cache');

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

// Helper function to determine content category based on origin and language
const determineCategory = (item, contentType) => {
  const originCountry = item.origin_country || [];
  const originalLanguage = item.original_language || '';
  
  // K-Drama detection
  if (originCountry.includes('KR') || originalLanguage === 'ko') {
    return 'k_drama';
  }
  
  // Anime detection
  if (originCountry.includes('JP') || originalLanguage === 'ja') {
    return 'anime';
  }
  
  // South Indian films detection
  if (originalLanguage === 'ta' || originalLanguage === 'te' || 
      originalLanguage === 'ml' || originalLanguage === 'kn') {
    return 'south';
  }
  
  // Bollywood detection
  if (originalLanguage === 'hi' || originCountry.includes('IN')) {
    return 'bollywood';
  }
  
  // Web series detection (for TV content)
  if (contentType === 'tv') {
    return 'web_series';
  }
  
  // Default to Hollywood
  return 'hollywood';
};

// Helper function to add category tags to content items
const addCategoryTags = (items, contentType) => {
  return items.map(item => ({
    ...item,
    content_type: contentType,
    category: determineCategory(item, contentType)
  }));
};

// Cache content in database
const cacheContent = async (item, contentType) => {
  try {
    const category = determineCategory(item, contentType);

    // Ensure we have a title - use name for TV shows if title is missing
    const title = item.title || item.name || 'Unknown Title';

    await query(
      `INSERT INTO content_cache (content_id, content_type, category, title, name, overview,
       poster_path, backdrop_path, release_date, first_air_date, genre_ids, vote_average,
       vote_count, popularity, origin_country, original_language)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
       ON CONFLICT (content_id, content_type) DO UPDATE SET
       category = EXCLUDED.category,
       title = EXCLUDED.title,
       name = EXCLUDED.name,
       overview = EXCLUDED.overview,
       poster_path = EXCLUDED.poster_path,
       backdrop_path = EXCLUDED.backdrop_path,
       release_date = EXCLUDED.release_date,
       first_air_date = EXCLUDED.first_air_date,
       genre_ids = EXCLUDED.genre_ids,
       vote_average = EXCLUDED.vote_average,
       vote_count = EXCLUDED.vote_count,
       popularity = EXCLUDED.popularity,
       origin_country = EXCLUDED.origin_country,
       original_language = EXCLUDED.original_language,
       cached_at = CURRENT_TIMESTAMP`,
      [
        item.id,
        contentType,
        category,
        title,
        item.name || null,
        item.overview || '',
        item.poster_path,
        item.backdrop_path,
        item.release_date || null,
        item.first_air_date || null,
        item.genre_ids || [],
        item.vote_average || 0,
        item.vote_count || 0,
        item.popularity || 0,
        item.origin_country || [],
        item.original_language || ''
      ]
    );
  } catch (error) {
    console.error('Error caching content:', error);
  }
};

// Get trending content (movies and TV shows)
router.get('/trending', optionalAuth, trendingCache, async (req, res) => {
  try {
    const { page = 1, category } = req.query;
    
    // Get both movies and TV shows
    const [moviesData, tvData] = await Promise.all([
      tmdbRequest('/trending/movie/week', { page }),
      tmdbRequest('/trending/tv/week', { page })
    ]);
    
    // Add category tags
    const movies = addCategoryTags(moviesData.results, 'movie');
    const tvShows = addCategoryTags(tvData.results, 'tv');
    
    // Combine and sort by popularity
    let allContent = [...movies, ...tvShows].sort((a, b) => b.popularity - a.popularity);
    
    // Filter by category if specified
    if (category && category !== 'all') {
      allContent = allContent.filter(item => item.category === category);
    }
    
    // Cache content in background (disabled to prevent timeouts)
    // allContent.forEach(item => cacheContent(item, item.content_type));
    
    res.json({
      page: parseInt(page),
      results: allContent.slice(0, 20), // Limit to 20 items per page
      total_pages: Math.max(moviesData.total_pages, tvData.total_pages),
      total_results: moviesData.total_results + tvData.total_results
    });
  } catch (error) {
    console.error('Error fetching trending content:', error);
    res.status(500).json({ error: 'Failed to fetch trending content' });
  }
});

// Get popular content by category
router.get('/popular', optionalAuth, popularCache, async (req, res) => {
  try {
    const { page = 1, category = 'all' } = req.query;
    
    // Get both movies and TV shows
    const [moviesData, tvData] = await Promise.all([
      tmdbRequest('/movie/popular', { page }),
      tmdbRequest('/tv/popular', { page })
    ]);
    
    // Add category tags
    const movies = addCategoryTags(moviesData.results, 'movie');
    const tvShows = addCategoryTags(tvData.results, 'tv');
    
    // Combine and sort by popularity
    let allContent = [...movies, ...tvShows].sort((a, b) => b.popularity - a.popularity);
    
    // Filter by category if specified
    if (category !== 'all') {
      allContent = allContent.filter(item => item.category === category);
    }
    
    // Cache content in background (disabled to prevent timeouts)
    // allContent.forEach(item => cacheContent(item, item.content_type));
    
    res.json({
      page: parseInt(page),
      results: allContent.slice(0, 20),
      total_pages: Math.max(moviesData.total_pages, tvData.total_pages),
      total_results: moviesData.total_results + tvData.total_results
    });
  } catch (error) {
    console.error('Error fetching popular content:', error);
    res.status(500).json({ error: 'Failed to fetch popular content' });
  }
});

// Get content by specific category with high ratings
router.get('/category/:category', optionalAuth, categoryCache, async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1 } = req.query;
    
    let content = [];
    
    // Define search parameters based on category
    const categoryParams = {
      k_drama: { with_origin_country: 'KR', with_original_language: 'ko' },
      anime: { with_origin_country: 'JP', with_original_language: 'ja' },
      bollywood: { with_origin_country: 'IN', with_original_language: 'hi' },
      south: { with_original_language: 'ta|te|ml|kn' },
      hollywood: { with_origin_country: 'US|GB|CA|AU' },
      web_series: {} // Will be handled separately for TV content
    };
    
    // Fetch multiple pages from TMDB to ensure we have enough content for pagination
    const pagesToFetch = Math.min(5, Math.ceil((page * 20) / 20) + 2); // Fetch enough pages to support pagination
    const tmdbPages = Array.from({ length: pagesToFetch }, (_, i) => i + 1);

    if (category === 'web_series') {
      // For web series, get TV shows from multiple pages
      const tvPromises = tmdbPages.map(tmdbPage =>
        tmdbRequest('/discover/tv', {
          page: tmdbPage,
          sort_by: 'vote_average.desc',
          'vote_count.gte': 100,
          ...categoryParams[category]
        })
      );
      const tvResponses = await Promise.all(tvPromises);
      const allTvResults = tvResponses.flatMap(response => response.results);
      content = addCategoryTags(allTvResults, 'tv');
    } else if (category === 'k_drama') {
      // For K-dramas, get both movies and TV shows from multiple pages
      const moviePromises = tmdbPages.map(tmdbPage =>
        tmdbRequest('/discover/movie', {
          page: tmdbPage,
          sort_by: 'vote_average.desc',
          'vote_count.gte': 100,
          ...categoryParams[category]
        })
      );
      const tvPromises = tmdbPages.map(tmdbPage =>
        tmdbRequest('/discover/tv', {
          page: tmdbPage,
          sort_by: 'vote_average.desc',
          'vote_count.gte': 100,
          ...categoryParams[category]
        })
      );
      const [movieResponses, tvResponses] = await Promise.all([
        Promise.all(moviePromises),
        Promise.all(tvPromises)
      ]);
      const allMovieResults = movieResponses.flatMap(response => response.results);
      const allTvResults = tvResponses.flatMap(response => response.results);
      const movies = addCategoryTags(allMovieResults, 'movie');
      const tvShows = addCategoryTags(allTvResults, 'tv');
      content = [...movies, ...tvShows].sort((a, b) => b.vote_average - a.vote_average);
    } else {
      // For other categories, get movies from multiple pages
      const moviePromises = tmdbPages.map(tmdbPage =>
        tmdbRequest('/discover/movie', {
          page: tmdbPage,
          sort_by: 'vote_average.desc',
          'vote_count.gte': 100,
          ...categoryParams[category]
        })
      );
      const movieResponses = await Promise.all(moviePromises);
      const allMovieResults = movieResponses.flatMap(response => response.results);
      content = addCategoryTags(allMovieResults, 'movie');
    }
    
    // Cache content in background (disabled to prevent timeouts)
    // content.forEach(item => cacheContent(item, item.content_type));

    // Implement proper pagination
    const pageNum = parseInt(page);
    const itemsPerPage = 20; // Always 20 items per page
    const startIndex = (pageNum - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    res.json({
      page: pageNum,
      results: content.slice(startIndex, endIndex),
      category,
      total_results: content.length,
      has_more: endIndex < content.length
    });
  } catch (error) {
    console.error('Error fetching category content:', error);
    res.status(500).json({ error: 'Failed to fetch category content' });
  }
});

// Universal search across all content types
router.get('/search', optionalAuth, searchCache, async (req, res) => {
  try {
    const { query: searchQuery, page = 1 } = req.query;

    if (!searchQuery) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    // Search both movies and TV shows
    const [moviesData, tvData] = await Promise.all([
      tmdbRequest('/search/movie', { query: searchQuery, page }),
      tmdbRequest('/search/tv', { query: searchQuery, page })
    ]);

    // Add category tags
    const movies = addCategoryTags(moviesData.results, 'movie');
    const tvShows = addCategoryTags(tvData.results, 'tv');

    // Combine and sort by popularity
    const allContent = [...movies, ...tvShows].sort((a, b) => b.popularity - a.popularity);

    // Cache content in background (disabled to prevent timeouts)
    // allContent.forEach(item => cacheContent(item, item.content_type));

    res.json({
      page: parseInt(page),
      results: allContent,
      total_pages: Math.max(moviesData.total_pages, tvData.total_pages),
      total_results: moviesData.total_results + tvData.total_results
    });
  } catch (error) {
    console.error('Error searching content:', error);
    res.status(500).json({ error: 'Failed to search content' });
  }
});

// Get content details (movie or TV show)
router.get('/:type/:id', optionalAuth, movieDetailsCache, async (req, res) => {
  try {
    const { type, id } = req.params;

    if (!['movie', 'tv'].includes(type)) {
      return res.status(400).json({ error: 'Invalid content type' });
    }

    const data = await tmdbRequest(`/${type}/${id}`, {
      append_to_response: 'credits,videos,similar'
    });

    // Add category tag
    const contentWithCategory = {
      ...data,
      content_type: type,
      category: determineCategory(data, type)
    };

    await cacheContent(contentWithCategory, type);

    res.json(contentWithCategory);
  } catch (error) {
    console.error('Error fetching content details:', error);
    res.status(500).json({ error: 'Failed to fetch content details' });
  }
});

// Get genres for movies and TV shows
router.get('/genres/:type', genresCache, async (req, res) => {
  try {
    const { type } = req.params;

    if (!['movie', 'tv'].includes(type)) {
      return res.status(400).json({ error: 'Invalid content type' });
    }

    const data = await tmdbRequest(`/genre/${type}/list`);
    res.json(data);
  } catch (error) {
    console.error('Error fetching genres:', error);
    res.status(500).json({ error: 'Failed to fetch genres' });
  }
});

// Discover content with filters
router.get('/discover/:type', optionalAuth, async (req, res) => {
  try {
    const { type } = req.params;
    const {
      page = 1,
      genre,
      year,
      sort_by = 'popularity.desc',
      vote_average_gte,
      vote_average_lte,
      category
    } = req.query;

    if (!['movie', 'tv'].includes(type)) {
      return res.status(400).json({ error: 'Invalid content type' });
    }

    let params = {
      page,
      sort_by,
      with_genres: genre,
      'vote_average.gte': vote_average_gte,
      'vote_average.lte': vote_average_lte
    };

    // Add year parameter based on content type
    if (year) {
      if (type === 'movie') {
        params.year = year;
      } else {
        params.first_air_date_year = year;
      }
    }

    // Add category-specific filters
    if (category) {
      const categoryParams = {
        k_drama: { with_origin_country: 'KR', with_original_language: 'ko' },
        anime: { with_origin_country: 'JP', with_original_language: 'ja' },
        bollywood: { with_origin_country: 'IN', with_original_language: 'hi' },
        south: { with_original_language: 'ta|te|ml|kn' },
        hollywood: { with_origin_country: 'US|GB|CA|AU' }
      };

      if (categoryParams[category]) {
        params = { ...params, ...categoryParams[category] };
      }
    }

    // Remove undefined values
    Object.keys(params).forEach(key => {
      if (params[key] === undefined) {
        delete params[key];
      }
    });

    const data = await tmdbRequest(`/discover/${type}`, params);

    // Add category tags
    const contentWithCategories = addCategoryTags(data.results, type);

    // Cache content in background
    contentWithCategories.forEach(item => cacheContent(item, type));

    res.json({
      ...data,
      results: contentWithCategories
    });
  } catch (error) {
    console.error('Error discovering content:', error);
    res.status(500).json({ error: 'Failed to discover content' });
  }
});

module.exports = router;
