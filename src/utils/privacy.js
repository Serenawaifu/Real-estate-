/**
 * Advanced Privacy Utilities for DGrealtors
 * Comprehensive privacy protection and data handling utilities
 */

// Privacy configuration
const PRIVACY_CONFIG = {
  // Cookie settings
  cookieExpiry: 365, // days
  secureCookies: true,
  sameSitePolicy: 'Strict',
  
  // Data encryption
  encryptionAlgorithm: 'AES-GCM',
  keyLength: 256,
  
  // Storage
  storagePrefix: 'dgr_',
  encryptStorage: true,
  
  // Tracking
  enableAnalytics: true,
  anonymizeIP: true,
  respectDNT: true,
  
  // Data retention
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  dataRetentionDays: 90,
};

/**
 * Cookie Management
 */
export const cookies = {
  // Set cookie with privacy options
  set(name, value, options = {}) {
    const {
      expires = PRIVACY_CONFIG.cookieExpiry,
      path = '/',
      domain = window.location.hostname,
      secure = PRIVACY_CONFIG.secureCookies,
      sameSite = PRIVACY_CONFIG.sameSitePolicy,
      httpOnly = false
    } = options;

    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
    
    if (expires) {
      const date = new Date();
      date.setTime(date.getTime() + (expires * 24 * 60 * 60 * 1000));
      cookieString += `; expires=${date.toUTCString()}`;
    }
    
    cookieString += `; path=${path}`;
    cookieString += `; domain=${domain}`;
    
    if (secure && window.location.protocol === 'https:') {
      cookieString += '; secure';
    }
    
    cookieString += `; SameSite=${sameSite}`;
    
    document.cookie = cookieString;
  },
  
  // Get cookie value
  get(name) {
    const nameEQ = encodeURIComponent(name) + '=';
    const cookies = document.cookie.split(';');
    
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(cookie.substring(nameEQ.length));
      }
    }
    return null;
  },
  
  // Remove cookie
  remove(name, options = {}) {
    this.set(name, '', { ...options, expires: -1 });
  },
  
  // Check if cookie exists
  exists(name) {
    return this.get(name) !== null;
  },
  
  // Get all cookies
  getAll() {
    const cookies = {};
    document.cookie.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name) {
        cookies[decodeURIComponent(name)] = decodeURIComponent(value || '');
      }
    });
    return cookies;
  },
  
  // Clear all cookies
  clearAll(options = {}) {
    const cookies = this.getAll();
    Object.keys(cookies).forEach(name => {
      this.remove(name, options);
    });
  }
};

/**
 * Secure Storage with encryption
 */
export const secureStorage = {
  // Encrypt data
  async encrypt(data) {
    if (!PRIVACY_CONFIG.encryptStorage) return JSON.stringify(data);
    
    try {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(JSON.stringify(data));
      
      // Generate key
      const key = await crypto.subtle.generateKey(
        { name: PRIVACY_CONFIG.encryptionAlgorithm, length: PRIVACY_CONFIG.keyLength },
        true,
        ['encrypt', 'decrypt']
      );
      
      // Generate IV
      const iv = crypto.getRandomValues(new Uint8Array(12));
      
      // Encrypt
      const encryptedBuffer = await crypto.subtle.encrypt(
        { name: PRIVACY_CONFIG.encryptionAlgorithm, iv },
        key,
        dataBuffer
      );
      
      // Export key for storage
      const exportedKey = await crypto.subtle.exportKey('raw', key);
      
      // Combine IV, key, and encrypted data
      const combined = new Uint8Array(iv.length + exportedKey.byteLength + encryptedBuffer.byteLength);
      combined.set(iv, 0);
      combined.set(new Uint8Array(exportedKey), iv.length);
      combined.set(new Uint8Array(encryptedBuffer), iv.length + exportedKey.byteLength);
      
      // Convert to base64
      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      console.error('Encryption error:', error);
      return JSON.stringify(data);
    }
  },
  
  // Decrypt data
  async decrypt(encryptedData) {
    if (!PRIVACY_CONFIG.encryptStorage) return JSON.parse(encryptedData);
    
    try {
      // Decode from base64
      const combined = new Uint8Array(atob(encryptedData).split('').map(c => c.charCodeAt(0)));
      
      // Extract IV, key, and encrypted data
      const iv = combined.slice(0, 12);
      const keyData = combined.slice(12, 12 + 32);
      const encrypted = combined.slice(12 + 32);
      
      // Import key
      const key = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: PRIVACY_CONFIG.encryptionAlgorithm },
        true,
        ['decrypt']
      );
      
      // Decrypt
      const decryptedBuffer = await crypto.subtle.decrypt(
        { name: PRIVACY_CONFIG.encryptionAlgorithm, iv },
        key,
        encrypted
      );
      
      // Decode
      const decoder = new TextDecoder();
      const decryptedText = decoder.decode(decryptedBuffer);
      return JSON.parse(decryptedText);
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  },
  
  // Set item in storage
  async setItem(key, value, storage = localStorage) {
    const prefixedKey = PRIVACY_CONFIG.storagePrefix + key;
    const encrypted = await this.encrypt(value);
    storage.setItem(prefixedKey, encrypted);
  },
  
  // Get item from storage
  async getItem(key, storage = localStorage) {
    const prefixedKey = PRIVACY_CONFIG.storagePrefix + key;
    const encrypted = storage.getItem(prefixedKey);
    if (!encrypted) return null;
    
    try {
      return await this.decrypt(encrypted);
    } catch {
      // If decryption fails, remove corrupted data
      storage.removeItem(prefixedKey);
      return null;
    }
  },
  
  // Remove item
  removeItem(key, storage = localStorage) {
    const prefixedKey = PRIVACY_CONFIG.storagePrefix + key;
    storage.removeItem(prefixedKey);
  },
  
  // Clear all secure storage
  clearAll(storage = localStorage) {
    Object.keys(storage).forEach(key => {
      if (key.startsWith(PRIVACY_CONFIG.storagePrefix)) {
        storage.removeItem(key);
      }
    });
  }
};

/**
 * Data sanitization
 */
export const sanitize = {
  // Sanitize HTML
  html(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  },
  
  // Sanitize for URL
  url(input) {
    return encodeURIComponent(input);
  },
  
  // Sanitize email
  email(input) {
    return input.toLowerCase().trim().replace(/[^a-z0-9@._-]/gi, '');
  },
  
  // Sanitize phone
  phone(input) {
    return input.replace(/[^0-9+()-\s]/g, '').trim();
  },
  
  // Remove sensitive data from objects
  removeSensitive(obj, sensitiveKeys = ['password', 'token', 'secret', 'key', 'cvv']) {
    const cleaned = { ...obj };
    
    sensitiveKeys.forEach(key => {
      Object.keys(cleaned).forEach(objKey => {
        if (objKey.toLowerCase().includes(key.toLowerCase())) {
          cleaned[objKey] = '[REDACTED]';
        }
      });
    });
    
    return cleaned;
  },
  
  // Mask sensitive strings
  mask(input, showFirst = 0, showLast = 0) {
    if (!input || input.length <= showFirst + showLast) return input;
    
    const first = input.slice(0, showFirst);
    const last = input.slice(-showLast);
    const masked = '*'.repeat(input.length - showFirst - showLast);
    
    return first + masked + last;
  }
};

/**
 * User consent management
 */
export const consent = {
  // Get all consents
  getAll() {
    return cookies.get('privacy_consent') 
      ? JSON.parse(cookies.get('privacy_consent'))
      : {};
  },
  
  // Check specific consent
  has(type) {
    const consents = this.getAll();
    return consents[type] === true;
  },
  
  // Set consent
  set(type, value) {
    const consents = this.getAll();
    consents[type] = value;
    consents.timestamp = new Date().toISOString();
    cookies.set('privacy_consent', JSON.stringify(consents), {
      expires: 365
    });
  },
  
  // Set multiple consents
  setMultiple(consentObj) {
    const consents = this.getAll();
    Object.assign(consents, consentObj);
    consents.timestamp = new Date().toISOString();
    cookies.set('privacy_consent', JSON.stringify(consents), {
      expires: 365
    });
  },
  
  // Revoke all consents
  revokeAll() {
    cookies.remove('privacy_consent');
  }
};

/**
 * Do Not Track detection
 */
export const doNotTrack = {
  // Check if DNT is enabled
  isEnabled() {
    if (!PRIVACY_CONFIG.respectDNT) return false;
    
    return navigator.doNotTrack === '1' || 
           window.doNotTrack === '1' || 
           navigator.msDoNotTrack === '1';
  },
  
  // Get DNT status
  getStatus() {
    return {
      enabled: this.isEnabled(),
      browserValue: navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack || 'unspecified'
    };
  }
};

/**
 * Analytics privacy wrapper
 */
export const analytics = {
  // Track event with privacy checks
  track(eventName, eventData = {}) {
    // Check DNT
    if (doNotTrack.isEnabled()) return;
    
    // Check user consent
    if (!consent.has('analytics')) return;
    
    // Check if analytics enabled
    if (!PRIVACY_CONFIG.enableAnalytics) return;
    
    // Sanitize data
    const sanitizedData = sanitize.removeSensitive(eventData);
    
    // Track event (implement your analytics here)
    if (window.gtag) {
      window.gtag('event', eventName, sanitizedData);
    }
  },
  
  // Set user properties
  setUser(userId, properties = {}) {
    if (!consent.has('analytics') || doNotTrack.isEnabled()) return;
    
    const sanitizedProps = sanitize.removeSensitive(properties);
    
    if (window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        user_id: userId,
        user_properties: sanitizedProps
      });
    }
  },
  
  // Enable IP anonymization
  enableIPAnonymization() {
    if (window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        anonymize_ip: PRIVACY_CONFIG.anonymizeIP
      });
    }
  }
};

/**
 * Session management with privacy
 */
export const session = {
  // Start session
  start() {
    const sessionId = this.generateId();
    const sessionData = {
      id: sessionId,
      startTime: Date.now(),
      lastActivity: Date.now()
    };
    
    sessionStorage.setItem('session', JSON.stringify(sessionData));
    return sessionId;
  },
  
  // Generate secure session ID
  generateId() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  },
  
  // Update activity
  updateActivity() {
    const session = this.get();
    if (session) {
      session.lastActivity = Date.now();
      sessionStorage.setItem('session', JSON.stringify(session));
    }
  },
  
  // Get session
  get() {
    const sessionStr = sessionStorage.getItem('session');
    if (!sessionStr) return null;
    
    const session = JSON.parse(sessionStr);
    
    // Check timeout
    if (Date.now() - session.lastActivity > PRIVACY_CONFIG.sessionTimeout) {
      this.end();
      return null;
    }
    
    return session;
  },
  
  // End session
  end() {
    sessionStorage.removeItem('session');
    
    // Clear any session-related data
    secureStorage.clearAll(sessionStorage);
  },
  
  // Check if session is active
  isActive() {
    return this.get() !== null;
  }
};

/**
 * Data retention and cleanup
 */
export const dataRetention = {
  // Clean old data
  async cleanOldData() {
    const cutoffDate = Date.now() - (PRIVACY_CONFIG.dataRetentionDays * 24 * 60 * 60 * 1000);
    
    // Check all storage items
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith(PRIVACY_CONFIG.storagePrefix)) {
        try {
          const data = await secureStorage.getItem(key.replace(PRIVACY_CONFIG.storagePrefix, ''));
          if (data && data.timestamp && new Date(data.timestamp).getTime() < cutoffDate) {
            localStorage.removeItem(key);
          }
        } catch {
          // Remove corrupted data
          localStorage.removeItem(key);
        }
      }
    }
  },
  
  // Schedule cleanup
  scheduleCleanup() {
    // Run cleanup on load
    this.cleanOldData();
    
    // Schedule daily cleanup
    setInterval(() => {
      this.cleanOldData();
    }, 24 * 60 * 60 * 1000);
  }
};

/**
 * Privacy-focused fetch wrapper
 */
export const privateFetch = async (url, options = {}) => {
  const defaultHeaders = {
    'DNT': doNotTrack.isEnabled() ? '1' : '0',
  };
  
  // Add consent headers if needed
  if (consent.has('tracking')) {
    defaultHeaders['X-Consent-Tracking'] = 'true';
  }
  
  const finalOptions = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    },
    credentials: 'same-origin', // Privacy-focused credential handling
  };
  
  const response = await fetch(url, finalOptions);
  
  // Log privacy-related response headers
  if (response.headers.get('X-Privacy-Policy')) {
    console.log('Privacy Policy:', response.headers.get('X-Privacy-Policy'));
  }
  
  return response;
};

// Initialize privacy utilities
export const initializePrivacy = () => {
  // Schedule data cleanup
  dataRetention.scheduleCleanup();
  
  // Enable IP anonymization
  analytics.enableIPAnonymization();
  
  // Set up session monitoring
  if (session.isActive()) {
    session.updateActivity();
    
    // Monitor activity
    ['click', 'scroll', 'keypress'].forEach(event => {
      document.addEventListener(event, () => {
        session.updateActivity();
      }, { passive: true });
    });
  }
  
  // Log privacy status
  console.log('Privacy utilities initialized:', {
    dnt: doNotTrack.getStatus(),
    consents: consent.getAll(),
    session: session.isActive()
  });
};

// Export all utilities
export default {
  cookies,
  secureStorage,
  sanitize,
  consent,
  doNotTrack,
  analytics,
  session,
  dataRetention,
  privateFetch,
  initializePrivacy,
  PRIVACY_CONFIG
};
         
