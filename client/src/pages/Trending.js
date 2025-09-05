import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ContentCard from '../components/ContentCard';
import { contentAPI } from '../services/api';
import TrendingSkeleton from '../components/skeletons/TrendingSkeleton';

const Trending = () => {
  const [trendingContent, setTrendingContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingContent = async () => {
      try {
        setLoading(true);
        // Fetch trending content from different categories
        const categories = ['hollywood', 'bollywood', 'k_drama', 'web_series', 'anime', 'south'];
        const promises = categories.map(category => 
          contentAPI.getByCategory(category, 1)
        );
        
        const responses = await Promise.all(promises);
        
        // Combine all trending content
        const allContent = [];
        responses.forEach(response => {
          if (response.data && response.data.results) {
            allContent.push(...response.data.results.slice(0, 5));
          }
        });

        // Remove duplicates based on ID and content type
        const uniqueContent = allContent.filter((item, index, self) =>
          index === self.findIndex(t =>
            t.id === item.id && t.content_type === item.content_type
          )
        );

        // Sort by popularity and take top 20
        const sortedContent = uniqueContent
          .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
          .slice(0, 20);
        
        setTrendingContent(sortedContent);
      } catch (error) {
        console.error('Error fetching trending content:', error);
        setError('Failed to load trending content');
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingContent();
  }, []);

  if (loading) {
    return <TrendingSkeleton />;
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        color: 'var(--text-primary)'
      }}>
        <div>{error}</div>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '1280px', 
      margin: '0 auto', 
      padding: '48px 16px',
      backgroundColor: 'var(--bg-primary)',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '32px', textAlign: 'center' }}
      >
        <h1 style={{
          fontSize: '48px',
          fontWeight: 'bold',
          color: 'var(--text-primary)',
          marginBottom: '16px'
        }}>
          🔥 Trending Now
        </h1>
        <p style={{
          fontSize: '18px',
          color: 'var(--text-secondary)',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Discover the most popular movies and shows across all categories
        </p>
      </motion.div>

      {/* Trending Content Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '24px',
          marginTop: '32px'
        }}
      >
        {trendingContent.map((item, index) => (
          <motion.div
            key={`${item.id}-${item.content_type || 'movie'}`}
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

      {trendingContent.length === 0 && !loading && (
        <div style={{
          textAlign: 'center',
          padding: '64px 16px',
          color: 'var(--text-secondary)'
        }}>
          <h3 style={{ fontSize: '24px', marginBottom: '16px' }}>
            No trending content found
          </h3>
          <p>Check back later for the latest trending movies and shows!</p>
        </div>
      )}
    </div>
  );
};

export default Trending;
