import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Advanced Image Protection Hook with multiple protection methods
 */
const useImageProtection = (options = {}) => {
  const {
    // Protection options
    disableRightClick = true,
    disableDrag = true,
    disableCopy = true,
    disableSelection = true,
    disablePrint = true,
    disableDevTools = false,
    disableHotkeys = true,
    
    // Watermark options
    watermark = false,
    watermarkText = '© Protected',
    watermarkStyle = {},
    watermarkPosition = 'bottom-right',
    watermarkOpacity = 0.5,
    
    // Canvas protection
    useCanvas = false,
    canvasQuality = 0.9,
    addNoise = false,
    noiseIntensity = 5,
    
    // Advanced protection
    blurOnCopy = false,
    blurIntensity = 5,
    showWarning = false,
    warningMessage = 'This image is protected by copyright',
    redirectOnViolation = false,
    redirectUrl = '/copyright-notice',
    
    // Monitoring
    trackAttempts = false,
    onProtectionAttempt,
    maxAttempts = 5,
    
    // Debug
    debug = false,
  } = options;

  const [protectionAttempts, setProtectionAttempts] = useState(0);
  const [isProtected, setIsProtected] = useState(false);
  const [canvasUrl, setCanvasUrl] = useState(null);
  
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const attemptCountRef = useRef(0);
  const devToolsCheckInterval = useRef(null);

  // Log protection attempt
  const logAttempt = useCallback((type, event) => {
    if (debug) {
      console.log(`Protection attempt detected: ${type}`, event);
    }

    if (trackAttempts) {
      attemptCountRef.current += 1;
      setProtectionAttempts(attemptCountRef.current);
      
      if (onProtectionAttempt) {
        onProtectionAttempt({
          type,
          timestamp: Date.now(),
          totalAttempts: attemptCountRef.current,
          event
        });
      }

      // Check max attempts
      if (maxAttempts && attemptCountRef.current >= maxAttempts) {
        if (redirectOnViolation && redirectUrl) {
          window.location.href = redirectUrl;
        }
      }
    }
  }, [debug, trackAttempts, onProtectionAttempt, maxAttempts, redirectOnViolation, redirectUrl]);

  // Show warning message
  const showProtectionWarning = useCallback(() => {
    if (!showWarning) return;

    const warning = document.createElement('div');
    warning.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 20px 40px;
      border-radius: 8px;
      z-index: 999999;
      font-family: Arial, sans-serif;
      font-size: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
      animation: fadeInOut 3s ease;
    `;
    warning.textContent = warningMessage;

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
        20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(warning);

    setTimeout(() => {
      warning.remove();
      style.remove();
    }, 3000);
  }, [showWarning, warningMessage]);

  // Disable right-click
  const handleContextMenu = useCallback((e) => {
    if (disableRightClick && e.target === imageRef.current) {
      e.preventDefault();
      e.stopPropagation();
      logAttempt('rightClick', e);
      showProtectionWarning();
      return false;
    }
  }, [disableRightClick, logAttempt, showProtectionWarning]);

  // Disable drag
  const handleDragStart = useCallback((e) => {
    if (disableDrag && e.target === imageRef.current) {
      e.preventDefault();
      e.stopPropagation();
      logAttempt('drag', e);
      return false;
    }
  }, [disableDrag, logAttempt]);

  // Disable selection
  const handleSelectStart = useCallback((e) => {
    if (disableSelection && e.target === imageRef.current) {
      e.preventDefault();
      e.stopPropagation();
      logAttempt('selection', e);
      return false;
    }
  }, [disableSelection, logAttempt]);

  // Handle copy attempt
  const handleCopy = useCallback((e) => {
    if (disableCopy && imageRef.current && imageRef.current.contains(e.target)) {
      e.clipboardData.setData('text/plain', warningMessage);
      e.preventDefault();
      logAttempt('copy', e);
      showProtectionWarning();

      // Blur image temporarily
      if (blurOnCopy && imageRef.current) {
        const originalFilter = imageRef.current.style.filter;
        imageRef.current.style.filter = `blur(${blurIntensity}px)`;
        setTimeout(() => {
          if (imageRef.current) {
            imageRef.current.style.filter = originalFilter;
          }
        }, 3000);
      }

      return false;
    }
  }, [disableCopy, warningMessage, logAttempt, showProtectionWarning, blurOnCopy, blurIntensity]);

  // Disable hotkeys
  const handleKeyDown = useCallback((e) => {
    if (!disableHotkeys) return;

    const protectedCombos = [
      // Save shortcuts
      { ctrl: true, key: 's' },
      { meta: true, key: 's' },
      // Print shortcuts
      { ctrl: true, key: 'p' },
      { meta: true, key: 'p' },
      // Screenshot shortcuts (OS specific)
      { ctrl: true, shift: true, key: 's' },
      { meta: true, shift: true, key: '3' },
      { meta: true, shift: true, key: '4' },
      { meta: true, shift: true, key: '5' },
      // Developer tools
      { key: 'F12' },
      { ctrl: true, shift: true, key: 'i' },
      { meta: true, alt: true, key: 'i' },
      { ctrl: true, shift: true, key: 'j' },
      { meta: true, alt: true, key: 'j' },
      { ctrl: true, shift: true, key: 'c' },
      { meta: true, alt: true, key: 'c' },
    ];

    const isProtectedCombo = protectedCombos.some(combo => {
      const ctrlPressed = combo.ctrl ? (e.ctrlKey || e.metaKey) : true;
      const metaPressed = combo.meta ? e.metaKey : true;
      const shiftPressed = combo.shift ? e.shiftKey : true;
      const altPressed = combo.alt ? e.altKey : true;
      const keyMatch = combo.key ? e.key.toLowerCase() === combo.key.toLowerCase() : true;
      
      return ctrlPressed && metaPressed && shiftPressed && altPressed && keyMatch;
    });

    if (isProtectedCombo) {
      e.preventDefault();
      e.stopPropagation();
      logAttempt('hotkey', e);
      showProtectionWarning();
      return false;
    }
  }, [disableHotkeys, logAttempt, showProtectionWarning]);

  // Detect developer tools
  const detectDevTools = useCallback(() => {
    if (!disableDevTools) return;

    const threshold = 160;
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;
    
    if (widthThreshold || heightThreshold) {
      logAttempt('devtools', { method: 'size-difference' });
      
      // Optional: Take action when dev tools detected
      if (debug) {
        console.log('Developer tools detected!');
      }
    }

    // Alternative method: Console timing
    const startTime = new Date();
    debugger; // This line will pause if devtools is open
    const endTime = new Date();
    
    if (endTime - startTime > 100) {
      logAttempt('devtools', { method: 'debugger-timing' });
    }
  }, [disableDevTools, logAttempt, debug]);

  // Create canvas protection
  const createCanvasProtection = useCallback(async () => {
    if (!useCanvas || !imageRef.current || !canvasRef.current) return;

    try {
      const img = imageRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      // Wait for image to load
      if (!img.complete || !img.naturalWidth) {
        await new Promise((resolve) => {
          img.onload = resolve;
        });
      }

      // Set canvas dimensions
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      // Draw image
      ctx.drawImage(img, 0, 0);

      // Add watermark
      if (watermark) {
        ctx.save();
        
        // Set watermark style
        ctx.globalAlpha = watermarkOpacity;
        ctx.fillStyle = watermarkStyle.color || '#ffffff';
        ctx.font = watermarkStyle.font || `${Math.max(16, canvas.width / 50)}px Arial`;
        ctx.textAlign = watermarkStyle.textAlign || 'center';
        ctx.textBaseline = watermarkStyle.textBaseline || 'middle';

        // Add text shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        // Calculate position
        let x, y;
        const padding = 20;
        const textMetrics = ctx.measureText(watermarkText);
        
        switch (watermarkPosition) {
          case 'top-left':
            x = padding + textMetrics.width / 2;
            y = padding;
            break;
          case 'top-right':
            x = canvas.width - padding - textMetrics.width / 2;
            y = padding;
            break;
          case 'bottom-left':
            x = padding + textMetrics.width / 2;
            y = canvas.height - padding;
            break;
          case 'bottom-right':
            x = canvas.width - padding - textMetrics.width / 2;
            y = canvas.height - padding;
            break;
          case 'center':
            x = canvas.width / 2;
            y = canvas.height / 2;
            break;
          default:
            x = canvas.width - padding - textMetrics.width / 2;
            y = canvas.height - padding;
        }

        // Draw watermark
        ctx.fillText(watermarkText, x, y);
        
        // Optional: Add diagonal watermarks
        if (watermarkStyle.diagonal) {
          ctx.save();
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate(-Math.PI / 4);
          ctx.globalAlpha = watermarkOpacity * 0.3;
          
          for (let i = -canvas.width; i < canvas.width; i += 200) {
            for (let j = -canvas.height; j < canvas.height; j += 100) {
              ctx.fillText(watermarkText, i, j);
            }
          }
          ctx.restore();
        }
        
        ctx.restore();
      }

      // Add noise
      if (addNoise) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
          const noise = (Math.random() - 0.5) * noiseIntensity;
          data[i] = Math.max(0, Math.min(255, data[i] + noise));     // Red
          data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise)); // Green
          data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise)); // Blue
        }
        
        ctx.putImageData(imageData, 0, 0);
      }

      // Convert to blob URL
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        setCanvasUrl(url);
        
        // Hide original image and show canvas
        if (img) {
          img.style.display = 'none';
        }
      }, 'image/jpeg', canvasQuality);

    } catch (error) {
      if (debug) {
        console.error('Canvas protection error:', error);
      }
    }
  }, [
    useCanvas,
    watermark,
    watermarkText,
    watermarkStyle,
    watermarkPosition,
    watermarkOpacity,
    addNoise,
    noiseIntensity,
    canvasQuality,
    debug
  ]);

  // Create invisible overlay
  const createOverlay = useCallback(() => {
    if (!imageRef.current || overlayRef.current) return;

    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      background: transparent;
      cursor: default;
      user-select: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
    `;
    
    // Position parent relatively if needed
    const parent = imageRef.current.parentElement;
    if (parent && window.getComputedStyle(parent).position === 'static') {
      parent.style.position = 'relative';
    }

    // Add overlay
    parent.appendChild(overlay);
    overlayRef.current = overlay;

    // Prevent events on overlay
    overlay.addEventListener('contextmenu', handleContextMenu);
    overlay.addEventListener('dragstart', handleDragStart);
    overlay.addEventListener('selectstart', handleSelectStart);
  }, [handleContextMenu, handleDragStart, handleSelectStart]);

  // Setup protection
  useEffect(() => {
    if (!imageRef.current) return;

    const img = imageRef.current;
    const handlers = [];

    // Add CSS protection
    img.style.userSelect = 'none';
    img.style.webkitUserSelect = 'none';
    img.style.mozUserSelect = 'none';
    img.style.msUserSelect = 'none';
    img.style.pointerEvents = 'none';
    img.setAttribute('draggable', 'false');
    
    // Add transparent overlay
    createOverlay();

    // Setup event listeners
    if (disableRightClick) {
      document.addEventListener('contextmenu', handleContextMenu);
      handlers.push(() => document.removeEventListener('contextmenu', handleContextMenu));
    }

    if (disableDrag) {
      document.addEventListener('dragstart', handleDragStart);
      handlers.push(() => document.removeEventListener('dragstart', handleDragStart));
    }

    if (disableSelection) {
      document.addEventListener('selectstart', handleSelectStart);
      handlers.push(() => document.removeEventListener('selectstart', handleSelectStart));
    }

    if (disableCopy) {
      document.addEventListener('copy', handleCopy);
      handlers.push(() => document.removeEventListener('copy', handleCopy));
    }

    if (disableHotkeys) {
      document.addEventListener('keydown', handleKeyDown);
      handlers.push(() => document.removeEventListener('keydown', handleKeyDown));
    }

    // Disable print
    if (disablePrint) {
      const style = document.createElement('style');
      style.textContent = `
        @media print {
          img[data-protected="true"] {
            display: none !important;
          }
        }
      `;
      document.head.appendChild(style);
      img.setAttribute('data-protected', 'true');
      handlers.push(() => {
        style.remove();
        img.removeAttribute('data-protected');
      });
    }

    // Setup dev tools detection
    if (disableDevTools) {
      devToolsCheckInterval.current = setInterval(detectDevTools, 1000);
    }

    // Create canvas protection
    if (useCanvas) {
      createCanvasProtection();
    }

    setIsProtected(true);

    // Cleanup
    return () => {
      handlers.forEach(handler => handler());
      
      if (devToolsCheckInterval.current) {
        clearInterval(devToolsCheckInterval.current);
      }
      
      if (overlayRef.current) {
        overlayRef.current.remove();
      }
      
      if (canvasUrl) {
        URL.revokeObjectURL(canvasUrl);
      }

      // Restore image styles
      if (img) {
        img.style.userSelect = '';
        img.style.pointerEvents = '';
        img.removeAttribute('draggable');
        img.style.display = '';
      }
    };
  }, [
    disableRightClick,
    disableDrag,
    disableSelection,
    disableCopy,
    disableHotkeys,
    disablePrint,
    disableDevTools,
    useCanvas,
    handleContextMenu,
    handleDragStart,
    handleSelectStart,
    handleCopy,
    handleKeyDown,
    detectDevTools,
    createCanvasProtection,
    createOverlay,
    canvasUrl
  ]);

  return {
    ref: imageRef,
    canvasRef,
    isProtected,
    protectionAttempts,
    canvasUrl,
    
    // Manual control methods
    protect: () => setIsProtected(true),
    unprotect: () => setIsProtected(false),
    resetAttempts: () => {
      attemptCountRef.current = 0;
      setProtectionAttempts(0);
    }
  };
};

/**
 * Batch image protection hook
 */
export const useImageProtectionBatch = (options = {}) => {
  const [protectedImages, setProtectedImages] = useState(new Map());
  
  const protectImage = useCallback((id, element, imageOptions = {}) => {
    const protection = {
      ...options,
      ...imageOptions
    };
    
    // Apply protection logic here
    setProtectedImages(prev => new Map(prev).set(id, {
      element,
      protection,
      isProtected: true
    }));
  }, [options]);
  
  const unprotectImage = useCallback((id) => {
    setProtectedImages(prev => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  }, []);
  
  const unprotectAll = useCallback(() => {
    setProtectedImages(new Map());
  }, []);
  
  return {
    protectedImages,
    protectImage,
    unprotectImage,
    unprotectAll
  };
};

export default useImageProtection;
