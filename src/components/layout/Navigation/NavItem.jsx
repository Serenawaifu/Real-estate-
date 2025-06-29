// ==========================================
// DGrealtors - Navigation Item Component
// ==========================================

import React, { useState, memo } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';

// Styles
import styles from './NavItem.module.css';

// Sub-component for dropdown items
const DropdownItem = ({ item, onClose }) => {
  return (
    <NavLink
      to={item.path}
      className={styles.dropdownItem}
      onClick={onClose}
    >
      {item.label}
    </NavLink>
  );
};

// Main Navigation Item Component
const NavItem = memo(({ item, isActive, onMouseEnter, onMouseLeave }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div
      className={styles.navItem}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className={styles.navLink}
        onClick={hasChildren ? handleToggle : null}
      >
        <span className={styles.navLinkLabel}>{item.label}</span>
        {hasChildren && (
          <FiChevronDown
            className={`${styles.dropdownIcon} ${isExpanded ? styles.expanded : ''}`}
          />
        )}
      </div>

      <AnimatePresence>
        {isExpanded && hasChildren && (
          <motion.div
            className={styles.dropdown}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {item.children.map((child) => (
              <DropdownItem key={child.path} item={child} onClose={onMouseLeave} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

NavItem.displayName = 'NavItem';

export default NavItem;
