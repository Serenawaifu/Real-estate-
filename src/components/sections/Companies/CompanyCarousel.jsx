// ==========================================
// DGrealtors - Company Carousel Component
// ==========================================

import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { 
  Autoplay, 
  Navigation, 
  Pagination, 
  EffectCoverflow,
  EffectCards,
  EffectCreative,
  Mousewheel,
  Keyboard,
  Lazy,
  Virtual,
  Thumbs,
  FreeMode
} from 'swiper/modules';
import { useInView } from 'react-intersection-observer';

// Hooks
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import { useTheme } from '../../../hooks/useTheme';

// Utils
import { cn } from '../../../utils/cn';

// Styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import 'swiper/css/effect-cards';
import 'swiper/css/effect-creative';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';
import styles from './CompanyCarousel.module.css';

// Constants
const CAROUSEL_VARIANTS = {
  default: {
    effect: 'slide',
    spaceBetween: 30,
    slidesPerView: 'auto',
  },
  coverflow: {
    effect: 'coverflow',
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    },
  },
  cards: {
    effect: 'cards',
    cardsEffect: {
      slideShadows: true,
      rotate: true,
      perSlideOffset: 8,
      perSlideRotate: 2,
    },
  },
  creative: {
    effect: 'creative',
    creativeEffect: {
      prev: {
        shadow: true,
        translate: ['-120%', 0, -500],
      },
      next: {
        shadow: true,
        translate: ['120%', 0, -500],
      },
    },
  },
  infinite: {
    loop: true,
    loopFillGroupWithBlank: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    spaceBetween: 0,
    speed: 5000,
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
      pauseOnMouseEnter: false,
    },
    allowTouchMove: false,
  },
};

// Company Card Component
const CompanyCard = memo(({ 
  company, 
  index, 
  isActive, 
  variant = 'default',
  onCardClick 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardRef = useRef(null);

  const handleClick = useCallback(() => {
    if (onCardClick) {
      onCardClick(company, index);
    }
  }, [company, index, onCardClick]);

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: index * 0.05,
      },
    },
    hover: {
      scale: 1.05,
      y: -10,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
      },
    },
  };

  return (
    <motion.div
      ref={cardRef}
      className={cn(styles.companyCard, styles[`companyCard--${variant}`], {
        [styles.active]: isActive,
        [styles.hovered]: isHovered,
      })}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Card Background Effects */}
      <div className={styles.cardBackground}>
        <div className={styles.gradientOrb1} />
        <div className={styles.gradientOrb2} />
      </div>

      {/* Logo Container */}
      <div className={styles.logoContainer}>
        {!imageLoaded && (
          <div className={styles.logoSkeleton} />
        )}
        <img
          src={company.logo}
          alt={`${company.name} - DGrealtors Client`}
          className={cn(styles.companyLogo, {
            [styles.loaded]: imageLoaded,
          })}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        
        {/* Hover Overlay */}
        <motion.div
          className={styles.logoOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className={styles.overlayContent}>
            <span className={styles.viewDetails}>View Details</span>
          </div>
        </motion.div>
      </div>

      {/* Company Info */}
      <div className={styles.companyInfo}>
        <h3 className={styles.companyName}>{company.name}</h3>
        <p className={styles.companyCategory}>{company.category}</p>
        
        {company.stats && (
          <div className={styles.companyStats}>
            {company.stats.map((stat, idx) => (
              <div key={idx} className={styles.stat}>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Elements */}
      {isActive && company.testimonial && (
        <motion.div
          className={styles.testimonial}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <p className={styles.testimonialText}>"{company.testimonial.text}"</p>
          <div className={styles.testimonialAuthor}>
            <span className={styles.authorName}>{company.testimonial.author}</span>
            <span className={styles.authorPosition}>{company.testimonial.position}</span>
          </div>
        </motion.div>
      )}

      {/* Card Badge */}
      {company.badge && (
        <div className={styles.cardBadge}>
          <span>{company.badge}</span>
        </div>
      )}

      {/* Card Actions */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className={styles.cardActions}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <button className={styles.actionButton} aria-label="View company details">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button className={styles.actionButton} aria-label="View case study">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

CompanyCard.displayName = 'CompanyCard';

// Thumbnail Navigation Component
const ThumbsNav = memo(({ companies, activeIndex, onThumbClick }) => {
  return (
    <div className={styles.thumbsContainer}>
      <Swiper
        modules={[FreeMode, Navigation, Thumbs]}
        spaceBetween={10}
        slidesPerView={'auto'}
        freeMode={true}
        watchSlidesProgress={true}
        className={styles.thumbsSwiper}
      >
        {companies.map((company, index) => (
          <SwiperSlide key={company.id} className={styles.thumbSlide}>
            <button
              className={cn(styles.thumbButton, {
                [styles.active]: activeIndex === index,
              })}
              onClick={() => onThumbClick(index)}
            >
              <img
                src={company.logo}
                alt={company.name}
                className={styles.thumbLogo}
              />
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
});

ThumbsNav.displayName = 'ThumbsNav';

// Progress Bar Component
const CarouselProgress = memo(({ progress }) => {
  return (
    <div className={styles.progressContainer}>
      <motion.div
        className={styles.progressBar}
        style={{ scaleX: progress / 100 }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: progress / 100 }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
});

CarouselProgress.displayName = 'CarouselProgress';

// Main Company Carousel Component
const CompanyCarousel = ({
  companies = [],
  variant = 'default',
  autoplay = true,
  showNavigation = true,
  showPagination = true,
  showProgress = false,
  showThumbs = false,
  onSlideChange,
  onCompanyClick,
  className,
}) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  
  const { theme } = useTheme();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');
  
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  // Calculate responsive slides per view
  const getSlidesPerView = useCallback(() => {
    if (variant === 'infinite') return 'auto';
    if (variant === 'cards') return 1;
    if (isMobile) return 1;
    if (isTablet) return 2;
    return variant === 'coverflow' ? 3 : 4;
  }, [variant, isMobile, isTablet]);

  // Handle slide change
  const handleSlideChange = useCallback((swiper) => {
    setActiveIndex(swiper.activeIndex);
    const progressValue = ((swiper.activeIndex + 1) / companies.length) * 100;
    setProgress(progressValue);
    
    if (onSlideChange) {
      onSlideChange(swiper.activeIndex, companies[swiper.activeIndex]);
    }
  }, [companies, onSlideChange]);

  // Navigation controls
  const handlePrev = useCallback(() => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  }, []);

  const handleNext = useCallback(() => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  }, []);

  const handleThumbClick = useCallback((index) => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(index);
    }
  }, []);

  // Get carousel configuration
  const getCarouselConfig = useCallback(() => {
    const baseConfig = {
      modules: [
        Autoplay,
        Navigation,
        Pagination,
        EffectCoverflow,
        EffectCards,
        EffectCreative,
        Mousewheel,
        Keyboard,
        Lazy,
        Virtual,
        ...(showThumbs ? [Thumbs] : []),
      ],
      slidesPerView: getSlidesPerView(),
      spaceBetween: 30,
      centeredSlides: variant === 'coverflow' || variant === 'cards',
      loop: variant === 'infinite' || (companies.length > getSlidesPerView()),
      speed: variant === 'infinite' ? 5000 : 600,
      grabCursor: true,
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      mousewheel: {
        forceToAxis: true,
      },
      lazy: {
        loadPrevNext: true,
        loadPrevNextAmount: 2,
      },
      ...(autoplay && {
        autoplay: {
          delay: variant === 'infinite' ? 0 : 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: variant !== 'infinite',
        },
      }),
      ...(showThumbs && thumbsSwiper && {
        thumbs: {
          swiper: thumbsSwiper,
        },
      }),
      ...CAROUSEL_VARIANTS[variant],
    };

    return baseConfig;
  }, [variant, companies.length, getSlidesPerView, autoplay, showThumbs, thumbsSwiper]);

  return (
    <div
      ref={ref}
      className={cn(styles.carouselContainer, styles[`carousel--${variant}`], className)}
      data-theme={theme}
    >
      {/* Header */}
      {showProgress && (
        <div className={styles.carouselHeader}>
          <div className={styles.slideCounter}>
            <span className={styles.currentSlide}>{String(activeIndex + 1).padStart(2, '0')}</span>
            <span className={styles.separator}>/</span>
            <span className={styles.totalSlides}>{String(companies.length).padStart(2, '0')}</span>
          </div>
          <CarouselProgress progress={progress} />
        </div>
      )}

      {/* Main Carousel */}
      <div
        className={styles.carouselWrapper}
        onMouseEnter={() => setIsAutoplayPaused(true)}
        onMouseLeave={() => setIsAutoplayPaused(false)}
      >
        <AnimatePresence>
          {inView && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Swiper
                {...getCarouselConfig()}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}
                onSlideChange={handleSlideChange}
                className={styles.swiper}
              >
                {companies.map((company, index) => (
                  <SwiperSlide key={company.id} className={styles.swiperSlide}>
                    {({ isActive }) => (
                      <CompanyCard
                        company={company}
                        index={index}
                        isActive={isActive}
                        variant={variant}
                        onCardClick={onCompanyClick}
                      />
                    )}
                  </SwiperSlide>
                ))}
              </Swiper>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Custom Navigation */}
        {showNavigation && !isMobile && (
          <>
            <button
              className={cn(styles.navButton, styles.navButtonPrev)}
              onClick={handlePrev}
              aria-label="Previous slide"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M15 18l-6-6 6-6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              className={cn(styles.navButton, styles.navButtonNext)}
              onClick={handleNext}
              aria-label="Next slide"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 18l6-6-6-6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        )}

        {/* Autoplay Indicator */}
        {autoplay && isAutoplayPaused && variant !== 'infinite' && (
          <motion.div
            className={styles.autoplayIndicator}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <span>Autoplay paused</span>
          </motion.div>
        )}
      </div>

      {/* Thumbnails Navigation */}
      {showThumbs && (
        <ThumbsNav
          companies={companies}
          activeIndex={activeIndex}
          onThumbClick={handleThumbClick}
        />
      )}

      {/* Dots Pagination */}
      {showPagination && !showThumbs && (
        <div className={styles.pagination}>
          {companies.map((_, index) => (
            <button
              key={index}
              className={cn(styles.paginationDot, {
                [styles.active]: index === activeIndex,
              })}
              onClick={() => handleThumbClick(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(CompanyCarousel);
          
