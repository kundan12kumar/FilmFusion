import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';

const HomeSkeleton = () => {
  const { theme } = useTheme();

  const skeletonBaseColor = theme === 'dark' ? '#374151' : '#f3f4f6';
  const skeletonHighlightColor = theme === 'dark' ? '#4b5563' : '#e5e7eb';

  const CategorySkeleton = ({ title }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{ marginBottom: '48px' }}
    >
      {/* Category Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div>
          <Skeleton 
            height={32} 
            width={200} 
            style={{ borderRadius: '6px', marginBottom: '8px' }} 
          />
          <Skeleton 
            height={18} 
            width={300} 
            style={{ borderRadius: '4px' }} 
          />
        </div>
        <Skeleton 
          height={40} 
          width={120} 
          style={{ borderRadius: '8px' }} 
        />
      </div>

      {/* Movie Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '24px'
      }}>
        {Array.from({ length: 10 }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
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
            <div style={{ marginBottom: '12px' }}>
              <Skeleton height={16} width="60%" style={{ borderRadius: '4px' }} />
            </div>

            {/* Rating and Rate Button */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <Skeleton height={16} width="40%" style={{ borderRadius: '4px' }} />
              <Skeleton height={32} width={40} style={{ borderRadius: '6px' }} />
            </div>

            {/* Action Buttons */}
            <div style={{ 
              display: 'flex', 
              gap: '8px',
              marginTop: '12px'
            }}>
              <Skeleton height={36} style={{ borderRadius: '8px', flex: 1 }} />
              <Skeleton height={36} width={36} style={{ borderRadius: '8px' }} />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <SkeletonTheme baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor}>
      <div style={{ 
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        padding: '0'
      }}>
        {/* Hero Section Skeleton */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{
            background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
            padding: '80px 16px',
            textAlign: 'center',
            marginBottom: '48px'
          }}
        >
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <Skeleton 
              height={48} 
              width="80%" 
              style={{ 
                borderRadius: '8px', 
                marginBottom: '16px',
                margin: '0 auto 16px auto'
              }} 
            />
            <Skeleton 
              height={24} 
              width="60%" 
              style={{ 
                borderRadius: '6px',
                margin: '0 auto'
              }} 
            />
          </div>
        </motion.section>

        {/* Content Sections */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>
          <CategorySkeleton title="Bollywood" />
          <CategorySkeleton title="Hollywood" />
          <CategorySkeleton title="K-Drama" />
          <CategorySkeleton title="Web Series" />
          <CategorySkeleton title="Anime" />
          <CategorySkeleton title="South Indian" />
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default HomeSkeleton;
