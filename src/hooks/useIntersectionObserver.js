import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

/**
 * Advanced Intersection Observer Hook with multiple features and optimizations
 */
const useIntersectionObserver = (options = {}) => {
  const {
    // Basic options
    threshold = 0,
    root = null,
    rootMargin = '0px',
    
    // Advanced options
    freezeOnceVisible = false,
    initialIsIntersecting = false,
    disabled = false,
    
    // Callback options
    onChange,
    onEnter,
    onLeave,
    onFirstIntersection,
    
    // Performance options
    debounce = 0,
    throttle = 0,
    
    // Debug options
    debug = false,
    debugColor = '#ff0000',
    
    // Track additional data
    trackVisibility = false,
    trackTime = false,
    trackRatio = false,
    trackBounds = false,
  } = options;

  // State management  
  const [entry, setEntry] = useState(null);
  const [isIntersecting, setIsIntersecting] = useState(initialIsIntersecting);
  const [intersectionRatio, setIntersectionRatio] = useState(0);
  const [intersectionHistory, setIntersectionHistory] = useState([]);
  const [visibilityData, setVisibilityData] = useState({
    firstVisible: null,
    lastVisible: null,
    totalVisibleTime: 0,
    visibilityCount: 0
  });

  // Refs
  const elementRef = useRef(null);
  const observerRef = useRef(null);
  const frozen = useRef(false);
  const hasIntersected = useRef(false);
  const debounceTimer = useRef(null);
  const throttleTimer = useRef(null);
  const visibilityTimer = useRef(null);
  const lastThrottleTime = useRef(0);
  const debugOverlayRef = useRef(null);

  // Check if in browser environment
  const isClient = typeof window !== 'undefined';
  const hasIOSupport = isClient && 'IntersectionObserver' in window;

  // Memoize observer options
  const observerOptions = useMemo(() => ({
    root,
    rootMargin,
    threshold: Array.isArray(threshold) ? threshold : [threshold]
  }), [root, rootMargin, threshold]);

  // Create debug overlay
  const createDebugOverlay = useCallback(() => {
    if (!debug || !elementRef.current || debugOverlayRef.current) return;

    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border: 2px solid ${debugColor};
      pointer-events: none;
      z-index: 9999;
      transition: all 0.3s ease;
    `;

    const info = document.createElement('div');
    info.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      background: ${debugColor};
      color: white;
      padding: 4px 8px;
      font-size: 12px;
      font-family: monospace;
    `;
    info.textContent = 'IO';

    overlay.appendChild(info);
    elementRef.current.style.position = 'relative';
    elementRef.current.appendChild(overlay);
    debugOverlayRef.current = overlay;
  }, [debug, debugColor]);

  // Update debug overlay
  const updateDebugOverlay = useCallback((isVisible, ratio) => {
    if (!debugOverlayRef.current) return;

    const overlay = debugOverlayRef.current;
    const info = overlay.querySelector('div');
    
    overlay.style.opacity = isVisible ? '1' : '0.3';
    overlay.style.borderStyle = isVisible ? 'solid' : 'dashed';
    
    if (info) {
      info.textContent = `IO: ${isVisible ? 'IN' : 'OUT'} (${(ratio * 100).toFixed(1)}%)`;
      info.style.background = isVisible ? '#4CAF50' : debugColor;
    }
  }, [debugColor]);

  // Handle intersection with debounce/throttle
  const handleIntersection = useCallback((entries) => {
    const processEntry = () => {
      const [entry] = entries;
      
      if (frozen.current && freezeOnceVisible) return;

      const isCurrentlyIntersecting = entry.isIntersecting;
      const currentRatio = entry.intersectionRatio;
      
      // Update state
      setEntry(entry);
      setIsIntersecting(isCurrentlyIntersecting);
      setIntersectionRatio(currentRatio);
      
      // Track intersection history
      if (trackRatio || trackTime || trackBounds) {
        setIntersectionHistory(prev => [...prev.slice(-99), {
          timestamp: Date.now(),
          isIntersecting: isCurrentlyIntersecting,
          ratio: currentRatio,
          bounds: trackBounds ? entry.boundingClientRect : null,
          rootBounds: trackBounds ? entry.rootBounds : null,
          intersectionRect: trackBounds ? entry.intersectionRect : null
        }]);
      }

      // Track visibility time
      if (trackTime) {
        if (isCurrentlyIntersecting && !visibilityTimer.current) {
          visibilityTimer.current = Date.now();
          setVisibilityData(prev => ({
            ...prev,
            firstVisible: prev.firstVisible || Date.now(),
            lastVisible: Date.now(),
            visibilityCount: prev.visibilityCount + 1
          }));
        } else if (!isCurrentlyIntersecting && visibilityTimer.current) {
          const duration = Date.now() - visibilityTimer.current;
          setVisibilityData(prev => ({
            ...prev,
            totalVisibleTime: prev.totalVisibleTime + duration,
            lastVisible: Date.now()
          }));
          visibilityTimer.current = null;
        }
      }

      // Update debug overlay
      if (debug) {
        updateDebugOverlay(isCurrentlyIntersecting, currentRatio);
      }

      // Trigger callbacks
      if (onChange) {
        onChange(entry);
      }

      if (isCurrentlyIntersecting) {
        if (!hasIntersected.current && onFirstIntersection) {
          onFirstIntersection(entry);
          hasIntersected.current = true;
        }
        if (onEnter) {
          onEnter(entry);
        }
        if (freezeOnceVisible) {
          frozen.current = true;
        }
      } else {
        if (onLeave) {
          onLeave(entry);
        }
      }
    };

    // Apply debounce
    if (debounce > 0) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(processEntry, debounce);
      return;
    }

    // Apply throttle
    if (throttle > 0) {
      const now = Date.now();
      const timeSinceLastCall = now - lastThrottleTime.current;
      
      if (timeSinceLastCall >= throttle) {
        lastThrottleTime.current = now;
        processEntry();
      } else {
        clearTimeout(throttleTimer.current);
        throttleTimer.current = setTimeout(() => {
          lastThrottleTime.current = Date.now();
          processEntry();
        }, throttle - timeSinceLastCall);
      }
      return;
    }

    // No debounce or throttle
    processEntry();
  }, [
    freezeOnceVisible,
    onChange,
    onEnter,
    onLeave,
    onFirstIntersection,
    debounce,
    throttle,
    debug,
    updateDebugOverlay,
    trackRatio,
    trackTime,
    trackBounds
  ]);

  // Create and setup observer
  useEffect(() => {
    if (!hasIOSupport || disabled) return;

    // Create debug overlay
    createDebugOverlay();

    // Create observer
    observerRef.current = new IntersectionObserver(handleIntersection, observerOptions);

    // Start observing
    const currentElement = elementRef.current;
    if (currentElement) {
      observerRef.current.observe(currentElement);
    }

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      // Clean up timers
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      if (throttleTimer.current) {
        clearTimeout(throttleTimer.current);
      }
      if (visibilityTimer.current && trackTime) {
        const duration = Date.now() - visibilityTimer.current;
        setVisibilityData(prev => ({
          ...prev,
          totalVisibleTime: prev.totalVisibleTime + duration
        }));
      }

      // Remove debug overlay
      if (debugOverlayRef.current) {
        debugOverlayRef.current.remove();
        debugOverlayRef.current = null;
      }
    };
  }, [
    hasIOSupport,
    disabled,
    handleIntersection,
    observerOptions,
    createDebugOverlay,
    trackTime
  ]);

  // Re-observe when element changes
  useEffect(() => {
    if (!observerRef.current || !elementRef.current || disabled) return;

    const currentElement = elementRef.current;
    observerRef.current.observe(currentElement);

    return () => {
      if (observerRef.current && currentElement) {
        observerRef.current.unobserve(currentElement);
      }
    };
  }, [disabled]);

  // Utility functions
  const reset = useCallback(() => {
    frozen.current = false;
    hasIntersected.current = false;
    setIsIntersecting(initialIsIntersecting);
    setIntersectionRatio(0);
    setEntry(null);
    setIntersectionHistory([]);
    setVisibilityData({
      firstVisible: null,
      lastVisible: null,
      totalVisibleTime: 0,
      visibilityCount: 0
    });
  }, [initialIsIntersecting]);

  const observe = useCallback((element) => {
    if (element && observerRef.current) {
      observerRef.current.observe(element);
    }
  }, []);

  const unobserve = useCallback((element) => {
    if (element && observerRef.current) {
      observerRef.current.unobserve(element);
    }
  }, []);

  const disconnect = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
  }, []);

  // Calculate derived values
  const visibilityPercentage = useMemo(() => {
    if (!trackTime || !visibilityData.firstVisible) return 0;
    const totalTime = Date.now() - visibilityData.firstVisible;
    return (visibilityData.totalVisibleTime / totalTime) * 100;
  }, [trackTime, visibilityData]);

  const averageIntersectionRatio = useMemo(() => {
    if (intersectionHistory.length === 0) return 0;
    const sum = intersectionHistory.reduce((acc, entry) => acc + entry.ratio, 0);
    return sum / intersectionHistory.length;
  }, [intersectionHistory]);

  return {
    // Element ref
    ref: elementRef,
    
    // State values
    entry,
    isIntersecting,
    intersectionRatio,
    
    // Extended data
    intersectionHistory,
    visibilityData,
    visibilityPercentage,
    averageIntersectionRatio,
    
    // Control functions
    reset,
    observe,
    unobserve,
    disconnect,
    
    // Status
    isSupported: hasIOSupport,
    isFrozen: frozen.current,
    hasIntersected: hasIntersected.current
  };
};

// Utility hook for multiple elements
export const useIntersectionObserverMultiple = (options = {}) => {
  const [entries, setEntries] = useState(new Map());
  const observerRef = useRef(null);
  const elementsRef = useRef(new Map());

  const observerOptions = useMemo(() => ({
    root: options.root || null,
    rootMargin: options.rootMargin || '0px',
    threshold: Array.isArray(options.threshold) ? options.threshold : [options.threshold || 0]
  }), [options.root, options.rootMargin, options.threshold]);

  const handleIntersection = useCallback((observerEntries) => {
    const newEntries = new Map();
    
    observerEntries.forEach(entry => {
      const element = entry.target;
      const id = element.getAttribute('data-observer-id') || element.id;
      
      if (id) {
        newEntries.set(id, {
          isIntersecting: entry.isIntersecting,
          intersectionRatio: entry.intersectionRatio,
          entry
        });
      }
    });

    setEntries(prevEntries => new Map([...prevEntries, ...newEntries]));

    if (options.onChange) {
      options.onChange(newEntries);
    }
  }, [options.onChange]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    observerRef.current = new IntersectionObserver(handleIntersection, observerOptions);

    // Observe all registered elements
    elementsRef.current.forEach(element => {
      if (element) {
        observerRef.current.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersection, observerOptions]);

  const observe = useCallback((id, element) => {
    if (!element) return;

    element.setAttribute('data-observer-id', id);
    elementsRef.current.set(id, element);

    if (observerRef.current) {
      observerRef.current.observe(element);
    }
  }, []);

  const unobserve = useCallback((id) => {
    const element = elementsRef.current.get(id);
    
    if (element && observerRef.current) {
      observerRef.current.unobserve(element);
      elementsRef.current.delete(id);
      setEntries(prev => {
        const newEntries = new Map(prev);
        newEntries.delete(id);
        return newEntries;
      });
    }
  }, []);

  const reset = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    elementsRef.current.clear();
    setEntries(new Map());
  }, []);

  return {
    entries,
    observe,
    unobserve,
    reset
  };
};

// Simplified hook for basic use cases
export const useIsInView = (options = {}) => {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: options.threshold || 0.1,
    rootMargin: options.rootMargin || '0px',
    freezeOnceVisible: options.once || false
  });

  return [ref, isIntersecting];
};

export default useIntersectionObserver;
  
