/**
 * Advanced Form Helpers
 * Comprehensive utilities for form handling, validation, and data management
 */

/**
 * Form Field Validators
 */
export const validators = {
  // Required field validation
  required: (value, fieldName = 'This field') => {
    if (value === null || value === undefined || value === '') {
      return `${fieldName} is required`;
    }
    if (Array.isArray(value) && value.length === 0) {
      return `${fieldName} must have at least one item`;
    }
    if (typeof value === 'string' && value.trim().length === 0) {
      return `${fieldName} cannot be empty`;
    }
    return null;
  },

  // Email validation
  email: (value) => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
    
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    
    const domain = value.split('@')[1];
    if (validDomains.length && !validDomains.includes(domain)) {
      return `Email must be from: ${validDomains.join(', ')}`;
    }
    
    return null;
  },

  // Phone validation (Indian format)
  phone: (value, options = {}) => {
    if (!value) return null;
    
    const { country = 'IN' } = options;
    const patterns = {
      IN: /^[6-9]\d{9}$/,
      US: /^[2-9]\d{2}[2-9]\d{2}\d{4}$/,
      UK: /^(\+44|0)7\d{9}$/
    };
    
    const cleaned = value.replace(/[\s\-\(\)\.]/g, '');
    const pattern = patterns[country];
    
    if (!pattern || !pattern.test(cleaned)) {
      return `Please enter a valid ${country} phone number`;
    }
    
    return null;
  },

  // Password validation
  password: (value, options = {}) => {
    if (!value) return null;
    
    const {
      minLength = 8,
      requireUppercase = true,
      requireLowercase = true,
      requireNumbers = true,
      requireSpecial = true,
      customMessage
    } = options;
    
    const errors = [];
    
    if (value.length < minLength) {
      errors.push(`at least ${minLength} characters`);
    }
    if (requireUppercase && !/[A-Z]/.test(value)) {
      errors.push('one uppercase letter');
    }
    if (requireLowercase && !/[a-z]/.test(value)) {
      errors.push('one lowercase letter');
    }
    if (requireNumbers && !/\d/.test(value)) {
      errors.push('one number');
    }
    if (requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      errors.push('one special character');
    }
    
    if (errors.length > 0) {
      return customMessage || `Password must contain ${errors.join(', ')}`;
    }
    
    return null;
  },

  // Confirm password validation
  confirmPassword: (value, password, fieldName = 'Passwords') => {
    if (!value) return null;
    if (value !== password) {
      return `${fieldName} do not match`;
    }
    return null;
  },

  // Min/Max length validation
  length: (value, options = {}) => {
    if (!value) return null;
    
    const { min, max, exact } = options;
    const length = value.length;
    
    if (exact !== undefined && length !== exact) {
      return `Must be exactly ${exact} characters`;
    }
    if (min !== undefined && length < min) {
      return `Must be at least ${min} characters`;
    }
    if (max !== undefined && length > max) {
      return `Must be no more than ${max} characters`;
    }
    
    return null;
  },

  // Number range validation
  range: (value, options = {}) => {
    if (!value && value !== 0) return null;
    
    const { min, max, integer = false } = options;
    const num = Number(value);
    
    if (isNaN(num)) {
      return 'Must be a valid number';
    }
    if (integer && !Number.isInteger(num)) {
      return 'Must be an integer';
    }
    if (min !== undefined && num < min) {
      return `Must be at least ${min}`;
    }
    if (max !== undefined && num > max) {
      return `Must be no more than ${max}`;
    }
    
    return null;
  },

  // Pattern validation
  pattern: (value, pattern, message = 'Invalid format') => {
    if (!value) return null;
    if (!pattern.test(value)) {
      return message;
    }
    return null;
  },

  // URL validation
  url: (value, options = {}) => {
    if (!value) return null;
    
    const { protocols = ['http', 'https'], requireProtocol = true } = options;
    
    try {
      const url = new URL(value);
      if (!protocols.includes(url.protocol.slice(0, -1))) {
        return `URL must use ${protocols.join(' or ')} protocol`;
      }
    } catch {
      if (requireProtocol) {
        return 'Please enter a valid URL with protocol (e.g., https://)';
      }
      
      try {
        new URL(`https://${value}`);
      } catch {
        return 'Please enter a valid URL';
      }
    }
    
    return null;
  },

  // Date validation
  date: (value, options = {}) => {
    if (!value) return null;
    
    const { min, max, format = 'YYYY-MM-DD', age } = options;
    const date = new Date(value);
    
    if (isNaN(date.getTime())) {
      return 'Please enter a valid date';
    }
    
    const now = new Date();
    
    if (min) {
      const minDate = new Date(min);
      if (date < minDate) {
        return `Date must be after ${minDate.toLocaleDateString()}`;
      }
    }
    
    if (max) {
      const maxDate = new Date(max);
      if (date > maxDate) {
        return `Date must be before ${maxDate.toLocaleDateString()}`;
      }
    }
    
    if (age) {
      const ageDate = new Date(now.getFullYear() - age, now.getMonth(), now.getDate());
      if (date > ageDate) {
        return `Must be at least ${age} years old`;
      }
    }
    
    return null;
  },

  // File validation
  file: (file, options = {}) => {
    if (!file) return null;
    
    const {
      maxSize,
      minSize,
      types = [],
      extensions = []
    } = options;
    
    if (maxSize && file.size > maxSize * 1024 * 1024) {
      return `File size must not exceed ${maxSize}MB`;
    }
    
    if (minSize && file.size < minSize * 1024 * 1024) {
      return `File size must be at least ${minSize}MB`;
    }
    
    if (types.length > 0 && !types.includes(file.type)) {
      return `File type must be: ${types.join(', ')}`;
    }
    
    if (extensions.length > 0) {
      const ext = file.name.split('.').pop().toLowerCase();
      if (!extensions.includes(ext)) {
        return `File extension must be: ${extensions.join(', ')}`;
      }
    }
    
    return null;
  },

  // Indian PAN card validation
  pan: (value) => {
    if (!value) return null;
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(value.toUpperCase())) {
      return 'Please enter a valid PAN number';
    }
    return null;
  },

  // Indian Aadhaar validation
  aadhaar: (value) => {
    if (!value) return null;
    const cleaned = value.replace(/\s/g, '');
    if (!/^\d{12}$/.test(cleaned)) {
      return 'Please enter a valid 12-digit Aadhaar number';
    }
    return null;
  },

  // GST number validation
  gst: (value) => {
    if (!value) return null;
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
    if (!gstRegex.test(value.toUpperCase())) {
      return 'Please enter a valid GST number';
    }
    return null;
  },

  // Custom validation
  custom: (value, validationFn, message = 'Invalid value') => {
    if (!validationFn(value)) {
      return message;
    }
    return null;
  }
};

/**
 * Form Data Transformers
 */
export const transformers = {
  // Trim whitespace
  trim: (value) => {
    return typeof value === 'string' ? value.trim() : value;
  },

  // Convert to uppercase
  uppercase: (value) => {
    return typeof value === 'string' ? value.toUpperCase() : value;
  },

  // Convert to lowercase
  lowercase: (value) => {
    return typeof value === 'string' ? value.toLowerCase() : value;
  },

  // Capitalize first letter
  capitalize: (value) => {
    if (typeof value !== 'string') return value;
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  },

  // Title case
  titleCase: (value) => {
    if (typeof value !== 'string') return value;
    return value.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  },

  // Remove non-numeric characters
  numeric: (value) => {
    return value.toString().replace(/[^0-9]/g, '');
  },

  // Remove non-alphanumeric characters
  alphanumeric: (value) => {
    return value.toString().replace(/[^a-zA-Z0-9]/g, '');
  },

  // Format phone number
  phone: (value, format = 'IN') => {
    const cleaned = value.toString().replace(/\D/g, '');
    
    if (format === 'IN' && cleaned.length === 10) {
      return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }
    if (format === 'US' && cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    
    return cleaned;
  },

  // Format currency
  currency: (value, options = {}) => {
    const {
      locale = 'en-IN',
      currency = 'INR',
      minimumFractionDigits = 0,
      maximumFractionDigits = 2
    } = options;
    
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits,
      maximumFractionDigits
    }).format(num);
  },

  // Format date
  date: (value, format = 'DD/MM/YYYY') => {
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;
    
    const pad = (num) => num.toString().padStart(2, '0');
    
    const formats = {
      'DD/MM/YYYY': `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`,
      'MM/DD/YYYY': `${pad(date.getMonth() + 1)}/${pad(date.getDate())}/${date.getFullYear()}`,
      'YYYY-MM-DD': `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    };
    
    return formats[format] || date.toLocaleDateString();
  },

  // Clean spaces
  cleanSpaces: (value) => {
    return value.toString().replace(/\s+/g, ' ').trim();
  },

  // Mask sensitive data
  mask: (value, options = {}) => {
    const {
      showFirst = 0,
      showLast = 0,
      maskChar = '*'
    } = options;
    
    const str = value.toString();
    const length = str.length;
    
    if (length <= showFirst + showLast) return str;
    
    const first = str.slice(0, showFirst);
    const last = str.slice(-showLast);
    const masked = maskChar.repeat(length - showFirst - showLast);
    
    return first + masked + last;
  }
};

/**
 * Form Data Serialization
 */
export const serialization = {
  // Serialize form data to object
  formToObject: (form) => {
    const formData = new FormData(form);
    const data = {};
    
    // Handle all form fields including multiple values
    for (let [key, value] of formData.entries()) {
      if (key in data) {
        // Convert to array for multiple values
        if (!Array.isArray(data[key])) {
          data[key] = [data[key]];
        }
        data[key].push(value);
      } else {
        data[key] = value;
      }
    }
    
    // Handle unchecked checkboxes
    const checkboxes = form.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      if (!checkbox.checked && !(checkbox.name in data)) {
        data[checkbox.name] = false;
      } else if (checkbox.checked && !(checkbox.name in data)) {
        data[checkbox.name] = true;
      }
    });
    
    return data;
  },

  // Serialize to query string
  toQueryString: (data) => {
    const params = new URLSearchParams();
    
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, v));
      } else if (value !== null && value !== undefined) {
        params.append(key, value);
      }
    });
    
    return params.toString();
  },

  // Parse query string to object
  fromQueryString: (queryString) => {
    const params = new URLSearchParams(queryString);
    const data = {};
    
    for (let [key, value] of params.entries()) {
      if (key in data) {
        if (!Array.isArray(data[key])) {
          data[key] = [data[key]];
        }
        data[key].push(value);
      } else {
        data[key] = value;
      }
    }
    
    return data;
  },

  // Convert to FormData
  toFormData: (data) => {
    const formData = new FormData();
    
    const appendFormData = (key, value) => {
      if (value instanceof File || value instanceof Blob) {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          appendFormData(`${key}[${index}]`, item);
        });
      } else if (typeof value === 'object' && value !== null) {
        Object.entries(value).forEach(([subKey, subValue]) => {
          appendFormData(`${key}[${subKey}]`, subValue);
        });
      } else if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    };
    
    Object.entries(data).forEach(([key, value]) => {
      appendFormData(key, value);
    });
    
    return formData;
  }
};

/**
 * Form Field Helpers
 */
export const fieldHelpers = {
  // Get field value based on type
  getValue: (field) => {
    switch (field.type) {
      case 'checkbox':
        return field.checked;
      case 'radio':
        return field.checked ? field.value : undefined;
      case 'file':
        return field.files.length > 0 ? field.files : null;
      case 'select-multiple':
        return Array.from(field.selectedOptions).map(option => option.value);
      default:
        return field.value;
    }
  },

  // Set field value based on type
  setValue: (field, value) => {
    switch (field.type) {
      case 'checkbox':
        field.checked = !!value;
        break;
      case 'radio':
        field.checked = field.value === value;
        break;
      case 'file':
        // Cannot programmatically set file input
        console.warn('Cannot set file input value programmatically');
        break;
      case 'select-multiple':
        const values = Array.isArray(value) ? value : [value];
        Array.from(field.options).forEach(option => {
          option.selected = values.includes(option.value);
        });
        break;
      default:
        field.value = value || '';
    }
  },

  // Clear field
  clear: (field) => {
    switch (field.type) {
      case 'checkbox':
      case 'radio':
        field.checked = false;
        break;
      case 'file':
        field.value = '';
        break;
      case 'select-multiple':
        Array.from(field.options).forEach(option => {
          option.selected = false;
        });
        break;
      default:
        field.value = '';
    }
  },

  // Disable/Enable field
  setDisabled: (field, disabled = true) => {
    field.disabled = disabled;
    if (disabled) {
      field.classList.add('disabled');
    } else {
      field.classList.remove('disabled');
    }
  },

  // Set field error state
  setError: (field, error) => {
    const wrapper = field.closest('.form-group');
    const errorElement = wrapper?.querySelector('.error-message');
    
    if (error) {
      field.classList.add('error');
      field.setAttribute('aria-invalid', 'true');
      
      if (errorElement) {
        errorElement.textContent = error;
        errorElement.style.display = 'block';
      }
    } else {
      field.classList.remove('error');
      field.setAttribute('aria-invalid', 'false');
      
      if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
      }
    }
  }
};

/**
 * Form Validation Builder
 */
export class FormValidator {
  constructor(form, schema = {}) {
    this.form = form;
    this.schema = schema;
    this.errors = {};
  }

  // Add validation rule
  addRule(fieldName, validator, options = {}) {
    if (!this.schema[fieldName]) {
      this.schema[fieldName] = [];
    }
    this.schema[fieldName].push({ validator, options });
    return this;
  }

  // Validate single field
  validateField(fieldName) {
    const field = this.form.elements[fieldName];
    if (!field) return null;
    
    const value = fieldHelpers.getValue(field);
    const rules = this.schema[fieldName] || [];
    
    for (const rule of rules) {
      const error = rule.validator(value, rule.options);
      if (error) {
        this.errors[fieldName] = error;
        return error;
      }
    }
    
    delete this.errors[fieldName];
    return null;
  }

  // Validate all fields
  validate() {
    this.errors = {};
    const fields = Object.keys(this.schema);
    
    for (const fieldName of fields) {
      this.validateField(fieldName);
    }
    
    return Object.keys(this.errors).length === 0;
  }

  // Get all errors
  getErrors() {
    return this.errors;
  }

  // Show errors in form
  showErrors() {
    Object.entries(this.errors).forEach(([fieldName, error]) => {
      const field = this.form.elements[fieldName];
      if (field) {
        fieldHelpers.setError(field, error);
      }
    });
  }

  // Clear all errors
  clearErrors() {
    this.errors = {};
    const fields = this.form.elements;
    
    for (const field of fields) {
      fieldHelpers.setError(field, null);
    }
  }
}

/**
 * Form State Manager
 */
export class FormState {
  constructor(form, options = {}) {
    this.form = form;
    this.options = {
      autoSave: false,
      autoSaveDelay: 1000,
      storageKey: 'formState',
      ...options
    };
    this.initialState = this.getState();
    this.isDirty = false;
    
    if (this.options.autoSave) {
      this.enableAutoSave();
    }
  }

  // Get current form state
  getState() {
    return serialization.formToObject(this.form);
  }

  // Set form state
  setState(state) {
    Object.entries(state).forEach(([name, value]) => {
      const field = this.form.elements[name];
      if (field) {
        fieldHelpers.setValue(field, value);
      }
    });
  }

  // Reset to initial state
  reset() {
    this.setState(this.initialState);
    this.isDirty = false;
  }

  // Check if form has changes
  hasChanges() {
    const currentState = this.getState();
    return JSON.stringify(currentState) !== JSON.stringify(this.initialState);
  }

  // Save to storage
  save() {
    const state = this.getState();
    localStorage.setItem(this.options.storageKey, JSON.stringify(state));
  }

  // Load from storage
  load() {
    const saved = localStorage.getItem(this.options.storageKey);
    if (saved) {
      try {
        const state = JSON.parse(saved);
        this.setState(state);
      } catch (error) {
        console.error('Failed to load form state:', error);
      }
    }
  }

  // Clear saved state
  clearSaved() {
    localStorage.removeItem(this.options.storageKey);
  }

  // Enable auto-save
  enableAutoSave() {
    let timeout;
    
    this.form.addEventListener('input', () => {
      this.isDirty = true;
      clearTimeout(timeout);
      
      timeout = setTimeout(() => {
        this.save();
      }, this.options.autoSaveDelay);
    });
  }
}

/**
 * Form utilities
 */
export const utils = {
  // Debounce form validation
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Focus first error field
  focusFirstError(form) {
    const errorField = form.querySelector('.error');
    if (errorField) {
      errorField.focus();
      errorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  },

  // Disable form submission
  disableSubmit(form) {
    const submitButtons = form.querySelectorAll('[type="submit"]');
    submitButtons.forEach(button => {
      button.disabled = true;
      button.classList.add('loading');
    });
  },

  // Enable form submission
  enableSubmit(form) {
    const submitButtons = form.querySelectorAll('[type="submit"]');
    submitButtons.forEach(button => {
      button.disabled = false;
      button.classList.remove('loading');
    });
  },

  // Show form loading state
  showLoading(form, message = 'Processing...') {
    const overlay = document.createElement('div');
    overlay.className = 'form-loading-overlay';
    overlay.innerHTML = `
      <div class="spinner"></div>
      <div class="message">${message}</div>
    `;
    form.style.position = 'relative';
    form.appendChild(overlay);
  },

  // Hide form loading state
  hideLoading(form) {
    const overlay = form.querySelector('.form-loading-overlay');
    if (overlay) {
      overlay.remove();
    }
  },

  // Format form errors for display
  formatErrors(errors) {
    if (Array.isArray(errors)) {
      return errors.join(', ');
    }
    if (typeof errors === 'object') {
      return Object.values(errors).flat().join(', ');
    }
    return errors.toString();
  }
};

// Export everything
export default {
  validators,
  transformers,
  serialization,
  fieldHelpers,
  FormValidator,
  FormState,
  utils
};
