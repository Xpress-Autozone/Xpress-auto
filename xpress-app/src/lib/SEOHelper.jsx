import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://xpressautozone.com';

const SEO = ({
    title,
    description,
    keywords,
    ogUrl,
    ogImage,
    ogType = 'website',
    canonicalUrl,
    robots = 'index, follow',
    structuredData,
}) => {
    const siteTitle = 'Xpress Autozone';
    const fullTitle = title ? `${title} | ${siteTitle}` : `${siteTitle} | Premium Auto Parts & Accessories in Ghana`;

    // Ensure og:image is always an absolute URL
    const absoluteOgImage = ogImage
        ? ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`
        : `${SITE_URL}/assets/og-image.jpg`;

    const absoluteCanonical = canonicalUrl
        ? canonicalUrl.startsWith('http') ? canonicalUrl : `${SITE_URL}${canonicalUrl}`
        : null;

    const absoluteOgUrl = ogUrl
        ? ogUrl.startsWith('http') ? ogUrl : `${SITE_URL}${ogUrl}`
        : SITE_URL;

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            <meta name="robots" content={robots} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={ogType} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={absoluteOgUrl} />
            <meta property="og:image" content={absoluteOgImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content={title || 'Xpress Autozone'} />
            <meta property="og:site_name" content="Xpress Autozone" />
            <meta property="og:locale" content="en_GH" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={absoluteOgImage} />
            <meta name="twitter:image:alt" content={title || 'Xpress Autozone'} />

            {/* Canonical Link */}
            {absoluteCanonical && <link rel="canonical" href={absoluteCanonical} />}

            {/* Mobile Optimized */}
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
            <meta name="theme-color" content="#EAB308" />

            {/* JSON-LD Structured Data */}
            {structuredData && (
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            )}
        </Helmet>
    );
};

export default SEO;
