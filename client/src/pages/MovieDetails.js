import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { moviesAPI, userAPI, recommendationsAPI, contentAPI } from '../services/api';
import EnhancedMovieCard from '../components/EnhancedMovieCard';
import StarRating from '../components/StarRating';
import MovieDetailsSkeleton from '../components/skeletons/MovieDetailsSkeleton';

const MovieDetails = () => {
  const { id: rawId } = useParams();
  const { isAuthenticated } = useAuth();

  // Extract numeric ID from URL (remove slug if present)
  const id = rawId.split('-')[0];

  // Determine content type from URL path
  const currentPath = window.location.pathname;
  const contentType = currentPath.includes('/tv/') ? 'tv' : 'movie';

  const [movie, setMovie] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchMovieDetails();
      fetchSimilarMovies();
      if (isAuthenticated) {
        fetchUserData();
      }
    }
  }, [id, isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      setError('');

      // Use the detected content type from URL
      let response;
      try {
        response = await contentAPI.getDetails(contentType, id);
      } catch (contentError) {
        // Fallback to legacy movies API if content API fails
        if (contentType === 'movie') {
          response = await moviesAPI.getDetails(id);
        } else {
          throw contentError;
        }
      }

      setMovie(response.data);
    } catch (error) {
      console.error('Error fetching content details:', error);
      setError('Failed to load content details. The content might not be available.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const [ratingResponse, watchlistResponse] = await Promise.all([
        userAPI.getContentRating(id, contentType),
        userAPI.checkContentWatchlist(id, contentType)
      ]);

      setUserRating(ratingResponse.data.rating || 0);
      setInWatchlist(watchlistResponse.data.inWatchlist);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchSimilarMovies = async () => {
    try {
      // Try to get similar content, with fallback handling
      let response;
      try {
        response = await recommendationsAPI.getSimilar(id);
        setSimilarMovies(response.data.recommendations.slice(0, 6));
      } catch (error) {
        // If similar movies API fails, try to get popular content as fallback
        console.warn('Similar movies API failed, using popular content as fallback');
        try {
          const fallbackResponse = await contentAPI.getPopular(1);
          setSimilarMovies(fallbackResponse.data.results.slice(0, 6));
        } catch (fallbackError) {
          console.error('Fallback content also failed:', fallbackError);
          setSimilarMovies([]);
        }
      }
    } catch (error) {
      console.error('Error fetching similar movies:', error);
      setSimilarMovies([]);
    }
  };

  const handleRate = async (rating) => {
    if (!isAuthenticated) return;

    setActionLoading(true);
    try {
      // Determine category based on movie data
      const category = movie?.original_language === 'hi' ? 'bollywood' :
                      movie?.original_language === 'ko' ? 'k_drama' :
                      movie?.original_language === 'ja' ? 'anime' :
                      ['ta', 'te', 'ml', 'kn'].includes(movie?.original_language) ? 'south' :
                      'hollywood';

      await userAPI.rateContent(id, contentType, category, rating);
      setUserRating(rating);
    } catch (error) {
      console.error('Error rating content:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleWatchlistToggle = async () => {
    if (!isAuthenticated) return;

    setActionLoading(true);
    try {
      // Determine category based on content data
      const category = movie?.original_language === 'hi' ? 'bollywood' :
                      movie?.original_language === 'ko' ? 'k_drama' :
                      movie?.original_language === 'ja' ? 'anime' :
                      ['ta', 'te', 'ml', 'kn'].includes(movie?.original_language) ? 'south' :
                      'hollywood';

      if (inWatchlist) {
        await userAPI.removeContentFromWatchlist(id, contentType);
        setInWatchlist(false);
      } else {
        await userAPI.addContentToWatchlist(id, contentType, category);
        setInWatchlist(true);
      }
    } catch (error) {
      console.error('Error updating watchlist:', error);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <MovieDetailsSkeleton />;
  }

  if (error || !movie) {
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
          Movie not found
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '32px' }}>
          {error || 'The movie you\'re looking for doesn\'t exist or has been removed.'}
        </p>
        <Link to="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : null;

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/placeholder-movie.jpg';

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Section with Backdrop */}
      <div style={{
        position: 'relative',
        height: '60vh',
        backgroundImage: backdropUrl ? `url(${backdropUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: backdropUrl ? 'transparent' : '#1f2937'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.4))'
        }} />

        <div style={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          alignItems: 'end',
          padding: '32px 16px'
        }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
            <div style={{ display: 'flex', gap: '32px', alignItems: 'end', flexWrap: 'wrap' }}>
              {/* Poster */}
              <img
                src={posterUrl}
                alt={movie.title}
                style={{
                  width: '200px',
                  height: '300px',
                  objectFit: 'cover',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                }}
              />

              {/* Movie Info */}
              <div style={{ flex: 1, color: 'white' }}>
                <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '8px' }}>
                  {movie.title}
                </h1>
                <p style={{ fontSize: '18px', opacity: 0.8, marginBottom: '16px' }}>
                  {movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown'} •
                  {movie.runtime ? ` ${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : ''} •
                  {movie.genres?.map(g => g.name).join(', ')}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '24px' }}>⭐</span>
                    <span style={{ fontSize: '20px', fontWeight: '600' }}>
                      {movie.vote_average ? Number(movie.vote_average).toFixed(1) : '0.0'}
                    </span>
                    <span style={{ opacity: 0.7 }}>
                      ({movie.vote_count} votes)
                    </span>
                  </div>
                </div>

                {movie.overview && (
                  <p style={{
                    fontSize: '16px',
                    lineHeight: '1.6',
                    maxWidth: '600px',
                    marginBottom: '24px'
                  }}>
                    {movie.overview}
                  </p>
                )}

                {/* Action Buttons */}
                {isAuthenticated && (
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <button
                      onClick={handleWatchlistToggle}
                      disabled={actionLoading}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: inWatchlist ? 'var(--accent-primary)' : 'rgba(255,255,255,0.2)',
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: '500',
                        cursor: actionLoading ? 'not-allowed' : 'pointer',
                        opacity: actionLoading ? 0.5 : 1,
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {inWatchlist ? '❤️ In Watchlist' : '🤍 Add to Watchlist'}
                    </button>

                    <StarRating
                      rating={userRating}
                      onRate={handleRate}
                      disabled={actionLoading}
                      showRateButton={true}
                      size="md"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div style={{ padding: '48px 16px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* Movie Details */}
          <div style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>
              Movie Details
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '24px',
              padding: '24px',
              backgroundColor: '#f9fafb',
              borderRadius: '12px'
            }}>
              {movie.release_date && (
                <div>
                  <h4 style={{ fontWeight: '600', marginBottom: '4px' }}>Release Date</h4>
                  <p style={{ color: '#6b7280' }}>
                    {new Date(movie.release_date).toLocaleDateString()}
                  </p>
                </div>
              )}
              {movie.runtime && (
                <div>
                  <h4 style={{ fontWeight: '600', marginBottom: '4px' }}>Runtime</h4>
                  <p style={{ color: '#6b7280' }}>
                    {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                  </p>
                </div>
              )}
              {movie.budget && movie.budget > 0 && (
                <div>
                  <h4 style={{ fontWeight: '600', marginBottom: '4px' }}>Budget</h4>
                  <p style={{ color: '#6b7280' }}>
                    ${movie.budget.toLocaleString()}
                  </p>
                </div>
              )}
              {movie.revenue && movie.revenue > 0 && (
                <div>
                  <h4 style={{ fontWeight: '600', marginBottom: '4px' }}>Revenue</h4>
                  <p style={{ color: '#6b7280' }}>
                    ${movie.revenue.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Similar Movies */}
          {similarMovies.length > 0 && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>
                Similar Movies
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '24px'
              }}>
                {similarMovies.map((movie) => (
                  <EnhancedMovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};



export default MovieDetails;
