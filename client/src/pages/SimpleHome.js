import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { moviesAPI, recommendationsAPI } from '../services/api';
import EnhancedMovieCard from '../components/EnhancedMovieCard';

const SimpleHome = () => {
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);

        const promises = [
          moviesAPI.getTrending(),
          moviesAPI.getPopular()
        ];

        if (isAuthenticated) {
          promises.push(recommendationsAPI.getPersonalized());
        }

        const responses = await Promise.all(promises);

        setTrendingMovies(responses[0].data.results.slice(0, 8));
        setPopularMovies(responses[1].data.results.slice(0, 8));

        if (isAuthenticated && responses[2]) {
          setRecommendations(responses[2].data.recommendations.slice(0, 8));
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <section style={{
        background: theme === 'dark'
          ? 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 50%, #c084fc 100%)'
          : 'linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f87171 100%)',
        color: 'white',
        padding: '80px 0',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '24px' }}>
            Discover Your Next
            <br />
            <span style={{ color: '#fbbf24' }}>Favorite Movie</span>
          </h1>
          <p style={{ fontSize: '20px', marginBottom: '32px', maxWidth: '768px', margin: '0 auto 32px' }}>
            Get personalized movie recommendations, rate films, and build your perfect watchlist
          </p>
          {!isAuthenticated && (
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn-primary" style={{ backgroundColor: 'white', color: '#ec4899' }}>
                Get Started
              </Link>
              <Link to="/discover" className="btn-secondary" style={{ borderColor: 'white', color: 'white' }}>
                Browse Movies
              </Link>
            </div>
          )}
        </div>
      </section>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 16px' }}>
        {/* Personalized Recommendations */}
        {isAuthenticated && recommendations.length > 0 && (
          <section style={{ marginBottom: '64px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '32px', fontWeight: 'bold' }}>
                Recommended for You
              </h2>
              <Link
                to="/recommendations"
                style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: '500' }}
              >
                View All →
              </Link>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '24px'
            }}>
              {recommendations.map((movie) => (
                <EnhancedMovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </section>
        )}

        {/* Trending Movies */}
        <section style={{ marginBottom: '64px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 'bold' }}>
              Trending This Week
            </h2>
            <Link
              to="/discover?sort=trending"
              style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: '500' }}
            >
              View All →
            </Link>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '24px'
          }}>
            {trendingMovies.map((movie) => (
              <EnhancedMovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>

        {/* Popular Movies */}
        <section style={{ marginBottom: '64px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 'bold' }}>
              Popular Movies
            </h2>
            <Link
              to="/discover?sort=popular"
              style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: '500' }}
            >
              View All →
            </Link>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '24px'
          }}>
            {popularMovies.map((movie) => (
              <EnhancedMovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>

        {/* Features Section */}
        {!isAuthenticated && (
          <section style={{ padding: '64px 0' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 'bold', textAlign: 'center', marginBottom: '48px' }}>
              Why Choose FilmFusion?
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '32px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  backgroundColor: '#fce7f3',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  fontSize: '32px'
                }}>
                  ⭐
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
                  Smart Recommendations
                </h3>
                <p style={{ color: '#6b7280' }}>
                  Get personalized movie suggestions based on your ratings and preferences
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  backgroundColor: '#fce7f3',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  fontSize: '32px'
                }}>
                  📚
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
                  Personal Watchlist
                </h3>
                <p style={{ color: '#6b7280' }}>
                  Save movies to watch later and never forget about that film you wanted to see
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  backgroundColor: '#fce7f3',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  fontSize: '32px'
                }}>
                  📝
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
                  Rate & Review
                </h3>
                <p style={{ color: '#6b7280' }}>
                  Rate movies and write reviews to help others discover great films
                </p>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};



export default SimpleHome;
