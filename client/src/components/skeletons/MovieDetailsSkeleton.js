import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';

const MovieDetailsSkeleton = () => {
  const { theme } = useTheme();

  const skeletonBaseColor = theme === 'dark' ? '#374151' : '#f3f4f6';
  const skeletonHighlightColor = theme === 'dark' ? '#4b5563' : '#e5e7eb';

  return (
    <SkeletonTheme baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor}>
      <div style={{ 
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)'
      }}>
        {/* Hero Section with Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{
            position: 'relative',
            height: '60vh',
            background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px'
          }}
        >
          <div style={{
            maxWidth: '1280px',
            margin: '0 auto',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: '300px 1fr',
            gap: '32px',
            alignItems: 'center'
          }}>
            {/* Movie Poster */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Skeleton 
                height={450} 
                style={{ 
                  borderRadius: '12px',
                  display: 'block'
                }} 
              />
            </motion.div>

            {/* Movie Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{ color: 'white' }}
            >
              <Skeleton 
                height={40} 
                width="80%" 
                style={{ borderRadius: '6px', marginBottom: '16px' }} 
              />
              <Skeleton 
                height={20} 
                width="40%" 
                style={{ borderRadius: '4px', marginBottom: '16px' }} 
              />
              <Skeleton 
                height={16} 
                width="60%" 
                style={{ borderRadius: '4px', marginBottom: '24px' }} 
              />
              
              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                <Skeleton height={48} width={120} style={{ borderRadius: '8px' }} />
                <Skeleton height={48} width={48} style={{ borderRadius: '8px' }} />
                <Skeleton height={48} width={48} style={{ borderRadius: '8px' }} />
              </div>

              {/* Rating Section */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Skeleton height={24} width="30%" style={{ borderRadius: '4px' }} />
                <Skeleton height={32} width={150} style={{ borderRadius: '6px' }} />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Content Section */}
        <div style={{ 
          maxWidth: '1280px', 
          margin: '0 auto', 
          padding: '48px 16px' 
        }}>
          {/* Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            style={{ marginBottom: '48px' }}
          >
            <Skeleton 
              height={28} 
              width={150} 
              style={{ borderRadius: '6px', marginBottom: '16px' }} 
            />
            <Skeleton 
              height={18} 
              count={4} 
              style={{ borderRadius: '4px', marginBottom: '8px' }} 
            />
          </motion.div>

          {/* Cast Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            style={{ marginBottom: '48px' }}
          >
            <Skeleton 
              height={28} 
              width={100} 
              style={{ borderRadius: '6px', marginBottom: '24px' }} 
            />
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
              gap: '16px'
            }}>
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} style={{ textAlign: 'center' }}>
                  <Skeleton 
                    height={120} 
                    style={{ 
                      borderRadius: '50%',
                      marginBottom: '8px',
                      display: 'block'
                    }} 
                  />
                  <Skeleton height={16} style={{ borderRadius: '4px', marginBottom: '4px' }} />
                  <Skeleton height={14} width="80%" style={{ borderRadius: '4px' }} />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Similar Movies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <Skeleton 
              height={28} 
              width={200} 
              style={{ borderRadius: '6px', marginBottom: '24px' }} 
            />
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '24px'
            }}>
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid var(--border-primary)'
                  }}
                >
                  <Skeleton 
                    height={240} 
                    style={{ 
                      borderRadius: '8px',
                      marginBottom: '12px',
                      display: 'block'
                    }} 
                  />
                  <Skeleton height={18} style={{ borderRadius: '4px', marginBottom: '8px' }} />
                  <Skeleton height={14} width="60%" style={{ borderRadius: '4px' }} />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default MovieDetailsSkeleton;
