// ==========================================
// DGrealtors - Map Overlay Component
// ==========================================

import React, { useEffect, useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiX } from 'react-icons/fi';
import { useInView } from 'react-intersection-observer';
import { formatCurrency } from '../../../utils/format';
import styles from './MapOverlay.module.css';

// Map Overlay Component
const MapOverlay = memo(({ location, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    if (inView) {
      setIsVisible(true);
    }
  }, [inView]);

  const overlayVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.3 } }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={ref}
          className={styles.mapOverlay}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <button className={styles.closeButton} onClick={onClose}>
            <FiX />
          </button>
          <div className={styles.overlayContent}>
            <h3 className={styles.locationName}>{location.name}</h3>
            <p className={styles.locationArea}>
              <FiMapPin /> {location.area}
            </p>
            <p className={styles.description}>{location.description}</p>
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Properties:</span>
                <span className={styles.statValue}>{location.properties}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Avg Price:</span>
                <span className={styles.statValue}>{formatCurrency(location.avgPrice)}/sq.ft</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Price Change:</span>
                <span className={styles.statValue}>
                  {location.priceChange > 0 ? '+' : ''}{location.priceChange}%
                </span>
              </div>
            </div>
            <div className={styles.amenities}>
              <h4>Amenities:</h4>
              <ul>
                {location.amenities.map((amenity, index) => (
                  <li key={index}>{amenity}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

MapOverlay.displayName = 'MapOverlay';

export default MapOverlay;
                
