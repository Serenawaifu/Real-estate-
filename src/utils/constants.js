/**
 * Advanced Constants Configuration for DGrealtors
 * Centralized configuration and constants management
 */

/**
 * Application Configuration
 */
export const APP_CONFIG = {
  name: 'DGrealtors',
  fullName: 'DGrealtors - Commercial Property Experts',
  tagline: 'Your Trusted Partner in Commercial Real Estate',
  version: '1.0.0',
  environment: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  baseUrl: process.env.REACT_APP_BASE_URL || 'https://dgrealtors.com',
  apiUrl: process.env.REACT_APP_API_URL || 'https://api.dgrealtors.com',
  cdnUrl: process.env.REACT_APP_CDN_URL || 'https://cdn.dgrealtors.com',
  
  // Feature flags
  features: {
    enableChat: true,
    enableVirtualTours: true,
    enableAdvancedSearch: true,
    enablePropertyComparison: true,
    enableSavedSearches: true,
    enableEmailAlerts: true,
    enable3DView: false,
    enableAIRecommendations: false
  },
  
  // Maintenance mode
  maintenance: {
    enabled: false,
    message: 'We are currently performing maintenance. Please check back soon.',
    allowedIPs: ['127.0.0.1']
  }
};

/**
 * Company Information
 */
export const COMPANY_INFO = {
  name: 'DGrealtors',
  legalName: 'DG Realtors Pvt. Ltd.',
  established: 2009,
  yearsOfExperience: new Date().getFullYear() - 2009,
  registration: {
    cin: 'U70100PN2009PTC123456',
    gstin: '27AABCD1234E1Z5',
    pan: 'AABCD1234E',
    rera: 'P52100012345'
  },
  
  // Contact Information
  contact: {
    primary: {
      phone: '+91 98765 43210',
      alternate: '+91 98765 43211',
      whatsapp: '+91 98765 43210',
      email: 'info@dgrealtors.com',
      sales: 'sales@dgrealtors.com',
      support: 'support@dgrealtors.com'
    },
    
    // Office timings
    hours: {
      weekdays: '9:00 AM - 7:00 PM',
      saturday: '9:00 AM - 6:00 PM',
      sunday: 'Closed',
      holidays: 'By Appointment Only'
    },
    
    // Emergency contact
    emergency: {
      available: true,
      number: '+91 98765 43212',
      hours: '24/7'
    }
  },
  
  // Office Locations
  locations: {
    headquarters: {
      name: 'Wakad Office',
      address: 'Shop No 11, T S Complex, Shop Siddhi Enclave CHS Ltd',
      area: 'Datta Mandir Road, Wakad',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      pincode: '411057',
      landmark: 'Near Datta Mandir',
      coordinates: {
        latitude: 18.5912716,
        longitude: 73.7610976
      },
      mapUrl: 'https://goo.gl/maps/abc123'
    },
    
    branches: [
      {
        name: 'Hinjewadi Office',
        area: 'Phase 1, Hinjewadi',
        city: 'Pune',
        coordinates: {
          latitude: 18.5908,
          longitude: 73.7392
        }
      }
    ]
  },
  
  // Awards and Recognition
  achievements: [
    'Best Commercial Real Estate Firm 2022',
    'Customer Excellence Award 2021',
    'Top Property Consultant - Pune 2020'
  ]
};

/**
 * Theme Configuration
 */
export const THEME = {
  // Brand Colors
  colors: {
    primary: '#1e1e1e',
    secondary: '#ffd9a0',
    tertiary: '#dce0c3',
    accent: '#ffe5b4',
    
    // Semantic colors
    success: '#4ade80',
    warning: '#fbbf24',
    error: '#ef4444',
    info: '#3b82f6',
    
    // Neutral colors
    white: '#ffffff',
    black: '#000000',
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827'
    }
  },
  
  // Typography
  typography: {
    fontFamily: {
      primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      secondary: "'Poppins', sans-serif",
      monospace: "'JetBrains Mono', 'Courier New', monospace"
    },
    
    fontSize: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
      '6xl': '3.75rem',  // 60px
      '7xl': '4.5rem',   // 72px
      '8xl': '6rem',     // 96px
      '9xl': '8rem'      // 128px
    },
    
    fontWeight: {
      thin: 100,
      extralight: 200,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900
    },
    
    lineHeight: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2
    }
  },
  
  // Spacing
  spacing: {
    px: '1px',
    0: '0px',
    0.5: '0.125rem',  // 2px
    1: '0.25rem',     // 4px
    1.5: '0.375rem',  // 6px
    2: '0.5rem',      // 8px
    2.5: '0.625rem',  // 10px
    3: '0.75rem',     // 12px
    3.5: '0.875rem',  // 14px
    4: '1rem',        // 16px
    5: '1.25rem',     // 20px
    6: '1.5rem',      // 24px
    7: '1.75rem',     // 28px
    8: '2rem',        // 32px
    9: '2.25rem',     // 36px
    10: '2.5rem',     // 40px
    11: '2.75rem',    // 44px
    12: '3rem',       // 48px
    14: '3.5rem',     // 56px
    16: '4rem',       // 64px
    20: '5rem',       // 80px
    24: '6rem',       // 96px
    28: '7rem',       // 112px
    32: '8rem',       // 128px
    36: '9rem',       // 144px
    40: '10rem',      // 160px
    44: '11rem',      // 176px
    48: '12rem',      // 192px
    52: '13rem',      // 208px
    56: '14rem',      // 224px
    60: '15rem',      // 240px
    64: '16rem',      // 256px
    72: '18rem',      // 288px
    80: '20rem',      // 320px
    96: '24rem'       // 384px
  },
  
  // Breakpoints
  breakpoints: {
    xs: '475px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },
  
  // Z-index scale
  zIndex: {
    auto: 'auto',
    0: '0',
    10: '10',
    20: '20',
    30: '30',
    40: '40',
    50: '50',
    100: '100',
    200: '200',
    300: '300',
    400: '400',
    500: '500',
    1000: '1000',
    dropdown: '1000',
    sticky: '1020',
    fixed: '1030',
    modal: '1040',
    popover: '1050',
    tooltip: '1060',
    notification: '1070',
    loader: '1080'
  },
  
  // Shadows
  boxShadow: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    outline: '0 0 0 3px rgba(255, 217, 160, 0.5)'
  },
  
  // Border radius
  borderRadius: {
    none: '0px',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px'
  },
  
  // Transitions
  transition: {
    duration: {
      75: '75ms',
      100: '100ms',
      150: '150ms',
      200: '200ms',
      300: '300ms',
      500: '500ms',
      700: '700ms',
      1000: '1000ms'
    },
    
    timing: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    }
  }
};

/**
 * Property Types Configuration
 */
export const PROPERTY_TYPES = {
  OFFICE: {
    id: 'office',
    name: 'Office Space',
    icon: '🏢',
    description: 'Commercial office spaces for businesses',
    subtypes: ['Private Office', 'Shared Office', 'Co-working', 'Business Park']
  },
  RETAIL: {
    id: 'retail',
    name: 'Retail Shop',
    icon: '🏪',
    description: 'Retail spaces for shops and outlets',
    subtypes: ['Street Shop', 'Mall Space', 'Showroom', 'Kiosk']
  },
  WAREHOUSE: {
    id: 'warehouse',
    name: 'Warehouse',
    icon: '🏭',
    description: 'Storage and warehousing facilities',
    subtypes: ['Cold Storage', 'General Warehouse', 'Distribution Center', 'Godown']
  },
  SHOWROOM: {
    id: 'showroom',
    name: 'Showroom',
    icon: '🏛️',
    description: 'Display and exhibition spaces',
    subtypes: ['Auto Showroom', 'Furniture Showroom', 'Electronics Showroom']
  },
  INDUSTRIAL: {
    id: 'industrial',
    name: 'Industrial',
    icon: '⚙️',
    description: 'Industrial and manufacturing spaces',
    subtypes: ['Factory', 'Industrial Shed', 'Industrial Plot']
  },
  LAND: {
    id: 'land',
    name: 'Commercial Land',
    icon: '🌍',
    description: 'Commercial plots and land parcels',
    subtypes: ['Commercial Plot', 'Industrial Plot', 'Agricultural Land']
  }
};

/**
 * Property Features
 */
export const PROPERTY_FEATURES = {
  amenities: [
    { id: 'parking', name: 'Parking', icon: '🚗' },
    { id: 'security', name: '24/7 Security', icon: '🔒' },
    { id: 'power_backup', name: 'Power Backup', icon: '⚡' },
    { id: 'elevator', name: 'Elevator', icon: '🛗' },
    { id: 'ac', name: 'Air Conditioning', icon: '❄️' },
    { id: 'cafeteria', name: 'Cafeteria', icon: '☕' },
    { id: 'conference', name: 'Conference Room', icon: '📊' },
    { id: 'reception', name: 'Reception', icon: '🏢' },
    { id: 'water_storage', name: 'Water Storage', icon: '💧' },
    { id: 'fire_safety', name: 'Fire Safety', icon: '🚒' },
    { id: 'cctv', name: 'CCTV Surveillance', icon: '📹' },
    { id: 'wifi', name: 'High-Speed Internet', icon: '📶' }
  ],
  
  furnishing: [
    { id: 'unfurnished', name: 'Unfurnished' },
    { id: 'semi_furnished', name: 'Semi Furnished' },
    { id: 'fully_furnished', name: 'Fully Furnished' }
  ],
  
  availability: [
    { id: 'immediate', name: 'Ready to Move' },
    { id: 'within_month', name: 'Within 1 Month' },
    { id: 'within_3_months', name: 'Within 3 Months' },
    { id: 'under_construction', name: 'Under Construction' }
  ]
};

/**
 * Location Data
 */
export const LOCATIONS = {
  // Popular areas in Pune
  popularAreas: [
    { id: 'wakad', name: 'Wakad', zone: 'West' },
    { id: 'hinjewadi', name: 'Hinjewadi', zone: 'West' },
    { id: 'baner', name: 'Baner', zone: 'West' },
    { id: 'aundh', name: 'Aundh', zone: 'North-West' },
    { id: 'kothrud', name: 'Kothrud', zone: 'West' },
    { id: 'kalyani_nagar', name: 'Kalyani Nagar', zone: 'East' },
    { id: 'viman_nagar', name: 'Viman Nagar', zone: 'East' },
    { id: 'kharadi', name: 'Kharadi', zone: 'East' },
    { id: 'hadapsar', name: 'Hadapsar', zone: 'South-East' },
    { id: 'camp', name: 'Camp', zone: 'Central' },
    { id: 'shivaji_nagar', name: 'Shivaji Nagar', zone: 'Central' },
    { id: 'pimpri_chinchwad', name: 'Pimpri-Chinchwad', zone: 'North-West' }
  ],
  
  // Zones
  zones: [
    { id: 'west', name: 'West Pune', areas: ['Wakad', 'Hinjewadi', 'Baner', 'Kothrud'] },
    { id: 'east', name: 'East Pune', areas: ['Kalyani Nagar', 'Viman Nagar', 'Kharadi'] },
    { id: 'central', name: 'Central Pune', areas: ['Camp', 'Shivaji Nagar', 'Deccan'] },
    { id: 'north', name: 'North Pune', areas: ['Aundh', 'Pimpri-Chinchwad'] },
    { id: 'south', name: 'South Pune', areas: ['Hadapsar', 'Katraj', 'Kondhwa'] }
  ]
};

/**
 * Budget Ranges
 */
export const BUDGET_RANGES = {
  rent: [
    { id: 'below_10k', label: 'Below ₹10,000', min: 0, max: 10000 },
    { id: '10k_25k', label: '₹10,000 - ₹25,000', min: 10000, max: 25000 },
    { id: '25k_50k', label: '₹25,000 - ₹50,000', min: 25000, max: 50000 },
    { id: '50k_1l', label: '₹50,000 - ₹1 Lakh', min: 50000, max: 100000 },
    { id: '1l_2l', label: '₹1 Lakh - ₹2 Lakh', min: 100000, max: 200000 },
    { id: 'above_2l', label: 'Above ₹2 Lakh', min: 200000, max: null }
  ],
  
  sale: [
    { id: 'below_50l', label: 'Below ₹50 Lakh', min: 0, max: 5000000 },
    { id: '50l_1cr', label: '₹50 Lakh - ₹1 Cr', min: 5000000, max: 10000000 },
    { id: '1cr_2cr', label: '₹1 Cr - ₹2 Cr', min: 10000000, max: 20000000 },
    { id: '2cr_5cr', label: '₹2 Cr - ₹5 Cr', min: 20000000, max: 50000000 },
    { id: 'above_5cr', label: 'Above ₹5 Cr', min: 50000000, max: null }
  ]
};

/**
 * SEO Configuration
 */
export const SEO_CONFIG = {
  defaultTitle: 'DGrealtors - Commercial Property Leasing Experts in Pune',
  titleTemplate: '%s | DGrealtors',
  defaultDescription: 'Find premium commercial properties in Pune with DGrealtors. 14+ years of expertise in office spaces, retail shops, warehouses, and more.',
  defaultKeywords: [
    'commercial property pune',
    'office space pune',
    'retail shop pune',
    'warehouse pune',
    'commercial real estate pune',
    'property leasing pune',
    'dgrealtors'
  ],
  
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: APP_CONFIG.baseUrl,
    siteName: 'DGrealtors',
    image: `${APP_CONFIG.cdnUrl}/images/og-image.jpg`,
    imageWidth: 1200,
    imageHeight: 630
  },
  
  twitter: {
    handle: '@dgrealtors',
    site: '@dgrealtors',
    cardType: 'summary_large_image'
  }
};

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  // Base paths
  base: APP_CONFIG.apiUrl,
  v1: `${APP_CONFIG.apiUrl}/v1`,
  
  // Authentication
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    register: '/auth/register',
    verify: '/auth/verify',
    forgot: '/auth/forgot-password',
    reset: '/auth/reset-password',
    refresh: '/auth/refresh'
  },
  
  // Properties
  properties: {
    list: '/properties',
    search: '/properties/search',
    featured: '/properties/featured',
    detail: '/properties/:id',
    similar: '/properties/:id/similar',
    inquiry: '/properties/:id/inquiry'
  },
  
  // User
  user: {
    profile: '/user/profile',
    favorites: '/user/favorites',
    searches: '/user/searches',
    alerts: '/user/alerts',
    inquiries: '/user/inquiries'
  },
  
  // Contact
  contact: {
    send: '/contact/send',
    callback: '/contact/callback',
    subscribe: '/contact/subscribe'
  },
  
  // Utilities
  utils: {
    locations: '/utils/locations',
    amenities: '/utils/amenities',
    upload: '/utils/upload'
  }
};

/**
 * Form Validation Rules
 */
export const VALIDATION_RULES = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s'-]+$/
  },
  
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    allowedDomains: ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com']
  },
  
  phone: {
    required: true,
    pattern: /^[6-9]\d{9}$/,
    minLength: 10,
    maxLength: 10
  },
  
  message: {
    required: true,
    minLength: 20,
    maxLength: 500
  },
  
  budget: {
    min: 1000,
    max: 100000000
  },
  
  propertySize: {
    min: 100,
    max: 100000
  }
};

/**
 * Social Media Links
 */
export const SOCIAL_MEDIA = {
  facebook: {
    url: 'https://facebook.com/dgrealtors',
    icon: 'facebook',
    name: 'Facebook'
  },
  instagram: {
    url: 'https://instagram.com/dgrealtors',
    icon: 'instagram',
    name: 'Instagram'
  },
  linkedin: {
    url: 'https://linkedin.com/company/dgrealtors',
    icon: 'linkedin',
    name: 'LinkedIn'
  },
  twitter: {
    url: 'https://twitter.com/dgrealtors',
    icon: 'twitter',
    name: 'Twitter'
  },
  youtube: {
    url: 'https://youtube.com/dgrealtors',
    icon: 'youtube',
    name: 'YouTube'
  },
  whatsapp: {
    url: `https://wa.me/919876543210`,
    icon: 'whatsapp',
    name: 'WhatsApp'
  }
};

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  generic: 'Something went wrong. Please try again.',
  network: 'Network error. Please check your connection.',
  timeout: 'Request timeout. Please try again.',
  notFound: 'The requested resource was not found.',
  unauthorized: 'You need to login to access this feature.',
  forbidden: 'You do not have permission to perform this action.',
  validation: 'Please check the form and try again.',
  server: 'Server error. Please try again later.'
};

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
  contactSent: 'Thank you for contacting us. We will get back to you soon.',
  inquirySent: 'Your inquiry has been sent successfully.',
  saved: 'Saved successfully.',
  updated: 'Updated successfully.',
  deleted: 'Deleted successfully.',
  subscribed: 'You have been subscribed successfully.'
};

/**
 * Date/Time Formats
 */
export const DATE_FORMATS = {
  display: 'DD MMM YYYY',
  displayWithTime: 'DD MMM YYYY, hh:mm A',
  input: 'YYYY-MM-DD',
  api: 'YYYY-MM-DD',
  relative: true // Use relative time (e.g., "2 hours ago")
};

/**
 * Pagination Configuration
 */
export const PAGINATION = {
  defaultPage: 1,
  defaultLimit: 12,
  limitOptions: [12, 24, 48, 96],
  maxLimit: 100
};

/**
 * Image Configuration
 */
export const IMAGE_CONFIG = {
  quality: 85,
  formats: ['webp', 'jpg'],
  breakpoints: [320, 640, 768, 1024, 1280, 1536],
  placeholder: 'blur',
  lazyBoundary: '200px',
  
  sizes: {
    thumbnail: { width: 150, height: 150 },
    small: { width: 300, height: 200 },
    medium: { width: 600, height: 400 },
    large: { width: 1200, height: 800 },
    hero: { width: 1920, height: 1080 }
  },
  
  fallback: '/images/placeholder.jpg'
};

/**
 * Cache Configuration
 */
export const CACHE_CONFIG = {
  enabled: true,
  ttl: {
    short: 5 * 60 * 1000,        // 5 minutes
    medium: 30 * 60 * 1000,      // 30 minutes
    long: 24 * 60 * 60 * 1000,   // 24 hours
    permanent: 7 * 24 * 60 * 60 * 1000  // 7 days
  },
  
  keys: {
    properties: 'properties',
    propertyDetail: 'property',
    locations: 'locations',
    amenities: 'amenities',
    user: 'user'
  }
};

/**
 * Export all constants
 */
export default {
  APP_CONFIG,
  COMPANY_INFO,
  THEME,
  PROPERTY_TYPES,
  PROPERTY_FEATURES,
  LOCATIONS,
  BUDGET_RANGES,
  SEO_CONFIG,
  API_ENDPOINTS,
  VALIDATION_RULES,
  SOCIAL_MEDIA,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  DATE_FORMATS,
  PAGINATION,
  IMAGE_CONFIG,
  CACHE_CONFIG
};
      
