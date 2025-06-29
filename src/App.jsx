// ==========================================
// DGrealtors - Main App Component
// ==========================================

import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useInView } from 'react-intersection-observer';
import { Toaster } from 'react-hot-toast';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Components
import Loading from './components/common/Loading';
import ScrollToTop from './components/common/ScrollToTop';
import ProgressBar from './components/common/ProgressBar';
import CookieConsent from './components/common/CookieConsent';
import AnnouncementBar from './components/common/AnnouncementBar';
import BackToTop from './components/common/BackToTop';
import PageTransition from './components/common/PageTransition';
import NetworkStatus from './components/common/NetworkStatus';
import BrowserUpdate from './components/common/BrowserUpdate';
import PreloadAssets from './components/common/PreloadAssets';

// Hooks
import { useTheme } from './hooks/useTheme';
import { useAuth } from './hooks/useAuth';
import { useScrollRestoration } from './hooks/useScrollRestoration';
import { usePageTracking } from './hooks/usePageTracking';
import { useNetworkStatus } from './hooks/useNetworkStatus';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useIdleTimer } from './hooks/useIdleTimer';
import { usePrefetch } from './hooks/usePrefetch';

// Utils
import { initializeAnalytics } from './utils/analytics';
import { checkMaintenanceMode } from './utils/maintenance';
import { loadPolyfills } from './utils/polyfills';

// Lazy loaded pages
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const PropertiesPage = lazy(() => import('./pages/PropertiesPage'));
const PropertyDetailPage = lazy(() => import('./pages/PropertyDetailPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Auth pages
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'));

// Dashboard pages
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'));
const ProfilePage = lazy(() => import('./pages/dashboard/ProfilePage'));
const SettingsPage = lazy(() => import('./pages/dashboard/SettingsPage'));
const PropertiesManagePage = lazy(() => import('./pages/dashboard/PropertiesManagePage'));
const InquiriesPage = lazy(() => import('./pages/dashboard/InquiriesPage'));
const AnalyticsPage = lazy(() => import('./pages/dashboard/AnalyticsPage'));

// Maintenance page
const MaintenancePage = lazy(() => import('./pages/MaintenancePage'));

// Page loading component
const PageLoader = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex min-h-screen items-center justify-center bg-white"
  >
    <Loading size="large" />
  </motion.div>
);

// Route configuration
const routeConfig = [
  {
    path: '/',
    element: <HomePage />,
    preload: true,
  },
  {
    path: '/about',
    element: <AboutPage />,
  },
  {
    path: '/properties',
    element: <PropertiesPage />,
    preload: true,
  },
  {
    path: '/properties/:id',
    element: <PropertyDetailPage />,
  },
  {
    path: '/services',
    element: <ServicesPage />,
  },
  {
    path: '/contact',
    element: <ContactPage />,
  },
  {
    path: '/blog',
    element: <BlogPage />,
  },
  {
    path: '/blog/:slug',
    element: <BlogPostPage />,
  },
  {
    path: '/privacy',
    element: <PrivacyPage />,
  },
  {
    path: '/terms',
    element: <TermsPage />,
  },
];

// Auth route configuration
const authRoutes = [
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/reset-password',
    element: <ResetPasswordPage />,
  },
];

// Dashboard route configuration
const dashboardRoutes = [
  {
    path: '/dashboard',
    element: <DashboardPage />,
  },
  {
    path: '/dashboard/profile',
    element: <ProfilePage />,
  },
  {
    path: '/dashboard/settings',
    element: <SettingsPage />,
  },
  {
    path: '/dashboard/properties',
    element: <PropertiesManagePage />,
  },
  {
    path: '/dashboard/inquiries',
    element: <InquiriesPage />,
  },
  {
    path: '/dashboard/analytics',
    element: <AnalyticsPage />,
  },
];

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Public Route Component (redirects to dashboard if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  if (isLoading) {
    return <PageLoader />;
  }

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return children;
};

// Main App Component
const App = () => {
  const location = useLocation();
  const { theme } = useTheme();
  const { isOnline } = useNetworkStatus();
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  // Custom hooks
  useScrollRestoration();  usePageTracking();
  usePrefetch(routeConfig.filter(route => route.preload).map(route => route.element));
  
  // Keyboard shortcuts
  useKeyboardShortcuts({
    'cmd+k': () => console.log('Search opened'),
    'cmd+/': () => console.log('Help opened'),
    'esc': () => console.log('Modal closed'),
  });

  // Idle timer (30 minutes)
  useIdleTimer(30 * 60 * 1000, () => {
    console.log('User idle for 30 minutes');
    // Optionally log out user or show warning
  });

  // Initialize app
  useEffect(() => {
    const initialize = async () => {
      try {
        // Load polyfills
        await loadPolyfills();

        // Check maintenance mode
        const maintenanceStatus = await checkMaintenanceMode();
        setIsMaintenanceMode(maintenanceStatus);

        // Initialize analytics
        if (process.env.NODE_ENV === 'production') {
          initializeAnalytics();
        }

        // Mark assets as loaded
        setAssetsLoaded(true);
      } catch (error) {
        console.error('App initialization error:', error);
        setAssetsLoaded(true); // Continue anyway
      }
    };

    initialize();
  }, []);

  // Apply theme class to body
  useEffect(() => {
    document.body.className = theme;
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Handle network status changes
  useEffect(() => {
    if (!isOnline) {
      document.body.classList.add('offline');
    } else {
      document.body.classList.remove('offline');
    }
  }, [isOnline]);

  // Show maintenance page if in maintenance mode
  if (isMaintenanceMode) {
    return (
      <Suspense fallback={<PageLoader />}>
        <MaintenancePage />
      </Suspense>
    );
  }

  // Wait for critical assets to load
  if (!assetsLoaded) {
    return <PageLoader />;
  }

  return (
    <>
      {/* Global SEO tags */}
      <Helmet>
        <html lang="en" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffe5b4" />
        <meta name="author" content="DGrealtors" />
        <meta property="og:site_name" content="DGrealtors" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href={`https://dgrealtors.in${location.pathname}`} />
      </Helmet>

      {/* Preload critical assets */}
      <PreloadAssets />

      {/* Browser update notification */}
      <BrowserUpdate />

      {/* Network status indicator */}
      <NetworkStatus />

      {/* Announcement bar */}
      <AnimatePresence>
        {showAnnouncement && (
          <AnnouncementBar onClose={() => setShowAnnouncement(false)} />
        )}
      </AnimatePresence>

      {/* Progress bar */}
      <ProgressBar />

      {/* Main routes */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public routes */}
          <Route element={<MainLayout />}>
            {routeConfig.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <Suspense fallback={<PageLoader />}>
                    <PageTransition>{route.element}</PageTransition>
                  </Suspense>
                }
              />
            ))}
          </Route>

          {/* Auth routes */}
          <Route element={<AuthLayout />}>
            {authRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <PublicRoute>
                    <Suspense fallback={<PageLoader />}>
                      <PageTransition>{route.element}</PageTransition>
                    </Suspense>
                  </PublicRoute>
                }
              />
            ))}
          </Route>

          {/* Dashboard routes */}
          <Route element={<DashboardLayout />}>
            {dashboardRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<PageLoader />}>
                      <PageTransition>{route.element}</PageTransition>
                    </Suspense>
                  </ProtectedRoute>
                }
              />
            ))}
          </Route>

          {/* 404 route */}
          <Route
            path="*"
            element={
              <Suspense fallback={<PageLoader />}>
                <NotFoundPage />
              </Suspense>
            }
          />
        </Routes>
      </AnimatePresence>

      {/* Global components */}
      <ScrollToTop />
      <BackToTop />
      <CookieConsent />
      <Toaster />

      {/* Development helpers */}
      {process.env.NODE_ENV === 'development' && (
        <>
          {/* Grid overlay (Toggle with Ctrl+G) */}
          <div
            id="grid-overlay"
            className="pointer-events-none fixed inset-0 z-50 hidden"
            style={{
              backgroundImage: `
                repeating-linear-gradient(0deg, transparent, transparent 7px, rgba(255, 0, 0, 0.1) 7px, rgba(255, 0, 0, 0.1) 8px),
                repeating-linear-gradient(90deg, transparent, transparent 7px, rgba(255, 0, 0, 0.1) 7px, rgba(255, 0, 0, 0.1) 8px)
              `,
            }}
          />

          {/* Responsive indicator */}
          <div className="fixed bottom-4 left-4 z-50 flex items-center space-x-2 rounded-full bg-black px-3 py-1 text-xs font-medium text-white">
            <span className="sm:hidden">XS</span>
            <span className="hidden sm:inline md:hidden">SM</span>
            <span className="hidden md:inline lg:hidden">MD</span>
            <span className="hidden lg:inline xl:hidden">LG</span>
            <span className="hidden xl:inline 2xl:hidden">XL</span>
            <span className="hidden 2xl:inline">2XL</span>
            <span className="ml-2 opacity-50">
              {window.innerWidth} × {window.innerHeight}
            </span>
          </div>
        </>
      )}
    </>
  );
};

export default App;
    
