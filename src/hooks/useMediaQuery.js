import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

/**
 * Advanced Media Query Hook with multiple features and optimizations
 */
const useMediaQuery = (query, options = {}) => {
  const {
    // Options
    defaultValue = false,
    onChange,
    debounce = 0,
    throttle = 0,
    
    // SSR options
    ssrMatchMedia = null,
    hydrateOnClient = true,
    
    // Performance options
    enableListener = true,
    
    // Debug options
    debug = false,
  } = options;

  // Initialize state with SSR consideration
  const getInitialValue = () => {
    if (typeof window === 'undefined') {
      return ssrMatchMedia ? ssrMatchMedia(query).matches : defaultValue;
    }
    
    try {
      return window.matchMedia(query).matches;
    } catch (error) {
      if (debug) {
        console.error('Invalid media query:', query, error);
      }
      return defaultValue;
    }
  };

  const [matches, setMatches] = useState(getInitialValue);
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Refs
  const mediaQueryListRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const throttleTimerRef = useRef(null);
  const lastThrottleTime = useRef(0);
  const isInitialMount = useRef(true);

  // Memoize query to detect changes
  const memoizedQuery = useMemo(() => query, [query]);

  // Handle match change with debounce/throttle
  const handleChange = useCallback((event) => {
    const processChange = () => {
      const newMatches = event.matches;
      
      setMatches(newMatches);
      
      if (onChange && !isInitialMount.current) {
        onChange({
          matches: newMatches,
          media: event.media,
          query: memoizedQuery
        });
      }
      
      if (debug) {
        console.log('Media query change:', {
          query: memoizedQuery,
          matches: newMatches,
          event: event
        });
      }
    };

    // Apply debounce
    if (debounce > 0) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(processChange, debounce);
      return;
    }

    // Apply throttle
    if (throttle > 0) {
      const now = Date.now();
      const timeSinceLastCall = now - lastThrottleTime.current;
      
      if (timeSinceLastCall >= throttle) {
        lastThrottleTime.current = now;
        processChange();
      } else {
        clearTimeout(throttleTimerRef.current);
        throttleTimerRef.current = setTimeout(() => {
          lastThrottleTime.current = Date.now();
          processChange();
        }, throttle - timeSinceLastCall);
      }
      return;
    }

    // No debounce or throttle
    processChange();
  }, [memoizedQuery, onChange, debounce, throttle, debug]);

  // Setup media query listener
  useEffect(() => {
    // Skip on server
    if (typeof window === 'undefined') return;

    // Handle hydration
    if (hydrateOnClient && !isHydrated) {
      setIsHydrated(true);
    }

    try {
      // Create media query list
      mediaQueryListRef.current = window.matchMedia(memoizedQuery);
      
      // Set initial value
      setMatches(mediaQueryListRef.current.matches);
      
      // Skip listener if disabled
      if (!enableListener) return;

      // Modern browsers
      if (mediaQueryListRef.current.addEventListener) {
        mediaQueryListRef.current.addEventListener('change', handleChange);
        return () => {
          if (mediaQueryListRef.current) {
            mediaQueryListRef.current.removeEventListener('change', handleChange);
          }
          // Cleanup timers
          if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
          }
          if (throttleTimerRef.current) {
            clearTimeout(throttleTimerRef.current);
          }
        };
      } 
      // Legacy browsers
      else if (mediaQueryListRef.current.addListener) {
        mediaQueryListRef.current.addListener(handleChange);
        return () => {
          if (mediaQueryListRef.current) {
            mediaQueryListRef.current.removeListener(handleChange);
          }
        };
      }
    } catch (error) {
      if (debug) {
        console.error('Error setting up media query:', error);
      }
    }
  }, [memoizedQuery, handleChange, enableListener, hydrateOnClient, isHydrated, debug]);

  // Mark as not initial mount after first render
  useEffect(() => {
    isInitialMount.current = false;
  }, []);

  // Return object with additional utilities
  return {
    matches,
    isHydrated,
    query: memoizedQuery,
    mediaQueryList: mediaQueryListRef.current
  };
};

/**
 * Multiple media queries hook
 */
export const useMediaQueries = (queries, options = {}) => {
  const [results, setResults] = useState(() => {
    const initial = {};
    Object.keys(queries).forEach(key => {
      initial[key] = false;
    });
    return initial;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQueryLists = {};
    const handlers = {};

    // Setup all media queries
    Object.entries(queries).forEach(([key, query]) => {
      try {
        const mql = window.matchMedia(query);
        mediaQueryLists[key] = mql;

        // Set initial value
        setResults(prev => ({
          ...prev,
          [key]: mql.matches
        }));

        // Create handler
        handlers[key] = (event) => {
          setResults(prev => ({
            ...prev,
            [key]: event.matches
          }));

          if (options.onChange) {
            options.onChange(key, event.matches, event);
          }
        };

        // Add listener
        if (mql.addEventListener) {
          mql.addEventListener('change', handlers[key]);
        } else if (mql.addListener) {
          mql.addListener(handlers[key]);
        }
      } catch (error) {
        if (options.debug) {
          console.error(`Invalid media query for ${key}:`, query, error);
        }
      }
    });

    // Cleanup
    return () => {
      Object.entries(mediaQueryLists).forEach(([key, mql]) => {
        if (mql.removeEventListener) {
          mql.removeEventListener('change', handlers[key]);
        } else if (mql.removeListener) {
          mql.removeListener(handlers[key]);
        }
      });
    };
  }, [queries, options.onChange, options.debug]);

  return results;
};

/**
 * Breakpoint hook with predefined queries
 */
export const useBreakpoint = (customBreakpoints = {}) => {
  // Default breakpoints (can be customized)
  const defaultBreakpoints = {
    xs: '(max-width: 575px)',
    sm: '(min-width: 576px) and (max-width: 767px)',
    md: '(min-width: 768px) and (max-width: 991px)',
    lg: '(min-width: 992px) and (max-width: 1199px)',
    xl: '(min-width: 1200px) and (max-width: 1399px)',
    xxl: '(min-width: 1400px)',
    
    // Mobile/Desktop helpers
    mobile: '(max-width: 767px)',
    tablet: '(min-width: 768px) and (max-width: 991px)',
    desktop: '(min-width: 992px)',
    
    // Orientation
    portrait: '(orientation: portrait)',
    landscape: '(orientation: landscape)',
    
    // Resolution
    retina: '(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)',
    
    // Hover capability
    hover: '(hover: hover)',
    noHover: '(hover: none)',
    
    // Reduced motion
    reducedMotion: '(prefers-reduced-motion: reduce)',
    
    // Color scheme
    darkMode: '(prefers-color-scheme: dark)',
    lightMode: '(prefers-color-scheme: light)',
  };

  const breakpoints = { ...defaultBreakpoints, ...customBreakpoints };
  const results = useMediaQueries(breakpoints);

  // Determine current breakpoint
  const getCurrentBreakpoint = () => {
    if (results.xs) return 'xs';
    if (results.sm) return 'sm';
    if (results.md) return 'md';
    if (results.lg) return 'lg';
    if (results.xl) return 'xl';
    if (results.xxl) return 'xxl';
    return null;
  };

  // Check if viewport is at least a certain size
  const isAtLeast = (breakpoint) => {
    const order = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
    const currentIndex = order.indexOf(getCurrentBreakpoint());
    const targetIndex = order.indexOf(breakpoint);
    return currentIndex >= targetIndex;
  };

  // Check if viewport is at most a certain size
  const isAtMost = (breakpoint) => {
    const order = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
    const currentIndex = order.indexOf(getCurrentBreakpoint());
    const targetIndex = order.indexOf(breakpoint);
    return currentIndex <= targetIndex;
  };

  // Check if viewport is between two breakpoints
  const isBetween = (min, max) => {
    return isAtLeast(min) && isAtMost(max);
  };

  return {
    ...results,
    current: getCurrentBreakpoint(),
    isAtLeast,
    isAtMost,
    isBetween,
    // Convenience methods
    isMobile: results.mobile,
    isTablet: results.tablet,
    isDesktop: results.desktop,
    isPortrait: results.portrait,
    isLandscape: results.landscape,
    isRetina: results.retina,
    canHover: results.hover,
    prefersReducedMotion: results.reducedMotion,
    isDarkMode: results.darkMode,
    isLightMode: results.lightMode
  };
};

/**
 * Custom media query builder
 */
export const createMediaQuery = {
  minWidth: (width) => `(min-width: ${width}px)`,
  maxWidth: (width) => `(max-width: ${width}px)`,
  between: (min, max) => `(min-width: ${min}px) and (max-width: ${max}px)`,
  minHeight: (height) => `(min-height: ${height}px)`,
  maxHeight: (height) => `(max-height: ${height}px)`,
  orientation: (orientation) => `(orientation: ${orientation})`,
  aspectRatio: (ratio) => `(aspect-ratio: ${ratio})`,
  minAspectRatio: (ratio) => `(min-aspect-ratio: ${ratio})`,
  maxAspectRatio: (ratio) => `(max-aspect-ratio: ${ratio})`,
  resolution: (dpi) => `(min-resolution: ${dpi}dpi)`,
  devicePixelRatio: (ratio) => `(-webkit-min-device-pixel-ratio: ${ratio})`,
  hover: () => '(hover: hover)',
  anyHover: () => '(any-hover: hover)',
  pointer: (type) => `(pointer: ${type})`,
  anyPointer: (type) => `(any-pointer: ${type})`,
  prefersColorScheme: (scheme) => `(prefers-color-scheme: ${scheme})`,
  prefersReducedMotion: () => '(prefers-reduced-motion: reduce)',
  prefersReducedTransparency: () => '(prefers-reduced-transparency: reduce)',
  prefersContrast: (level) => `(prefers-contrast: ${level})`,
  forcedColors: () => '(forced-colors: active)',
  colorGamut: (gamut) => `(color-gamut: ${gamut})`,
  and: (...queries) => queries.join(' and '),
  or: (...queries) => queries.join(', '),
  not: (query) => `not ${query}`
};

/**
 * Responsive value hook
 */
export const useResponsiveValue = (values, breakpoints = {}) => {
  const bp = useBreakpoint(breakpoints);
  
  const getValue = () => {
    if (typeof values === 'object' && !Array.isArray(values)) {
      // Object notation: { xs: 'value1', md: 'value2', ... }
      const breakpointOrder = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
      
      // Find the matching breakpoint value
      for (let i = breakpointOrder.indexOf(bp.current); i >= 0; i--) {
        const breakpoint = breakpointOrder[i];
        if (values[breakpoint] !== undefined) {
          return values[breakpoint];
        }
      }
      
      // Fallback to base value
      return values.base || values.default || null;
    } else if (Array.isArray(values)) {
      // Array notation: ['value1', 'value2', ...]
      const breakpointOrder = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
      const index = Math.min(breakpointOrder.indexOf(bp.current), values.length - 1);
      return values[Math.max(0, index)];
    }
    
    // Single value
    return values;
  };

  return getValue();
};

/**
 * Window size hook
 */
export const useWindowSize = (options = {}) => {
  const { debounce = 150 } = options;
  
  const [windowSize, setWindowSize] = useState(() => {
    if (typeof window === 'undefined') {
      return { width: 0, height: 0 };
    }
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  });

  const debounceTimerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      clearTimeout(debounceTimerRef.current);
      
      debounceTimerRef.current = setTimeout(() => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight
        });
      }, debounce);
    };

    window.addEventListener('resize', handleResize);
    
    // Initial call
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(debounceTimerRef.current);
    };
  }, [debounce]);

  return windowSize;
};

// Export all hooks and utilities
export default useMediaQuery;
            
