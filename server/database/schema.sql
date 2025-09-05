-- FilmFusion Database Schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  google_id VARCHAR(255) UNIQUE,
  name VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ratings table (updated to support all content types)
CREATE TABLE IF NOT EXISTS ratings (
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  content_id INT NOT NULL,
  content_type VARCHAR(20) DEFAULT 'movie' CHECK (content_type IN ('movie', 'tv', 'person')),
  category VARCHAR(20) DEFAULT 'hollywood' CHECK (category IN ('bollywood', 'hollywood', 'k_drama', 'web_series', 'anime', 'south')),
  rating SMALLINT CHECK (rating BETWEEN 1 AND 5),
  review TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, content_id, content_type)
);

-- Watchlist table (updated to support all content types)
CREATE TABLE IF NOT EXISTS watchlist (
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  content_id INT NOT NULL,
  content_type VARCHAR(20) DEFAULT 'movie' CHECK (content_type IN ('movie', 'tv', 'person')),
  category VARCHAR(20) DEFAULT 'hollywood' CHECK (category IN ('bollywood', 'hollywood', 'k_drama', 'web_series', 'anime', 'south')),
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, content_id, content_type)
);

-- User preferences table for recommendation algorithm
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  genre_id INT NOT NULL,
  preference_score DECIMAL(3,2) DEFAULT 0.5,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, genre_id)
);

-- Content cache table to store TMDB data locally (movies, TV shows, etc.)
CREATE TABLE IF NOT EXISTS content_cache (
  content_id INT NOT NULL,
  content_type VARCHAR(20) DEFAULT 'movie' CHECK (content_type IN ('movie', 'tv', 'person')),
  category VARCHAR(20) DEFAULT 'hollywood' CHECK (category IN ('bollywood', 'hollywood', 'k_drama', 'web_series', 'anime', 'south')),
  title VARCHAR(500) NOT NULL,
  name VARCHAR(500), -- For TV shows
  overview TEXT,
  poster_path VARCHAR(255),
  backdrop_path VARCHAR(255),
  release_date DATE,
  first_air_date DATE, -- For TV shows
  genre_ids INTEGER[],
  vote_average DECIMAL(3,1),
  vote_count INT,
  popularity DECIMAL(8,3),
  origin_country VARCHAR(10)[], -- For detecting regional content
  original_language VARCHAR(10), -- For detecting regional content
  cached_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (content_id, content_type)
);

-- Migration: Update existing tables to new schema
-- Add new columns to existing ratings table if they don't exist
DO $$
BEGIN
  -- Add content_type column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ratings' AND column_name = 'content_type') THEN
    ALTER TABLE ratings ADD COLUMN content_type VARCHAR(20) DEFAULT 'movie';
  END IF;

  -- Add category column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ratings' AND column_name = 'category') THEN
    ALTER TABLE ratings ADD COLUMN category VARCHAR(20) DEFAULT 'hollywood';
  END IF;

  -- Rename movie_id to content_id if needed
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ratings' AND column_name = 'movie_id') THEN
    ALTER TABLE ratings RENAME COLUMN movie_id TO content_id;
  END IF;
END $$;

-- Update watchlist table
DO $$
BEGIN
  -- Add content_type column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'watchlist' AND column_name = 'content_type') THEN
    ALTER TABLE watchlist ADD COLUMN content_type VARCHAR(20) DEFAULT 'movie';
  END IF;

  -- Add category column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'watchlist' AND column_name = 'category') THEN
    ALTER TABLE watchlist ADD COLUMN category VARCHAR(20) DEFAULT 'hollywood';
  END IF;

  -- Rename movie_id to content_id if needed
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'watchlist' AND column_name = 'movie_id') THEN
    ALTER TABLE watchlist RENAME COLUMN movie_id TO content_id;
  END IF;
END $$;

-- Migrate movie_cache to content_cache
DO $$
BEGIN
  -- Create content_cache from movie_cache if movie_cache exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'movie_cache') THEN
    INSERT INTO content_cache (
      content_id, content_type, category, title, overview, poster_path,
      backdrop_path, release_date, genre_ids, vote_average, vote_count,
      popularity, cached_at
    )
    SELECT
      movie_id, 'movie', 'hollywood', title, overview, poster_path,
      backdrop_path, release_date, genre_ids, vote_average, vote_count,
      popularity, cached_at
    FROM movie_cache
    ON CONFLICT (content_id, content_type) DO NOTHING;

    -- Drop old table
    DROP TABLE IF EXISTS movie_cache;
  END IF;
END $$;

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ratings_user_id ON ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_ratings_content_id ON ratings(content_id);
CREATE INDEX IF NOT EXISTS idx_ratings_content_type ON ratings(content_type);
CREATE INDEX IF NOT EXISTS idx_ratings_category ON ratings(category);
CREATE INDEX IF NOT EXISTS idx_watchlist_user_id ON watchlist(user_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_content_id ON watchlist(content_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_content_type ON watchlist(content_type);
CREATE INDEX IF NOT EXISTS idx_watchlist_category ON watchlist(category);
CREATE INDEX IF NOT EXISTS idx_content_cache_popularity ON content_cache(popularity DESC);
CREATE INDEX IF NOT EXISTS idx_content_cache_vote_average ON content_cache(vote_average DESC);
CREATE INDEX IF NOT EXISTS idx_content_cache_release_date ON content_cache(release_date DESC);
CREATE INDEX IF NOT EXISTS idx_content_cache_category ON content_cache(category);
CREATE INDEX IF NOT EXISTS idx_content_cache_content_type ON content_cache(content_type);
