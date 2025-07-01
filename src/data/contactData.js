/**
 * Contact Data Configuration for DGrealtors
 * Comprehensive contact information, forms, and communication channels
 */

// Contact types
export const CONTACT_TYPES = {
  GENERAL_INQUIRY: 'general-inquiry',
  PROPERTY_INQUIRY: 'property-inquiry',
  SCHEDULE_VISIT: 'schedule-visit',
  CALLBACK_REQUEST: 'callback-request',
  PARTNERSHIP: 'partnership',
  COMPLAINT: 'complaint',
  CAREERS: 'careers',
  MEDIA: 'media'
};

// Department types
export const DEPARTMENTS = {
  SALES: 'sales',
  LEASING: 'leasing',
  SUPPORT: 'support',
  MANAGEMENT: 'management',
  ACCOUNTS: 'accounts',
  HR: 'hr',
  MARKETING: 'marketing'
};

// Main contact information
export const contactInfo = {
  // Primary contact details
  primary: {
    phone: {
      number: '+91 98765 43210',
      display: '98765 43210',
      countryCode: '+91',
      available: true,
      timings: 'Mon-Sat: 9:00 AM - 7:00 PM',
      type: 'mobile',
      whatsapp: true,
      verified: true
    },
    email: {
      address: 'info@dgrealtors.com',
      type: 'primary',
      responseTime: '2-4 hours',
      verified: true
    }
  },

  // Secondary contact options
  secondary: {
    phone: {
      number: '+91 98765 43211',
      display: '98765 43211',
      countryCode: '+91',
      available: true,
      timings: 'Mon-Sat: 9:00 AM - 7:00 PM',
      type: 'mobile'
    },
    landline: {
      number: '+91 20 2645 7890',
      display: '020-2645 7890',
      countryCode: '+91',
      stdCode: '020',
      available: true,
      timings: 'Mon-Sat: 9:00 AM - 6:00 PM',
      type: 'landline'
    }
  },

  // Department-specific contacts
  departments: [
    {
      id: DEPARTMENTS.SALES,
      name: 'Sales Department',
      description: 'For new property inquiries and sales',
      email: 'sales@dgrealtors.com',
      phone: '+91 98765 43212',
      whatsapp: '+91 98765 43212',
      head: {
        name: 'Rajesh Kumar',
        designation: 'Sales Head',
        email: 'rajesh@dgrealtors.com',
        linkedin: 'https://linkedin.com/in/rajeshkumar'
      },
      responseTime: '1-2 hours',
      icon: '💼'
    },
    {
      id: DEPARTMENTS.LEASING,
      name: 'Leasing Department',
      description: 'For property leasing and rentals',
      email: 'leasing@dgrealtors.com',
      phone: '+91 98765 43213',
      whatsapp: '+91 98765 43213',
      head: {
        name: 'Priya Sharma',
        designation: 'Leasing Manager',
        email: 'priya@dgrealtors.com'
      },
      responseTime: '2-3 hours',
      icon: '📋'
    },
    {
      id: DEPARTMENTS.SUPPORT,
      name: 'Customer Support',
      description: 'For existing client support and queries',
      email: 'support@dgrealtors.com',
      phone: '+91 98765 43214',
      whatsapp: '+91 98765 43214',
      responseTime: '30 minutes',
      available24x7: false,
      icon: '🎧'
    },
    {
      id: DEPARTMENTS.MANAGEMENT,
      name: 'Management',
      description: 'For partnership and business queries',
      email: 'management@dgrealtors.com',
      phone: '+91 98765 43215',
      appointmentRequired: true,
      icon: '👔'
    }
  ],

  // Office locations
  offices: [
    {
      id: 'head-office',
      type: 'Head Office',
      name: 'DGrealtors Wakad',
      address: {
        line1: 'Shop No 11, T S Complex',
        line2: 'Shop Siddhi Enclave CHS Ltd',
        street: 'Datta Mandir Road',
        landmark: 'Near Datta Mandir',
        area: 'Wakad',
        city: 'Pune',
        state: 'Maharashtra',
        country: 'India',
        pincode: '411057'
      },
      coordinates: {
        latitude: 18.5912716,
        longitude: 73.7610976,
        plusCode: 'HMQW+FF Wakad',
        what3words: 'example.three.words'
      },
      googleMapsUrl: 'https://goo.gl/maps/dgrealtors-wakad',
      directions: {
        fromAirport: '18 km via Airport Road and Mumbai-Pune Expressway (30 mins)',
        fromRailway: '15 km via University Road (25 mins)',
        fromBusStand: '16 km via Pune-Mumbai Highway (28 mins)',
        parking: 'Available (Free for visitors)',
        publicTransport: ['PMPML Bus Routes: 45, 46, 47', 'Auto/Cab readily available']
      },
      timings: {
        monday: '9:00 AM - 7:00 PM',
        tuesday: '9:00 AM - 7:00 PM',
        wednesday: '9:00 AM - 7:00 PM',
        thursday: '9:00 AM - 7:00 PM',
        friday: '9:00 AM - 7:00 PM',
        saturday: '9:00 AM - 7:00 PM',
        sunday: 'By Appointment Only',
        holidays: 'Closed (Emergency support available)'
      },
      facilities: [
        'Client Meeting Rooms',
        'Parking Space',
        'Wheelchair Accessible',
        'Waiting Lounge',
        'Refreshments',
        'Wi-Fi Available'
      ],
      images: [
        '/images/office/wakad-exterior.jpg',
        '/images/office/wakad-interior.jpg',
        '/images/office/wakad-meeting-room.jpg'
      ],
      virtualTour: '/virtual-tour/wakad-office',
      isPrimary: true
    },
    {
      id: 'branch-hinjewadi',
      type: 'Branch Office',
      name: 'DGrealtors Hinjewadi',
      address: {
        line1: 'Coming Soon',
        area: 'Hinjewadi Phase 1',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411057'
      },
      status: 'Coming Soon',
      expectedOpening: 'Q2 2024',
      isPrimary: false
    }
  ],

  // Emergency contacts
  emergency: {
    available: true,
    number: '+91 98765 43219',
    timings: '24x7 for existing clients',
    conditions: 'For urgent property matters only'
  },

  // Social media contacts
  social: {
    whatsapp: {
      number: '+919876543210',
      displayNumber: '+91 98765 43210',
      businessAccount: true,
      qrCode: '/images/contact/whatsapp-qr.png',
      directLink: 'https://wa.me/919876543210',
      prefilledMessage: 'Hi, I am interested in commercial properties in Pune.',
      features: ['Quick Response', 'Property Sharing', 'Location Sharing', 'Document Sharing']
    },
    facebook: {
      url: 'https://facebook.com/dgrealtors',
      messenger: 'https://m.me/dgrealtors',
      pageId: '123456789',
      responseTime: 'Typically replies within an hour',
      verified: true
    },
    instagram: {
      url: 'https://instagram.com/dgrealtors',
      handle: '@dgrealtors',
      dmEnabled: true
    },
    linkedin: {
      company: 'https://linkedin.com/company/dgrealtors',
      ceo: 'https://linkedin.com/in/dgrealtors-ceo',
      employees: 'https://linkedin.com/company/dgrealtors/people'
    },
    twitter: {
      url: 'https://twitter.com/dgrealtors',
      handle: '@dgrealtors',
      dmOpen: true
    },
    youtube: {
      channel: 'https://youtube.com/c/dgrealtors',
      subscribe: 'https://youtube.com/c/dgrealtors?sub_confirmation=1'
    }
  }
};

// Contact form configurations
export const contactForms = {
  generalInquiry: {
    id: 'general-inquiry',
    title: 'General Inquiry',
    description: 'Get in touch with us for any queries',
    fields: [
      {
        name: 'name',
        label: 'Full Name',
        type: 'text',
        required: true,
        validation: {
          minLength: 2,
          maxLength: 50,
          pattern: /^[a-zA-Z\s'-]+$/,
          message: 'Please enter a valid name'
        },
        placeholder: 'Enter your full name',
        icon: '👤'
      },
      {
        name: 'email',
        label: 'Email Address',
        type: 'email',
        required: true,
        validation: {
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          allowedDomains: ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'],
          message: 'Please enter a valid email address'
        },
        placeholder: 'your.email@gmail.com',
        icon: '📧'
      },
      {
        name: 'phone',
        label: 'Mobile Number',
        type: 'tel',
        required: true,
        validation: {
          pattern: /^[6-9]\d{9}$/,
          message: 'Please enter a valid 10-digit mobile number'
        },
        placeholder: '98765 43210',
        prefix: '+91',
        icon: '📱'
      },
      {
        name: 'subject',
        label: 'Subject',
        type: 'text',
        required: true,
        validation: {
          minLength: 5,
          maxLength: 100
        },
        placeholder: 'Brief subject of your inquiry',
        icon: '📝'
      },
      {
        name: 'message',
        label: 'Message',
        type: 'textarea',
        required: true,
        validation: {
          minLength: 20,
          maxLength: 500
        },
        placeholder: 'Please describe your requirements...',
        rows: 5,
        icon: '💬'
      },
      {
        name: 'preferredContact',
        label: 'Preferred Contact Method',
        type: 'radio',
        required: false,
        options: [
          { value: 'email', label: 'Email', icon: '📧' },
          { value: 'phone', label: 'Phone', icon: '📞' },
          { value: 'whatsapp', label: 'WhatsApp', icon: '💬' }
        ],
        default: 'phone'
      }
    ],
    submitButton: {
      text: 'Send Message',
      loadingText: 'Sending...',
      successText: 'Message Sent!'
    },
    successMessage: 'Thank you for contacting us! We\'ll get back to you within 2-4 hours.',
    trackingEvent: 'general_inquiry_form_submit'
  },

  propertyInquiry: {
    id: 'property-inquiry',
    title: 'Property Inquiry',
    description: 'Inquire about a specific property',
    fields: [
      // Basic fields (name, email, phone) - same as above
      {
        name: 'propertyType',
        label: 'Property Type',
        type: 'select',
        required: true,
        options: [
          { value: 'office', label: 'Office Space' },
          { value: 'retail', label: 'Retail Shop' },
          { value: 'warehouse', label: 'Warehouse' },
          { value: 'showroom', label: 'Showroom' },
          { value: 'coworking', label: 'Co-working Space' },
          { value: 'industrial', label: 'Industrial Space' }
        ],
        icon: '🏢'
      },
      {
        name: 'location',
        label: 'Preferred Location',
        type: 'multiselect',
        required: true,
        options: [
          { value: 'wakad', label: 'Wakad' },
          { value: 'hinjewadi', label: 'Hinjewadi' },
          { value: 'baner', label: 'Baner' },
          { value: 'aundh', label: 'Aundh' },
          { value: 'kothrud', label: 'Kothrud' },
          { value: 'pcmc', label: 'Pimpri-Chinchwad' }
        ],
        max: 3,
        placeholder: 'Select up to 3 locations',
        icon: '📍'
      },
      {
        name: 'budget',
        label: 'Budget Range (per month)',
        type: 'range',
        required: false,
        min: 10000,
        max: 500000,
        step: 5000,
        default: 50000,
        format: 'currency',
        icon: '💰'
      },
      {
        name: 'size',
        label: 'Required Size (sq.ft)',
        type: 'number',
        required: false,
        min: 100,
        max: 100000,
        placeholder: 'e.g., 2000',
        icon: '📏'
      },
      {
        name: 'moveInDate',
        label: 'Expected Move-in Date',
        type: 'date',
        required: false,
        min: 'today',
        max: '+6months',
        icon: '📅'
      }
    ],
    conditionalFields: {
      office: [
        {
          name: 'workstations',
          label: 'Number of Workstations',
          type: 'number',
          min: 1,
          max: 1000
        }
      ],
      retail: [
        {
          name: 'frontage',
          label: 'Required Frontage',
          type: 'select',
          options: [
            { value: 'main-road', label: 'Main Road Facing' },
            { value: 'mall', label: 'Inside Mall' },
            { value: 'high-street', label: 'High Street' }
          ]
        }
      ]
    },
    trackingEvent: 'property_inquiry_form_submit'
  },

  scheduleVisit: {
    id: 'schedule-visit',
    title: 'Schedule Site Visit',
    description: 'Book a property viewing appointment',
    fields: [
      // Basic fields
      {
        name: 'visitDate',
        label: 'Preferred Visit Date',
        type: 'date',
        required: true,
        min: 'tomorrow',
        max: '+30days',
        excludeDays: [0], // Exclude Sundays
        icon: '📅'
      },
      {
        name: 'visitTime',
        label: 'Preferred Time Slot',
        type: 'select',
        required: true,
        options: [
          { value: '10-12', label: '10:00 AM - 12:00 PM', available: true },
          { value: '12-14', label: '12:00 PM - 2:00 PM', available: true },
          { value: '14-16', label: '2:00 PM - 4:00 PM', available: true },
          { value: '16-18', label: '4:00 PM - 6:00 PM', available: true },
          { value: '18-19', label: '6:00 PM - 7:00 PM', available: false }
        ],
        icon: '⏰'
      },
      {
        name: 'properties',
        label: 'Properties to Visit',
        type: 'text',
        required: true,
        placeholder: 'Property IDs or names',
        helpText: 'You can visit up to 3 properties in one session',
        icon: '🏢'
      },
      {
        name: 'visitors',
        label: 'Number of Visitors',
        type: 'number',
        required: true,
        min: 1,
        max: 5,
        default: 1,
        icon: '👥'
      },
      {
        name: 'specialRequirements',
        label: 'Special Requirements',
        type: 'textarea',
        required: false,
        placeholder: 'Any special requirements or questions?',
        rows: 3
      }
    ],
    confirmation: {
      sendEmail: true,
      sendSMS: true,
      sendWhatsApp: true,
      calendarInvite: true
    },
    trackingEvent: 'schedule_visit_form_submit'
  },

  callbackRequest: {
    id: 'callback-request',
    title: 'Request a Callback',
    description: 'We\'ll call you back at your preferred time',
    minimal: true,
    fields: [
      {
        name: 'name',
        label: 'Your Name',
        type: 'text',
        required: true,
        placeholder: 'Enter your name',
        icon: '👤'
      },
      {
        name: 'phone',
        label: 'Mobile Number',
        type: 'tel',
        required: true,
        validation: {
          pattern: /^[6-9]\d{9}$/
        },
        placeholder: '98765 43210',
        prefix: '+91',
        icon: '📱'
      },
      {
        name: 'callbackTime',
        label: 'Preferred Callback Time',
        type: 'select',
        required: true,
        options: [
          { value: 'asap', label: 'As Soon As Possible' },
          { value: 'morning', label: 'Morning (9 AM - 12 PM)' },
          { value: 'afternoon', label: 'Afternoon (12 PM - 4 PM)' },
          { value: 'evening', label: 'Evening (4 PM - 7 PM)' }
        ],
        default: 'asap',
        icon: '⏰'
      },
      {
        name: 'topic',
        label: 'Call Regarding',
        type: 'select',
        required: false,
        options: [
          { value: 'property-inquiry', label: 'Property Inquiry' },
          { value: 'site-visit', label: 'Site Visit' },
          { value: 'documentation', label: 'Documentation' },
          { value: 'other', label: 'Other' }
        ],
        icon: '💬'
      }
    ],
    submitButton: {
      text: 'Request Callback',
      fullWidth: true
    },
    estimatedResponseTime: '15 minutes',
    trackingEvent: 'callback_request_form_submit'
  }
};

// Quick contact options
export const quickContactOptions = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: '💬',
    color: '#25D366',
    action: 'whatsapp',
    value: contactInfo.social.whatsapp.directLink,
    available: true,
    popular: true,
    description: 'Quick response guaranteed'
  },
  {
    id: 'call',
    label: 'Call Now',
    icon: '📞',
    color: '#007AFF',
    action: 'tel',
    value: `tel:${contactInfo.primary.phone.number}`,
    available: true,
    popular: true,
    description: contactInfo.primary.phone.timings
  },
  {
    id: 'email',
    label: 'Email Us',
    icon: '📧',
    color: '#EA4335',
    action: 'mailto',
    value: `mailto:${contactInfo.primary.email.address}`,
    available: true,
    description: contactInfo.primary.email.responseTime
  },
  {
    id: 'callback',
    label: 'Request Callback',
    icon: '🔄',
    color: '#FF6B6B',
    action: 'form',
    value: 'callback-request',
    available: true,
    description: 'We\'ll call you back'
  },
  {
    id: 'visit',
    label: 'Visit Office',
    icon: '🏢',
    color: '#4ECDC4',
    action: 'maps',
    value: contactInfo.offices[0].googleMapsUrl,
    available: true,
    description: 'Meet us in person'
  },
  {
    id: 'video-call',
    label: 'Video Call',
    icon: '📹',
    color: '#6366F1',
    action: 'calendly',
    value: 'https://calendly.com/dgrealtors',
    available: false,
    comingSoon: true,
    description: 'Schedule video consultation'
  }
];

// Contact preferences
export const contactPreferences = {
  languages: [
    { code: 'en', name: 'English', native: 'English', available: true },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी', available: true },
    { code: 'mr', name: 'Marathi', native: 'मराठी', available: true }
  ],
  
  responseCommitments: {
    phone: {
      businessHours: '< 5 minutes',
      afterHours: '< 30 minutes',
      holidays: 'Next business day'
    },
    email: {
      businessHours: '2-4 hours',
      afterHours: 'Next business day',
      holidays: 'Next business day'
    },
    whatsapp: {
      businessHours: '< 15 minutes',
      afterHours: '< 1 hour',
      holidays: '< 2 hours'
    },
    form: {
      general: '4-6 hours',
      urgent: '1-2 hours',
      partnership: '24 hours'
    }
  },

  escalationMatrix: [
    {
      level: 1,
      time: '4 hours',
      contact: 'Department Head',
      method: 'Email + Phone'
    },
    {
      level: 2,
      time: '8 hours',
      contact: 'Operations Manager',
      method: 'Phone + WhatsApp'
    },
    {
      level: 3,
      time: '24 hours',
      contact: 'CEO',
      method: 'Direct Phone'
    }
  ]
};

// Contact page sections
export const contactPageSections = {
  hero: {
    title: 'Get in Touch',
    subtitle: 'We\'re here to help you find the perfect commercial space',
    backgroundImage: '/images/contact/hero-bg.jpg',
    cta: 'Contact Us Now'
  },

  whyContactUs: [
    {
      icon: '⚡',
      title: 'Quick Response',
      description: 'Average response time under 2 hours'
    },
    {
      icon: '🏆',
      title: 'Expert Guidance',
      description: '14+ years of market expertise'
    },
    {
      icon: '🌟',
      title: 'Personalized Service',
      description: 'Dedicated relationship manager'
    },
    {
      icon: '📍',
      title: 'Local Knowledge',
      description: 'In-depth area expertise'
    }
  ],

  testimonial: {
    text: 'DGrealtors made our property search effortless. Their prompt response and professional approach exceeded our expectations.',
    author: 'Amit Sharma',
    company: 'Tech Solutions Pvt Ltd',
    image: '/images/testimonials/amit-sharma.jpg'
  },

  faq: [
    {
      question: 'What are your working hours?',
      answer: 'We are open Monday to Saturday, 9:00 AM to 7:00 PM. Sunday visits by appointment only.'
    },
    {
      question: 'How quickly can you arrange a site visit?',
      answer: 'We can typically arrange site visits within 24 hours of request, subject to property availability.'
    },
    {
      question: 'Do you charge for consultations?',
      answer: 'No, our initial consultations and property search services are completely free.'
    },
    {
      question: 'Can I contact you after business hours?',
      answer: 'Yes, you can reach us on WhatsApp or leave a callback request. For emergencies, existing clients can use our emergency helpline.'
    }
  ]
};

// Contact utilities
export const contactUtils = {
  // Format phone number
  formatPhoneNumber: (number) => {
    const cleaned = number.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }
    if (cleaned.length === 12 && cleaned.startsWith('91')) {
      return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
    }
    return number;
  },

  // Get current availability
  getCurrentAvailability: () => {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    const minute = now.getMinutes();

    // Check if Sunday (0) or Holiday
    if (day === 0) {
      return {
        isOpen: false,
        message: 'Closed - Sunday (Appointments only)',
        nextOpenTime: 'Monday 9:00 AM'
      };
    }

    // Check if within business hours (9 AM - 7 PM)
    if (hour >= 9 && hour < 19) {
      return {
        isOpen: true,
        message: 'Open Now',
        closingTime: '7:00 PM'
      };
    }

    // Outside business hours
    return {
      isOpen: false,
      message: hour < 9 ? 'Opens at 9:00 AM' : 'Closed',
      nextOpenTime: hour < 9 ? '9:00 AM Today' : '9:00 AM Tomorrow'
    };
  },

  // Get best contact method based on time
  getBestContactMethod: () => {
    const availability = contactUtils.getCurrentAvailability();
    
    if (availability.isOpen) {
      return {
        method: 'phone',
        reason: 'Call now for immediate assistance',
        action: quickContactOptions.find(opt => opt.id === 'call')
      };
    } else {
      return {
        method: 'whatsapp',
        reason: 'Message us on WhatsApp for quick response',
        action: quickContactOptions.find(opt => opt.id === 'whatsapp')
      };
    }
  },

  // Validate contact form
  validateContactForm: (formData, formType) => {
    const form = contactForms[formType];
    if (!form) return { isValid: false, errors: ['Invalid form type'] };

    const errors = {};
    
    form.fields.forEach(field => {
      const value = formData[field.name];
      
      // Check required
      if (field.required && !value) {
        errors[field.name] = `${field.label} is required`;
        return;
      }

      // Check validation rules
      if (value && field.validation) {
        if (field.validation.minLength && value.length < field.validation.minLength) {
          errors[field.name] = `${field.label} must be at least ${field.validation.minLength} characters`;
        }
        if (field.validation.maxLength && value.length > field.validation.maxLength) {
          errors[field.name] = `${field.label} must not exceed ${field.validation.maxLength} characters`;
        }
        if (field.validation.pattern && !field.validation.pattern.test(value)) {
          errors[field.name] = field.validation.message || `Invalid ${field.label}`;
        }
      }
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};

// Export all data
export default {
  contactInfo,
  contactForms,
  quickContactOptions,
  contactPreferences,
  contactPageSections,
  contactUtils,
  CONTACT_TYPES,
  DEPARTMENTS
};
