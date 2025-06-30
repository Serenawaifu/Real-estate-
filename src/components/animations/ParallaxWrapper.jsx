import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import styles from './ParallaxWrapper.module.css';

const ParallaxWrapper = ({
  children,
  // Parallax configuration
  speed = 0.5,
  offset = 0,
  scale = false,
  scaleMin = 0.8,
  scaleMax = 1,
  rotate = false,
  rotateMin = -10,
  rotateMax = 10,
  opacity = false,
  opacityMin = 0,
  opacityMax = 1,
  blur = false,
  blurMin = 0,
  blurMax = 5,
  
  // Direction
  direction = 'vertical',
  reverse = false,
  
  // Boundaries
  startScroll = 0,
  endScroll = 0,
  startOffset = 0,
  endOffset = 0,
  
  // Layer configuration
  layers = [],
  
  // Performance
  throttle = 0,
  useGPU = true,
  willChange = true,
  
  // Behavior
  disabled = false,
  mobile = true,
  desktop = true,
  
  // Easing
  easing = 'linear',
  customEasing,
  
  // Debug
  debug = false,
  showBoundaries = false,
  
  // Callbacks
  onScroll,
  onProgress,
  onEnter,
  onLeave,
  onTop,
  onBottom,
  
  // Styling
  className = '',
  style = {},
  containerStyle = {},
  
  // Accessibility
  reduceMotion = true,
  ariaLabel,
  
  ...props
}) => {
  const [state, setState] = useState({
    scrollY: 0,
    progress: 0,
    isInView: false,
    transforms: {},
    layerTransforms: []
  });
  
  const containerRef = useRef(null);
  const ticking = useRef(false);
  const lastScrollY = useRef(0);
  const observerRef = useRef(null);
  const frameId = useRef(null);
  const throttleTimer = useRef(null);

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

  // Should animate based on settings
  const shouldAnimate = useMemo(() => {
    if (disabled || prefersReducedMotion) return false;
    if (isMobile && !mobile) return false;
    if (!isMobile && !desktop) return false;
    return true;
  }, [disabled, prefersReducedMotion, isMobile, mobile, desktop]);

  // Easing functions
  const easingFunctions = {
    linear: t => t,
    easeIn: t => t * t,
    easeOut: t => t * (2 - t),
    easeInOut: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
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
    }
  };

  // Get easing function
  const getEasingFunction = useCallback(() => {
    if (customEasing) return customEasing;
    return easingFunctions[easing] || easingFunctions.linear;
  }, [easing, customEasing]);

  // Calculate element position and progress
  const calculateProgress = useCallback(() => {
    if (!containerRef.current) return null;

    const rect = containerRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const elementTop = rect.top;
    const elementHeight = rect.height;
    const elementCenter = elementTop + elementHeight / 2;
    const windowCenter = windowHeight / 2;
    
    // Calculate effective scroll boundaries
    const effectiveStartScroll = startScroll || windowHeight;
    const effectiveEndScroll = endScroll || -elementHeight;
    
    // Calculate progress (0-1)
    let progress;
    if (direction === 'vertical') {
      const totalDistance = effectiveStartScroll - effectiveEndScroll;
      const currentDistance = effectiveStartScroll - elementTop;
      progress = currentDistance / totalDistance;
    } else {
      // Horizontal parallax based on element's horizontal position
      const elementLeft = rect.left;
      const windowWidth = window.innerWidth;
      const totalDistance = windowWidth + elementHeight;
      const currentDistance = windowWidth - elementLeft;
      progress = currentDistance / totalDistance;
    }

    // Clamp progress between 0 and 1
    progress = Math.max(0, Math.min(1, progress));
    
    // Apply easing
    const easingFunction = getEasingFunction();
    progress = easingFunction(progress);

    return {
      progress,
      elementTop,
      elementHeight,
      elementCenter,
      windowCenter,
      isInView: elementTop < windowHeight && elementTop + elementHeight > 0
    };
  }, [direction, startScroll, endScroll, getEasingFunction]);

  // Calculate parallax transforms
  const calculateTransforms = useCallback((progress) => {
    const transforms = {};
    const transformStrings = [];
    const filters = [];

    // GPU acceleration
    if (useGPU) {
      transformStrings.push('translateZ(0)');
    }

    // Calculate parallax offset
    const parallaxOffset = (progress - 0.5) * speed * 100;
    const finalOffset = reverse ? -parallaxOffset : parallaxOffset;

    // Translation
    if (direction === 'vertical') {
      transformStrings.push(`translateY(${finalOffset + offset}px)`);
    } else if (direction === 'horizontal') {
      transformStrings.push(`translateX(${finalOffset + offset}px)`);
    } else if (direction === 'diagonal') {
      transformStrings.push(`translate(${finalOffset + offset}px, ${finalOffset + offset}px)`);
    }

    // Scale
    if (scale) {
      const scaleValue = scaleMin + (scaleMax - scaleMin) * progress;
      transformStrings.push(`scale(${scaleValue})`);
      transforms.scale = scaleValue;
    }

    // Rotation
    if (rotate) {
      const rotateValue = rotateMin + (rotateMax - rotateMin) * progress;
      transformStrings.push(`rotate(${rotateValue}deg)`);
      transforms.rotate = rotateValue;
    }

    // Opacity
    if (opacity) {
      const opacityValue = opacityMin + (opacityMax - opacityMin) * progress;
      transforms.opacity = opacityValue;
    }

    // Blur
    if (blur) {
      const blurValue = blurMin + (blurMax - blurMin) * (1 - progress);
      filters.push(`blur(${blurValue}px)`);
      transforms.blur = blurValue;
    }

    transforms.transform = transformStrings.join(' ');
    transforms.filter = filters.length > 0 ? filters.join(' ') : 'none';

    return transforms;
  }, [
    speed,
    offset,
    direction,
    reverse,
    scale,
    scaleMin,
    scaleMax,
    rotate,
    rotateMin,
    rotateMax,
    opacity,
    opacityMin,
    opacityMax,
    blur,
    blurMin,
    blurMax,
    useGPU
  ]);

  // Calculate layer transforms
  const calculateLayerTransforms = useCallback((progress) => {
    return layers.map((layer, index) => {
      const layerSpeed = layer.speed || (index + 1) * 0.2;
      const layerProgress = Math.max(0, Math.min(1, progress));
      const layerOffset = (layerProgress - 0.5) * layerSpeed * 100;
      
      const transforms = {
        transform: `translateY(${reverse ? -layerOffset : layerOffset}px)`,
        opacity: layer.opacity ? layer.opacityMin + (layer.opacityMax - layer.opacityMin) * layerProgress : 1
      };

      if (layer.blur) {
        transforms.filter = `blur(${layer.blurMin + (layer.blurMax - layer.blurMin) * (1 - layerProgress)}px)`;
      }

      return transforms;
    });
  }, [layers, reverse]);

  // Update parallax effect
  const updateParallax = useCallback(() => {
    if (!shouldAnimate || !containerRef.current) {
      ticking.current = false;
      return;
    }

    const scrollData = calculateProgress();
    if (!scrollData) {
      ticking.current = false;
      return;
    }

    const { progress, isInView } = scrollData;
    const wasInView = state.isInView;

    // Calculate transforms
    const transforms = calculateTransforms(progress);
    const layerTransforms = layers.length > 0 ? calculateLayerTransforms(progress) : [];

    // Update state
    setState(prevState => ({
      ...prevState,
      scrollY: window.scrollY,
      progress,
      isInView,
      transforms,
      layerTransforms
    }));

    // Trigger callbacks
    if (onScroll) onScroll({ progress, transforms });
    if (onProgress) onProgress(progress);

    // View state callbacks
    if (isInView && !wasInView && onEnter) onEnter();
    if (!isInView && wasInView && onLeave) onLeave();

    // Position callbacks
    if (progress === 0 && onTop) onTop();
    if (progress === 1 && onBottom) onBottom();

    ticking.current = false;
  }, [
    shouldAnimate,
    calculateProgress,
    calculateTransforms,
    calculateLayerTransforms,
    layers,
    state.isInView,
    onScroll,
    onProgress,
    onEnter,
    onLeave,
    onTop,
    onBottom
  ]);

  // Throttled scroll handler
  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      if (throttle > 0) {
        if (throttleTimer.current) {
          clearTimeout(throttleTimer.current);
        }
        throttleTimer.current = setTimeout(() => {
          frameId.current = window.requestAnimationFrame(updateParallax);
        }, throttle);
      } else {
        frameId.current = window.requestAnimationFrame(updateParallax);
      }
      ticking.current = true;
    }
  }, [updateParallax, throttle]);

  // Setup scroll listener
  useEffect(() => {
    if (!shouldAnimate) return;

    // Initial calculation
    updateParallax();

    // Add event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (frameId.current) {
        window.cancelAnimationFrame(frameId.current);
      }
      if (throttleTimer.current) {
        clearTimeout(throttleTimer.current);
      }
    };
  }, [shouldAnimate, handleScroll, updateParallax]);

  // Setup intersection observer for performance
  useEffect(() => {
    if (!shouldAnimate) return;

    const observerOptions = {
      rootMargin: '50% 0px'
    };

    observerRef.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        window.addEventListener('scroll', handleScroll, { passive: true });
      } else {
        window.removeEventListener('scroll', handleScroll);
      }
    }, observerOptions);

    if (containerRef.current) {
      observerRef.current.observe(containerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [shouldAnimate, handleScroll]);

  // Build styles
  const getContainerStyle = useCallback(() => {
    const styles = { ...containerStyle };

    if (shouldAnimate) {
      Object.assign(styles, state.transforms);
      
      if (willChange) {
        const willChangeProps = ['transform'];
        if (opacity) willChangeProps.push('opacity');
        if (blur) willChangeProps.push('filter');
        styles.willChange = willChangeProps.join(', ');
      }
    }

    return styles;
  }, [shouldAnimate, state.transforms, containerStyle, willChange, opacity, blur]);

  // Build class names
  const containerClasses = [
    styles.parallaxWrapper,
    state.isInView && styles.inView,
    !shouldAnimate && styles.disabled,
    debug && styles.debug,
    className
  ].filter(Boolean).join(' ');

  // Render layers
  const renderLayers = () => {
    if (!layers.length) return null;

    return layers.map((layer, index) => (
      <div
        key={index}
        className={`${styles.parallaxLayer} ${layer.className || ''}`}
        style={{
          ...layer.style,
          ...(state.layerTransforms[index] || {}),
          zIndex: layer.zIndex || index
        }}
      >
        {layer.children || layer.content}
      </div>
    ));
  };

  return (
    <div
      ref={containerRef}
      className={containerClasses}
      style={getContainerStyle()}
      aria-label={ariaLabel}
      {...props}
    >
      {/* Background layers */}
      {layers.length > 0 && (
        <div className={styles.layersContainer}>
          {renderLayers()}
        </div>
      )}

      {/* Main content */}
      <div 
        className={styles.content}
        style={style}
      >
        {children}
      </div>

      {/* Debug overlay */}
      {debug && (
        <div className={styles.debugOverlay}>
          <div className={styles.debugInfo}>
            <span>Progress: {(state.progress * 100).toFixed(1)}%</span>
            <span>In View: {state.isInView ? 'Yes' : 'No'}</span>
            <span>Transform: Y({state.transforms.transform?.match(/translateY\((.*?)px\)/)?.[1] || 0}px)</span>
            {scale && <span>Scale: {state.transforms.scale?.toFixed(2) || 1}</span>}
            {rotate && <span>Rotate: {state.transforms.rotate?.toFixed(1) || 0}°</span>}
            {opacity && <span>Opacity: {state.transforms.opacity?.toFixed(2) || 1}</span>}
            {blur && <span>Blur: {state.transforms.blur?.toFixed(1) || 0}px</span>}
          </div>
        </div>
      )}

      {/* Boundaries visualization */}
      {showBoundaries && (
        <>
          <div className={styles.boundaryTop} />
          <div className={styles.boundaryBottom} />
        </>
      )}
    </div>
  );
};

ParallaxWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  speed: PropTypes.number,
  offset: PropTypes.number,
  scale: PropTypes.bool,
  scaleMin: PropTypes.number,
  scaleMax: PropTypes.number,
  rotate: PropTypes.bool,
  rotateMin: PropTypes.number,
  rotateMax: PropTypes.number,
  opacity: PropTypes.bool,
  opacityMin: PropTypes.number,
  opacityMax: PropTypes.number,
  blur: PropTypes.bool,
  blurMin: PropTypes.number,
  blurMax: PropTypes.number,
  direction: PropTypes.oneOf(['vertical', 'horizontal', 'diagonal']),
  reverse: PropTypes.bool,
  startScroll: PropTypes.number,
  endScroll: PropTypes.number,
  startOffset: PropTypes.number,
  endOffset: PropTypes.number,
  layers: PropTypes.arrayOf(PropTypes.shape({
    children: PropTypes.node,
    content: PropTypes.node,
    speed: PropTypes.number,
    opacity: PropTypes.bool,
    opacityMin: PropTypes.number,
    opacityMax: PropTypes.number,
    blur: PropTypes.bool,
    blurMin: PropTypes.number,
    blurMax: PropTypes.number,
    className: PropTypes.string,
    style: PropTypes.object,
    zIndex: PropTypes.number
  })),
  throttle: PropTypes.number,
  useGPU: PropTypes.bool,
  willChange: PropTypes.bool,
  disabled: PropTypes.bool,
  mobile: PropTypes.bool,
  desktop: PropTypes.bool,
  easing: PropTypes.oneOf([
    'linear',
    'easeIn',
    'easeOut',
    'easeInOut',
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
    'easeInOutExpo'
  ]),
  customEasing: PropTypes.func,
  debug: PropTypes.bool,
  showBoundaries: PropTypes.bool,
  onScroll: PropTypes.func,
  onProgress: PropTypes.func,
  onEnter: PropTypes.func,
  onLeave: PropTypes.func,
  onTop: PropTypes.func,
  onBottom: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
  containerStyle: PropTypes.object,
  reduceMotion: PropTypes.bool,
  ariaLabel: PropTypes.string
};

// Export parallax hook
export const useParallax = (options = {}) => {
  const [progress, setProgress] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const handleScroll = () => {
      const rect = elementRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementTop = rect.top;
      const elementHeight = rect.height;

      const newProgress = Math.max(0, Math.min(1, 
        (windowHeight - elementTop) / (windowHeight + elementHeight)
      ));

      setProgress(newProgress);
      setIsInView(elementTop < windowHeight && elementTop + elementHeight > 0);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return {
    ref: elementRef,
    progress,
    isInView
  };
};

// Export parallax presets
export const parallaxPresets = {
  subtle: { speed: 0.2 },
  moderate: { speed: 0.5 },
  intense: { speed: 0.8 },
  hero: {
    speed: 0.4,
    scale: true,
    scaleMin: 0.9,
    scaleMax: 1,
    opacity: true,
    opacityMin: 0.7,
    opacityMax: 1
  },
  fadeIn: {
    speed: 0.3,
    opacity: true,
    opacityMin: 0,
    opacityMax: 1
  },
  zoomOut: {
    speed: 0.5,
    scale: true,
    scaleMin: 1,
    scaleMax: 1.5
  },
  rotateIn: {
    speed: 0.4,
    rotate: true,
    rotateMin: -15,
    rotateMax: 0
  }
};

export default ParallaxWrapper;

