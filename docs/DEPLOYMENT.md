# DGrealtors Website Deployment Guide

## Table of Contents
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Local Development](#local-development)
- [Build Process](#build-process)
- [Deployment Strategies](#deployment-strategies)
- [Cloud Deployment](#cloud-deployment)
- [CI/CD Pipeline](#cicd-pipeline)
- [Performance Optimization](#performance-optimization)
- [Security Hardening](#security-hardening)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Rollback Procedures](#rollback-procedures)
- [Troubleshooting](#troubleshooting)

## Overview

This guide provides comprehensive deployment instructions for the DGrealtors website, covering various deployment scenarios from simple static hosting to enterprise-grade cloud infrastructure.

### Architecture Overview

┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │ Source Code │────▶│ Build Process │────▶│ Deployment │ │ (GitHub) │ │ (CI/CD) │ │ (CDN/Server) │ └─────────────────┘ └─────────────────┘ └─────────────────┘ │ │ │ ▼ ▼ ▼ Version Control Optimization Production

Git branches - Minification - CDN
Code review - Image processing - SSL/TLS
Automated tests - Asset bundling - Monitoring


## Prerequisites

### System Requirements

```bash
# Check Node.js version (requires 16.x or higher)
node --version

# Check npm version (requires 8.x or higher)
npm --version

# Check Git version
git --version

# Install required global packages
npm install -g npm@latest
npm install -g yarn@latest
npm install -g pm2@latest
npm install -g serve@latest

Required Accounts & Services
# Cloud Services
AWS:
  - Account ID: your-account-id
  - Region: us-east-1
  - Services: S3, CloudFront, Route53, Lambda@Edge

Cloudflare:
  - Account: your-account
  - Zone ID: your-zone-id
  - API Token: your-api-token

Monitoring:
  - Sentry DSN: https://xxx@sentry.io/xxx
  - Google Analytics: UA-XXXXXXXX-X
  - Uptime Robot: api-key

Domain:
  - Primary: dgrealtors.com
  - Subdomains: www, api, cdn, staging

API Keys & Environment Variables
# .env.production
NODE_ENV=production
SITE_URL=https://dgrealtors.com
API_URL=https://api.dgrealtors.com
CDN_URL=https://cdn.dgrealtors.com

# API Keys
GOOGLE_ANALYTICS_ID=UA-XXXXXXXXX-X
GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXX
SENTRY_DSN=https://xxxxxx@sentry.io/xxxxxx
HOTJAR_ID=XXXXXXX

# SMTP Configuration
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.XXXXXXXXXXXXXXXXX

# Security
JWT_SECRET=your-super-secret-jwt-key
CSRF_SECRET=your-csrf-secret-key
SESSION_SECRET=your-session-secret

# AWS Configuration
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=XXXXXXXXXXXXXXXXX
AWS_REGION=us-east-1
AWS_S3_BUCKET=dgrealtors-assets
AWS_CLOUDFRONT_DISTRIBUTION=EXXXXXXXXXX

# Database (if applicable)
DATABASE_URL=postgresql://user:pass@host:5432/dbname
REDIS_URL=redis://localhost:6379

Local Development
Development Setup

# Clone repository
git clone https://github.com/dgrealtors/website.git
cd website

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev

# Run with specific environment
NODE_ENV=staging npm run dev

# Run with debug mode
DEBUG=* npm run dev

Development Scripts
// package.json
{
  "scripts": {
    "dev": "vite --host --port 3000",
    "dev:staging": "cross-env NODE_ENV=staging vite",
    "dev:production": "cross-env NODE_ENV=production vite",
    "build": "npm run build:production",
    "build:staging": "cross-env NODE_ENV=staging vite build",
    "build:production": "cross-env NODE_ENV=production vite build",
    "preview": "vite preview",
    "test": "jest --coverage",
    "test:watch": "jest --watch",
    "lint": "eslint src --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint src --ext .js,.jsx,.ts,.tsx --fix",
    "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx,css,md}\"",
    "typecheck": "tsc --noEmit",
    "analyze": "vite build --mode analyze",
    "clean": "rm -rf dist node_modules package-lock.json"
  }
}

Pre-commit Hooks
// .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run linting
npm run lint

# Run tests
npm run test

# Check types
npm run typecheck

# Format code
npm run format

# Build size check
npm run size

Build Process
Build Configuration
// vite.config.js
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import imagemin from 'vite-plugin-imagemin';
import compress from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  
  return {
    base: env.VITE_BASE_URL || '/',
    
    plugins: [
      react(),
      
      // PWA Support
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
        manifest: {
          name: 'DGrealtors',
          short_name: 'DGR',
          theme_color: '#1e3a5f',
          icons: [
            {
              src: '/android-chrome-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/android-chrome-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      }),
      
      // Image optimization
      imagemin({
        gifsicle: { optimizationLevel: 7 },
        optipng: { optimizationLevel: 7 },
        mozjpeg: { quality: 80 },
        pngquant: { quality: [0.8, 0.9] },
        svgo: {
          plugins: [
            { name: 'removeViewBox', active: false },
            { name: 'removeEmptyAttrs', active: false }
          ]
        }
      }),
      
      // Compression
      compress({
        algorithm: 'gzip',
        ext: '.gz'
      }),
      compress({
        algorithm: 'brotliCompress',
        ext: '.br'
      }),
      
      // Bundle analyzer
      mode === 'analyze' && visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true
      })
    ],
    
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: mode === 'development',
      minify: mode === 'production' ? 'terser' : false,
      
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      },
      
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            utils: ['lodash', 'axios', 'date-fns']
          },
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.');
            const ext = info[info.length - 1];
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
              return `assets/images/[name]-[hash][extname]`;
            } else if (/css/i.test(ext)) {
              return `assets/css/[name]-[hash][extname]`;
            } else {
              return `assets/[name]-[hash][extname]`;
            }
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js'
        }
      },
      
      cssCodeSplit: true,
      reportCompressedSize: false,
      chunkSizeWarningLimit: 1000
    },
    
    optimizeDeps: {
      include: ['react', 'react-dom']
    },
    
    server: {
      host: true,
      port: 3000,
      strictPort: false,
      open: true,
      cors: true
    }
  };
});

Build Scripts
#!/bin/bash
# scripts/build.sh

echo "🏗️  Starting build process..."

# Set environment
export NODE_ENV=${1:-production}
echo "Building for: $NODE_ENV"

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist
rm -rf .cache

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --production=false

# Run tests
echo "🧪 Running tests..."
npm run test -- --passWithNoTests

# Type checking
echo "📝 Type checking..."
npm run typecheck

# Linting
echo "🔍 Linting code..."
npm run lint

# Build the project
echo "🔨 Building project..."
npm run build:$NODE_ENV

# Generate sitemap
echo "🗺️  Generating sitemap..."
npm run generate:sitemap

# Optimize images
echo "🖼️  Optimizing images..."
npm run optimize:images

# Generate critical CSS
echo "🎨 Generating critical CSS..."
npm run critical:css

# Build size report
echo "📊 Generating size report..."
npm run size

# Create deployment info
echo "{
  \"version\": \"$(git rev-parse HEAD)\",
  \"branch\": \"$(git rev-parse --abbrev-ref HEAD)\",
  \"buildDate\": \"$(date -u +\"%Y-%m-%dT%H:%M:%SZ\")\",
  \"environment\": \"$NODE_ENV\"
}" > dist/build-info.json

echo "✅ Build complete!"

Post-Build Optimization
// scripts/post-build.js
const fs = require('fs-extra');
const path = require('path');
const { minify } = require('html-minifier-terser');
const critical = require('critical');
const workboxBuild = require('workbox-build');

async function postBuild() {
  console.log('🔧 Running post-build optimizations...');
  
  // Minify HTML files
  const htmlFiles = await fs.readdir('dist').then(files => 
    files.filter(file => file.endsWith('.html'))
  );
  
  for (const file of htmlFiles) {
    const filePath = path.join('dist', file);
    const html = await fs.readFile(filePath, 'utf8');
    const minified = await minify(html, {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true,
      minifyCSS: true,
      minifyJS: true
    });
    
    await fs.writeFile(filePath, minified);
    console.log(`✅ Minified ${file}`);
  }
  
  // Generate critical CSS
  await critical.generate({
    inline: true,
    base: 'dist',
    src: 'index.html',
    target: 'index.html',
    width: 1300,
    height: 900,
    penthouse: {
      blockJSRequests: false
    }
  });
  
  // Generate service worker
  const { count, size, warnings } = await workboxBuild.generateSW({
    globDirectory: 'dist',
    globPatterns: [
      '**/*.{html,js,css,png,jpg,jpeg,gif,svg,woff,woff2,ttf,eot}'
    ],
    swDest: 'dist/sw.js',
    clientsClaim: true,
    skipWaiting: true,
    runtimeCaching: [{
      urlPattern: /^https:\/\/fonts\.(gstatic|googleapis)\.com/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
        }
      }
    }]
  });
  
  console.log(`✅ Generated service worker (${count} files, ${size} bytes)`);
  
  // Create security headers file
  const headers = `/*
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com;

/*.js
  Cache-Control: public, max-age=31536000, immutable

/*.css
  Cache-Control: public, max-age=31536000, immutable

/*.jpg
  Cache-Control: public, max-age=31536000, immutable

/*.png
  Cache-Control: public, max-age=31536000, immutable

/*.svg
  Cache-Control: public, max-age=31536000, immutable

/index.html
  Cache-Control: no-cache, no-store, must-revalidate

/sw.js
  Cache-Control: no-cache, no-store, must-revalidate`;
  
  await fs.writeFile('dist/_headers', headers);
  console.log('✅ Created security headers');
  
  // Create redirects file
  const redirects = `# Redirects
/home              /                   301
/properties.html   /properties         301
/about-us          /about              301

# Force HTTPS
http://dgrealtors.com/*      https://dgrealtors.com/:splat      301!
http://www.dgrealtors.com/*   https://www.dgrealtors.com/:splat   301!

# Remove trailing slashes
/*/   /:splat   301`;
  
  await fs.writeFile('dist/_redirects', redirects);
  console.log('✅ Created redirects');
}

postBuild().catch(console.error);


Deployment Strategies
Static Site Deployment
Netlify Deployment
# netlify.toml
[build]
  command = "npm run build"
  functions = "netlify/functions"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"

[[plugins]]
  package = "@netlify/plugin-lighthouse"
  
  [plugins.inputs]
    performance = 0.9
    accessibility = 0.9
    best-practices = 0.9
    seo = 0.9

[[plugins]]
  package = "netlify-plugin-submit-sitemap"
  
  [plugins.inputs]
    baseUrl = "https://dgrealtors.com"
    sitemapPath = "/sitemap.xml"
    providers = ["google", "bing"]

[[headers]]
  for = "/*"
  
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;"

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.jpg"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.png"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

Vercel Deployment
// vercel.json
{
  "version": 2,
  "name": "dgrealtors",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/assets/(.*)",
      "headers": {
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    },
    {
      "src": "/sw.js",
      "headers": {
        "Cache-Control": "no-cache, no-store, must-revalidate"
      }
    },
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://api.dgrealtors.in/:path*"
    }
  ]
}

Server Deployment
Node.js Server
// server.js
const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://www.googletagmanager.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.dgrealtors.com"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Compression
app.use(compression());

// CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['https://dgrealtors.com'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);

// Static files with caching
app.use(express.static('dist', {
  maxAge: '1y',
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
  }
}));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// API proxy (optional)
app.use('/api', require('./api-proxy'));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

PM2 Configuration
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'dgrealtors',
    script: './server.js',
    instances: 'max',
    exec_mode: 'cluster',
    watch: false,
    max_memory_restart: '1G',
    
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    
    // Graceful restart
    kill_timeout: 5000,
    wait_ready: true,
    listen_timeout: 10000,
    
    // Auto restart
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    
    // Monitoring
    monitoring: true,
    
    // Post deploy
    post_deploy: 'npm install && npm run build && pm2 reload ecosystem.config.js'
  }],
  
  deploy: {
    production: {
      user: 'deploy',
      host: ['server1.dgrealtors.com', 'server2.dgrealtors.com'],
      ref: 'origin/main',
      repo: 'git@github.com:dgrealtors/website.git',
      path: '/var/www/dgrealtors',
      'pre-deploy': 'git pull',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': 'apt-get install git nodejs npm'
    },
    staging: {
      user: 'deploy',
      host: 'staging.dgrealtors.com',
      ref: 'origin/staging',
      repo: 'git@github.com:dgrealtors/website.git',
      path: '/var/www/dgrealtors-staging',
      'post-deploy': 'npm install && npm run build:staging && pm2 reload ecosystem.config.js --env staging'
    }
  }
};

Cloud Deployment
AWS S3 + CloudFront
#!/bin/bash
# scripts/deploy-aws.sh

set -e

echo "🚀 Deploying to AWS..."

# Configuration
S3_BUCKET="dgrealtors-website"
CLOUDFRONT_DISTRIBUTION_ID="E1XXXXXXXXXX"
AWS_PROFILE="dgrealtors-prod"

# Build the project
echo "📦 Building project..."
npm run build

# Sync to S3
echo "📤 Uploading to S3..."
aws s3 sync dist/ s3://$S3_BUCKET \
  --profile $AWS_PROFILE \
  --delete \
  --cache-control "public, max-age=31536000" \
  --exclude "*.html" \
  --exclude "sw.js" \
  --exclude "manifest.json"

# Upload HTML files with no-cache
aws s3 sync dist/ s3://$S3_BUCKET \
  --profile $AWS_PROFILE \
  --cache-control "no-cache, no-store, must-revalidate" \
  --content-type "text/html" \
  --metadata-directive REPLACE \
  --include "*.html"

# Upload service worker with no-cache
aws s3 cp dist/sw.js s3://$S3_BUCKET/sw.js \
  --profile $AWS_PROFILE \
  --cache-control "no-cache, no-store, must-revalidate" \
  --content-type "application/javascript"

# Invalidate CloudFront cache
echo "🔄 Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --profile $AWS_PROFILE \
  --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
  --paths "/*"

echo "✅ Deployment complete!"

CloudFormation Template
# cloudformation/website-stack.yml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'DGrealtors Website Infrastructure'

Parameters:
  DomainName:
    Type: String
    Default: dgrealtors.com
    Description: The domain name for the website
  
  CertificateArn:
    Type: String
    Description: ACM Certificate ARN for HTTPS

Resources:
  # S3 Bucket for website hosting
  WebsiteBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub '${DomainName}-website'
      WebsiteConfiguration:
        IndexDocument: index.html
        ErrorDocument: error.html
      PublicAccessBlockConfiguration:
        BlockPublicAcls: false
        BlockPublicPolicy: false
        IgnorePublicAcls: false
        RestrictPublicBuckets: false
      BucketEncryption:
        ServerSideEncryptionConfiguration:
          - ServerSideEncryptionByDefault:
              SSEAlgorithm: AES256
      LifecycleConfiguration:
        Rules:
          - Id: DeleteOldVersions
            NoncurrentVersionExpirationInDays: 30
            Status: Enabled
      VersioningConfiguration:
        Status: Enabled
      Tags:
        - Key: Name
          Value: !Sub '${DomainName} Website'
        - Key: Environment
          Value: production

  # S3 Bucket Policy
  WebsiteBucketPolicy:
    Type: AWS::S3::BucketPolicy
    Properties:
      Bucket: !Ref WebsiteBucket
      PolicyDocument:
        Statement:
          - Sid: PublicReadGetObject
            Effect: Allow
            Principal: '*'
            Action: 's3:GetObject'
            Resource: !Sub '${WebsiteBucket.Arn}/*'

  # CloudFront Distribution
  CloudFrontDistribution:
    Type: AWS::CloudFront::Distribution
    Properties:
      DistributionConfig:
        Origins:
          - Id: S3Origin
            DomainName: !GetAtt WebsiteBucket.RegionalDomainName
            S3OriginConfig:
              OriginAccessIdentity: ''
        
        Enabled: true
        DefaultRootObject: index.html
        
        Aliases:
          - !Ref DomainName
          - !Sub 'www.${DomainName}'
        
        ViewerCertificate:
          AcmCertificateArn: !Ref CertificateArn
          MinimumProtocolVersion: TLSv1.2_2021
          SslSupportMethod: sni-only
        
        DefaultCacheBehavior:
          AllowedMethods:
            - GET
            - HEAD
            - OPTIONS
          TargetOriginId: S3Origin
          ViewerProtocolPolicy: redirect-to-https
          Compress: true
          
          ForwardedValues:
            QueryString: false
            Cookies:
              Forward: none
          
          ResponseHeadersPolicyId: !Ref ResponseHeadersPolicy
        
        CacheBehaviors:
          - PathPattern: '*.js'
            TargetOriginId: S3Origin
            ViewerProtocolPolicy: redirect-to-https
            AllowedMethods:
              - GET
              - HEAD
            Compress: true
            DefaultTTL: 31536000
            MaxTTL: 31536000
            MinTTL: 31536000
            ForwardedValues:
              QueryString: false
              Cookies:
                Forward: none
          
          - PathPattern: '*.css'
            TargetOriginId: S3Origin
            ViewerProtocolPolicy: redirect-to-https
            AllowedMethods:
              - GET
              - HEAD
            Compress: true
            DefaultTTL: 31536000
            MaxTTL: 31536000
            MinTTL: 31536000
            ForwardedValues:
              QueryString: false
              Cookies:
                Forward: none
        
        Comment: !Sub 'CloudFront distribution for ${DomainName}'
        
        HttpVersion: http2and3
        IPV6Enabled: true
        
        CustomErrorResponses:
          - ErrorCode: 404
            ResponsePagePath: /404.html
            ResponseCode: 404
            ErrorCachingMinTTL: 300
          - ErrorCode: 403
            ResponsePagePath: /index.html
            ResponseCode: 200
            ErrorCachingMinTTL: 0
        
        PriceClass: PriceClass_All
        
        Tags:
          - Key: Name
            Value: !Sub '${DomainName} CloudFront'
          - Key: Environment
            Value: production

  # Response Headers Policy
  ResponseHeadersPolicy:
    Type: AWS::CloudFront::ResponseHeadersPolicy
    Properties:
      ResponseHeadersPolicyConfig:
        Name: !Sub '${DomainName}-security-headers'
        
        SecurityHeadersConfig:
          XSSProtection:
            Override: true
            Protection: true
            ModeBlock: true
          
          ContentTypeOptions:
            Override: true
          
          ReferrerPolicy:
            Override: true
            ReferrerPolicy: strict-origin-when-cross-origin
          
          FrameOptions:
            Override: true
            FrameOption: SAMEORIGIN
          
          StrictTransportSecurity:
            Override: true
            IncludeSubDomains: true
            Preload: true
            AccessControlMaxAgeSec: 63072000
          
          ContentSecurityPolicy:
            Override: true
            ContentSecurityPolicy: "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:;"

  # Route53 Records
  WebsiteRecord:
    Type: AWS::Route53::RecordSetGroup
    Properties:
      HostedZoneName: !Sub '${DomainName}.'
      RecordSets:
        - Name: !Ref DomainName
          Type: A
          AliasTarget:
            DNSName: !GetAtt CloudFrontDistribution.DomainName
            HostedZoneId: Z2FDTNDATAQYW2 # CloudFront Hosted Zone ID
        
        - Name: !Sub 'www.${DomainName}'
          Type: A
          AliasTarget:
            DNSName: !GetAtt CloudFrontDistribution.DomainName
            HostedZoneId: Z2FDTNDATAQYW2

Outputs:
  WebsiteURL:
    Description: Website URL
    Value: !Sub 'https://${DomainName}'
  
  CloudFrontDistributionId:
    Description: CloudFront Distribution ID
    Value: !Ref CloudFrontDistribution
  
  S3BucketName:
    Description: S3 Bucket Name
    Value: !Ref WebsiteBucket

Docker Deployment
# Dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Copy source files
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

# nginx.conf
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    
    access_log /var/log/nginx/access.log main;
    
    # Performance
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 20M;
    
    # Gzip compression
    gzip on;
    gzip_disable "msie6";
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript 
               application/json application/javascript application/xml+rss 
               application/rss+xml application/atom+xml
               image/svg+xml;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
    
    # Hide nginx version
    server_tokens off;
    
    server {
        listen 80;
        listen [::]:80;
        server_name localhost;
        
        root /usr/share/nginx/html;
        index index.html;
        
        # Security headers for all responses
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
        add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:;" always;
        
        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
        
        # Static assets with long cache
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            access_log off;
        }
        
        # HTML files with no cache
        location ~* \.html$ {
            add_header Cache-Control "no-cache, no-store, must-revalidate";
            add_header Pragma "no-cache";
            add_header Expires "0";
        }
        
        # Service worker with no cache
        location = /sw.js {
            add_header Cache-Control "no-cache, no-store, must-revalidate";
            add_header Pragma "no-cache";
            add_header Expires "0";
        }
        
        # SPA fallback
        location / {
            try_files $uri $uri/ /index.html;
        }
        
        # API proxy (if needed)
        location /api/ {
            proxy_pass https://api.dgrealtors.com/;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}

Kubernetes Deployment
# k8s/namespace.yml
apiVersion: v1
kind: Namespace
metadata:
  name: dgrealtors
  labels:
    name: dgrealtors
    environment: production

# k8s/deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: dgrealtors-website
  namespace: dgrealtors
  labels:
    app: dgrealtors-website
    environment: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: dgrealtors-website
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    metadata:
      labels:
        app: dgrealtors-website
        version: "1.0.0"
    spec:
      containers:
      - name: website
        image: dgrealtors/website:latest
        imagePullPolicy: Always
        ports:
        - containerPort: 80
          name: http
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 500m
            memory: 512Mi
        livenessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3
        env:
        - name: NODE_ENV
          value: "production"
        - name: API_URL
          valueFrom:
            configMapKeyRef:
              name: dgrealtors-config
              key: api_url
        volumeMounts:
        - name: config
          mountPath: /usr/share/nginx/html/config
          readOnly: true
      volumes:
      - name: config
        configMap:
          name: dgrealtors-config
      imagePullSecrets:
      - name: regcred

# k8s/service.yml
apiVersion: v1
kind: Service
metadata:
  name: dgrealtors-website
  namespace: dgrealtors
  labels:
    app: dgrealtors-website
spec:
  type: ClusterIP
  ports:
  - port: 80
    targetPort: 80
    protocol: TCP
    name: http
  selector:
    app: dgrealtors-website

# k8s/ingress.yml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: dgrealtors-website
  namespace: dgrealtors
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
    nginx.ingress.kubernetes.io/proxy-body-size: "20m"
    nginx.ingress.kubernetes.io/rate-limit: "100"
    nginx.ingress.kubernetes.io/configuration-snippet: |
      more_set_headers "X-Frame-Options: SAMEORIGIN";
      more_set_headers "X-Content-Type-Options: nosniff";
      more_set_headers "X-XSS-Protection: 1; mode=block";
      more_set_headers "Referrer-Policy: strict-origin-when-cross-origin";
spec:
  tls:
  - hosts:
    - dgrealtors.in
    - www.dgrealtors.in
    secretName: dgrealtors-tls
  rules:
  - host: dgrealtors.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: dgrealtors-website
            port:
              number: 80
  - host: www.dgrealtors.in
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: dgrealtors-website
            port:
              number: 80

# k8s/configmap.yml
apiVersion: v1
kind: ConfigMap
metadata:
  name: dgrealtors-config
  namespace: dgrealtors
data:
  api_url: "https://api.dgrealtors.in"
  cdn_url: "https://cdn.dgrealtors.in"
  google_analytics_id: "UA-XXXXXXXXX-X"
  environment: "production"

# k8s/hpa.yml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: dgrealtors-website
  namespace: dgrealtors
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: dgrealtors-website
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 10
        periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 30
      policies:
      - type: Percent
        value: 100
        periodSeconds: 30
      - type: Pods
        value: 2
        periodSeconds: 60

CI/CD Pipeline
GitHub Actions
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches:
      - main
  workflow_dispatch:

env:
  NODE_VERSION: '18'
  AWS_REGION: 'us-east-1'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run type check
        run: npm run typecheck
      
      - name: Run tests
        run: npm run test -- --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build project
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.API_URL }}
          VITE_GA_ID: ${{ secrets.GA_ID }}
      
      - name: Generate sitemap
        run: npm run generate:sitemap
      
      - name: Optimize images
        run: npm run optimize:images
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/
          retention-days: 7

  deploy-s3:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      
      - name: Download artifacts
        uses: actions/download-artifact@v3
        with:
          name: dist
          path: dist/
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}
      
      - name: Deploy to S3
        run: |
          aws s3 sync dist/ s3://${{ secrets.S3_BUCKET }} \
            --delete \
            --cache-control "public, max-age=31536000" \
            --exclude "*.html" \
            --exclude "sw.js"
          
          aws s3 sync dist/ s3://${{ secrets.S3_BUCKET }} \
            --cache-control "no-cache, no-store, must-revalidate" \
            --content-type "text/html" \
            --metadata-directive REPLACE \
            --exclude "*" \
            --include "*.html"
      
      - name: Invalidate CloudFront
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} \
            --paths "/*"

  deploy-docker:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      
      - name: Download artifacts
        uses: actions/download-artifact@v3
        with:
          name: dist
          path: dist/
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      
      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      
      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: |
            dgrealtors/website:latest
            dgrealtors/website:${{ github.sha }}
          cache-from: type=registry,ref=dgrealtors/website:buildcache
          cache-to: type=registry,ref=dgrealtors/website:buildcache,mode=max

  lighthouse:
    needs: deploy-s3
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run Lighthouse
        uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            https://dgrealtors.com
            https://dgrealtors.com/properties
            https://dgrealtors.com/contact
          uploadArtifacts: true
          temporaryPublicStorage: true
          runs: 3

  notify:
    needs: [deploy-s3, deploy-docker]
    runs-on: ubuntu-latest
    if: always()
    steps:
      - name: Send notification
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: |
            Deployment ${{ job.status }}
            Branch: ${{ github.ref }}
            Commit: ${{ github.sha }}
            Author: ${{ github.actor }}
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
        if: always()

GitLab CI/CD
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy
  - verify

variables:
  NODE_VERSION: "18"
  DOCKER_DRIVER: overlay2
  DOCKER_TLS_CERTDIR: "/certs"

.node_template: &node_template
  image: node:${NODE_VERSION}-alpine
  before_script:
    - npm ci --cache .npm --prefer-offline
  cache:
    key: ${CI_COMMIT_REF_SLUG}
    paths:
      - .npm/
      - node_modules/

test:lint:
  <<: *node_template
  stage: test
  script:
    - npm run lint
  only:
    - merge_requests
    - main

test:type-check:
  <<: *node_template
  stage: test
  script:
    - npm run typecheck
  only:
    - merge_requests
    - main

test:unit:
  <<: *node_template
  stage: test
  script:
    - npm run test -- --coverage
  coverage: '/Lines\s*:\s*([0-9.]+)%/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/coberatura-coverage.xml
  only:
    - merge_requests
    - main

build:website:
  <<: *node_template
  stage: build
  script:
    - npm run build
    - npm run generate:sitemap
  artifacts:
    paths:
      - dist/
    expire_in: 1 week
  only:
    - main
    - staging

build:docker:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker tag $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA $CI_REGISTRY_IMAGE:latest
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
    - docker push $CI_REGISTRY_IMAGE:latest
  only:
    - main

deploy:staging:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache curl
  script:
    - curl -X POST $STAGING_WEBHOOK_URL
  environment:
    name: staging
    url: https://staging.dgrealtors.com
  only:
    - staging

deploy:production:
  stage: deploy
  image: 
    name: amazon/aws-cli:latest
    entrypoint: [""]
  script:
    - aws s3 sync dist/ s3://$S3_BUCKET --delete
    - aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_ID --paths "/*"
  environment:
    name: production
    url: https://dgrealtors.com
  only:
    - main
  when: manual

verify:lighthouse:
  stage: verify
  image: cypress/browsers:node16.14.2-slim-chrome103-ff102
  script:
    - npm install -g @lhci/cli
    - lhci autorun
  artifacts:
    paths:
      - .lighthouseci/
    reports:
      performance: .lighthouseci/lhr-*.json
  only:
    - main

Performance Optimization
CDN Configuration
// cdn-config.js
module.exports = {
  // Cloudflare Workers script
  addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
  });

  async function handleRequest(request) {
    const url = new URL(request.url);
    
    // Add security headers
    const securityHeaders = {
      'X-Frame-Options': 'SAMEORIGIN',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
    };
    
    // Cache configuration
    const cacheConfig = {
      '.html': { cache: 'no-store', headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' } },
      '.js': { cache: '1 year', headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } },
      '.css': { cache: '1 year', headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } },
      '.jpg': { cache: '1 year', headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } },
      '.png': { cache: '1 year', headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } },
      '.svg': { cache: '1 year', headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } },
      '.woff2': { cache: '1 year', headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } }
    };
    
    // Get file extension
    const ext = '.' + url.pathname.split('.').pop();
    const config = cacheConfig[ext] || { cache: '1 hour', headers: {} };
    
    // Fetch from origin
    const response = await fetch(request, {
      cf: {
        cacheTtl: config.cache === 'no-store' ? 0 : 31536000,
        cacheEverything: config.cache !== 'no-store'
      }
    });
    
    // Clone response to modify headers
    const newResponse = new Response(response.body, response);
    
    // Add headers
    Object.entries(securityHeaders).forEach(([key, value]) => {
      newResponse.headers.set(key, value);
    });
    
    Object.entries(config.headers).forEach(([key, value]) => {
      newResponse.headers.set(key, value);
    });
    
    return newResponse;
  }
};

Performance Monitoring
// monitoring/performance.js
class PerformanceMonitor {
  constructor(config = {}) {
    this.config = {
      sampleRate: config.sampleRate || 1,
      endpoint: config.endpoint || '/api/metrics',
      bufferSize: config.bufferSize || 10,
      flushInterval: config.flushInterval || 5000
    };
    
    this.buffer = [];
    this.init();
  }
  
  init() {
    // Web Vitals
    if ('web-vital' in window) {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(this.sendMetric.bind(this));
        getFID(this.sendMetric.bind(this));
        getFCP(this.sendMetric.bind(this));
        getLCP(this.sendMetric.bind(this));
        getTTFB(this.sendMetric.bind(this));
      });
    }
    
    // Navigation timing
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0];
          
          this.sendMetric({
            name: 'navigation',
            value: navigation.loadEventEnd - navigation.fetchStart,
            entries: [navigation]
          });
          
          // Resource timing
          const resources = performance.getEntriesByType('resource');
          const resourceMetrics = this.aggregateResources(resources);
          
          Object.entries(resourceMetrics).forEach(([type, data]) => {
            this.sendMetric({
              name: `resource_${type}`,
              value: data.averageDuration,
              entries: data.entries
            });
          });
        }, 0);
      });
    }
    
    // Long tasks
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.sendMetric({
              name: 'long_task',
              value: entry.duration,
              entries: [entry]
            });
          }
        });
        
        observer.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        // Long task observer not supported
      }
    }
    
    // First input delay polyfill
    this.trackFirstInputDelay();
    
    // Set up flush interval
    setInterval(() => this.flush(), this.config.flushInterval);
    
    // Flush on page unload
    window.addEventListener('beforeunload', () => this.flush());
  }
  
  sendMetric(metric) {
    // Sample rate check
    if (Math.random() > this.config.sampleRate) return;
    
    const enrichedMetric = {
      ...metric,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      connection: navigator.connection ? {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt
      } : null,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
    
    this.buffer.push(enrichedMetric);
    
    if (this.buffer.length >= this.config.bufferSize) {
      this.flush();
    }
  }
  
  flush() {
    if (this.buffer.length === 0) return;
    
    const metrics = [...this.buffer];
    this.buffer = [];
    
    // Use sendBeacon if available
    if ('sendBeacon' in navigator) {
      navigator.sendBeacon(this.config.endpoint, JSON.stringify(metrics));
    } else {
      // Fallback to fetch
      fetch(this.config.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metrics),
        keepalive: true
      }).catch(() => {
        // Silent fail
      });
    }
  }
  
  aggregateResources(resources) {
    const grouped = {};
    
    resources.forEach(resource => {
      const type = this.getResourceType(resource);
      
      if (!grouped[type]) {
        grouped[type] = {
          count: 0,
          totalDuration: 0,
          totalSize: 0,
          entries: []
        };
      }
      
      grouped[type].count++;
      grouped[type].totalDuration += resource.duration;
      grouped[type].totalSize += resource.transferSize || 0;
      grouped[type].entries.push(resource);
    });
    
    // Calculate averages
    Object.keys(grouped).forEach(type => {
      grouped[type].averageDuration = grouped[type].totalDuration / grouped[type].count;
      grouped[type].averageSize = grouped[type].totalSize / grouped[type].count;
    });
    
    return grouped;
  }
  
  getResourceType(resource) {
    const url = resource.name;
    
    if (/\.(jpg|jpeg|png|gif|svg|webp|ico)$/i.test(url)) return 'image';
    if (/\.(js)$/i.test(url)) return 'script';
    if (/\.(css)$/i.test(url)) return 'stylesheet';
    if (/\.(woff|woff2|ttf|eot|otf)$/i.test(url)) return 'font';
    if (/\/(api|graphql)\//.test(url)) return 'api';
    
    return 'other';
  }
  
  trackFirstInputDelay() {
    let firstInputDelay = null;
    let firstInputTimeStamp = null;
    
    const reportFirstInputDelay = (delay, event) => {
      if (firstInputDelay === null) {
        firstInputDelay = delay;
        firstInputTimeStamp = event.timeStamp;
        
        this.sendMetric({
          name: 'first_input_delay',
          value: firstInputDelay,
          entries: [{
            startTime: firstInputTimeStamp,
            duration: firstInputDelay
          }]
        });
      }
    };
    
    const eachEventType = ['click', 'mousedown', 'keydown', 'touchstart', 'pointerdown'];
    
    eachEventType.forEach(type => {
      window.addEventListener(type, (event) => {
        const now = performance.now();
        const delay = now - event.timeStamp;
        
        reportFirstInputDelay(delay, event);
      }, { once: true, capture: true });
    });
  }
}

// Initialize performance monitoring
const monitor = new PerformanceMonitor({
  sampleRate: 0.1, // Sample 10% of users
  endpoint: '/api/metrics',
  bufferSize: 20,
  flushInterval: 10000
});

Security Hardening
Security Headers
// security/headers.js
module.exports = {
  // Content Security Policy
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://www.googletagmanager.com",
        "https://www.google-analytics.com",
        "https://js.stripe.com"
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com"
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com"
      ],
      imgSrc: [
        "'self'",
        "data:",
        "https:",
        "https://www.google-analytics.com",
        "https://stats.g.doubleclick.net"
      ],
      connectSrc: [
        "'self'",
        "https://api.dgrealtors.com",
        "https://www.google-analytics.com",
        "https://stats.g.doubleclick.net"
      ],
      frameSrc: [
        "'self'",
        "https://www.youtube.com",
        "https://js.stripe.com"
      ],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  
  // Strict Transport Security
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  
  // Other security headers
  xFrameOptions: 'SAMEORIGIN',
  xContentTypeOptions: 'nosniff',
  xXssProtection: '1; mode=block',
  referrerPolicy: 'strict-origin-when-cross-origin',
  
  // Permissions Policy
  permissionsPolicy: {
    features: {
      camera: ["'none'"],
      microphone: ["'none'"],
      geolocation: ["'self'"],
      payment: ["'self'", "https://js.stripe.com"]
    }
  }
};

SSL/TLS Configuration
# nginx SSL configuration
ssl_certificate /etc/letsencrypt/live/dgrealtors.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/dgrealtors.com/privkey.pem;

# Modern SSL configuration
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
ssl_prefer_server_ciphers off;

# OCSP stapling
ssl_stapling on;
ssl_stapling_verify on;
ssl_trusted_certificate /etc/letsencrypt/live/dgrealtors.com/chain.pem;
resolver 8.8.8.8 8.8.4.4 valid=300s;
resolver_timeout 5s;

# SSL session caching
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 1d;
ssl_session_tickets off;

# HSTS
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;

WAF Rules
// waf-rules.js
module.exports = {
  rules: [
    // SQL Injection Protection
    {
      id: 'sql-injection',
      pattern: /(\b(union|select|insert|update|delete|drop|create)\b.*\b(from|where|table)\b|\b(or|and)\b.*=.*)/i,
      action: 'block',
      score: 10
    },
    
    // XSS Protection
    {
      id: 'xss-script',
      pattern: /<script[^>]*>.*?<\/script>/gi,
      action: 'block',
      score: 10
    },
    
    // Path Traversal
    {
      id: 'path-traversal',
      pattern: /\.\.[\/\\$/,
      action: 'block',
      score: 8
    },
    
    // Command Injection
    {
      id: 'command-injection',
      pattern: /[;&|]{2}|[;&|]\s*\w+/,
      action: 'block',
      score: 9
    },
    
    // File Upload Protection
    {
      id: 'malicious-upload',
      pattern: /\.(exe|sh|bat|cmd|com|pif|scr|vbs|js|jar|zip|rar)$/i,
      action: 'block',
      score: 7
    },
    
    // Rate Limiting
    {
      id: 'rate-limit',
      type: 'rate',
      threshold: 100,
      window: 60,
      action: 'throttle'
    }
  ],
  
  // IP Whitelist
  whitelist: [
    '10.0.0.0/8',
    '172.16.0.0/12',
    '192.168.0.0/16'
  ],
  
  // IP Blacklist
  blacklist: [],
  
  // Geographic restrictions
  geoBlocking: {
    enabled: false,
    allowedCountries: ['US', 'CA', 'GB', 'AU']
  }
};

Monitoring & Maintenance
Health Checks
// health-check.js
const healthCheck = {
  // Basic health check
  basic: async (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.APP_VERSION || 'unknown'
    });
  },
  
  // Detailed health check
  detailed: async (req, res) => {
    const checks = await Promise.allSettled([
      checkDatabase(),
      checkRedis(),
      checkAPI(),
      checkStorage(),
      checkCDN()
    ]);
    
    const results = {
      status: checks.every(c => c.status === 'fulfilled') ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      version: process.env.APP_VERSION || 'unknown',
      checks: {
        database: checks[0].status === 'fulfilled' ? 'healthy' : 'unhealthy',
        redis: checks[1].status === 'fulfilled' ? 'healthy' : 'unhealthy',
        api: checks[2].status === 'fulfilled' ? 'healthy' : 'unhealthy',
        storage: checks[3].status === 'fulfilled' ? 'healthy' : 'unhealthy',
        cdn: checks[4].status === 'fulfilled' ? 'healthy' : 'unhealthy'
      },
      metrics: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage()
      }
    };
    
    res.status(results.status === 'healthy' ? 200 : 503).json(results);
  }
};

async function checkDatabase() {
  // Database connectivity check
  return new Promise((resolve, reject) => {
    // Implementation depends on your database
    resolve(true);
  });
}

async function checkRedis() {
  // Redis connectivity check
  return new Promise((resolve, reject) => {
    // Implementation depends on your Redis setup
    resolve(true);
  });
}

async function checkAPI() {
  // API endpoint check
  const response = await fetch(`${process.env.API_URL}/health`);
  if (!response.ok) throw new Error('API unhealthy');
  return true;
}

async function checkStorage() {
  // S3/Storage check
  return new Promise((resolve, reject) => {
    // Implementation depends on your storage
    resolve(true);
  });
}

async function checkCDN() {
  // CDN check
  const response = await fetch(`${process.env.CDN_URL}/health.txt`);
  if (!response.ok) throw new Error('CDN unhealthy');
  return true;
}

// health-check.js
const healthCheck = {
  // Basic health check
  basic: async (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.APP_VERSION || 'unknown'
    });
  },
  
  // Detailed health check
  detailed: async (req, res) => {
    const checks = await Promise.allSettled([
      checkDatabase(),
      checkRedis(),
      checkAPI(),
      checkStorage(),
      checkCDN()
    ]);
    
    const results = {
      status: checks.every(c => c.status === 'fulfilled') ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      version: process.env.APP_VERSION || 'unknown',
      checks: {
        database: checks[0].status === 'fulfilled' ? 'healthy' : 'unhealthy',
        redis: checks[1].status === 'fulfilled' ? 'healthy' : 'unhealthy',
        api: checks[2].status === 'fulfilled' ? 'healthy' : 'unhealthy',
        storage: checks[3].status === 'fulfilled' ? 'healthy' : 'unhealthy',
        cdn: checks[4].status === 'fulfilled' ? 'healthy' : 'unhealthy'
      },
      metrics: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage()
      }
    };
    
    res.status(results.status === 'healthy' ? 200 : 503).json(results);
  }
};

async function checkDatabase() {
  // Database connectivity check
  return new Promise((resolve, reject) => {
    // Implementation depends on your database
    resolve(true);
  });
}

async function checkRedis() {
  // Redis connectivity check
  return new Promise((resolve, reject) => {
    // Implementation depends on your Redis setup
    resolve(true);
  });
}

async function checkAPI() {
  // API endpoint check
  const response = await fetch(`${process.env.API_URL}/health`);
  if (!response.ok) throw new Error('API unhealthy');
  return true;
}

async function checkStorage() {
  // S3/Storage check
  return new Promise((resolve, reject) => {
    // Implementation depends on your storage
    resolve(true);
  });
}

async function checkCDN() {
  // CDN check
  const response = await fetch(`${process.env.CDN_URL}/health.txt`);
  if (!response.ok) throw new Error('CDN unhealthy');
  return true;
}

Monitoring Setup
# docker-compose.monitoring.yml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--storage.tsdb.retention.time=30d'
    ports:
      - 9090:9090
    
  grafana:
    image: grafana/grafana:latest
    volumes:
      - grafana_data:/var/lib/grafana
      - ./grafana/provisioning:/etc/grafana/provisioning
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=secure_password
      - GF_USERS_ALLOW_SIGN_UP=false
    ports:
      - 3001:3000
    
  node_exporter:
    image: prom/node-exporter:latest
    container_name: node_exporter
    restart: unless-stopped
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.rootfs=/rootfs'
      - '--path.sysfs=/host/sys'
      - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'
    ports:
      - 9100:9100
    
  alertmanager:
    image: prom/alertmanager:latest
    volumes:
      - ./alertmanager.yml:/etc/alertmanager/alertmanager.yml
    command:
      - '--config.file=/etc/alertmanager/alertmanager.yml'
      - '--storage.path=/alertmanager'
    ports:
      - 9093:9093

volumes:
  prometheus_data:
  grafana_data:

Backup Strategy
#!/bin/bash
# backup.sh

set -e

# Configuration
BACKUP_DIR="/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
S3_BUCKET="dgrealtors-backups"
RETENTION_DAYS=30

echo "🔄 Starting backup process..."

# Create backup directory
mkdir -p $BACKUP_DIR/$TIMESTAMP

# Backup database (if applicable)
if [ -n "$DATABASE_URL" ]; then
  echo "💾 Backing up database..."
  pg_dump $DATABASE_URL | gzip > $BACKUP_DIR/$TIMESTAMP/database.sql.gz
fi

# Backup application files
echo "📁 Backing up application files..."
tar -czf $BACKUP_DIR/$TIMESTAMP/application.tar.gz \
  --exclude='node_modules' \
  --exclude='dist' \
  --exclude='.git' \
  /app

# Backup configuration
echo "⚙️ Backing up configuration..."
cp -r /etc/nginx $BACKUP_DIR/$TIMESTAMP/
cp /app/.env $BACKUP_DIR/$TIMESTAMP/

# Create backup manifest
echo "{
  \"timestamp\": \"$TIMESTAMP\",
  \"date\": \"$(date -u +\"%Y-%m-%dT%H:%M:%SZ\")\",
  \"version\": \"$(git rev-parse HEAD)\",
  \"files\": [
    \"database.sql.gz\",
    \"application.tar.gz\",
    \"nginx/\",
    \".env\"
  ]
}" > $BACKUP_DIR/$TIMESTAMP/manifest.json

# Compress entire backup
echo "🗜️ Compressing backup..."
tar -czf $BACKUP_DIR/backup_$TIMESTAMP.tar.gz -C $BACKUP_DIR $TIMESTAMP

# Upload to S3
echo "☁️ Uploading to S3..."
aws s3 cp $BACKUP_DIR/backup_$TIMESTAMP.tar.gz s3://$S3_BUCKET/backups/

# Clean up local files
rm -rf $BACKUP_DIR/$TIMESTAMP
rm -f $BACKUP_DIR/backup_$TIMESTAMP.tar.gz

# Remove old backups from S3
echo "🧹 Cleaning old backups..."
aws s3 ls s3://$S3_BUCKET/backups/ | while read -r line; do
  createDate=$(echo $line | awk '{print $1" "$2}')
  createDate=$(date -d "$createDate" +%s)
  olderThan=$(date -d "$RETENTION_DAYS days ago" +%s)
  
  if [[ $createDate -lt $olderThan ]]; then
    fileName=$(echo $line | awk '{print $4}')
    echo "Deleting $fileName"
    aws s3 rm s3://$S3_BUCKET/backups/$fileName
  fi
done

echo "✅ Backup completed successfully!"

Rollback Procedures
Automated Rollback
#!/bin/bash
# rollback.sh

set -e

# Configuration
ENVIRONMENT=$1
VERSION=$2

if [ -z "$ENVIRONMENT" ] || [ -z "$VERSION" ]; then
  echo "Usage: ./rollback.sh <environment> <version>"
  echo "Example: ./rollback.sh production v1.2.3"
  exit 1
fi

echo "🔄 Starting rollback to $VERSION..."

# Verify version exists
if ! aws s3 ls s3://dgrealtors-deployments/$ENVIRONMENT/$VERSION/ > /dev/null 2>&1; then
  echo "❌ Version $VERSION not found for $ENVIRONMENT"
  exit 1
fi

# Create rollback directory
ROLLBACK_DIR="/tmp/rollback_$(date +%s)"
mkdir -p $ROLLBACK_DIR

# Download previous version
echo "📥 Downloading $VERSION..."
aws s3 sync s3://dgrealtors-deployments/$ENVIRONMENT/$VERSION/ $ROLLBACK_DIR/

# Stop current application
echo "🛑 Stopping current application..."
if [ "$ENVIRONMENT" == "production" ]; then
  pm2 stop dgrealtors || true
else
  pm2 stop dgrealtors-$ENVIRONMENT || true
fi

# Backup current version
echo "💾 Backing up current version..."
CURRENT_VERSION=$(cat /app/version.txt)
tar -czf /backups/pre-rollback_$CURRENT_VERSION.tar.gz /app

# Deploy previous version
echo "🚀 Deploying $VERSION..."
rm -rf /app/*
cp -r $ROLLBACK_DIR/* /app/

# Update version file
echo "$VERSION" > /app/version.txt

# Install dependencies
cd /app
npm ci --production

# Start application
echo "▶️ Starting application..."
if [ "$ENVIRONMENT" == "production" ]; then
  pm2 start ecosystem.config.js --env production
else
  pm2 start ecosystem.config.js --env $ENVIRONMENT
fi

# Health check
echo "🏥 Running health check..."
sleep 10
HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health)

if [ $HEALTH_CHECK -eq 200 ]; then
  echo "✅ Rollback completed successfully!"
  echo "🔍 Current version: $VERSION"
  
  # Invalidate CDN cache
  echo "🔄 Invalidating CDN cache..."
  aws cloudfront create-invalidation \
    --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
    --paths "/*"
else
  echo "❌ Health check failed! Application may not be running correctly."
  exit 1
fi

# Clean up
rm -rf $ROLLBACK_DIR

# Send notification
curl -X POST $SLACK_WEBHOOK_URL \
  -H 'Content-type: application/json' \
  --data "{
    \"text\": \"🔄 Rollback completed\",
    \"blocks\": [{
      \"type\": \"section\",
      \"text\": {
        \"type\": \"mrkdwn\",
        \"text\": \"*Environment:* $ENVIRONMENT\n*Version:* $VERSION\n*Status:* Success\"
      }
    }]
  }"

Manual Rollback Checklist
## Manual Rollback Procedure

### Pre-Rollback Checks
- [ ] Identify the issue requiring rollback
- [ ] Document current version: ________________
- [ ] Identify target rollback version: ________________
- [ ] Notify team members and stakeholders
- [ ] Check backup availability

### Database Rollback (if needed)
- [ ] Backup current database state
- [ ] Identify required migrations to reverse
- [ ] Test rollback migrations on staging
- [ ] Execute rollback migrations
- [ ] Verify data integrity

### Application Rollback
1. [ ] Stop current application
   ```bash
   pm2 stop dgrealtors

[ ] Backup current deployment
tar -czf /backups/rollback_$(date +%Y%m%d_%H%M%S).tar.gz /app

[ ] Download previous version
aws s3 sync s3://dgrealtors-deployments/production/v1.2.3/ /app/

[ ] Install dependencies
cd /app && npm ci --production

[ ] Start application
pm2 start ecosystem.config.js --env production

Verification
[ ] Health check passes
[ ] Key functionality works
[ ] No error logs
[ ] Performance metrics normal
[ ] User reports resolved
Post-Rollback
[ ] Update deployment documentation
[ ] Send rollback notification
[ ] Schedule post-mortem meeting
[ ] Create incident report


## Troubleshooting

### Common Issues

#### Build Failures

```bash
# Clear cache and rebuild
rm -rf node_modules .cache dist
npm cache clean --force
npm install
npm run build

# Check for dependency issues
npm audit
npm outdated

# Debug build process
DEBUG=* npm run build

Deployment Failures
# Check AWS credentials
aws sts get-caller-identity

# Verify S3 bucket permissions
aws s3 ls s3://your-bucket/

# Test CloudFront invalidation
aws cloudfront create-invalidation \
  --distribution-id YOUR_ID \
  --paths "/test.txt"

# Check deployment logs
tail -f /var/log/deploy.log

Performance Issues
// Performance debugging script
const checkPerformance = async () => {
  // Check server response time
  console.time('Server Response');
  const response = await fetch('https://dgrealtors.com');
  console.timeEnd('Server Response');
  
  // Check resource loading
  const resources = performance.getEntriesByType('resource');
  const slowResources = resources
    .filter(r => r.duration > 1000)
    .map(r => ({
      name: r.name,
      duration: r.duration,
      size: r.transferSize
    }));
  
  console.table(slowResources);
  
  // Check Core Web Vitals
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      console.log(`${entry.name}: ${entry.value}ms`);
    }
  });
  
  observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
};

Debug Mode
// Enable debug mode
localStorage.setItem('debug', 'true');

// Debug configuration
window.DEBUG_CONFIG = {
  logLevel: 'verbose',
  showMetrics: true,
  showGrid: true,
  showBreakpoints: true,
  logAPIcalls: true,
  preventAnalytics: true
};

// Debug utilities
window.debugUtils = {
  clearCache: () => {
    caches.keys().then(keys => {
      keys.forEach(key => caches.delete(key));
    });
    localStorage.clear();
    sessionStorage.clear();
  },
  
  showBuildInfo: async () => {
    const response = await fetch('/build-info.json');
    const info = await response.json();
    console.table(info);
  },
  
  testAPI: async (endpoint) => {
    console.time('API Call');
    const response = await fetch(`/api/${endpoint}`);
    console.timeEnd('API Call');
    console.log('Status:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers));
    const data = await response.json();
    console.log('Response:', data);
  },
  
  measurePaint: () => {
    const paints = performance.getEntriesByType('paint');
    console.table(paints);
  }
};

Support
Emergency Contacts
# Emergency contacts
on_call:
  primary: "+1-555-123-4567"
  secondary: "+1-555-234-5678"
  email: "emergency@dgrealtors.com"
  slack: "#emergency-response"

escalation:
  level1:
    - name: "DevOps Team"
      email: "devops@dgrealtors.com"
      phone: "+1-555-345-6789"
  level2:
    - name: "Engineering Manager"
      email: "em@dgrealtors.com"
      phone: "+1-555-456-7890"
  level3:
    - name: "CTO"
      email: "cto@dgrealtors.com"
      phone: "+1-555-567-8901"

external_support:
  aws:
    account_id: "123456789012"
    support_tier: "Business"
    contact: "https://console.aws.amazon.com/support"
  cloudflare:
    account: "your-account"
    support: "https://support.cloudflare.com"

Documentation
Deployment Guide: https://docs.dgrealtors.com/deployment
API Documentation: https://api.dgrealtors.com/docs
Runbook: https://wiki.dgrealtors.com/runbook
Architecture: https://wiki.dgrealtors.com/architecture
Last Updated: {{current.date}} Version: 1.0.0
