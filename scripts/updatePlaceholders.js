/* ============================================
   ADVANCED PLACEHOLDER UPDATE SCRIPT
   Updates placeholder images with real images
   ============================================ */

const fs = require('fs').promises;
const path = require('path');
const { JSDOM } = require('jsdom');
const glob = require('glob-promise');
const fetch = require('node-fetch');
const sharp = require('sharp');
const OpenAI = require('openai');
const { createHash } = require('crypto');

class PlaceholderUpdater {
  constructor(config = {}) {
    this.config = {
      // Directories
      sourceDir: config.sourceDir || path.join(process.cwd(), 'src'),
      outputDir: config.outputDir || path.join(process.cwd(), 'public'),
      imageDir: config.imageDir || path.join(process.cwd(), 'public/images'),
      cacheDir: config.cacheDir || path.join(process.cwd(), '.placeholder-cache'),
      
      // File patterns
      filePatterns: config.filePatterns || ['**/*.html', '**/*.jsx', '**/*.js'],
      excludePatterns: config.excludePatterns || ['**/node_modules/**', '**/build/**'],
      
      // Placeholder detection
      placeholderUrls: config.placeholderUrls || [
        'placehold.co',
        'placeholder.com',
        'placekitten.com',
        'via.placeholder.com',
        'dummyimage.com',
        'lorempixel.com',
        'fillmurray.com',
        'placecage.com'
      ],
      
      // Image generation
      imageGenerator: config.imageGenerator || 'dalle3', // 'dalle3', 'stable-diffusion', 'midjourney'
      openaiApiKey: config.openaiApiKey || process.env.OPENAI_API_KEY,
      stableDiffusionApiKey: config.stableDiffusionApiKey || process.env.SD_API_KEY,
      
      // Image providers (fallback options)
      imageProviders: config.imageProviders || {
        unsplash: {
          accessKey: process.env.UNSPLASH_ACCESS_KEY,
          enabled: true
        },
        pexels: {
          apiKey: process.env.PEXELS_API_KEY,
          enabled: true
        },
        pixabay: {
          apiKey: process.env.PIXABAY_API_KEY,
          enabled: true
        }
      },
      
      // Processing options
      processInPlace: config.processInPlace !== false,
      generateReport: config.generateReport !== false,
      validateImages: config.validateImages !== false,
      optimizeImages: config.optimizeImages !== false,
      preserveAspectRatio: config.preserveAspectRatio !== false,
      
      // Image settings
      imageQuality: config.imageQuality || 85,
      imageFormats: config.imageFormats || ['jpg', 'webp'],
      maxImageWidth: config.maxImageWidth || 2560,
      maxImageHeight: config.maxImageHeight || 1440,
      
      // Enhanced alt text
      enhanceAltText: config.enhanceAltText !== false,
      altTextModel: config.altTextModel || 'gpt-4-vision-preview',
      
      // Caching
      useCache: config.useCache !== false,
      cacheExpiry: config.cacheExpiry || 30 * 24 * 60 * 60 * 1000, // 30 days
      
      // Callbacks
      onProgress: config.onProgress || null,
      onImageGenerated: config.onImageGenerated || null,
      onComplete: config.onComplete || null,
      onError: config.onError || null
    };
    
    // State
    this.files = [];
    this.placeholders = [];
    this.generatedImages = [];
    this.errors = [];
    this.cache = new Map();
    this.report = {
      totalPlaceholders: 0,
      replaced: 0,
      failed: 0,
      cached: 0,
      byProvider: {}
    };
    
    // Initialize AI clients
    this.initializeClients();
  }

  /* ============================================
     INITIALIZATION
     ============================================ */
  initializeClients() {
    // OpenAI client for DALL-E
    if (this.config.openaiApiKey) {
      this.openai = new OpenAI({
        apiKey: this.config.openaiApiKey
      });
    }
    
    // Add other AI service clients as needed
  }

  async setup() {
    // Create directories
    await fs.mkdir(this.config.imageDir, { recursive: true });
    await fs.mkdir(this.config.cacheDir, { recursive: true });
    
    // Load cache
    if (this.config.useCache) {
      await this.loadCache();
    }
  }

  /* ============================================
     MAIN PROCESS
     ============================================ */
  async updatePlaceholders() {
    console.log('🔄 Starting placeholder update process...');
    const startTime = Date.now();
    
    try {
      // Setup
      await this.setup();
      
      // Scan files
      await this.scanFiles();
      
      // Find placeholders
      await this.findPlaceholders();
      
      // Generate/fetch real images
      await this.processPlaceholders();
      
      // Update files
      if (this.config.processInPlace) {
        await this.updateFiles();
      }
      
      // Generate report
      if (this.config.generateReport) {
        await this.generateReport();
      }
      
      // Save cache
      if (this.config.useCache) {
        await this.saveCache();
      }
      
      // Complete
      const duration = Date.now() - startTime;
      console.log(`\n✅ Update complete in ${duration}ms`);
      console.log(`📊 Processed ${this.report.replaced}/${this.report.totalPlaceholders} placeholders`);
      
      if (this.config.onComplete) {
        this.config.onComplete({
          duration,
          report: this.report,
          errors: this.errors
        });
      }
      
      return {
        success: true,
        duration,
        report: this.report,
        errors: this.errors
      };
      
    } catch (error) {
      console.error('❌ Error updating placeholders:', error);
      
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
    
    for (const pattern of this.config.filePatterns) {
      const matched = await glob(pattern, {
        cwd: this.config.sourceDir,
        ignore: this.config.excludePatterns
      });
      files.push(...matched);
    }
    
    this.files = [...new Set(files)];
    console.log(`📄 Found ${this.files.length} files to scan`);
  }

  /* ============================================
     PLACEHOLDER DETECTION
     ============================================ */
  async findPlaceholders() {
    console.log('🔍 Finding placeholder images...');
    
    for (const file of this.files) {
      try {
        await this.findPlaceholdersInFile(file);
      } catch (error) {
        console.error(`Error scanning ${file}:`, error.message);
        this.errors.push({ file, error: error.message });
      }
    }
    
    console.log(`🎯 Found ${this.placeholders.length} placeholder images`);
    this.report.totalPlaceholders = this.placeholders.length;
  }

  async findPlaceholdersInFile(filePath) {
    const fullPath = path.join(this.config.sourceDir, filePath);
    const content = await fs.readFile(fullPath, 'utf-8');
    
    // Detect file type and parse accordingly
    const ext = path.extname(filePath).toLowerCase();
    let images = [];
    
    if (ext === '.html' || ext === '.htm') {
      images = await this.findImagesInHTML(content, filePath);
    } else if (ext === '.js' || ext === '.jsx' || ext === '.ts' || ext === '.tsx') {
      images = await this.findImagesInJavaScript(content, filePath);
    }
    
    // Filter for placeholders
    const placeholders = images.filter(img => this.isPlaceholder(img.src));
    
    placeholders.forEach(placeholder => {
      this.placeholders.push({
        ...placeholder,
        file: filePath
      });
    });
  }

  async findImagesInHTML(content, filePath) {
    const dom = new JSDOM(content);
    const images = [];
    
    // Find all img tags
    const imgElements = dom.window.document.querySelectorAll('img');
    
    imgElements.forEach((img, index) => {
      images.push({
        type: 'html',
        tag: img.outerHTML,
        src: img.src || img.dataset.src || '',
        alt: img.alt || '',
        width: img.width || img.getAttribute('width'),
        height: img.height || img.getAttribute('height'),
        class: img.className,
        id: img.id,
        index,
        lineNumber: this.getLineNumber(content, img.outerHTML)
      });
    });
    
    return images;
  }

  async findImagesInJavaScript(content, filePath) {
    const images = [];
    
    // Regular expressions for finding image references
    const patterns = [
      // JSX img tags
      /<img[^>]*src=["']([^"']+)["'][^>]*alt=["']([^"']*)["'][^>]*>/gi,
      // JSX img tags with template literals
      /<img[^>]*src=\{`([^`]+)`\}[^>]*alt=["']([^"']*)["'][^>]*>/gi,
      // Image objects
      /{\s*src:\s*["']([^"']+)["']\s*,\s*alt:\s*["']([^"']*)["']/gi,
      // Next.js Image component
      /<Image[^>]*src=["']([^"']+)["'][^>]*alt=["']([^"']*)["'][^>]*>/gi
    ];
    
    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        images.push({
          type: 'javascript',
          tag: match[0],
          src: match[1],
          alt: match[2] || '',
          index: match.index,
          lineNumber: this.getLineNumber(content, match[0])
        });
      }
    });
    
    return images;
  }

  isPlaceholder(src) {
    if (!src) return false;
    
    const lowerSrc = src.toLowerCase();
    return this.config.placeholderUrls.some(url => 
      lowerSrc.includes(url)
    );
  }

  getLineNumber(content, searchString) {
    const lines = content.split('\n');
    let currentIndex = 0;
    
    for (let i = 0; i < lines.length; i++) {
      if (content.indexOf(searchString, currentIndex) < currentIndex + lines[i].length) {
        return i + 1;
      }
      currentIndex += lines[i].length + 1;
    }
    
    return 0;
  }

  /* ============================================
     IMAGE GENERATION/FETCHING
     ============================================ */
  async processPlaceholders() {
    console.log('🎨 Processing placeholders...');
    
    // Group placeholders by unique alt text
    const grouped = this.groupPlaceholdersByAlt();
    
    // Process in batches
    const batchSize = 5;
    const entries = Object.entries(grouped);
    
    for (let i = 0; i < entries.length; i += batchSize) {
      const batch = entries.slice(i, i + batchSize);
      
      await Promise.all(
        batch.map(([altText, placeholders]) => 
          this.processPlaceholderGroup(altText, placeholders, i / batchSize)
        )
      );
      
      // Progress callback
      if (this.config.onProgress) {
        this.config.onProgress({
          current: Math.min(i + batchSize, entries.length),
          total: entries.length,
          percentage: Math.round((Math.min(i + batchSize, entries.length) / entries.length) * 100)
        });
      }
    }
  }

  groupPlaceholdersByAlt() {
    const grouped = {};
    
    this.placeholders.forEach(placeholder => {
      const key = placeholder.alt || 'no-alt';
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(placeholder);
    });
    
    return grouped;
  }

  async processPlaceholderGroup(altText, placeholders, batchIndex) {
    try {
      // Get dimensions from first placeholder
      const dimensions = this.extractDimensions(placeholders[0]);
      
      // Check cache first
      const cacheKey = this.getCacheKey(altText, dimensions);
      if (this.config.useCache && this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        if (Date.now() - cached.timestamp < this.config.cacheExpiry) {
          console.log(`📦 Using cached image for: "${altText}"`);
          this.report.cached++;
          
          placeholders.forEach(placeholder => {
            placeholder.newSrc = cached.imagePath;
            placeholder.generated = true;
          });
          
          return;
        }
      }
      
      // Generate or fetch image
      let imagePath;
      if (altText && altText !== 'no-alt') {
        imagePath = await this.generateImage(altText, dimensions);
      } else {
        imagePath = await this.fetchStockImage('professional real estate', dimensions);
      }
      
      if (imagePath) {
        // Update cache
        if (this.config.useCache) {
          this.cache.set(cacheKey, {
            imagePath,
            timestamp: Date.now()
          });
        }
        
        // Update placeholders
        placeholders.forEach(placeholder => {
          placeholder.newSrc = imagePath;
          placeholder.generated = true;
        });
        
        this.report.replaced++;
        
        // Callback
        if (this.config.onImageGenerated) {
          this.config.onImageGenerated({
            altText,
            imagePath,
            placeholders: placeholders.length
          });
        }
      } else {
        throw new Error('Failed to generate or fetch image');
      }
      
    } catch (error) {
      console.error(`❌ Error processing "${altText}":`, error.message);
      
      placeholders.forEach(placeholder => {
        placeholder.error = error.message;
      });
      
      this.report.failed++;
      this.errors.push({
        altText,
        error: error.message,
        placeholders: placeholders.length
      });
    }
  }

  extractDimensions(placeholder) {
    let width = 1920;
    let height = 1080;
    
    // Try to extract from src URL
    if (placeholder.src) {
      const urlMatch = placeholder.src.match(/(\d+)x(\d+)/);
      if (urlMatch) {
        width = parseInt(urlMatch[1]);
        height = parseInt(urlMatch[2]);
      }
    }
    
    // Override with explicit dimensions
    if (placeholder.width) width = parseInt(placeholder.width);
    if (placeholder.height) height = parseInt(placeholder.height);
    
    // Apply maximum constraints
    if (width > this.config.maxImageWidth) {
      const ratio = height / width;
      width = this.config.maxImageWidth;
      height = Math.round(width * ratio);
    }
    
    if (height > this.config.maxImageHeight) {
      const ratio = width / height;
      height = this.config.maxImageHeight;
      width = Math.round(height * ratio);
    }
    
    return { width, height };
  }

  /* ============================================
     IMAGE GENERATION
     ============================================ */
  async generateImage(altText, dimensions) {
    console.log(`🎨 Generating image for: "${altText}"`);
    
    // Enhance prompt for better real estate images
    const enhancedPrompt = this.enhancePrompt(altText);
    
    switch (this.config.imageGenerator) {
      case 'dalle3':
        return await this.generateWithDalle3(enhancedPrompt, dimensions);
      case 'stable-diffusion':
        return await this.generateWithStableDiffusion(enhancedPrompt, dimensions);
      default:
        // Fallback to stock photo
        return await this.fetchStockImage(altText, dimensions);
    }
  }

  enhancePrompt(altText) {
    // Add context for real estate imagery
    const context = 'Professional real estate photography, high quality, modern, bright, clean, architectural';
    
    // Enhance the prompt
    let enhanced = altText;
    
    // Add style modifiers if not present
    if (!altText.toLowerCase().includes('photo') && !altText.toLowerCase().includes('illustration')) {
      enhanced = `${altText}, photorealistic`;
    }
    
    // Add quality modifiers
    enhanced = `${enhanced}, ${context}`;
    
    // Add aspect ratio hints
    enhanced = `${enhanced}, well-composed, professionally shot`;
    
    return enhanced;
  }

  async generateWithDalle3(prompt, dimensions) {
    if (!this.openai) {
      throw new Error('OpenAI client not initialized');
    }
    
    try {
      // Determine size based on dimensions
      let size = '1024x1024';
      if (dimensions.width > dimensions.height * 1.5) {
        size = '1792x1024'; // Landscape
      } else if (dimensions.height > dimensions.width * 1.5) {
        size = '1024x1792'; // Portrait
      }
      
      const response = await this.openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: size,
        quality: "standard",
        style: "natural"
      });
      
      const imageUrl = response.data[0].url;
      
      // Download and save image
      return await this.downloadAndSaveImage(imageUrl, prompt, dimensions);
      
    } catch (error) {
      console.error('DALL-E 3 generation failed:', error.message);
      // Fallback to stock photo
      return await this.fetchStockImage(prompt, dimensions);
    }
  }

  async generateWithStableDiffusion(prompt, dimensions) {
    // Implement Stable Diffusion API call
    // This is a placeholder - implement based on your chosen SD API
    throw new Error('Stable Diffusion not implemented');
  }

  /* ============================================
     STOCK PHOTO FETCHING
     ============================================ */
  async fetchStockImage(query, dimensions) {
    console.log(`📷 Fetching stock image for: "${query}"`);
    
    // Enhanced query for real estate
    const enhancedQuery = this.enhanceStockQuery(query);
    
    // Try providers in order
    const providers = Object.entries(this.config.imageProviders)
      .filter(([_, config]) => config.enabled);
    
    for (const [provider, config] of providers) {
      try {
        let imageUrl;
        
        switch (provider) {
          case 'unsplash':
            imageUrl = await this.fetchFromUnsplash(enhancedQuery, dimensions, config);
            break;
          case 'pexels':
            imageUrl = await this.fetchFromPexels(enhancedQuery, dimensions, config);
            break;
          case 'pixabay':
            imageUrl = await this.fetchFromPixabay(enhancedQuery, dimensions, config);
            break;
        }
        
        if (imageUrl) {
          this.report.byProvider[provider] = (this.report.byProvider[provider] || 0) + 1;
          return await this.downloadAndSaveImage(imageUrl, query, dimensions);
        }
      } catch (error) {
        console.error(`${provider} failed:`, error.message);
      }
    }
    
    throw new Error('All image providers failed');
  }

  enhanceStockQuery(query) {
    // Add real estate context if not present
    const realEstateKeywords = [
      'real estate', 'property', 'home', 'house', 'building',
      'apartment', 'office', 'commercial', 'residential'
    ];
    
    const hasRealEstateContext = realEstateKeywords.some(keyword => 
      query.toLowerCase().includes(keyword)
    );
    
    if (!hasRealEstateContext) {
      return `${query} real estate professional`;
    }
    
    return query;
  }

  async fetchFromUnsplash(query, dimensions, config) {
    if (!config.accessKey) {
      throw new Error('Unsplash access key not provided');
    }
    
    const url = new URL('https://api.unsplash.com/photos/random');
    url.searchParams.append('query', query);
    url.searchParams.append('orientation', dimensions.width > dimensions.height ? 'landscape' : 'portrait');
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Client-ID ${config.accessKey}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.urls.regular;
  }

  async fetchFromPexels(query, dimensions, config) {
    if (!config.apiKey) {
      throw new Error('Pexels API key not provided');
    }
    
    const url = new URL('https://api.pexels.com/v1/search');
    url.searchParams.append('query', query);
    url.searchParams.append('per_page', '1');
    url.searchParams.append('orientation', dimensions.width > dimensions.height ? 'landscape' : 'portrait');
    
    const response = await fetch(url, {
      headers: {
        'Authorization': config.apiKey
      }
    });
    
    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.status}`);
    }
    
    const data = await response.json();
    if (data.photos.length === 0) {
      throw new Error('No images found');
    }
    
    return data.photos[0].src.large;
  }

  async fetchFromPixabay(query, dimensions, config) {
    if (!config.apiKey) {
      throw new Error('Pixabay API key not provided');
    }
    
    const url = new URL('https://pixabay.com/api/');
    url.searchParams.append('key', config.apiKey);
    url.searchParams.append('q', query);
    url.searchParams.append('image_type', 'photo');
    url.searchParams.append('safesearch', 'true');
    url.searchParams.append('per_page', '3');
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Pixabay API error: ${response.status}`);
    }
    
    const data = await response.json();
    if (data.hits.length === 0) {
      throw new Error('No images found');
    }
    
    return data.hits[0].largeImageURL;
  }

  /* ============================================
     IMAGE PROCESSING
     ============================================ */
  async downloadAndSaveImage(imageUrl, name, dimensions) {
    try {
      // Generate filename
      const hash = createHash('md5').update(name + dimensions.width + dimensions.height).digest('hex');
      const filename = `${this.sanitizeFilename(name)}-${hash.substring(0, 8)}`;
      
      // Download image
      const response = await fetch(imageUrl);
      const buffer = await response.buffer();
      
      // Process and save in multiple formats
      const savedPaths = await this.processAndSaveImage(buffer, filename, dimensions);
      
      // Return the primary (first) image path
      return savedPaths[0];
      
    } catch (error) {
      throw new Error(`Failed to download and save image: ${error.message}`);
    }
  }

  async processAndSaveImage(buffer, filename, dimensions) {
    const savedPaths = [];
    
    // Create sharp instance
    let image = sharp(buffer);
    
    // Get metadata
    const metadata = await image.metadata();
    
    // Resize if needed
    if (metadata.width > dimensions.width || metadata.height > dimensions.height) {
      image = image.resize(dimensions.width, dimensions.height, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }
    
    // Save in multiple formats
    for (const format of this.config.imageFormats) {
      const outputPath = path.join(this.config.imageDir, `${filename}.${format}`);
      
      switch (format) {
        case 'jpg':
        case 'jpeg':
          await image.jpeg({ 
            quality: this.config.imageQuality,
            progressive: true 
          }).toFile(outputPath);
          break;
          
        case 'webp':
          await image.webp({ 
            quality: this.config.imageQuality 
          }).toFile(outputPath);
          break;
          
        case 'png':
          await image.png({ 
            progressive: true,
            compressionLevel: 9 
          }).toFile(outputPath);
          break;
      }
      
      // Make path relative to project root
      const relativePath = path.relative(process.cwd(), outputPath).replace(/\\/g, '/');
      savedPaths.push('/' + relativePath);
    }
    
    this.generatedImages.push({
      name: filename,
      paths: savedPaths,
      dimensions,
      formats: this.config.imageFormats
    });
    
    return savedPaths;
  }

  sanitizeFilename(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 50);
  }

  /* ============================================
     FILE UPDATES
     ============================================ */
  async updateFiles() {
    console.log('📝 Updating files with new images...');
    
    // Group placeholders by file
    const byFile = {};
    this.placeholders.forEach(placeholder => {
      if (placeholder.generated) {
        if (!byFile[placeholder.file]) {
          byFile[placeholder.file] = [];
        }
        byFile[placeholder.file].push(placeholder);
      }
    });
    
    // Update each file
    for (const [file, placeholders] of Object.entries(byFile)) {
      try {
        await this.updateFile(file, placeholders);
      } catch (error) {
        console.error(`Error updating ${file}:`, error.message);
        this.errors.push({ file, error: error.message });
      }
    }
  }

  async updateFile(filePath, placeholders) {
    const fullPath = path.join(this.config.sourceDir, filePath);
    let content = await fs.readFile(fullPath, 'utf-8');
    
    // Sort placeholders by position (reverse order to maintain indices)
    placeholders.sort((a, b) => b.index - a.index);
    
    // Replace each placeholder
    placeholders.forEach(placeholder => {
      const newTag = this.createNewImageTag(placeholder);
      content = this.replaceInContent(content, placeholder, newTag);
    });
    
    // Write updated content
    await fs.writeFile(fullPath, content);
    console.log(`✅ Updated ${filePath} (${placeholders.length} images)`);
  }

  createNewImageTag(placeholder) {
    const { type, newSrc, alt, width, height, class: className, id } = placeholder;
    
    if (type === 'html') {
      let tag = `<img src="${newSrc}" alt="${alt}"`;
      
      if (width) tag += ` width="${width}"`;
      if (height) tag += ` height="${height}"`;
      if (className) tag += ` class="${className}"`;
      if (id) tag += ` id="${id}"`;
      
      // Add loading="lazy" for performance
      tag += ' loading="lazy"';
      
      tag += ' />';
      
      return tag;
    } else if (type === 'javascript') {
      // For JavaScript, maintain the original format but update src
      return placeholder.tag.replace(placeholder.src, newSrc);
    }
    
    return placeholder.tag;
  }

  replaceInContent(content, placeholder, newTag) {
    // Use the original tag for replacement to ensure exact match
    return content.replace(placeholder.tag, newTag);
  }

  /* ============================================
     REPORTING
     ============================================ */
  async generateReport() {
    console.log('📊 Generating report...');
    
    const report = {
      summary: {
        totalPlaceholders: this.report.totalPlaceholders,
        replaced: this.report.replaced,
        failed: this.report.failed,
        cached: this.report.cached,
        successRate: (this.report.replaced / this.report.totalPlaceholders * 100).toFixed(2) + '%'
      },
      providers: this.report.byProvider,
      generatedImages: this.generatedImages,
      errors: this.errors,
      placeholders: this.placeholders.map(p => ({
        file: p.file,
        line: p.lineNumber,
        alt: p.alt,
        oldSrc: p.src,
        newSrc: p.newSrc,
        status: p.generated ? 'success' : 'failed',
        error: p.error
      }))
    };
    
    // Save report
    const reportPath = path.join(this.config.cacheDir, `report-${Date.now()}.json`);
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    // Generate HTML report
    await this.generateHTMLReport(report);
    
    console.log(`✅ Report saved to ${reportPath}`);
  }

  async generateHTMLReport(report) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Placeholder Update Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f5f5;
      padding: 2rem;
      color: #333;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 8px;
      padding: 2rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    h1 {
      color: #1e3a5f;
      margin-bottom: 2rem;
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .stat {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      text-align: center;
    }
    .stat-value {
      font-size: 2rem;
      font-weight: bold;
      color: #2563eb;
    }
    .stat-label {
      color: #666;
      margin-top: 0.5rem;
    }
    .success { color: #10b981; }
    .error { color: #ef4444; }
    .warning { color: #f59e0b; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 2rem;
    }
    th, td {
      text-align: left;
      padding: 0.75rem;
      border-bottom: 1px solid #e5e5e5;
    }
    th {
      background: #f8f9fa;
      font-weight: 600;
    }
    .status-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 500;
    }
    .status-success {
      background: #d1fae5;
      color: #065f46;
    }
    .status-failed {
      background: #fee2e2;
      color: #991b1b;
    }
    .truncate {
      max-width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .image-preview {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
      margin-top: 2rem;
    }
    .image-card {
      border: 1px solid #e5e5e5;
      border-radius: 8px;
      overflow: hidden;
    }
    .image-card img {
      width: 100%;
      height: 150px;
      object-fit: cover;
    }
    .image-info {
      padding: 0.75rem;
      font-size: 0.875rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Placeholder Update Report</h1>
    
    <div class="summary">
      <div class="stat">
        <div class="stat-value">${report.summary.totalPlaceholders}</div>
        <div class="stat-label">Total Placeholders</div>
      </div>
      <div class="stat">
        <div class="stat-value success">${report.summary.replaced}</div>
        <div class="stat-label">Successfully Replaced</div>
      </div>
      <div class="stat">
        <div class="stat-value error">${report.summary.failed}</div>
        <div class="stat-label">Failed</div>
      </div>
      <div class="stat">
        <div class="stat-value">${report.summary.cached}</div>
        <div class="stat-label">From Cache</div>
      </div>
      <div class="stat">
        <div class="stat-value">${report.summary.successRate}</div>
        <div class="stat-label">Success Rate</div>
      </div>
    </div>
    
    ${report.providers && Object.keys(report.providers).length > 0 ? `
      <h2>Image Providers</h2>
      <div class="summary">
        ${Object.entries(report.providers).map(([provider, count]) => `
          <div class="stat">
            <div class="stat-value">${count}</div>
            <div class="stat-label">${provider}</div>
          </div>
        `).join('')}
      </div>
    ` : ''}
    
    <h2>Processed Images</h2>
    <table>
      <thead>
        <tr>
          <th>File</th>
          <th>Line</th>
          <th>Alt Text</th>
          <th>New Image</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${report.placeholders.slice(0, 100).map(p => `
          <tr>
            <td class="truncate" title="${p.file}">${p.file}</td>
            <td>${p.line || '-'}</td>
            <td class="truncate" title="${p.alt}">${p.alt || '[No alt text]'}</td>
            <td class="truncate" title="${p.newSrc || '-'}">${p.newSrc || '-'}</td>
            <td>
              <span class="status-badge status-${p.status}">
                ${p.status}
              </span>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    
    ${report.placeholders.length > 100 ? 
      `<p style="margin-top: 1rem; color: #666;">Showing first 100 of ${report.placeholders.length} placeholders</p>` 
      : ''
    }
    
    ${report.generatedImages.length > 0 ? `
      <h2 style="margin-top: 2rem;">Generated Images Preview</h2>
      <div class="image-preview">
        ${report.generatedImages.slice(0, 12).map(img => `
          <div class="image-card">
            <img src="${img.paths[0]}" alt="${img.name}" loading="lazy">
            <div class="image-info">
              <div>${img.name}</div>
              <div style="color: #666;">${img.dimensions.width}×${img.dimensions.height}</div>
            </div>
          </div>
        `).join('')}
      </div>
    ` : ''}
    
    ${report.errors.length > 0 ? `
      <h2 style="margin-top: 2rem; color: #ef4444;">Errors</h2>
      <table>
        <thead>
          <tr>
            <th>Context</th>
            <th>Error</th>
          </tr>
        </thead>
        <tbody>
          ${report.errors.map(e => `
            <tr>
              <td>${e.file || e.altText || 'Unknown'}</td>
              <td>${e.error}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    ` : ''}
  </div>
</body>
</html>`;
    
    const reportPath = path.join(this.config.cacheDir, 'report.html');
    await fs.writeFile(reportPath, html);
  }

  /* ============================================
     CACHE MANAGEMENT
     ============================================ */
  async loadCache() {
    try {
      const cachePath = path.join(this.config.cacheDir, 'placeholder-cache.json');
      const cacheData = await fs.readFile(cachePath, 'utf-8');
      const parsed = JSON.parse(cacheData);
      
      this.cache = new Map(parsed.entries);
      console.log(`📦 Loaded cache with ${this.cache.size} entries`);
    } catch (error) {
      console.log('🆕 Starting with fresh cache');
    }
  }

  async saveCache() {
    try {
      const cachePath = path.join(this.config.cacheDir, 'placeholder-cache.json');
      const cacheData = {
        version: '1.0.0',
        generated: new Date().toISOString(),
        entries: Array.from(this.cache.entries())
      };
      
      await fs.writeFile(cachePath, JSON.stringify(cacheData));
      console.log('💾 Cache saved');
    } catch (error) {
      console.error('Failed to save cache:', error);
    }
  }

  getCacheKey(altText, dimensions) {
    return createHash('md5')
      .update(`${altText}-${dimensions.width}x${dimensions.height}`)
      .digest('hex');
  }
}

/* ============================================
   CLI INTERFACE
   ============================================ */
if (require.main === module) {
  const program = require('commander');
  
  program
    .version('1.0.0')
    .description('Update placeholder images with real images')
    .option('-s, --source <dir>', 'Source directory', './src')
    .option('-i, --images <dir>', 'Images output directory', './public/images')
    .option('--openai-key <key>', 'OpenAI API key for DALL-E')
    .option('--unsplash-key <key>', 'Unsplash API key')
    .option('--pexels-key <key>', 'Pexels API key')
    .option('--pixabay-key <key>', 'Pixabay API key')
    .option('--no-cache', 'Disable caching')
    .option('--no-process', 'Don\'t update files in place')
    .option('--dry-run', 'Run without making changes')
    .parse(process.argv);

  const options = program.opts();

  // Create updater
  const updater = new PlaceholderUpdater({
    sourceDir: options.source,
    imageDir: options.images,
    openaiApiKey: options.openaiKey || process.env.OPENAI_API_KEY,
    imageProviders: {
      unsplash: {
        accessKey: options.unsplashKey || process.env.UNSPLASH_ACCESS_KEY,
        enabled: true
      },
      pexels: {
        apiKey: options.pexelsKey || process.env.PEXELS_API_KEY,
        enabled: true
      },
      pixabay: {
        apiKey: options.pixabayKey || process.env.PIXABAY_API_KEY,
        enabled: true
      }
    },
    useCache: options.cache,
    processInPlace: options.process && !options.dryRun,
    
    onProgress: (progress) => {
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      process.stdout.write(
        `Progress: ${progress.current}/${progress.total} (${progress.percentage}%)`
      );
    }
  });

  // Run update
  updater.updatePlaceholders()
    .then(result => {
      console.log('\n\n🎉 Placeholder update complete!');
      console.log(`✅ Replaced: ${result.report.replaced}`);
      console.log(`❌ Failed: ${result.report.failed}`);
      console.log(`📦 From cache: ${result.report.cached}`);
      
      if (Object.keys(result.report.byProvider).length > 0) {
        console.log('\n📸 Images by provider:');
        Object.entries(result.report.byProvider).forEach(([provider, count]) => {
          console.log(`  - ${provider}: ${count}`);
        });
      }
      
      if (result.errors.length > 0) {
        console.log('\n⚠️  Some errors occurred. Check the report for details.');
      }
      
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Update failed:', error.message);
      process.exit(1);
    });
}

/* ============================================
   EXPORTS
   ============================================ */
module.exports = PlaceholderUpdater;
