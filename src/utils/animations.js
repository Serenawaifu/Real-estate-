/**
 * Advanced Animation Utilities
 * Comprehensive animation functions with easing, sequencing, and performance optimizations
 */

// RequestAnimationFrame polyfill
const raf = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  ((callback) => window.setTimeout(callback, 1000 / 60));

const caf = window.cancelAnimationFrame ||
  window.webkitCancelAnimationFrame ||
  window.mozCancelAnimationFrame ||
  window.msCancelAnimationFrame ||
  ((id) => window.clearTimeout(id));

/**
 * Easing functions
 */
export const easings = {
  // Basic easings
  linear: t => t,
  easeIn: t => t * t,
  easeOut: t => t * (2 - t),
  easeInOut: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  
  // Quad
  easeInQuad: t => t * t,
  easeOutQuad: t => t * (2 - t),
  easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  
  // Cubic
  easeInCubic: t => t * t * t,
  easeOutCubic: t => (--t) * t * t + 1,
  easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  
  // Quart
  easeInQuart: t => t * t * t * t,
  easeOutQuart: t => 1 - (--t) * t * t * t,
  easeInOutQuart: t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
  
  // Quint
  easeInQuint: t => t * t * t * t * t,
  easeOutQuint: t => 1 + (--t) * t * t * t * t,
  easeInOutQuint: t => t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t,
  
  // Sine
  easeInSine: t => 1 - Math.cos(t * Math.PI / 2),
  easeOutSine: t => Math.sin(t * Math.PI / 2),
  easeInOutSine: t => -(Math.cos(Math.PI * t) - 1) / 2,
  
  // Expo
  easeInExpo: t => t === 0 ? 0 : Math.pow(2, 10 * t - 10),
  easeOutExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  easeInOutExpo: t => {
    if (t === 0 || t === 1) return t;
    if (t < 0.5) return Math.pow(2, 20 * t - 10) / 2;
    return (2 - Math.pow(2, -20 * t + 10)) / 2;
  },
  
  // Circ
  easeInCirc: t => 1 - Math.sqrt(1 - t * t),
  easeOutCirc: t => Math.sqrt(1 - (--t) * t),
  easeInOutCirc: t => t < 0.5
    ? (1 - Math.sqrt(1 - 4 * t * t)) / 2
    : (Math.sqrt(1 - 4 * (t - 1) * (t - 1)) + 1) / 2,
  
  // Elastic
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
  
  // Back
  easeInBack: t => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return c3 * t * t * t - c1 * t * t;
  },
  easeOutBack: t => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * (t - 1) * (t - 1) * (t - 1) + c1 * (t - 1) * (t - 1);
  },
  easeInOutBack: t => {
    const c1 = 1.70158;
    const c2 = c1 * 1.525;
    return t < 0.5
      ? (2 * t * 2 * t * ((c2 + 1) * 2 * t - c2)) / 2
      : ((2 * t - 2) * (2 * t - 2) * ((c2 + 1) * (2 * t - 2) + c2) + 2) / 2;
  },
  
  // Bounce
  easeInBounce: t => 1 - easings.easeOutBounce(1 - t),
  easeOutBounce: t => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (t < 1 / d1) return n1 * t * t;
    if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
    if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  },
  easeInOutBounce: t => t < 0.5
    ? (1 - easings.easeOutBounce(1 - 2 * t)) / 2
    : (1 + easings.easeOutBounce(2 * t - 1)) / 2,
};

/**
 * Core animation function
 */
export function animate({
  from = 0,
  to = 1,
  duration = 1000,
  delay = 0,
  easing = easings.easeInOut,
  onUpdate,
  onComplete,
  onStart,
  onCancel
}) {
  let startTime = null;
  let animationId = null;
  let cancelled = false;
  let started = false;

  const animation = (timestamp) => {
    if (cancelled) {
      if (onCancel) onCancel();
      return;
    }

    if (!startTime) {
      startTime = timestamp + delay;
    }

    const elapsed = timestamp - startTime;

    if (elapsed < 0) {
      animationId = raf(animation);
      return;
    }

    if (!started) {
      started = true;
      if (onStart) onStart();
    }

    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easing(progress);
    const value = from + (to - from) * easedProgress;

    if (onUpdate) onUpdate(value, progress);

    if (progress < 1) {
      animationId = raf(animation);
    } else {
      if (onComplete) onComplete(to);
    }
  };

  animationId = raf(animation);

  return {
    cancel: () => {
      cancelled = true;
      if (animationId) caf(animationId);
    },
    pause: () => {
      if (animationId) caf(animationId);
    },
    resume: () => {
      if (!cancelled) animationId = raf(animation);
    }
  };
}

/**
 * Animate multiple properties
 */
export function animateProperties({
  target,
  properties,
  duration = 1000,
  delay = 0,
  easing = easings.easeInOut,
  onUpdate,
  onComplete
}) {
  const animations = [];
  const initialValues = {};
  const targetValues = {};

  // Store initial and target values
  Object.entries(properties).forEach(([prop, value]) => {
    initialValues[prop] = parseFloat(getComputedStyle(target)[prop]) || 0;
    targetValues[prop] = value;
  });

  const updateProperties = () => {
    const currentValues = {};
    let allComplete = true;

    animations.forEach((anim, index) => {
      const prop = Object.keys(properties)[index];
      if (anim.progress < 1) {
        allComplete = false;
      }
      currentValues[prop] = anim.currentValue;
    });

    if (onUpdate) onUpdate(currentValues);

    // Apply styles
    Object.entries(currentValues).forEach(([prop, value]) => {
      if (prop === 'opacity') {
        target.style[prop] = value;
      } else if (prop === 'transform') {
        target.style[prop] = value;
      } else {
        target.style[prop] = `${value}px`;
      }
    });

    if (allComplete && onComplete) {
      onComplete();
    }
  };

  // Create animations for each property
  Object.entries(properties).forEach(([prop, targetValue]) => {
    const anim = {
      progress: 0,
      currentValue: initialValues[prop]
    };

    animations.push(anim);

    animate({
      from: initialValues[prop],
      to: targetValue,
      duration,
      delay,
      easing,
      onUpdate: (value, progress) => {
        anim.currentValue = value;
        anim.progress = progress;
        updateProperties();
      }
    });
  });

  return {
    cancel: () => animations.forEach(anim => anim.cancel && anim.cancel())
  };
}

/**
 * Sequence of animations
 */
export async function sequence(animations) {
  const results = [];
  
  for (const anim of animations) {
    const result = await new Promise((resolve) => {
      const animation = typeof anim === 'function' ? anim() : anim;
      
      if (animation && animation.then) {
        // Handle promises
        animation.then(resolve);
      } else if (animation && animation.onComplete) {
        // Handle animation objects
        const originalOnComplete = animation.onComplete;
        animation.onComplete = (...args) => {
          if (originalOnComplete) originalOnComplete(...args);
          resolve(...args);
        };
      } else {
        // Immediate resolution
        resolve(animation);
      }
    });
    
    results.push(result);
  }
  
  return results;
}

/**
 * Parallel animations
 */
export function parallel(animations) {
  return Promise.all(animations.map(anim => {
    return new Promise((resolve) => {
      const animation = typeof anim === 'function' ? anim() : anim;
      
      if (animation && animation.then) {
        animation.then(resolve);
      } else if (animation && animation.onComplete) {
        const originalOnComplete = animation.onComplete;
        animation.onComplete = (...args) => {
          if (originalOnComplete) originalOnComplete(...args);
          resolve(...args);
        };
      } else {
        resolve(animation);
      }
    });
  }));
}

/**
 * Stagger animations
 */
export function stagger(elements, animationConfig, staggerDelay = 100) {
  const animations = [];
  
  elements.forEach((element, index) => {
    const config = { ...animationConfig };
    config.delay = (config.delay || 0) + (index * staggerDelay);
    
    if (config.target) {
      animations.push(() => animateProperties({ ...config, target: element }));
    } else {
      animations.push(() => animate(config));
    }
  });
  
  return parallel(animations);
}

/**
 * Spring physics animation
 */
export function spring({
  from = 0,
  to = 1,
  stiffness = 100,
  damping = 10,
  mass = 1,
  velocity = 0,
  onUpdate,
  onComplete,
  threshold = 0.001
}) {
  let position = from;
  let currentVelocity = velocity;
  let animationId = null;
  let lastTime = null;

  const animation = (timestamp) => {
    if (!lastTime) lastTime = timestamp;
    
    const deltaTime = Math.min((timestamp - lastTime) / 1000, 0.064); // Cap at ~60fps
    lastTime = timestamp;

    // Spring physics
    const springForce = -stiffness * (position - to);
    const dampingForce = -damping * currentVelocity;
    const acceleration = (springForce + dampingForce) / mass;
    
    currentVelocity += acceleration * deltaTime;
    position += currentVelocity * deltaTime;

    if (onUpdate) onUpdate(position);

    // Check if animation should continue
    const isOscillating = Math.abs(currentVelocity) > threshold;
    const isDisplaced = Math.abs(to - position) > threshold;

    if (isOscillating || isDisplaced) {
      animationId = raf(animation);
    } else {
      position = to;
      if (onUpdate) onUpdate(position);
      if (onComplete) onComplete(position);
    }
  };

  animationId = raf(animation);

  return {
    cancel: () => {
      if (animationId) caf(animationId);
    }
  };
}

/**
 * Morph between two paths
 */
export function morphPath({
  fromPath,
  toPath,
  duration = 1000,
  easing = easings.easeInOut,
  onUpdate,
  onComplete
}) {
  const interpolator = interpolatePath(fromPath, toPath);
  
  return animate({
    from: 0,
    to: 1,
    duration,
    easing,
    onUpdate: (progress) => {
      const interpolatedPath = interpolator(progress);
      if (onUpdate) onUpdate(interpolatedPath);
    },
    onComplete
  });
}

/**
 * Path interpolation helper
 */
function interpolatePath(from, to) {
  // Simple linear interpolation between path commands
  // This is a simplified version - for production, use a library like flubber
  return (t) => {
    // This would need more sophisticated path parsing
    return from; // Placeholder
  };
}

/**
 * Scroll-triggered animations
 */
export function scrollTrigger({
  element,
  onEnter,
  onLeave,
  onProgress,
  offset = 0,
  once = false
}) {
  let hasTriggered = false;
  
  const checkVisibility = () => {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const elementTop = rect.top;
    const elementBottom = rect.bottom;
    
    const isVisible = elementTop < windowHeight - offset && elementBottom > offset;
    const progress = Math.max(0, Math.min(1, 
      (windowHeight - elementTop) / (windowHeight + rect.height)
    ));
    
    if (isVisible && !hasTriggered) {
      hasTriggered = true;
      if (onEnter) onEnter(element);
    } else if (!isVisible && hasTriggered && !once) {
      hasTriggered = false;
      if (onLeave) onLeave(element);
    }
    
    if (isVisible && onProgress) {
      onProgress(progress);
    }
  };
  
  window.addEventListener('scroll', checkVisibility, { passive: true });
  window.addEventListener('resize', checkVisibility);
  checkVisibility(); // Initial check
  
  return {
    destroy: () => {
      window.removeEventListener('scroll', checkVisibility);
      window.removeEventListener('resize', checkVisibility);
    }
  };
}

/**
 * Typewriter effect
 */
export function typewriter({
  element,
  text,
  speed = 50,
  cursor = true,
  onComplete
}) {
  let index = 0;
  const originalHTML = element.innerHTML;
  element.innerHTML = '';
  
  if (cursor) {
    element.classList.add('typewriter-cursor');
  }
  
  const type = () => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
      setTimeout(type, speed + Math.random() * 50); // Add some randomness
    } else {
      if (cursor) {
        element.classList.remove('typewriter-cursor');
      }
      if (onComplete) onComplete();
    }
  };
  
  type();
  
  return {
    reset: () => {
      element.innerHTML = originalHTML;
      index = 0;
    }
  };
}

/**
 * Count animation
 */
export function countUp({
  element,
  start = 0,
  end = 100,
  duration = 2000,
  decimals = 0,
  prefix = '',
  suffix = '',
  separator = ',',
  easing = easings.easeOutQuad,
  onComplete
}) {
  const formatNumber = (num) => {
    const fixed = num.toFixed(decimals);
    if (separator) {
      const parts = fixed.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
      return parts.join('.');
    }
    return fixed;
  };
  
  return animate({
    from: start,
    to: end,
    duration,
    easing,
    onUpdate: (value) => {
      element.textContent = prefix + formatNumber(value) + suffix;
    },
    onComplete: () => {
      element.textContent = prefix + formatNumber(end) + suffix;
      if (onComplete) onComplete();
    }
  });
}

/**
 * Particle system
 */
export class ParticleSystem {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.options = {
      count: 100,
      speed: 2,
      size: 3,
      color: '#ffffff',
      shape: 'circle',
      gravity: 0,
      wind: 0,
      friction: 0.99,
      ...options
    };
    this.animationId = null;
  }

  createParticle() {
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      vx: (Math.random() - 0.5) * this.options.speed,
      vy: (Math.random() - 0.5) * this.options.speed,
      size: Math.random() * this.options.size + 1,
      life: 1,
      decay: 0.01 + Math.random() * 0.02
    };
  }

  init() {
    this.particles = Array.from({ length: this.options.count }, () => this.createParticle());
  }

  update() {
    this.particles.forEach((particle, index) => {
      // Apply forces
      particle.vx += this.options.wind;
      particle.vy += this.options.gravity;
      
      // Apply friction
      particle.vx *= this.options.friction;
      particle.vy *= this.options.friction;
      
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Update life
      particle.life -= particle.decay;
      
      // Respawn dead particles
      if (particle.life <= 0) {
        this.particles[index] = this.createParticle();
      }
      
      // Wrap around edges
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.y > this.canvas.height) particle.y = 0;
      if (particle.y < 0) particle.y = this.canvas.height;
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach(particle => {
      this.ctx.fillStyle = this.options.color;
      this.ctx.globalAlpha = particle.life;
      
      if (this.options.shape === 'circle') {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (this.options.shape === 'square') {
        this.ctx.fillRect(
          particle.x - particle.size / 2,
          particle.y - particle.size / 2,
          particle.size,
          particle.size
        );
      }
    });
    
    this.ctx.globalAlpha = 1;
  }

  animate() {
    this.update();
    this.draw();
    this.animationId = raf(() => this.animate());
  }

  start() {
    this.init();
    this.animate();
  }

  stop() {
    if (this.animationId) {
      caf(this.animationId);
    }
  }
}

/**
 * Utility functions
 */
export const utils = {
  // Debounce animation triggers
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle animation triggers
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Get transform values
  getTransform(element) {
    const style = window.getComputedStyle(element);
    const transform = style.transform || style.webkitTransform;
    
    if (transform === 'none') {
      return {
        translateX: 0,
        translateY: 0,
        rotate: 0,
        scaleX: 1,
        scaleY: 1
      };
    }
    
    // Parse transform matrix
    const values = transform.match(/matrix.*\((.+)\)/)[1].split(', ');
    return {
      translateX: parseFloat(values[4]),
      translateY: parseFloat(values[5]),
      scaleX: parseFloat(values[0]),
      scaleY: parseFloat(values[3])
    };
  },

  // Prefers reduced motion
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
};

// Export everything
export default {
  animate,
  animateProperties,
  sequence,
  parallel,
  stagger,
  spring,
  morphPath,
  scrollTrigger,
  typewriter,
  countUp,
  ParticleSystem,
  easings,
  utils
};
                
