/* ============================================
   ADVANCED PARTICLE SYSTEM
   High-performance, customizable particle effects
   ============================================ */

class ParticleSystem {
  constructor(options = {}) {
    // Default configuration
    this.config = {
      container: options.container || document.body,
      canvas: null,
      particleCount: options.particleCount || 100,
      particleTypes: options.particleTypes || ['default'],
      colors: options.colors || ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'],
      backgroundGradient: options.backgroundGradient || null,
      interactive: options.interactive !== false,
      mouse: {
        radius: options.mouseRadius || 150,
        force: options.mouseForce || 0.03
      },
      performance: {
        maxParticles: options.maxParticles || 500,
        adaptiveCount: options.adaptiveCount !== false,
        fps: options.targetFps || 60,
        quality: options.quality || 'high' // 'low', 'medium', 'high'
      },
      physics: {
        gravity: options.gravity || { x: 0, y: 0 },
        wind: options.wind || { x: 0, y: 0 },
        friction: options.friction || 0.99,
        bounce: options.bounce || 0.8
      },
      effects: {
        connections: options.connections !== false,
        connectionDistance: options.connectionDistance || 120,
        connectionOpacity: options.connectionOpacity || 0.2,
        glow: options.glow || false,
        trail: options.trail || false,
        parallax: options.parallax || false,
        parallaxDepth: options.parallaxDepth || 3
      },
      bounds: {
        type: options.boundsType || 'bounce', // 'bounce', 'wrap', 'remove'
        padding: options.boundsPadding || 50
      }
    };

    // Runtime properties
    this.particles = [];
    this.animationId = null;
    this.ctx = null;
    this.mouse = { x: 0, y: 0, isActive: false };
    this.dimensions = { width: 0, height: 0 };
    this.performance = {
      fps: 0,
      frameTime: 0,
      lastTime: 0,
      deltaTime: 1,
      adaptiveMultiplier: 1
    };
    this.isInitialized = false;
    this.isPaused = false;

    // Bind methods
    this.handleResize = this.handleResize.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.animate = this.animate.bind(this);

    // Initialize
    this.init();
  }

  /* ============================================
     INITIALIZATION
     ============================================ */
  init() {
    // Create canvas
    this.createCanvas();
    
    // Set initial dimensions
    this.updateDimensions();
    
    // Create particles
    this.createParticles();
    
    // Add event listeners
    this.addEventListeners();
    
    // Start animation
    this.start();
    
    this.isInitialized = true;
  }

  createCanvas() {
    this.config.canvas = document.createElement('canvas');
    this.config.canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
    `;
    
    this.config.container.style.position = 'relative';
    this.config.container.appendChild(this.config.canvas);
    this.ctx = this.config.canvas.getContext('2d', {
      alpha: true,
      willReadFrequently: false
    });

    // Enable GPU acceleration
    this.config.canvas.style.transform = 'translateZ(0)';
    this.config.canvas.style.willChange = 'transform';
  }

  updateDimensions() {
    const rect = this.config.container.getBoundingClientRect();
    this.dimensions.width = rect.width;
    this.dimensions.height = rect.height;
    
    // Update canvas size
    this.config.canvas.width = this.dimensions.width * window.devicePixelRatio;
    this.config.canvas.height = this.dimensions.height * window.devicePixelRatio;
    this.config.canvas.style.width = `${this.dimensions.width}px`;
    this.config.canvas.style.height = `${this.dimensions.height}px`;
    
    // Scale for retina displays
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  /* ============================================
     PARTICLE CREATION
     ============================================ */
  createParticles() {
    const count = this.getAdaptiveParticleCount();
    this.particles = [];
    
    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle());
    }
  }

  createParticle(x, y) {
    const type = this.config.particleTypes[
      Math.floor(Math.random() * this.config.particleTypes.length)
    ];
    
    return new Particle({
      x: x || Math.random() * this.dimensions.width,
      y: y || Math.random() * this.dimensions.height,
      type: type,
      color: this.config.colors[
        Math.floor(Math.random() * this.config.colors.length)
      ],
      system: this
    });
  }

  getAdaptiveParticleCount() {
    if (!this.config.performance.adaptiveCount) {
      return this.config.particleCount;
    }

    // Adjust particle count based on screen size and device capabilities
    const screenArea = this.dimensions.width * this.dimensions.height;
    const baseArea = 1920 * 1080;
    const areaRatio = screenArea / baseArea;
    
    // Check device capabilities
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isLowEnd = navigator.hardwareConcurrency <= 2;
    
    let multiplier = areaRatio;
    if (isMobile) multiplier *= 0.5;
    if (isLowEnd) multiplier *= 0.5;
    
    const adaptiveCount = Math.floor(this.config.particleCount * multiplier);
    return Math.max(10, Math.min(adaptiveCount, this.config.performance.maxParticles));
  }

  /* ============================================
     EVENT HANDLERS
     ============================================ */
  addEventListeners() {
    // Resize handler with debouncing
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(this.handleResize, 250);
    });

    // Mouse interaction
    if (this.config.interactive) {
      this.config.container.addEventListener('mousemove', this.handleMouseMove);
      this.config.container.addEventListener('mouseenter', this.handleMouseEnter);
      this.config.container.addEventListener('mouseleave', this.handleMouseLeave);
      
      // Touch support
      this.config.container.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        this.handleMouseMove({
          clientX: touch.clientX,
          clientY: touch.clientY
        });
      });
    }

    // Visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pause();
      } else {
        this.resume();
      }
    });
  }

  handleResize() {
    this.updateDimensions();
    
    // Reposition particles to fit new dimensions
    this.particles.forEach(particle => {
      particle.x = Math.min(particle.x, this.dimensions.width);
      particle.y = Math.min(particle.y, this.dimensions.height);
    });
  }

  handleMouseMove(e) {
    const rect = this.config.container.getBoundingClientRect();
    this.mouse.x = e.clientX - rect.left;
    this.mouse.y = e.clientY - rect.top;
  }

  handleMouseEnter() {
    this.mouse.isActive = true;
  }

  handleMouseLeave() {
    this.mouse.isActive = false;
  }

  /* ============================================
     ANIMATION LOOP
     ============================================ */
  animate(currentTime) {
    if (this.isPaused) return;

    // Calculate delta time
    if (this.performance.lastTime === 0) {
      this.performance.lastTime = currentTime;
    }
    
    this.performance.deltaTime = (currentTime - this.performance.lastTime) / 16.67;
    this.performance.deltaTime = Math.min(this.performance.deltaTime, 2);
    this.performance.lastTime = currentTime;

    // Update FPS
    this.performance.frameTime++;
    if (currentTime - this.performance.fps >= 1000) {
      this.performance.fps = currentTime;
      this.performance.adaptiveMultiplier = 
        this.performance.frameTime < this.config.performance.fps * 0.9 ? 0.8 : 1;
      this.performance.frameTime = 0;
    }

    // Clear canvas
    if (this.config.effects.trail) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      this.ctx.fillRect(0, 0, this.dimensions.width, this.dimensions.height);
    } else {
      this.ctx.clearRect(0, 0, this.dimensions.width, this.dimensions.height);
    }

    // Apply background gradient if specified
    if (this.config.backgroundGradient) {
      this.drawBackgroundGradient();
    }

    // Update and draw particles
    this.updateParticles();
    
    // Draw connections
    if (this.config.effects.connections) {
      this.drawConnections();
    }

    // Continue animation
    this.animationId = requestAnimationFrame(this.animate);
  }

  updateParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      
      // Update particle
      particle.update(this.performance.deltaTime);
      
      // Apply physics
      this.applyPhysics(particle);
      
      // Apply mouse interaction
      if (this.config.interactive && this.mouse.isActive) {
        this.applyMouseInteraction(particle);
      }
      
      // Handle bounds
      if (!this.handleBounds(particle)) {
        // Remove particle if needed
        if (this.config.bounds.type === 'remove') {
          this.particles.splice(i, 1);
          this.particles.push(this.createParticle());
        }
      }
      
      // Draw particle
      particle.draw(this.ctx);
    }
  }

  applyPhysics(particle) {
    // Apply gravity
    particle.vx += this.config.physics.gravity.x * this.performance.deltaTime;
    particle.vy += this.config.physics.gravity.y * this.performance.deltaTime;
    
    // Apply wind
    particle.vx += this.config.physics.wind.x * this.performance.deltaTime;
    particle.vy += this.config.physics.wind.y * this.performance.deltaTime;
    
    // Apply friction
    particle.vx *= this.config.physics.friction;
    particle.vy *= this.config.physics.friction;
  }

  applyMouseInteraction(particle) {
    const dx = this.mouse.x - particle.x;
    const dy = this.mouse.y - particle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < this.config.mouse.radius) {
      const force = (1 - distance / this.config.mouse.radius) * this.config.mouse.force;
      const angle = Math.atan2(dy, dx);
      
      // Repel particles from mouse
      particle.vx -= Math.cos(angle) * force * this.performance.deltaTime;
      particle.vy -= Math.sin(angle) * force * this.performance.deltaTime;
    }
  }

  handleBounds(particle) {
    const padding = this.config.bounds.padding;
    
    switch (this.config.bounds.type) {
      case 'bounce':
        if (particle.x - particle.radius < -padding || 
            particle.x + particle.radius > this.dimensions.width + padding) {
          particle.vx *= -this.config.physics.bounce;
          particle.x = Math.max(
            particle.radius - padding,
            Math.min(this.dimensions.width + padding - particle.radius, particle.x)
          );
        }
        if (particle.y - particle.radius < -padding || 
            particle.y + particle.radius > this.dimensions.height + padding) {
          particle.vy *= -this.config.physics.bounce;
          particle.y = Math.max(
            particle.radius - padding,
            Math.min(this.dimensions.height + padding - particle.radius, particle.y)
          );
        }
        return true;
        
      case 'wrap':
        if (particle.x < -padding) particle.x = this.dimensions.width + padding;
        if (particle.x > this.dimensions.width + padding) particle.x = -padding;
        if (particle.y < -padding) particle.y = this.dimensions.height + padding;
        if (particle.y > this.dimensions.height + padding) particle.y = -padding;
        return true;
        
      case 'remove':
        return !(particle.x < -padding || 
                particle.x > this.dimensions.width + padding ||
                particle.y < -padding || 
                particle.y > this.dimensions.height + padding);
        
      default:
        return true;
    }
  }

  /* ============================================
     RENDERING EFFECTS
     ============================================ */
  drawConnections() {
    const maxDistance = this.config.effects.connectionDistance;
    
    for (let i = 0; i < this.particles.length; i++) {
      const particleA = this.particles[i];
      
      for (let j = i + 1; j < this.particles.length; j++) {
        const particleB = this.particles[j];
        
        const dx = particleA.x - particleB.x;
        const dy = particleA.y - particleB.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * this.config.effects.connectionOpacity;
          
          this.ctx.beginPath();
          this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
          this.ctx.lineWidth = 1;
          this.ctx.moveTo(particleA.x, particleA.y);
          this.ctx.lineTo(particleB.x, particleB.y);
          this.ctx.stroke();
        }
      }
    }
  }

  drawBackgroundGradient() {
    const gradient = this.ctx.createRadialGradient(
      this.dimensions.width / 2,
      this.dimensions.height / 2,
      0,
      this.dimensions.width / 2,
      this.dimensions.height / 2,
      Math.max(this.dimensions.width, this.dimensions.height) / 2
    );
    
    this.config.backgroundGradient.forEach((color, index) => {
      gradient.addColorStop(
        index / (this.config.backgroundGradient.length - 1),
        color
      );
    });
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.dimensions.width, this.dimensions.height);
  }

  /* ============================================
     LIFECYCLE METHODS
     ============================================ */
  start() {
    if (!this.animationId) {
      this.isPaused = false;
      this.performance.lastTime = 0;
      this.animationId = requestAnimationFrame(this.animate);
    }
  }

  pause() {
    this.isPaused = true;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  resume() {
    if (this.isPaused) {
      this.start();
    }
  }

  destroy() {
    // Stop animation
    this.pause();
    
    // Remove event listeners
    window.removeEventListener('resize', this.handleResize);
    if (this.config.interactive) {
      this.config.container.removeEventListener('mousemove', this.handleMouseMove);
      this.config.container.removeEventListener('mouseenter', this.handleMouseEnter);
      this.config.container.removeEventListener('mouseleave', this.handleMouseLeave);
    }
    
    // Remove canvas
    if (this.config.canvas && this.config.canvas.parentNode) {
      this.config.canvas.parentNode.removeChild(this.config.canvas);
    }
    
    // Clear particles
    this.particles = [];
    
    // Reset properties
    this.isInitialized = false;
  }

  /* ============================================
     PUBLIC API
     ============================================ */
  addParticle(x, y, count = 1) {
    for (let i = 0; i < count; i++) {
      if (this.particles.length < this.config.performance.maxParticles) {
        this.particles.push(this.createParticle(x, y));
      }
    }
  }

  removeParticles(count = 1) {
    this.particles.splice(0, Math.min(count, this.particles.length));
  }

  setMouseRadius(radius) {
    this.config.mouse.radius = radius;
  }

  setMouseForce(force) {
    this.config.mouse.force = force;
  }

  setGravity(x, y) {
    this.config.physics.gravity = { x, y };
  }

  setWind(x, y) {
    this.config.physics.wind = { x, y };
  }

  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    
    // Recreate particles if count changed
    if (newConfig.particleCount !== undefined) {
      this.createParticles();
    }
  }

  getParticleCount() {
    return this.particles.length;
  }

  getFPS() {
    return this.performance.frameTime;
  }
}

/* ============================================
   PARTICLE CLASS
   ============================================ */
class Particle {
  constructor(options) {
    this.x = options.x;
    this.y = options.y;
    this.type = options.type;
    this.color = options.color;
    this.system = options.system;
    
    // Initialize based on type
    this.initializeType();
    
    // Common properties
    this.life = 1;
    this.maxLife = this.life;
    this.alpha = 1;
    this.scale = 1;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.02;
  }

  initializeType() {
    switch (this.type) {
      case 'bubble':
        this.radius = Math.random() * 15 + 5;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = -Math.random() * 1 - 0.5;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = 0.05;
        this.glowRadius = this.radius * 2;
        break;
        
      case 'star':
        this.radius = Math.random() * 3 + 1;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.points = 5;
        this.innerRadius = this.radius * 0.4;
        this.twinkle = Math.random() * Math.PI * 2;
        this.twinkleSpeed = 0.1;
        break;
        
      case 'confetti':
        this.width = Math.random() * 10 + 5;
        this.height = Math.random() * 5 + 2;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = Math.random() * 3 + 1;
        this.rotationSpeed = (Math.random() - 0.5) * 0.2;
        break;
        
      case 'spark':
        this.radius = Math.random() * 2 + 1;
        this.vx = (Math.random() - 0.5) * 5;
        this.vy = (Math.random() - 0.5) * 5;
        this.trail = [];
        this.maxTrailLength = 10;
        this.life = 0.5;
        break;
        
      case 'firefly':
        this.radius = Math.random() * 3 + 2;
        this.vx = 0;
        this.vy = 0;
        this.targetX = this.x;
        this.targetY = this.y;
        this.glowIntensity = 0;
        this.glowDirection = 1;
        this.movementRadius = 100;
        break;
        
      default: // 'default'
        this.radius = Math.random() * 4 + 2;
        this.vx = (Math.random() - 0.5) * 1;
        this.vy = (Math.random() - 0.5) * 1;
        break;
    }
  }

  update(deltaTime) {
    // Type-specific updates
    switch (this.type) {
      case 'bubble':
        this.wobble += this.wobbleSpeed * deltaTime;
        this.x += Math.sin(this.wobble) * 0.5 * deltaTime;
        break;
        
      case 'star':
        this.twinkle += this.twinkleSpeed * deltaTime;
        this.alpha = 0.5 + Math.sin(this.twinkle) * 0.5;
        break;
        
      case 'confetti':
        this.vy += 0.1 * deltaTime; // Gravity
        this.rotation += this.rotationSpeed * deltaTime;
        break;
        
      case 'spark':
        this.trail.push({ x: this.x, y: this.y, alpha: this.alpha });
        if (this.trail.length > this.maxTrailLength) {
          this.trail.shift();
        }
        this.life -= 0.02 * deltaTime;
        this.alpha = this.life;
        break;
        
      case 'firefly':
        // Update glow
        this.glowIntensity += 0.02 * this.glowDirection * deltaTime;
        if (this.glowIntensity > 1 || this.glowIntensity < 0) {
          this.glowDirection *= -1;
        }
        
        // Random movement
        if (Math.random() < 0.01) {
          const angle = Math.random() * Math.PI * 2;
          this.targetX = this.x + Math.cos(angle) * this.movementRadius;
          this.targetY = this.y + Math.sin(angle) * this.movementRadius;
        }
        
        // Move towards target
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        this.vx += dx * 0.001 * deltaTime;
        this.vy += dy * 0.001 * deltaTime;
        this.vx *= 0.95;
        this.vy *= 0.95;
        break;
    }
    
    // Update position
    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;
    
    // Update rotation
    this.rotation += this.rotationSpeed * deltaTime;
  }

  draw(ctx) {
    ctx.save();
    
    // Apply transformations
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.scale(this.scale, this.scale);
    ctx.globalAlpha = this.alpha;
    
    // Draw based on type
    switch (this.type) {
      case 'bubble':
        this.drawBubble(ctx);
        break;
        
      case 'star':
        this.drawStar(ctx);
        break;
        
      case 'confetti':
        this.drawConfetti(ctx);
        break;
        
      case 'spark':
        this.drawSpark(ctx);
        break;
        
      case 'firefly':
        this.drawFirefly(ctx);
        break;
        
      default:
        this.drawDefault(ctx);
        break;
    }
    
    ctx.restore();
  }

  drawBubble(ctx) {
    // Draw glow
    if (this.system.config.effects.glow) {
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.glowRadius);
      gradient.addColorStop(0, this.color + '40');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, this.glowRadius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Draw bubble
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(-this.radius * 0.3, -this.radius * 0.3, this.radius * 0.3, 0, Math.PI * 2);
    ctx.fill();
  }

  drawStar(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    
    for (let i = 0; i < this.points * 2; i++) {
      const radius = i % 2 === 0 ? this.radius : this.innerRadius;
      const angle = (i / (this.points * 2)) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.closePath();
    ctx.fill();
    
    // Add glow effect
    if (this.system.config.effects.glow) {
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  drawConfetti(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
  }

  drawSpark(ctx) {
    // Draw trail
    ctx.strokeStyle = this.color;
    ctx.lineCap = 'round';
    
    if (this.trail.length > 1) {
      for (let i = 0; i < this.trail.length - 1; i++) {
        const point = this.trail[i];
        const nextPoint = this.trail[i + 1];
        
        ctx.beginPath();
        ctx.globalAlpha = point.alpha * (i / this.trail.length);
        ctx.lineWidth = this.radius * (i / this.trail.length);
        ctx.moveTo(point.x - this.x, point.y - this.y);
        ctx.lineTo(nextPoint.x - this.x, nextPoint.y - this.y);
        ctx.stroke();
      }
    }
    
    // Draw spark head
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  drawFirefly(ctx) {
    // Draw glow
    const glowRadius = this.radius + 10 * this.glowIntensity;
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, glowRadius);
    gradient.addColorStop(0, this.color + 'ff');
    gradient.addColorStop(0.5, this.color + '40');
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, glowRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw core
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, this.radius * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  drawDefault(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

/* ============================================
   PRESET CONFIGURATIONS
   ============================================ */
const ParticlePresets = {
  starfield: {
    particleCount: 200,
    particleTypes: ['star', 'default'],
    colors: ['#ffffff', '#ffd700', '#87ceeb'],
    physics: {
      gravity: { x: 0, y: 0 },
      wind: { x: -0.1, y: 0 },
      friction: 1
    },
    effects: {
      connections: false,
      glow: true
    },
    bounds: {
      type: 'wrap'
    }
  },
  
  bubbles: {
    particleCount: 50,
    particleTypes: ['bubble'],
    colors: ['#4facfe', '#00f2fe', '#a8edea'],
    physics: {
      gravity: { x: 0, y: -0.1 },
      wind: { x: 0.05, y: 0 },
      friction: 0.99
    },
    effects: {
      connections: false,
      glow: true
    },
    bounds: {
      type: 'remove'
    }
  },
  
  confetti: {
    particleCount: 100,
    particleTypes: ['confetti'],
    colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f7dc6f', '#bb8fce'],
    physics: {
      gravity: { x: 0, y: 0.5 },
      wind: { x: 0.1, y: 0 },
      friction: 0.99,
      bounce: 0.7
    },
    effects: {
      connections: false,
      glow: false
    },
    bounds: {
      type: 'remove'
    }
  },
  
  fireflies: {
    particleCount: 30,
    particleTypes: ['firefly'],
    colors: ['#ffeb3b', '#ffc107', '#ff9800'],
    physics: {
      gravity: { x: 0, y: 0 },
      wind: { x: 0, y: 0 },
      friction: 0.98
    },
    effects: {
      connections: false,
      glow: true
    },
    bounds: {
      type: 'bounce'
    }
  },
  
  matrix: {
    particleCount: 150,
    particleTypes: ['default'],
    colors: ['#00ff00', '#008800', '#00ff00'],
    physics: {
      gravity: { x: 0, y: 0.3 },
      wind: { x: 0, y: 0 },
      friction: 1
    },
    effects: {
      connections: false,
      glow: true,
      trail: true
    },
    bounds: {
      type: 'remove'
    }
  },
  
  network: {
    particleCount: 80,
    particleTypes: ['default'],
    colors: ['#2563eb', '#3b82f6', '#60a5fa'],
    physics: {
      gravity: { x: 0, y: 0 },
      wind: { x: 0, y: 0 },
      friction: 0.99
    },
    effects: {
      connections: true,
      connectionDistance: 150,
      connectionOpacity: 0.3,
      glow: false
    },
    bounds: {
      type: 'bounce',
      padding: 50
    },
    interactive: true,
    mouse: {
      radius: 200,
      force: 0.02
    }
  }
};

/* ============================================
   EXPORT
   ============================================ */
// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ParticleSystem, ParticlePresets };
}

// Export for ES6 modules
export { ParticleSystem, ParticlePresets };

// Also attach to window for direct browser use
if (typeof window !== 'undefined') {
  window.ParticleSystem = ParticleSystem;
  window.ParticlePresets = ParticlePresets;
}

