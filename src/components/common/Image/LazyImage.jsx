import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import styles from './LazyImage.module.css';

const LazyImage = ({
  src,
  alt,
  srcSet,
  sizes,
  className = '',
  style = {},
  width,
  height,
  aspectRatio,
  objectFit = 'cover',
  objectPosition = 'center',
  loading = 'lazy',
  priority = false,
  placeholder = 'blur',
  blurDataURL,
  customPlaceholder,
  threshold = 0.1,
  rootMargin = '50px',
  fadeInDuration = 300,
  onLoad,
  onError,
  onLoadStart,
  onLoadEnd,
  fallbackSrc = 'https://placehold.co/400x300',
  retryCount = 3,
  retryDelay = 1000,
  progressive = true,
  decoding = 'async',
  fetchPriority = 'auto',
  referrerPolicy = 'strict-origin-when-cross-origin',
  allowFullScreen = false,
  showLoadingProgress = false,
  enableBlurhash = false,
  blurhash,
  transformations,
  quality = 'auto',
  format = 'auto',
  ...props
}) => {
  // State management
  const [imageState, setImageState] = useState({
    isLoading: true,
    isLoaded: false,
    isError: false,
    isInView: false,
    currentSrc: '',
    loadProgress: 0,
    retryAttempts: 0
  });

  // Refs
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const observerRef = useRef(null);
  const progressRef = useRef(null);
  const retryTimeoutRef = useRef(null);

  // Generate responsive image URLs
  const generateImageUrls = useCallback(() => {
    if (!src) return { src: '', srcSet: '' };

    // If transformations are provided, apply them
    if (transformations) {
      const baseUrl = src.split('?')[0];
      const params = new URLSearchParams();

      if (transformations.width) params.append('w', transformations.width);
      if (transformations.height) params.append('h', transformations.height);
      if (transformations.quality !== undefined) params.append('q', transformations.quality);
      if (transformations.format) params.append('fm', transformations.format);
      if (transformations.fit) params.append('fit', transformations.fit);

      const transformedSrc = `${baseUrl}?${params.toString()}`;
      
      // Generate srcSet for responsive images
      const widths = [320, 640, 768, 1024, 1280, 1536, 1920, 2560];
      const generatedSrcSet = widths
        .map(w => {
          params.set('w', w);
          return `${baseUrl}?${params.toString()} ${w}w`;
        })
        .join(', ');

      return { src: transformedSrc, srcSet: srcSet || generatedSrcSet };
    }

    return { src, srcSet: srcSet || '' };
  }, [src, srcSet, transformations]);

  // Generate placeholder based on type
  const getPlaceholder = useCallback(() => {
    if (customPlaceholder) return customPlaceholder;

    switch (placeholder) {
      case 'blur':
        if (blurDataURL) return blurDataURL;
        if (enableBlurhash && blurhash) {
          // Decode blurhash (would need blurhash library)
          return generateBlurhashDataURL(blurhash);
        }
        return generateBlurDataURL();
      
      case 'skeleton':
        return 'skeleton';
      
      case 'color':
        return generateColorPlaceholder();
      
      case 'shimmer':
        return 'shimmer';
      
      case 'none':
      default:
        return null;
    }
  }, [placeholder, blurDataURL, customPlaceholder, enableBlurhash, blurhash]);

  // Generate blur data URL
  const generateBlurDataURL = useCallback(() => {
    const w = width || 10;
    const h = height || 10;
    const svg = `
      <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
          </filter>
        </defs>
        <rect width="100%" height="100%" fill="#e0e0e0" filter="url(#blur)" />
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }, [width, height]);

  // Generate color placeholder
  const generateColorPlaceholder = useCallback(() => {
    const colors = ['#f3f4f6', '#e5e7eb', '#d1d5db', '#9ca3af'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const svg = `
      <svg width="1" height="1" xmlns="http://www.w3.org/2000/svg">
        <rect width="1" height="1" fill="${color}" />
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }, []);

  // Generate blurhash data URL (placeholder implementation)
  const generateBlurhashDataURL = useCallback((hash) => {
    // This would require the blurhash library to decode
    // For now, return a simple blur placeholder
    return generateBlurDataURL();
  }, [generateBlurDataURL]);

  // Setup Intersection Observer
  useEffect(() => {
    if (priority || loading === 'eager' || typeof window === 'undefined') {
      setImageState(prev => ({ ...prev, isInView: true }));
      return;
    }

    const options = {
      root: null,
      rootMargin,
      threshold: Array.isArray(threshold) ? threshold : [threshold]
    };

    const handleIntersection = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setImageState(prev => ({ ...prev, isInView: true }));
          observerRef.current?.unobserve(entry.target);
        }
      });
    };

    observerRef.current = new IntersectionObserver(handleIntersection, options);

    if (containerRef.current) {
      observerRef.current.observe(containerRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [priority, loading, rootMargin, threshold]);

  // Load image with progress tracking
  const loadImage = useCallback(async () => {
    const { src: imageSrc, srcSet: imageSrcSet } = generateImageUrls();
    
    if (!imageSrc || !imageState.isInView) return;

    setImageState(prev => ({ ...prev, isLoading: true }));
    onLoadStart?.();

    try {
      // Use fetch API for progress tracking if enabled
      if (showLoadingProgress && 'fetch' in window) {
        const response = await fetch(imageSrc, {
          mode: 'cors',
          credentials: 'same-origin',
          referrerPolicy
        });

        if (!response.ok) throw new Error('Failed to fetch image');

        const reader = response.body.getReader();
        const contentLength = +response.headers.get('Content-Length');

        let receivedLength = 0;
        const chunks = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          chunks.push(value);
          receivedLength += value.length;

          const progress = contentLength ? (receivedLength / contentLength) * 100 : 0;
          setImageState(prev => ({ ...prev, loadProgress: progress }));
        }

        const blob = new Blob(chunks);
        const imageUrl = URL.createObjectURL(blob);

        // Create new image element to trigger onload
        const img = new Image();
        img.onload = () => {
          setImageState(prev => ({
            ...prev,
            isLoaded: true,
            isLoading: false,
            isError: false,
            currentSrc: imageUrl,
            loadProgress: 100
          }));
          onLoad?.({ naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight });
          onLoadEnd?.(true);
        };
        img.src = imageUrl;

      } else {
        // Standard image loading
        const img = new Image();
        
        if (imageSrcSet) {
          img.srcset = imageSrcSet;
        }
        if (sizes) {
          img.sizes = sizes;
        }

        img.onload = () => {
          setImageState(prev => ({
            ...prev,
            isLoaded: true,
            isLoading: false,
            isError: false,
            currentSrc: imageSrc,
            loadProgress: 100
          }));
          onLoad?.({ naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight });
          onLoadEnd?.(true);
        };

        img.onerror = () => {
          throw new Error('Failed to load image');
        };

        img.src = imageSrc;
      }

    } catch (error) {
      console.error('Image loading error:', error);
      
      // Retry logic
      if (imageState.retryAttempts < retryCount) {
        retryTimeoutRef.current = setTimeout(() => {
          setImageState(prev => ({
            ...prev,
            retryAttempts: prev.retryAttempts + 1
          }));
          loadImage();
        }, retryDelay * (imageState.retryAttempts + 1));
      } else {
        setImageState(prev => ({
          ...prev,
          isLoaded: false,
          isLoading: false,
          isError: true,
          currentSrc: fallbackSrc
        }));
        onError?.(error);
        onLoadEnd?.(false);
      }
    }
  }, [
    generateImageUrls,
    imageState.isInView,
    imageState.retryAttempts,
    showLoadingProgress,
    referrerPolicy,
    sizes,
    retryCount,
    retryDelay,
    fallbackSrc,
    onLoadStart,
    onLoad,
    onError,
    onLoadEnd
  ]);

  // Load image when in view
  useEffect(() => {
    if (imageState.isInView && !imageState.isLoaded && !imageState.isError) {
      loadImage();
    }

    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [imageState.isInView, imageState.isLoaded, imageState.isError, loadImage]);

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

  // Build container classes
  const containerClasses = [
    styles.container,
    imageState.isLoading && styles.loading,
    imageState.isLoaded && styles.loaded,
    imageState.isError && styles.error,
    allowFullScreen && styles.fullScreenEnabled,
    className
  ].filter(Boolean).join(' ');

  // Build image style
  const imageStyle = {
    ...style,
    objectFit,
    objectPosition
  };

  if (width && !responsive) imageStyle.width = width;
  if (height && !responsive) imageStyle.height = height;

  // Render placeholder content
  const renderPlaceholder = () => {
    const placeholderType = getPlaceholder();

    if (!placeholderType || placeholderType === 'none') return null;

    switch (placeholderType) {
      case 'skeleton':
        return <div className={styles.skeleton} />;
      
      case 'shimmer':
        return (
          <div className={styles.shimmer}>
            <div className={styles.shimmerAnimation} />
          </div>
        );
      
      default:
        if (typeof placeholderType === 'string' && placeholderType.startsWith('data:')) {
          return (
            <img
              src={placeholderType}
              alt=""
              className={styles.placeholder}
              aria-hidden="true"
            />
          );
        }
        return placeholderType;
    }
  };

  // Handle fullscreen
  const toggleFullScreen = useCallback(() => {
    if (!containerRef.current || !allowFullScreen) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen();
    }
  }, [allowFullScreen]);

  return (
    <div
      ref={containerRef}
      className={containerClasses}
      style={aspectRatioPadding ? { paddingBottom: aspectRatioPadding } : {}}
    >
      {/* Placeholder */}
      {imageState.isLoading && renderPlaceholder()}

      {/* Loading progress */}
      {showLoadingProgress && imageState.isLoading && imageState.loadProgress > 0 && (
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${imageState.loadProgress}%` }}
          />
        </div>
      )}

      {/* Main image */}
      {imageState.isInView && (
        <img
          ref={imageRef}
          src={imageState.currentSrc || src}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          className={styles.image}
          style={imageStyle}
          loading={loading}
          decoding={decoding}
          fetchpriority={fetchPriority}
          referrerpolicy={referrerPolicy}
          onError={() => {
            if (!imageState.isError) {
              setImageState(prev => ({ ...prev, isError: true, currentSrc: fallbackSrc }));
            }
          }}
          {...props}
        />
      )}

      {/* Error state overlay */}
      {imageState.isError && (
        <div className={styles.errorOverlay}>
          <svg className={styles.errorIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span className={styles.errorText}>Failed to load</span>
          {imageState.retryAttempts < retryCount && (
            <button
              className={styles.retryButton}
              onClick={() => {
                setImageState(prev => ({
                  ...prev,
                  isError: false,
                  isLoading: true,
                  retryAttempts: 0
                }));
                loadImage();
              }}
            >
              Retry
            </button>
          )}
        </div>
      )}

      {/* Fullscreen button */}
      {allowFullScreen && imageState.isLoaded && (
        <button
          className={styles.fullScreenButton}
          onClick={toggleFullScreen}
          aria-label="Toggle fullscreen"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
          </svg>
        </button>
      )}

      {/* Fade in overlay for smooth transition */}
      {imageState.isLoaded && fadeInDuration > 0 && (
        <div
          className={styles.fadeOverlay}
          style={{ animationDuration: `${fadeInDuration}ms` }}
        />
      )}
    </div>
  );
};

LazyImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  srcSet: PropTypes.string,
  sizes: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  aspectRatio: PropTypes.string,
  objectFit: PropTypes.oneOf(['contain', 'cover', 'fill', 'none', 'scale-down']),
  objectPosition: PropTypes.string,
  loading: PropTypes.oneOf(['lazy', 'eager']),
  priority: PropTypes.bool,
  placeholder: PropTypes.oneOf(['blur', 'skeleton', 'color', 'shimmer', 'none']),
  blurDataURL: PropTypes.string,
  customPlaceholder: PropTypes.node,
  threshold: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),
  rootMargin: PropTypes.string,
  fadeInDuration: PropTypes.number,
  onLoad: PropTypes.func,
  onError: PropTypes.func,
  onLoadStart: PropTypes.func,
  onLoadEnd: PropTypes.func,
  fallbackSrc: PropTypes.string,
  retryCount: PropTypes.number,
  retryDelay: PropTypes.number,
  progressive: PropTypes.bool,
  decoding: PropTypes.oneOf(['sync', 'async', 'auto']),
  fetchPriority: PropTypes.oneOf(['high', 'low', 'auto']),
  referrerPolicy: PropTypes.string,
  allowFullScreen: PropTypes.bool,
  showLoadingProgress: PropTypes.bool,
  enableBlurhash: PropTypes.bool,
  blurhash: PropTypes.string,
  transformations: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
    quality: PropTypes.number,
    format: PropTypes.string,
    fit: PropTypes.string
  }),
  quality: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  format: PropTypes.string
};

// Export utility function for preloading images
export const preloadImage = (src, srcSet, sizes) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  if (srcSet) link.imageSrcset = srcSet;
  if (sizes) link.imageSizes = sizes;
  document.head.appendChild(link);
};

export default LazyImage;

                                         
