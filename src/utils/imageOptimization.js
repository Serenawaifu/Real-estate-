/**
 * Image Optimization Utility
 * Provides functions for resizing, compressing, and converting images.
 */

const imageOptimization = {
  /**
   * Resize an image to the specified width and height.
   * @param {File} file - The image file to resize.
   * @param {number} width - The desired width.
   * @param {number} height - The desired height.
   * @returns {Promise<Blob>} - A promise that resolves to the resized image blob.
   */
  async resizeImage(file, width, height) {
    const img = await this.loadImage(file);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(img, 0, 0, width, height);
    return this.getBlobFromCanvas(canvas);
  },

  /**
   * Compress an image to reduce its file size.
   * @param {File} file - The image file to compress.
   * @param {number} quality - The quality of the compressed image (0 to 1).
   * @returns {Promise<Blob>} - A promise that resolves to the compressed image blob.
   */
  async compressImage(file, quality = 0.8) {
    const img = await this.loadImage(file);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);
    return this.getBlobFromCanvas(canvas, quality);
  },

  /**
   * Convert an image to a different format (e.g., JPEG, PNG).
   * @param {File} file - The image file to convert.
   * @param {string} format - The desired format (e.g., 'image/jpeg', 'image/png').
   * @param {number} quality - The quality of the converted image (0 to 1).
   * @returns {Promise<Blob>} - A promise that resolves to the converted image blob.
   */
  async convertImageFormat(file, format, quality = 0.8) {
    const img = await this.loadImage(file);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);
    return this.getBlobFromCanvas(canvas, quality, format);
  },

  /**
   * Load an image from a file.
   * @param {File} file - The image file to load.
   * @returns {Promise<HTMLImageElement>} - A promise that resolves to the loaded image element.
   */
  loadImage(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target.result;
        img.onload = () => resolve(img);
        img.onerror = (error) => reject(error);
      };

      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  },

  /**
   * Get a blob from a canvas.
   * @param {HTMLCanvasElement} canvas - The canvas element.
   * @param {number} quality - The quality of the image (0 to 1).
   * @param {string} format - The desired format (default is 'image/jpeg').
   * @returns {Promise<Blob>} - A promise that resolves to the image blob.
   */
  getBlobFromCanvas(canvas, quality = 0.8, format = 'image/jpeg') {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, format, quality);
    });
  },

  /**
   * Lazy load images to improve performance.
   * @param {string} src - The source URL of the image.
   * @param {string} alt - The alt text for the image.
   * @param {Object} options - Additional options for the image.
   * @returns {HTMLImageElement} - The image element with lazy loading.
   */
  lazyLoadImage(src, alt, options = {}) {
    const img = new Image();
    img.src = src;
    img.alt = alt;
    img.loading = 'lazy'; // Enable lazy loading

    // Set additional attributes if provided
    Object.entries(options).forEach(([key, value]) => {
      img.setAttribute(key, value);
    });

    return img;
  },

  /**
   * Optimize an image by resizing, compressing, and converting format.
   * @param {File} file - The image file to optimize.
   * @param {Object} options - Options for optimization.
   * @param {number} options.width - The desired width.
   * @param {number} options.height - The desired height.
   * @param {number} options.quality - The quality of the compressed image (0 to 1).
   * @param {string} options.format - The desired format (e.g., 'image/jpeg').
   * @returns {Promise<Blob>} - A promise that resolves to the optimized image blob.
   */
  async optimizeImage(file, options = {}) {
    const { width, height, quality = 0.8, format = 'image/jpeg' } = options;

    // Resize the image
    let optimizedImage = await this.resizeImage(file, width, height);

    // Compress the image
    optimizedImage = await this.compressImage(optimizedImage, quality);

    // Convert the image format
    optimizedImage = await this.convertImageFormat(optimizedImage, format, quality);

    return optimizedImage;
  }
};

export default imageOptimization;
