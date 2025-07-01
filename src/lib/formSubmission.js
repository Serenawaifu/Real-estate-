/* ============================================
   ADVANCED FORM SUBMISSION LIBRARY
   Complete form handling with validation & UX
   ============================================ */

class FormSubmission {
  constructor(options = {}) {
    // Configuration
    this.config = {
      // API Configuration
      endpoint: options.endpoint || '/api/contact',
      method: options.method || 'POST',
      headers: options.headers || {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      
      // Validation Rules
      validationRules: options.validationRules || this.defaultValidationRules,
      customValidators: options.customValidators || {},
      
      // Security
      enableCSRF: options.enableCSRF !== false,
      csrfTokenName: options.csrfTokenName || 'csrf_token',
      enableHoneypot: options.enableHoneypot !== false,
      honeypotFieldName: options.honeypotFieldName || 'website',
      enableRateLimit: options.enableRateLimit !== false,
      rateLimitDelay: options.rateLimitDelay || 3000,
      
      // User Experience
      showProgress: options.showProgress !== false,
      autoSave: options.autoSave !== false,
      autoSaveDelay: options.autoSaveDelay || 1000,
      clearOnSuccess: options.clearOnSuccess !== false,
      scrollToError: options.scrollToError !== false,
      focusFirstError: options.focusFirstError !== false,
      
      // Notifications
      showNotifications: options.showNotifications !== false,
      notificationDuration: options.notificationDuration || 5000,
      
      // Analytics
      enableAnalytics: options.enableAnalytics !== false,
      analyticsCategory: options.analyticsCategory || 'Form',
      
      // Callbacks
      onSubmit: options.onSubmit || null,
      onSuccess: options.onSuccess || null,
      onError: options.onError || null,
      onValidationError: options.onValidationError || null,
      beforeSubmit: options.beforeSubmit || null,
      afterSubmit: options.afterSubmit || null
    };

    // State
    this.forms = new Map();
    this.submissionStates = new Map();
    this.autoSaveTimers = new Map();
    this.rateLimitTimers = new Map();
    
    // Initialize
    this.init();
  }

  /* ============================================
     DEFAULT VALIDATION RULES
     ============================================ */
  defaultValidationRules = {
    name: {
      required: true,
      minLength: 2,
      maxLength: 100,
      pattern: /^[a-zA-Z\s'-]+$/,
      messages: {
        required: 'Name is required',
        minLength: 'Name must be at least 2 characters',
        maxLength: 'Name cannot exceed 100 characters',
        pattern: 'Name can only contain letters, spaces, hyphens, and apostrophes'
      }
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      maxLength: 255,
      messages: {
        required: 'Email is required',
        pattern: 'Please enter a valid email address',
        maxLength: 'Email cannot exceed 255 characters'
      }
    },
    phone: {
      required: false,
      pattern: /^\+?[\d\s()-]+$/,
      minLength: 10,
      maxLength: 20,
      transform: value => value.replace(/\D/g, ''),
      messages: {
        pattern: 'Please enter a valid phone number',
        minLength: 'Phone number must be at least 10 digits',
        maxLength: 'Phone number cannot exceed 20 digits'
      }
    },
    message: {
      required: true,
      minLength: 10,
      maxLength: 5000,
      messages: {
        required: 'Message is required',
        minLength: 'Message must be at least 10 characters',
        maxLength: 'Message cannot exceed 5000 characters'
      }
    }
  };

  /* ============================================
     INITIALIZATION
     ============================================ */
  init() {
    // Add CSS styles
    this.injectStyles();
    
    // Find and initialize all forms
    this.initializeForms();
    
    // Set up global handlers
    this.setupGlobalHandlers();
  }

  injectStyles() {
    if (!document.getElementById('form-submission-styles')) {
      const styles = document.createElement('style');
      styles.id = 'form-submission-styles';
      styles.textContent = `
        /* Form Submission Styles */
        .form-group {
          position: relative;
          margin-bottom: 1.5rem;
        }
        
        .form-control {
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        
        .form-control.error {
          border-color: var(--color-error, #ef4444);
        }
        
        .form-control.success {
          border-color: var(--color-success, #10b981);
        }
        
        .form-control:focus {
          outline: none;
          border-color: var(--color-primary, #2563eb);
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        
        .error-message {
          display: none;
          color: var(--color-error, #ef4444);
          font-size: 0.875rem;
          margin-top: 0.25rem;
          animation: slideDown 0.3s ease;
        }
        
        .error-message.show {
          display: block;
        }
        
        .success-message {
          color: var(--color-success, #10b981);
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }
        
        .char-counter {
          position: absolute;
          right: 0;
          bottom: -1.5rem;
          font-size: 0.75rem;
          color: var(--color-text-tertiary, #737373);
          transition: color 0.3s ease;
        }
        
        .char-counter.warning {
          color: var(--color-warning, #f59e0b);
        }
        
        .char-counter.error {
          color: var(--color-error, #ef4444);
        }
        
        /* Loading States */
        .form-loading {
          position: relative;
          pointer-events: none;
          opacity: 0.7;
        }
        
        .form-loading::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 2rem;
          height: 2rem;
          margin: -1rem 0 0 -1rem;
          border: 3px solid transparent;
          border-top-color: var(--color-primary, #2563eb);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        
        /* Progress Bar */
        .form-progress {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: rgba(0, 0, 0, 0.1);
          overflow: hidden;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .form-progress.show {
          opacity: 1;
        }
        
        .form-progress-bar {
          height: 100%;
          background: var(--color-primary, #2563eb);
          transform: translateX(-100%);
          animation: progress 1s ease-in-out infinite;
        }
        
        /* Notification */
        .form-notification {
          position: fixed;
          top: 1rem;
          right: 1rem;
          max-width: 24rem;
          padding: 1rem 1.5rem;
          background: white;
          border-radius: 0.5rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          transform: translateX(calc(100% + 2rem));
          transition: transform 0.3s ease;
          z-index: 9999;
        }
        
        .form-notification.show {
          transform: translateX(0);
        }
        
        .form-notification.success {
          border-left: 4px solid var(--color-success, #10b981);
        }
        
        .form-notification.error {
          border-left: 4px solid var(--color-error, #ef4444);
        }
        
        .form-notification-title {
          font-weight: 600;
          margin-bottom: 0.25rem;
        }
        
        .form-notification-message {
          color: var(--color-text-secondary, #525252);
          font-size: 0.875rem;
        }
        
        .form-notification-close {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: none;
          border: none;
          font-size: 1.25rem;
          cursor: pointer;
          color: var(--color-text-tertiary, #737373);
          transition: color 0.3s ease;
        }
        
        .form-notification-close:hover {
          color: var(--color-text-primary, #171717);
        }
        
        /* Honeypot */
        .honeypot {
          position: absolute;
          left: -9999px;
          height: 0;
          width: 0;
          overflow: hidden;
        }
        
        /* Animations */
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-0.5rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes progress {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        /* Accessibility */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        
        /* Focus styles */
        .form-control:focus-visible {
          outline: 2px solid var(--color-primary, #2563eb);
          outline-offset: 2px;
        }
        
        /* Responsive */
        @media (max-width: 640px) {
          .form-notification {
            right: 0.5rem;
            left: 0.5rem;
            max-width: none;
          }
        }
      `;
      document.head.appendChild(styles);
    }
  }

  initializeForms() {
    // Find all forms with data-form attribute
    const forms = document.querySelectorAll('form[data-form]');
    
    forms.forEach(form => {
      this.initializeForm(form);
    });
  }

  initializeForm(form) {
    const formId = form.dataset.form || form.id || `form-${Date.now()}`;
    
    // Store form configuration
    const formConfig = {
      element: form,
      fields: new Map(),
      isSubmitting: false,
      isDirty: false
    };
    
    // Add honeypot if enabled
    if (this.config.enableHoneypot) {
      this.addHoneypot(form);
    }
    
    // Add progress bar
    if (this.config.showProgress) {
      this.addProgressBar(form);
    }
    
    // Initialize fields
    const fields = form.querySelectorAll('input, textarea, select');
    fields.forEach(field => {
      if (field.name && !field.disabled) {
        this.initializeField(field, formConfig);
      }
    });
    
    // Add form event listeners
    form.addEventListener('submit', (e) => this.handleSubmit(e, formConfig));
    
    // Add auto-save if enabled
    if (this.config.autoSave) {
      this.setupAutoSave(form, formConfig);
    }
    
    // Store form
    this.forms.set(formId, formConfig);
    
    // Load saved data if exists
    this.loadSavedData(formId, formConfig);
  }

  initializeField(field, formConfig) {
    const fieldName = field.name;
    const validationRule = this.config.validationRules[fieldName] || {};
    
    // Store field configuration
    const fieldConfig = {
      element: field,
      name: fieldName,
      validationRule: validationRule,
      isValid: true,
      isDirty: false,
      originalValue: field.value
    };
    
    formConfig.fields.set(fieldName, fieldConfig);
    
    // Add error message container
    this.addErrorContainer(field);
    
    // Add character counter for text fields with maxLength
    if ((field.type === 'text' || field.type === 'textarea') && validationRule.maxLength) {
      this.addCharacterCounter(field, validationRule.maxLength);
    }
    
    // Add field event listeners
    field.addEventListener('blur', () => this.validateField(fieldConfig));
    field.addEventListener('input', () => this.handleFieldInput(fieldConfig, formConfig));
    
    // Add custom formatting
    if (field.name === 'phone') {
      field.addEventListener('input', (e) => this.formatPhoneNumber(e));
    }
  }

  /* ============================================
     SECURITY FEATURES
     ============================================ */
  addHoneypot(form) {
    const honeypot = document.createElement('div');
    honeypot.className = 'honeypot';
    honeypot.setAttribute('aria-hidden', 'true');
    honeypot.innerHTML = `
      <label for="${this.config.honeypotFieldName}">
        Leave this field empty
        <input type="text" name="${this.config.honeypotFieldName}" 
               id="${this.config.honeypotFieldName}" 
               tabindex="-1" 
               autocomplete="off">
      </label>
    `;
    form.appendChild(honeypot);
  }

  checkHoneypot(formData) {
    return !formData[this.config.honeypotFieldName];
  }

  getCSRFToken() {
    // Try to get CSRF token from meta tag
    const metaToken = document.querySelector('meta[name="csrf-token"]');
    if (metaToken) return metaToken.content;
    
    // Try to get from cookie
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === this.config.csrfTokenName) {
        return decodeURIComponent(value);
      }
    }
    
    return null;
  }

  /* ============================================
     VALIDATION
     ============================================ */
  validateField(fieldConfig) {
    const { element, validationRule, name } = fieldConfig;
    const value = element.value.trim();
    const errors = [];
    
    // Apply transformation if exists
    const transformedValue = validationRule.transform ? 
      validationRule.transform(value) : value;
    
    // Required validation
    if (validationRule.required && !transformedValue) {
      errors.push(validationRule.messages?.required || `${name} is required`);
    }
    
    // Only validate further if field has value or is required
    if (transformedValue || validationRule.required) {
      // Min length validation
      if (validationRule.minLength && transformedValue.length < validationRule.minLength) {
        errors.push(validationRule.messages?.minLength || 
          `${name} must be at least ${validationRule.minLength} characters`);
      }
      
      // Max length validation
      if (validationRule.maxLength && transformedValue.length > validationRule.maxLength) {
        errors.push(validationRule.messages?.maxLength || 
          `${name} cannot exceed ${validationRule.maxLength} characters`);
      }
      
      // Pattern validation
      if (validationRule.pattern && !validationRule.pattern.test(transformedValue)) {
        errors.push(validationRule.messages?.pattern || `${name} format is invalid`);
      }
      
      // Custom validation
      if (validationRule.custom) {
        const customError = validationRule.custom(transformedValue, element);
        if (customError) {
          errors.push(customError);
        }
      }
      
      // Run custom validators if defined
      const customValidator = this.config.customValidators[name];
      if (customValidator) {
        const customError = customValidator(transformedValue, element);
        if (customError) {
          errors.push(customError);
        }
      }
    }
    
    // Update field state
    fieldConfig.isValid = errors.length === 0;
    fieldConfig.errors = errors;
    
    // Update UI
    this.updateFieldUI(fieldConfig);
    
    return fieldConfig.isValid;
  }

  validateForm(formConfig) {
    let isValid = true;
    const errors = new Map();
    
    formConfig.fields.forEach((fieldConfig) => {
      if (!this.validateField(fieldConfig)) {
        isValid = false;
        errors.set(fieldConfig.name, fieldConfig.errors);
      }
    });
    
    return { isValid, errors };
  }

  /* ============================================
     UI UPDATES
     ============================================ */
  updateFieldUI(fieldConfig) {
    const { element, isValid, errors } = fieldConfig;
    const errorContainer = element.parentElement.querySelector('.error-message');
    
    // Update field classes
    element.classList.remove('error', 'success');
    if (fieldConfig.isDirty) {
      element.classList.add(isValid ? 'success' : 'error');
    }
    
    // Update error message
    if (errorContainer) {
      if (!isValid && errors.length > 0) {
        errorContainer.textContent = errors[0];
        errorContainer.classList.add('show');
        
        // Update ARIA attributes
        element.setAttribute('aria-invalid', 'true');
        element.setAttribute('aria-describedby', errorContainer.id);
      } else {
        errorContainer.classList.remove('show');
        element.removeAttribute('aria-invalid');
        element.removeAttribute('aria-describedby');
      }
    }
  }

  addErrorContainer(field) {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-message';
    errorContainer.id = `${field.id || field.name}-error`;
    errorContainer.setAttribute('role', 'alert');
    errorContainer.setAttribute('aria-live', 'polite');
    
    field.parentElement.appendChild(errorContainer);
  }

  addCharacterCounter(field, maxLength) {
    const counter = document.createElement('div');
    counter.className = 'char-counter';
    counter.setAttribute('aria-live', 'polite');
    counter.setAttribute('aria-atomic', 'true');
    
    const updateCounter = () => {
      const length = field.value.length;
      const remaining = maxLength - length;
      counter.textContent = `${length}/${maxLength}`;
      
      // Update counter color
      counter.classList.remove('warning', 'error');
      if (remaining < 20) {
        counter.classList.add('warning');
      }
      if (remaining < 0) {
        counter.classList.add('error');
      }
      
      // Update ARIA label
      counter.setAttribute('aria-label', 
        `${remaining} characters remaining out of ${maxLength}`);
    };
    
    field.parentElement.appendChild(counter);
    field.addEventListener('input', updateCounter);
    updateCounter();
  }

  addProgressBar(form) {
    const progress = document.createElement('div');
    progress.className = 'form-progress';
    progress.innerHTML = '<div class="form-progress-bar"></div>';
    form.style.position = 'relative';
    form.insertBefore(progress, form.firstChild);
  }

  /* ============================================
     FORM SUBMISSION
     ============================================ */
  async handleSubmit(event, formConfig) {
    event.preventDefault();
    
    // Check if already submitting
    if (formConfig.isSubmitting) return;
    
    // Check rate limiting
    const form = formConfig.element;
    const formId = form.dataset.form || form.id;
    if (this.isRateLimited(formId)) {
      this.showNotification('error', 'Rate Limit', 
        'Please wait before submitting again');
      return;
    }
    
    // Validate form
    const { isValid, errors } = this.validateForm(formConfig);
    
    if (!isValid) {
      // Handle validation errors
      if (this.config.onValidationError) {
        this.config.onValidationError(errors, form);
      }
      
      // Focus first error field
      if (this.config.focusFirstError) {
        const firstErrorField = form.querySelector('.error');
        if (firstErrorField) {
          firstErrorField.focus();
          
          // Scroll to error if enabled
          if (this.config.scrollToError) {
            firstErrorField.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
          }
        }
      }
      
      return;
    }
    
    // Get form data
    const formData = this.getFormData(form);
    
    // Check honeypot
    if (this.config.enableHoneypot && !this.checkHoneypot(formData)) {
      console.warn('Honeypot triggered');
      // Silently fail to not alert bots
      setTimeout(() => {
        this.showNotification('success', 'Success!', 
          'Your message has been sent successfully');
      }, 1000);
      return;
    }
    
    // Add CSRF token if enabled
    if (this.config.enableCSRF) {
      const csrfToken = this.getCSRFToken();
      if (csrfToken) {
        formData[this.config.csrfTokenName] = csrfToken;
      }
    }
    
    // Call beforeSubmit callback
    if (this.config.beforeSubmit) {
      const shouldContinue = await this.config.beforeSubmit(formData, form);
      if (shouldContinue === false) return;
    }
    
    // Start submission
    this.startSubmission(formConfig);
    
    try {
      // Submit form
      const response = await this.submitForm(formData, formConfig);
      
      // Handle success
      await this.handleSuccess(response, formConfig);
      
    } catch (error) {
      // Handle error
      await this.handleError(error, formConfig);
    } finally {
      // End submission
      this.endSubmission(formConfig);
      
      // Set rate limit
      this.setRateLimit(formId);
      
      // Call afterSubmit callback
      if (this.config.afterSubmit) {
        this.config.afterSubmit(formData, form);
      }
    }
  }

  async submitForm(formData, formConfig) {
    const response = await fetch(this.config.endpoint, {
      method: this.config.method,
      headers: this.config.headers,
      body: JSON.stringify(formData)
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ 
        message: 'Server error occurred' 
      }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }
    
    return response.json();
  }

  startSubmission(formConfig) {
    const form = formConfig.element;
    formConfig.isSubmitting = true;
    
    // Disable form
    form.classList.add('form-loading');
    const fields = form.querySelectorAll('input, textarea, select, button');
    fields.forEach(field => field.disabled = true);
    
    // Show progress
    if (this.config.showProgress) {
      const progress = form.querySelector('.form-progress');
      if (progress) progress.classList.add('show');
    }
    
    // Trigger onSubmit callback
    if (this.config.onSubmit) {
      this.config.onSubmit(form);
    }
  }

  endSubmission(formConfig) {
    const form = formConfig.element;
    formConfig.isSubmitting = false;
    
    // Enable form
    form.classList.remove('form-loading');
    const fields = form.querySelectorAll('input, textarea, select, button');
    fields.forEach(field => field.disabled = false);
    
    // Hide progress
    if (this.config.showProgress) {
      const progress = form.querySelector('.form-progress');
      if (progress) progress.classList.remove('show');
    }
  }

  async handleSuccess(response, formConfig) {
    const form = formConfig.element;
    
    // Clear form if enabled
    if (this.config.clearOnSuccess) {
      this.clearForm(formConfig);
    }
    
    // Clear saved data
    const formId = form.dataset.form || form.id;
    this.clearSavedData(formId);
    
    // Show notification
    if (this.config.showNotifications) {
      this.showNotification('success', 'Success!', 
        response.message || 'Your form has been submitted successfully');
    }
    
    // Track analytics
    if (this.config.enableAnalytics) {
      this.trackFormSubmission('success', form);
    }
    
    // Call onSuccess callback
    if (this.config.onSuccess) {
      await this.config.onSuccess(response, form);
    }
  }

  async handleError(error, formConfig) {
    const form = formConfig.element;
    
    // Show notification
    if (this.config.showNotifications) {
      this.showNotification('error', 'Error', 
        error.message || 'An error occurred. Please try again.');
    }
    
    // Track analytics
    if (this.config.enableAnalytics) {
      this.trackFormSubmission('error', form, error.message);
    }
    
    // Call onError callback
    if (this.config.onError) {
      await this.config.onError(error, form);
    }
  }

  /* ============================================
     NOTIFICATIONS
     ============================================ */
  showNotification(type, title, message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `form-notification ${type}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'assertive');
    
    notification.innerHTML = `
      <div class="form-notification-title">${this.escapeHtml(title)}</div>
      <div class="form-notification-message">${this.escapeHtml(message)}</div>
      <button class="form-notification-close" aria-label="Close notification">&times;</button>
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Trigger reflow and show
    notification.offsetHeight;
    notification.classList.add('show');
    
    // Add close handler
    const closeBtn = notification.querySelector('.form-notification-close');
    closeBtn.addEventListener('click', () => this.hideNotification(notification));
    
    // Auto-hide after duration
    setTimeout(() => {
      this.hideNotification(notification);
    }, this.config.notificationDuration);
  }

  hideNotification(notification) {
    notification.classList.remove('show');
    
    // Remove after transition
    setTimeout(() => {
      if (notification.parentElement) {
        notification.parentElement.removeChild(notification);
      }
    }, 300);
  }

  /* ============================================
     AUTO-SAVE
     ============================================ */
  setupAutoSave(form, formConfig) {
    formConfig.fields.forEach((fieldConfig) => {
      fieldConfig.element.addEventListener('input', () => {
        // Clear existing timer
        const formId = form.dataset.form || form.id;
        if (this.autoSaveTimers.has(formId)) {
          clearTimeout(this.autoSaveTimers.get(formId));
        }
        
        // Set new timer
        const timer = setTimeout(() => {
          this.saveFormData(formId, formConfig);
        }, this.config.autoSaveDelay);
        
        this.autoSaveTimers.set(formId, timer);
      });
    });
  }

  saveFormData(formId, formConfig) {
    const formData = this.getFormData(formConfig.element);
    
    try {
      localStorage.setItem(`form_${formId}`, JSON.stringify({
        data: formData,
        timestamp: Date.now()
      }));
    } catch (e) {
      console.warn('Failed to save form data:', e);
    }
  }

  loadSavedData(formId, formConfig) {
    try {
      const saved = localStorage.getItem(`form_${formId}`);
      if (!saved) return;
      
      const { data, timestamp } = JSON.parse(saved);
      
      // Check if data is not too old (24 hours)
      if (Date.now() - timestamp > 24 * 60 * 60 * 1000) {
        this.clearSavedData(formId);
        return;
      }
      
      // Restore form data
      formConfig.fields.forEach((fieldConfig, name) => {
        if (data[name] !== undefined && data[name] !== '') {
          fieldConfig.element.value = data[name];
          fieldConfig.isDirty = true;
        }
      });
      
    } catch (e) {
      console.warn('Failed to load saved form data:', e);
    }
  }

  clearSavedData(formId) {
    try {
      localStorage.removeItem(`form_${formId}`);
    } catch (e) {
      console.warn('Failed to clear saved form data:', e);
    }
  }

  /* ============================================
     UTILITY METHODS
     ============================================ */
  getFormData(form) {
    const formData = new FormData(form);
    const data = {};
    
    for (const [key, value] of formData.entries()) {
      // Skip honeypot field
      if (key === this.config.honeypotFieldName) continue;
      
      // Handle multiple values (like checkboxes)
      if (data[key]) {
        if (Array.isArray(data[key])) {
          data[key].push(value);
        } else {
          data[key] = [data[key], value];
        }
      } else {
        data[key] = value;
      }
    }
    
    return data;
  }

  clearForm(formConfig) {
    formConfig.fields.forEach((fieldConfig) => {
      fieldConfig.element.value = '';
      fieldConfig.isDirty = false;
      fieldConfig.isValid = true;
      this.updateFieldUI(fieldConfig);
    });
  }

  formatPhoneNumber(event) {
    const input = event.target;
    let value = input.value.replace(/\D/g, '');
    
    // Format as (123) 456-7890
    if (value.length >= 6) {
      value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
    } else if (value.length >= 3) {
      value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
    }
    
    input.value = value;
  }

  handleFieldInput(fieldConfig, formConfig) {
    fieldConfig.isDirty = true;
    formConfig.isDirty = true;
    
    // Clear validation on input (will re-validate on blur)
    fieldConfig.element.classList.remove('error', 'success');
    const errorContainer = fieldConfig.element.parentElement.querySelector('.error-message');
    if (errorContainer) {
      errorContainer.classList.remove('show');
    }
  }

  isRateLimited(formId) {
    return this.rateLimitTimers.has(formId);
  }

  setRateLimit(formId) {
    if (!this.config.enableRateLimit) return;
    
    this.rateLimitTimers.set(formId, true);
    
    setTimeout(() => {
      this.rateLimitTimers.delete(formId);
    }, this.config.rateLimitDelay);
  }

  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  trackFormSubmission(status, form, errorMessage) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'form_submission', {
        event_category: this.config.analyticsCategory,
        event_label: form.dataset.form || form.id || 'unknown',
        event_value: status === 'success' ? 1 : 0,
        error_message: errorMessage
      });
    }
    
    // Also support Google Analytics (analytics.js)
    if (typeof ga !== 'undefined') {
      ga('send', 'event', this.config.analyticsCategory, 'submission', status, {
        dimension1: form.dataset.form || form.id || 'unknown'
      });
    }
  }

  setupGlobalHandlers() {
    // Handle browser back button
    window.addEventListener('popstate', () => {
      // Reload saved form data
      this.forms.forEach((formConfig, formId) => {
        this.loadSavedData(formId, formConfig);
      });
    });
    
    // Warn before leaving with unsaved changes
    window.addEventListener('beforeunload', (e) => {
      let hasDirtyForm = false;
      
      this.forms.forEach((formConfig) => {
        if (formConfig.isDirty && !formConfig.isSubmitting) {
          hasDirtyForm = true;
        }
      });
      
      if (hasDirtyForm) {
        e.preventDefault();
        e.returnValue = '';
      }
    });
  }

  /* ============================================
     PUBLIC API
     ============================================ */
  
  // Add custom validator
  addValidator(fieldName, validator) {
    this.config.customValidators[fieldName] = validator;
  }
  
  // Remove custom validator
  removeValidator(fieldName) {
    delete this.config.customValidators[fieldName];
  }
  
  // Manually validate a form
  validate(formSelector) {
    const form = document.querySelector(formSelector);
    if (!form) return null;
    
    const formConfig = Array.from(this.forms.values())
      .find(config => config.element === form);
    
    if (!formConfig) return null;
    
    return this.validateForm(formConfig);
  }
  
  // Manually submit a form
  submit(formSelector) {
    const form = document.querySelector(formSelector);
    if (!form) return Promise.reject(new Error('Form not found'));
    
    const event = new Event('submit', { cancelable: true });
    form.dispatchEvent(event);
    
    return Promise.resolve();
  }
  
  // Reset a form
  reset(formSelector) {
    const form = document.querySelector(formSelector);
    if (!form) return;
    
    const formConfig = Array.from(this.forms.values())
      .find(config => config.element === form);
    
    if (formConfig) {
      this.clearForm(formConfig);
      const formId = form.dataset.form || form.id;
      this.clearSavedData(formId);
    }
  }
  
  // Update configuration
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }
  
  // Destroy instance
  destroy() {
    // Clear all timers
    this.autoSaveTimers.forEach(timer => clearTimeout(timer));
    this.autoSaveTimers.clear();
    
    // Remove event listeners
    this.forms.forEach((formConfig) => {
      const form = formConfig.element;
      form.removeEventListener('submit', this.handleSubmit);
    });
    
    // Clear forms
    this.forms.clear();
    
    // Clear states
    this.submissionStates.clear();
    this.rateLimitTimers.clear();
  }
}

/* ============================================
   EXPORT
   ============================================ */
// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FormSubmission;
}

// Export for ES6 modules
export default FormSubmission;

// Also attach to window for direct browser use
if (typeof window !== 'undefined') {
  window.FormSubmission = FormSubmission;
}
