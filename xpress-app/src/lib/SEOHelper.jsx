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
  "description": "Your one-stop shop for quality auto parts and accessories with Xpress Search intelligent vehicle search.",
  "sameAs": [
    "https://www.facebook.com/xpressautozone",
    "https://www.instagram.com/xpressautozone",
    "https://www.twitter.com/xpressautozone"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Support",
    "telephone": "+1-XXX-XXX-XXXX",
    "email": "support@xpressautozone.com"
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
