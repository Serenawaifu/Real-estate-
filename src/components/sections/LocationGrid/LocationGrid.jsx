// ==========================================
// DGrealtors - Location Grid Component
// ==========================================

import React, { useState, useEffect, useRef, useMemo, memo } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import mapboxgl from 'mapbox-gl';
import { 
  FiMapPin, 
  FiHome, 
  FiTrendingUp, 
  FiDollarSign,
  FiMaximize,
  FiCalendar,
  FiEye,
  FiHeart,
  FiShare2,
  FiFilter,
  FiGrid,
  FiList,
  FiMap
} from 'react-icons/fi';
import { BsBuilding, BsShop, BsHouseDoor } from 'react-icons/bs';
import { HiOutlineOfficeBuilding } from 'react-icons/hi';

// Components
import SearchBar from '../../common/SearchBar';
import FilterPanel from '../../common/FilterPanel';
import SortDropdown from '../../common/SortDropdown';
import LoadingSpinner from '../../common/LoadingSpinner';

// Hooks
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import { useDebounce } from '../../../hooks/useDebounce';

// Utils
import { cn } from '../../../utils/cn';
import { formatCurrency, formatNumber, formatArea } from '../../../utils/format';

// Styles
import 'mapbox-gl/dist/mapbox-gl.css';
import styles from './LocationGrid.module.css';

// Constants
const LOCATIONS_DATA = [
  {
    id: 1,
    name: 'Bandra Kurla Complex',
    area: 'Mumbai',
    type: 'commercial',
    coordinates: { lat: 19.0669, lng: 72.8711 },
    properties: 45,
    avgPrice: 25000,
    priceChange: 12.5,
    popularFor: ['IT Parks', 'Corporate Offices', 'Banks'],
    image: 'https://placehold.co/400x300',
    description: 'Premier business district with modern infrastructure',
    amenities: ['Metro', 'Restaurants', 'Hotels', 'Banks'],
    featured: true,
    stats: {
      totalArea: '340,000',
      occupancy: '95%',
      avgRent: '₹150-300/sq.ft',
      yearBuilt: '2000-Present'
    }
  },
  {
    id: 2,
    name: 'Lower Parel',
    area: 'Mumbai',
    type: 'commercial',
    coordinates: { lat: 19.0037, lng: 72.8295 },
    properties: 38,
    avgPrice: 22000,
    priceChange: 8.3,
    popularFor: ['Tech Companies', 'Media Houses', 'Startups'],
    image: 'https://placehold.co/400x300',
    description: 'Transformed mill district, now a corporate hub',
    amenities: ['Railway', 'Malls', 'Cafes', 'Gyms'],
    stats: {
      totalArea: '280,000',
      occupancy: '92%',
      avgRent: '₹120-250/sq.ft',
      yearBuilt: '2005-Present'
    }
  },
  // Add more locations...
];

const PROPERTY_TYPES = [
  { id: 'all', label: 'All Types', icon: <FiGrid /> },
  { id: 'commercial', label: 'Commercial', icon: <BsBuilding /> },
  { id: 'retail', label: 'Retail', icon: <BsShop /> },
  { id: 'residential', label: 'Residential', icon: <BsHouseDoor /> },
  { id: 'industrial', label: 'Industrial', icon: <HiOutlineOfficeBuilding /> }
];

const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'properties', label: 'Most Properties' },
  { value: 'newest', label: 'Newest First' }
];

const VIEW_MODES = [
  { id: 'grid', icon: <FiGrid />, label: 'Grid View' },
  { id: 'list', icon: <FiList />, label: 'List View' },
  { id: 'map', icon: <FiMap />, label: 'Map View' }
];

// Location Card Component
const LocationCard = memo(({ location, index, viewMode, onCardClick, onFavorite }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const cardRef = useRef(null);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    if (onFavorite) onFavorite(location, !isFavorite);
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      rotateX: -15 
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: 'easeOut'
      }
    },
    hover: {
      y: -10,
      scale: 1.02,
      rotateY: 5,
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    }
  };

  const getPropertyIcon = (type) => {
    switch (type) {
      case 'commercial': return <BsBuilding />;
      case 'retail': return <BsShop />;
      case 'residential': return <BsHouseDoor />;
      case 'industrial': return <HiOutlineOfficeBuilding />;
      default: return <FiHome />;
    }
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        className={styles.locationListItem}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        onClick={() => onCardClick(location)}
      >
        <div className={styles.listImage}>
          <img src={location.image} alt={location.name} />
          {location.featured && <span className={styles.featuredBadge}>Featured</span>}
        </div>
        
        <div className={styles.listContent}>
          <div className={styles.listHeader}>
            <h3 className={styles.listTitle}>{location.name}</h3>
            <span className={styles.listArea}>{location.area}</span>
          </div>
          
          <p className={styles.listDescription}>{location.description}</p>
          
          <div className={styles.listStats}>
            <div className={styles.statItem}>
              <FiHome />
              <span>{location.properties} Properties</span>
            </div>
            <div className={styles.statItem}>
              <FiDollarSign />
              <span>{formatCurrency(location.avgPrice)}/sq.ft</span>
            </div>
            <div className={styles.statItem}>
              <FiTrendingUp />
              <span className={cn(styles.priceChange, {
                [styles.positive]: location.priceChange > 0,
                [styles.negative]: location.priceChange < 0
              })}>
                {location.priceChange > 0 ? '+' : ''}{location.priceChange}%
              </span>
            </div>
          </div>
          
          <div className={styles.listAmenities}>
            {location.amenities.map((amenity, idx) => (
              <span key={idx} className={styles.amenityTag}>{amenity}</span>
            ))}
          </div>
        </div>
        
        <div className={styles.listActions}>
          <motion.button
            className={styles.actionButton}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleFavoriteClick}
          >
            <FiHeart className={cn({ [styles.filled]: isFavorite })} />
          </motion.button>
          <motion.button
            className={styles.actionButton}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiShare2 />
          </motion.button>
          <motion.button
            className={styles.primaryButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Details
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={cardRef}
      className={cn(styles.locationCard, {
        [styles.featured]: location.featured,
        [styles.hovered]: isHovered
      })}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onCardClick(location)}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1000
      }}
    >
      {/* Sticky Note Design */}
      <div className={styles.stickyCorner} />
      
      {/* Image Section */}
      <div className={styles.cardImageWrapper}>
        <motion.img
          src={location.image}
          alt={`${location.name} - Premium ${location.type} properties in ${location.area}`}
          className={styles.cardImage}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Overlay Gradient */}
        <div className={styles.imageOverlay} />
        
        {/* Featured Badge */}
        {location.featured && (
          <motion.div
            className={styles.featuredBadge}
            initial={{ rotate: -2 }}
            animate={{ rotate: 2 }}
            transition={{ repeat: Infinity, duration: 2, repeatType: 'reverse' }}
          >
            Featured
          </motion.div>
        )}
        
        {/* Property Type */}
        <div className={styles.propertyType}>
          {getPropertyIcon(location.type)}
          <span>{location.type}</span>
        </div>
        
        {/* Quick Actions */}
        <div className={styles.quickActions}>
          <motion.button
            className={cn(styles.actionIcon, { [styles.active]: isFavorite })}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleFavoriteClick}
          >
            <FiHeart />
          </motion.button>
          <motion.button
            className={styles.actionIcon}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiShare2 />
          </motion.button>
        </div>
      </div>
      
      {/* Content Section */}
      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <h3 className={styles.locationName}>{location.name}</h3>
          <p className={styles.locationArea}>
            <FiMapPin />
            {location.area}
          </p>
        </div>
        
        <p className={styles.locationDescription}>{location.description}</p>
        
        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          <div className={styles.statBox}>
            <FiHome className={styles.statIcon} />
            <div>
              <span className={styles.statValue}>{location.properties}</span>
              <span className={styles.statLabel}>Properties</span>
            </div>
          </div>
          
          <div className={styles.statBox}>
            <FiDollarSign className={styles.statIcon} />
            <div>
              <span className={styles.statValue}>{formatCurrency(location.avgPrice)}</span>
              <span className={styles.statLabel}>Avg/sq.ft</span>
            </div>
          </div>
          
          <div className={styles.statBox}>
            <FiTrendingUp className={styles.statIcon} />
            <div>
              <span className={cn(styles.statValue, {
                [styles.positive]: location.priceChange > 0,
                [styles.negative]: location.priceChange < 0
              })}>
                {location.priceChange > 0 ? '+' : ''}{location.priceChange}%
              </span>
              <span className={styles.statLabel}>YoY</span>
            </div>
          </div>
        </div>
        
        {/* Popular For */}
        <div className={styles.popularFor}>
          <p className={styles.popularLabel}>Popular for:</p>
          <div className={styles.popularTags}>
            {location.popularFor.map((item, idx) => (
              <span key={idx} className={styles.popularTag}>{item}</span>
            ))}
          </div>
        </div>
        
        {/* Amenities */}
        <div className={styles.amenities}>
          {location.amenities.slice(0, 3).map((amenity, idx) => (
            <span key={idx} className={styles.amenityChip}>
              {amenity}
            </span>
          ))}
          {location.amenities.length > 3 && (
            <span className={styles.amenityMore}>
              +{location.amenities.length - 3} more
            </span>
          )}
        </div>
        
        {/* Hover Stats */}
        <AnimatePresence>
          {isHovered && (
            <motion.button
              className={styles.viewMore}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiEye />
              View Details
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      
      {/* Detailed Stats Overlay */}
      <AnimatePresence>
        {showStats && location.stats && (
          <motion.div
            className={styles.statsOverlay}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            {Object.entries(location.stats).map(([key, value]) => (
              <div key={key} className={styles.statDetail}>
                <span className={styles.statDetailLabel}>
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </span>
                <span className={styles.statDetailValue}>{value}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

LocationCard.displayName = 'LocationCard';

// Map View Component
const MapView = memo(({ locations, selectedLocation, onLocationSelect }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!map.current && mapContainer.current) {
      mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN || '';
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [72.8777, 19.0760], // Mumbai coordinates
        zoom: 11
      });

      map.current.on('load', () => {
        setMapLoaded(true);

        // Add markers for each location
        locations.forEach(location => {
          const el = document.createElement('div');
          el.className = styles.mapMarker;
          el.innerHTML = `
            <div class="${styles.markerContent}">
              <span class="${styles.markerPrice}">${formatCurrency(location.avgPrice)}</span>
              <span class="${styles.markerProperties}">${location.properties}</span>
            </div>
          `;

          new mapboxgl.Marker(el)
            .setLngLat([location.coordinates.lng, location.coordinates.lat])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 })
                .setHTML(`
                  <div class="${styles.popupContent}">
                    <h3>${location.name}</h3>
                    <p>${location.area}</p>
                    <p>${location.properties} properties available</p>
                  </div>
                `)
            )
            .addTo(map.current);

          el.addEventListener('click', () => {
            onLocationSelect(location);
          });
        });
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [locations, onLocationSelect]);

  return (
    <div className={styles.mapContainer}>
      <div ref={mapContainer} className={styles.map} />
      {!mapLoaded && (
        <div className={styles.mapLoading}>
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
});

MapView.displayName = 'MapView';

// Main Location Grid Component
const LocationGrid = ({ 
  variant = 'grid',
  showFilters = true,
  showSearch = true,
  defaultViewMode = 'grid',
  onLocationClick,
  className 
}) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const controls = useAnimation();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');

  const [locations, setLocations] = useState(LOCATIONS_DATA);
  const [filteredLocations, setFilteredLocations] = useState(LOCATIONS_DATA);
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState(defaultViewMode);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Filter and sort locations
  useEffect(() => {
    let filtered = [...locations];

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(loc => loc.type === selectedType);
    }

    // Filter by search
    if (debouncedSearch) {
      filtered = filtered.filter(loc => 
        loc.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        loc.area.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        loc.popularFor.some(item => 
          item.toLowerCase().includes(debouncedSearch.toLowerCase())
        )
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.avgPrice - b.avgPrice);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.avgPrice - a.avgPrice);
        break;
      case 'properties':
        filtered.sort((a, b) => b.properties - a.properties);
        break;
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      default: // popular
        filtered.sort((a, b) => b.featured - a.featured);
    }

    setFilteredLocations(filtered);
  }, [locations, selectedType, sortBy, debouncedSearch]);

  // Animate on view
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [inView, controls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
    if (onLocationClick) {
      onLocationClick(location);
    }
  };

  const getGridColumns = () => {
    if (viewMode === 'list') return 1;
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 3;
  };

  return (
    <section ref={ref} className={cn(styles.locationGrid, className)}>
      <div className={styles.container}>
        {/* Header */}
        <motion.div 
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.headerContent}>
            <span className={styles.sectionLabel}>Prime Locations</span>
            <h2 className={styles.sectionTitle}>
              Discover Mumbai's Best Commercial Areas
            </h2>
            <p className={styles.sectionSubtitle}>
              Explore prime locations with high-growth potential and excellent connectivity
            </p>
          </div>
          
          {/* View Mode Switcher */}
          <div className={styles.viewModeSwitcher}>
            {VIEW_MODES.map(mode => (
              <motion.button
                key={mode.id}
                className={cn(styles.viewModeButton, {
                  [styles.active]: viewMode === mode.id
                })}
                onClick={() => setViewMode(mode.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={mode.label}
              >
                {mode.icon}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Controls Bar */}
        <motion.div 
          className={styles.controlsBar}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Search */}
          {showSearch && (
            <div className={styles.searchWrapper}>
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search locations, areas, or features..."
                className={styles.searchBar}
              />
            </div>
          )}
          
          {/* Filters */}
          {showFilters && (
            <>
              <div className={styles.filterButtons}>
                {PROPERTY_TYPES.map(type => (
                  <motion.button
                    key={type.id}
                    className={cn(styles.filterButton, {
                      [styles.active]: selectedType === type.id
                    })}
                    onClick={() => setSelectedType(type.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {type.icon}
                    <span>{type.label}</span>
                  </motion.button>
                ))}
              </div>
              
              <motion.button
                className={styles.advancedFilter}
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiFilter />
                Advanced Filters
              </motion.button>
            </>
          )}
          
          {/* Sort */}
          <SortDropdown
            options={SORT_OPTIONS}
            value={sortBy}
            onChange={setSortBy}
            className={styles.sortDropdown}
          />
        </motion.div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilterPanel && (
            <FilterPanel
              onClose={() => setShowFilterPanel(false)}
              onApply={(filters) => {
                // Apply advanced filters
                console.log('Applied filters:', filters);
                setShowFilterPanel(false);
              }}
            />
          )}
        </AnimatePresence>

        {/* Results Count */}
        <motion.div 
          className={styles.resultsInfo}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span className={styles.resultsCount}>
            {filteredLocations.length} locations found
          </span>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              className={styles.loading}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoadingSpinner size="large" />
            </motion.div>
          ) : viewMode === 'map' ? (
            <motion.div
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.mapViewWrapper}
            >
              <MapView
                locations={filteredLocations}
                selectedLocation={selectedLocation}
                onLocationSelect={handleLocationClick}
              />
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              className={cn(styles.locationsContainer, styles[`view--${viewMode}`])}
              variants={containerVariants}
              initial="hidden"
              animate={controls}
              style={{
                gridTemplateColumns: viewMode === 'grid' 
                  ? `repeat(${getGridColumns()}, 1fr)` 
                  : '1fr'
              }}
            >
              {filteredLocations.map((location, index) => (
                <LocationCard
                  key={location.id}
                  location={location}
                  index={index}
                  viewMode={viewMode}
                  onCardClick={handleLocationClick}
                  onFavorite={(loc, isFav) => {
                    console.log(`${isFav ? 'Added' : 'Removed'} ${loc.name} to favorites`);
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!loading && filteredLocations.length === 0 && (
          <motion.div
            className={styles.emptyState}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <FiMapPin className={styles.emptyIcon} />
            <h3>No locations found</h3>
            <p>Try adjusting your filters or search terms</p>
            <button
              className={styles.resetButton}
              onClick={() => {
                setSelectedType('all');
                setSearchQuery('');
                setSortBy('popular');
              }}
            >
              Reset Filters
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default memo(LocationGrid);
