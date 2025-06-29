// ==========================================
// DGrealtors - Companies Section Component
// ==========================================

import React, { useEffect, useRef, useState, memo } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';

// Hooks
import { useMediaQuery } from '../../../hooks/useMediaQuery';

// Utils
import { cn } from '../../../utils/cn';

// Styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import styles from './Companies.module.css';

// Constants
const COMPANIES_DATA = [
  {
    id: 1,
    name: 'TCS - Tata Consultancy Services',
    logo: 'https://placehold.co/200x80',
    category: 'Technology',
    description: 'Leading IT services company',
    testimonial: {
      text: 'DGrealtors helped us find the perfect office space that aligns with our growth plans.',
      author: 'Rajesh Kumar',
      position: 'Facilities Head',
    },
  },
  {
    id: 2,
    name: 'Reliance Industries',
    logo: 'https://placehold.co/200x80',
    category: 'Conglomerate',
    description: 'India\'s largest private sector company',
    testimonial: {
      text: 'Their expertise in commercial real estate is unmatched. Highly professional team.',
      author: 'Priya Sharma',
      position: 'Real Estate Director',
    },
  },
  {
    id: 3,
    name: 'HDFC Bank',
    logo: 'https://placehold.co/200x80',
    category: 'Banking',
    description: 'India\'s largest private sector bank',
  },
  {
    id: 4,
    name: 'Infosys',
    logo: 'https://placehold.co/200x80',
    category: 'Technology',
    description: 'Global IT consulting company',
  },
  {
    id: 5,
    name: 'Wipro',
    logo: 'https://placehold.co/200x80',
    category: 'Technology',
    description: 'IT services and consulting',
  },
  {
    id: 6,
    name: 'Mahindra Group',
    logo: 'https://placehold.co/200x80',
    category: 'Conglomerate',
    description: 'Multinational conglomerate',
  },
  {
    id: 7,
    name: 'Adani Group',
    logo: 'https://placehold.co/200x80',
    category: 'Infrastructure',
    description: 'Infrastructure and logistics',
  },
  {
    id: 8,
    name: 'Bharti Airtel',
    logo: 'https://placehold.co/200x80',
    category: 'Telecommunications',
    description: 'Leading telecom provider',
  },
  {
    id: 9,
    name: 'L&T - Larsen & Toubro',
    logo: 'https://placehold.co/200x80',
    category: 'Engineering',
    description: 'Engineering conglomerate',
  },
  {
    id: 10,
    name: 'Asian Paints',
    logo: 'https://placehold.co/200x80',
    category: 'Manufacturing',
    description: 'Paint manufacturing company',
  },
];

const CATEGORIES = ['All', 'Technology', 'Banking', 'Conglomerate', 'Infrastructure', 'Manufacturing', 'Telecommunications', 'Engineering'];

// Company Card Component
const CompanyCard = memo(({ company, index, isActive }) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={cardRef}
      className={cn(styles.companyCard, { [styles.active]: isActive })}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className={styles.cardContent}>
        <div className={styles.logoWrapper}>
          <img
            src={company.logo}
            alt={`${company.name} logo - Trusted partner of DGrealtors`}
            className={styles.companyLogo}
            loading="lazy"
          />
          <div className={styles.logoOverlay} />
        </div>
        
        <div className={styles.companyInfo}>
          <h3 className={styles.companyName}>{company.name}</h3>
          <p className={styles.companyCategory}>{company.category}</p>
          {company.description && (
            <p className={styles.companyDescription}>{company.description}</p>
          )}
        </div>

        {company.testimonial && isHovered && (
          <motion.div
            className={styles.testimonialTooltip}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <p className={styles.testimonialText}>"{company.testimonial.text}"</p>
            <div className={styles.testimonialAuthor}>
              <span className={styles.authorName}>{company.testimonial.author}</span>
              <span className={styles.authorPosition}>{company.testimonial.position}</span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
});

CompanyCard.displayName = 'CompanyCard';

// Infinite Scroll Component
const InfiniteScroll = memo(({ companies, speed = 30 }) => {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div
      className={styles.infiniteScrollContainer}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <motion.div
        ref={scrollRef}
        className={styles.infiniteScrollTrack}
        animate={{
          x: isPaused ? 0 : [0, -100 + '%'],
        }}
        transition={{
          x: {
            repeat: Infinity,
            duration: speed,
            ease: 'linear',
          },
        }}
      >
        {/* Duplicate companies for seamless loop */}
        {[...companies, ...companies].map((company, index) => (
          <div key={`${company.id}-${index}`} className={styles.scrollItem}>
            <img
              src={company.logo}
              alt={company.name}
              className={styles.scrollLogo}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
});

InfiniteScroll.displayName = 'InfiniteScroll';

// Main Companies Section Component
const Companies = ({ variant = 'grid' }) => {
  const sectionRef = useRef(null);
  const controls = useAnimation();
  const isInView = useInView(sectionRef, { once: true, threshold: 0.2 });
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredCompanies, setFilteredCompanies] = useState(COMPANIES_DATA);
  const [viewMode, setViewMode] = useState(variant);

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredCompanies(COMPANIES_DATA);
    } else {
      setFilteredCompanies(
        COMPANIES_DATA.filter((company) => company.category === selectedCategory)
      );
    }
  }, [selectedCategory]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const renderCompaniesView = () => {
    switch (viewMode) {
      case 'carousel':
        return (
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            spaceBetween={30}
            slidesPerView={isMobile ? 1 : isTablet ? 2 : 4}
            navigation
            pagination={{ clickable: true }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={true}
            className={styles.companiesSwiper}
          >
            {filteredCompanies.map((company, index) => (
              <SwiperSlide key={company.id}>
                <CompanyCard company={company} index={index} />
              </SwiperSlide>
            ))}
          </Swiper>
        );
      
      case 'infinite':
        return <InfiniteScroll companies={filteredCompanies} speed={50} />;
      
      case 'grid':
      default:
        return (
          <motion.div
            className={styles.companiesGrid}
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            {filteredCompanies.map((company, index) => (
              <CompanyCard key={company.id} company={company} index={index} />
            ))}
          </motion.div>
        );
    }
  };

  return (
    <section ref={sectionRef} className={styles.companiesSection}>
      <div className={styles.container}>
        {/* Section Header */}
        <motion.div
          className={styles.sectionHeader}
          variants={titleVariants}
          initial="hidden"
          animate={controls}
        >
          <span className={styles.sectionLabel}>Our Clients</span>
          <h2 className={styles.sectionTitle}>
            Trusted by Industry Leaders
          </h2>
          <p className={styles.sectionSubtitle}>
            We've had the privilege of serving some of India's most prominent 
            businesses, helping them find their perfect commercial spaces.
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          className={styles.controls}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Category Filter */}
          <div className={styles.categoryFilter}>
            {CATEGORIES.map((category) => (
              <button
                key={category}
                className={cn(styles.categoryButton, {
                  [styles.active]: selectedCategory === category,
                })}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className={styles.viewModeToggle}>
            <button
              className={cn(styles.viewButton, {
                [styles.active]: viewMode === 'grid',
              })}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
            </button>
            <button
              className={cn(styles.viewButton, {
                [styles.active]: viewMode === 'carousel',
              })}
              onClick={() => setViewMode('carousel')}
              aria-label="Carousel view"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="2" y="6" width="20" height="12" rx="2" />
                <circle cx="8" cy="12" r="2" />
                <circle cx="16" cy="12" r="2" />
              </svg>
            </button>
            <button
              className={cn(styles.viewButton, {
                [styles.active]: viewMode === 'infinite',
              })}
              onClick={() => setViewMode('infinite')}
              aria-label="Infinite scroll view"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M8 12h8m0 0l-4-4m4 4l-4 4" />
                <path d="M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
              </svg>
            </button>
          </div>
        </motion.div>

        {/* Companies Display */}
        <motion.div
          className={styles.companiesDisplay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {renderCompaniesView()}
        </motion.div>

        {/* Stats */}
        <motion.div
          className={styles.stats}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className={styles.statItem}>
            <span className={styles.statValue}>500+</span>
            <span className={styles.statLabel}>Corporate Clients</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statValue}>50M+</span>
            <span className={styles.statLabel}>Sq.ft. Leased</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statValue}>98%</span>
            <span className={styles.statLabel}>Client Retention</span>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className={styles.ctaSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <p className={styles.ctaText}>
            Join the growing list of successful businesses that trust DGrealtors
          </p>
          <button className={styles.ctaButton}>
            Become a Client
            <svg
              className={styles.ctaIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path d="M5 12h14m0 0l-7-7m7 7l-7 7" />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(Companies);
            
