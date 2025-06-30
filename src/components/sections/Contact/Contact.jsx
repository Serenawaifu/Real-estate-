import React, { useState, useEffect, useRef } from 'react';
import styles from './Contact.module.css';

const Contact = () => {
  // Generate unique ticket number
  const generateTicketNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `TKT-${year}${month}${day}-${random}`;
  };

  // Form state
  const [formData, setFormData] = useState({
    ticketNumber: generateTicketNumber(),
    name: '',
    email: '',
    phone: '',
    propertyTypes: [],
    budget: 50000,
    location: '',
    message: '',
    preferredContact: 'email',
    timeframe: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});

  // Refs for animations
  const formRef = useRef(null);
  const infoRef = useRef(null);

  // Property types
  const propertyTypes = [
    'Office Space',
    'Retail Shop',
    'Warehouse',
    'Showroom',
    'Co-working',
    'Industrial'
  ];

  // Timeframe options
  const timeframes = [
    'Immediate',
    'Within 1 Month',
    '1-3 Months',
    '3-6 Months',
    'Just Exploring'
  ];

  // Email validation for Gmail/Yahoo
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    
    const domain = email.split('@')[1]?.toLowerCase();
    const allowedDomains = ['gmail.com', 'yahoo.com', 'yahoo.in', 'yahoo.co.in'];
    
    if (!allowedDomains.includes(domain)) {
      return 'Please use a Gmail or Yahoo email address';
    }
    
    return '';
  };

  // Phone validation
  const validatePhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return 'Please enter a valid 10-digit Indian mobile number';
    }
    return '';
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        propertyTypes: checked 
          ? [...prev.propertyTypes, value]
          : prev.propertyTypes.filter(type => type !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle field blur
  const handleBlur = (fieldName) => {
    setTouchedFields(prev => ({
      ...prev,
      [fieldName]: true
    }));
    validateField(fieldName);
  };

  // Validate single field
  const validateField = (fieldName) => {
    let error = '';
    
    switch (fieldName) {
      case 'name':
        if (!formData.name.trim()) {
          error = 'Name is required';
        } else if (formData.name.trim().length < 2) {
          error = 'Name must be at least 2 characters';
        }
        break;
      case 'email':
        error = validateEmail(formData.email);
        break;
      case 'phone':
        error = validatePhone(formData.phone);
        break;
      case 'propertyTypes':
        if (formData.propertyTypes.length === 0) {
          error = 'Please select at least one property type';
        }
        break;
      case 'location':
        if (!formData.location.trim()) {
          error = 'Preferred location is required';
        }
        break;
      case 'message':
        if (!formData.message.trim()) {
          error = 'Please enter your requirements';
        }
        break;
      case 'timeframe':
        if (!formData.timeframe) {
          error = 'Please select a timeframe';
        }
        break;
      default:
        break;
    }
    
    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
    
    return error === '';
  };

  // Validate all fields
  const validateForm = () => {
    const requiredFields = ['name', 'email', 'phone', 'propertyTypes', 'location', 'message', 'timeframe'];
    let isValid = true;
    const newErrors = {};
    
    requiredFields.forEach(field => {
      if (!validateField(field)) {
        isValid = false;
      }
    });
    
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouchedFields(allTouched);
    
    if (!validateForm()) {
      // Shake form on error
      formRef.current.classList.add(styles.shake);
      setTimeout(() => {
        formRef.current.classList.remove(styles.shake);
      }, 500);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would integrate with your form service
      // Example: EmailJS, Formspree, or custom backend
      console.log('Form submitted:', formData);
      
      // Show success message
      setShowSuccess(true);
      
      // Reset form
      setTimeout(() => {
        setFormData({
          ticketNumber: generateTicketNumber(),
          name: '',
          email: '',
          phone: '',
          propertyTypes: [],
          budget: 50000,
          location: '',
          message: '',
          preferredContact: 'email',
          timeframe: ''
        });
        setTouchedFields({});
        setErrors({});
      }, 1000);
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      
    } catch (error) {
      console.error('Submission error:', error);
      setErrors({ submit: 'Failed to submit form. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format budget display
  const formatBudget = (value) => {
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    }
    return `₹${value.toLocaleString('en-IN')}`;
  };

  // Intersection Observer for animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.visible);
        }
      });
    }, observerOptions);

    if (formRef.current) observer.observe(formRef.current);
    if (infoRef.current) observer.observe(infoRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.contactSection} id="contact">
      {/* Background Animation */}
      <div className={styles.backgroundPattern}>
        <div className={styles.floatingElement} />
        <div className={styles.floatingElement} />
        <div className={styles.floatingElement} />
      </div>

      <div className={styles.container}>
        {/* Contact Information */}
        <div className={styles.contactInfo} ref={infoRef}>
          <h2 className={styles.infoTitle}>Get in Touch</h2>
          <p className={styles.infoSubtitle}>
            With 14+ years of experience, we're here to help you find the perfect commercial space
          </p>

          <div className={styles.infoItems}>
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div className={styles.infoContent}>
                <h3>Visit Our Office</h3>
                <p>Shop No 11, T S Complex, Shop Siddhi Enclave CHS Ltd</p>
                <p>Datta Mandir, Road, Wakad, Pune, Maharashtra 411057</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72" />
                </svg>
              </div>
              <div className={styles.infoContent}>
                <h3>Call Us</h3>
                <p>+91 98765 43210</p>
                <p>Mon-Sat: 9:00 AM - 7:00 PM</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-10 5L2 7" />
                </svg>
              </div>
              <div className={styles.infoContent}>
                <h3>Email Us</h3>
                <p>info@dgrealtors.com</p>
                <p>We'll respond within 24 hours</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div className={styles.infoContent}>
                <h3>Response Time</h3>
                <p>Average response: 2-4 hours</p>
                <p>Priority support for urgent requirements</p>
              </div>
            </div>
          </div>

          {/* Map Preview */}
          <div className={styles.mapPreview}>
            <img 
              src="https://placehold.co/400x200" 
              alt="Interactive map showing DGrealtors office location in Wakad, Pune with nearby landmarks and transportation options"
              className={styles.mapImage}
            />
            <button className={styles.mapButton}>View on Google Maps</button>
          </div>
        </div>

        {/* Contact Form */}
        <div className={styles.ticketForm} ref={formRef}>
          <div className={styles.formHeader}>
            <span className={styles.ticketNumber}>Ticket #{formData.ticketNumber}</span>
            <h2 className={styles.formTitle}>Submit Your Requirement</h2>
            <p className={styles.formSubtitle}>Fill out the form below and we'll get back to you shortly</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Name Field */}
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.formLabel}>
                Full Name <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={() => handleBlur('name')}
                className={`${styles.formInput} ${touchedFields.name && errors.name ? styles.error : ''}`}
                placeholder="Enter your full name"
              />
              {touchedFields.name && errors.name && (
                <span className={styles.errorMessage}>{errors.name}</span>
              )}
            </div>

            {/* Email Field */}
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.formLabel}>
                Email Address <span className={styles.required}>*</span>
                <span className={styles.fieldHint}>(Gmail or Yahoo only)</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur('email')}
                className={`${styles.formInput} ${touchedFields.email && errors.email ? styles.error : ''}`}
                placeholder="your.email@gmail.com"
              />
              {touchedFields.email && errors.email && (
                <span className={styles.errorMessage}>{errors.email}</span>
              )}
            </div>

            {/* Phone Field */}
            <div className={styles.formGroup}>
              <label htmlFor="phone" className={styles.formLabel}>
                Mobile Number <span className={styles.required}>*</span>
              </label>
              <div className={styles.phoneInput}>
                <span className={styles.countryCode}>+91</span>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={() => handleBlur('phone')}
                  className={`${styles.formInput} ${touchedFields.phone && errors.phone ? styles.error : ''}`}
                  placeholder="98765 43210"
                  maxLength="10"
                />
              </div>
              {touchedFields.phone && errors.phone && (
                <span className={styles.errorMessage}>{errors.phone}</span>
              )}
            </div>

            {/* Property Types */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Property Type <span className={styles.required}>*</span>
              </label>
              <div className={styles.propertyTypes}>
                {propertyTypes.map(type => (
                  <label key={type} className={styles.propertyTypeOption}>
                    <input
                      type="checkbox"
                      name="propertyTypes"
                      value={type}
                      checked={formData.propertyTypes.includes(type)}
                      onChange={handleChange}
                      className={styles.propertyTypeCheckbox}
                    />
                    <span className={styles.propertyTypeLabel}>
                      <span className={styles.checkmark}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      {type}
                    </span>
                  </label>
                ))}
              </div>
              {touchedFields.propertyTypes && errors.propertyTypes && (
                <span className={styles.errorMessage}>{errors.propertyTypes}</span>
              )}
            </div>

            {/* Budget Range */}
            <div className={styles.formGroup}>
              <label htmlFor="budget" className={styles.formLabel}>
                Monthly Budget Range
              </label>
              <div className={styles.budgetRange}>
                <div className={styles.budgetDisplay}>
                  <span>₹10,000</span>
                  <span className={styles.budgetValue}>{formatBudget(formData.budget)}</span>
                  <span>₹5L+</span>
                </div>
                <input
                  type="range"
                  id="budget"
                  name="budget"
                  min="10000"
                  max="500000"
                  step="5000"
                  value={formData.budget}
                  onChange={handleChange}
                  className={styles.rangeSlider}
                />
              </div>
            </div>

            {/* Preferred Location */}
            <div className={styles.formGroup}>
              <label htmlFor="location" className={styles.formLabel}>
                Preferred Location/Area <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                onBlur={() => handleBlur('location')}
                className={`${styles.formInput} ${touchedFields.location && errors.location ? styles.error : ''}`}
                placeholder="e.g., Wakad, Hinjewadi, Baner"
              />
              {touchedFields.location && errors.location && (
                <span className={styles.errorMessage}>{errors.location}</span>
              )}
            </div>

            {/* Timeframe */}
            <div className={styles.formGroup}>
              <label htmlFor="timeframe" className={styles.formLabel}>
                When do you need the space? <span className={styles.required}>*</span>
              </label>
              <select
                id="timeframe"
                name="timeframe"
                value={formData.timeframe}
                onChange={handleChange}
                onBlur={() => handleBlur('timeframe')}
                className={`${styles.formInput} ${touchedFields.timeframe && errors.timeframe ? styles.error : ''}`}
              >
                <option value="">Select timeframe</option>
                {timeframes.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
              {touchedFields.timeframe && errors.timeframe && (
                <span className={styles.errorMessage}>{errors.timeframe}</span>
              )}
            </div>

            {/* Preferred Contact */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Preferred Contact Method</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="preferredContact"
                    value="email"
                    checked={formData.preferredContact === 'email'}
                    onChange={handleChange}
                    className={styles.radioInput}
                  />
                  <span className={styles.radioLabel}>Email</span>
                </label>
                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="preferredContact"
                    value="phone"
                    checked={formData.preferredContact === 'phone'}
                    onChange={handleChange}
                    className={styles.radioInput}
                  />
                  <span className={styles.radioLabel}>Phone</span>
                </label>
                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="preferredContact"
                    value="whatsapp"
                    checked={formData.preferredContact === 'whatsapp'}
                    onChange={handleChange}
                    className={styles.radioInput}
                  />
                  <span className={styles.radioLabel}>WhatsApp</span>
                </label>
              </div>
            </div>

            {/* Message */}
            <div className={styles.formGroup}>
              <label htmlFor="message" className={styles.formLabel}>
                Additional Requirements <span className={styles.required}>*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                onBlur={() => handleBlur('message')}
                className={`${styles.formTextarea} ${touchedFields.message && errors.message ? styles.error : ''}`}
                placeholder="Please describe your specific requirements, preferred amenities, or any other details..."
                rows="4"
              />
              {touchedFields.message && errors.message && (
                <span className={styles.errorMessage}>{errors.message}</span>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className={styles.submitError}>
                {errors.submit}
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              className={`${styles.submitButton} ${isSubmitting ? styles.loading : ''}`}
              disabled={isSubmitting}
            >
              <span className={styles.buttonText}>
                {isSubmitting ? 'Submitting...' : 'Submit Requirement'}
              </span>
              {isSubmitting && (
                <div className={styles.buttonLoader}>
                  <div className={styles.loader} />
                </div>
              )}
            </button>

            {/* Privacy Note */}
            <p className={styles.privacyNote}>
              By submitting this form, you agree to our terms of service and privacy policy. 
              We respect your privacy and will never share your information with third parties.
            </p>
          </form>
        </div>
      </div>

      {/* Success Message */}
      <div className={`${styles.successMessage} ${showSuccess ? styles.show : ''}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        <div>
          <h4>Success!</h4>
          <p>Your requirement has been submitted. Ticket #{formData.ticketNumber}</p>
        </div>
      </div>
    </section>
  );
};

export default Contact;

