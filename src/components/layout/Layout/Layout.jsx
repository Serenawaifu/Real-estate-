// ==========================================
// DGrealtors - Main Layout Component
// ==========================================

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Helmet } from 'react-helmet-async';

// Components
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import MobileMenu from './MobileMenu';
import SearchModal from '../common/SearchModal';
import NotificationPanel from '../common/NotificationPanel';
import QuickActions from '../common/QuickActions';
import LiveChat from '../common/LiveChat';
import ScrollProgress from '../common/ScrollProgress';
import Breadcrumbs from '../common/Breadcrumbs';
import PageLoader from '../common/PageLoader';
import NetworkStatus from '../common/NetworkStatus';
import CookieConsent from '../common/CookieConsent';
import AnnouncementBar from '../common/AnnouncementBar';
import BackToTop from '../common/BackToTop';
import KeyboardShortcuts from '../common/KeyboardShortcuts';
import AccessibilityMenu from '../common/AccessibilityMenu';

// Hooks
import { useScrollDirection } from '../../hooks/useScrollDirection';
import { useWindowSize } from '../../hooks/useWindowSize';
import { useKeyPress } from '../../hooks/useKeyPress';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { useIdleTimer } from '../../hooks/useIdleTimer';

// Contexts
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useUI } from '../../contexts/UIContext';

// Utils
import { cn } from '../../utils/cn';
import { getPageMeta } from '../../utils/seo';
import { trackPageView } from '../../utils/analytics';

// Constants
const HEADER_HEIGHT = 80;
const SCROLL_THRESHOLD = 50;
const IDLE_TIME = 30 * 60 * 1000; // 30 minutes

// Layout Component
const Layout = ({ children, variant = 'default' }) => {
  const location = useLocation();
  const { theme } = useTheme();
  const { user } = useAuth();
  const { windowWidth, windowHeight } = useWindowSize();
  const scrollDirection = useScrollDirection();
  const { isOnline } = useNetworkStatus();
  
  // UI State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useLocalStorage('showAnnouncement', true);
  const [cookieConsent, setCookieConsent] = useLocalStorage('cookieConsent', null);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Refs
  const layoutRef = useRef(null);
  const contentRef = useRef(null);
  const sidebarRef = useRef(null);
  const notificationRef = useRef(null);
  
  // Lock body scroll when mobile menu is open
  useLockBodyScroll(isMobileMenuOpen || isSearchOpen);
  
  // Click outside handlers
  useOnClickOutside(sidebarRef, () => setIsSidebarOpen(false));
  useOnClickOutside(notificationRef, () => setIsNotificationsOpen(false));
  
  // Keyboard shortcuts
  useKeyPress('Escape', () => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setIsNotificationsOpen(false);
    setShowAccessibility(false);
  });
  
  useKeyPress('/', (e) => {
    e.preventDefault();
    setIsSearchOpen(true);
  }, { ctrlKey: true });
  
  // Idle timer
  useIdleTimer(IDLE_TIME, () => {
    console.log('User has been idle for 30 minutes');
    // Optionally show a warning or log out
  });
  
  // Track page views
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);
  
  // Calculate scroll progress
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      
      const scrollTop = window.scrollY;
      const docHeight = contentRef.current.offsetHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(Math.min(progress, 100));
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Handle route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  // Page metadata
  const pageMeta = getPageMeta(location.pathname);
  
  // Layout variants
  const layoutVariants = {
    default: 'min-h-screen bg-gray-50',
    fullwidth: 'min-h-screen',
    dashboard: 'min-h-screen bg-gray-100',
    minimal: 'min-h-screen bg-white',
  };
  
  // Header visibility based on scroll
  const isHeaderVisible = scrollDirection === 'up' || window.scrollY < SCROLL_THRESHOLD;
  
  // Content padding based on layout variant
  const contentPadding = {
    default: 'pt-20 pb-16',
    fullwidth: 'pt-0',
    dashboard: 'pt-20 pl-64',
    minimal: 'pt-16',
  };
  
  // Animation variants
  const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };
  
  const headerTransition = {
    visible: { y: 0 },
    hidden: { y: '-100%' },
  };
  
  return (
    <div
      ref={layoutRef}
      className={cn(
        'relative overflow-x-hidden',
        layoutVariants[variant],
        theme === 'dark' && 'dark'
      )}
    >
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{pageMeta.title}</title>
        <meta name="description" content={pageMeta.description} />
        <meta property="og:title" content={pageMeta.title} />
        <meta property="og:description" content={pageMeta.description} />
        <meta property="og:url" content={`https://dgrealtors.in${location.pathname}`} />
        <meta property="og:image" content={pageMeta.image} />
        <meta name="twitter:title" content={pageMeta.title} />
        <meta name="twitter:description" content={pageMeta.description} />
        <meta name="twitter:image" content={pageMeta.image} />
      </Helmet>
      
      {/* Skip to main content */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      {/* Network Status */}
      {!isOnline && <NetworkStatus />}
      
      {/* Announcement Bar */}
      <AnimatePresence>
        {showAnnouncement && (
          <AnnouncementBar onClose={() => setShowAnnouncement(false)} />
        )}
      </AnimatePresence>
      
      {/* Scroll Progress */}
      <ScrollProgress progress={scrollProgress} />
      
      {/* Header */}
      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 bg-white shadow-sm transition-all duration-300',
          variant === 'fullwidth' && 'hidden',
          !isHeaderVisible && 'shadow-lg'
        )}
        initial="visible"
        animate={isHeaderVisible ? 'visible' : 'hidden'}
        variants={headerTransition}
        transition={{ duration: 0.3 }}
        style={{ height: HEADER_HEIGHT }}
      >
        <Header
          onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          onSearchClick={() => setIsSearchOpen(true)}
          onNotificationClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          isMobileMenuOpen={isMobileMenuOpen}
        />
      </motion.header>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar (Dashboard variant) */}
      {variant === 'dashboard' && (
        <Sidebar
          ref={sidebarRef}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Main Content */}
      <main
        id="main-content"
        ref={contentRef}
        className={cn(
          'relative transition-all duration-300',
          contentPadding[variant]
        )}
      >
        {/* Breadcrumbs */}
        {variant !== 'minimal' && location.pathname !== '/' && (
          <div className="container-dg mb-6">
            <Breadcrumbs />
          </div>
        )}
        
        {/* Page Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageTransition}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {children || <Outlet />}
          </motion.div>
        </AnimatePresence>
      </main>
      
      {/* Footer */}
      {variant !== 'minimal' && <Footer />}
      
      {/* Global UI Components */}
      
      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <SearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Notification Panel */}
      <AnimatePresence>
        {isNotificationsOpen && (
          <NotificationPanel
            ref={notificationRef}
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Quick Actions (FAB) */}
      {user && <QuickActions />}
      
      {/* Live Chat Widget */}
      <LiveChat />
      
      {/* Back to Top */}
      <BackToTop threshold={300} />
      
      {/* Cookie Consent */}
      {!cookieConsent && (
        <CookieConsent
          onAccept={() => setCookieConsent('accepted')}
          onDecline={() => setCookieConsent('declined')}
        />
      )}
      
      {/* Keyboard Shortcuts Helper */}
      <KeyboardShortcuts />
      
      {/* Accessibility Menu */}
      <AnimatePresence>
        {showAccessibility && (
          <AccessibilityMenu onClose={() => setShowAccessibility(false)} />
        )}
      </AnimatePresence>
      
      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && <PageLoader fullScreen />}
      </AnimatePresence>
      
      {/* Development Helpers */}
      {process.env.NODE_ENV === 'development' && (
        <>
          {/* Layout Grid Overlay */}
          <div
            className="pointer-events-none fixed inset-0 z-[9999] hidden"
            id="layout-grid"
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  0deg,
                  rgba(255, 0, 0, 0.1),
                  rgba(255, 0, 0, 0.1) 1px,
                  transparent 1px,
                  transparent 8px
                ),
                repeating-linear-gradient(
                  90deg,
                  rgba(255, 0, 0, 0.1),
                  rgba(255, 0, 0, 0.1) 1px,
                  transparent 1px,
                  transparent 8px
                )
              `,
            }}
          />
          
          {/* Layout Info */}
          <div className="fixed bottom-4 right-4 z-50 rounded bg-black bg-opacity-75 p-2 text-xs text-white">
            <div>Layout: {variant}</div>
            <div>Theme: {theme}</div>
            <div>Viewport: {windowWidth} × {windowHeight}</div>
            <div>Scroll: {scrollDirection} ({Math.round(scrollProgress)}%)</div>
          </div>
        </>
      )}
    </div>
  );
};

// Layout with Error Boundary
const LayoutWithErrorBoundary = (props) => {
  return (
    <ErrorBoundary>
      <Layout {...props} />
    </ErrorBoundary>
  );
};

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Layout error:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold">Something went wrong</h1>
            <p className="mb-4 text-gray-600">We're sorry for the inconvenience.</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    
    return this.props.children;
  }
}

export default LayoutWithErrorBoundary;
