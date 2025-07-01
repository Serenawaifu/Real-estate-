/* ============================================
   ADVANCED IMAGE OPTIMIZATION SCRIPT
   Comprehensive image processing and optimization
   ============================================ */

const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const imageminWebp = require('imagemin-webp');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminGifsicle = require('imagemin-gifsicle');
const imageminSvgo = require('imagemin-svgo');
const glob = require('glob-promise');
const crypto = require('crypto');
const { promisify } = require('util');
const sizeOf = promisify(require('image-size'));

class ImageOptimizer {
  constructor(config = {}) {
    this.config = {
      // Directories
      sourceDir: config.sourceDir || path.join(process.cwd(), 'src/assets/images'),
      outputDir: config.outputDir || path.join(process.cwd(), 'public/images'),
      cacheDir: config.cacheDir || path.join(process.cwd(), '.image-cache'),
      
      // Image formats
      formats: config.formats || ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'avif'],
      outputFormats: config.outputFormats || ['original', 'webp', 'avif'],
      
      // Responsive sizes
      sizes: config.sizes || [
        { name: 'thumbnail', width: 150, height: 150, fit: 'cover' },
        { name: 'small', width: 320 },
        { name: 'medium', width: 768 },
        { name: 'large', width: 1024 },
        { name: 'xlarge', width: 1920 },
        { name: 'xxlarge', width: 2560 }
      ],
      
      // Quality settings
      quality: {
        jpg: config.quality?.jpg || 85,
        png: config.quality?.png || 90,
        webp: config.quality?.webp || 85,
        avif: config.quality?.avif || 80,
        gif: config.quality?.gif || 90
      },
      
      // Optimization settings
      enableSharp: config.enableSharp !== false,
      enableImagemin: config.enableImagemin !== false,
      enableResponsive: config.enableResponsive !== false,
      enableLazyBlur: config.enableLazyBlur !== false,
      enableMetadata: config.enableMetadata !== false,
      enableWatermark: config.enableWatermark || false,
      
      // Watermark settings
      watermark: {
        text: config.watermark?.text || 'DGrealtors',
        logo: config.watermark?.logo || null,
        position: config.watermark?.position || 'southeast',
        opacity: config.watermark?.opacity || 0.5,
        margin: config.watermark?.margin || 20
      },
      
      // Performance settings
      concurrency: config.concurrency || 4,
      skipOptimized: config.skipOptimized !== false,
      useCache: config.useCache !== false,
      
      // Output settings
      preserveStructure: config.preserveStructure !== false,
      generateManifest: config.generateManifest !== false,
      generateHTML: config.generateHTML !== false,
      
      // Callbacks
      onProgress: config.onProgress || null,
      onComplete: config.onComplete || null,
      onError: config.onError || null
    };
    
    // State
    this.images = [];
    this.processed = [];
    this.errors = [];
    this.cache = new Map();
    this.manifest = {
      version: '1.0.0',
      generated: new Date().toISOString(),
      images: {}
    };
  }

  /* ============================================
     MAIN OPTIMIZATION PROCESS
     ============================================ */
  async optimize() {
    console.log('🖼️  Starting image optimization...');
    const startTime = Date.now();
    
    try {
      // Setup
      await this.setup();
      
      // Load cache if enabled
      if (this.config.useCache) {
        await this.loadCache();
      }
      
      // Scan for images
      await this.scanImages();
      
      // Process images
      await this.processImages();
      
      // Generate outputs
      if (this.config.generateManifest) {
        await this.generateManifest();
      }
      
      if (this.config.generateHTML) {
        await this.generateHTML();
      }
      
      // Save cache
      if (this.config.useCache) {
        await this.saveCache();
      }
      
      // Complete
      const duration = Date.now() - startTime;
      const stats = this.getStats();
      
      console.log(`✅ Optimization complete in ${duration}ms`);
      console.log(`📊 Processed ${this.processed.length} images`);
      console.log(`💾 Total savings: ${this.formatBytes(stats.totalSaved)}`);
      
      if (this.config.onComplete) {
        this.config.onComplete({
          processed: this.processed.length,
          duration,
          stats,
          errors: this.errors
        });
      }
      
      return {
        success: true,
        processed: this.processed.length,
        duration,
        stats,
        errors: this.errors
      };
      
    } catch (error) {
      console.error('❌ Error during optimization:', error);
      
      if (this.config.onError) {
        this.config.onError(error);
      }
      
      throw error;
    }
  }

  /* ============================================
     SETUP
     ============================================ */
  async setup() {
    // Create output directories
    await fs.mkdir(this.config.outputDir, { recursive: true });
    
    if (this.config.useCache) {
      await fs.mkdir(this.config.cacheDir, { recursive: true });
    }
    
    // Set sharp configuration
    if (this.config.enableSharp) {
      sharp.cache(false);
      sharp.concurrency(this.config.concurrency);
    }
  }

  /* ============================================
     IMAGE SCANNING
     ============================================ */
  async scanImages() {
    console.log('🔍 Scanning for images...');
    
    const patterns = this.config.formats.map(
      format => `**/*.${format}`
    );
    
    const files = [];
    
    for (const pattern of patterns) {
      const matched = await glob(pattern, {
        cwd: this.config.sourceDir,
        nodir: true
      });
      files.push(...matched);
    }
    
    this.images = [...new Set(files)]; // Remove duplicates
    console.log(`📸 Found ${this.images.length} images to process`);
  }

  /* ============================================
     IMAGE PROCESSING
     ============================================ */
  async processImages() {
    console.log('⚡ Processing images...');
    
    // Process in batches for better performance
    const batches = this.chunkArray(this.images, this.config.concurrency);
    
    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];
      
      await Promise.all(
        batch.map((image, index) => 
          this.processImage(image, batchIndex * this.config.concurrency + index)
        )
      );
    }
  }

  async processImage(imagePath, index) {
    try {
      const sourcePath = path.join(this.config.sourceDir, imagePath);
      
      // Check if already optimized (using cache)
      if (this.config.useCache && this.config.skipOptimized) {
        const hash = await this.getFileHash(sourcePath);
        if (this.cache.has(hash)) {
          console.log(`⏩ Skipping ${imagePath} (already optimized)`);
          return;
        }
      }
      
      // Get image info
      const info = await this.getImageInfo(sourcePath);
      
      // Process based on image type
      let results;
      if (info.format === 'svg') {
        results = await this.processSVG(sourcePath, imagePath, info);
      } else {
        results = await this.processRasterImage(sourcePath, imagePath, info);
      }
      
      // Add to processed list
      this.processed.push({
        source: imagePath,
        info,
        results
      });
      
      // Update manifest
      if (this.config.generateManifest) {
        this.manifest.images[imagePath] = {
          original: info,
          outputs: results
        };
      }
      
      // Progress callback
      if (this.config.onProgress) {
        this.config.onProgress({
          current: index + 1,
          total: this.images.length,
          file: imagePath,
          percentage: Math.round(((index + 1) / this.images.length) * 100)
        });
      }
      
    } catch (error) {
      console.error(`❌ Error processing ${imagePath}:`, error.message);
      this.errors.push({
        file: imagePath,
        error: error.message
      });
    }
  }

  /* ============================================
     RASTER IMAGE PROCESSING
     ============================================ */
  async processRasterImage(sourcePath, imagePath, info) {
    const results = [];
    const ext = path.extname(imagePath);
    const name = path.basename(imagePath, ext);
    const dir = path.dirname(imagePath);
    
    // Create output directory
    const outputDir = this.config.preserveStructure 
      ? path.join(this.config.outputDir, dir)
      : this.config.outputDir;
    
    await fs.mkdir(outputDir, { recursive: true });
    
    // Process each size
    for (const size of this.config.sizes) {
      // Skip if image is smaller than target size
      if (info.width < size.width) {
        continue;
      }
      
      // Process each output format
      for (const format of this.config.outputFormats) {
        try {
          const result = await this.processImageSize(
            sourcePath, 
            outputDir, 
            name, 
            size, 
            format,
            info
          );
          results.push(result);
        } catch (error) {
          console.error(`Error processing ${imagePath} at size ${size.name}:`, error);
        }
      }
    }
    
    // Generate lazy loading placeholder
    if (this.config.enableLazyBlur) {
      const placeholder = await this.generatePlaceholder(sourcePath, outputDir, name);
      results.push(placeholder);
    }
    
    return results;
  }

  async processImageSize(sourcePath, outputDir, name, size, format, originalInfo) {
    // Build output filename
    const suffix = size.name === 'xxlarge' ? '' : `-${size.name}`;
    const extension = format === 'original' ? path.extname(sourcePath) : `.${format}`;
    const outputName = `${name}${suffix}${extension}`;
    const outputPath = path.join(outputDir, outputName);
    
    // Create sharp instance
    let sharpInstance = sharp(sourcePath);
    
    // Apply resize
    const resizeOptions = {
      width: size.width,
      height: size.height,
      fit: size.fit || 'inside',
      withoutEnlargement: true
    };
    
    if (size.height) {
      resizeOptions.position = size.position || 'center';
    }
    
    sharpInstance = sharpInstance.resize(resizeOptions);
    
    // Apply watermark if enabled
    if (this.config.enableWatermark) {
      sharpInstance = await this.applyWatermark(sharpInstance, size.width);
    }
    
    // Apply format-specific options
    switch (format) {
      case 'webp':
        sharpInstance = sharpInstance.webp({
          quality: this.config.quality.webp,
          effort: 6
        });
        break;
        
      case 'avif':
        sharpInstance = sharpInstance.avif({
          quality: this.config.quality.avif,
          effort: 9
        });
        break;
        
      case 'original':
        if (originalInfo.format === 'jpeg' || originalInfo.format === 'jpg') {
          sharpInstance = sharpInstance.jpeg({
            quality: this.config.quality.jpg,
            progressive: true,
            mozjpeg: true
          });
        } else if (originalInfo.format === 'png') {
          sharpInstance = sharpInstance.png({
            quality: this.config.quality.png,
            progressive: true,
            compressionLevel: 9
          });
        }
        break;
    }
    
    // Save the image
    await sharpInstance.toFile(outputPath);
    
    // Further optimize with imagemin
    if (this.config.enableImagemin && format === 'original') {
      await this.optimizeWithImagemin(outputPath, originalInfo.format);
    }
    
    // Get output file info
    const outputInfo = await this.getImageInfo(outputPath);
    
    return {
      path: path.relative(this.config.outputDir, outputPath),
      size: size.name,
      format: format,
      width: outputInfo.width,
      height: outputInfo.height,
      fileSize: outputInfo.fileSize,
      savings: originalInfo.fileSize - outputInfo.fileSize
    };
  }

  /* ============================================
     SVG PROCESSING
     ============================================ */
  async processSVG(sourcePath, imagePath, info) {
    const outputPath = this.config.preserveStructure
      ? path.join(this.config.outputDir, imagePath)
      : path.join(this.config.outputDir, path.basename(imagePath));
    
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    
    // Optimize SVG
    const result = await imagemin([sourcePath], {
      destination: path.dirname(outputPath),
      plugins: [
        imageminSvgo({
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  removeViewBox: false,
                  removeDimensions: false,
                  removeTitle: false,
                  removeDesc: false,
                  cleanupIDs: false
                }
              }
            }
          ]
        })
      ]
    });
    
    const outputInfo = await this.getImageInfo(outputPath);
    
    return [{
      path: path.relative(this.config.outputDir, outputPath),
      format: 'svg',
      fileSize: outputInfo.fileSize,
      savings: info.fileSize - outputInfo.fileSize
    }];
  }

  /* ============================================
     IMAGE OPTIMIZATION
     ============================================ */
  async optimizeWithImagemin(imagePath, format) {
    let plugins = [];
    
    switch (format) {
      case 'jpg':
      case 'jpeg':
        plugins = [
          imageminMozjpeg({
            quality: this.config.quality.jpg,
            progressive: true
          })
        ];
        break;
        
      case 'png':
        plugins = [
          imageminPngquant({
            quality: [0.6, 0.8],
            strip: true
          })
        ];
        break;
        
      case 'gif':
        plugins = [
          imageminGifsicle({
            interlaced: true,
            optimizationLevel: 3
          })
        ];
        break;
    }
    
    if (plugins.length > 0) {
      await imagemin([imagePath], {
        destination: path.dirname(imagePath),
        plugins
      });
    }
  }

  /* ============================================
     PLACEHOLDER GENERATION
     ============================================ */
  async generatePlaceholder(sourcePath, outputDir, name) {
    const placeholderName = `${name}-placeholder.jpg`;
    const placeholderPath = path.join(outputDir, placeholderName);
    
    // Generate tiny blurred version
    await sharp(sourcePath)
      .resize(20, 20, { fit: 'inside' })
      .blur(5)
      .jpeg({ quality: 40 })
      .toFile(placeholderPath);
    
    // Convert to base64
    const buffer = await fs.readFile(placeholderPath);
    const base64 = `data:image/jpeg;base64,${buffer.toString('base64')}`;
    
    // Delete the file (we'll use base64)
    await fs.unlink(placeholderPath);
    
    return {
      path: 'placeholder',
      format: 'base64',
      data: base64,
      fileSize: buffer.length
    };
  }

  /* ============================================
     WATERMARK
     ============================================ */
  async applyWatermark(sharpInstance, imageWidth) {
    const { watermark } = this.config;
    
    if (watermark.logo) {
      // Logo watermark
      const logoBuffer = await fs.readFile(watermark.logo);
      const logoMetadata = await sharp(logoBuffer).metadata();
      
      // Scale logo to fit
      const logoWidth = Math.min(imageWidth * 0.2, logoMetadata.width);
      const scaledLogo = await sharp(logoBuffer)
        .resize(logoWidth)
        .toBuffer();
      
      // Position calculation
      const position = this.getWatermarkPosition(
        watermark.position,
        imageWidth,
        logoWidth,
        watermark.margin
      );
      
      return sharpInstance.composite([{
        input: scaledLogo,
        ...position,
        blend: 'over'
      }]);
      
    } else {
      // Text watermark
      const svg = `
        <svg width="${imageWidth}" height="50">
          <text x="50%" y="50%" 
                text-anchor="middle" 
                dominant-baseline="middle"
                font-family="Arial, sans-serif" 
                font-size="20" 
                fill="white" 
                opacity="${watermark.opacity}"
                stroke="black" 
                stroke-width="1">
            ${watermark.text}
          </text>
        </svg>
      `;
      
      const svgBuffer = Buffer.from(svg);
      const position = this.getWatermarkPosition(
        watermark.position,
        imageWidth,
        imageWidth,
        watermark.margin
      );
      
      return sharpInstance.composite([{
        input: svgBuffer,
        ...position
      }]);
    }
  }

  getWatermarkPosition(position, imageWidth, watermarkWidth, margin) {
    const positions = {
      'northwest': { left: margin, top: margin },
      'north': { left: Math.floor((imageWidth - watermarkWidth) / 2), top: margin },
      'northeast': { left: imageWidth - watermarkWidth - margin, top: margin },
      'west': { left: margin, top: null },
      'center': { left: Math.floor((imageWidth - watermarkWidth) / 2), top: null },
      'east': { left: imageWidth - watermarkWidth - margin, top: null },
      'southwest': { gravity: 'southwest', left: margin, top: margin },
      'south': { gravity: 'south', left: Math.floor((imageWidth - watermarkWidth) / 2), top: margin },
      'southeast': { gravity: 'southeast', left: margin, top: margin }
    };
    
    return positions[position] || positions.southeast;
  }

  /* ============================================
     OUTPUT GENERATION
     ============================================ */
  async generateManifest() {
    console.log('📝 Generating manifest...');
    
    const manifestPath = path.join(this.config.outputDir, 'manifest.json');
    await fs.writeFile(
      manifestPath,
      JSON.stringify(this.manifest, null, 2)
    );
    
    console.log('✅ Manifest generated');
  }

  async generateHTML() {
    console.log('📄 Generating HTML showcase...');
    
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Optimized Images - DGrealtors</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f5f5;
      padding: 2rem;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    h1 {
      color: #1e3a5f;
      margin-bottom: 2rem;
      text-align: center;
    }
    
    .stats {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
    }
    
    .stat {
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
    
    .images-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
    }
    
    .image-card {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .image-preview {
      position: relative;
      padding-bottom: 66.67%;
      background: #f0f0f0;
    }
    
    .image-preview img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .image-info {
      padding: 1rem;
    }
    
    .image-title {
      font-weight: bold;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .image-meta {
      font-size: 0.75rem;
      color: #666;
    }
    
    .savings {
      color: #10b981;
      font-weight: bold;
    }
    
    .format-badges {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.5rem;
      flex-wrap: wrap;
    }
    
    .format-badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      background: #e0e7ff;
      color: #4f46e5;
      border-radius: 4px;
      font-size: 0.75rem;
    }
    
    .lazy-img {
      filter: blur(5px);
      transition: filter 0.3s;
    }
    
    .lazy-img.loaded {
      filter: blur(0);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Optimized Images Gallery</h1>
    
    <div class="stats">
      ${this.generateStatsHTML()}
    </div>
    
    <div class="images-grid">
      ${this.generateImagesHTML()}
    </div>
  </div>
  
  <script>
    // Lazy loading
    const images = document.querySelectorAll('.lazy-img');
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.onload = () => img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  </script>
</body>
</html>`;
    
    const htmlPath = path.join(this.config.outputDir, 'index.html');
    await fs.writeFile(htmlPath, html);
    
    console.log('✅ HTML showcase generated');
  }

  generateStatsHTML() {
    const stats = this.getStats();
    
    return `
      <div class="stat">
        <div class="stat-value">${this.processed.length}</div>
        <div class="stat-label">Images Optimized</div>
      </div>
      <div class="stat">
        <div class="stat-value">${this.formatBytes(stats.totalOriginal)}</div>
        <div class="stat-label">Original Size</div>
      </div>
      <div class="stat">
        <div class="stat-value">${this.formatBytes(stats.totalOptimized)}</div>
        <div class="stat-label">Optimized Size</div>
      </div>
      <div class="stat">
        <div class="stat-value savings">${Math.round(stats.savingsPercentage)}%</div>
        <div class="stat-label">Size Reduction</div>
      </div>
    `;
  }

  generateImagesHTML() {
    return this.processed.map(item => {
      const mainImage = item.results.find(r => 
        r.size === 'medium' && r.format === 'webp'
      ) || item.results[0];
      
      const formats = [...new Set(item.results.map(r => r.format))]
        .filter(f => f !== 'placeholder' && f !== 'base64');
      
      const totalSavings = item.results
        .filter(r => r.savings)
        .reduce((sum, r) => sum + r.savings, 0);
      
      const placeholder = item.results.find(r => r.format === 'base64');
      
      return `
        <div class="image-card">
          <div class="image-preview">
            <img 
              class="lazy-img"
              src="${placeholder ? placeholder.data : ''}"
              data-src="${mainImage.path}"
              alt="${path.basename(item.source)}"
              loading="lazy"
            >
          </div>
          <div class="image-info">
            <div class="image-title">${path.basename(item.source)}</div>
            <div class="image-meta">
              Original: ${item.info.width}×${item.info.height} • ${this.formatBytes(item.info.fileSize)}
            </div>
            ${totalSavings > 0 ? `
              <div class="image-meta">
                <span class="savings">Saved ${this.formatBytes(totalSavings)}</span>
              </div>
            ` : ''}
            <div class="format-badges">
              ${formats.map(format => 
                `<span class="format-badge">${format.toUpperCase()}</span>`
              ).join('')}
            </div>
          </div>
        </div>
      `;
    }).join('\n');
  }

  /* ============================================
     CACHE MANAGEMENT
     ============================================ */
  async loadCache() {
    try {
      const cachePath = path.join(this.config.cacheDir, 'image-cache.json');
      const cacheData = await fs.readFile(cachePath, 'utf-8');
      const parsed = JSON.parse(cacheData);
      
      this.cache = new Map(parsed.entries);
      console.log(`📦 Loaded cache with ${this.cache.size} entries`);
    } catch (error) {
      // Cache doesn't exist or is invalid
      console.log('🆕 Starting with fresh cache');
    }
  }

  async saveCache() {
    try {
      const cachePath = path.join(this.config.cacheDir, 'image-cache.json');
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

  /* ============================================
     UTILITY METHODS
     ============================================ */
  async getImageInfo(imagePath) {
    const stats = await fs.stat(imagePath);
    const dimensions = await sizeOf(imagePath);
    
    return {
      width: dimensions.width,
      height: dimensions.height,
      format: dimensions.type,
      fileSize: stats.size,
      aspectRatio: dimensions.width / dimensions.height
    };
  }

  async getFileHash(filePath) {
    const fileBuffer = await fs.readFile(filePath);
    return crypto.createHash('sha256').update(fileBuffer).digest('hex');
  }

  getStats() {
    let totalOriginal = 0;
    let totalOptimized = 0;
    let totalSaved = 0;
    
    this.processed.forEach(item => {
      totalOriginal += item.info.fileSize;
      
      item.results.forEach(result => {
        if (result.fileSize) {
          totalOptimized += result.fileSize;
        }
        if (result.savings > 0) {
          totalSaved += result.savings;
        }
      });
    });
    
    return {
      totalOriginal,
      totalOptimized,
      totalSaved,
      savingsPercentage: totalOriginal > 0 
        ? (totalSaved / totalOriginal) * 100 
        : 0
    };
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}

/* ============================================
   CLI INTERFACE
   ============================================ */
if (require.main === module) {
  const program = require('commander');
  
  program
    .version('1.0.0')
    .description('Optimize images for DGrealtors website')
    .option('-s, --source <dir>', 'Source directory', './src/assets/images')
    .option('-o, --output <dir>', 'Output directory', './public/images')
    .option('-q, --quality <number>', 'JPEG quality (1-100)', parseInt, 85)
    .option('-f, --formats <list>', 'Output formats (comma separated)', 'original,webp')
    .option('--no-responsive', 'Disable responsive image generation')
    .option('--no-cache', 'Disable caching')
    .option('--watermark <text>', 'Add text watermark')
    .option('--sizes <sizes>', 'Custom sizes (JSON string)')
    .parse(process.argv);

  const options = program.opts();

  // Parse custom options
  if (options.formats) {
    options.outputFormats = options.formats.split(',').map(f => f.trim());
  }
  
  if (options.sizes) {
    try {
      options.sizes = JSON.parse(options.sizes);
    } catch (e) {
      console.error('Invalid sizes JSON');
      process.exit(1);
    }
  }
  
  if (options.watermark) {
    options.enableWatermark = true;
    options.watermark = { text: options.watermark };
  }

  // Create optimizer
  const optimizer = new ImageOptimizer({
    sourceDir: options.source,
    outputDir: options.output,
    quality: { jpg: options.quality },
    outputFormats: options.outputFormats,
    enableResponsive: options.responsive,
    useCache: options.cache,
    sizes: options.sizes,
    enableWatermark: options.enableWatermark,
    watermark: options.watermark,
    
    onProgress: (progress) => {
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      process.stdout.write(
        `Processing: ${progress.current}/${progress.total} ` +
        `(${progress.percentage}%) - ${progress.file}`
      );
    }
  });

  // Run optimization
  optimizer.optimize()
    .then(result => {
      console.log('\n\n🎉 Optimization complete!');
      console.log(`📊 Total images processed: ${result.processed}`);
      console.log(`⏱️  Time taken: ${result.duration}ms`);
      console.log(`💾 Total savings: ${optimizer.formatBytes(result.stats.totalSaved)}`);
      
      if (result.errors.length > 0) {
        console.log('\n⚠️  Errors encountered:');
        result.errors.forEach(err => {
          console.log(`  - ${err.file}: ${err.error}`);
        });
      }
      
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Optimization failed:', error.message);
      process.exit(1);
    });
}

/* ============================================
   EXPORTS
   ============================================ */
module.exports = ImageOptimizer;
