import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { contentAPI } from '../services/api';
import ContentCard from '../components/ContentCard';

const Search = () => {
  const [searchParams] = useSearchParams();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);

  const query = searchParams.get('q');

  useEffect(() => {
    if (query) {
      setPage(1);
      searchContent(query, 1);
    }
  }, [query]);

  const searchContent = async (searchQuery, pageNum = 1) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await contentAPI.search(searchQuery, pageNum);

      if (pageNum === 1) {
        setContent(response.data.results);
      } else {
        setContent(prev => [...prev, ...response.data.results]);
      }

      setTotalPages(response.data.total_pages);
      setTotalResults(response.data.total_results);
    } catch (error) {
      console.error('Error searching content:', error);
      setError('Failed to search content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (page < totalPages && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      searchContent(query, nextPage);
    }
  };

  if (!query) {
    return (
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 16px',
        textAlign: 'center'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ maxWidth: '600px' }}
        >
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>🔍</div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            marginBottom: '16px',
            color: 'var(--text-primary)'
          }}>
            Search for Content
          </h1>
          <p style={{
            fontSize: '18px',
            color: 'var(--text-secondary)',
            lineHeight: '1.6'
          }}>
            Use the search bar in the navigation to find movies, TV shows, K-dramas, anime,
            and content from around the world.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '32px 16px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Search Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '32px' }}
        >
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            marginBottom: '8px',
            color: 'var(--text-primary)'
          }}>
            Search Results
          </h1>
          <p style={{
            fontSize: '16px',
            color: 'var(--text-secondary)'
          }}>
            {loading && page === 1 ? (
              'Searching...'
            ) : totalResults > 0 ? (
              `Found ${totalResults.toLocaleString()} results for "${query}"`
            ) : (
              `No results found for "${query}"`
            )}
          </p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--accent-primary)',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '32px',
              color: 'var(--accent-primary)'
            }}
          >
            {error}
          </motion.div>
        )}

        {/* Loading State */}
        {loading && page === 1 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '24px',
            marginBottom: '32px'
          }}>
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: '12px',
                  height: '400px',
                  animation: 'pulse 2s infinite'
                }}
              />
            ))}
          </div>
        )}

        {/* Search Results */}
        {content.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '24px',
                marginBottom: '48px'
              }}
            >
              {content.map((item, index) => (
                <motion.div
                  key={`${item.id}-${item.content_type}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ContentCard
                    content={item}
                    showRating={true}
                    showWatchlist={true}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Load More Button */}
            {page < totalPages && (
              <div style={{ textAlign: 'center' }}>
                <motion.button
                  onClick={handleLoadMore}
                  disabled={loading}
                  style={{
                    padding: '12px 32px',
                    borderRadius: '8px',
                    border: '2px solid var(--accent-primary)',
                    backgroundColor: loading ? 'var(--bg-secondary)' : 'transparent',
                    color: loading ? 'var(--text-muted)' : 'var(--accent-primary)',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  whileHover={!loading ? {
                    backgroundColor: 'var(--accent-primary)',
                    color: 'white',
                    scale: 1.05
                  } : {}}
                  whileTap={!loading ? { scale: 0.95 } : {}}
                >
                  {loading ? 'Loading...' : `Load More (${page}/${totalPages})`}
                </motion.button>
              </div>
            )}
          </>
        )}

        {/* No Results */}
        {!loading && content.length === 0 && query && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              textAlign: 'center',
              padding: '64px 16px',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '12px',
              border: '2px dashed var(--border-primary)'
            }}
          >
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎬</div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '8px',
              color: 'var(--text-primary)'
            }}>
              No content found
            </h3>
            <p style={{
              color: 'var(--text-secondary)',
              marginBottom: '24px',
              lineHeight: '1.6'
            }}>
              We couldn't find any movies, TV shows, or other content matching "{query}".
              Try searching with different keywords or check your spelling.
            </p>
            <motion.button
              onClick={() => window.history.back()}
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: 'var(--accent-primary)',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Go Back
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Search;
