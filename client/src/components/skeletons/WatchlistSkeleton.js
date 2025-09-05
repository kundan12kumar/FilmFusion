import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';

const WatchlistSkeleton = () => {
  const { theme } = useTheme();

  const skeletonBaseColor = theme === 'dark' ? '#374151' : '#f3f4f6';
  const skeletonHighlightColor = theme === 'dark' ? '#4b5563' : '#e5e7eb';

  return (
    <SkeletonTheme baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor}>
      <div style={{ 
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        padding: '32px 16px'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: '32px' }}
          >
            <Skeleton 
              height={48} 
              width={250} 
              style={{ borderRadius: '8px', marginBottom: '12px' }} 
            />
            <Skeleton 
              height={20} 
              width={400} 
              style={{ borderRadius: '4px' }} 
            />
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '32px',
              border: '1px solid var(--border-primary)'
            }}
          >
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '24px'
            }}>
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} style={{ textAlign: 'center' }}>
                  <Skeleton 
                    height={32} 
                    width={60} 
                    style={{ borderRadius: '6px', marginBottom: '8px' }} 
                  />
                  <Skeleton 
                    height={16} 
                    width="80%" 
                    style={{ borderRadius: '4px', margin: '0 auto' }} 
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Filter/Sort Options */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{ 
              display: 'flex', 
              gap: '16px', 
              marginBottom: '32px',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', gap: '12px' }}>
              <Skeleton height={40} width={100} style={{ borderRadius: '8px' }} />
              <Skeleton height={40} width={120} style={{ borderRadius: '8px' }} />
              <Skeleton height={40} width={80} style={{ borderRadius: '8px' }} />
            </div>
            <Skeleton height={40} width={150} style={{ borderRadius: '8px' }} />
          </motion.div>

          {/* Watchlist Content Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '24px'
            }}
          >
            {Array.from({ length: 12 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid var(--border-primary)',
                  transition: 'all 0.3s ease'
                }}
              >
                {/* Movie Poster */}
                <div style={{ marginBottom: '12px' }}>
                  <Skeleton 
                    height={280} 
                    style={{ 
                      borderRadius: '8px',
                      display: 'block'
                    }} 
                  />
                </div>

                {/* Movie Title */}
                <div style={{ marginBottom: '8px' }}>
                  <Skeleton height={20} style={{ borderRadius: '4px' }} />
                </div>

                {/* Movie Category */}
                <div style={{ marginBottom: '8px' }}>
                  <Skeleton height={16} width="60%" style={{ borderRadius: '4px' }} />
                </div>

                {/* Added Date */}
                <div style={{ marginBottom: '12px' }}>
                  <Skeleton height={14} width="50%" style={{ borderRadius: '4px' }} />
                </div>

                {/* Rating and Status */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <Skeleton height={16} width="40%" style={{ borderRadius: '4px' }} />
                  <Skeleton height={20} width={60} style={{ borderRadius: '10px' }} />
                </div>

                {/* Action Buttons */}
                <div style={{ 
                  display: 'flex', 
                  gap: '8px',
                  marginTop: '12px'
                }}>
                  <Skeleton height={36} style={{ borderRadius: '8px', flex: 1 }} />
                  <Skeleton height={36} width={36} style={{ borderRadius: '8px' }} />
                  <Skeleton height={36} width={36} style={{ borderRadius: '8px' }} />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Load More Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            style={{ 
              textAlign: 'center', 
              marginTop: '48px' 
            }}
          >
            <Skeleton 
              height={48} 
              width={150} 
              style={{ borderRadius: '8px' }} 
            />
          </motion.div>

          {/* Empty State Alternative */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              borderRadius: '16px',
              padding: '48px 24px',
              textAlign: 'center',
              marginTop: '32px',
              border: '2px dashed var(--border-secondary)'
            }}
          >
            <Skeleton 
              height={64} 
              width={64} 
              style={{ 
                borderRadius: '50%', 
                margin: '0 auto 16px auto' 
              }} 
            />
            <Skeleton 
              height={24} 
              width={200} 
              style={{ 
                borderRadius: '6px', 
                margin: '0 auto 12px auto' 
              }} 
            />
            <Skeleton 
              height={16} 
              width={300} 
              style={{ 
                borderRadius: '4px', 
                margin: '0 auto 24px auto' 
              }} 
            />
            <Skeleton 
              height={40} 
              width={120} 
              style={{ 
                borderRadius: '8px', 
                margin: '0 auto' 
              }} 
            />
          </motion.div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default WatchlistSkeleton;
