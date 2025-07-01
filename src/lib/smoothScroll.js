/* ============================================
   ADVANCED SMOOTH SCROLL LIBRARY
   High-performance scrolling with animations
   ============================================ */

class SmoothScroll {
  constructor(options = {}) {
    // Configuration
    this.config = {
      // Scroll behavior
      duration: options.duration || 1000,
      easing: options.easing || 'easeInOutCubic',
      offset: options.offset || 0,
      updateURL: options.updateURL !== false,
      cancelOnUserAction: options.cancelOnUserAction !== false,
      
      // Features
      parallax: options.parallax !== false,
      scrollIndicator: options.scrollIndicator !== false,
      scrollReveal: options.scrollReveal !== false,
      stickyElements: options.stickyElements !== false,
      
      // Performance
      throttleDelay: options.throttleDelay || 10,
      
      // Accessibility
      focusOnComplete: options.focusOnComplete !== false,
      announceOnComplete: options.announceOnComplete !== false,
      
      // Callbacks
      onStart: options.onStart || null,
      onProgress: options.onProgress || null,
      onComplete: options.onComplete || null,
      onCancel: options.onCancel || null
    };

    // State
    this.isScrolling = false;
    this.scrollAnimation = null;
    this.observers = new Map();
    this.parallaxElements = [];
    this.stickyElements = [];
    this.revealElements = [];
    
    // Bind methods
    this.handleScroll = this.throttle(this.handleScroll.bind(this), this.config.throttleDelay);
    this.handleWheel = this.handleWheel.bind(this);
    this.handleTouch = this.handleTouch.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    
    // Initialize
    this.init();
  }

  /* ============================================
     INITIALIZATION
     ============================================ */
  init() {
    // Set up CSS for smooth behavior
    this.setupCSS();
    
    // Initialize features
    if (this.config.parallax) this.initParallax();
    if (this.config.scrollIndicator) this.initScrollIndicator();
    if (this.config.scrollReveal) this.initScrollReveal();
    if (this.config.stickyElements) this.initStickyElements();
    
    // Add event listeners
    this.addEventListeners();
    
    // Set up navigation links
    this.setupNavigationLinks();
  }

  setupCSS() {
    // Add smooth scroll behavior to HTML if not already present
    if (!document.documentElement.style.scrollBehavior) {
      document.documentElement.style.scrollBehavior = 'smooth';
    }
    
    // Add custom CSS for smooth scroll
    if (!document.getElementById('smooth-scroll-css')) {
      const style = document.createElement('style');
      style.id = 'smooth-scroll-css';
      style.textContent = `
        /* Smooth Scroll Styles */
        .smooth-scroll-indicator {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: var(--color-primary, #2563eb);
          transform-origin: left;
          transform: scaleX(0);
          transition: transform 0.1s ease;
          z-index: 9999;
        }
        
        .smooth-scroll-parallax {
          will-change: transform;
          transform: translateZ(0);
        }
        
        .smooth-scroll-reveal {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .smooth-scroll-reveal.revealed {
          opacity: 1;
          transform: translateY(0);
        }
        
        .smooth-scroll-sticky {
          position: sticky;
          z-index: 100;
        }
        
        /* Accessibility */
        .smooth-scroll-focus:focus {
          outline: 2px solid var(--color-primary, #2563eb);
          outline-offset: 2px;
        }
        
        /* Performance */
        .smooth-scroll-optimized {
          contain: layout;
          transform: translateZ(0);
        }
      `;
      document.head.appendChild(style);
    }
  }

  /* ============================================
     EASING FUNCTIONS
     ============================================ */
  easingFunctions = {
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
    easeInQuint: t => t * t * t * t * t,
    easeOutQuint: t => 1 + (--t) * t * t * t * t,
    easeInOutQuint: t => t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t,
    easeInSine: t => 1 - Math.cos(t * Math.PI / 2),
    easeOutSine: t => Math.sin(t * Math.PI / 2),
    easeInOutSine: t => -(Math.cos(Math.PI * t) - 1) / 2,
    easeInExpo: t => t === 0 ? 0 : Math.pow(2, 10 * (t - 1)),
    easeOutExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
    easeInOutExpo: t => {
      if (t === 0 || t === 1) return t;
      if (t < 0.5) return Math.pow(2, 20 * t - 10) / 2;
      return (2 - Math.pow(2, -20 * t + 10)) / 2;
    },
    easeInCirc: t => 1 - Math.sqrt(1 - t * t),
    easeOutCirc: t => Math.sqrt(1 - (--t) * t),
    easeInOutCirc: t => t < 0.5 
      ? (1 - Math.sqrt(1 - 4 * t * t)) / 2 
      : (Math.sqrt(1 - (-2 * t + 2) * (-2 * t + 2)) + 1) / 2,
    easeInElastic: t => {
      if (t === 0 || t === 1) return t;
      const p = 0.3;
      const s = p / 4;
      return -(Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1 - s) * (2 * Math.PI) / p));
    },
    easeOutElastic: t => {
      if (t === 0 || t === 1) return t;
      const p = 0.3;
      const s = p / 4;
      return Math.pow(2, -10 * t) * Math.sin((t - s) * (2 * Math.PI) / p) + 1;
    },
    easeInOutElastic: t => {
      if (t === 0 || t === 1) return t;
      const p = 0.3 * 1.5;
      const s = p / 4;
      if (t < 0.5) {
        return -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 10 - s) * (2 * Math.PI) / p)) / 2;
      }
      return (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 10 - s) * (2 * Math.PI) / p)) / 2 + 1;
    },
    easeInBack: t => {
      const s = 1.70158;
      return t * t * ((s + 1) * t - s);
    },
    easeOutBack: t => {
      const s = 1.70158;
      return (--t) * t * ((s + 1) * t + s) + 1;
    },
    easeInOutBack: t => {
      const s = 1.70158 * 1.525;
      if (t < 0.5) {
        return (t * t * ((s + 1) * 2 * t - s)) / 2;
      }
      return ((t - 2) * (t - 2) * ((s + 1) * (t - 2) + s) + 2) / 2;
    },
    easeInBounce: t => 1 - this.easingFunctions.easeOutBounce(1 - t),
    easeOutBounce: t => {
      if (t < 1 / 2.75) {
        return 7.5625 * t * t;
      } else if (t < 2 / 2.75) {
        return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
      } else if (t < 2.5 / 2.75) {
        return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
      } else {
        return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
      }
    },
    easeInOutBounce: t => t < 0.5 
      ? this.easingFunctions.easeInBounce(t * 2) / 2 
      : this.easingFunctions.easeOutBounce(t * 2 - 1) / 2 + 0.5
  };

  /* ============================================
     SCROLL METHODS
     ============================================ */
  scrollTo(target, options = {}) {
    // Merge options with defaults
    const config = { ...this.config, ...options };
    
    // Get target position
    let targetPosition;
    if (typeof target === 'number') {
      targetPosition = target;
    } else if (typeof target === 'string') {
      const element = document.querySelector(target);
      if (!element) {
        console.error(`Element not found: ${target}`);
        return Promise.reject(new Error('Target element not found'));
      }
      targetPosition = this.getElementOffset(element);
    } else if (target instanceof Element) {
      targetPosition = this.getElementOffset(target);
    } else {
      return Promise.reject(new Error('Invalid target'));
    }
    
    // Apply offset
    targetPosition += config.offset;
    
    // Cancel any ongoing scroll
    if (this.isScrolling) {
      this.cancelScroll();
    }
    
    // Start scroll
    return this.animateScroll(targetPosition, config);
  }

  animateScroll(targetPosition, config) {
    return new Promise((resolve, reject) => {
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      const startTime = performance.now();
      const easingFunction = this.easingFunctions[config.easing] || this.easingFunctions.easeInOutCubic;
      
      // Trigger onStart callback
      if (config.onStart) {
        config.onStart({
          start: startPosition,
          target: targetPosition,
          distance: distance
        });
      }
      
      // Set scrolling flag
      this.isScrolling = true;
      
      // Animation function
      const animate = (currentTime) => {
        if (!this.isScrolling) {
          if (config.onCancel) config.onCancel();
          reject(new Error('Scroll cancelled'));
          return;
        }
        
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / config.duration, 1);
        const easedProgress = easingFunction(progress);
        const currentPosition = startPosition + (distance * easedProgress);
        
        // Scroll to position
        window.scrollTo(0, currentPosition);
        
        // Trigger onProgress callback
        if (config.onProgress) {
          config.onProgress({
            progress: progress,
            current: currentPosition,
            target: targetPosition
          });
        }
        
        // Update scroll indicator
        if (this.config.scrollIndicator && this.scrollIndicator) {
          this.updateScrollIndicator();
        }
        
        // Continue animation or complete
        if (progress < 1) {
          this.scrollAnimation = requestAnimationFrame(animate);
        } else {
          this.completeScroll(targetPosition, config);
          resolve();
        }
      };
      
      // Start animation
      this.scrollAnimation = requestAnimationFrame(animate);
    });
  }

  completeScroll(targetPosition, config) {
    this.isScrolling = false;
    this.scrollAnimation = null;
    
    // Ensure exact position
    window.scrollTo(0, targetPosition);
    
    // Update URL if needed
    if (config.updateURL && config.target && typeof config.target === 'string') {
      history.pushState(null, null, config.target);
    }
    
    // Focus on target element
    if (config.focusOnComplete && config.targetElement) {
      config.targetElement.setAttribute('tabindex', '-1');
      config.targetElement.classList.add('smooth-scroll-focus');
      config.targetElement.focus();
    }
    
    // Announce completion for screen readers
    if (config.announceOnComplete) {
      this.announceScrollComplete();
    }
    
    // Trigger onComplete callback
    if (config.onComplete) {
      config.onComplete({
        position: targetPosition
      });
    }
  }

  cancelScroll() {
    this.isScrolling = false;
    if (this.scrollAnimation) {
      cancelAnimationFrame(this.scrollAnimation);
      this.scrollAnimation = null;
    }
  }

  /* ============================================
     PARALLAX EFFECTS
     ============================================ */
  initParallax() {
    // Find all parallax elements
    const elements = document.querySelectorAll('[data-parallax]');
    
    elements.forEach(element => {
      const config = {
        element: element,
        speed: parseFloat(element.dataset.parallaxSpeed) || 0.5,
        offset: parseFloat(element.dataset.parallaxOffset) || 0,
        min: parseFloat(element.dataset.parallaxMin) || -Infinity,
        max: parseFloat(element.dataset.parallaxMax) || Infinity
      };
      
      this.parallaxElements.push(config);
      element.classList.add('smooth-scroll-parallax');
    });
    
    // Initial parallax update
    this.updateParallax();
  }

  updateParallax() {
    const scrolled = window.pageYOffset;
    const windowHeight = window.innerHeight;
    
    this.parallaxElements.forEach(config => {
      const { element, speed, offset, min, max } = config;
      const elementTop = element.getBoundingClientRect().top + scrolled;
      const elementHeight = element.offsetHeight;
      const elementBottom = elementTop + elementHeight;
      
      // Check if element is in viewport
      if (elementBottom >= scrolled && elementTop <= scrolled + windowHeight) {
        const distance = scrolled - elementTop + windowHeight;
        const percentage = distance / (windowHeight + elementHeight);
        let parallax = -(percentage * 100 * speed) + offset;
        
        // Apply min/max constraints
        parallax = Math.max(min, Math.min(max, parallax));
        
        // Apply transform
        element.style.transform = `translate3d(0, ${parallax}px, 0)`;
      }
    });
  }

  /* ============================================
     SCROLL INDICATOR
     ============================================ */
  initScrollIndicator() {
    // Create indicator element
    this.scrollIndicator = document.createElement('div');
    this.scrollIndicator.className = 'smooth-scroll-indicator';
    this.scrollIndicator.setAttribute('role', 'progressbar');
    this.scrollIndicator.setAttribute('aria-valuemin', '0');
    this.scrollIndicator.setAttribute('aria-valuemax', '100');
    document.body.appendChild(this.scrollIndicator);
    
    // Initial update
    this.updateScrollIndicator();
  }

  updateScrollIndicator() {
    if (!this.scrollIndicator) return;
    
    const scrolled = window.pageYOffset;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(scrolled / maxScroll, 1);
    const percentage = Math.round(progress * 100);
    
    this.scrollIndicator.style.transform = `scaleX(${progress})`;
    this.scrollIndicator.setAttribute('aria-valuenow', percentage);
    this.scrollIndicator.setAttribute('aria-valuetext', `${percentage}% scrolled`);
  }

  /* ============================================
     SCROLL REVEAL
     ============================================ */
  initScrollReveal() {
    // Find all reveal elements
    const elements = document.querySelectorAll('[data-reveal]');
    
    elements.forEach(element => {
      const config = {
        threshold: parseFloat(element.dataset.revealThreshold) || 0.1,
        delay: parseFloat(element.dataset.revealDelay) || 0,
        duration: parseFloat(element.dataset.revealDuration) || 600,
        once: element.dataset.revealOnce !== 'false'
      };
      
      element.classList.add('smooth-scroll-reveal');
      
      // Set up custom transition
      element.style.transitionDuration = `${config.duration}ms`;
      element.style.transitionDelay = `${config.delay}ms`;
      
      // Create intersection observer
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            
            // Trigger custom event
            entry.target.dispatchEvent(new CustomEvent('reveal', {
              detail: { entry }
            }));
            
            // Disconnect if only revealing once
            if (config.once) {
              observer.unobserve(entry.target);
            }
          } else if (!config.once) {
            entry.target.classList.remove('revealed');
          }
        });
      }, {
        threshold: config.threshold,
        rootMargin: '0px 0px -10% 0px'
      });
      
      observer.observe(element);
      this.observers.set(element, observer);
    });
  }

  /* ============================================
     STICKY ELEMENTS
     ============================================ */
  initStickyElements() {
    // Find all sticky elements
    const elements = document.querySelectorAll('[data-sticky]');
    
    elements.forEach(element => {
      const config = {
        element: element,
        top: element.dataset.stickyTop || '0',
        zIndex: element.dataset.stickyZIndex || '100',
        activeClass: element.dataset.stickyClass || 'is-sticky'
      };
      
      element.classList.add('smooth-scroll-sticky');
      element.style.top = config.top;
      element.style.zIndex = config.zIndex;
      
      // Create sentinel element
      const sentinel = document.createElement('div');
      sentinel.style.position = 'absolute';
      sentinel.style.top = `-${element.offsetHeight}px`;
      sentinel.style.height = '1px';
      element.parentElement.insertBefore(sentinel, element);
      
      // Create intersection observer for sticky state
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) {
            element.classList.add(config.activeClass);
          } else {
            element.classList.remove(config.activeClass);
          }
        });
      }, {
        threshold: 0
      });
      
      observer.observe(sentinel);
      this.observers.set(sentinel, observer);
      this.stickyElements.push(config);
    });
  }

  /* ============================================
     EVENT HANDLERS
     ============================================ */
  addEventListeners() {
    // Scroll event
    window.addEventListener('scroll', this.handleScroll, { passive: true });
    window.addEventListener('resize', this.handleScroll, { passive: true });
    
    // Cancel scroll on user interaction
    if (this.config.cancelOnUserAction) {
      window.addEventListener('wheel', this.handleWheel, { passive: true });
      window.addEventListener('touchstart', this.handleTouch, { passive: true });
      window.addEventListener('keydown', this.handleKeydown, { passive: true });
    }
  }

  handleScroll() {
    // Update parallax
    if (this.config.parallax) {
      this.updateParallax();
    }
    
    // Update scroll indicator
    if (this.config.scrollIndicator) {
      this.updateScrollIndicator();
    }
    
    // Custom scroll event
    window.dispatchEvent(new CustomEvent('smoothscroll', {
      detail: {
        position: window.pageYOffset,
        direction: this.getScrollDirection()
      }
    }));
  }

  handleWheel(e) {
    if (this.isScrolling && Math.abs(e.deltaY) > 0) {
      this.cancelScroll();
    }
  }

  handleTouch() {
    if (this.isScrolling) {
      this.cancelScroll();
    }
  }

  handleKeydown(e) {
    const keysToCancel = ['Space', 'PageUp', 'PageDown', 'Home', 'End', 'ArrowUp', 'ArrowDown'];
    if (this.isScrolling && keysToCancel.includes(e.code)) {
      this.cancelScroll();
    }
  }

  /* ============================================
     NAVIGATION SETUP
     ============================================ */
  setupNavigationLinks() {
    // Find all links with hash
    const links = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const hash = link.getAttribute('href');
        const target = document.querySelector(hash);
        
        if (target) {
          e.preventDefault();
          
          this.scrollTo(target, {
            offset: parseInt(link.dataset.offset) || this.config.offset,
            duration: parseInt(link.dataset.duration) || this.config.duration,
            easing: link.dataset.easing || this.config.easing,
            targetElement: target,
            target: hash
          }).catch(error => {
            console.error('Smooth scroll error:', error);
          });
        }
      });
    });
  }

  /* ============================================
     UTILITY METHODS
     ============================================ */
  getElementOffset(element) {
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return rect.top + scrollTop;
  }

  getScrollDirection() {
    const currentScroll = window.pageYOffset;
    const direction = currentScroll > (this.lastScroll || 0) ? 'down' : 'up';
    this.lastScroll = currentScroll;
    return direction;
  }

  throttle(func, delay) {
    let lastCall = 0;
    return function (...args) {
      const now = new Date().getTime();
      if (now - lastCall < delay) return;
      lastCall = now;
      return func(...args);
    };
  }

  announceScrollComplete() {
    // Create announcement for screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    announcement.textContent = 'Scroll complete';
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  /* ============================================
     PUBLIC API
     ============================================ */
  
  // Scroll to top
  scrollToTop(options = {}) {
    return this.scrollTo(0, options);
  }
  
  // Scroll to bottom
  scrollToBottom(options = {}) {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    return this.scrollTo(maxScroll, options);
  }
  
  // Get scroll progress
  getScrollProgress() {
    const scrolled = window.pageYOffset;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    return Math.min(scrolled / maxScroll, 1);
  }
  
  // Add parallax element dynamically
  addParallaxElement(element, config = {}) {
    const parallaxConfig = {
      element: element,
      speed: config.speed || 0.5,
      offset: config.offset || 0,
      min: config.min || -Infinity,
      max: config.max || Infinity
    };
    
    this.parallaxElements.push(parallaxConfig);
    element.classList.add('smooth-scroll-parallax');
    this.updateParallax();
  }
  
  // Remove parallax element
  removeParallaxElement(element) {
    const index = this.parallaxElements.findIndex(config => config.element === element);
    if (index > -1) {
      this.parallaxElements.splice(index, 1);
      element.classList.remove('smooth-scroll-parallax');
      element.style.transform = '';
    }
  }
  
  // Update configuration
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }
  
  // Destroy instance
  destroy() {
    // Cancel any ongoing scroll
    this.cancelScroll();
    
    // Remove event listeners
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleScroll);
    window.removeEventListener('wheel', this.handleWheel);
    window.removeEventListener('touchstart', this.handleTouch);
    window.removeEventListener('keydown', this.handleKeydown);
    
    // Clean up observers
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    
    // Remove scroll indicator
    if (this.scrollIndicator) {
      this.scrollIndicator.remove();
    }
    
    // Reset parallax elements
    this.parallaxElements.forEach(config => {
      config.element.classList.remove('smooth-scroll-parallax');
      config.element.style.transform = '';
    });
    this.parallaxElements = [];
    
    // Reset reveal elements
    document.querySelectorAll('.smooth-scroll-reveal').forEach(element => {
      element.classList.remove('smooth-scroll-reveal', 'revealed');
    });
    
    // Reset sticky elements
    this.stickyElements.forEach(config => {
      config.element.classList.remove('smooth-scroll-sticky');
    });
    this.stickyElements = [];
  }
}

/* ============================================
   SMOOTH SCROLL PRESETS
   ============================================ */
const SmoothScrollPresets = {
  default: {
    duration: 1000,
    easing: 'easeInOutCubic',
    offset: 0
  },
  
  fast: {
    duration: 500,
    easing: 'easeOutQuad',
    offset: 0
  },
  
  slow: {
    duration: 2000,
    easing: 'easeInOutQuart',
    offset: 0
  },
  
  bounce: {
    duration: 1500,
    easing: 'easeOutBounce',
    offset: 0
  },
  
  elastic: {
    duration: 1200,
    easing: 'easeOutElastic',
    offset: 0
  },
  
  smooth: {
    duration: 800,
    easing: 'easeInOutSine',
    offset: 0
  }
};

/* ============================================
   EXPORT
   ============================================ */
// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SmoothScroll, SmoothScrollPresets };
}

// Export for ES6 modules
export { SmoothScroll, SmoothScrollPresets };

// Also attach to window for direct browser use
if (typeof window !== 'undefined') {
  window.SmoothScroll = SmoothScroll;
  window.SmoothScrollPresets = SmoothScrollPresets;
}
