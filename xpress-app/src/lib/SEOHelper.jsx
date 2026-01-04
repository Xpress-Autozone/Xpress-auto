import { Helmet } from 'react-helmet-async';

/**
 * generateOrganizationSchema - Creates JSON-LD structured data for the organization
 */
export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Xpress Autozone",
  "url": "https://xpressautozone.com",
  "logo": "https://xpressautozone.com/assets/favicon.png",
  "description": "Ghana's premier verified aftermarket platform for authentic vehicle components. Your one-stop pit stop for genuine parts, expert support, and Xpress delivery.",
  "sameAs": [
    "https://www.facebook.com/xpressautozone",
    "https://www.instagram.com/xpressautozone"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Support",
    "telephone": "+233209021991",
    "email": "xpressautozone@gmail.com"
  },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Accra",
    "addressCountry": "Ghana"
  }
});

/**
 * generateSearchActionSchema - Creates schema for Google Search Action with Xpress Search
 */
export const generateSearchActionSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": "https://xpressautozone.com",
  "name": "Xpress Autozone",
  "description": "Premium auto parts and accessories with intelligent vehicle search",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://xpressautozone.com/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
});

/**
 * generateProductSchema - Creates JSON-LD for a product
 */
export const generateProductSchema = (product) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": product.name,
  "description": product.description || "",
  "image": product.image,
  "brand": {
    "@type": "Brand",
    "name": product.brand || "Xpress Autozone"
  },
  "offers": {
    "@type": "Offer",
    "url": `https://xpressautozone.com/product/${product.id}`,
    "priceCurrency": "USD",
    "price": product.price,
    "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
  },
  "aggregateRating": product.rating && {
    "@type": "AggregateRating",
    "ratingValue": product.rating.value,
    "reviewCount": product.rating.count
  }
});

/**
 * generateBreadcrumbSchema - Creates breadcrumb navigation schema
 */
export const generateBreadcrumbSchema = (breadcrumbs) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": `https://xpressautozone.com${item.url}`
  }))
});

/**
 * generateLocalBusinessSchema - Creates schema for local business information
 */
export const generateLocalBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Xpress Autozone",
  "url": "https://xpressautozone.com",
  "logo": "https://xpressautozone.com/assets/favicon.png",
  "description": "Ghana's premier verified aftermarket platform for authentic vehicle components. Your one-stop pit stop for genuine parts, expert support, and Xpress delivery.",
  "telephone": "+233209021991",
  "email": "xpressautozone@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Accra",
    "addressLocality": "Accra",
    "addressRegion": "Accra",
    "addressCountry": "Ghana"
  },
  "priceRange": "$$",
  "areaServed": "Worldwide",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Support",
    "telephone": "+233209021991",
    "email": "xpressautozone@gmail.com"
  },
  "sameAs": [
    "https://www.facebook.com/xpressautozone",
    "https://www.instagram.com/xpressautozone"
  ]
});

/**
 * generateCollectionSchema - Creates schema for product collections
 */
export const generateCollectionSchema = (collectionName, products = []) => ({
  "@context": "https://schema.org",
  "@type": "Collection",
  "name": collectionName,
  "description": `Explore our collection of ${collectionName} automotive products`,
  "url": `https://xpressautozone.com/xplore/${collectionName.toLowerCase()}`,
  "numberOfItems": products.length,
  "itemListElement": products.slice(0, 10).map((product, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "url": `https://xpressautozone.com/product/${product.id}`,
    "name": product.name,
    "image": product.image
  }))
});

/**
 * generateFAQSchema - Creates FAQ structured data
 */
export const generateFAQSchema = (faqs) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

/**
 * generateAggregateRatingSchema - Enhanced aggregate rating schema
 */
export const generateAggregateRatingSchema = (product) => {
  if (!product.rating) return null;
  
  return {
    "@context": "https://schema.org",
    "@type": "AggregateRating",
    "ratingValue": product.rating.value,
    "bestRating": "5",
    "worstRating": "1",
    "ratingCount": product.rating.count,
    "reviewCount": product.rating.reviewCount || product.rating.count
  };
};

/**
 * SEO Component - Reusable Helmet wrapper for managing meta tags
 */
export const SEO = ({
  title = "Xpress Autozone | Premium Auto Parts & Accessories",
  description = "Your one-stop shop for quality auto parts and accessories. Find genuine parts, expert advice, and fast delivery with Xpress Search.",
  keywords = "auto parts, car parts, vehicle accessories, car maintenance, auto repair parts, Xpress Autozone",
  ogImage = "/assets/og-image.jpg",
  ogUrl = "https://xpressautozone.com",
  ogType = "website",
  canonicalUrl = "https://xpressautozone.com",
  structuredData = null,
  breadcrumbs = null,
  children
}) => {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Xpress Autozone" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Xpress Autozone" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={ogUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:creator" content="@xpressautozone" />

      {/* Additional SEO */}
      <link rel="canonical" href={canonicalUrl} />
      <meta name="theme-color" content="#fff" />
      <meta name="language" content="English" />

      {/* Structured Data - JSON-LD */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}

      {/* Breadcrumb Schema */}
      {breadcrumbs && (
        <script type="application/ld+json">
          {JSON.stringify(generateBreadcrumbSchema(breadcrumbs))}
        </script>
      )}

      {children}
    </Helmet>
  );
};

export default SEO;
