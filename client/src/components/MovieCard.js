import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { userAPI } from '../services/api';
import { getPosterUrl, formatRating, formatYear, getMovieUrl } from '../utils/movieUtils';
import StarRating from './StarRating';

const MovieCard = ({ movie, showRating = true, showWatchlist = true }) => {
  const { isAuthenticated } = useAuth();
  const [userRating, setUserRating] = useState(0);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated || !movie.id) return;

      try {
        const [ratingResponse, watchlistResponse] = await Promise.all([
          userAPI.getUserRating(movie.id),
          userAPI.checkWatchlist(movie.id)
        ]);

        setUserRating(ratingResponse.data.rating || 0);
        setInWatchlist(watchlistResponse.data.inWatchlist);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [isAuthenticated, movie.id]);



  const handleRate = async (rating) => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      await userAPI.rateMovie(movie.id, rating);
      setUserRating(rating);
    } catch (error) {
      console.error('Error rating movie:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWatchlistToggle = async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      if (inWatchlist) {
        await userAPI.removeFromWatchlist(movie.id);
        setInWatchlist(false);
      } else {
        await userAPI.addToWatchlist(movie.id);
        setInWatchlist(true);
      }
    } catch (error) {
      console.error('Error updating watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="card overflow-hidden group"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative">
        <Link to={getMovieUrl(movie.id, movie.title)}>
          <img
            src={getPosterUrl(movie.poster_path)}
            alt={movie.title}
            style={{
              width: '100%',
              height: '240px',
              objectFit: 'cover',
              transition: 'transform 0.3s ease'
            }}
            className="transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Watchlist Button */}
        {showWatchlist && isAuthenticated && (
          <motion.button
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              padding: '8px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: inWatchlist ? 'var(--accent-primary)' : 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onClick={handleWatchlistToggle}
            disabled={loading}
            whileHover={{
              scale: 1.1,
              backgroundColor: inWatchlist ? 'var(--accent-hover)' : 'rgba(0, 0, 0, 0.7)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            <svg style={{ width: '20px', height: '20px' }} fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
          </motion.button>
        )}

        {/* Rating Badge */}
        <div style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: '600',
          backdropFilter: 'blur(4px)'
        }}>
          ⭐ {formatRating(movie.vote_average)}
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        <Link to={getMovieUrl(movie.id, movie.title)}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '8px',
            color: 'var(--text-primary)',
            transition: 'color 0.3s ease',
            textDecoration: 'none',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => e.target.style.color = 'var(--accent-primary)'}
          onMouseLeave={(e) => e.target.style.color = 'var(--text-primary)'}
          >
            {movie.title}
          </h3>
        </Link>

        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '14px',
          marginBottom: '12px'
        }}>
          {formatYear(movie.release_date)}
        </p>

        {movie.overview && (
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '14px',
            marginBottom: '12px',
            lineHeight: '1.4',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {movie.overview}
          </p>
        )}

        {/* User Rating */}
        {showRating && isAuthenticated && (
          <div style={{
            marginTop: '12px',
            paddingTop: '12px',
            borderTop: '1px solid var(--border-primary)'
          }}>
            <StarRating
              rating={userRating}
              onRate={handleRate}
              size="sm"
              showValue={false}
              showRateButton={true}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MovieCard;
