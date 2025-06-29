// ==========================================
// DGrealtors - Navigation Component
// ==========================================

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiMenu, FiX, FiSearch, FiChevronDown, FiPhone, FiMail } from 'react-icons/fi';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { BsSun, BsMoon } from 'react-icons/bs';

// Hooks
import { useScrollDirection } from '../../../hooks/useScrollDirection';
import { useWindowSize } from '../../../hooks/useWindowSize';
import { useOutsideClick } from '../../../hooks/useOutsideClick';
import { useKeyPress } from '../../../hooks/useKeyPress';
import { useTheme } from '../../../hooks/useTheme';
import { useAuth } from '../../../hooks/useAuth';

// Components
import Logo from '../../common/Logo';
import SearchBar from '../../common/SearchBar';
import Button from '../../common/Button';
import Avatar from '../../common/Avatar';

// Utils
import { cn } from '../../../utils/cn';
import { navigationLinks } from '../../../data/navigation';

// Styles
import styles from './Navigation.module.css';

// Constants
const SCROLL_THRESHOLD = 50;
const MOBILE_BREAKPOINT = 1024;

// Sub-components
const NavItem = memo(({ item, isActive, onMouseEnter, onMouseLeave }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowDropdown(true);
    onMouseEnter?.();
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowDropdown(false);
      onMouseLeave?.();
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (item.children) {
    return (
      <div
        className={styles.navItem}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button
          className={cn(styles.navLink, styles.navLinkWithDropdown, {
            [styles.navLinkActive]: isActive,
          })}
          aria-expanded={showDropdown}
          aria-haspopup="true"
        >
          <span>{item.label}</span>
          <FiChevronDown
            className={cn(styles.dropdownIcon, {
              [styles.dropdownIconOpen]: showDropdown,
            })}
          />
        </button>
        
        <AnimatePresence>
          {showDropdown && (
            <motion.div
              ref={dropdownRef}
              className={styles.dropdown}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className={styles.dropdownContent}>
                {item.children.map((child, index) => (
                  <Link
                    key={child.path}
                    to={child.path}
                    className={styles.dropdownItem}
                    onClick={() => setShowDropdown(false)}
                  >
                    {child.icon && (
                      <span className={styles.dropdownItemIcon}>{child.icon}</span>
                    )}
                    <div className={styles.dropdownItemContent}>
                      <span className={styles.dropdownItemLabel}>{child.label}</span>
                      {child.description && (
                        <span className={styles.dropdownItemDescription}>
                          {child.description}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        cn(styles.navLink, {
          [styles.navLinkActive]: isActive,
        })
      }
    >
      {item.label}
    </NavLink>
  );
});

NavItem.displayName = 'NavItem';

// Mobile Navigation Menu
const MobileMenu = memo(({ isOpen, onClose, links }) => {
  const location = useLocation();
  const menuRef = useRef(null);

  useOutsideClick(menuRef, onClose);
  useKeyPress('Escape', onClose);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    onClose();
  }, [location, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className={styles.mobileMenuOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          <motion.div
            ref={menuRef}
            className={styles.mobileMenu}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <div className={styles.mobileMenuHeader}>
              <Logo />
              <button
                className={styles.mobileMenuClose}
                onClick={onClose}
                aria-label="Close menu"
              >
                <FiX />
              </button>
            </div>
            
            <nav className={styles.mobileMenuNav}>
              {links.map((item) => (
                <div key={item.path} className={styles.mobileMenuItem}>
                  <Link
                    to={item.path}
                    className={cn(styles.mobileMenuLink, {
                      [styles.mobileMenuLinkActive]: location.pathname === item.path,
                    })}
                  >
                    {item.label}
                  </Link>
                  
                  {item.children && (
                    <div className={styles.mobileMenuSubmenu}>
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          className={styles.mobileMenuSubLink}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
            
            <div className={styles.mobileMenuFooter}>
              <Button variant="primary" size="large" fullWidth>
                Get Started
              </Button>
              
              <div className={styles.mobileMenuContact}>
                <a href="tel:+911234567890" className={styles.mobileMenuContactItem}>
                  <FiPhone />
                  <span>+91 123 456 7890</span>
                </a>
                <a href="mailto:contact@dgrealtors.in" className={styles.mobileMenuContactItem}>
                  <FiMail />
                  <span>contact@dgrealtors.in</span>
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

MobileMenu.displayName = 'MobileMenu';

// Main Navigation Component
const Navigation = ({ className, variant = 'default' }) => {
  const location = useLocation();
  const scrollDirection = useScrollDirection();
  const { scrollY } = useScroll();
  const { width: windowWidth } = useWindowSize();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  const navRef = useRef(null);
  const isMobile = windowWidth <= MOBILE_BREAKPOINT;

    // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Transform values for parallax effect
  const headerY = useTransform(scrollY, [0, 300], [0, -50]);
  const headerOpacity = useTransform(scrollY, [0, 300], [1, 0.8]);

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    if (!isMobile && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobile, isMobileMenuOpen]);

  // Handle search
  const handleSearchToggle = useCallback(() => {
    setIsSearchOpen(!isSearchOpen);
  }, [isSearchOpen]);

  const handleSearchClose = useCallback(() => {
    setIsSearchOpen(false);
  }, []);

  // Keyboard shortcut for search (Cmd/Ctrl + K)
  useKeyPress('k', (e) => {
    if (e.metaKey || e.ctrlKey) {
      e.preventDefault();
      handleSearchToggle();
    }
  });

  // Navigation classes
  const navClasses = cn(
    styles.navigation,
    styles[`navigation--${variant}`],
    {
      [styles.navigationScrolled]: isScrolled,
      [styles.navigationHidden]: scrollDirection === 'down' && isScrolled,
      [styles.navigationTransparent]: variant === 'transparent' && !isScrolled,
    },
    className
  );

  return (
    <>
      <motion.nav
        ref={navRef}
        className={navClasses}
        style={variant === 'parallax' ? { y: headerY, opacity: headerOpacity } : {}}
      >
        <div className={styles.container}>
          {/* Logo */}
          <div className={styles.logoWrapper}>
            <Link to="/" className={styles.logoLink} aria-label="DGrealtors Home">
              <Logo variant={isScrolled ? 'default' : variant} />
            </Link>
          </div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <div className={styles.desktopNav}>
              <div className={styles.navLinks}>
                {navigationLinks.map((item) => (
                  <NavItem
                    key={item.path}
                    item={item}
                    isActive={location.pathname === item.path}
                    onMouseEnter={() => setActiveDropdown(item.path)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className={styles.actions}>
            {/* Search Button */}
            <button
              className={styles.actionButton}
              onClick={handleSearchToggle}
              aria-label="Search"
              data-tooltip="Search (⌘K)"
            >
              <FiSearch />
            </button>

            {/* Theme Toggle */}
            <button
              className={styles.actionButton}
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              data-tooltip={`${theme === 'light' ? 'Dark' : 'Light'} mode`}
            >
              <AnimatePresence mode="wait">
                {theme === 'light' ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <BsSun />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <BsMoon />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* User Menu / Auth Buttons */}
            {!isMobile && (
              <>
                {isAuthenticated && user ? (
                  <div className={styles.userMenu}>
                    <Avatar
                      src={user.avatar}
                      alt={user.name}
                      size="sm"
                      className={styles.userAvatar}
                    />
                    <span className={styles.userName}>{user.name}</span>
                  </div>
                ) : (
                  <div className={styles.authButtons}>
                    <Link to="/login">
                      <Button variant="ghost" size="sm">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button variant="primary" size="sm">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}

            {/* Mobile Menu Toggle */}
            {isMobile && (
              <button
                className={styles.mobileMenuToggle}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen}
              >
                <span className={styles.mobileMenuIcon}>
                  <span className={cn(styles.mobileMenuLine, {
                    [styles.mobileMenuLineOpen]: isMobileMenuOpen,
                  })} />
                  <span className={cn(styles.mobileMenuLine, {
                    [styles.mobileMenuLineOpen]: isMobileMenuOpen,
                  })} />
                  <span className={cn(styles.mobileMenuLine, {
                    [styles.mobileMenuLineOpen]: isMobileMenuOpen,
                  })} />
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Progress Bar */}
        <motion.div className={styles.progressBar}>
          <motion.div
            className={styles.progressBarFill}
            style={{
              scaleX: useTransform(scrollY, [0, document.body.offsetHeight - window.innerHeight], [0, 1]),
            }}
          />
        </motion.div>
      </motion.nav>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        links={navigationLinks}
      />

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <SearchBar
            isOpen={isSearchOpen}
            onClose={handleSearchClose}
            variant="modal"
          />
        )}
      </AnimatePresence>

      {/* Spacer for fixed navigation */}
      {variant !== 'transparent' && (
        <div className={styles.spacer} style={{ height: 'var(--nav-height)' }} />
      )}
    </>
  );
};

export default memo(Navigation);
                           
