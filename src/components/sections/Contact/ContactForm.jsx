import React, { useState, useRef, useEffect } from 'react';
import styles from './ContactForm.module.css';

const ContactForm = ({ onSubmitSuccess, initialData = {} }) => {
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
    name: initialData.name || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    company: initialData.company || '',
    propertyTypes: initialData.propertyTypes || [],
    budget: initialData.budget || 50000,
    location: initialData.location || '',
    message: initialData.message || '',
    preferredContact: initialData.preferredContact || 'email',
    timeframe: initialData.timeframe || '',
    propertySize: initialData.propertySize || '',
    parkingRequired: initialData.parkingRequired || false,
    amenities: initialData.amenities || [],
    referralSource: initialData.referralSource || '',
    newsletter: initialData.newsletter || false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [characterCount, setCharacterCount] = useState(0);
  const [formProgress, setFormProgress] = useState(0);

  // Refs
  const formRef = useRef(null);
  const locationInputRef = useRef(null);
  const messageTextareaRef = useRef(null);

  // Constants
  const totalSteps = 3;
  const maxMessageLength = 500;

  const propertyTypes = [
    { value: 'office', label: 'Office Space', icon: '🏢' },
    { value: 'retail', label: 'Retail Shop', icon: '🏪' },
    { value: 'warehouse', label: 'Warehouse', icon: '🏭' },
    { value: 'showroom', label: 'Showroom', icon: '🏛️' },
    { value: 'coworking', label: 'Co-working', icon: '👥' },
    { value: 'industrial', label: 'Industrial', icon: '⚙️' }
  ];

  const timeframes = [
    'Immediate',
    'Within 1 Month',
    '1-3 Months',
    '3-6 Months',
    'Just Exploring'
  ];

  const amenities = [
    'Parking',
    'Cafeteria',
    'Security',
    'Power Backup',
    'Elevator',
    'AC',
    'Conference Room',
    'Reception'
  ];

  const referralSources = [
    'Google Search',
    'Social Media',
    'Friend/Colleague',
    'Previous Client',
    'Advertisement',
    'Other'
  ];

  const popularLocations = [
    'Wakad',
    'Hinjewadi',
    'Baner',
    'Aundh',
    'Kothrud',
    'Karve Nagar',
    'Shivaji Nagar',
    'Deccan',
    'Pimpri-Chinchwad',
    'Viman Nagar'
  ];

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    
    const domain = email.split('@')[1]?.toLowerCase();
    const allowedDomains = ['gmail.com', 'yahoo.com', 'yahoo.in', 'yahoo.co.in', 'outlook.com', 'hotmail.com'];
    
    if (!allowedDomains.includes(domain)) {
      return 'Please use Gmail, Yahoo, Outlook, or Hotmail email address';
    }
    
    return '';
  };

  // Phone validation
  const validatePhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      return 'Please enter a valid 10-digit Indian mobile number';
    }
    return '';
  };

  // Company validation
  const validateCompany = (company) => {
    if (company && company.length < 2) {
      return 'Company name must be at least 2 characters';
    }
    return '';
  };

  // Format phone number as user types
  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{5})(\d{5})$/);
    if (match) {
      return `${match[1]} ${match[2]}`;
    }
    return cleaned;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox' && name === 'amenities') {
      setFormData(prev => ({
        ...prev,
        amenities: checked 
          ? [...prev.amenities, value]
          : prev.amenities.filter(amenity => amenity !== value)
      }));
    } else if (type === 'checkbox' && name === 'propertyTypes') {
      setFormData(prev => ({
        ...prev,
        propertyTypes: checked 
          ? [...prev.propertyTypes, value]
          : prev.propertyTypes.filter(type => type !== value)
      }));
    } else if (name === 'phone') {
      const formatted = formatPhoneNumber(value);
      if (formatted.length <= 11) { // 10 digits + 1 space
        setFormData(prev => ({
          ...prev,
          [name]: formatted
        }));
      }
    } else if (name === 'message') {
      if (value.length <= maxMessageLength) {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
        setCharacterCount(value.length);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Update form progress
    updateFormProgress();
  };

  // Handle location input
  const handleLocationInput = (e) => {
    const value = e.target.value;
    handleChange(e);

    // Filter suggestions
    if (value.length > 0) {
      const filtered = popularLocations.filter(location =>
        location.toLowerCase().includes(value.toLowerCase())
      );
      setLocationSuggestions(filtered);
      setShowLocationSuggestions(true);
    } else {
      setShowLocationSuggestions(false);
    }
  };

  // Select location from suggestions
  const selectLocation = (location) => {
    setFormData(prev => ({
      ...prev,
      location: location
    }));
    setShowLocationSuggestions(false);
    locationInputRef.current?.focus();
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
      case 'company':
        error = validateCompany(formData.company);
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
        } else if (formData.message.trim().length < 20) {
          error = 'Message must be at least 20 characters';
        }
        break;
      case 'timeframe':
        if (!formData.timeframe) {
          error = 'Please select a timeframe';
        }
        break;
      case 'propertySize':
        if (!formData.propertySize.trim()) {
          error = 'Please specify the required size';
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

  // Validate current step
  const validateStep = (step) => {
    let stepFields = [];
    
    switch (step) {
      case 1:
        stepFields = ['name', 'email', 'phone', 'company'];
        break;
      case 2:
        stepFields = ['propertyTypes', 'location', 'timeframe', 'propertySize'];
        break;
      case 3:
        stepFields = ['message'];
        break;
      default:
        break;
    }
    
    let isValid = true;
    stepFields.forEach(field => {
      if (!validateField(field)) {
        isValid = false;
      }
      setTouchedFields(prev => ({
        ...prev,
        [field]: true
      }));
    });
    
    return isValid;
  };

  // Update form progress
  const updateFormProgress = () => {
    const totalFields = Object.keys(formData).length - 3; // Exclude ticketNumber, newsletter, referralSource
    const filledFields = Object.entries(formData).filter(([key, value]) => {
      if (key === 'ticketNumber' || key === 'newsletter' || key === 'referralSource') return false;
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'boolean') return true;
      return value.toString().trim().length > 0;
    }).length;
    
    const progress = (filledFields / totalFields) * 100;
    setFormProgress(progress);
  };

  // Navigate between steps
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
      window.scrollTo({ top: formRef.current?.offsetTop - 100, behavior: 'smooth' });
    } else {
      // Shake animation on error
      formRef.current?.classList.add(styles.shake);
      setTimeout(() => {
        formRef.current?.classList.remove(styles.shake);
      }, 500);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: formRef.current?.offsetTop - 100, behavior: 'smooth' });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Format data for submission
      const submissionData = {
        ...formData,
        phone: formData.phone.replace(/\s/g, ''),
        submittedAt: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer
      };
      
      console.log('Form submitted:', submissionData);
      
      // Call parent callback
      if (onSubmitSuccess) {
        onSubmitSuccess(submissionData);
      }
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          ticketNumber: generateTicketNumber(),
          name: '',
          email: '',
          phone: '',
          company: '',
          propertyTypes: [],
          budget: 50000,
          location: '',
          message: '',
          preferredContact: 'email',
          timeframe: '',
          propertySize: '',
          parkingRequired: false,
          amenities: [],
          referralSource: '',
          newsletter: false
        });
        setTouchedFields({});
        setErrors({});
        setCurrentStep(1);
        setFormProgress(0);
        setCharacterCount(0);
      }, 1000);
      
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

  // Format property size
  const formatPropertySize = (size) => {
    return size.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && e.ctrlKey) {
        handleSubmit(e);
      } else if (e.key === 'Escape' && showLocationSuggestions) {
        setShowLocationSuggestions(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showLocationSuggestions]);

  // Update progress on mount
  useEffect(() => {
    updateFormProgress();
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('dgrealtors_form_draft', JSON.stringify(formData));
    }, 1000);

    return () => clearTimeout(timer);
  }, [formData]);

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('dgrealtors_form_draft');
    if (draft && !initialData.name) {
      try {
        const parsedDraft = JSON.parse(draft);
        setFormData(prev => ({
          ...prev,
          ...parsedDraft,
          ticketNumber: generateTicketNumber() // Generate new ticket number
        }));
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, []);

  return (
    <div className={styles.formContainer} ref={formRef}>
      {/* Progress Bar */}
      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill} 
          style={{ width: `${formProgress}%` }}
        />
        <div className={styles.stepIndicators}>
          {[1, 2, 3].map(step => (
            <div 
              key={step}
              className={`${styles.stepIndicator} ${
                step === currentStep ? styles.active : ''
              } ${step < currentStep ? styles.completed : ''}`}
              onClick={() => step <= currentStep && setCurrentStep(step)}
            >
              {step < currentStep ? '✓' : step}
            </div>
          ))}
        </div>
      </div>

      {/* Form Header */}
      <div className={styles.formHeader}>
        <span className={styles.ticketNumber}>
          Ticket #{formData.ticketNumber}
        </span>
        <h2 className={styles.formTitle}>Submit Your Requirement</h2>
        <p className={styles.formSubtitle}>
          Step {currentStep} of {totalSteps}: {
            currentStep === 1 ? 'Contact Information' :
            currentStep === 2 ? 'Property Details' :
            'Additional Information'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Step 1: Contact Information */}
        {currentStep === 1 && (
          <div className={styles.formStep}>
            {/* Name Field */}
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.formLabel}>
                Full Name <span className={styles.required}>*</span>
              </label>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={() => handleBlur('name')}
                  className={`${styles.formInput} ${
                    touchedFields.name && errors.name ? styles.error : ''
                  }`}
                  placeholder="Enter your full name"
                  autoComplete="name"
                />
                <div className={styles.inputIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              </div>
              {touchedFields.name && errors.name && (
                <span className={styles.errorMessage}>{errors.name}</span>
              )}
            </div>

            {/* Email Field */}
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.formLabel}>
                Email Address <span className={styles.required}>*</span>
                <span className={styles.fieldHint}>(Gmail/Yahoo/Outlook)</span>
              </label>
              <div className={styles.inputWrapper}>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur('email')}
                  className={`${styles.formInput} ${
                    touchedFields.email && errors.email ? styles.error : ''
                  }`}
                  placeholder="your.email@gmail.com"
                  autoComplete="email"
                />
                <div className={styles.inputIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-10 5L2 7" />
                  </svg>
                </div>
              </div>
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
                <div className={styles.inputWrapper}>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={() => handleBlur('phone')}
                    className={`${styles.formInput} ${
                      touchedFields.phone && errors.phone ? styles.error : ''
                    }`}
                    placeholder="98765 43210"
                    autoComplete="tel"
                  />
                  <div className={styles.inputIcon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72" />
                    </svg>
                  </div>
                </div>
              </div>
              {touchedFields.phone && errors.phone && (
                <span className={styles.errorMessage}>{errors.phone}</span>
              )}
            </div>

            {/* Company Field */}
            <div className={styles.formGroup}>
              <label htmlFor="company" className={styles.formLabel}>
                Company Name <span className={styles.optional}>(Optional)</span>
              </label>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  onBlur={() => handleBlur('company')}
                  className={`${styles.formInput} ${
                    touchedFields.company && errors.company ? styles.error : ''
                  }`}
                  placeholder="Your company name"
                  autoComplete="organization"
                />
                <div className={styles.inputIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 21h18" />
                    <path d="M5 21V7l8-4v18" />
                    <path d="M19 21V11l-6-4" />
                    <rect x="9" y="9" width="4" height="4" />
                    <rect x="9" y="14" width="4" height="4" />
                  </svg>
                </div>
              </div>
              {touchedFields.company && errors.company && (
                <span className={styles.errorMessage}>{errors.company}</span>
              )}
            </div>

            {/* Preferred Contact Method */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Preferred Contact Method</label>
              <div className={styles.radioGroup}>
                {['email', 'phone', 'whatsapp'].map(method => (
                  <label key={method} className={styles.radioOption}>
                    <input
                      type="radio"
                      name="preferredContact"
                      value={method}
                      checked={formData.preferredContact === method}
                      onChange={handleChange}
                      className={styles.radioInput}
                    />
                    <span className={styles.radioLabel}>
                      {method.charAt(0).toUpperCase() + method.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Property Details */}
        {currentStep === 2 && (
          <div className={styles.formStep}>
            {/* Property Types */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Property Type <span className={styles.required}>*</span>
              </label>
              <div className={styles.propertyTypes}>
                {propertyTypes.map(type => (
                  <label key={type.value} className={styles.propertyTypeOption}>
                    <input
                      type="checkbox"
                      name="propertyTypes"
                      value={type.value}
                      checked={formData.propertyTypes.includes(type.value)}
                      onChange={handleChange}
                      className={styles.propertyTypeCheckbox}
                    />
                    <span className={styles.propertyTypeLabel}>
                      <span className={styles.propertyIcon}>{type.icon}</span>
                      <span>{type.label}</span>
                      <span className={styles.checkmark}>✓</span>
                    </span>
                  </label>
                ))}
              </div>
              {touchedFields.propertyTypes && errors.propertyTypes && (
                <span className={styles.errorMessage}>{errors.propertyTypes}</span>
              )}
            </div>

            {/* Location with Autocomplete */}
            <div className={styles.formGroup}>
              <label htmlFor="location" className={styles.formLabel}>
                Preferred Location/Area <span className={styles.required}>*</span>
              </label>
              <div className={styles.inputWrapper}>
                <input
                  ref={locationInputRef}
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleLocationInput}
                  onBlur={() => {
                    handleBlur('location');
                    setTimeout(() => setShowLocationSuggestions(false), 200);
                  }}
                  onFocus={() => formData.location && setShowLocationSuggestions(true)}
                  className={`${styles.formInput} ${
                    touchedFields.location && errors.location ? styles.error : ''
                  }`}
                  placeholder="e.g., Wakad, Hinjewadi, Baner"
                  autoComplete="off"
                />
                <div className={styles.inputIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                {showLocationSuggestions && locationSuggestions.length > 0 && (
                  <div className={styles.autocompleteDropdown}>
                    {locationSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className={styles.autocompleteItem}
                        onMouseDown={() => selectLocation(suggestion)}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {touchedFields.location && errors.location && (
                <span className={styles.errorMessage}>{errors.location}</span>
              )}
            </div>

            {/* Property Size */}
            <div className={styles.formGroup}>
              <label htmlFor="propertySize" className={styles.formLabel}>
                Required Size (sq.ft.) <span className={styles.required}>*</span>
              </label>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  id="propertySize"
                  name="propertySize"
                  value={formData.propertySize}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    handleChange({
                      target: {
                        name: 'propertySize',
                        value: formatPropertySize(value)
                      }
                    });
                  }}
                  onBlur={() => handleBlur('propertySize')}
                  className={`${styles.formInput} ${
                    touchedFields.propertySize && errors.propertySize ? styles.error : ''
                  }`}
                  placeholder="e.g., 2,000"
                />
                <div className={styles.inputIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" />
                    <line x1="3" y1="9" x2="21" y2="9" />
                    <line x1="9" y1="3" x2="9" y2="21" />
                  </svg>
                </div>
              </div>
              {touchedFields.propertySize && errors.propertySize && (
                <span className={styles.errorMessage}>{errors.propertySize}</span>
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
                <div className={styles.budgetMarks}>
                  <span>10K</span>
                  <span>1L</span>
                  <span>2.5L</span>
                  <span>5L+</span>
                </div>
              </div>
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
                className={`${styles.formInput} ${styles.formSelect} ${
                  touchedFields.timeframe && errors.timeframe ? styles.error : ''
                }`}
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

            {/* Amenities */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Required Amenities <span className={styles.optional}>(Optional)</span>
              </label>
              <div className={styles.amenitiesGrid}>
                {amenities.map(amenity => (
                  <label key={amenity} className={styles.amenityOption}>
                    <input
                      type="checkbox"
                      name="amenities"
                      value={amenity}
                      checked={formData.amenities.includes(amenity)}
                      onChange={handleChange}
                      className={styles.amenityCheckbox}
                    />
                    <span className={styles.amenityLabel}>
                      <span className={styles.amenityCheck}>✓</span>
                      {amenity}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Parking Required */}
            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="parkingRequired"
                  checked={formData.parkingRequired}
                  onChange={handleChange}
                  className={styles.checkbox}
                />
                <span>Parking space required</span>
              </label>
            </div>
          </div>
        )}

        {/* Step 3: Additional Information */}
        {currentStep === 3 && (
          <div className={styles.formStep}>
            {/* Message */}
            <div className={styles.formGroup}>
              <label htmlFor="message" className={styles.formLabel}>
                Additional Requirements <span className={styles.required}>*</span>
              </label>
              <div className={styles.textareaWrapper}>
                <textarea
                  ref={messageTextareaRef}
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={() => handleBlur('message')}
                  className={`${styles.formTextarea} ${
                    touchedFields.message && errors.message ? styles.error : ''
                  }`}
                  placeholder="Please describe your specific requirements, preferred layout, or any other details that will help us find the perfect space for you..."
                  rows="5"
                />
                <div className={styles.characterCount}>
                  <span className={characterCount > maxMessageLength * 0.9 ? styles.warning : ''}>
                    {characterCount}/{maxMessageLength}
                  </span>
                </div>
              </div>
              {touchedFields.message && errors.message && (
                <span className={styles.errorMessage}>{errors.message}</span>
              )}
            </div>

            {/* Referral Source */}
            <div className={styles.formGroup}>
              <label htmlFor="referralSource" className={styles.formLabel}>
                How did you hear about us? <span className={styles.optional}>(Optional)</span>
              </label>
              <select
                id="referralSource"
                name="referralSource"
                value={formData.referralSource}
                onChange={handleChange}
                className={`${styles.formInput} ${styles.formSelect}`}
              >
                <option value="">Select source</option>
                {referralSources.map(source => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
            </div>

            {/* Newsletter Subscription */}
            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="newsletter"
                  checked={formData.newsletter}
                  onChange={handleChange}
                  className={styles.checkbox}
                />
                <span>Subscribe to our newsletter for latest property updates</span>
              </label>
            </div>

            {/* Terms and Privacy */}
            <div className={styles.termsSection}>
              <p className={styles.termsText}>
                By submitting this form, you agree to our{' '}
                <a href="/terms" className={styles.link}>Terms of Service</a> and{' '}
                <a href="/privacy" className={styles.link}>Privacy Policy</a>.
                We respect your privacy and will never share your information with third parties.
              </p>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className={styles.submitError}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {errors.submit}
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className={styles.formNavigation}>
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className={styles.prevButton}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Previous
            </button>
          )}

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              className={styles.nextButton}
            >
              Next
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          ) : (
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
          )}
        </div>
      </form>

      {/* Floating Help Button */}
      <button className={styles.helpButton} aria-label="Need help?">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </button>

      {/* Draft Saved Indicator */}
      {formData.name && (
        <div className={styles.draftIndicator}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg>
          Draft saved
        </div>
      )}
    </div>
  );
};

export default ContactForm;

