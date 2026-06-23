/**
 * Sanitizes an email address for mailto: links.
 * Returns the email if valid, or an empty string if invalid.
 */
export function sanitizeMailto(email) {
    if (!email) return '';
    // Standard email validation regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        return '';
    }
    return email;
}

/**
 * Sanitizes a URL to prevent javascript: or other malicious schemes.
 * Returns the sanitized URL or an empty string.
 */
export function sanitizeUrl(url) {
    if (!url) return '';
    // Strip control characters and whitespaces to prevent bypasses like " java\nscript:"
    const cleanUrl = url.replace(/[\x00-\x20\s]/g, '');
    // Check against dangerous schemes using regex
    if (/^(javascript|data|vbscript):/i.test(cleanUrl)) {
        return '';
    }
    return url;
}
