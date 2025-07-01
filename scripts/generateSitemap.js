
/* ============================================
   ADVANCED SITEMAP GENERATOR
   Generates XML sitemaps, robots.txt, and more
   ============================================ */

const fs = require('fs').promises;
const path = require('path');
const { JSDOM } = require('jsdom');
const glob = require('glob-promise');
const crypto = require('crypto');

class SitemapGenerator {
  constructor(config = {}) {
    this.config = {
      // Site configuration
      baseUrl: config.baseUrl || 'https://dgrealtors.com',
      sourceDir: config.sourceDir || path.join(process.cwd(), 'src'),
      outputDir: config.outputDir || path.join(process.cwd(), 'public'),
      
      // Sitemap settings
      changefreq: {
        home: 'daily',
        about: 'weekly',
        services: 'weekly',
        contact: 'monthly',
        blog: 'weekly',
        default: 'monthly'
      },
      
      priority: {
        home: 1.0,
        about: 0.8,
        services: 0.9,
        contact: 0.7,
        blog: 0.6,
        default: 0.5
      },
      
      // File patterns
      includePatterns: config.includePatterns || [
        '**/*.html',
        '**/*.htm'
      ],
      
      excludePatterns: config.excludePatterns || [
        '**/node_modules/**',
        '**/.*',
        '**/_*',
        '**/404.html',
        '**/500.html',
        '**/error.html',
        '**/test/**',
        '**/tests/**',
        '**/private/**',
        '**/admin/**'
      ],
      
      // Advanced features
      generateRobotsTxt: config.generateRobotsTxt !== false,
      generateUrlList: config.generateUrlList !== false,
      generateSitemapIndex: config.generateSitemapIndex !== false,
      generateImageSitemap: config.generateImageSitemap !== false,
      generateNewsSitemap: config.generateNewsSitemap !== false,
      
      // SEO settings
      defaultLanguage: config.defaultLanguage || 'en',
      alternateLanguages: config.alternateLanguages || [],
      
      // Performance
      maxUrlsPerSitemap: config.maxUrlsPerSitemap || 50000,
      maxSitemapSize: config.maxSitemapSize || 50 * 1024 * 1024, // 50MB
      
      // Compression
      compress: config.compress !== false,
      
      // Callbacks
      onProgress: config.onProgress || null,
      onComplete: config.onComplete || null,
      onError: config.onError || null
    };
    
    this.urls = [];
    this.images = new Map();
    this.news = [];
    this.errors = [];
  }

  /* ============================================
     MAIN GENERATION PROCESS
     ============================================ */
  async generate() {
    console.log('🚀 Starting sitemap generation...');
    const startTime = Date.now();
    
    try {
      // Step 1: Scan for files
      await this.scanFiles();
      
      // Step 2: Process files
      await this.processFiles();
      
      // Step 3: Generate sitemaps
      await this.generateSitemaps();
      
      // Step 4: Generate additional files
      if (this.config.generateRobotsTxt) {
        await this.generateRobotsTxt();
      }
      
      if (this.config.generateUrlList) {
        await this.generateUrlList();
      }
      
      // Step 5: Generate sitemap index if multiple sitemaps
      if (this.config.generateSitemapIndex && this.urls.length > this.config.maxUrlsPerSitemap) {
        await this.generateSitemapIndex();
      }
      
      // Complete
      const duration = Date.now() - startTime;
      console.log(`✅ Sitemap generation complete in ${duration}ms`);
      console.log(`📊 Generated ${this.urls.length} URLs`);
      
      if (this.config.onComplete) {
        this.config.onComplete({
          urls: this.urls.length,
          duration,
          files: this.generatedFiles || []
        });
      }
      
      return {
        success: true,
        urls: this.urls.length,
        duration,
        errors: this.errors
      };
      
    } catch (error) {
      console.error('❌ Error generating sitemap:', error);
      
      if (this.config.onError) {
        this.config.onError(error);
      }
      
      throw error;
    }
  }

  /* ============================================
     FILE SCANNING
     ============================================ */
  async scanFiles() {
    console.log('📁 Scanning for files...');
    
    const files = [];
    
    for (const pattern of this.config.includePatterns) {
      const matchedFiles = await glob(pattern, {
        cwd: this.config.sourceDir,
        absolute: false,
        ignore: this.config.excludePatterns
      });
      
      files.push(...matchedFiles);
    }
    
    this.files = [...new Set(files)]; // Remove duplicates
    console.log(`📄 Found ${this.files.length} files to process`);
    
    return this.files;
  }

  /* ============================================
     FILE PROCESSING
     ============================================ */
  async processFiles() {
    console.log('🔍 Processing files...');
    
    for (let i = 0; i < this.files.length; i++) {
      const file = this.files[i];
      
      try {
        await this.processFile(file);
        
        // Progress callback
        if (this.config.onProgress) {
          this.config.onProgress({
            current: i + 1,
            total: this.files.length,
            file,
            percentage: Math.round(((i + 1) / this.files.length) * 100)
          });
        }
      } catch (error) {
        console.error(`❌ Error processing ${file}:`, error.message);
        this.errors.push({ file, error: error.message });
      }
    }
  }

  async processFile(filePath) {
    const fullPath = path.join(this.config.sourceDir, filePath);
    const content = await fs.readFile(fullPath, 'utf-8');
    
    // Create DOM
    const dom = new JSDOM(content);
    const document = dom.window.document;
    
    // Extract metadata
    const metadata = this.extractMetadata(document, filePath);
    
    // Skip if noindex
    if (metadata.noindex) {
      console.log(`⏩ Skipping ${filePath} (noindex)`);
      return;
    }
    
    // Create URL entry
    const url = this.createUrlEntry(filePath, metadata);
    this.urls.push(url);
    
    // Extract images if enabled
    if (this.config.generateImageSitemap) {
      const images = this.extractImages(document, url.loc);
      if (images.length > 0) {
        this.images.set(url.loc, images);
      }
    }
    
    // Extract news if enabled
    if (this.config.generateNewsSitemap && metadata.newsArticle) {
      this.news.push({
        ...url,
        news: metadata.newsArticle
      });
    }
  }

  extractMetadata(document, filePath) {
    const metadata = {
      title: '',
      description: '',
      canonical: '',
      noindex: false,
      lastmod: new Date().toISOString(),
      changefreq: this.getChangeFreq(filePath),
      priority: this.getPriority(filePath),
      alternates: [],
      newsArticle: null
    };
    
    // Title
    const titleEl = document.querySelector('title');
    if (titleEl) metadata.title = titleEl.textContent.trim();
    
    // Description
    const descEl = document.querySelector('meta[name="description"]');
    if (descEl) metadata.description = descEl.content.trim();
    
    // Canonical URL
    const canonicalEl = document.querySelector('link[rel="canonical"]');
    if (canonicalEl) metadata.canonical = canonicalEl.href;
    
    // Robots meta
    const robotsEl = document.querySelector('meta[name="robots"]');
    if (robotsEl && robotsEl.content.includes('noindex')) {
      metadata.noindex = true;
    }
    
    // Last modified
    const lastModEl = document.querySelector('meta[name="last-modified"]');
    if (lastModEl) {
      metadata.lastmod = new Date(lastModEl.content).toISOString();
    } else {
      // Try to get from file stats
      try {
        const stats = fs.statSync(path.join(this.config.sourceDir, filePath));
        metadata.lastmod = stats.mtime.toISOString();
      } catch (e) {
        // Use current date as fallback
      }
    }
    
    // Language alternates
    const alternateEls = document.querySelectorAll('link[rel="alternate"][hreflang]');
    alternateEls.forEach(el => {
      metadata.alternates.push({
        lang: el.hreflang,
        href: el.href
      });
    });
    
    // News article metadata
    if (this.config.generateNewsSitemap) {
      const newsData = this.extractNewsMetadata(document);
      if (newsData) metadata.newsArticle = newsData;
    }
    
    return metadata;
  }

  extractNewsMetadata(document) {
    // Check for news article schema
    const schemaScript = document.querySelector('script[type="application/ld+json"]');
    if (schemaScript) {
      try {
        const schema = JSON.parse(schemaScript.textContent);
        if (schema['@type'] === 'NewsArticle' || schema['@type'] === 'Article') {
          return {
            title: schema.headline || schema.name,
            publicationDate: schema.datePublished,
            keywords: Array.isArray(schema.keywords) ? 
              schema.keywords.join(', ') : schema.keywords
          };
        }
      } catch (e) {
        // Invalid JSON-LD
      }
    }
    
    // Check for article metadata
    const articleDate = document.querySelector('meta[property="article:published_time"]');
    const articleTitle = document.querySelector('meta[property="og:title"]');
    
    if (articleDate && articleTitle) {
      return {
        title: articleTitle.content,
        publicationDate: new Date(articleDate.content).toISOString(),
        keywords: ''
      };
    }
    
    return null;
  }

  extractImages(document, pageUrl) {
    const images = [];
    const imageEls = document.querySelectorAll('img[src]');
    
    imageEls.forEach(img => {
      const src = img.src;
      if (!src || src.startsWith('data:')) return;
      
      const imageUrl = new URL(src, pageUrl).href;
      
      const image = {
        loc: imageUrl,
        title: img.title || img.alt || '',
        caption: img.getAttribute('data-caption') || ''
      };
      
      // Don't add duplicate images
      if (!images.find(i => i.loc === image.loc)) {
        images.push(image);
      }
    });
    
    return images;
  }

  createUrlEntry(filePath, metadata) {
    // Convert file path to URL
    let urlPath = filePath.replace(/\\/g, '/');
    
    // Remove index.html
    if (urlPath.endsWith('/index.html')) {
      urlPath = urlPath.slice(0, -10) || '/';
    } else if (urlPath.endsWith('.html')) {
      urlPath = urlPath.slice(0, -5);
    }
    
    // Ensure leading slash
    if (!urlPath.startsWith('/')) {
      urlPath = '/' + urlPath;
    }
    
    const url = {
      loc: metadata.canonical || `${this.config.baseUrl}${urlPath}`,
      lastmod: metadata.lastmod,
      changefreq: metadata.changefreq,
      priority: metadata.priority
    };
    
    // Add alternates if any
    if (metadata.alternates.length > 0) {
      url.alternates = metadata.alternates;
    }
    
    return url;
  }

  getChangeFreq(filePath) {
    const normalized = filePath.toLowerCase();
    
    if (normalized === 'index.html' || normalized === '') {
      return this.config.changefreq.home;
    }
    
    for (const [key, freq] of Object.entries(this.config.changefreq)) {
      if (normalized.includes(key)) {
        return freq;
      }
    }
    
    return this.config.changefreq.default;
  }

  getPriority(filePath) {
    const normalized = filePath.toLowerCase();
    
    if (normalized === 'index.html' || normalized === '') {
      return this.config.priority.home;
    }
    
    for (const [key, priority] of Object.entries(this.config.priority)) {
      if (normalized.includes(key)) {
        return priority;
      }
    }
    
    return this.config.priority.default;
  }

  /* ============================================
     SITEMAP GENERATION
     ============================================ */
  async generateSitemaps() {
    console.log('📝 Generating sitemaps...');
    
    this.generatedFiles = [];
    
    // Main sitemap
    if (this.urls.length <= this.config.maxUrlsPerSitemap) {
      await this.generateSingleSitemap();
    } else {
      await this.generateMultipleSitemaps();
    }
    
    // Image sitemap
    if (this.config.generateImageSitemap && this.images.size > 0) {
      await this.generateImageSitemap();
    }
    
    // News sitemap
    if (this.config.generateNewsSitemap && this.news.length > 0) {
      await this.generateNewsSitemap();
    }
  }

  async generateSingleSitemap() {
    const xml = this.buildSitemapXml(this.urls);
    const filePath = path.join(this.config.outputDir, 'sitemap.xml');
    
    await this.writeFile(filePath, xml);
    this.generatedFiles.push('sitemap.xml');
    
    if (this.config.compress) {
      await this.compressFile(filePath);
      this.generatedFiles.push('sitemap.xml.gz');
    }
  }

  async generateMultipleSitemaps() {
    const chunks = this.chunkArray(this.urls, this.config.maxUrlsPerSitemap);
    
    for (let i = 0; i < chunks.length; i++) {
      const xml = this.buildSitemapXml(chunks[i]);
      const filename = `sitemap-${i + 1}.xml`;
      const filePath = path.join(this.config.outputDir, filename);
      
      await this.writeFile(filePath, xml);
      this.generatedFiles.push(filename);
      
      if (this.config.compress) {
        await this.compressFile(filePath);
        this.generatedFiles.push(`${filename}.gz`);
      }
    }
  }

  buildSitemapXml(urls) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';
    
    // Add language namespace if needed
    const hasAlternates = urls.some(url => url.alternates && url.alternates.length > 0);
    if (hasAlternates) {
      xml += '\n  xmlns:xhtml="http://www.w3.org/1999/xhtml"';
    }
    
    xml += '>\n';
    
    for (const url of urls) {
      xml += '  <url>\n';
      xml += `    <loc>${this.escapeXml(url.loc)}</loc>\n`;
      xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
      xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
      xml += `    <priority>${url.priority}</priority>\n`;
      
      // Add language alternates
      if (url.alternates && url.alternates.length > 0) {
        for (const alt of url.alternates) {
          xml += `    <xhtml:link rel="alternate" hreflang="${alt.lang}" href="${this.escapeXml(alt.href)}" />\n`;
        }
      }
      
      xml += '  </url>\n';
    }
    
    xml += '</urlset>';
    
    return xml;
  }

  async generateImageSitemap() {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
    xml += '  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';
    
    for (const [pageUrl, images] of this.images.entries()) {
      xml += '  <url>\n';
      xml += `    <loc>${this.escapeXml(pageUrl)}</loc>\n`;
      
      for (const image of images) {
        xml += '    <image:image>\n';
        xml += `      <image:loc>${this.escapeXml(image.loc)}</image:loc>\n`;
        
        if (image.title) {
          xml += `      <image:title>${this.escapeXml(image.title)}</image:title>\n`;
        }
        
        if (image.caption) {
          xml += `      <image:caption>${this.escapeXml(image.caption)}</image:caption>\n`;
        }
        
        xml += '    </image:image>\n';
      }
      
      xml += '  </url>\n';
    }
    
    xml += '</urlset>';
    
    const filePath = path.join(this.config.outputDir, 'sitemap-images.xml');
    await this.writeFile(filePath, xml);
    this.generatedFiles.push('sitemap-images.xml');
  }

  async generateNewsSitemap() {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
    xml += '  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n';
    
    for (const item of this.news) {
      xml += '  <url>\n';
      xml += `    <loc>${this.escapeXml(item.loc)}</loc>\n`;
      xml += '    <news:news>\n';
      xml += '      <news:publication>\n';
      xml += `        <news:name>DGrealtors News</news:name>\n`;
      xml += `        <news:language>${this.config.defaultLanguage}</news:language>\n`;
      xml += '      </news:publication>\n';
      xml += `      <news:publication_date>${item.news.publicationDate}</news:publication_date>\n`;
      xml += `      <news:title>${this.escapeXml(item.news.title)}</news:title>\n`;
      
      if (item.news.keywords) {
        xml += `      <news:keywords>${this.escapeXml(item.news.keywords)}</news:keywords>\n`;
      }
      
      xml += '    </news:news>\n';
      xml += '  </url>\n';
    }
    
    xml += '</urlset>';
    
    const filePath = path.join(this.config.outputDir, 'sitemap-news.xml');
    await this.writeFile(filePath, xml);
    this.generatedFiles.push('sitemap-news.xml');
  }

  async generateSitemapIndex() {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    const sitemapFiles = this.generatedFiles.filter(f => 
      f.endsWith('.xml') && !f.includes('index')
    );
    
    for (const file of sitemapFiles) {
      const loc = `${this.config.baseUrl}/${file}`;
      const lastmod = new Date().toISOString();
      
      xml += '  <sitemap>\n';
      xml += `    <loc>${this.escapeXml(loc)}</loc>\n`;
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += '  </sitemap>\n';
    }
    
    xml += '</sitemapindex>';
    
    const filePath = path.join(this.config.outputDir, 'sitemap-index.xml');
    await this.writeFile(filePath, xml);
    this.generatedFiles.push('sitemap-index.xml');
  }

  /* ============================================
     ROBOTS.TXT GENERATION
     ============================================ */
  async generateRobotsTxt() {
    console.log('🤖 Generating robots.txt...');
    
    let content = '# Robots.txt for DGrealtors\n';
    content += '# Generated: ' + new Date().toISOString() + '\n\n';
    
    // User agents
    content += 'User-agent: *\n';
    content += 'Allow: /\n';
    content += 'Disallow: /private/\n';
    content += 'Disallow: /admin/\n';
    content += 'Disallow: /api/\n';
    content += 'Disallow: *.pdf$\n';
    content += 'Crawl-delay: 1\n\n';
    
    // Specific bot rules
    content += '# Googlebot\n';
    content += 'User-agent: Googlebot\n';
    content += 'Allow: /\n';
    content += 'Crawl-delay: 0\n\n';
    
    // Bad bots
    content += '# Block bad bots\n';
    const badBots = ['AhrefsBot', 'SemrushBot', 'DotBot', 'MJ12bot'];
    for (const bot of badBots) {
      content += `User-agent: ${bot}\n`;
      content += 'Disallow: /\n\n';
    }
    
    // Sitemap references
    content += '# Sitemaps\n';
    if (this.generatedFiles.includes('sitemap-index.xml')) {
      content += `Sitemap: ${this.config.baseUrl}/sitemap-index.xml\n`;
    } else if (this.generatedFiles.includes('sitemap.xml')) {
      content += `Sitemap: ${this.config.baseUrl}/sitemap.xml\n`;
    }
    
    // Additional sitemaps
    if (this.generatedFiles.includes('sitemap-images.xml')) {
      content += `Sitemap: ${this.config.baseUrl}/sitemap-images.xml\n`;
    }
    if (this.generatedFiles.includes('sitemap-news.xml')) {
      content += `Sitemap: ${this.config.baseUrl}/sitemap-news.xml\n`;
    }
    
    const filePath = path.join(this.config.outputDir, 'robots.txt');
    await this.writeFile(filePath, content);
    this.generatedFiles.push('robots.txt');
  }

  /* ============================================
     URL LIST GENERATION
     ============================================ */
  async generateUrlList() {
    console.log('📋 Generating URL list...');
    
    // Plain text list
    const urlListTxt = this.urls.map(u => u.loc).join('\n');
    const txtPath = path.join(this.config.outputDir, 'urls.txt');
    await this.writeFile(txtPath, urlListTxt);
    this.generatedFiles.push('urls.txt');
    
    // JSON format
    const urlListJson = JSON.stringify({
      generated: new Date().toISOString(),
      baseUrl: this.config.baseUrl,
      totalUrls: this.urls.length,
      urls: this.urls
    }, null, 2);
    
    const jsonPath = path.join(this.config.outputDir, 'urls.json');
    await this.writeFile(jsonPath, urlListJson);
    this.generatedFiles.push('urls.json');
    
    // CSV format
    let csvContent = 'URL,Last Modified,Change Frequency,Priority\n';
    for (const url of this.urls) {
      csvContent += `"${url.loc}","${url.lastmod}","${url.changefreq}",${url.priority}\n`;
    }
    
    const csvPath = path.join(this.config.outputDir, 'urls.csv');
    await this.writeFile(csvPath, csvContent);
    this.generatedFiles.push('urls.csv');
  }

  /* ============================================
     UTILITY METHODS
     ============================================ */
  async writeFile(filePath, content) {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, content, 'utf-8');
    console.log(`✅ Written: ${path.basename(filePath)}`);
  }

  async compressFile(filePath) {
    const zlib = require('zlib');
    const gzip = zlib.createGzip({ level: 9 });
    
    const source = fs.createReadStream(filePath);
    const destination = fs.createWriteStream(`${filePath}.gz`);
    
    return new Promise((resolve, reject) => {
      source
        .pipe(gzip)
        .pipe(destination)
        .on('finish', resolve)
        .on('error', reject);
    });
  }

  chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  escapeXml(str) {
    if (!str) return '';
    
    const xmlEscapes = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&apos;'
    };
    
    return str.replace(/[&<>"']/g, char => xmlEscapes[char]);
  }

  /* ============================================
     STATIC METHODS
     ============================================ */
  static async quickGenerate(options = {}) {
    const generator = new SitemapGenerator(options);
    return generator.generate();
  }

  static validateSitemap(xmlContent) {
    // Basic XML validation
    try {
      const dom = new JSDOM(xmlContent, { contentType: 'text/xml' });
      const errors = dom.window.document.querySelector('parsererror');
      
      if (errors) {
        return {
          valid: false,
          error: errors.textContent
        };
      }
      
      // Check for required elements
      const urlset = dom.window.document.querySelector('urlset');
      if (!urlset) {
        return {
          valid: false,
          error: 'Missing urlset element'
        };
      }
      
      const urls = dom.window.document.querySelectorAll('url');
      if (urls.length === 0) {
        return {
          valid: false,
          error: 'No URL entries found'
        };
      }
      
      // Validate each URL entry
      let urlErrors = [];
      urls.forEach((url, index) => {
        const loc = url.querySelector('loc');
        if (!loc || !loc.textContent) {
          urlErrors.push(`URL entry ${index + 1}: Missing loc element`);
        }
      });
      
      if (urlErrors.length > 0) {
        return {
          valid: false,
          errors: urlErrors
        };
      }
      
      return {
        valid: true,
        urlCount: urls.length
      };
      
    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    }
  }
}

/* ============================================
   CLI INTERFACE
   ============================================ */
if (require.main === module) {
  const program = require('commander');
  
  program
    .version('1.0.0')
    .description('Generate XML sitemaps for DGrealtors website')
    .option('-b, --base-url <url>', 'Base URL of the website', 'https://dgrealtors.com')
    .option('-s, --source <dir>', 'Source directory', './src')
    .option('-o, --output <dir>', 'Output directory', './public')
    .option('--no-robots', 'Skip robots.txt generation')
    .option('--no-compress', 'Skip gzip compression')
    .option('--no-images', 'Skip image sitemap')
    .option('--no-news', 'Skip news sitemap')
    .option('--validate <file>', 'Validate a sitemap file')
    .parse(process.argv);

  const options = program.opts();

  if (options.validate) {
    // Validation mode
    fs.readFile(options.validate, 'utf-8')
      .then(content => {
        const result = SitemapGenerator.validateSitemap(content);
        if (result.valid) {
          console.log(`✅ Sitemap is valid! Contains ${result.urlCount} URLs.`);
          process.exit(0);
        } else {
          console.error('❌ Sitemap validation failed:');
          console.error(result.error || result.errors);
          process.exit(1);
        }
      })
      .catch(error => {
        console.error(`❌ Error reading file: ${error.message}`);
        process.exit(1);
      });
  } else {
    // Generation mode
    const generator = new SitemapGenerator({
      baseUrl: options.baseUrl,
      sourceDir: options.source,
      outputDir: options.output,
      generateRobotsTxt: options.robots,
      compress: options.compress,
      generateImageSitemap: options.images,
      generateNewsSitemap: options.news,
      
      onProgress: (progress) => {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(
          `Processing: ${progress.current}/${progress.total} (${progress.percentage}%) - ${progress.file}`
        );
      }
    });

    generator.generate()
      .then(result => {
        console.log('\n✨ Done!');
        if (result.errors.length > 0) {
          console.log('\n⚠️  Errors encountered:');
          result.errors.forEach(err => {
            console.log(`  - ${err.file}: ${err.error}`);
          });
        }
        process.exit(0);
      })
      .catch(error => {
        console.error('\n❌ Failed:', error.message);
        process.exit(1);
      });
  }
}

/* ============================================
   EXPORTS
   ============================================ */
module.exports = SitemapGenerator;

