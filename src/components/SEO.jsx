import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, image, url, type = 'website' }) => {
    const siteTitle = 'Kone Consult';
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    
    // Ensure image URL is absolute for social tags
    const absoluteImageUrl = image && (image.startsWith('http') ? image : `${window.location.origin}${image.startsWith('/') ? '' : '/'}${image}`);
    
    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            {absoluteImageUrl && <meta property="og:image" content={absoluteImageUrl} />}
            <meta property="og:url" content={url} />
            <meta property="og:type" content={type} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            {absoluteImageUrl && <meta name="twitter:image" content={absoluteImageUrl} />}
        </Helmet>
    );
};

export default SEO;
