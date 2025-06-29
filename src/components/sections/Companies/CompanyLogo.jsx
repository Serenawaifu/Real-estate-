// ==========================================
// DGrealtors - Company Logo Component
// ==========================================

import React, { useState, useEffect, useRef, memo } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { useIntersectionObserver } from '../../../hooks/useIntersectionObserver';

// Utils
import { cn } from '../../../utils/cn';

// Styles
import styles from './CompanyLogo.module.css';

// Logo Loading States
const LOGO_STATES = {
  LOADING: 'loading',
  LOADED: 'loaded',
  ERROR: 'error',
};

// Logo Placeholder Component
const LogoPlaceholder = memo(({ name, variant }) => {
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={cn(styles.logoPlaceholder, styles[`placeholder--${variant}`])}>
      <span className={styles.placeholderText}>{initials}</span>
      <div className={styles.placeholderGradient} />
    </div>
  );
});

LogoPlaceholder.displayName = 'LogoPlaceholder';

// Logo Skeleton Component
const LogoSkeleton = memo(({ variant }) => {
  return (
    <div className={cn(styles.logoSkeleton, styles[`skeleton--${variant}`])}>
      <div className={styles.skeletonPulse} />
    </div>
  );
});

LogoSkeleton.displayName = 'LogoSkeleton';

// Main Company Logo Component
const CompanyLogo = ({
  company,
  variant = 'default',
  size = 'medium',
  showTooltip = true,
  showStats = false,
  interactive = true,
  lazyLoad = true,
  animateOnHover = true,
  animateOnView = true,
  onClick,
  className,
  ...props
}) => {
  const logoRef = useRef(null);
  const controls = useAnimation();
  const isInView = useInView(logoRef, { once: true });
  
  const [logoState, setLogoState] = useState(LOGO_STATES.LOADING);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  // Intersection Observer for lazy loading
  const [observerRef, isIntersecting] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px',
  });

  // Handle logo loading
  useEffect(() => {
    if (!lazyLoad || isIntersecting) {
      const img = new Image();
      img.src = company.logo;
      
      img.onload = () => {
        setImageLoaded(true);
        setLogoState(LOGO_STATES.LOADED);
      };
      
      img.onerror = () => {
        setLogoState(LOGO_STATES.ERROR);
      };
    }
  }, [company.logo, lazyLoad, isIntersecting]);

  // Animate on view
  useEffect(() => {
    if (animateOnView && isInView && imageLoaded) {
      controls.start('visible');
    }
  }, [animateOnView, isInView, imageLoaded, controls]);

  // Animation variants
  const logoVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      filter: 'blur(10px)',
    },
    visible: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
    hover: {
      scale: animateOnHover ? 1.05 : 1,
      filter: 'blur(0px) brightness(1.1)',
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1,
      },
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const detailVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  // Handle click
  const handleClick = () => {
    if (onClick) {
      onClick(company);
    }
    if (interactive) {
      setShowDetails(!showDetails);
    }
  };

  // Render logo content based on state
  const renderLogoContent = () => {
    switch (logoState) {
      case LOGO_STATES.LOADING:
        return <LogoSkeleton variant={variant} />;

      case LOGO_STATES.ERROR:
        return <LogoPlaceholder name={company.name} variant={variant} />;

      case LOGO_STATES.LOADED:
        return (
          <>
            <motion.img
              src={company.logo}
              alt={`${company.name} - Partner of DGrealtors`}
              className={styles.logoImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              draggable={false}
            />
            
            {/* Shine Effect */}
            {animateOnHover && (
              <motion.div
                className={styles.shineEffect}
                initial={{ x: '-150%' }}
                whileHover={{ x: '150%' }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              />
            )}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      ref={lazyLoad ? observerRef : logoRef}
      className={cn(
        styles.companyLogo,
        styles[`logo--${variant}`],
        styles[`logo--${size}`],
        {
          [styles.interactive]: interactive,
          [styles.hovered]: isHovered,
          [styles.showingDetails]: showDetails,
        },
        className
      )}
      variants={logoVariants}
      initial={animateOnView ? 'hidden' : 'visible'}
      animate={controls}
      whileHover="hover"
      whileTap="tap"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
      role={interactive ? 'button' : 'img'}
      tabIndex={interactive ? 0 : -1}
      aria-label={`${company.name} logo`}
      {...props}
    >
      {/* Background Effects */}
      <div className={styles.backgroundEffects}>
        <div className={styles.glowEffect} />
        <div className={styles.patternOverlay} />
      </div>

      {/* Logo Container */}
      <div className={styles.logoContainer}>
        {renderLogoContent()}

        {/* Hover Border Animation */}
        <svg className={styles.borderAnimation} viewBox="0 0 200 200">
          <rect
            x="5"
            y="5"
            width="190"
            height="190"
            rx="10"
            ry="10"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="2"
            strokeDasharray="600"
            strokeDashoffset="600"
            className={styles.animatedBorder}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--color-dg-peach)" />
              <stop offset="50%" stopColor="var(--color-dg-orange)" />
              <stop offset="100%" stopColor="var(--color-dg-olive)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Company Info Overlay */}
      {showTooltip && isHovered && (
        <motion.div
          className={styles.tooltip}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h4 className={styles.tooltipTitle} variants={detailVariants}>
            {company.name}
          </motion.h4>
          <motion.p className={styles.tooltipCategory} variants={detailVariants}>
            {company.category}
          </motion.p>
          {company.description && (
            <motion.p className={styles.tooltipDescription} variants={detailVariants}>
              {company.description}
            </motion.p>
          )}
        </motion.div>
      )}

      {/* Stats Overlay */}
      {showStats && company.stats && (
        <motion.div
          className={styles.statsOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {company.stats.map((stat, index) => (
            <motion.div
              key={index}
              className={styles.statItem}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Interactive Details Panel */}
      {interactive && showDetails && (
        <motion.div
          className={styles.detailsPanel}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className={styles.detailsContent}>
            <h3 className={styles.detailsTitle}>{company.name}</h3>
            <p className={styles.detailsCategory}>{company.category}</p>
            
            {company.testimonial && (
              <blockquote className={styles.testimonial}>
                <p>"{company.testimonial.text}"</p>
                <cite>
                  <span className={styles.authorName}>{company.testimonial.author}</span>
                  <span className={styles.authorPosition}>{company.testimonial.position}</span>
                </cite>
              </blockquote>
            )}
            
            {company.partnership && (
              <div className={styles.partnership}>
                <span className={styles.partnershipLabel}>Partnership Since:</span>
                <span className={styles.partnershipValue}>{company.partnership.since}</span>
              </div>
            )}
            
            <div className={styles.detailsActions}>
              <button className={styles.actionButton}>
                View Case Study
              </button>
              <button className={styles.actionButton}>
                Contact
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Badge */}
      {company.badge && (
        <div className={styles.logoBadge}>
          <span>{company.badge}</span>
        </div>
      )}

      {/* Loading Progress */}
      {logoState === LOGO_STATES.LOADING && (
        <div className={styles.loadingProgress}>
          <div className={styles.progressBar} />
        </div>
      )}
    </motion.div>
  );
};

// Logo Grid Component
export const CompanyLogoGrid = memo(({ 
  companies, 
  columns = 4, 
  gap = '2rem',
  ...logoProps 
}) => {
  return (
    <div 
      className={styles.logoGrid}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: gap,
      }}
    >
      {companies.map((company, index) => (
        <CompanyLogo
          key={company.id}
          company={company}
          animateOnView
          {...logoProps}
          style={{
            animationDelay: `${index * 0.05}s`,
          }}
        />
      ))}
    </div>
  );
});

CompanyLogoGrid.displayName = 'CompanyLogoGrid';

// Logo Marquee Component
export const CompanyLogoMarquee = memo(({ 
  companies, 
  speed = 30,
  direction = 'left',
  pauseOnHover = true,
  ...logoProps 
}) => {
  return (
    <div 
      className={cn(styles.logoMarquee, {
        [styles.pauseOnHover]: pauseOnHover,
      })}
    >
      <motion.div
        className={styles.marqueeTrack}
        animate={{
          x: direction === 'left' ? [0, -100 + '%'] : [-100 + '%', 0],
        }}
        transition={{
          x: {
            repeat: Infinity,
            duration: speed,
            ease: 'linear',
          },
        }}
      >
        {/* Duplicate for seamless loop */}
        {[...companies, ...companies].map((company, index) => (
          <CompanyLogo
            key={`${company.id}-${index}`}
            company={company}
            variant="minimal"
            size="small"
            animateOnHover={false}
            animateOnView={false}
            interactive={false}
            {...logoProps}
          />
        ))}
      </motion.div>
    </div>
  );
});

CompanyLogoMarquee.displayName = 'CompanyLogoMarquee';

export default memo(CompanyLogo);
  
