import React, { forwardRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './Spinner.module.css';

const Spinner = forwardRef(({
  // Appearance
  variant = 'circle',
  size = 'medium',
  color = 'primary',
  thickness = 3,
  speed = 1,
  className = '',
  style = {},
  
  // Content
  label,
  labelPosition = 'bottom',
  showLabel = true,
  percentage,
  showPercentage = false,
  
  // Behavior
  overlay = false,
  overlayColor = 'rgba(0, 0, 0, 0.5)',
  overlayBlur = false,
  blocking = true,
  centerInParent = false,
  
  // Animation
  animation = 'default',
  customAnimation,
  pulseScale = 1.2,
  
  // Features
  determinate = false,
  value = 0,
  max = 100,
  showProgress = false,
  successOnComplete = false,
  hideDelay = 0,
  fadeOut = true,
  
  // Callbacks
  onComplete,
  onAnimationEnd,
  
  // Accessibility
  role = 'status',
  ariaLabel,
  ariaLive = 'polite',
  announceProgress = true,
  
  ...props
}, ref) => {
  // State management
  const [isVisible, setIsVisible] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const [announcement, setAnnouncement] = useState('');

  // Calculate progress percentage
  const progressPercentage = determinate ? Math.min((currentValue / max) * 100, 100) : 0;

  // Handle value changes for determinate spinners
  useEffect(() => {
    if (determinate) {
      setCurrentValue(value);
      
      if (value >= max && successOnComplete) {
        setIsComplete(true);
        onComplete?.();
        
        if (hideDelay > 0) {
          setTimeout(() => {
            setIsVisible(false);
            onAnimationEnd?.();
          }, hideDelay);
        }
      }
      
      // Update screen reader announcement
      if (announceProgress && showProgress) {
        const progressText = `Loading progress: ${Math.round(progressPercentage)}%`;
        setAnnouncement(progressText);
      }
    }
  }, [value, max, determinate, successOnComplete, hideDelay, onComplete, onAnimationEnd, progressPercentage, announceProgress, showProgress]);

  // Get size values
  const getSizeValues = () => {
    const sizes = {
      tiny: { spinner: 16, stroke: 2, font: '0.625rem' },
      small: { spinner: 24, stroke: 2.5, font: '0.75rem' },
      medium: { spinner: 36, stroke: 3, font: '0.875rem' },
      large: { spinner: 48, stroke: 3.5, font: '1rem' },
      xlarge: { spinner: 64, stroke: 4, font: '1.125rem' }
    };

    return sizes[size] || sizes.medium;
  };

  const sizeValues = getSizeValues();

  // Build spinner content based on variant
  const renderSpinnerContent = () => {
    switch (variant) {
      case 'circle':
        return renderCircleSpinner();
      case 'dots':
        return renderDotsSpinner();
      case 'bars':
        return renderBarsSpinner();
      case 'pulse':
        return renderPulseSpinner();
      case 'square':
        return renderSquareSpinner();
      case 'ripple':
        return renderRippleSpinner();
      case 'wave':
        return renderWaveSpinner();
      case 'bounce':
        return renderBounceSpinner();
      case 'rotate':
        return renderRotateSpinner();
      case 'flip':
        return renderFlipSpinner();
      case 'custom':
        return customAnimation || renderCircleSpinner();
      default:
        return renderCircleSpinner();
    }
  };

  // Circle spinner (default)
  const renderCircleSpinner = () => {
    const radius = (sizeValues.spinner - thickness) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = determinate
      ? `${(progressPercentage / 100) * circumference} ${circumference}`
      : `${circumference * 0.75} ${circumference}`;

    return (
      <svg
        className={`${styles.spinner} ${styles.circle}`}
        width={sizeValues.spinner}
        height={sizeValues.spinner}
        viewBox={`0 0 ${sizeValues.spinner} ${sizeValues.spinner}`}
        style={{ animationDuration: `${1 / speed}s` }}
      >
        {/* Background circle */}
        <circle
          className={styles.circleBackground}
          cx={sizeValues.spinner / 2}
          cy={sizeValues.spinner / 2}
          r={radius}
          fill="none"
          strokeWidth={thickness}
        />
        {/* Animated circle */}
        <circle
          className={styles.circlePath}
          cx={sizeValues.spinner / 2}
          cy={sizeValues.spinner / 2}
          r={radius}
          fill="none"
          strokeWidth={thickness}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={determinate ? circumference * (1 - progressPercentage / 100) : 0}
          strokeLinecap="round"
          transform={`rotate(-90 ${sizeValues.spinner / 2} ${sizeValues.spinner / 2})`}
        />
        {isComplete && (
          <g className={styles.checkmark}>
            <path
              d={`M ${sizeValues.spinner * 0.3} ${sizeValues.spinner * 0.5} L ${sizeValues.spinner * 0.45} ${sizeValues.spinner * 0.65} L ${sizeValues.spinner * 0.7} ${sizeValues.spinner * 0.35}`}
              stroke="currentColor"
              strokeWidth={thickness}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        )}
      </svg>
    );
  };

  // Dots spinner
  const renderDotsSpinner = () => {
    const dotSize = sizeValues.spinner / 8;
    return (
      <div className={`${styles.spinner} ${styles.dots}`} style={{ width: sizeValues.spinner, height: sizeValues.spinner }}>
        {[...Array(3)].map((_, i) => (
          <span
            key={i}
            className={styles.dot}
            style={{
              width: dotSize,
              height: dotSize,
              animationDuration: `${1.4 / speed}s`,
              animationDelay: `${i * 0.16}s`
            }}
          />
        ))}
      </div>
    );
  };

  // Bars spinner
  const renderBarsSpinner = () => {
    const barWidth = sizeValues.spinner / 12;
    const barHeight = sizeValues.spinner / 3;
    return (
      <div className={`${styles.spinner} ${styles.bars}`} style={{ width: sizeValues.spinner, height: sizeValues.spinner }}>
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={styles.bar}
            style={{
              width: barWidth,
              height: barHeight,
              left: `${i * (sizeValues.spinner / 5) + barWidth / 2}px`,
              animationDuration: `${1.2 / speed}s`,
              animationDelay: `${i * 0.1}s`
            }}
          />
        ))}
      </div>
    );
  };

  // Pulse spinner
  const renderPulseSpinner = () => {
    return (
      <div className={`${styles.spinner} ${styles.pulse}`} style={{ width: sizeValues.spinner, height: sizeValues.spinner }}>
        <span
          className={styles.pulseDot}
          style={{
            animationDuration: `${1.5 / speed}s`,
            transform: `scale(${pulseScale})`
          }}
        />
        <span
          className={styles.pulseDot}
          style={{
            animationDuration: `${1.5 / speed}s`,
            animationDelay: '0.5s'
          }}
        />
      </div>
    );
  };

  // Square spinner
  const renderSquareSpinner = () => {
    return (
      <div
        className={`${styles.spinner} ${styles.square}`}
        style={{
          width: sizeValues.spinner * 0.7,
          height: sizeValues.spinner * 0.7,
          animationDuration: `${1.2 / speed}s`
        }}
      />
    );
  };

  // Ripple spinner
  const renderRippleSpinner = () => {
    return (
      <div className={`${styles.spinner} ${styles.ripple}`} style={{ width: sizeValues.spinner, height: sizeValues.spinner }}>
        {[...Array(3)].map((_, i) => (
          <span
            key={i}
            className={styles.rippleCircle}
            style={{
              borderWidth: thickness,
              animationDuration: `${2 / speed}s`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
      </div>
    );
  };

  // Wave spinner
  const renderWaveSpinner = () => {
    const barWidth = sizeValues.spinner / 10;
    return (
      <div className={`${styles.spinner} ${styles.wave}`} style={{ width: sizeValues.spinner, height: sizeValues.spinner }}>
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={styles.waveLine}
            style={{
              width: barWidth,
              height: sizeValues.spinner * 0.6,
              left: `${i * (sizeValues.spinner / 5) + barWidth}px`,
              animationDuration: `${1 / speed}s`,
              animationDelay: `${i * 0.1}s`
            }}
          />
        ))}
      </div>
    );
  };

  // Bounce spinner
  const renderBounceSpinner = () => {
    const ballSize = sizeValues.spinner / 4;
    return (
      <div className={`${styles.spinner} ${styles.bounce}`} style={{ width: sizeValues.spinner, height: sizeValues.spinner }}>
        {[...Array(3)].map((_, i) => (
          <span
            key={i}
            className={styles.bounceBall}
            style={{
              width: ballSize,
              height: ballSize,
              animationDuration: `${1.4 / speed}s`,
              animationDelay: `${i * 0.15}s`
            }}
          />
        ))}
      </div>
    );
  };

  // Rotate spinner
  const renderRotateSpinner = () => {
    return (
      <div className={`${styles.spinner} ${styles.rotate}`} style={{ width: sizeValues.spinner, height: sizeValues.spinner }}>
        <span
          className={styles.rotateBox}
          style={{
            width: sizeValues.spinner * 0.6,
            height: sizeValues.spinner * 0.6,
            borderWidth: thickness,
            animationDuration: `${1 / speed}s`
          }}
        />
      </div>
    );
  };

  // Flip spinner
  const renderFlipSpinner = () => {
    return (
      <div
        className={`${styles.spinner} ${styles.flip}`}
        style={{
          width: sizeValues.spinner * 0.8,
          height: sizeValues.spinner * 0.8,
          animationDuration: `${1.2 / speed}s`
        }}
      >
        <span className={styles.flipInner} />
      </div>
    );
  };

  // Build class names
  const spinnerClasses = [
    styles.spinnerContainer,
    styles[size],
    styles[color],
    isComplete && styles.complete,
    !isVisible && styles.hidden,
    fadeOut && styles.fadeOut,
    centerInParent && styles.centered,
    className
  ].filter(Boolean).join(' ');

  const overlayClasses = [
    styles.overlay,
    overlayBlur && styles.overlayBlur,
    !blocking && styles.nonBlocking
  ].filter(Boolean).join(' ');

  // Don't render if not visible
  if (!isVisible) return null;

  const spinnerContent = (
    <div
      ref={ref}
      className={spinnerClasses}
      style={style}
      role={role}
      aria-label={ariaLabel || label || 'Loading'}
      aria-live={ariaLive}
      aria-valuenow={determinate ? currentValue : undefined}
      aria-valuemin={determinate ? 0 : undefined}
      aria-valuemax={determinate ? max : undefined}
      {...props}
    >
      {renderSpinnerContent()}
      
      {/* Progress bar for determinate spinners */}
      {determinate && showProgress && (
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      )}
      
      {/* Percentage display */}
      {showPercentage && percentage !== undefined && (
        <span className={styles.percentage} style={{ fontSize: sizeValues.font }}>
          {percentage}%
        </span>
      )}
      
      {/* Label */}
      {showLabel && label && (
        <span
          className={`${styles.label} ${styles[`label${labelPosition.charAt(0).toUpperCase() + labelPosition.slice(1)}`]}`}
          style={{ fontSize: sizeValues.font }}
        >
          {label}
        </span>
      )}
      
      {/* Screen reader announcement */}
      <span className={styles.srOnly} aria-live="assertive" aria-atomic="true">
        {announcement}
      </span>
    </div>
  );

  // Render with or without overlay
  if (overlay) {
    return (
      <div
        className={overlayClasses}
        style={{ backgroundColor: overlayColor }}
      >
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
});

Spinner.displayName = 'Spinner';

Spinner.propTypes = {
  variant: PropTypes.oneOf([
    'circle',
    'dots',
    'bars',
    'pulse',
    'square',
    'ripple',
    'wave',
    'bounce',
    'rotate',
    'flip',
    'custom'
  ]),
  size: PropTypes.oneOf(['tiny', 'small', 'medium', 'large', 'xlarge']),
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'light', 'dark']),
  thickness: PropTypes.number,
  speed: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.object,
  label: PropTypes.string,
  labelPosition: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  showLabel: PropTypes.bool,
  percentage: PropTypes.number,
  showPercentage: PropTypes.bool,
  overlay: PropTypes.bool,
  overlayColor: PropTypes.string,
  overlayBlur: PropTypes.bool,
  blocking: PropTypes.bool,
  centerInParent: PropTypes.bool,
  animation: PropTypes.string,
  customAnimation: PropTypes.node,
  pulseScale: PropTypes.number,
  determinate: PropTypes.bool,
  value: PropTypes.number,
  max: PropTypes.number,
  showProgress: PropTypes.bool,
  successOnComplete: PropTypes.bool,
  hideDelay: PropTypes.number,
  fadeOut: PropTypes.bool,
  onComplete: PropTypes.func,
  onAnimationEnd: PropTypes.func,
  role: PropTypes.string,
  ariaLabel: PropTypes.string,
  ariaLive: PropTypes.oneOf(['polite', 'assertive', 'off']),
  announceProgress: PropTypes.bool
};

// Export loading hook
export const useLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState);
  const [loadingText, setLoadingText] = useState('');
  const [progress, setProgress] = useState(0);

  const startLoading = (text = '') => {
    setIsLoading(true);
    setLoadingText(text);
    setProgress(0);
  };

  const stopLoading = () => {
    setIsLoading(false);
    setLoadingText('');
    setProgress(0);
  };

  const updateProgress = (value) => {
    setProgress(Math.min(Math.max(0, value), 100));
  };

  return {
    isLoading,
    loadingText,
    progress,
    startLoading,
    stopLoading,
    updateProgress
  };
};

export default Spinner;

            
