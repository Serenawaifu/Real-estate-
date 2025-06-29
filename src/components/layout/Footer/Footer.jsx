// ==========================================
// DGrealtors - Footer Component
// ==========================================

import React, { useState, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
  FiChevronRight,
  FiExternalLink,
  FiArrowUp
} from 'react-icons/fi';
import {
  BsFacebook,
  BsTwitter,
  BsInstagram,
  BsLinkedin,
  BsYoutube,
  BsWhatsapp,
  BsPinterest,
  BsTelegram
} from 'react-icons/bs';
import { HiOutlineNewspaper } from 'react-icons/hi';

// Components
import Logo from '../../common/Logo';
import Button from '../../common/Button';
import Input from '../../common/Input';
import Wave from '../../common/Wave';

// Hooks
import { useTheme } from '../../../hooks/useTheme';
import { useToast } from '../../../hooks/useToast';
import { useForm } from '../../../hooks/useForm';

// Utils
import { cn } from '../../../utils/cn';
import { validateEmail } from '../../../utils/validation';
import { subscribeToNewsletter } from '../../../services/newsletter';

// Styles
import styles from './Footer.module.css';

// Constants
const FOOTER_LINKS = {
  company: [
    { label: 'About Us', path: '/about' },
    { label: 'Our Team', path: '/about/team' },
    { label: 'Careers', path: '/careers', badge: 'Hiring' },
    { label: 'Press', path: '/press' },
    { label: 'Awards', path: '/about/awards' },
    { label: 'Testimonials', path: '/testimonials' }
  ],
  services: [
    { label: 'Property Listing', path: '/services/listing' },
    { label: 'Property Management', path: '/services/management' },
    { label: 'Consulting', path: '/services/consulting' },
    { label: 'Valuation', path: '/services/valuation' },
    { label: 'Legal Support', path: '/services/legal' },
    { label: 'Investment Advisory', path: '/services/investment' }
  ],
  properties: [
    { label: 'Commercial', path: '/properties/commercial' },
    { label: 'Residential', path: '/properties/residential' },
    { label: 'Industrial', path: '/properties/industrial' },
    { label: 'Land & Plots', path: '/properties/land' },
    { label: 'Featured Properties', path: '/properties/featured' },
    { label: 'New Projects', path: '/properties/new-projects' }
  ],
  resources: [
    { label: 'Blog', path: '/blog' },
    { label: 'Guides', path: '/resources/guides' },
    { label: 'Market Reports', path: '/resources/reports' },
    { label: 'Property Calculator', path: '/tools/calculator' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Help Center', path: '/help' }
  ]
};

const SOCIAL_LINKS = [
  { icon: <BsFacebook />, url: 'https://facebook.com/dgrealtors', label: 'Facebook', color: '#1877F2' },
  { icon: <BsTwitter />, url: 'https://twitter.com/dgrealtors', label: 'Twitter', color: '#1DA1F2' },
  { icon: <BsInstagram />, url: 'https://instagram.com/dgrealtors', label: 'Instagram', color: '#E4405F' },
  { icon: <BsLinkedin />, url: 'https://linkedin.com/company/dgrealtors', label: 'LinkedIn', color: '#0A66C2' },
  { icon: <BsYoutube />, url: 'https://youtube.com/dgrealtors', label: 'YouTube', color: '#FF0000' },
  { icon: <BsWhatsapp />, url: 'https://wa.me/911234567890', label: 'WhatsApp', color: '#25D366' },
  { icon: <BsPinterest />, url: 'https://pinterest.com/dgrealtors', label: 'Pinterest', color: '#E60023' },
  { icon: <BsTelegram />, url: 'https://t.me/dgrealtors', label: 'Telegram', color: '#0088CC' }
];

const CERTIFICATIONS = [
  { name: 'ISO 9001:2015', image: '/assets/certifications/iso-9001.png' },
  { name: 'RERA Certified', image: '/assets/certifications/rera.png' },
  { name: 'CREDAI Member', image: '/assets/certifications/credai.png' },
  { name: 'NAR India', image: '/assets/certifications/nar-india.png' }
];

// Newsletter Form Component
const NewsletterForm = memo(() => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { values, errors, handleChange, handleSubmit, resetForm } = useForm({
    initialValues: { email: '' },
    validate: (values) => {
      const errors = {};
      if (!values.email) {
        errors.email = 'Email is required';
      } else if (!validateEmail(values.email)) {
        errors.email = 'Invalid email address';
      }
      return errors;
    },
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        await subscribeToNewsletter(values.email);
        toast.success('Successfully subscribed to our newsletter!');
        resetForm();
      } catch (error) {
        toast.error('Failed to subscribe. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  return (
    <form onSubmit={handleSubmit} className={styles.newsletterForm}>
      <div className={styles.newsletterInputWrapper}>
        <Input
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          placeholder="Enter your email"
          error={errors.email}
          icon={<FiMail />}
          className={styles.newsletterInput}
          disabled={isSubmitting}
        />
        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={isSubmitting}
          className={styles.newsletterButton}
        >
          Subscribe
        </Button>
      </div>
      <p className={styles.newsletterDisclaimer}>
        By subscribing, you agree to our{' '}
        <Link to="/privacy" className={styles.link}>Privacy Policy</Link>
        {' '}and{' '}
        <Link to="/terms" className={styles.link}>Terms of Service</Link>
      </p>
    </form>
  );
});

NewsletterForm.displayName = 'NewsletterForm';

// Footer Link Item Component
const FooterLink = memo(({ link }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5 }}
      className={styles.footerLinkItem}
    >
      <Link to={link.path} className={styles.footerLink}>
        <span>{link.label}</span>
        {link.badge && (
          <span className={styles.badge}>{link.badge}</span>
        )}
        {link.external && <FiExternalLink className={styles.externalIcon} />}
      </Link>
    </motion.li>
  );
});

FooterLink.displayName = 'FooterLink';

// Main Footer Component
const Footer = ({ variant = 'default' }) => {
  const { theme } = useTheme();
  const controls = useAnimation();
  const [currentYear] = useState(new Date().getFullYear());
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  const [footerRef, footerInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    if (footerInView) {
      controls.start('visible');
    }
  }, [footerInView, controls]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <footer
      className={cn(styles.footer, styles[`footer--${variant}`])}
      data-theme={theme}
    >
      {/* Wave Separator */}
      <Wave className={styles.footerWave} />
      
      <motion.div
        ref={footerRef}
        className={styles.container}
        initial="hidden"
        animate={controls}
        variants={containerVariants}
      >
        {/* Main Footer Content */}
        <div className={styles.mainContent}>
          {/* Company Info */}
          <motion.div 
            className={styles.companySection}
            variants={itemVariants}
          >
            <Logo className={styles.footerLogo} variant="footer" />
            <p className={styles.companyDescription}>
              DGrealtors has been in the real estate business for over 14 years, 
              serving some of the industry's most prominent businesses with premium 
              commercial property leasing solutions.
            </p>
            
            {/* Contact Info */}
            <div className={styles.contactInfo}>
              <a href="tel:+911234567890" className={styles.contactItem}>
                <FiPhone />
                <span>+91 123 456 7890</span>
              </a>
              <a href="mailto:contact@dgrealtors.in" className={styles.contactItem}>
                <FiMail />
                <span>contact@dgrealtors.in</span>
              </a>
              <div className={styles.contactItem}>
                <FiMapPin />
                <span>123 Business Park, Mumbai 400001</span>
              </div>
              <div className={styles.contactItem}>
                <FiClock />
                <span>Mon-Sat: 9:00 AM - 6:00 PM</span>
              </div>
            </div>

            {/* Social Links */}
            <div className={styles.socialSection}>
              <h4 className={styles.socialTitle}>Follow Us</h4>
              <div className={styles.socialLinks}>
                {SOCIAL_LINKS.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                    aria-label={social.label}
                    whileHover={{ 
                      scale: 1.1,
                      backgroundColor: social.color,
                      color: '#fff'
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Links Sections */}
          <div className={styles.linksGrid}>
            {/* Company Links */}
            <motion.div 
              className={styles.linkSection}
              variants={itemVariants}
            >
              <h3 className={styles.linkTitle}>Company</h3>
              <ul className={styles.linkList}>
                {FOOTER_LINKS.company.map((link) => (
                  <FooterLink key={link.path} link={link} />
                ))}
              </ul>
            </motion.div>

            {/* Services Links */}
            <motion.div 
              className={styles.linkSection}
              variants={itemVariants}
            >
              <h3 className={styles.linkTitle}>Services</h3>
              <ul className={styles.linkList}>
                {FOOTER_LINKS.services.map((link) => (
                  <FooterLink key={link.path} link={link} />
                ))}
              </ul>
            </motion.div>

            {/* Properties Links */}
            <motion.div 
              className={styles.linkSection}
              variants={itemVariants}
            >
              <h3 className={styles.linkTitle}>Properties</h3>
              <ul className={styles.linkList}>
                {FOOTER_LINKS.properties.map((link) => (
                  <FooterLink key={link.path} link={link} />
                ))}
              </ul>
            </motion.div>

            {/* Resources Links */}
            <motion.div 
              className={styles.linkSection}
              variants={itemVariants}
            >
              <h3 className={styles.linkTitle}>Resources</h3>
              <ul className={styles.linkList}>
                {FOOTER_LINKS.resources.map((link) => (
                  <FooterLink key={link.path} link={link} />
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Newsletter Section */}
          <motion.div 
            className={styles.newsletterSection}
            variants={itemVariants}
          >
            <div className={styles.newsletterHeader}>
              <HiOutlineNewspaper className={styles.newsletterIcon} />
              <div>
                <h3 className={styles.newsletterTitle}>Stay Updated</h3>
                <p className={styles.newsletterSubtitle}>
                  Get the latest property updates and market insights
                </p>
              </div>
            </div>
            <NewsletterForm />
            
            {/* Mobile Apps */}
            <div className={styles.mobileApps}>
              <h4 className={styles.appsTitle}>Download Our App</h4>
              <div className={styles.appButtons}>
                <a 
                  href="https://apps.apple.com/dgrealtors" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.appButton}
                >
                  <img src="https://placehold.co/150x50" alt="Download DGrealtors app from App Store - iOS application for browsing commercial properties" />
                </a>
                <a 
                  href="https://play.google.com/store/dgrealtors" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.appButton}
                >
                  <img src="https://placehold.co/150x50" alt="Download DGrealtors app from Google Play Store - Android application for real estate browsing" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Certifications */}
        <motion.div 
          className={styles.certifications}
          variants={itemVariants}
        >
          <h4 className={styles.certTitle}>Certifications & Memberships</h4>
          <div className={styles.certList}>
            {CERTIFICATIONS.map((cert) => (
              <div key={cert.name} className={styles.certItem}>
                <img 
                  src={cert.image} 
                  alt={cert.name}
                  className={styles.certImage}
                />
                <span className={styles.certName}>{cert.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div 
          className={styles.bottomBar}
          variants={itemVariants}
        >
          <div className={styles.bottomContent}>
            <div className={styles.copyright}>
              <p>&copy; {currentYear} DGrealtors. All rights reserved.</p>
              <p className={styles.tagline}>Building Dreams, Creating Value</p>
            </div>
            
            <nav className={styles.bottomLinks}>
              <Link to="/privacy" className={styles.bottomLink}>Privacy Policy</Link>
              <Link to="/terms" className={styles.bottomLink}>Terms of Service</Link>
              <Link to="/sitemap" className={styles.bottomLink}>Sitemap</Link>
              <Link to="/accessibility" className={styles.bottomLink}>Accessibility</Link>
              <Link to="/cookies" className={styles.bottomLink}>Cookie Policy</Link>
            </nav>

            <div className={styles.bottomActions}>
              <select 
                className={styles.languageSelector}
                aria-label="Select language"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
                <option value="mr">मराठी</option>
                <option value="gu">ગુજરાતી</option>
              </select>
              
              <select 
                className={styles.currencySelector}
                aria-label="Select currency"
              >
                <option value="INR">₹ INR</option>
                <option value="USD">$ USD</option>
                <option value="EUR">€ EUR</option>
              </select>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            className={styles.backToTop}
            onClick={scrollToTop}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Back to top"
          >
            <FiArrowUp />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default memo(Footer);
   
