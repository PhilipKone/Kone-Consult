import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiCalendar, FiClock, FiShare2, FiLink, FiFacebook, FiInstagram } from 'react-icons/fi';
import { FaLinkedinIn, FaXTwitter, FaTiktok } from 'react-icons/fa6';
import { marked } from 'marked';
import './Blog.css';
import { pillarBlogs } from '../data/pillar_blogs';
import SEO from '../components/SEO';
import DOMPurify from 'dompurify';

const BlogPost = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [subscribed, setSubscribed] = useState(false);

    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const q = query(
                    collection(db, "blogs"), 
                    where("slug", "==", slug),
                    where("status", "==", "published")
                );
                const querySnapshot = await getDocs(q);
                if (querySnapshot.empty) {
                    // Check fallback pillar articles
                    const pillar = pillarBlogs.find(b => b.slug === slug);
                    if (pillar) {
                        setPost(pillar);
                        document.title = `${pillar.title} | KA Insights`;
                    } else {
                        setNotFound(true);
                    }
                } else {
                    const postData = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
                    setPost(postData);
                    document.title = `${postData.title} | KA Insights`;
                }
            } catch (error) {
                console.error("Error fetching post: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
        window.scrollTo(0, 0);
    }, [slug]);

    const shareOnSocial = (platform) => {
        const url = window.location.href;
        const title = post ? post.title : 'Check out this insight from Kone Academy';
        let shareUrl = '';

        if (platform === 'linkedin') {
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        } else if (platform === 'twitter') {
            shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        } else if (platform === 'facebook') {
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
            setIsShareModalOpen(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) return;
        setSubmitting(true);
        try {
            await addDoc(collection(db, 'subscribers'), {
                email,
                source: 'blog-post-cta',
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

    if (loading) {
        return (
            <div className="page-container d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading article...</span>
                </div>
            </div>
        );
    }

    if (notFound) {
        return (
            <div className="page-container text-center pt-10">
                <h1 className="text-white display-4">Article Not Found</h1>
                <p className="text-secondary pb-4">It seems this insight hasn't been published or moved elsewhere.</p>
                <Link to="/blog" className="btn btn-primary rounded-pill px-5">Back to Blog</Link>
            </div>
        );
    }

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt,
        "image": post.imageUrl,
        "author": {
            "@type": "Person",
            "name": post.author?.name || "KA Staff"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Kone Academy",
            "logo": {
                "@type": "ImageObject",
                "url": "https://kca.edu/logo.png" // Placeholder URL
            }
        },
        "datePublished": new Date((post.createdAt?.seconds || 0) * 1000).toISOString()
    };

    return (
        <div className="page-container position-relative overflow-hidden">
            <SEO 
                title={post.title}
                description={post.excerpt}
                image={post.imageUrl}
                url={window.location.href}
                type="article"
            />
            <script type="application/ld+json">
                {JSON.stringify(structuredData)}
            </script>
            <div className="page-background-glow" />

            {/* Post Header */}
            <header className="post-header container position-relative z-1 pt-5">
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-start mb-4"
                >
                    <Link to="/blog" className="btn btn-outline-secondary border-dark rounded-pill px-4 d-inline-flex align-items-center gap-2 group">
                        <FiArrowLeft className="transition-transform group-hover-translate-x-neg" /> Back to Insights
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <span className={`badge mb-3 px-3 py-2 category-${post.category ? post.category.toLowerCase() : 'unsorted'}`}>
                        {post.category || 'Insights'}
                    </span>
                    <h1 className="display-4 fw-bold text-white mb-4 lh-sm">{post.title}</h1>
                    
                    <div className="post-meta flex-wrap gap-4 justify-content-start border-bottom border-dark pb-4">
                        <div className="d-flex align-items-center gap-2">
                            <div className="blog-author-avatar" style={{ border: '1px solid currentColor' }}>
                                {post.author?.name?.charAt(0) || 'K'}
                            </div>
                            <span className="text-white small fw-bold">{post.author?.name || 'KA Staff'}</span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <FiCalendar className="opacity-50" />
                            <span>{new Date(post.createdAt?.seconds * 1000).toLocaleDateString()}</span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <FiClock className="opacity-50" />
                            <span>{post.readTime || 5} min read</span>
                        </div>
                    </div>
                </motion.div>
            </header>

            {/* Featured Image */}
            <motion.div 
                className="container-fluid px-0 px-md-5 mt-5"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
            >
                <div className="post-featured-image position-relative border border-dark border-opacity-10 shadow-2xl">
                    <img src={post.imageUrl || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80'} alt={post.title} />
                </div>
            </motion.div>

            {/* Article Content */}
            <article className="container py-5 position-relative z-1 mb-10">
                <div className="row">
                    <div className="col-lg-8 mx-auto">
                        <div 
                            className="post-content article-rich-text text-start text-secondary-bright"
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked.parse(post.content || '')) }}
                        />
                        
                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                            <div className="post-tags-container">
                                {post.tags.map(tag => (
                                    <span key={tag} className="glass-tag">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Elite Share Trigger */}
                        <div className="share-section-premium mt-10">
                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setIsShareModalOpen(true)}
                                className="share-trigger-capsule"
                            >
                                <div className="d-flex align-items-center gap-3">
                                    <div className="share-icon-wrapper">
                                        <FiShare2 size={18} />
                                    </div>
                                    <span className="share-text-label">SHARE INSIGHT</span>
                                </div>
                                <div className="share-preview-icons d-none d-md-flex align-items-center gap-2 ps-3 border-start border-white border-opacity-10">
                                    <FaLinkedinIn size={14} className="opacity-50" />
                                    <FaXTwitter size={14} className="opacity-50" />
                                    <FiLink size={14} className="opacity-50" />
                                </div>
                            </motion.button>
                        </div>
                    </div>
                </div>
            </article>

            {/* Premium Share Modal */}
            <AnimatePresence>
                {isShareModalOpen && (
                    <div className="share-modal-overlay">
                        <motion.div 
                            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                            animate={{ opacity: 1, backdropFilter: 'blur(10px)' }}
                            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                            className="share-modal-backdrop"
                            onClick={() => setIsShareModalOpen(false)}
                        />
                        <motion.div 
                            initial={{ opacity: 0, y: 100, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 100, scale: 0.95 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="share-modal-content glass-hub"
                        >
                            <div className="share-modal-header mb-4">
                                <h4 className="text-white fw-bold m-0">Spread the Insight</h4>
                                <button className="btn-close-premium" onClick={() => setIsShareModalOpen(false)}>&times;</button>
                            </div>

                            <div className="share-grid mb-5">
                                <motion.button whileHover={{ y: -5 }} onClick={() => shareOnSocial('linkedin')} className="share-item linkedin">
                                    <div className="icon-circle"><FaLinkedinIn size={24} /></div>
                                    <span>LinkedIn</span>
                                </motion.button>
                                <motion.button whileHover={{ y: -5 }} onClick={() => shareOnSocial('twitter')} className="share-item twitter">
                                    <div className="icon-circle"><FaXTwitter size={24} /></div>
                                    <span>X / Twitter</span>
                                </motion.button>
                                <motion.button whileHover={{ y: -5 }} onClick={() => shareOnSocial('facebook')} className="share-item facebook">
                                    <div className="icon-circle"><FiFacebook size={24} /></div>
                                    <span>Facebook</span>
                                </motion.button>
                                <motion.a href="https://www.instagram.com/koneacademy" target="_blank" rel="noreferrer" whileHover={{ y: -5 }} className="share-item instagram">
                                    <div className="icon-circle"><FiInstagram size={24} /></div>
                                    <span>Instagram</span>
                                </motion.a>
                                <motion.a href="https://www.tiktok.com/@koneacademy" target="_blank" rel="noreferrer" whileHover={{ y: -5 }} className="share-item tiktok">
                                    <div className="icon-circle"><FaTiktok size={24} /></div>
                                    <span>TikTok</span>
                                </motion.a>
                            </div>

                            <div className="share-copy-area">
                                <div className="copy-field">
                                    <input type="text" readOnly value={window.location.href} className="copy-input" />
                                    <button 
                                        className={`copy-btn ${copied ? 'success' : ''}`} 
                                        onClick={copyToClipboard}
                                    >
                                        {copied ? 'COPIED!' : 'COPY'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Bottom CTA */}
            <div className="bg-dark bg-opacity-25 py-10 border-top border-dark position-relative overflow-hidden">
                <div className="page-background-glow" style={{ top: 'auto', bottom: '-50%' }} />
                <div className="container text-center position-relative z-1">
                    <h2 className="display-6 fw-bold text-white mb-4">Want more insights from KA?</h2>
                    <p className="lead text-secondary opacity-75 mb-5 mx-auto" style={{ maxWidth: '600px' }}>
                        Join our newsletter to receive the latest updates on science, coding, and engineering right in your inbox.
                    </p>
                    
                    {subscribed ? (
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="glass-panel p-4 d-inline-block rounded-pill border-success border-opacity-25"
                        >
                            <span className="text-success fw-bold">✓ Thanks for joining the Kone Academy community!</span>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubscribe} className="max-w-500 mx-auto d-flex gap-2 p-2 glass-panel rounded-pill">
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-control-dark border-0 bg-transparent flex-grow-1 ps-4" 
                                placeholder="Enter your email" 
                                disabled={submitting}
                            />
                            <button 
                                type="submit" 
                                className="btn btn-primary rounded-pill px-4 py-2"
                                disabled={submitting}
                            >
                                {submitting ? '...' : 'Join Today'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlogPost;
