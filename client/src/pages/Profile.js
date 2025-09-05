import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { userAPI } from '../services/api';

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const [userStats, setUserStats] = useState({
    totalRatings: 0,
    averageRating: 0,
    watchlistCount: 0,
    favoriteGenres: []
  });
  const [ratedMovies, setRatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch user ratings
      const ratingsResponse = await userAPI.getRatings(1);
      const ratings = ratingsResponse.data.ratings || [];
      
      // Fetch watchlist
      const watchlistResponse = await userAPI.getWatchlist(1);
      const watchlist = watchlistResponse.data.movies || [];
      
      // Calculate stats
      const totalRatings = ratings.length;
      const averageRating = totalRatings > 0 
        ? (ratings.reduce((sum, rating) => sum + rating.rating, 0) / totalRatings).toFixed(1)
        : 0;
      
      // Set stats
      setUserStats({
        totalRatings,
        averageRating,
        watchlistCount: watchlist.length,
        favoriteGenres: ['Action', 'Drama', 'Comedy'] // Placeholder
      });
      
      setRatedMovies(ratings);
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Please log in to view your profile</h2>
          <p style={{ color: 'var(--text-secondary)' }}>You need to be logged in to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)'
      }}>
        <div className="loading-spinner" style={{ width: '40px', height: '40px', border: '4px solid var(--border-primary)', borderTop: '4px solid var(--accent-primary)', borderRadius: '50%' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '16px', color: 'var(--error-color)' }}>Error</h2>
          <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      padding: '32px 16px'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px',
            color: 'white',
            textAlign: 'center'
          }}
        >
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '32px',
            fontWeight: 'bold'
          }}>
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
            {user?.username || 'User'}
          </h1>
          <p style={{ fontSize: '16px', opacity: 0.9 }}>
            Member since {new Date(user?.created_at || Date.now()).toLocaleDateString()}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            marginBottom: '48px'
          }}
        >
          {/* Total Ratings */}
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center',
            border: '1px solid var(--border-primary)'
          }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--accent-primary)', marginBottom: '8px' }}>
              {userStats.totalRatings}
            </div>
            <div style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>Movies Rated</div>
          </div>

          {/* Average Rating */}
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center',
            border: '1px solid var(--border-primary)'
          }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--accent-primary)', marginBottom: '8px' }}>
              {userStats.averageRating}⭐
            </div>
            <div style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>Average Rating</div>
          </div>

          {/* Watchlist Count */}
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center',
            border: '1px solid var(--border-primary)'
          }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--accent-primary)', marginBottom: '8px' }}>
              {userStats.watchlistCount}
            </div>
            <div style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>Watchlist Items</div>
          </div>

          {/* Activity Score */}
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center',
            border: '1px solid var(--border-primary)'
          }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--accent-primary)', marginBottom: '8px' }}>
              {Math.min(100, userStats.totalRatings * 5 + userStats.watchlistCount * 2)}
            </div>
            <div style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>Activity Score</div>
          </div>
        </motion.div>

        {/* Rated Movies Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            marginBottom: '24px',
            color: 'var(--text-primary)'
          }}>
            Your Rated Movies
          </h2>

          {ratedMovies.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '24px'
            }}>
              {ratedMovies.slice(0, 12).map((rating, index) => (
                <motion.div
                  key={rating.movie_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid var(--border-primary)',
                    textAlign: 'center'
                  }}
                >
                  <img
                    src={rating.poster_path 
                      ? `https://image.tmdb.org/t/p/w300${rating.poster_path}`
                      : '/placeholder-poster.jpg'
                    }
                    alt={rating.title}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      marginBottom: '12px'
                    }}
                  />
                  <h3 style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '8px',
                    color: 'var(--text-primary)',
                    lineHeight: '1.3'
                  }}>
                    {rating.title}
                  </h3>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '12px'
                  }}>
                    <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>
                      ⭐ {rating.rating}/5
                    </span>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {new Date(rating.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '64px 16px',
              color: 'var(--text-secondary)'
            }}>
              <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>No rated movies yet</h3>
              <p>Start rating movies to see them here!</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
