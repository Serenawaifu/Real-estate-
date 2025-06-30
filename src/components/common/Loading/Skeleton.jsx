import React, { forwardRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './Skeleton.module.css';

const Skeleton = forwardRef(({
  // Appearance
  variant = 'rect',
  width,
  height,
  aspectRatio,
  borderRadius = 4,
  padding = 0,
  margin = 0,
  color = 'light',
  backgroundColor = 'rgba(0, 0, 0, 0.1)',
  animation = 'pulse',
  speed = 1,
  className = '',
  style = {},
  
  // Content
  children,
  label,
  labelPosition = 'bottom',
  showLabel = true,
  
  // Behavior
  overlay = false,
  overlayColor = 'rgba(0, 0, 0, 0.5)',
  overlayBlur = false,
  blocking = true,
  centerInParent = false,
  
  // Features
  showShimmer = true,
  shimmerColor = 'rgba(255, 255, 255, 0.2)',
  shimmerSpeed = 1,
  shimmerDirection = 'right',
  shimmerAnimation = 'linear',
  shimmerOpacity = 0.5,
  
  // Callbacks
  onAnimationEnd,
  
  // Accessibility
  role = 'status',
  ariaLabel,
  ariaLive = 'polite',
  
  ...props
}, ref) => {
  // State management
  const [isVisible, setIsVisible] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [animationState, setAnimationState] = useState({
    pulse: false,
    shimmer: false
  });

  // Calculate aspect ratio padding
  const aspectRatioPadding = useMemo(() => {
    if (aspectRatio) {
      const [w, h] = aspectRatio.split(':').map(Number);
      return `${(h / w) * 100}%`;
    }
    if (width && height) {
      return `${(height / width) * 100}%`;
    }
    return null;
  }, [aspectRatio, width, height]);

  // Handle animation end
  useEffect(() => {
    if (isComplete && onAnimationEnd) {
      onAnimationEnd();
    }
  }, [isComplete, onAnimationEnd]);

  // Handle shimmer animation
  useEffect(() => {
    if (showShimmer) {
      const shimmerTimeout = setTimeout(() => {
        setAnimationState(prev => ({ ...prev, shimmer: true }));
      }, 1000 / shimmerSpeed);

      return () => clearTimeout(shimmerTimeout);
    }
  }, [showShimmer, shimmerSpeed]);

  // Build class names
  const skeletonClasses = [
    styles.skeletonContainer,
    styles[variant],
    styles[color],
    isComplete && styles.complete,
    !isVisible && styles.hidden,
    className
  ].filter(Boolean).join(' ');

  const overlayClasses = [
    styles.overlay,
    overlayBlur && styles.overlayBlur,
    !blocking && styles.nonBlocking
  ].filter(Boolean).join(' ');

  // Don't render if not visible
  if (!isVisible) return null;

  // Render skeleton content based on variant
  const renderSkeletonContent = () => {
    switch (variant) {
      case 'rect':
        return renderRectSkeleton();
      case 'circle':
        return renderCircleSkeleton();
      case 'text':
        return renderTextSkeleton();
      case 'avatar':
        return renderAvatarSkeleton();
      case 'custom':
        return children || renderRectSkeleton();
      default:
        return renderRectSkeleton();
    }
  };

  // Rect skeleton (default)
  const renderRectSkeleton = () => {
    return (
      <div
        className={styles.rectSkeleton}
        style={{
          width,
          height,
          aspectRatio: aspectRatioPadding,
          borderRadius,
          padding,
          margin,
          backgroundColor,
          animation: animationState.pulse ? `pulse ${1 / speed}s` : undefined
        }}
      >
        {showShimmer && (
          <div
            className={styles.shimmer}
            style={{
              backgroundColor: shimmerColor,
              animation: animationState.shimmer ? `shimmer ${1 / shimmerSpeed}s ${shimmerAnimation} ${shimmerDirection}` : undefined,
              opacity: shimmerOpacity
            }}
          />
        )}
      </div>
    );
  };

  // Circle skeleton
  const renderCircleSkeleton = () => {
    return (
      <div
        className={styles.circleSkeleton}
        style={{
          width,
          height,
          borderRadius: '50%',
          padding,
          margin,
          backgroundColor,
          animation: animationState.pulse ? `pulse ${1 / speed}s` : undefined
        }}
      >
        {showShimmer && (
          <div
            className={styles.shimmer}
            style={{
              backgroundColor: shimmerColor,
              animation: animationState.shimmer ? `shimmer ${1 / shimmerSpeed}s ${shimmerAnimation} ${shimmerDirection}` : undefined,
              opacity: shimmerOpacity
            }}
          />
        )}
      </div>
    );
  };

  // Text skeleton
  const renderTextSkeleton = () => {
    return (
      <div
        className={styles.textSkeleton}
        style={{
          width,
          height,
          padding,
          margin,
          backgroundColor,
          animation: animationState.pulse ? `pulse ${1 / speed}s` : undefined
        }}
      >
        {showShimmer && (
          <div
            className={styles.shimmer}
            style={{
              backgroundColor: shimmerColor,
              animation: animationState.shimmer ? `shimmer ${1 / shimmerSpeed}s ${shimmerAnimation} ${shimmerDirection}` : undefined,
              opacity: shimmerOpacity
            }}
          />
        )}
      </div>
    );
  };

  // Avatar skeleton
  const renderAvatarSkeleton = () => {
    return (
      <div
        className={styles.avatarSkeleton}
        style={{
          width,
          height,
          borderRadius: '50%',
          padding,
          margin,
          backgroundColor,
          animation: animationState.pulse ? `pulse ${1 / speed}s` : undefined
        }}
      >
        {showShimmer && (
          <div
            className={styles.shimmer}
            style={{
              backgroundColor: shimmerColor,
              animation: animationState.shimmer ? `shimmer ${1 / shimmerSpeed}s ${shimmerAnimation} ${shimmerDirection}` : undefined,
              opacity: shimmerOpacity
            }}
          />
        )}
      </div>
    );
  };

  // Render with or without overlay
  if (overlay) {
    return (
      <div
        className={overlayClasses}
        style={{ backgroundColor: overlayColor }}
      >
        {renderSkeletonContent()}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={skeletonClasses}
      style={style}
      role={role}
      aria-label={ariaLabel || label || 'Loading'}
      aria-live={ariaLive}
      {...props}
    >
      {renderSkeletonContent()}
      
      {/* Label */}
      {showLabel && label && (
        <span
          className={`${styles.label} ${styles[`label${labelPosition.charAt(0).toUpperCase() + labelPosition.slice(1)}`]}`}
          style={{ fontSize: '0.875rem' }}
        >
          {label}
        </span>
      )}
    </div>
  );
});

Skeleton.displayName = 'Skeleton';

Skeleton.propTypes = {
  variant: PropTypes.oneOf([
    'rect',
    'circle',
    'text',
    'avatar',
    'custom'
  ]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  aspectRatio: PropTypes.string,
  borderRadius: PropTypes.number,
  padding: PropTypes.number,
  margin: PropTypes.number,
  color: PropTypes.oneOf(['light', 'dark']),
  backgroundColor: PropTypes.string,
  animation: PropTypes.string,
  speed: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.object,
  label: PropTypes.string,
  labelPosition: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  showLabel: PropTypes.bool,
  overlay: PropTypes.bool,
  overlayColor: PropTypes.string,
  overlayBlur: PropTypes.bool,
  blocking: PropTypes.bool,
  centerInParent: PropTypes.bool,
  showShimmer: PropTypes.bool,
  shimmerColor: PropTypes.string,
  shimmerSpeed: PropTypes.number,
  shimmerDirection: PropTypes.oneOf(['right', 'left']),
  shimmerAnimation: PropTypes.oneOf(['linear', 'ease-in', 'ease-out']),
  shimmerOpacity: PropTypes.number,
  onAnimationEnd: PropTypes.func,
  role: PropTypes.string,
  ariaLabel: PropTypes.string,
  ariaLive: PropTypes.oneOf(['polite', 'assertive', 'off'])
};

export default Skeleton;

