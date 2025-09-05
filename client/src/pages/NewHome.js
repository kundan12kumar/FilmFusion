import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { contentAPI } from '../services/api';
import ContentCard from '../components/ContentCard';
import HomeSkeleton from '../components/skeletons/HomeSkeleton';

const NewHome = () => {
  const { isAuthenticated } = useAuth();
  const [categoryContent, setCategoryContent] = useState({});
  const [loading, setLoading] = useState(true);

  const categories = useMemo(() => [
    { key: 'bollywood', name: 'Bollywood', emoji: '🇮🇳', color: '#FF6B35' },
    { key: 'hollywood', name: 'Hollywood', emoji: '🇺🇸', color: '#FFD700' },
    { key: 'k_drama', name: 'K-Drama', emoji: '🇰🇷', color: '#FF69B4' },
    { key: 'web_series', name: 'Web Series', emoji: '📺', color: '#00CED1' },
    { key: 'anime', name: 'Anime', emoji: '🇯🇵', color: '#FF1493' },
    { key: 'south', name: 'South Indian', emoji: '🌴', color: '#32CD32' }
  ], []);

  const fetchCategoryContent = useCallback(async () => {
    try {
      setLoading(true);
      const promises = categories.map(category =>
        contentAPI.getByCategory(category.key, 1)
      );

      const responses = await Promise.all(promises);

      const contentByCategory = {};
      categories.forEach((category, index) => {
        contentByCategory[category.key] = responses[index].data.results.slice(0, 10);
      });

      setCategoryContent(contentByCategory);
    } catch (error) {
      console.error('Error fetching category content:', error);
    } finally {
      setLoading(false);
    }
  }, [categories]);

  useEffect(() => {
    fetchCategoryContent();
  }, [fetchCategoryContent]);

  if (loading) {
    return <HomeSkeleton />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      transition: 'all 0.3s ease'
    }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
        color: 'white',
        padding: '68px 0', // Reduced by 15% (80px -> 68px)
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated background elements */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
          animation: 'float 6s ease-in-out infinite'
        }} />

        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px', position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              style={{
                fontSize: 'clamp(2rem, 5vw, 4rem)',
                fontWeight: 'bold',
                marginBottom: '24px',
                lineHeight: '1.2',
                background: 'linear-gradient(45deg, #ffffff, #fbbf24, #ffffff)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'gradient-shift 4s ease-in-out infinite, breathing 3s ease-in-out infinite',
                textShadow: '0 0 30px rgba(251, 191, 36, 0.5)'
              }}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.3 }
              }}
            >
              Discover Your Next
              <br />
              <span style={{
                background: 'linear-gradient(45deg, #fbbf24, #f59e0b, #fbbf24)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'gradient-shift 3s ease-in-out infinite'
              }}>
                Favorite Movie
              </span>
            </motion.h1>

            <motion.p
              style={{
                fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
                marginBottom: '32px',
                maxWidth: '768px',
                margin: '0 auto 32px',
                lineHeight: '1.6',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                animation: 'breathing 4s ease-in-out infinite'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              whileHover={{
                scale: 1.02,
                textShadow: '0 4px 20px rgba(251, 191, 36, 0.4)',
                transition: { duration: 0.3 }
              }}
            >
              Explore content from around the world - Hollywood blockbusters, Bollywood hits, K-dramas, anime, and more!
            </motion.p>
            {!isAuthenticated && (
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/register" className="btn-primary" style={{ backgroundColor: 'white', color: 'var(--accent-primary)' }}>
                  Get Started
                </Link>
                <Link to="/search" className="btn-secondary" style={{ borderColor: 'white', color: 'white' }}>
                  Browse Content
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Category Sections */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 16px' }}>
        {categories.map((category, index) => {
          const content = categoryContent[category.key] || [];

          if (content.length === 0) return null;

          return (
            <motion.section
              key={category.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`category-component category-${category.key}`}
              style={{ marginBottom: '64px' }}
            >
              <div className="category-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                  <div className="category-flag">
                    {category.emoji}
                  </div>
                  <div>
                    <h2 className="category-title">
                      {category.name}
                    </h2>
                    <p className="category-subtitle">
                      High-rated {category.name.toLowerCase()} content
                    </p>
                  </div>
                </div>
                <motion.div
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.3 }
                  }}
                  whileTap={{
                    scale: 0.95,
                    transition: { duration: 0.1 }
                  }}
                >
                  <Link
                    to={`/category/${category.key}`}
                    style={{
                      color: 'white',
                      textDecoration: 'none',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      padding: '12px 20px',
                      borderRadius: '12px',
                      background: `linear-gradient(135deg, ${category.color}40, ${category.color}60)`,
                      backdropFilter: 'blur(10px)',
                      border: `2px solid ${category.color}80`,
                      transform: 'translateY(0)',
                      boxShadow: `0 4px 15px ${category.color}30`,
                      animation: 'breathing 4s ease-in-out infinite',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = `linear-gradient(135deg, ${category.color}60, ${category.color}80)`;
                      e.target.style.transform = 'translateY(-2px) scale(1.02)';
                      e.target.style.boxShadow = `0 8px 25px ${category.color}50, 0 0 30px ${category.color}40`;
                      e.target.style.textShadow = `0 0 20px ${category.color}, 0 0 30px ${category.color}`;
                      e.target.style.borderColor = category.color;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = `linear-gradient(135deg, ${category.color}40, ${category.color}60)`;
                      e.target.style.transform = 'translateY(0) scale(1)';
                      e.target.style.boxShadow = `0 4px 15px ${category.color}30`;
                      e.target.style.textShadow = 'none';
                      e.target.style.borderColor = `${category.color}80`;
                    }}
                  >
                    <span style={{
                      background: `linear-gradient(45deg, #ffffff, ${category.color}, #ffffff)`,
                      backgroundSize: '200% 200%',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      animation: 'gradient-shift 4s ease-in-out infinite',
                      fontWeight: '700',
                      textShadow: `0 0 10px ${category.color}50`
                    }}>
                      View All
                    </span>
                    <span style={{
                      fontSize: '18px',
                      transition: 'transform 0.3s ease',
                      filter: `drop-shadow(0 0 5px ${category.color})`
                    }}>→</span>
                  </Link>
                </motion.div>
              </div>

              <div className="category-grid">
                {content.map((item) => (
                  <ContentCard
                    key={`${item.id}-${item.content_type}`}
                    content={item}
                    showRating={true}
                    showWatchlist={true}
                  />
                ))}
              </div>
            </motion.section>
          );
        })}
      </div>

      {/* Call to Action Section */}
      {!isAuthenticated && (
        <section style={{
          background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
          color: 'white',
          padding: '64px 0',
          textAlign: 'center'
        }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 style={{
                fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                fontWeight: 'bold',
                marginBottom: '16px'
              }}>
                Ready to Start Your Journey?
              </h2>
              <p style={{
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                marginBottom: '32px',
                maxWidth: '512px',
                margin: '0 auto 32px',
                lineHeight: '1.6'
              }}>
                Join thousands of users who are discovering amazing content from around the world.
                Rate, review, and build your perfect watchlist.
              </p>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/register" className="btn-primary" style={{ backgroundColor: 'white', color: 'var(--accent-primary)' }}>
                  Sign Up Free
                </Link>
                <Link to="/login" className="btn-secondary" style={{ borderColor: 'white', color: 'white' }}>
                  Sign In
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
};

export default NewHome;
