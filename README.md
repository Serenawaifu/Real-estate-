# DGrealtors - Premium Commercial Real Estate Website

<div align="center">
  <img src="https://dgrealtors.in/logo.svg" alt="DGrealtors Logo" width="200" />
  
  <h3>Your Trusted Partner in Commercial Real Estate</h3>
  
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
  [![Node Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org)
  [![Build Status](https://img.shields.io/github/workflow/status/dgrealtors/website/CI)](https://github.com/dgrealtors/website/actions)
  [![Lighthouse Score](https://img.shields.io/badge/lighthouse-100%25-brightgreen.svg)](https://developers.google.com/web/tools/lighthouse)
  [![Security](https://img.shields.io/badge/security-A%2B-brightgreen.svg)](https://securityheaders.com)
  
  [Live Demo](https://dgrealtors.in) | [Documentation](docs/) | [Report Bug](https://github.com/dgrealtors/website/issues) | [Request Feature](https://github.com/dgrealtors/website/issues)
</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development](#development)
- [Deployment](#deployment)
- [Performance](#performance)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## 🏢 Overview

DGrealtors is a modern, high-performance commercial real estate website built with cutting-edge web technologies. With over 14 years of experience in the industry, this platform showcases properties, services, and expertise in commercial real estate.

### Key Highlights

- 🚀 **Lightning Fast**: Optimized for performance with 100/100 Lighthouse score
- 📱 **Mobile First**: Fully responsive design that works on all devices
- 🔒 **Security First**: A+ security rating with advanced protection features
- ♿ **Accessible**: WCAG 2.1 AA compliant
- 🌐 **SEO Optimized**: Built-in SEO features for maximum visibility
- 🎨 **Modern UI/UX**: Sleek, professional design with smooth animations

## ✨ Features

### Core Features

- **Property Showcase**: Dynamic property listings with advanced filtering
- **Interactive Galleries**: High-resolution image galleries with lazy loading
- **Contact Management**: Sophisticated form handling with validation
- **Company Portfolio**: Showcase of partner companies and achievements
- **Awards Display**: Professional presentation of certifications and awards
- **Location Maps**: Interactive property location displays

### Technical Features

- **Progressive Web App (PWA)**: Installable, offline-capable web app
- **Real-time Search**: Instant property search with filters
- **Animation System**: Smooth, GPU-accelerated animations
- **Image Optimization**: Automatic image optimization and responsive images
- **Performance Monitoring**: Built-in performance tracking
- **Analytics Integration**: Google Analytics and custom tracking
- **SEO Enhancement**: Dynamic sitemap, structured data, meta tags
- **Security Features**: CSP, HTTPS enforcement, input sanitization

### Advanced Features

- **Particle Animations**: Dynamic particle effects for visual appeal
- **Smooth Scrolling**: Enhanced scrolling with parallax effects
- **Dark Mode**: Automatic dark mode support
- **Multi-language**: i18n ready architecture
- **A/B Testing**: Built-in A/B testing framework
- **Error Tracking**: Sentry integration for error monitoring

## 🛠️ Tech Stack

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid & Flexbox
- **JavaScript (ES6+)**: Vanilla JS with modern features
- **PostCSS**: CSS processing
- **Webpack**: Module bundling

### Backend & Services
- **Node.js**: Server runtime
- **Express.js**: Web application framework
- **PostgreSQL**: Database (optional)
- **Redis**: Caching (optional)
- **AWS S3**: Asset storage
- **CloudFront**: CDN

### Build Tools
- **Vite**: Build tool and dev server
- **Babel**: JavaScript transpiler
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Jest**: Testing framework

### DevOps
- **Docker**: Containerization
- **GitHub Actions**: CI/CD
- **Nginx**: Web server
- **PM2**: Process management

## 🚀 Getting Started

### Prerequisites

```bash
# Required
node >= 16.0.0
npm >= 8.0.0

# Optional
docker >= 20.0.0
postgresql >= 13.0
redis >= 6.0
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/dgrealtors/website.git
cd website
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Generate initial assets**
```bash
npm run setup
```

5. **Start development server**
```bash
npm run dev
```

6. **Open browser**
```
http://localhost:3000
```

### Quick Start with Docker

```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📁 Project Structure

```
dgrealtors-website/
├── 📄 Configuration Files
│   ├── .env.example          # Environment variables template
│   ├── .gitignore           # Git ignore rules
│   ├── package.json         # NPM dependencies and scripts
│   ├── vite.config.js       # Vite configuration
│   ├── postcss.config.js    # PostCSS configuration
│   ├── tailwind.config.js   # Tailwind CSS configuration
│   └── jsconfig.json        # JavaScript configuration
│
├── 📁 public/               # Static assets
│   ├── favicon.ico         # Favicon
│   ├── robots.txt          # Robots file
│   ├── sitemap.xml         # XML sitemap
│   ├── manifest.json       # PWA manifest
│   └── assets/            
│       ├── animations/     # Lottie animations
│       ├── icons/         # Icon assets
│       └── images/        # Static images
│
├── 📁 src/                 # Source code
│   ├── 📁 components/      # Reusable components
│   │   ├── Navigation.js   # Navigation bar
│   │   ├── Hero.js        # Hero section
│   │   ├── PropertyCard.js # Property card component
│   │   ├── ContactForm.js  # Contact form
│   │   └── Footer.js      # Footer component
│   │
│   ├── 📁 styles/         # Stylesheets
│   │   ├── main.css       # Main stylesheet
│   │   ├── variables.css  # CSS variables
│   │   ├── responsive.css # Responsive styles
│   │   └── animations.css # Animation styles
│   │
│   ├── 📁 scripts/        # JavaScript modules
│   │   ├── main.js        # Main entry point
│   │   ├── utils.js       # Utility functions
│   │   └── api.js         # API integration
│   │
│   ├── 📁 lib/           # Libraries
│   │   ├── particles.js   # Particle system
│   │   ├── smoothScroll.js # Smooth scrolling
│   │   └── formSubmission.js # Form handling
│   │
│   ├── 📁 pages/         # Page templates
│   │   ├── index.html    # Home page
│   │   ├── properties.html # Properties page
│   │   ├── about.html    # About page
│   │   └── contact.html  # Contact page
│   │
│   └── 📁 assets/        # Source assets
│       ├── images/       # Original images
│       ├── fonts/        # Custom fonts
│       └── data/         # JSON data files
│
├── 📁 scripts/           # Build & utility scripts
│   ├── build.sh         # Build script
│   ├── deploy.sh        # Deployment script
│   ├── optimize-images.js # Image optimization
│   └── generate-sitemap.js # Sitemap generator
│
├── 📁 tests/            # Test files
│   ├── unit/           # Unit tests
│   ├── integration/    # Integration tests
│   └── e2e/           # End-to-end tests
│
├── 📁 docs/            # Documentation
│   ├── API.md         # API documentation
│   ├── DEPLOYMENT.md  # Deployment guide
│   ├── CUSTOMIZATION.md # Customization guide
│   └── MAINTENANCE.md # Maintenance guide
│
└── 📁 dist/           # Production build (generated)
```

## 💻 Development

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e

# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run typecheck

# Analyze bundle
npm run analyze

# Generate documentation
npm run docs
```

### Code Style Guide

```javascript
// Use ES6+ features
const component = () => {
  const [state, setState] = useState(initialState);
  
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  return <div>Component</div>;
};

// Use async/await
const fetchData = async () => {
  try {
    const response = await api.get('/endpoint');
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Use meaningful variable names
const userAuthenticationToken = generateToken();
const isUserAuthenticated = checkAuth(userAuthenticationToken);

// Document complex functions
/**
 * Calculates property value appreciation
 * @param {number} initialValue - Initial property value
 * @param {number} years - Number of years
 * @param {number} rate - Annual appreciation rate
 * @returns {number} Appreciated value
 */
const calculateAppreciation = (initialValue, years, rate) => {
  return initialValue * Math.pow(1 + rate, years);
};
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/your-feature-name

# Create pull request on GitHub
```

### Commit Message Convention

```
feat: add new feature
fix: fix bug
docs: update documentation
style: format code
refactor: refactor code
test: add tests
chore: update dependencies
perf: improve performance
```

## 🚢 Deployment

### Production Build

```bash
# Build for production
npm run build

# Test production build
npm run preview

# Run production build
npm run start
```

### Deployment Options

#### 1. Static Hosting (Netlify/Vercel)

```bash
# Netlify
netlify deploy --prod

# Vercel
vercel --prod
```

#### 2. Traditional Server

```bash
# Build and deploy
npm run build
rsync -avz dist/ user@server:/var/www/dgrealtors

# Or use deployment script
./scripts/deploy.sh production
```

#### 3. Docker Deployment

```bash
# Build Docker image
docker build -t dgrealtors/website .

# Run container
docker run -d -p 80:80 dgrealtors/website

# Push to registry
docker push dgrealtors/website:latest
```

#### 4. AWS Deployment

```bash
# Deploy to S3 + CloudFront
npm run deploy:aws

# Or manually
aws s3 sync dist/ s3://dgrealtors-website --delete
aws cloudfront create-invalidation --distribution-id ABCDEF --paths "/*"
```

### Environment Variables

```bash
# Application
NODE_ENV=production
SITE_URL=https://dgrealtors.com
API_URL=https://api.dgrealtors.com

# Services
GOOGLE_ANALYTICS_ID=UA-XXXXXXXXX-X
SENTRY_DSN=https://xxx@sentry.io/xxx
HOTJAR_ID=XXXXXXX

# AWS
AWS_ACCESS_KEY_ID=XXXXXXXXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
AWS_REGION=us-east-1
AWS_S3_BUCKET=dgrealtors-assets

# Security
JWT_SECRET=your-secret-key
SESSION_SECRET=your-session-secret
```

## 📊 Performance

### Performance Metrics

- **Lighthouse Score**: 100/100
- **First Contentful Paint**: < 1.0s
- **Time to Interactive**: < 2.0s
- **Speed Index**: < 1.5s
- **Total Bundle Size**: < 200KB (gzipped)

### Optimization Techniques

1. **Code Splitting**: Dynamic imports for route-based splitting
2. **Image Optimization**: WebP/AVIF with fallbacks
3. **Critical CSS**: Inline critical CSS for fast initial render
4. **Resource Hints**: Preconnect, prefetch, preload
5. **Service Worker**: Offline support and caching
6. **CDN**: Global content delivery
7. **Compression**: Gzip/Brotli compression
8. **HTTP/2**: Multiplexed connections

### Performance Monitoring

```javascript
// Web Vitals monitoring
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to analytics
  gtag('event', metric.name, {
    value: Math.round(metric.value),
    event_category: 'Web Vitals',
    event_label: metric.id,
    non_interaction: true,
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

## 🔒 Security

### Security Features

- **HTTPS Enforcement**: SSL/TLS encryption
- **Content Security Policy**: XSS protection
- **CORS Configuration**: Cross-origin resource control
- **Input Sanitization**: SQL injection prevention
- **Rate Limiting**: DDoS protection
- **Security Headers**: HSTS, X-Frame-Options, etc.
- **Authentication**: JWT-based auth (if applicable)
- **OWASP Compliance**: Following security best practices

### Security Headers

```nginx
# Nginx security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass
- Keep pull requests focused and small

### Code Review Process

1. Automated tests must pass
2. Code review by maintainer
3. Approval required before merge
4. Squash and merge to main branch

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 DGrealtors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 📞 Contact

**DGrealtors**  
Your Trusted Real Estate Partner

- 🌐 Website: [https://dgrealtors.in](https://dgrealtors.com)
- 📧 Email: [info@dgrealtors.in](mailto:info@dgrealtors.com)
- 🏢 Address: Commercial District, Your City

### Support

- 📖 Documentation: [docs.dgrealtors.com](https://docs.dgrealtors.com)
- 🐛 Bug Reports: [GitHub Issues](https://github.com/dgrealtors/website/issues)
- 💡 Feature Requests: [GitHub Discussions](https://github.com/dgrealtors/website/discussions)
- 💬 Community: [Discord Server](https://discord.gg/dgrealtors)

---

<div align="center">
  Made with ❤️ by DGrealtors Team
  <br>
  © 2024 DGrealtors. All rights reserved.
</div>
```
