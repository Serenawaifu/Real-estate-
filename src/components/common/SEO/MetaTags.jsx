import React, { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

const MetaTags = ({
  // Basic Meta
  title,
  titleTemplate = '%s | DGrealtors',
  description,
  keywords = [],
  author = 'DGrealtors',
  language = 'en',
  viewport = 'width=device-width, initial-scale=1.0',
  
  // URLs
  canonical,
  alternates = [],
  
  // Open Graph
  ogType = 'website',
  ogTitle,
  ogDescription,
  ogImage,
  ogImageAlt,
  ogImageType = 'image/jpeg',
  ogImageWidth = 1200,
  ogImageHeight = 630,
  ogUrl,
  ogSiteName = 'DGrealtors',
  ogLocale = 'en_US',
  ogLocaleAlternate = [],
  
  // Twitter Card
  twitterCard = 'summary_large_image',
  twitterTitle,
  twitterDescription,
  twitterImage,
  twitterImageAlt,
  twitterSite = '@dgrealtors',
  twitterCreator = '@dgrealtors',
  
  // Article Meta (for blog posts)
  article = null,
  
  // Business/Local SEO
  business = {
    name: 'DGrealtors',
    type: 'RealEstateAgent',
    image: '/logo.png',
    priceRange: '$$',
    address: {
      streetAddress: 'Shop No 11, T S Complex, Shop Siddhi Enclave CHS Ltd',
      addressLocality: 'Wakad',
      addressRegion: 'Pune',
      postalCode: '411057',
      addressCountry: 'IN'
    },
    geo: {
      latitude: '18.5912716',
      longitude: '73.7610976'
    },
    telephone: '+919876543210',
    openingHours: 'Mo-Sa 09:00-19:00',
    url: 'https://dgrealtors.com',
    sameAs: [],
    aggregateRating: null
  },
  
  // Product (for property listings)
  product = null,
  
  // Real Estate specific
  property = null,
  
  // Additional Meta
  robots = 'index, follow',
  googlebot = 'index, follow',
  themeColor = '#ffd9a0',
  applicationName = 'DGrealtors',
  appleStatusBarStyle = 'default',
  formatDetection = 'telephone=yes',
  
  // Security
  contentSecurityPolicy,
  referrerPolicy = 'strict-origin-when-cross-origin',
  
  // Advanced SEO
  ldJson = [],
  customMeta = [],
  
  // Preconnect domains
  preconnectDomains = [],
  dnsPrefetchDomains = [],
  
  // Social profiles
  socialProfiles = {
    facebook: 'https://facebook.com/dgrealtors',
    instagram: 'https://instagram.com/dgrealtors',
    linkedin: 'https://linkedin.com/company/dgrealtors',
    youtube: 'https://youtube.com/dgrealtors'
  }
}) => {
  // Generate page title
  const pageTitle = titleTemplate ? titleTemplate.replace('%s', title) : title;
  
  // Use OG/Twitter fallbacks
  const ogTitleFinal = ogTitle || title;
  const ogDescriptionFinal = ogDescription || description;
  const ogUrlFinal = ogUrl || (typeof window !== 'undefined' ? window.location.href : '');
  const twitterTitleFinal = twitterTitle || ogTitleFinal;
  const twitterDescriptionFinal = twitterDescription || ogDescriptionFinal;
  const twitterImageFinal = twitterImage || ogImage;
  const twitterImageAltFinal = twitterImageAlt || ogImageAlt;

  // Generate breadcrumb structured data
  const generateBreadcrumbLD = () => {
    const breadcrumbs = window.location.pathname.split('/').filter(Boolean);
    const items = breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.charAt(0).toUpperCase() + crumb.slice(1).replace(/-/g, ' '),
      item: `${window.location.origin}/${breadcrumbs.slice(0, index + 1).join('/')}`
    }));

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items
    };
  };

  // Generate business structured data
  const generateBusinessLD = () => {
    if (!business) return null;

    const businessLD = {
      '@context': 'https://schema.org',
      '@type': business.type || 'RealEstateAgent',
      name: business.name,
      image: business.image,
      priceRange: business.priceRange,
      address: {
        '@type': 'PostalAddress',
        ...business.address
      },
      geo: {
        '@type': 'GeoCoordinates',
        ...business.geo
      },
      telephone: business.telephone,
      openingHours: business.openingHours,
      url: business.url,
      sameAs: [
        ...Object.values(socialProfiles).filter(Boolean),
        ...(business.sameAs || [])
      ]
    };

    if (business.aggregateRating) {
      businessLD.aggregateRating = {
        '@type': 'AggregateRating',
        ...business.aggregateRating
      };
    }

    return businessLD;
  };

  // Generate property structured data
  const generatePropertyLD = () => {
    if (!property) return null;

    return {
      '@context': 'https://schema.org',
      '@type': 'RealEstateListing',
      name: property.name,
      description: property.description,
      image: property.images,
      propertyType: property.type,
      address: {
        '@type': 'PostalAddress',
        ...property.address
      },
      geo: {
        '@type': 'GeoCoordinates',
        ...property.geo
      },
      price: {
        '@type': 'PriceSpecification',
        price: property.price,
        priceCurrency: property.currency || 'INR'
      },
      floorSize: {
        '@type': 'QuantitativeValue',
        value: property.size,
        unitCode: 'SQFT'
      },
      numberOfRooms: property.rooms,
      amenities: property.amenities,
      datePosted: property.datePosted,
      availability: property.availability || 'Available'
    };
  };

  // Generate article structured data
  const generateArticleLD = () => {
    if (!article) return null;

    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.headline || title,
      description: article.description || description,
      image: article.image || ogImage,
      author: {
        '@type': 'Person',
        name: article.author || author
      },
      publisher: {
        '@type': 'Organization',
        name: business.name,
        logo: {
          '@type': 'ImageObject',
          url: business.image
        }
      },
      datePublished: article.datePublished,
      dateModified: article.dateModified || article.datePublished,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': ogUrlFinal
      }
    };
  };

  // Generate product structured data
  const generateProductLD = () => {
    if (!product) return null;

    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: product.images,
      brand: {
        '@type': 'Brand',
        name: business.name
      },
      offers: {
        '@type': 'Offer',
        url: product.url || ogUrlFinal,
        priceCurrency: product.currency || 'INR',
        price: product.price,
        priceValidUntil: product.priceValidUntil,
        availability: product.availability || 'https://schema.org/InStock'
      }
    };
  };

  // Generate FAQ structured data
  const generateFAQLD = (faqs) => {
    if (!faqs || !faqs.length) return null;

    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    };
  };

  // Combine all structured data
  const structuredData = useMemo(() => {
    const data = [];
    
    // Add business data on all pages
    const businessLD = generateBusinessLD();
    if (businessLD) data.push(businessLD);
    
    // Add breadcrumbs
    if (typeof window !== 'undefined') {
      data.push(generateBreadcrumbLD());
    }
    
    // Add specific structured data
    const propertyLD = generatePropertyLD();
    if (propertyLD) data.push(propertyLD);
    
    const articleLD = generateArticleLD();
    if (articleLD) data.push(articleLD);
    
    const productLD = generateProductLD();
    if (productLD) data.push(productLD);
    
    // Add any custom structured data
    if (ldJson.length > 0) {
      data.push(...ldJson);
    }
    
    return data;
  }, [business, property, article, product, ldJson]);

  // Log meta tags in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('MetaTags rendered:', {
        title: pageTitle,
        description,
        canonical,
        ogImage,
        structuredData
      });
    }
  }, [pageTitle, description, canonical, ogImage, structuredData]);

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang={language} />
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      <meta name="author" content={author} />
      <meta name="viewport" content={viewport} />
      <meta name="theme-color" content={themeColor} />
      <meta name="application-name" content={applicationName} />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Alternate Languages */}
      {alternates.map((alternate, index) => (
        <link
          key={index}
          rel="alternate"
          hreflang={alternate.hreflang}
          href={alternate.href}
        />
      ))}

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={ogTitleFinal} />
      <meta property="og:description" content={ogDescriptionFinal} />
      <meta property="og:url" content={ogUrlFinal} />
      <meta property="og:site_name" content={ogSiteName} />
      <meta property="og:locale" content={ogLocale} />
      {ogLocaleAlternate.map((locale, index) => (
        <meta key={index} property="og:locale:alternate" content={locale} />
      ))}
      
      {/* Open Graph Image */}
      {ogImage && (
        <>
          <meta property="og:image" content={ogImage} />
          <meta property="og:image:type" content={ogImageType} />
          <meta property="og:image:width" content={ogImageWidth} />
          <meta property="og:image:height" content={ogImageHeight} />
          {ogImageAlt && <meta property="og:image:alt" content={ogImageAlt} />}
        </>
      )}

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={twitterTitleFinal} />
      <meta name="twitter:description" content={twitterDescriptionFinal} />
      <meta name="twitter:site" content={twitterSite} />
      <meta name="twitter:creator" content={twitterCreator} />
      {twitterImageFinal && (
        <>
          <meta name="twitter:image" content={twitterImageFinal} />
          {twitterImageAltFinal && (
            <meta name="twitter:image:alt" content={twitterImageAltFinal} />
          )}
        </>
      )}

      {/* Article Meta (for blogs) */}
      {article && (
        <>
          <meta property="article:author" content={article.author || author} />
          <meta property="article:published_time" content={article.datePublished} />
          {article.dateModified && (
            <meta property="article:modified_time" content={article.dateModified} />
          )}
          {article.tags && article.tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Robots Meta */}
      <meta name="robots" content={robots} />
      <meta name="googlebot" content={googlebot} />

      {/* Apple Specific */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content={appleStatusBarStyle} />
      <meta name="format-detection" content={formatDetection} />

      {/* Security */}
      {contentSecurityPolicy && (
        <meta http-equiv="Content-Security-Policy" content={contentSecurityPolicy} />
      )}
      <meta name="referrer" content={referrerPolicy} />

      {/* Preconnect/DNS Prefetch */}
      {preconnectDomains.map((domain, index) => (
        <link key={index} rel="preconnect" href={domain} />
      ))}
      {dnsPrefetchDomains.map((domain, index) => (
        <link key={index} rel="dns-prefetch" href={domain} />
      ))}

      {/* Custom Meta Tags */}
      {customMeta.map((meta, index) => {
        if (meta.property) {
          return <meta key={index} property={meta.property} content={meta.content} />;
        }
        return <meta key={index} name={meta.name} content={meta.content} />;
      })}

      {/* Structured Data */}
      {structuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}

      {/* Favicon Set */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color={themeColor} />
    </Helmet>
  );
};

MetaTags.propTypes = {
  title: PropTypes.string.isRequired,
  titleTemplate: PropTypes.string,
  description: PropTypes.string.isRequired,
  keywords: PropTypes.arrayOf(PropTypes.string),
  author: PropTypes.string,
  language: PropTypes.string,
  viewport: PropTypes.string,
  canonical: PropTypes.string,
  alternates: PropTypes.arrayOf(PropTypes.shape({
    hreflang: PropTypes.string,
    href: PropTypes.string
  })),
  ogType: PropTypes.string,
  ogTitle: PropTypes.string,
  ogDescription: PropTypes.string,
  ogImage: PropTypes.string,
  ogImageAlt: PropTypes.string,
  ogImageType: PropTypes.string,
  ogImageWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ogImageHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ogUrl: PropTypes.string,
  ogSiteName: PropTypes.string,
  ogLocale: PropTypes.string,
  ogLocaleAlternate: PropTypes.arrayOf(PropTypes.string),
  twitterCard: PropTypes.oneOf(['summary', 'summary_large_image', 'app', 'player']),
  twitterTitle: PropTypes.string,
  twitterDescription: PropTypes.string,
  twitterImage: PropTypes.string,
  twitterImageAlt: PropTypes.string,
  twitterSite: PropTypes.string,
  twitterCreator: PropTypes.string,
  article: PropTypes.shape({
    author: PropTypes.string,
    datePublished: PropTypes.string,
    dateModified: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string)
  }),
  business: PropTypes.object,
  product: PropTypes.object,
  property: PropTypes.object,
  robots: PropTypes.string,
  googlebot: PropTypes.string,
  themeColor: PropTypes.string,
  applicationName: PropTypes.string,
  appleStatusBarStyle: PropTypes.string,
  formatDetection: PropTypes.string,
  contentSecurityPolicy: PropTypes.string,
  referrerPolicy: PropTypes.string,
  ldJson: PropTypes.arrayOf(PropTypes.object),
  customMeta: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    property: PropTypes.string,
    content: PropTypes.string
  })),
  preconnectDomains: PropTypes.arrayOf(PropTypes.string),
  dnsPrefetchDomains: PropTypes.arrayOf(PropTypes.string),
  socialProfiles: PropTypes.object
};

// Export utility functions
export const generateMetaTags = (page) => {
  const baseMeta = {
    titleTemplate: '%s | DGrealtors - Commercial Property Experts',
    ogSiteName: 'DGrealtors',
    twitterSite: '@dgrealtors',
    keywords: ['commercial property', 'real estate', 'pune', 'wakad', 'office space', 'retail space']
  };

  switch (page.type) {
    case 'home':
      return {
        ...baseMeta,
        title: 'Commercial Property Leasing Experts in Pune',
        description: 'Find premium commercial properties in Pune with DGrealtors. 14+ years of expertise in office spaces, retail shops, warehouses, and more.',
        ogType: 'website'
      };
    
    case 'listing':
      return {
        ...baseMeta,
        title: page.title,
        description: page.description,
        ogType: 'website',
        property: page.property
      };
    
    case 'blog':
      return {
        ...baseMeta,
        title: page.title,
        description: page.description,
        ogType: 'article',
        article: page.article
      };
    
    default:
      return baseMeta;
  }
};

export default MetaTags;

        
