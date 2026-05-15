/**
 * Resolves an asset path to a full URL, taking into account the Vite base path.
 * 
 * @param {string} path - The asset path to resolve (e.g., 'assets/blog/image.webp' or '/assets/blog/image.webp')
 * @returns {string} The resolved URL
 */
export const resolveAssetPath = (path) => {
    if (!path) return '';
    
    // If it's a full URL, check if it's our own domain first
    const prodDomain = 'https://consult.koneacademy.io';
    let processedPath = path;
    if (path.startsWith(prodDomain)) {
        processedPath = path.substring(prodDomain.length);
    }

    // If it's still a full URL from another domain, return it
    if (processedPath.startsWith('http://') || processedPath.startsWith('https://') || processedPath.startsWith('data:')) {
        return processedPath;
    }
    
    // Get the base URL from Vite (defaults to / in dev, or whatever is set in vite.config.ts)
    const base = import.meta.env.BASE_URL || '/';
    
    // Clean the path (remove leading slash if present)
    let cleanPath = processedPath.startsWith('/') ? processedPath.substring(1) : processedPath;

    // Extension normalization: prefer .webp for blog assets
    if (cleanPath.startsWith('assets/blog/') && cleanPath.endsWith('.png')) {
        cleanPath = cleanPath.replace(/\.png$/, '.webp');
    }
    
    // If base is './', we handle it specially for relative path safety
    if (base === './') {
        // If we are at the root, ./ is fine. If we are deep, we might need ../
        // But usually Vite handles ./ at build time by prepending the correct relative depth.
        // For dynamic strings, we can't easily do ../ safely without knowing the current route depth.
        // However, most modern hosting (including GH Pages with SPAs) works better with absolute-relative paths.
        
        // Let's assume absolute-relative /path is better if we know the base.
        // But since we used base: './' in vite.config, Vite will try to make everything relative.
        
        // Actually, the safest way for SPAs is to use the absolute path from the domain root
        // OR the relative path if the SPA is simple.
        
        // Given we are using React Router, absolute-relative is much safer.
        return '/' + cleanPath;
    }
    
    // Ensure base ends with a slash and combine
    const normalizedBase = base.endsWith('/') ? base : base + '/';
    return normalizedBase + cleanPath;
};
