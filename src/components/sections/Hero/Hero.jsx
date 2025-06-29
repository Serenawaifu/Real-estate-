// ==========================================
// DGrealtors - Hero Section Component
// ==========================================

import React, { useState, useEffect, useRef, memo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { Parallax } from 'react-parallax';
import Typed from 'react-typed';
import { FiSearch, FiMapPin, FiHome, FiTrendingUp, FiArrowRight, FiPlay } from 'react-icons/fi';
import { BsBuilding, BsHouseDoor, BsShop } from 'react-icons/bs';
import { HiOutlineOfficeBuilding } from 'react-icons/hi';

// Components
import Button from '../../common/Button';
import SearchBar from '../../common/SearchBar';
import VideoModal from '../../common/VideoModal';
import AnimatedText from '../../common/AnimatedText';
import ParticlesBackground from '../../animations/ParticlesBackground';
import WaterRipple from '../../animations/WaterRipple';

// Hooks
import { useWindowSize } from '../../../hooks/useWindowSize';
import { useMediaQuery } from '../../../hooks/useMediaQuery';

// Utils
import { cn } from '../../../utils/cn';
import { formatNumber } from '../../../utils/format';

// Styles
import styles from './Hero.module.css';

// Constants
const HERO_STATS = [
  { value: 500, suffix: '+', label: 'Properties Listed', icon: <BsBuilding /> },
  { value: 14, suffix: ' Years', label: 'Of Excellence', icon: <FiTrendingUp /> },
  { value: 1000, suffix: '+', label: 'Happy Clients', icon: <FiHome /> },
  { value: 50, suffix: 'M+', label: 'Sq.ft. Managed', icon: <HiOutlineOfficeBuilding /> },
];

const PROPERTY_TYPES = [
  { id: 'commercial', label: 'Commercial', icon: <BsBuilding />, color: 'var(--color-dg-orange)' },
  { id: 'residential', label: 'Residential', icon: <BsHouseDoor />, color: 'var(--color-dg-peach)' },
  { id: 'industrial', label: 'Industrial', icon: <HiOutlineOfficeBuilding />, color: 'var(--color-dg-olive)' },
  { id: 'retail', label: 'Retail', icon: <BsShop />, color: 'var(--color-dg-dark)' },
];

const TYPED_STRINGS = [
  'Find Your Dream Property',
  'Invest in Premium Spaces',
  'Discover Prime Locations',
  'Build Your Business Empire',
];

// Sub-components
const StatCard = memo(({ stat, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const stepValue = stat.value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += stepValue;
        if (current >= stat.value) {
          setCount(stat.value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isInView, stat.value]);

  return (
    <motion.div
      ref={ref}
      className={styles.statCard}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className={styles.statIcon}>{stat.icon}</div>
      <div className={styles.statContent}>
        <div className={styles.statValue}>
          <span>{formatNumber(count)}</span>
          <span className={styles.statSuffix}>{stat.suffix}</span>
        </div>
        <div className={styles.statLabel}>{stat.label}</div>
      </div>
    </motion.div>
  );
});

StatCard.displayName = 'StatCard';

// Quick Search Component
const QuickSearch = memo(({ onSearch }) => {
  const [searchData, setSearchData] = useState({
    query: '',
    propertyType: '',
    location: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchData);
  };

  return (
    <form className={styles.quickSearch} onSubmit={handleSubmit}>
      <div className={styles.searchInputs}>
        <div className={styles.searchField}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            name="query"
            value={searchData.query}
            onChange={handleChange}
            placeholder="Search by property, location..."
            className={styles.searchInput}
          />
        </div>
        
        <div className={styles.searchDivider} />
        
        <div className={styles.searchField}>
          <BsBuilding className={styles.searchIcon} />
          <select
            name="propertyType"
            value={searchData.propertyType}
            onChange={handleChange}
            className={styles.searchSelect}
          >
            <option value="">Property Type</option>
            {PROPERTY_TYPES.map(type => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className={styles.searchDivider} />
        
        <div className={styles.searchField}>
          <FiMapPin className={styles.searchIcon} />
          <input
            type="text"
            name="location"
            value={searchData.location}
            onChange={handleChange}
            placeholder="Location"
            className={styles.searchInput}
          />
        </div>
      </div>
      
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className={styles.searchButton}
      >
        <FiSearch />
        Search
      </Button>
    </form>
  );
});

QuickSearch.displayName = 'QuickSearch';

// Main Hero Component
const Hero = ({ variant = 'default', data = {} }) => {
  const sectionRef = useRef(null);
  const { width: windowWidth } = useWindowSize();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');
  
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedPropertyType, setSelectedPropertyType] = useState(null);
  
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, -300]);
  const opacity = useTransform(scrollY, [0, 600], [1, 0]);
  const scale = useTransform(scrollY, [0, 600], [1, 1.1]);
  
  const springConfig = { damping: 15, stiffness: 100 };
  const ySpring = useSpring(y, springConfig);
  const opacitySpring = useSpring(opacity, springConfig);
  const scaleSpring = useSpring(scale, springConfig);

  const handleSearch = (searchData) => {
    console.log('Search:', searchData);
    // Navigate to properties page with search params
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const heroContent = (
    <motion.div
      className={styles.heroContent}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Badge */}
      <motion.div className={styles.badge} variants={itemVariants}>
        <span className={styles.badgeIcon}>🏆</span>
        <span>Mumbai's #1 Real Estate Agency</span>
      </motion.div>

      {/* Title with Typed.js */}
      <motion.h1 className={styles.heroTitle} variants={itemVariants}>
        <Typed
          strings={TYPED_STRINGS}
          typeSpeed={50}
          backSpeed={30}
          backDelay={2000}
          loop
          className={styles.typedText}
        />
        <span className={styles.staticText}>With DGrealtors</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p className={styles.heroSubtitle} variants={itemVariants}>
        14+ years of excellence in commercial real estate. We help businesses 
        find their perfect space and investors discover lucrative opportunities.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div className={styles.ctaButtons} variants={itemVariants}>
        <Link to="/properties">
          <Button variant="primary" size="lg" className={styles.ctaPrimary}>
            Explore Properties
            <FiArrowRight />
          </Button>
        </Link>
        
        <Button
          variant="outline"
          size="lg"
          className={styles.ctaSecondary}
          onClick={() => setShowVideoModal(true)}
        >
          <FiPlay />
          Watch Video
        </Button>
      </motion.div>

      {/* Property Type Cards */}
      <motion.div className={styles.propertyTypes} variants={itemVariants}>
        {PROPERTY_TYPES.map((type, index) => (
          <motion.div
            key={type.id}
            className={cn(styles.propertyTypeCard, {
              [styles.propertyTypeCardActive]: selectedPropertyType === type.id,
            })}
            onClick={() => setSelectedPropertyType(type.id)}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            style={{ '--card-color': type.color }}
          >
            <div className={styles.propertyTypeIcon}>{type.icon}</div>
            <span className={styles.propertyTypeLabel}>{type.label}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Search */}
      <motion.div className={styles.searchSection} variants={itemVariants}>
        <QuickSearch onSearch={handleSearch} />
      </motion.div>

      {/* Trust Indicators */}
      <motion.div className={styles.trustIndicators} variants={itemVariants}>
        <div className={styles.trustItem}>
          <img src="https://placehold.co/100x40" alt="RERA Certified - Real Estate Regulatory Authority certification ensuring transparency and accountability" />
        </div>
        <div className={styles.trustItem}>
          <img src="https://placehold.co/100x40" alt="ISO 9001:2015 Certified - International quality management system certification" />
        </div>
        <div className={styles.trustItem}>
          <img src="https://placehold.co/100x40" alt="CREDAI Member - Confederation of Real Estate Developers Association of India membership" />
        </div>
        <div className={styles.trustItem}>
          <img src="https://placehold.co/100x40" alt="NAR India Member - National Association of Realtors India membership" />
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <section ref={sectionRef} className={cn(styles.hero, styles[`hero--${variant}`])}>
      {/* Background Effects */}
      {variant === 'parallax' ? (
        <Parallax
          bgImage={data.backgroundImage || "https://placehold.co/1920x1080"}
          bgImageAlt="Modern Mumbai skyline with commercial buildings and office spaces"
          strength={300}
          className={styles.parallaxBg}
        >
          <div className={styles.parallaxContent}>
            {variant === 'particles' && <ParticlesBackground />}
            {variant === 'water' && <WaterRipple />}
            {heroContent}
          </div>
        </Parallax>
      ) : (
        <div className={styles.heroWrapper}>
          <motion.div
            className={styles.heroBackground}
            style={{
              y: ySpring,
              scale: scaleSpring,
              opacity: opacitySpring,
            }}
          >
            <img
              src={data.backgroundImage || "https://placehold.co/1920x1080"}
              alt="Premium commercial real estate properties in Mumbai showcasing modern architecture and prime locations"
              className={styles.heroImage}
            />
            <div className={styles.heroOverlay} />
          </motion.div>

          <div className={styles.heroContainer}>
            {variant === 'particles' && <ParticlesBackground />}
            {variant === 'water' && <WaterRipple />}
            {heroContent}
          </div>
        </div>
      )}

      {/* Stats Section */}
      <div className={styles.statsSection}>
        <div className={styles.statsContainer}>
          {HERO_STATS.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} />
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className={styles.scrollIndicator}
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <span>Scroll to explore</span>
        <div className={styles.scrollMouse}>
          <div className={styles.scrollWheel} />
        </div>
      </motion.div>

      {/* Video Modal */}
      <VideoModal
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        videoUrl={data.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
        title="DGrealtors - Your Partner in Real Estate Success"
      />
    </section>
  );
};

export default memo(Hero);
    
