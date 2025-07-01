/**
 * Awards Data Configuration for DGrealtors
 * Comprehensive awards, achievements, certifications, and recognition data
 */

// Award categories
export const AWARD_CATEGORIES = {
  INDUSTRY: 'industry',
  CUSTOMER_SERVICE: 'customer-service',
  INNOVATION: 'innovation',
  SUSTAINABILITY: 'sustainability',
  LEADERSHIP: 'leadership',
  CERTIFICATION: 'certification',
  MEMBERSHIP: 'membership',
  MEDIA: 'media-recognition'
};

// Award levels
export const AWARD_LEVELS = {
  INTERNATIONAL: 'international',
  NATIONAL: 'national',
  STATE: 'state',
  CITY: 'city',
  INDUSTRY: 'industry-specific'
};

// Main awards data
export const awardsData = [
  // 2023 Awards
  {
    id: 'best-broker-pune-2023',
    title: 'Best Commercial Real Estate Broker',
    subtitle: 'Excellence in Commercial Property Services',
    year: 2023,
    month: 'December',
    category: AWARD_CATEGORIES.INDUSTRY,
    level: AWARD_LEVELS.CITY,
    organization: {
      name: 'Pune Real Estate Excellence Awards',
      logo: '/images/awards/pune-real-estate-awards.png',
      website: 'https://punerealestate.awards',
      credibility: 'Recognized by CREDAI Pune'
    },
    description: 'Awarded for outstanding performance in commercial real estate brokerage, client satisfaction, and market leadership in Pune.',
    criteria: [
      'Transaction Volume: ₹500+ Crores',
      'Client Satisfaction: 98%',
      'Market Share: Top 5 in Pune',
      'Innovation in Services'
    ],
    achievement: {
      rank: 1,
      totalNominees: 45,
      competingAgainst: ['Major commercial brokers in Pune']
    },
    images: {
      trophy: '/images/awards/2023/best-broker-trophy.jpg',
      ceremony: '/images/awards/2023/best-broker-ceremony.jpg',
      certificate: '/images/awards/2023/best-broker-certificate.jpg',
      team: '/images/awards/2023/best-broker-team.jpg'
    },
    media: {
      pressRelease: '/media/press-release-best-broker-2023.pdf',
      newsArticles: [
        {
          publication: 'Times of India',
          title: 'DGrealtors Wins Best Commercial Broker Award',
          url: 'https://timesofindia.com/dgrealtors-award',
          date: '2023-12-15'
        },
        {
          publication: 'Pune Mirror',
          title: 'Excellence in Real Estate: DGrealtors Leading the Way',
          url: 'https://punemirror.com/dgrealtors-excellence',
          date: '2023-12-16'
        }
      ]
    },
    testimonial: {
      text: 'This recognition validates our commitment to providing exceptional commercial real estate services.',
      by: 'Founder & CEO',
      designation: 'DGrealtors'
    },
    featured: true,
    verified: true
  },

  {
    id: 'customer-excellence-2023',
    title: 'Customer Service Excellence Award',
    subtitle: 'Outstanding Client Satisfaction',
    year: 2023,
    month: 'October',
    category: AWARD_CATEGORIES.CUSTOMER_SERVICE,
    level: AWARD_LEVELS.STATE,
    organization: {
      name: 'Maharashtra Customer Service Forum',
      logo: '/images/awards/mcsf-logo.png',
      website: 'https://mcsf.org',
      credibility: 'Government recognized body'
    },
    description: 'Recognized for maintaining 98%+ customer satisfaction rate and innovative client service approaches.',
    criteria: [
      'Customer Satisfaction Score: 98.5%',
      'Response Time: < 2 hours average',
      'Resolution Rate: 96%',
      'Client Retention: 89%'
    ],
    metrics: {
      totalClientsServed: 1500,
      npsScore: 82,
      googleRating: 4.9,
      repeatClients: 67
    },
    images: {
      trophy: '/images/awards/2023/customer-excellence-trophy.jpg',
      ceremony: '/images/awards/2023/customer-excellence-ceremony.jpg'
    },
    featured: true,
    verified: true
  },

  // 2022 Awards
  {
    id: 'innovation-award-2022',
    title: 'Innovation in Real Estate Technology',
    subtitle: 'Digital Transformation Excellence',
    year: 2022,
    month: 'September',
    category: AWARD_CATEGORIES.INNOVATION,
    level: AWARD_LEVELS.NATIONAL,
    organization: {
      name: 'Indian PropTech Association',
      logo: '/images/awards/proptech-association.png',
      website: 'https://indianproptech.org',
      credibility: 'National industry body'
    },
    description: 'Awarded for implementing innovative digital solutions in commercial real estate services.',
    innovations: [
      'Virtual Property Tours',
      'AI-powered Property Matching',
      'Digital Documentation System',
      'Client Portal & Mobile App'
    ],
    impact: {
      timeSaved: '60% reduction in documentation time',
      clientReach: '3x increase in client engagement',
      efficiency: '40% improvement in deal closure'
    },
    images: {
      trophy: '/images/awards/2022/innovation-trophy.jpg',
      presentation: '/images/awards/2022/innovation-presentation.jpg'
    },
    featured: true,
    verified: true
  },

  {
    id: 'top-performer-2022',
    title: 'Top Commercial Property Consultant',
    subtitle: 'Performance Excellence Award',
    year: 2022,
    month: 'June',
    category: AWARD_CATEGORIES.INDUSTRY,
    level: AWARD_LEVELS.STATE,
    organization: {
      name: 'Commercial Property Forum Maharashtra',
      logo: '/images/awards/cpf-logo.png',
      website: 'https://cpfm.org'
    },
    description: 'Recognized as top performer based on transaction volume, client base, and market presence.',
    achievements: {
      dealsCompleted: 156,
      totalArea: '2.5 Million sq.ft',
      transactionValue: '₹350 Crores',
      clientBase: 500
    },
    images: {
      certificate: '/images/awards/2022/top-performer-certificate.jpg'
    },
    featured: false,
    verified: true
  },

  // 2021 Awards
  {
    id: 'sustainability-leader-2021',
    title: 'Sustainability Leadership Award',
    subtitle: 'Green Building Promotion',
    year: 2021,
    month: 'November',
    category: AWARD_CATEGORIES.SUSTAINABILITY,
    level: AWARD_LEVELS.CITY,
    organization: {
      name: 'Pune Green Building Council',
      logo: '/images/awards/pgbc-logo.png',
      website: 'https://pgbc.org'
    },
    description: 'Awarded for promoting sustainable and green commercial properties.',
    initiatives: [
      'Green Building Certifications',
      'Energy Efficient Properties',
      'Sustainable Development Advocacy',
      'Environmental Impact Awareness'
    ],
    statistics: {
      greenProperties: 45,
      energySaved: '30% average',
      certifiedBuildings: 12
    },
    images: {
      trophy: '/images/awards/2021/sustainability-trophy.jpg'
    },
    featured: false,
    verified: true
  },

  {
    id: 'covid-hero-2021',
    title: 'COVID-19 Business Continuity Excellence',
    subtitle: 'Resilience in Challenging Times',
    year: 2021,
    month: 'March',
    category: AWARD_CATEGORIES.LEADERSHIP,
    level: AWARD_LEVELS.CITY,
    organization: {
      name: 'Pune Business Excellence Forum',
      logo: '/images/awards/pbef-logo.png'
    },
    description: 'Recognized for maintaining excellent service during pandemic with innovative solutions.',
    initiatives: [
      'Virtual Property Tours',
      'Online Documentation',
      'Safety Protocols',
      'Client Support Programs'
    ],
    images: {
      certificate: '/images/awards/2021/covid-hero-certificate.jpg'
    },
    featured: false,
    verified: true
  },

  // 2020 Awards
  {
    id: 'fastest-growing-2020',
    title: 'Fastest Growing Real Estate Firm',
    subtitle: 'Growth Excellence Award',
    year: 2020,
    month: 'December',
    category: AWARD_CATEGORIES.INDUSTRY,
    level: AWARD_LEVELS.STATE,
    organization: {
      name: 'Maharashtra Real Estate Association',
      logo: '/images/awards/mrea-logo.png'
    },
    description: 'Recognized for exceptional growth in team size, revenue, and market presence.',
    growth: {
      revenueGrowth: '85%',
      teamExpansion: 'From 15 to 35',
      newOffices: 2,
      marketShare: '+3.5%'
    },
    images: {
      trophy: '/images/awards/2020/fastest-growing-trophy.jpg'
    },
    featured: false,
    verified: true
  }
];

// Certifications data
export const certificationsData = [
  {
    id: 'rera-registration',
    title: 'RERA Registered Agent',
    type: AWARD_CATEGORIES.CERTIFICATION,
    issuer: 'Maharashtra Real Estate Regulatory Authority',
    registrationNo: 'RERA/PUNE/2024/AG001234',
    validFrom: '2020-01-01',
    validUntil: '2025-01-01',
    status: 'Active',
    logo: '/images/certifications/rera-logo.png',
    verificationUrl: 'https://maharera.mahaonline.gov.in',
    description: 'Official registration as real estate agent under RERA Act 2016',
    featured: true
  },
  {
    id: 'iso-certification',
    title: 'ISO 9001:2015 Certified',
    type: AWARD_CATEGORIES.CERTIFICATION,
    issuer: 'International Organization for Standardization',
    certificateNo: 'ISO/IND/2022/12345',
    validFrom: '2022-06-01',
    validUntil: '2025-06-01',
    status: 'Active',
    logo: '/images/certifications/iso-logo.png',
    description: 'Quality Management System Certification',
    featured: true
  },
  {
    id: 'credai-member',
    title: 'CREDAI Pune Member',
    type: AWARD_CATEGORIES.MEMBERSHIP,
    issuer: 'Confederation of Real Estate Developers Association',
    membershipNo: 'CREDAI/PUNE/2020/M456',
    validFrom: '2020-03-01',
    status: 'Active',
    logo: '/images/certifications/credai-logo.png',
    description: 'Active member of premier real estate developers association',
    featured: true
  },
  {
    id: 'naredco-member',
    title: 'NAREDCO Member',
    type: AWARD_CATEGORIES.MEMBERSHIP,
    issuer: 'National Real Estate Development Council',
    membershipNo: 'NAREDCO/MH/2021/789',
    validFrom: '2021-01-01',
    status: 'Active',
    logo: '/images/certifications/naredco-logo.png',
    description: 'Member of apex national real estate body'
  }
];

// Media recognition data
export const mediaRecognitionData = [
  {
    id: 'toi-feature-2023',
    title: 'Featured in Times of India',
    subtitle: 'Top 10 Commercial Real Estate Agents in Pune',
    type: AWARD_CATEGORIES.MEDIA,
    publication: 'Times of India',
    date: '2023-08-15',
    category: 'Print Media',
    link: 'https://timesofindia.com/pune-top-real-estate',
    excerpt: 'DGrealtors recognized among top 10 commercial property consultants...',
    image: '/images/media/toi-feature-2023.jpg',
    featured: true
  },
  {
    id: 'et-interview-2023',
    title: 'Economic Times Interview',
    subtitle: 'Future of Commercial Real Estate in Pune',
    type: AWARD_CATEGORIES.MEDIA,
    publication: 'Economic Times',
    date: '2023-09-20',
    category: 'Business Media',
    link: 'https://economictimes.com/commercial-real-estate-pune',
    excerpt: 'Exclusive interview with DGrealtors leadership on market trends...',
    image: '/images/media/et-interview-2023.jpg'
  },
  {
    id: 'cnbc-feature-2022',
    title: 'CNBC Awaaz Business Feature',
    subtitle: 'Success Story in Real Estate',
    type: AWARD_CATEGORIES.MEDIA,
    publication: 'CNBC Awaaz',
    date: '2022-11-10',
    category: 'Television',
    videoUrl: 'https://youtube.com/watch?v=xxxxx',
    excerpt: 'Featured on CNBC Awaaz for innovative business practices...',
    image: '/images/media/cnbc-feature-2022.jpg'
  }
];

// Milestones data
export const milestonesData = [
  {
    year: 2023,
    achievements: [
      '500+ Commercial Properties Leased',
      '₹1000+ Crores Transaction Value',
      '98% Customer Satisfaction Rate',
      'Expanded to 5 New Areas in Pune'
    ]
  },
  {
    year: 2022,
    achievements: [
      'Launched Digital Platform',
      'Team Expansion to 50+ Members',
      'ISO 9001:2015 Certification',
      '300+ New Client Acquisitions'
    ]
  },
  {
    year: 2021,
    achievements: [
      'Virtual Tour Technology Implementation',
      'COVID-19 Business Continuity',
      '200+ Properties Listed',
      'Partnership with Major Corporates'
    ]
  },
  {
    year: 2020,
    achievements: [
      'RERA Registration Completed',
      'New Office in Hinjewadi',
      '150+ Successful Transactions',
      'CRM System Implementation'
    ]
  }
];

// Utility functions for awards data
export const awardsUtils = {
  // Get awards by category
  getAwardsByCategory: (category) => {
    return awardsData.filter(award => award.category === category);
  },

  // Get awards by year
  getAwardsByYear: (year) => {
    return awardsData.filter(award => award.year === year);
  },

  // Get featured awards
  getFeaturedAwards: () => {
    return awardsData.filter(award => award.featured);
  },

  // Get recent awards
  getRecentAwards: (count = 5) => {
    return awardsData
      .sort((a, b) => b.year - a.year || 
        new Date(`${b.month} 1, ${b.year}`) - new Date(`${a.month} 1, ${a.year}`))
      .slice(0, count);
  },

  // Get active certifications
  getActiveCertifications: () => {
    const today = new Date();
    return certificationsData.filter(cert => {
      if (cert.status !== 'Active') return false;
      if (!cert.validUntil) return true;
      return new Date(cert.validUntil) > today;
    });
  },

  // Get award statistics
  getAwardStats: () => {
    const stats = {
      totalAwards: awardsData.length,
      totalCertifications: certificationsData.length,
      totalMediaRecognitions: mediaRecognitionData.length,
      categories: {},
      levels: {},
      yearlyCount: {}
    };

    awardsData.forEach(award => {
      // Count by category
      stats.categories[award.category] = (stats.categories[award.category] || 0) + 1;
      
      // Count by level
      stats.levels[award.level] = (stats.levels[award.level] || 0) + 1;
      
      // Count by year
      stats.yearlyCount[award.year] = (stats.yearlyCount[award.year] || 0) + 1;
    });

    return stats;
  },

  // Group awards by year
  groupAwardsByYear: () => {
    const grouped = {};
    
    awardsData.forEach(award => {
      if (!grouped[award.year]) {
        grouped[award.year] = [];
      }
      grouped[award.year].push(award);
    });

    // Sort awards within each year by month
    Object.keys(grouped).forEach(year => {
      grouped[year].sort((a, b) => {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
        return months.indexOf(b.month) - months.indexOf(a.month);
      });
    });

    return grouped;
  },

  // Get award timeline
  getAwardTimeline: () => {
    const timeline = [];
    
    // Add awards
    awardsData.forEach(award => {
      timeline.push({
        type: 'award',
        date: new Date(`${award.month} 1, ${award.year}`),
        title: award.title,
        organization: award.organization.name,
        category: award.category,
        data: award
      });
    });

    // Add certifications
    certificationsData.forEach(cert => {
      timeline.push({
        type: 'certification',
        date: new Date(cert.validFrom),
        title: cert.title,
        organization: cert.issuer,
        data: cert
      });
    });

    // Add media recognitions
    mediaRecognitionData.forEach(media => {
      timeline.push({
        type: 'media',
        date: new Date(media.date),
        title: media.title,
        organization: media.publication,
        data: media
      });
    });

    // Sort by date (newest first)
    timeline.sort((a, b) => b.date - a.date);

    return timeline;
  },

  // Search awards
  searchAwards: (query) => {
    const lowercaseQuery = query.toLowerCase();
    return awardsData.filter(award => 
      award.title.toLowerCase().includes(lowercaseQuery) ||
      award.subtitle?.toLowerCase().includes(lowercaseQuery) ||
      award.description.toLowerCase().includes(lowercaseQuery) ||
      award.organization.name.toLowerCase().includes(lowercaseQuery)
    );
  }
};

// Award display configuration
export const awardDisplayConfig = {
  // Category display names and icons
  categoryDisplay: {
    [AWARD_CATEGORIES.INDUSTRY]: { name: 'Industry Recognition', icon: '🏆' },
    [AWARD_CATEGORIES.CUSTOMER_SERVICE]: { name: 'Customer Excellence', icon: '⭐' },
    [AWARD_CATEGORIES.INNOVATION]: { name: 'Innovation', icon: '💡' },
    [AWARD_CATEGORIES.SUSTAINABILITY]: { name: 'Sustainability', icon: '🌱' },
    [AWARD_CATEGORIES.LEADERSHIP]: { name: 'Leadership', icon: '👔' },
    [AWARD_CATEGORIES.CERTIFICATION]: { name: 'Certifications', icon: '📜' },
    [AWARD_CATEGORIES.MEMBERSHIP]: { name: 'Memberships', icon: '🤝' },
    [AWARD_CATEGORIES.MEDIA]: { name: 'Media Recognition', icon: '📰' }
  },

  // Level display names and colors
  levelDisplay: {
    [AWARD_LEVELS.INTERNATIONAL]: { name: 'International', color: '#FFD700' },
    [AWARD_LEVELS.NATIONAL]: { name: 'National', color: '#C0C0C0' },
    [AWARD_LEVELS.STATE]: { name: 'State Level', color: '#CD7F32' },
    [AWARD_LEVELS.CITY]: { name: 'City Level', color: '#B87333' },
    [AWARD_LEVELS.INDUSTRY]: { name: 'Industry Specific', color: '#8B7355' }
  },

  // Animation settings for award reveals
  animations: {
    stagger: 100,
    duration: 600,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  }
};

// Export all data
export default {
  awardsData,
  certificationsData,
  mediaRecognitionData,
  milestonesData,
  awardsUtils,
  awardDisplayConfig,
  AWARD_CATEGORIES,
  AWARD_LEVELS
};
    
