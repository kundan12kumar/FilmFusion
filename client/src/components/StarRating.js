import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const StarRating = ({
  rating = 0,
  onRate,
  readonly = false,
  size = 'md',
  showValue = true,
  showRateButton = false
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [animatingStars, setAnimatingStars] = useState(new Set());
  const [showRatingPopup, setShowRatingPopup] = useState(false);
  const [isRatingMode, setIsRatingMode] = useState(false);

  const sizeMap = {
    sm: 16,
    md: 24,
    lg: 32
  };

  const starSize = sizeMap[size];

  const handleMouseEnter = (index) => {
    if (!readonly) {
      setHoverRating(index);
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
      setIsHovering(false);
    }
  };

  const handleClick = (index) => {
    if (!readonly && onRate) {
      // Add animation for clicked star
      setAnimatingStars(prev => new Set([...prev, index]));

      // Show success popup
      setShowRatingPopup(true);
      setTimeout(() => setShowRatingPopup(false), 2000);

      setTimeout(() => {
        setAnimatingStars(prev => {
          const newSet = new Set(prev);
          newSet.delete(index);
          return newSet;
        });
      }, 600);

      onRate(index);
      setIsRatingMode(false);
    }
  };

  const handleRateButtonClick = () => {
    setIsRatingMode(true);
  };

  const displayRating = isHovering ? hoverRating : rating;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
      {/* Rate Button - Just Star Icon */}
      {showRateButton && !isRatingMode && !readonly && (
        <motion.button
          onClick={handleRateButtonClick}
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            border: '2px solid var(--accent-primary)',
            backgroundColor: 'transparent',
            color: 'var(--accent-primary)',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
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
      )}

      {/* Current Rating Display */}
      {showRateButton && !isRatingMode && !readonly && rating > 0 && (
        <span style={{
          fontSize: '14px',
          color: 'var(--text-secondary)',
          fontWeight: '500'
        }}>
          {rating}/5
        </span>
      )}

      {/* Stars Container */}
      {(!showRateButton || isRatingMode || readonly || rating > 0) && (
        <div style={{ display: 'flex', gap: '4px' }}>
          {[1, 2, 3, 4, 5].map((index) => {
            const isFilled = index <= displayRating;
            const isAnimating = animatingStars.has(index);

            return (
              <motion.button
                key={index}
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: readonly ? 'default' : 'pointer',
                  padding: '2px',
                  width: starSize,
                  height: starSize,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  outline: 'none'
                }}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleClick(index)}
                whileHover={readonly ? {} : {
                  scale: 1.3,
                  rotate: [0, -15, 15, 0],
                  transition: { duration: 0.4 }
                }}
                whileTap={readonly ? {} : {
                  scale: 0.7,
                  transition: { duration: 0.1 }
                }}
                animate={isAnimating ? {
                  scale: [1, 1.8, 1.2, 1],
                  rotate: [0, 180, 360],
                  transition: { duration: 0.8, ease: "easeInOut" }
                } : {}}
                disabled={readonly}
              >
              <motion.div
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'relative'
                }}
                animate={isFilled ? {
                  filter: [
                    'drop-shadow(0 0 0px var(--accent-primary))',
                    'drop-shadow(0 0 8px var(--accent-primary))',
                    'drop-shadow(0 0 4px var(--accent-primary))'
                  ]
                } : {}}
                transition={{ duration: 0.3 }}
              >
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 24 24"
                  style={{
                    color: isFilled ? '#fbbf24' : 'var(--text-muted)',
                    transition: 'color 0.3s ease',
                    filter: isFilled ? 'drop-shadow(0 2px 4px rgba(251, 191, 36, 0.3))' : 'none'
                  }}
                >
                  <motion.path
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                    fill={isFilled ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth="1.5"
                    initial={false}
                    animate={isFilled ? {
                      fill: 'currentColor',
                      scale: [1, 1.2, 1]
                    } : {
                      fill: 'none'
                    }}
                    transition={{ duration: 0.4 }}
                  />
                </svg>
              </motion.div>
            </motion.button>
          );
        })}
        </div>
      )}

      {showValue && (
        <motion.span
          style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            marginLeft: '8px',
            fontWeight: '500'
          }}
          animate={{
            color: displayRating > 0 ? 'var(--accent-primary)' : 'var(--text-muted)'
          }}
          transition={{ duration: 0.3 }}
        >
          {displayRating > 0 ? `${displayRating}/5` : 'Not rated'}
        </motion.span>
      )}

      {/* Success Popup */}
      <AnimatePresence>
        {showRatingPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -20 }}
            style={{
              position: 'absolute',
              top: '-60px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'var(--accent-primary)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              boxShadow: '0 4px 20px var(--shadow-medium)',
              zIndex: 1000,
              whiteSpace: 'nowrap'
            }}
          >
            🎉 Rating saved! Thanks for your feedback
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StarRating;
