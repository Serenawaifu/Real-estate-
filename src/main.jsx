// ==========================================
// DGrealtors - Main Application Entry Point
// ==========================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from 'react-error-boundary';
import { disableDevtool } from 'disable-devtool';
import AOS from 'aos';

// App Component
import App from './App';

// Global Styles
import './styles/globals.css';
import './styles/fonts.css';
import './styles/animations.css';
import 'aos/dist/aos.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/autoplay';

// Providers
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ConfigProvider } from './contexts/ConfigContext';
import { AnalyticsProvider } from './contexts/AnalyticsContext';

// Utils
import { initializeApp } from './utils/initialize';
import { registerServiceWorker } from './utils/serviceWorker';
import { checkBrowserSupport } from './utils/browserSupport';
import { setupErrorTracking } from './utils/errorTracking';
import { preventInspect } from './utils/security';

// Error Fallback Component
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
      <div className="mx-auto max-w-max">
        <main className="sm:flex">
          <p className="text-4xl font-bold tracking-tight text-dg-orange sm:text-5xl">500</p>
          <div className="sm:ml-6">
            <div className="sm:border-l sm:border-gray-200 sm:pl-6">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Something went wrong
              </h1>
              <p className="mt-2 text-base text-gray-500">
                We're sorry for the inconvenience. Please try refreshing the page.
              </p>
              {process.env.NODE_ENV === 'development' && error && (
                <details className="mt-4 text-sm text-red-600">
                  <summary className="cursor-pointer">Error details</summary>
                  <pre className="mt-2 whitespace-pre-wrap rounded bg-red-50 p-2">
                    {error.message}
                    {error.stack && '\n\n' + error.stack}
                  </pre>
                </details>
              )}
            </div>
            <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
              <button
                onClick={resetErrorBoundary}
                className="inline-flex items-center rounded-md bg-dg-orange px-4 py-2 text-sm font-medium text-white hover:bg-dg-orange-dark focus:outline-none focus:ring-2 focus:ring-dg-orange focus:ring-offset-2"
              >
                Try again
              </button>
              <a
                href="/"
                className="inline-flex items-center rounded-md bg-dg-gray-100 px-4 py-2 text-sm font-medium text-dg-gray-700 hover:bg-dg-gray-200 focus:outline-none focus:ring-2 focus:ring-dg-orange focus:ring-offset-2"
              >
                Go home
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// Loading Component
const AppLoader = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
    <div className="relative">
      <div className="h-24 w-24 animate-spin rounded-full border-4 border-dg-peach border-t-transparent"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-16 w-16 animate-pulse rounded-full bg-dg-orange"></div>
      </div>
    </div>
    <div className="ml-4">
      <h2 className="text-2xl font-bold text-dg-dark">DGrealtors</h2>
      <p className="text-sm text-gray-500">Loading experience...</p>
    </div>
  </div>
);

// Browser Compatibility Warning
const BrowserWarning = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75">
    <div className="mx-4 max-w-lg rounded-lg bg-white p-6 shadow-xl">
      <h2 className="mb-4 text-xl font-bold text-gray-900">Browser Not Supported</h2>
      <p className="mb-4 text-gray-600">
        Your browser version is not fully supported. For the best experience, please update to the latest version of Chrome, Firefox, Safari, or Edge.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="w-full rounded-md bg-dg-orange px-4 py-2 text-white hover:bg-dg-orange-dark"
      >
        Continue Anyway
      </button>
    </div>
  </div>
);

// Initialize AOS (Animate On Scroll)
const initializeAOS = () => {
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 50,
    delay: 0,
    anchorPlacement: 'top-bottom',
  });
};

// Security configurations
const setupSecurity = () => {
  // Disable developer tools in production
  if (process.env.NODE_ENV === 'production') {
    disableDevtool({
      ondevtoolopen: () => {
        console.warn('Developer tools detected!');
        window.location = 'about:blank';
      },
      interval: 1000,
      disableSelect: true,
      disableCopy: false,
      disableCut: false,
      disablePaste: false,
      clearLog: true,
    });

    // Prevent right-click
    preventInspect();
  }

  // Disable React DevTools in production
  if (process.env.NODE_ENV === 'production') {
    if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      window.__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE = () => {};
      window.__REACT_DEVTOOLS_GLOBAL_HOOK__.isDisabled = true;
    }
  }
};

// Performance monitoring
const setupPerformanceMonitoring = () => {
  if ('PerformanceObserver' in window && process.env.NODE_ENV === 'production') {
    // Monitor Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.info('LCP:', lastEntry.startTime);
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

    // Monitor First Input Delay
    const fidObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        console.info('FID:', entry.processingStart - entry.startTime);
      });
    });
    fidObserver.observe({ type: 'first-input', buffered: true });

    // Monitor Cumulative Layout Shift
    const clsObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      let clsScore = 0;
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsScore += entry.value;
        }
      });
      console.info('CLS:', clsScore);
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });
  }
};

// Root element
const rootElement = document.getElementById('root');

// Check browser support
const browserSupported = checkBrowserSupport();

// Create root
const root = ReactDOM.createRoot(rootElement);

// App initialization
const initializeAndRender = async () => {
  try {
    // Setup security measures
    setupSecurity();

    // Setup error tracking
    if (process.env.NODE_ENV === 'production') {
      setupErrorTracking();
    }

    // Initialize app configurations
    await initializeApp();

    // Initialize AOS
    initializeAOS();

    // Setup performance monitoring
    setupPerformanceMonitoring();

    // Register service worker for PWA
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      registerServiceWorker();
    }

    // Render the app
    root.render(
      <React.StrictMode>
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onError={(error, errorInfo) => {
            console.error('Error caught by boundary:', error, errorInfo);
          }}
          onReset={() => window.location.reload()}
        >
          <HelmetProvider>
            <BrowserRouter>
              <ConfigProvider>
                <ThemeProvider>
                  <AuthProvider>
                    <AnalyticsProvider>
                      <React.Suspense fallback={<AppLoader />}>
                        {!browserSupported && <BrowserWarning />}
                        <App />
                        <Toaster
                          position="top-right"
                          reverseOrder={false}
                          gutter={8}
                          containerClassName=""
                          containerStyle={{}}
                          toastOptions={{
                            // Default options
                            duration: 4000,
                            style: {
                              background: '#363636',
                              color: '#fff',
                              borderRadius: '8px',
                              padding: '12px 16px',
                              fontSize: '14px',
                            },
                            // Success options
                            success: {
                              duration: 3000,
                              style: {
                                background: '#10b981',
                              },
                              iconTheme: {
                                primary: '#fff',
                                secondary: '#10b981',
                              },
                            },
                            // Error options
                            error: {
                              duration: 5000,
                              style: {
                                background: '#ef4444',
                              },
                              iconTheme: {
                                primary: '#fff',
                                secondary: '#ef4444',
                              },
                            },
                            // Loading options
                            loading: {
                              style: {
                                background: '#3b82f6',
                              },
                              iconTheme: {
                                primary: '#fff',
                                secondary: '#3b82f6',
                              },
                            },
                          }}
                        />
                      </React.Suspense>
                    </AnalyticsProvider>
                  </AuthProvider>
                </ThemeProvider>
              </ConfigProvider>
            </BrowserRouter>
          </HelmetProvider>
        </ErrorBoundary>
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Failed to initialize app:', error);
    
    // Render error state
    root.render(
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Failed to load application</h1>
          <p className="mb-4 text-gray-600">Please refresh the page to try again.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="rounded bg-dg-orange px-4 py-2 text-white hover:bg-dg-orange-dark"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }
};

// Start the app
initializeAndRender();

// Hot Module Replacement (HMR)
if (import.meta.hot) {
  import.meta.hot.accept();
}

// Web Vitals reporting
if (process.env.NODE_ENV === 'production') {
  import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
    onCLS(console.log);
    onFID(console.log);
    onFCP(console.log);
    onLCP(console.log);
    onTTFB(console.log);
  });
}

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  if (process.env.NODE_ENV === 'production') {
    // Send to error tracking service
    event.preventDefault();
  }
});

// Handle global errors
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  if (process.env.NODE_ENV === 'production') {
    // Send to error tracking service
  }
});

// Cleanup function for when the app unmounts
window.addEventListener('beforeunload', () => {
  // Cleanup AOS
  AOS.refresh();
  
  // Save any pending data
  if (window.pendingAnalytics) {
    navigator.sendBeacon('/api/analytics', JSON.stringify(window.pendingAnalytics));
  }
});

// Performance timing
window.addEventListener('load', () => {
  setTimeout(() => {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    const renderTime = perfData.domComplete - perfData.domLoading;
    const requestTime = perfData.responseEnd - perfData.requestStart;
    
    console.info('Performance Metrics:', {
      pageLoadTime: `${pageLoadTime}ms`,
      renderTime: `${renderTime}ms`,
      requestTime: `${requestTime}ms`,
    });
  }, 0);
});
      
