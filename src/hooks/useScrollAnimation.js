import { useEffect, useRef, useState, useCallback } from 'react';

const useScrollAnimation = ({
  threshold = 0.1,
  rootMargin = '0px',
  onScrollEnter,
  onScrollLeave,
  animationDuration = 600,
  easing = 'ease-out',
  initialTransform = 'translateY(30px)',
  finalTransform = 'translateY(0)',
  initialOpacity = 0,
  finalOpacity = 1,
  disabled = false,
  debug = false
}) => {
  const [isInView, setIsInView] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const elementRef = useRef(null);
  const observerRef = useRef(null);

  // Check if the animation should be applied
  const shouldAnimate = !disabled && typeof window !== 'undefined';

  // Handle intersection changes
  const handleIntersection = useCallback((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setIsInView(true);
        if (onScrollEnter) onScrollEnter();
      } else {
        setIsInView(false);
        if (onScrollLeave) onScrollLeave();
      }
    });
  }, [onScrollEnter, onScrollLeave]);

  // Setup Intersection Observer
  useEffect(() => {
    if (!shouldAnimate) return;

    const options = {
      root: null,
      rootMargin,
      threshold: Array.isArray(threshold) ? threshold : [threshold]
    };

    observerRef.current = new IntersectionObserver(handleIntersection, options);

    if (elementRef.current) {
      observerRef.current.observe(elementRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [shouldAnimate, handleIntersection, rootMargin, threshold]);

  // Animate on scroll
  useEffect(() => {
    if (isInView && !isAnimating) {
      setIsAnimating(true);
      if (elementRef.current) {
        elementRef.current.style.transition = `transform ${animationDuration}ms ${easing}, opacity ${animationDuration}ms ${easing}`;
        elementRef.current.style.transform = finalTransform;
        elementRef.current.style.opacity = finalOpacity;
      }
    } else if (!isInView && isAnimating) {
      setIsAnimating(false);
      if (elementRef.current) {
        elementRef.current.style.transition = `none`;
        elementRef.current.style.transform = initialTransform;
        elementRef.current.style.opacity = initialOpacity;
      }
    }
  }, [isInView, isAnimating, animationDuration, easing, finalTransform, finalOpacity, initialTransform, initialOpacity]);

  // Debugging information
  useEffect(() => {
    if (debug) {
      console.log('Scroll Animation State:', {
        isInView,
        isAnimating,
        elementRef: elementRef.current
      });
    }
  }, [isInView, isAnimating, debug]);

  return {
    ref: elementRef,
    isInView,
    isAnimating
  };
};

export default useScrollAnimation;

