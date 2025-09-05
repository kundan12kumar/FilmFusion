import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { userAPI } from '../services/api';

const ContentCard = ({ content, showRating = true, showWatchlist = true, onWatchlistChange }) => {
  const { isAuthenticated } = useAuth();
  const [userRating, setUserRating] = useState(null);

  // Determine content properties
  const contentId = content.id;
  const contentType = content.content_type || 'movie';
  const category = content.category || 'hollywood';
  const title = content.title || content.name;

  // Category display names and colors
  const categoryConfig = {
    bollywood: { name: 'Bollywood', color: '#FF6B35', emoji: '🇮🇳' },
    hollywood: { name: 'Hollywood', color: '#FFD700', emoji: '🇺🇸' },
    k_drama: { name: 'K-Drama', color: '#FF69B4', emoji: '🇰🇷' },
    web_series: { name: 'Web Series', color: '#00CED1', emoji: '📺' },
    anime: { name: 'Anime', color: '#FF1493', emoji: '🇯🇵' },
    south: { name: 'South Indian', color: '#32CD32', emoji: '🌴' }
  };

  const categoryInfo = categoryConfig[category] || categoryConfig.hollywood;

  const fetchUserRating = useCallback(async () => {
    try {
      const response = await userAPI.getContentRating(contentId, contentType);
      setUserRating(response.data.rating);
    } catch (error) {
      console.error('Error fetching user rating:', error);
    }
  }, [contentId, contentType]);

  useEffect(() => {
    if (isAuthenticated && showRating) {
      fetchUserRating();
    }
  }, [isAuthenticated, contentId, contentType, showRating, fetchUserRating]);

  const getContentUrl = () => {
    const slug = title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : '';
    return `/${contentType}/${contentId}${slug ? `-${slug}` : ''}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="card"
      style={{
        backgroundColor: 'var(--bg-primary)',
        border: '1px solid var(--border-primary)',
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        minHeight: '320px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Poster Image - Reduced height */}
      <div className="relative overflow-hidden" style={{ height: '240px' }}>
        <Link to={getContentUrl()}>
          <img
            src={content.poster_path
              ? `https://image.tmdb.org/t/p/w300${content.poster_path}`
              : '/placeholder-poster.jpg'
            }
            alt={title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease'
            }}
            className="transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        </Link>
      </div>

      {/* Content Info - Simplified */}
      <div className="p-3" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          {/* Movie Title */}
          <Link to={getContentUrl()}>
            <h3
              className="font-semibold mb-2 line-clamp-2 hover:text-primary-600 transition-colors"
              style={{
                color: 'var(--text-primary)',
                fontSize: '14px',
                lineHeight: '1.3',
                minHeight: '36px',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {title}
            </h3>
          </Link>

          {/* Category Tag */}
          <div
            className="inline-block px-2 py-1 rounded-full text-xs font-semibold text-white"
            style={{
              backgroundColor: categoryInfo.color,
              fontSize: '10px'
            }}
          >
            {categoryInfo.emoji} {categoryInfo.name}
          </div>
        </div>

        {/* Rate Button and Ratings */}
        <div className="mt-2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          {/* Rate Button */}
          {isAuthenticated && showRating && (
            <Link to={getContentUrl()}>
              <motion.button
                style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '2px solid var(--accent-primary)',
                  backgroundColor: 'transparent',
                  color: 'var(--accent-primary)',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                whileHover={{
                  backgroundColor: 'var(--accent-primary)',
                  color: 'white',
                  scale: 1.05
                }}
                whileTap={{ scale: 0.95 }}
              >
                ⭐
              </motion.button>
            </Link>
          )}

          {/* Ratings Display */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
            {/* TMDB Rating */}
            {content.vote_average > 0 && (
              <span style={{
                color: 'var(--text-secondary)',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '2px'
              }}>
                🎬 {content.vote_average.toFixed(1)}
              </span>
            )}

            {/* User Rating */}
            {userRating > 0 && (
              <span style={{
                color: 'var(--accent-primary)',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '2px'
              }}>
                👤 {userRating}/5
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContentCard;
