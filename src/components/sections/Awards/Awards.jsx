// ==========================================
// DGrealtors - Awards Section Component
// ==========================================

import React, { useState, useEffect, useRef, memo } from 'react';
import { motion, AnimatePresence, useAnimation, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  FiAward, 
  FiCalendar, 
  FiExternalLink, 
  FiShare2,
  FiDownload,
  FiFilter,
  FiGrid,
  FiList,
  FiMaximize2
} from 'react-icons/fi';
import { 
  BsTrophy, 
  BsStar, 
  BsStarFill,
  BsBuilding,
  BsGlobe,
  BsPeople
} from 'react-icons/bs';
import { HiOutlineOfficeBuilding, HiOutlineUserGroup } from 'react-icons/hi';

// Components
import Modal from '../../common/Modal';
import Button from '../../common/Button';
import Tooltip from '../../common/Tooltip';
import ShareModal from '../../common/ShareModal';

// Hooks
import { useMediaQuery } from '../../../hooks/useMediaQuery';

// Utils
import { cn } from '../../../utils/cn';
import { formatDate } from '../../../utils/format';

// Styles
import styles from './Awards.module.css';

// Constants
const AWARDS_DATA = [
  {
    id: 1,
    title: 'Best Real Estate Agency of the Year',
    organization: 'National Real Estate Awards',
    year: 2023,
    category: 'Excellence',
    description: 'Recognized for outstanding performance and client satisfaction in commercial real estate.',
    icon: <BsTrophy />,
    image: 'https://placehold.co/600x400',
    certificateUrl: '#',
    details: {
      criteria: ['Client Satisfaction Score > 98%', '50M+ sq.ft. Leased', '500+ Successful Transactions'],
      judges: ['Industry Veterans', 'Market Analysts', 'Client Representatives'],
      competitors: 250,
      rank: 1
    },
    featured: true
  },
  {
    id: 2,
    title: 'Top Commercial Property Consultant',
    organization: 'Mumbai Business Excellence Awards',
    year: 2023,
    category: 'Leadership',
    description: 'Awarded for innovative solutions and market leadership in commercial property consulting.',
    icon: <BsBuilding />,
    image: 'https://placehold.co/600x400',
    certificateUrl: '#',
    details: {
      criteria: ['Innovation in Service', 'Market Share Growth', 'Technology Adoption'],
      judges: ['Business Leaders', 'Property Experts', 'Tech Innovators'],
      competitors: 180,
      rank: 1
    }
  },
  {
    id: 3,
    title: 'Customer Service Excellence Award',
    organization: 'Indian Customer Experience Forum',
    year: 2022,
    category: 'Service',
    description: 'Honored for exceptional customer service and client relationship management.',
    icon: <HiOutlineUserGroup />,
    image: 'https://placehold.co/600x400',
    certificateUrl: '#',
    details: {
      criteria: ['NPS Score > 90', '24/7 Support', 'Resolution Time < 24hrs'],
      judges: ['CX Experts', 'Industry Consultants', 'Client Panels'],
      competitors: 300,
      rank: 1
    }
  },
  {
    id: 4,
    title: 'Digital Innovation in Real Estate',
    organization: 'PropTech Awards India',
    year: 2022,
    category: 'Innovation',
    description: 'Recognized for implementing cutting-edge technology in real estate services.',
    icon: <BsGlobe />,
    image: 'https://placehold.co/600x400',
    certificateUrl: '#',
    details: {
      criteria: ['Digital Platform Usage', 'Virtual Tours Implementation', 'AI-Powered Matching'],
      judges: ['Tech Leaders', 'PropTech Experts', 'VCs'],
      competitors: 150,
      rank: 1
    }
  },
  {
    id: 5,
    title: 'Sustainability Excellence Award',
    organization: 'Green Building Council',
    year: 2021,
    category: 'Sustainability',
    description: 'Awarded for promoting green buildings and sustainable real estate practices.',
    icon: <BsStar />,
    image: 'https://placehold.co/600x400',
    certificateUrl: '#',
    details: {
      criteria: ['Green Building Projects', 'Energy Efficiency', 'Waste Reduction'],
      judges: ['Environmental Experts', 'Sustainability Consultants', 'Government Officials'],
      competitors: 200,
      rank: 1
    }
  },
  // Add more awards...
];

const CATEGORIES = ['All', 'Excellence', 'Leadership', 'Service', 'Innovation', 'Sustainability'];
const YEARS = ['All Years', '2023', '2022', '2021', '2020'];

// Award Card Component
const AwardCard = memo(({ award, index, viewMode, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const cardRef = useRef(null);
  const controls = useAnimation();

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: 'easeOut'
      }
    },
    hover: {
      y: -10,
      scale: 1.02,
      transition: {
        duration: 0.3
      }
    }
  };

  const glowVariants = {
    initial: {
      opacity: 0,
      scale: 0.8
    },
    animate: {
      opacity: [0, 1, 0],
      scale: [0.8, 1.2, 0.8],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        className={styles.awardListItem}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        onClick={() => onClick(award)}
      >
        <div className={styles.listIcon}>
          {award.icon}
          {award.featured && (
            <span className={styles.featuredBadge}>
              <BsStarFill />
            </span>
          )}
        </div>
        
        <div className={styles.listContent}>
          <div className={styles.listHeader}>
            <h3 className={styles.listTitle}>{award.title}</h3>
            <span className={styles.listYear}>{award.year}</span>
          </div>
          
          <p className={styles.listOrganization}>{award.organization}</p>
          <p className={styles.listDescription}>{award.description}</p>
          
          <div className={styles.listMeta}>
            <span className={styles.metaItem}>
              <BsPeople />
              Beat {award.details.competitors} competitors
            </span>
            <span className={styles.metaItem}>
              <BsTrophy />
              Rank #{award.details.rank}
            </span>
            <span className={styles.categoryBadge}>{award.category}</span>
          </div>
        </div>
        
        <div className={styles.listActions}>
          <Tooltip content="View Certificate">
            <motion.button
              className={styles.actionButton}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiMaximize2 />
            </motion.button>
          </Tooltip>
          <Tooltip content="Download">
            <motion.button
              className={styles.actionButton}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiDownload />
            </motion.button>
          </Tooltip>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={cardRef}
      className={cn(styles.awardCard, {
        [styles.featured]: award.featured,
        [styles.hovered]: isHovered
      })}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onClick(award)}
      layout
    >
      {/* Glow Effect for Featured */}
      {award.featured && (
        <motion.div
          className={styles.glowEffect}
          variants={glowVariants}
          initial="initial"
          animate="animate"
        />
      )}
      
      {/* Award Icon */}
      <div className={styles.iconWrapper}>
        <motion.div
          className={styles.iconBackground}
          animate={{ rotate: isHovered ? 360 : 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />
        <div className={styles.awardIcon}>
          {award.icon}
        </div>
        {award.featured && (
          <div className={styles.featuredStar}>
            <BsStarFill />
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className={styles.cardContent}>
        <div className={styles.yearBadge}>
          <FiCalendar />
          {award.year}
        </div>
        
        <h3 className={styles.awardTitle}>{award.title}</h3>
        <p className={styles.organization}>{award.organization}</p>
        <p className={styles.description}>{award.description}</p>
        
        <div className={styles.categoryTag}>
          <span>{award.category}</span>
        </div>
        
        {/* Quick Stats */}
        <div className={styles.quickStats}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{award.details.competitors}</span>
            <span className={styles.statLabel}>Competitors</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statValue}>#{award.details.rank}</span>
            <span className={styles.statLabel}>Rank</span>
          </div>
        </div>
        
        {/* Hover Actions */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className={styles.hoverActions}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <button
                className={styles.viewButton}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetails(true);
                }}
              >
                View Details
                <FiExternalLink />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Certificate Preview */}
      <motion.div
        className={styles.certificatePreview}
        animate={{ scale: isHovered ? 1.05 : 1 }}
      >
        <img 
          src={award.image} 
          alt={`${award.title} certificate`}
          className={styles.certificateImage}
        />
        <div className={styles.certificateOverlay}>
          <FiMaximize2 />
        </div>
      </motion.div>
    </motion.div>
  );
});

AwardCard.displayName = 'AwardCard';

// Award Details Modal
const AwardDetailsModal = memo(({ award, isOpen, onClose }) => {
  const [showShareModal, setShowShareModal] = useState(false);

  if (!award) return null;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="large"
        title={award.title}
        className={styles.detailsModal}
      >
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <div className={styles.modalIcon}>{award.icon}</div>
            <div className={styles.modalInfo}>
              <h2 className={styles.modalTitle}>{award.title}</h2>
              <p className={styles.modalOrganization}>{award.organization}</p>
              <div className={styles.modalMeta}>
                <span className={styles.metaItem}>
                  <FiCalendar />
                  {award.year}
                </span>
                <span className={cn(styles.categoryBadge, styles.large)}>
                  {award.category}
                </span>
              </div>
            </div>
          </div>
          
          <div className={styles.modalBody}>
            <div className={styles.certificateSection}>
              <img 
                src={award.image} 
                alt={`${award.title} certificate`}
                className={styles.fullCertificate}
              />
              <div className={styles.certificateActions}>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<FiDownload />}
                  onClick={() => {
                    // Download logic
                    window.open(award.certificateUrl, '_blank');
                  }}
                >
                  Download Certificate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<FiShare2 />}
                  onClick={() => setShowShareModal(true)}
                >
                  Share
                </Button>
              </div>
            </div>
            
            <div className={styles.detailsSection}>
              <h3 className={styles.sectionTitle}>Achievement Details</h3>
              <p className={styles.detailDescription}>{award.description}</p>
              
              <div className={styles.criteriaSection}>
                <h4>Award Criteria</h4>
                <ul className={styles.criteriaList}>
                  {award.details.criteria.map((criterion, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <BsStar className={styles.criteriaIcon} />
                      {criterion}
                    </motion.li>
                  ))}
                </ul>
              </div>
              
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <BsPeople className={styles.statIcon} />
                  <div>
                    <span className={styles.statValue}>{award.details.competitors}</span>
                    <span className={styles.statLabel}>Total Participants</span>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <BsTrophy className={styles.statIcon} />
                  <div>
                    <span className={styles.statValue}>#{award.details.rank}</span>
                    <span className={styles.statLabel}>Final Rank</span>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <HiOutlineUserGroup className={styles.statIcon} />
                  <div>
                    <span className={styles.statValue}>{award.details.judges.length}</span>
                    <span className={styles.statLabel}>Judge Panels</span>
                  </div>
                </div>
              </div>
              
              <div className={styles.judgesSection}>
                <h4>Judging Panel</h4>
                <div className={styles.judgesList}>
                  {award.details.judges.map((judge, index) => (
                    <span key={index} className={styles.judgeTag}>{judge}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title={award.title}
        url={window.location.href}
        description={`DGrealtors wins ${award.title} from ${award.organization}`}
      />
    </>
  );
});

AwardDetailsModal.displayName = 'AwardDetailsModal';

// Timeline View Component
const TimelineView = memo(({ awards }) => {
  return (
    <div className={styles.timeline}>
      <div className={styles.timelineLine} />
      {awards.map((award, index) => (
        <motion.div
          key={award.id}
          className={cn(styles.timelineItem, {
            [styles.left]: index % 2 === 0,
            [styles.right]: index % 2 === 1
          })}
          initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <div className={styles.timelineContent}>
            <div className={styles.timelineYear}>{award.year}</div>
            <div className={styles.timelineCard}>
              <div className={styles.timelineIcon}>{award.icon}</div>
              <h3 className={styles.timelineTitle}>{award.title}</h3>
              <p className={styles.timelineOrganization}>{award.organization}</p>
              <span className={styles.timelineCategory}>{award.category}</span>
            </div>
          </div>
          <div className={styles.timelineDot} />
        </motion.div>
      ))}
    </div>
  );
});

TimelineView.displayName = 'TimelineView';

// Main Awards Section Component
const Awards = ({ variant = 'grid' }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]);

  const controls = useAnimation();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');

  const [awards] = useState(AWARDS_DATA);
  const [filteredAwards, setFilteredAwards] = useState(AWARDS_DATA);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [viewMode, setViewMode] = useState(variant);
  const [selectedAward, setSelectedAward] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Filter awards
  useEffect(() => {
    let filtered = [...awards];

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(award => award.category === selectedCategory);
    }

    if (selectedYear !== 'All Years') {
      filtered = filtered.filter(award => award.year === parseInt(selectedYear));
    }

    // Sort by year (newest first) and featured status
    filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return b.year - a.year;
    });

    setFilteredAwards(filtered);
  }, [awards, selectedCategory, selectedYear]);

  // Animate on view
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [inView, controls]);

  const handleAwardClick = (award) => {
    setSelectedAward(award);
    setShowDetailsModal(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <section ref={sectionRef} className={styles.awardsSection}>
      {/* Animated Background */}
      <motion.div 
        className={styles.backgroundPattern}
        style={{ y: backgroundY, opacity }}
      />
      
      <div className={styles.container}>
        {/* Section Header */}
        <motion.div
          ref={ref}
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: -30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.sectionLabel}>Recognition</span>
          <h2 className={styles.sectionTitle}>Awards & Achievements</h2>
          <p className={styles.sectionSubtitle}>
            Celebrating excellence in real estate with prestigious awards and recognitions
          </p>
        </motion.div>

        {/* Stats Summary */}
        <motion.div
          className={styles.statsSummary}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className={styles.summaryItem}>
            <motion.span
              className={styles.summaryValue}
              initial={{ scale: 0 }}
              animate={inView ? { scale: 1 } : {}}
              transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
            >
              {awards.length}+
            </motion.span>
            <span className={styles.summaryLabel}>Awards Won</span>
          </div>
          <div className={styles.summaryDivider} />
          <div className={styles.summaryItem}>
            <motion.span
              className={styles.summaryValue}
              initial={{ scale: 0 }}
              animate={inView ? { scale: 1 } : {}}
              transition={{ type: 'spring', stiffness: 200, delay: 0.4 }}
            >
              14+
            </motion.span>
            <span className={styles.summaryLabel}>Years of Excellence</span>
          </div>
          <div className={styles.summaryDivider} />
          <div className={styles.summaryItem}>
            <motion.span
              className={styles.summaryValue}
              initial={{ scale: 0 }}
              animate={inView ? { scale: 1 } : {}}
              transition={{ type: 'spring', stiffness: 200, delay: 0.5 }}
            >
              98%
            </motion.span>
            <span className={styles.summaryLabel}>Client Satisfaction</span>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          className={styles.controls}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Category Filter */}
          <div className={styles.filterGroup}>
            <FiFilter className={styles.filterIcon} />
            <select
              className={styles.filterSelect}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          {/* Year Filter */}
          <div className={styles.filterGroup}>
            <FiCalendar className={styles.filterIcon} />
            <select
              className={styles.filterSelect}
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {YEARS.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          
          {/* View Mode Toggle */}
          <div className={styles.viewToggle}>
            <button
              className={cn(styles.viewButton, {
                [styles.active]: viewMode === 'grid'
              })}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <FiGrid />
            </button>
            <button
              className={cn(styles.viewButton, {
                [styles.active]: viewMode === 'list'
              })}
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <FiList />
            </button>
            {!isMobile && (
              <button
                className={cn(styles.viewButton, {
                  [styles.active]: viewMode === 'timeline'
                })}
                onClick={() => setViewMode('timeline')}
                aria-label="Timeline view"
              >
                <FiCalendar />
              </button>
            )}
          </div>
        </motion.div>

        {/* Awards Display */}
        <AnimatePresence mode="wait">
          {viewMode === 'timeline' ? (
            <motion.div
              key="timeline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <TimelineView awards={filteredAwards} />
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              className={cn(styles.awardsGrid, styles[`view--${viewMode}`])}
              variants={containerVariants}
              initial="hidden"
              animate={controls}
            >
              {filteredAwards.map((award, index) => (
                <AwardCard
                  key={award.id}
                  award={award}
                  index={index}
                  viewMode={viewMode}
                  onClick={handleAwardClick}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {filteredAwards.length === 0 && (
          <motion.div
            className={styles.emptyState}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <FiAward className={styles.emptyIcon} />
            <h3>No awards found</h3>
            <p>Try adjusting your filters</p>
            <button
              className={styles.resetButton}
              onClick={() => {
                setSelectedCategory('All');
                setSelectedYear('All Years');
              }}
            >
              Reset Filters
            </button>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          className={styles.ctaSection}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h3 className={styles.ctaTitle}>Building Excellence Together</h3>
          <p className={styles.ctaDescription}>
            Join us in our journey of excellence and experience award-winning real estate services
          </p>
          <Button
            variant="primary"
            size="lg"
            icon={<FiAward />}
            className={styles.ctaButton}
          >
            Partner With Us
          </Button>
        </motion.div>
      </div>

      {/* Award Details Modal */}
      <AwardDetailsModal
        award={selectedAward}
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedAward(null);
        }}
      />
    </section>
  );
};

export default memo(Awards);
