// ==========================================
// DGrealtors - Award Item Component
// ==========================================

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { FiTrophy } from 'react-icons/fi';
import styles from './AwardItem.module.css';

// Award Item Component
const AwardItem = memo(({ award }) => {
  const { title, year, description, icon } = award;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5 } 
    }
  };

  return (
    <motion.div 
      className={styles.awardItem} 
      variants={itemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className={styles.iconContainer}>
        {icon || <FiTrophy className={styles.defaultIcon} />}
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <span className={styles.year}>{year}</span>
        <p className={styles.description}>{description}</p>
      </div>
    </motion.div>
  );
});

AwardItem.displayName = 'AwardItem';

export default AwardItem;
