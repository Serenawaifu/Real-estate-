/**
 * Locations Data Configuration for DGrealtors
 * Comprehensive location data with property statistics and area information
 */

// Location types
export const LOCATION_TYPES = {
  IT_HUB: 'it-hub',
  COMMERCIAL_HUB: 'commercial-hub',
  INDUSTRIAL_ZONE: 'industrial-zone',
  RETAIL_DISTRICT: 'retail-district',
  MIXED_USE: 'mixed-use',
  UPCOMING: 'upcoming',
  PRIME: 'prime'
};

// Zone classifications
export const ZONES = {
  WEST_PUNE: {
    id: 'west-pune',
    name: 'West Pune',
    description: 'IT corridor and commercial hub',
    color: '#FF6B6B',
    locations: ['wakad', 'hinjewadi', 'baner', 'balewadi', 'sus', 'pashan']
  },
  NORTH_PUNE: {
    id: 'north-pune',
    name: 'North Pune',
    description: 'Industrial and manufacturing belt',
    color: '#4ECDC4',
    locations: ['pimpri', 'chinchwad', 'bhosari', 'chakan', 'moshi']
  },
  EAST_PUNE: {
    id: 'east-pune',
    name: 'East Pune',
    description: 'Modern commercial developments',
    color: '#45B7D1',
    locations: ['viman-nagar', 'kharadi', 'magarpatta', 'hadapsar', 'mundhwa']
  },
  CENTRAL_PUNE: {
    id: 'central-pune',
    name: 'Central Pune',
    description: 'Traditional business district',
    color: '#96CEB4',
    locations: ['shivajinagar', 'camp', 'deccan', 'sadashiv-peth', 'fc-road']
  },
  SOUTH_PUNE: {
    id: 'south-pune',
    name: 'South Pune',
    description: 'Educational and residential hub',
    color: '#DDA0DD',
    locations: ['sinhagad-road', 'kondhwa', 'katraj', 'dhankawadi', 'warje']
  }
};

// Main locations data
export const locationsData = [
  // West Pune Locations
  {
    id: 'wakad',
    name: 'Wakad',
    zone: ZONES.WEST_PUNE,
    type: [LOCATION_TYPES.IT_HUB, LOCATION_TYPES.COMMERCIAL_HUB],
    coordinates: {
      lat: 18.5912716,
      lng: 73.7610976,
      bounds: {
        north: 18.6050,
        south: 18.5775,
        east: 73.7750,
        west: 73.7470
      }
    },
    description: 'Prime commercial hub with excellent connectivity to Hinjewadi IT Park and Mumbai-Pune Expressway.',
    highlights: [
      'Direct access to Hinjewadi IT Park',
      'Mumbai-Pune Expressway connectivity',
      'Established commercial infrastructure',
      'Metro connectivity (upcoming)',
      'Proximity to residential areas'
    ],
    infrastructure: {
      transport: {
        metro: 'Upcoming (2024)',
        bus: 'PMPML routes available',
        highway: 'Mumbai-Pune Expressway (2 km)',
        airport: 'Pune Airport (18 km)',
        railway: 'Pune Railway Station (15 km)'
      },
      utilities: {
        powerSupply: '24/7 with backup',
        waterSupply: 'PMC water + Tanker',
        internet: 'Fiber optic available',
        parking: 'Ample parking spaces'
      }
    },
    demographics: {
      workingPopulation: '150,000+',
      floatingPopulation: '50,000+ daily',
      majorCompanies: ['Infosys', 'Persistent', 'Tech Mahindra', 'Wipro'],
      averageAge: 32
    },
    propertyStats: {
      totalProperties: 145,
      availableProperties: 28,
      avgPricePerSqFt: 65,
      priceRange: {
        min: 45,
        max: 85
      },
      occupancyRate: 92,
      yearlyAppreciation: 8.5
    },
    propertyTypes: {
      office: {
        count: 78,
        avgSize: 5000,
        avgRent: 65
      },
      retail: {
        count: 34,
        avgSize: 1500,
        avgRent: 120
      },
      warehouse: {
        count: 12,
        avgSize: 15000,
        avgRent: 25
      },
      showroom: {
        count: 21,
        avgSize: 3000,
        avgRent: 80
      }
    },
    amenities: {
      malls: ['City One Mall', 'Xion Mall'],
      hospitals: ['Life Point Hospital', 'Sanjeevan Hospital'],
      schools: ['Vibgyor High', 'Mercedes-Benz International School'],
      restaurants: 150,
      banks: 25,
      atms: 40
    },
    upcomingProjects: [
      {
        name: 'Metro Line Extension',
        type: 'Infrastructure',
        expectedCompletion: '2024',
        impact: 'High'
      },
      {
        name: 'IT Park Phase 3',
        type: 'Commercial',
        expectedCompletion: '2025',
        impact: 'High'
      }
    ],
    images: {
      main: '/images/locations/wakad-main.jpg',
      gallery: [
        '/images/locations/wakad-1.jpg',
        '/images/locations/wakad-2.jpg',
        '/images/locations/wakad-3.jpg'
      ],
      map: '/images/locations/wakad-map.jpg'
    },
    seoData: {
      title: 'Commercial Properties in Wakad',
      description: 'Find premium commercial properties in Wakad, Pune. Office spaces, retail shops, and showrooms in prime IT hub location.',
      keywords: ['wakad commercial property', 'office space wakad', 'wakad retail space']
    }
  },
  
  {
    id: 'hinjewadi',
    name: 'Hinjewadi',
    zone: ZONES.WEST_PUNE,
    type: [LOCATION_TYPES.IT_HUB, LOCATION_TYPES.PRIME],
    coordinates: {
      lat: 18.5914,
      lng: 73.7399,
      bounds: {
        north: 18.6100,
        south: 18.5728,
        east: 73.7550,
        west: 73.7248
      }
    },
    description: 'Pune\'s premier IT hub housing major tech companies and modern commercial infrastructure.',
    highlights: [
      'Rajiv Gandhi Infotech Park',
      'Home to 200+ IT companies',
      'Planned infrastructure',
      'Upcoming metro connectivity',
      'International standard facilities'
    ],
    infrastructure: {
      transport: {
        metro: 'Under construction',
        bus: 'Dedicated PMPML routes',
        highway: 'Mumbai-Pune Expressway adjacent',
        airport: 'Pune Airport (20 km)',
        railway: 'Pune Station (17 km)'
      },
      utilities: {
        powerSupply: '100% power backup',
        waterSupply: 'Dedicated supply',
        internet: 'Multiple fiber providers',
        parking: 'Multi-level parking'
      }
    },
    demographics: {
      workingPopulation: '400,000+',
      floatingPopulation: '100,000+ daily',
      majorCompanies: ['Infosys', 'Wipro', 'TCS', 'Cognizant', 'Accenture'],
      averageAge: 29
    },
    propertyStats: {
      totalProperties: 312,
      availableProperties: 45,
      avgPricePerSqFt: 75,
      priceRange: {
        min: 55,
        max: 95
      },
      occupancyRate: 94,
      yearlyAppreciation: 10.2
    },
    propertyTypes: {
      office: {
        count: 245,
        avgSize: 8000,
        avgRent: 75
      },
      retail: {
        count: 42,
        avgSize: 2000,
        avgRent: 110
      },
      coworking: {
        count: 25,
        avgSize: 10000,
        avgRent: 450 // per seat
      }
    },
    phases: [
      {
        name: 'Phase 1',
        status: 'Fully Developed',
        companies: 80,
        area: '150 acres'
      },
      {
        name: 'Phase 2',
        status: 'Fully Developed',
        companies: 60,
        area: '120 acres'
      },
      {
        name: 'Phase 3',
        status: 'Under Development',
        companies: 40,
        area: '200 acres'
      }
    ],
    images: {
      main: '/images/locations/hinjewadi-main.jpg',
      gallery: [
        '/images/locations/hinjewadi-1.jpg',
        '/images/locations/hinjewadi-2.jpg',
        '/images/locations/hinjewadi-3.jpg'
      ],
      map: '/images/locations/hinjewadi-map.jpg'
    }
  },

  {
    id: 'baner',
    name: 'Baner',
    zone: ZONES.WEST_PUNE,
    type: [LOCATION_TYPES.COMMERCIAL_HUB, LOCATION_TYPES.RETAIL_DISTRICT],
    coordinates: {
      lat: 18.5590,
      lng: 73.7868,
      bounds: {
        north: 18.5750,
        south: 18.5430,
        east: 73.8000,
        west: 73.7736
      }
    },
    description: 'Bustling commercial area with mix of IT offices, retail outlets, and premium showrooms.',
    highlights: [
      'Baner-Pashan Link Road',
      'Premium retail destination',
      'IT offices and startups',
      'Excellent connectivity',
      'Vibrant nightlife'
    ],
    propertyStats: {
      totalProperties: 198,
      availableProperties: 32,
      avgPricePerSqFt: 85,
      priceRange: {
        min: 60,
        max: 110
      },
      occupancyRate: 91,
      yearlyAppreciation: 9.1
    },
    images: {
      main: '/images/locations/baner-main.jpg',
      gallery: [
        '/images/locations/baner-1.jpg',
        '/images/locations/baner-2.jpg'
      ]
    }
  },

  // North Pune Locations
  {
    id: 'pimpri-chinchwad',
    name: 'Pimpri-Chinchwad',
    displayName: 'PCMC',
    zone: ZONES.NORTH_PUNE,
    type: [LOCATION_TYPES.INDUSTRIAL_ZONE, LOCATION_TYPES.COMMERCIAL_HUB],
    coordinates: {
      lat: 18.6298,
      lng: 73.7997,
      bounds: {
        north: 18.7200,
        south: 18.5396,
        east: 73.9000,
        west: 73.6994
      }
    },
    description: 'Major industrial and manufacturing hub with growing commercial developments.',
    highlights: [
      'Auto manufacturing hub',
      'Industrial infrastructure',
      'PCMC administration',
      'Growing IT presence',
      'Strategic location'
    ],
    infrastructure: {
      transport: {
        metro: 'Operational',
        bus: 'PMPML & PCMT',
        highway: 'NH-48 passing through',
        airport: 'Pune Airport (25 km)',
        railway: 'Pimpri Station'
      }
    },
    demographics: {
      workingPopulation: '300,000+',
      majorCompanies: ['Bajaj Auto', 'Tata Motors', 'Force Motors', 'ThyssenKrupp'],
      industrialUnits: 4000
    },
    propertyStats: {
      totalProperties: 234,
      availableProperties: 41,
      avgPricePerSqFt: 55,
      priceRange: {
        min: 35,
        max: 75
      },
      occupancyRate: 89,
      yearlyAppreciation: 7.5
    },
    propertyTypes: {
      industrial: {
        count: 145,
        avgSize: 20000,
        avgRent: 30
      },
      warehouse: {
        count: 67,
        avgSize: 25000,
        avgRent: 25
      },
      office: {
        count: 22,
        avgSize: 5000,
        avgRent: 45
      }
    },
    images: {
      main: '/images/locations/pcmc-main.jpg',
      gallery: [
        '/images/locations/pcmc-1.jpg',
        '/images/locations/pcmc-2.jpg'
      ]
    }
  },

  // East Pune Locations
  {
    id: 'viman-nagar',
    name: 'Viman Nagar',
    zone: ZONES.EAST_PUNE,
    type: [LOCATION_TYPES.COMMERCIAL_HUB, LOCATION_TYPES.PRIME],
    coordinates: {
      lat: 18.5679,
      lng: 73.9143,
      bounds: {
        north: 18.5800,
        south: 18.5558,
        east: 73.9250,
        west: 73.9036
      }
    },
    description: 'Premium location near airport with upscale commercial and retail developments.',
    highlights: [
      'Adjacent to Pune Airport',
      'Phoenix MarketCity',
      'Premium commercial spaces',
      'High-street retail',
      'Cosmopolitan culture'
    ],
    propertyStats: {
      totalProperties: 156,
      availableProperties: 24,
      avgPricePerSqFt: 95,
      priceRange: {
        min: 70,
        max: 120
      },
      occupancyRate: 93,
      yearlyAppreciation: 8.8
    },
    propertyTypes: {
      retail: {
        count: 78,
        avgSize: 3000,
        avgRent: 150
      },
      office: {
        count: 56,
        avgSize: 6000,
        avgRent: 85
      },
      showroom: {
        count: 22,
        avgSize: 5000,
        avgRent: 100
      }
    },
    images: {
      main: '/images/locations/viman-nagar-main.jpg',
      gallery: [
        '/images/locations/viman-nagar-1.jpg'
      ]
    }
  },

  {
    id: 'kharadi',
    name: 'Kharadi',
    zone: ZONES.EAST_PUNE,
    type: [LOCATION_TYPES.IT_HUB, LOCATION_TYPES.UPCOMING],
    coordinates: {
      lat: 18.5463,
      lng: 73.9430,
      bounds: {
        north: 18.5600,
        south: 18.5326,
        east: 73.9550,
        west: 73.9310
      }
    },
    description: 'Rapidly developing IT hub with EON IT Park and modern commercial infrastructure.',
    highlights: [
      'EON IT Park',
      'World Trade Center',
      'Growing IT destination',
      'Modern infrastructure',
      'Bypass road connectivity'
    ],
    propertyStats: {
      totalProperties: 124,
      availableProperties: 31,
      avgPricePerSqFt: 70,
      priceRange: {
        min: 50,
        max: 90
      },
      occupancyRate: 88,
      yearlyAppreciation: 11.5
    },
    images: {
      main: '/images/locations/kharadi-main.jpg',
      gallery: []
    }
  },

  // Central Pune Locations
  {
    id: 'shivajinagar',
    name: 'Shivajinagar',
    zone: ZONES.CENTRAL_PUNE,
    type: [LOCATION_TYPES.COMMERCIAL_HUB, LOCATION_TYPES.PRIME],
    coordinates: {
      lat: 18.5308,
      lng: 73.8475,
      bounds: {
        north: 18.5400,
        south: 18.5216,
        east: 73.8550,
        west: 73.8400
      }
    },
    description: 'Central business district with government offices, commercial complexes, and retail.',
    highlights: [
      'Central location',
      'Government offices nearby',
      'Established commercial area',
      'JM Road proximity',
      'Traditional business hub'
    ],
    propertyStats: {
      totalProperties: 189,
      availableProperties: 22,
      avgPricePerSqFt: 110,
      priceRange: {
        min: 80,
        max: 140
      },
      occupancyRate: 95,
      yearlyAppreciation: 6.5
    },
    images: {
      main: '/images/locations/shivajinagar-main.jpg',
      gallery: []
    }
  }
];

// Utility functions for location data
export const locationUtils = {
  // Get all locations for a specific zone
  getLocationsByZone: (zoneId) => {
    return locationsData.filter(location => location.zone.id === zoneId);
  },

  // Get locations by type
  getLocationsByType: (type) => {
    return locationsData.filter(location => 
      Array.isArray(location.type) 
        ? location.type.includes(type)
        : location.type === type
    );
  },

  // Get featured/prime locations
  getPrimeLocations: () => {
    return locationsData.filter(location => 
      location.type.includes(LOCATION_TYPES.PRIME)
    );
  },

  // Calculate distance between two locations
  calculateDistance: (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
  },

  // Find nearby locations
  getNearbyLocations: (locationId, radius = 5) => {
    const targetLocation = locationsData.find(loc => loc.id === locationId);
    if (!targetLocation) return [];

    return locationsData.filter(location => {
      if (location.id === locationId) return false;
      const distance = locationUtils.calculateDistance(
        targetLocation.coordinates.lat,
        targetLocation.coordinates.lng,
        location.coordinates.lat,
        location.coordinates.lng
      );
      return distance <= radius;
    }).map(location => ({
      ...location,
      distance: locationUtils.calculateDistance(
        targetLocation.coordinates.lat,
        targetLocation.coordinates.lng,
        location.coordinates.lat,
        location.coordinates.lng
      ).toFixed(1)
    }));
  },

  // Get location statistics summary
  getLocationStats: (locationId) => {
    const location = locationsData.find(loc => loc.id === locationId);
    if (!location) return null;

    const stats = location.propertyStats;
    const types = location.propertyTypes;
    
    return {
      overview: {
        totalProperties: stats.totalProperties,
        availableProperties: stats.availableProperties,
        availability: ((stats.availableProperties / stats.totalProperties) * 100).toFixed(1),
        occupancyRate: stats.occupancyRate
      },
      pricing: {
        average: stats.avgPricePerSqFt,
        range: stats.priceRange,
        appreciation: stats.yearlyAppreciation
      },
      propertyBreakdown: Object.entries(types).map(([type, data]) => ({
        type,
        ...data,
        percentage: ((data.count / stats.totalProperties) * 100).toFixed(1)
      }))
    };
  },

  // Compare locations
  compareLocations: (locationIds) => {
    return locationIds.map(id => {
      const location = locationsData.find(loc => loc.id === id);
      if (!location) return null;
      
      return {
        id: location.id,
        name: location.name,
        zone: location.zone.name,
        avgPrice: location.propertyStats.avgPricePerSqFt,
        availability: location.propertyStats.availableProperties,
        occupancy: location.propertyStats.occupancyRate,
        appreciation: location.propertyStats.yearlyAppreciation,
        transport: location.infrastructure?.transport,
        majorCompanies: location.demographics?.majorCompanies?.length || 0
      };
    }).filter(Boolean);
  },

  // Search locations
  searchLocations: (query) => {
    const lowercaseQuery = query.toLowerCase();
    return locationsData.filter(location => 
      location.name.toLowerCase().includes(lowercaseQuery) ||
      location.description.toLowerCase().includes(lowercaseQuery) ||
      location.highlights.some(h => h.toLowerCase().includes(lowercaseQuery)) ||
      (location.zone?.name || '').toLowerCase().includes(lowercaseQuery)
    );
  },

  // Get locations map data
  getMapData: () => {
    return locationsData.map(location => ({
      id: location.id,
      name: location.name,
      coordinates: location.coordinates,
      zone: location.zone.name,
      zoneColor: location.zone.color,
      properties: location.propertyStats.availableProperties,
      avgPrice: location.propertyStats.avgPricePerSqFt
    }));
  },

  // Get zone statistics
  getZoneStats: () => {
    const zoneStats = {};
    
    Object.values(ZONES).forEach(zone => {
      const locations = locationsData.filter(loc => loc.zone.id === zone.id);
      
      zoneStats[zone.id] = {
        name: zone.name,
        locationCount: locations.length,
        totalProperties: locations.reduce((sum, loc) => 
          sum + (loc.propertyStats?.totalProperties || 0), 0
        ),
        availableProperties: locations.reduce((sum, loc) => 
          sum + (loc.propertyStats?.availableProperties || 0), 0
        ),
        avgPrice: locations.length > 0 
          ? (locations.reduce((sum, loc) => 
              sum + (loc.propertyStats?.avgPricePerSqFt || 0), 0
            ) / locations.length).toFixed(0)
          : 0,
        avgOccupancy: locations.length > 0
          ? (locations.reduce((sum, loc) => 
              sum + (loc.propertyStats?.occupancyRate || 0), 0
            ) / locations.length).toFixed(1)
          : 0
      };
    });
    
    return zoneStats;
  }
};

// Location filters configuration
export const locationFilters = {
  priceRanges: [
    { id: 'budget', label: 'Budget (< ₹50/sqft)', min: 0, max: 50 },
    { id: 'moderate', label: 'Moderate (₹50-80/sqft)', min: 50, max: 80 },
    { id: 'premium', label: 'Premium (₹80-100/sqft)', min: 80, max: 100 },
    { id: 'luxury', label: 'Luxury (> ₹100/sqft)', min: 100, max: null }
  ],
  
  propertyTypes: [
    { id: 'office', label: 'Office Spaces', icon: '🏢' },
    { id: 'retail', label: 'Retail Shops', icon: '🏪' },
    { id: 'warehouse', label: 'Warehouses', icon: '🏭' },
    { id: 'showroom', label: 'Showrooms', icon: '🏛️' },
    { id: 'coworking', label: 'Co-working', icon: '👥' },
    { id: 'industrial', label: 'Industrial', icon: '⚙️' }
  ],
  
  infrastructure: [
    { id: 'metro', label: 'Metro Connectivity', icon: '🚇' },
    { id: 'highway', label: 'Highway Access', icon: '🛣️' },
    { id: 'airport', label: 'Near Airport', icon: '✈️' },
    { id: 'railway', label: 'Railway Station', icon: '🚂' }
  ],
  
  amenities: [
    { id: 'malls', label: 'Shopping Malls', icon: '🛍️' },
    { id: 'hospitals', label: 'Healthcare', icon: '🏥' },
    { id: 'schools', label: 'Education', icon: '🏫' },
    { id: 'restaurants', label: 'Dining', icon: '🍽️' },
    { id: 'banks', label: 'Banking', icon: '🏦' }
  ]
};

// Export everything
export default {
  locationsData,
  locationUtils,
  locationFilters,
  LOCATION_TYPES,
  ZONES
};
