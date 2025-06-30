import React, { forwardRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './Button.module.css';

const Button = forwardRef(({
  // Content
  children,
  icon,
  iconPosition = 'left',
  
  // Appearance
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  rounded = false,
  gradient = false,
  glow = false,
  
  // States
  loading = false,
  disabled = false,
  active = false,
  
  // Behavior
  type = 'button',
  onClick,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  
  // Animation
  ripple = true,
  pulse = false,
  hover3D = false,
  magneticHover = false,
  
  // Additional
  className = '',
  style = {},
  ariaLabel,
  tabIndex,
  tooltip,
  badge,
  badgeVariant = 'default',
  
  // Advanced features
  confirmAction = false,
  confirmText = 'Are you sure?',
  cooldown = 0,
  trackingId,
  hapticFeedback = true,
  soundEffect = false,
  
  ...props
}, ref) => {
  // State management
  const [isConfirming, setIsConfirming] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [ripples, setRipples] = useState([]);
  const [isPressed, setIsPressed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  // Magnetic hover effect state
  const [magneticStyle, setMagneticStyle] = useState({});

  // Handle cooldown timer
  useEffect(() => {
    if (cooldownRemaining > 0) {
      const timer = setTimeout(() => {
        setCooldownRemaining(cooldownRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownRemaining]);

  // Handle ripple effect
  const createRipple = (event) => {
    if (!ripple || disabled || loading) return;

    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const newRipple = {
      x,
      y,
      size,
      id: Date.now()
    };

    setRipples(prev => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 600);
  };

  // Handle click with confirmation
  const handleClick = (event) => {
    // Add haptic feedback for mobile devices
    if (hapticFeedback && window.navigator.vibrate) {
      window.navigator.vibrate(10);
    }

    // Play sound effect if enabled
    if (soundEffect && !disabled && !loading) {
      playClickSound();
    }

    // Create ripple effect
    createRipple(event);

    // Handle confirmation flow
    if (confirmAction && !isConfirming) {
      setIsConfirming(true);
      setTimeout(() => setIsConfirming(false), 3000);
      return;
    }

    // Handle cooldown
    if (cooldown > 0) {
      setCooldownRemaining(cooldown);
    }

    // Track analytics event
    if (trackingId) {
      trackButtonClick(trackingId);
    }

    // Execute onClick handler
    if (onClick && !disabled && !loading && cooldownRemaining === 0) {
      onClick(event);
      setIsConfirming(false);
    }
  };

  // Handle mouse enter for 3D and magnetic effects
  const handleMouseEnter = (event) => {
    setShowTooltip(true);
    
    if (onMouseEnter) onMouseEnter(event);
  };

  // Handle mouse leave
  const handleMouseLeave = (event) => {
    setShowTooltip(false);
    setMousePosition({ x: 0, y: 0 });
    
    if (magneticHover) {
      setMagneticStyle({
        transform: 'translate3d(0, 0, 0)'
      });
    }
    
    if (onMouseLeave) onMouseLeave(event);
  };

  // Handle mouse move for 3D and magnetic effects
  const handleMouseMove = (event) => {
    if (disabled || loading) return;

    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    setMousePosition({ x, y });

    if (magneticHover) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const deltaX = (x - centerX) / 10;
      const deltaY = (y - centerY) / 10;

      setMagneticStyle({
        transform: `translate3d(${deltaX}px, ${deltaY}px, 0)`,
        transition: 'transform 0.2s ease'
      });
    }
  };

  // Play click sound effect
  const playClickSound = () => {
    const audio = new Audio('/sounds/button-click.mp3');
    audio.volume = 0.3;
    audio.play().catch(e => console.log('Audio play failed:', e));
  };

  // Track button analytics
  const trackButtonClick = (id) => {
    // Implement analytics tracking
    if (window.gtag) {
      window.gtag('event', 'button_click', {
        button_id: id,
        button_variant: variant,
        button_text: typeof children === 'string' ? children : 'custom'
      });
    }
  };

  // Build class names
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    rounded && styles.rounded,
    gradient && styles.gradient,
    glow && styles.glow,
    loading && styles.loading,
    disabled && styles.disabled,
    active && styles.active,
    isPressed && styles.pressed,
    pulse && !disabled && !loading && styles.pulse,
    hover3D && styles.hover3D,
    magneticHover && styles.magnetic,
    isConfirming && styles.confirming,
    cooldownRemaining > 0 && styles.cooldown,
    className
  ].filter(Boolean).join(' ');

  // Render loading spinner
  const renderLoader = () => (
    <span className={styles.loader}>
      <span className={styles.loaderDot} />
      <span className={styles.loaderDot} />
      <span className={styles.loaderDot} />
    </span>
  );

  // Render icon
  const renderIcon = () => {
    if (!icon) return null;
    
    const iconElement = typeof icon === 'string' ? (
      <span className={styles.iconText}>{icon}</span>
    ) : (
      <span className={styles.iconElement}>{icon}</span>
    );

    return (
      <span className={`${styles.icon} ${styles[`icon${iconPosition.charAt(0).toUpperCase() + iconPosition.slice(1)}`]}`}>
        {iconElement}
      </span>
    );
  };

  // Render badge
  const renderBadge = () => {
    if (!badge) return null;
    
    return (
      <span className={`${styles.badge} ${styles[`badge${badgeVariant.charAt(0).toUpperCase() + badgeVariant.slice(1)}`]}`}>
        {badge}
      </span>
    );
  };

  // Render tooltip
  const renderTooltip = () => {
    if (!tooltip || !showTooltip) return null;
    
    return (
      <span className={styles.tooltip}>
        {tooltip}
      </span>
    );
  };

  // Render button content
  const renderContent = () => {
    if (loading) {
      return (
        <>
          {renderLoader()}
          <span className={styles.loadingText}>
            {typeof children === 'string' ? 'Loading...' : children}
          </span>
        </>
      );
    }

    if (isConfirming) {
      return (
        <>
          <span className={styles.confirmIcon}>⚠️</span>
          <span className={styles.confirmText}>{confirmText}</span>
        </>
      );
    }

    if (cooldownRemaining > 0) {
      return (
        <>
          <span className={styles.cooldownTimer}>{cooldownRemaining}s</span>
          <span className={styles.cooldownText}>{children}</span>
        </>
      );
    }

    return (
      <>
        {iconPosition === 'left' && renderIcon()}
        <span className={styles.content}>{children}</span>
        {iconPosition === 'right' && renderIcon()}
      </>
    );
  };

  // Render ripple effects
  const renderRipples = () => {
    return ripples.map(ripple => (
      <span
        key={ripple.id}
        className={styles.ripple}
        style={{
          left: ripple.x,
          top: ripple.y,
          width: ripple.size,
          height: ripple.size
        }}
      />
    ));
  };

  // Render 3D hover effect
  const render3DEffect = () => {
    if (!hover3D || disabled || loading) return null;

    const { x, y } = mousePosition;
    const rotateY = (x / 10) - 10;
    const rotateX = -(y / 10) + 10;

    return (
      <span 
        className={styles.hover3DLayer}
        style={{
          transform: `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`
        }}
      />
    );
  };

  const buttonStyle = {
    ...style,
    ...magneticStyle
  };

  return (
    <button
      ref={ref}
      type={type}
      className={buttonClasses}
      style={buttonStyle}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onFocus={onFocus}
      onBlur={onBlur}
      disabled={disabled || loading || cooldownRemaining > 0}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      aria-busy={loading}
      aria-pressed={active}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : tabIndex}
      {...props}
    >
      {/* Background effects */}
      <span className={styles.background} />
      {gradient && <span className={styles.gradientBackground} />}
      {glow && <span className={styles.glowEffect} />}
      
      {/* 3D effect layer */}
      {render3DEffect()}
      
      {/* Ripple container */}
      <span className={styles.rippleContainer}>
        {renderRipples()}
      </span>
      
      {/* Main content */}
      <span className={styles.inner}>
        {renderContent()}
      </span>
      
      {/* Badge */}
      {renderBadge()}
      
      {/* Tooltip */}
      {renderTooltip()}
      
      {/* Focus ring */}
      <span className={styles.focusRing} />
    </button>
  );
});

Button.displayName = 'Button';

Button.propTypes = {
  children: PropTypes.node.isRequired,
  icon: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  iconPosition: PropTypes.oneOf(['left', 'right']),
  variant: PropTypes.oneOf([
    'primary',
    'secondary',
    'tertiary',
    'success',
    'warning',
    'danger',
    'ghost',
    'outline',
    'link'
  ]),
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
  fullWidth: PropTypes.bool,
  rounded: PropTypes.bool,
  gradient: PropTypes.bool,
  glow: PropTypes.bool,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  active: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  ripple: PropTypes.bool,
  pulse: PropTypes.bool,
  hover3D: PropTypes.bool,
  magneticHover: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  ariaLabel: PropTypes.string,
  tabIndex: PropTypes.number,
  tooltip: PropTypes.string,
  badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  badgeVariant: PropTypes.oneOf(['default', 'primary', 'success', 'warning', 'danger']),
  confirmAction: PropTypes.bool,
  confirmText: PropTypes.string,
  cooldown: PropTypes.number,
  trackingId: PropTypes.string,
  hapticFeedback: PropTypes.bool,
  soundEffect: PropTypes.bool
};

// Export button group component
export const ButtonGroup = ({ children, className = '', ...props }) => {
  return (
    <div className={`${styles.buttonGroup} ${className}`} {...props}>
      {children}
    </div>
  );
};

ButtonGroup.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default Button;

/* Base Button Styles */
.button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  outline: none;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  font-family: inherit;
  font-weight: 500;
  line-height: 1;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  user-select: none;
  vertical-align: middle;
  white-space: nowrap;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transform: translate3d(0, 0, 0);
  will-change: transform, box-shadow, background;
  z-index: 1;
}

/* Button Variants */
.primary {
  background-color: var(--color-primary);
  color: var(--color-on-primary);
}

.secondary {
  background-color: var(--color-secondary);
  color: var(--color-on-secondary);
}

.tertiary {
  background-color: var(--color-tertiary);
  color: var(--color-on-tertiary);
}

.success {
  background-color: var(--color-success);
  color: var(--color-on-success);
}

.warning {
  background-color: var(--color-warning);
  color: var(--color-on-warning);
}

.danger {
  background-color: var(--color-danger);
  color: var(--color-on-danger);
}

.ghost {
  background-color: transparent;
  color: var(--color-primary);
  box-shadow: none;
}

.outline {
  background-color: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}

.link {
  background-color: transparent;
  color: var(--color-primary);
  box-shadow: none;
  text-decoration: underline;
}

/* Button Sizes */
.small {
  padding: 6px 12px;
  font-size: 0.75rem;
  min-height: 28px;
}

.medium {
  padding: 8px 16px;
  font-size: 0.875rem;
  min-height: 36px;
}

.large {
  padding: 12px 24px;
  font-size: 1rem;
  min-height: 44px;
}

.xlarge {
  padding: 16px 32px;
  font-size: 1.125rem;
  min-height: 52px;
}

/* Button States */
.loading {
  cursor: progress;
  opacity: 0.8;
}

.disabled {
  cursor: not-allowed;
  opacity: 0.6;
  pointer-events: none;
}

.active {
  transform: translateY(1px);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.pressed {
  transform: translateY(2px);
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}

.confirming {
  background-color: var(--color-warning) !important;
  color: var(--color-on-warning) !important;
}

.cooldown {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Button Modifiers */
.fullWidth {
  display: flex;
  width: 100%;
}

.rounded {
  border-radius: 50px;
}

.gradient {
  background: linear-gradient(45deg, var(--color-primary), var(--color-secondary));
  color: white;
}

.glow {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.pulse {
  animation: pulse 2s infinite;
}

.hover3D {
  perspective: 1000px;
  transform-style: preserve-3d;
}

.magnetic {
  transition: transform 0.2s ease;
}

/* Button Elements */
.inner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  z-index: 2;
}

.background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: currentColor;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.gradientBackground {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, var(--color-primary), var(--color-secondary));
  z-index: 0;
}

.glowEffect {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 0;
}

.hover3DLayer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: inherit;
  border-radius: inherit;
  transition: transform 0.2s ease;
  z-index: -1;
}

.rippleContainer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: inherit;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.ripple {
  position: absolute;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: scale(0);
  animation: ripple 0.6s linear;
  pointer-events: none;
}

.focusRing {
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border: 2px solid var(--color-primary);
  border-radius: inherit;
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
  z-index: 3;
}

/* Icon Styles */
.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.iconLeft {
  margin-right: 8px;
}

.iconRight {
  margin-left: 8px;
}

.iconElement {
  display: flex;
  align-items: center;
  justify-content: center;
}

.iconText {
  font-size: 1.2em;
}

/* Loading State */
.loader {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.loaderDot {
  width: 6px;
  height: 6px;
  background: currentColor;
  border-radius: 50%;
  animation: loaderBounce 1.4s infinite ease-in-out both;
}

.loaderDot:nth-child(1) {
  animation-delay: -0.32s;
}

.loaderDot:nth-child(2) {
  animation-delay: -0.16s;
}

.loadingText {
  margin-left: 8px;
}

/* Confirmation State */
.confirmIcon {
  margin-right: 8px;
  font-size: 1.2em;
}

.confirmText {
  font-weight: 600;
}

/* Cooldown State */
.cooldownTimer {
  font-weight: 700;
  margin-right: 8px;
}

.cooldownText {
  opacity: 0.7;
}

/* Badge Styles */
.badge {
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: 700;
  border-radius: 10px;
  background: var(--color-danger);
  color: white;
  z-index: 4;
}

.badgePrimary {
  background: var(--color-primary);
}

.badgeSuccess {
  background: var(--color-success);
}

.badgeWarning {
  background: var(--color-warning);
}

.badgeDanger {
  background: var(--color-danger);
}

/* Tooltip Styles */
.tooltip {
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  font-size: 0.75rem;
  border-radius: 4px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  z-index: 10;
}

.tooltip::after {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-bottom-color: rgba(0, 0, 0, 0.8);
}

/* Button Group Styles */
.buttonGroup {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

/* Hover & Focus States */
.button:not(.disabled):not(.loading):hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

.button:not(.disabled):not(.loading):hover .background {
  opacity: 0.1;
}

.button:not(.disabled):not(.loading):hover .glowEffect {
  opacity: 1;
}

.button:not(.disabled):not(.loading):hover .icon {
  transform: translateY(-1px);
}

.button:not(.disabled):not(.loading):active {
  transform: translateY(1px);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.button:not(.disabled):not(.loading):focus-visible .focusRing {
  opacity: 0.3;
}

.button:not(.disabled):not(.loading):hover .tooltip {
  opacity: 1;
}

/* Gradient Button Hover */
.gradient:hover {
  background: linear-gradient(45deg, 
    color-mix(in srgb, var(--color-primary) 90%, black 10%),
    color-mix(in srgb, var(--color-secondary) 90%, black 10%)
  );
}

/* Ghost Button Hover */
.ghost:hover {
  background: rgba(0, 0, 0, 0.05);
}

/* Outline Button Hover */
.outline:hover {
  background: rgba(0, 0, 0, 0.05);
  border-color: color-mix(in srgb, var(--color-primary) 80%, black 20%);
}

/* Link Button Hover */
.link:hover {
  text-decoration: none;
  opacity: 0.8;
}

/* Animations */
@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.2);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  }
}

@keyframes loaderBounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .large {
    padding: 10px 20px;
    font-size: 0.9375rem;
    min-height: 40px;
  }

  .xlarge {
    padding: 14px 28px;
    font-size: 1rem;
    min-height: 48px;
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .button {
    transition: none;
  }

  .ripple {
    animation: none;
    display: none;
  }

  .pulse {
    animation: none;
  }

  .hover3DLayer {
    transition: none;
  }

  .icon {
    transition: none;
  }
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  .ghost {
    color: var(--color-primary-light);
  }

  .outline {
    color: var(--color-primary-light);
    border-color: var(--color-primary-light);
  }

  .link {
    color: var(--color-primary-light);
  }

  .ghost:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .outline:hover {
    background: rgba(255, 255, 255, 0.1);
  }
                        }
  
