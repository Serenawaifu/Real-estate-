# DGrealtors Website Maintenance Guide

## Table of Contents
- [Overview](#overview)
- [Regular Maintenance Tasks](#regular-maintenance-tasks)
- [Update Procedures](#update-procedures)
- [Database Maintenance](#database-maintenance)
- [Performance Optimization](#performance-optimization)
- [Security Maintenance](#security-maintenance)
- [Backup & Recovery](#backup--recovery)
- [Monitoring & Alerts](#monitoring--alerts)
- [Log Management](#log-management)
- [Content Updates](#content-updates)
- [Emergency Procedures](#emergency-procedures)
- [Maintenance Schedules](#maintenance-schedules)
- [Troubleshooting Guide](#troubleshooting-guide)

## Overview

This guide provides comprehensive maintenance procedures for the DGrealtors website to ensure optimal performance, security, and reliability.

### Maintenance Philosophy

```yaml
principles:
  - Proactive over Reactive
  - Automation over Manual
  - Documentation over Memory
  - Testing over Assumptions
  - Security over Convenience

key_metrics:
  uptime_target: 99.9%
  response_time: <200ms
  error_rate: <0.1%
  security_patches: <24hrs
  backup_frequency: daily

Quick Reference
# System Status Check
npm run health:check

# Run All Maintenance Tasks
npm run maintenance:all

# Emergency Rollback
npm run rollback:emergency

# Generate Maintenance Report
npm run report:maintenance

Regular Maintenance Tasks
Daily Tasks
#!/bin/bash
# daily-maintenance.sh

echo "🔧 Starting daily maintenance..."
START_TIME=$(date +%s)

# 1. Health Checks
echo "🏥 Running health checks..."
curl -s https://dgrealtors.com/health | jq '.'

# 2. Backup Verification
echo "💾 Verifying backups..."
aws s3 ls s3://dgrealtors-backups/daily/$(date +%Y%m%d)/ || {
  echo "❌ Today's backup missing!"
  exit 1
}

# 3. Security Scan
echo "🔒 Running security scan..."
npm audit --production
trivy image dgrealtors/website:latest

# 4. Performance Metrics
echo "📊 Collecting performance metrics..."
curl -s https://api.dgrealtors.com/metrics/daily | jq '.'

# 5. Error Log Check
echo "📝 Checking error logs..."
ERROR_COUNT=$(grep -c "ERROR" /var/log/dgrealtors/error.log || echo "0")
if [ $ERROR_COUNT -gt 10 ]; then
  echo "⚠️  High error count: $ERROR_COUNT"
fi

# 6. SSL Certificate Check
echo "🔐 Checking SSL certificate..."
openssl s_client -connect dgrealtors.com:443 -servername dgrealtors.com < /dev/null 2>/dev/null | \
  openssl x509 -noout -dates

# 7. Disk Space Check
echo "💽 Checking disk space..."
df -h | grep -E "^/dev/"

# Generate report
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

cat > /tmp/daily-maintenance-report.json << EOF
{
  "date": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "duration": $DURATION,
  "tasks": {
    "health_check": "completed",
    "backup_verification": "completed",
    "security_scan": "completed",
    "performance_metrics": "completed",
    "error_logs": {
      "status": "completed",
      "error_count": $ERROR_COUNT
    },
    "ssl_check": "completed",
    "disk_space": "completed"
  }
}
EOF

# Upload report
aws s3 cp /tmp/daily-maintenance-report.json \
  s3://dgrealtors-reports/maintenance/daily/$(date +%Y%m%d).json

echo "✅ Daily maintenance completed in ${DURATION}s"

Weekly Tasks
// weekly-maintenance.js
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

class WeeklyMaintenance {
  constructor() {
    this.tasks = [
      this.updateDependencies,
      this.cleanupOldFiles,
      this.optimizeDatabase,
      this.analyzePerformance,
      this.securityAudit,
      this.backupRotation,
      this.generateReports
    ];
    this.results = [];
  }

  async run() {
    console.log('🔧 Starting weekly maintenance...');
    const startTime = Date.now();

    for (const task of this.tasks) {
      try {
        const taskName = task.name;
        console.log(`📋 Running ${taskName}...`);
        const result = await task.call(this);
        this.results.push({
          task: taskName,
          status: 'success',
          result
        });
      } catch (error) {
        this.results.push({
          task: task.name,
          status: 'failed',
          error: error.message
        });
      }
    }

    const duration = Date.now() - startTime;
    await this.saveReport(duration);
    console.log(`✅ Weekly maintenance completed in ${duration}ms`);
  }

  async updateDependencies() {
    // Check for outdated packages
    const { stdout: outdated } = await execPromise('npm outdated --json || true');
    const outdatedPackages = JSON.parse(outdated || '{}');

    // Update patch versions automatically
    const updates = [];
    for (const [pkg, info of Object.entries(outdatedPackages)) {
      if (this.canAutoUpdate(info)) {
        await execPromise(`npm update ${pkg}`);
        updates.push(pkg);
      }
    }

    // Run security audit
    const { stdout: audit } = await execPromise('npm audit --json || true');
    const auditResults = JSON.parse(audit);

    // Fix vulnerabilities
    if (auditResults.metadata.vulnerabilities.total > 0) {
      await execPromise('npm audit fix');
    }

    return {
      outdated: Object.keys(outdatedPackages).length,
      updated: updates.length,
      vulnerabilities: auditResults.metadata.vulnerabilities
    };
  }

  canAutoUpdate(info) {
    // Only auto-update patch versions
    const current = info.current.split('.');
    const wanted = info.wanted.split('.');
    return current[0] === wanted[0] && current[1] === wanted[1];
  }

  async cleanupOldFiles() {
    const cleanupTasks = [
      // Clean old logs
      'find /var/log/dgrealtors -name "*.log" -mtime +30 -delete',
      // Clean temporary files
      'find /tmp -name "dgrealtors-*" -mtime +7 -delete',
      // Clean old backups
      'find /backups -name "*.tar.gz" -mtime +30 -delete',
      // Clean build artifacts
      'rm -rf /app/.cache /app/node_modules/.cache'
    ];

    const results = [];
    for (const task of cleanupTasks) {
      try {
        await execPromise(task);
        results.push({ task, status: 'completed' });
      } catch (error) {
        results.push({ task, status: 'failed', error: error.message });
      }
    }

    // Clear application caches
    await this.clearApplicationCaches();

    return results;
  }

  async clearApplicationCaches() {
    // Clear Redis cache
    await execPromise('redis-cli FLUSHDB');

    // Clear CDN cache (selective)
    const { stdout } = await execPromise(`
      aws cloudfront create-invalidation \
        --distribution-id ${process.env.CLOUDFRONT_DISTRIBUTION_ID} \
        --paths "/assets/*" "/images/*"
    `);

    return JSON.parse(stdout);
  }

  async optimizeDatabase() {
    if (!process.env.DATABASE_URL) {
      return { skipped: true, reason: 'No database configured' };
    }

    const tasks = [
      // Vacuum and analyze
      'psql $DATABASE_URL -c "VACUUM ANALYZE;"',
      // Reindex
      'psql $DATABASE_URL -c "REINDEX DATABASE dgrealtors;"',
      // Update statistics
      'psql $DATABASE_URL -c "ANALYZE;"',
      // Check for unused indexes
      `psql $DATABASE_URL -c "
        SELECT schemaname, tablename, indexname, idx_scan
        FROM pg_stat_user_indexes
        WHERE idx_scan = 0
        ORDER BY schemaname, tablename;
      "`
    ];

    const results = [];
    for (const task of tasks) {
      const { stdout } = await execPromise(task);
      results.push(stdout);
    }

    return results;
  }

  async analyzePerformance() {
    // Lighthouse CI
    const lighthouse = await execPromise(`
      lighthouse https://dgrealtors.com \
        --output=json \
        --output-path=/tmp/lighthouse.json \
        --chrome-flags="--headless"
    `);

    const report = JSON.parse(
      await fs.readFile('/tmp/lighthouse.json', 'utf8')
    );

    // WebPageTest
    const wpt = await fetch('https://www.webpagetest.org/runtest.php', {
      method: 'POST',
      body: new URLSearchParams({
        url: 'https://dgrealtors.com',
        k: process.env.WPT_API_KEY,
        f: 'json',
        lighthouse: 1
      })
    });

    const wptResult = await wpt.json();

    return {
      lighthouse: {
        performance: report.categories.performance.score,
        accessibility: report.categories.accessibility.score,
        seo: report.categories.seo.score,
        bestPractices: report.categories['best-practices'].score
      },
      webpagetest: wptResult.data.testId
    };
  }

  async securityAudit() {
    const audits = [];

    // 1. Dependency vulnerabilities
    const npmAudit = await execPromise('npm audit --json || true');
    audits.push({
      type: 'dependencies',
      result: JSON.parse(npmAudit.stdout)
    });

    // 2. Security headers
    const headers = await fetch('https://dgrealtors.com', {
      method: 'HEAD'
    });
    audits.push({
      type: 'headers',
      result: Object.fromEntries(headers.headers)
    });

    // 3. SSL Labs scan
    const sslScan = await fetch(
      `https://api.ssllabs.com/api/v3/analyze?host=dgrealtors.com`
    );
    audits.push({
      type: 'ssl',
      result: await sslScan.json()
    });

    // 4. OWASP ZAP scan
    if (process.env.ZAP_API_KEY) {
      const zapScan = await execPromise(`
        docker run -t owasp/zap2docker-stable zap-baseline.py \
          -t https://dgrealtors.com \
          -J /tmp/zap-report.json
      `);
      audits.push({
        type: 'owasp',
        result: JSON.parse(await fs.readFile('/tmp/zap-report.json'))
      });
    }

    return audits;
  }

  async backupRotation() {
    // List all backups
    const { stdout } = await execPromise(
      'aws s3 ls s3://dgrealtors-backups/weekly/'
    );

    const backups = stdout.split('\n')
      .filter(line => line.trim())
      .map(line => {
        const parts = line.split(/\s+/);
        return {
          date: new Date(parts[0] + ' ' + parts[1]),
          size: parseInt(parts[2]),
          filename: parts[3]
        };
      });

    // Keep last 4 weekly backups
    const toDelete = backups
      .sort((a, b) => b.date - a.date)
      .slice(4);

    for (const backup of toDelete) {
      await execPromise(
        `aws s3 rm s3://dgrealtors-backups/weekly/${backup.filename}`
      );
    }

    return {
      total: backups.length,
      kept: Math.min(4, backups.length),
      deleted: toDelete.length
    };
  }

  async generateReports() {
    const reports = [];

    // 1. Performance report
    const perfReport = await this.generatePerformanceReport();
    reports.push({ type: 'performance', path: perfReport });

    // 2. Security report
    const secReport = await this.generateSecurityReport();
    reports.push({ type: 'security', path: secReport });

    // 3. SEO report
    const seoReport = await this.generateSEOReport();
    reports.push({ type: 'seo', path: seoReport });

    // 4. Uptime report
    const uptimeReport = await this.generateUptimeReport();
    reports.push({ type: 'uptime', path: uptimeReport });

    return reports;
  }

  async generatePerformanceReport() {
    const data = {
      date: new Date().toISOString(),
      metrics: await this.collectPerformanceMetrics(),
      recommendations: await this.getPerformanceRecommendations()
    };

    const reportPath = `/reports/performance/weekly-${Date.now()}.json`;
    await fs.writeFile(reportPath, JSON.stringify(data, null, 2));
    return reportPath;
  }

  async saveReport(duration) {
    const report = {
      timestamp: new Date().toISOString(),
      duration,
      results: this.results,
      summary: {
        total: this.results.length,
        successful: this.results.filter(r => r.status === 'success').length,
        failed: this.results.filter(r => r.status === 'failed').length
      }
    };

    await fs.writeFile(
      `/reports/maintenance/weekly-${Date.now()}.json`,
      JSON.stringify(report, null, 2)
    );

    // Send notification
    await this.sendNotification(report);
  }

  async sendNotification(report) {
    const message = `
      Weekly Maintenance Completed
      Time: ${report.timestamp}
      Duration: ${report.duration}ms
      Tasks: ${report.summary.successful}/${report.summary.total} successful
      ${report.summary.failed > 0 ? `⚠️ ${report.summary.failed} tasks failed` : ''}
    `;

    // Send to Slack
    await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message })
    });
  }
}

// Run if called directly
if (require.main === module) {
  new WeeklyMaintenance().run().catch(console.error);
}

module.exports = WeeklyMaintenance;

Monthly Tasks
#!/bin/bash
# monthly-maintenance.sh

set -e

echo "🔧 Starting monthly maintenance..."
LOG_FILE="/var/log/dgrealtors/monthly-maintenance-$(date +%Y%m).log"
exec 1> >(tee -a "$LOG_FILE")
exec 2>&1

# 1. Full System Backup
echo "💾 Creating full system backup..."
/scripts/backup-full.sh

# 2. Database Optimization
echo "🗄️ Optimizing database..."
psql $DATABASE_URL << EOF
-- Update table statistics
ANALYZE;

-- Rebuild indexes
REINDEX DATABASE dgrealtors;

-- Clean up old data
DELETE FROM logs WHERE created_at < NOW() - INTERVAL '90 days';
DELETE FROM sessions WHERE expires_at < NOW();
DELETE FROM analytics_events WHERE timestamp < NOW() - INTERVAL '180 days';

-- Vacuum full (requires downtime)
VACUUM FULL;
EOF

# 3. Security Audit
echo "🔒 Running comprehensive security audit..."
/scripts/security-audit-full.sh

# 4. Dependency Major Updates Review
echo "📦 Reviewing major dependency updates..."
npm outdated
echo "Manual review required for major updates"

# 5. Performance Baseline
echo "📊 Creating performance baseline..."
for i in {1..5}; do
  lighthouse https://dgrealtors.com \
    --output=json \
    --output-path="/tmp/lighthouse-run-$i.json" \
    --chrome-flags="--headless"
  sleep 30
done

# 6. Infrastructure Review
echo "🏗️ Reviewing infrastructure..."
aws ec2 describe-instances --filters "Name=tag:Project,Values=dgrealtors" \
  --output table

aws rds describe-db-instances --output table

aws s3 ls --summarize --human-readable --recursive s3://dgrealtors-assets/

# 7. Cost Analysis
echo "💰 Analyzing costs..."
aws ce get-cost-and-usage \
  --time-period Start=$(date -d "30 days ago" +%Y-%m-%d),End=$(date +%Y-%m-%d) \
  --granularity MONTHLY \
  --metrics "BlendedCost" \
  --group-by Type=TAG,Key=Project

# 8. Certificate Renewal Check
echo "🔐 Checking SSL certificates..."
CERT_EXPIRY=$(echo | openssl s_client -connect dgrealtors.com:443 2>/dev/null | \
  openssl x509 -noout -enddate | cut -d= -f2)
DAYS_LEFT=$(( ($(date -d "$CERT_EXPIRY" +%s) - $(date +%s)) / 86400 ))

if [ $DAYS_LEFT -lt 30 ]; then
  echo "⚠️  SSL certificate expires in $DAYS_LEFT days!"
  # Trigger renewal
  certbot renew --nginx
fi

# 9. Archive Old Data
echo "📁 Archiving old data..."
# Archive old logs
find /var/log/dgrealtors -name "*.log" -mtime +90 -exec gzip {} \;
aws s3 sync /var/log/dgrealtors/ s3://dgrealtors-archives/logs/ \
  --exclude "*" --include "*.gz"

# Archive old backups
find /backups -name "*.tar.gz" -mtime +30 -exec \
  aws s3 mv {} s3://dgrealtors-archives/backups/ \;

# 10. Documentation Update
echo "📚 Checking documentation..."
cd /docs
git pull
npm run build:docs
npm run deploy:docs

echo "✅ Monthly maintenance completed!"

Update Procedures
Application Updates
// update-application.js
const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

class ApplicationUpdater {
  constructor(options = {}) {
    this.options = {
      environment: options.environment || 'production',
      version: options.version,
      autoRollback: options.autoRollback !== false,
      healthCheckRetries: options.healthCheckRetries || 5,
      healthCheckDelay: options.healthCheckDelay || 10000
    };
    
    this.backupPath = null;
    this.previousVersion = null;
  }

  async update() {
    try {
      console.log('🚀 Starting application update...');
      
      // Pre-update checks
      await this.preUpdateChecks();
      
      // Create backup
      await this.backupCurrentVersion();
      
      // Download new version
      await this.downloadNewVersion();
      
      // Stop application
      await this.stopApplication();
      
      // Deploy new version
      await this.deployNewVersion();
      
      // Run migrations
      await this.runMigrations();
      
      // Start application
      await this.startApplication();
      
      // Health checks
      await this.performHealthChecks();
      
      // Post-update tasks
      await this.postUpdateTasks();
      
      console.log('✅ Update completed successfully!');
      
    } catch (error) {
      console.error('❌ Update failed:', error.message);
      
      if (this.options.autoRollback) {
        await this.rollback();
      }
      
      throw error;
    }
  }

  async preUpdateChecks() {
    console.log('🔍 Running pre-update checks...');
    
    // Check disk space
    const diskSpace = await this.checkDiskSpace();
    if (diskSpace.available < 5 * 1024 * 1024 * 1024) { // 5GB
      throw new Error('Insufficient disk space');
    }
    
    // Check system load
    const load = await this.getSystemLoad();
    if (load.load1 > 4) {
      throw new Error('System load too high');
    }
    
    // Verify backup system
    await this.verifyBackupSystem();
    
    // Check database connectivity
    await this.checkDatabaseConnection();
  }

  async backupCurrentVersion() {
    console.log('💾 Creating backup...');
    
    this.previousVersion = await this.getCurrentVersion();
    this.backupPath = `/backups/pre-update-${Date.now()}.tar.gz`;
    
    await this.exec(`
      tar -czf ${this.backupPath} \
        --exclude=node_modules \
        --exclude=logs \
        --exclude=.git \
        /app
    `);
    
    // Backup database
    if (process.env.DATABASE_URL) {
      const dbBackup = `${this.backupPath}.sql.gz`;
      await this.exec(
        `pg_dump ${process.env.DATABASE_URL} | gzip > ${dbBackup}`
      );
    }
  }

  async downloadNewVersion() {
    console.log('📥 Downloading new version...');
    
    const downloadUrl = this.options.version
      ? `https://releases.dgrealtors.com/v${this.options.version}.tar.gz`
      : 'https://releases.dgrealtors.com/latest.tar.gz';
    
    await this.exec(`
      cd /tmp && \
      wget -O release.tar.gz ${downloadUrl} && \
      tar -xzf release.tar.gz
    `);
    
    // Verify checksum
    await this.verifyChecksum('/tmp/release.tar.gz');
  }

  async stopApplication() {
    console.log('🛑 Stopping application...');
    
    // Enable maintenance mode
    await this.enableMaintenanceMode();
    
    // Graceful shutdown
    await this.exec('pm2 stop dgrealtors --wait-ready');
    
    // Wait for connections to drain
    await this.sleep(5000);
  }

  async deployNewVersion() {
    console.log('🚀 Deploying new version...');
    
    // Copy new files
    await this.exec(`
      rsync -av --delete \
        --exclude=node_modules \
        --exclude=.env \
        --exclude=uploads \
        --exclude=logs \
        /tmp/release/ /app/
    `);
    
    // Install dependencies
    await this.exec('cd /app && npm ci --production');
    
    // Build assets
    await this.exec('cd /app && npm run build');
  }

  async runMigrations() {
    console.log('🔄 Running migrations...');
    
    if (!process.env.DATABASE_URL) return;
    
    // Check for pending migrations
    const pending = await this.exec(
      'cd /app && npm run db:migrations:pending'
    );
    
    if (pending.stdout.trim()) {
      // Backup current schema
      await this.exec(
        'pg_dump --schema-only $DATABASE_URL > /tmp/schema-backup.sql'
      );
      
      // Run migrations
      await this.exec('cd /app && npm run db:migrate');
    }
  }

  async startApplication() {
    console.log('▶️ Starting application...');
    
    // Start with PM2
    await this.exec('cd /app && pm2 start ecosystem.config.js');
    
    // Wait for startup
    await this.sleep(10000);
  }

  async performHealthChecks() {
    console.log('🏥 Performing health checks...');
    
    for (let i = 0; i < this.options.healthCheckRetries; i++) {
      try {
        const response = await fetch('http://localhost:3000/health', {
          timeout: 5000
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.status === 'healthy') {
            console.log('✅ Health check passed');
            return;
          }
        }
      } catch (error) {
        console.log(`Health check attempt ${i + 1} failed`);
      }
      
      if (i < this.options.healthCheckRetries - 1) {
        await this.sleep(this.options.healthCheckDelay);
      }
    }
    
    throw new Error('Health checks failed');
  }

  async postUpdateTasks() {
    console.log('📋 Running post-update tasks...');
    
    // Clear caches
    await this.clearCaches();
    
    // Update version info
    await this.updateVersionInfo();
    
    // Disable maintenance mode
    await this.disableMaintenanceMode();
    
    // Warm up caches
    await this.warmupCaches();
    
    // Send notification
    await this.sendUpdateNotification();
  }

  async clearCaches() {
    // Clear Redis
    await this.exec('redis-cli FLUSHDB');
    
    // Clear CDN
    await this.exec(`
      aws cloudfront create-invalidation \
        --distribution-id ${process.env.CLOUDFRONT_DISTRIBUTION_ID} \
        --paths "/*"
    `);
    
    // Clear application caches
    await this.exec('rm -rf /app/.cache /app/node_modules/.cache');
  }

  async rollback() {
    console.log('🔄 Rolling back to previous version...');
    
    if (!this.backupPath) {
      throw new Error('No backup available for rollback');
    }
    
    // Stop application
    await this.exec('pm2 stop dgrealtors');
    
    // Restore files
    await this.exec(`tar -xzf ${this.backupPath} -C /`);
    
    // Restore database if needed
    const dbBackup = `${this.backupPath}.sql.gz`;
    if (await this.fileExists(dbBackup)) {
      await this.exec(`gunzip < ${dbBackup} | psql $DATABASE_URL`);
    }
    
    // Start application
    await this.exec('pm2 start dgrealtors');
    
    console.log('✅ Rollback completed');
  }

  // Helper methods
  async exec(command) {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) reject(error);
        else resolve({ stdout, stderr });
      });
    });
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getCurrentVersion() {
    try {
      const packageJson = await fs.readFile('/app/package.json', 'utf8');
      return JSON.parse(packageJson).version;
    } catch {
      return 'unknown';
    }
  }
}

// CLI interface
if (require.main === module) {
  const updater = new ApplicationUpdater({
    version: process.argv[2],
    environment: process.env.NODE_ENV || 'production'
  });
  
  updater.update().catch(error => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = ApplicationUpdater;

System Updates
#!/bin/bash
# system-updates.sh

set -e

echo "🔧 Starting system updates..."

# Create update log
UPDATE_LOG="/var/log/dgrealtors/system-update-$(date +%Y%m%d-%H%M%S).log"
exec 1> >(tee -a "$UPDATE_LOG")
exec 2>&1

# 1. Update package lists
echo "📋 Updating package lists..."
apt-get update

# 2. List available updates
echo "📦 Available updates:"
apt list --upgradable

# 3. Create system restore point
echo "💾 Creating system restore point..."
timeshift --create --comments "Pre-update snapshot $(date +%Y%m%d)"

# 4. Install security updates
echo "🔒 Installing security updates..."
unattended-upgrade -d

# 5. Update Docker images
echo "🐳 Updating Docker images..."
docker images --format "table {{.Repository}}:{{.Tag}}\t{{.ID}}" | \
while read -r image id; do
  if [[ ! "$image" =~ ^dgrealtors ]]; then
    echo "Pulling $image..."
    docker pull "$image" || true
  fi
done

# 6. Update Node.js (if needed)
echo "📦 Checking Node.js version..."
CURRENT_NODE=$(node --version)
LATEST_NODE=$(curl -s https://nodejs.org/dist/latest-v18.x/ | grep -o 'v18\.[0-9]*\.[0-9]*' | head -1)

if [ "$CURRENT_NODE" != "$LATEST_NODE" ]; then
  echo "Updating Node.js from $CURRENT_NODE to $LATEST_NODE..."
  n install $LATEST_NODE
  n use $LATEST_NODE
fi

# 7. Update system packages (interactive)
echo "🔄 System packages requiring manual update:"
apt list --upgradable 2>/dev/null | grep -v "Listing..." || echo "None"

# 8. Clean up
echo "🧹 Cleaning up..."
apt-get autoremove -y
apt-get autoclean
docker system prune -f

# 9. Verify system health
echo "🏥 Verifying system health..."
systemctl status nginx
systemctl status docker
pm2 status

echo "✅ System updates completed!"

SSL Certificate Updates
// ssl-update.js
const { exec } = require('child_process');
const fs = require('fs').promises;
const crypto = require('crypto');

class SSLManager {
  constructor() {
    this.domains = ['dgrealtors.com', 'www.dgrealtors.com'];
    this.email = 'admin@dgrealtors.com';
    this.certPath = '/etc/letsencrypt/live/dgrealtors.com';
  }

  async checkCertificate() {
    console.log('🔐 Checking SSL certificate...');
    
    const certInfo = await this.getCertificateInfo();
    const daysUntilExpiry = this.getDaysUntilExpiry(certInfo.notAfter);
    
    console.log(`Certificate expires in ${daysUntilExpiry} days`);
    
    if (daysUntilExpiry < 30) {
      console.log('⚠️  Certificate expiring soon!');
      await this.renewCertificate();
    } else if (daysUntilExpiry < 7) {
      console.log('🚨 URGENT: Certificate expiring!');
      await this.emergencyRenewal();
    }
    
    return {
      issuer: certInfo.issuer,
      subject: certInfo.subject,
      notBefore: certInfo.notBefore,
      notAfter: certInfo.notAfter,
      daysUntilExpiry,
      fingerprint: certInfo.fingerprint
    };
  }

  async getCertificateInfo() {
    const { stdout } = await this.exec(`
      openssl x509 -in ${this.certPath}/cert.pem -noout -text
    `);
    
    // Parse certificate details
    const info = {
      issuer: stdout.match(/Issuer: (.+)/)[1],
      subject: stdout.match(/Subject: (.+)/)[1],
      notBefore: new Date(stdout.match(/Not Before: (.+)/)[1]),
      notAfter: new Date(stdout.match(/Not After : (.+)/)[1])
    };
    
    // Get fingerprint
    const { stdout: fingerprint } = await this.exec(`
      openssl x509 -in ${this.certPath}/cert.pem -noout -fingerprint -sha256
    `);
    info.fingerprint = fingerprint.trim();
    
    return info;
  }

  getDaysUntilExpiry(notAfter) {
    const now = new Date();
    const expiry = new Date(notAfter);
    const diff = expiry - now;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  async renewCertificate() {
    console.log('🔄 Renewing SSL certificate...');
    
    // Pre-renewal backup
    await this.backupCertificates();
    
    try {
      // Test renewal first
      const { stdout: dryRun } = await this.exec(`
        certbot renew --dry-run \
          --nginx \
          --agree-tos \
          --email ${this.email} \
          --no-eff-email
      `);
      
      console.log('Dry run successful');
      
      // Actual renewal
      const { stdout } = await this.exec(`
        certbot renew \
          --nginx \
          --agree-tos \
          --email ${this.email} \
          --no-eff-email \
          --force-renewal
      `);
      
      // Verify new certificate
      await this.verifyCertificate();
      
      // Reload services
      await this.reloadServices();
      
      // Update monitoring
      await this.updateMonitoring();
      
      console.log('✅ Certificate renewed successfully!');
      
    } catch (error) {
      console.error('❌ Certificate renewal failed:', error);
      await this.restoreCertificates();
      throw error;
    }
  }

  async backupCertificates() {
    const backupDir = `/backups/ssl/backup-${Date.now()}`;
    await fs.mkdir(backupDir, { recursive: true });
    
    await this.exec(`
      cp -r ${this.certPath} ${backupDir}/
      cp -r /etc/nginx/ssl ${backupDir}/nginx-ssl || true
    `);
    
    this.backupPath = backupDir;
  }

  async restoreCertificates() {
    if (!this.backupPath) {
      throw new Error('No backup available');
    }
    
    await this.exec(`
      cp -r ${this.backupPath}/* /etc/letsencrypt/live/
      systemctl reload nginx
    `);
  }

  async verifyCertificate() {
    // Verify certificate chain
    const { stdout: verify } = await this.exec(`
      openssl verify -CAfile ${this.certPath}/chain.pem ${this.certPath}/cert.pem
    `);
    
    if (!verify.includes('OK')) {
      throw new Error('Certificate verification failed');
    }
    
    // Test HTTPS
    const response = await fetch('https://dgrealtors.com', {
      timeout: 5000
    });
    
    if (!response.ok) {
      throw new Error('HTTPS test failed');
    }
    
    // Check SSL Labs rating
    await this.checkSSLRating();
  }

  async checkSSLRating() {
    const response = await fetch(
      `https://api.ssllabs.com/api/v3/analyze?host=dgrealtors.com&publish=off&all=done`
    );
    
    const result = await response.json();
    
    if (result.endpoints) {
      for (const endpoint of result.endpoints) {
        if (endpoint.grade && endpoint.grade > 'B') {
          console.warn(`⚠️  SSL Labs grade: ${endpoint.grade}`);
        }
      }
    }
  }

  async reloadServices() {
    console.log('🔄 Reloading services...');
    
    // Reload Nginx
    await this.exec('nginx -t && systemctl reload nginx');
    
    // Restart Node.js app if using HTTPS directly
    await this.exec('pm2 reload dgrealtors --update-env');
  }

  async updateMonitoring() {
    // Update Uptime Robot
    if (process.env.UPTIME_ROBOT_API_KEY) {
      await fetch('https://api.uptimerobot.com/v2/editMonitor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          api_key: process.env.UPTIME_ROBOT_API_KEY,
          id: process.env.UPTIME_ROBOT_MONITOR_ID,
          ssl_check_threshold: 30
        })
      });
    }
    
    // Send notification
    await this.sendNotification();
  }

  async sendNotification() {
    const certInfo = await this.getCertificateInfo();
    
    const message = {
      text: '🔐 SSL Certificate Updated',
      blocks: [{
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*SSL Certificate Renewed Successfully*\n` +
                `Domain: dgrealtors.com\n` +
                `Valid Until: ${certInfo.notAfter.toLocaleDateString()}\n` +
                `Days Until Expiry: ${this.getDaysUntilExpiry(certInfo.notAfter)}`
        }
      }]
    };
    
    await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    });
  }

  async emergencyRenewal() {
    console.log('🚨 Emergency certificate renewal!');
    
    // Try multiple renewal methods
    const methods = [
      () => this.renewWithCertbot(),
      () => this.renewWithACME(),
      () => this.installBackupCertificate()
    ];
    
    for (const method of methods) {
      try {
        await method();
        console.log('✅ Emergency renewal successful');
        return;
      } catch (error) {
        console.error('Method failed:', error);
      }
    }
    
    throw new Error('All renewal methods failed');
  }

  async exec(command) {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) reject(error);
        else resolve({ stdout, stderr });
      });
    });
  }
}

// Schedule automatic checks
if (require.main === module) {
  const manager = new SSLManager();
  
  // Run immediate check
  manager.checkCertificate().catch(console.error);
  
  // Schedule daily checks
  setInterval(() => {
    manager.checkCertificate().catch(console.error);
  }, 24 * 60 * 60 * 1000);
}

module.exports = SSLManager;

Database Maintenance
Database Optimization
-- database-maintenance.sql

-- 1. Update Statistics
ANALYZE;

-- 2. Find and Remove Unused Indexes
WITH unused_indexes AS (
  SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan,
    pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
  FROM pg_stat_user_indexes
  WHERE idx_scan = 0
    AND indexrelname NOT LIKE 'pg_toast%'
    AND schemaname NOT IN ('pg_catalog', 'information_schema')
  ORDER BY pg_relation_size(indexrelid) DESC
)
SELECT * FROM unused_indexes;

-- 3. Find Missing Indexes
WITH missing_indexes AS (
  SELECT
    schemaname,
    tablename,
    attname,
    n_distinct,
    most_common_vals
  FROM pg_stats
  WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
    AND n_distinct > 100
    AND tablename||'.'||attname NOT IN (
      SELECT tablename||'.'||attname
      FROM pg_stats s
      JOIN pg_index i ON s.tablename = i.indrelid::regclass::text
      WHERE s.schemaname NOT IN ('pg_catalog', 'information_schema')
    )
  ORDER BY n_distinct DESC
)
SELECT * FROM missing_indexes LIMIT 20;

-- 4. Table Bloat Analysis
WITH bloat_data AS (
  SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size,
    ROUND(100 * pg_relation_size(schemaname||'.'||tablename) / 
      NULLIF(SUM(pg_relation_size(schemaname||'.'||tablename)) OVER (), 0), 2) AS pct_of_db,
    relpages::BIGINT * 8 AS size_kb,
    ROUND(100 * (relpages::BIGINT * 8 - pg_relation_size(schemaname||'.'||tablename) / 1024) / 
      NULLIF(relpages::BIGINT * 8, 0), 2) AS bloat_pct
  FROM pg_stat_user_tables
  JOIN pg_class ON relname = tablename
  WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
    AND relpages > 0
)
SELECT * FROM bloat_data
WHERE bloat_pct > 20
ORDER BY bloat_pct DESC;

-- 5. Long-Running Queries
SELECT
  pid,
  now() - pg_stat_activity.query_start AS duration,
  query,
  state
FROM pg_stat_activity
WHERE (now() - pg_stat_activity.query_start) > interval '5 minutes'
  AND state != 'idle'
ORDER BY duration DESC;

-- 6. Connection Pool Status
SELECT
  datname,
  usename,
  application_name,
  client_addr,
  COUNT(*) AS connection_count
FROM pg_stat_activity
GROUP BY datname, usename, application_name, client_addr
ORDER BY connection_count DESC;

-- 7. Table Maintenance
DO $$
DECLARE
  r RECORD;
BEGIN
  -- Vacuum and analyze tables with high dead tuples
  FOR r IN
    SELECT
      schemaname,
      tablename,
      n_dead_tup,
      n_live_tup,
      ROUND(100.0 * n_dead_tup / NULLIF(n_live_tup + n_dead_tup, 0), 2) AS dead_pct
    FROM pg_stat_user_tables
    WHERE n_dead_tup > 1000
      AND (n_dead_tup > n_live_tup * 0.1)
    ORDER BY n_dead_tup DESC
  LOOP
    EXECUTE format('VACUUM ANALYZE %I.%I', r.schemaname, r.tablename);
    RAISE NOTICE 'Vacuumed table: %.%', r.schemaname, r.tablename;
  END LOOP;
END$$;

-- 8. Partition Maintenance (if using partitions)
-- Drop old partitions
DO $$
DECLARE
  r RECORD;
  cutoff_date DATE := CURRENT_DATE - INTERVAL '90 days';
BEGIN
  FOR r IN
    SELECT
      schemaname,
      tablename
    FROM pg_tables
    WHERE tablename LIKE '%_2%' -- Assuming date-based naming
      AND schemaname = 'public'
  LOOP
    -- Extract date from partition name and check if old
    -- This is example logic - adjust based on your naming convention
    IF r.tablename < 'logs_' || to_char(cutoff_date, 'YYYY_MM') THEN
      EXECUTE format('DROP TABLE %I.%I', r.schemaname, r.tablename);
      RAISE NOTICE 'Dropped old partition: %.%', r.schemaname, r.tablename;
    END IF;
  END LOOP;
END$$;

Database Backup Script
#!/bin/bash
# database-backup.sh

set -e

# Configuration
DB_NAME="dgrealtors"
BACKUP_DIR="/backups/postgres"
S3_BUCKET="dgrealtors-db-backups"
RETENTION_DAYS=30
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Ensure backup directory exists
mkdir -p $BACKUP_DIR

echo "🗄️ Starting database backup..."

# 1. Full backup with custom format
echo "Creating full backup..."
pg_dump -Fc -Z9 \
  -f "$BACKUP_DIR/full_${TIMESTAMP}.dump" \
  $DATABASE_URL

# 2. Schema-only backup
echo "Creating schema backup..."
pg_dump --schema-only \
  -f "$BACKUP_DIR/schema_${TIMESTAMP}.sql" \
  $DATABASE_URL

# 3. Data-only backup (for specific tables)
echo "Creating data backups..."
IMPORTANT_TABLES="users properties transactions contacts"
for table in $IMPORTANT_TABLES; do
  pg_dump --data-only \
    -t $table \
    -f "$BACKUP_DIR/data_${table}_${TIMESTAMP}.sql" \
    $DATABASE_URL
done

# 4. Create compressed archive
echo "Creating archive..."
tar -czf "$BACKUP_DIR/backup_${TIMESTAMP}.tar.gz" \
  -C "$BACKUP_DIR" \
  "full_${TIMESTAMP}.dump" \
  "schema_${TIMESTAMP}.sql" \
  $(ls $BACKUP_DIR/data_*_${TIMESTAMP}.sql | xargs basename -a)

# 5. Upload to S3
echo "Uploading to S3..."
aws s3 cp "$BACKUP_DIR/backup_${TIMESTAMP}.tar.gz" \
  "s3://$S3_BUCKET/daily/" \
  --storage-class STANDARD_IA

# 6. Create weekly backup (on Sundays)
if [ $(date +%u) -eq 7 ]; then
  aws s3 cp "$BACKUP_DIR/backup_${TIMESTAMP}.tar.gz" \
    "s3://$S3_BUCKET/weekly/"
fi

# 7. Create monthly backup (on 1st)
if [ $(date +%d) -eq 01 ]; then
  aws s3 cp "$BACKUP_DIR/backup_${TIMESTAMP}.tar.gz" \
    "s3://$S3_BUCKET/monthly/"
fi

# 8. Cleanup local backups
echo "Cleaning up local backups..."
find $BACKUP_DIR -name "*.dump" -o -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete

# 9. Cleanup S3 backups
echo "Cleaning up S3 backups..."
# Daily backups - keep 30 days
aws s3 ls "s3://$S3_BUCKET/daily/" | while read -r line; do
  createDate=$(echo $line | awk '{print $1" "$2}')
  createDate=$(date -d "$createDate" +%s)
  olderThan=$(date -d "$RETENTION_DAYS days ago" +%s)
  
  if [ $createDate -lt $olderThan ]; then
    fileName=$(echo $line | awk '{print $4}')
    aws s3 rm "s3://$S3_BUCKET/daily/$fileName"
  fi
done

# 10. Verify backup
echo "Verifying backup..."
pg_restore --list "$BACKUP_DIR/full_${TIMESTAMP}.dump" > /dev/null

# 11. Test restore (on test database)
if [ "$TEST_RESTORE" = "true" ]; then
  echo "Testing restore..."
  createdb test_restore_$TIMESTAMP
  pg_restore -d test_restore_$TIMESTAMP "$BACKUP_DIR/full_${TIMESTAMP}.dump"
  dropdb test_restore_$TIMESTAMP
  echo "Test restore successful"
fi

echo "✅ Database backup completed!"

# Send notification
curl -X POST $SLACK_WEBHOOK_URL \
  -H 'Content-Type: application/json' \
  -d @- << EOF
{
  "text": "Database Backup Completed",
  "blocks": [{
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": "*Database*: $DB_NAME\n*Size*: $(du -h $BACKUP_DIR/backup_${TIMESTAMP}.tar.gz | cut -f1)\n*Location*: s3://$S3_BUCKET/daily/backup_${TIMESTAMP}.tar.gz"
    }
  }]
}
EOF

Performance Optimization
Performance Monitoring
// performance-monitor.js
const os = require('os');
const v8 = require('v8');
const { performance } = require('perf_hooks');

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      cpu: [],
      memory: [],
      requests: [],
      database: [],
      cache: []
    };
    
    this.thresholds = {
      cpu: 80, // percentage
      memory: 85, // percentage
      responseTime: 1000, // milliseconds
      errorRate: 1 // percentage
    };
  }

  async collectMetrics() {
    const metrics = {
      timestamp: new Date().toISOString(),
      system: await this.getSystemMetrics(),
      application: await this.getApplicationMetrics(),
      database: await this.getDatabaseMetrics(),
      cache: await this.getCacheMetrics(),
      network: await this.getNetworkMetrics()
    };
    
    // Store metrics
    await this.storeMetrics(metrics);
    
    // Check thresholds
    await this.checkThresholds(metrics);
    
    return metrics;
  }

  async getSystemMetrics() {
    const cpuUsage = process.cpuUsage();
    const memUsage = process.memoryUsage();
    
    return {
      cpu: {
        usage: this.getCPUPercentage(),
        loadAverage: os.loadavg(),
        cores: os.cpus().length
      },
      memory: {
        total: os.totalmem(),
        free: os.freemem(),
        used: os.totalmem() - os.freemem(),
        percentage: ((os.totalmem() - os.freemem()) / os.totalmem()) * 100,
        heap: {
          total: memUsage.heapTotal,
          used: memUsage.heapUsed,
          limit: v8.getHeapStatistics().heap_size_limit
        }
      },
      uptime: {
        system: os.uptime(),
        process: process.uptime()
      }
    };
  }

  async getApplicationMetrics() {
    // Get PM2 metrics if available
    const pm2Metrics = await this.getPM2Metrics();
    
    // Request metrics
    const requestMetrics = await this.getRequestMetrics();
    
    // Event loop metrics
    const eventLoop = await this.getEventLoopMetrics();
    
    return {
      pm2: pm2Metrics,
      requests: requestMetrics,
      eventLoop: eventLoop,
      gc: v8.getHeapStatistics(),
      handles: process._getActiveHandles().length,
      requests_per_second: this.calculateRPS()
    };
  }

  async getDatabaseMetrics() {
    if (!process.env.DATABASE_URL) return null;
    
    const { Client } = require('pg');
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    
    try {
      await client.connect();
      
      // Connection stats
      const { rows: [connStats] } = await client.query(`
        SELECT
          numbackends AS active_connections,
          xact_commit AS transactions_committed,
          xact_rollback AS transactions_rolled_back,
          blks_read AS blocks_read,
          blks_hit AS blocks_hit,
          tup_returned AS rows_returned,
          tup_fetched AS rows_fetched,
          tup_inserted AS rows_inserted,
          tup_updated AS rows_updated,
          tup_deleted AS rows_deleted
        FROM pg_stat_database
        WHERE datname = current_database()
      `);
      
      // Table sizes
      const { rows: tableSizes } = await client.query(`
        SELECT
          relname AS table_name,
          pg_size_pretty(pg_total_relation_size(relid)) AS total_size,
          pg_size_pretty(pg_relation_size(relid)) AS table_size,
          pg_size_pretty(pg_indexes_size(relid)) AS indexes_size
        FROM pg_stat_user_tables
        ORDER BY pg_total_relation_size(relid) DESC
        LIMIT 10
      `);
      
      // Slow queries
      const { rows: slowQueries } = await client.query(`
        SELECT
          query,
          calls,
          total_exec_time,
          mean_exec_time,
          stddev_exec_time,
          rows
        FROM pg_stat_statements
        WHERE mean_exec_time > 100
        ORDER BY mean_exec_time DESC
        LIMIT 10
      `);
      
      return {
        connections: connStats,
        tables: tableSizes,
        slowQueries: slowQueries,
        cacheHitRatio: connStats.blocks_hit / (connStats.blocks_hit + connStats.blocks_read)
      };
      
    } finally {
      await client.end();
    }
  }

  async getCacheMetrics() {
    const redis = require('redis');
    const client = redis.createClient({ url: process.env.REDIS_URL });
    
    try {
      await client.connect();
      
      const info = await client.info();
      const stats = this.parseRedisInfo(info);
      
      const dbSize = await client.dbSize();
      const memoryUsage = stats.used_memory_human;
      
      return {
        size: dbSize,
        memory: memoryUsage,
        hitRate: stats.keyspace_hits / (stats.keyspace_hits + stats.keyspace_misses),
        evictedKeys: stats.evicted_keys,
        connectedClients: stats.connected_clients,
        ops_per_sec: stats.instantaneous_ops_per_sec
      };
      
    } finally {
      await client.disconnect();
    }
  }

  async getNetworkMetrics() {
    // CDN metrics
    const cdnMetrics = await this.getCDNMetrics();
    
    // Response times
    const endpoints = [
      { name: 'homepage', url: 'https://dgrealtors.com' },
      { name: 'api', url: 'https://api.dgrealtors.com/health' },
      { name: 'cdn', url: 'https://cdn.dgrealtors.com/health.txt' }
    ];
    
    const responseTimings = await Promise.all(
      endpoints.map(async endpoint => {
        const start = performance.now();
        try {
          const response = await fetch(endpoint.url, { timeout: 5000 });
          const end = performance.now();
          return {
            ...endpoint,
            status: response.status,
            time: end - start,
            success: response.ok
          };
        } catch (error) {
          return {
            ...endpoint,
            status: 0,
            time: 5000,
            success: false,
            error: error.message
          };
        }
      })
    );
    
    return {
      cdn: cdnMetrics,
      endpoints: responseTimings,
      averageResponseTime: responseTimings.reduce((sum, r) => sum + r.time, 0) / responseTimings.length
    };
  }

  async getCDNMetrics() {
    // CloudFront metrics
    const cloudWatch = new AWS.CloudWatch({ region: 'us-east-1' });
    
    const params = {
      MetricName: 'BytesDownloaded',
      Namespace: 'AWS/CloudFront',
      StartTime: new Date(Date.now() - 3600000), // 1 hour ago
      EndTime: new Date(),
      Period: 300, // 5 minutes
      Statistics: ['Sum', 'Average'],
      Dimensions: [{
        Name: 'DistributionId',
        Value: process.env.CLOUDFRONT_DISTRIBUTION_ID
      }]
    };
    
    const data = await cloudWatch.getMetricStatistics(params).promise();
    
    return {
      bytesDownloaded: data.Datapoints.reduce((sum, d) => sum + d.Sum, 0),
      requests: data.Datapoints.length,
      cacheHitRate: await this.getCDNCacheHitRate()
    };
  }

  async checkThresholds(metrics) {
    const alerts = [];
    
    // CPU check
    if (metrics.system.cpu.usage > this.thresholds.cpu) {
      alerts.push({
        type: 'cpu',
        severity: 'warning',
        message: `CPU usage at ${metrics.system.cpu.usage.toFixed(2)}%`,
        value: metrics.system.cpu.usage,
        threshold: this.thresholds.cpu
      });
    }
    
    // Memory check
    if (metrics.system.memory.percentage > this.thresholds.memory) {
      alerts.push({
        type: 'memory',
        severity: 'warning',
        message: `Memory usage at ${metrics.system.memory.percentage.toFixed(2)}%`,
        value: metrics.system.memory.percentage,
        threshold: this.thresholds.memory
      });
    }
    
    // Response time check
    if (metrics.network.averageResponseTime > this.thresholds.responseTime) {
      alerts.push({
        type: 'response_time',
        severity: 'critical',
        message: `Average response time: ${metrics.network.averageResponseTime.toFixed(0)}ms`,
        value: metrics.network.averageResponseTime,
        threshold: this.thresholds.responseTime
      });
    }
    
    // Send alerts if any
    if (alerts.length > 0) {
      await this.sendAlerts(alerts);
    }
  }

  async sendAlerts(alerts) {
    // Group by severity
    const critical = alerts.filter(a => a.severity === 'critical');
    const warnings = alerts.filter(a => a.severity === 'warning');
    
    if (critical.length > 0) {
      // Send immediate notification
      await this.sendSlackAlert(critical, 'critical');
      await this.sendPagerDuty(critical);
    }
    
    if (warnings.length > 0) {
      // Send warning notification
      await this.sendSlackAlert(warnings, 'warning');
    }
  }

  getCPUPercentage() {
    const cpus = os.cpus();
    let idle = 0;
    let total = 0;
    
    cpus.forEach(cpu => {
      for (const type in cpu.times) {
        total += cpu.times[type];
      }
      idle += cpu.times.idle;
    });
    
    return 100 - ~~(100 * idle / total);
  }

  parseRedisInfo(info) {
    const lines = info.split('\r\n');
    const stats = {};
    
    lines.forEach(line => {
      const [key, value] = line.split(':');
      if (key && value) {
        stats[key] = isNaN(value) ? value : Number(value);
      }
    });
    
    return stats;
  }
}

// Performance optimization script
async function optimizePerformance() {
  console.log('🚀 Running performance optimization...');
  
  const monitor = new PerformanceMonitor();
  const metrics = await monitor.collectMetrics();
  
  // 1. Clear unnecessary caches
  if (metrics.system.memory.percentage > 70) {
    console.log('Clearing caches due to high memory usage...');
    await exec('sync && echo 3 > /proc/sys/vm/drop_caches');
  }
  
  // 2. Optimize database
  if (metrics.database?.cacheHitRatio < 0.9) {
    console.log('Optimizing database...');
    await exec('psql $DATABASE_URL -c "VACUUM ANALYZE;"');
  }
  
  // 3. Restart workers if needed
  if (metrics.system.cpu.usage > 90) {
    console.log('Restarting PM2 workers...');
    await exec('pm2 reload dgrealtors');
  }
  
  // 4. Clean up old files
  await exec('find /tmp -type f -mtime +1 -delete');
  await exec('find /var/log -name "*.log" -mtime +7 -exec gzip {} \\;');
  
  console.log('✅ Performance optimization completed');
}

module.exports = { PerformanceMonitor, optimizePerformance };

CDN Optimization
// cdn-optimization.js
class CDNOptimizer {
  constructor() {
    this.cloudfront = new AWS.CloudFront();
    this.s3 = new AWS.S3();
    this.distributionId = process.env.CLOUDFRONT_DISTRIBUTION_ID;
  }

  async optimizeCDN() {
    console.log('🌐 Optimizing CDN configuration...');
    
    try {
      // 1. Update cache behaviors
      await this.updateCacheBehaviors();
      
      // 2. Optimize origins
      await this.optimizeOrigins();
      
      // 3. Update security headers
      await this.updateSecurityHeaders();
      
      // 4. Enable compression
      await this.enableCompression();
      
      // 5. Set up custom error pages
      await this.setupErrorPages();
      
      // 6. Configure geo restrictions
      await this.configureGeoRestrictions();
      
      // 7. Analyze and report
      const report = await this.generateOptimizationReport();
      
      console.log('✅ CDN optimization completed');
      return report;
      
    } catch (error) {
      console.error('❌ CDN optimization failed:', error);
      throw error;
    }
  }

  async updateCacheBehaviors() {
    const config = await this.getDistributionConfig();
    
    // Optimize cache behaviors
    const behaviors = [
      {
        PathPattern: '*.js',
        TargetOriginId: 'S3-Origin',
        ViewerProtocolPolicy: 'redirect-to-https',
        CachePolicyId: await this.createCachePolicy('js-files', {
          DefaultTTL: 31536000, // 1 year
          MaxTTL: 31536000,
          MinTTL: 31536000
        }),
        Compress: true
      },
      {
        PathPattern: '*.css',
        TargetOriginId: 'S3-Origin',
        ViewerProtocolPolicy: 'redirect-to-https',
        CachePolicyId: await this.createCachePolicy('css-files', {
          DefaultTTL: 31536000, // 1 year
          MaxTTL: 31536000,
          MinTTL: 31536000
        }),
        Compress: true
      },
      {
        PathPattern: '*.jpg',
        TargetOriginId: 'S3-Origin',
        ViewerProtocolPolicy: 'redirect-to-https',
        CachePolicyId: await this.createCachePolicy('images', {
          DefaultTTL: 86400 * 30, // 30 days
          MaxTTL: 31536000,
          MinTTL: 0
        }),
        Compress: false
      },
      {
        PathPattern: '*.png',
        TargetOriginId: 'S3-Origin',
        ViewerProtocolPolicy: 'redirect-to-https',
        CachePolicyId: await this.createCachePolicy('images', {
          DefaultTTL: 86400 * 30, // 30 days
          MaxTTL: 31536000,
          MinTTL: 0
        }),
        Compress: false
      },
      {
        PathPattern: '/api/*',
        TargetOriginId: 'API-Origin',
        ViewerProtocolPolicy: 'https-only',
        CachePolicyId: await this.createCachePolicy('api', {
          DefaultTTL: 0,
          MaxTTL: 0,
          MinTTL: 0
        }),
        AllowedMethods: ['GET', 'HEAD', 'OPTIONS', 'PUT', 'POST', 'PATCH', 'DELETE'],
        Compress: true
      }
    ];
    
    config.CacheBehaviors = behaviors;
    await this.updateDistribution(config);
  }

  async createCachePolicy(name, settings) {
    try {
      const response = await this.cloudfront.createCachePolicy({
        CachePolicyConfig: {
          Name: `dgrealtors-${name}-${Date.now()}`,
          DefaultTTL: settings.DefaultTTL,
          MaxTTL: settings.MaxTTL,
          MinTTL: settings.MinTTL,
          ParametersInCacheKeyAndForwardedToOrigin: {
            EnableAcceptEncodingGzip: true,
            EnableAcceptEncodingBrotli: true,
            QueryStringsConfig: {
              QueryStringBehavior: 'none'
            },
            HeadersConfig: {
              HeaderBehavior: 'none'
            },
            CookiesConfig: {
              CookieBehavior: 'none'
            }
          }
        }
      }).promise();
      
      return response.CachePolicy.Id;
    } catch (error) {
      // Return existing policy ID if creation fails
      return 'existing-policy-id';
    }
  }

  async optimizeOrigins() {
    // Configure origin request policies
    const originRequestPolicy = {
      OriginRequestPolicyConfig: {
        Name: `dgrealtors-origin-policy-${Date.now()}`,
        HeadersConfig: {
          HeaderBehavior: 'whitelist',
          Headers: {
            Items: [
              'CloudFront-Viewer-Country',
              'CloudFront-Is-Mobile-Viewer',
              'CloudFront-Is-Tablet-Viewer'
            ]
          }
        },
        CookiesConfig: {
          CookieBehavior: 'none'
        },
        QueryStringsConfig: {
          QueryStringBehavior: 'all'
        }
      }
    };
    
    await this.cloudfront.createOriginRequestPolicy(originRequestPolicy).promise();
  }

  async enableCompression() {
    // Ensure all text-based content is compressed
    const compressionTypes = [
      'text/html',
      'text/css',
      'text/javascript',
      'application/javascript',
      'application/json',
      'application/xml',
      'image/svg+xml'
    ];
    
    // Update S3 objects to have correct content-encoding
    const objects = await this.s3.listObjectsV2({
      Bucket: 'dgrealtors-assets'
    }).promise();
    
    for (const object of objects.Contents || []) {
      const extension = object.Key.split('.').pop();
      if (['js', 'css', 'html', 'json', 'xml', 'svg'].includes(extension)) {
        // Check if already compressed
        const headObject = await this.s3.headObject({
          Bucket: 'dgrealtors-assets',
          Key: object.Key
        }).promise();
        
        if (!headObject.ContentEncoding) {
          // Compress and re-upload
          console.log(`Compressing ${object.Key}...`);
          // Implementation depends on your needs
        }
      }
    }
  }

  async generateOptimizationReport() {
    const metrics = await this.getCDNMetrics();
    
    const report = {
      timestamp: new Date().toISOString(),
      distribution: this.distributionId,
      metrics: {
        cacheHitRate: metrics.CacheStatistics.CacheHitRate,
        bytesDownloaded: metrics.BytesDownloaded,
        bytesUploaded: metrics.BytesUploaded,
        requests: metrics.Requests,
        errors: {
          rate4xx: metrics.ErrorRate4xx,
          rate5xx: metrics.ErrorRate5xx
        }
      },
      optimizations: {
        cacheBehaviors: 'updated',
        compression: 'enabled',
        securityHeaders: 'configured',
        geoRestrictions: 'configured'
      },
      recommendations: await this.getOptimizationRecommendations(metrics)
    };
    
    // Save report
    await fs.writeFile(
      `/reports/cdn-optimization-${Date.now()}.json`,
      JSON.stringify(report, null, 2)
    );
    
    return report;
  }

  async getCDNMetrics() {
    const cloudWatch = new AWS.CloudWatch({ region: 'us-east-1' });
    
    const metricNames = [
      'BytesDownloaded',
      'BytesUploaded',
      'Requests',
      'CacheHitRate',
      '4xxErrorRate',
      '5xxErrorRate'
    ];
    
    const metrics = {};
    
    for (const metricName of metricNames) {
      const params = {
        MetricName: metricName,
        Namespace: 'AWS/CloudFront',
        StartTime: new Date(Date.now() - 86400000), // 24 hours ago
        EndTime: new Date(),
        Period: 3600, // 1 hour
        Statistics: ['Sum', 'Average'],
        Dimensions: [{
          Name: 'DistributionId',
          Value: this.distributionId
        }]
      };
      
      const data = await cloudWatch.getMetricStatistics(params).promise();
      metrics[metricName] = data.Datapoints;
    }
    
    return metrics;
  }

  async getOptimizationRecommendations(metrics) {
    const recommendations = [];
    
    // Cache hit rate
    if (metrics.CacheStatistics.CacheHitRate < 0.8) {
      recommendations.push({
        type: 'cache',
        priority: 'high',
        message: 'Cache hit rate is below 80%. Consider increasing cache TTLs for static assets.'
      });
    }
    
    // Error rates
    if (metrics.ErrorRate4xx > 0.01) {
      recommendations.push({
        type: 'errors',
        priority: 'medium',
        message: '4xx error rate is above 1%. Review missing resources and access permissions.'
      });
    }
    
    if (metrics.ErrorRate5xx > 0.001) {
      recommendations.push({
        type: 'errors',
        priority: 'high',
        message: '5xx error rate detected. Check origin server health and capacity.'
      });
    }
    
    // Bandwidth optimization
    const avgObjectSize = metrics.BytesDownloaded / metrics.Requests;
    if (avgObjectSize > 1024 * 1024) { // 1MB
      recommendations.push({
        type: 'bandwidth',
        priority: 'medium',
        message: 'Average object size is large. Consider implementing image optimization and lazy loading.'
      });
    }
    
    return recommendations;
  }
}

module.exports = CDNOptimizer;

Security Maintenance
Security Audit Script
#!/bin/bash
# security-audit.sh

set -e

echo "🔒 Starting comprehensive security audit..."
AUDIT_DIR="/audits/security-$(date +%Y%m%d-%H%M%S)"
mkdir -p $AUDIT_DIR

# 1. System Security
echo "Checking system security..."
cat > $AUDIT_DIR/system-security.txt << EOF
=== System Security Audit ===
Date: $(date)

1. OS Version and Updates:
$(lsb_release -a 2>/dev/null || cat /etc/os-release)

2. Pending Security Updates:
$(apt list --upgradable 2>/dev/null | grep -i security || echo "None")

3. Open Ports:
$(netstat -tuln)

4. Firewall Status:
$(ufw status verbose)

5. Failed Login Attempts:
$(grep "Failed password" /var/log/auth.log | tail -20 || echo "None recent")

6. User Accounts:
$(cat /etc/passwd | grep -E ":[0-9]{4}:" | cut -d: -f1,3,7)

7. Sudo Users:
$(grep -Po '^sudo:.*:\K.*' /etc/group)

8. SSH Configuration:
$(sshd -T | grep -E "(permitrootlogin|passwordauthentication|pubkeyauthentication)")
EOF

# 2. Application Security
echo "Checking application security..."
cd /app

# Dependency vulnerabilities
npm audit --json > $AUDIT_DIR/npm-audit.json
npm audit > $AUDIT_DIR/npm-audit.txt

# License check
npx license-checker --json > $AUDIT_DIR/licenses.json

# Security headers test
curl -s -I https://dgrealtors.com > $AUDIT_DIR/security-headers.txt

# 3. SSL/TLS Security
echo "Checking SSL/TLS security..."
testssl --jsonfile $AUDIT_DIR/testssl.json https://dgrealtors.com

# 4. Database Security
echo "Checking database security..."
if [ -n "$DATABASE_URL" ]; then
  psql $DATABASE_URL << EOF > $AUDIT_DIR/database-security.txt
-- Check for default passwords
SELECT usename, passwd IS NULL as has_password
FROM pg_shadow
WHERE passwd IS NULL OR passwd = md5(usename || usename);

-- Check user privileges
SELECT 
  grantee,
  table_schema,
  table_name,
  array_agg(privilege_type) as privileges
FROM information_schema.role_table_grants
WHERE grantee NOT IN ('postgres', 'pg_database_owner')
GROUP BY grantee, table_schema, table_name;

-- Check for SQL injection vulnerabilities
SELECT
  proname,
  prosrc
FROM pg_proc
WHERE prosrc LIKE '%EXECUTE%'
  AND proowner::regrole::text NOT IN ('postgres');
EOF
fi

# 5. File Permissions Audit
echo "Checking file permissions..."
find /app -type f -perm -o+w > $AUDIT_DIR/world-writable-files.txt
find /app -type d -perm -o+w > $AUDIT_DIR/world-writable-dirs.txt
find / -perm -4000 2>/dev/null > $AUDIT_DIR/suid-files.txt

# 6. Docker Security
echo "Checking Docker security..."
docker version > $AUDIT_DIR/docker-version.txt
docker images --digests > $AUDIT_DIR/docker-images.txt

# Run Docker Bench Security
docker run --rm --net host --pid host --userns host --cap-add audit_control \
  -e DOCKER_CONTENT_TRUST=$DOCKER_CONTENT_TRUST \
  -v /var/lib:/var/lib \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /etc:/etc --label docker_bench_security \
  docker/docker-bench-security > $AUDIT_DIR/docker-bench.txt

# 7. API Security Test
echo "Testing API security..."
# OWASP ZAP scan
if [ -f /opt/zap/zap.sh ]; then
  /opt/zap/zap.sh -cmd \
    -quickurl https://api.dgrealtors.com \
    -quickout $AUDIT_DIR/zap-scan.json \
    -quickprogress
fi

# 8. Generate Security Score
echo "Calculating security score..."
python3 << EOF > $AUDIT_DIR/security-score.txt
import json
import re

score = 100
issues = []

# Check npm audit
with open('$AUDIT_DIR/npm-audit.json') as f:
    audit = json.load(f)
    vulns = audit['metadata']['vulnerabilities']
    if vulns['high'] > 0:
        score -= vulns['high'] * 5
        issues.append(f"{vulns['high']} high severity npm vulnerabilities")
    if vulns['critical'] > 0:
        score -= vulns['critical'] * 10
        issues.append(f"{vulns['critical']} critical npm vulnerabilities")

# Check SSL
try:
    with open('$AUDIT_DIR/testssl.json') as f:
        ssl = json.load(f)
        # Parse SSL test results
except:
    pass

# Check security headers
with open('$AUDIT_DIR/security-headers.txt') as f:
    headers = f.read()
    required_headers = [
        'Strict-Transport-Security',
        'X-Frame-Options',
        'X-Content-Type-Options',
        'Content-Security-Policy'
    ]
    for header in required_headers:
        if header not in headers:
            score -= 5
            issues.append(f"Missing security header: {header}")

print(f"Security Score: {max(0, score)}/100")
print(f"Issues Found: {len(issues)}")
for issue in issues:
    print(f"- {issue}")
EOF

# 9. Create summary report
cat > $AUDIT_DIR/SUMMARY.md << EOF
# Security Audit Summary

**Date**: $(date)  
**System**: dgrealtors.com  

## Overview
$(cat $AUDIT_DIR/security-score.txt)

## Detailed Results

### 1. System Security
- See: system-security.txt

### 2. Application Security
- NPM Audit: $(jq '.metadata.vulnerabilities | to_entries | map("\$.key): \$.value)") | join(", ")' $AUDIT_DIR/npm-audit.json)
- Security Headers: security-headers.txt

### 3. SSL/TLS Security
- Full report: testssl.json

### 4. Database Security
- See: database-security.txt

### 5. Docker Security
- Docker Bench results: docker-bench.txt

## Recommendations
1. Address all critical and high severity vulnerabilities immediately
2. Implement missing security headers
3. Review and restrict file permissions
4. Update all system packages
5. Review user access and privileges

## Next Steps
1. Create tickets for each security issue
2. Prioritize based on severity
3. Schedule remediation work
4. Re-run audit after fixes
EOF

# 10. Compress and archive
tar -czf /audits/security-audit-$(date +%Y%m%d-%H%M%S).tar.gz -C $AUDIT_DIR .

echo "✅ Security audit completed! Results in: $AUDIT_DIR"

Vulnerability Patching
// vulnerability-patcher.js
const { exec } = require('child_process');
const fs = require('fs').promises;
const semver = require('semver');

class VulnerabilityPatcher {
  constructor() {
    this.criticalPackages = [
      'express',
      'react',
      'react-dom',
      'next',
      'lodash',
      'axios'
    ];
    
    this.backupDir = `/backups/pre-patch-${Date.now()}`;
  }

  async patchVulnerabilities() {
    console.log('🔧 Starting vulnerability patching...');
    
    try {
      // 1. Create backup
      await this.createBackup();
      
      // 2. Audit current vulnerabilities
      const vulnerabilities = await this.auditVulnerabilities();
      
      // 3. Analyze and plan patches
      const patchPlan = await this.createPatchPlan(vulnerabilities);
      
      // 4. Apply patches
      await this.applyPatches(patchPlan);
      
      // 5. Run tests
      await this.runTests();
      
      // 6. Verify fixes
      await this.verifyPatches();
      
      // 7. Generate report
      const report = await this.generateReport(patchPlan);
      
      console.log('✅ Vulnerability patching completed!');
      return report;
      
    } catch (error) {
      console.error('❌ Patching failed:', error);
      await this.rollback();
      throw error;
    }
  }

  async createBackup() {
    console.log('Creating backup...');
    
    await fs.mkdir(this.backupDir, { recursive: true });
    
    // Backup package files
    await this.exec(`cp package*.json ${this.backupDir}/`);
    
    // Backup node_modules for critical packages
    for (const pkg of this.criticalPackages) {
      await this.exec(`
        cp -r node_modules/${pkg} ${this.backupDir}/ 2>/dev/null || true
      `);
    }
  }

  async auditVulnerabilities() {
    console.log('Auditing vulnerabilities...');
    
    const { stdout } = await this.exec('npm audit --json');
    const audit = JSON.parse(stdout);
    
    const vulnerabilities = [];
    
    for (const [key, vuln] of Object.entries(audit.vulnerabilities || {})) {
      vulnerabilities.push({
        name: key,
        severity: vuln.severity,
        via: vuln.via,
        range: vuln.range,
        fixAvailable: vuln.fixAvailable,
        nodes: vuln.nodes,
        effects: vuln.effects
      });
    }
    
    // Sort by severity
    vulnerabilities.sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, moderate: 2, low: 3 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
    
    return vulnerabilities;
  }

  async createPatchPlan(vulnerabilities) {
    console.log('Creating patch plan...');
    
    const plan = {
      immediate: [],   // Can be patched immediately
      breaking: [],    // May have breaking changes
      manual: [],      // Require manual intervention
      skip: []        // Cannot be patched
    };
    
    for (const vuln of vulnerabilities) {
      const analysis = await this.analyzeVulnerability(vuln);
      
      if (analysis.canAutoPatch) {
        plan.immediate.push({
          ...vuln,
          ...analysis
        });
      } else if (analysis.hasBreakingChanges) {
        plan.breaking.push({
          ...vuln,
          ...analysis
        });
      } else if (analysis.requiresManual) {
        plan.manual.push({
          ...vuln,
          ...analysis
        });
      } else {
        plan.skip.push({
          ...vuln,
          ...analysis,
          reason: analysis.skipReason
        });
      }
    }
    
    return plan;
  }

  async analyzeVulnerability(vuln) {
    const packageJson = JSON.parse(
      await fs.readFile('package.json', 'utf8')
    );
    
    const currentVersion = packageJson.dependencies[vuln.name] || 
                          packageJson.devDependencies[vuln.name];
    
    if (!currentVersion) {
      return {
        canAutoPatch: false,
        requiresManual: true,
        reason: 'Indirect dependency'
      };
    }
    
    // Get latest versions
    const { stdout } = await this.exec(
      `npm view ${vuln.name} versions --json`
    );
    const versions = JSON.parse(stdout);
    
    // Find the best version to update to
    const targetVersion = this.findBestVersion(
      currentVersion,
      versions,
      vuln.range
    );
    
    if (!targetVersion) {
      return {
        canAutoPatch: false,
        skipReason: 'No suitable version found'
      };
    }
    
    // Check for breaking changes
    const hasBreakingChanges = semver.major(targetVersion) > 
                               semver.major(currentVersion.replace(/^[^0-9]*/, ''));
    
    return {
      currentVersion,
      targetVersion,
      canAutoPatch: !hasBreakingChanges && vuln.fixAvailable,
      hasBreakingChanges,
      requiresManual: hasBreakingChanges || !vuln.fixAvailable
    };
  }

  findBestVersion(current, available, vulnerableRange) {
    // Remove version prefix (^, ~, etc)
    const cleanCurrent = current.replace(/^[^0-9]*/, '');
    
    // Filter out vulnerable versions
    const safe = available.filter(v => {
      try {
        return !semver.satisfies(v, vulnerableRange);
      } catch {
        return false;
      }
    });
    
    // Find the highest version that doesn't break semver
    const compatible = safe.filter(v => {
      try {
        return semver.major(v) === semver.major(cleanCurrent);
      } catch {
        return false;
      }
    });
    
    return compatible[compatible.length - 1] || safe[safe.length - 1];
  }

  async applyPatches(plan) {
    console.log('Applying patches...');
    
    // Apply immediate patches
    for (const patch of plan.immediate) {
      console.log(`Patching ${patch.name} to ${patch.targetVersion}...`);
      
      await this.exec(
        `npm install ${patch.name}@${patch.targetVersion} --save-exact`
      );
    }
    
    // Handle breaking changes with confirmation
    if (plan.breaking.length > 0) {
      console.log('⚠️  Breaking changes detected:');
      for (const patch of plan.breaking) {
        console.log(`  - ${patch.name}: ${patch.currentVersion} → ${patch.targetVersion}`);
      }
      
      // In automated mode, skip breaking changes
      console.log('Skipping breaking changes (manual review required)');
    }
    
    // Run npm audit fix
    await this.exec('npm audit fix');
  }

  async runTests() {
    console.log('Running tests...');
    
    try {
      // Run unit tests
      await this.exec('npm test -- --ci');
      
      // Run integration tests
      await this.exec('npm run test:integration');
      
      // Run build
      await this.exec('npm run build');
      
      console.log('✅ All tests passed');
    } catch (error) {
      throw new Error(`Tests failed: ${error.message}`);
    }
  }

  async verifyPatches() {
    console.log('Verifying patches...');
    
    const { stdout } = await this.exec('npm audit --json');
    const postAudit = JSON.parse(stdout);
    
    if (postAudit.metadata.vulnerabilities.total > 0) {
      console.warn('⚠️  Some vulnerabilities remain:');
      console.warn(`  Critical: ${postAudit.metadata.vulnerabilities.critical}`);
      console.warn(`  High: ${postAudit.metadata.vulnerabilities.high}`);
      console.warn(`  Moderate: ${postAudit.metadata.vulnerabilities.moderate}`);
      console.warn(`  Low: ${postAudit.metadata.vulnerabilities.low}`);
    }
    
    return postAudit;
  }

  async generateReport(patchPlan) {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: patchPlan.immediate.length + patchPlan.breaking.length + 
               patchPlan.manual.length + patchPlan.skip.length,
        patched: patchPlan.immediate.length,
        skipped: patchPlan.breaking.length + patchPlan.manual.length + 
                 patchPlan.skip.length
      },
      patches: {
        applied: patchPlan.immediate,
        breaking: patchPlan.breaking,
        manual: patchPlan.manual,
        skipped: patchPlan.skip
      },
      postAudit: await this.verifyPatches()
    };
    
    // Save report
    await fs.writeFile(
      `/reports/vulnerability-patch-${Date.now()}.json`,
      JSON.stringify(report, null, 2)
    );
    
    return report;
  }

  async rollback() {
    console.log('Rolling back changes...');
    
    // Restore package files
    await this.exec(`cp ${this.backupDir}/package*.json ./`);
    
    // Reinstall dependencies
    await this.exec('npm ci');
    
    console.log('✅ Rollback completed');
  }

  async exec(command) {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) reject(error);
        else resolve({ stdout, stderr });
      });
    });
  }
}

// Run if called directly
if (require.main === module) {
  const patcher = new VulnerabilityPatcher();
  patcher.patchVulnerabilities()
    .then(report => {
      console.log('Patch report:', report.summary);
      process.exit(0);
    })
    .catch(error => {
      console.error('Patching failed:', error);
      process.exit(1);
    });
}

module.exports = VulnerabilityPatcher;

Backup & Recovery
Automated Backup System
// backup-system.js
const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const AWS = require('aws-sdk');
const cron = require('node-cron');

class BackupSystem {
  constructor() {
    this.s3 = new AWS.S3();
    this.config = {
      bucket: process.env.BACKUP_BUCKET || 'dgrealtors-backups',
      localPath: '/backups',
      retention: {
        daily: 7,
        weekly: 4,
        monthly: 12,
        yearly: 5
      }
    };
    
    this.backupTypes = [
      { name: 'application', handler: this.backupApplication },
      { name: 'database', handler: this.backupDatabase },
      { name: 'uploads', handler: this.backupUploads },
      { name: 'configuration', handler: this.backupConfiguration },
      { name: 'logs', handler: this.backupLogs }
    ];
  }

  async initialize() {
    console.log('🔄 Initializing backup system...');
    
    // Ensure backup directory exists
    await fs.mkdir(this.config.localPath, { recursive: true });
    
    // Schedule backups
    this.scheduleBackups();
    
    // Verify S3 access
    await this.verifyS3Access();
    
    console.log('✅ Backup system initialized');
  }

  scheduleBackups() {
    // Daily backups at 2 AM
    cron.schedule('0 2 * * *', () => {
      this.performBackup('daily');
    });
    
    // Weekly backups on Sunday at 3 AM
    cron.schedule('0 3 * * 0', () => {
      this.performBackup('weekly');
    });
    
    // Monthly backups on 1st at 4 AM
    cron.schedule('0 4 1 * *', () => {
      this.performBackup('monthly');
    });
    
    // Yearly backups on Jan 1st at 5 AM
    cron.schedule('0 5 1 1 *', () => {
      this.performBackup('yearly');
    });
  }

  async performBackup(frequency = 'daily') {
    console.log(`🔄 Starting ${frequency} backup...`);
    const startTime = Date.now();
    
    const backupId = `${frequency}-${Date.now()}`;
    const tempDir = path.join(this.config.localPath, backupId);
    
    try {
      // Create temp directory
      await fs.mkdir(tempDir, { recursive: true });
      
      // Run all backup types
      const results = await Promise.allSettled(
        this.backupTypes.map(type => 
          type.handler.call(this, tempDir, backupId)
        )
      );
      
      // Create manifest
      const manifest = await this.createManifest(results, backupId);
      
      // Compress backup
      const archivePath = await this.compressBackup(tempDir, backupId);
      
      // Upload to S3
      await this.uploadToS3(archivePath, frequency);
      
      // Cleanup old backups
      await this.cleanupOldBackups(frequency);
      
      // Send notification
      await this.sendBackupNotification({
        frequency,
        backupId,
        duration: Date.now() - startTime,
        size: (await fs.stat(archivePath)).size,
        results
      });
      
      console.log(`✅ ${frequency} backup completed`);
      
    } catch (error) {
      console.error(`❌ Backup failed: ${error.message}`);
      await this.handleBackupFailure(error, frequency);
    } finally {
      // Cleanup temp files
      await this.exec(`rm -rf ${tempDir}`);
    }
  }

  async backupApplication(tempDir, backupId) {
    console.log('📦 Backing up application...');
    
    const appBackupDir = path.join(tempDir, 'application');
    await fs.mkdir(appBackupDir, { recursive: true });
    
    // Backup source code
    await this.exec(`
      rsync -av --exclude-from=.backupignore \
        /app/ ${appBackupDir}/
    `);
    
    // Create application info
    const appInfo = {
      version: await this.getAppVersion(),
      commit: await this.getGitCommit(),
      dependencies: await this.getDependencies(),
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    };
    
    await fs.writeFile(
      path.join(appBackupDir, 'app-info.json'),
      JSON.stringify(appInfo, null, 2)
    );
    
    return { type: 'application', status: 'success' };
  }

  async backupDatabase(tempDir, backupId) {
    if (!process.env.DATABASE_URL) {
      return { type: 'database', status: 'skipped', reason: 'No database configured' };
    }
    
    console.log('🗄️ Backing up database...');
    
    const dbBackupPath = path.join(tempDir, 'database.dump');
    
    // Create PostgreSQL dump
    await this.exec(`
      pg_dump ${process.env.DATABASE_URL} \
        --format=custom \
        --verbose \
        --no-owner \
        --no-privileges \
        --file=${dbBackupPath}
    `);
    
    // Create schema-only backup
    await this.exec(`
      pg_dump ${process.env.DATABASE_URL} \
        --schema-only \
        --file=${path.join(tempDir, 'schema.sql')}
    `);
    
    // Get database statistics
    const stats = await this.getDatabaseStats();
    await fs.writeFile(
      path.join(tempDir, 'database-stats.json'),
      JSON.stringify(stats, null, 2)
    );
    
    return { type: 'database', status: 'success' };
  }

  async backupUploads(tempDir, backupId) {
    console.log('📸 Backing up uploads...');
    
    const uploadsSource = '/app/public/uploads';
    const uploadsBackupDir = path.join(tempDir, 'uploads');
    
    // Check if uploads directory exists
    try {
      await fs.access(uploadsSource);
    } catch {
      return { type: 'uploads', status: 'skipped', reason: 'No uploads directory' };
    }
    
    // Copy uploads
    await this.exec(`
      rsync -av ${uploadsSource}/ ${uploadsBackupDir}/
    `);
    
    // Create uploads inventory
    const inventory = await this.createUploadsInventory(uploadsSource);
    await fs.writeFile(
      path.join(tempDir, 'uploads-inventory.json'),
      JSON.stringify(inventory, null, 2)
    );
    
    return { type: 'uploads', status: 'success' };
  }

  async backupConfiguration(tempDir, backupId) {
    console.log('⚙️ Backing up configuration...');
    
    const configBackupDir = path.join(tempDir, 'configuration');
    await fs.mkdir(configBackupDir, { recursive: true });
    
    // Backup environment files (sanitized)
    const envVars = this.sanitizeEnvironmentVars(process.env);
    await fs.writeFile(
      path.join(configBackupDir, 'environment.json'),
      JSON.stringify(envVars, null, 2)
    );
    
    // Backup nginx config
    await this.exec(`
      cp -r /etc/nginx ${configBackupDir}/nginx
    `);
    
    // Backup PM2 config
    await this.exec(`
      pm2 save
      cp ~/.pm2/dump.pm2 ${configBackupDir}/pm2-dump.json
    `);
    
    // Backup cron jobs
    await this.exec(`
      crontab -l > ${configBackupDir}/crontab.txt
    `);
    
    return { type: 'configuration', status: 'success' };
  }

  async backupLogs(tempDir, backupId) {
    console.log('📝 Backing up logs...');
    
    const logsBackupDir = path.join(tempDir, 'logs');
    await fs.mkdir(logsBackupDir, { recursive: true });
    
    // Compress and copy recent logs
    await this.exec(`
      find /var/log/dgrealtors -name "*.log" -mtime -7 \
        -exec gzip -c {} \; > ${logsBackupDir}/recent-logs.tar.gz
    `);
    
    // Copy error logs
    await this.exec(`
      cp /var/log/dgrealtors/error.log ${logsBackupDir}/ || true
    `);
    
    return { type: 'logs', status: 'success' };
  }

  async createManifest(results, backupId) {
    const manifest = {
      backupId,
      timestamp: new Date().toISOString(),
      version: '1.0',
      system: {
        hostname: require('os').hostname(),
        platform: process.platform,
        arch: process.arch,
        nodeVersion: process.version
      },
      results: results.map(r => ({
        type: r.value?.type || 'unknown',
        status: r.status === 'fulfilled' ? r.value?.status : 'failed',
        error: r.reason?.message
      })),
      checksums: {}
    };
    
    // Calculate checksums
    const files = await this.getAllFiles(tempDir);
    for (const file of files) {
      const checksum = await this.calculateChecksum(file);
      manifest.checksums[path.relative(tempDir, file)] = checksum;
    }
    
    await fs.writeFile(
      path.join(tempDir, 'manifest.json'),
      JSON.stringify(manifest, null, 2)
    );
    
    return manifest;
  }

  async compressBackup(sourceDir, backupId) {
    console.log('🗜️ Compressing backup...');
    
    const archivePath = path.join(this.config.localPath, `${backupId}.tar.gz`);
    
    await this.exec(`
      cd ${sourceDir} && \
      tar -czf ${archivePath} .
    `);
    
    return archivePath;
  }

  async uploadToS3(filePath, frequency) {
    console.log('☁️ Uploading to S3...');
    
    const fileName = path.basename(filePath);
    const s3Key = `${frequency}/${fileName}`;
    
    const fileStream = require('fs').createReadStream(filePath);
    
    const params = {
      Bucket: this.config.bucket,
      Key: s3Key,
      Body: fileStream,
      StorageClass: frequency === 'yearly' ? 'GLACIER' : 'STANDARD_IA',
      ServerSideEncryption: 'AES256',
      Metadata: {
        frequency,
        timestamp: new Date().toISOString(),
        hostname: require('os').hostname()
      }
    };
    
    await this.s3.upload(params).promise();
    
    // Cleanup local file
    await fs.unlink(filePath);
  }

  async cleanupOldBackups(frequency) {
    console.log('🧹 Cleaning old backups...');
    
    const retention = this.config.retention[frequency];
    
    // List objects in S3
    const objects = await this.s3.listObjectsV2({
      Bucket: this.config.bucket,
      Prefix: `${frequency}/`
    }).promise();
    
    // Sort by date and identify old backups
    const sortedObjects = (objects.Contents || [])
      .sort((a, b) => b.LastModified - a.LastModified);
    
    const toDelete = sortedObjects.slice(retention);
    
    if (toDelete.length > 0) {
      await this.s3.deleteObjects({
        Bucket: this.config.bucket,
        Delete: {
          Objects: toDelete.map(obj => ({ Key: obj.Key }))
        }
      }).promise();
      
      console.log(`Deleted ${toDelete.length} old ${frequency} backups`);
    }
  }

  // Helper methods
  sanitizeEnvironmentVars(env) {
    const sanitized = {};
    const secrets = ['PASSWORD', 'SECRET', 'KEY', 'TOKEN', 'PRIVATE'];
    
    for (const [key, value] of Object.entries(env)) {
      if (secrets.some(secret => key.includes(secret))) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }

  async calculateChecksum(filePath) {
    const crypto = require('crypto');
    const stream = require('fs').createReadStream(filePath);
    const hash = crypto.createHash('sha256');
    
    return new Promise((resolve, reject) => {
      stream.on('data', data => hash.update(data));
      stream.on('end', () => resolve(hash.digest('hex')));
      stream.on('error', reject);
    });
  }

  async exec(command) {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) reject(error);
        else resolve({ stdout, stderr });
      });
    });
  }
}

// Initialize and start backup system
const backupSystem = new BackupSystem();
backupSystem.initialize().catch(console.error);

module.exports = BackupSystem;

Disaster Recovery Plan
# Disaster Recovery Plan

## Recovery Time Objectives (RTO)
- **Critical Systems**: 1 hour
- **Core Services**: 2 hours
- **Full Recovery**: 4 hours

## Recovery Point Objectives (RPO)
- **Database**: 15 minutes
- **Application Files**: 1 hour
- **User Uploads**: 24 hours

## Recovery Procedures

### 1. Initial Assessment
```bash
#!/bin/bash
# assess-damage.sh

echo "🔍 Assessing system damage..."

# Check services
systemctl status nginx
systemctl status postgresql
pm2 status

# Check filesystem
df -h
mount | grep -E "(ro|error)"

# Check database
psql $DATABASE_URL -c "SELECT 1" || echo "Database unreachable"

# Check network
ping -c 3 api.dgrealtors.com
curl -I https://dgrealtors.com

# Generate report
echo "System Status Report" > /tmp/damage-assessment.txt
date >> /tmp/damage-assessment.txt

Emergency Response
#!/bin/bash
# emergency-response.sh

# Enable maintenance mode immediately
echo "maintenance" > /app/public/maintenance.flag
nginx -s reload

# Stop non-critical services
pm2 stop all

# Preserve evidence
mkdir -p /forensics/$(date +%Y%m%d-%H%M%S)
cp -r /var/log /forensics/

# Notify team
curl -X POST $EMERGENCY_WEBHOOK \
  -d "Emergency detected at $(date)"

Database Recovery
#!/bin/bash
# recover-database.sh

BACKUP_DATE=$1

# Find latest backup
if [ -z "$BACKUP_DATE" ]; then
  LATEST_BACKUP=$(aws s3 ls s3://dgrealtors-backups/daily/ | tail -1 | awk '{print $4}')
else
  LATEST_BACKUP="daily-$BACKUP_DATE.tar.gz"
fi

# Download backup
aws s3 cp s3://dgrealtors-backups/daily/$LATEST_BACKUP /tmp/

# Extract database dump
tar -xzf /tmp/$LATEST_BACKUP -C /tmp database.dump

# Create new database
createdb dgrealtors_recovery

# Restore
pg_restore -d dgrealtors_recovery /tmp/database.dump

# Verify
psql dgrealtors_recovery -c "SELECT COUNT(*) FROM users"

# Switch over
psql -c "ALTER DATABASE dgrealtors RENAME TO dgrealtors_old"
psql -c "ALTER DATABASE dgrealtors_recovery RENAME TO dgrealtors"

Application Recovery
#!/bin/bash
# recover-application.sh

# Download latest application backup
LATEST_APP=$(aws s3 ls s3://dgrealtors-backups/daily/ | tail -1 | awk '{print $4}')
aws s3 cp s3://dgrealtors-backups/daily/$LATEST_APP /tmp/

# Extract
tar -xzf /tmp/$LATEST_APP -C /tmp

# Restore application files
rsync -av /tmp/application/ /app/

# Install dependencies
cd /app && npm ci

# Build
npm run build

# Start services
pm2 start ecosystem.config.js


## Monitoring & Alerts

### Alert Configuration

```javascript
// monitoring/alerts.js
const alerts = {
  critical: {
    cpuUsage: { threshold: 90, duration: '5m' },
    memoryUsage: { threshold: 90, duration: '5m' },
    diskUsage: { threshold: 90, duration: '10m' },
    responseTime: { threshold: 3000, duration: '5m' },
    errorRate: { threshold: 5, duration: '3m' },
    sslExpiry: { threshold: 7, unit: 'days' }
  },
  warning: {
    cpuUsage: { threshold: 70, duration: '10m' },
    memoryUsage: { threshold: 70, duration: '10m' },
    diskUsage: { threshold: 70, duration: '15m' },
    responseTime: { threshold: 1000, duration: '10m' },
    errorRate: { threshold: 1, duration: '5m' },
    sslExpiry: { threshold: 30, unit: 'days' }
  }
};

// Prometheus alert rules
const prometheusAlerts = `
groups:
  - name: dgrealtors
    rules:
      - alert: HighCPUUsage
        expr: rate(process_cpu_seconds_total[5m]) * 100 > 90
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High CPU usage detected"
          description: "CPU usage is above 90% (current value: {{ $value }}%)"

      - alert: HighMemoryUsage
        expr: (1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100 > 90
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High memory usage detected"
          description: "Memory usage is above 90% (current value: {{ $value }}%)"

      - alert: DiskSpaceLow
        expr: (1 - (node_filesystem_avail_bytes / node_filesystem_size_bytes)) * 100 > 90
        for: 10m
        labels:
          severity: critical
        annotations:
          summary: "Low disk space"
          description: "Disk usage is above 90% (current value: {{ $value }}%)"

      - alert: ServiceDown
        expr: up{job="dgrealtors"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Service is down"
          description: "{{ $labels.instance }} is down"

      - alert: HighResponseTime
        expr: histogram_quantile(0.95, http_request_duration_seconds_bucket) > 3
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High response time"
          description: "95th percentile response time is above 3s (current value: {{ $value }}s)"

      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 3m
        labels:
          severity: critical
        annotations:
          summary: "High error rate"
          description: "Error rate is above 5% (current value: {{ $value }}%)"

      - alert: SSLCertificateExpirySoon
        expr: probe_ssl_earliest_cert_expiry - time() < 7 * 86400
        for: 1h
        labels:
          severity: critical
        annotations:
          summary: "SSL certificate expiring soon"
          description: "SSL certificate expires in {{ $value | humanizeDuration }}"

      - alert: DatabaseConnectionPoolExhausted
        expr: pg_stat_database_numbackends / pg_settings_max_connections > 0.8
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Database connection pool nearly exhausted"
          description: "Connection pool usage is above 80% (current value: {{ $value }}%)"
`;

module.exports = { alerts, prometheusAlerts };

Health Check System
// monitoring/health-check.js
const http = require('http');
const https = require('https');
const dns = require('dns').promises;

class HealthCheckSystem {
  constructor() {
    this.checks = [
      {
        name: 'website',
        url: 'https://dgrealtors.com',
        expectedStatus: 200,
        timeout: 5000,
        critical: true
      },
      {
        name: 'api',
        url: 'https://api.dgrealtors.com/health',
        expectedStatus: 200,
        timeout: 3000,
        critical: true
      },
      {
        name: 'cdn',
        url: 'https://cdn.dgrealtors.com/health.txt',
        expectedStatus: 200,
        timeout: 3000,
        critical: false
      },
      {
        name: 'database',
        handler: this.checkDatabase,
        timeout: 5000,
        critical: true
      },
      {
        name: 'redis',
        handler: this.checkRedis,
        timeout: 3000,
        critical: false
      },
      {
        name: 'disk_space',
        handler: this.checkDiskSpace,
        timeout: 1000,
        critical: true
      }
    ];
    
    this.results = new Map();
    this.history = [];
  }

  async performHealthChecks() {
    console.log('🏥 Performing health checks...');
    
    const results = await Promise.allSettled(
      this.checks.map(check => this.performCheck(check))
    );
    
    const summary = {
      timestamp: new Date().toISOString(),
      healthy: results.every(r => r.status === 'fulfilled' && r.value.healthy),
      checks: {}
    };
    
    results.forEach((result, index) => {
      const check = this.checks[index];
      summary.checks[check.name] = result.status === 'fulfilled' 
        ? result.value 
        : { healthy: false, error: result.reason.message };
    });
    
    // Store results
    this.results.set(Date.now(), summary);
    this.history.push(summary);
    
    // Trim history
    if (this.history.length > 1440) { // Keep 24 hours at 1-minute intervals
      this.history.shift();
    }
    
    // Send alerts if needed
    await this.checkForAlerts(summary);
    
    return summary;
  }

  async performCheck(check) {
    const startTime = Date.now();
    
    try {
      let result;
      
      if (check.url) {
        result = await this.checkURL(check.url, check.expectedStatus, check.timeout);
      } else if (check.handler) {
        result = await check.handler.call(this, check.timeout);
      }
      
      return {
        healthy: result.healthy,
        responseTime: Date.now() - startTime,
        ...result
      };
      
    } catch (error) {
      return {
        healthy: false,
        responseTime: Date.now() - startTime,
        error: error.message,
        stack: error.stack
      };
    }
  }

  async checkURL(url, expectedStatus, timeout) {
    return new Promise((resolve, reject) => {
      const protocol = url.startsWith('https') ? https : http;
      
      const req = protocol.get(url, { timeout }, (res) => {
        let data = '';
        
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({
            healthy: res.statusCode === expectedStatus,
            statusCode: res.statusCode,
            headers: res.headers,
            body: data.substring(0, 100) // First 100 chars
          });
        });
      });
      
      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
    });
  }

  async checkDatabase() {
    const { Client } = require('pg');
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    
    try {
      await client.connect();
      const result = await client.query('SELECT 1');
      
      // Check replication lag if replica
      const replicationCheck = await client.query(`
        SELECT 
          CASE 
            WHEN pg_is_in_recovery() THEN 
              EXTRACT(EPOCH FROM (NOW() - pg_last_xact_replay_timestamp()))
            ELSE 0
          END AS replication_lag
      `);
      
      await client.end();
      
      return {
        healthy: true,
        replicationLag: replicationCheck.rows[0].replication_lag
      };
      
    } catch (error) {
      return {
        healthy: false,
        error: error.message
      };
    }
  }

  async checkRedis() {
    const redis = require('redis');
    const client = redis.createClient({ url: process.env.REDIS_URL });
    
    try {
      await client.connect();
      await client.ping();
      
      const info = await client.info();
      const memory = info.match(/used_memory_human:(\S+)/)?.[1];
      
      await client.disconnect();
      
      return {
        healthy: true,
        memory
      };
      
    } catch (error) {
      return {
        healthy: false,
        error: error.message
      };
    }
  }

  async checkDiskSpace() {
    const { exec } = require('child_process');
    
    return new Promise((resolve) => {
      exec('df -h /', (error, stdout) => {
        if (error) {
          resolve({ healthy: false, error: error.message });
          return;
        }
        
        const lines = stdout.trim().split('\n');
        const data = lines[1].split(/\s+/);
        const usage = parseInt(data[4]);
        
        resolve({
          healthy: usage < 90,
          usage: `${usage}%`,
          available: data[3],
          total: data[1]
        });
      });
    });
  }

  async checkForAlerts(summary) {
    const unhealthy = Object.entries(summary.checks)
      .filter(([name, result]) => !result.healthy)
      .map(([name, result]) => ({
        name,
        ...result,
        critical: this.checks.find(c => c.name === name)?.critical
      }));
    
    if (unhealthy.length > 0) {
      // Check if any critical services are down
      const critical = unhealthy.filter(c => c.critical);
      
      if (critical.length > 0) {
        await this.sendCriticalAlert(critical, summary);
      } else {
        await this.sendWarningAlert(unhealthy, summary);
      }
    }
  }

  async sendCriticalAlert(criticalChecks, summary) {
    const message = {
      severity: 'critical',
      timestamp: summary.timestamp,
      message: `CRITICAL: ${criticalChecks.length} critical service(s) down`,
      services: criticalChecks.map(c => ({
        name: c.name,
        error: c.error
      })),
      action_required: true
    };
    
    // Send to multiple channels
    await Promise.all([
      this.sendSlackAlert(message),
      this.sendPagerDuty(message),
      this.sendEmail(message)
    ]);
  }

  async sendSlackAlert(message) {
    if (!process.env.SLACK_WEBHOOK_URL) return;
    
    const color = message.severity === 'critical' ? 'danger' : 'warning';
    
    await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        attachments: [{
          color,
          title: message.message,
          fields: message.services.map(s => ({
            title: s.name,
            value: s.error || 'Unhealthy',
            short: true
          })),
          footer: 'Health Check System',
          ts: Math.floor(Date.now() / 1000)
        }]
      })
    });
  }

  getHealthSummary() {
    // Calculate uptime
    const recentChecks = this.history.slice(-60); // Last hour
    const uptime = recentChecks.length > 0
      ? (recentChecks.filter(c => c.healthy).length / recentChecks.length) * 100
      : 100;
    
    return {
      current: this.history[this.history.length - 1],
      uptime: `${uptime.toFixed(2)}%`,
      history: this.history.slice(-60) // Last hour
    };
  }
}

// Start health check system
const healthCheck = new HealthCheckSystem();

// Run checks every minute
setInterval(() => {
  healthCheck.performHealthChecks().catch(console.error);
}, 60000);

// Initial check
healthCheck.performHealthChecks();

// HTTP endpoint for external monitoring
const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    const summary = healthCheck.getHealthSummary();
    const isHealthy = summary.current?.healthy;
    
    res.statusCode = isHealthy ? 200 : 503;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(summary));
  } else {
    res.statusCode = 404;
    res.end('Not found');
  }
});

server.listen(3001, () => {
  console.log('Health check server running on port 3001');
});

module.exports = HealthCheckSystem;

Log Management
Log Rotation Configuration
# /etc/logrotate.d/dgrealtors
/var/log/dgrealtors/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
    sharedscripts
    postrotate
        # Reload PM2 logs
        pm2 reloadLogs
        
        # Send signal to Node.js app
        kill -USR2 $(cat /var/run/dgrealtors.pid) 2>/dev/null || true
        
        # Upload to S3 (optional)
        if [ -f /var/log/dgrealtors/*.gz ]; then
            aws s3 sync /var/log/dgrealtors/ s3://dgrealtors-logs/$(hostname)/ \
                --exclude "*" --include "*.gz" \
                --storage-class GLACIER
        fi
    endscript
}

/var/log/nginx/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
    sharedscripts
    postrotate
        # Reload nginx
        nginx -s reopen
    endscript
}

Log Analysis System
// log-analysis.js
const fs = require('fs');
const readline = require('readline');
const { parse } = require('url');

class LogAnalyzer {
  constructor() {
    this.patterns = {
      error: /ERROR|FATAL|CRITICAL/i,
      warning: /WARN|WARNING/i,
      slowQuery: /duration: (\d+)ms/,
      httpStatus: /HTTP\/\d\.\d" (\d{3})/,
      ipAddress: /^(\d{1,3}\.){3}\d{1,3}/,
      userAgent: /"([^"]*)" "([^"]*)"/,
      apiEndpoint: /\/api\/([^\s?]+)/
    };
    
    this.stats = {
      totalLines: 0,
      errors: 0,
      warnings: 0,
      requests: {},
      slowQueries: [],
      errorMessages: {},
      ipAddresses: {},
      endpoints: {}
    };
  }

  async analyzeLogs(logFile) {
    console.log(`📊 Analyzing ${logFile}...`);
    
    const fileStream = fs.createReadStream(logFile);
    const rl = readline.createInterface({
      input: fileStream,
      cr
