import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import styles from './ProtectedImage.module.css';

const ProtectedImage = ({
  src,
  alt,
  className = '',
  style = {},
  loading = 'lazy',
  sizes,
  placeholder = 'blur',
  blurDataURL,
  priority = false,
  quality = 85,
  objectFit = 'cover',
  objectPosition = 'center',
  onLoad,
  onError,
  fallbackSrc = 'https://placehold.co/400x300',
  aspectRatio,
  watermark = false,
  watermarkText = '© DGrealtors',
  watermarkPosition = 'bottom-right',
  disableProtection = false,
  animateOnLoad = true,
  zoomOnHover = false,
  lightbox = false,
  caption,
  width,
  height,
  responsive = true,
  lazyBoundary = '200px',
  ...props
}) => {
  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });

  // Refs
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const observerRef = useRef(null);

  // Generate blur placeholder
  const generateBlurPlaceholder = useCallback(() => {
    if (blurDataURL) return blurDataURL;
    
    // Generate SVG blur placeholder
    const svgBlur = `
      <svg width="${width || 400}" height="${height || 300}" xmlns="http://www.w3.org/2000/svg">
        <filter id="blur">
          <feGaussianBlur stdDeviation="20" />
        </filter>
        <rect width="100%" height="100%" fill="#f0f0f0" filter="url(#blur)" />
      </svg>
    `;
    
    return `data:image/svg+xml;base64,${btoa(svgBlur)}`;
  }, [blurDataURL, width, height]);

  // Disable right-click and drag
  const handleContextMenu = useCallback((e) => {
    if (!disableProtection) {
      e.preventDefault();
      return false;
    }
  }, [disableProtection]);

  const handleDragStart = useCallback((e) => {
    if (!disableProtection) {
      e.preventDefault();
      return false;
    }
  }, [disableProtection]);

  // Prevent image save keyboard shortcuts
  useEffect(() => {
    if (disableProtection) return;

    const handleKeyDown = (e) => {
      // Prevent Ctrl+S, Cmd+S
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        return false;
      }
      // Prevent Ctrl+A, Cmd+A when image is focused
      if ((e.ctrlKey || e.metaKey) && e.key === 'a' && document.activeElement === imageRef.current) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [disableProtection]);

  // Convert image to protected canvas
  const protectImageWithCanvas = useCallback(async () => {
    if (disableProtection || !imageRef.current || !canvasRef.current) return;

    try {
      const img = imageRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      // Set canvas dimensions
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      // Draw image on canvas
      ctx.drawImage(img, 0, 0);

      // Add watermark if enabled
      if (watermark) {
        ctx.font = `${Math.max(16, canvas.width / 50)}px Arial`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.lineWidth = 2;

        const padding = 20;
        const textMetrics = ctx.measureText(watermarkText);
        let x, y;

        // Calculate watermark position
        switch (watermarkPosition) {
          case 'top-left':
            x = padding;
            y = padding + textMetrics.actualBoundingBoxAscent;
            break;
          case 'top-right':
            x = canvas.width - textMetrics.width - padding;
            y = padding + textMetrics.actualBoundingBoxAscent;
            break;
          case 'bottom-left':
            x = padding;
            y = canvas.height - padding;
            break;
          case 'bottom-right':
          default:
            x = canvas.width - textMetrics.width - padding;
            y = canvas.height - padding;
            break;
          case 'center':
            x = (canvas.width - textMetrics.width) / 2;
            y = canvas.height / 2;
            break;
        }

        // Draw watermark with stroke for better visibility
        ctx.strokeText(watermarkText, x, y);
        ctx.fillText(watermarkText, x, y);
      }

      // Add noise to prevent easy extraction
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 10;
        data[i] = Math.max(0, Math.min(255, data[i] + noise));     // Red
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise)); // Green
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise)); // Blue
      }
      
      ctx.putImageData(imageData, 0, 0);

      // Convert to blob URL
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
      }, 'image/jpeg', quality / 100);

    } catch (error) {
      console.error('Error protecting image:', error);
      setImageUrl(src);
    }
  }, [disableProtection, watermark, watermarkText, watermarkPosition, quality, src]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || loading !== 'lazy') {
      setIsInView(true);
      return;
    }

    const options = {
      rootMargin: lazyBoundary,
      threshold: 0.01
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.unobserve(entry.target);
        }
      });
    }, options);

    if (containerRef.current) {
      observerRef.current.observe(containerRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [priority, loading, lazyBoundary]);

  // Load image when in view
  useEffect(() => {
    if (isInView && src) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
        setIsLoading(false);
        setHasError(false);
        
        if (!disableProtection) {
          // Wait for image to be rendered before protecting
          setTimeout(() => protectImageWithCanvas(), 100);
        } else {
          setImageUrl(src);
        }
        
        onLoad?.();
      };
      
      img.onerror = () => {
        setIsLoading(false);
        setHasError(true);
        onError?.();
      };
      
      img.src = src;
    }
  }, [isInView, src, disableProtection, protectImageWithCanvas, onLoad, onError]);

  // Handle lightbox
  const handleImageClick = useCallback(() => {
    if (lightbox && !hasError) {
      setShowLightbox(true);
      document.body.style.overflow = 'hidden';
    }
  }, [lightbox, hasError]);

  const closeLightbox = useCallback(() => {
    setShowLightbox(false);
    document.body.style.overflow = '';
  }, []);

  // Lightbox keyboard navigation
  useEffect(() => {
    if (!showLightbox) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeLightbox();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showLightbox, closeLightbox]);

  // Clean up blob URL
  useEffect(() => {
    return () => {
      if (imageUrl && imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  // Calculate responsive dimensions
  const getImageStyle = () => {
    const imgStyle = { ...style };
    
    if (objectFit) imgStyle.objectFit = objectFit;
    if (objectPosition) imgStyle.objectPosition = objectPosition;
    
    if (aspectRatio && responsive) {
      imgStyle.aspectRatio = aspectRatio;
      imgStyle.width = '100%';
      imgStyle.height = 'auto';
    } else {
      if (width) imgStyle.width = typeof width === 'number' ? `${width}px` : width;
      if (height) imgStyle.height = typeof height === 'number' ? `${height}px` : height;
    }
    
    return imgStyle;
  };

  // Build class names
  const containerClasses = [
    styles.container,
    isLoading && styles.loading,
    hasError && styles.error,
    animateOnLoad && !isLoading && styles.loaded,
    zoomOnHover && styles.zoomable,
    lightbox && styles.clickable,
    className
  ].filter(Boolean).join(' ');

  return (
    <>
      <div 
        ref={containerRef}
        className={containerClasses}
        style={aspectRatio ? { aspectRatio } : {}}
        onClick={handleImageClick}
      >
        {/* Loading placeholder */}
        {isLoading && placeholder === 'blur' && (
          <img
            src={generateBlurPlaceholder()}
            alt=""
            className={styles.placeholder}
            aria-hidden="true"
          />
        )}
        
        {/* Loading skeleton */}
        {isLoading && placeholder === 'skeleton' && (
          <div className={styles.skeleton}>
            <div className={styles.skeletonShine} />
          </div>
        )}
        
        {/* Loading spinner */}
        {isLoading && placeholder === 'spinner' && (
          <div className={styles.spinner}>
            <div className={styles.spinnerCircle} />
          </div>
        )}

        {/* Hidden canvas for image protection */}
        {!disableProtection && (
          <canvas
            ref={canvasRef}
            className={styles.hiddenCanvas}
            aria-hidden="true"
          />
        )}

        {/* Main image (hidden, used as source) */}
        {isInView && !hasError && (
          <img
            ref={imageRef}
            src={src}
            alt={alt}
            className={styles.hiddenImage}
            crossOrigin="anonymous"
            aria-hidden="true"
          />
        )}

        {/* Displayed protected image */}
        {!isLoading && !hasError && imageUrl && (
          <img
            src={imageUrl}
            alt={alt}
            className={styles.image}
            style={getImageStyle()}
            onContextMenu={handleContextMenu}
            onDragStart={handleDragStart}
            sizes={sizes}
            loading={loading}
            {...props}
          />
        )}

        {/* Error state */}
        {hasError && (
          <div className={styles.errorContainer}>
            <img
              src={fallbackSrc}
              alt={alt}
              className={styles.fallbackImage}
              style={getImageStyle()}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className={styles.errorOverlay}>
              <svg className={styles.errorIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span className={styles.errorText}>Failed to load image</span>
            </div>
          </div>
        )}

        {/* Protection overlay */}
        {!disableProtection && !isLoading && !hasError && (
          <div 
            className={styles.protectionOverlay}
            onContextMenu={handleContextMenu}
            onDragStart={handleDragStart}
          />
        )}

        {/* Caption */}
        {caption && !isLoading && !hasError && (
          <div className={styles.caption}>
            <span className={styles.captionText}>{caption}</span>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div className={styles.lightbox} onClick={closeLightbox}>
          <button 
            className={styles.lightboxClose}
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          
          <div className={styles.lightboxContent}>
            <img
              src={imageUrl}
              alt={alt}
              className={styles.lightboxImage}
              style={{ maxWidth: naturalSize.width, maxHeight: naturalSize.height }}
              onContextMenu={handleContextMenu}
              onDragStart={handleDragStart}
            />
            
            {caption && (
              <div className={styles.lightboxCaption}>
                {caption}
              </div>
            )}
          </div>
          
          {/* Lightbox protection overlay */}
          {!disableProtection && (
            <div 
              className={styles.lightboxProtection}
              onContextMenu={handleContextMenu}
              onDragStart={handleDragStart}
            />
          )}
        </div>
      )}
    </>
  );
};

ProtectedImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  loading: PropTypes.oneOf(['lazy', 'eager']),
  sizes: PropTypes.string,
  placeholder: PropTypes.oneOf(['blur', 'skeleton', 'spinner', 'none']),
  blurDataURL: PropTypes.string,
  priority: PropTypes.bool,
  quality: PropTypes.number,
  objectFit: PropTypes.oneOf(['contain', 'cover', 'fill', 'none', 'scale-down']),
  objectPosition: PropTypes.string,
  onLoad: PropTypes.func,
  onError: PropTypes.func,
  fallbackSrc: PropTypes.string,
  aspectRatio: PropTypes.string,
  watermark: PropTypes.bool,
  watermarkText: PropTypes.string,
  watermarkPosition: PropTypes.oneOf(['top-left', 'top-right', 'bottom-left', 'bottom-right', 'center']),
  disableProtection: PropTypes.bool,
  animateOnLoad: PropTypes.bool,
  zoomOnHover: PropTypes.bool,
  lightbox: PropTypes.bool,
  caption: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  responsive: PropTypes.bool,
  lazyBoundary: PropTypes.string
};

export default ProtectedImage;

                    
