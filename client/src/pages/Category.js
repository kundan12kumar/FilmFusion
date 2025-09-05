import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { contentAPI } from '../services/api';
import ContentCard from '../components/ContentCard';
import HomeSkeleton from '../components/skeletons/HomeSkeleton';

const Category = () => {
  const { category } = useParams();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');

  // Category information
  const categories = {
    bollywood: { name: 'Bollywood', emoji: '🇮🇳', color: '#FF6B35' },
    hollywood: { name: 'Hollywood', emoji: '🇺🇸', color: '#FFD700' },
    k_drama: { name: 'K-Drama', emoji: '🇰🇷', color: '#FF69B4' },
    web_series: { name: 'Web Series', emoji: '📺', color: '#00CED1' },
    anime: { name: 'Anime', emoji: '🇯🇵', color: '#FF1493' },
    south: { name: 'South Indian', emoji: '🌴', color: '#32CD32' }
  };

  const categoryInfo = categories[category] || { name: 'Unknown', emoji: '🎬', color: '#666' };

  const fetchCategoryContent = useCallback(async (pageNum = 1, isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setContent([]);
        setError('');
      }

      const response = await contentAPI.getByCategory(category, pageNum);
      const newContent = response.data.results || [];

      if (isLoadMore) {
        setContent(prev => [...prev, ...newContent]);
      } else {
        setContent(newContent);
      }

      // Check if there's more content to load from server response
      setHasMore(response.data.has_more || false);

    } catch (error) {
      console.error('Error fetching category content:', error);
      setError('Failed to load content. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [category]);

  const handleViewMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchCategoryContent(nextPage, true);
    }
  };

  useEffect(() => {
    if (category) {
      setPage(1);
      fetchCategoryContent(1, false);
    }
  }, [category, fetchCategoryContent]);

  if (loading) {
    return <HomeSkeleton />;
  }

  if (error) {
    return (
      <div style={{ 
        maxWidth: '1280px', 
        margin: '0 auto', 
        padding: '48px 16px',
        textAlign: 'center'
      }}>
        <h2 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>
          Oops! Something went wrong
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          {error}
        </p>
        <button
          onClick={() => fetchCategoryContent(1, false)}
          style={{
            backgroundColor: 'var(--accent-primary)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      background: `linear-gradient(135deg, ${categoryInfo.color}15 0%, var(--bg-primary) 100%)`,
      minHeight: '100vh'
    }}>
      {/* Category Header */}
      <div style={{ 
        background: `linear-gradient(135deg, ${categoryInfo.color}40 0%, ${categoryInfo.color}20 100%)`,
        padding: '48px 16px 32px'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center' }}
          >
            <div style={{ 
              fontSize: '4rem', 
              marginBottom: '16px',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
            }}>
              {categoryInfo.emoji}
            </div>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 'bold', 
              color: 'var(--text-primary)',
              marginBottom: '8px',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              {categoryInfo.name}
            </h1>
            <p style={{ 
              fontSize: '1.1rem', 
              color: 'var(--text-secondary)',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Discover amazing {categoryInfo.name.toLowerCase()} content
            </p>
            {content.length > 0 && (
              <p style={{ 
                fontSize: '0.9rem', 
                color: 'var(--text-secondary)',
                marginTop: '16px',
                opacity: 0.8
              }}>
                Showing {content.length} titles
              </p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Content Grid */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 16px' }}>
        {content.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>
              No content found
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              We couldn't find any {categoryInfo.name.toLowerCase()} content at the moment.
            </p>
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="category-page-grid"
              style={{
                marginBottom: '48px'
              }}
            >
              {content.map((item, index) => (
                <motion.div
                  key={`${item.id}-${item.content_type || 'movie'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ContentCard
                    content={item}
                    showRating={true}
                    showWatchlist={true}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* View More Button */}
            {hasMore && (
              <div style={{ textAlign: 'center' }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleViewMore}
                  disabled={loadingMore}
                  style={{
                    backgroundColor: categoryInfo.color,
                    color: 'white',
                    border: 'none',
                    padding: '16px 32px',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: loadingMore ? 'not-allowed' : 'pointer',
                    opacity: loadingMore ? 0.7 : 1,
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    margin: '0 auto'
                  }}
                >
                  {loadingMore ? (
                    <>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTop: '2px solid white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                      Loading...
                    </>
                  ) : (
                    <>
                      View More
                      <span style={{ fontSize: '1.2rem' }}>↓</span>
                    </>
                  )}
                </motion.button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add spinning animation for loading spinner */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Category;
