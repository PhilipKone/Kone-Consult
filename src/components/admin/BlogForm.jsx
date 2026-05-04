import React, { useState, useEffect } from 'react';
import { FiSave, FiX, FiImage, FiClock, FiTag, FiBookOpen, FiUser, FiZap, FiGlobe, FiActivity } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const BlogForm = ({ blog, onSave, onCancel, defaultCategory }) => {
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category: defaultCategory || 'Code',
        tags: '',
        imageUrl: '',
        seed: '',
        status: 'draft',
        readTime: 5,
        author: {
            name: 'KA Editorial',
            role: 'Academy Staff',
            avatar: ''
        },
        publishedAt: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        if (blog) {
            setFormData(prev => ({
                ...prev,
                ...blog,
                tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : (blog.tags || ''),
                author: {
                    ...prev.author,
                    ...(blog.author || {})
                },
                publishedAt: blog.createdAt?.seconds 
                    ? new Date(blog.createdAt.seconds * 1000).toISOString().split('T')[0]
                    : (blog.publishedAt || prev.publishedAt)
            }));
        }
    }, [blog]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        // Auto-generate slug from title if it's new
        if (name === 'title' && !blog) {
            const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            setFormData(prev => ({ ...prev, slug }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Normalize the imageUrl before saving to database
        const normalizedData = { ...formData };
        // Use full URLs (links) to ensure stability online
        if (normalizedData.imageUrl && !normalizedData.imageUrl.includes('://')) {
            // Support local paths as fallback but prioritize root structure
            normalizedData.imageUrl = `/${normalizedData.imageUrl.replace(/^(public\/|src\/assets\/blog\/|src\/assets\/)/, '').replace(/^\//, '')}`;
        }
        
        onSave(normalizedData);
    };

    return (
        <AnimatePresence>
            <div className="modal-overlay">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 30 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 30 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="modal-content-custom overflow-hidden"
                    style={{ maxWidth: '1100px', padding: '0' }}
                >
                    {/* Header */}
                    <div className="p-4 border-bottom border-white border-opacity-10 d-flex justify-content-between align-items-center bg-dark bg-opacity-40 backdrop-blur">
                        <div className="d-flex align-items-center gap-3">
                            <div className="glass-icon-container" style={{ background: 'rgba(88, 166, 255, 0.1)', color: '#58a6ff' }}>
                                <FiBookOpen size={20} />
                            </div>
                            <div>
                                <h4 className="m-0 text-white fw-bold" style={{ letterSpacing: '-0.02em' }}>{blog ? 'Edit Insight' : 'Create New Insight'}</h4>
                                <p className="text-secondary small mb-0 opacity-60">Precision content management for Kone Academy</p>
                            </div>
                        </div>
                        <button onClick={onCancel} className="btn-close-custom hover-scale transition-all">
                            <FiX size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-4 bg-dark bg-opacity-20">
                        <div className="row g-4 max-h-600 overflow-auto pe-2 custom-scrollbar">
                            {/* Main Info */}
                            <div className="col-md-8">
                                <div className="mb-4">
                                    <label className="label-premium">ARTICLE TITLE</label>
                                    <input
                                        type="text"
                                        name="title"
                                        className="input-premium fs-5 fw-bold"
                                        style={{ borderLeft: '4px solid var(--accent-primary)' }}
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                        placeholder="Engineering a Sustainable Future..."
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="label-premium">EXCERPT (SHORT SUMMARY)</label>
                                    <textarea
                                        name="excerpt"
                                        className="input-premium"
                                        rows="2"
                                        value={formData.excerpt}
                                        onChange={handleChange}
                                        placeholder="A concise summary to capture attention in the feed..."
                                    ></textarea>
                                </div>

                                <div className="mb-4">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <label className="label-premium m-0">ARTICLE CONTENT (MARKDOWN/HTML)</label>
                                        <div className="d-flex gap-2">
                                            <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-20 rounded-pill px-3 py-1 small">Editor Active</span>
                                            <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-20 rounded-pill px-3 py-1 small">HTML Enabled</span>
                                        </div>
                                    </div>
                                    <textarea
                                        name="content"
                                        className="textarea-premium font-monospace"
                                        value={formData.content}
                                        onChange={handleChange}
                                        required
                                        placeholder="# Start writing your masterpiece..."
                                    ></textarea>
                                </div>
                            </div>

                            {/* Sidebar Info */}
                            <div className="col-md-4">
                                <div className="sidebar-glass-panel">
                                    <div className="mb-4">
                                        <label className="label-premium d-flex align-items-center gap-2">
                                            <FiActivity size={14} /> DIVISION
                                        </label>
                                        <select
                                            name="category"
                                            className="input-premium select-premium"
                                            value={formData.category}
                                            onChange={handleChange}
                                        >
                                            <option value="Consult">Kone Consult (Research)</option>
                                            <option value="Code">Kone Code (Coding)</option>
                                            <option value="Lab">Kone Lab (Engineering)</option>
                                            <option value="Academy">Kone Academy (Global)</option>
                                        </select>
                                    </div>

                                    <div className="mb-4">
                                        <label className="label-premium d-flex align-items-center gap-2">
                                            <FiGlobe size={14} /> URL SLUG
                                        </label>
                                        <input
                                            type="text"
                                            name="slug"
                                            className="input-premium py-2 small font-monospace"
                                            value={formData.slug}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="label-premium d-flex align-items-center gap-2">
                                            <FiImage size={14} /> FEATURED IMAGE
                                        </label>
                                        <input
                                            type="text"
                                            name="imageUrl"
                                            className="input-premium py-2 small"
                                            value={formData.imageUrl}
                                            onChange={handleChange}
                                            placeholder="Paste GitHub Raw URL or Unsplash Link..."
                                        />
                                        {formData.imageUrl && (
                                            <div className="mt-3 image-preview-premium" style={{ height: '140px' }}>
                                                <img 
                                                    src={formData.imageUrl.includes('://') ? formData.imageUrl : `/${formData.imageUrl.replace(/^(public\/|src\/assets\/blog\/|src\/assets\/)/, '').replace(/^\//, '')}`} 
                                                    alt="Preview" 
                                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x200?text=Image+Not+Found'; }}
                                                />
                                                <div className="image-preview-overlay">ASSET PREVIEW</div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-4">
                                        <label className="label-premium d-flex align-items-center gap-2">
                                            <FiZap size={14} /> CONTENT SEED
                                        </label>
                                        <input
                                            type="text"
                                            name="seed"
                                            className="input-premium py-2 small"
                                            value={formData.seed || ''}
                                            onChange={handleChange}
                                            placeholder="e.g. neuro-link-72"
                                        />
                                        <p className="text-secondary smaller mt-2 opacity-50 fst-italic">Forces deterministic AI generation if linked.</p>
                                    </div>

                                    <div className="row g-2 mb-4">
                                        <div className="col-6">
                                            <label className="label-premium d-flex align-items-center gap-2">
                                                <FiClock size={14} /> READ TIME
                                            </label>
                                            <input
                                                type="number"
                                                name="readTime"
                                                className="input-premium py-2"
                                                value={formData.readTime}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="col-6">
                                            <label className="label-premium">STATUS</label>
                                            <select
                                                name="status"
                                                className="input-premium select-premium py-2"
                                                value={formData.status}
                                                onChange={handleChange}
                                            >
                                                <option value="draft">Draft</option>
                                                <option value="published">Published</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="label-premium d-flex align-items-center gap-2">
                                            <FiTag size={14} /> TAGS
                                        </label>
                                        <input
                                            type="text"
                                            name="tags"
                                            className="input-premium py-2 small"
                                            value={formData.tags}
                                            onChange={handleChange}
                                            placeholder="AI, Robotics, UX..."
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="label-premium d-flex align-items-center gap-2">
                                            <FiUser size={14} /> AUTHOR
                                        </label>
                                        <input
                                            type="text"
                                            name="author.name"
                                            className="input-premium py-2 small mb-2"
                                            value={formData.author.name}
                                            onChange={handleChange}
                                            placeholder="Author Name"
                                        />
                                        <input
                                            type="text"
                                            name="author.role"
                                            className="input-premium py-2 smaller"
                                            value={formData.author.role}
                                            onChange={handleChange}
                                            placeholder="Author Role / Title"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="label-premium d-flex align-items-center gap-2">
                                            <FiClock size={14} /> PUBLICATION DATE
                                        </label>
                                        <input
                                            type="date"
                                            name="publishedAt"
                                            className="input-premium py-2 small"
                                            value={formData.publishedAt}
                                            onChange={handleChange}
                                        />
                                        <p className="text-secondary smaller mt-2 opacity-50 fst-italic">Sets the temporal authority for social discovery.</p>
                                    </div>

                                    <div className="mt-4">
                                        <button type="submit" className="btn btn-primary w-100 py-3 fw-bold rounded-pill shadow-lg hover-scale transition-all d-flex align-items-center justify-content-center gap-2">
                                            <FiSave size={18} /> {blog ? 'Update Article' : 'Publish Vision'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default BlogForm;
