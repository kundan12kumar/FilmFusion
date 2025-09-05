import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useTheme } from '../../contexts/ThemeContext';

const MovieCardSkeleton = ({ count = 1 }) => {
  const { theme } = useTheme();

  const skeletonBaseColor = theme === 'dark' ? '#374151' : '#f3f4f6';
  const skeletonHighlightColor = theme === 'dark' ? '#4b5563' : '#e5e7eb';

  return (
    <SkeletonTheme baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
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
        </div>
      ))}
    </SkeletonTheme>
  );
};

export default MovieCardSkeleton;
