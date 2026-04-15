import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiSearch, FiClock } from 'react-icons/fi';
import './Blog.css';
import { pillarBlogs } from '../data/pillar_blogs';
import { globalCache } from '../utils/cache';

const Blog = () => {
    const [blogs, setBlogs] = useState(globalCache.blogs || []);
    const [loading, setLoading] = useState(!globalCache.blogs);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [subscribed, setSubscribed] = useState(false);

    useEffect(() => {
        document.title = "Insights | Kone Academy Engineering & Research";
        
        // SEO: Meta Tags
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', 'Deep-dives into Scaling Agentic Architectures, Physical Engineering simulations, and Data-Driven Consulting at Kone Academy.');
        }

        const fetchBlogs = async () => {
            try {
                const q = query(
                    collection(db, "blogs"), 
                    where("status", "==", "published")
                );
                const querySnapshot = await getDocs(q);
                const blogsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // Merge with fallback pillar articles from The Agency
                const mergedBlogs = [...blogsData];
                pillarBlogs.forEach(pillar => {
                    if (!mergedBlogs.some(b => b.slug === pillar.slug)) {
                        mergedBlogs.push(pillar);
                    }
                });

                const finalSorted = mergedBlogs.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
                globalCache.blogs = finalSorted;
                setBlogs(finalSorted);
            } catch (error) {
                console.error("Error fetching blogs: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) return;
        setSubmitting(true);
        try {
            await addDoc(collection(db, 'subscribers'), {
                email,
                source: 'blog-main-cta',
                createdAt: serverTimestamp()
            });
            setSubscribed(true);
            setEmail('');
        } catch (error) {
            console.error("Subscription error:", error);
            alert("Failed to join. Please try again later.");
        } finally {
            setSubmitting(false);
        }
    };

    const filteredBlogs = blogs.filter(blog => {
        const matchesSearch = (blog.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
                             (blog.excerpt?.toLowerCase() || '').includes(searchQuery.toLowerCase());
        
        const blogCat = blog.category?.toLowerCase() || '';
        const filterCat = activeFilter.toLowerCase();
        
        const matchesCategory = filterCat === 'all' || blogCat === filterCat;
        return matchesSearch && matchesCategory;
    });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <div className="page-container position-relative overflow-hidden" style={{ paddingTop: '100px' }}>
            <div className="page-background-glow" />
            
            {/* Header / Intro */}
            <header className="container text-center py-5 position-relative z-1">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="badge mb-4 px-3 py-2 bg-primary bg-opacity-10 text-primary border border-primary border-opacity-20 rounded-pill">
                        INSIGHTS & ARTICLES
                    </span>
                    <h1 className="display-3 fw-bold text-gradient mb-3">KA Perspectives</h1>
                    <p className="lead text-secondary mx-auto mb-4 text-center" style={{ maxWidth: '700px' }}>
                        Exploring the boundaries of Scientific Research, Advanced Coding, and Physical Engineering.
                    </p>
                </motion.div>

                {/* Minimalist "Box-Free" Search & Filter HUD */}
                <motion.div 
                    className="sticky-blog-hud"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    style={{ top: '75px', zIndex: 900 }}
                >
                    <div className="max-w-900 mx-auto px-4 py-3 py-md-4">
                        {/* 1. Floating Search Command */}
                        <div className="d-flex align-items-center justify-content-center mb-4 mb-md-5" style={{ position: 'relative' }}>
                            <div className="d-flex align-items-center w-100 max-w-600" style={{ position: 'relative' }}>
                                <FiSearch className="text-secondary opacity-50 ms-3 position-absolute" size={22} style={{ pointerEvents: 'none', left: '15px' }} />
                                <input 
                                    type="search" 
                                    className="form-control-dark border-0 bg-transparent flex-grow-1 ps-5 pe-3 py-3" 
                                    placeholder="Search our insights..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{ 
                                        boxShadow: 'none', 
                                        fontSize: '1.25rem', 
                                        outline: 'none',
                                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                                        borderRadius: '0',
                                        transition: 'all 0.4s ease'
                                    }}
                                />
                            </div>
                        </div>

                        {/* 2. Standalone Elite Filter Ribbon */}
                        <div className="d-flex justify-content-center">
                            <div className="nav-tabs-premium">
                                {/* KA Search Hash: 1775333100 */}
                                {['All', 'Consult', 'Code', 'Lab'].map(cat => (
                                    <motion.button
                                        key={cat}
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setActiveFilter(cat)}
                                        className={`tab-btn-premium ${activeFilter === cat ? 'active' : ''}`}
                                    >
                                        {cat === 'All' ? 'Everything' : cat}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </header>

            {/* Blog Grid */}
            <main className="container pb-5 position-relative z-1">
                {loading ? (
                    <div className="d-flex justify-content-center py-10">
                        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                            <span className="visually-hidden">Loading insights...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        {filteredBlogs.length > 0 ? (
                            <motion.div 
                                className="blog-grid"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                <AnimatePresence mode="popLayout">
                                    {filteredBlogs.map(blog => (
                                        <motion.article 
                                            key={blog.id} 
                                            className="blog-card"
                                            variants={itemVariants}
                                            layout
                                            initial="hidden"
                                            animate="visible"
                                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                        >
                                            <div className="blog-card-image">
                                            {blog.category && (
                                                <span className={`blog-category-badge category-${blog.category.toLowerCase()}`}>
                                                    {blog.category}
                                                </span>
                                            )}
                                            <img src={blog.imageUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80'} alt={blog.title} />
                                        </div>
                                        <div className="blog-card-content">
                                            <div className="d-flex align-items-center gap-2 mb-3 text-secondary" style={{ fontSize: '0.75rem' }}>
                                                <FiClock size={12} className="opacity-50" />
                                                <span className="opacity-75">{blog.readTime || 5} min read</span>
                                                <span className="opacity-25">•</span>
                                                <span className="opacity-75">{new Date(blog.createdAt?.seconds * 1000).toLocaleDateString()}</span>
                                            </div>
                                            <h3 className="blog-card-title">{blog.title}</h3>
                                            <p className="blog-card-excerpt">{blog.excerpt}</p>
                                            
                                            <Link to={`/blog/${blog.slug}`} className="blog-card-footer text-decoration-none group mt-auto">
                                                <div className="blog-author">
                                                    <div className="blog-author-avatar">
                                                        {blog.author?.name?.charAt(0) || 'K'}
                                                    </div>
                                                    <div className="blog-author-info">
                                                        <span>{blog.author?.name || 'KA Staff'}</span>
                                                    </div>
                                                </div>
                                                <div className="text-primary d-flex align-items-center gap-2 small fw-bold">
                                                    Read More <FiArrowRight className="transition-transform group-hover-translate-x" />
                                                </div>
                                            </Link>
                                        </div>
                                    </motion.article>
                                ))}
                                </AnimatePresence>
                            </motion.div>
                        ) : (
                            <div className="text-center py-10 opacity-50">
                                <h3 className="h4 text-white mb-3">No articles found matching your criteria.</h3>
                                <p>Try adjusting your search or category filters.</p>
                                <button onClick={() => { setSearchQuery(''); setActiveFilter('All'); }} className="btn btn-outline-primary rounded-pill mt-3">
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Bottom CTA */}
            <div className="bg-dark bg-opacity-25 py-10 border-top border-dark position-relative overflow-hidden mt-5">
                <div className="page-background-glow" style={{ top: 'auto', bottom: '-50%' }} />
                <div className="container text-center position-relative z-1">
                    <h2 className="display-6 fw-bold text-white mb-4">Join the Engineering Digest</h2>
                    <p className="lead text-secondary opacity-75 mb-4 mx-auto" style={{ maxWidth: '600px' }}>
                        No fluff. Just deep-tech insights on scaling AI agents and physical engineering. Delivered weekly.
                    </p>
                    
                    {subscribed ? (
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="glass-panel p-4 d-inline-block rounded-pill border-success border-opacity-25"
                        >
                            <span className="text-success fw-bold">✓ Success! Welcome to the KA community.</span>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubscribe} className="max-w-500 mx-auto d-flex align-items-center gap-2 p-2 ps-5 pe-3 glass-panel rounded-pill">
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-control-dark border-0 bg-transparent flex-grow-1 ps-4 py-2" 
                                placeholder="Enter your email" 
                                disabled={submitting}
                            />
                            <button 
                                type="submit" 
                                className="btn btn-primary rounded-pill px-4 py-2"
                                disabled={submitting}
                            >
                                {submitting ? '...' : 'Subscribe'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Blog;
