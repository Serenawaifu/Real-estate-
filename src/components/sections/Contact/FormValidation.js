/**
 * Advanced Form Validation Utility for DGrealtors Contact Form
 * Provides comprehensive validation, sanitization, and helper functions
 */

// Validation Rules Configuration
const ValidationRules = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s'-]+$/,
    messages: {
      required: 'Name is required',
      minLength: 'Name must be at least 2 characters',
      maxLength: 'Name cannot exceed 50 characters',
      pattern: 'Name can only contain letters, spaces, hyphens, and apostrophes'
    }
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    allowedDomains: ['gmail.com', 'yahoo.com', 'yahoo.in', 'yahoo.co.in', 'outlook.com', 'hotmail.com'],
    messages: {
      required: 'Email is required',
      pattern: 'Please enter a valid email address',
      domain: 'Please use Gmail, Yahoo, Outlook, or Hotmail email address'
    }
  },
  phone: {
    required: true,
    pattern: /^[6-9]\d{9}$/,
    format: 'indian',
    messages: {
      required: 'Phone number is required',
      pattern: 'Please enter a valid 10-digit Indian mobile number',
      format: 'Phone number must start with 6, 7, 8, or 9'
    }
  },
  company: {
    required: false,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z0-9\s&.,'-]+$/,
    messages: {
      minLength: 'Company name must be at least 2 characters',
      maxLength: 'Company name cannot exceed 100 characters',
      pattern: 'Company name contains invalid characters'
    }
  },
  propertyTypes: {
    required: true,
    minSelection: 1,
    maxSelection: 6,
    messages: {
      required: 'Please select at least one property type',
      minSelection: 'Please select at least one property type',
      maxSelection: 'You can select maximum 6 property types'
    }
  },
  budget: {
    required: false,
    min: 10000,
    max: 10000000,
    messages: {
      min: 'Budget must be at least ₹10,000',
      max: 'Budget cannot exceed ₹1 Crore'
    }
  },
  location: {
    required: true,
    minLength: 3,
    maxLength: 100,
    pattern: /^[a-zA-Z0-9\s,.-]+$/,
    messages: {
      required: 'Location is required',
      minLength: 'Location must be at least 3 characters',
      maxLength: 'Location cannot exceed 100 characters',
      pattern: 'Location contains invalid characters'
    }
  },
  message: {
    required: true,
    minLength: 20,
    maxLength: 500,
    messages: {
      required: 'Please enter your requirements',
      minLength: 'Message must be at least 20 characters',
      maxLength: 'Message cannot exceed 500 characters'
    }
  },
  timeframe: {
    required: true,
    messages: {
      required: 'Please select when you need the space'
    }
  },
  propertySize: {
    required: true,
    min: 100,
    max: 100000,
    pattern: /^\d{1,3}(,\d{3})*$/,
    messages: {
      required: 'Please specify the required size',
      min: 'Property size must be at least 100 sq.ft.',
      max: 'Property size cannot exceed 100,000 sq.ft.',
      pattern: 'Please enter a valid number'
    }
  },
  referralSource: {
    required: false,
    messages: {}
  },
  newsletter: {
    required: false,
    messages: {}
  },
  preferredContact: {
    required: false,
    messages: {}
  },
  parkingRequired: {
    required: false,
    messages: {}
  },
  amenities: {
    required: false,
    maxSelection: 8,
    messages: {
      maxSelection: 'You can select maximum 8 amenities'
    }
  }
};

// Sanitization Functions
const Sanitizers = {
  /**
   * Sanitize text input by removing harmful characters
   */
  sanitizeText: (text) => {
    if (!text) return '';
    return text
      .trim()
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/[<>]/g, '')
      .replace(/\s+/g, ' ');
  },

  /**
   * Sanitize email address
   */
  sanitizeEmail: (email) => {
    if (!email) return '';
    return email.toLowerCase().trim();
  },

  /**
   * Sanitize phone number
   */
  sanitizePhone: (phone) => {
    if (!phone) return '';
    return phone.replace(/[\s\-\(\)\.]/g, '');
  },

  /**
   * Sanitize numeric input
   */
  sanitizeNumber: (number) => {
    if (!number) return '';
    return number.toString().replace(/[^\d,]/g, '');
  },

  /**
   * Sanitize array of values
   */
  sanitizeArray: (array) => {
    if (!Array.isArray(array)) return [];
    return array.filter(item => item && typeof item === 'string');
  }
};

// Validation Functions
const Validators = {
  /**
   * Validate required field
   */
  validateRequired: (value, isRequired) => {
    if (!isRequired) return true;
    
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    
    if (typeof value === 'boolean') {
      return true;
    }
    
    return value !== undefined && value !== null && value.toString().trim() !== '';
  },

  /**
   * Validate minimum length
   */
  validateMinLength: (value, minLength) => {
    if (!value || !minLength) return true;
    return value.toString().trim().length >= minLength;
  },

  /**
   * Validate maximum length
   */
  validateMaxLength: (value, maxLength) => {
    if (!value || !maxLength) return true;
    return value.toString().trim().length <= maxLength;
  },

  /**
   * Validate pattern
   */
  validatePattern: (value, pattern) => {
    if (!value || !pattern) return true;
    return pattern.test(value.toString());
  },

  /**
   * Validate minimum value
   */
  validateMin: (value, min) => {
    if (!value || min === undefined) return true;
    const numValue = parseInt(value.toString().replace(/,/g, ''));
    return !isNaN(numValue) && numValue >= min;
  },

  /**
   * Validate maximum value
   */
  validateMax: (value, max) => {
    if (!value || max === undefined) return true;
    const numValue = parseInt(value.toString().replace(/,/g, ''));
    return !isNaN(numValue) && numValue <= max;
  },

  /**
   * Validate email domain
   */
  validateEmailDomain: (email, allowedDomains) => {
    if (!email || !allowedDomains) return true;
    const domain = email.split('@')[1]?.toLowerCase();
    return allowedDomains.includes(domain);
  },

  /**
   * Validate array selection count
   */
  validateSelectionCount: (array, min, max) => {
    if (!Array.isArray(array)) return false;
    const count = array.length;
    
    if (min !== undefined && count < min) return false;
    if (max !== undefined && count > max) return false;
    
    return true;
  },

  /**
   * Validate Indian phone number
   */
  validateIndianPhone: (phone) => {
    const cleaned = Sanitizers.sanitizePhone(phone);
    return /^[6-9]\d{9}$/.test(cleaned);
  },

  /**
   * Check for spam patterns
   */
  validateSpamCheck: (value) => {
    if (!value) return true;
    
    const spamPatterns = [
      /\b(viagra|cialis|casino|lottery|winner|congratulations)\b/i,
      /\b(click here|buy now|limited time|act now)\b/i,
      /(.)\1{5,}/, // Repeated characters
      /https?:\/\/\S+/g // URLs in message field
    ];
    
    return !spamPatterns.some(pattern => pattern.test(value.toString()));
  }
};

// Main Validation Class
class FormValidation {
  constructor(rules = ValidationRules) {
    this.rules = rules;
    this.errors = {};
  }

  /**
   * Validate a single field
   */
  validateField(fieldName, value, customRules = {}) {
    const rules = { ...this.rules[fieldName], ...customRules };
    const errors = [];

    if (!rules) return { isValid: true, errors: [] };

    // Required validation
    if (rules.required && !Validators.validateRequired(value, rules.required)) {
      errors.push(rules.messages.required);
      return { isValid: false, errors };
    }

    // Skip other validations if field is empty and not required
    if (!rules.required && !value) {
      return { isValid: true, errors: [] };
    }

    // Length validations
    if (rules.minLength && !Validators.validateMinLength(value, rules.minLength)) {
      errors.push(rules.messages.minLength);
    }

    if (rules.maxLength && !Validators.validateMaxLength(value, rules.maxLength)) {
      errors.push(rules.messages.maxLength);
    }

    // Pattern validation
    if (rules.pattern && !Validators.validatePattern(value, rules.pattern)) {
      errors.push(rules.messages.pattern);
    }

    // Numeric validations
    if (rules.min !== undefined && !Validators.validateMin(value, rules.min)) {
      errors.push(rules.messages.min);
    }

    if (rules.max !== undefined && !Validators.validateMax(value, rules.max)) {
      errors.push(rules.messages.max);
    }

    // Email domain validation
    if (fieldName === 'email' && rules.allowedDomains) {
      if (!Validators.validateEmailDomain(value, rules.allowedDomains)) {
        errors.push(rules.messages.domain);
      }
    }

    // Array validations
    if (Array.isArray(value)) {
      if (rules.minSelection !== undefined || rules.maxSelection !== undefined) {
        if (!Validators.validateSelectionCount(value, rules.minSelection, rules.maxSelection)) {
          if (rules.minSelection && value.length < rules.minSelection) {
            errors.push(rules.messages.minSelection);
          }
          if (rules.maxSelection && value.length > rules.maxSelection) {
            errors.push(rules.messages.maxSelection);
          }
        }
      }
    }

    // Special validations
    if (fieldName === 'phone' && !Validators.validateIndianPhone(value)) {
      errors.push(rules.messages.pattern);
    }

    // Spam check for message field
    if (fieldName === 'message' && !Validators.validateSpamCheck(value)) {
      errors.push('Your message contains prohibited content');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate entire form
   */
  validateForm(formData, fieldsToValidate = null) {
    const errors = {};
    const fields = fieldsToValidate || Object.keys(formData);

    fields.forEach(field => {
      const validation = this.validateField(field, formData[field]);
      if (!validation.isValid) {
        errors[field] = validation.errors[0]; // Return first error
      }
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Sanitize form data
   */
  sanitizeFormData(formData) {
    const sanitized = {};

    Object.keys(formData).forEach(field => {
      const value = formData[field];

      switch (field) {
        case 'email':
          sanitized[field] = Sanitizers.sanitizeEmail(value);
          break;
        case 'phone':
          sanitized[field] = Sanitizers.sanitizePhone(value);
          break;
        case 'propertySize':
        case 'budget':
          sanitized[field] = Sanitizers.sanitizeNumber(value);
          break;
        case 'propertyTypes':
        case 'amenities':
          sanitized[field] = Sanitizers.sanitizeArray(value);
          break;
        case 'parkingRequired':
        case 'newsletter':
          sanitized[field] = Boolean(value);
          break;
        default:
          if (typeof value === 'string') {
            sanitized[field] = Sanitizers.sanitizeText(value);
          } else {
            sanitized[field] = value;
          }
      }
    });

    return sanitized;
  }

  /**
   * Get field-specific validation rules
   */
  getFieldRules(fieldName) {
    return this.rules[fieldName] || {};
  }

  /**
   * Add custom validation rule
   */
  addCustomRule(fieldName, rule, message) {
    if (!this.rules[fieldName]) {
      this.rules[fieldName] = { messages: {} };
    }
    
    this.rules[fieldName][rule.name] = rule.value;
    this.rules[fieldName].messages[rule.name] = message;
  }

  /**
   * Check if field is required
   */
  isFieldRequired(fieldName) {
    return this.rules[fieldName]?.required || false;
  }

  /**
   * Get all required fields
   */
  getRequiredFields() {
    return Object.keys(this.rules).filter(field => this.rules[field].required);
  }
}

// Format Helpers
const FormatHelpers = {
  /**
   * Format phone number for display
   */
  formatPhoneNumber: (phone) => {
    const cleaned = Sanitizers.sanitizePhone(phone);
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }
    return phone;
  },

  /**
   * Format currency
   */
  formatCurrency: (amount) => {
    const num = parseInt(amount.toString().replace(/,/g, ''));
    if (isNaN(num)) return amount;
    
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)}Cr`;
    } else if (num >= 100000) {
      return `₹${(num / 100000).toFixed(2)}L`;
    } else {
      return `₹${num.toLocaleString('en-IN')}`;
    }
  },

  /**
   * Format property size
   */
  formatPropertySize: (size) => {
    const num = parseInt(size.toString().replace(/,/g, ''));
    if (isNaN(num)) return size;
    return num.toLocaleString('en-IN');
  },

  /**
   * Format date
   */
  formatDate: (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  },

  /**
   * Truncate text
   */
  truncateText: (text, maxLength = 50) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
};

// Validation Error Messages
const ErrorMessages = {
  generic: 'Please check this field',
  network: 'Network error. Please check your connection and try again.',
  server: 'Server error. Please try again later.',
  timeout: 'Request timeout. Please try again.',
  invalidForm: 'Please correct the errors in the form',
  spamDetected: 'Your submission was flagged as spam. Please review your message.',
  duplicateSubmission: 'You have already submitted a similar request recently.',
  rateLimitExceeded: 'Too many attempts. Please try again after some time.'
};

// Field Dependencies
const FieldDependencies = {
  propertyTypes: {
    dependsOn: [],
    affects: ['propertySize', 'amenities']
  },
  budget: {
    dependsOn: ['propertyTypes'],
    affects: ['location']
  },
  location: {
    dependsOn: ['budget'],
    affects: []
  },
  parkingRequired: {
    dependsOn: ['propertyTypes'],
    affects: ['budget']
  }
};

// Validation Presets
const ValidationPresets = {
  basic: ['name', 'email', 'phone', 'message'],
  detailed: ['name', 'email', 'phone', 'company', 'propertyTypes', 'location', 'timeframe', 'message'],
  complete: Object.keys(ValidationRules)
};

// Analytics Helper
const ValidationAnalytics = {
  /**
   * Track validation errors
   */
  trackError: (fieldName, errorType) => {
    // Implement analytics tracking
    console.log('Validation Error:', { field: fieldName, type: errorType });
  },

  /**
   * Track successful validation
   */
  trackSuccess: (formData) => {
    // Implement analytics tracking
    console.log('Form Validated Successfully:', { fields: Object.keys(formData) });
  },

  /**
   * Get validation metrics
   */
  getMetrics: () => {
    // Return validation metrics
    return {
      totalValidations: 0,
      failedValidations: 0,
      commonErrors: [],
      averageAttempts: 0
    };
  }
};

// Export everything
export {
  FormValidation,
  ValidationRules,
  Validators,
  Sanitizers,
  FormatHelpers,
  ErrorMessages,
  FieldDependencies,
  ValidationPresets,
  ValidationAnalytics
};

// Default export
export default FormValidation;

