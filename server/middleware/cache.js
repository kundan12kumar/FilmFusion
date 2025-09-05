 const cacheService = require('../services/cache');

// Generic cache middleware
const cacheMiddleware = (keyGenerator, ttl) => {
  return async (req, res, next) => {
    try {
      // Generate cache key based on request
      const cacheKey = typeof keyGenerator === 'function' 
        ? keyGenerator(req) 
        : keyGenerator;

      // Try to get from cache
      const cachedData = await cacheService.get(cacheKey);
      
      if (cachedData) {
        console.log(`🎯 Cache HIT: ${cacheKey}`);
        return res.json(cachedData);
      }

      console.log(`📥 Cache MISS: ${cacheKey}`);

      // Store original res.json to intercept response
      const originalJson = res.json;
      
      res.json = function(data) {
        // Cache the response data
        if (res.statusCode === 200 && data) {
          cacheService.set(cacheKey, data, ttl).catch(err => {
            console.log('Cache set error:', err.message);
          });
        }
        
        // Call original res.json
        return originalJson.call(this, data);
      };

      next();
    } catch (error) {
      console.log('Cache middleware error:', error.message);
      next();
    }
  };
};

// Specific cache middleware for different endpoints
const trendingCache = cacheMiddleware(
  (req) => cacheService.constructor.keys.trending(req.query.category || 'all', req.query.page || 1),
  cacheService.constructor.ttl.trending
);

const popularCache = cacheMiddleware(
  (req) => cacheService.constructor.keys.popular(req.query.category || 'all', req.query.page || 1),
  cacheService.constructor.ttl.popular
);

const categoryCache = cacheMiddleware(
  (req) => cacheService.constructor.keys.categoryContent(req.params.category, req.query.page || 1),
  cacheService.constructor.ttl.categoryContent
);

const movieDetailsCache = cacheMiddleware(
  (req) => cacheService.constructor.keys.movieDetails(req.params.type || 'movie', req.params.id),
  cacheService.constructor.ttl.movieDetails
);

const searchCache = cacheMiddleware(
  (req) => cacheService.constructor.keys.search(req.query.query, req.query.page || 1),
  cacheService.constructor.ttl.search
);

const genresCache = cacheMiddleware(
  (req) => cacheService.constructor.keys.genres(req.params.type || 'movie'),
  cacheService.constructor.ttl.genres
);

const similarCache = cacheMiddleware(
  (req) => cacheService.constructor.keys.similar(req.params.movieId || req.params.id, req.query.page || 1),
  cacheService.constructor.ttl.similar
);

// User-specific cache middleware (requires authentication)
const userRecommendationsCache = cacheMiddleware(
  (req) => cacheService.constructor.keys.userRecommendations(req.user.id, req.query.page || 1),
  cacheService.constructor.ttl.userRecommendations
);

const userWatchlistCache = cacheMiddleware(
  (req) => cacheService.constructor.keys.userWatchlist(req.user.id, req.query.page || 1),
  cacheService.constructor.ttl.userWatchlist
);

const userRatingsCache = cacheMiddleware(
  (req) => cacheService.constructor.keys.userRatings(req.user.id, req.query.page || 1),
  cacheService.constructor.ttl.userRatings
);

const userStatsCache = cacheMiddleware(
  (req) => cacheService.constructor.keys.userStats(req.user.id),
  cacheService.constructor.ttl.userStats
);

// Cache invalidation helpers
const invalidateUserCache = async (userId) => {
  try {
    const patterns = [
      cacheService.constructor.keys.userRecommendations(userId, 1),
      cacheService.constructor.keys.userWatchlist(userId, 1),
      cacheService.constructor.keys.userRatings(userId, 1),
      cacheService.constructor.keys.userStats(userId)
    ];

    for (const key of patterns) {
      await cacheService.del(key);
    }
  } catch (error) {
    console.log('Cache invalidation error:', error.message);
  }
};

const invalidateContentCache = async (contentId, contentType = 'movie') => {
  try {
    const key = cacheService.constructor.keys.movieDetails(contentType, contentId);
    await cacheService.del(key);
  } catch (error) {
    console.log('Content cache invalidation error:', error.message);
  }
};

module.exports = {
  cacheMiddleware,
  trendingCache,
  popularCache,
  categoryCache,
  movieDetailsCache,
  searchCache,
  genresCache,
  similarCache,
  userRecommendationsCache,
  userWatchlistCache,
  userRatingsCache,
  userStatsCache,
  invalidateUserCache,
  invalidateContentCache
};
