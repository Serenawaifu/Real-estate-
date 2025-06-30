import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import styles from './AnimatedCounter.module.css';

const AnimatedCounter = ({
  // Values
  start = 0,
  end,
  value,
  decimals = 0,
  duration = 2000,
  delay = 0,
  
  // Formatting
  prefix = '',
  suffix = '',
  separator = ',',
  decimal = '.',
  currency = null,
  currencyPosition = 'prefix',
  
  // Animation
  easing = 'easeOutCubic',
  customEasing,
  animateOnMount = true,
  animateOnInView = true,
  animateOnUpdate = true,
  threshold = 0.5,
  rootMargin = '0px',
  
  // Style variants
  variant = 'default',
  size = 'medium',
  bold = false,
  italic = false,
  underline = false,
  
  // Features
  countUp = true,
  loop = false,
  loopDelay = 1000,
  preserveValue = false,
  enableTrail = false,
  trailDuration = 500,
  
  // Number morphing
  morphNumbers = false,
  morphDuration = 300,
  
  // Visual effects
  glowOnComplete = false,
  pulseOnComplete = false,
  shakeOnComplete = false,
  bounceOnComplete = false,
  
  // Callbacks
  onStart,
  onUpdate,
  onComplete,
  onReset,
  
  // Accessibility
  ariaLabel,
  announceChanges = true,
  reduceMotion = true,
  
  // Styling
  className = '',
  style = {},
  digitClassName = '',
  digitStyle = {},
  
  // Debug
  debug = false,
  
  ...props
}) => {
  // Determine target value
  const targetValue = value !== undefined ? value : end;
  
  // State management
  const [displayValue, setDisplayValue] = useState(preserveValue ? targetValue : start);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [trailValues, setTrailValues] = useState([]);
  
  // Refs
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const observerRef = useRef(null);
  const startTimeRef = useRef(null);
  const previousValueRef = useRef(start);
  const loopTimeoutRef = useRef(null);

  // Check if user prefers reduced motion
  const prefersReducedMotion = useMemo(() => {
    if (!reduceMotion) return false;
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, [reduceMotion]);

  // Easing functions
  const easingFunctions = {
    linear: t => t,
    easeInQuad: t => t * t,
    easeOutQuad: t => t * (2 - t),
    easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeInCubic: t => t * t * t,
    easeOutCubic: t => (--t) * t * t + 1,
    easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    easeInQuart: t => t * t * t * t,
    easeOutQuart: t => 1 - (--t) * t * t * t,
    easeInOutQuart: t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
    easeInExpo: t => t === 0 ? 0 : Math.pow(2, 10 * (t - 1)),
    easeOutExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
    easeInOutExpo: t => {
      if (t === 0 || t === 1) return t;
      if (t < 0.5) return Math.pow(2, 10 * (t * 2 - 1)) / 2;
      return (2 - Math.pow(2, -10 * (t * 2 - 1))) / 2;
    },
    easeInBack: t => {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return c3 * t * t * t - c1 * t * t;
    },
    easeOutBack: t => {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    },
    easeInOutBack: t => {
      const c1 = 1.70158;
      const c2 = c1 * 1.525;
      return t < 0.5
        ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
        : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
    },
    easeInElastic: t => {
      const c4 = (2 * Math.PI) / 3;
      return t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
    },
    easeOutElastic: t => {
      const c4 = (2 * Math.PI) / 3;
      return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    },
    easeInOutElastic: t => {
      const c5 = (2 * Math.PI) / 4.5;
      return t === 0 ? 0 : t === 1 ? 1 : t < 0.5
        ? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c5)) / 2
        : (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c5)) / 2 + 1;
    },
    easeInBounce: t => 1 - easingFunctions.easeOutBounce(1 - t),
    easeOutBounce: t => {
      const n1 = 7.5625;
      const d1 = 2.75;
      if (t < 1 / d1) {
        return n1 * t * t;
      } else if (t < 2 / d1) {
        return n1 * (t -= 1.5 / d1) * t + 0.75;
      } else if (t < 2.5 / d1) {
        return n1 * (t -= 2.25 / d1) * t + 0.9375;
      } else {
        return n1 * (t -= 2.625 / d1) * t + 0.984375;
      }
    },
    easeInOutBounce: t => t < 0.5
      ? (1 - easingFunctions.easeOutBounce(1 - 2 * t)) / 2
      : (1 + easingFunctions.easeOutBounce(2 * t - 1)) / 2
  };

  // Get easing function
  const getEasingFunction = useCallback(() => {
    if (customEasing) return customEasing;
    return easingFunctions[easing] || easingFunctions.easeOutCubic;
  }, [easing, customEasing]);

  // Format number with separators
  const formatNumber = useCallback((num) => {
    // Round to specified decimals
    const rounded = parseFloat(num.toFixed(decimals));
    
    // Split into integer and decimal parts
    const [integerPart, decimalPart] = rounded.toString().split('.');
    
    // Add thousand separators
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    
    // Combine with decimal part
    const formattedNumber = decimalPart 
      ? `${formattedInteger}${decimal}${decimalPart.padEnd(decimals, '0')}`
      : decimals > 0 
        ? `${formattedInteger}${decimal}${'0'.repeat(decimals)}`
        : formattedInteger;
    
    return formattedNumber;
  }, [decimals, separator, decimal]);

  // Format currency
  const formatCurrency = useCallback((num) => {
    if (!currency) return formatNumber(num);
    
    const locale = currency === 'USD' ? 'en-US' : 
                  currency === 'EUR' ? 'de-DE' :
                  currency === 'GBP' ? 'en-GB' :
                  currency === 'JPY' ? 'ja-JP' :
                  currency === 'INR' ? 'en-IN' : 'en-US';
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  }, [currency, decimals, formatNumber]);

  // Get formatted display value
  const getFormattedValue = useCallback((num) => {
    const formatted = currency ? formatCurrency(num) : formatNumber(num);
    
    if (currency && currencyPosition === 'prefix') {
      return formatted;
    } else if (currency && currencyPosition === 'suffix') {
      // Move currency symbol to suffix
      const symbol = formatted.match(/[^\d.,\s-]/)?.[0] || '';
      const number = formatted.replace(/[^\d.,\s-]/g, '').trim();
      return `${number}${symbol}`;
    }
    
    return `${prefix}${formatted}${suffix}`;
  }, [currency, currencyPosition, prefix, suffix, formatCurrency, formatNumber]);

  // Animate counter
  const animate = useCallback(() => {
    if (prefersReducedMotion) {
      setDisplayValue(targetValue);
      setIsComplete(true);
      if (onComplete) onComplete(targetValue);
      return;
    }

    const startValue = previousValueRef.current;
    const endValue = targetValue;
    const diff = endValue - startValue;
    
    if (diff === 0) {
      setIsComplete(true);
      return;
    }

    setIsAnimating(true);
    setIsComplete(false);
    
    if (onStart) onStart(startValue, endValue);
    
    startTimeRef.current = null;
    
    const animateFrame = (timestamp) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp + delay;
      }
      
      const elapsed = timestamp - startTimeRef.current;
      
      if (elapsed < 0) {
        animationRef.current = requestAnimationFrame(animateFrame);
        return;
      }
      
      const progress = Math.min(elapsed / duration, 1);
      const easingFunction = getEasingFunction();
      const easedProgress = countUp ? easingFunction(progress) : 1 - easingFunction(1 - progress);
      
      const currentValue = startValue + (diff * easedProgress);
      setDisplayValue(currentValue);
      
      // Update trail values
      if (enableTrail && elapsed % (trailDuration / 10) === 0) {
        setTrailValues(prev => [...prev.slice(-4), currentValue]);
      }
      
      if (onUpdate) onUpdate(currentValue, progress);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animateFrame);
      } else {
        setDisplayValue(endValue);
        setIsAnimating(false);
        setIsComplete(true);
        setHasAnimated(true);
        previousValueRef.current = endValue;
        
        if (onComplete) onComplete(endValue);
        
        // Handle loop
        if (loop) {
          loopTimeoutRef.current = setTimeout(() => {
            previousValueRef.current = start;
            animate();
          }, loopDelay);
        }
      }
    };
    
    animationRef.current = requestAnimationFrame(animateFrame);
  }, [
    targetValue,
    duration,
    delay,
    countUp,
    loop,
    loopDelay,
    enableTrail,
    trailDuration,
    prefersReducedMotion,
    getEasingFunction,
    onStart,
    onUpdate,
    onComplete
  ]);

  // Reset animation
  const reset = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (loopTimeoutRef.current) {
      clearTimeout(loopTimeoutRef.current);
    }
    
    setDisplayValue(start);
    setIsAnimating(false);
    setIsComplete(false);
    setHasAnimated(false);
    setTrailValues([]);
    previousValueRef.current = start;
    
    if (onReset) onReset();
  }, [start, onReset]);

  // Setup intersection observer
  useEffect(() => {
    if (!animateOnInView || typeof window === 'undefined') {
      setIsInView(true);
      return;
    }

    const observerOptions = {
      threshold,
      rootMargin
    };

    observerRef.current = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, observerOptions);

    if (containerRef.current) {
      observerRef.current.observe(containerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [animateOnInView, threshold, rootMargin]);

  // Handle animation triggers
  useEffect(() => {
    // Clean up previous animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // Determine if should animate
    const shouldAnimate = 
      (animateOnMount && !hasAnimated) ||
      (animateOnInView && isInView && !hasAnimated) ||
      (animateOnUpdate && previousValueRef.current !== targetValue);

    if (shouldAnimate && (!animateOnInView || isInView)) {
      animate();
    }
  }, [
    targetValue,
    isInView,
    hasAnimated,
    animateOnMount,
    animateOnInView,
    animateOnUpdate,
    animate
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (loopTimeoutRef.current) {
        clearTimeout(loopTimeoutRef.current);
      }
    };
  }, []);

  // Split number into digits for morphing animation
  const renderMorphingDigits = useCallback(() => {
    const formattedValue = getFormattedValue(displayValue);
    const digits = formattedValue.split('');
    
    return digits.map((digit, index) => {
      const isDigit = /\d/.test(digit);
      const digitKey = `${index}-${digit}`;
      
      return (
        <span
          key={digitKey}
          className={`${styles.morphDigit} ${isDigit ? styles.number : styles.symbol} ${digitClassName}`}
          style={{
            ...digitStyle,
            animationDelay: `${index * 30}ms`,
            animationDuration: `${morphDuration}ms`
          }}
        >
          {digit}
        </span>
      );
    });
  }, [displayValue, getFormattedValue, digitClassName, digitStyle, morphDuration]);

  // Render trail effect
  const renderTrail = useCallback(() => {
    if (!enableTrail || trailValues.length === 0) return null;
    
    return trailValues.map((value, index) => (
      <span
        key={index}
        className={styles.trailValue}
        style={{
          opacity: (index + 1) / trailValues.length * 0.3,
          transform: `translateY(${(index - trailValues.length) * 5}px)`
        }}
      >
        {getFormattedValue(value)}
      </span>
    ));
  }, [enableTrail, trailValues, getFormattedValue]);

  // Build class names
  const containerClasses = [
    styles.animatedCounter,
    styles[variant],
    styles[size],
    bold && styles.bold,
    italic && styles.italic,
    underline && styles.underline,
    isAnimating && styles.animating,
    isComplete && styles.complete,
    glowOnComplete && isComplete && styles.glow,
    pulseOnComplete && isComplete && styles.pulse,
    shakeOnComplete && isComplete && styles.shake,
    bounceOnComplete && isComplete && styles.bounce,
    morphNumbers && styles.morphing,
    debug && styles.debug,
    className
  ].filter(Boolean).join(' ');

  // Accessibility announcement
  const announcement = useMemo(() => {
    if (!announceChanges) return null;
    return `${ariaLabel || 'Counter value'}: ${getFormattedValue(displayValue)}`;
  }, [announceChanges, ariaLabel, displayValue, getFormattedValue]);

  return (
    <span
      ref={containerRef}
      className={containerClasses}
      style={style}
      role="status"
      aria-live={announceChanges ? "polite" : "off"}
      aria-label={announcement}
      {...props}
    >
      {/* Trail effect */}
      {enableTrail && (
        <span className={styles.trailContainer}>
          {renderTrail()}
        </span>
      )}
      
      {/* Main counter */}
      <span className={styles.counterValue}>
        {morphNumbers ? renderMorphingDigits() : getFormattedValue(displayValue)}
      </span>
      
      {/* Debug info */}
      {debug && (
        <span className={styles.debugInfo}>
          <span>Target: {targetValue}</span>
          <span>Current: {displayValue.toFixed(2)}</span>
          <span>Animating: {isAnimating ? 'Yes' : 'No'}</span>
          <span>Complete: {isComplete ? 'Yes' : 'No'}</span>
        </span>
      )}
      
      {/* Screen reader announcement */}
      <span className={styles.srOnly} aria-live="assertive">
        {announcement}
      </span>
    </span>
  );
};

AnimatedCounter.propTypes = {
  start: PropTypes.number,
  end: PropTypes.number,
  value: PropTypes.number,
  decimals: PropTypes.number,
  duration: PropTypes.number,
  delay: PropTypes.number,
  prefix: PropTypes.string,
  suffix: PropTypes.string,
  separator: PropTypes.string,
  decimal: PropTypes.string,
  currency: PropTypes.string,
  currencyPosition: PropTypes.oneOf(['prefix', 'suffix']),
  easing: PropTypes.oneOf([
    'linear',
    'easeInQuad',
    'easeOutQuad',
    'easeInOutQuad',
    'easeInCubic',
    'easeOutCubic',
    'easeInOutCubic',
    'easeInQuart',
    'easeOutQuart',
    'easeInOutQuart',
    'easeInExpo',
    'easeOutExpo',
    'easeInOutExpo',
    'easeInBack',
    'easeOutBack',
    'easeInOutBack',
    'easeInElastic',
    'easeOutElastic',
    'easeInOutElastic',
    'easeInBounce',
    'easeOutBounce',
    'easeInOutBounce'
  ]),
  customEasing: PropTypes.func,
  animateOnMount: PropTypes.bool,
  animateOnInView: PropTypes.bool,
  animateOnUpdate: PropTypes.bool,
  threshold: PropTypes.number,
  rootMargin: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'highlight', 'gradient', 'outline', 'shadow']),
  size: PropTypes.oneOf(['tiny', 'small', 'medium', 'large', 'xlarge']),
  bold: PropTypes.bool,
  italic: PropTypes.bool,
  underline: PropTypes.bool,
  countUp: PropTypes.bool,
  loop: PropTypes.bool,
  loopDelay: PropTypes.number,
  preserveValue: PropTypes.bool,
  enableTrail: PropTypes.bool,
  trailDuration: PropTypes.number,
  morphNumbers: PropTypes.bool,
  morphDuration: PropTypes.number,
  glowOnComplete: PropTypes.bool,
  pulseOnComplete: PropTypes.bool,
  shakeOnComplete: PropTypes.bool,
  bounceOnComplete: PropTypes.bool,
  onStart: PropTypes.func,
  onUpdate: PropTypes.func,
  onComplete: PropTypes.func,
  onReset: PropTypes.func,
  ariaLabel: PropTypes.string,
  announceChanges: PropTypes.bool,
  reduceMotion: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  digitClassName: PropTypes.string,
  digitStyle: PropTypes.object,
  debug: PropTypes.bool
};

// Export animation presets
export const counterPresets = {
  stats: {
    duration: 2500,
    easing: 'easeOutQuart',
    decimals: 0,
    variant: 'highlight',
    size: 'large',
    bold: true
  },
  price: {
    currency: 'INR',
    decimals: 2,
    duration: 1500,
    easing: 'easeOutCubic',
    variant: 'gradient'
  },
  percentage: {
    suffix: '%',
    decimals: 1,
    duration: 2000,
    easing: 'easeInOutQuad',
    glowOnComplete: true
  },
  counting: {
    duration: 3000,
    easing: 'linear',
    morphNumbers: true,
    enableTrail: true
  }
};

// Export utility hook
export const useAnimatedCounter = (endValue, options = {}) => {
  const [value, setValue] = useState(options.start || 0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const animate = useCallback(() => {
    // Animation logic here
  }, []);
  
  const reset = useCallback(() => {
    setValue(options.start || 0);
    setIsAnimating(false);
  }, [options.start]);
  
  return {
    value,
    isAnimating,
    animate,
    reset
  };
};

export default AnimatedCounter;

    
