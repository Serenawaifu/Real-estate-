// ==========================================
// DGrealtors - Location Card Component
// ==========================================

import React, { useState, useRef, useEffect, memo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiMapPin, 
  FiHome, 
  FiTrendingUp, 
  FiDollarSign,
  FiMaximize,
  FiCalendar,
  FiEye,
  FiHeart,
  FiShare2,
  FiInfo,
  FiClock,
  FiAward,
  FiWifi,
  FiShield,
  FiStar,
  FiCamera,
  FiChevronRight,
  FiExternalLink,
  FiPhone,
  FiMail
} from 'react-icons/fi';
import { BsBuilding, BsShop, BsHouseDoor, BsGraphUp, BsPersonFill } from 'react-icons/bs';
import { HiOutlineOfficeBuilding } from 'react-icons/hi';
import { MdLocalParking, MdElevator, MdSecurity } from 'react-icons/md';

// Components
import ImageGallery from '../../common/ImageGallery';
import Tooltip from '../../common/Tooltip';
import ShareModal from '../../common/ShareModal';
import Badge from '../../common/Badge';
import Rating from '../../common/Rating';

// Hooks
import { useInView } from 'react-intersection-observer';
import { use3DHover } from '../../../hooks/use3DHover';
import { useImagePreloader } from '../../../hooks/useImagePreloader';

// Utils
import { cn } from '../../../utils/cn';
import { formatCurrency, formatNumber, formatArea, formatDate } from '../../../utils/format';

// Styles
import styles from './LocationCard.module.css';

// Constants
const AMENITY_ICONS = {
  'Metro': <FiMapPin />,
  'Parking': <MdLocalParking />,
  'Security': <MdSecurity />,
  'Elevator': <MdElevator />,
  'WiFi': <FiWifi />,
  'Restaurants': <BsShop />,
  'Banks': <BsBuilding />,
  'Hotels': <BsHouseDoor />,
  'Gym': <FiShield />,
  'Mall': <BsShop />,
  'Hospital': <FiInfo />,
  'School': <BsPersonFill />
};

const PROPERTY_TYPE_CONFIG = {
  commercial: {
    icon: <BsBuilding />,
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.1)',
    label: 'Commercial'
  },
  retail: {
    icon: <BsShop />,
    color: '#9333ea',
    bgColor: 'rgba(147, 51, 234, 0.1)',
    label: 'Retail'
  },
  residential: {
    icon: <BsHouseDoor />,
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.1)',
    label: 'Residential'
  },
  industrial: {
    icon: <HiOutlineOfficeBuilding />,
    color: '#fb923c',
    bgColor: 'rgba(251, 146, 60, 0.1)',
    label: 'Industrial'
  }
};

// Sub-components
const StatsDisplay = memo(({ stats, compact = false }) => {
  return (
    <div className={cn(styles.statsDisplay, { [styles.compact]: compact })}>
      {Object.entries(stats).map(([key, value]) => (
        <motion.div 
          key={key}
          className={styles.statItem}
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <span className={styles.statLabel}>
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </span>
          <span className={styles.statValue}>{value}</span>
        </motion.div>
      ))}
    </div>
  );
});

StatsDisplay.displayName = 'StatsDisplay';

const AmenityBadge = memo(({ amenity, showLabel = false }) => {
  const icon = AMENITY_ICONS[amenity] || <FiInfo />;
  
  return (
    <Tooltip content={amenity}>
      <div className={styles.amenityBadge}>
        {icon}
        {showLabel && <span>{amenity}</span>}
      </div>
    </Tooltip>
  );
});

AmenityBadge.displayName = 'AmenityBadge';

// Contact Card Component
const ContactCard = memo(({ contact, onClose }) => {
  return (
    <motion.div
      className={styles.contactCard}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <button className={styles.closeButton} onClick={onClose}>×</button>
      <h4>Property Manager</h4>
      <div className={styles.contactInfo}>
        <div className={styles.contactItem}>
          <FiPhone />
          <a href={`tel:${contact.phone}`}>{contact.phone}</a>
        </div>
        <div className={styles.contactItem}>
          <FiMail />
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </div>
      </div>
    </motion.div>
  );
});

ContactCard.displayName = 'ContactCard';

// Main Location Card Component
const LocationCard = ({
  location,
  variant = 'sticky',
  view = 'grid',
  index = 0,
  onCardClick,
  onFavorite,
  onShare,
  className
}) => {
  const cardRef = useRef(null);
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  // State
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(location.isFavorite || false);
  const [showGallery, setShowGallery] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  // Preload images
  const { loaded: imagesLoaded } = useImagePreloader(location.images || [location.image]);

  // 3D Hover Effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  // Spring animations
  const springConfig = { damping: 20, stiffness: 300 };
  const springX = useSpring(rotateX, springConfig);
  const springY = useSpring(rotateY, springConfig);

  // Calculate dynamic rotation for sticky note effect
  const getStickyRotation = () => {
    if (variant !== 'sticky') return 0;
    const rotations = [2, -2, 1.5, -1, 2.5];
    return rotations[index % rotations.length];
  };

  // Handle mouse move for 3D effect
  const handleMouseMove = (e) => {
    if (variant !== 'modern') return;
    
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set((e.clientX - centerX) / 5);
    y.set((e.clientY - centerY) / 5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Handle favorite toggle
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    if (onFavorite) {
      onFavorite(location, !isFavorite);
    }
  };

  // Handle share
  const handleShareClick = (e) => {
    e.stopPropagation();
    setShowShareModal(true);
    if (onShare) {
      onShare(location);
    }
  };

  // Card click handler
  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(location);
    }
  };

  // Animation variants
  const cardVariants = {
    initial: {
      opacity: 0,
      y: 50,
      rotate: 0,
      scale: 0.9
    },
    animate: {
      opacity: 1,
      y: 0,
      rotate: getStickyRotation(),
      scale: 1,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: 'easeOut'
      }
    },
    hover: {
      rotate: 0,
      scale: 1.02,
      y: -10,
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    }
  };

  // Sticky note colors based on index
  const getStickyColor = () => {
    const colors = [
      '#fef3c7', // Yellow
      '#fecaca', // Red
      '#d9f99d', // Green
      '#bfdbfe', // Blue
      '#e9d5ff'  // Purple
    ];
    return colors[index % colors.length];
  };

  // Image navigation
  const nextImage = (e) => {
    e.stopPropagation();
    if (location.images) {
      setSelectedImage((prev) => (prev + 1) % location.images.length);
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (location.images) {
      setSelectedImage((prev) => (prev - 1 + location.images.length) % location.images.length);
    }
  };

  // Render based on view mode
  if (view === 'list') {
    return (
      <motion.article
        ref={ref}
        className={cn(styles.locationCardList, className)}
        variants={cardVariants}
        initial="initial"
        animate={inView ? "animate" : "initial"}
        whileHover="hover"
        onClick={handleCardClick}
      >
        <div className={styles.listImageSection}>
          <img
            src={location.images?.[0] || location.image}
            alt={location.name}
            className={styles.listImage}
            loading="lazy"
          />
          {location.featured && (
            <Badge variant="featured" className={styles.featuredBadge}>
              <FiAward /> Featured
            </Badge>
          )}
          <div className={styles.imageCount}>
            <FiCamera />
            <span>{location.images?.length || 1}</span>
          </div>
        </div>

        <div className={styles.listContent}>
          <div className={styles.listHeader}>
            <div>
              <h3 className={styles.locationName}>{location.name}</h3>
              <p className={styles.locationArea}>
                <FiMapPin />
                {location.area}
              </p>
            </div>
            <div className={styles.propertyTypeBadge} style={{
              backgroundColor: PROPERTY_TYPE_CONFIG[location.type]?.bgColor,
              color: PROPERTY_TYPE_CONFIG[location.type]?.color
            }}>
              {PROPERTY_TYPE_CONFIG[location.type]?.icon}
              <span>{PROPERTY_TYPE_CONFIG[location.type]?.label}</span>
            </div>
          </div>

          <p className={styles.description}>{location.description}</p>

          <div className={styles.listStats}>
            <div className={styles.statGroup}>
              <FiHome />
              <span>{location.properties} Properties</span>
            </div>
            <div className={styles.statGroup}>
              <FiDollarSign />
              <span>{formatCurrency(location.avgPrice)}/sq.ft</span>
            </div>
            <div className={cn(styles.statGroup, {
              [styles.positive]: location.priceChange > 0,
              [styles.negative]: location.priceChange < 0
            })}>
              <FiTrendingUp />
              <span>{location.priceChange > 0 ? '+' : ''}{location.priceChange}%</span>
            </div>
            {location.rating && (
              <div className={styles.statGroup}>
                <Rating value={location.rating} size="small" readOnly />
              </div>
            )}
          </div>

          <div className={styles.amenitiesList}>
            {location.amenities.slice(0, 5).map((amenity, idx) => (
              <AmenityBadge key={idx} amenity={amenity} showLabel />
            ))}
            {location.amenities.length > 5 && (
              <span className={styles.moreAmenities}>
                +{location.amenities.length - 5} more
              </span>
            )}
          </div>
        </div>

        <div className={styles.listActions}>
          <motion.button
            className={cn(styles.iconButton, { [styles.active]: isFavorite })}
            onClick={handleFavoriteClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiHeart />
          </motion.button>
          <motion.button
            className={styles.iconButton}
            onClick={handleShareClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiShare2 />
          </motion.button>
          <Link 
            to={`/locations/${location.id}`} 
            className={styles.viewButton}
            onClick={(e) => e.stopPropagation()}
          >
            View Details
            <FiChevronRight />
          </Link>
        </div>
      </motion.article>
    );
  }

  // Grid/Card View
  return (
    <>
      <motion.article
        ref={cardRef}
        className={cn(
          styles.locationCard,
          styles[`card--${variant}`],
          {
            [styles.featured]: location.featured,
            [styles.hovered]: isHovered
          },
          className
        )}
        style={{
          backgroundColor: variant === 'sticky' ? getStickyColor() : 'white',
          transformStyle: 'preserve-3d',
          rotateX: variant === 'modern' ? springX : 0,
          rotateY: variant === 'modern' ? springY : 0
        }}
        variants={cardVariants}
        initial="initial"
        animate={inView ? "animate" : "initial"}
        whileHover="hover"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => {
          setIsHovered(false);
          handleMouseLeave();
        }}
        onMouseMove={handleMouseMove}
        onClick={handleCardClick}
      >
        {/* Sticky Note Corner */}
        {variant === 'sticky' && (
          <div className={styles.stickyCorner}>
            <div className={styles.stickyFold} />
            <div className={styles.stickyPin} />
          </div>
        )}

        {/* Image Section */}
        <div className={styles.imageSection}>
          <motion.div 
            className={styles.imageWrapper}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            {imagesLoaded ? (
              <img
                src={location.images?.[selectedImage] || location.image}
                alt={`${location.name} - ${location.type} property in ${location.area}`}
                className={styles.mainImage}
              />
            ) : (
              <div className={styles.imageSkeleton} />
            )}
            
            <div className={styles.imageOverlay} />
            
            {/* Image Navigation */}
            {location.images?.length > 1 && isHovered && (
              <>
                <button 
                  className={cn(styles.imageNav, styles.prevNav)}
                  onClick={prevImage}
                >
                  ‹
                </button>
                <button 
                  className={cn(styles.imageNav, styles.nextNav)}
                  onClick={nextImage}
                >
                  ›
                </button>
              </>
            )}
            
            {/* Image Gallery Trigger */}
            {location.images?.length > 1 && (
              <button
                className={styles.galleryTrigger}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowGallery(true);
                }}
              >
                <FiCamera />
                <span>{location.images.length}</span>
              </button>
            )}

            {/* Virtual Tour Badge */}
            {location.virtualTour && (
              <div className={styles.virtualTourBadge}>
                <FiEye />
                360° Tour
              </div>
            )}
          </motion.div>

          {/* Featured Badge */}
          {location.featured && (
            <motion.div
              className={styles.featuredRibbon}
              initial={{ rotate: -2 }}
              animate={{ rotate: 2 }}
              transition={{ 
                repeat: Infinity, 
                duration: 2, 
                repeatType: 'reverse',
                ease: 'easeInOut'
              }}
            >
              <FiAward />
              <span>Featured</span>
            </motion.div>
          )}

          {/* Property Type Badge */}
          <Tooltip content={PROPERTY_TYPE_CONFIG[location.type]?.label}>
            <div 
              className={styles.propertyType}
              style={{ 
                backgroundColor: PROPERTY_TYPE_CONFIG[location.type]?.bgColor,
                color: PROPERTY_TYPE_CONFIG[location.type]?.color
              }}
            >
              {PROPERTY_TYPE_CONFIG[location.type]?.icon}
            </div>
          </Tooltip>

          {/* Quick Actions */}
          <AnimatePresence>
            {(isHovered || isFavorite) && (
              <motion.div
                className={styles.quickActions}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.button
                  className={cn(styles.actionButton, { [styles.active]: isFavorite })}
                  onClick={handleFavoriteClick}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiHeart />
                  <span>{isFavorite ? 'Saved' : 'Save'}</span>
                </motion.button>
                <motion.button
                  className={styles.actionButton}
                  onClick={handleShareClick}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiShare2 />
                  <span>Share</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Image Thumbnails */}
          {location.images?.length > 1 && isHovered && (
            <motion.div
              className={styles.imageThumbnails}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              {location.images.slice(0, 4).map((img, idx) => (
                <button
                  key={idx}
                  className={cn(styles.thumbnail, {
                    [styles.active]: selectedImage === idx
                  })}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(idx);
                  }}
                >
                  <img src={img} alt={`View ${idx + 1}`} />
                  {idx === 3 && location.images.length > 4 && (
                    <div className={styles.moreImages}>
                      +{location.images.length - 4}
                    </div>
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Content Section */}
        <div className={styles.cardContent}>
          <div className={styles.cardHeader}>
            <h3 className={styles.locationName}>{location.name}</h3>
            <p className={styles.locationArea}>
              <FiMapPin />
              {location.area}
            </p>
          </div>

          <p className={styles.description}>
            {location.description}
          </p>

          {/* Stats Grid */}
          <div className={styles.statsGrid}>
            <div className={styles.statBox}>
              <FiHome className={styles.statIcon} />
              <div>
                <span className={styles.statValue}>{location.properties}</span>
                <span className={styles.statLabel}>Properties</span>
              </div>
            </div>
            
            <div className={styles.statBox}>
              <FiDollarSign className={styles.statIcon} />
              <div>
                <span className={styles.statValue}>{formatCurrency(location.avgPrice)}</span>
                <span className={styles.statLabel}>Avg/sq.ft</span>
              </div>
            </div>
            
            <div className={styles.statBox}>
              <FiTrendingUp className={styles.statIcon} />
              <div>
                <span className={cn(styles.statValue, {
                  [styles.positive]: location.priceChange > 0,
                  [styles.negative]: location.priceChange < 0
                })}>
                  {location.priceChange > 0 ? '+' : ''}{location.priceChange}%
                </span>
                <span className={styles.statLabel}>YoY</span>
              </div>
            </div>
          </div>

          {/* Popular For */}
          <div className={styles.popularFor}>
            <p className={styles.popularLabel}>Popular for:</p>
            <div className={styles.popularTags}>
              {location.popularFor.map((item, idx) => (
                <span key={idx} className={styles.popularTag}>{item}</span>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div className={styles.amenities}>
            {location.amenities.slice(0, 3).map((amenity, idx) => (
              <AmenityBadge key={idx} amenity={amenity} />
            ))}
            {location.amenities.length > 3 && (
              <Tooltip content={location.amenities.slice(3).join(', ')}>
                <span className={styles.amenityMore}>
                  +{location.amenities.length - 3}
                </span>
              </Tooltip>
            )}
          </div>

          {/* Rating */}
          {location.rating && (
            <div className={styles.rating}>
              <Rating value={location.rating} size="small" readOnly />
              <span className={styles.ratingCount}>({location.ratingCount})</span>
            </div>
          )}

          {/* Hover Actions */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                className={styles.hoverActions}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <Link 
                  to={`/locations/${location.id}`}
                  className={styles.viewDetailsButton}
                  onClick={(e) => e.stopPropagation()}
                >
                  <FiEye />
                  View Details
                </Link>
                <button
                  className={styles.contactButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowContact(true);
                  }}
                >
                  <FiPhone />
                  Contact
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Additional Stats Panel */}
          <AnimatePresence>
            {showDetailPanel && location.stats && (
              <motion.div
                className={styles.detailPanel}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <StatsDisplay stats={location.stats} compact />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Info Button */}
        <button
          className={styles.infoButton}
          onClick={(e) => {
            e.stopPropagation();
            setShowDetailPanel(!showDetailPanel);
          }}
        >
          <FiInfo />
        </button>
      </motion.article>

      {/* Image Gallery Modal */}
      <AnimatePresence>
        {showGallery && location.images && (
          <ImageGallery
            images={location.images}
            initialIndex={selectedImage}
            onClose={() => setShowGallery(false)}
            title={location.name}
          />
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <ShareModal
            url={`https://dgrealtors.in/locations/${location.id}`}
            title={`Check out ${location.name} on DGrealtors`}
            onClose={() => setShowShareModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Contact Card */}
      <AnimatePresence>
        {showContact && location.contact && (
          <ContactCard
            contact={location.contact}
            onClose={() => setShowContact(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default memo(LocationCard);
