// ==========================================
// DGrealtors - Mobile Menu Component
// ==========================================

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { 
  FiX, 
  FiHome, 
  FiSearch, 
  FiPhone, 
  FiMail, 
  FiChevronRight,
  FiChevronDown,
  FiUser,
  FiLogIn,
  FiUserPlus,
  FiLogOut,
  FiSettings,
  FiHelpCircle,
  FiMapPin,
  FiClock
} from 'react-icons/fi';
import { 
  BsFacebook, 
  BsTwitter, 
  BsInstagram, 
  BsLinkedin,
  BsWhatsapp 
} from 'react-icons/bs';

// Hooks
import { useAuth } from '../../../hooks/useAuth';
import { useTheme } from '../../../hooks/useTheme';
import { useOnlineStatus } from '../../../hooks/useOnlineStatus';
import { useLockBodyScroll } from '../../../hooks/useLockBodyScroll';
import { useKeyPress } from '../../../hooks/useKeyPress';

// Components
import Logo from '../../common/Logo';
import Avatar from '../../common/Avatar';
import Button from '../../common/Button';
import SearchBar from '../../common/SearchBar';
import ThemeToggle from '../../common/ThemeToggle';

// Utils
import { cn } from '../../../utils/cn';

// Styles
import styles from './MobileMenu.module.css';

// Constants
const MENU_ITEMS = [
  {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: <FiHome />,
  },
  {
    id: 'properties',
    label: 'Properties',
    path: '/properties',
    icon: <FiMapPin />,
    children: [
      { label: 'All Properties', path: '/properties' },
      { label: 'Commercial', path: '/properties/commercial' },
      { label: 'Residential', path: '/properties/residential' },
      { label: 'Industrial', path: '/properties/industrial' },
      { label: 'Land', path: '/properties/land' },
    ],
  },
  {
    id: 'services',
    label: 'Services',
    path: '/services',
    icon: <FiSettings />,
    children: [
      { label: 'Property Management', path: '/services/management' },
      { label: 'Consulting', path: '/services/consulting' },
      { label: 'Valuation', path: '/services/valuation' },
      { label: 'Legal Support', path: '/services/legal' },
    ],
  },
  {
    id: 'about',
    label: 'About Us',
    path: '/about',
    icon: <FiHelpCircle />,
  },
  {
    id: 'contact',
    label: 'Contact',
    path: '/contact',
    icon: <FiPhone />,
  },
];

const SOCIAL_LINKS = [
  { icon: <BsFacebook />, url: 'https://facebook.com/dgrealtors', label: 'Facebook' },
  { icon: <BsTwitter />, url: 'https://twitter.com/dgrealtors', label: 'Twitter' },
  { icon: <BsInstagram />, url: 'https://instagram.com/dgrealtors', label: 'Instagram' },
  { icon: <BsLinkedin />, url: 'https://linkedin.com/company/dgrealtors', label: 'LinkedIn' },
  { icon: <BsWhatsapp />, url: 'https://wa.me/911234567890', label: 'WhatsApp' },
];

// Sub-components
const MenuItem = memo(({ item, isActive, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  const handleClick = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    } else {
      onClose();
    }
  };

  return (
    <div className={styles.menuItem}>
      <Link
        to={item.path}
        className={cn(styles.menuLink, {
          [styles.menuLinkActive]: isActive,
          [styles.menuLinkWithChildren]: hasChildren,
        })}
        onClick={handleClick}
      >
        <span className={styles.menuLinkContent}>
          {item.icon && <span className={styles.menuIcon}>{item.icon}</span>}
          <span className={styles.menuLabel}>{item.label}</span>
        </span>
        {hasChildren && (
          <motion.span
            className={styles.menuChevron}
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <FiChevronRight />
          </motion.span>
        )}
      </Link>

      <AnimatePresence>
        {hasChildren && isExpanded && (
          <motion.div
            className={styles.submenu}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {item.children.map((child) => (
              <Link
                key={child.path}
                to={child.path}
                className={styles.submenuLink}
                onClick={onClose}
              >
                {child.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

MenuItem.displayName = 'MenuItem';

// Main Mobile Menu Component
const MobileMenu = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isOnline = useOnlineStatus();
  const dragControls = useDragControls();
  
  const [showSearch, setShowSearch] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  
  const menuRef = useRef(null);
  
  // Lock body scroll when menu is open
  useLockBodyScroll(isOpen);
  
  // Close menu on escape key
  useKeyPress('Escape', onClose);
  
  // Close menu on route change
  useEffect(() => {
    onClose();
  }, [location.pathname, onClose]);
  
  // Handle swipe gestures
  const minSwipeDistance = 50;
  
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isRightSwipe) {
      onClose();
    }
  };
  
  const handleLogout = useCallback(() => {
    logout();
    onClose();
  }, [logout, onClose]);
  
  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };
  
  const menuVariants = {
    hidden: { x: '100%' },
    visible: { 
      x: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300,
      },
    },
    exit: { 
      x: '100%',
      transition: {
        type: 'tween',
        duration: 0.3,
      },
    },
  };
  
  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };
  
  const itemVariants = {
    hidden: { x: 20, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className={styles.overlay}
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
          />
          
          {/* Menu Panel */}
          <motion.div
            ref={menuRef}
            className={styles.menu}
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            drag="x"
            dragControls={dragControls}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, { offset, velocity }) => {
              if (offset.x > 100 || velocity.x > 500) {
                onClose();
              }
            }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Header */}
            <div className={styles.header}>
              <Logo className={styles.logo} />
              <button
                className={styles.closeButton}
                onClick={onClose}
                aria-label="Close menu"
              >
                <FiX />
              </button>
            </div>
            
            {/* User Section */}
            {isAuthenticated && user && (
              <motion.div 
                className={styles.userSection}
                variants={itemVariants}
              >
                <Link 
                  to="/dashboard" 
                  className={styles.userProfile}
                  onClick={onClose}
                >
                  <Avatar
                    src={user.avatar}
                    alt={user.name}
                    size="md"
                    className={styles.userAvatar}
                  />
                  <div className={styles.userInfo}>
                    <div className={styles.userName}>{user.name}</div>
                    <div className={styles.userEmail}>{user.email}</div>
                  </div>
                  <FiChevronRight className={styles.userChevron} />
                </Link>
              </motion.div>
            )}
            
            {/* Search Bar */}
            <motion.div 
              className={styles.searchSection}
              variants={itemVariants}
            >
              <button
                className={styles.searchButton}
                onClick={() => setShowSearch(!showSearch)}
              >
                <FiSearch />
                <span>Search properties...</span>
              </button>
            </motion.div>
            
            {/* Navigation */}
            <motion.nav 
              className={styles.nav}
              variants={contentVariants}
            >
              {MENU_ITEMS.map((item) => (
                <motion.div key={item.id} variants={itemVariants}>
                  <MenuItem
                    item={item}
                    isActive={location.pathname === item.path}
                    onClose={onClose}
                  />
                </motion.div>
              ))}
            </motion.nav>
            
            {/* Quick Actions */}
            <motion.div 
              className={styles.quickActions}
              variants={contentVariants}
            >
              <motion.div variants={itemVariants}>
                <h3 className={styles.sectionTitle}>Quick Contact</h3>
                <div className={styles.contactItems}>
                  <a href="tel:+911234567890" className={styles.contactItem}>
                    <FiPhone />
                    <span>+91 123 456 7890</span>
                  </a>
                  <a href="mailto:contact@dgrealtors.in" className={styles.contactItem}>
                    <FiMail />
                    <span>contact@dgrealtors.in</span>
                  </a>
                  <div className={styles.contactItem}>
                    <FiClock />
                    <span>Mon-Sat: 9:00 AM - 6:00 PM</span>
                  </div>
                  <div className={styles.contactItem}>
                    <FiMapPin />
                    <span>Mumbai, Maharashtra</span>
                  </div>
                </div>
              </motion.div>
              
              {/* Social Links */}
              <motion.div variants={itemVariants} className={styles.socialSection}>
                <h3 className={styles.sectionTitle}>Follow Us</h3>
                <div className={styles.socialLinks}>
                  {SOCIAL_LINKS.map((social) => (
                    <a
                      key={social.label}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                      aria-label={social.label}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </motion.div>
            </motion.div>
            
            {/* Footer Actions */}
            <motion.div 
              className={styles.footer}
              variants={contentVariants}
            >
              {isAuthenticated ? (
                <motion.div variants={itemVariants} className={styles.authActions}>
                  <Link to="/dashboard" onClick={onClose}>
                    <Button variant="outline" fullWidth>
                      <FiUser />
                      Dashboard
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    fullWidth 
                    onClick={handleLogout}
                    className={styles.logoutButton}
                  >
                    <FiLogOut />
                    Sign Out
                  </Button>
                </motion.div>
              ) : (
                <motion.div variants={itemVariants} className={styles.authActions}>
                  <Link to="/login" onClick={onClose}>
                    <Button variant="outline" fullWidth>
                      <FiLogIn />
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register" onClick={onClose}>
                    <Button variant="primary" fullWidth>
                      <FiUserPlus />
                      Get Started
                    </Button>
                  </Link>
                </motion.div>
              )}
              
              <motion.div 
                variants={itemVariants} 
                className={styles.bottomActions}
              >
                <ThemeToggle />
                <div className={styles.onlineStatus}>
                  <span className={cn(styles.statusDot, {
                    [styles.statusDotOnline]: isOnline,
                    [styles.statusDotOffline]: !isOnline,
                  })} />
                  <span>{isOnline ? 'Online' : 'Offline'}</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* Search Modal */}
          <AnimatePresence>
            {showSearch && (
              <SearchBar
                isOpen={showSearch}
                onClose={() => setShowSearch(false)}
                variant="overlay"
              />
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};

export default memo(MobileMenu);
   
