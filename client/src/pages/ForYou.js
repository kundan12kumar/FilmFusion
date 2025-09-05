import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { recommendationsAPI, userAPI } from '../services/api';
import EnhancedMovieCard from '../components/EnhancedMovieCard';
import ForYouSkeleton from '../components/skeletons/ForYouSkeleton';

const ForYou = () => {
  const { isAuthenticated } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [userStats, setUserStats] = useState({
    ratingsCount: 0,
    watchlistCount: 0,
    averageRating: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchRecommendations();
      fetchUserStats();
    }
  }, [isAuthenticated, page]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await recommendationsAPI.getPersonalized(page);

      if (page === 1) {
        setRecommendations(response.data.recommendations);
      } else {
        setRecommendations(prev => [...prev, ...response.data.recommendations]);
      }

      setHasMore(response.data.hasMore);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setError('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const [ratingsResponse, watchlistResponse] = await Promise.all([
        userAPI.getRatings(1),
        userAPI.getWatchlist(1)
      ]);

      const ratings = ratingsResponse.data.ratings;
      const averageRating = ratings.length > 0
        ? ratings.reduce((acc, rating) => acc + rating.rating, 0) / ratings.length
        : 0;

      setUserStats({
        ratingsCount: ratingsResponse.data.total,
        watchlistCount: watchlistResponse.data.total,
        averageRating: Math.round(averageRating * 10) / 10
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
    }
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
          Sign in to get personalized recommendations
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '32px' }}>
          Rate movies and add them to your watchlist to get tailored suggestions
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
    return <ForYouSkeleton />;
  }

  const needsMoreData = userStats.ratingsCount < 3 && userStats.watchlistCount < 5;

  return (
    <div style={{ minHeight: '100vh', padding: '32px 16px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>
            For You
          </h1>
          <p style={{ color: '#6b7280', fontSize: '18px' }}>
            Personalized movie recommendations based on your ratings and watchlist
          </p>
        </div>

        {/* User Stats */}
        <div style={{
          marginBottom: '32px',
          padding: '24px',
          backgroundColor: '#f9fafb',
          borderRadius: '12px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '24px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ec4899' }}>
              {userStats.ratingsCount}
            </div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>
              Movies Rated
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ec4899' }}>
              {userStats.watchlistCount}
            </div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>
              In Watchlist
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ec4899' }}>
              {userStats.averageRating || 0}
            </div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>
              Avg Rating
            </div>
          </div>
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

        {needsMoreData ? (
          <div style={{
            textAlign: 'center',
            padding: '64px 16px',
            backgroundColor: '#f0f9ff',
            borderRadius: '12px',
            border: '2px dashed #0ea5e9'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎯</div>
            <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
              Help us personalize your recommendations
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '24px', maxWidth: '500px', margin: '0 auto 24px' }}>
              Rate at least 3 movies and add 5 movies to your watchlist to get better personalized recommendations
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/" className="btn-primary">
                Discover Movies
              </a>
              <a href="/watchlist" className="btn-secondary">
                View Watchlist
              </a>
            </div>
          </div>
        ) : recommendations.length === 0 && !loading ? (
          <div style={{
            textAlign: 'center',
            padding: '64px 16px',
            backgroundColor: '#f9fafb',
            borderRadius: '12px',
            border: '2px dashed #d1d5db'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🤖</div>
            <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
              No recommendations available
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>
              We're working on generating personalized recommendations for you. Check back soon!
            </p>
            <a href="/" className="btn-primary">
              Explore Popular Movies
            </a>
          </div>
        ) : (
          <>
            {/* Recommendations Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '20px',
              marginBottom: '32px'
            }}>
              {recommendations.map((movie) => (
                <EnhancedMovieCard
                  key={movie.id}
                  movie={movie}
                  showRating={true}
                  showWatchlist={true}
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
                  {loading ? 'Loading...' : 'Load More Recommendations'}
                </button>
              </div>
            )}
          </>
        )}

        {/* Tips Section */}
        {recommendations.length > 0 && (
          <div style={{
            marginTop: '48px',
            padding: '24px',
            backgroundColor: '#f0f9ff',
            borderRadius: '12px',
            border: '1px solid #0ea5e9'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#0369a1' }}>
              💡 Improve Your Recommendations
            </h3>
            <ul style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.6' }}>
              <li>• Rate more movies to help us understand your preferences</li>
              <li>• Add movies to your watchlist to indicate your interests</li>
              <li>• The more you interact, the better our recommendations become</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForYou;
