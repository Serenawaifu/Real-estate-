/**
 * Navigation Data Configuration for DGrealtors
 * Comprehensive navigation structure with advanced features
 */

import { 
  PROPERTY_TYPES, 
  LOCATIONS, 
  EXTERNAL_LINKS 
} from '../utils/constants';

// Navigation item status
export const NAV_STATUS = {
  ACTIVE: 'active',
  COMING_SOON: 'coming-soon',
  NEW: 'new',
  HOT: 'hot',
  DISABLED: 'disabled'
};

// Main Navigation Items
export const mainNavigation = [
  {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: '🏠',
    exact: true,
    status: NAV_STATUS.ACTIVE,
    metadata: {
      title: 'Home',
      description: 'Welcome to DGrealtors - Your trusted commercial property partner',
      keywords: ['dgrealtors', 'commercial property', 'pune real estate']
    }
  },
  {
    id: 'properties',
    label: 'Properties',
    path: '/properties',
    icon: '🏢',
    status: NAV_STATUS.ACTIVE,
    badge: 'NEW',
    metadata: {
      title: 'Commercial Properties',
      description: 'Browse our extensive collection of commercial properties in Pune',
      keywords: ['commercial properties', 'office space', 'retail space']
    },
    submenu: {
      featured: {
        title: 'Featured Properties',
        items: [
          {
            id: 'premium-offices',
            label: 'Premium Office Spaces',
            path: '/properties/featured/premium-offices',
            description: 'High-end office spaces in prime locations',
            icon: '⭐',
            image: '/images/nav/premium-offices.jpg'
          },
          {
            id: 'new-listings',
            label: 'New Listings',
            path: '/properties/new',
            description: 'Recently added properties',
            icon: '🆕',
            badge: 'HOT',
            image: '/images/nav/new-listings.jpg'
          }
        ]
      },
      categories: {
        title: 'Browse by Type',
        columns: 2,
        items: Object.values(PROPERTY_TYPES).map(type => ({
          id: type.id,
          label: type.name,
          path: `/properties/type/${type.id}`,
          icon: type.icon,
          description: type.description,
          count: null // Will be populated dynamically
        }))
      },
      locations: {
        title: 'Popular Locations',
        columns: 3,
        items: Object.values(LOCATIONS).slice(0, 6).map(location => ({
          id: location.id,
          label: location.name,
          path: `/properties/location/${location.id}`,
          zone: location.zone,
          popularFor: location.popularFor
        }))
      },
      actions: {
        title: 'Quick Actions',
        items: [
          {
            id: 'advanced-search',
            label: 'Advanced Search',
            path: '/properties/search',
            icon: '🔍',
            variant: 'primary'
          },
          {
            id: 'property-alerts',
            label: 'Set Property Alerts',
            path: '/properties/alerts',
            icon: '🔔',
            variant: 'secondary'
          }
        ]
      }
    }
  },
  {
    id: 'locations',
    label: 'Locations',
    path: '/locations',
    icon: '📍',
    status: NAV_STATUS.ACTIVE,
    metadata: {
      title: 'Locations',
      description: 'Explore commercial properties by location in Pune',
      keywords: ['pune locations', 'commercial areas', 'business districts']
    },
    submenu: {
      zones: {
        title: 'Browse by Zone',
        items: [
          {
            id: 'west-pune',
            label: 'West Pune',
            path: '/locations/zone/west-pune',
            description: 'Hinjewadi, Wakad, Baner, Balewadi',
            properties: ['IT Parks', 'Commercial Complexes'],
            highlighted: true
          },
          {
            id: 'north-pune',
            label: 'North Pune',
            path: '/locations/zone/north-pune',
            description: 'Pimpri-Chinchwad, Bhosari, Chakan',
            properties: ['Industrial', 'Warehouses']
          },
          {
            id: 'east-pune',
            label: 'East Pune',
            path: '/locations/zone/east-pune',
            description: 'Viman Nagar, Kharadi, Magarpatta',
            properties: ['IT Spaces', 'Retail']
          },
          {
            id: 'central-pune',
            label: 'Central Pune',
            path: '/locations/zone/central-pune',
            description: 'Shivajinagar, Camp, Deccan',
            properties: ['Showrooms', 'Offices']
          }
        ]
      },
      topLocations: {
        title: 'Top Locations',
        items: Object.values(LOCATIONS).map(location => ({
          id: location.id,
          label: location.name,
          path: `/locations/${location.id}`,
          zone: location.zone,
          coordinates: location.coordinates,
          popularFor: location.popularFor,
          stats: {
            properties: null, // Dynamic
            avgPrice: null, // Dynamic
            trending: true
          }
        }))
      },
      nearby: {
        title: 'Explore Nearby',
        items: [
          {
            id: 'location-map',
            label: 'Interactive Map View',
            path: '/locations/map',
            icon: '🗺️',
            description: 'Find properties on map'
          },
          {
            id: 'location-comparison',
            label: 'Compare Locations',
            path: '/locations/compare',
            icon: '📊',
            description: 'Compare different areas'
          }
        ]
      }
    }
  },
  {
    id: 'services',
    label: 'Services',
    path: '/services',
    icon: '🤝',
    status: NAV_STATUS.ACTIVE,
    metadata: {
      title: 'Our Services',
      description: 'Comprehensive commercial real estate services',
      keywords: ['real estate services', 'property leasing', 'consultation']
    },
    submenu: {
      main: {
        title: 'Our Services',
        items: [
          {
            id: 'property-leasing',
            label: 'Property Leasing',
            path: '/services/leasing',
            icon: '📋',
            description: 'End-to-end leasing solutions',
            features: ['Property Search', 'Documentation', 'Negotiation']
          },
          {
            id: 'consultation',
            label: 'Real Estate Consultation',
            path: '/services/consultation',
            icon: '💼',
            description: 'Expert advice for your business',
            features: ['Market Analysis', 'Location Strategy', 'Investment Advisory']
          },
          {
            id: 'property-management',
            label: 'Property Management',
            path: '/services/management',
            icon: '🏗️',
            description: 'Complete property management',
            badge: 'COMING SOON',
            status: NAV_STATUS.COMING_SOON
          },
          {
            id: 'legal-assistance',
            label: 'Legal Assistance',
            path: '/services/legal',
            icon: '⚖️',
            description: 'Legal documentation support',
            features: ['Agreement Drafting', 'Due Diligence', 'Registration']
          }
        ]
      },
      process: {
        title: 'Our Process',
        items: [
          {
            id: 'how-it-works',
            label: 'How It Works',
            path: '/services/process',
            icon: '🔄'
          },
          {
            id: 'why-choose-us',
            label: 'Why Choose Us',
            path: '/services/why-us',
            icon: '✨'
          }
        ]
      }
    }
  },
  {
    id: 'about',
    label: 'About',
    path: '/about',
    icon: 'ℹ️',
    status: NAV_STATUS.ACTIVE,
    metadata: {
      title: 'About Us',
      description: 'Learn about DGrealtors - 14+ years of excellence',
      keywords: ['about dgrealtors', 'real estate company', 'pune']
    },
    submenu: {
      company: {
        title: 'Company',
        items: [
          {
            id: 'about-us',
            label: 'About DGrealtors',
            path: '/about',
            icon: '🏛️',
            description: '14+ years of excellence'
          },
          {
            id: 'our-team',
            label: 'Our Team',
            path: '/about/team',
            icon: '👥',
            description: 'Meet our experts'
          },
          {
            id: 'awards',
            label: 'Awards & Recognition',
            path: '/about/awards',
            icon: '🏆',
            description: 'Our achievements'
          },
          {
            id: 'testimonials',
            label: 'Client Testimonials',
            path: '/about/testimonials',
            icon: '💬',
            description: 'What clients say'
          }
        ]
      },
      resources: {
        title: 'Resources',
        items: [
          {
            id: 'blog',
            label: 'Blog & Insights',
            path: '/blog',
            icon: '📝',
            badge: 'NEW',
            status: NAV_STATUS.COMING_SOON
          },
          {
            id: 'guides',
            label: 'Property Guides',
            path: '/resources/guides',
            icon: '📚'
          },
          {
            id: 'market-trends',
            label: 'Market Trends',
            path: '/resources/market-trends',
            icon: '📈'
          },
          {
            id: 'faq',
            label: 'FAQs',
            path: '/resources/faq',
            icon: '❓'
          }
        ]
      }
    }
  },
  {
    id: 'contact',
    label: 'Contact',
    path: '/contact',
    icon: '📞',
    status: NAV_STATUS.ACTIVE,
    highlight: true,
    metadata: {
      title: 'Contact Us',
      description: 'Get in touch with DGrealtors for all your commercial property needs',
      keywords: ['contact', 'enquiry', 'commercial property pune']
    }
  }
];

// Mobile Navigation (Simplified)
export const mobileNavigation = [
  {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: '🏠'
  },
  {
    id: 'properties',
    label: 'Properties',
    path: '/properties',
    icon: '🏢'
  },
  {
    id: 'search',
    label: 'Search',
    path: '/properties/search',
    icon: '🔍'
  },
  {
    id: 'saved',
    label: 'Saved',
    path: '/saved',
    icon: '❤️',
    requiresAuth: false // Currently no auth required
  },
  {
    id: 'contact',
    label: 'Contact',
    path: '/contact',
    icon: '📞'
  }
];

// Footer Navigation
export const footerNavigation = {
  company: {
    title: 'Company',
    items: [
      { label: 'About Us', path: '/about' },
      { label: 'Our Team', path: '/about/team' },
      { label: 'Awards', path: '/about/awards' },
      { label: 'Testimonials', path: '/about/testimonials' },
      { label: 'Careers', path: '/careers', status: NAV_STATUS.COMING_SOON }
    ]
  },
  properties: {
    title: 'Properties',
    items: [
      { label: 'All Properties', path: '/properties' },
      { label: 'Office Spaces', path: '/properties/type/office' },
      { label: 'Retail Shops', path: '/properties/type/retail' },
      { label: 'Warehouses', path: '/properties/type/warehouse' },
      { label: 'New Listings', path: '/properties/new' }
    ]
  },
  locations: {
    title: 'Popular Areas',
    items: [
      { label: 'Wakad', path: '/locations/wakad' },
      { label: 'Hinjewadi', path: '/locations/hinjewadi' },
      { label: 'Baner', path: '/locations/baner' },
      { label: 'Aundh', path: '/locations/aundh' },
      { label: 'View All', path: '/locations' }
    ]
  },
  resources: {
    title: 'Resources',
    items: [
      { label: 'Property Guides', path: '/resources/guides' },
      { label: 'Market Trends', path: '/resources/market-trends' },
      { label: 'FAQs', path: '/resources/faq' },
      { label: 'Blog', path: '/blog', status: NAV_STATUS.COMING_SOON },
      { label: 'News', path: '/news', status: NAV_STATUS.COMING_SOON }
    ]
  },
  legal: {
    title: 'Legal',
    items: [
      { label: 'Privacy Policy', path: '/privacy-policy' },
      { label: 'Terms of Service', path: '/terms-of-service' },
      { label: 'Disclaimer', path: '/disclaimer' },
      { label: 'Cookie Policy', path: '/cookie-policy' },
      { label: 'Sitemap', path: '/sitemap' }
    ]
  }
};

// Breadcrumb Configuration
export const breadcrumbConfig = {
  home: { label: 'Home', icon: '🏠' },
  routes: {
    '/properties': { label: 'Properties', parent: 'home' },
    '/properties/type/:type': { 
      label: (params) => PROPERTY_TYPES[params.type]?.name || 'Type',
      parent: '/properties'
    },
    '/properties/location/:location': { 
      label: (params) => LOCATIONS[params.location]?.name || 'Location',
      parent: '/properties'
    },
    '/locations': { label: 'Locations', parent: 'home' },
    '/locations/:location': {
      label: (params) => LOCATIONS[params.location]?.name || 'Location',
      parent: '/locations'
    },
    '/about': { label: 'About', parent: 'home' },
    '/contact': { label: 'Contact', parent: 'home' },
    '/services': { label: 'Services', parent: 'home' }
  }
};

// Quick Links (for various sections)
export const quickLinks = {
  propertyTypes: Object.values(PROPERTY_TYPES).map(type => ({
    id: type.id,
    label: type.name,
    path: `/properties/type/${type.id}`,
    icon: type.icon
  })),
  
  popularSearches: [
    { label: 'Office Space in Hinjewadi', path: '/properties?type=office&location=hinjewadi' },
    { label: 'Retail Shops in Baner', path: '/properties?type=retail&location=baner' },
    { label: 'Warehouse in PCMC', path: '/properties?type=warehouse&location=pimpri-chinchwad' },
    { label: 'IT Parks in Wakad', path: '/properties?type=office&location=wakad&amenities=it-park' },
    { label: 'Showrooms on Highway', path: '/properties?type=showroom&features=highway-facing' }
  ],
  
  quickActions: [
    { id: 'schedule-visit', label: 'Schedule Site Visit', icon: '📅', action: 'scheduleVisit' },
    { id: 'download-brochure', label: 'Download Brochure', icon: '📄', action: 'downloadBrochure' },
    { id: 'get-callback', label: 'Request Callback', icon: '📞', action: 'requestCallback' },
    { id: 'whatsapp-chat', label: 'WhatsApp Chat', icon: '💬', action: 'whatsappChat' }
  ]
};

// Navigation Utilities
export const navigationUtils = {
  // Get navigation item by path
  getNavItemByPath: (path, navigation = mainNavigation) => {
    for (const item of navigation) {
      if (item.path === path) return item;
      if (item.submenu) {
        for (const section of Object.values(item.submenu)) {
          const found = section.items?.find(subItem => subItem.path === path);
          if (found) return found;
        }
      }
    }
    return null;
  },

  // Check if navigation item is active
  isNavItemActive: (item, currentPath) => {
    if (item.exact) {
      return currentPath === item.path;
    }
    return currentPath.startsWith(item.path);
  },

  // Get breadcrumb trail
  getBreadcrumb: (path) => {
    const trail = [];
    let currentPath = path;
    
    while (currentPath && breadcrumbConfig.routes[currentPath]) {
      const config = breadcrumbConfig.routes[currentPath];
      trail.unshift({
        label: typeof config.label === 'function' ? config.label({}) : config.label,
        path: currentPath
      });
      currentPath = config.parent;
    }
    
    if (trail.length > 0) {
      trail.unshift({ label: breadcrumbConfig.home.label, path: '/' });
    }
    
    return trail;
  },

  // Filter navigation by status
  filterByStatus: (navigation, allowedStatuses = [NAV_STATUS.ACTIVE]) => {
    return navigation.filter(item => 
      !item.status || allowedStatuses.includes(item.status)
    );
  },

  // Get meta tags for navigation item
  getMetaTags: (item) => {
    return item.metadata || {
      title: item.label,
      description: `${item.label} - DGrealtors`,
      keywords: []
    };
  }
};

// Social Links Navigation
export const socialLinks = [
  {
    id: 'facebook',
    label: 'Facebook',
    url: EXTERNAL_LINKS.SOCIAL.FACEBOOK,
    icon: 'facebook',
    color: '#1877F2'
  },
  {
    id: 'instagram',
    label: 'Instagram',
    url: EXTERNAL_LINKS.SOCIAL.INSTAGRAM,
    icon: 'instagram',
    color: '#E4405F'
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    url: EXTERNAL_LINKS.SOCIAL.LINKEDIN,
    icon: 'linkedin',
    color: '#0A66C2'
  },
  {
    id: 'youtube',
    label: 'YouTube',
    url: EXTERNAL_LINKS.SOCIAL.YOUTUBE,
    icon: 'youtube',
    color: '#FF0000'
  },
  {
    id: 'twitter',
    label: 'Twitter',
    url: EXTERNAL_LINKS.SOCIAL.TWITTER,
    icon: 'twitter',
    color: '#1DA1F2'
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    url: `https://wa.me/919876543210?text=Hi, I'm interested in commercial properties`,
    icon: 'whatsapp',
    color: '#25D366'
  }
];

// Export all navigation data
export default {
  mainNavigation,
  mobileNavigation,
  footerNavigation,
  breadcrumbConfig,
  quickLinks,
  socialLinks,
  navigationUtils,
  NAV_STATUS
};
              
