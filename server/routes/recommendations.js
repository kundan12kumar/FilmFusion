const express = require('express');
const axios = require('axios');
const { query } = require('../database/connection');
const { authenticateToken } = require('../middleware/auth');
const { userRecommendationsCache, similarCache } = require('../middleware/cache');

const router = express.Router();

const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

// Helper function to calculate cosine similarity between two users
const calculateCosineSimilarity = (userA, userB) => {
  const commonMovies = Object.keys(userA).filter(movieId => movieId in userB);
  
  if (commonMovies.length === 0) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  commonMovies.forEach(movieId => {
    dotProduct += userA[movieId] * userB[movieId];
    normA += userA[movieId] * userA[movieId];
    normB += userB[movieId] * userB[movieId];
  });
  
  if (normA === 0 || normB === 0) return 0;
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

// Get personalized recommendations
router.get('/', authenticateToken, userRecommendationsCache, async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    // Get user's ratings
    const userRatingsResult = await query(
      'SELECT content_id, rating FROM ratings WHERE user_id = $1 AND content_type = $2',
      [userId, 'movie']
    );

    if (userRatingsResult.rows.length < 3) {
      // If user has fewer than 3 ratings, return popular movies
      return await getPopularRecommendations(res, page, limit);
    }

    const userRatings = {};
    userRatingsResult.rows.forEach(row => {
      userRatings[row.content_id] = row.rating;
    });

    // Get all other users' ratings
    const allRatingsResult = await query(
      'SELECT user_id, content_id, rating FROM ratings WHERE user_id != $1 AND content_type = $2',
      [userId, 'movie']
    );

    // Group ratings by user
    const otherUsers = {};
    allRatingsResult.rows.forEach(row => {
      if (!otherUsers[row.user_id]) {
        otherUsers[row.user_id] = {};
      }
      otherUsers[row.user_id][row.content_id] = row.rating;
    });

    // Calculate similarities with other users
    const similarities = [];
    Object.keys(otherUsers).forEach(otherUserId => {
      const similarity = calculateCosineSimilarity(userRatings, otherUsers[otherUserId]);
      if (similarity > 0.1) { // Only consider users with some similarity
        similarities.push({
          userId: otherUserId,
          similarity,
          ratings: otherUsers[otherUserId]
        });
      }
    });

    // Sort by similarity
    similarities.sort((a, b) => b.similarity - a.similarity);

    // Get movie recommendations from similar users
    const movieScores = {};
    const topSimilarUsers = similarities.slice(0, 10); // Top 10 similar users

    topSimilarUsers.forEach(({ similarity, ratings }) => {
      Object.keys(ratings).forEach(movieId => {
        if (!userRatings[movieId]) { // User hasn't rated this movie
          if (!movieScores[movieId]) {
            movieScores[movieId] = { score: 0, count: 0 };
          }
          movieScores[movieId].score += ratings[movieId] * similarity;
          movieScores[movieId].count += similarity;
        }
      });
    });

    // Calculate average scores and sort
    const recommendations = Object.keys(movieScores)
      .map(movieId => ({
        movieId: parseInt(movieId),
        score: movieScores[movieId].score / movieScores[movieId].count
      }))
      .filter(rec => rec.score >= 3.5) // Only recommend movies with good predicted ratings
      .sort((a, b) => b.score - a.score);

    if (recommendations.length === 0) {
      return await getPopularRecommendations(res, page, limit);
    }

    // Get movie details from cache or TMDB
    const movieIds = recommendations.slice(0, limit).map(rec => rec.movieId);
    const movieDetails = await getMovieDetails(movieIds);

    res.json({
      recommendations: movieDetails.map((movie, index) => ({
        ...movie,
        recommendationScore: recommendations[index].score
      })),
      total: recommendations.length,
      page: parseInt(page),
      algorithm: 'collaborative_filtering'
    });

  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

// Fallback to popular movies when collaborative filtering isn't possible
const getPopularRecommendations = async (res, page, limit) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
      params: {
        api_key: TMDB_API_KEY,
        page
      }
    });

    res.json({
      recommendations: response.data.results.slice(0, limit),
      total: response.data.total_results,
      page: parseInt(page),
      algorithm: 'popular_fallback'
    });
  } catch (error) {
    throw error;
  }
};

// Get movie details from cache or TMDB
const getMovieDetails = async (movieIds) => {
  try {
    // First try to get from cache
    const cachedResult = await query(
      'SELECT * FROM content_cache WHERE content_id = ANY($1) AND content_type = $2',
      [movieIds, 'movie']
    );

    const cachedMovies = {};
    cachedResult.rows.forEach(movie => {
      cachedMovies[movie.content_id] = {
        id: movie.content_id,
        title: movie.title,
        overview: movie.overview,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        release_date: movie.release_date,
        genre_ids: movie.genre_ids,
        vote_average: movie.vote_average,
        vote_count: movie.vote_count,
        popularity: movie.popularity
      };
    });

    // Get missing movies from TMDB
    const missingIds = movieIds.filter(id => !cachedMovies[id]);
    const tmdbMovies = {};

    if (missingIds.length > 0) {
      // Note: TMDB doesn't have a bulk endpoint, so we'd need to make individual requests
      // For now, we'll skip missing movies to avoid rate limits
      console.log(`Skipping ${missingIds.length} movies not in cache`);
    }

    // Return movies in the same order as requested
    return movieIds
      .map(id => cachedMovies[id] || tmdbMovies[id])
      .filter(movie => movie !== undefined);

  } catch (error) {
    console.error('Error getting movie details:', error);
    return [];
  }
};

// Get genre-based recommendations
router.get('/by-genre/:genreId', authenticateToken, async (req, res) => {
  try {
    const { genreId } = req.params;
    const { page = 1 } = req.query;

    const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        with_genres: genreId,
        sort_by: 'vote_average.desc',
        'vote_count.gte': 100,
        page
      }
    });

    res.json({
      recommendations: response.data.results,
      total: response.data.total_results,
      page: parseInt(page),
      algorithm: 'genre_based'
    });
  } catch (error) {
    console.error('Error getting genre recommendations:', error);
    res.status(500).json({ error: 'Failed to get genre recommendations' });
  }
});

// Get recommendations based on a specific movie (similar movies)
router.get('/similar/:movieId', similarCache, async (req, res) => {
  try {
    const { movieId } = req.params;
    const { page = 1 } = req.query;

    const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}/similar`, {
      params: {
        api_key: TMDB_API_KEY,
        page
      }
    });

    res.json({
      recommendations: response.data.results,
      total: response.data.total_results,
      page: parseInt(page),
      algorithm: 'content_based'
    });
  } catch (error) {
    console.error('Error getting similar movies:', error);
    res.status(500).json({ error: 'Failed to get similar movies' });
  }
});

module.exports = router;
