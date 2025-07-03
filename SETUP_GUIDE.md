```markdown
# DGrealtors Setup Guide

Welcome to the DGrealtors setup guide! This document will walk you through the steps to set up the DGrealtors website on your local machine or server.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 16.0.0 or higher)
- **npm** (version 8.0.0 or higher)
- **Docker** (optional, for containerized setup)
- **PostgreSQL** (optional, for database setup)
- **Redis** (optional, for caching)

## 🛠️ Installation Steps

### 1. Clone the Repository

Open your terminal and run the following command to clone the repository:

```bash
git clone https://github.com/dgrealtors/website.git
cd website
```

### 2. Install Dependencies

Run the following command to install the required dependencies:

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file based on the provided template:

```bash
cp .env.example .env
```

Edit the `.env` file to configure your environment variables. Here’s an example of what you might include:

```env
# Application
NODE_ENV=development
SITE_URL=http://localhost:3000
API_URL=http://localhost:3000/api

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=dgrealtors

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Security
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
```

### 4. Generate Initial Assets

Run the following command to generate any initial assets required for the application:

```bash
npm run setup
```

### 5. Start the Development Server

You can start the development server with the following command:

```bash
npm run dev
```

### 6. Open Your Browser

Once the server is running, open your browser and navigate to:

```
http://localhost:3000
```

## 🚀 Quick Start with Docker

If you prefer to use Docker, follow these steps:

### 1. Build the Docker Image

Run the following command to build the Docker image:

```bash
docker build -t dgrealtors/website .
```

### 2. Run the Docker Container

You can run the container with the following command:

```bash
docker run -d -p 80:80 dgrealtors/website
```

### 3. Access the Application

Open your browser and navigate to:

```
http://localhost
```

## 📁 Project Structure

Here’s a brief overview of the project structure:

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
│   ├── 📁 styles/         # Stylesheets
│   ├── 📁 scripts/        # JavaScript modules
│   ├── 📁 lib/           # Libraries
│   ├── 📁 pages/         # Page templates
│   └── 📁 assets/        # Source assets
│
├── 📁 scripts/           # Build & utility scripts
│   ├── build.sh         # Build script
│   ├── deploy.sh        # Deployment script
│   └── optimize-images.js # Image optimization
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

## 🔧 Troubleshooting

### Common Issues

- **Port Already in Use**: If you encounter an error indicating that the port is already in use, try changing the port in your `.env` file or stopping the process using that port.
- **Database Connection Errors**: Ensure your database is running and the credentials in your `.env` file are correct.
- **Missing Dependencies**: If you encounter errors related to missing packages, try running `npm install` again.

### Helpful Commands

- **Check Node Version**: Ensure you are using the correct version of Node.js:
```bash
node -v
```

- **Check NPM Version**: Ensure you are using the correct version of npm:
```bash
npm -v
```

- **View Logs**: If you encounter issues, check the logs for more information:
```bash
npm run logs
```

## 📞 Contact Support

If you have any questions or need further assistance, please reach out to our support team:

- 📧 Email: [support@dgrealtors.com](mailto:support@dgrealtors.com)
- 🌐 Website: [https://dgrealtors.com](https://dgrealtors.com)

Thank you for choosing DGrealtors! We hope you enjoy using our platform.
```
### YOU
Write Advanced  SETUP_GUIDE.md . Everything should be in tap to copy bracket. Just like text file 
### BLACKBOX.AI

`SETUP_GUIDE.md`
```markdown
# DGrealtors Website - Complete Setup Guide

## Table of Contents
- [System Requirements](#system-requirements)
- [Initial Setup](#initial-setup)
- [Development Environment](#development-environment)
- [Database Setup](#database-setup)
- [Redis Setup](#redis-setup)
- [Asset Generation](#asset-generation)
- [Development Workflow](#development-workflow)
- [Testing Setup](#testing-setup)
- [Production Setup](#production-setup)
- [Troubleshooting](#troubleshooting)
- [Advanced Configuration](#advanced-configuration)

## System Requirements

### Minimum Requirements
```yaml
Hardware:
  CPU: 2 cores
  RAM: 4GB
  Storage: 10GB free space

Software:
  OS: Windows 10+, macOS 10.14+, Ubuntu 18.04+
  Node.js: 16.0.0+
  npm: 8.0.0+
  Git: 2.25.0+
```

### Recommended Requirements
```yaml
Hardware:
  CPU: 4+ cores
  RAM: 8GB+
  Storage: 20GB+ free space
  Network: Stable broadband connection

Software:
  OS: Latest stable version
  Node.js: 18.0.0+ (LTS)
  npm: 9.0.0+
  Docker: 20.0.0+
  PostgreSQL: 13.0+
  Redis: 6.0+
```

### Optional Tools
```yaml
Development:
  VS Code: Latest
  Chrome: Latest (for DevTools)
  Postman: For API testing
  TablePlus: Database GUI

DevOps:
  Docker Desktop: Latest
  AWS CLI: 2.0+
  Terraform: 1.0+
```

## Initial Setup

### 1. System Preparation

#### macOS
```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install required tools
brew install node@18 git postgresql redis

# Install development tools
brew install --cask visual-studio-code docker postman

# Verify installations
node --version
npm --version
git --version
```

#### Ubuntu/Debian
```bash
# Update package manager
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install required tools
sudo apt install -y git postgresql postgresql-contrib redis-server build-essential

# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Verify installations
node --version
npm --version
git --version
```

#### Windows
```powershell
# Install Chocolatey (if not installed)
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install required tools
choco install nodejs-lts git postgresql redis-64 -y

# Install development tools
choco install vscode docker-desktop postman -y

# Verify installations
node --version
npm --version
git --version
```

### 2. Repository Setup

```bash
# Create project directory
mkdir -p ~/projects/dgrealtors
cd ~/projects/dgrealtors

# Clone repository
git clone https://github.com/dgrealtors/website.git
cd website

# Verify repository
git status
git remote -v

# Set up Git configuration
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Create development branch
git checkout -b development
```

### 3. Node.js Environment Setup

```bash
# Install Node Version Manager (nvm) - Optional but recommended
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell configuration
source ~/.bashrc  # or ~/.zshrc for Zsh

# Install and use correct Node version
nvm install 18
nvm use 18
nvm alias default 18

# Verify Node and npm versions
node --version  # Should be 18.x.x
npm --version   # Should be 9.x.x

# Update npm to latest version
npm install -g npm@latest

# Install global tools
npm install -g yarn pm2 serve nodemon
```

### 4. Dependency Installation

```bash
# Clean install dependencies
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# If you encounter permission errors on macOS/Linux
sudo npm install --unsafe-perm=true --allow-root

# Alternative: Use yarn
yarn install

# Verify installation
npm list --depth=0
```

### 5. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Generate secure keys
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(64).toString('hex'))" >> .env
node -e "console.log('SESSION_SECRET=' + require('crypto').randomBytes(64).toString('hex'))" >> .env

# Edit environment file
nano .env  # or use your preferred editor
```

#### Complete .env Configuration
```env
# ============================================
# APPLICATION SETTINGS
# ============================================
NODE_ENV=development
APP_NAME=DGrealtors
APP_URL=http://localhost:3000
APP_PORT=3000
API_URL=http://localhost:3000/api
CDN_URL=http://localhost:3000

# ============================================
# DATABASE CONFIGURATION
# ============================================
DB_CONNECTION=postgresql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=dgrealtors_dev
DB_USERNAME=dgrealtors_user
DB_PASSWORD=your_secure_password

# ============================================
# REDIS CONFIGURATION
# ============================================
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# ============================================
# SECURITY SETTINGS
# ============================================
JWT_SECRET=your_generated_jwt_secret_here
JWT_EXPIRY=7d
SESSION_SECRET=your_generated_session_secret_here
BCRYPT_ROUNDS=10
ENCRYPTION_KEY=your_32_character_encryption_key

# ============================================
# API KEYS
# ============================================
GOOGLE_ANALYTICS_ID=UA-XXXXXXXXX-X
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
HOTJAR_ID=XXXXXXX
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=mg.dgrealtors.com

# ============================================
# AWS CONFIGURATION
# ============================================
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=dgrealtors-assets
AWS_CLOUDFRONT_DISTRIBUTION=EXXXXXXXXXX

# ============================================
# SMTP CONFIGURATION
# ============================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_specific_password

# ============================================
# DEVELOPMENT SETTINGS
# ============================================
DEBUG=true
LOG_LEVEL=debug
ENABLE_SWAGGER=true
ENABLE_GRAPHQL_PLAYGROUND=true

# ============================================
# FEATURE FLAGS
# ============================================
ENABLE_ANALYTICS=true
ENABLE_CACHE=true
ENABLE_COMPRESSION=true
ENABLE_RATE_LIMITING=true
ENABLE_CORS=true
```

## Development Environment

### 1. VS Code Setup

```bash
# Install VS Code extensions
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
code --install-extension dsznajder.es7-react-js-snippets
code --install-extension formulahendry.auto-rename-tag
code --install-extension naumovs.color-highlight
code --install-extension PKief.material-icon-theme
code --install-extension ritwickdey.LiveServer
code --install-extension ms-azuretools.vscode-docker
code --install-extension eamodio.gitlens
```

#### VS Code Settings (.vscode/settings.json)
```json
{
  "editor.fontSize": 14,
  "editor.tabSize": 2,
  "editor.wordWrap": "on",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  },
  "files.exclude": {
    "**/.git": true,
    "**/.DS_Store": true,
    "**/node_modules": true,
    "dist": true,
    ".cache": true
  },
  "prettier.requireConfig": true,
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "tailwindCSS.includeLanguages": {
    "html": "html",
    "javascript": "javascript",
    "css": "css"
  },
  "liveServer.settings.port": 5500,
  "liveServer.settings.root": "/dist"
}
```

### 2. Git Configuration

```bash
# Set up Git aliases
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual '!gitk'

# Configure Git hooks
npm run prepare

# Set up commit message template
cat > ~/.gitmessage << 'EOF'
# <type>: <subject>

# <body>

# <footer>

# Type can be:
#   feat: new feature
#   fix: bug fix
#   docs: documentation
#   style: formatting
#   refactor: code restructuring
#   test: adding tests
#   chore: maintenance
EOF

git config --global commit.template ~/.gitmessage
```

### 3. Development Scripts Setup

```bash
# Create local development scripts
mkdir -p scripts/local

# Create development start script
cat > scripts/local/start-dev.sh << 'EOF'
#!/bin/bash
set -e

echo "🚀 Starting DGrealtors Development Environment..."

# Check if PostgreSQL is running
if ! pg_isready -q; then
  echo "Starting PostgreSQL..."
  brew services start postgresql  # macOS
  # sudo systemctl start postgresql  # Linux
fi

# Check if Redis is running
if ! redis-cli ping > /dev/null 2>&1; then
  echo "Starting Redis..."
  brew services start redis  # macOS
  # sudo systemctl start redis  # Linux
fi

# Run database migrations
echo "Running database migrations..."
npm run migrate

# Seed database (if needed)
echo "Seeding database..."
npm run seed

# Start development server
echo "Starting development server..."
npm run dev
EOF

chmod +x scripts/local/start-dev.sh
```

## Database Setup

### 1. PostgreSQL Installation & Configuration

#### macOS
```bash
# Install PostgreSQL
brew install postgresql@14

# Start PostgreSQL service
brew services start postgresql@14

# Create database user
createuser -s postgres

# Access PostgreSQL
psql -U postgres
```

#### Linux
```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Switch to postgres user
sudo -u postgres psql
```

### 2. Database Creation

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE dgrealtors_dev;
CREATE DATABASE dgrealtors_test;
CREATE DATABASE dgrealtors_prod;

-- Create user
CREATE USER dgrealtors_user WITH ENCRYPTED PASSWORD 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE dgrealtors_dev TO dgrealtors_user;
GRANT ALL PRIVILEGES ON DATABASE dgrealtors_test TO dgrealtors_user;
GRANT ALL PRIVILEGES ON DATABASE dgrealtors_prod TO dgrealtors_user;

-- Enable extensions
\c dgrealtors_dev
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

\c dgrealtors_test
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Verify setup
\l
\du
\q
```

### 3. Database Schema Setup

```bash
# Create migrations directory
mkdir -p database/migrations

# Create initial schema file
cat > database/migrations/001_initial_schema.sql << 'EOF'
-- Properties table
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'available',
  price DECIMAL(15, 2),
  size_sqft INTEGER,
  location_address VARCHAR(500),
  location_city VARCHAR(100),
  location_state VARCHAR(50),
  location_zip VARCHAR(20),
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  features JSONB DEFAULT '[]',
  images JSONB DEFAULT '[]',
  virtual_tour_url VARCHAR(500),
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Inquiries table
CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  message TEXT NOT NULL,
  source VARCHAR(50),
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Analytics table
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type VARCHAR(100) NOT NULL,
  event_data JSONB,
  user_agent TEXT,
  ip_address INET,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_properties_type ON properties(type);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_featured ON properties(featured);
CREATE INDEX idx_properties_created_at ON properties(created_at DESC);
CREATE INDEX idx_inquiries_property_id ON inquiries(property_id);
CREATE INDEX idx_inquiries_created_at ON inquiries(created_at DESC);
CREATE INDEX idx_analytics_event_type ON analytics(event_type);
CREATE INDEX idx_analytics_created_at ON analytics(created_at DESC);

-- Create update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inquiries_updated_at BEFORE UPDATE ON inquiries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EOF

# Run migrations
psql -U dgrealtors_user -d dgrealtors_dev -f database/migrations/001_initial_schema.sql
```

### 4. Database Seeding

```bash
# Create seed file
cat > database/seeds/initial_data.sql << 'EOF'
-- Insert sample properties
INSERT INTO properties (title, description, type, price, size_sqft, location_address, location_city, location_state, features, images, featured)
VALUES 
  (
    'Modern Office Complex',
    'State-of-the-art office complex with all modern amenities',
    'office',
    2500000,
    25000,
    '123 Business Ave',
    'New York',
    'NY',
    '["24/7 Security", "Parking Garage", "High-Speed Internet", "Conference Rooms", "Cafeteria"]',
    '[{"url": "/images/properties/office-1.jpg", "alt": "Office exterior"}, {"url": "/images/properties/office-2.jpg", "alt": "Office interior"}]',
    true
  ),
  (
    'Prime Retail Space',
    'High-traffic retail location in downtown shopping district',
    'retail',
    1800000,
    15000,
    '456 Shopping St',
    'Los Angeles',
    'CA',
    '["Street Frontage", "Loading Dock", "Display Windows", "Storage Space", "Customer Parking"]',
    '[{"url": "/images/properties/retail-1.jpg", "alt": "Retail storefront"}]',
    true
  ),
  (
    'Industrial Warehouse',
    'Large warehouse facility with easy highway access',
    'warehouse',
    3200000,
    50000,
    '789 Industrial Blvd',
    'Chicago',
    'IL',
    '["Loading Bays", "High Ceilings", "Climate Control", "Security System", "Office Space"]',
    '[{"url": "/images/properties/warehouse-1.jpg", "alt": "Warehouse exterior"}]',
    false
  );

-- Insert sample inquiries
INSERT INTO inquiries (property_id, name, email, phone, message, source)
SELECT 
  p.id,
  'John Doe',
  'john.doe@example.com',
  '555-0123',
  'I am interested in viewing this property. Please contact me to schedule a tour.',
  'website'
FROM properties p
WHERE p.title = 'Modern Office Complex';
EOF

# Run seed data
psql -U dgrealtors_user -d dgrealtors_dev -f database/seeds/initial_data.sql
```

## Redis Setup

### 1. Redis Installation & Configuration

#### macOS
```bash
# Install Redis
brew install redis

# Start Redis service
brew services start redis

# Test connection
redis-cli ping
```

#### Linux
```bash
# Install Redis
sudo apt install redis-server

# Configure Redis
sudo nano /etc/redis/redis.conf

# Set supervised to systemd
# supervised systemd

# Start Redis service
sudo systemctl start redis
sudo systemctl enable redis

# Test connection
redis-cli ping
```

### 2. Redis Configuration

```bash
# Create Redis configuration for development
cat > config/redis.conf << 'EOF'
# Network
bind 127.0.0.1 ::1
port 6379
timeout 300

# General
daemonize no
supervised auto
loglevel notice
logfile ""

# Persistence
save 900 1
save 300 10
save 60 10000
stop-writes-on-bgsave-error yes
rdbcompression yes
rdbchecksum yes
dbfilename dump.rdb
dir ./data/redis/

# Security
requirepass ""

# Memory Management
maxmemory 256mb
maxmemory-policy allkeys-lru

# Append Only File
appendonly yes
appendfilename "appendonly.aof"
appendfsync everysec
no-appendfsync-on-rewrite no
EOF

# Test Redis connection with Node.js
cat > test-redis.js << 'EOF'
const redis = require('redis');
const client = redis.createClient({
  host: 'localhost',
  port: 6379
});

client.on('error', err => console.error('Redis error:', err));
client.on('connect', () => console.log('Redis connected successfully'));

client.set('test', 'Hello Redis!', (err, reply) => {
  if (err) console.error(err);
  console.log('Set:', reply);
  
  client.get('test', (err, reply) => {
    if (err) console.error(err);
    console.log('Get:', reply);
    client.quit();
  });
});
EOF

node test-redis.js
rm test-redis.js
```

## Asset Generation

### 1. Image Assets Setup

```bash
# Create image directories
mkdir -p src/assets/images/{properties,team,partners,awards,icons}
mkdir -p public/images/{optimized,placeholder}

# Install image processing tools
npm install -D sharp imagemin imagemin-mozjpeg imagemin-pngquant imagemin-webp

# Create image optimization script
cat > scripts/optimize-images.js << 'EOF'
const sharp = require('sharp');
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminWebp = require('imagemin-webp');
const path = require('path');
const fs = require('fs-extra');

async function optimizeImages() {
  const inputDir = 'src/assets/images';
  const outputDir = 'public/images/optimized';
  
  // Ensure output directory exists
  await fs.ensureDir(outputDir);
  
  // Optimize images
  await imagemin([`${inputDir}/**/*.{jpg,png}`], {
    destination: outputDir,
    plugins: [
      imageminMozjpeg({ quality: 85 }),
      imageminPngquant({ quality: [0.6, 0.8] })
    ]
  });
  
  // Generate WebP versions
  await imagemin([`${inputDir}/**/*.{jpg,png}`], {
    destination: outputDir,
    plugins: [
      imageminWebp({ quality: 85 })
    ]
  });
  
  console.log('✅ Images optimized successfully');
}

optimizeImages().catch(console.error);
EOF

# Run image optimization
node scripts/optimize-images.js
```

### 2. Favicon Generation

```bash
# Generate favicons
node scripts/generate-favicon.js --source src/assets/logo.svg --output public

# Verify favicon files
ls -la public/*.{ico,png,xml,json}
```

### 3. Font Assets

```bash
# Create fonts directory
mkdir -p src/assets/fonts

# Download and setup fonts
cat > src/styles/fonts.css << 'EOF'
/* Inter Font */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  src: url('/fonts/Inter.var.woff2') format('woff2-variations');
}

/* Playfair Display */
@font-face {
  font-family: 'Playfair Display';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/PlayfairDisplay-Regular.woff2') format('woff2'),
       url('/fonts/PlayfairDisplay-Regular.woff') format('woff');
}

@font-face {
  font-family: 'Playfair Display';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url('/fonts/PlayfairDisplay-Bold.woff2') format('woff2'),
       url('/fonts/PlayfairDisplay-Bold.woff') format('woff');
}
EOF
```

### 4. Generate Placeholder Data

```bash
# Create data directory
mkdir -p src/data

# Generate sample data
cat > src/data/properties.json << 'EOF'
{
  "properties": [
    {
      "id": "prop-001",
      "title": "Modern Office Complex",
      "type": "office",
      "price": 2500000,
      "size": 25000,
      "location": {
        "address": "123 Business Ave",
        "city": "New York",
        "state": "NY",
        "zip": "10001"
      },
      "features": ["24/7 Security", "Parking", "Conference Rooms"],
      "images": [
        {
          "url": "/images/properties/office-1.jpg",
          "alt": "Modern office exterior"
        }
      ],
      "available": true,
      "featured": true
    }
  ]
}
EOF

cat > src/data/testimonials.json << 'EOF'
{
  "testimonials": [
    {
      "id": "test-001",
      "name": "Sarah Johnson",
      "company": "Tech Innovations Inc.",
      "role": "CEO",
      "content": "DGrealtors helped us find the perfect office space. Their expertise and professionalism made the entire process seamless.",
      "rating": 5,
      "date": "2024-01-15"
    }
  ]
}
EOF
```

## Development Workflow

### 1. Start Development Server

```bash
# Using npm scripts
npm run dev

# Using the custom script
./scripts/local/start-dev.sh

# With specific environment
NODE_ENV=development npm run dev

# With debugging
DEBUG=* npm run dev
```

### 2. Development Tools

```bash
# Run linter
npm run lint

# Auto-fix lint issues
npm run lint:fix

# Format code
npm run format

# Type checking
npm run typecheck

# Run tests in watch mode
npm run test:watch

# Generate documentation
npm run docs
```

### 3. Git Workflow

```bash
# Create feature branch
git checkout -b feature/property-search

# Make changes and stage
git add .

# Commit with conventional message
git commit -m "feat: add advanced property search functionality"

# Push to remote
git push origin feature/property-search

# Create pull request
# Use GitHub/GitLab UI or CLI tools

# After PR approval, merge to main
git checkout main
git pull origin main
git merge --no-ff feature/property-search
git push origin main

# Clean up
git branch -d feature/property-search
git push origin --delete feature/property-search
```

### 4. Hot Module Replacement (HMR)

```javascript
// Ensure HMR is enabled in vite.config.js
export default {
  server: {
    hmr: {
      overlay: true,
      host: 'localhost'
    }
  }
};

// In your JavaScript files
if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    // Handle module updates
    console.log('Module updated:', newModule);
  });
}
```

## Testing Setup

### 1. Unit Testing

```bash
# Install testing dependencies
npm install -D jest @testing-library/dom @testing-library/jest-dom

# Create test configuration
cat > jest.config.js << 'EOF'
module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/**/index.js'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
EOF

# Create setup file
cat > src/setupTests.js << 'EOF'
import '@testing-library/jest-dom';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
EOF

# Create sample test
cat > src/utils/validation.test.js << 'EOF'
import { validateEmail, validatePhone } from './validation';

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    test('validates correct email', () => {
      expect(validateEmail('test@example.com')).toBe(true);
    });
    
    test('invalidates incorrect email', () => {
      expect(validateEmail('invalid-email')).toBe(false);
    });
  });
  
  describe('validatePhone', () => {
    test('validates correct phone number', () => {
      expect(validatePhone('1234567890')).toBe(true);
    });
    
    test('invalidates incorrect phone number', () => {
      expect(validatePhone('123')).toBe(false);
    });
  });
});
EOF

# Run tests
npm test
```

### 2. Integration Testing

```bash
# Install integration testing tools
npm install -D supertest

# Create integration test
cat > tests/integration/api.test.js << 'EOF'
const request = require('supertest');
const app = require('../../src/server');

describe('API Integration Tests', () => {
  describe('GET /api/properties', () => {
    test('should return list of properties', async () => {
      const response = await request(app)
        .get('/api/properties')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(response.body).toHaveProperty('properties');
      expect(Array.isArray(response.body.properties)).toBe(true);
    });
  });
  
  describe('POST /api/contact', () => {
    test('should submit contact form', async () => {
      const contactData = {
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test message'
      };
      
      const response = await request(app)
        .post('/api/contact')
        .send(contactData)
        .expect(201);
      
      expect(response.body).toHaveProperty('success', true);
    });
  });
});
EOF
```

### 3. End-to-End Testing

```bash
# Install Playwright
npm install -D @playwright/test

# Create E2E test configuration
cat > playwright.config.js << 'EOF'
module.exports = {
  testDir: './tests/e2e',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    }
  ]
};
EOF

# Create E2E test
cat > tests/e2e/homepage.spec.js << 'EOF'
const { test, expect } = require('@playwright/test');

test.describe('Homepage', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/DGrealtors/);
    
    // Check hero section
    const hero = await page.locator('.hero');
    await expect(hero).toBeVisible();
    
    // Check navigation
    const nav = await page.locator('nav');
    await expect(nav).toBeVisible();
  });
  
  test('should navigate to properties page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Properties');
    await expect(page).toHaveURL(/.*properties/);
  });
  
  test('should submit contact form', async ({ page }) => {
    await page.goto('/contact');
    
    // Fill form
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('textarea[name="message"]', 'Test message');
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Check success message
    await expect(page.locator('.success-message')).toBeVisible();
  });
});
EOF

# Run E2E tests
npm run test:e2e
```

## Production Setup

### 1. Production Build

```bash
# Clean previous builds
rm -rf dist .cache

# Build for production
NODE_ENV=production npm run build

# Analyze bundle size
npm run analyze

# Test production build locally
npm run preview
```

### 2. Production Environment Variables

```bash
# Create production environment file
cat > .env.production << 'EOF'
NODE_ENV=production
APP_NAME=DGrealtors
APP_URL=https://dgrealtors.com
API_URL=https://api.dgrealtors.com
CDN_URL=https://cdn.dgrealtors.com

# Use environment variables from hosting platform
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}
DB_DATABASE=${DB_DATABASE}
DB_USERNAME=${DB_USERNAME}
DB_PASSWORD=${DB_PASSWORD}

REDIS_HOST=${REDIS_HOST}
REDIS_PORT=${REDIS_PORT}
REDIS_PASSWORD=${REDIS_PASSWORD}

# Security keys from environment
JWT_SECRET=${JWT_SECRET}
SESSION_SECRET=${SESSION_SECRET}
ENCRYPTION_KEY=${ENCRYPTION_KEY}

# External services
AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
SENTRY_DSN=${SENTRY_DSN}
EOF
```

### 3. Production Server Setup

```bash
# Install PM2 for process management
npm install -g pm2

# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'dgrealtors',
    script: './server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/error.log',
    out_file: './logs/output.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    watch: false,
    ignore_watch: ['node_modules', 'logs', '.git'],
    wait_ready: true,
    listen_timeout: 10000,
    kill_timeout: 5000
  }]
};
EOF

# Start application with PM2
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup
```

### 4. Nginx Configuration

```bash
# Create Nginx configuration
sudo cat > /etc/nginx/sites-available/dgrealtors << 'EOF'
server {
    listen 80;
    server_name dgrealtors.com www.dgrealtors.com;
    return 301 https://dgrealtors.com$request_uri;
}

server {
    listen 443 ssl http2;
    server_name www.dgrealtors.com;
    
    ssl_certificate /etc/letsencrypt/live/dgrealtors.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dgrealtors.com/privkey.pem;
    
    return 301 https://dgrealtors.com$request_uri;
}

server {
    listen 443 ssl http2;
    server_name dgrealtors.com;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/dgrealtors.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dgrealtors.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    
    # Root directory
    root /var/www/dgrealtors/dist;
    index index.html;
    
    # Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml application/atom+xml image/svg+xml;
    
    # Static files caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|pdf|txt)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # API proxy
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/dgrealtors /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

## Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>

# Or change port in .env
APP_PORT=3001
```

#### 2. Permission Errors
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Fix project permissions
sudo chown -R $(whoami):$(whoami) .
chmod -R 755 .
```

#### 3. Database Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check if database exists
psql -U postgres -l

# Test connection
psql -U dgrealtors_user -d dgrealtors_dev -c "SELECT 1;"

# Check pg_hba.conf
sudo nano /etc/postgresql/14/main/pg_hba.conf
# Ensure: local all all md5
```

#### 4. Redis Connection Issues
```bash
# Check Redis status
sudo systemctl status redis

# Test connection
redis-cli ping

# Check Redis logs
sudo journalctl -u redis -n 50
```

#### 5. Build Failures
```bash
# Clear all caches
rm -rf node_modules .cache dist
npm cache clean --force

# Reinstall dependencies
npm install

# Try with different Node version
nvm use 16
npm install
npm run build
```

#### 6. Memory Issues
```bash
# Increase Node memory limit
export NODE_OPTIONS="--max-old-space-size=4096"

# Or in package.json
"scripts": {
  "build": "NODE_OPTIONS='--max-old-space-size=4096' vite build"
}
```

### Debug Mode

```bash
# Enable debug logging
DEBUG=* npm run dev

# Enable verbose logging
npm run dev --verbose

# Check Node.js debugging
node --inspect server.js

# Use Chrome DevTools for debugging
# Navigate to: chrome://inspect
```

### Performance Issues

```bash
# Profile build performance
npm run build -- --profile

# Analyze bundle
npm run analyze

# Check for large dependencies
npm ls --depth=0
du -sh node_modules/* | sort -hr | head -20

# Monitor application
pm2 monit
```

## Advanced Configuration

### 1. Custom Webpack Configuration

```javascript
// webpack.config.custom.js
module.exports = {
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
          chunks: 'all'
        },
        common: {
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true
        }
      }
    }
  },
  performance: {
    hints: 'warning',
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  }
};
```

### 2. Environment-Specific Configurations

```bash
# Create environment configs
mkdir -p config/environments

# Development config
cat > config/environments/development.js << 'EOF'
module.exports = {
  api: {
    timeout: 30000,
    retries: 3
  },
  cache: {
    enabled: false
  },
  logging: {
    level: 'debug',
    pretty: true
  }
};
EOF

# Production config
cat > config/environments/production.js << 'EOF'
module.exports = {
  api: {
    timeout: 10000,
    retries: 1
  },
  cache: {
    enabled: true,
    ttl: 3600
  },
  logging: {
    level: 'error',
    pretty: false
  }
};
EOF
```

### 3. Docker Development Setup

```bash
# Create Docker Compose for development
cat > docker-compose.dev.yml << 'EOF'
version: '3.8'

services:
  app:
    build: 
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    depends_on:
      - postgres
      - redis
    command: npm run dev

  postgres:
    image: postgres:14-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: dgrealtors_user
      POSTGRES_PASSWORD: development_password
      POSTGRES_DB: dgrealtors_dev
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:6-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  adminer:
    image: adminer
    ports:
      - "8080:8080"
    depends_on:
      - postgres

volumes:
  postgres_data:
  redis_data:
EOF

# Create development Dockerfile
cat > Dockerfile.dev << 'EOF'
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Install development tools
RUN apk add --no-cache git bash

# Expose port
EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev"]
EOF

# Start development environment
docker-compose -f docker-compose.dev.yml up
```

### 4. CI/CD Pipeline Setup

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [ main, development ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_USER: test_user
          POSTGRES_PASSWORD: test_password
          POSTGRES_DB: dgrealtors_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js 18.x
      uses: actions/setup-node@v3
      with:
        node-version: 18.x
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linter
      run: npm run lint
    
    - name: Run tests
      run: npm test -- --coverage
      env:
        DB_HOST: localhost
        DB_PORT: 5432
        DB_USER: test_user
        DB_PASSWORD: test_password
        DB_DATABASE: dgrealtors_test
    
    - name: Build
      run: npm run build
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        token: ${{ secrets.CODECOV_TOKEN }}
```

## Maintenance Scripts

```bash
# Create maintenance scripts directory
mkdir -p scripts/maintenance

# Database backup script
cat > scripts/maintenance/backup-db.sh << 'EOF'
#!/bin/bash
set -e

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups/database"

mkdir -p $BACKUP_DIR

echo "Backing up database..."
pg_dump -U dgrealtors_user -d dgrealtors_prod | gzip > "$BACKUP_DIR/backup_$TIMESTAMP.sql.gz"

# Keep only last 7 days of backups
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete

echo "Backup completed: backup_$TIMESTAMP.sql.gz"
EOF

chmod +x scripts/maintenance/backup-db.sh

# Cleanup script
cat > scripts/maintenance/cleanup.sh << 'EOF'
#!/bin/bash
set -e

echo "Running cleanup tasks..."

# Clean old logs
find ./logs -name "*.log" -mtime +30 -delete

# Clean old sessions
redis-cli --scan --pattern "sess:*" | xargs -L 1 redis-cli DEL

# Clean temporary files
find ./tmp -type f -mtime +1 -delete

# Vacuum database
psql -U dgrealtors_user -d dgrealtors_prod -c "VACUUM ANALYZE;"

echo "Cleanup completed"
EOF

chmod +x scripts/maintenance/cleanup.sh
```

## Final Checklist

```markdown
### Pre-Launch Checklist

- [ ] All dependencies installed successfully
- [ ] Database connected and migrations run
- [ ] Redis connected and working
- [ ] Environment variables configured correctly
- [ ] SSL certificates installed
- [ ] Security headers configured
- [ ] Backup system tested
- [ ] Monitoring setup completed
- [ ] Error tracking (Sentry) integrated
- [ ] Analytics (Google Analytics) integrated
- [ ] Performance optimizations applied
- [ ] SEO meta tags configured
- [ ] Sitemap generated
- [ ] Robots.txt configured
- [ ] 404 and error pages created
- [ ] Contact form tested
- [ ] Email notifications working
- [ ] Mobile responsiveness verified
- [ ] Cross-browser compatibility tested
- [ ] Load testing performed
- [ ] Security audit completed
- [ ] Documentation updated
- [ ] Team training completed
```

## Support & Resources

### Documentation
- Project Documentation: `/docs`
- API Documentation: `/docs/api`
- Component Library: `/docs/components`

### Helpful Links
- Node.js Documentation: https://nodejs.org/docs
- PostgreSQL Documentation: https://www.postgresql.org/docs
- Redis Documentation: https://redis.io/documentation
- Vite Documentation: https://vitejs.dev/guide
- PM2 Documentation: https://pm2.keymetrics.io/docs

### Getting Help
- GitHub Issues: https://github.com/dgrealtors/website/issues
- Email Support: support@dgrealtors.com
- Development Team: dev@dgrealtors.com

---

*This setup guide is maintained by the DGrealtors development team. Last updated: {{current.date}}*
```
