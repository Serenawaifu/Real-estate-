# DGrealtors Website Customization Guide

## Table of Contents
- [Overview](#overview)
- [Theme Customization](#theme-customization)
- [Component Customization](#component-customization)
- [Content Management](#content-management)
- [Advanced Features](#advanced-features)
- [API Integration](#api-integration)
- [Performance Optimization](#performance-optimization)
- [Security Configuration](#security-configuration)
- [Deployment Options](#deployment-options)

## Overview

This guide provides comprehensive instructions for customizing the DGrealtors website. The site is built with a modular architecture that allows for easy customization without modifying core files.

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/dgrealtors/website.git
   cd website
   npm install

   Set up environment variables
   cp .env.example .env
# Edit .env with your configuration

Start development server
npm run dev

Theme Customization
Color Scheme
The color scheme is defined in src/styles/variables.css. To customize:
/* src/styles/variables.css */
:root {
  /* Primary Colors - Update these for brand colors */
  --color-primary: #1e3a5f;           /* Deep Professional Blue */
  --color-primary-light: #2d4f7f;
  --color-primary-dark: #0f2a4f;
  
  /* Secondary Colors - Accent colors */
  --color-secondary: #c9a961;         /* Elegant Gold */
  --color-secondary-light: #d4b971;
  --color-secondary-dark: #b99951;
  
  /* Custom brand colors - Add your own */
  --color-brand-accent: #your-color;
  --color-brand-highlight: #your-color;
}

Typography
Customize fonts in the variables file:
/* src/styles/variables.css */
:root {
  /* Font Families */
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-secondary: 'Playfair Display', Georgia, serif;
  --font-mono: 'JetBrains Mono', monospace;
  
  /* Font Sizes - Fluid typography */
  --text-base: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
  --text-hero: clamp(2.5rem, 2rem + 2.5vw, 5rem);
}

To add custom fonts:
<!-- src/index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Your+Font:wght@400;600;700&display=swap" rel="stylesheet">

Layout Configuration
Modify layout settings:
/* src/styles/variables.css */
:root {
  /* Container Widths */
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
  --container-2xl: 1536px;
  
  /* Spacing System */
  --space-unit: 1rem;
  --space-xs: calc(var(--space-unit) * 0.5);
  --space-sm: calc(var(--space-unit) * 0.75);
  --space-md: var(--space-unit);
  --space-lg: calc(var(--space-unit) * 1.5);
  --space-xl: calc(var(--space-unit) * 2);
}

Component Customization
Navigation Bar
// src/components/Navigation.js
const navigationConfig = {
  logo: {
    text: 'DGrealtors',
    image: '/images/logo.svg',
    href: '/'
  },
  links: [
    { text: 'Home', href: '/', active: true },
    { text: 'Properties', href: '/properties' },
    { text: 'Services', href: '/services' },
    { text: 'About', href: '/about' },
    { text: 'Contact', href: '/contact' }
  ],
  cta: {
    text: 'Get Started',
    href: '/contact',
    style: 'primary'
  }
};

Hero Section
// src/components/Hero.js
const heroConfig = {
  title: 'Find Your Dream Commercial Property',
  subtitle: 'Expert real estate services for over 14 years',
  backgroundImage: '/images/hero-bg.jpg',
  overlay: true,
  overlayOpacity: 0.6,
  particles: {
    enabled: true,
    type: 'network',
    color: '#ffffff',
    count: 50
  },
  cta: [
    {
      text: 'Browse Properties',
      href: '/properties',
      style: 'primary',
      size: 'large'
    },
    {
      text: 'Contact Us',
      href: '/contact',
      style: 'secondary',
      size: 'large'
    }
  ]
};

Property Cards
// src/components/PropertyCard.js
const propertyCardConfig = {
  imageAspectRatio: '16/9',
  showBadge: true,
  badgePosition: 'top-right',
  features: ['size', 'price', 'location', 'type'],
  hover: {
    scale: 1.02,
    shadow: 'xl',
    showOverlay: true
  },
  lazy: {
    enabled: true,
    threshold: 0.1,
    rootMargin: '50px'
  }
};

Contact Form
// src/components/ContactForm.js
const formConfig = {
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Full Name',
      required: true,
      validation: {
        minLength: 2,
        maxLength: 100,
        pattern: /^[a-zA-Z\s'-]+$/
      }
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email Address',
      required: true,
      validation: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      }
    },
    {
      name: 'phone',
      type: 'tel',
      label: 'Phone Number',
      required: false,
      validation: {
        pattern: /^\+?[\d\s()-]+$/,
        minLength: 10
      }
    },
    {
      name: 'propertyType',
      type: 'select',
      label: 'Property Type',
      options: [
        { value: '', label: 'Select Type' },
        { value: 'office', label: 'Office Space' },
        { value: 'retail', label: 'Retail Space' },
        { value: 'warehouse', label: 'Warehouse' },
        { value: 'other', label: 'Other' }
      ]
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Message',
      required: true,
      rows: 5,
      validation: {
        minLength: 10,
        maxLength: 1000
      }
    }
  ],
  submitButton: {
    text: 'Send Message',
    loadingText: 'Sending...',
    successText: 'Sent Successfully!'
  },
  api: {
    endpoint: '/api/contact',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }
};

Content Management
Data Files Structure
// data/config.json
{
  "site": {
    "name": "DGrealtors",
    "tagline": "Your Trusted Real Estate Partner",
    "description": "Premium commercial real estate services",
    "url": "https://dgrealtors.com",
    "established": 2009
  },
  "contact": {
    "email": "info@dgrealtors.com",
    "phone": "+1-234-567-8900",
    "address": {
      "street": "123 Business Ave",
      "city": "New York",
      "state": "NY",
      "zip": "10001",
      "country": "USA"
    },
    "hours": {
      "weekdays": "9:00 AM - 6:00 PM",
      "saturday": "10:00 AM - 4:00 PM",
      "sunday": "Closed"
    }
  },
  "social": {
    "facebook": "https://facebook.com/dgrealtors",
    "twitter": "https://twitter.com/dgrealtors",
    "linkedin": "https://linkedin.com/company/dgrealtors",
    "instagram": "https://instagram.com/dgrealtors"
  }
}

Property Data
// data/properties.json
{
  "properties": [
    {
      "id": "prop-001",
      "title": "Modern Office Complex",
      "type": "office",
      "price": 2500000,
      "size": 10000,
      "sizeUnit": "sqft",
      "location": {
        "address": "Downtown Business District",
        "city": "New York",
        "state": "NY",
        "coordinates": {
          "lat": 40.7128,
          "lng": -74.0060
        }
      },
      "features": [
        "24/7 Security",
        "Parking Garage",
        "High-Speed Internet",
        "Conference Rooms"
      ],
      "images": [
        {
          "url": "/images/properties/prop-001-main.jpg",
          "alt": "Modern office building exterior",
          "caption": "Front view of the office complex"
        }
      ],
      "available": true,
      "featured": true,
      "description": "Premium office space in the heart of downtown..."
    }
  ]
}

Content Templates
// data/templates.js
export const emailTemplates = {
  contactConfirmation: {
    subject: 'Thank you for contacting DGrealtors',
    body: `
      <h2>Hello {{name}},</h2>
      <p>Thank you for reaching out to DGrealtors. We've received your inquiry about {{propertyType}} properties.</p>
      <p>Our team will review your message and get back to you within 24 hours.</p>
      <p>Your Message:</p>
      <blockquote>{{message}}</blockquote>
      <p>Best regards,<br>The DGrealtors Team</p>
    `
  },
  propertyInquiry: {
    subject: 'Property Inquiry - {{propertyTitle}}',
    body: `
      <h2>New Property Inquiry</h2>
      <p><strong>From:</strong> {{name}} ({{email}})</p>
      <p><strong>Phone:</strong> {{phone}}</p>
      <p><strong>Property:</strong> {{propertyTitle}}</p>
      <p><strong>Message:</strong></p>
      <p>{{message}}</p>
    `
  }
};

Advanced Features
Particle System Configuration
// Particle system presets
const particleConfigs = {
  hero: {
    preset: 'network',
    particleCount: 100,
    colors: ['#1e3a5f', '#2d4f7f', '#c9a961'],
    interactive: true,
    mouse: {
      radius: 150,
      force: 0.03
    },
    physics: {
      gravity: { x: 0, y: 0 },
      wind: { x: 0.01, y: 0 }
    }
  },
  background: {
    preset: 'starfield',
    particleCount: 200,
    colors: ['#ffffff', '#c9a961'],
    parallax: true,
    parallaxDepth: 3
  }
};

// Initialize particle system
const particles = new ParticleSystem({
  container: document.querySelector('.hero'),
  ...particleConfigs.hero
});

Smooth Scroll Configuration
// Smooth scroll settings
const smoothScrollConfig = {
  duration: 1000,
  easing: 'easeInOutCubic',
  offset: -80, // Account for fixed header
  updateURL: true,
  
  // Enable features
  parallax: true,
  scrollIndicator: true,
  scrollReveal: true,
  
  // Callbacks
  onStart: (data) => {
    console.log('Scrolling to:', data.target);
  },
  onComplete: (data) => {
    console.log('Scroll complete:', data.position);
  }
};

// Initialize
const scroll = new SmoothScroll(smoothScrollConfig);

Image Optimization Settings
// Image optimization config
const imageConfig = {
  formats: ['webp', 'avif', 'jpg'],
  sizes: [320, 640, 768, 1024, 1200, 1920],
  quality: {
    jpg: 85,
    webp: 85,
    avif: 80
  },
  lazy: {
    rootMargin: '50px',
    threshold: 0.01,
    placeholder: 'blur'
  }
};

Animation Configuration
// Animation settings using AOS or custom
const animationConfig = {
  duration: 800,
  easing: 'ease-out-cubic',
  once: false,
  mirror: true,
  offset: 120,
  
  // Custom animations
  custom: {
    fadeInUp: {
      from: { opacity: 0, transform: 'translateY(30px)' },
      to: { opacity: 1, transform: 'translateY(0)' }
    },
    scaleIn: {
      from: { opacity: 0, transform: 'scale(0.9)' },
      to: { opacity: 1, transform: 'scale(1)' }
    }
  }
};

API Integration
Contact Form API
// api/contact.js
export const contactAPI = {
  endpoint: '/api/contact',
  
  async submit(formData) {
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': this.getCSRFToken()
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Contact API Error:', error);
      throw error;
    }
  },
  
  getCSRFToken() {
    return document.querySelector('meta[name="csrf-token"]')?.content;
  }
};

Property Search API
// api/properties.js
export const propertyAPI = {
  endpoint: '/api/properties',
  
  async search(filters = {}) {
    const params = new URLSearchParams({
      type: filters.type || 'all',
      minPrice: filters.minPrice || 0,
      maxPrice: filters.maxPrice || 999999999,
      minSize: filters.minSize || 0,
      location: filters.location || '',
      page: filters.page || 1,
      limit: filters.limit || 12
    });
    
    const response = await fetch(`${this.endpoint}?${params}`);
    return await response.json();
  },
  
  async getById(id) {
    const response = await fetch(`${this.endpoint}/${id}`);
    return await response.json();
  },
  
  async getFeatured() {
    const response = await fetch(`${this.endpoint}/featured`);
    return await response.json();
  }
};

Analytics Integration
// config/analytics.js
export const analyticsConfig = {
  google: {
    trackingId: 'UA-XXXXXXXXX-X',
    anonymizeIp: true,
    enhancedEcommerce: false
  },
  
  events: {
    propertyView: (property) => {
      gtag('event', 'view_item', {
        currency: 'USD',
        value: property.price,
        items: [{
          item_id: property.id,
          item_name: property.title,
          item_category: property.type,
          price: property.price
        }]
      });
    },
    
    contactFormSubmit: (formData) => {
      gtag('event', 'generate_lead', {
        value: 1,
        currency: 'USD'
      });
    },
    
    phoneClick: (phoneNumber) => {
      gtag('event', 'click', {
        event_category: 'Contact',
        event_label: 'Phone',
        value: phoneNumber
      });
    }
  }
};

Performance Optimization
Lazy Loading Configuration
// config/lazyload.js
export const lazyLoadConfig = {
  images: {
    selector: 'img[data-src]',
    rootMargin: '50px',
    threshold: 0.01,
    loadedClass: 'loaded',
    loadingClass: 'loading',
    errorClass: 'error'
  },
  
  iframes: {
    selector: 'iframe[data-src]',
    rootMargin: '100px'
  },
  
  scripts: {
    selector: 'script[data-src]',
    loadOnInteraction: true
  }
};

Critical CSS
/* critical.css - Inline this in <head> */
:root {
  --color-primary: #1e3a5f;
  --color-secondary: #c9a961;
  --font-primary: 'Inter', sans-serif;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-primary);
  line-height: 1.6;
  color: #333;
}

.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: var(--color-primary);
}

/* Additional critical styles */

Service Worker Configuration
// sw.js
const CACHE_NAME = 'dgrealtors-v1';
const urlsToCache = [
  '/',
  '/styles/main.css',
  '/scripts/main.js',
  '/images/logo.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

Security Configuration
Content Security Policy
// security/csp.js
export const cspConfig = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      "'unsafe-inline'",
      "https://www.googletagmanager.com",
      "https://www.google-analytics.com"
    ],
    styleSrc: [
      "'self'",
      "'unsafe-inline'",
      "https://fonts.googleapis.com"
    ],
    imgSrc: [
      "'self'",
      "data:",
      "https:",
      "https://www.google-analytics.com"
    ],
    fontSrc: [
      "'self'",
      "https://fonts.gstatic.com"
    ],
    connectSrc: [
      "'self'",
      "https://www.google-analytics.com"
    ]
  }
};

Security Headers
// security/headers.js
export const securityHeaders = {
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
};

Input Sanitization
// utils/sanitize.js
export const sanitize = {
  text: (input) => {
    return input
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .trim();
  },
  
  email: (email) => {
    return email
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9@._-]/g, '');
  },
  
  phone: (phone) => {
    return phone.replace(/[^\d+()-\s]/g, '');
  },
  
  html: (html) => {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  }
};

Deployment Options
Environment Configuration
# .env.production
NODE_ENV=production
SITE_URL=https://dgrealtors.com
API_URL=https://api.dgrealtors.com
CDN_URL=https://cdn.dgrealtors.com

# API Keys (keep secure)
GOOGLE_ANALYTICS_ID=UA-XXXXXXXXX-X
GOOGLE_MAPS_API_KEY=your-api-key
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=noreply@dgrealtors.com
SMTP_PASS=your-password

# Security
SESSION_SECRET=random-secure-string
CSRF_SECRET=another-secure-string

Build Configuration
// build.config.js
export default {
  input: 'src',
  output: 'dist',
  
  html: {
    minify: true,
    inlineCSS: true,
    inlineJS: false
  },
  
  css: {
    minify: true,
    autoprefixer: true,
    purge: true
  },
  
  js: {
    minify: true,
    bundle: true,
    transpile: true,
    sourceMaps: false
  },
  
  images: {
    optimize: true,
    formats: ['webp', 'avif'],
    sizes: [320, 640, 768, 1024, 1200, 1920]
  },
  
  pwa: {
    enabled: true,
    manifest: {
      name: 'DGrealtors',
      short_name: 'DGR',
      theme_color: '#1e3a5f',
      background_color: '#ffffff'
    }
  }
};

Deployment Scripts
#!/bin/bash
# deploy.sh

echo "🚀 Starting deployment..."

# Build the project
npm run build

# Run tests
npm test

# Generate sitemap
npm run generate:sitemap

# Optimize images
npm run optimize:images

# Upload to CDN
aws s3 sync dist/ s3://dgrealtors-website --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id ABCDEFG123456 \
  --paths "/*"

# Update DNS if needed
# ...

echo "✅ Deployment complete!"

Monitoring Setup
// monitoring/config.js
export const monitoringConfig = {
  sentry: {
    dsn: 'https://xxxxx@sentry.io/xxxxx',
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0
  },
  
  performance: {
    enableWebVitals: true,
    enableResourceTiming: true,
    enableLongTasks: true
  },
  
  errorHandling: {
    logToConsole: process.env.NODE_ENV !== 'production',
    sendToServer: true,
    showUserMessage: true
  }
};

Troubleshooting
Common Issues
Images not loading
# Check image paths
npm run check:images

# Regenerate image assets
npm run generate:images

Form submission errors
// Enable debug mode
const formDebug = true;

// Check console for detailed errors
formSubmission.on('error', (error) => {
  console.error('Form Error:', error);
});

Performance issues
# Run performance audit
npm run audit:performance

# Generate performance report
npm run report:performance

Debug Mode
// config/debug.js
export const debugConfig = {
  enabled: process.env.NODE_ENV !== 'production',
  
  features: {
    logAPI: true,
    logErrors: true,
    showGrid: false,
    showBreakpoints: true,
    showPerformance: true
  },
  
  tools: {
    redux: true,
    react: true,
    vue: false
  }
};

Support
For additional support or custom development:

Email: dev@dgrealtors.com
Documentation: https://docs.dgrealtors.in
GitHub: https://github.com/Serenawaifu/Real-estate-
Last Updated: {{current.date}} Version: 1.0.0






