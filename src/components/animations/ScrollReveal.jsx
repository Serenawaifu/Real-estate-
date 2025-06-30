import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import styles from './ScrollReveal.module.css';

const ScrollReveal = ({
  children,
  // Animation type
  animation = 'fadeIn',
  
  // Timing
  duration = 600,
  delay = 0,
  easing = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  
  // Trigger options
  threshold = 0.1,
  rootMargin = '0px',
  triggerOnce = false,
  
  // Animation properties
  distance = '30px',
  origin = 'bottom',
  scale = 0.9,
  rotate = 0,
  opacity = 0,
  
  // Advanced options
  cascade = false,
  cascadeDelay = 100,
  cascadeDirection = 'vertical',
  
  // Parallax
  parallax = false,
  parallaxSpeed = 0.5,
  parallaxOffset = 0,
  
  // Viewport
  mobile = true,
  desktop = true,
  
  // Callbacks
  onReveal,
  beforeReveal,
  afterReveal,
  onReset,
  
  // Custom animation
  customAnimation,
  
  // Performance
  useGPU = true,
  willChange = true,
  
  // Accessibility
  reduceMotion = true,
  ariaLabel,
  
  // Styling
  className = '',
  style = {},
  containerStyle = {},
  
  // Debug
  debug = false,
  
  ...props
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [parallaxY, setParallaxY] = useState(0);
  const [childrenArray, setChildrenArray] = useState([]);
  
  const containerRef = useRef(null);
  const observerRef = useRef(null);
  const animationRef = useRef(null);
  const ticking = useRef(false);

  // Check if user prefers reduced motion
  const prefersReducedMotion = useMemo(() => {
    if (!reduceMotion) return false;
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, [reduceMotion]);

  // Check if mobile or desktop
  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 768;
  }, []);

  // Should animate based on device
  const shouldAnimate = useMemo(() => {
    if (prefersReducedMotion) return false;
    if (isMobile && !mobile) return false;
    if (!isMobile && !desktop) return false;
    return true;
  }, [prefersReducedMotion, isMobile, mobile, desktop]);

  // Convert children to array for cascade animations
  useEffect(() => {
    if (cascade && React.Children.count(children) > 1) {
      setChildrenArray(React.Children.toArray(children));
    }
  }, [children, cascade]);

  // Get initial transform based on animation type and origin
  const getInitialTransform = useCallback(() => {
    const transforms = [];
    
    if (useGPU) {
      transforms.push('translateZ(0)');
    }

    switch (animation) {
      case 'fadeIn':
        // No transform needed, just opacity
        break;
        
      case 'slideIn':
        const directions = {
          bottom: `translateY(${distance})`,
          top: `translateY(-${distance})`,
          left: `translateX(-${distance})`,
          right: `translateX(${distance})`
        };
        transforms.push(directions[origin] || directions.bottom);
        break;
        
      case 'zoomIn':
        transforms.push(`scale(${scale})`);
        break;
        
      case 'rotateIn':
        transforms.push(`rotate(${rotate}deg)`);
        break;
        
      case 'flipIn':
        const flipDirections = {
          horizontal: 'rotateY(90deg)',
          vertical: 'rotateX(90deg)'
        };
        transforms.push(flipDirections[origin] || flipDirections.horizontal);
        break;
        
      case 'bounceIn':
        transforms.push(`translateY(${distance}) scale(${scale})`);
        break;
        
      case 'custom':
        if (customAnimation?.initial?.transform) {
          transforms.push(customAnimation.initial.transform);
        }
        break;
        
      default:
        break;
    }

    return transforms.join(' ');
  }, [animation, distance, origin, scale, rotate, useGPU, customAnimation]);

  // Get final transform
  const getFinalTransform = useCallback(() => {
    const transforms = [];
    
    if (useGPU) {
      transforms.push('translateZ(0)');
    }

    if (parallax && parallaxY !== 0) {
      transforms.push(`translateY(${parallaxY}px)`);
    }

    switch (animation) {
      case 'custom':
        if (customAnimation?.final?.transform) {
          transforms.push(customAnimation.final.transform);
        }
        break;
      default:
        if (transforms.length === 0) {
          transforms.push('none');
        }
        break;
    }

    return transforms.join(' ');
  }, [animation, parallax, parallaxY, useGPU, customAnimation]);

  // Handle parallax scrolling
  const handleParallaxScroll = useCallback(() => {
    if (!parallax || !containerRef.current || !isInView) return;

    const updateParallax = () => {
      const rect = containerRef.current.getBoundingClientRect();
      const speed = parallaxSpeed;
      const yPos = -(rect.top * speed) + parallaxOffset;
      setParallaxY(yPos);
      ticking.current = false;
    };

    if (!ticking.current) {
      window.requestAnimationFrame(updateParallax);
      ticking.current = true;
    }
  }, [parallax, parallaxSpeed, parallaxOffset, isInView]);

  // Setup Intersection Observer
  useEffect(() => {
    if (!shouldAnimate || typeof window === 'undefined') {
      setIsRevealed(true);
      return;
    }

    const observerOptions = {
      threshold: Array.isArray(threshold) ? threshold : [threshold],
      rootMargin
    };

    const handleIntersection = (entries) => {
      entries.forEach(entry => {
        const wasInView = isInView;
        const nowInView = entry.isIntersecting;

        setIsInView(nowInView);

        if (nowInView && !wasInView) {
          // Entering viewport
          if (!isRevealed || !triggerOnce) {
            if (beforeReveal) beforeReveal();
            
            // Add delay if specified
            const revealTimeout = setTimeout(() => {
              setIsRevealed(true);
              if (onReveal) onReveal();
              
              // After reveal callback
              const afterTimeout = setTimeout(() => {
                if (afterReveal) afterReveal();
              }, duration);
              
              return () => clearTimeout(afterTimeout);
            }, delay);
            
            return () => clearTimeout(revealTimeout);
          }
        } else if (!nowInView && wasInView && !triggerOnce) {
          // Leaving viewport
          setIsRevealed(false);
          if (onReset) onReset();
        }
      });
    };

    observerRef.current = new IntersectionObserver(handleIntersection, observerOptions);

    if (containerRef.current) {
      observerRef.current.observe(containerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [
    shouldAnimate,
    threshold,
    rootMargin,
    triggerOnce,
    isRevealed,
    delay,
    duration,
    onReveal,
    beforeReveal,
    afterReveal,
    onReset
  ]);

  // Setup parallax scroll listener
  useEffect(() => {
    if (!parallax || !isInView) return;

    window.addEventListener('scroll', handleParallaxScroll, { passive: true });
    window.addEventListener('resize', handleParallaxScroll);

    // Initial calculation
    handleParallaxScroll();

    return () => {
      window.removeEventListener('scroll', handleParallaxScroll);
      window.removeEventListener('resize', handleParallaxScroll);
    };
  }, [parallax, isInView, handleParallaxScroll]);

  // Build animation styles
  const getAnimationStyles = useCallback((index = 0) => {
    const styles = {
      opacity: isRevealed ? 1 : opacity,
      transform: isRevealed ? getFinalTransform() : getInitialTransform(),
      transition: `
        opacity ${duration}ms ${easing},
        transform ${duration}ms ${easing}
      `,
      transitionDelay: cascade ? `${delay + (index * cascadeDelay)}ms` : `${delay}ms`
    };

    if (willChange && !isRevealed) {
      styles.willChange = 'opacity, transform';
    }

    // Apply custom animation styles
    if (animation === 'custom' && customAnimation) {
      if (!isRevealed && customAnimation.initial) {
        Object.assign(styles, customAnimation.initial);
      } else if (isRevealed && customAnimation.final) {
        Object.assign(styles, customAnimation.final);
      }
    }

    return styles;
  }, [
    isRevealed,
    opacity,
    duration,
    delay,
    easing,
    cascade,
    cascadeDelay,
    willChange,
    animation,
    customAnimation,
    getFinalTransform,
    getInitialTransform
  ]);

  // Render cascade animation
  const renderCascade = () => {
    if (!childrenArray.length) return null;

    return (
      <div 
        className={`${styles.cascadeContainer} ${styles[cascadeDirection]}`}
        style={containerStyle}
      >
        {childrenArray.map((child, index) => (
          <div
            key={index}
            className={styles.cascadeItem}
            style={getAnimationStyles(index)}
          >
            {child}
          </div>
        ))}
      </div>
    );
  };

  // Debug mode
  useEffect(() => {
    if (debug && process.env.NODE_ENV === 'development') {
      console.log('ScrollReveal Debug:', {
        animation,
        isRevealed,
        isInView,
        shouldAnimate,
        threshold,
        styles: getAnimationStyles()
      });
    }
  }, [debug, animation, isRevealed, isInView, shouldAnimate, threshold, getAnimationStyles]);

  // Build container classes
  const containerClasses = [
    styles.scrollReveal,
    isRevealed && styles.revealed,
    !shouldAnimate && styles.noAnimation,
    debug && styles.debug,
    className
  ].filter(Boolean).join(' ');

  // If reduced motion or animation disabled, render children directly
  if (!shouldAnimate) {
    return <div className={className} style={style}>{children}</div>;
  }

  return (
    <div
      ref={containerRef}
      className={containerClasses}
      style={{
        ...containerStyle,
        ...style
      }}
      aria-label={ariaLabel}
      {...props}
    >
      {cascade && childrenArray.length > 1 ? (
        renderCascade()
      ) : (
        <div
          className={styles.content}
          style={getAnimationStyles()}
        >
          {children}
        </div>
      )}
      
      {debug && (
        <div className={styles.debugInfo}>
          <span>Animation: {animation}</span>
          <span>In View: {isInView ? 'Yes' : 'No'}</span>
          <span>Revealed: {isRevealed ? 'Yes' : 'No'}</span>
        </div>
      )}
    </div>
  );
};

ScrollReveal.propTypes = {
  children: PropTypes.node.isRequired,
  animation: PropTypes.oneOf([
    'fadeIn',
    'slideIn',
    'zoomIn',
    'rotateIn',
    'flipIn',
    'bounceIn',
    'custom'
  ]),
  duration: PropTypes.number,
  delay: PropTypes.number,
  easing: PropTypes.string,
  threshold: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),
  rootMargin: PropTypes.string,
  triggerOnce: PropTypes.bool,
  distance: PropTypes.string,
  origin: PropTypes.oneOf(['top', 'right', 'bottom', 'left', 'horizontal', 'vertical']),
  scale: PropTypes.number,
  rotate: PropTypes.number,
  opacity: PropTypes.number,
  cascade: PropTypes.bool,
  cascadeDelay: PropTypes.number,
  cascadeDirection: PropTypes.oneOf(['vertical', 'horizontal']),
  parallax: PropTypes.bool,
  parallaxSpeed: PropTypes.number,
  parallaxOffset: PropTypes.number,
  mobile: PropTypes.bool,
  desktop: PropTypes.bool,
  onReveal: PropTypes.func,
  beforeReveal: PropTypes.func,
  afterReveal: PropTypes.func,
  onReset: PropTypes.func,
  customAnimation: PropTypes.shape({
    initial: PropTypes.object,
    final: PropTypes.object
  }),
  useGPU: PropTypes.bool,
  willChange: PropTypes.bool,
  reduceMotion: PropTypes.bool,
  ariaLabel: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  containerStyle: PropTypes.object,
  debug: PropTypes.bool
};

// Export animation presets
export const animationPresets = {
  fadeInUp: {
    animation: 'slideIn',
    origin: 'bottom',
    distance: '30px',
    duration: 600
  },
  fadeInDown: {
    animation: 'slideIn',
    origin: 'top',
    distance: '30px',
    duration: 600
  },
  fadeInLeft: {
    animation: 'slideIn',
    origin: 'right',
    distance: '30px',
    duration: 600
  },
  fadeInRight: {
    animation: 'slideIn',
    origin: 'left',
    distance: '30px',
    duration: 600
  },
  zoomInUp: {
    animation: 'bounceIn',
    origin: 'bottom',
    distance: '20px',
    scale: 0.9,
    duration: 500
  },
  rotateInLeft: {
    animation: 'rotateIn',
    rotate: -45,
    origin: 'left',
    duration: 700
  },
  flipInX: {
    animation: 'flipIn',
    origin: 'horizontal',
    duration: 800
  },
  flipInY: {
    animation: 'flipIn',
    origin: 'vertical',
    duration: 800
  }
};

// Export hook for programmatic control
export const useScrollReveal = (options = {}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const elementRef = useRef(null);
  
  const reveal = useCallback(() => {
    setIsRevealed(true);
  }, []);
  
  const reset = useCallback(() => {
    setIsRevealed(false);
  }, []);
  
  return {
    ref: elementRef,
    isRevealed,
    reveal,
    reset
  };
};

export default ScrollReveal;

        
