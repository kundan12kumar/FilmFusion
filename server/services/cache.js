const redis = require('redis');

class CacheService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.memoryCache = new Map(); // In-memory fallback cache
    this.errorLogged = false; // Prevent spam logging
    this.init();
  }

  async init() {
    // Skip Redis connection in development if not explicitly enabled
    if (process.env.NODE_ENV !== 'production' && !process.env.ENABLE_REDIS) {
      console.log('🗄️  Using in-memory cache (Redis disabled in development)');
      this.isConnected = false;
      return;
    }

    try {
      const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

      this.client = redis.createClient({
        url: redisUrl,
        socket: {
          connectTimeout: 3000,
          lazyConnect: true
        }
      });

      // Set up event handlers before connecting
      this.client.on('error', (err) => {
        if (!this.errorLogged) {
          console.log('⚠️  Redis unavailable, using in-memory cache fallback');
          this.errorLogged = true;
        }
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        console.log('✅ Redis Client Connected');
        this.isConnected = true;
        this.errorLogged = false;
      });

      this.client.on('ready', () => {
        console.log('🚀 Redis Client Ready');
        this.isConnected = true;
      });

      this.client.on('end', () => {
        if (this.isConnected) {
          console.log('📴 Redis Client Disconnected');
        }
        this.isConnected = false;
      });

      // Try to connect with timeout
      const connectPromise = this.client.connect();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Connection timeout')), 3000)
      );

      await Promise.race([connectPromise, timeoutPromise]);

    } catch (error) {
      if (!this.errorLogged) {
        console.log('🗄️  Redis connection failed, using in-memory cache');
        this.errorLogged = true;
      }
      this.isConnected = false;
      this.client = null;
    }
  }

  async get(key) {
    // Try Redis first
    if (this.isConnected && this.client) {
      try {
        const value = await this.client.get(key);
        return value ? JSON.parse(value) : null;
      } catch (error) {
        // Silently fall back to memory cache
      }
    }

    // Fallback to memory cache
    const cached = this.memoryCache.get(key);
    if (cached && cached.expiry > Date.now()) {
      return cached.data;
    } else if (cached) {
      this.memoryCache.delete(key); // Remove expired entry
    }

    return null;
  }

  async set(key, value, ttlSeconds = 3600) {
    // Try Redis first
    if (this.isConnected && this.client) {
      try {
        await this.client.setEx(key, ttlSeconds, JSON.stringify(value));
        return true;
      } catch (error) {
        // Silently fall back to memory cache
      }
    }

    // Fallback to memory cache
    const expiry = Date.now() + (ttlSeconds * 1000);
    this.memoryCache.set(key, { data: value, expiry });

    // Clean up expired entries periodically (simple cleanup)
    if (this.memoryCache.size > 1000) {
      this.cleanupMemoryCache();
    }

    return true;
  }

  async del(key) {
    // Try Redis first
    if (this.isConnected && this.client) {
      try {
        await this.client.del(key);
      } catch (error) {
        // Silently fall back to memory cache
      }
    }

    // Also remove from memory cache
    this.memoryCache.delete(key);
    return true;
  }

  cleanupMemoryCache() {
    const now = Date.now();
    for (const [key, value] of this.memoryCache.entries()) {
      if (value.expiry <= now) {
        this.memoryCache.delete(key);
      }
    }
  }

  async exists(key) {
    // Try Redis first
    if (this.isConnected && this.client) {
      try {
        const result = await this.client.exists(key);
        return result === 1;
      } catch (error) {
        // Silently fall back to memory cache
      }
    }

    // Check memory cache
    const cached = this.memoryCache.get(key);
    return cached && cached.expiry > Date.now();
  }

  // Cache keys for different data types
  static keys = {
    // TMDB API responses
    trending: (category, page) => `trending:${category}:${page}`,
    popular: (category, page) => `popular:${category}:${page}`,
    categoryContent: (category, page) => `category:${category}:${page}`,
    movieDetails: (type, id) => `details:${type}:${id}`,
    search: (query, page) => `search:${query}:${page}`,
    genres: (type) => `genres:${type}`,
    
    // User-specific data
    userRecommendations: (userId, page) => `recommendations:${userId}:${page}`,
    userWatchlist: (userId, page) => `watchlist:${userId}:${page}`,
    userRatings: (userId, page) => `ratings:${userId}:${page}`,
    userStats: (userId) => `stats:${userId}`,
    
    // Similar content
    similar: (movieId, page) => `similar:${movieId}:${page}`,
  };

  // TTL values in seconds
  static ttl = {
    trending: 1800,      // 30 minutes
    popular: 3600,       // 1 hour
    categoryContent: 3600, // 1 hour
    movieDetails: 86400,   // 24 hours
    search: 1800,        // 30 minutes
    genres: 86400,       // 24 hours
    userRecommendations: 1800, // 30 minutes
    userWatchlist: 300,  // 5 minutes
    userRatings: 300,    // 5 minutes
    userStats: 600,      // 10 minutes
    similar: 3600,       // 1 hour
  };

  async disconnect() {
    if (this.client && this.isConnected) {
      try {
        await this.client.disconnect();
        console.log('Redis client disconnected');
      } catch (error) {
        console.log('Error disconnecting Redis:', error.message);
      }
    }
  }
}

// Create singleton instance
const cacheService = new CacheService();

// Graceful shutdown
process.on('SIGINT', async () => {
  await cacheService.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await cacheService.disconnect();
  process.exit(0);
});

module.exports = cacheService;
