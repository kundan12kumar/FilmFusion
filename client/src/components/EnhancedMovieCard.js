import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userAPI } from '../services/api';
import StarRating from './StarRating';

const EnhancedMovieCard = ({ movie, showRating = true, showWatchlist = true }) => {
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

  const imageUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/placeholder-movie.jpg';

  const movieUrl = `/movie/${movie.id}`;

  return (
    <div className="card" style={{ overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <Link to={movieUrl}>
          <img
            src={imageUrl}
            alt={movie.title}
            style={{
              width: '100%',
              height: '240px',
              objectFit: 'cover',
              transition: 'transform 0.3s ease'
            }}
            loading="lazy"
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          />
        </Link>
        
        {/* Watchlist Button */}
        {showWatchlist && isAuthenticated && (
          <button
            onClick={handleWatchlistToggle}
            disabled={loading}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: inWatchlist ? 'var(--accent-primary)' : 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              transition: 'all 0.2s ease'
            }}
          >
            {inWatchlist ? '❤️' : '🤍'}
          </button>
        )}

        {/* Rating Badge */}
        <div style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: '500'
        }}>
          ⭐ {movie.vote_average ? Number(movie.vote_average).toFixed(1) : '0.0'}
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        <Link to={movieUrl} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3 style={{
            fontWeight: '600',
            fontSize: '16px',
            marginBottom: '8px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            color: 'var(--text-primary)',
            transition: 'color 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.color = 'var(--accent-primary)'}
          onMouseLeave={(e) => e.target.style.color = 'var(--text-primary)'}
          >
            {movie.title}
          </h3>
        </Link>
        
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '12px' }}>
          {movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown'}
        </p>

        {movie.overview && (
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '13px',
            marginBottom: '12px',
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
              disabled={loading}
              showRateButton={true}
              size="sm"
              showValue={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};



export default EnhancedMovieCard;
