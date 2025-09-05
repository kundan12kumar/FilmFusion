import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userAPI } from '../services/api';
import EnhancedMovieCard from '../components/EnhancedMovieCard';
import WatchlistSkeleton from '../components/skeletons/WatchlistSkeleton';

const Watchlist = () => {
  const { isAuthenticated } = useAuth();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWatchlist();
    }
  }, [isAuthenticated, page]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getWatchlist(page);

      if (page === 1) {
        setMovies(response.data.movies);
      } else {
        setMovies(prev => [...prev, ...response.data.movies]);
      }

      setHasMore(response.data.hasMore);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      setError('Failed to load watchlist');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  };

  const handleMovieRemoved = (movieId) => {
    setMovies(prev => prev.filter(movie => movie.id !== movieId));
  };

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        padding: '48px 16px'
      }}>
        <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }}>
          Sign in to view your watchlist
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '32px' }}>
          Create an account or sign in to save movies to your personal watchlist
        </p>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="/login" className="btn-primary">
            Sign In
          </a>
          <a href="/register" className="btn-secondary">
            Create Account
          </a>
        </div>
      </div>
    );
  }

  if (loading && page === 1) {
    return <WatchlistSkeleton />;
  }

  return (
    <div style={{ minHeight: '100vh', padding: '32px 16px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>
            My Watchlist
          </h1>
          <p style={{ color: '#6b7280', fontSize: '18px' }}>
            {movies.length > 0
              ? `${movies.length} movie${movies.length !== 1 ? 's' : ''} saved to watch later`
              : 'No movies in your watchlist yet'
            }
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '24px'
          }}>
            {error}
          </div>
        )}

        {movies.length === 0 && !loading ? (
          <div style={{
            textAlign: 'center',
            padding: '64px 16px',
            backgroundColor: '#f9fafb',
            borderRadius: '12px',
            border: '2px dashed #d1d5db'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎬</div>
            <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
              Your watchlist is empty
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>
              Start adding movies you want to watch later by clicking the heart icon on any movie card
            </p>
            <a href="/" className="btn-primary">
              Discover Movies
            </a>
          </div>
        ) : (
          <>
            {/* Movies Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '20px',
              marginBottom: '32px'
            }}>
              {movies.map((movie) => (
                <EnhancedMovieCard
                  key={movie.id}
                  movie={movie}
                  showRating={true}
                  showWatchlist={true}
                  onWatchlistChange={() => handleMovieRemoved(movie.id)}
                />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="btn-secondary"
                  style={{
                    padding: '12px 24px',
                    opacity: loading ? 0.5 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? 'Loading...' : 'Load More Movies'}
                </button>
              </div>
            )}
          </>
        )}

        {/* Stats Section */}
        {movies.length > 0 && (
          <div style={{
            marginTop: '48px',
            padding: '24px',
            backgroundColor: '#f9fafb',
            borderRadius: '12px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ec4899' }}>
                {movies.length}
              </div>
              <div style={{ color: '#6b7280', fontSize: '14px' }}>
                Movies in Watchlist
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ec4899' }}>
                {Math.round(movies.reduce((acc, movie) => acc + (movie.vote_average || 0), 0) / movies.length * 10) / 10 || 0}
              </div>
              <div style={{ color: '#6b7280', fontSize: '14px' }}>
                Average Rating
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ec4899' }}>
                {Math.round(movies.reduce((acc, movie) => acc + (movie.runtime || 120), 0) / 60)}h
              </div>
              <div style={{ color: '#6b7280', fontSize: '14px' }}>
                Total Runtime
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;
