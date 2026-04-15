// In-memory cache to eliminate Firebase network latency between page navigations.
// Stores collection snapshots locally.

export const globalCache = {
    aboutEntries: null,
    docs: null,
    templates: null,
    services: null,
    training: null,
    portfolio: null,
    blogs: null
};
