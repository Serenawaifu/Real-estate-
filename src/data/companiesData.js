/**
 * Companies Data Configuration for DGrealtors
 * Client companies and partnerships showcase
 */

// Company categories
export const COMPANY_CATEGORIES = {
  TECHNOLOGY: 'technology',
  FINANCE: 'finance',
  HEALTHCARE: 'healthcare',
  RETAIL: 'retail',
  MANUFACTURING: 'manufacturing',
  CONSULTING: 'consulting',
  EDUCATION: 'education',
  HOSPITALITY: 'hospitality',
  LOGISTICS: 'logistics',
  MEDIA: 'media'
};

// Company sizes
export const COMPANY_SIZES = {
  STARTUP: 'startup',
  SME: 'sme',
  ENTERPRISE: 'enterprise',
  MNC: 'mnc'
};

// Companies data
export const companiesData = [
  // Technology Companies
  {
    id: 'tech-corp-1',
    name: 'TechVista Solutions',
    logo: '/images/companies/techvista.png',
    alternativeLogo: '/images/companies/techvista-dark.png',
    category: COMPANY_CATEGORIES.TECHNOLOGY,
    size: COMPANY_SIZES.ENTERPRISE,
    industry: 'Software Development',
    description: 'Leading IT solutions provider',
    website: 'https://techvista.example.com',
    featured: true,
    testimonial: {
      text: 'DGrealtors helped us find the perfect office space in Hinjewadi. Their understanding of IT company requirements is exceptional.',
      author: 'Rajesh Kumar',
      designation: 'CEO',
      rating: 5
    },
    properties: {
      type: 'Office Space',
      location: 'Hinjewadi',
      size: '15,000 sq.ft',
      year: 2023
    },
    stats: {
      employees: '500+',
      branches: 3,
      yearsWithUs: 2
    },
    tags: ['IT Park', 'Premium Office', 'Tech Hub']
  },
  {
    id: 'infosys',
    name: 'Infosys Limited',
    logo: '/images/companies/infosys.png',
    alternativeLogo: '/images/companies/infosys-dark.png',
    category: COMPANY_CATEGORIES.TECHNOLOGY,
    size: COMPANY_SIZES.MNC,
    industry: 'Information Technology',
    description: 'Global leader in technology services',
    website: 'https://www.infosys.com',
    featured: true,
    properties: {
      type: 'Office Complex',
      location: 'Hinjewadi',
      size: '50,000 sq.ft',
      year: 2022
    },
    stats: {
      employees: '1000+',
      branches: 5,
      yearsWithUs: 3
    },
    tags: ['Fortune 500', 'IT Services', 'Global']
  },
  {
    id: 'persistent',
    name: 'Persistent Systems',
    logo: '/images/companies/persistent.png',
    alternativeLogo: '/images/companies/persistent-dark.png',
    category: COMPANY_CATEGORIES.TECHNOLOGY,
    size: COMPANY_SIZES.ENTERPRISE,
    industry: 'Software Services',
    description: 'Digital transformation partner',
    website: 'https://www.persistent.com',
    featured: true,
    properties: {
      type: 'Tech Campus',
      location: 'Viman Nagar',
      size: '30,000 sq.ft',
      year: 2023
    },
    tags: ['Digital', 'Innovation', 'Tech Park']
  },

  // Finance Companies
  {
    id: 'hdfc-bank',
    name: 'HDFC Bank',
    logo: '/images/companies/hdfc.png',
    alternativeLogo: '/images/companies/hdfc-dark.png',
    category: COMPANY_CATEGORIES.FINANCE,
    size: COMPANY_SIZES.MNC,
    industry: 'Banking & Finance',
    description: 'Leading private sector bank',
    website: 'https://www.hdfcbank.com',
    featured: true,
    testimonial: {
      text: 'DGrealtors understood our requirements for high-footfall locations and delivered excellent options for our branches.',
      author: 'Priya Sharma',
      designation: 'Regional Head',
      rating: 5
    },
    properties: {
      type: 'Retail Space',
      location: 'Multiple Locations',
      size: '5,000 sq.ft',
      year: 2023
    },
    stats: {
      branches: 8,
      yearsWithUs: 5
    },
    tags: ['Banking', 'Financial Services', 'Retail']
  },
  {
    id: 'bajaj-finserv',
    name: 'Bajaj Finserv',
    logo: '/images/companies/bajaj-finserv.png',
    alternativeLogo: '/images/companies/bajaj-finserv-dark.png',
    category: COMPANY_CATEGORIES.FINANCE,
    size: COMPANY_SIZES.ENTERPRISE,
    industry: 'Financial Services',
    description: 'Diversified financial services',
    website: 'https://www.bajajfinserv.in',
    featured: false,
    properties: {
      type: 'Office Space',
      location: 'Baner',
      size: '10,000 sq.ft',
      year: 2022
    },
    tags: ['NBFC', 'Insurance', 'Lending']
  },

  // Healthcare Companies
  {
    id: 'apollo-hospitals',
    name: 'Apollo Hospitals',
    logo: '/images/companies/apollo.png',
    alternativeLogo: '/images/companies/apollo-dark.png',
    category: COMPANY_CATEGORIES.HEALTHCARE,
    size: COMPANY_SIZES.ENTERPRISE,
    industry: 'Healthcare',
    description: 'Leading healthcare provider',
    website: 'https://www.apollohospitals.com',
    featured: true,
    testimonial: {
      text: 'Found the ideal location for our diagnostic center with excellent accessibility and parking facilities.',
      author: 'Dr. Amit Verma',
      designation: 'Director Operations',
      rating: 5
    },
    properties: {
      type: 'Medical Facility',
      location: 'Aundh',
      size: '8,000 sq.ft',
      year: 2023
    },
    tags: ['Healthcare', 'Medical', 'Diagnostic']
  },
  {
    id: 'pharma-plus',
    name: 'PharmaCare Plus',
    logo: '/images/companies/pharmacare.png',
    alternativeLogo: '/images/companies/pharmacare-dark.png',
    category: COMPANY_CATEGORIES.HEALTHCARE,
    size: COMPANY_SIZES.SME,
    industry: 'Pharmaceuticals',
    description: 'Pharmacy chain and healthcare',
    website: '#',
    featured: false,
    properties: {
      type: 'Retail Outlets',
      location: 'Multiple',
      size: '2,000 sq.ft',
      year: 2023
    },
    tags: ['Pharmacy', 'Retail', 'Healthcare']
  },

  // Retail Companies
  {
    id: 'dmart',
    name: 'D-Mart',
    logo: '/images/companies/dmart.png',
    alternativeLogo: '/images/companies/dmart-dark.png',
    category: COMPANY_CATEGORIES.RETAIL,
    size: COMPANY_SIZES.ENTERPRISE,
    industry: 'Retail Chain',
    description: 'Retail supermarket chain',
    website: 'https://www.dmartindia.com',
    featured: true,
    properties: {
      type: 'Retail Space',
      location: 'Wakad',
      size: '25,000 sq.ft',
      year: 2022
    },
    stats: {
      footfall: '10000+/day',
      yearsWithUs: 3
    },
    tags: ['Supermarket', 'Retail', 'FMCG']
  },
  {
    id: 'lifestyle-stores',
    name: 'Lifestyle Stores',
    logo: '/images/companies/lifestyle.png',
    alternativeLogo: '/images/companies/lifestyle-dark.png',
    category: COMPANY_CATEGORIES.RETAIL,
    size: COMPANY_SIZES.ENTERPRISE,
    industry: 'Fashion Retail',
    description: 'Fashion and lifestyle retail',
    website: '#',
    featured: false,
    properties: {
      type: 'Showroom',
      location: 'Phoenix Mall',
      size: '15,000 sq.ft',
      year: 2023
    },
    tags: ['Fashion', 'Apparel', 'Lifestyle']
  },

  // Manufacturing Companies
  {
    id: 'tata-motors',
    name: 'Tata Motors',
    logo: '/images/companies/tata-motors.png',
    alternativeLogo: '/images/companies/tata-motors-dark.png',
    category: COMPANY_CATEGORIES.MANUFACTURING,
    size: COMPANY_SIZES.MNC,
    industry: 'Automobile Manufacturing',
    description: 'Leading automobile manufacturer',
    website: 'https://www.tatamotors.com',
    featured: true,
    testimonial: {
      text: 'DGrealtors helped us establish our showroom and service center at a strategic location.',
      author: 'Suresh Patil',
      designation: 'Regional Manager',
      rating: 5
    },
    properties: {
      type: 'Showroom & Service Center',
      location: 'Pimpri-Chinchwad',
      size: '40,000 sq.ft',
      year: 2022
    },
    stats: {
      facilities: 2,
      yearsWithUs: 4
    },
    tags: ['Automotive', 'Manufacturing', 'Showroom']
  },
  {
    id: 'forbes-marshall',
    name: 'Forbes Marshall',
    logo: '/images/companies/forbes-marshall.png',
    alternativeLogo: '/images/companies/forbes-marshall-dark.png',
    category: COMPANY_CATEGORIES.MANUFACTURING,
    size: COMPANY_SIZES.ENTERPRISE,
    industry: 'Industrial Equipment',
    description: 'Steam engineering & control instrumentation',
    website: 'https://www.forbesmarshall.com',
    featured: false,
    properties: {
      type: 'Industrial Space',
      location: 'Chakan',
      size: '20,000 sq.ft',
      year: 2023
    },
    tags: ['Industrial', 'Engineering', 'Manufacturing']
  },

  // Consulting Companies
  {
    id: 'deloitte',
    name: 'Deloitte',
    logo: '/images/companies/deloitte.png',
    alternativeLogo: '/images/companies/deloitte-dark.png',
    category: COMPANY_CATEGORIES.CONSULTING,
    size: COMPANY_SIZES.MNC,
    industry: 'Management Consulting',
    description: 'Global consulting firm',
    website: 'https://www2.deloitte.com',
    featured: true,
    properties: {
      type: 'Premium Office',
      location: 'Baner',
      size: '20,000 sq.ft',
      year: 2023
    },
    tags: ['Consulting', 'Big 4', 'Professional Services']
  },
  {
    id: 'pwc',
    name: 'PwC',
    logo: '/images/companies/pwc.png',
    alternativeLogo: '/images/companies/pwc-dark.png',
    category: COMPANY_CATEGORIES.CONSULTING,
    size: COMPANY_SIZES.MNC,
    industry: 'Professional Services',
    description: 'Audit and consulting services',
    website: 'https://www.pwc.in',
    featured: false,
    properties: {
      type: 'Office Space',
      location: 'Magarpatta',
      size: '15,000 sq.ft',
      year: 2022
    },
    tags: ['Audit', 'Tax', 'Advisory']
  },

  // Education Companies
  {
    id: 'symbiosis',
    name: 'Symbiosis International',
    logo: '/images/companies/symbiosis.png',
    alternativeLogo: '/images/companies/symbiosis-dark.png',
    category: COMPANY_CATEGORIES.EDUCATION,
    size: COMPANY_SIZES.ENTERPRISE,
    industry: 'Higher Education',
    description: 'International university',
    website: 'https://www.siu.edu.in',
    featured: true,
    testimonial: {
      text: 'DGrealtors assisted us in expanding our campus facilities with perfect locations.',
      author: 'Dr. Vidya Yeravdekar',
      designation: 'Principal Director',
      rating: 5
    },
    properties: {
      type: 'Educational Facility',
      location: 'Viman Nagar',
      size: '50,000 sq.ft',
      year: 2022
    },
    tags: ['University', 'Education', 'Campus']
  },

  // Hospitality Companies
  {
    id: 'marriott',
    name: 'Marriott Hotels',
    logo: '/images/companies/marriott.png',
    alternativeLogo: '/images/companies/marriott-dark.png',
    category: COMPANY_CATEGORIES.HOSPITALITY,
    size: COMPANY_SIZES.MNC,
    industry: 'Hospitality',
    description: 'International hotel chain',
    website: 'https://www.marriott.com',
    featured: true,
    properties: {
      type: 'Commercial Complex',
      location: 'Koregaon Park',
      size: '30,000 sq.ft',
      year: 2023
    },
    tags: ['Hotel', 'Hospitality', 'Luxury']
  },

  // Logistics Companies
  {
    id: 'dhl',
    name: 'DHL Express',
    logo: '/images/companies/dhl.png',
    alternativeLogo: '/images/companies/dhl-dark.png',
    category: COMPANY_CATEGORIES.LOGISTICS,
    size: COMPANY_SIZES.MNC,
    industry: 'Logistics & Courier',
    description: 'International express delivery',
    website: 'https://www.dhl.com',
    featured: true,
    properties: {
      type: 'Warehouse & Office',
      location: 'Chakan',
      size: '35,000 sq.ft',
      year: 2022
    },
    tags: ['Logistics', 'Courier', 'Warehouse']
  },

  // Media Companies
  {
    id: 'times-group',
    name: 'Times Group',
    logo: '/images/companies/times-group.png',
    alternativeLogo: '/images/companies/times-group-dark.png',
    category: COMPANY_CATEGORIES.MEDIA,
    size: COMPANY_SIZES.ENTERPRISE,
    industry: 'Media & Entertainment',
    description: 'Media conglomerate',
    website: '#',
    featured: false,
    properties: {
      type: 'Office Space',
      location: 'Baner',
      size: '12,000 sq.ft',
      year: 2023
    },
    tags: ['Media', 'Publishing', 'Broadcasting']
  }
];

// Utility functions for companies data
export const companiesUtils = {
  // Get all featured companies
  getFeaturedCompanies: () => {
    return companiesData.filter(company => company.featured);
  },

  // Get companies by category
  getCompaniesByCategory: (category) => {
    return companiesData.filter(company => company.category === category);
  },

  // Get companies with testimonials
  getCompaniesWithTestimonials: () => {
    return companiesData.filter(company => company.testimonial);
  },

  // Get company statistics
  getCompanyStats: () => {
    const stats = {
      totalCompanies: companiesData.length,
      categories: {},
      sizes: {},
      totalProperties: 0,
      totalArea: 0
    };

    companiesData.forEach(company => {
      // Count by category
      stats.categories[company.category] = (stats.categories[company.category] || 0) + 1;
      
      // Count by size
      stats.sizes[company.size] = (stats.sizes[company.size] || 0) + 1;
      
      // Count properties
      if (company.properties) {
        stats.totalProperties++;
        
        // Extract area if available
        const areaMatch = company.properties.size?.match(/(\d+,?\d*)/);
        if (areaMatch) {
          const area = parseInt(areaMatch[1].replace(',', ''));
          stats.totalArea += area;
        }
      }
    });

    return stats;
  },

  // Get random companies for carousel
  getRandomCompanies: (count = 10) => {
    const shuffled = [...companiesData].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  },

  // Group companies by industry
  groupByIndustry: () => {
    const grouped = {};
    companiesData.forEach(company => {
      if (!grouped[company.industry]) {
        grouped[company.industry] = [];
      }
      grouped[company.industry].push(company);
    });
    return grouped;
  },

  // Search companies
  searchCompanies: (query) => {
    const lowercaseQuery = query.toLowerCase();
    return companiesData.filter(company => 
      company.name.toLowerCase().includes(lowercaseQuery) ||
      company.industry.toLowerCase().includes(lowercaseQuery) ||
      company.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }
};

// Company carousel configuration
export const carouselConfig = {
  autoplay: true,
  autoplaySpeed: 3000,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 1,
  infinite: true,
  pauseOnHover: true,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 4,
      }
    },
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 3,
      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
      }
    },
    {
      breakpoint: 576,
      settings: {
        slidesToShow: 1,
        centerMode: true,
        centerPadding: '40px'
      }
    }
  ]
};

// Awards and recognition
export const awardsData = [
  {
    id: 'best-broker-2023',
    title: 'Best Commercial Broker',
    year: 2023,
    organization: 'Pune Real Estate Awards',
    logo: '/images/awards/pune-awards.png'
  },
  {
    id: 'excellence-2022',
    title: 'Excellence in Customer Service',
    year: 2022,
    organization: 'Maharashtra Property Association',
    logo: '/images/awards/mpa.png'
  },
  {
    id: 'top-consultant-2021',
    title: 'Top Property Consultant',
    year: 2021,
    organization: 'Commercial Property Forum',
    logo: '/images/awards/cpf.png'
  }
];

// Industry statistics
export const industryStats = {
  totalClients: '1000+',
  propertyDeals: '5000+',
  totalArea: '10M+ sq.ft',
  citiesCovered: '5+',
  teamSize: '50+',
  yearsExperience: '14+'
};

// Export all data
export default {
  companiesData,
  companiesUtils,
  carouselConfig,
  awardsData,
  industryStats,
  COMPANY_CATEGORIES,
  COMPANY_SIZES
};
    
