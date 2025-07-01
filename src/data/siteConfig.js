/**
 * Site Configuration for DGrealtors
 * Main configuration file for site-wide settings
 */

export const siteConfig = {
  // Basic Information
  name: 'DGrealtors',
  fullName: 'DGrealtors Commercial Real Estate',
  tagline: 'Your Trusted Partner in Commercial Real Estate',
  description: 'Leading commercial property leasing experts in Pune with 14+ years of experience. Find your perfect office space, retail shop, warehouse, or showroom.',
  domain: 'https://dgrealtors.com',
  
  // Company Information
  company: {
    legalName: 'DGrealtors Real Estate Services',
    established: 2010,
    registration: 'RERA/PUNE/2024/XXXX',
    gst: '27AABCD1234E1Z5',
    pan: 'AABCD1234E',
    
    experience: '14+ Years',
    propertyCount: '500+',
    clientCount: '1000+',
    successRate: '98%',
  },
  
  // Contact Information
  contact: {
    phone: {
      primary: '+91 98765 43210',
      secondary: '+91 98765 43211',
      whatsapp: '+91 98765 43210',
      display: '98765 43210',
    },
    
    email: {
      primary: 'info@dgrealtors.com',
      support: 'support@dgrealtors.com',
      enquiry: 'enquiry@dgrealtors.com',
    },
    
    address: {
      line1: 'Shop No 11, T S Complex',
      line2: 'Shop Siddhi Enclave CHS Ltd',
      street: 'Datta Mandir Road',
      area: 'Wakad',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      pincode: '411057',
      
      googleMapsLink: 'https://goo.gl/maps/xyz123',
      coordinates: {
        latitude: 18.5912716,
        longitude: 73.7610976,
      },
    },
    
    workingHours: {
      weekdays: '9:00 AM - 7:00 PM',
      saturday: '9:00 AM - 7:00 PM',
      sunday: 'Closed',
      holidays: 'By Appointment',
    },
  },
  
  // Social Media
  social: {
    facebook: {
      url: 'https://facebook.com/dgrealtors',
      handle: '@dgrealtors',
      pageId: '123456789',
    },
    instagram: {
      url: 'https://instagram.com/dgrealtors',
      handle: '@dgrealtors',
    },
    linkedin: {
      url: 'https://linkedin.com/company/dgrealtors',
      handle: 'dgrealtors',
    },
    youtube: {
      url: 'https://youtube.com/c/dgrealtors',
      channelId: 'UCxxxxxxxxxxxxx',
    },
    twitter: {
      url: 'https://twitter.com/dgrealtors',
      handle: '@dgrealtors',
    },
    whatsapp: {
      number: '919876543210',
      prefilledMessage: 'Hi, I am interested in commercial properties.',
    },
  },
  
  // SEO Configuration
  seo: {
    defaultTitle: 'DGrealtors - Commercial Property Leasing Experts in Pune',
    titleTemplate: '%s | DGrealtors',
    defaultDescription: 'Find premium commercial properties in Pune with DGrealtors. Expert guidance for office spaces, retail shops, warehouses, and showrooms. 14+ years of trusted service.',
    defaultKeywords: [
      'commercial property pune',
      'office space pune',
      'retail space pune',
      'warehouse pune',
      'showroom pune',
      'commercial real estate pune',
      'property leasing pune',
      'dgrealtors',
      'wakad commercial property',
      'hinjewadi office space',
    ],
    
    openGraph: {
      type: 'website',
      locale: 'en_IN',
      site_name: 'DGrealtors',
      defaultImage: '/images/og-default.jpg',
    },
    
    twitter: {
      handle: '@dgrealtors',
      site: '@dgrealtors',
      cardType: 'summary_large_image',
    },
    
    additionalMetaTags: [
      {
        name: 'author',
        content: 'DGrealtors',
      },
      {
        name: 'robots',
        content: 'index, follow',
      },
      {
        name: 'googlebot',
        content: 'index, follow',
      },
      {
        name: 'theme-color',
        content: '#ffd9a0',
      },
    ],
  },
  
  // Theme Configuration
  theme: {
    colors: {
      primary: '#1e1e1e',
      secondary: '#ffd9a0',
      tertiary: '#dce0c3',
      accent: '#ffe5b4',
      
      text: {
        primary: '#1e1e1e',
        secondary: '#4a4a4a',
        light: '#666666',
        inverse: '#ffffff',
      },
      
      background: {
        primary: '#ffffff',
        secondary: '#f9fafb',
        tertiary: '#f3f4f6',
        dark: '#1e1e1e',
      },
      
      status: {
        success: '#4ade80',
        warning: '#fbbf24',
        error: '#ef4444',
        info: '#3b82f6',
      },
    },
    
    fonts: {
      primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      secondary: "'Poppins', sans-serif",
      mono: "'Roboto Mono', monospace",
    },
    
    breakpoints: {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
      xxl: 1400,
    },
    
    container: {
      maxWidth: '1200px',
      padding: '20px',
    },
    
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '2rem',
      xl: '3rem',
      xxl: '4rem',
    },
  },
  
  // Feature Flags
  features: {
    enableBlog: false,
    enableTestimonials: true,
    enableNewsletter: true,
    enableLiveChat: false,
    enablePropertyComparison: true,
    enableAdvancedSearch: true,
    enablePropertyAlerts: true,
    enableVirtualTours: false,
    enablePWA: true,
    enableAnalytics: true,
    enableSocialSharing: true,
  },
  
  // API Configuration
  api: {
    baseUrl: process.env.REACT_APP_API_BASE_URL || 'https://api.dgrealtors.com',
    version: 'v1',
    timeout: 30000,
    retryAttempts: 3,
    
    endpoints: {
      properties: '/properties',
      locations: '/locations',
      contact: '/contact',
      newsletter: '/newsletter',
      search: '/search',
      analytics: '/analytics',
    },
  },
  
  // Third-party Services
  services: {
    googleAnalytics: {
      trackingId: process.env.REACT_APP_GA_TRACKING_ID || 'UA-XXXXXXXXX-X',
      enabled: true,
    },
    
    googleMaps: {
      apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
      enabled: true,
      defaultCenter: { lat: 18.5912716, lng: 73.7610976 },
      defaultZoom: 15,
    },
    
    emailjs: {
      serviceId: process.env.REACT_APP_EMAILJS_SERVICE_ID,
      templateId: process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
      userId: process.env.REACT_APP_EMAILJS_USER_ID,
      enabled: true,
    },
    
    sentry: {
      dsn: process.env.REACT_APP_SENTRY_DSN,
      enabled: process.env.NODE_ENV === 'production',
    },
    
    cloudinary: {
      cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.REACT_APP_CLOUDINARY_API_KEY,
      enabled: true,
    },
  },
  
  // Property Listing Configuration
  listings: {
    defaultView: 'grid',
    itemsPerPage: 12,
    maxItemsPerPage: 50,
    
    sorting: {
      default: 'featured',
      options: [
        { value: 'featured', label: 'Featured' },
        { value: 'price-asc', label: 'Price: Low to High' },
        { value: 'price-desc', label: 'Price: High to Low' },
        { value: 'size-asc', label: 'Size: Small to Large' },
        { value: 'size-desc', label: 'Size: Large to Small' },
        { value: 'newest', label: 'Newest First' },
      ],
    },
    
    filters: {
      propertyType: true,
      location: true,
      priceRange: true,
      sizeRange: true,
      amenities: true,
      availability: true,
    },
  },
  
  // Content Management
  content: {
    hero: {
      title: 'Find Your Perfect Commercial Space',
      subtitle: 'Expert guidance for office spaces, retail properties, and more in Pune',
      ctaText: 'Explore Properties',
      backgroundImage: '/images/hero-bg.jpg',
    },
    
    about: {
      title: 'About DGrealtors',
      description: 'With over 14 years of experience in the commercial real estate sector, DGrealtors has established itself as a trusted partner for businesses seeking the perfect commercial space in Pune.',
      mission: 'To provide exceptional real estate services that exceed client expectations through integrity, professionalism, and market expertise.',
      vision: 'To be the most trusted and preferred commercial real estate partner in Pune, known for our commitment to client success.',
    },
    
    awards: [
      {
        title: 'Best Commercial Real Estate Agency',
        year: 2023,
        organization: 'Pune Real Estate Awards',
      },
      {
        title: 'Excellence in Customer Service',
        year: 2022,
        organization: 'Maharashtra Property Association',
      },
      {
        title: 'Top Property Consultant',
        year: 2021,
        organization: 'Commercial Property Forum',
      },
    ],
  },
  
  // Privacy and Legal
  legal: {
    privacyPolicy: '/privacy-policy',
    termsOfService: '/terms-of-service',
    disclaimer: '/disclaimer',
    cookiePolicy: '/cookie-policy',
    
    cookieConsent: {
      enabled: true,
      message: 'We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.',
      buttonText: 'Accept',
      linkText: 'Learn more',
      linkUrl: '/cookie-policy',
    },
  },
  
  // Maintenance Mode
  maintenance: {
    enabled: false,
    message: 'We are currently performing maintenance. Please check back soon.',
    allowedIPs: ['127.0.0.1'], // IPs that can access during maintenance
  },
  
  // Development Settings
  development: {
    debugMode: process.env.NODE_ENV === 'development',
    showGridOverlay: false,
    showPerformanceMetrics: false,
    mockAPI: false,
  },
};

// Export convenience functions
export const getSiteTitle = (pageTitle) => {
  if (!pageTitle) return siteConfig.seo.defaultTitle;
  return siteConfig.seo.titleTemplate.replace('%s', pageTitle);
};

export const getMetaTags = (page = {}) => ({
  title: getSiteTitle(page.title),
  description: page.description || siteConfig.seo.defaultDescription,
  keywords: page.keywords || siteConfig.seo.defaultKeywords,
  openGraph: {
    ...siteConfig.seo.openGraph,
    ...page.openGraph,
  },
  twitter: {
    ...siteConfig.seo.twitter,
    ...page.twitter,
  },
});

export const isFeatureEnabled = (feature) => {
  return siteConfig.features[feature] || false;
};

export const getAPIEndpoint = (endpoint) => {
  const baseUrl = siteConfig.api.baseUrl;
  const version = siteConfig.api.version;
  const endpointPath = siteConfig.api.endpoints[endpoint];
  
  if (!endpointPath) {
    throw new Error(`API endpoint '${endpoint}' not found`);
  }
  
  return `${baseUrl}/${version}${endpointPath}`;
};

export default siteConfig;
      
