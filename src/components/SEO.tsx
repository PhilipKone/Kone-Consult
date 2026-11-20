import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
}

const SITE_ORIGIN = 'https://consult.codkon.com';

const SEO: React.FC<SEOProps> = ({ title, description, image, url, type = 'website' }) => {
    const siteTitle = 'Kone Consult';
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;

    const fallbackPath = typeof window !== 'undefined' ? window.location.pathname : '/';
    const rawCanonical = url || `${SITE_ORIGIN}${fallbackPath}`;
    const canonicalUrl = rawCanonical.startsWith('http')
        ? rawCanonical
        : `${SITE_ORIGIN}${rawCanonical.startsWith('/') ? '' : '/'}${rawCanonical}`;

    const absoluteImageUrl =
        image && (image.startsWith('http') ? image : `${SITE_ORIGIN}${image.startsWith('/') ? '' : '/'}${image}`);

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <link rel="canonical" href={canonicalUrl} />
            {description && <meta name="description" content={description} />}
            <meta property="og:title" content={fullTitle} />
            {description && <meta property="og:description" content={description} />}
            {absoluteImageUrl && <meta property="og:image" content={absoluteImageUrl} />}
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:type" content={type} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={canonicalUrl} />
            <meta name="twitter:title" content={fullTitle} />
            {description && <meta name="twitter:description" content={description} />}
            {absoluteImageUrl && <meta name="twitter:image" content={absoluteImageUrl} />}
        </Helmet>
    );
};

export default SEO;